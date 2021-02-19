const { exec, execSync } = require("child_process");
const path = require('path');

class Subsembly {
    /**
     * @description Runs a specific command with subsembly cli
     * @param {*} cwd a directory to run subsembly command from
     * @param {*} command subsembly command
     * @param {*} args object with key and value pairs for arguments
     */
    static run(cwd, command, args) {
        const argsString = [];
        Object.entries(args).forEach(([key, value]) => {
            argsString.push(`--${key}=${value}`);
        });
        const executable = path.relative(cwd, './dist/src/index.js');
        const process = exec(`${ cwd ? `cd ${cwd} &&` : ''} ${executable} ${command} ${argsString.join(' ')} && cd -`);
        return new Promise (function(resolve, reject) {
            process.addListener('close', (code, signal) => {
                switch(code) {
                    case 0:
                        resolve();
                    default:
                        reject();
                }
            })
        });
    }
}

module.exports = Subsembly;