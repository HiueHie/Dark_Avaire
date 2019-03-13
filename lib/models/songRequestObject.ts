export class SongRequestObject {
    id: number;
    username: string;
    songTitle: string;
    isPrio: boolean;

    constructor(username: string = "", songTitle: string = "", isPrio: boolean = false) {
        this.id = 1;
        this.username = username;
        this.songTitle = songTitle;
        this.isPrio = isPrio;
    }
}