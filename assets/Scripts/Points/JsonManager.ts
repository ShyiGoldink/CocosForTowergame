export default class JsonManager {

    private static readonly NORMAL_GAME_KEY =
        "normalGameData";

    private static normalPassedPoints: number[] = [];


    public static readNormalDaya(): void {

        let data =
            cc.sys.localStorage.getItem(
                this.NORMAL_GAME_KEY
            );

        if (data) {

            this.normalPassedPoints =
                JSON.parse(data);

        }
        else {

            this.normalPassedPoints = [];

        }

    }


    public static getNormalData(): number[] {

        return [...this.normalPassedPoints];

    }


    public static setSavedNormalData(ids: number[]) {

        this.normalPassedPoints = [...ids];

    }


    public static saveNoramlData() {

        cc.sys.localStorage.setItem(
            this.NORMAL_GAME_KEY,
            JSON.stringify(this.normalPassedPoints)
        );

    }

}