const { ccclass, property } = cc._decorator;


import ConfigExtern from "../../ConfigExtern";
import GridCell from "./GridCell";
import GridLeader from "../../Tool/GridLeader";

import Wall from "../Blocks/Wall";
import BornBlock from "../Blocks/BornBlock";
import EndBlock from "../Blocks/EndBlock";
import BasicBlock from "../Blocks/BasicBlock";


@ccclass
export default class GridView extends cc.Component {


    @property(cc.Prefab)
    private wallPrefab: cc.Prefab = null!;


    @property(cc.Prefab)
    private bornPrefab: cc.Prefab = null!;


    @property(cc.Prefab)
    private endPrefab: cc.Prefab = null!;



    private gridLeader = new GridLeader();



    public createBlock(
        parent: cc.Node,
        prefab: cc.Prefab,
        type: number,
        cell: GridCell
    ): BasicBlock | null {


        const node = cc.instantiate(prefab);

        node.parent = parent;


        node.zIndex =
            -cell.getX - cell.getY * ConfigExtern.MAP_WIDTH;


        node.setPosition(
            this.gridLeader.gridToWorld(cell)
        );



        let block: BasicBlock | null = null;


        switch (type) {

            case ConfigExtern.TYPE_WALL:

                block = node.getComponent(Wall);

                break;


            case ConfigExtern.TYPE_ENDBLOCK:

                block = node.getComponent(EndBlock);

                break;


            case ConfigExtern.TYPE_BORNBLOCK:

                block = node.getComponent(BornBlock);

                break;

        }


        return block;

    }





    public createWall(
        parent: cc.Node,
        cell: GridCell
    ): Wall {


        const wall =
            this.createBlock(
                parent,
                this.wallPrefab,
                ConfigExtern.TYPE_WALL,
                cell
            ) as Wall;


        return wall;

    }




    public createBorn(
        parent: cc.Node,
        cell: GridCell,
        id: number
    ) {


        const bornNode =
            cc.instantiate(this.bornPrefab);


        bornNode.parent = parent;


        bornNode.zIndex =
            -cell.getX - cell.getY * ConfigExtern.MAP_WIDTH;


        bornNode.setPosition(
            this.gridLeader.gridToWorld(cell)
        );



        const born =
            bornNode.getComponentInChildren(BornBlock)!;


        born.setCell(cell);

        born.setId(id);


        return born;

    }




    public createEnd(
        parent: cc.Node,
        cell: GridCell
    ) {


        const node =
            cc.instantiate(this.endPrefab);


        node.parent = parent;


        node.setPosition(
            this.gridLeader.gridToWorld(cell)
        );


    }



}