import { Serialiser } from 'subsembly-core';
import { Grandpa } from '../../pallets/';

/**
 * @description Attempt to extract a pending set-change signal from a digest.
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function GrandpaApi_grandpa_pending_change(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * @description Attempt to extract a forced set-change signal from a digest.
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function GrandpaApi_grandpa_forced_change(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * @description Get the current set of authorities, along with their respective weights.
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function GrandpaApi_grandpa_authorities(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult(Grandpa._authorities());
}
