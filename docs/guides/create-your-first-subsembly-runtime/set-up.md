---
description: Instructions to set up your computer
---

# Set Up

### Prerequisites

You set up needs to meet following requirements to get you started:

* **`Node >= 14.0.0`**
* **`make`** and **`curl`** packages

### Getting Started

To initialise and compile the runtime, follow the steps in the [**Runtime Development**](../../development/development.md) section. Briefly, the following steps should be completed before the next step of the guide:

Initialise a new **Subsembly** project:

```text
subsembly init --to=./subsembly-starter
```

Compile your runtime:

```text
cd subsembly-starter
subsembly compile
```

Generate new chain specification file:

```text
subsembly spec --to=./chain-spec.json
```

Here, you will need to replace or add a new Aura authority in the chain spec file. For generating your own keys, refer to **Substrate** [tutorial](https://substrate.dev/docs/en/tutorials/start-a-private-network/keygen). By default chain spec comes with generic Alice address. If you want a different authority, just add the public address of authority inside the array of authorities:

```text
"aura": {
  "authorities": [
    "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs"
  ]
}
```

{% hint style="info" %}
The last step is very important, since you will have to insert your Aura keys in the next chapter.
{% endhint %}

Convert it to raw:

```text
subsembly spec --src=./chain-spec.json --raw=./raw-chain-spec.json --wasm=./build/subsembly-wasm
```

To learn more about the above commands, please refer to [**Development**](../../development/development.md) section. After you have successfully completed above steps, go to the next step to see how you can interact with your runtime.

