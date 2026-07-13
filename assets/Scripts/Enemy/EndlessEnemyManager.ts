import EnemyPool from "./EnemyPool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndlessEnemyManager extends cc.Component {
    @property(EnemyPool)
    private smallPool: EnemyPool = null!;

    @property(EnemyPool)
    private bossPool: EnemyPool = null!;

    private pools: EnemyPool[] = [];
}
