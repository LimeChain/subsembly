const { getAccountDataBytes, __getArray } = require('../wasm-loader');
const { Keyring } = require('@polkadot/api');
const { u8aToHex } = require('@polkadot/util');
const Utils = require('../utils');

class Balances {
    /**
     * @description Storage prefix of the module
     */
    static MODULE_PREFIX = "Balance";
    /**
     * @description Account key for the the module
     */
    static MODULE_KEY = "Account";
    /**
     * 
     * @param balances array with accountId and balances
     */
    static toRaw(balancesArray) {
        validateIsArray(balancesArray);

        const rawBalances = {};
        const keyring = new Keyring({ type: 'sr25519' });
        balancesArray.forEach(balanceArray => {
            validateIsArray(balanceArray);
            
            const keyringInstance = keyring.addFromAddress(balanceArray[0]);
            const key = u8aToHex(Utils.getHashKey(this.MODULE_PREFIX, this.MODULE_KEY, keyringInstance.publicKey));
            const value = accDataToHex(balanceArray[1]);
            rawBalances[key] = value;
        });
        return rawBalances;
    }
}

/**
 * Validates whether the provided parameter is array. Throws otherwise
 * @param {*} arr 
 */
function validateIsArray (arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Balances: Invalid or no balances array provided");
    }
}
 
/**
 * 
 * @param value encodes AccountData instance to hex
 */
const accDataToHex = (value) => {
    const accData = getAccountDataBytes(value);
    const res = __getArray(accData);
    return u8aToHex(res);
}

module.exports = Balances