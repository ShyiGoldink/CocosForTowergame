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
    @property({ tooltip: "type" })
    private type: number = 0;//type代表tower的种类
    private stage: number = 1;//升阶
    /** 子弹预制体 */
    @property(cc.Prefab)
    public bulletPrefab: cc.Prefab | null = null;
    public towerPosition: cc.Vec2 = cc.v2(1, 0);
    public attck: number = 0;

    public get getType(): number {
        return this.type;
    }
    public get getStage(): number {
        return this.stage;
    }
    public upStage(data: TowerData): void {
        this.stage += 1;//升阶
        //根据升阶改变自己的颜色
        switch (this.stage) {
            case 1:
                this.node.color = cc.Color.GRAY;      // 原色/灰色
                break;
            case 2:
                this.node.color = cc.Color.YELLOW;
                break;
            case 3:
                this.node.color = new cc.Color(255, 165, 0); // 橙色
                break;
            case 4:
                this.node.color = cc.Color.RED;
                break;
        }
        //升阶公式，不能单纯的1+1 =2，因为实际减少了占位格子，所以选择1+1 = 1.5更合适
        //但是由于游戏有升级功能，目前还真没觉得升阶有什么用
        //非要说的话，那就数值简单合并（初始值加提升值）然后修改attack，让其每次射出的子弹数量和等级数量一致比较好。
        //攻击力是子弹加tower，所以直接合并就可以。
        //攻速选择比较高的那个
        //攻击范围也是如此
        // 合并数值
        this.attck += data.attck;
        // 取较大的攻击范围
        this.range = Math.max(this.range, data.range);
        // 攻速取最快（每秒攻击次数越大越快）
        this.attackSpeed = Math.max(this.attackSpeed, data.attackSpeed);
    }
}