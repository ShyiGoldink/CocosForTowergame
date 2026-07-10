const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";
import DragTool from "./DragTool";
import Tetromino from "./Tetromino";

@ccclass
export default class Card extends cc.Component //card
{
    private dragTool: DragTool | null = null;
    private originPosition: cc.Vec3 = new cc.Vec3();//记录拖拽前的位置
    private isDraging: boolean = false;
    @property
    private type: Number = 0;
    private tetromino: Tetromino | null = null;

    protected onLoad(): void //获取组件
    {
        this.dragTool = this.getComponent(DragTool);
        if (this.tetromino) this.tetromino = new Tetromino(this.type);
    }
    protected onEnable(): void//注册拖拽事件
    {
        if (this.dragTool) {
            EventBus.Instance.on("DragMove", this.handleDragEvent, this);
            EventBus.Instance.on("StopDraging", this.handleStopDragEvent, this);
        }

    }
    protected onDisable(): void //注册后记得取消注册
    {
        if (this.dragTool) {
            EventBus.Instance.off("DragMove", this.handleDragEvent, this);
            EventBus.Instance.off("StopDraging", this.handleStopDragEvent, this);
        }
    }
    protected update(dt: number): void {
        ;
    }

    private handleDragEvent(node: cc.Node, position: cc.Vec3) {
        if (!this.isDraging)//如果是第一次运行，在拖拽之前先保存拖拽之前的位置
        {
            this.originPosition = this.node.position.clone();
            this.node.opacity = 192;
        }
        if (this.dragTool && node == this.dragTool.node) {
            this.node.position = position;
            this.isDraging = true;
        }
        else if (this.dragTool) {
            this.node.opacity = 128;
        }
    }
    private handleStopDragEvent(node: cc.Node) {
        this.node.opacity = 255;
        if (this.dragTool && node == this.dragTool.node) {
            this.isDraging = false;
            //这里可以使用动画进行协调
            this.node.position = this.originPosition;
        }
    }
}

