import { Compile } from './compile';
import { Init } from "./init";

/**
 * @description List of command of Subsembly-cli
 */
export const commands = [
    {
        command: 'init [to]',
        description: 'Initialize a new Subsembly starter project',
        // @ts-ignore
        builder: (yargs) => {
            yargs.positional('to', {
                describe: 'Directory to initialize new Subsembly project in. Defaults to current directory.',
                type: 'string'
            })
        },
        //@ts-ignore
        handler: async (argv) => {
            await Init.run(argv.to ? argv.to : '');
        }
    },
    {
        command: 'compile',
        description: 'Compile Subsembly project',
        //@ts-ignore
        builder: (yargs) => {
        },
        //@ts-ignore
        handler: async (argv) => {
            await Compile.run();
        }
    }
];