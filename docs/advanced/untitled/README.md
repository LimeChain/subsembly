---
description: Metadata of the project
---

# Metadata

### Overview

**`Subsembly`** runtimes expose metadata to make the interaction easier. Each module's own metadata together form one general metadata of a blockchain. Metadata of the module provides all the necessary information about the module.

### Module Metadata

Module metadata has five properties, each holding a list of module specific items:

* **`calls`** -  **`dispatchable`** extrinsic calls
* **`storage items`** - list of module specific storage entries
* **`events`** - list of module specific events
* **`constants`** - list of module specific constants
* **`errors`** - list of module specific well-known errors

### Metadata Encoding

**`Subsembly`** metadata encoding follows the same rules as [Substrate Metadata](https://substrate.dev/docs/en/knowledgebase/runtime/metadata).

### Metadata Generation

One of the preliminary steps of runtime compilation is to generate metadata and dispatcher files. This is achieved by parsing module files and **`runtime.ts`** file to populate metadata of the module. 

For example, storage items of each module are located in the beginning of the module file:

```text
// balances.ts

export namespace BalancesStorageEntries{
    /**
     * @description Stores information about accountId
     * @storage_map AccountId
     */
    export function Account(): StorageEntry<Balance>{
        return new StorageEntry<Balance>("Balances", "Account");
    }
}
```

Extrinsic calls are parsed from the static functions of the declared modules. The following static function is parsed as an extrinsic call for Balances module.

```text
    /**
     * @description Transfer the given value from source to destination
     */
    static transfer(source: AccountIdType, dest: AccountIdType, value: Balance): u8[] {
     // Logic of the function //
    }
```

Static function with a name starting with underscore \(`_`\) is ignored while parsing and considered as internal function.

And constants for each module are declared inside the **`runtime.ts:`**

For instance, constants for Timestamp are declared like this:

```text
/**
 * @description Types and constants used in Timestamp pallet
 */
export class TimestampConfig {
    /**
     * @description Minimum period between timestamps
     */
    static minimumPeriod(): Moment {
        return instantiate<Moment>(5000);
    }
}
```

