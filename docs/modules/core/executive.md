# Executive

### Overview

Acts as the orchestration layer for the runtime. Receives incoming extrinsic calls, decodes them and dispatches the calls to the respective modules of the runtime. It uses **`System`** library for accessing the low-level storage and performing some important actions during the block production phase.

### Example

Runtime API entry **`Core_initialize_block`**calls **`initializeBlock`** function of the **`Executive`** module.

```typescript
export function Core_initialize_block(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const header = BytesReader.decodeInto<HeaderType>(input);
    Executive.initializeBlock(header);
    return Serialiser.serialiseResult([]);
}
```



