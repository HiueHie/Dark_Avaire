export class PlaceHolderData {
    public core: Core;
    public song: Song;
    public raffle: Raffle;

    constructor() {
        this.core = new Core();
        this.song = new Song();
        this.raffle = new Raffle();
    }
}

export class Core {
    public username: string;
    public pointsname: string;
    public points: number;
    public displayname: string;

    constructor(username: string = "", pointsname: string = "", points: number = 0, displayname: string = "") {
        this.username = username;
        this.pointsname = pointsname;
        this.points = points;
        this.displayname = displayname;
    }
}

export class Song {
    public songusername: string;
    public songid: number;
    public songtitle: string;
    public nextsongtitle: string;
    public nextsongusername: string;

    constructor(songusername: string = "",songid: number = 0, songtitle: string = "",
        nextsongtitle: string = "", nextsongusername: string = "") {
        this.songusername = songusername;
        this.songid = songid;
        this.songtitle = songtitle;
        this.nextsongtitle = nextsongtitle;
        this.nextsongusername = nextsongusername;
    }
}

export class Raffle {
    public time: number;
    public winusername: string;
    public winuserdisplay: string;
    public winpoints: number;

    constructor(time: number = 0, winusername: string = "", winuserdisplay: string = "", winpoints: number = 0) {
        this.time = time;
        this.winusername = winusername;
        this.winuserdisplay = winuserdisplay;
        this.winpoints = winpoints;
    }
}