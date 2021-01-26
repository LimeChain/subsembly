import { exec } from 'child_process';
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
            yargs
        },
        //@ts-ignore
        handler: (argv) => {
            console.log('Compiling substrate ')
            exec(`yarn install && yarn --cwd=./utils install && yarn build \
                && hex="0x" result=${"hex"}$( cat wasm-code ) \
                && mv ./spec-files/customSpecRaw.json ./spec-files/temp-raw.json \
                && jq --arg res "${"result"}" '.genesis.raw.top."0x3a636f6465" |= $res' ./spec-files/temp-raw.json > ./spec-files/customSpecRaw.json \
                && rm ./spec-files/temp-raw.json \
                `, 
                (error: Error | null, stdout: string, stderr: string) => {
                    console.log(stdout);
                    console.log(stderr);
                    if(error !== null) {
                        console.log(`Encountered an error: ${error.message}`);
                    };
            });
        }
    },
    {
        command: 'run',
        description: 'Run '
    }
];