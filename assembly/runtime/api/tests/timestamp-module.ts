import { Timestamp } from '@as-substrate/timestamp-module';
import { Serialiser } from '@as-substrate/core-utils';
import { UInt64 } from 'as-scale-codec';

/**
 * Test get method of Timestamp, returns the current value of now
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_timestamp_get(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const now = Timestamp.get();
    return Serialiser.serialiseResult(now.toU8a());
}

/**
 * Test set method of Timestamp, returns empty array (void)
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_timestamp_set(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);
    const now = UInt64.fromU8a(input);
    const res = Timestamp.set(now.value);
    return Serialiser.serialiseResult(res);
}
