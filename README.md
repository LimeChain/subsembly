# Subsembly
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./web3_badge_black.png)

This is the starter project for the Subsembly framework used for developing Substrate runtimes in AssemblyScript. The project is work in progress.

## Folder Structure
Subsembly starter consists of following folders:
```
subsembly
    assembly/
    │
    └───runtime    <--- Runtime API entries && defined types
    |
    └───frame      <--- Contains Executive and System modules used for orchestrating Runtime
    │
    └───pallets    <--- Subsembly pallets incluede in Runtime

    spec-files/     <--- Raw chain-spec files
```

### Adding pallets

This starter project comes with `Aura`, `Balances` and `Timestamp` pallets. They are the minimal requirements for building and running account-based runtime on Substrate node.

In order to add pallets to your runtime, place your implementation of pallet inside `/pallets` folder and implement runtime API entries for the pallet.

## Building and running
### Build runtime
1. `yarn install`
2. `yarn run build`

The above command generates `wasm-code` file in the root folder.

In order to run Substrate node with generated runtime, use Docker image of node:

1. `docker pull limechain/as-substrate:stable`
2. `docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/spec-files/demoSpecRaw.json":/customSpecRaw.json -d limechain/as-substrate`

### Makefile
Root folder consists of Makefile that eases the building and running the Subsembly runtime with a Substrate node.

```
make run-node
```
This command build the Subsembly runtime, copies generated wasm code to a raw chain spec file and runs docker container with the generated raw chain spec file.

