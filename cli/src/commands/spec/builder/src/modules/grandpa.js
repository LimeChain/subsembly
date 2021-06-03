const Utils = require('../utils');
const { u8aToHex, hexStripPrefix } = require('@polkadot/util');
const { Keyring } = require('@polkadot/api');
const { TypeRegistry } = require('@polkadot/types');

const { stringToHex } = require('@polkadot/util');

class Grandpa {
    /**
     * @description Well known key for GRANDPA authorities
     */
    static GRANDPA_AUTHORITIES = ":grandpa_authorities";
    /**
     * @description Convert GRANDPA module to raw
     * @param {*} authorities list of Grandpa authorities with weights
     */
    static toRaw(authorities) {
        const typeReg = new TypeRegistry();
        Utils.validateIsArray(authorities);

        if (authorities.length === 0){
            throw new Error("Grandpa: Array of authorities is empty");
        }
        // boolean byte indicating if authorities are present
        let rawAuthorities = "0x01";
        const authsLen = typeReg.createType('Compact<U64>', authorities.length);
        rawAuthorities = rawAuthorities.concat(hexStripPrefix(u8aToHex(authsLen.toU8a())))
        const keyring = new Keyring({ type: 'ed25519' });

        authorities.forEach(([accountId, weight]) => {
            const keyringInstance = keyring.addFromAddress(accountId);
            const weightU8a = typeReg.createType("U64", weight).toU8a();
            rawAuthorities = rawAuthorities.concat(hexStripPrefix(u8aToHex(keyringInstance.publicKey)));
            rawAuthorities = rawAuthorities.concat(hexStripPrefix(u8aToHex(weightU8a)));
        });

        return {
            [stringToHex(this.GRANDPA_AUTHORITIES)]: rawAuthorities
        }
    }
}

module.exports = Grandpa;