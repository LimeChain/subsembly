const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const generateMedata = require('./metadata');
const { pathToFileURL } = require('url');
const {pathname} = pathToFileURL("../assembly/pallets");
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
            }
        }
    }
};

/**
 * Load system node
 */
const systemNode = ts.createSourceFile(
    "System",
    fs.readFileSync('../assembly/frame/system.ts', 'utf-8'),
    ts.ScriptTarget.Latest
);

metadata.metadata.V12.modules.push(generateMedata(metadata.metadata.V12.modules.length, systemNode));


fs.readdirSync(pathname).forEach(module => {
    const assemblyPath = path.join(pathname, module, "assembly");
    if(!module.includes("index.ts") && !module.includes("json")){
        fs.readdirSync(assemblyPath).forEach(file => {
            if(file.includes(module)){
                const moduleNode = ts.createSourceFile(
                    module,
                    fs.readFileSync(path.join(assemblyPath, file), "utf-8"),
                    ts.ScriptTarget.Latest,
                );
                metadata.metadata.V12.modules.push(generateMedata(metadata.metadata.V12.modules.length, moduleNode));
            }
        });
    }
}
);

fs.writeFileSync("./metadata.json", JSON.stringify(metadata, null, 4));