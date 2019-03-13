import { SongRequestObject } from '../../lib/models/songRequestObject';
import { Userstate } from '../../lib/models/userstate';

export class SongService {
    private _songList: SongRequestObject[];
    private _prioSub: boolean;

    constructor() {
        this._songList = [];
        this._prioSub = false;
    }

    /**
     * @description Adds a requested song from a user to the queue
     * 
     * @tutorial !queue add <song>
     * 
     * @param {Userstate} user 
     * @param {string} message 
     * 
     * @returns {string} answer
     */
    public addSong(user: Userstate, message: string): string {
        if (this._songList.find((s: SongRequestObject): boolean => s.username == user.username)) {
            return user.username + ", you can only request one song at a time! Cool down!";
        } 
        
        let messages = message.split("!queue add ");
        if (messages[1] == null) {
            return user.username + ", you wanna request nothing? DansGame";
        }

        let song: SongRequestObject = new SongRequestObject(user.username, messages[1], user.subscriber);

        if (!this._prioSub) {
            this._songList.push(song);
        } else {
            if (user.subscriber) {
                this._songList.splice(this._songList.findIndex((s: SongRequestObject): boolean => s.isPrio == false), 0, song);
            } else {
                this._songList.push(song);
            }
        }

        this._setSongListIds();

        return user.username + " just requested \""+messages[1]+"\" and is added to the request queue #"+song.id;
    }

    /**
     * @description Gets the current requested song list
     * 
     * @tutorial !queue get
     * 
     * @returns {string} queue
     */
    public getSongList(): string {
        if (this._songList.length == 0) {
            return "No requests currently in queue";
        }

        return "Current queue is: " + this._songList.map((s) => "#"+s.id+" "+s.username+" \""+s.songTitle+"\"").join(", ");
    }

    /**
     * @description Removes a requested song 
     * 
     * @tutorial !queue remove <id>
     * 
     * @param {any} id 
     */
    public removeSong(id: any): string {
        if (id === "all") {
            this._songList = [];
            return "Request queue is empty now!";
        }
        if (id == null) {
            return "Please remove an id or all!";
        }
        if (this._songList.length == 0) {
            return "No requests are in queue, can't delete "+id;
        }
        if (this._songList.length > id) {
            return "No song in this position!";
        }

        let song = this._songList.find(s => s.id == id);
        this._songList.splice(id, 1);
        this._setSongListIds();
        return song.username + "'s song request \""+song.songTitle+"\" deleted."
    }

    /**
     * @description Sets the song list ids
     */
    private _setSongListIds(): void {
        this._songList.forEach((s: SongRequestObject, i: number): number => s.id = i+1);
    }

    /**
     * @description Sets the prio
     * 
     * @tutorial !priosub !unpriosub
     * 
     * @param {boolean} prio 
     */
    public prioSub(prio: boolean = false): void {
        this._prioSub = prio;
    }
}