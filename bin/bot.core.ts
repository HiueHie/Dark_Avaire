import { RaffelService } from "../lib/services/raffle.service";
import { SongService } from '../lib/services/song.service';
import { Tmi } from '../lib/settings/bot.settings';
import { GlobalService } from '../lib/services/global.service';
import { Userstate } from '../lib/models/userstate';
import * as UserConfig from "../config.json"; 

let raffle: RaffelService = new RaffelService();
let song: SongService = new SongService(UserConfig);
let tmi: Tmi = new Tmi(UserConfig);

tmi.client.connect();

tmi.client.on("connected", (address: string, port: number): void => {
    tmi.client.action(UserConfig.channel_name, "Bot is online and is awaiting to get commands.");
});

tmi.client.on("join", (channel: string, username: string, self: boolean): void => {

});

tmi.client.on("part", (channel: string, username: string, self: boolean): void => {
	
});

tmi.client.on("whisper", (from: string, user: any, message: string, self: boolean): void => {
    let userstate: Userstate = GlobalService.convertToInstance({
        'badges': user['badges'],
        'color': user['color'],
        'display-name': user['display-name'],
        'emotes': user['emotes'],
        'id': user['id'],
        'mod': user['mod'],
        'room-id': user['room-id'],
        'subscriber': user['subscriber'],
        'tmi-sent-ts': user['tmi-sent-ts'],
        'turbo': user['turbo'],
        'user-id': user['user-id'],
        'user-type': user['user-type'],
        'emotes-raw': user['emotes-raw'],
        'badges-raw': user['badges-raw'],
        'username': user['username'],
        'message-type': user['message-type']
    });

    if (userstate.username === "NAME") {
        let messages: string[] = message.split(" ");
    	if (messages[0] === "!say") {
            messages.shift();
    		tmi.client.action(UserConfig.channel_name, messages.join(" "));
		}
    }
});

tmi.client.on("chat", (channel: string, user: any, message: string, self: boolean): void => {
	let messages: string[] = message.split(" ");
	let userstate: Userstate = GlobalService.convertToInstance({
		'badges': user['badges'],
		'color': user['color'],
		'display-name': user['display-name'],
		'emotes': user['emotes'],
		'id': user['id'],
		'mod': user['mod'],
		'room-id': user['room-id'],
		'subscriber': user['subscriber'],
		'tmi-sent-ts': user['tmi-sent-ts'],
		'turbo': user['turbo'],
		'user-id': user['user-id'],
		'user-type': user['user-type'],
		'emotes-raw': user['emotes-raw'],
		'badges-raw': user['badges-raw'],
		'username': user['username'],
		'message-type': user['message-type']
	});

	if (userstate.username === "NAME") {
        if (messages[0] === "!queue") {
            if (messages[1] === "get") {
                tmi.client.action(UserConfig.channel_name, song.getSongList());
                let s = song.getSongList();
                tmi.client.action(UserConfig.channel_name, s);
            }
            if (messages[1] === "remove") {
                tmi.client.action(UserConfig.channel_name, song.removeSong(messages[2]));
            }
        }
        if (messages[0] === "!specialraffle") {
            raffle.specialRaffle(tmi.client);
        }
		if (messages[0] === "!lockcommands") {
			tmi.settings.unCommandsLocked = false;
			tmi.client.action(UserConfig.channel_name, "Requests currently muted!");
		}
		if (messages[0] === "!unlockcommands") {
			tmi.settings.unCommandsLocked = true;
			tmi.client.action(UserConfig.channel_name, "GivePLZ gimme requests.");
        }
        if (messages[0] === "!priosub") {
            song.prioSub(true);
            tmi.client.action(UserConfig.channel_name, "Subscribers are prioritized in queue now.");
        }
        if (messages[0] === "!unpriosub") {
            song.prioSub(false);
            tmi.client.action(UserConfig.channel_name, "Subscribers are no longer prioritized in queue now.");
        }
    }
    if (tmi.settings.unCommandsLocked) {
        if (messages[0] === "!queue" && messages[1] === "add") {
            if (messages[2] === "<song>") {
                tmi.client.action(UserConfig.channel_name, userstate.displayName+" FailFish");
            } else {
                tmi.client.action(UserConfig.channel_name, song.addSong(userstate, message));
            }
        }
        if (messages[0] === "!coins") {
            tmi.client.action(UserConfig.channel_name, userstate.displayName+", you have "+raffle.getUserCoins(userstate.userId)+" coins.");
        }
        if (messages[0] === "!join") {
            raffle.addUserToRaffle(userstate);
        }
    }
});