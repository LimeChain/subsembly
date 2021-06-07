const { u8aToHex } = require('@polkadot/util');
const { Keyring } = require('@polkadot/api');
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
        Utils.validateIsArray(authorities, "Aura: Invalid or no Aura array provided");

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
        const auths = Utils.getAuthoritiesBytes(rawAuthorities);
        return {
            [key]: u8aToHex(auths)
        }
    }
}

module.exports = Aura;