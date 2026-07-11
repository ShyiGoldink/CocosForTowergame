const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerData extends cc.Component {

    /** 攻击速度（每秒攻击次数） */
    @property({
        tooltip: "攻击速度（次/秒）"
    })
    public attackSpeed: number = 1;

    /** 攻击范围 */
    @property({
        tooltip: "攻击范围"
    })
    public range: number = 128;
    @property({ tooltip: "花费" })
    public cost: number = 100;

    /** 子弹预制体 */
    @property(cc.Prefab)
    public bulletPrefab: cc.Prefab | null = null;

    public towerPosition: cc.Vec2 = cc.v2(1, 0);
}