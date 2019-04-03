import { RaffelService } from "../lib/services/raffle.service";
import { SongService } from '../lib/services/song.service';
import { Tmi } from '../lib/settings/bot.settings';
import { GlobalService } from '../lib/services/global.service';
import { Userstate } from '../lib/models/userstate';
import { SentenceService } from "../lib/services/sentence.service";
import { UserConfigService } from "../lib/services/user.config.service";

let sentences: SentenceService = new SentenceService();
let userConfigService: UserConfigService = new UserConfigService(sentences);
let raffle: RaffelService = new RaffelService(sentences, userConfigService.userConfig);
let song: SongService = new SongService(sentences);
let tmi: Tmi = new Tmi(userConfigService.userConfig);

tmi.client.connect();

tmi.client.on("connected", (address: string, port: number): void => {
    tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "connected", "",
        new Userstate({
            badges: {}, color: "", "display-name": "", emotes: false, id: "", mod: true, "room-id": 0,
            subscriber: false, "tmi-sent-ts": 0, turbo: false, "user-id": 0, "user-type": "", "emotes-raw": "", "badges-raw": "",
            username: "", "message-type": ""
        })));
});

tmi.client.on("join", (channel: string, username: string, self: boolean): void => {

});

tmi.client.on("part", (channel: string, username: string, self: boolean): void => {
	
});

tmi.client.on("whisper", (from: string, user: any, message: string, self: boolean): void => {
    let userstate: Userstate = GlobalService.convertToInstance(user);

    if (userstate.username === "NAME") {
        let messages: string[] = message.split(" ");
    	if (messages[0] === "!say") {
            messages.shift();
    		tmi.client.action(userConfigService.userConfig.channel_name, messages.join(" "));
		}
    }
});

tmi.client.on("chat", (channel: string, user: any, message: string, self: boolean): void => {
	let messages: string[] = message.split(" ");
	let userstate: Userstate = GlobalService.convertToInstance(user);
    
    sentences.setDataToDefault(userstate, userConfigService.userConfig, raffle.getUserCoins(userstate.userId));

    if (userConfigService.userConfig.rights.broadcaster == userstate.username 
        || userConfigService.userConfig.rights.mods.find(m => m == userstate.username)) {
        if (messages[0] === "!queue") {
            if (messages[1] === "get") {
                tmi.client.action(userConfigService.userConfig.channel_name, song.getSongList(userstate));
            }
            if (messages[1] === "remove") {
                tmi.client.action(userConfigService.userConfig.channel_name, song.removeSong(messages[2], user));
            }
        }
        if (messages[0] === "!specialraffle") {
            raffle.specialRaffle(tmi.client, userstate);
        }
		if (messages[0] === "!lockcommands") {
			tmi.settings.unCommandsLocked = false;
			tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "chat", "lockcommands", userstate));
		}
		if (messages[0] === "!unlockcommands") {
			tmi.settings.unCommandsLocked = true;
			tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "chat", "unlockcommands", userstate));
        }
        if (messages[0] === "!priosub") {
            song.prioSub(true);
            tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "chat", "priosub", userstate));
        }
        if (messages[0] === "!unpriosub") {
            song.prioSub(false);
            tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "chat", "unpriosub", userstate));
        }
        if (messages[0] === "!rights") {
            if (messages[1] === "add") {
                tmi.client.action(userConfigService.userConfig.channel_name, userConfigService.addRight());
            }
            if (messages[1] === "remove") {

            }
            if (messages[1] === "get")
        }
    }
    if (tmi.settings.unCommandsLocked) {
        if (messages[0] === "!queue" && messages[1] === "add") {
            if (messages[2] === "<song>") {
                tmi.client.action(userConfigService.userConfig.channel_name, userstate.displayName+" FailFish");
            } else {
                tmi.client.action(userConfigService.userConfig.channel_name, song.addSong(userstate, message));
            }
        }
        if (messages[0] === "!"+userConfigService.userConfig.points_short) {
            tmi.client.action(userConfigService.userConfig.channel_name, sentences.getSentence("core", "chat", "get_coins", userstate));
        }
        if (messages[0] === "!join") {
            raffle.addUserToRaffle(userstate);
        }
        if (messages[0] === "!rights" && messages[1] === "get") {

        }
    }
    sentences.deleteData(userstate);
});