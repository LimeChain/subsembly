const ts = require('typescript');
const fs = require("fs");
const { TypeRegistry } = require("@polkadot/types");
const path = require("path");
const polkadotTypes = require("./types.json");

/**
 * Returns fallback for the type
 * Hex encoded default value for the type
 * @param {*} type 
 */
function _getFallback(type){
    switch(type){
        case polkadotTypes.Hash:
        case polkadotTypes.AccountId:
            return "0x".concat("00".repeat(32));
        case polkadotTypes.BlockNumber:
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

/**
 * Creates type instance with the given value
 * Returns hex encoded value
 * @param type 
 * @param value 
 */
function _convertValue(type, value){
    const registry = new TypeRegistry();
    return registry.createType(type, value).toHex(true);
}

/**
 * Render Storage items for the module metadata
 * @param obj node object
 */
function _extractStorageEntries(obj){
    let storageItems = [];
     obj.body.statements.forEach(node => {
        if(node.kind === ts.SyntaxKind.FunctionDeclaration){
            storageItems.push(_extractNode(node));
        }
    });
    return storageItems.length ? storageItems : null;

}

/**
 * Render calls for the module metadata
 * @param obj node object
 */
function _extractCalls(obj){
    let calls  = [];
    obj.members.forEach(node => {
        // Ignore calls with "_" prefix, since they are not exposed to outside
        if(node.kind === ts.SyntaxKind.MethodDeclaration && !node.name.escapedText.startsWith("_")){
            calls.push(_extractNode(node));
        }
    })
    return calls.length ? calls : null;
}

/**
 * Render constants
 * @param obj 
 */
function _extractConstants(obj){
    let constants = []; 
    obj.members.forEach(node => {
        if(node.kind === ts.SyntaxKind.MethodDeclaration){
            const type = _extractType(node.type);
            constants.push({
                name: node.name.escapedText,
                type,
                value: _convertValue(type, _extractValue(node.body)),
                documentation: _extractComments(node.jsDoc),
            });
        }
    });
    return constants;
}

/**
 * Extract metadata node (call, storage item, etc.) 
 * @param obj 
 */
function _extractNode(obj) {
    switch(obj.kind){
        // Extracting call (static function)
        case ts.SyntaxKind.MethodDeclaration:
            return {
                name: obj.name.escapedText,
                documentation: _extractComments(obj.jsDoc),
                type: _extractType(obj.type),
                args: _extractParams(obj.parameters)
            }
        // Extracting storage item (namespace funcion)
        case ts.SyntaxKind.FunctionDeclaration:
            const type = _extractStorageType(obj.type.typeArguments[0], obj.jsDoc);
            return {
                name: obj.name.escapedText,
                modifier: {
                    default: 1
                },
                documentation: _extractComments(obj.jsDoc),
                fallback: _getFallback(type.Plain),
                type
            };
        default:
            return null;
    }
}

function _extractMapTags(jsDoc) {
    const tags = [];
    jsDoc.forEach(doc => {
        if(doc.tags) {
            doc.tags.forEach(tag => {
                if(tag && tag.tagName && tag.tagName.escapedText && tag.tagName.escapedText.includes("storage_map")) {
                    tags.push({
                        name: tag.tagName.escapedText,
                        type: tag.comment
                    });
                }
            })
        }
    });
    return tags;
}

/**
 * Extract type of the storage item
 * @param type 
 */
function _extractStorageType(type, jsDoc){
    const extractedType = _extractType(type);
    const tags = _extractMapTags(jsDoc);
    if(tags.length){
        return {
            Map: {
                hasher: "Twox128",
                key: tags[0].type || "",
                value: extractedType,
                linked: false
            }
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
function _extractType(type){
    switch(type.kind){
        // u8[] type alias
        case ts.SyntaxKind.ArrayType:
            return "Vec<u8>";
        case ts.SyntaxKind.VoidKeyword:
            return "void";
        // Strip "Type" suffix from the runtime types
        default:
            return polkadotTypes[type.typeName.escapedText.replace("Type", "")];
        }
}

/**
 * Extract value of the constant
 * @param body body of the function
 */
function _extractValue(body){
    switch(body.kind){
        case 230:
            return body.statements[0].expression.arguments[0].text;
        default:
            return "0x00";
    }
}

/**
 * Extract parameters of the object
 * @param params list of parameter objects
 */
function _extractParams(params){
    if(params){
        return params.map((param) => {
            return{
                name: param.name.escapedText,
                type: _extractType(param.type)
            };
        })
    }
    return [];
}

/**
 * Extract comment of the object
 * @param jsDoc jsDoc object 
 */
function _extractComments(jsDoc){
    const documentation = [];
    if(!jsDoc || !jsDoc[0]){
        return [
            ""
        ];
    }
    jsDoc.forEach(doc => {
        if(doc.tags) {
            doc.tags.forEach(tag => tag.comment ? documentation.push(tag.comment): null);
        }
    })
    return documentation;
}

/**
 * NOTE: Following are hard-coded events that are necessary for integration of our runtime
 * with Polkadot JS apps. 
 */
function _getEvents(name) {
    switch(name) {
        case "Balances":
            return [
                {
                    "name": "BalanceSet",
                    "args": [
                      "AccountId",
                      "u64",
                      "u64"
                    ],
                    "documentation": [
                      " A balance was set by root. \\[who, free, reserved\\]"
                    ]
                  },
                  {
                    "name": "Transfer",
                    "args": [
                      "AccountId",
                      "AccountId",
                      "u64"
                    ],
                    "documentation": [
                      " Transfer succeeded. \\[from, to, value\\]"
                    ]
                  },
            ];
        case "System":
            return [
                {
                    "name": "ExtrinsicSuccess",
                    "args": [
                    "DispatchInfo"
                    ],
                    "documentation": [
                    " An extrinsic completed successfully. \\[info\\]"
                    ]
                },
                {
                    "name": "ExtrinsicFailed",
                    "args": [
                    "DispatchError",
                    "DispatchInfo"
                    ],
                    "documentation": [
                    " An extrinsic failed. \\[error, info\\]"
                    ]
                }
            ];
        default:
            null;
    }
}

/**
 * 
 * @param index Module index
 * @param node Loaded Module file
 */
module.exports = function generateModuleMetadata(index, node) {

    /**
     * Runtime instance to get constants for the modules
     */
    const runtime = ts.createSourceFile(
        'runtime.ts',
        fs.readFileSync(path.join(process.cwd(), "assembly/runtime/runtime.ts"), 'utf-8'),
        ts.ScriptTarget.Latest
    );
    
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

    /**
     * Goes through the statements inside the file and extracts storage entries and calls
     */
    node.statements.forEach(obj => {
        // Storage entries are defined inside a namespace with a corresponding name
        if(obj.kind === ts.SyntaxKind.ModuleDeclaration){
            const storage = _extractStorageEntries(obj);
            moduleMetadata.storage = storage ? {
                prefix: obj.name.escapedText.replace("StorageEntries", ""),
                items: storage
            } : null;
        }
        // Calls are defined as static functions inside a class with the same name as the name of the pallet
        else if(obj.kind === ts.SyntaxKind.ClassDeclaration){
            moduleMetadata.name = obj.name.escapedText;
            moduleMetadata.events = _getEvents(obj.name.escapedText);
            moduleMetadata.calls = _extractCalls(obj);
        }        
    });
    /**
     * Constants for each pallet are defined in runtime directory with name pattern moduleName + prefix
     */
    runtime.statements.forEach(obj => {
        if(obj.kind === ts.SyntaxKind.ClassDeclaration && obj.name.escapedText.toLowerCase().includes(node.fileName.toLowerCase())){
            moduleMetadata.constants = _extractConstants(obj);
        }
    });
    return moduleMetadata;
}