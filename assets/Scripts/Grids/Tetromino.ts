const { ccclass, property } = cc._decorator;

@ccclass
export default class Tetromino {


    private tetrimuniType: Number = 0;//1 is L,2 is T,3 is I,4 is O,5 is Z
    constructor(num: Number) {
        this.tetrimuniType = num;
        this.init();
    }
    private LType: cc.Vec2[][] = [
        // 0°
        [
            cc.v2(0, 0),
            cc.v2(0, -1),
            cc.v2(0, -2), cc.v2(1, -2)
        ],
        // 90°
        [
            cc.v2(0, 0), cc.v2(1, 0), cc.v2(2, 0),
            cc.v2(0, -1)
        ],
        // 180°
        [
            cc.v2(0, 0), cc.v2(1, 0),
            /*        */cc.v2(1, -1),
            /*        */cc.v2(1, -2)
        ],
        // 270°
        [
            /*   0,0 */  /*    1,0    */cc.v2(2, 0),
            cc.v2(0, -1), cc.v2(1, -1), cc.v2(2, -1)
        ]
    ];
    private TType: cc.Vec2[][] = [
        [
            /*.  0,0 */cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1), cc.v2(2, -1)
        ],
        [
            cc.v2(0, 0),
            cc.v2(0, -1), cc.v2(1, -1),
            cc.v2(0, -2)
        ],
        [
            cc.v2(0, 0), cc.v2(1, 0), cc.v2(2, 0),
            /* 0,-1*/ cc.v2(1, -1)

        ],
        [
            /* 0,0 */cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1),
            /*0,-2*/cc.v2(1, -2)
        ]
    ];
    private ZType: cc.Vec2[][] = [
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(1, -1), cc.v2(2, -1)

        ],
        [
            cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1),
            cc.v2(0, -2)
        ],
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(1, -1), cc.v2(2, -1)

        ],
        [
            cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1),
            cc.v2(0, -2)
        ]
    ];
    private OType: cc.Vec2[][] = [
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1)
        ],
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1)
        ],
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1)
        ],
        [
            cc.v2(0, 0), cc.v2(1, 0),
            cc.v2(0, -1), cc.v2(1, -1)
        ],
    ];
    private IType: cc.Vec2[][] = [
        [
            cc.v2(0, 0), cc.v2(0, 1), cc.v2(0, 2), cc.v2(0, 3)
        ],
        [
            cc.v2(0, 0),
            cc.v2(-1, 0),
            cc.v2(-2, 0),
            cc.v2(-3, 0)
        ],
        [
            cc.v2(0, 0), cc.v2(0, 1), cc.v2(0, 2), cc.v2(0, 3)
        ],
        [
            cc.v2(0, 0),
            cc.v2(-1, 0),
            cc.v2(-2, 0),
            cc.v2(-3, 0)
        ]

    ]
    private MyType: cc.Vec2[][] = [];//当前的Type
    private currentType: number = 0;
    protected init(): void //初始化
    {
        switch (this.tetrimuniType) {
            case 1:
                this.MyType = this.LType;
                break;
            case 2:
                this.MyType = this.TType;
                break;
            case 3:
                this.MyType = this.IType;
                break;
            case 4:
                this.MyType = this.OType;
                break;
            case 5:
                this.MyType = this.ZType;
                break;
        }
        this.currentType = 0;
    }
    public ChangeType(): void {
        if (this.currentType < 3) {
            this.currentType++;
        }
        else {
            this.currentType = 0;
        }
    }

    public get GetCurrentType(): cc.Vec2[] {
        return this.MyType[this.currentType];
    }
}
