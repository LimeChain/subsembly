const Balances = require("./modules/balances");
const System = require("./modules/system");
const Aura = require('./modules/aura');
const Grandpa = require('./modules/grandpa');

/**
 * Class for the genesis configuration
 */
class GenesisBuilder {
    
    /**
     * Converts genesis property of the class to Raw
     * @param genesis instance of class 
     */
    static toRaw(genesisConfig, wasm) {
        if (!(genesisConfig && genesisConfig.genesis && genesisConfig.genesis.runtime && genesisConfig.genesis.runtime.system)) {
            throw new Error('Error: Invalid Genesis config provided');
        }

        const rawGenesis = {
            raw: {
                top: {
                }
            }
        };

        const system = genesisConfig.genesis.runtime.system;
        system['code'] = wasm;
        const rawSystem = System.toRaw(system);
        Object.assign(rawGenesis.raw.top, rawSystem);

        // Add any Balances related raw data
        if (genesisConfig.genesis.runtime.balances) {
            const balances = genesisConfig.genesis.runtime.balances;
            const rawBalances = Balances.toRaw(balances.balances);
            Object.assign(rawGenesis.raw.top, rawBalances);
        }

        // Add any Aura related raw data
        if(genesisConfig.genesis.runtime.aura){
            const rawAura = Aura.toRaw(genesisConfig.genesis.runtime.aura.authorities);
            Object.assign(rawGenesis.raw.top, rawAura);
        }
        if(genesisConfig.genesis.runtime.grandpa) {
            const rawGrandpa = Grandpa.toRaw(genesisConfig.genesis.runtime.grandpa.authorities);
            Object.assign(rawGenesis.raw.top, rawGrandpa);
        }
        rawGenesis['raw']["childrenDefault"] = {};
        return rawGenesis;
    }
}

module.exports = GenesisBuilder