const ts = require('typescript');
const fs = require("fs");
const { TypeRegistry } = require("@polkadot/types");
const { pathToFileURL } = require('url');
const { pathname } = pathToFileURL("../assembly/runtime/runtime.ts");
const polkadotTypes = require("./types.json");

/**
 * Returns fallback for the type
 * @param {*} type 
 */
function getFallback(type){
    switch(type){
        case polkadotTypes.Hash:
        case polkadotTypes.AccountId:
            return "0x".concat("00".repeat(32));
        case polkadotTypes.BlockNumber:
        case polkadotTypes.Amount:
        case polkadotTypes.Int64:
        case polkadotTypes.Moment:
        case polkadotTypes.Nonce:
        case polkadotTypes.UInt64:
            return "0x".concat("00".repeat(8));
        case polkadotTypes.ExtrinsicIndex:
        case polkadotTypes.Int32:
        case polkadotTypes.UInt32:
            return "0x".concat("00".repeat(4));
        case polkadotTypes.Int16:
        case polkadotTypes.UInt16:
            return "0x".concat("00".repeat(2));
        default:
            return "0x00";
    }
}

function _convertValue(type, value){
    const registry = new TypeRegistry();
    return registry.createType(type, value).toHex(true);
}

/**
 * Runtime instance to get constants for the modules
 */
const runtime = ts.createSourceFile(
    'runtime.ts',
    fs.readFileSync(pathname, 'utf-8'),
    ts.ScriptTarget.Latest
);

/**
 * Render Storage items for the module metadata
 * @param obj node object
 */
function renderStorage(obj){
    let storageItems = [];
    obj.body.statements.forEach(node => {
        if(node.kind === ts.SyntaxKind.FunctionDeclaration){
            storageItems.push(renderNode(node));
        }
    });
    return storageItems.length ? storageItems : null;

}

/**
 * Render calls for the module metadata
 * @param obj node object
 */
function renderCalls(obj){
    let calls = [];
    obj.members.forEach(node => {
        if(node.kind === ts.SyntaxKind.MethodDeclaration && !node.name.escapedText.startsWith("_")){
            calls.push(renderNode(node));
        }
    })
    return calls.length ? calls : null;
}

/**
 * Render constants
 * @param obj 
 */
function renderConstants(obj){
    let constants = [];
    obj.members.forEach(node => {
        if(node.kind === ts.SyntaxKind.MethodDeclaration){
            const type = extractType(node.type)
            constants.push({
                name: node.name.escapedText,
                type,
                value: _convertValue(type, extractValue(node.body)),
                documentation: extractComment(node.jsDoc),
            })
        }
    })
    return constants;
}

/**
 * Render a Node object, i.e get name, comment, parameters and types of the object
 * @param obj 
 */
function renderNode(obj) {
    switch(obj.kind){
        case ts.SyntaxKind.MethodDeclaration:
            return {
                name: obj.name.escapedText,
                documentation: extractComment(obj.jsDoc),
                type: extractType(obj.type),
                args: extractParams(obj.parameters)
            }
        case ts.SyntaxKind.FunctionDeclaration:
            const type = extractStorageType(obj.type.typeArguments[0])
            return {
                name: obj.name.escapedText,
                modifier: {
                    default: 1
                },
                documentation: extractComment(obj.jsDoc),
                fallback: getFallback(type.Plain),
                type
            };
    }
}

/**
 * Extract type of the storage item
 * @param type 
 */
function extractStorageType(type){
    const extractedType = extractType(type);
    if(typeof extractedType === 'object'){
        return {
            Map: extractedType
        }
    }
    return {
        Plain: extractedType
    };
}

/**
 * Extract type from type object
 * @param type type object
 */
function extractType(type){
    switch(type.kind){
        case 178:
            return "Bytes";
        case 113:
            return "void";
        default:
            return polkadotTypes[type.typeName.escapedText.replace("Type", "")];
        }
}

function extractValue(body){
    switch(body.kind){
        case 230:
            return body.statements[0].expression.arguments[0].text
    }
}

/**
 * Extract parameters of the object
 * @param params list of parameter objects
 */
function extractParams(params){
    let args = [];
    if(params){
        params.forEach((param) => {
            args.push({
                name: param.name.escapedText,
                type: extractType(param.type)
            })
        })
    }
    return args;
}

/**
 * Extract comment of the object
 * @param jsDoc jsDoc object 
 */
function extractComment(jsDoc){
    if(!jsDoc || !jsDoc[0]){
        return [
            ""
        ];
    }
    if(jsDoc[0].comment && !jsDoc[0].tags){
        return [
            jsDoc[0].comment
        ];
    }
    return [jsDoc[0].tags[0].comment];
}

/**
 * 
 * @param index Module index
 */
module.exports = function generateMetadata(index, node){
    /**
     * Template for Metadata of the module
     */
    let moduleMetadata = {
        name: "",
        storage: null,
        calls: null,
        events: null,
        constants: [],
        errors: [],
        index: null
    };

    moduleMetadata.index = index;
    node.statements.map(obj => {
        if(obj.kind === ts.SyntaxKind.ModuleDeclaration){
            const storage = renderStorage(obj);
            moduleMetadata.storage = storage ? {
                prefix: node.fileName,
                items: storage
            } : null;
        }
        else if(obj.kind === ts.SyntaxKind.ClassDeclaration){
            moduleMetadata.name = obj.name.escapedText;
            moduleMetadata.calls = renderCalls(obj);
        }
    });
    runtime.statements.forEach(obj => {
        if(obj.kind === ts.SyntaxKind.ClassDeclaration && obj.name.escapedText.toLowerCase().includes(node.fileName.toLowerCase())){
            moduleMetadata.constants = renderConstants(obj);
        }
    });
    return moduleMetadata;
}