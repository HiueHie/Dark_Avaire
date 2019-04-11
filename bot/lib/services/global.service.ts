import { Userstate } from '../../lib/models/userstate';

export class GlobalService {
    /**
     * @description Converts an invalide Userstate object to valide
     *
     * @param {any} jsonObj
     */
    public static convertToInstance(jsonObj: any): Userstate {
        return new Userstate(jsonObj);
    }
}
