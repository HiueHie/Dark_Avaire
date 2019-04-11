export class Song {
    public songusername: string;
    public songid: number;
    public songtitle: string;
    public nextsongtitle: string;
    public nextsongusername: string;

    constructor(songusername = '', songid = 0, songtitle = '',
        nextsongtitle = '', nextsongusername = '') {
        this.songusername = songusername;
        this.songid = songid;
        this.songtitle = songtitle;
        this.nextsongtitle = nextsongtitle;
        this.nextsongusername = nextsongusername;
    }
}
