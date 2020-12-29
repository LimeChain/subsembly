import { DispatchInfo, Pays, PostDispatchInfo, WeightToFeeCoefficient, WeightToFeePolynomial } from 'subsembly-core';
import { StorageEntry } from '../../frame';
import { AccountIdType, Balance, Multiplier, SystemConfig, TransactionByteFee, Weight } from '../../runtime/runtime';
import { Payment } from './payment';

/**
 * Storage entries for TransactionPayment module
 */
export namespace TPaymentStorageEntries {
    /**
     * @description Multiplier value for the next fee
     */
    export function NextFeeMultiplier(): StorageEntry<Multiplier> {
        return new StorageEntry<Multiplier>("TransactionPayment", "Multiplier");
    }

    /**
     * @description Fee for each byte
     */
    export function TransactionByteFee(): StorageEntry<TransactionByteFee> {
        return new StorageEntry<TransactionByteFee>("TransactionPayment", "ByteFee");
    }
}

export class TransactionPayment {
    /**
     * @description Compute the final fee value for a particular transaction.
	 *
	 * The final fee is composed of:
	 *   - `base_fee`: This is the minimum amount a user pays for a transaction. It is declared
	 *     as a base _weight_ in the runtime and converted to a fee using `_WeightToFee`.
	 *   - `len_fee`: The length fee, the amount paid for the encoded length (in bytes) of the
	 *     transaction.
	 *   - `weight_fee`: This amount is computed based on the weight of the transaction. Weight
	 *     accounts for the execution time of a transaction.
	 *   - `targeted_fee_adjustment`: This is a multiplier that can tune the final fee based on
	 *     the congestion of the network.
	 *   - (Optional) `tip`: If included in the transaction, the tip will be added on top. Only
	 *     signed transactions can have a tip.
	 * The base fee and adjusted weight and length fees constitute the _inclusion fee,_ which is
	 * the minimum fee for a transaction to be included in a block.
	 * ```ignore
	 * inclusion_fee = base_fee + len_fee + [targeted_fee_adjustment * weight_fee];
	 * final_fee = inclusion_fee + tip;
	 * ```
     * @param len byte length of the extrinsic
     * @param info information about dispatch
     * @param tip tip to be included
     */
    static computeFee(len: u32, info: DispatchInfo<Weight>, tip: Balance): Balance {
        return this._computeFeeRaw(len, info.weight, tip, info.paysFee);
    };

    /**
     * @description Compute the actual post dispatch fee for a particular transaction.
	 *
	 * Identical to `compute_fee` with the only difference that the post dispatch corrected
	 * weight is used for the weight fee calculation.
     * @param len byte length of the extrinsic
     * @param info information about dispatch
     * @param postInfo information about what happens after dispatch
     * @param tip tip to be included
     */
    static computeActualFee(len: u32, info: DispatchInfo<Weight>, postInfo: PostDispatchInfo<Weight>, tip: Balance): Balance {
        return this._computeFeeRaw(len, postInfo.calcActualWeight(info), tip, postInfo.paysFee);
    };

    /**
     * @description Actual computation of transaction fees
     * @param len byte length of the transaction
     * @param weight weight of transaction
     * @param tip tip to be included 
     * @param paysFee simple boolean indicating whether initiator pays transaction fees
     */
    static _computeFeeRaw(len: u32, weight: Weight, tip: Balance, paysFee: Pays): Balance {
        if (paysFee == Pays.Yes) {
            let length: Balance = instantiate<Balance>(len);
            let perByte: TransactionByteFee = TPaymentStorageEntries.TransactionByteFee().get();

            // length fee. not adjusted
            let fixedLenFee =<u64>length.unwrap() * <u64>perByte.unwrap();

            // the adjustable part of the fee
            let unadjustedWeightFee = this._weightToFee(weight);
            let multiplier = TPaymentStorageEntries.NextFeeMultiplier().get();

            // final adjusted part of the fee
            const adjustedWeightFee = <u64>multiplier.unwrap() * <u64>unadjustedWeightFee.unwrap();   
            let baseFee = this._weightToFee(SystemConfig.ExtrinsicBaseWeight());

            baseFee += <u64>fixedLenFee + <u64>adjustedWeightFee + <u64>tip.unwrap();
            return instantiate<Balance>(baseFee);
        }
        else {
            return tip;
        }
    };

    /**
     * @description Convert passed weight to balance
     * @param weight 
     */
    static _weightToFee(weight: Weight): Balance {
        // cap the weight to the maximum defined in runtime, otherwise it will be the
        // `Bounded` maximum of its data type, which is not desired. 
        let cappedWeight = weight.unwrap() < SystemConfig.MaximumBlockWeight().unwrap() ? weight : SystemConfig.MaximumBlockWeight();
        let formula = new WeightToFeePolynomial<Balance>([
            new WeightToFeeCoefficient(1, 0, false, 1)
        ]);
        return formula.calc(cappedWeight);
    };

    /**
     * @description Withdraw transaction fees from the account
     * @param who 
     * @param tip 
     * @param info 
     * @param len 
     */
    static _withdrawFee(who: AccountIdType, tip: Balance, info: DispatchInfo<Weight>, len: i32): void {
        const fee = this.computeFee(len, info, tip);
        Payment.withdrawFee(who, info, fee, tip);
    };
}