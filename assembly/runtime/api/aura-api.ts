import { Serialiser } from "subsembly-core";
import { Aura } from "../../pallets";
import { UInt64, ByteArray } from 'as-scale-codec';

/**
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_slot_duration(data: i32, len: i32): u64 {
    return Serialiser.serialiseResult(Aura.getSlotDuration().toU8a());
}

/**
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function AuraApi_authorities(data: i32, len: i32): u64 {
    const authorities = Aura.getAuthorities();
    return authorities.isSome() ? Serialiser.serialiseResult((<ByteArray>authorities.unwrap()).values) : Serialiser.serialiseResult([]);
}
