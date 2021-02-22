const Subsembly = require('../subsembly');
const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const path = require('path');
const fs = require('fs-extra');
/**
Check for generated files
Check for wasm file
If there is a compilation error it should display it
 */
describe('Subsembly compile command', () => {
    before(async() => {
        fs.mkdirSync(path.join(__dirname, '../generated'));
        await Subsembly.run(".", 'init', { to: './test/generated/sub1'})
    })

    it('Should compile Subsembly project', async () => {
        await assert.isFulfilled(Subsembly.run(path.resolve(__dirname, '../generated/sub1'), 'compile', {}), 'Unexpected error while compiling');
        const genDirs = fs.readdirSync(path.resolve(__dirname, '../generated/sub1/assembly/generated'));
        assert.include(genDirs, 'dispatcher.ts', 'dispatcher.ts is not generated');
        assert.include(genDirs, 'metadata.ts', 'metadata.ts is not generated');
        assert.isTrue(fs.existsSync(path.resolve(__dirname, '../generated/sub1/build/subsembly-wasm'), 'subsembly-wasm was not generated'));
    }).timeout(30000);

    after(() => {
        fs.removeSync(path.join(__dirname, '../generated'));
    })
})