const { ccclass, property } = cc._decorator;
import DataTransformer from "./DataTrasformer";

@ccclass
export default class Point extends cc.Component {

    @property([Point])
    private childPoints: Point[] = [];
    @property
    private ID: number = 0;//唯一编号
    private isPassed: boolean = false;//是否通关
    @property(cc.JsonAsset)//使用json文件进行数据驱动
    private initData: cc.JsonAsset | null = null;
    @property(cc.JsonAsset)//怪物的数据
    private enemyData: cc.JsonAsset | null = null;


    public get getPointId(): number//获取Id
    {
        return this.ID;
    }

    public OnClicked(): void //加载游戏场景的逻辑
    {

        //必须先把关卡数据交给静态类
        if (this.initData)
            DataTransformer.LoadMapFromJson(this.initData);
        if (this.enemyData)
            DataTransformer.loadEnemyFromJson(this.enemyData);

        //然后才能切换场景
        cc.director.loadScene("GameScene");

    }

    public setIsPassed(statu: boolean): void {
        this.isPassed = statu;
    }

    public get getIsPassed(): boolean {
        return this.isPassed;
    }

    public get getChildPoints(): Point[] {
        return this.childPoints;
    }

}