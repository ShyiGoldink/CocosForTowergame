const { ccclass } = cc._decorator;
import BasicBlock from "./BasicBlock";
import GridCell from "../Grids/GridCell";
import TowerData from "../Tower/TowerData";
import EventBus from "../EventBus";
import StatusManager, { GameStatus } from "../Game/StatusManager";

@ccclass
export default class Wall extends BasicBlock//构造wall的预制体
{
    private _gridCell: GridCell | null = null;//获取Cell的数据，以便于告知CellManager修改其数据
    public towerData: TowerData | null = null;
    public setCell(gridCell: GridCell)//提供一个传入引用的方法
    {
        this._gridCell = gridCell;
        gridCell.setBlock(this);
    }
    public clicked() {
        cc.log("Wall Click");
        if (StatusManager.getStatus() == GameStatus.Prepare)//必须限制状态，只有在prepare状态下才能调开面板    
            EventBus.Instance.emit("WallClicked", this);
    }
}