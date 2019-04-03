/* tslint:disable:max-classes-per-file */
export class UserConfig {
    public channel_name: string;
    public rights: {[rightName: string]: string[]};
    public points_name: string;
    public points_short: string;
    public raffle: Raffle;
}

class Raffle {
    public rewards: Rewards;
}

class Rewards {
    public everyone: number;
    public normal_user: number;
    public sub_user: number;
}
