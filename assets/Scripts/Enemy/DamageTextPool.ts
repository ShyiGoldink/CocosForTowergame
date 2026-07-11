const { ccclass, property } = cc._decorator;

@ccclass
export default class DamageTextPool extends cc.Component {

    private static _instance: DamageTextPool | null = null;
    public static get Instance(): DamageTextPool {
        return this._instance!;
    }

    @property(cc.Prefab)
    private damagePrefab: cc.Prefab = null!;

    @property(cc.Node)
    private damageLayer: cc.Node = null!;

    private pool: cc.NodePool = new cc.NodePool();

    protected onLoad(): void {

        if (DamageTextPool._instance && DamageTextPool._instance !== this) {
            this.node.destroy();
            return;
        }

        DamageTextPool._instance = this;
    }

    protected onDestroy(): void {
        if (DamageTextPool._instance === this) {
            DamageTextPool._instance = null;
        }
    }

    public showDamage(damage: number, position: cc.Vec3): void {

        let node: cc.Node;

        if (this.pool.size() > 0) {
            node = this.pool.get();
        } else {
            node = cc.instantiate(this.damagePrefab);
        }

        node.parent = this.damageLayer;
        node.position = position;

        node.getComponent("DamageText")
            .show(damage, () => {
                this.recycle(node);
            });
    }

    public recycle(node: cc.Node): void {

        node.stopAllActions();

        node.opacity = 255;
        node.scale = 1;
        node.angle = 0;

        this.pool.put(node);
    }
}