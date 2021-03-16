---
description: Handle transaction payments
---

# TransactionPayment

### Overview

The Transaction Payment pallet provides the basic logic to compute pre-dispatch transaction fees. It provides a functionality to compute the absolute minimum transaction fee to be charged for extrinsic to be included in the block.

### Configuration

This module requires following constants to be set during runtime initialisation:

* **`ExtrinsicBaseWeight`** - the base weight of an Extrinsic in the block, independent of the of extrinsic being executed.
* **`NextFeeMultiplier`** - multiplier value for the next fee
* **`TransactionByteFee` -** fee for each byte of a transaction

