const {ccclass, property} = cc._decorator;
import Point from "./point"
@ccclass
export default class NewClass extends cc.Component {
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
    }

    protected start(): void
    {
        this.drawAllLine();
    }

    private drawLine(point:Point):void// 绘制线条，传入point，然后获取point的position，再链接point的children的position，如果是“已经通关的状态”，线绘制蓝色；否则绘制黄色
    {
        if (!this.graphics)
            return;

        if (point.getIsPassed)
            this.graphics.strokeColor = cc.Color.BLUE;
        else
            this.graphics.strokeColor = cc.Color.YELLOW;

            this.graphics.lineWidth = 4;

        let start = point.node.position;

        for (let child of point.getChildPoints)
        {
            let end = child.node.position;
            this.graphics.moveTo(start.x, start.y);
            this.graphics.lineTo(end.x, end.y);
        }

        this.graphics.stroke();
    }

    private drawAllLine(): void
    {
        if (!this.graphics)
            return;

        this.graphics.clear();

        this.points.forEach((point) => {
            this.drawLine(point);
        });
    }
}
