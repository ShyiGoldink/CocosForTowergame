import ConfigExtern from "../ConfigExtern";
import GridCell from "../Map/Grid/GridCell";
import GridManager from "../Map/Grid/GridManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GridLeader {

    public gridToWorld(cell: GridCell): cc.Vec2 {
        const offset =
            (ConfigExtern.WALL_SIZE - ConfigExtern.GRID_SIZE) * 0.5;
        const halfMapWidth =
            ConfigExtern.MAP_WIDTH * ConfigExtern.GRID_SIZE * 0.5;
        const halfMapHeight =
            ConfigExtern.MAP_HEIGHT * ConfigExtern.GRID_SIZE * 0.5;
        return cc.v2(
            cell.getX * ConfigExtern.GRID_SIZE
            + ConfigExtern.GRID_SIZE * 0.5
            + offset
            - halfMapWidth,
            cell.getY * ConfigExtern.GRID_SIZE
            + ConfigExtern.GRID_SIZE * 0.5
            + offset
            - halfMapHeight
        );
    }
    public worldToGrid(world: cc.Vec2): GridCell | null {
        const offset =
            (ConfigExtern.WALL_SIZE - ConfigExtern.GRID_SIZE) * 0.5;

        const halfMapWidth =
            ConfigExtern.MAP_WIDTH * ConfigExtern.GRID_SIZE * 0.5;

        const halfMapHeight =
            ConfigExtern.MAP_HEIGHT * ConfigExtern.GRID_SIZE * 0.5;

        const x = Math.floor(
            (world.x + halfMapWidth - offset)
            / ConfigExtern.GRID_SIZE
        );

        const y = Math.floor(
            (world.y + halfMapHeight - offset)
            / ConfigExtern.GRID_SIZE
        );

        if (
            x < 0 ||
            x >= ConfigExtern.MAP_WIDTH ||
            y < 0 ||
            y >= ConfigExtern.MAP_HEIGHT
        ) {
            return null;
        }

        return GridManager.Instance.getCell(y, x);
    }
}
