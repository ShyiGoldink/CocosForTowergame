const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";

@ccclass
export default class UIManager extends cc.Component {
    @property(cc.Label)
    private goldNum: cc.Label | null = null;
    //管理Ui的显示和隐藏，所以需要先拿到button的引用
    @property(cc.Button)
    private button1: cc.Button | null = null;
    @property(cc.Button)
    private button2: cc.Button | null = null;
    @property(cc.Button)
    private button3: cc.Button | null = null;
    @property(cc.Button)
    private button4: cc.Button | null = null;
    @property(cc.Node)
    private node1: cc.Node | null = null;
    private isHide: boolean = false;
    protected onEnable(): void //注册事件
    {
        EventBus.Instance.on("GoldChanged", this.changeGoldNum, this);
    }
    protected onDisable(): void {
        EventBus.Instance.off("GoldChanged", this.changeGoldNum, this);
    }

    private changeGoldNum(num: number) {
        if (this.goldNum)
            this.goldNum.string = num.toString();
    }
    public hideUI() {

        if (this.button1) this.button1.node.active = this.isHide;
        if (this.button2) this.button2.node.active = this.isHide;
        if (this.button3) this.button3.node.active = this.isHide;
        if (this.button4) this.button4.node.active = this.isHide;
        if (this.node1) this.node1.active = this.isHide;
        this.isHide = !this.isHide;

    }

}
