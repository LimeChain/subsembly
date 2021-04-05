# System

### Overview

System module provides low-level types, storage, and functions for your blockchain. All other pallets depend on the **`System`** library as the basis of your **`Subsembly`** runtime.

System module defines critical storage items for your blockchain. Some of them are:

* **`Account`** - stores account balance and nonce
* **`ExtrinsicCount`** - total extrinsics count for current block
* **`ParentHash`** - hash of the previous block
* **`Events`** - vector of events during block execution

And finally, it contains some important functions that access the storage, compute the extrinsics root, verify the origin of extrinsic, etc.



