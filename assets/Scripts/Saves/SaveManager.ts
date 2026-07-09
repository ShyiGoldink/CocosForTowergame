import ConfigExtern from "../ConfigExtern";
import LevelSaveData from "./LevelSaveData";

export default class SaveManager {

    //所有关卡数据
    private static levelList: LevelSaveData[] = [];

    //--------------------------------------------------
    //读取存档
    //--------------------------------------------------
    public static load(): void {

        const json = cc.sys.localStorage.getItem(ConfigExtern.SAVE_KEY);

        if (json == null) {
            this.levelList = [];
            return;
        }

        this.levelList = JSON.parse(json);
    }

    //--------------------------------------------------
    //保存存档
    //--------------------------------------------------
    public static save(): void {

        const json = JSON.stringify(this.levelList);

        cc.sys.localStorage.setItem(ConfigExtern.SAVE_KEY, json);
    }

    //--------------------------------------------------
    //获取全部关卡
    //--------------------------------------------------
    public static getLevelList(): LevelSaveData[] {

        return this.levelList;
    }

    //--------------------------------------------------
    //根据ID获取关卡
    //--------------------------------------------------
    public static getLevel(id: number): LevelSaveData | null {

        for (let level of this.levelList) {

            if (level.id == id) {
                return level;
            }
        }

        return null;
    }

    //--------------------------------------------------
    //新增关卡
    //--------------------------------------------------
    public static addLevel(level: LevelSaveData): void {

        this.levelList.push(level);

        this.save();
    }

    //--------------------------------------------------
    //设置通关
    //--------------------------------------------------
    public static setPassed(id: number): void {

        let level = this.getLevel(id);

        if (level == null)
            return;

        level.isPassed = true;

        this.save();
    }

    //--------------------------------------------------
    //设置解锁
    //--------------------------------------------------
    public static setUnlock(id: number): void {

        let level = this.getLevel(id);

        if (level == null)
            return;

        level.unlock = true;

        this.save();
    }

    //--------------------------------------------------
    //清空存档
    //--------------------------------------------------
    public static clear(): void {

        this.levelList = [];

        this.save();
    }

}