const { ccclass, property } = cc._decorator;
import SlotLayout from "../Cards/SlotLayout";
import Card from "../Cards/Card";
import EventBus from "../EventBus";
import GoldManager from "../Game/GoldManager";

@ccclass
export default class CardManager extends cc.Component {
    private readonly MAXCARDNUM = 5;//卡片的最大数量
    private slotLayout: SlotLayout | null = null;
    private currentCard: Card | null = null;
    @property(cc.Prefab)
    private card: cc.Prefab | null = null;

    protected onLoad(): void {
        //先获取组件
        this.slotLayout = this.getComponentInChildren(SlotLayout);
    }
    protected onEnable(): void {
        EventBus.Instance.on("changeCard", this.handleCardChange, this);
        EventBus.Instance.on("destoryCard", this.cancle, this);
    }
    protected onDisable(): void {
        EventBus.Instance.off("changeCard", this.handleCardChange, this);
        EventBus.Instance.off("destoryCard", this.cancle, this);
    }
    public onBuyButtonClick(): void {
        this.buyCard(0);
    }
    public buyCard(type: number): void//购买卡牌
    {
        if (!GoldManager.Instance.reduceGold(10)) { return; }
        if (this.slotLayout?.hasEmptySlot()) {
            if (this.card)
                this.slotLayout.addCard(this.card, type);
        }
    }
    public rotateCard() {
        if (this.currentCard)
            this.currentCard.rotate();
        this.currentCard?.rotateRedraw();
    }
    public handleCardChange(card: Card) {
        this.currentCard = card;
    }
    public cancle() {
        if (this.currentCard) {
            this.currentCard.node.active = false;
            this.currentCard.destroy();
        }
    }

}
