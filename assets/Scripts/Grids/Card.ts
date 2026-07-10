const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";
import DragTool from "./DragTool";
import Tetromino from "./Tetromino";

@ccclass
export default class Card extends cc.Component //card
{
    private dragTool: DragTool | null = null;//拖拽工具
    private originPosition: cc.Vec3 = new cc.Vec3();//记录拖拽前的位置
    private isDraging: boolean = false;
    @property
    private type: number = 1;
    private tetromino: Tetromino | null = null;
    private cardFace: cc.Sprite | null = null;

    //获取卡面内容，对应不同的方块。
    private cardFaces: (cc.SpriteFrame | null)[] = [];
    @property(cc.SpriteFrame)
    private cardL: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    private cardT: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    private cardI: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    private cardO: cc.SpriteFrame | null = null;
    @property(cc.SpriteFrame)
    private cardZ: cc.SpriteFrame | null = null;


    protected onLoad(): void //获取组件
    {
        this.dragTool = this.getComponent(DragTool);
        this.cardFace = this.getComponent(cc.Sprite);
        this.cardFaces[0] = this.cardL!;
        this.cardFaces[1] = this.cardL!;
        this.cardFaces[2] = this.cardT!;
        this.cardFaces[3] = this.cardI!;
        this.cardFaces[4] = this.cardO!;
        this.cardFaces[5] = this.cardZ!;
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
    public init(num: number): void {
        this.type = num;
        this.tetromino = new Tetromino(this.type);
        if (this.cardFace) this.cardFace.spriteFrame = this.cardFaces[num]!;

    }

    public setOriginPosition(position: cc.Vec3) {
        this.originPosition = position;
    }
}

