import EventBus from "../EventBus";
import TowerData from "../Tower/TowerData";
import Wall from "../Map/Blocks/Wall";
import GoldManager from "../Game/GoldManager";
import { GameStatus } from "../Game/StatusManager";
import ConfigExtern from "../ConfigExtern";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerBuyer extends cc.Component//购买Tower专用脚本
{
    //一共三个page
    @property({ type: cc.Node, visible: true, })
    private _buildPage: cc.Node | null = null;
    @property({ type: cc.Node, visible: true, })
    private _upPage: cc.Node | null = null;
    @property({ type: cc.Node, visible: true, })
    private _directionPage: cc.Node | null = null;
    @property({ type: cc.Node, visible: true, })
    private _world: cc.Node | null = null;
    @property({ type: cc.Node, visible: true, })
    private _rangePanel: cc.Node | null = null;

    //三个预制体，用于buildTower
    @property({ type: cc.Prefab, visible: true, })
    private _normalTower: cc.Prefab | null = null;
    @property({ type: cc.Prefab, visible: true, })
    private _strightTower: cc.Prefab | null = null;
    @property({ type: cc.Prefab, visible: true, })
    private _iceTower: cc.Prefab | null = null;

    private _currentWall: Wall = new Wall();

    protected start(): void {
        this.node.scale = 0;
        this.node.zIndex = 114;
    }
    protected onEnable(): void {
        EventBus.Instance.on("WallClicked", this.showPage, this);
        EventBus.Instance.on("statusChanged", this.onBattle, this);
    }
    protected onDisable(): void {
        EventBus.Instance.off("WallClicked", this.showPage, this);
        EventBus.Instance.off("statusChanged", this.onBattle, this);
    }
    private onBattle(status: GameStatus) {
        if (status == GameStatus.Battle) {
            this.closePage();
        }
    }
    private showPage(wall: Wall) {
        this.closePage();
        this.node.scale = 1;
        this.node.position = wall.node.position;
        this._currentWall = wall;
        if (wall.towerData != null) {
            if (this._upPage) {
                this._upPage.active = true;
                this.updateRangePanel();
            }
        } else {
            if (this._buildPage) this._buildPage.active = true;
        }
    }

    public buyNormalPage() {
        this.closePage();
        if (GoldManager.Instance.reduceGold(ConfigExtern.CostTowerO)) {
            if (!this._normalTower) {
                return;
            }
            const tower = cc.instantiate(this._normalTower);

            if (this._world) {
                const worldPos = this._currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                const localPos = this._world.convertToNodeSpaceAR(worldPos);
                tower.parent = this._world;
                tower.setPosition(localPos.add(cc.v3(ConfigExtern.WALL_SIZE / 4, ConfigExtern.WALL_SIZE / 4)));
                this._currentWall.towerData = tower.getComponent("TowerData");
            }
        }
    }
    public buyIcePage() {
        this.closePage();
        if (GoldManager.Instance.reduceGold(ConfigExtern.CostTowerI)) {
            if (!this._iceTower) {
                return;
            }
            const tower = cc.instantiate(this._iceTower);

            if (this._world) {
                const worldPos = this._currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                const localPos = this._world.convertToNodeSpaceAR(worldPos);
                tower.parent = this._world;
                tower.setPosition(localPos.add(cc.v3(ConfigExtern.WALL_SIZE / 4, ConfigExtern.WALL_SIZE / 4)));
                this._currentWall.towerData = tower.getComponent("TowerData");
            }
        }
    }

    public buyStraightPage() {
        if (GoldManager.Instance.reduceGold(ConfigExtern.CostTowerF)) {
            this.showDirctionPage();
        }
    }
    public showDirctionPage() {
        this.closePage();
        this.node.scale = 1;
        if (this._directionPage) {
            this._directionPage.active = true;
        }
    }

    public instantiateStright(dir: cc.Vec2) {
        this.closePage();
        if (!this._strightTower) {
            return;
        }
        const tower = cc.instantiate(this._strightTower);
        if (this._world) {
            const worldPos = this._currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const localPos = this._world.convertToNodeSpaceAR(worldPos);
            tower.parent = this._world;
            tower.setPosition(localPos.add(cc.v3(ConfigExtern.WALL_SIZE / 4, ConfigExtern.WALL_SIZE / 4)));
            this._currentWall.towerData = tower.getComponent("TowerData");
            if (this._currentWall.towerData) this._currentWall.towerData.TowerPosition = dir;
        }
    }
    public strightTowerUp() { this.instantiateStright(cc.v2(0, 1)); }
    public strightTowerdown() { this.instantiateStright(cc.v2(0, -1)); }
    public strightTowerright() { this.instantiateStright(cc.v2(1, 0)); }
    public strightTowerleft() { this.instantiateStright(cc.v2(-1, 0)); }


    public closePage() {
        this.node.scale = 0;
        if (this._buildPage && this._upPage && this._directionPage) {
            this._buildPage.active = false;
            this._upPage.active = false;
            this._directionPage.active = false;
        }
        if (this._rangePanel) {
            this._rangePanel.active = false;
        }
    }

    public upSpeed() {
        if (!GoldManager.Instance.reduceGold(250)) return;
        if (this._currentWall.towerData) {
            this._currentWall.towerData.AttackSpeed += 0.1;
        }
    }
    public upRange() {
        if (!GoldManager.Instance.reduceGold(500)) return;
        if (this._currentWall.towerData) {
            this._currentWall.towerData.Range += 1;
            this.updateRangePanel();
        }
    }
    public upAttack() {
        if (!GoldManager.Instance.reduceGold(100)) return;
        if (this._currentWall.towerData) {
            this._currentWall.towerData.Attck += 0.5;
        }
    }
    private updateRangePanel(): void {

        if (!this._rangePanel) {
            return;
        }

        if (!this._currentWall.towerData) {
            this._rangePanel.active = false;
            return;
        }

        this._rangePanel.active = true;
        const diameter = this._currentWall.towerData.Range * 2;
        this._rangePanel.width = diameter;
        this._rangePanel.height = diameter;
    }
    public sellTower() {
        this.closePage();
        this._currentWall.towerData?.DestoryTower();
        this._currentWall.towerData = null;
        GoldManager.Instance.addGold(ConfigExtern.SellTowerCost);
    }
}
