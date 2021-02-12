import { BuildSpec } from './build-spec/build-spec';
import { Compile } from './compile/compile';
import { Init } from "./init/init";

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
    },
    {
        command: 'spec [spec] [raw] [wasm]',
        description: 'Generates custom spec file or converts it',
        //@ts-ignore
        builder: (yargs) => {
            yargs.positional('src', {
                describe: 'Path to the spec file',
                type: 'string'
            }).positional('raw', {
                describe: 'Path for raw chain spec output',
                type: 'string'
            }).positional('wasm', {
                describe: 'Path to the wasm file',
                type: 'string'
            })
        },
        //@ts-ignore
        handler: (argv) => {
            BuildSpec.run(argv.src || "", argv.raw || "", argv.wasm || "");
        }
    }
];