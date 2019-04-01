import { PlaceHolderData, Song, Raffle, Core } from "../models/placeHolderData";
import { Userstate } from "../models/userstate";

export class SentenceService {
    private _userSentences: any;
    private _placeHolders: string[] = ["username", "pointsname", "points", "displayname"];
    private _data: {[userId: number]: PlaceHolderData};

    constructor() {
        this._userSentences = require("../../sentences.json");
    }

    public getSentence(service: string, method: string, answer: string = "", user: Userstate): string {
        let result = answer != "" ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys([...this._placeHolders, this["_placeHoldersFor"+service[0].toUpperCase]])
                .forEach(k => result = result.replace("$"+k+"$", this._data[user.userId][service][k]));
        return result;
    }

    public getSentenceWithOwnProperties(service: string, method: string, answer: string = "", obj: object): string {
        let result = answer != "" ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys([...this._placeHolders, this["_placeHoldersFor"+service[0].toUpperCase]])
                .forEach(k => result = result.replace("$"+k+"$", obj[k]));
        return result;
    }

    public setDataToDefault(user: Userstate, userConfig: any, userPoints: number): void {
        this._data[user.userId] = new PlaceHolderData();
        this._data[user.userId].core = new Core(user.username, userConfig.points_name, userPoints, user.displayName);
    }

    public setDataWithSong(user: Userstate, song: Song): void {
        this._data[user.userId].song = song;
    }

    public setDataWithRaffle(user: Userstate, raffle: Raffle): void {
        this._data[user.userId].raffle = raffle;
    }

    public deleteData(user: Userstate): void {
        this._data[user.userId] = null;
    }

    private _placeHoldersForCore(): string[] {
        return [];
    }

    private _placeHoldersForSong(): string[] {
        return ["songusername", "songid", "songlist", "songtitle", "nextsongtitle", "nextsongusername"];
    }

    private _placeHoldersForRaffle(): string[] {
        return ["time", "winusername", "winuserdisplay", "winpoints"];
    }
}