const { ccclass, property } = cc._decorator;

@ccclass
export default class EventBus {
    private static _eventTarget: cc.EventTarget = new cc.EventTarget();
    public static get Instance(): cc.EventTarget {
        return this._eventTarget;
    }

}
