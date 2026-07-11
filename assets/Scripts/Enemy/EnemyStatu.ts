const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyStatu extends cc.Component {

    @property
    public maxHP: number = 100;
    /** 当前生命值 */
    public hp: number = 100;
    /** 基础移动速度 */
    @property
    public speed: number = 100;
    /** 当前移动速度 */
    public currentSpeed: number = 100;
    /** 是否死亡 */
    public isDead: boolean = false;
    @property
    public damage: number = 0;
    /** 是否处于减速状态 */
    public isSlowDown: boolean = false;
    /** 减速剩余时间 */
    private slowTimer: number = 0;
    protected onLoad(): void {
        this.init();

    }
    protected update(dt: number): void {
        if (!this.isSlowDown)
            return;
        this.slowTimer -= dt;
        if (this.slowTimer <= 0) {
            this.isSlowDown = false;
            this.currentSpeed = this.speed;
        }
    }
    /**
     * 减速
     * @param duration 持续时间
     * @param rate 减速倍率(0~1)
     */
    public slowDown(duration: number, rate: number): void {
        cc.log("has slowDown");
        // 已经减速，仅刷新持续时间
        if (this.isSlowDown) {

            this.slowTimer = duration;

            return;

        }

        this.isSlowDown = true;

        this.slowTimer = duration;

        this.currentSpeed = this.speed * rate;

    }

    public init(): void {
        this.hp = this.maxHP;
        this.isDead = false;
        this.currentSpeed = this.speed;
        this.isSlowDown = false;
        this.slowTimer = 0;
    }

}