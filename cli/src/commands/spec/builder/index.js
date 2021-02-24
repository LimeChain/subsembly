#!/usr/bin/env node
const GenesisBuilder = require('./src/genesis-builder');
const fs = require('fs');
const { hexAddPrefix } = require("@polkadot/util");

/**
 * @description Class with functions for generating and converting Subsembly spec files
 */
class SpecBuilder{
    /**
     * @description Generate default customSpec file
     * @param {*} specPath 
     */
    static customSpec(specPath) {
        let templateSpec = require('./customSpec-template.json');
        fs.writeFileSync(specPath, JSON.stringify(templateSpec, null, 2));
        console.log('Successfully generated new custom spec file!');
    }

    /**
     * @description Convert customSpec file to raw
     * @param {*} specPath path to chain spec file
     * @param {*} rawSpecPath path to raw chain spec file
     * @param {*} wasmPath path to wasm-subsembly
     */
    static toRaw(specPath, rawSpecPath, wasmPath) {
        if(!fs.existsSync(specPath)){
            console.error(`Spec file doesn't exist at the provided path: ${specPath}`);
            return ;
        };
    
        let customSpec = require(specPath);
        let wasmCode = '0x';
        
        if(!fs.existsSync(wasmPath)){
            console.error(`Wasm code doesn't exist at the provided path: ${wasmPath}`);
            return ;
        }
        else{
            wasmCode = hexAddPrefix(fs.readFileSync(wasmPath).toString());
        }
    
        const rawGenesis = GenesisBuilder.toRaw(customSpec, wasmCode);
    
        customSpec.genesis = rawGenesis;
    
        fs.writeFileSync(rawSpecPath, JSON.stringify(customSpec, null, 2));
        console.log("Successfully converted to raw json!");
    }    
}

module.exports = SpecBuilder;