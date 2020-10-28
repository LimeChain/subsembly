import { Serialiser } from "subsembly-core";

/**
 * The API for querying the state of parachains on-chain.
 * Current state of the API is mocked and returns either empty array or True
 */

/**
 * Get the current validators
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
*/
export function ParachainHost_validators(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * Get the current duty roster
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function ParachainHost_duty_roster(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * Get the currently active parachains
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
*/

export function ParachainHost_active_parachains(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * Get the global validation schedule that all parachains should be validated under.
* @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
*/
export function ParachainHost_parachain_status(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult([]);
}

/**
 * Get the given parachain's head code blob.
 * Takes id of the parachain and returns ValidationCode instance
* @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
 */
export function ParachainHost_parachain_code(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    return Serialiser.serialiseResult([]);
}

/** 
 * 
 * @param data i32 pointer to the start of the argument passed
 * @param len i32 length (in bytes) of the arguments passed
*/
export function ParachainHost_ingress(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    return Serialiser.serialiseResult([]);
}