const { ccclass, property } = cc._decorator;
import BasicBlock from "../Blocks/BasicBlock";

@ccclass
export default class GridCell//本类是数据结构类，用于储存每一个最底层的格子，用于GridManager的中的二维数组管理
{
    private readonly _x: number = 0;//x
    private readonly _y: number = 0;//y
    private _basicBlock: BasicBlock | null = null;//使用BasicBlock占位，后续Walls等类都可以放在这里

    //用于A*寻路
    private _parent: GridCell | null = null;
    private _g: number = Number.MAX_SAFE_INTEGER;
    private _h: number = 0;
    private _inCloseList: boolean = false;

    private _Temporary: boolean = false;//代表这个cell上的是否是临时的方块，用于ghost检测

    constructor(outX: number, outY: number)//初始化构造函数
    {
        this._x = outX;
        this._y = outY;
    }

    public setBlock(outBB: BasicBlock): void//修改内部bb
    {
        this._basicBlock = outBB;
    }

    public removeBlock(): void//移除方块占位
    {
        this._basicBlock = null;
    }

    public get isEmpty(): boolean//检查内部是否为空
    {
        return this._basicBlock == null;
    }

    public get getX(): number {
        return this._x;
    }
    public get getY(): number {
        return this._y;
    }

    //effect: CellEffect | null;格子的特殊效果，之后再讨论实机安装
    //A*寻路
    public get getParent(): GridCell | null {
        return this._parent;
    }

    public setParent(cell: GridCell | null): void {
        this._parent = cell;
    }

    public get getG(): number {
        return this._g;
    }

    public setG(value: number): void {
        this._g = value;
    }

    public get getH(): number {
        return this._h;
    }

    public setTemporary(bool: boolean) {
        this._Temporary = bool;
    }

    public get getTemporary(): boolean {
        return this._Temporary;
    }

    public setH(value: number): void {
        this._h = value;
    }

    public get isClosed(): boolean {
        return this._inCloseList;
    }

    public setClosed(value: boolean): void {
        this._inCloseList = value;
    }
    //恢复
    public resetPathData(): void {
        this._parent = null;
        this._g = Number.MAX_SAFE_INTEGER;
        this._h = 0;
        this._inCloseList = false;
    }
    public getBlock(): BasicBlock {
        if (this._basicBlock) return this._basicBlock;
        return new BasicBlock();
    }
}