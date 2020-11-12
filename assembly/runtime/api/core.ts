import { Log, Serialiser } from "subsembly-core";
import { Block, Header } from "subsembly-core";
import { Executive } from '../../frame/executive';
import { Bool, BytesReader } from "as-scale-codec";
import { runtimeVersion } from '../runtime';

/**
 * Returns the version data encoded in ABI format as per the specification
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function Core_version(data: i32, len: i32): u64 {
    Log.info("Calling runtime version: " + runtimeVersion().toU8a().toString());
    const version = runtimeVersion();
    return Serialiser.serialiseResult(version.toU8a());
}

/**
 * Executes a full block by executing all exctrinsics included in it and update state accordingly.
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function Core_execute_block(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const block = BytesReader.decodeInto<Block>(input);
    Executive.executeBlock(block);
    return Serialiser.serialiseResult((new Bool(true)).toU8a()); // return true, if block execution succeds
}

/**
 * Initializes the Block instance from the passed argument
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length ( in bytes ) of the arguments passed
 */

export function Core_initialize_block(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const header = BytesReader.decodeInto<Header>(input);
    Executive.initializeBlock(header);
    return Serialiser.serialiseResult([]);
}
