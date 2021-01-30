import { execSync } from "child_process";
import fs from "fs";
import path from 'path';
import { generateDispatcher, generateFile, generateMetadata } from '../../utils/src';
import { Constants } from "../constants";
import { Utils } from "../utils";

export class Compile {
    /**
     * @description Run compilation logic
     */
    static run(): void {
        console.log('Compiling Subsembly Project');
        if(!fs.existsSync(__dirname + '/node_modules')) {
            Compile._installDependencies();
        }
        
        execSync(`yarn run asbuild:optimized`);
        this._generateFiles();
    }

    /**
     * @description Install dependencies for the Subsembly project
     */
    static _installDependencies(): void {
        console.log('Installing Subsembly dependencies...');
        execSync(`yarn install && yarn --cwd=./utils install`);
    }

    static _generateFiles(): void {
        console.log('Generate Metadata and Dispatcher');
        const metadata = generateMetadata();
        fs.writeFileSync(path.join(process.cwd(), "../metadata.json"), JSON.stringify(metadata, null, 4));
        generateDispatcher(metadata);
        generateFile(metadata);
        return ;
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