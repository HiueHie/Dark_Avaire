export class SongRequestObject {
    id: number;
    username: string;
    songTitle: string;
    isPrio: boolean;

    constructor(username = '', songTitle = '', isPrio = false) {
        this.id = 1;
        this.username = username;
        this.songTitle = songTitle;
        this.isPrio = isPrio;
    }
}
