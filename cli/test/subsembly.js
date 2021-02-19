const { exec } = require("child_process");
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
        console.log(executable);
        const process = exec(`cd ${cwd || ""} && ${executable} ${command} ${argsString.join(' ')}`);
        return new Promise (function(resolve, reject) {
            process.addListener('error', reject);
            process.addListener('exit', resolve);   
        });
    }
}

module.exports = Subsembly;