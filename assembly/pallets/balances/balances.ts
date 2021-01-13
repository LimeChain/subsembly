import { BytesReader } from "as-scale-codec";
import { AccountData, Log, ResponseCodes, TransactionValidity, Transfer } from 'subsembly-core';
import { StorageEntry } from "../../frame/models/storage-entry";
import { StorageEntries as SystemStorageEntries } from '../../frame/system';
import { AccountIdType, Balance, NonceType } from "../../runtime/runtime";

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
    static setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): void {
        const currentAccountData = BalancesStorageEntries.Account().get(accountId);

        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        BalancesStorageEntries.Account().set(currentAccountData, accountId);
    }

    /**
     * @description Transfer the given value from source to destination
     * @param source source account
     * @param dest dest account
     * @param value value of the transfer
     */
    static transfer(source: AccountIdType, dest: AccountIdType, value: Balance): void {
        const senderAccData = BalancesStorageEntries.Account().get(source);
        const receiverAccData = BalancesStorageEntries.Account().get(dest);
        const senderNewBalance = senderAccData.getFree().unwrap() - value.unwrap();
        const receiverNewBalance = receiverAccData.getFree().unwrap() + value.unwrap();

        this.setBalance(source, instantiate<Balance>(senderNewBalance), senderAccData.getReserved());
        this.setBalance(dest, instantiate<Balance>(receiverNewBalance), receiverAccData.getReserved());

        const nonce = SystemStorageEntries.AccountNonce().get(source);
        SystemStorageEntries.AccountNonce().set(instantiate<NonceType>(nonce.unwrap() + 1));
        Log.info("Done transfering: " + value.toString());
    }

    /**
     * @description Validate transaction before applying it 
     * @param transfer SignedTransaction instance
     */
    static _validateTransaction(transfer: Transfer<AccountIdType, Balance, NonceType>): TransactionValidity {
        const fromBalance = BalancesStorageEntries.Account().get(transfer.from);
        const balance: Balance = fromBalance.getFree();
        if (balance.unwrap() < BytesReader.decodeInto<Balance>(transfer.amount.toU8a()).unwrap()) {
            return new TransactionValidity(
                false,
                ResponseCodes.INSUFFICIENT_BALANCE,
                "Validation error: source does not have enough balance"
            );
        }
        return new TransactionValidity(
            true,
            [],
            "Valid transaction"
        );
    }
}