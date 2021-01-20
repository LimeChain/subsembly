
/**
 * @description Class with commonly used constants
 */
export class Constants {
    
    /**
     * @description URL for the latest bundled release of the Subsembly starter
     */
    static readonly REPO_URL: string = 'https://api.github.com/repos/LimeChain/subsembly/releases/latest';
    
    /**
     * @description Files/directories to ignore while initializing Subsembly project
     */
    static readonly INIT_IGNORE: string[] = [
        'cli',
        'scripts',
        'Makefile',
        'README.md',
        'images'
    ];
    
    /**
     * @description Zip file prefix of constants
     */
    static readonly ZIP_FILE_PREFIX: string = 'LimeChain-subsembly';
}