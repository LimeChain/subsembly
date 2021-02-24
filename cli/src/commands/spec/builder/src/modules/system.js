const { stringToHex } = require('@polkadot/util');

class System {

    /**
     * The well known key :CODE
     */
    static CODE = ":code";

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
}

module.exports = System;