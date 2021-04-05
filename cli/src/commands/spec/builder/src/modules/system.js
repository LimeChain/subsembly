const { stringToHex, hexAddPrefix, hexStripPrefix } = require('@polkadot/util');

class System {

    /**
     * The well known key :CODE
     */
    static CODE = ":code";
    /**
     * @description Storage suffix
     */
    static MODULE_KEY = "Account";
    /**
     * @description Name of the module for storage
     */
    static MODULE_PREFIX = "System"

    /**
     * Converts the system instance to raw object
     * @param system instance of the class 
     */
    static toRaw(system) {
        if (!system.code) {
            throw new Error("Code property is not populated");
        }
        return { [stringToHex(this.CODE)]: system.code };
    }

    /**
     * Combines account data with nonce and refCount to form AccountInfo
     * @param {*} hexAccountData 
     */
    static getAccountInfo(hexAccountData) {
        // nonce and refCount are 0 for all accounts in genesis
        const nonce = "0x00000000";
        const refCount = "0x00";
        return nonce.concat(hexStripPrefix(refCount)).concat(hexStripPrefix(hexAccountData));
    }
}

module.exports = System;