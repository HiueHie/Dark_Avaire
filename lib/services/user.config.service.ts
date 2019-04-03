import { FileService } from "./file.service";
import { Userstate } from "../models/userstate";
import { SentenceService } from "./sentence.service";
import { Rights } from "../models/placeHolderData";

export class UserConfigService {
    private _fielService: FileService;
    private _userConfig: any;
    private _sentencesService: SentenceService;

    constructor(sentence: SentenceService) {
        this._fielService = new FileService("config.json");
        this._userConfig = require("../../config.json");
        this._sentencesService = sentence;
    }

    public addRight(rightName: string, targetName: string, user: Userstate): string {
        this._setUserRightsData(user, targetName, rightName);
        if (targetName == "" || targetName == null) {
            return this._sentencesService.getSentence("rights", "add", "no_target_user", user);
        }
        if (rightName == "" || rightName == null) {
            return this._sentencesService.getSentence("rights", "add", "no_right_name", user);
        }
        if (rightName == "broadcaster") {
            return this._sentencesService.getSentence("rights", "add", "no_broadcaster", user);
        }
        if (!this._userConfig.rights[rightName]) {
            this._userConfig.rights[rightName] = [];
        }
        this._userConfig.rights[rightName].push(targetName);
        this._fielService.setFileContent(this._userConfig);
        return this._sentencesService.getSentence("rights", "add", "success", user);
    }

    public removeRight(rightName: string, targetName: string, user: Userstate): string {
        this._setUserRightsData(user, targetName, rightName);
        if (targetName == "" || targetName == null) {
            return this._sentencesService.getSentence("rights", "remove", "no_target_user", user);
        }
        if (rightName == "" || rightName == null) {
            return this._sentencesService.getSentence("rights", "remove", "no_right_name", user);
        }
        if (rightName == "broadcaster") {
            return this._sentencesService.getSentence("rights", "remove", "no_broadcaster", user);
        }
        if (!this._userConfig.rights[rightName]) {
            return this._sentencesService.getSentence("rights", "remove", "wrong_right", user);
        }
        let index: number = this._userConfig.rights[rightName].findIndex(u => u == targetName);
        if (index > 0) {
            this._userConfig.rights[rightName].splice(index, 1);
            this._fielService.setFileContent(this._userConfig);
            return this._sentencesService.getSentence("rights", "remove", "success", user);
        } 
        return this._sentencesService.getSentence("rights", "remove", "wrong_username", user);
    }

    public getRight(user: Userstate, targetName: string = ""): string {
        if (targetName != null && targetName != "") {
            this._setUserRightsData(user, targetName, "");
            return this._sentencesService.getSentence("rights", "get", "another", user);
        }
        this._setUserRightsData(user, user.username, "");
        return this._sentencesService.getSentence("rights", "get", "own", user);
    }

    private _getRight(targetName: string): string {
        let rights: string[] = [];
        Object.keys(this._userConfig.rights).forEach(g =>  {
            if (typeof this._userConfig.rights[g] == "string" && this._userConfig.rights[g] == targetName) {
                rights.push(g);
            } else if (typeof this._userConfig.rights[g] != "string" && this._userConfig.rights[g].find(n => n == targetName)) {
                rights.push(g);
            }
        });
        return rights.join(", ");
    }

    public get userConfig(): any {
        return this._userConfig;
    }

    private _setUserRightsData(user: Userstate, targetName: string, rightName: string): void {
        targetName = targetName != "" ? targetName : "";
        this._sentencesService.setDatawithRights(user, new Rights(targetName, 
            rightName != "" ? rightName : "", this._getRight(targetName)));
    }
}