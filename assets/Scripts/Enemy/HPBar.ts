const { ccclass } = cc._decorator;

@ccclass
export default class HPBar extends cc.Component {

    /**
     * 设置血量百分比
     * @param percent 0~1
     */
    public setPercent(percent: number): void {

        percent = Math.max(0, Math.min(1, percent));

        this.node.scaleX = percent;

    }

}