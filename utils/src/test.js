const { eNum, namespace, call, switchCase, method, param, bytesReader } = require("./codegen");
const metadata = require('../metadata.json');
const { modules } = metadata.metadata.V12;

const pallets = eNum("Pallets", [], true);
const moduleCalls = [];

modules.forEach((module, index) => {
    pallets.addMember([module.name, index]);
    if (module.calls) {
        const calls = [];
        module.calls.forEach((call, index) => {
            calls.push([call.name, index]);
        });
        moduleCalls.push(eNum(`${module.name}Calls`, calls, false));
    };
});

console.log(pallets.toString());
moduleCalls.forEach(en => console.log(en.toString()));
/**
 * function _generateNamespace(metadata) {
    const metadataArr = arrayType(metadata);
    const metadataVar = variable("metadata", metadataArr, "u8[]", true);
    const metadataMethod = method("metadata", [], "u8[]", 
        `${metadataVar.toString()}
        return metadata;`,
        true
        );
    return namespace("Metadata", [metadataMethod], true).toString();
}
 */
function generateNamespace() {
    const extrinsic = param("opaqueExt", "OpaqueExtrinsic");
    const dispatcherMethod = method("dispatch", [extrinsic], "u8[]", )
}

function namespaceBody {
    
}