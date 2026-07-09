export default class LevelSaveData {

    //关卡ID
    public id: number = 0;

    //是否解锁
    public unlock: boolean = false;

    //是否通关
    public isPassed: boolean = false;

    constructor(id: number = 0) {
        this.id = id;
    }
}