export class Userstate {
    badges: object;
	color: string;
	displayName: string;
	emotes: boolean;
	id: string;
	mod: boolean;
	roomId: number;
	subscriber: boolean;
	tmiSentTs: number;
	turbo: boolean;
	userId: number;
	userType: string;
	emotesRaw: any;
	badgesRaw: string;
	username: string;
	messageType: string;

	constructor(obj: any) {
		this.badges = obj['badges'];
		this.color = obj['color'];
		this.displayName = obj['display-name'];
		this.emotes = !!obj['emotes'];
		this.id = obj['id'];
		this.mod = !!obj['mod'];
		this.roomId = obj['room-id'];
		this.subscriber = !!obj['subscriber'];
		this.tmiSentTs = obj['tmi-sent-ts'];
		this.turbo = !!obj['turbo'];
		this.userId = obj['user-id'];
		this.userType = obj['user-type'];
		this.emotesRaw = obj['emotes-raw'];
		this.badgesRaw = obj['badges-raw'];
		this.username = obj['username'];
		this.messageType = obj['message-type'];
	}
}
