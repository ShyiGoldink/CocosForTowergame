const { ccclass } = cc._decorator;
import BasicBlock from "./BasicBlock";
import GridCell from "../Grids/GridCell";

@ccclass
export default class Wall extends BasicBlock//构造wall的预制体
{
    private _gridCell: GridCell | null = null;//获取Cell的数据，以便于告知CellManager修改其数据
    public setCell(gridCell: GridCell)//提供一个传入引用的方法
    {
        this._gridCell = gridCell;
        gridCell.setBlock(this);
    }
    /* protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
         this.setTransparent(true);
     }
 
     protected onCollisionExit(other: cc.Collider, self: cc.Collider): void {
         this.setTransparent(false);
     }
 
     private setTransparent(value: boolean): void {
         this.node.opacity = value ? 120 : 255;
     }*/
}