---
description: Initialising new Subsembly project
---

# subsembly init

### Overview

In order for you to start working on a **`Subsembly`** based Runtime, you need to initialise new project that will provide all of the necessary boilerplate code with high-level abstractions so that you can focus on the business requirements of your Runtime.

This command initialises new **`Subsemly`** project to the specified path.

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
$ subsembly init --to=./new-sub

# Without specified path (initializes into the current directory)
$ subsembly init
```

The result of the above command:

```text
$ ls
LICENSE     assembly     package.json
Makefile    yarn.lock
```

