const { ccclass, property } = cc._decorator;
import GridCell from "./GridCell";
import ConfigExtern from "../ConfigExtern";
import DataTransformer from "../Points/DataTrasformer";
import Wall from "../Walls/Wall";
import BornBlock from "../Walls/BornBlock";

@ccclass
export default class GridManager extends cc.Component //这里是gridmanager，专门用于管理格子的数据结构，同时提供路径等方案
{
    // 单例
    private static _instance: GridManager = null!;

    public static get Instance(): GridManager {
        return this._instance;
    }

    private grid: GridCell[][] = [];//二维数组用于储存GridCell
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

    onLoad()//
    {
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
                    if (x == 19 && y == 0) { continue; }
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

        if (this.isWalkable(x + 1, y))
            result.push(this.grid[y][x + 1]);

        if (this.isWalkable(x - 1, y))
            result.push(this.grid[y][x - 1]);

        if (this.isWalkable(x, y + 1))
            result.push(this.grid[y + 1][x]);

        if (this.isWalkable(x, y - 1))
            result.push(this.grid[y - 1][x]);

        return result;
    }
}