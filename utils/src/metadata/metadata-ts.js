const { TypeRegistry } = require("@polkadot/types");
const { numberToU8a } = require("@polkadot/util");
const fs = require('fs');
const path = require("path");
const { namespace, method, arrayType, variable } = require('../codegen');

function _generateNamespace(metadata) {
    const metadataArr = arrayType(metadata);
    const metadataVar = variable("metadata", metadataArr, "u8[]", true);
    const metadataMethod = method("metadata", [], "u8[]", 
        `${metadataVar.toString()}
        return metadata;`,
        true
        );
    return namespace("Metadata", [metadataMethod], true).toString();
}

/**
 * Generate metadata.ts file with the encoded metadata
 */
function generateFile(rawMetadata) {
    const registry = new TypeRegistry();
    const { modules, extrinsic } = rawMetadata.metadata.V12;

    // Create metadata, magicNumber and version
    const metadata = registry.createType("MetadataV12", { modules, extrinsic });
    const magicNumber = registry.createType("U32", rawMetadata.magicNumber).toHex(true);
    const version = registry.createType("u8", 12).toHex(true);
    // SCALE encode metadata
    const encodedData = Array.from(numberToU8a(magicNumber)).concat(Array.from(numberToU8a(version))).concat(Array.from(metadata.toU8a()));
    fs.writeFileSync(path.join(__dirname, "../../../assembly/generated/metadata.ts"), _generateNamespace(encodedData));
}

module.exports = generateFile;