const { ccclass, property } = cc._decorator;
import GridCell from "./GridCell";
import ConfigExtern from "../ConfigExtern";
import DataTransformer from "../Points/DataTrasformer";
import Wall from "../Walls/Wall";
import BornBlock from "../Walls/BornBlock";
import DrawTool from "./DrawTool";
import EventBus from "../EventBus";

@ccclass
export default class GridManager extends cc.Component //这里是gridmanager，专门用于管理格子的数据结构，同时提供路径等方案
{
    // 单例
    private static _instance: GridManager = null!;
    public static get Instance(): GridManager {
        return this._instance;
    }
    private grid: GridCell[][] = [];//二维数组用于储存GridCell
    private bbs: BornBlock[] = [];//副本，用于寻路
    private endCell: GridCell | null = null;
    private ids: number = 0;
    @property(cc.Prefab)
    private wallPrefab: cc.Prefab | null = null;
    @property(cc.Prefab)
    private bornPrefab: cc.Prefab | null = null;// 让BornPosition去拿引用来进行路线的判定
    @property(cc.Prefab)
    private endPrefab: cc.Prefab | null = null;
    private mapData: [number, number][][] =
        Array.from(
            { length: ConfigExtern.MAP_HEIGHT },
            () =>
                Array.from(
                    { length: ConfigExtern.MAP_WIDTH },
                    () => [0, 0] as [number, number]
                )
        );
    private result: cc.Vec2[] = [];
    private preX: number = 0;
    private preY: number = 0;
    private walls: Wall[] = [];//小对象池，四个wall，用于占位

    onLoad()//
    {
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 单例初始化
        if (GridManager._instance && GridManager._instance !== this) {
            this.node.destroy();
            return;
        }

        GridManager._instance = this;

        this.ids = 0;
        this.initGrid();
        this.mapData = DataTransformer.GetMapData();
        this.initScene();

        for (let i = 0; i < 4; i++) {
            this.result.push(cc.v2());
            let wall: Wall = new Wall();
            this.walls.push(wall);
        }
    }

    private initGrid() //初始化数据结构
    {
        for (let y = 0; y < ConfigExtern.MAP_HEIGHT; y++) {
            this.grid[y] = [];
            for (let x = 0; x < ConfigExtern.MAP_WIDTH; x++) {
                this.grid[y][x] = new GridCell(x, y);
            }
        }
    }

    private initScene() // 向场景中初始化内容
    {
        if (!this.mapData) return;

        for (let y = 0; y < ConfigExtern.MAP_HEIGHT; y++) {
            for (let x = 0; x < ConfigExtern.MAP_WIDTH; x++) {

                //先只初始化方块
                let blockType;
                blockType = this.mapData[y][x][0];

                if (blockType == 0)//0代表无
                {
                    continue;
                }
                else if (blockType == 1)//1代表wall
                {
                    if (!this.wallPrefab) continue;
                    const wallNode = cc.instantiate(this.wallPrefab!) as cc.Node;
                    wallNode.parent = this.node;
                    wallNode.zIndex = -this.grid[y][x].getX - this.grid[y][x].getY * ConfigExtern.MAP_WIDTH;
                    wallNode.setPosition(this.GridToWorld(this.grid[y][x]));
                    const wall = wallNode.getComponent(Wall);
                    wall?.setCell(this.grid[y][x]);
                }
                else if (blockType == 2)//2代表终点
                {
                    if (!this.endPrefab) continue;
                    this.endCell = this.grid[y][x];
                    const endNode = cc.instantiate(this.endPrefab!) as cc.Node;
                    endNode.parent = this.node;
                    endNode.setPosition(this.GridToWorld(this.grid[y][x]));
                }
                else if (blockType == 3)//3 代表出生点
                {
                    const bornNode = cc.instantiate(this.bornPrefab!) as cc.Node;
                    bornNode.parent = this.node;
                    bornNode.zIndex = -this.grid[y][x].getX - this.grid[y][x].getY * ConfigExtern.MAP_WIDTH;
                    bornNode.setPosition(this.GridToWorld(this.grid[y][x]));
                    const bornCell = bornNode.getComponentInChildren(BornBlock);
                    this.bbs.push(bornCell);

                    if (bornCell) {
                        bornCell.setCell(this.grid[y][x]);
                        bornCell.setId(this.ids);
                        this.ids++;
                    }
                    else {
                        cc.error("BornBlock组件不存在");
                    }
                }
            }
        }
    }

    public getCell(x: number, y: number): GridCell {
        return this.grid[y][x];
    }

    public GridToWorld(cell: GridCell): cc.Vec2 {

        const offset =
            (ConfigExtern.WALL_SIZE - ConfigExtern.GRID_SIZE) * 0.5;

        const halfMapWidth =
            ConfigExtern.MAP_WIDTH * ConfigExtern.GRID_SIZE * 0.5;

        const halfMapHeight =
            ConfigExtern.MAP_HEIGHT * ConfigExtern.GRID_SIZE * 0.5;

        return cc.v2(

            cell.getX * ConfigExtern.GRID_SIZE
            + ConfigExtern.GRID_SIZE * 0.5
            + offset
            - halfMapWidth,

            cell.getY * ConfigExtern.GRID_SIZE
            + ConfigExtern.GRID_SIZE * 0.5
            + offset
            - halfMapHeight
        );
    }

    public get getMap(): GridCell[][] {
        return this.grid;
    }
    public get getendCell(): GridCell {
        if (this.endCell)
            return this.endCell;
        return new GridCell(-1, -1);
    }
    public isWalkable(x: number, y: number): boolean {
        // 越界

        if (
            x < 0 ||
            x >= ConfigExtern.MAP_WIDTH ||
            y < 0 ||
            y >= ConfigExtern.MAP_HEIGHT
        ) {
            return false;
        }

        let cell = this.grid[y][x];

        if (cell === this.endCell)
            return true;
        return cell.isEmpty;
    }
    public getNeighbors(cell: GridCell): GridCell[] {
        const result: GridCell[] = [];

        const x = cell.getX;
        const y = cell.getY;
        const dirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        for (const dir of dirs) {

            const nx = x + dir[0];
            const ny = y + dir[1];

            if (
                nx < 0 ||
                nx >= ConfigExtern.MAP_WIDTH ||
                ny < 0 ||
                ny >= ConfigExtern.MAP_HEIGHT
            )
                continue;
            if (this.isWalkable(nx, ny))
                result.push(this.grid[ny][nx]);
        }

        return result;
    }
    public WorldToGrid(world: cc.Vec2): GridCell | null {
        const offset =
            (ConfigExtern.WALL_SIZE - ConfigExtern.GRID_SIZE) * 0.5;

        const halfMapWidth =
            ConfigExtern.MAP_WIDTH * ConfigExtern.GRID_SIZE * 0.5;

        const halfMapHeight =
            ConfigExtern.MAP_HEIGHT * ConfigExtern.GRID_SIZE * 0.5;

        const x = Math.floor(
            (world.x + halfMapWidth - offset)
            / ConfigExtern.GRID_SIZE
        );

        const y = Math.floor(
            (world.y + halfMapHeight - offset)
            / ConfigExtern.GRID_SIZE
        );

        if (
            x < 0 ||
            x >= ConfigExtern.MAP_WIDTH ||
            y < 0 ||
            y >= ConfigExtern.MAP_HEIGHT
        ) {
            return null;
        }

        return this.grid[y][x];
    }


    public posToBlock(mousePosition: cc.Vec3, blocks: cc.Vec2[]): cc.Vec2[]//这里选择传入的是鼠标位置和整个格子的相对路径，返回的是坐标 
    {//首先根据求余取得当前格子[yMax = 14][xMax = 19]
        const x = Math.floor(mousePosition.x / 64);
        const y = Math.floor(mousePosition.y / 64);

        for (let i = 0; i < blocks.length; i++) {
            this.result[i].x = blocks[i].x + x;
            this.result[i].y = blocks[i].y + y;
        }
        if (x != this.preX || y != this.preY)//如果格子发生了变化，才会search
        {
            this.preX = x;
            this.preY = y;
            this.search(this.result);
        }
        return this.result;
    }
    public clearBlocks(blocks: cc.Vec2[]) {
        for (let i = 0; i < blocks.length; i++) {
            if (this.inMap(blocks[i].x, blocks[i].y)) {
                if (this.grid[blocks[i].y][blocks[i].x].getTemporary) {
                    this.grid[blocks[i].y][blocks[i].x].removeBlock();
                    this.grid[blocks[i].y][blocks[i].x].setTemporary(false);
                }
            }
        }
    }
    public addBlocks(blocks: cc.Vec2[]) {
        for (let i = 0; i < blocks.length; i++) {
            if (this.inMap(blocks[i].x, blocks[i].y)) {
                if (!this.grid[blocks[i].y][blocks[i].x].getTemporary && this.grid[blocks[i].y][blocks[i].x].isEmpty) {
                    this.grid[blocks[i].y][blocks[i].x].setBlock(this.walls[i]);
                    this.grid[blocks[i].y][blocks[i].x].setTemporary(true);
                }
            }
        }
    }
    public getNotClog(blocks: cc.Vec2[]): boolean {
        for (let i = 0; i < blocks.length; i++) {
            const x = blocks[i].x;
            const y = blocks[i].y;

            if (!this.inMap(x, y)) {
                return false;
            }

            if (!this.grid[y][x].isEmpty) {
                return false;
            }
        }

        return true;
    }
    public search(blocks: cc.Vec2[]) {
        let notClog = this.getNotClog(blocks);
        this.addBlocks(blocks);
        BornBlock.canGoending = true;
        if (notClog) {
            for (let it of this.bbs) {
                it.canGoend();
            }
            this.clearBlocks(blocks);
        } else {
            this.clearBlocks(blocks);
            for (let it of this.bbs) {
                it.canGoend();
            }
        }
        DrawTool.Instance.draw(blocks, notClog);
    }
    public cancle() {
        this.clearBlocks(this.result);
        DrawTool.Instance.clear();
    }
    public ensure() {
        let notClog = this.getNotClog(this.result);
        if (!(BornBlock.canGoending && notClog)) { return; }
        DrawTool.Instance.clear();
        for (let i = 0; i < this.result.length; i++) {
            if (this.inMap(this.result[i].x, this.result[i].y)) {
                if (this.grid[this.result[i].y][this.result[i].x].isEmpty) {
                    this.grid[this.result[i].y][this.result[i].x].setBlock(new Wall());
                    this.grid[this.result[i].y][this.result[i].x].setTemporary(false);
                    const wallNode = cc.instantiate(this.wallPrefab!) as cc.Node;
                    wallNode.parent = this.node;
                    wallNode.zIndex = -this.grid[this.result[i].y][this.result[i].x].getX - this.grid[this.result[i].y][this.result[i].x].getY * ConfigExtern.MAP_WIDTH;
                    wallNode.setPosition(this.GridToWorld(this.grid[this.result[i].y][this.result[i].x]));
                    const wall = wallNode.getComponent(Wall);
                    wall?.setCell(this.grid[this.result[i].y][this.result[i].x]);
                }
            }
        }
        EventBus.Instance.emit("destoryCard");

    }
    private inMap(x: number, y: number): boolean {
        return x >= 0 &&
            x < ConfigExtern.MAP_WIDTH &&
            y >= 0 &&
            y < ConfigExtern.MAP_HEIGHT;
    }
}