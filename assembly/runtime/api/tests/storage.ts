/**
 * Temporary test functions for the Storage module
 */
import { Storage } from '@as-substrate/core-modules';
import { Utils, Serialiser } from '@as-substrate/core-utils';
import { ByteArray, Int32 } from 'as-scale-codec';

/**
 * Test get method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_set(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const key = ByteArray.fromU8a(input);
    input = input.slice(key.encodedLength());
    const value = ByteArray.fromU8a(input);    
    input = input.slice(value.encodedLength());
    Storage.set(key.toU8a(), value.toU8a());
    return Serialiser.serialiseResult(input);
}

/**
 * Test get method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_get(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const value = Storage.get(input);
    return value.isSome() ? Serialiser.serialiseResult((<ByteArray>value.unwrap()).values) : Serialiser.serialiseResult([]);
}

/**
 * Test read method of storage
 * Returns the ArrayBuffer concatenated to the result from the Storage.read method
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_read(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const key = ByteArray.fromU8a(input);
    input = input.slice(key.encodedLength());
    const buffLen = Int32.fromU8a(input);
    input = input.slice(buffLen.encodedLength())
    const offset = Int32.fromU8a(input);
    input = input.slice(offset.encodedLength());

    const valueOut: ArrayBuffer = new ArrayBuffer(buffLen.value);

    const result = Storage.read(key.toU8a(), valueOut, offset.value);

    let buff = Uint8Array.wrap(valueOut);
    let buffU8 = Utils.toU8Array(buff);

    const res = (<Int32>result.unwrap()).toU8a().concat(buffU8);

    return Serialiser.serialiseResult(res);
}

/**
 * Test clear method of storage
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */

export function test_storage_clear(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    Storage.clear(input);
    return Serialiser.serialiseResult([]);
}

/**
 * Test exists method of storage
 * @param data i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_storage_exists(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const itExists = Storage.exists(input);
    return Serialiser.serialiseResult(itExists.toU8a());
}
