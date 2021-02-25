# Subsembly CLI

`subsembly` is a cli tool that is used to ease the devopment of Subsembly runtimes.

## Installation

To install `subsembly`, run:

`npm install -g subsembly`

## Commands

### `subsembly`

```
# Default command, displays help window
subsembly 

# Help command (alternatively, --help)
subsembly -h
```

### `subsembly compile`
Compiles current Subsembly project. Specifically, installs dependencies, generates `metadata` and `dispatcher` files and compiles the Subsembly runtime into hex encoded wasm binary file.

```
# creates new compiled wasm of the runtime in /build directory
subsembly compile
```

### `subsembly init`  
  
Initializes new Subsemly project to the specified path. Path to the new Subsembly project should be an empty or non-existing directory.

```
# subsembly init [to]
#   --to - initialization directory for the new Subsembly project

# With specified path
subsembly init --to={path}

# Without specified path (initializes into the current directory)
subsembly init
```

### `subsembly spec`

A command used for generating chain specification files and converting them into raw.

```
# subsembly spec [to] [src] [raw] [wasm]
#   --to - path to the new chain specification file
#   --src - chain specification file that has to be converted to raw (required for converting to raw)
#   --raw - raw chain specification file (defaults to the {src}/raw-chain-spec.json)
#   --wasm - hex encoded wasm binary of the runtime (defaults to build/subsembly-wasm)

# Generating new chain spec file
subsembly spec

# or
subsembly spec --to=./new-sub

# Converting chain spec file to raw
subsembly spec --src=./spec-files/chain-spec --raw=./spec-files/raw-chain-spec --wasm=./build/subsembly-wasm

# or (places new raw spec file in ./spec-files, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec

# or (places new raw spec file in current directory, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec --raw=./
```

