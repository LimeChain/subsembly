const { u8aToHex } = require('@polkadot/util');
const { Keyring } = require('@polkadot/api');
const { 
    __newArray, __getArray,
    UInt8Array_ID, getAccountIdBytes 
} = require('../wasm-loader');
const Utils = require('../utils');

class Aura {
    /**
     * @description Aura module prefix
     */
    static MODULE_PREFIX = "Aura";

    /**
     * @description Authorities storage key
     */
    static MODULE_KEY = "Authorities";

    /**
     * Converts key&value pair to scale-encoded type
     * @param authorities list of authorities
     */
    static toRaw(authorities){
        validateIsArray(authorities);

        if (authorities.length === 0){
            throw new Error("Aura: Array of authorities is empty");
        }

        let rawAuthorities = [];
        const key = Utils.getHashKey(this.MODULE_PREFIX, this.MODULE_KEY, []);
        const keyring = new Keyring({ type: 'sr25519' });

        authorities.forEach(element => {
            const keyringInstance = keyring.addFromAddress(element);
            rawAuthorities = rawAuthorities.concat(Array.from(keyringInstance.publicKey));
        });
        const auths = getAuthoritiesBytes(rawAuthorities);
        return {
            [key]: u8aToHex(auths)
        }
    }
}

/**
 * Validates whether the provided parameter is array. Throws otherwise
 * @param {*} arr 
 */
function validateIsArray (arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Aura: Invalid or no authorities array provided");
    }
}

/**
 * Get scale encoded list of Aura authorities
 *  @param authorities list of authorities
 */
const getAuthoritiesBytes = (authorities) => {
    const aPtr = __newArray(UInt8Array_ID, authorities);
    const auths = getAccountIdBytes(aPtr);
    const result = __getArray(auths);
    return result;
}

module.exports = Aura;