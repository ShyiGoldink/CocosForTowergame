const { ccclass, property } = cc._decorator;

import Enemy from "../Enemy/Enemy";

@ccclass
export default class StraightBullet extends cc.Component {

    /** 伤害 */
    @property
    private currentDamage: number = 10;
    public damage: number = 10;

    /** 飞行速度 */
    @property
    public speed: number = 600;

    /** 存活时间 */
    @property
    public lifeTime: number = 2;

    /** 飞行方向（Inspector可调整） */
    @property(cc.Vec2)
    public direction: cc.Vec2 = cc.v2(1, 0);

    /** 剩余时间 */
    private timer: number = 0;

    /** 回收回调 */
    private recycleCallback: ((node: cc.Node) => void) | null = null;

    /**
     * 初始化
     */
    public init(
        dir: cc.Vec2,
        recycle: (node: cc.Node) => void
    ) {

        this.direction = dir.clone();
        this.direction.normalizeSelf();
        this.damage = this.currentDamage;
        this.timer = this.lifeTime;

        this.recycleCallback = recycle;

        this.node.angle = -cc.misc.radiansToDegrees(
            Math.atan2(this.direction.y, this.direction.x)
        );

    }

    update(dt: number): void {

        this.node.x += this.direction.x * this.speed * dt;
        this.node.y += this.direction.y * this.speed * dt;

        this.timer -= dt;

        if (this.timer <= 0) {
            this.recycle();
        }

    }

    /**
     * 命中敌人
     */
    onCollisionEnter(other: cc.Collider): void {

        let enemy = other.getComponent(Enemy);

        if (!enemy)
            return;

        enemy.takeDamage(this.damage);

        // 注意：这里不回收
    }

    /**
     * 回收
     */
    private recycle(): void {

        if (this.recycleCallback) {

            this.recycleCallback(this.node);

        }

    }

}