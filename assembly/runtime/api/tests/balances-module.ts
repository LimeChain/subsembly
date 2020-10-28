
/**
 * Temporary test functions for the Balances Module
 */
import { Serialiser } from "@as-substrate/core-utils";
import { BalancesModule, AccountId } from "@as-substrate/balances-module";
import { UInt128 } from "as-scale-codec";

/**
 * Test get account data using the Balances Module
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_balances_get_account_data(data: i32, len: i32): u64 {
    const input = Serialiser.deserialiseInput(data, len);

    const decodedAccountId = AccountId.fromU8Array(input);
    const accountData = BalancesModule.getAccountData(decodedAccountId.getResult());

    return Serialiser.serialiseResult(accountData.toU8a());
}

/**
 * Test set account data using the Balances Module
 * @param data - i32 pointer to the start of the arguments passed
 * @param len - i32 length (in bytes) of the arguments passed
 */
export function test_balances_set_account_data(data: i32, len: i32): u64 {
    let input = Serialiser.deserialiseInput(data, len);
    const decodedAccountId = AccountId.fromU8Array(input);
    input = decodedAccountId.getInput();

    const freeBalance = UInt128.fromU8a(input);
    input = input.slice(freeBalance.encodedLength());
    
    const reservedBalance = UInt128.fromU8a(input);
    input = input.slice(reservedBalance.encodedLength());
    
    const accData = BalancesModule.setBalance(decodedAccountId.getResult(), freeBalance, reservedBalance);
    return Serialiser.serialiseResult(accData.toU8a());
}