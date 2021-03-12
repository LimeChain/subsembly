---
description: Install and run Subsembly
---

# Subsembly CLI

## Subsembly

One of the ways to run Subsembly runtime is to clone our git repository:

```
$ git clone https://github.com/LimeChain/subsembly.git
```

{% hint style="info" %}
 The master branch contains the latest running **`Subsembly`** starter project.
{% endhint %}

Once you cloned the repo, install dependencies:

```text
$ yarn install
```

Then compile the runtime:

```text
$ yarn run build
```

To run the Substrate node with **`Subsembly`** runtime, we need to generate **`chain-spec`** file which contains genesis configuration for the node. For that, we can use **`subsembly-cli`** 

