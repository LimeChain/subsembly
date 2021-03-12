---
description: Project compilation
---

# subsembly compile

### Overview

Compiles current **`Subsembly`** project. More specifically it installs the dependencies and generates the required files for the Runtime to support the `metadata` interface used by PolkadotJS. Lastly, it compiles the **`Subsembly`** Runtime into the hex encoded `wasm` binary file \(WASM blob\).

### Syntax

```text
subsembly compile
```

### Examples

```text
# creates new compiled wasm of the runtime in /build directory
subsembly compile
```

