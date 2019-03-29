import { PlaceHolderData, Song, Raffle } from "../models/placeHolderData";
import { Userstate } from "../models/userstate";

export class SentenceService {
    private _userSentences: any;
    private _placeHolders: string[] = ["username", "pointsname", "points", "displayname"];
    private _data: PlaceHolderData;

    constructor() {
        this._userSentences = require("../../sentences.json");
    }

    public getSentence(service: string, method: string, answer: string = "", o: object = {}): string {
        let result = answer != "" ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys(o).forEach(k => result = result.replace("$"+k+"$", o[k]));
        return result;
    }

    public setDataToDefault(user: Userstate, userConfig: any, userPoints: number): void {
        this._data = new PlaceHolderData(user.username, userConfig.points_name, userPoints, user.displayName);
    }

    public setDataWithSong(song: Song): void {
        this._data.song = song;
    }

    public setDataWithRaffle(raffle: Raffle): void {
        this._data.raffle = raffle;
    }

    private _placeHoldersForSong(): string[] {
        return ["songname", "songid", "songlist", "songtitle", "nextsongtitle", "nextsongusername"];
    }

    private _placeHoldersForRaffle(): string[] {
        return ["time", "winuser", "winpoints"];
    }
}