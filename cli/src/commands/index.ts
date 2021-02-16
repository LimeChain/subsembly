import { Compile } from './compile/compile';
import { Init } from "./init/init";
import { BuildSpec } from './spec/build-spec';

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
        command: 'spec [to] [src] [raw] [wasm]',
        description: 'Generates custom spec file or converts it',
        //@ts-ignore
        builder: (yargs) => {
            yargs.positional('to', {
                describe: 'Path for new spec generation',
                type: 'string'
            }).positional('src', {
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
            BuildSpec.run(argv.to || "", argv.src || "", argv.raw || "", argv.wasm || "");
        }
    }
];