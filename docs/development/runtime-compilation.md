---
description: Compile your runtime
---

# Runtime Compilation

### Overview 

To compile the runtime: 

```text
subsembly compile
```

### Workflow 

The workflow of the compile command is following:

1. Make sure the dependencies are installed by checking **`node_modules`** folder.
2.  Generate metadata of the project 
   1. Parse system and other modules inside **`assembly/pallets`** directory to extract storage entries, calls and constants. 
   2. Generate files: 
      1. **`metadata.ts`** 

         Contains a function that returns SCALE encoded metadata of the project

      2. **`dispatcher.ts`**

         Contains a function that is used to dispatch extrinsic calls of corresponding modules 
   3. Build **`wasm`** file: 

      Compile AS project into **`.wasm`** file, hex encode the binary and save it in build directory.

