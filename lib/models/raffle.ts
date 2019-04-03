export class Raffle {
    public time: number;
    public winusername: string;
    public winuserdisplay: string;
    public winpoints: number;

    constructor(time = 0, winusername = '', winuserdisplay = '', winpoints = 0) {
        this.time = time;
        this.winusername = winusername;
        this.winuserdisplay = winuserdisplay;
        this.winpoints = winpoints;
    }
}
