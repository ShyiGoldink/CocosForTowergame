const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawTool extends cc.Component {

    @property(cc.Prefab)
    private drawPrefab: cc.Prefab = null!;

    private static _instance: DrawTool = null!;

    public static get Instance(): DrawTool {
        return this._instance;
    }

    private drawNodes: cc.Node[] = [];

    protected onLoad(): void {
        if (DrawTool._instance && DrawTool._instance !== this) {
            this.node.destroy();
            return;
        }
        DrawTool._instance = this;
        // 提前创建4个节点
        for (let i = 0; i < 4; i++) {

            const node = cc.instantiate(this.drawPrefab);
            node.parent = this.node;
            node.active = false;

            this.drawNodes.push(node);
        }
    }

    /**
     * 绘制预览
     * @param blocks 四个格子的坐标
     * @param canBuild true 蓝色 false 红色
     */
    public draw(blocks: cc.Vec2[], canBuild: boolean): void {

        this.clear();

        const color = canBuild ? cc.Color.BLUE : cc.Color.RED;

        for (let i = 0; i < blocks.length; i++) {

            const node = this.drawNodes[i];

            node.active = true;

            // 格子中心
            node.setPosition(
                blocks[i].x * 64 + 48,
                blocks[i].y * 64 + 48
            );

            node.color = color;
        }
    }

    /**
     * 清除绘制
     */
    public clear(): void {

        for (const node of this.drawNodes) {
            node.active = false;
        }
    }
    public drawEsure(blocks: cc.Vec2[]): void {

        const color = cc.Color.WHITE;
        for (let i = 0; i < blocks.length; i++) {
            const node = this.drawNodes[i];
            node.active = true;
            // 格子中心
            node.setPosition(
                blocks[i].x * 64 + 48,
                blocks[i].y * 64 + 48
            );
            node.color = color;
        }
    }

}
