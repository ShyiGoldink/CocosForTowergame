const { ccclass, property } = cc._decorator;

export class MonsterGroup {
    public enemyType: number = 0;
    public count: number = 0;
    public spawnInterval: number = 0;
    public spawnPoint: number = 0;
}
export class Wave {
    public id: number = 0;
    public prepareTime: number = 0;
    public groups: MonsterGroup[] = [];
}
export class LevelWaveData {
    public id: number = 0;
    public waves: Wave[] = [];
}
