import { execSync } from "child_process";
import fs from "fs";
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
            Compile.installDependencies();
        }
        Compile.generateFiles();
        Compile.buildWasm();
    }

    /**
     * @description Install dependencies for the Subsembly project
     */
    private static installDependencies(): void {
        console.log('Installing Subsembly dependencies...');
        execSync(`yarn install && yarn --cwd=./utils install`);
    }

    /**
     * @description Generate Metadata and Dispatcher files
     */
    private static generateFiles(): void {
        console.log('Generating Metadata and Dispatcher files...');
        const metadata = generateMetadata();
        generateDispatcher(metadata);
        generateFile(metadata);
        return ;
    }
    /**
     * @description Convert optimized Wasm to Hex and write it in the file
     */
    private static buildWasm(): void {
        console.log('Building wasm file...');
        execSync(`yarn run asbuild:optimized`);
        
        const WASM_FILE = fs.readFileSync(Constants.WASM_PATH);
        const byteArray = new Uint8Array(WASM_FILE);

        const result = Utils.toHexString(byteArray);
        fs.writeFile('./build/subsembly-wasm', result, 'utf8', () => {
            console.info("Successfully created WASM Code file");
        });
    }
}