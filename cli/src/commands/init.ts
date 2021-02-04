import AdmZip = require('adm-zip');
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { Constants } from '../constants';

export class Init {
    /**
     * @description Runs initialization logic
     * @param to Directory to initialize new Subsembly project 
     */
    static async run(to: string): Promise<void> {
        if(fs.existsSync(path.join(process.cwd(), to))) {
            if(fs.readdirSync(path.join(process.cwd(), to)).length !== 0) {
                throw new Error("Init: Current directory is not empty!");
            }
        }
        // Get the information about latest release of Subsembly
        const { data } = await axios.get(Constants.REPO_URL);
        const zip_url: string = data.zipball_url;
        
        const response = await axios.get(zip_url, {
            responseType: 'arraybuffer'
        });

        const zip = new AdmZip(response.data as Buffer);

        for(const entry of zip.getEntries()) {
            const isMatch = Constants.INIT_IGNORE.some(rx => rx.test(entry.entryName));
            // By default extractEntryTo() extracts everything inside directory, which is not desired for us
            // since we may ignore only specific files inside the directory.
            if(!isMatch && !entry.isDirectory) {
                zip.extractEntryTo(entry, `./`, true, true);
            }
        };

        try{
            this.renameDir(to);
            console.log("Succesfully initialized new Subsembly starter project!");
        }
        catch(error) {
            throw new Error("Error initializing Subsembly project " + error.message);
        }
    }
    
    /**
     * @description Move files from unzipped folder to the provided directory
     * @param to direcrtory name
     */
    private static renameDir(to: string): void {
        const dirs = fs.readdirSync(process.cwd()).filter((dir) => dir.match(Constants.ZIP_FILE_PREFIX));
        const projectDir: string = path.join(process.cwd(), dirs[0]);

        fs.copySync(projectDir, path.join(process.cwd(), to), { overwrite: true });
        fs.removeSync(projectDir);
    } 
}