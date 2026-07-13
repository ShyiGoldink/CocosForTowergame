import EventBus from "../EventBus";

const { ccclass } = cc._decorator;

// 游戏状态枚举
export enum GameStatus {
    Index = "Index",       // 菜单
    Prepare = "Prepare",   // 准备阶段
    Pause = "Pause",       // 暂停阶段
    Battle = "Battle",     // 战斗阶段
    Finish = "Finish"      // 结束阶段
}

@ccclass
export default class StatusManager {

    private static _currentStatus: GameStatus = GameStatus.Index;
    private static _isEndlessMode: boolean = false;
    public static getStatus(): GameStatus {
        return StatusManager._currentStatus;
    }
    public static setStatus(status: GameStatus): void {
        StatusManager._currentStatus = status;
        EventBus.Instance.emit("statusChanged", this._currentStatus);
    }
    //设置游戏模式，用于区分当前游戏状态
    public static setGameMode(mode: boolean): void {
        this._isEndlessMode = mode;
    }
    public static get getGameMode(): boolean {
        return this._isEndlessMode;
    }
}