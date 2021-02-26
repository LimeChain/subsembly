const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const Subsembly = require('./utils/subsembly');

const Constants = require('./utils/constants');
/**
    Test that cli does not do anything if the folder is not empty
    Test that the cli inits a project in the current directory if to is omitted & verify that ignored folder/files are not there
    Test that the cli inits a project to the to directory if specified & verify that ignored folder/files are not there
 */
describe('Init command', () => {
    before(() => {
        fs.mkdirsSync(path.join(__dirname, './generated'));
    })

    it('Works for non-existing dir', async () => {
        await assert.isFulfilled(Subsembly.run(".", 'init', { to: './test/generated/sub1'}), "Unexpected error initializing");
    })

    it('Populates the directory', async () => {
        await assert.isFulfilled(Subsembly.run(".", 'init', { to: './test/generated/sub2'}), "Unexpected error initializing");
        const dirs = fs.readdirSync(path.join(__dirname, './generated/sub2'));
        assert.isAtLeast(dirs.length, 1, 'Directory was not generated');
        assert.include(dirs, 'assembly', "Does not contain assembly files initialized correctly!");
    })

    it('Initializes in current dir if to command is ignored', async () => {
        // create a new dir and go there
        execSync(`cd ${path.join(__dirname, './generated')} && mkdir sub3 && cd sub3`)
        await assert.isFulfilled(Subsembly.run(`${path.join(__dirname, './generated/sub3')}`, 'init', {}), 'Unexpected error in initializing');
        const dirs = fs.readdirSync(path.join(__dirname, './generated/sub3'));
        assert.isNotEmpty(dirs, "Not initialized");
        assert.include(dirs, 'assembly', "Not initialized");
    })

    it('Should not include ignored files in the directory', async () => {
        await assert.isFulfilled(Subsembly.run('.', 'init', {to: './test/generated/sub4'}), 'Unexpected error in initializing');
        const dirs = fs.readdirSync(path.join(__dirname, './generated/sub1'));
        const isMatch = dirs.filter(dir => Constants.INIT_IGNORE.some(rx => rx.test(dir)));
        assert.isEmpty(isMatch, "Some files are not ignored");
    })

    it('Should fail if the directory is not empty', async () => {
        await assert.isRejected(Subsembly.run('.', 'init', {to: './test/generated/sub4'}));
    })

    after(() => {
        fs.removeSync(path.join(__dirname, './generated'));
    })
})