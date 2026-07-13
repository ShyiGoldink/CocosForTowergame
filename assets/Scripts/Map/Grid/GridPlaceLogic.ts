import ConfigExtern from "../../ConfigExtern";
import GridData from "./GridData";
import GridView from "./GridView";
import Wall from "../Blocks/Wall";
import DrawTool from "../../Tool/GhostDrawer";
import EventBus from "../../EventBus";
import BornBlock from "../Blocks/BornBlock";

export default class GridPlaceLogic {
    private result: cc.Vec2[] = [];
    private preX = 0;
    private preY = 0;
    private walls: Wall[] = [];
    constructor(
        private data: GridData,
        private view: GridView,
        private parent: cc.Node
    ) {
        for (let i = 0; i < 4; i++) {
            this.result.push(cc.v2());
            this.walls.push(new Wall());
        }
    }
    public isWalkable(x: number, y: number) {
        if (x < 0 || x >= ConfigExtern.MAP_WIDTH || y < 0 || y >= ConfigExtern.MAP_HEIGHT)
            return false;
        const cell = this.data.getCell(x, y);
        if (cell === this.data.getEndCell())
            return true;
        return cell.isEmpty;
    }
    public inMap(x: number, y: number) {
        return (x >= 0 && x < ConfigExtern.MAP_WIDTH && y >= 0 && y < ConfigExtern.MAP_HEIGHT)
    }
    public posToBlock(mouse: cc.Vec3, blocks: cc.Vec2[]) {
        const x = Math.floor(mouse.x / 64);
        const y = Math.floor(mouse.y / 64);
        for (let i = 0; i < blocks.length; i++) {
            this.result[i].x = blocks[i].x + x;
            this.result[i].y = blocks[i].y + y;
        }
        if (x !== this.preX || y !== this.preY) {
            this.preX = x;
            this.preY = y;
            this.tryDrawGhostBlocks(this.result);
        }
        return this.result;
    }
    public refresh(mouse: cc.Vec3, blocks: cc.Vec2[]) {
        const x = Math.floor(mouse.x / 64);
        const y = Math.floor(mouse.y / 64);
        for (let i = 0; i < blocks.length; i++) {
            this.result[i].x = blocks[i].x + x;
            this.result[i].y = blocks[i].y + y;
        }
        this.tryDrawGhostBlocks(this.result);
    }
    public getNotClog(blocks: cc.Vec2[]) {
        for (let b of blocks) {
            if (!this.inMap(b.x, b.y))
                return false;
            if (!this.data.getCell(b.x, b.y).isEmpty)
                return false;
        }
        return true;
    }
    public addBlocks(blocks: cc.Vec2[]) {
        for (let i = 0; i < blocks.length; i++) {
            const pos = blocks[i];
            if (!this.inMap(pos.x, pos.y))
                continue;
            const cell =
                this.data.getCell(pos.x, pos.y);
            if (!cell.getTemporary && cell.isEmpty) {
                cell.setBlock(this.walls[i]);
                cell.setTemporary(true);
            }
        }
    }
    public clearBlocks(blocks: cc.Vec2[]) {
        for (let i = 0; i < blocks.length; i++) {
            const pos = blocks[i];
            if (!this.inMap(pos.x, pos.y))
                continue;
            const cell =
                this.data.getCell(pos.x, pos.y);
            if (cell.getTemporary) {
                cell.removeBlock();
                cell.setTemporary(false);
            }
        }
    }
    public tryDrawGhostBlocks(blocks: cc.Vec2[]) {
        const notClog = this.getNotClog(blocks);
        this.addBlocks(blocks);
        BornBlock.canGoending = true;
        if (notClog) {
            for (const born of this.data.getBornBlocks()) {
                born.canGoend();
            }
            this.clearBlocks(blocks);
        } else {
            this.clearBlocks(blocks);
            for (const born of this.data.getBornBlocks()) {
                born.canGoend();
            }
        }
        DrawTool.Instance.draw(blocks, notClog);
    }
    public ensure() {
        const can = BornBlock.canGoending && this.getNotClog(this.result);
        if (!can) return;
        DrawTool.Instance.clear();
        for (const pos of this.result) {
            if (!this.inMap(pos.x, pos.y)) continue;
            const cell = this.data.getCell(pos.x, pos.y);
            if (!cell.isEmpty) {
                continue;
            }
            // 数据
            cell.setBlock(new Wall());
            cell.setTemporary(false);
            // 表现
            const wall = this.view.createWall(this.parent, cell);
            wall?.setCell(cell);
            if (wall) { wall.isTem = false; }
        }
        EventBus.Instance.emit("destoryCard");
    }
    public cancel() {
        this.clearBlocks(this.result);
        DrawTool.Instance.clear();
        for (let born of this.data.getBornBlocks()) {
            born.canGoend();
        }
    }
    refreshCurrentBlock() {
        this.tryDrawGhostBlocks(this.result);
    }

}