#!/usr/bin/env node
const GenesisBuilder = require('./src/genesis-builder');
const fs = require('fs');
const path = require('path');
const curPath = process.cwd();
const { hexAddPrefix } = require("@polkadot/util");

let argv = require('yargs')
    .usage('\n \n Usage: $0 [options]')
    .example('$0 -f customSpec.json -o customSpecRaw.json -c wasm-code', 'convert given file to raw and write to output')
    .option('f', 
    {
        alias: 'file',
        describe: 'input file',
        demandOption: true
    })
    .option('o', {
        alias: 'output',
        describe: 'output file'
    })
    .option('c', {
        alias: 'wasmCode',
        describe: 'wasm-code file'
    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2020 Limehchain LTD. \n')
    .argv;


if(!fs.existsSync(`${curPath}/${argv.file}`)){
    throw new Error(`${argv.file} doesn't exist at the provided path: ${curPath}/${argv.file}`);
}

let customSpec = require(path.join(curPath, argv.file));

if(!argv.wasmCode || !fs.existsSync(`${curPath}/${argv.wasmCode}`)){
    console.log(
        `${argv.wasmCode} doesn't exist at the provided path: ${curPath}/${argv.wasmCode} \n
        WARN: Moving on with empty code property
        `
    );
}
else{
    let wasmCode = fs.readFileSync(path.join(curPath, argv.wasmCode));
    customSpec.genesis.runtime.system.code = hexAddPrefix(wasmCode.toString());

}

const rawGenesis = GenesisBuilder.toRaw(customSpec);

customSpec.genesis = rawGenesis;
// set default file to write, if output file isn't provided
const outputFile = argv.output ? argv.output : `${curPath}/customSpecRaw.json`;
fs.writeFileSync(outputFile, JSON.stringify(customSpec, null, 2));
console.log("succesfully converted to raw json");