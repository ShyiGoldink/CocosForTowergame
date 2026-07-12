const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";
import StatusManager, { GameStatus } from "../Game/StatusManager";

@ccclass
export default class DragTool extends cc.Component {

    //是否已经开始拖拽 
    private isDragging = false;
    // 是否按下 
    private isPressing = false;
    // 长按判定
    private pressTimer = 0;
    private worldPos: cc.Vec3 = new cc.Vec3();
    private dragCallback: ((node: cc.Node, position: cc.Vec3) => void) | null = null;

    protected onEnable(): void {

        this.node.on(
            cc.Node.EventType.TOUCH_START,
            this.onTouchStart,
            this
        );//按下就为true，然后就开始计时

        this.node.on(
            cc.Node.EventType.TOUCH_MOVE,
            this.onTouchMove,
            this
        );//拖拽状态下，才会移动

        this.node.on(
            cc.Node.EventType.TOUCH_END,
            this.onTouchEnd,
            this
        );

        this.node.on(
            cc.Node.EventType.TOUCH_CANCEL,
            this.onTouchCancel,
            this
        );//松手就为false，然后取消计时，也取消拖拽
    }
    private onTouchStart(event: cc.Event.EventTouch): void {
        this.isPressing = true;
        this.isDragging = false;
    }
    protected update(dt: number): void {
        if (this.isPressing && !this.isDragging) {
            this.pressTimer += dt;
            if (this.pressTimer >= 0.2) {
                this.startDrag();
            }
        }
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        if (StatusManager.getStatus() == GameStatus.Battle) { return; }
        if (!this.isPressing)
            return;
        this.updateDrag(event);
    }
    private startDrag(): void {
        this.isDragging = true;
        EventBus.Instance.emit("Draging", this.node);
    }
    private updateDrag(event: cc.Event.EventTouch): void {

        const mousePos = event.getLocation();
        this.worldPos.x = mousePos.x;
        this.worldPos.y = mousePos.y;
        this.worldPos.z = 0;
        if (this.dragCallback) this.dragCallback(this.node, this.worldPos);

    }
    public regisCallBack(callback: ((node: cc.Node, position: cc.Vec3) => void)): void {
        this.dragCallback = callback;
    }
    private onTouchEnd(event: cc.Event.EventTouch): void {

        if (this.isDragging) {

            this.finishDrag();
        }

        this.resetState();
    }
    private onTouchCancel(event: cc.Event.EventTouch): void {

        if (this.isDragging) {

            this.cancelDrag();
        }

        this.resetState();
    }
    private finishDrag(): void {

        EventBus.Instance.emit("StopDraging", this.node);

    }

    private cancelDrag(): void {

        EventBus.Instance.emit("StopDraging", this.node);;

    }

    private resetState(): void {

        this.isDragging = false;
        this.pressTimer = 0;
        this.isPressing = false;
    }
}
