import EventBus from "../EventBus";
import TowerData from "../Tower/TowerData";
import Wall from "../Walls/Wall";
import GoldManager from "./GoldManager";
import { GameStatus } from "./StatusManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerBuyer extends cc.Component//购买Tower专用脚本
{
    //一共三个page
    @property(cc.Node)
    private buildPage: cc.Node | null = null;
    @property(cc.Node)
    private upPage: cc.Node | null = null;
    @property(cc.Node)
    private directionPage: cc.Node | null = null;
    @property(cc.Node)
    private world: cc.Node | null = null;
    @property(cc.Node)
    private rangePanel: cc.Node | null = null;

    //三个预制体，用于buildTower
    @property(cc.Prefab)
    private normalTower: cc.Prefab | null = null;
    @property(cc.Prefab)
    private strightTower: cc.Prefab | null = null;
    @property(cc.Prefab)
    private iceTower: cc.Prefab | null = null;

    private currentWall: Wall = new Wall();
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
        this.currentWall = wall;
        if (wall.towerData != null) {
            if (this.upPage) {
                this.upPage.active = true;
                this.updateRangePanel();
            }
        } else {
            if (this.buildPage) this.buildPage.active = true;
        }
    }

    public buyNormalPage() {
        this.closePage();
        if (GoldManager.Instance.reduceGold(100)) {
            if (!this.normalTower) {
                return;
            }
            const tower = cc.instantiate(this.normalTower);

            if (this.world) {
                const worldPos = this.currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                const localPos = this.world.convertToNodeSpaceAR(worldPos);
                tower.parent = this.world;
                tower.setPosition(localPos.add(cc.v3(16, 16)));
                this.currentWall.towerData = tower.getComponent("TowerData");
            }
        }
    }
    public buyIcePage() {
        this.closePage();
        if (GoldManager.Instance.reduceGold(175)) {
            if (!this.iceTower) {
                return;
            }
            const tower = cc.instantiate(this.iceTower);

            if (this.world) {
                const worldPos = this.currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                const localPos = this.world.convertToNodeSpaceAR(worldPos);
                tower.parent = this.world;
                tower.setPosition(localPos.add(cc.v3(16, 16)));
                this.currentWall.towerData = tower.getComponent("TowerData");
            }
        }
    }

    public buyStraightPage() {
        if (GoldManager.Instance.reduceGold(125)) {
            this.showDirctionPage();
        }
    }
    public showDirctionPage() {
        this.closePage();
        this.node.scale = 1;
        if (this.directionPage) {
            this.directionPage.active = true;
        }
    }

    public instantiateStright(dir: cc.Vec2) {
        this.closePage();
        if (!this.strightTower) {
            return;
        }
        const tower = cc.instantiate(this.strightTower);

        if (this.world) {
            const worldPos = this.currentWall.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const localPos = this.world.convertToNodeSpaceAR(worldPos);
            tower.parent = this.world;
            tower.setPosition(localPos.add(cc.v3(16, 16)));
            this.currentWall.towerData = tower.getComponent("TowerData");
            if (this.currentWall.towerData) this.currentWall.towerData.towerPosition = dir;
        }
    }
    public strightTowerUp() { this.instantiateStright(cc.v2(0, 1)); }
    public strightTowerdown() { this.instantiateStright(cc.v2(0, -1)); }
    public strightTowerright() { this.instantiateStright(cc.v2(1, 0)); }
    public strightTowerleft() { this.instantiateStright(cc.v2(-1, 0)); }


    public closePage() {
        this.node.scale = 0;
        if (this.buildPage && this.upPage && this.directionPage) {
            this.buildPage.active = false;
            this.upPage.active = false;
            this.directionPage.active = false;
        }
        if (this.rangePanel) {
            this.rangePanel.active = false;
        }
    }

    public upSpeed() {
        if (!GoldManager.Instance.reduceGold(250)) return;
        if (this.currentWall.towerData) {
            this.currentWall.towerData.attackSpeed += 0.1;
        }
    }
    public upRange() {
        if (!GoldManager.Instance.reduceGold(500)) return;
        if (this.currentWall.towerData) {
            this.currentWall.towerData.range += 1;
            this.updateRangePanel();
        }
    }
    public upAttack() {
        if (!GoldManager.Instance.reduceGold(100)) return;
        if (this.currentWall.towerData) {
            this.currentWall.towerData.attck += 0.5;
        }
    }
    private updateRangePanel(): void {

        if (!this.rangePanel) {
            return;
        }

        if (!this.currentWall.towerData) {
            this.rangePanel.active = false;
            return;
        }

        this.rangePanel.active = true;

        const diameter = this.currentWall.towerData.range * 2;

        this.rangePanel.width = diameter;
        this.rangePanel.height = diameter;
    }
}
