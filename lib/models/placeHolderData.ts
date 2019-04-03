import { Core } from './core';
import { Raffle } from './raffle';
import { Rights } from './rights';
import { Song } from './song';

export class PlaceHolderData {
    public core: Core;
    public raffle: Raffle;
    public rights: Rights;
    public song: Song;

    constructor() {
        this.core = new Core();
        this.raffle = new Raffle();
        this.rights = new Rights();
        this.song = new Song();
    }
}
