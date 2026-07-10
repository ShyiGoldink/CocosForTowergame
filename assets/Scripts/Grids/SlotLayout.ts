const { ccclass, property } = cc._decorator;
import Slot from "./Slot";
import Card from "./Card";

@ccclass
export default class SlotLayout extends cc.Component //SlotLayout的主要功能是管理DargTool的状态，它要向CardManager提供是否还有空位
//为了提高效率，这里不做任何引用，只通过数据模拟存在
{
    private slots: Slot[] = [];//储存空的slot
    @property(cc.Node)
    private world: cc.Node | null = null;

    protected onLoad(): void {
        this.initSlots();//将全部的Slots塞进去
    }
    private initSlots(): void {
        const slots =
            this.node.getComponentsInChildren(Slot);
        for (let slot of slots) {
            this.slots.push(slot);
        }
    }
    //先检查是否还有空的Slot
    public hasEmptySlot(): boolean {
        for (let slot of this.slots) {
            if (slot.isEmpty()) {
                return true;
            }
        }
        return false;
    }

    public addCard(card: cc.Prefab, type: number): void//提供方法快捷实现添加Card
    {
        for (let slot of this.slots) {
            if (slot.isEmpty()) {
                slot.setStatu(true);
                let cardNode = cc.instantiate(card);
                cardNode.setParent(this.world!);
                let worldPos =
                    slot.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                if (this.world) {
                    let cardPos = this.world.convertToNodeSpaceAR(worldPos);
                    cardNode.setPosition(cardPos);
                    let theCard = cardNode.getComponent(Card);
                    if (type == 0) {
                        type = Math.floor(Math.random() * 5) + 1;
                    }
                    theCard.init(type);
                    theCard.setOriginPosition(cc.v3(cardPos.x, cardPos.y, 0));
                }
                cc.log("init ended");
                return;
            }
        }
    }

}
