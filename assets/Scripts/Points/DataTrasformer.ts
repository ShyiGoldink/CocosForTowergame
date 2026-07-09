const { ccclass } = cc._decorator;
import ConfigExtern from "../ConfigExtern";
import { LevelWaveData, Wave, MonsterGroup } from "../Enemy/EnemyDataModule";

@ccclass
export default class DataTransformer //静态类，用于场景切换时的数据中转
{
    //由于地图大小不变，所以数据结构也不会发生改变，使用Arrary而不是List用于减少内存开销
    private static readonly mapData: [number, number][][] =
        Array.from(
            { length: ConfigExtern.MAP_HEIGHT },
            () =>
                Array.from(
                    { length: ConfigExtern.MAP_WIDTH },
                    () => [0, 0] as [number, number]
                )
        );

    private static enemyData: LevelWaveData | null = null;//EnemyData类型，储存在“EnemyDataModule中”
    public static LoadMapFromJson(json: cc.JsonAsset): void //获取关卡的json
    {
        if (!json) {
            return;
        }

        const walls = json.json["walls"] as [number, number][][];

        if (!walls) {
            cc.error("DataTransformer: Json格式错误，缺少 walls。");
            return;
        }

        for (let y = 0; y < ConfigExtern.MAP_HEIGHT; y++) {
            for (let x = 0; x < ConfigExtern.MAP_WIDTH; x++) {
                const cell =
                    walls[
                    ConfigExtern.MAP_HEIGHT - 1 - y
                    ][x];

                if (!cell) {
                    this.mapData[y][x][0] = 0;
                    this.mapData[y][x][1] = 0;
                    continue;
                }

                this.mapData[y][x][0] = cell[0];
                this.mapData[y][x][1] = cell[1];
            }
        }
    }

    public static loadEnemyFromJson(json: cc.JsonAsset): void {
        if (!json) {
            cc.error("DataTransformer: Enemy Json为空");
            return;
        }
        const data = json.json;
        if (!data.waves) {
            cc.error(
                "DataTransformer: Json格式错误，缺少 waves"
            );
            return;
        }
        let levelData = new LevelWaveData();
        levelData.id = data.id;
        //遍历所有wave
        for (let waveJson of data.waves) {
            let wave = new Wave();
            wave.id =
                waveJson.id;
            wave.prepareTime =
                waveJson.prepareTime;
            if (!waveJson.groups) {
                cc.error(
                    "DataTransformer: wave缺少groups"
                );
                continue;
            }
            //遍历怪物组
            for (let groupJson of waveJson.groups) {
                let group =
                    new MonsterGroup();
                group.enemyType =
                    groupJson.enemyType;
                group.count =
                    groupJson.count;
                group.spawnInterval =
                    groupJson.spawnInterval;
                group.spawnPoint =
                    groupJson.spawnPoint;
                wave.groups.push(group);
            }
            levelData.waves.push(wave);
        }
        this.enemyData = levelData;
    }


    public static GetMapData(): [number, number][][]//向gridManager提供数据便于加载场景
    {
        return this.mapData;
    }
    public static GetEnemyData(): LevelWaveData | null//向EnemyManager提供数据用于加载怪物
    {
        return this.enemyData;
    }
}