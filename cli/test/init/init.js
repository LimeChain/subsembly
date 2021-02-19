const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const Subsembly = require('../subsembly');

const Constants = require('../constants');
/**
Test that cli does not do anything if the folder is not empty
Test that the cli inits a project in the current directory if to is omitted & verify that ignored folder/files are not there
Test that the cli inits a project to the to directory if specified & verify that ignored folder/files are not there
 */
describe('Init command', () => {
    it('Init command works', async () => {
        await assert.isFulfilled(Subsembly.run("", 'init', { to: './test/test-gen/sub1'}), "Unexpected error initializing");
    })

    it('Initializes new directory', async () => {
        const initRun = await Subsembly.run("", 'init', { to: './test/test-gen/sub1'});
        assert.strictEqual(initRun, 0, 'Unexpected error in initializing');
        const dirs = fs.readdirSync(path.join(__dirname, '../test-gen/sub1'));
        assert.isAtLeast(dirs.length, 1, 'Directory was not generated');
        assert.include(dirs, 'assembly', "Does not contain assembly files initialized correctly!");
    })

    it.only('to command ignored', async () => {
        // create a new dir and go there
        execSync(`cd ${path.join(__dirname, '../test-gen')} && mkdir sub2 && cd sub2`)
        await assert.isFulfilled(Subsembly.run(`${path.join(__dirname, '../test-gen/sub2')}`, 'init', {}), 'Unexpected error in initializing');
        const dirs = fs.readdirSync(path.join(__dirname, '../test-gen/sub2'));
        assert.isNotEmpty(dirs, "Not initialized");
        assert.include(dirs, 'assembly', "Not initialized");
    })

    it('Ignored files are not included', async () => {
        await assert.isFulfilled(Subsembly.run('', 'init', {to: './test/test-gen/sub1'}), 'Unexpected error in initializing');
        const dirs = fs.readdirSync(path.join(__dirname, '../test-gen/sub1'));
        const isMatch = dirs.filter(dir => Constants.INIT_IGNORE.some(rx => rx.test(dir)));
        assert.isEmpty(isMatch, "Some files are not ignored");
    })

    after(() => {
        fs.removeSync('../test-gen/sub1');
    })
})