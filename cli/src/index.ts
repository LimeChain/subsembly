import yargs from 'yargs';
import { Init } from './commands/init';

const args = yargs.options({
    init: {type: 'string', demandOption: false, alias: 'i'},
}).command({
    command: 'init',
    builder: (yargs) => {
        return yargs.option('y', {
            alias: 'yes',
            describe: 'Use default values for the configuration'
        })
    },
    handler: async () => {
        const answers = await Init.init();
        console.log(answers);
    }
}).argv;
