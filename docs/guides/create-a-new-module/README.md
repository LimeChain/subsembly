# Create a New Module

## Overview

One of the core features of Subsembly is the ability to add new modules to your runtime easily. In this tutorial we will demonstrate how new modules are added and implemented in a Subsembly runtime.

## Basics

Here are some of the concepts and constraints you need to know before starting with this guide:

* New module is added as a new folder inside the **`assembly/pallets/`** folder. 
  * Inside the folder, usually we place the file which defines the pallet: storage entries, extrinsic calls, etc.
  * It's important to place your modules in the above path, since metadata looks for modules specifically in this path
* Types specific to the module should be added and exported from the **`assembly/runtime/runtime.ts`** file 
* If you have any runtime API entries specific to your module, define a file with your functions exported and place them in **`assembly/runtime/api/`** folder

