const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const generateModuleMetadata = require("./module-metadata");
const palletsPath = path.join(__dirname, "../../../assembly/pallets/")

/**
 * Generates the metadata of the Subsembly runtime
 */
function generateMetadata() {
    console.log("gets called?");
    /**
     * Template metadata object to be populated
     */
    const metadata = {
        magicNumber: 1635018093,
        metadata: {
            V12: {
                modules: [],
                extrinsic: {
                    version: 4,
                    signedExtensions: [
                        "CheckSpecVersion",
                        "CheckTxVersion",
                        "CheckGenesis",
                        "CheckMortality",
                        "CheckNonce",
                        "CheckWeight",
                        "ChargeTransactionPayment"
                    ]
                }
            }
        }
    };

    /**
     * System module is not inside pallets directory, so we load it separately
     */
    const systemNode = ts.createSourceFile(
        "System",
        fs.readFileSync(path.join(__dirname, '../../../assembly/frame/system.ts'), 'utf-8'),
        ts.ScriptTarget.Latest
    );

    /**
     * Add System module metadata
     */
    metadata.metadata.V12.modules.push(generateModuleMetadata(metadata.metadata.V12.modules.length, systemNode));

    /**
     * Go through the pallets inside `pallets` folder and generate module metadata for each pallet
     */
    fs.readdirSync(palletsPath).forEach(module => {
        // path to the top AS project folder
        const assemblyPath = path.join(palletsPath, module);
        // we ignore index.ts and json files
        if (!module.includes("index.ts") && !module.includes("json")) {
            // Go through the files inside the pallet
            fs.readdirSync(assemblyPath).forEach(file => {
                // Name of the file should be same as the name of the pallet/module
                if (file.includes(module)) {
                    const moduleNode = ts.createSourceFile(
                        module,
                        fs.readFileSync(path.join(assemblyPath, file), "utf-8"),
                        ts.ScriptTarget.Latest
                    );
                    metadata.metadata.V12.modules.push(generateModuleMetadata(metadata.metadata.V12.modules.length, moduleNode));
                }
            });
        }
    }
    );

    return metadata;
}

module.exports = generateMetadata;