const { ccclass, property } = cc._decorator;
import BasicBlock from "../Walls/BasicBlock";

@ccclass
export default class GridCell//本类是数据结构类，用于储存每一个最底层的格子，用于GridManager的中的二维数组管理
{
    private readonly x: number = 0;
    private readonly y: number = 0;
    private bb: BasicBlock | null = null;

    //用于A*寻路
    private parent: GridCell | null = null;
    private g: number = Number.MAX_SAFE_INTEGER;
    private h: number = 0;
    private inCloseList: boolean = false;

    constructor(outX: number, outY: number)//初始化构造函数
    {
        this.x = outX;
        this.y = outY;
    }

    public setBlock(outBB: BasicBlock): void//修改内部bb
    {
        cc.log(
            "Block Saved:",
            this.x,
            this.y
        );
        this.bb = outBB;
    }

    public removeBlock(): void//移除方块占位
    {
        this.bb = null;
    }

    public get isEmpty(): boolean//检查内部是否为空
    {
        return this.bb == null;
    }

    public get getX(): number {
        return this.x;
    }
    public get getY(): number {
        return this.y;
    }

    //effect: CellEffect | null;格子的特殊效果，之后再讨论实机安装
    //A*寻路
    public get getParent(): GridCell | null {
        return this.parent;
    }

    public setParent(cell: GridCell | null): void {
        this.parent = cell;
    }

    public get getG(): number {
        return this.g;
    }

    public setG(value: number): void {
        this.g = value;
    }

    public get getH(): number {
        return this.h;
    }

    public setH(value: number): void {
        this.h = value;
    }

    public get isClosed(): boolean {
        return this.inCloseList;
    }

    public setClosed(value: boolean): void {
        this.inCloseList = value;
    }
    //恢复
    public resetPathData(): void {
        this.parent = null;
        this.g = Number.MAX_SAFE_INTEGER;
        this.h = 0;
        this.inCloseList = false;
    }
}