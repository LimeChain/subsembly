import { BytesReader } from "as-scale-codec";
import { AccountData, Log, ResponseCodes, TransactionValidity } from 'subsembly-core';
import { StorageEntry } from "../../../frame/models/storageEntry";
import { SystemStorageEntries } from '../../../frame/system';
import { AccountIdType, Balance, NonceType, SignedTransactionType } from "../../../runtime/runtime";

export namespace BalancesStorageEntries{
    /**
     * @description Stores information about accountId
     */
    export function Account(): StorageEntry<AccountData<Balance>>{
        return new StorageEntry<AccountData<Balance>>("Balance", "Account");
    }
}

/**
 * @description The Balances Module.
 * Used for account balance manipulation such as:
 *  - Getting and setting free/reserved balances
 */
export class Balances {
    /**
     * @description Sets the balances of a given AccountId
     * Alters the Free balance and Reserved balances in Storage.
     */
    static setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): AccountData<Balance> {
        const currentAccountData = BalancesStorageEntries.Account().get(accountId);

        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        BalancesStorageEntries.Account().set(currentAccountData, accountId);
        return currentAccountData;
    }

    /**
     * @description Transfer the given amount from sender to receiver
     * @param sender sender account
     * @param receiver receiver account
     * @param amount amount of the transfer
     */
    static transfer(sender: AccountIdType, receiver: AccountIdType, amount: Balance): void {
        const senderAccData = BalancesStorageEntries.Account().get(sender);
        const receiverAccData = BalancesStorageEntries.Account().get(receiver);
        const senderNewBalance = senderAccData.getFree().unwrap() - amount.unwrap();
        const receiverNewBalance = receiverAccData.getFree().unwrap() + amount.unwrap();

        this.setBalance(sender, instantiate<Balance>(senderNewBalance), senderAccData.getReserved());
        this.setBalance(receiver, instantiate<Balance>(receiverNewBalance), receiverAccData.getReserved());

        const nonce = SystemStorageEntries.AccountNonce().get(sender);
        SystemStorageEntries.AccountNonce().set(instantiate<NonceType>(nonce.unwrap() + 1));
        Log.info("Done transfering: " + amount.toString());
    }

    /**
     * @description Apply extrinsic for the module
     * @param extrinsic SignedTransaction instance
     */
    static _applyExtrinsic(extrinsic: SignedTransactionType): u8[] {
        const sender: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const receiver: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getTo().toU8a());
        const validated = this._validateTransaction(extrinsic);
        if (!validated.valid) {
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
    static _validateTransaction(extrinsic: SignedTransactionType): TransactionValidity {
        const from: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const fromBalance = BalancesStorageEntries.Account().get(from);
        const balance: Balance = fromBalance.getFree();
        if (balance.unwrap() < BytesReader.decodeInto<Balance>(extrinsic.getAmount().toU8a()).unwrap()) {
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