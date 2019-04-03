export class Coin {
    public userId: number;
    public userName: string;
    public points: number;

    constructor(id: number, name: string, points: number) {
        this.userId = id;
        this.userName = name;
        this.points = points;
    }
}
