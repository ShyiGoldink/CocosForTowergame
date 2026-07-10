const { ccclass } = cc._decorator;

import TowerData from "./TowerData";
import Enemy from "../Enemy/Enemy";
import Bullet from "./Bullet";

@ccclass
export default class TowerAttack extends cc.Component {

    /** 数据组件 */
    private data: TowerData | null = null;

    /** 子弹对象池 */
    private bulletPool: cc.NodePool = new cc.NodePool();

    /** 射程内敌人 */
    private enemyList: Enemy[] = [];

    /** 攻击计时器 */
    private attackTimer: number = 0;

    /** 碰撞器 */
    private circleCollider: cc.CircleCollider | null = null;

    onLoad() {

        this.data = this.getComponent(TowerData);

        this.circleCollider = this.getComponent(cc.CircleCollider);

        if (this.circleCollider) {
            this.circleCollider.radius = this.data.range;
            this.circleCollider.enabled = true;
        }
    }

    update(dt: number) {

        this.attackTimer += dt;

        if (this.data && this.attackTimer < 1 / this.data.attackSpeed)
            return;

        this.attackTimer = 0;

        this.clearInvalidEnemy();

        if (this.enemyList.length <= 0)
            return;

        this.attack(this.enemyList[0]);
    }

    onCollisionEnter(other: cc.Collider) {

        let enemy = other.getComponent(Enemy);

        if (!enemy)
            return;

        if (this.enemyList.indexOf(enemy) != -1)
            return;

        this.enemyList.push(enemy);
    }

    onCollisionExit(other: cc.Collider) {

        let enemy = other.getComponent(Enemy);

        if (!enemy)
            return;

        let index = this.enemyList.indexOf(enemy);

        if (index != -1)
            this.enemyList.splice(index, 1);
    }

    private clearInvalidEnemy() {

        this.enemyList = this.enemyList.filter(enemy => {

            return enemy &&
                enemy.node &&
                enemy.node.activeInHierarchy;

        });

    }

    private attack(enemy: Enemy) {

        if (this.data && !this.data.bulletPrefab) {
            return;
        }

        let bulletNode: cc.Node;

        if (this.data) {
            if (this.bulletPool.size() > 0) {
                bulletNode = this.bulletPool.get();
            } else {
                bulletNode = cc.instantiate(this.data.bulletPrefab!);
            }

            bulletNode.parent = this.node.parent;
            bulletNode.position = this.node.position;

            let dir = cc.v2(
                enemy.node.x - this.node.x,
                enemy.node.y - this.node.y
            );

            dir.normalizeSelf();

            let bullet = bulletNode.getComponent(Bullet);

            bullet.init(
                dir,
                (node: cc.Node) => {
                    this.bulletPool.put(node);
                }
            );
        }
    }

}