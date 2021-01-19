const { TypeRegistry } = require("@polkadot/types");
const registry = new TypeRegistry();
const rawMetadata = require("./metadata.json");
const { modules, extrinsic } = rawMetadata.metadata.V12;

const metadata = registry.createType("MetadataV12", { modules, extrinsic });

registry.setMetadata({asLatest: metadata, version: 12});
const event = registry.createType("Compact", "0x00020300000000000302050000000000");
// const phase = registry.createType("Weight", "0x01000000000000000000000000000000")
console.log(event.toString());
// console.log(phase.toHuman());