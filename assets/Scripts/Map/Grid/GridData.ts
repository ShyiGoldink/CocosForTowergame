import ConfigExtern from "../../ConfigExtern";
import GridCell from "./GridCell";
import BornBlock from "../Blocks/BornBlock";


export default class GridData {


    private static _grids: GridCell[][] = [];

    private _bornBlocks: BornBlock[] = [];

    private _endCell: GridCell | null = null;


    public initGrid() {

        for (let y = 0; y < ConfigExtern.MAP_HEIGHT; y++) {

            GridData._grids[y] = [];

            for (let x = 0; x < ConfigExtern.MAP_WIDTH; x++) {

                GridData._grids[y][x] = new GridCell(x, y);

            }
        }
    }



    public getCell(x: number, y: number) {

        return GridData._grids[y][x];

    }



    public get grids() {

        return GridData._grids;

    }



    public setEndCell(cell: GridCell) {

        this._endCell = cell;

    }



    public getEndCell() {

        return this._endCell!;

    }



    public addBornBlock(block: BornBlock) {

        this._bornBlocks.push(block);

    }



    public getBornBlocks() {

        return this._bornBlocks;

    }


}