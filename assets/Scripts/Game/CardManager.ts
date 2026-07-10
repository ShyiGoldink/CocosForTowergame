const { ccclass, property } = cc._decorator;
import SlotLayout from "../Grids/SlotLayout";
import Card from "../Grids/Card";

@ccclass
export default class CardManager extends cc.Component {
    private readonly MAXCARDNUM = 5;//卡片的最大数量
    private slotLayout: SlotLayout | null = null;
    @property(cc.Prefab)
    private card: cc.Prefab | null = null;

    protected onLoad(): void {
        //先获取组件
        this.slotLayout = this.getComponentInChildren(SlotLayout);
    }
    public onBuyButtonClick(): void {
        this.buyCard(0);
    }
    public buyCard(type: number): void//购买卡牌
    {
        if (this.slotLayout?.hasEmptySlot()) {
            if (this.card)
                this.slotLayout.addCard(this.card, type);
        }
    }

}
