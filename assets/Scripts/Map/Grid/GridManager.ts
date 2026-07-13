const { ccclass, property } = cc._decorator;

import ConfigExtern from "../../ConfigExtern";
import DataTransformer from "../../Tool/DataTrasformer";

import GridCell from "./GridCell";
import GridData from "./GridData";
import GridView from "./GridView";
import GridPlaceLogic from "./GridPlaceLogic";

import EventBus from "../../EventBus";
import { GameStatus } from "../../Game/StatusManager";

import BornBlock from "../Blocks/BornBlock";
import Wall from "../Blocks/Wall";


@ccclass
export default class GridManager extends cc.Component {
    private static _instance: GridManager | null = null;
    public static get Instance() {
        return this._instance!;
    }
    @property(GridView)
    private gridView: GridView | null = null;
    private gridData: GridData | null = null;
    private placeLogic: GridPlaceLogic | null = null;
    private mapData: [number, number][][] = [];
    private ids: number = 0;

    protected onLoad() {
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        if (GridManager._instance && GridManager._instance !== this) {
            this.node.destroy();
            return;
        }
        GridManager._instance = this;
        this.gridData = new GridData();
        this.gridData.initGrid();
        if (!this.gridView) { this.gridView = this.getComponent(GridView); }
        this.mapData = DataTransformer.GetMapData();
        this.placeLogic = new GridPlaceLogic(this.gridData, this.gridView!, this.node);
        this.initScene();
    }
    protected onEnable() {
        EventBus.Instance.on("statusChanged", this.onBattle, this);
    }
    protected onDisable() {
        EventBus.Instance.off("statusChanged", this.onBattle, this);

    }
    protected onDestroy() {
        if (GridManager._instance === this) {
            GridManager._instance = null;
        }
    }
    private onBattle(status: GameStatus) {
        if (status === GameStatus.Battle) {
            this.ensure();
        }
    }
    private initScene() {
        if (!this.mapData)
            return;
        for (let y = 0; y < ConfigExtern.MAP_HEIGHT; y++) {
            for (let x = 0; x < ConfigExtern.MAP_WIDTH; x++) {
                const type = this.mapData[y][x][0];
                const cell = this.gridData!.getCell(x, y);
                switch (type) {
                    case 0:
                        break;
                    case 1: {
                        const wall = this.gridView!.createWall(this.node, cell);
                        wall.setCell(cell);
                        wall.isTem = false;
                        break;
                    }
                    case 2: {
                        this.gridData!.setEndCell(cell);
                        this.gridView!.createEnd(this.node, cell);
                        break;
                    }
                    case 3: {
                        const born = this.gridView!.createBorn(this.node, cell, this.ids);
                        this.ids++;
                        this.gridData!.addBornBlock(born);
                        break;
                    }
                }
            }
        }
    }
    // 对外接口
    public getCell(x: number, y: number): GridCell {
        return this.gridData!.getCell(x, y);
    }
    public get getMap() {
        return this.gridData!.grids;
    }
    public getEndCell() {
        return this.gridData!.getEndCell();
    }
    public getBornBlocks() {
        return this.gridData!.getBornBlocks();
    }
    public getNeighbors(cell: GridCell) {
        const result: GridCell[] = [];
        const dirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        for (const dir of dirs) {
            const nx =
                cell.getX + dir[0];
            const ny =
                cell.getY + dir[1];
            if (nx < 0 || nx >= ConfigExtern.MAP_WIDTH || ny < 0 || ny >= ConfigExtern.MAP_HEIGHT)
                continue;
            if (this.placeLogic!.isWalkable(nx, ny)) {
                result.push(this.gridData!.getCell(nx, ny));
            }
        }
        return result;
    }
    public ensure() {
        this.placeLogic?.ensure();
    }
    public cancle() {
        this.placeLogic?.cancel();
    }
    public posToBlock(
        mouse: cc.Vec3,
        blocks: cc.Vec2[]
    ) {
        return this.placeLogic!
            .posToBlock(mouse, blocks);
    }
    public inMap(x: number, y: number) {
        return this.placeLogic!.inMap(x, y);
    }
    public refresh(mouse: cc.Vec3,
        blocks: cc.Vec2[]) {
        this.placeLogic!
            .refresh(mouse, blocks);
    }
}