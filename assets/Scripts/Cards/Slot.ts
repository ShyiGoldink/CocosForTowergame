const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot extends cc.Component //由于布局需要用到Slot，所以Slot只需要返回自己是否为空就可以了。
{
    private hasCard: boolean = false;

    public setStatu(statu: boolean) {
        this.hasCard = statu;
    }

    public isEmpty(): boolean {
        return !this.hasCard;
    }
}
