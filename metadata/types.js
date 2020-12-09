const { pathToFileURL } = require('url');
const ts = require('typescript');
const fs = require("fs");
const { pathname } = pathToFileURL("../assembly/runtime/runtime.ts");
/**
 * Runtime instance to get constants for the modules
 */
const runtime = ts.createSourceFile(
    'runtime.ts',
    fs.readFileSync(pathname, 'utf-8'),
    ts.ScriptTarget.Latest
);

let types = {};

runtime.statements.forEach(node => {
    if(node.kind === ts.SyntaxKind.TypeAliasDeclaration){
        types[node.name.escapedText] = node.type.typeName.escapedText;
    }
})

console.log(types);
