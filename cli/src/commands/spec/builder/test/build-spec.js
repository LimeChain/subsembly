const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const fs = require('fs');
const Utils = require('./utils/utils');
const MockedConstants = require('./utils/mocked-constants.json');

describe('Build spec tests', () => {
    before(async function() {
        await Utils.handleRawFilesDir();
    });

    it('correctly converts customSpec with all properties', async function() {
        await Utils.spec('./test/json-files/customSpec.json', './test/actual-raw-files/customSpecRaw.json', './test/utils/wasm-exmpl');
        
        assert.isTrue(fs.existsSync('./test/actual-raw-files/customSpecRaw.json'), 'file does not exist');
        const actualRaw = require('./actual-raw-files/customSpecRaw.json');
        assert.deepEqual(actualRaw, MockedConstants.CUSTOM_SPEC_RAW_FULL);
    })

    it('correctly converts customSpec without Aura authorities', async function() {
        await Utils.spec('./test/json-files/customSpec-noAura.json', './test/actual-raw-files/customSpecRaw-noAura.json', './test/utils/wasm-exmpl');
        
        assert.isTrue(fs.existsSync('./test/actual-raw-files/customSpecRaw-noAura.json'), 'file does not exist');
        
        const actualRaw = require('./actual-raw-files/customSpecRaw-noAura.json');
        assert.deepEqual(actualRaw, MockedConstants.CUSTOM_SPEC_NO_AURA);
    })

    it('correctly converts customSpec without Grandpa authorities', async function() {
        await Utils.spec('./test/json-files/customspec-noGrandpa.json', './test/actual-raw-files/customSpecRaw-noGrandpa.json', './test/utils/wasm-exmpl');
        
        assert.isTrue(fs.existsSync('./test/actual-raw-files/customSpecRaw-noGrandpa.json'), 'file does not exist');
        
        const actualRaw = require('./actual-raw-files/customSpecRaw-noGrandpa.json');
        assert.deepEqual(actualRaw, MockedConstants.CUSTOM_SPEC_NO_GRANDPA);
    })

    it('correctly converts customSpec with system property only', async function() {
        await Utils.spec('./test/json-files/customSpec-code.json', './test/actual-raw-files/customSpecRaw-code.json', './test/utils/wasm-exmpl');
        
        assert.isTrue(fs.existsSync('./test/actual-raw-files/customSpecRaw-code.json'), 'file does not exist');
        
        const actualRaw = require('./actual-raw-files/customSpecRaw-code.json');
        assert.deepEqual(actualRaw, MockedConstants.CUSTOM_SPEC_RAW_CODE);
    })

    it('should fail to convert customSpec without system property', async function() {
        const result = Utils.spec('./test/json-files/customSpec-noCode.json', './test/actual-raw-files/customSpecRaw-noCode.json', './test/utils/wasm-exmpl');
        await assert.isRejected(result, "Error: Invalid Genesis config provided");
    })

    it('should fail if there is no genesis property', async function(){
        const result = Utils.spec('./test/json-files/customSpec-noGenesis.json', './test/actual-raw-files/customSpecRaw-noGenesis.json', './test/utils/wasm-exmpl');
        await assert.isRejected(result, "Error: Invalid Genesis config provided");
    })

    it('should fail if balances property is not given', async function(){
        const result = Utils.spec('./test/json-files/customSpec-noBalances.json', './test/actual-raw-files/customSpecRaw-noBalances.json', './test/utils/wasm-exmpl');
        await assert.isRejected(result, "Balances: Invalid or no balances array provided");
    })

    it('should fail if there is no runtime property', async function(){
        const result = Utils.spec('./test/json-files/customSpec-noRuntime.json', './test/actual-raw-files/customSpecRaw-noRuntime.json', './test/utils/wasm-exmpl');
        await assert.isRejected(result, "Error: Invalid Genesis config provided");
    })

    after(async function() {
        await Utils.handleRawFilesDir();
    })
})