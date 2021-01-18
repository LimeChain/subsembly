import { AccountData, Log, ResponseCodes } from 'subsembly-core';
import { StorageEntry } from "../../frame/models/storage-entry";
import { SystemStorageEntries } from '../../frame/system';
import { AccountIdType, Balance, BalancesConfig, NonceType } from "../../runtime/runtime";

export namespace BalancesStorageEntries{
    /**
     * @description Stores information about accountId
     * @storage_map AccountId
     */
    export function Account(): StorageEntry<AccountData<Balance>>{
        return new StorageEntry<AccountData<Balance>>("Balances", "Account");
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
    static setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): u8[] {
        const currentAccountData = BalancesStorageEntries.Account().get(accountId);

        // this is the minimum balance an account may have
        if(BalancesConfig.existentialDeposit().unwrap() > freeBalance.unwrap()) {
            return ResponseCodes.VALIDITY_ERROR;
        }
        currentAccountData.setFree(freeBalance);
        currentAccountData.setReserved(reservedBalance);
        BalancesStorageEntries.Account().set(currentAccountData, accountId);
        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Transfer the given value from source to destination
     * @param source source account
     * @param dest dest account
     * @param value value of the transfer
     */
    static transfer(source: AccountIdType, dest: AccountIdType, value: Balance): u8[] {
        Log.info("trying to transfer: " + value.toString());
        const senderAccData = BalancesStorageEntries.Account().get(source);
        const receiverAccData = BalancesStorageEntries.Account().get(dest);

        const info = SystemStorageEntries.Account().get(source);
        const nonce = info.nonce;

        if(senderAccData.getFree().unwrap() < value.unwrap()) {
            return ResponseCodes.INSUFFICIENT_BALANCE;
        }

        const senderNewBalance = senderAccData.getFree().unwrap() - value.unwrap();
        const receiverNewBalance = receiverAccData.getFree().unwrap() + value.unwrap();

        if(senderNewBalance < BalancesConfig.existentialDeposit().unwrap()) {
            return ResponseCodes.VALIDITY_ERROR;
        }
        
        this.setBalance(source, instantiate<Balance>(senderNewBalance), senderAccData.getReserved());
        this.setBalance(dest, instantiate<Balance>(receiverNewBalance), receiverAccData.getReserved());

        info.setNonce(instantiate<NonceType>(nonce.unwrap() + 1));
        SystemStorageEntries.Account().set(info);
        Log.info("Done transfering: " + value.toString());
        return ResponseCodes.SUCCESS;
    }
}