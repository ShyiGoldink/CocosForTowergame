import GridCell from "../Grids/GridCell";
import GridManager from "../Grids/GridManager";
import PathFinder from "../Grids/PathFinder";

const { ccclass } = cc._decorator;

@ccclass
export default class BornBlock extends cc.Component {

    private shortestPath: GridCell[] = [];

    private color: cc.Color = cc.Color.BLUE;

    private graphics: cc.Graphics | null = null;

    private _cell: GridCell | null = null;

    public static canGoending: boolean = true;


    protected onLoad(): void {

        this.graphics = this.getComponent(cc.Graphics);

        cc.log(
            "graphics:",
            this.graphics
        );
    }


    private canGoend(): void {

        if (!this._cell) {
            cc.error("BornBlock没有Cell");
            return;
        }


        cc.log(
            "开始寻路:",
            this._cell.getX,
            this._cell.getY
        );


        const path =
            PathFinder.FindPath(this._cell);


        cc.log(
            "路径长度:",
            path.length
        );


        if (path.length > 0) {

            this.shortestPath = path;

            this.color = cc.Color.BLUE;

            BornBlock.canGoending =
                BornBlock.canGoending && true;

        }
        else {

            // 找不到路
            // 保留旧路线
            this.color = cc.Color.RED;

            BornBlock.canGoending = false;
        }


        this.DrawLines();
    }



    /**
     * GridManager坐标
     * 转换为
     * BornBlock节点局部坐标
     */
    private CellToLocal(cell: GridCell): cc.Vec2 {

        // GridManager内部坐标
        const gridPos =
            GridManager.Instance.GridToWorld(cell);


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


        if (!this.graphics) {
            cc.error("没有Graphics");
            return;
        }


        this.graphics.clear();


        if (this.shortestPath.length < 2) {
            return;
        }


        this.graphics.lineWidth = 8;

        this.graphics.strokeColor = this.color;

        this.graphics.lineCap =
            cc.Graphics.LineCap.ROUND;

        this.graphics.lineJoin =
            cc.Graphics.LineJoin.ROUND;



        // 第一个点

        let pos =
            this.CellToLocal(
                this.shortestPath[0]
            );


        this.graphics.moveTo(
            pos.x,
            pos.y
        );



        // 后续点

        for (
            let i = 1;
            i < this.shortestPath.length;
            i++
        ) {

            pos =
                this.CellToLocal(
                    this.shortestPath[i]
                );


            this.graphics.lineTo(
                pos.x,
                pos.y
            );
        }


        this.graphics.stroke();
    }



    public setCell(cell: GridCell): void {

        this._cell = cell;

        this.canGoend();
    }



    // 给Enemy使用
    public getPath(): GridCell[] {

        return this.shortestPath;
    }
}