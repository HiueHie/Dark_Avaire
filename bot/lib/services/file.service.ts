import * as fs from 'fs';

export class FileService {
    private _fielName: string;

    constructor(fileName: string) {
        this._fielName = fileName;
    }

    /**
     * @description Gets the content of a file
     *
     * @returns {any}
     */
    public getFileContent(): any {
        if (fs.existsSync(this._fielName)) {
            return JSON.parse(fs.readFileSync(this._fielName).toString());
        }
        return [];
    }

    /**
     * @description Sets the content for a file
     *
     * @param {any} data
     */
    public setFileContent(data: any): void {
        if (fs.existsSync(this._fielName)) {
            fs.unlinkSync(this._fielName);
        }

        fs.writeFileSync(this._fielName, JSON.stringify(data));
    }
}
