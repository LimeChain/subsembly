<p align="center">
  <img src="./images/logo.svg">
</p>

<div align="center">
  
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) ![Smoke Tests](https://github.com/LimeChain/subsembly/workflows/Smoke%20Tests/badge.svg)
![Subsembly CLI Tests](https://github.com/LimeChain/subsembly/workflows/Subsembly%20CLI%20tests/badge.svg)

</div>

This is the starter project for the Subsembly framework used for developing `Substrate` runtimes in AssemblyScript. The project is work in progress.

## High-Level Overview
<p align="center">
  <img src="./images/components_diagram.png">
</p>

- **Runtime API** - Implementation of Node <> Runtime Entries
- **Runtime Configuration** - Configurable runtime similar to `Substrate` Runtimes
- **FRAME** - Runtime components that handle the administrative functionalities
- **Pallets** - Packages that deliver common functionality, reused in different chains
- **Core** - Runtime components that provide low-level functionality

### Folder Structure
Subsembly starter project consists of following folders:
```
subsembly
    assembly/
    │
    └───runtime    <--- Runtime API entries && defined types
    |
    └───frame      <--- Contains Executive and System modules used for orchestrating       
    runtime/
    │
    └───pallets    <--- Subsembly pallets include in Runtime
    
    cli/           <--- Contains source code of the Subsembly CLI 
    
```

Main types and API entries are defined in `runtime` folder. `runtime.ts` file in `runtime` folder defines types and constants for the frame modules and pallets.

## Subsembly CLI

`subsembly` is a cli tool that is used to ease the devopment of Subsembly runtimes.

### Installation

To install `subsembly`, run:

`npm install -g subsembly`

Requirements:
- Node >= 14.0.0

### Commands

#### `subsembly`

```
# Default command, displays help window
subsembly 

# Help command (alternatively, --help)
subsembly -h

```
#### `subsembly init`  
  
Initializes new Subsemly project to the specified path. Path to the new Subsembly project should be an empty or non-existing directory.

```
# subsembly init [to]
#   --to - initialization directory for the new Subsembly project

# With specified path
subsembly init --to=./new-sub

# Without specified path (initializes into the current directory)
subsembly init
```

#### `subsembly compile`
Compiles current Subsembly project. More specifically it installs the dependencies and generates the required files for the Runtime to support the `metadata` interface used by PolkadotJS. Lastly, it compiles the Subsembly Runtime into the hex encoded wasm binary file (WASM blob)

```
# creates new compiled wasm of the runtime in /build directory
subsembly compile
```

#### `subsembly spec`

A command used for generating chain specification files and converting them into raw.

```
# subsembly spec [to] [src] [raw] [wasm]
#   --to - path to the new chain specification file
#   --src - chain specification file that has to be converted to raw (required for converting to raw)
#   --raw - raw chain specification file (defaults to the {src}/raw-chain-spec.json)
#   --wasm - hex encoded wasm binary of the runtime (defaults to build/subsembly-wasm)

# Generating new chain spec file
subsembly spec

# or (it is recommended to put all your spec files inside spec-files/ folder in root directory)
subsembly spec --to=./new-sub

# Converting chain spec file to raw
subsembly spec --src=./spec-files/chain-spec --raw=./spec-files/raw-chain-spec --wasm=./build/subsembly-wasm

# or (places new raw spec file in ./spec-files, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec

# or (places new raw spec file in current directory, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec --raw=./
```

### Subsembly CLI Tests

To run tests for the cli:

- `yarn install && cd cli` - Install dependencies and go to cli directory

- `npm install && npm run build && npm link` - Install dependencies, run the cli and link it globally

- `npm run test` - perform tests

## Developing Subsembly Runtimes

#### Runtime configuration

Top-level runtime folder consists of Runtime API entries that are exposed to the Host. There is also, `runtime.ts` file, where types and constants for the frame modules and pallets are defined. We define general types that are used across the runtime and also pallet specific constants and types. 

There are some requirements for Runtime types, such as:

- Type should implement `Codec` interface from `as-scale-codec`. It makes sure that every type in the Runtime can be SCALE encoded and decoded. 
- Make sure to avoid possible `IntegerOverflow` exceptions. For example, it does not make sense to use 8-bit unsigned integer as `Timestamp` `Moment` type, since the value of timestamp is way out of range of what 8-bit unsigned integer can hold.

#### Essential components 

There are couple of essential modules and components that every runtime should have. 

- `Executive`  
    Acts as the orchestration layer for the runtime.
    It dispatches incoming extrinsic calls to the respective pallets in the runtime.

- `System`  
    Provides low-level types, storage, and functions for your blockchain. 
    All other pallets depend on the System library as the basis of your Subsembly runtime.

#### Core modules
Some other important modules for the runtime are imported from `subsembly-core`:  

- `Storage`  
    Provides access to the storage of the Host.

- `Crypto`  
    Contains various cryptographic utility functions, such as, signature verification.

- `Log`  
    Contains logging module used to print debug, info or error messages to the Host. 


#### Configurable pallets

- `pallets` folder  
    Contains all the pallets used in the runtime, except for `system` and `executive`. 

    This starter project comes with `Aura`, `Balances` and `Timestamp` pallets. The minimal requirements for building and running account-based runtime on `Substrate` node is to have those three pallets.

    In order to add pallets to your runtime, place the implementation of the pallet inside `/pallets` folder, similar to other pallets, and implement runtime API entries for the pallet.

    For example, in order to add `BABE` pallet to the runtime, place your code inside pallets folder and export necessary modules.

    Then in the `./runtime/api/others.ts` implement the method `BabeApi_configuration`. Add corresponding types and constants used in the pallet inside the `runtime.ts` and you are good to go.

#### Other tools

##### Metadata

`metadata` folder consists of a tool that generates and hex encodes the metadata of the runtime. Under the hood, it reads all pallets, gets declared calls, types, storage entries, events and generate a metadata of the runtime. Then it generates a new `metadata.ts` file inside `frame` folder, that contains a function that returns the metadata of the runtime.

The command for generating metadata is included in runtime build command. In order to debug metadata file, you can use `--json or -j` flag to generate json file of the metadata.

## Building and Running
### Makefile

Root folder consists of Makefile that eases the building and running the Subsembly runtime with a `Substrate` node.

#### Prerequisite:  
Install `jq`, `make` libraries with your favorite package manager:

For example:
```
brew install jq
brew install make
```
#### Steps: 

1. `make build` (or `make -B build` if you are getting `already up-to-date`) to build the runtime
2. `make run-node` to run the node with the freshly built runtime

Those commands build the Subsembly runtime, copy the generated wasm code to a raw chain spec file and run a docker container with the generated raw chain spec file.
The only thing left to do is add your Aura keys to get the block production started:

3. Insert Aura keys
```
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","dice height enter anger ahead chronic easily wave curious banana era happy","0xdcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa9659"],
    "id": 1
}'
```
#### Interacting using Polkadot JS Apps

A `Substrate` node running `Subsembly` runtime can be connected to [Polkadot Apps interface](https://polkadot.js.org/apps/), which improves the communication with your runtime and outer world. You can submit extrinsics, query storage, monitor produced blocks, etc. For more information, refer to [polkadot-js](https://polkadot.js.org/)

In order to connect to the Polkadot Apps, just build and run your node with your `Subsembly` runtime and go to the Polkadot Apps page. It should automatically connect to your node. Just make sure to choose `Development Network` on the left navigation tab.

If you are using the default development Runtime, the following accounts are already preconfigured with balances on genesis:
```
Alice
Bob
Charlie
Dave
Eve
Ferdie
```
each one of them having `1 000 000` units.

### Build runtime (Manual)

1. `yarn install`
2. `yarn run build`

Follow instructions above to create raw chain specification for your runtime. For example,

1. subsembly spec --to=./chain-spec.json
2. subsembly spec --src=./chain-spec.json

This will create a raw chain specification file in the current directory.

In order to run `Substrate` node with generated runtime, use Docker image of node `as-substrate`, which is a pre-built substrate template node running Aura consensus.

1. `docker pull limechain/as-substrate:stable`
2. `docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(pwd)/raw-chain-spec.json":/customSpecRaw.json -d limechain/as-substrate`

In order for you to start block production, you will have to instert your Aura keys as described above.

### Funding

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./images/web3_badge_black.png)
