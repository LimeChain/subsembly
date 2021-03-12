---
description: Spec files
---

# subsembly spec

### Overview

A command used for generating chain specification files and converting them into raw. A chain specification file is used define network communications, consensus-related information and initial account balances that Substrate node must have at genesis.

### Syntax

```text
subsembly spec [to] [src] [raw] [wasm]
```

#### Parameters

* **`--to`** - \[optional\] initialisation path for the new chain specification file
* **`--src`** - \[optional\] source specification file to convert to raw, defaults to current directory
* **`--raw`** - \[optional\] path to save converted raw chain specification file. Defaults to **`{srcPath}/raw-chain-spec.json`**
* **`--wasm`** - \[optional\] path to the compiled hex encoded **`wasm`** binary. Defaults to **`build/subsembly-wasm`**

### Examples

```text
# Generating new chain spec file
subsembly spec

# or (it is recommended to put all your spec files inside spec-files/ folder in root directory)
subsembly spec --to=./chain-spec.json

# Converting chain spec file to raw
subsembly spec --src=./spec-files/chain-spec.json --raw=./spec-files/raw-chain-spec.json --wasm=./build/subsembly-wasm

# or (places new raw spec file in ./spec-files, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec.json

# or (places new raw spec file in current directory, if wasm exists in /build)
subsembly spec --src=./spec-files/chain-spec.json --raw=./
```

