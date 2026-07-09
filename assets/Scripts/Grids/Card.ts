const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";

@ccclass
export default class Card extends cc.Component //card拖拽
{
    // 是否已经开始拖拽 
    private isDragging = false;
    // 是否按下 
    private isPressing = false;
    // 按下时间 
    private pressTime = 0;
    // 长按判定
    private readonly LONG_PRESS_TIME = 200;
    private pressTimer = 0;
    worldPos: cc.Vec2 = new cc.Vec2();

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

        EventBus.Instance.on("CardDraged", this.unSeen, this);
        EventBus.Instance.on("CardNoDraged", this.Seen, this);
    }
    protected onDisable(): void {
        EventBus.Instance.off("CardDraged", this.unSeen, this);
        EventBus.Instance.off("CardNoDraged", this.Seen, this);
    }
    private onTouchStart(event: cc.Event.EventTouch): void {

        this.isPressing = true;

        this.isDragging = false;

        this.pressTime = Date.now();
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

        if (!this.isPressing)
            return;

        // 还没进入拖拽
        if (!this.isDragging) {

            if (Date.now() - this.pressTime >= this.LONG_PRESS_TIME) {

                this.startDrag();

            } else {

                return;
            }
        }

        // 已经进入拖拽

        this.updateDrag(event);
    }
    private startDrag(): void {

        this.isDragging = true;
        // 降低透明度
        //全部card都应该降低，所以这里接入总线
        EventBus.Instance.emit("CardDraged");
    }
    private updateDrag(event: cc.Event.EventTouch): void {

        const worldPos = event.getLocation();

        cc.log(worldPos);

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

        EventBus.Instance.emit("CardNoDraged");

    }

    private cancelDrag(): void {

        cc.log("取消拖拽");

    }

    private resetState(): void {

        this.isDragging = false;

        this.isPressing = false;
    }
    private unSeen(): void {
        this.node.opacity = 64;
    }
    private Seen(): void {
        this.node.opacity = 255;
    }
}

