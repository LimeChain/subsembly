const { getAccountDataBytes, __getArray, __newArray, UInt8Array_ID } = require('../wasm-loader');
const { Keyring } = require('@polkadot/api');
const { u8aToHex } = require('@polkadot/util');
const Utils = require('../utils');
const { TypeRegistry } = require('@polkadot/types');
const System = require('./system');

class Balances {
    /**
     * @description Storage prefix of the module
     */
    static MODULE_PREFIX = "Balances";
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
        const typeReg = new TypeRegistry();
        balancesArray.forEach(balanceArray => {
            validateIsArray(balanceArray);
            const keyringInstance = keyring.addFromAddress(balanceArray[0]);
            const key = Utils.getHashKey(this.MODULE_PREFIX, this.MODULE_KEY, keyringInstance.publicKey);
            const systemKey = Utils.getHashKey(System.MODULE_PREFIX, System.MODULE_KEY, keyringInstance.publicKey);
            const accData = accDataToHex(typeReg.createType("U128", balanceArray[1].toString()).toU8a());
            const accInfo = System.getAccountInfo(accData);
            rawBalances[key] = accData;
            rawBalances[systemKey] = accInfo;
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
    const accData = getAccountDataBytes(__newArray(UInt8Array_ID, value));
    const res = __getArray(accData);
    return u8aToHex(res);
}

module.exports = Balances