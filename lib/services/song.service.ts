import { SongRequestObject } from '../../lib/models/songRequestObject';
import { Userstate } from '../../lib/models/userstate';
import { SentenceService } from './sentence.service';

export class SongService {
    private _songList: SongRequestObject[];
    private _prioSub: boolean;
    private _sentencesService: SentenceService;

    constructor(sentences: SentenceService) {
        this._songList = [];
        this._prioSub = false;
        this._sentencesService = sentences;
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
            return this._sentencesService.getSentence("song", "queue_add", "only_one_song", {username: user.username});
        } 
        
        let messages = message.split("!queue add ");
        if (messages[1] == null) {
            return this._sentencesService.getSentence("song", "queue_add", "nothing", {username: user.username});
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
        return this._sentencesService.getSentence("song", "queue_add", "success", 
                {username: user.username, songname: messages[1], id: song.id});
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
            return this._sentencesService.getSentence("song", "queue_get", "no_songs");
        }

        let songlist = this._songList.map(s => this._sentencesService.getSentence("song", "queue_get", "song_list_look", 
                {id: s.id, username: s.username, songtitle: s.songTitle})).join(", ");

        return this._sentencesService.getSentence("song", "queue_get", "success", 
                {songlist: this._sentencesService.getSentence("song", "queue_get", "song_list_look", {songlist})});
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
            return this._sentencesService.getSentence("song", "queue_remove", "all");
        }
        if (this._songList.length == 0) {
            return this._sentencesService.getSentence("song", "queue_remove", "no_songs", {id});
        }
        if (this._songList.length > id || id < 0) {
            return this._sentencesService.getSentence("song", "queue_remove", "invalide");
        }

        let song = this._songList.find(s => s.id == (id == null || id == "" ? 1 : id));
        this._songList.splice(id, 1);
        this._setSongListIds();
        return id == null || id == ""
            ? this._sentencesService.getSentence("song", "queue_remove", "success_granted", 
                {username: song.username, songtitle: song.songTitle, 
                nextsongtitle: this._songList[0].songTitle, nextsongusername: this._songList[0].username})
            : this._sentencesService.getSentence("song", "queue_remove", "success_remove", 
                {username: song.username, songtitle: song.songTitle});
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