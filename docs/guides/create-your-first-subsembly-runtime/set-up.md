---
description: Instructions to set up your computer
---

# Set Up

## Prerequisites

Your set up needs to meet the following requirements :

* **`Node >= 14.0.0`**
* **`make`** and **`curl`** packages

## Getting Started

To initialise and compile the runtime, follow the steps in the [**Runtime Development**](../../development/development.md) section. The following steps should be completed before the next step of the guide:

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

Here, you will need to replace or add a new Aura or GRANDPA authority in the chain spec file. For generating your own keys, refer to **Substrate** [tutorial](https://substrate.dev/docs/en/tutorials/start-a-private-network/keygen). By default chain spec comes with generic address. If you want a different authority, just add the public address of authority inside the array of authorities:

```text
"aura": {
  "authorities": [
    "5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4"
  ]
}
....
....
"grandpa": {
  "authorities": [
    [
      "5G9NWJ5P9uk7am24yCKeLZJqXWW6hjuMyRJDmw4ofqxG8Js2",
      1
    ]
  ]
}
```

{% hint style="info" %}
The last step is very important, since you will have to insert your Aura and GRANDPA keys in the next chapter.
{% endhint %}

Convert it to raw:

```text
subsembly spec --src=./chain-spec.json --raw=./raw-chain-spec.json --wasm=./build/subsembly-wasm
```

To learn more about the above commands, please refer to [**Development**](../../development/development.md) section. After you have successfully completed above steps, go to the next step to see how you can interact with your runtime.

