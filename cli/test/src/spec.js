const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const path = require('path');
const fs = require('fs-extra');
const Subsembly = require('../subsembly');

describe('Subsembly spec command', () => {
    before(() => {
        fs.mkdirSync(path.join(__dirname, '../generated'));
        fs.mkdirSync(path.join(__dirname, '../generated/spec-files'))
    })
    const cwdSpec = path.resolve(__dirname, '../generated/spec-files');
    const wasmPath = path.resolve(__dirname, './wasm-exmpl');

    it('Should initialize new default spec', async () => {
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', {}), 'Unexpected error while generating spec!');
        assert.isTrue(fs.existsSync(path.join(cwdSpec, './chain-spec.json')), 'Chain spec was not generated!');
    })

    it('Should initialize at specified path if to command is given', async () => {
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', {to: './chain-spec-1.json'}), 'Unexpected error while generating spec!');
        assert.isTrue(fs.existsSync(path.join(cwdSpec, './chain-spec-1.json')), 'Chain spec does not exist!');
    })

    it('Should throw an error if srcPath is not specified when converting to raw', async () => {
        await assert.isRejected(Subsembly.run(cwdSpec, 'spec', { raw: './raw-chain-spec.json', wasm: wasmPath}));
        assert.isFalse(fs.existsSync(path.join(cwdSpec, './raw-chain-spec.json')), 'Raw spec file was generated!')
    })

    it('Should convert spec file to raw', async() => {
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', {to: './chain-spec-3.json'}), 'Unexpected error while generating spec!');
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', {src: './chain-spec-3.json', raw: './raw-chain-spec-2.json', wasm: wasmPath }), 'Unexpected error while generating spec!');
        assert.isTrue(fs.existsSync(path.join(cwdSpec, './raw-chain-spec-2.json')), 'Raw chain spec does not exist!');
    })
    
    it('Should write raw file to the same directory as src file if not specified', async () => {
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', {to: './chain-spec-2.json'}), 'Unexpected error while generating spec!');
        await assert.isFulfilled(Subsembly.run(cwdSpec, 'spec', { src: './chain-spec-2.json', wasm: wasmPath }), 'Unexpected error while generating spec!');
        assert.isTrue(fs.existsSync(path.join(cwdSpec, './raw-chain-spec.json')), 'Raw chain spec does not exist!');
    })

    after(() => {
        fs.removeSync(path.join(__dirname, '../generated'));
    })
})