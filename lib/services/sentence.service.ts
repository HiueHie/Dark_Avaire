import { Core } from '../models/core';
import { PlaceHolderData } from '../models/placeHolderData';
import { Raffle } from '../models/raffle';
import { Rights } from '../models/rights';
import { Song } from '../models/song';
import { Userstate } from '../models/userstate';
import { UserConfig } from '../models/userConfig';

export class SentenceService {
    private _userSentences: any;
    private _data: {[userId: number]: PlaceHolderData};
    private _placeHoldersForCore: string[] = ['username', 'pointsname', 'points', 'displayname'];
    private _placeHoldersForSong: string[] = ['songusername', 'songid', 'songlist', 'songtitle', 'nextsongtitle', 'nextsongusername'];
    private _placeHoldersForRaffle: string[] = ['time', 'winusername', 'winuserdisplay', 'winpoints'];
    private _placeHoldersForRights: string[] = ['targetusername', 'rightname', 'rightnames'];

    constructor() {
        this._userSentences = require('../../sentences.json');
    }

    /**
     * @description Replaces all place holders with data from a special call ( Full answer )
     *
     * @param {string} service
     * @param {string} method
     * @param {string} answer
     * @param {Userstate} user
     */
    public getSentence(service: string, method: string, answer = '', user: Userstate): string {
        let result = answer != '' ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys([...this._placeHoldersForCore, this['_placeHoldersFor' + service[0].toUpperCase]])
                .forEach(k => result = result.replace('$' + k + '$', this._data[user.userId][service][k]));
        return result;
    }

    /**
     * @description Replaces all place holders with data from a special call ( No full answer )
     *
     * @param {string} service
     * @param {string} method
     * @param {string} answer
     * @param {object} obj
     */
    public getSentenceWithOwnProperties(service: string, method: string, answer = '', obj: object): string {
        let result = answer != '' ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys([...this._placeHoldersForCore, this['_placeHoldersFor' + service[0].toUpperCase]])
                .forEach(k => result = result.replace('$' + k + '$', obj[k]));
        return result;
    }

    /**
     * @description Set basic datas for user interaction
     *
     * @param {Userstate} user 
     * @param {UserConfig} userConfig 
     * @param {number} userPoints 
     */
    public setDataToDefault(user: Userstate, userConfig: any, userPoints: number): void {
        this._data[user.userId] = new PlaceHolderData();
        this._data[user.userId].core = new Core(user.username, userConfig.points_name, userPoints, user.displayName);
    }

    /**
     * @description Removes an entry for user interaction
     *
     * @param {Userstate} user
     */
    public deleteData(user: Userstate): void {
        this._data[user.userId] = null;
    }

    /**
     * @description Sets song datas for user interaction
     *
     * @param {Userstate} user
     * @param {Song} song
     */
    public setDataWithSong(user: Userstate, song: Song): void {
        this._data[user.userId].song = song;
    }

    /**
     * @description Sets raffle datas for user interaction
     *
     * @param {Userstate} user
     * @param {Raffle} raffle
     */
    public setDataWithRaffle(user: Userstate, raffle: Raffle): void {
        this._data[user.userId].raffle = raffle;
    }

    /**
     * @description Sets rights datas for user interaction
     *
     * @param {Userstate} user
     * @param {Rights} rights
     */
    public setDatawithRights(user: Userstate, rights: Rights): void {
        this._data[user.userId].rights = rights;
    }
}
