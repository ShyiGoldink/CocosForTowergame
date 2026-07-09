const { ccclass, property } = cc._decorator;
import EventBus from "../EventBus";

@ccclass
export default class Enemy extends cc.Component {
    @property
    private hp: number = 0;

    @property
    private speed: number = 100;

    @property
    private damage: number = 0;
    private route: cc.Vec3[] = [];
    private currentIndex: number = 0;
    private recycleCallback: ((enemy: Enemy) => void) | null = null;

    public init(path: cc.Vec3[]): void {
        this.route = path;
        this.currentIndex = 0;

        // 出生时直接放到第一个路径点
        if (path.length > 0) {
            this.node.setPosition(path[0]);
            this.currentIndex = 1;
        }
    }

    protected update(dt: number): void {
        this.move(dt);
    }

    private move(dt: number): void {
        if (this.currentIndex >= this.route.length) {
            this.reachEnd();
            return;
        }

        const target = this.route[this.currentIndex];

        const direction = target.clone().sub(this.node.position);

        const distance = direction.mag();

        const moveDistance = this.speed * dt;

        // 本帧能够到达目标
        if (distance <= moveDistance) {
            this.node.setPosition(target);

            this.currentIndex++;

            return;
        }

        direction.normalizeSelf();

        this.node.setPosition(
            this.node.x + direction.x * moveDistance,
            this.node.y + direction.y * moveDistance
        );
    }

    public registerRecycleCallback(
        callback: (enemy: Enemy) => void
    ): void {
        this.recycleCallback = callback;
    }

    private reachEnd(): void {
        EventBus.Instance.emit("EnemyDisable");
        cc.log("event submit");
        if (this.recycleCallback) {
            this.recycleCallback(this);
        }
    }
}