const { TypeRegistry } = require("@polkadot/types");
const { hexStripPrefix } = require("@polkadot/util");
const path = require("path");
const rawMetadata = require(path.join(__dirname, "../../metadata.json"));


function metadataToHex() {
    const registry = new TypeRegistry();
    const { modules, extrinsic } = rawMetadata.metadata.V12;

    // Create metadata, magicNumber and version
    const metadata = registry.createType("MetadataV12", { modules, extrinsic });
    const magicNumber = registry.createType("U32", rawMetadata.magicNumber).toHex(true);
    const version = registry.createType("u8", 12).toHex(true);

    const hexMetadata = magicNumber.concat(hexStripPrefix(version), hexStripPrefix(metadata.toHex(true)));

    console.log(hexMetadata);
}

module.exports = metadataToHex;