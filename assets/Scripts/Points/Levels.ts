const { ccclass, property } = cc._decorator;
import Point from "./point"
import SaveLoad from "./SaveLoad";
@ccclass
export default class Levels extends cc.Component {
    private points: Map<number, Point> = new Map();
    private graphics: cc.Graphics | null = null;


    protected onLoad(): void {
        this.graphics = this.getComponent(cc.Graphics);
        for (let child of this.node.children) {
            let point = child.getComponent(Point);
            if (point != null) {
                this.points.set(point.getPointId, point);
            }
        }
        this.points.get(1)?.setCanpalye();
    }
    public newStart(): void {

        this.points.forEach((point) => {
            point.reset();
        });

        this.points.get(1)?.setCanpalye();
        this.drawAllLine();

    }
    protected start(): void {

        if (SaveLoad.getIsNewGame()) {
            this.newStart();
        }
        else {
            SaveLoad.initNormalGame();
            this.reDraw();
        }

    }

    private drawLine(point: Point): void// 绘制线条，传入point，然后获取point的position，再链接point的children的position，如果是“已经通关的状态”，线绘制蓝色；否则绘制黄色
    {
        if (!this.graphics)
            return;
        if (point.getIsPassed)
            this.graphics.strokeColor = cc.Color.BLUE;
        else
            this.graphics.strokeColor = cc.Color.YELLOW;

        this.graphics.lineWidth = 4;

        let start = point.node.position;
        for (let child of point.getChildPoints) {
            let end = child.node.position;
            this.graphics.moveTo(start.x, start.y);
            this.graphics.lineTo(end.x, end.y);
            this.graphics.stroke();
            if (point.getIsPassed) {
                child.setCanpalye();
            }
            if (!child.getCanplay) {
                const background = child.node.getChildByName("Background");
                background.color = cc.Color.YELLOW;
            }
            else {
                const background = child.node.getChildByName("Background");
                background.color = cc.Color.WHITE;
            }
        }
    }

    private drawAllLine(): void {
        if (!this.graphics)
            return;
        this.graphics.clear();
        this.points.forEach((point) => {
            this.drawLine(point);
        });
    }
    // reDraw() 目前调用两次。
    // 原因：drawLine() 在绘制过程中修改了 canPlay 状态，
    // 第一次更新数据，第二次刷新表现。
    // 后续重构为：updateUnlock() -> drawAllLine()
    public continueGame(): void {
        SaveLoad.setContinueGame();
        SaveLoad.initNormalGame();
        this.reDraw();
        
    }
    public reDraw(): void {
        //重绘
        if (!this.graphics) { return; }
        this.graphics.clear();
        let passedPoints = SaveLoad.getPassedPoints;
        for (let it of passedPoints) {
            this.points.get(it)?.setCanpalye();
            this.points.get(it)?.setIsPassed(true);
        }
        this.drawAllLine();
    }
}
