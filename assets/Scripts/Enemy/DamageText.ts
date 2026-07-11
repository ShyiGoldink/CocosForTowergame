const { ccclass } = cc._decorator;

@ccclass
export default class DamageText extends cc.Component {

    private label: cc.Label = null!;

    protected onLoad() {
        this.label = this.getComponent(cc.Label);
    }

    public show(
        damage: number,
        finish: Function
    ): void {

        this.label.string = damage.toString();

        cc.tween(this.node)
            .by(0.6, {
                y: 50,
                opacity: -255
            })
            .call(() => {
                finish();
            })
            .start();
    }
}