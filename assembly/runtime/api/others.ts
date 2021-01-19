import { BytesReader, CompactInt, UInt32 } from "as-scale-codec";
import { Serialiser } from "subsembly-core";
import { Executive, SystemStorageEntries } from "../../frame";
import { Metadata } from "../../generated/metadata";
import { TransactionPayment } from "../../pallets";
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
    return Serialiser.serialiseResult(nonce.toU8a());
}

/**
 * @description Return dispatch info with partial transaction fees for the Extrinsic
 * @param data 
 * @param len 
 */
export function TransactionPaymentApi_query_info(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const bytesReader = new BytesReader(input);
    const ext = bytesReader.readInto<UncheckedExtrinsic>();
    const length = bytesReader.readInto<UInt32>();
    const queryInfo = TransactionPayment._queryInfo(ext, length);
    const ONE_U128: u8[] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0, 0, 0];
    const result = queryInfo.weight.toU8a().concat([<u8>queryInfo.klass]);
    return Serialiser.serialiseResult(result.concat(ONE_U128));
}