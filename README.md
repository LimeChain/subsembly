# Subsembly
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./web3_badge_black.png)

This is the starter project for the Subsembly framework used for developing Substrate runtimes in AssemblyScript. The project is work in progress.

## Folder Structure
Subsembly starter project consists of following folders:
```
subsembly
    assembly/
    │
    └───runtime    <--- Runtime API entries && defined types
    |
    └───frame      <--- Contains Executive and System modules used for orchestrating Runtime
    │
    └───pallets    <--- Subsembly pallets include in Runtime

    spec-files/     <--- Raw chain-spec files
```

Main types and API entries are defined in `runtime` folder. `runtime.ts` file in `runtime` folder defines types and constants for the frame modules and pallets.

### Adding pallets

This starter project comes with `Aura`, `Balances` and `Timestamp` pallets. The minimal requirements for building and running account-based runtime on Substrate node is to have those three pallets.

In order to add pallets to your runtime, place your implementation of pallet inside `/pallets` folder and implement runtime API entries for the pallet.

## Building and running
### Build runtime
1. `yarn install`
2. `yarn run build`

The above command generates `wasm-code` file in the root folder.

In order to run Substrate node with generated runtime, use Docker image of node `as-substrate`, which is a pre-built substrate template node running Aura consensus.

1. `docker pull limechain/as-substrate:stable`
2. `docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/spec-files/customSpec.json":/customSpecRaw.json -d limechain/as-substrate`

Next, insert Aura keys to get started with block production:
```
curl --location --request POST 'localhost:5000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","dice height enter anger ahead chronic easily wave curious banana era happy","0xdcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa9659"],
    "id": 1
}'
```

### Makefile
Root folder consists of Makefile that eases the building and running the Subsembly runtime with a Substrate node.

```
make run-node
```
This command builds the Subsembly runtime, copies generated wasm code to a raw chain spec file and runs docker container with the generated raw chain spec file.

