export class GeneralSettings {
    // Info
    private _clientId: string;
    private _unCommandsLocked: boolean;

    constructor() {
        this._clientId = "k5qcgssj9ck3xnronc0brarej112g3";
        this._unCommandsLocked = true;
    }

    /**
     * @description Get the client id of the Twitch Bot
     * 
     * @returns string
     */
    public get clientId(): string {
        return this._clientId;
    }

    /**
     * @description Get the status if commands are locked
     * 
     * @returns boolean
     */
    public get unCommandsLocked(): boolean {
        return this._unCommandsLocked;
    }

    /**
     * @description Set the status for commands allow
     * 
     * @param {boolean} lock
     */
    public set unCommandsLocked(lock: boolean) {
        this._unCommandsLocked = lock;
    }
}