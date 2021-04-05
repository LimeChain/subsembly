---
description: AS implementation of SCALE Codec
---

# as-scale-codec

### Overview

**`as-scale-codec`** is an AssemblyScript implementation of Polkadot SCALE Codec. The codec is used as a communication mechanism between Substrate Hosts and Substrate Runtimes. 

This is an integral part of the **`Subsembly`**, since it provides SCALE encoding and decoding functionality for the types. 

The library is maintained by LimeChain and has improved significantly over the course of **`Subsembly`** development. 

### Codec 

Every **`Subsembly`** type needs to have encoding and decoding features, which is provided from the **`Codec`** interface of **`as-scale-codec`**. If you were to create your custom type to use in your **`Subsembly`** runtime, type has to implement **`Codec`** interface.

### Examples

#### Encoding

Every type has а **toU8a** function. It encodes type value into an array of bytes

```text
import { Bool, String } from "as-scale-codec"

// Bool
const scaleBool = new Bool(true);
scaleBool.toU8a() // => [0x01]

// String
const scaleString = new ScaleString("a");
scaleString.toU8a() // => [0x04, 0x61] 

// UInt64
const uInt64 = new UInt64(10);
uInt64.toU8a(); // => [0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
```

#### Decoding

We can decode arbitrary bytes into as-scale-codec using BytesReader:

```text
import { BytesReader } from 'as-scale-codec';

// Arbitrary SCALE encoded bytes
const bytes: u8[] = [
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    69, 0, 0, 0
];

// Instantiate BytesReader instance with SCALE encoded bytes
const bytesReader = new BytesReader(bytes);

// Read Int64
bytesReader.readInto<Int64>();
// => new Int(-1)

// Read UInt32
bytesReader.readInto<UInt32>();
// => new UInt32(69)
```

For more information, please visit [as-scale-codec](https://github.com/LimeChain/as-scale-codec) and SCALE [docs](https://substrate.dev/docs/en/knowledgebase/advanced/codec).

