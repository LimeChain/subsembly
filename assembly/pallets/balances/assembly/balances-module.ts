import { u128 } from "as-bignum";
import { ByteArray, BytesReader, UInt64 } from "as-scale-codec";
import { ISignedTransaction, Log, ResponseCodes, Storage, TransactionValidity } from 'subsembly-core';
import { AccountData } from '.';
import { System } from '../../../frame/system';
import { AccountIdType, Balance } from "../../../runtime/runtime";
/**
 * @description The Balances Module.
 * Used for account balance manipulation such as:
 *  - Getting and setting free/reserved balances
 */
export class Balances {

    /**
     * @description Returns AccountData for a given AccountId
     * If the account does not exist, Default AccountData is returned.
     */
    static getAccountData(accountId: AccountIdType): AccountData {
        const accDataBytes = Storage.get(accountId.getAddress());
        if (accDataBytes.isSome()) {
            return BytesReader.decodeInto<AccountData>((<ByteArray>accDataBytes.unwrap()).values);
        } else {
            return new AccountData();
        }
    }

    /**
     * @description Sets the balances of a given AccountId
     * Alters the Free balance and Reserved balances in Storage.
     */
    static setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): AccountData {
        const currentAccountData = this.getAccountData(accountId);

        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        Storage.set(accountId.getAddress(), currentAccountData.toU8a());

        return currentAccountData;
    }

    /**
     * @description Transfer the given amount from sender to receiver
     * Note: this is just draft implementation, without necessary checks
     * @param sender sender account
     * @param receiver receiver account
     * @param amount amount of the transfer
     */
    static transfer(sender: AccountIdType, receiver: AccountIdType, amount: Balance): void {
        const senderAccData = this.getAccountData(sender);
        const receiverAccData = this.getAccountData(receiver);
        const senderNewBalance = senderAccData.getFree().value - amount.value;
        const receiverNewBalance = receiverAccData.getFree().value + amount.value;

        this.setBalance(sender, instantiate<Balance>(senderNewBalance), senderAccData.getReserved());
        this.setBalance(receiver, instantiate<Balance>(receiverNewBalance), receiverAccData.getReserved());

        System.incAccountNonce(sender);
        Log.info("Done transfering: " + amount.toString());
    }

    /**
     * @description Apply extrinsic for the module
     * @param extrinsic SignedTransaction instance
     */
    static applyExtrinsic(extrinsic: ISignedTransaction): u8[]{
        const sender: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const receiver: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getTo().toU8a());
        const validated = this.validateTransaction(extrinsic);
        if(!validated.valid){
            Log.error(validated.message);
            return validated.error;
        }
        this.transfer(sender, receiver, BytesReader.decodeInto<Balance>(extrinsic.getAmount().toU8a()));
        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Validate transaction before applying it 
     * @param extrinsic SignedTransaction instance
     */
    static validateTransaction(extrinsic: ISignedTransaction): TransactionValidity{
        const from: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const fromBalance = Balances.getAccountData(from);
        const balance: Balance = fromBalance.getFree();
        if(balance.value < u128.fromU64((<UInt64>extrinsic.getAmount()).value)){
            return new TransactionValidity(
                false,
                ResponseCodes.INSUFFICIENT_BALANCE,
                "Validation error: Sender does not have enough balance"
            );
        }
        return new TransactionValidity(
            true,
            [],
            "Valid transaction"
        );
    }
}