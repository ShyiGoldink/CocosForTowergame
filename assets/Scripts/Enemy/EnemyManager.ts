const { ccclass, property } = cc._decorator;

import BornBlock from "../Walls/BornBlock";
import EnemyPool from "./EnemyPool";
import { LevelWaveData } from "./EnemyDataModule";
import DataTransformer from "../Points/DataTrasformer";
import EventBus from "../EventBus";
import StatusManager, { GameStatus } from "../Game/StatusManager";

export enum EnemyState {
    Prepare,
    Spawn,
    WaitingClear,     // 新增：等待当前波怪物全部死亡
    Finish
}

@ccclass
export default class EnemyManager extends cc.Component {

    private static _instance: EnemyManager = null!;

    public static get Instance(): EnemyManager {
        return this._instance;
    }

    // 数据
    private enemyData: LevelWaveData | null = null;
    private bornBlocks: BornBlock[] = [];

    @property(EnemyPool)
    private smallPool: EnemyPool = null!;

    @property(EnemyPool)
    private bossPool: EnemyPool = null!;

    private pools: EnemyPool[] = [];

    // 状态
    private _enemyState: EnemyState = EnemyState.Prepare;

    private currentWave = 0;
    private currentGroup = 0;

    // 当前Wave统计
    private bornedEnemy = 0;
    private deadEnemy = 0;
    private sumEnemyNum = 0;

    private sumWave = 0;

    private timer = 0;

    @property(cc.Label)
    private label: cc.Label = null!;

    public registerBornBlock(id: number, born: BornBlock): void {
        this.bornBlocks[id] = born;
    }

    protected onLoad(): void {

        EnemyManager._instance = this;

        this.enemyData = DataTransformer.GetEnemyData();

        if (!this.enemyData) {
            return;
        }

        this.sumWave = this.enemyData.waves.length;

        this.pools[1] = this.smallPool;
        this.pools[2] = this.bossPool;

        this.timer =
            this.enemyData.waves[0].prepareTime;

        this._enemyState =
            EnemyState.Prepare;
    }

    protected onEnable(): void {

        EventBus.Instance.on(
            "EnemyDisable",
            this.handleEnemyDead,
            this
        );

    }

    protected onDisable(): void {

        EventBus.Instance.off(
            "EnemyDisable",
            this.handleEnemyDead,
            this
        );

    }

    protected update(dt: number): void {

        if (this._enemyState == EnemyState.Finish)
            return;

        switch (this._enemyState) {

            case EnemyState.Prepare:

                this.waitForStart(dt);

                break;

            case EnemyState.Spawn:

                this.spawnEnemy(dt);

                break;

            case EnemyState.WaitingClear:

                // 等待所有敌人死亡
                break;
        }
    }

    //-----------------------------------------

    private waitForStart(dt: number): void {

        this.timer -= dt;

        if (this.label)
            this.label.string = this.timer.toFixed(1);

        if (this.timer > 0)
            return;

        let wave =
            this.enemyData!.waves[this.currentWave];

        // 重置Wave统计
        this.currentGroup = 0;

        this.bornedEnemy = 0;

        this.deadEnemy = 0;

        // 计算这一波总怪物数量
        this.sumEnemyNum = 0;

        for (let group of wave.groups) {

            this.sumEnemyNum += group.count;

        }

        this.timer =
            wave.groups[0].spawnInterval;

        this._enemyState =
            EnemyState.Spawn;
        StatusManager.setStatus(GameStatus.Battle);
    }

    //-----------------------------------------

    private spawnEnemy(dt: number): void {

        this.timer -= dt;

        if (this.timer > 0)
            return;

        let wave =
            this.enemyData!.waves[this.currentWave];

        // 防止Group越界
        if (this.currentGroup >= wave.groups.length) {

            this._enemyState =
                EnemyState.WaitingClear;

            return;
        }

        let group =
            wave.groups[this.currentGroup];

        let born =
            this.bornBlocks[group.spawnPoint];

        if (!born)
            return;

        let pool =
            this.pools[group.enemyType];

        if (!pool)
            return;

        let path =
            born.getPathVec3(this.node);

        pool.spwanEnemy(
            this.node,
            path[0],
            path
        );

        group.count--;

        this.bornedEnemy++;

        // 当前Group生成完成
        if (group.count <= 0) {

            this.currentGroup++;

            // 所有Group都生成完
            if (this.currentGroup >= wave.groups.length) {

                this._enemyState =
                    EnemyState.WaitingClear;

                return;
            }

            // 下一Group
            this.timer =
                wave.groups[this.currentGroup].spawnInterval;

            return;
        }

        // 下一只
        this.timer =
            group.spawnInterval;
    }

    //-----------------------------------------

    private nextWave(): void {

        this.currentWave++;

        if (this.currentWave >= this.sumWave) {
            this._enemyState =
                EnemyState.Finish;
            StatusManager.setStatus(GameStatus.Finish);
            EventBus.Instance.emit("win");
            //这里写获胜事件
            return;
        }

        this.timer =
            this.enemyData!
                .waves[this.currentWave]
                .prepareTime;
        StatusManager.setStatus(GameStatus.Prepare);
        this._enemyState =
            EnemyState.Prepare;
    }

    //-----------------------------------------

    private handleEnemyDead(): void {

        this.deadEnemy++;
        cc.log(
            this.deadEnemy,
            "/",
            this.sumEnemyNum
        );
        // 当前Wave所有怪都死了
        if (this.deadEnemy >= this.sumEnemyNum) {

            this.nextWave();

        }
    }

    public skip() {
        if (this._enemyState == EnemyState.Prepare && this.timer > 3) {
            this.timer = 3;
        }
    }

}