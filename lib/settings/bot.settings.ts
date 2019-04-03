import { client } from '../../node_modules/tmi.js';
import { GeneralSettings } from './general.settings';

export class Tmi {
    public settings: GeneralSettings;
    private _client: any;
    private _optiions: any;

    constructor(UserConfig: any) {
        this.settings = new GeneralSettings();
        this._optiions = {
            options: {
                debug: true
            },
            connection: {
                cluster: 'awa',
                reconnect: true
            },
            identity: {
                username: 'Dark_Avaire',
                password: 'oauth:p8c1nc2ad7gdixp816a2j5f18wvjni'
            },
            channels: [
                UserConfig.channel_name
            ]
        };

        this._client = new client(this._optiions);
    }

    /**
     * @description Get the client
     *
     * @returns {client}
     */
    public get client(): client {
        return this._client;
    }
}
