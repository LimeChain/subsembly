import { BytesReader } from "as-scale-codec";
import { AccountData, ExistenceRequirement, Log, ResponseCodes, TransactionValidity, WithdrawReasons } from 'subsembly-core';
import { StorageEntry } from "../../frame/models/storage-entry";
import { StorageEntries as SystemStorageEntries } from '../../frame/system';
import { AccountIdType, Balance, BalancesConfig, NonceType, SignedTransactionType } from "../../runtime/runtime";

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
     * @description Apply extrinsic for the module
     * @param extrinsic SignedTransaction instance
     */
    static _applyExtrinsic(extrinsic: SignedTransactionType): u8[] {
        const source: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getFrom().toU8a());
        const dest: AccountIdType = BytesReader.decodeInto<AccountIdType>(extrinsic.getTo().toU8a());
        const validated = this._validateTransaction(extrinsic);
        if (!validated.valid) {
            Log.error(validated.message);
            return validated.error;
        }
        this.transfer(source, dest, BytesReader.decodeInto<Balance>(extrinsic.getAmount().toU8a()));
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
                "Validation error: source does not have enough balance"
            );
        }
        return new TransactionValidity(
            true,
            [],
            "Valid transaction"
        );
    }

    /**
     * @description Removes some free balance from `who` account for `reason` if possible. If `liveness` is
	 * `KeepAlive`, then no less than `ExistentialDeposit` must be left remaining.
	 * This checks any locks, vesting, and liquidity requirements. If the removal is not possible,
	 * then it returns `Err`.
	 * If the operation is successful, this will return `Ok` with a `NegativeImbalance` whose value
	 * is `value`.
     * @param who 
     * @param value 
     * 
     * @param reasons 
     * @param liveliness 
     */
    static withdraw(who: AccountIdType, value: Balance, reasons: WithdrawReasons, liveness: ExistenceRequirement): void {
        if (value.eq(instantiate<Balance>(0))) {
            return ;
        }
        const account = BalancesStorageEntries.Account().get(who);
        let newFreeAccount = new AccountData(account.getFree().unwrap() - value.unwrap());
        const ed = BalancesConfig.existentialDeposit();
        const wouldBeDead = newFreeAccount.getFree().unwrap() + account.getReserved().unwrap() < ed.unwrap();
        const wouldKill = wouldBeDead && account.getFree().unwrap() + account.getReserved().unwrap() >= ed.unwrap();

        assert(liveness != ExistenceRequirement.AllowDeath || !wouldKill, "Error: Error withdrawing: balance less than existential deposit after withdrawal");

        account.setFree(<Balance>newFreeAccount.getFree());
        BalancesStorageEntries.Account().set(account, who);
    }
}