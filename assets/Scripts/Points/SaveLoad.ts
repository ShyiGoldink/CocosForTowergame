import JsonManager from "./JsonManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SaveLoad//一个储存的静态类，只用于储存数据，对于这个游戏来说，储存的就是已经通关的节点Id
{
    private static passedPoints: number[] = [];//初始化时空的
    private static currentPoint: number = 0;//每次从levels进入游戏时，需要修改
    private static havePlayed: boolean = false;//标志位，如果是从游玩场景返回到level场景时，调整为true，同时设置UImanager确保直接进入的是level而不是index
    private static isNewGame: boolean = false;

    public static setNewGame() {
        this.isNewGame = true;
    }

    public static setContinueGame() {
        this.isNewGame = false;
    }
    public static getIsNewGame(): boolean {
        return this.isNewGame;
    }
    public static get getHaveplayed(): boolean {
        return this.havePlayed;
    }

    public static get getPassedPoints(): number[] {
        return this.passedPoints;
    }

    public static setCurrentPoint(id: number) {
        this.currentPoint = id;
    }

    public static setPassedPoint(id: number) {
        for (let it of this.passedPoints) {
            if (it == id) return;
        }
        this.passedPoints.push(id);
    }

    public static init(): void//清理状态
    {
        this.passedPoints = [];
        this.havePlayed = false;
        this.currentPoint = 0;
    }

    public static initNormalGame() {
        JsonManager.readNormalDaya();
        this.passedPoints = JsonManager.getNormalData();
    }

    public static passIt() {
        this.setPassedPoint(this.currentPoint);
        JsonManager.setSavedNormalData(this.passedPoints);
        JsonManager.saveNoramlData();
    }

    public static setOnGame() {
        this.havePlayed = true;
    }
}
