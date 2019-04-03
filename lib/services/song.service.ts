import { SentenceService } from './sentence.service';
import { Song } from '../models/song';
import { SongRequestObject } from '../../lib/models/songRequestObject';
import { Userstate } from '../../lib/models/userstate';

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
        const messages = message.split('!queue add ');
        this._setUserSongData(user, messages[1]);
        if (messages[1] == null) {
            return this._sentencesService.getSentence('song', 'queue_add', 'nothing', user);
        }

        if (this._songList.find((s: SongRequestObject): boolean => s.username == user.username)) {
            return this._sentencesService.getSentence('song', 'queue_add', 'only_one_song', user);
        }

        const song: SongRequestObject = new SongRequestObject(user.username, messages[1], user.subscriber);

        if (!this._prioSub) {
            this._songList.push(song);
        } else {
            if (user.subscriber) {
                this._songList.splice(this._songList.findIndex((s: SongRequestObject): boolean => !s.isPrio), 0, song);
            } else {
                this._songList.push(song);
            }
        }

        this._setSongListIds();
        return this._sentencesService.getSentence('song', 'queue_add', 'success', user);
    }

    /**
     * @description Gets the current requested song list
     *
     * @tutorial !queue get
     *
     * @returns {string} queue
     */
    public getSongList(user: Userstate): string {
        this._setUserSongData(user, '');
        if (this._songList.length == 0) {
            return this._sentencesService.getSentence('song', 'queue_get', 'no_songs', user);
        }

        const songlist = this._songList.map(s => this._sentencesService.getSentenceWithOwnProperties('song', 'queue_get', 'song_list_look',
                {songid: s.id, songusername: s.username, songtitle: s.songTitle})).join(', ');

        return this._sentencesService.getSentenceWithOwnProperties('song', 'queue_get', 'success', {songlist});
    }

    /**
     * @description Removes a requested song
     *
     * @tutorial !queue remove <id>
     *
     * @param {any} id
     */
    public removeSong(id: any, user: Userstate): string {
        this._setUserSongData(user, '', id);
        if (id === 'all') {
            this._songList = [];
            return this._sentencesService.getSentence('song', 'queue_remove', 'all', user);
        }
        if (this._songList.length == 0) {
            return this._sentencesService.getSentence('song', 'queue_remove', 'no_songs', user);
        }
        if (this._songList.length > id || id < 0) {
            return this._sentencesService.getSentence('song', 'queue_remove', 'invalide', user);
        }

        this._songList.splice(id, 1);
        this._setSongListIds();
        return this._sentencesService.getSentence('song', 'queue_remove',
                (id == null || id == '' ? 'success_granted' : 'success_remove'), user);
    }

    /**
     * @description Sets the song list ids
     */
    private _setSongListIds(): void {
        this._songList.forEach((s: SongRequestObject, i: number): number => s.id = i + 1);
    }

    /**
     * @description Sets the prio
     *
     * @tutorial !priosub !unpriosub
     *
     * @param {boolean} prio
     */
    public prioSub(prio = false): void {
        this._prioSub = prio;
    }

    private _setUserSongData(user: Userstate, songName: string, songId: any = false): void {
        songId = songId ? songId : !this._prioSub ? this._songList.length : (
            user.subscriber ? this._songList.findIndex(s => !s.isPrio) + 1 : this._songList.length );
        const song = songId != 0 ? this._songList.find(s => s.id == songId) : new SongRequestObject(user.username, songName);
        const nextSong = songId != 0 ? this._songList.find(s => s.id == songId + 1) : new SongRequestObject();
        this._sentencesService.setDataWithSong(user, new Song(song.username, songId == 0 ? 1 : songId, song.songTitle,
            nextSong.songTitle, nextSong.username));
    }
}
