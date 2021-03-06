import { Coin } from '../../lib/models/coins';
import { Userstate } from '../../lib/models/userstate';
import { client } from '../../../node_modules/tmi.js';
import { Raffle } from '../models/raffle';
import { FileService } from './file.service';
import { SentenceService } from './sentence.service';
import { UserConfig } from '../models/userConfig';

export class RaffelService {
    private _coins: Coin[];
    private _started: boolean;
    private _users: Userstate[];
    private _pointsToAll: boolean;
    private _fielService: FileService;
    private _sentenceService: SentenceService;
    private _userConfig: UserConfig;

    constructor(sentence: SentenceService, config: UserConfig) {
        this._started = false;
        this._users = [];
        this._pointsToAll = false;
        this._fielService = new FileService('../../../settings/coins_data.json');
        this._coins = this._fielService.getFileContent();
        this._sentenceService = sentence;
        this._userConfig = config;
    }

    /**
     * @description Gets the current points of a user
     *
     * @tutorial !coins
     *
     * @param {number} id
     *
     * @returns {number}
     */
    public getUserCoins(id: number): number {
        const coin = this._coins.find(c => c.userId == id);
        return coin != null ? coin.points : 0;
    }

    /**
     * @description Adds a user to the raffle event
     *
     * @tutorial !join
     *
     * @param {Userstate} user
     */
    public addUserToRaffle(user: Userstate): void {
        if (!this._started) {
            return;
        }
        if (this._users.find(u => u.userId == user.userId)) {
            return;
        }
        this._users.push(user);
    }

    /**
     * @description Starts the special raffle event
     *
     * @tutorial !specialraffle
     *
     * @param {client} client
     */
    public specialRaffle(client: client, user: Userstate): void {
        this._started = true;
        this._users = [];
        this._timeouts(client, 30, user);
    }

    /**
     * @description Loop for the special raffle event
     *
     * @param {client} client
     * @param {number} time
     */
    private _timeouts(client: client, time: number, user: Userstate): void {
        this._setUserRaffleData(user, time, '', '', 0);
        let t: number = time;
        if (t == 8) {
            t = 7;
        } else {
            t = Math.ceil(t / 2);
        }

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            if (t == 7) {
                this._raffleEnd(client, user);
            } else {
                this._timeouts(client, t, user);
            }
        }, 1000 * t);

        client.action(client.opts.channels[0], this._sentenceService.getSentence('raffle', 'specialraffle', 'start', user));
    }

    /**
     * @description Ends the special raffle event and deal points
     *
     * @param {client} client
     */
    private _raffleEnd(client: client, user: Userstate): void {
        this._started = false;
        if (this._users.length == 0) {
            client.action(client.opts.channels[0], this._sentenceService.getSentence('raffle', 'specialraffle', 'no_one_joined', user));
            return;
        }

        const winUser: Userstate = this._users[Math.floor(Math.random() * this._users.length)];
        const rewards = this._userConfig.raffle.rewards;
        const points = winUser.subscriber ? rewards.sub_user : rewards.normal_user;

        if (this._pointsToAll) {
            this._users.forEach(u => this._increaseUserPoints(u.userId, u.username, rewards.everyone));
            this._increaseUserPoints(winUser.userId, winUser.username, points - rewards.everyone);
        } else {
            this._increaseUserPoints(winUser.userId, winUser.username, points);
        }
        this._fielService.setFileContent(this._coins);
        this._setUserRaffleData(user, 0, winUser.username, winUser.displayName, points);
        client.action(client.opts.channels[0], this._sentenceService.getSentence('raffle', 'specialraffle', 'win', user));
        this._users = [];
    }

    /**
     * @description Sets and/or updates a user
     *
     * @param {number} id
     * @param {string} name
     * @param {number} points
     */
    private _increaseUserPoints(id: number, name: string, points: number): void {
        const i: number = this._coins.findIndex(c => c.userId == id);
        if (i != null && i != -1) {
            this._coins[i] = new Coin(id, name, this._coins[i].points + points);
        } else {
            this._coins.push(new Coin(id, name, points));
        }
    }

    /**
     * @description Sets data for user interaction
     *
     * @param {Userstate} user
     * @param {number} time
     * @param {string} winusername
     * @param {string} winuserdisplay
     * @param {number} winningpoints
     */
    private _setUserRaffleData(user: Userstate, time: number, winusername: string, winuserdisplay: string, winningpoints: number): void {
        this._sentenceService.setDataWithRaffle(user, new Raffle(time, winusername, winuserdisplay, winningpoints));
    }
}
