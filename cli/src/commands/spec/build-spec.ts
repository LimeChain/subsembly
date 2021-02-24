import fs from 'fs';
import path from 'path';
import SpecBuilder from './builder';

/**
 * @description Spec class used to generate new spec file and convert it to raw
 */
export class BuildSpec {
    /**
     * @description Run the build spec logic
     * @param srcPath where is the source spec
     * @param rawSpecPath where to save raw file
     * @param wasmPath where is the wasm code
     */
    static run(to: string, srcPath: string, rawSpecPath: string, wasmPath: string): void {
        try{
            if (to === '' && srcPath === '' && rawSpecPath === '' && wasmPath === '') {
                SpecBuilder.customSpec(path.resolve(process.cwd(), 'chain-spec.json'));
                return ;
            }
            if(to !== '') {
                SpecBuilder.customSpec(path.resolve(process.cwd(), to));
                return ;
            }
            if(srcPath === '') {
                console.error('No source spec file is specified!');
                process.exit(1);
            }
            if (rawSpecPath === '') {
                srcPath = path.resolve(process.cwd(), srcPath);
                rawSpecPath = path.resolve(path.dirname(srcPath), './raw-chain-spec.json');
            }
            if (wasmPath === '') {
                if(!fs.existsSync(path.resolve(process.cwd(), './build/subsembly-wasm'))){
                    console.error(`No wasm file path provided and ./build/wasm-runtime does not exist`);
                    process.exit(1);
                }
                wasmPath = path.resolve(process.cwd(), './build/subsembly-wasm');
            }
            console.log("Converting spec file to raw...")
            SpecBuilder.toRaw(
                path.resolve(process.cwd(), srcPath), 
                path.resolve(process.cwd(), rawSpecPath), 
                path.resolve(process.cwd(), wasmPath)
            );
        }
        catch(error) {
            console.error('Unexpected error while executing the command ' + error.message);
            process.exit(1);
        }
    }
}