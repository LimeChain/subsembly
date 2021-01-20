import AdmZip = require('adm-zip');
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { Constants } from '../constants';

export class Init {

    /**
     * @description 
     * @param config Subsembly configuration
     */
    static async init(): Promise<void> {
        const { data } = await axios.get(Constants.REPO_URL);
        const zip_url: string = data.zipball_url;
        const response = await axios.get(zip_url, {
            responseType: 'arraybuffer'
        });
        const zip = new AdmZip(response.data as Buffer);

        const zipEntries = zip.getEntries();
        zipEntries.forEach((entry) => {
            if(!Constants.INIT_IGNORE.includes(entry.name)) {
                zip.extractEntryTo(entry, `./`, true, true);
            }
        });
        
        try{
            await this._renameDir();
            console.log("Succesfully initialized new Subsembly starter project!");
        }
        catch(error) {
            throw new Error("Error initializing Subsembly project " + error.message);
        }
    }
    
    /**
     * @description Rename the folder with unzipped files to provided project name
     * @param to project name
     */
    static async _renameDir(to: string = ''): Promise<void> {
        const dirs = fs.readdirSync(process.cwd()).filter((dir) => dir.match(Constants.ZIP_FILE_PREFIX));
        const projectDir: string = dirs[0];

        fs.moveSync(projectDir, path.join(process.cwd(), to));
    } 
}