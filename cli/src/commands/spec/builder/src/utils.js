const { xxhashAsU8a } = require("@polkadot/util-crypto");
const { u8aToHex } = require('@polkadot/util');
const { stringToU8a, __newString, __getArray } = require('./wasm-loader');
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
    static getHashKey(prefix, key, suffix) {
        // we use twoX128 hashing algorithm for keys
        const hashedPrefix = xxhashAsU8a(Utils.stringToBytes(prefix, false), 128);
        const hashedKey = xxhashAsU8a(Utils.stringToBytes(key, false), 128);
        const hashedSuffix = suffix.length > 0 ? xxhashAsU8a(suffix, 128) : [];
        const finalKey = new Uint8Array([...hashedPrefix, ...hashedKey, ...hashedSuffix]);
        return u8aToHex(finalKey);
    }

    /**
     * @description Convert string to bytes
     * @param {*} str value
     * @param {*} isScale SCALE encode if true
     */
    static stringToBytes(str, isScale) {
        const bytesPtr = stringToU8a(__newString(str), isScale);
        const bytes = __getArray(bytesPtr);
        return bytes;
    }
}

module.exports = Utils;