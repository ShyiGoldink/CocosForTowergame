export default class ConfigExtern {
    public static readonly MAP_WIDTH = 20;
    public static readonly MAP_HEIGHT = 15;
    public static readonly GRID_SIZE = 64;
    public static readonly WALL_SIZE = 96;
    public static readonly SAVE_KEY = "LevelSave";
    public static readonly TYPE_WALL = 1;
    public static readonly TYPE_ENDBLOCK = 2;
    public static readonly TYPE_BORNBLOCK = 3;
    public static CostTowerO = 100;
    public static CostTowerI = 175;
    public static CostTowerF = 125;
    public static SellTowerCost = 50;
}
/*
    伪代码的怪物波数数据结构
    struct monster{
        int num;
        int enmuType;
        float bornInterval;
    }
    struct wave{
        int id;
        float restInterval;
        Vector<monster> wave;
    }
    Vector<Vector[wave]> waves;

    第一关数据：
    波数一：
    准备时间：45s
    出生点0:
    10个小怪（1）
    0.2s一个
    第二波：
    准备时间45s
    出生点0:
    15个小怪
    0.2s一个
    第三波：
    准备时间45s
    出生点0:
    10个小怪
    0.1s一个
    1个大怪（2）
    0.5s一个
*/