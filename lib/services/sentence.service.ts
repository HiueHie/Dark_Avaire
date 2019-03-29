export class SentenceService {
    private _userSentences: any;

    constructor() {
        this._userSentences = require("../../sentences.json");
    }

    public getSentence(service: string, method: string, answer: string = "", o: object = {}): string {
        let result = answer != "" ? this._userSentences[service][method][answer] : this._userSentences[service][method];
        Object.keys(o).forEach(k => result = result.replace("$"+k+"$", o[k]));
        return result;
    }
}