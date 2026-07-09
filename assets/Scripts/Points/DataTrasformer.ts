const { ccclass } = cc._decorator;
import ConfigExtern from "../ConfigExtern";

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

    public static LoadFromJson(json: cc.JsonAsset): void //获取关卡的json
    {
        if (!json) {
            cc.error("DataTransformer: JsonAsset为空！");
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


    public static GetData(): [number, number][][]//向gridManager提供数据便于加载场景
    {
        return this.mapData;
    }

}