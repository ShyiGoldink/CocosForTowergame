const { ccclass, property } = cc._decorator;

@ccclass
export default class Tetromino extends cc.Component {

    @property
    private tetrimuniType: number = 0;//1 is L,2 is T,3 is I,4 is O,5 is Z

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
            cc.v2(0, 0), cc.v2(0, 1), cc.v2(0, 2),
            /* 0,-1*/ cc.v2(-1, 1)

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
}
