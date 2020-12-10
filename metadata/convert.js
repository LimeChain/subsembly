const { TypeRegistry } = require("@polkadot/types");
const fs = require("fs");

const { hexStripPrefix, hexToU8a } = require("@polkadot/util");
const rawMetadata = require("./metadata.json");

const registry = new TypeRegistry();
const { modules, extrinsic } = rawMetadata.metadata.V12;

const metadata = registry.createType("MetadataLatest", { modules, extrinsic });
const magicNumber = "0x6d657461";
const version = "0x0c";

// fs.writeFileSync("./metadata-v12.json", JSON.stringify(metadata.toJSON(), null, 4));

console.log(hexToU8a(magicNumber));
console.log(hexToU8a(version));

const hexMetadata = magicNumber.concat(hexStripPrefix(version), hexStripPrefix(metadata.toHex(true)));
console.log(metadata.toU8a().toString());