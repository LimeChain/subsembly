const {ApiPromise, WsProvider} = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { u8aToHex } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

const run = async () => {
    await cryptoWaitReady();

    const alice = keyring.addFromUri('//Alice');
    const wsProvider = new WsProvider('ws://0.0.0.0:9944');
    const api = await ApiPromise.create({ provider: wsProvider});

    const ext = api.createType('Extrinsic', "0x65028400d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01e87e7157ca45f1b7debdefa56c540e2aa781bc4976b5e28b390593647469ae515238993329151615190c9d8bc70667e36bb667453df4f940eb9dca575f6f858b0500000002008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801000000000000000000000000000000");
    const number = await api.query.system.number();
    console.log(number.toString());
    const blockHash = await api.query.system.blockHash(number);
    const test = {
        address: ext.signer.toHex(),
        blockHash: api.genesisHash.toHex(),
        era: ext.era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: ext.method.toHex(),
        nonce: ext.nonce.toHex(),
        specVersion: api.runtimeVersion.specVersion,
        transactionVersion: api.runtimeVersion.transactionVersion,
        tip: ext.tip.toHex()
    }
    
    const payload = api.registry.createType('ExtrinsicPayload', test);
    console.log("data: " + u8aToHex(payload.toU8a(true)));
    const signature = payload.sign(alice);
    console.log(signature)
    return;
}

const send = async () => {
    await cryptoWaitReady();

    const alice = keyring.addFromUri('//Alice');
    const wsProvider = new WsProvider('ws://0.0.0.0:9944');
    const api = await ApiPromise.create({ provider: wsProvider});

    const tx = await api.tx.balances.transfer('0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48', '01000000000000000000000000000000');
    // const signature = await tx.signAsync(alice);
    console.log(signature.toHex())
}

send()