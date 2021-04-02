# PolkadotJs

### Query storage

Run the PolkadotJs in previous guides and open the **Chain State** section of the **Developer** tab. You should see something similar to this:

![Picture 1. Chain state](../../.gitbook/assets/screenshot-2021-04-01-at-16.47.08.png)

We can query the chain, but it will be empty.

### Extrinsics

In the same Developer tab switch to **Extrinsics** section. Pick **`Nicks`** module and select the **`setName`** extrinsic. Pick an **Account \(origin\)** to give the name. Submit the extrinsic and see if the extrinsic is approved.

![Picture 2. Setting new name](../../.gitbook/assets/screenshot-2021-04-02-at-18.01.17.png)

 You can also go back to the **Chain State** section and query the storage for the above account.

![Picture 3. Query name](../../.gitbook/assets/screenshot-2021-04-02-at-18.03.02.png)

