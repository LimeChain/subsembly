# Nicks Module

### Overview

Nicks is an example module for keeping track of account names on-chain. It makes no effort to create a name hierarchy, be a DNS replacement or provide reverse lookups. This module is only for demonstration purposes, so do not use this pallet as-is in production.

### Module

First, we define the module inside the **`pallets/`** folder as a **`ts`** file. The path to the module should look similar to this:

```text
assembly/
    ...
    pallets/
        ...
        nicks/
            nicks.ts
        ...
```

#### Storage entries

Now we define storage entries inside **`nicks.ts`** for our module like this:

```text
/**
 * @description Nicks Pallet storage entries
 */
export namespace NicksStorageEntries {
    /**
     * @description Name of AccountId
     * @storage_map AccountId
     */
    export function NameOf(): StorageEntry<ScaleString>{
        return new StorageEntry<ScaleString>("Nicks", "NameOf");
    };
}
```

Some interesting details:

* NicksStorageEntries - a namespace where we define storage entries as functions. It's required to be a namespace and named accordingly: **`moduleName + 'StorageEntries'`**
* **`storage_map AccountId -`** specifies the type of storage entry \(Map\) and type of argument it receives \(AccountId\)
* **`StorageEntry<T>`** - An object that takes the type of value to be stored. And also module name and the entry name.

#### Constants

Sometimes your modules may require you to set constants that will be used inside the module. In **Subsembly**, constants are defined as a static function of a class, inside the  **`assembly/runtime/runtime.ts`** file like this:

```text
/--snip--/

export class NicksConfig {
    /**
     * @description Minimum length of the name
     * @returns min value
     */
    static minLength(): UInt32 {
        return new UInt32(3);
    }

    /**
     * @description Maximum length of the name
     * @returns max value
     */
    static maxLength(): UInt32 {
        return new UInt32(16);
    }
}
/--snip--/
```

### Module Calls

And now we will define the core business logic of the module. It may include extrinsic calls that are exposed outside of the runtime and other internal function and constants. We define our Nicks module like this:

```text
/--snip--/
/**
 * @description Nicks modules declaration
 */
export class Nicks {
     /**
     * @description Error code for too short name
     */
    static TOO_SHORT_ERROR: u8 = 0;
    /**
     * @description Error code for too long name
     */
    static TOO_LONG_ERROR: u8 = 1;
    
    /**
     * @description Sets name of the origin
     * @param origin AccountId
     * @param name Name of the account
     * @returns 
     */
    static set_name(origin: AccountIdType, name: ScaleString): u8[] {
        if (name.unwrap().length <= NicksConfig.minLength().unwrap()) {
            Log.error("Nicks: Name too short!");
            return;
        }
        else if(name.unwrap().length >= NicksConfig.maxLength().unwrap()) {
            Log.error("Nicks: Name too long!");
            return;
        }
        NicksStorageEntries.NameOf().set(name, origin);
    }
}
/--snip--/
```

Here we have defined only one dispatchable call of our module. Note that, extrinsic call is a static function and returns array of bytes: code for the result of the extrinsic.

* We define local error codes for the module as a static property
* **`set_name`** - Sets the provided name for the given origin **`AccountId`**

{% hint style="info" %}
Don't forget to include your new module for exports inside **`assembly/pallets/index.ts !`**
{% endhint %}

```text
/--snip--/
export * from "./nicks/nicks";
/--snip--/
```

