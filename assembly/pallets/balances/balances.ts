import { ByteArray, BytesReader, CompactInt } from 'as-scale-codec';
import {
    AccountData,
    ExistenceRequirement,
    ResponseCodes,
    Storage, Utils, WithdrawReasons
} from 'subsembly-core';
import { StorageEntry, SystemStorageEntries } from '../../frame';
import { AccountIdType, Balance, BalancesConfig, NonceType } from '../../runtime';

enum EventTypes {
    Transfer = 0,
    BalanceSet = 1
}

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
    static readonly BALANCESET: u8[] = [2, 0];
    static readonly TRANSFER: u8[] = [2, 1];
    /**
     * @description Sets the balances of a given AccountId
     * Alters the Free balance and Reserved balances in Storage.
     */
    static _setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): u8[] {
        // this is the minimum balance an account may have
        if(BalancesConfig.existentialDeposit().unwrap() > freeBalance.unwrap()) {
            return ResponseCodes.VALIDITY_ERROR;
        }
        const accData = BalancesStorageEntries.Account().get(accountId);
        accData.setFree(freeBalance);
        accData.setReserved(reservedBalance);
        BalancesStorageEntries.Account().set(accData, accountId);
        Balances._depositEvent(EventTypes.BalanceSet, accountId.toU8a().concat(freeBalance.toU8a()));
        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Transfer the given value from source to destination
     * @param source source account
     * @param dest dest account
     * @param value value of the transfer
     */
    static transfer(source: AccountIdType, dest: AccountIdType, value: Balance): u8[] {
        const senderBalance = BalancesStorageEntries.Account().get(source);
        const receiverBalance = BalancesStorageEntries.Account().get(dest);

        if(senderBalance.getFree().unwrap() < value.unwrap()) {
            return ResponseCodes.INSUFFICIENT_BALANCE;
        }

        // Make sure new balances is higher than ExistentialDeposit
        //@ts-ignore
        if(senderBalance.getFree().unwrap() - value.unwrap() < BalancesConfig.existentialDeposit().unwrap()) {
            return ResponseCodes.VALIDITY_ERROR;
        }

        //@ts-ignore
        senderBalance.setFree(instantiate<Balance>(senderBalance.getFree().unwrap() - value.unwrap()));
        //@ts-ignore
        receiverBalance.setFree(instantiate<Balance>(receiverBalance.getFree().unwrap() + value.unwrap()));
        
        BalancesStorageEntries.Account().set(senderBalance, source);
        BalancesStorageEntries.Account().set(receiverBalance, dest);

        // Increment nonce
        const info = SystemStorageEntries.Account().get(source);
        info.setNonce(instantiate<NonceType>(info.nonce.unwrap() + 1));
        SystemStorageEntries.Account().set(info, source);
        Balances._depositEvent(EventTypes.Transfer, source.toU8a().concat(dest.toU8a()).concat(value.toU8a()));
        
        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Append event to the vector of events in the storage
     * @param name Type of the event
     * @param args Argumenst for the event
     */
    static _depositEvent(type: i32, args: u8[]): void {
        switch(type) {
            case EventTypes.Transfer: {
                Balances._addEventInStorage(this.TRANSFER, args);
            }
            case EventTypes.BalanceSet: {
                Balances._addEventInStorage(this.BALANCESET, args);
            }
            default:
                return ;
        }
    }

    /**
     * @description Validate transfer before executing the extrinsic
     * @param who 
     * @param amount 
     */
    static _validateTransaction(who: AccountIdType, amount: Balance): u8[] {
        const currentBalance = BalancesStorageEntries.Account().get(who);
        if(BalancesConfig.existentialDeposit().unwrap() > currentBalance.getFree().unwrap()) {
            return ResponseCodes.VALIDITY_ERROR;
        }
        //@ts-ignore
        const newBalance = currentBalance.getFree().unwrap() - amount.unwrap();
        if(newBalance < amount.unwrap()) {
            return ResponseCodes.INSUFFICIENT_BALANCE;
        }

        return ResponseCodes.SUCCESS;
    }
    
    /**
     * @description Withdraw fee for transaction inclusion, or for some other reason
     * @param who 
     * @param fee 
     * @param reason 
     * @param existenceRequirement 
     */
    static _withdraw(who: AccountIdType, fee: Balance, reason: WithdrawReasons, existenceRequirement: ExistenceRequirement): void {
        if(reason == WithdrawReasons.TRANSACTION_PAYMENT) {
            const balance = BalancesStorageEntries.Account().get(who).getFree();
            if(Utils.areArraysEqual(ResponseCodes.SUCCESS, this._validateTransaction(who, fee))) {
                BalancesStorageEntries.Account().set(instantiate<Balance>(balance.unwrap() - fee.unwrap()), who);
                return ;
            }
        }
    }

        /**
     * @description Adds RawEvent to vector of events in the storage
     * @param event Raw event to append in the storage
     */
    static _addEventInStorage(event: u8[], args: u8[]): void {
        /**
         * TO-DO: Make event deposit dynamic
         * Currently it's hard-coded for two types of events:
         * ExtrinsicSuccess and ExtrinsicFailed 
         */

        const events = Storage.get(Utils.getHashedKey("Balances", "Events", null));
        const eventsRaw: u8[] = events.isSome() ? (<ByteArray>events.unwrap()).unwrap() : [0];
        const bytesReader = new BytesReader(eventsRaw);
        const len = <i32>bytesReader.readInto<CompactInt>().unwrap();

        const newEvents = new CompactInt(len + 1).toU8a()
            .concat(bytesReader.getLeftoverBytes())
            .concat(event)
            .concat(args);
        
        Storage.set(Utils.getHashedKey("Balances", "Events", null), newEvents);
    }
}