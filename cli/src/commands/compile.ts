import { exec } from "child_process";
import fs from "fs";
import { Constants } from "../constants";
import { Utils } from "../utils";

export class Compile {
    /**
     * @description Run compilation logic
     */
    static run(): void {
        console.log('Compiling Subsembly Project');
        console.log(__dirname + '/node_modules');
        if(!fs.existsSync(__dirname + '/node_modules')) {
            Compile._installDependencies();
        }
        
        exec(`yarn build`, (error: Error | null, stdout: string, stderr: string) => {
                console.log(stdout);
                console.log(stderr);
                if(error !== null) {
                    console.log(`Encountered an error: ${error.message}`);
                };
            }
        );

        Compile._buildWasm();
    }

    /**
     * @description Install dependencies for the Subsembly project
     */
    static _installDependencies(): void {
        console.log('Installing Subsembly dependencies...');
        exec(`yarn install && yarn --cwd=./utils install`, 
            (error: Error | null, stdout: string, stderr: string) => {
                console.log(stdout);
                console.log(stderr);
                if(error !== null) {
                    console.log(`Encountered an error: ${error.message}`);
                };
            }
        );
    }

    /**
     * @description Convert optimized Wasm to Hex and write it in the file
     */
    static _buildWasm(): void {
        const WASM_FILE = fs.readFileSync(Constants.WASM_PATH);
        const byteArray = new Uint8Array(WASM_FILE);
        
        const result = Utils.toHexString(byteArray);
        fs.writeFile('./wasm-code', result, 'utf8', () => {
            console.info("Successfully created WASM Code file");
        });
    }
}