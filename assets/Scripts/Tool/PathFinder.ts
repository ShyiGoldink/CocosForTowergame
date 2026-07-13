const { ccclass } = cc._decorator;

import GridCell from "../Map/Grid/GridCell";
import GridManager from "../Map/Grid/GridManager";
import GridLeader from "./GridLeader";
import GridData from "../Map/Grid/GridData";

@ccclass
export default class PathFinder {
    // Open列表
    private static openList: GridCell[] = [];

    // 最终路径
    private static path: GridCell[] = [];
    public static isFinding: boolean = false;
    private static _gridLeader: GridLeader = new GridLeader();
    /**
     * 返回Cell路径
     */
    public static FindPath(start: GridCell): GridCell[] //查找，但是返回的是GridCell版本的路线
    {
        this.isFinding = true;
        this.openList.length = 0;
        this.path.length = 0;

        const end = GridManager.Instance.getEndCell();

        // 重置所有节点
        for (const row of GridManager.Instance.getMap) {
            for (const cell of row) {
                cell.resetPathData();
            }
        }

        start.setG(0);
        start.setH(
            Math.abs(start.getX - end.getX) +
            Math.abs(start.getY - end.getY)
        );

        this.openList.push(start);

        while (this.openList.length > 0) {
            const current = this.getBestNode();

            current.setClosed(true);

            if (current === end) {
                this.buildPath(end);
                return this.path;
            }

            this.expandNode(current, end);
        }
        this.isFinding = false;
        // 找不到路
        return [];
    }

    public static FindWorldPath(start: GridCell): cc.Vec2[] //查找，并且返回的是世界坐标的版本
    {
        this.isFinding = true;
        const cellPath = this.FindPath(start);

        const result: cc.Vec2[] = [];

        for (const cell of cellPath) {
            result.push(
                this._gridLeader.gridToWorld(cell)
            );
        }
        this.isFinding = false;
        return result;
    }

    /**
     * OpenList中F值最小的节点
     */
    private static getBestNode(): GridCell {
        let best = this.openList[0];
        let index = 0;

        for (let i = 1; i < this.openList.length; i++) {
            const node = this.openList[i];

            if (node.getG + node.getH < best.getG + best.getH) {
                best = node;
                index = i;
            }
        }

        this.openList.splice(index, 1);

        return best;
    }

    /**
     * 扩展邻居
     */
    private static expandNode(current: GridCell, end: GridCell): void {
        const neighbors = GridManager.Instance.getNeighbors(current);

        for (const next of neighbors) {
            if (next.isClosed) {
                continue;
            }

            const newG = current.getG + 1;

            if (newG < next.getG) {
                next.setParent(current);

                next.setG(newG);

                next.setH(
                    Math.abs(next.getX - end.getX) +
                    Math.abs(next.getY - end.getY)
                );

                if (!this.openList.includes(next)) {
                    this.openList.push(next);
                }
            }
        }
    }

    /**
     * 回溯路径
     */
    private static buildPath(end: GridCell): void {
        this.path.length = 0;

        let current: GridCell | null = end;

        while (current) {
            this.path.push(current);
            current = current.getParent;
        }

        this.path.reverse();
    }
}