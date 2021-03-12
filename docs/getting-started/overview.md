---
description: Substrate + AssemblyScript = Subsembly
---

# Overview

**`Subsembly`** framework used for developing [**`Substrate`**](substrate-essentials.md) runtimes in **`AssemblyScript`**. The project is work in progress.

This is the high-level overview of **`Subsembly`**.

![High-level overview](../.gitbook/assets/components_diagram.png)

* **Runtime API** - Implementation of Node &lt;&gt; Runtime Entries
* **Runtime Configuration** - Configurable runtime similar to **`Substrate`** Runtimes
* **FRAME** - Runtime components that handle the administrative functionalities
* **Pallets** - Packages that deliver common functionality, reused in different chains
* **Core** - Runtime components that provide low-level functionality

