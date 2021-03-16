---
description: Dispatcher for incoming extrinsic calls
---

# Dispatcher

### Overview

Dispatcher is a module with a single function that dispatches incoming calls to the respective modules. It is a derivative of metadata, so it's required to generate metadata first in order to have a dispatcher module.

In essence, the workflow of the dispatcher is the following:

1. Receive extrinsic bytes from outside
2. Decode it as a local **`Extrinsic`** type
3. Decode **`DispatchInfo`** bytes of the extrinsic
4. From the resulting **`Call`** type, execute the extrinsic call

The dispatcher returns an array of bytes that define the result of the extrinsic execution.



