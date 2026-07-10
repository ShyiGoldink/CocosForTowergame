const { ccclass, property } = cc._decorator;

import Enemy from "../Enemy/Enemy";

@ccclass
export default class Bullet extends cc.Component {

    @property
    public damage: number = 10;

    @property
    public speed: number = 600;

    @property
    public lifeTime: number = 3;

    /** 飞行方向 */
    private direction: cc.Vec2 = cc.v2();

    /** 剩余时间 */
    private timer: number = 0;

    /** 回收回调 */
    private recycleCallback?: (node: cc.Node) => void;

    public init(
        dir: cc.Vec2,
        recycle: (node: cc.Node) => void
    ) {

        this.direction = dir;

        this.timer = this.lifeTime;

        this.recycleCallback = recycle;

    }

    update(dt: number) {

        this.node.x += this.direction.x * this.speed * dt;
        this.node.y += this.direction.y * this.speed * dt;

        this.timer -= dt;

        if (this.timer <= 0) {

            this.recycle();

        }

    }

    onCollisionEnter(other: cc.Collider) {

        let enemy = other.getComponent(Enemy);

        if (!enemy)
            return;

        // enemy.takeDamage(this.damage);

        this.recycle();

    }

    private recycle() {

        if (this.recycleCallback) {

            this.recycleCallback(this.node);

        }

    }

}