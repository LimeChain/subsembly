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

{% hint style="info" %}
Initialisation directory should be empty.
{% endhint %}

#### Parameters

* **`--to`** - optional parameter, determines initialisation directory for the new **`Subsembly`** project. Defaults to current directory.

### Examples

```text
# With specified path
subsembly init --to=./new-sub

# Without specified path (initializes into the current directory)
subsembly init
```

The result of the above command:

![Picture 1. Subsembly project files](../../.gitbook/assets/image%20%284%29.png)

