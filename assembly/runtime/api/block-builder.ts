import { Serialiser } from 'subsembly-core';
import { InherentData } from 'subsembly-core';
import { Executive } from '../../frame/executive';
import { Bool } from 'as-scale-codec';

/**
 * On success returns array of zero length, on failure returns Dispatch error or Apply error (tbd)
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_apply_extrinsic(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const applyExtResult = Executive.applyExtrinsic(input);
    return Serialiser.serialiseResult(applyExtResult);
}

/**
 * On success, returns an array of inherents
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_inherent_extrinsics(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const inherent = InherentData.fromU8Array(input);
    const inherents = Executive.createExtrinsics(inherent.getResult());
    return Serialiser.serialiseResult(inherents);
}

/**
 * Upon succesfull validation of Block's fields, appends the block to the chain
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_finalize_block(data: i32, len: i32): u64 {
    const header = Executive.finalizeBlock();
    return Serialiser.serialiseResult(header.toU8a());
}

/**
 * Validates fields of the InherentData and sends back okay or error message with failed InherentDatas
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function BlockBuilder_check_inherents(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult((new Bool(true)).toU8a());
}

/**
 * Generates random seed, returns Block object
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */

export function BlockBuilder_random_seed(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}



