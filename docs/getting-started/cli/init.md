---
description: Initialising new Subsembly project
---

# subsembly init

### Overview

Initialises new **`Subsemly`** project to the specified path. Path to the new **`Subsembly`** project should be an empty or non-existing directory.

### Syntax

```text
subsembly init [to]
```

#### Parameters

* **`--to`** - \[optional\] initialisation directory for the new **`Subsembly`** project

### Examples

```text
# With specified path
subsembly init --to=./new-sub

# Without specified path (initializes into the current directory)
subsembly init
```

