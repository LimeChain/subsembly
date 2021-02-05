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
            await Init.run(argv.to || '');
        }
    },
    {
        command: 'compile',
        description: 'Compiles the Subsembly project placed in the current directory to a WASM bytecode',
        //@ts-ignore
        builder: (yargs) => {
        },
        //@ts-ignore
        handler: (argv) => {
            Compile.run();
        }
    }
];