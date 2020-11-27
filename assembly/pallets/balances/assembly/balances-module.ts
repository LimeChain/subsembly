import { ByteArray, BytesReader } from "as-scale-codec";
import { AccountData, Log, ResponseCodes, Storage, TransactionValidity } from 'subsembly-core';
import { System } from '../../../frame/system';
import { AccountIdType, Balance, SignedTransactionType } from "../../../runtime/runtime";

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
    static getAccountData(accountId: AccountIdType): AccountData<Balance> {
        const accDataBytes = Storage.get(accountId.getAddress());
        if (accDataBytes.isSome()) {
            return BytesReader.decodeInto<AccountData<Balance>>((<ByteArray>accDataBytes.unwrap()).unwrap());
        } else {
            return new AccountData();
        }
    }

    /**
     * @description Sets the balances of a given AccountId
     * Alters the Free balance and Reserved balances in Storage.
     */
    static setBalance(accountId: AccountIdType, freeBalance: Balance, reservedBalance: Balance): AccountData<Balance> {
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
        const senderNewBalance = senderAccData.getFree().unwrap() - amount.unwrap();
        const receiverNewBalance = receiverAccData.getFree().unwrap() + amount.unwrap();

        this.setBalance(sender, instantiate<Balance>(senderNewBalance), senderAccData.getReserved());
        this.setBalance(receiver, instantiate<Balance>(receiverNewBalance), receiverAccData.getReserved());

        System.incAccountNonce(sender);
        Log.info("Done transfering: " + amount.toString());
    }

    /**
     * @description Apply extrinsic for the module
     * @param extrinsic SignedTransaction instance
     */
    static applyExtrinsic(extrinsic: SignedTransactionType): u8[] {
        const sender: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const receiver: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getTo().toU8a());
        const validated = this.validateTransaction(extrinsic);
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
    static validateTransaction(extrinsic: SignedTransactionType): TransactionValidity {
        const from: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const fromBalance = Balances.getAccountData(from);
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