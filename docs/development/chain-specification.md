---
description: Genesis chain spec
---

# Chain Specification

### Overview

A chain specification file is used define network communications, consensus-related information and initial account balances that Substrate node must have at genesis. For more information, please refer to Substrate [docs](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec#:~:text=A%20chain%20specification%2C%20or%20%22chain,it%20must%20have%20at%20genesis.).

### The Genesis State

Chain spec provides initial state of the runtime to the node. Some modules require specific storage keys to be populated before running. For instance, chain spec contains accounts with initial account balances for the **`Balances`** module, initial list of authorities for **`Aura`** module, etc.

### **`:code`**

Apart from the module specific information chain spec contains initial runtime logic compiled into **`wasm`**. It is placed as a value of **"code"** key.

### Customising Chain Spec

This command will produce new default chain-spec file with predefined test accounts and Aura authorities:

```text
subsembly spec --to=./chain-spec.json
```

Once you have the chain spec file, you are free to modify fields of the JSON file to suit your needs. For example, change initial balances of accounts, replace authorities, etc.

### Raw Chain Spec

Before chain spec is supplied to the runtime, it needs to converted to raw so that runtime understands it. It can be done by using this command:

```text
subsembly spec --src=./chain-spec.json --raw=./raw-chain-spec.json --wasm=./build/subsembly-wasm
```

When we distribute chain specs in JSON format, we need to convert it to raw to make sure that all nodes can sync the chain even after runtime upgrades.

