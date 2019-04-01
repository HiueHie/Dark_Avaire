import { Coin } from '../../lib/models/coins';
import { Userstate } from '../../lib/models/userstate';
import { FileService } from './file.service';
import { client } from "../../node_modules/tmi.js";
import { SentenceService } from './sentence.service';
import { Raffle } from '../models/placeHolderData';

export class RaffelService {
    private _coins: Coin[];
    private _started: boolean;
    private _users: Userstate[];
    private _pointsToAll: boolean;
    private _fielService: FileService;
    private _sentenceService: SentenceService;
    private _userConfig: any;

    constructor(sentence: SentenceService, config: any) { 
        this._started = false;
        this._users = [];
        this._pointsToAll = false;
        this._fielService = new FileService();
        this._coins = this._fielService.getFileContent();
        this._sentenceService = sentence;
        this._userConfig = config;
    }

    /**
     * @description Sets and/or updates a user
     * 
     * @param {number} id 
     * @param {string} name 
     * @param {number} points 
     */
    private _increaseUserPoints(id: number, name: string, points: number): void {
        let i: number = this._coins.findIndex(c => c.userId == id);
        if (i != null && i != -1) {
            this._coins[i] = new Coin(id, name, this._coins[i].points+points);
        } else {
            this._coins.push(new Coin(id, name, points));
        }
        this._fielService.setFileContent(this._coins);
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
        let coin = this._coins.find(c => c.userId == id);
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
        this._sentenceService.setDataWithRaffle(user, new Raffle(time));
        let t: number = time;
        if (t == 8) {
            t = 7;
        } else {
            t = Math.ceil(t / 2);
        }

        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            if (t == 7) {
                this._raffleEnd(client, user);
            } else {
                this._timeouts(client, t, user);
            }
        }, 1000 * t);

        client.action(client.opts.channels[0], this._sentenceService.getSentence("raffle", "specialraffle", "start", user));
    }

    /**
     * @description Ends the special raffle event and deal points
     * 
     * @param {client} client 
     */
    private _raffleEnd(client: client, user: Userstate): void {
        this._started = false;
        if (this._users.length == 0) {
            client.action(client.opts.channels[0], this._sentenceService.getSentence("raffle", "specialraffle", "no_one_joined", user));
            return;
        }

        let winUser: Userstate = this._users[Math.floor(Math.random() * this._users.length)];
        let rewards = this._userConfig.raffle.rewards;
        let points = winUser.subscriber ? rewards.sub_user : rewards.normal_user;
        
        if (this._pointsToAll) {
            this._users.forEach(u => this._increaseUserPoints(u.userId, u.username, rewards.everyone));
            this._increaseUserPoints(winUser.userId, winUser.username, points - rewards.everyone);
        } else {
            this._increaseUserPoints(winUser.userId, winUser.username, points);
        }
        this._sentenceService.setDataWithRaffle(user, new Raffle(0, winUser.username, winUser.displayName, points));
        client.action(client.opts.channels[0], this._sentenceService.getSentence("raffle", "specialraffle", "win", user))
        this._users = [];
    }
}