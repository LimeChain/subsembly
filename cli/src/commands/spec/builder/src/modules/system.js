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
            console.error("Code property is not populated");
            process.exit(1);
        }
        return { [stringToHex(this.CODE)]: system.code };
    }
}

module.exports = System;