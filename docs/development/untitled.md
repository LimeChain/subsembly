---
description: Developing runtime
---

# Runtime Development

### Getting Started

First, make sure you have the CLI tool installed [globally](cli/). To start the runtime development, first initialise a new **`Subsembly`** project:

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

Main types and API entries are defined in runtime folder. **`runtime.ts`** file in runtime folder defines types and constants for the frame modules and pallets. 

### Runtime API 

Our runtime exposes several functions that define the business logic of the runtime. Some functions are general to the block chain, such as block production, execution, extrinsic submission and some others are specific to the module, such as **`Aura`** authorities. 

For example:

```text
# Block initialization
export function Core_initialize_block
# Block execution
export funtion BlockBuilder_execute_block
```

