import SaveLoad from "../Points/SaveLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IndexUIManager extends cc.Component//管理目录菜单
{
    @property(cc.Button)
    private gameStartButton: cc.Button | null = null;

    @property(cc.Button)
    private onlineModeButton: cc.Button | null = null;

    @property(cc.Button)
    private exitGame: cc.Button | null = null;

    @property(cc.Node)
    private pageIndex: cc.Node | null = null;
    @property(cc.Node)
    private pageLevels: cc.Node | null = null;

    protected start(): void // 显示indexPage，先不显示LevelsPage
    {
        this.backToIndex();
    }

    public onGameStart(): void {
        if (this.pageIndex)
            this.pageIndex.active = false;
        if (this.pageLevels)
            this.pageLevels.active = true;
        SaveLoad.init();
        SaveLoad.setNewGame();
    }

    public toLevels(): void {
        if (this.pageIndex)
            this.pageIndex.active = false;
        if (this.pageLevels)
            this.pageLevels.active = true;
    }

    public onExitGame(): void {
        cc.game.end();
    }

    public backToIndex(): void {
        if (SaveLoad.getHaveplayed) {
            if (this.pageIndex)
                this.pageIndex.active = false;
            if (this.pageLevels)
                this.pageLevels.active = true;
            return;
        }
        if (this.pageIndex)
            this.pageIndex.active = true;
        if (this.pageLevels)
            this.pageLevels.active = false;
    }

    public toIndex(): void {
        if (this.pageIndex)
            this.pageIndex.active = true;
        if (this.pageLevels)
            this.pageLevels.active = false;
    }
}
