const { ccclass, property } = cc._decorator;
import DataTransformer from "../Tool/DataTrasformer";
import EventBus from "../EventBus";

@ccclass
export default class GoldManager extends cc.Component //单例模式实现资源管理
{

    private static _instance: GoldManager | null = null;
    private gold: number = 0;

    public static get Instance(): GoldManager {
        return this._instance!;
    }

    protected onLoad(): void {
        if (GoldManager._instance != null && GoldManager._instance !== this) {
            this.node.destroy();
            return;
        }

        GoldManager._instance = this;
    }
    protected start(): void {
        this.addGold(DataTransformer.GetInitResource());
    }

    protected onDestroy(): void {
        if (GoldManager._instance === this) {
            GoldManager._instance = null;
        }
    }

    public addGold(num: number) {
        this.gold += num;
        EventBus.Instance.emit("GoldChanged", this.gold);
    }
    public reduceGold(num: number): boolean {
        if (this.gold >= num) {
            this.gold -= num;
            EventBus.Instance.emit("GoldChanged", this.gold);
            return true;
        }
        return false;
    }
}