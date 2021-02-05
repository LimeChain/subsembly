const { 
    __newArray, __newString, __getArray,
    UInt8Array_ID, getHashedKey 
} = require('../wasm-loader');
const { xxhashAsU8a } = require("@polkadot/util-crypto");
/**
 * @description Utility functions
 */
class Utils {
    /**
     * @description Get hashed storage key
     * @param {*} prefix 
     * @param {*} key 
     * @param {*} suffix 
     */
    static getHashKey(prefix, key, suffix){
        const hashedSuffix = xxhashAsU8a(suffix, 128);
        const hashedPrefix = xxhashAsU8a(prefix, 128);
        const hashedKey = xxhashAsU8a(key, 128);
        const result = new Uint8Array(hashedSuffix.length + hashedPrefix.length + hashedKey.length);
        result.set(hashedPrefix);
        return hashedPrefix.to
    }
}

module.exports = Utils;