export class Core {
    public username: string;
    public pointsname: string;
    public points: number;
    public displayname: string;

    constructor(username = '', pointsname = '', points = 0, displayname = '') {
        this.username = username;
        this.pointsname = pointsname;
        this.points = points;
        this.displayname = displayname;
    }
}
