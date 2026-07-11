const { ccclass } = cc._decorator;

import Bullet from "./Bullet";
import Enemy from "../Enemy/Enemy";

@ccclass
export default class IceBullet extends Bullet {

    override onCollisionEnter(other: cc.Collider): void {

        let enemy = other.getComponent(Enemy);

        if (!enemy)
            return;

        enemy.takeDamage(this.damage);

        if (enemy.enemyStatu) enemy.enemyStatu.slowDown(5, 0.3);

        this.recycle();

    }

}