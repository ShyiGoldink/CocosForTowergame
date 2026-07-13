import EventBus from "../EventBus";
import DragTool from "../Tool/Drager";
import GridCell from "../Map/Grid/GridCell";
import GridManager from "../Map/Grid/GridManager";
import Wall from "../Map/Blocks/Wall";
import TowerData from "./TowerData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerMerger extends cc.Component //合并同类项
{
    private dragTool: DragTool | null = null;//拖拽工具
    private originPosition: cc.Vec3 = new cc.Vec3();//记录拖拽前的位置
    private isDraging: boolean = false;
    private lastPosition: cc.Vec3 | null = null;
    private data: TowerData | null = null;//数据

    protected onLoad(): void //获取组件
    {
        this.dragTool = this.getComponent(DragTool);
        this.data = this.getComponent(TowerData);
        this.originPosition = this.node.position.clone();
    }
    protected onEnable(): void//注册拖拽事件
    {
        if (this.dragTool) {
            this.dragTool.regisCallBack(
                this.handleDragEvent.bind(this)
            );
            EventBus.Instance.on("StopDraging", this.handleStopDragEvent, this);
        }
        EventBus.Instance.on("Draging", this.handleStartDrag, this);

    }
    protected onDisable(): void //注册后记得取消注册
    {
        if (this.dragTool) {
            EventBus.Instance.off("StopDraging", this.handleStopDragEvent, this);
        }
        EventBus.Instance.off("Draging", this.handleStartDrag, this);
    }
    private handleStartDrag(node: cc.Node) {
        if (this.dragTool && node == this.dragTool.node) {
            EventBus.Instance.emit("changeCard", this);
        }
    }
    private handleDragEvent(node: cc.Node, position: cc.Vec3) {
        if (!this.isDraging)//如果是第一次运行，在拖拽之前先保存拖拽之前的位置
        {
            this.originPosition = this.node.position.clone();
            this.node.opacity = 192;
        }
        if (this.dragTool && node == this.dragTool.node) {
            this.node.position = position;
            this.lastPosition = position;
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
            //回到位置之前，这里需要调用函数来查看合并与否
            if (!this.canMerge()) this.node.position = this.originPosition;
        }
    }

    public setOriginPosition(position: cc.Vec3) {
        this.originPosition = position;
    }

    public canMerge(): boolean //这里正式实现Merge流程
    {
        if (!this.lastPosition) {
            return false;
        }

        const x = Math.floor((this.lastPosition.x - 16) / 64);
        const y = Math.floor((this.lastPosition.y - 16) / 64);
        if (!GridManager.Instance.inMap(x, y)) {
            return false;
        }
        let gridCell: GridCell = GridManager.Instance.getCell(x, y);
        if (gridCell.isEmpty) {
            return false;
        }
        const block = gridCell.getBlock();

        if (!(block instanceof Wall)) {
            return false;
        }

        if (!block.towerData) {
            return false;
        }//防止和自己融合
        if (block.towerData === this.data) {
            return false;
        }
        if (block.towerData.getType != this.data?.getType) {
            return false;
        }
        if (block.towerData.getStage != this.data?.getStage) {
            return false;
        }
        if ((this.data?.getStage ?? 0) >= 3) {
            return false;
        }
        this.merge(block.towerData);
        return true;
    }
    //实现融合
    //融合需要什么？首先是确定将自己融合到对方身上，所以直接调用对方的升阶就可以，那么就需要传入对方的towerData实现升阶
    //自己的数据自己就能获取到，所以不需要传入
    //但是自己的wall里的towerData需要清理
    public merge(towerData: TowerData): void {
        towerData.upStage(this.data!);
        const x = Math.floor((this.originPosition.x - 16) / 64);
        const y = Math.floor((this.originPosition.y - 16) / 64);
        if (!GridManager.Instance.inMap(x, y)) {
            return;
        }
        let gridCell: GridCell = GridManager.Instance.getCell(x, y);
        const block = gridCell.getBlock();
        if (block instanceof Wall) {
            block.clearTower();
        }

        this.node.destroy();
    }


}
