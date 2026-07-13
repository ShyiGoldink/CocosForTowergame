import GridCell from "../Grid/GridCell";
import GridManager from "../Grid/GridManager";
import PathFinder from "../../Tool/PathFinder";
import EnemyManager from "../../Enemy/EnemyManager";
import BasicBlock from "./BasicBlock";
import GridLeader from "../../Tool/GridLeader";

const { ccclass } = cc._decorator;

@ccclass
export default class BornBlock extends BasicBlock {
    private _ID: number = 0;//ID,用于检测出生点
    private _shortestPath: GridCell[] = [];
    private _color: cc.Color = cc.Color.BLUE;
    private _graphics: cc.Graphics | null = null;
    private _cell: GridCell | null = null;
    private _gridLeader: GridLeader = new GridLeader();
    public static canGoending: boolean = true;

    protected onLoad(): void {
        this._graphics = this.getComponent(cc.Graphics);
    }
    protected start(): void {
        EnemyManager.Instance.registerBornBlock(this._ID, this);
        this.canGoend();
    }

    public canGoend(): void {
        if (!this._cell) {
            cc.error("BornBlock没有Cell");
            return;
        }
        const path =
            PathFinder.FindPath(this._cell);
        if (path.length > 0) {
            this._shortestPath = path.slice();
            this._color = cc.Color.BLUE;
            BornBlock.canGoending =
                BornBlock.canGoending && true;
        }
        else {
            // 找不到路
            // 保留旧路线
            this._color = cc.Color.RED;
            BornBlock.canGoending = false;
        }
        this.DrawLines();
    }

    private CellToLocal(cell: GridCell): cc.Vec2 {
        // GridManager内部坐标
        const gridPos =
            this._gridLeader.gridToWorld(cell);
        // 转世界坐标
        const worldPos =
            GridManager.Instance.node
                .convertToWorldSpaceAR(gridPos);
        // 转BornBlock局部坐标
        const localPos =
            this.node.convertToNodeSpaceAR(worldPos);
        return localPos;
    }
    private DrawLines(): void {
        if (!this._graphics) {
            return;
        }
        this._graphics.clear();
        if (this._shortestPath.length < 2) {
            return;
        }
        this._graphics.lineWidth = 8;
        this._graphics.strokeColor = this._color;
        this._graphics.lineCap =
            cc.Graphics.LineCap.ROUND;
        this._graphics.lineJoin =
            cc.Graphics.LineJoin.ROUND;
        // 第一个点
        let pos =
            this.CellToLocal(
                this._shortestPath[0]
            );
        this._graphics.moveTo(
            pos.x,
            pos.y
        );
        // 后续点
        for (
            let i = 1;
            i < this._shortestPath.length;
            i++
        ) {
            pos =
                this.CellToLocal(
                    this._shortestPath[i]
                );
            this._graphics.lineTo(
                pos.x,
                pos.y
            );
        }
        this._graphics.stroke();
    }
    public setCell(cell: GridCell): void {

        this._cell = cell;
    }
    // 给Enemy使用
    public getPath(): GridCell[] {

        return this._shortestPath;
    }

    public setId(id: number): void//设置ID，用于注册
    {
        this._ID = id;
    }
    public getPathVec3(parent: cc.Node): cc.Vec3[] {
        let result: cc.Vec3[] = [];
        for (let cell of this._shortestPath) {
            // Grid局部坐标
            let gridPos =
                this._gridLeader.gridToWorld(cell);

            // Grid局部
            // -> 世界
            let worldPos =
                GridManager.Instance.node
                    .convertToWorldSpaceAR(
                        cc.v3(
                            gridPos.x,
                            gridPos.y
                        )
                    );
            // 世界
            // -> EnemyManager局部
            let enemyPos =
                parent.convertToNodeSpaceAR(
                    worldPos
                );
            result.push(
                enemyPos
            );
        }
        return result;
    }

}