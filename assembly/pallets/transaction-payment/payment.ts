import { DispatchInfo, ExistenceRequirement, WithdrawReasons } from "subsembly-core";
import { AccountIdType, Balance, Weight } from "../../runtime/runtime";
import { Balances } from "../balances";

/**
 * @description Handle withdrawing, refunding and depositing of transaction fees.
 */
export class Payment {
    /**
     * @description Withdraw transaction fees from the corresponding account
     * @param who 
     * @param dispatchInfo 
     * @param fee 
     * @param tip 
     */
    static withdrawFee(who: AccountIdType, _dispatchInfo: DispatchInfo<Weight>, fee: Balance, tip: Balance): void {
        if(fee.eq(instantiate<Balance>(0))) {
            return ;
        }
        const withdrawReason = tip.eq(instantiate<Balance>(0)) 
            ? WithdrawReasons.TRANSACTION_PAYMENT 
            : WithdrawReasons.TRANSACTION_PAYMENT | WithdrawReasons.TIP;
        Balances.withdraw(who, fee, withdrawReason, ExistenceRequirement.KeepAlive);
    }
}