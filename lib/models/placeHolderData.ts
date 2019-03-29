export class PlaceHolderData {
    public username: string;
    public pointsname: string;
    public points: number;
    public displayname: string;
    public song: Song = new Song();
    public raffle: Raffle = new Raffle();

    constructor(username: string, pointsname: string, points: number, displayname: string) {
        this.username = username;
        this.pointsname = pointsname;
        this.points = points;
        this.displayname = displayname;
    }
}

export class Song {
    public songid: number;
    public songtitle: string;
    public nextsongtitle: string;
    public nextsongusername: string;

    constructor(songid: number = 0, songtitle: string = "", 
        nextsongtitle: string = "", nextsongusername: string = "") {
        this.songid = songid;
        this.songtitle = songtitle;
        this.nextsongtitle = nextsongtitle;
        this.nextsongusername = nextsongusername;
    }
}

export class Raffle {
    public time: number;
    public winuser: string;
    public winpoints: number;

    constructor(time: number = 0, winuser: string = "", winpoints: number = 0) {
        this.time = time;
        this.winuser = winuser;
        this.winpoints = winpoints;
    }
}