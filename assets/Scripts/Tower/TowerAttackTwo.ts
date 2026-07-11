const { ccclass } = cc._decorator;

import TowerData from "./TowerData";
import StraightBullet from "./straightBullet";

@ccclass
export default class TowerAttackTwo extends cc.Component {

    /** 数据组件 */
    private data: TowerData | null = null;

    /** 子弹对象池 */
    private bulletPool: cc.NodePool = new cc.NodePool();

    /** 攻击计时器 */
    private attackTimer: number = 0;

    /** 子弹回收回调 */
    private recycleCallback: ((node: cc.Node) => void) | null = null;

    onLoad() {

        this.data = this.getComponent(TowerData);

        this.recycleCallback = this.recycleBullet.bind(this);

    }

    update(dt: number) {

        if (!this.data)
            return;

        this.attackTimer += dt;

        if (this.attackTimer < 1 / this.data.attackSpeed)
            return;

        this.attackTimer = 0;

        this.attack();

    }

    /**
     * 发射子弹
     */
    private attack(): void {

        if (!this.data || !this.data.bulletPrefab)
            return;

        let bulletNode: cc.Node;

        if (this.bulletPool.size() > 0) {

            bulletNode = this.bulletPool.get();

        } else {

            bulletNode = cc.instantiate(this.data.bulletPrefab);

        }

        bulletNode.parent = this.node.parent;
        bulletNode.position = this.node.position;

        let bullet = bulletNode.getComponent(StraightBullet);

        if (bullet && this.data) {

            bullet.init(

                this.data.towerPosition!.clone(), this.recycleCallback!
            );

        }
        bullet.damage += this.data.attck;

    }

    /**
     * 子弹回收
     */
    private recycleBullet(node: cc.Node): void {

        this.bulletPool.put(node);

    }

}