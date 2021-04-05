# Launch the Node

### Overview

In this section, we will launch the node with our newly modified runtime. 

### Compile

First, we compile our new runtime:

```text
subsembly compile
```

You can see that assembly/pallets/generated/dispatcher.ts file has changed. Namely, we now have a dispatch call for our new module:

```text
/--snip--/

// Extrinsic calls of Nicks module
export enum NicksCalls {
    set_name = 0
}

/--snip--/

export namespace Dispatcher {
    export function dispatch(ext: UncheckedExtrinsic): u8[] {
        /--snip--/
        case Pallets.Nicks: {
            switch(ext.method.callIndex[1]) {
                case NicksCalls.set_name: {
                    let bytesReader = new BytesReader(ext.method.args);
                    const origin = bytesReader.readInto<AccountId>();
                    const name = bytesReader.readInto<ScaleString>();
                    return Nicks.set_name(origin, name);
                }
                default: {
                    return ResponseCodes.CALL_ERROR
                }
            }
        }
    }
    /--snip--/
}
```

### Launch

Now that we have newly compiled runtime, it's time to launch the node. But first, make sure to generate new raw spec file, since we made changes in our runtime:

```text
subsembly spec --src=./chain-spec.json
```

And now, this will launch the node:

```text
make run-node-demo spec=./raw-chain-spec.json
```

Also, make sure to insert you Aura keys, so that the node starts the block production.

