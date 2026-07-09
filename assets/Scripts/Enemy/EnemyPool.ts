const { ccclass, property } = cc._decorator;
import Enemy from "./Enemy";

@ccclass
export default class EnemyPool extends cc.Component //enemy对象池，专门负责提供邪恶小机器人的对象，减少可能造成的不必要卡顿
{
    private pool: cc.NodePool = new cc.NodePool();//使用cc自己提供的对象池内部实现
    @property(cc.Prefab)
    private enemyPrefab: cc.Prefab | null = null;//不同enemy的预制体
    @property
    private idType: number = 0;


    start() //对象池初始化
    {
        for (let i = 0; i < 10; i++) {
            let enemy = cc.instantiate(this.enemyPrefab!) as cc.Node;
            this.pool.put(enemy);
        }
    }

    public spwanEnemy(father: cc.Node, position: cc.Vec3, route: cc.Vec3[]) {
        let enemy: cc.Node;

        if (this.pool.size() > 0) {
            enemy = this.pool.get();
        }
        else {
            enemy = cc.instantiate(this.enemyPrefab!);
        }

        enemy.parent = father;
        enemy.setPosition(position);

        const theEnemy = enemy.getComponent(Enemy)!;

        theEnemy.registerRecycleCallback(
            this.recycleEnemy.bind(this)
        );

        theEnemy.init(route);

    }
    //后续使用事件系统回收对象
    public recycleEnemy(enemy: Enemy) {
        this.pool.put(
            enemy.node
        );
    }

    public getId(): number {
        return this.idType;
    }

}
