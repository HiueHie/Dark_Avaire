export class Rights {
    public targetusername: string;
    public rightname: string;
    public rightnames: string;

    constructor(targetusername = '', rightname = '', rightnames = '') {
        this.targetusername = targetusername;
        this.rightname = rightname;
        this.rightnames = rightnames;
    }
}
