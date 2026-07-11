const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";
import EnemyStatu from "./EnemyStatu";
import HPBar from "./HPBar";
import GoldManager from "../Game/GoldManager";
import DamageTextPool from "./DamageTextPool";
@ccclass
export default class Enemy extends cc.Component {
    @property
    private value: number = 10;//击杀enemy所得价值
    private route: cc.Vec3[] = [];
    private currentIndex: number = 0;
    private recycleCallback: ((enemy: Enemy) => void) | null = null;
    @property(HPBar)
    private hpBar: HPBar | null = null;
    @property(EnemyStatu)
    public enemyStatu: EnemyStatu | null = null;

    public init(path: cc.Vec3[]): void {
        this.route = path;
        this.currentIndex = 0;

        if (this.hpBar) {
            this.hpBar.setPercent(1);
        }

        // 出生时直接放到第一个路径点
        if (path.length > 0) {
            this.node.setPosition(path[0]);
            this.currentIndex = 1;
        }
        if (this.enemyStatu) this.enemyStatu.init();
    }

    protected update(dt: number): void {
        this.move(dt);
    }

    private move(dt: number): void {
        if (this.currentIndex >= this.route.length) {
            this.reachEnd();
            return;
        }

        const target = this.route[this.currentIndex];

        const direction = target.clone().sub(this.node.position);

        const distance = direction.mag();
        if (this.enemyStatu) {
            const moveDistance = this.enemyStatu.currentSpeed * dt;

            // 本帧能够到达目标
            if (distance <= moveDistance) {
                this.node.setPosition(target);

                this.currentIndex++;

                return;
            }

            direction.normalizeSelf();

            this.node.setPosition(
                this.node.x + direction.x * moveDistance,
                this.node.y + direction.y * moveDistance
            );
        }
    }

    public registerRecycleCallback(
        callback: (enemy: Enemy) => void
    ): void {
        this.recycleCallback = callback;
    }

    private reachEnd(): void {
        EventBus.Instance.emit("EnemyDisable");
        EventBus.Instance.emit("EnemyReached");

        if (this.recycleCallback) {
            this.recycleCallback(this);
        }
    }
    public takeDamage(damage: number): void {
        if (this.enemyStatu) {
            if (this.enemyStatu.isDead)
                return;

            this.enemyStatu.hp -= damage;
            DamageTextPool.Instance.showDamage(damage, this.node.position);

            if (this.enemyStatu.hp < 0) {
                this.enemyStatu.hp = 0;
            }

            if (this.hpBar) {
                this.hpBar.setPercent(this.enemyStatu.hp / this.enemyStatu.maxHP);
            }

            if (this.enemyStatu.hp <= 0) {
                this.dead();
            }
        }

    }

    /**
     * 死亡
     */
    private dead(): void {
        EventBus.Instance.emit("EnemyDisable");
        GoldManager.Instance.addGold(this.value);
        if (this.enemyStatu) {
            if (this.enemyStatu.isDead)
                return;

            this.enemyStatu.isDead = true;

            if (this.recycleCallback) {
                this.recycleCallback(this);
            }

        }
    }

}