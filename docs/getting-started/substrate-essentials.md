---
description: Substrate knowledge base
---

# Substrate Essentials

### Substrate

[**`Substrate`**](https://substrate.dev/docs/en/) takes a modular approach to blockchain development and defines a rich set of primitives that allows developers to make use of powerful, familiar programming idioms.

For more information about Substrate, please refer to their in-depth documentation.

### Runtime

> The runtime of a blockchain is the business logic that defines its behavior. In Substrate-based chains, the runtime is referred to as the "[state transition function](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#state-transition-function-stf)"; it is where Substrate developers define the storage items that are used to represent the blockchain's [state](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#state) as well as the [functions](https://substrate.dev/docs/en/knowledgebase/learn-substrate/extrinsics) that allow blockchain users to make changes to this state.

### How is it related?

Substrate can be used in three ways:

* **With the Substrate Node -** run node just by providing chain specification file to node
* **With Substrate FRAME -** run node with your custom runtime
* **With Substrate Core -** design and implement runtime from scratch and compile targeting **`WebAssembly`**. This is how **`Subsembly`** works.

By using **`AssemblyScript`** that targets **`WebAssembly`**, we can build our custom runtimes from scratch and run it on **`Substrate`** nodes.

