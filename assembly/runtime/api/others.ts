import { BytesReader, CompactInt } from "as-scale-codec";
import { Log, Serialiser } from "subsembly-core";
import { Executive, SystemStorageEntries } from "../../frame";
import { Metadata } from "../../generated/metadata";
import { AccountIdType, UncheckedExtrinsic } from "../runtime";

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
    const uxt = BytesReader.decodeInto<UncheckedExtrinsic>(input);
    Log.info("Validate called: " + input.toString());
    Log.info("Decoding: " + uxt.toU8a().toString());
    const result = Executive.validateTransaction(uxt);
    Log.info("Validation result: " + result.toString());
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
    const encodedLen = new CompactInt(Metadata.metadata().length);
    return Serialiser.serialiseResult(encodedLen.toU8a().concat(Metadata.metadata()));
}

/**
 * @description Get the latest nonce for the account
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function AccountNonceApi_account_nonce(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const who = BytesReader.decodeInto<AccountIdType>(input);
    const nonce = SystemStorageEntries.Account().get(who).nonce;
    Log.info("Get nonce: " + nonce.unwrap().toString());
    return Serialiser.serialiseResult(nonce.toU8a());
}

// export function TransactionPaymentApi_query_info(data: i32, len: i32): u64 {
//     const input = Serialiser.deserialiseInput(data, len);
//     const bytesReader = new BytesReader(input);
//     const ext = bytesReader.readInto<UncheckedExtrinsic>();
//     const length = bytesReader.readInto<UInt32>();
//     return Serialiser.serialiseResult(TransactionPayment._queryInfo(ext, length).toU8a());
// }