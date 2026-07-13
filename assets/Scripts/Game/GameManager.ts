import EventBus from "../EventBus";
import DataTransformer from "../Tool/DataTrasformer";
import SaveLoad from "../Points/SaveLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    private static instance: GameManager | null = null;
    @property(cc.Label)
    private heart: cc.Label | null = null;
    private lifes: number | number = 0;
    private isPaused: boolean = false;
    @property(cc.Node)
    private panel: cc.Node | null = null;
    @property(cc.Node)
    private failPanel: cc.Node | null = null;
    @property(cc.Node)
    private winPanel: cc.Node | null = null;

    public static getInstance(): GameManager | null {
        if (GameManager.instance == null) {
            console.error("GameManager 尚未初始化！");
        }
        return GameManager.instance;
    }

    protected onLoad(): void {
        if (GameManager.instance != null) {
            this.node.destroy();
            return;
        }
        GameManager.instance = this;
        this.lifes = DataTransformer.GetLife();
        if (this.panel) this.hidePanel();
        this.hideFailPanel();
        this.hideWinPanel();
        this.updateLife();
    }
    protected onEnable(): void {
        EventBus.Instance.on("EnemyReached", this.reduceLife, this);
        EventBus.Instance.on("win", this.showWinPanel, this);
    }
    protected onDisable(): void {
        EventBus.Instance.off("EnemyReached", this.reduceLife, this);
        EventBus.Instance.off("win", this.showWinPanel, this);
    }
    private reduceLife() {
        this.lifes--;
        this.updateLife();
    }
    private updateLife() {
        if (this.lifes <= 0) {
            this.lifes = 0;
            //然后处理失败逻辑
            //this.togglePause();
            this.showFailPanel();
        }
        this.heart!.string = this.lifes.toString();
    }

    private showFailPanel() {
        if (this.failPanel) this.failPanel.active = true;
    }
    private showWinPanel() {
        if (this.winPanel) this.winPanel.active = true;

    }
    private hideFailPanel() {
        if (this.failPanel) this.failPanel.active = false;
    }
    private hideWinPanel() {
        if (this.winPanel) this.winPanel.active = false;

    }
    protected onDestroy(): void {
        if (GameManager.instance === this) {
            GameManager.instance = null;
        }
    }

    public togglePause(): void {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            cc.director.pause();
        } else {
            cc.director.resume();
        }
    }

    public showPanel() {
        if (this.panel) this.panel.active = true;
    }
    public hidePanel() {
        if (this.panel) this.panel.active = false;
    }
    public exitAndPass() {
        SaveLoad.passIt();//通关的效果
        cc.director.loadScene("LevelScene");
    }
    public exitNotPass() {
        cc.director.loadScene("LevelScene");
    }
}