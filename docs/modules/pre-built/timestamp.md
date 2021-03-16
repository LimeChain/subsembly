---
description: Get and set on-chain time
---

# Timestamp

### Overview

The Timestamp pallet allows the validators to set and validate a timestamp with each block.

It uses **`inherents`** for timestamp data, which is provided by the block author and validated/verified by other validators. The timestamp can be set only once per block and must be set each block. There could be a constraint on how much time must pass before setting the new timestamp.

### Dispatchable Calls

* **`set`** - sets the current time. When setting the new time, it must be greater than the last one \(set into storage\) with at least a MinimumPeriod

### Configuration

Timestamp requires to set following constants during the runtime initialisation:

* **`minimumPeriod`** - minimum period between timestamps. Also, minimal interval between two blocks.

