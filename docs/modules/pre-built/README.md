---
description: Modules ready for use
---

# Pre-built

### Overview

Modules are represented as an AS class and are used to compose runtimes. Each module has its own logic and can modify the functionality of the state transition function of the blockchain.

It is possible to write your own custom module, provided that you implement all the necessary API entries. 

One example is a Timestamp module. It is used to set and get on-chain time. More specifically, it sets the storage items for the module, such as **`Now, DidUpdate`** that help saving and retrieving on-chain time of the blockchain.

To ease and shorten the development time of the runtimes, **`Subsembly`** currently comes with already pre-built modules that could be easily integrated with the runtime. 

* **`Aura`**
* **`Balances`**
* **`Timestamp`**
* **`TransactionPayment`**

