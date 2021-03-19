---
description: Developing runtime
---

# Runtime Development

### Getting Started

First, make sure you have the CLI tool installed [globally](../getting-started/cli/). To start the runtime development, first initialise a new **`Subsembly`** project:

```text
subsembly init --to={projectPath} 
```

### `Subsembly` File Structure 

Newly initialised **`Subsembly`** project has the following file structure: 

```text
subsembly-project
    assembly/
    │
    └───runtime    <--- Runtime API entries && defined types
    |
    └───frame      <--- Contains Executive and System modules used for orchestrating       
    runtime/
    │
    └───pallets    <--- Subsembly pallets include in Runtime
yarn.lock              
package.json       <--- Subsembly dependencies       
```

**Runtime configuration**

Top-level runtime folder consists of Runtime API entries that are exposed to the Host. Some functions of API are general to the block chain, such as block production, execution, extrinsic submission and some others are specific to the module, such as **`Aura`** authorities. There is also, `runtime.ts` file, where types and constants for the frame modules and pallets are defined. We define general types that are used across the runtime and also pallet specific constants and types.

Some requirements for Runtime types, such as:

* Type should implement `Codec` interface from `as-scale-codec`. It makes sure that every type in the Runtime can be SCALE encoded and decoded.
* Make sure to avoid possible `IntegerOverflow` exceptions. For example, it does not make sense to use 8-bit unsigned integer as `Timestamp` `Moment` type, since the value of timestamp is way out of range of what 8-bit unsigned integer can hold.



