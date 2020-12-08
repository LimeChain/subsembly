import { BytesReader } from "as-scale-codec";
import { Log, Serialiser } from "subsembly-core";
import { Executive, StorageEntries as SystemStorageEntries } from "../../frame";
import { AccountIdType, Runtime, SignedTransactionType } from "../runtime";
/**
 * @description The rest of runtime entries for the Polkadot Host
 * These methods are mocked for this iteration and they return an empty u8 array by default
 */


/**
 * @description Babe configuration
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function BabeApi_configuration(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * @description Generate session keys
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function SessionKeys_generate_session_keys(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * @description Receives encoded byte array of Extrinsic appended to the source of transaction
 * Returns ValidTransaction or TransactionError code
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function TaggedTransactionQueue_validate_transaction(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const uxt = BytesReader.decodeInto<SignedTransactionType>(input);
    const result = Executive.validateTransaction(uxt);
    return Serialiser.serialiseResult(result);
}

/**
 * @description Retrieves offchain worker
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function OffchainWorkerApi_offchain_worker(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * @description Get metadata of the runtime
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function Metadata_metadata(data: i32, len: i32): u64 {
    Log.info("metadata is called: " + Runtime.metadata().toString());
    return Serialiser.serialiseResult(Runtime.metadata());
}

/**
 * @description Get the latest nonce for the account
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function System_account_nonce(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const who = BytesReader.decodeInto<AccountIdType>(input);
    const nonce = SystemStorageEntries.AccountNonce().get(who);
    return Serialiser.serialiseResult(nonce.toU8a());
}