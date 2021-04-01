import { u128 } from 'as-bignum';
import { UInt128, UInt32 } from 'as-scale-codec';
import { DispatchClass, DispatchInfo, Pays, PostDispatchInfo, RuntimeDispatchInfo, WeightToFeeCoefficient, WeightToFeePolynomial } from 'subsembly-core';
import { StorageEntry } from '../../frame';
import { AccountIdType, Balance, Multiplier, SystemConfig, UncheckedExtrinsic, Weight } from '../../runtime/runtime';
import { Payment } from './payment';

/**
 * Storage entries for TransactionPayment module
 */
export namespace TransactionPaymentStorageEntries {
    /**
     * @description Multiplier value for the next fee
     */
    export function NextFeeMultiplier(): StorageEntry<Multiplier> {
        return new StorageEntry<Multiplier>("TransactionPayment", "Multiplier");
    }

    /**
     * @description Fee for each byte
     */
    export function TransactionByteFee(): StorageEntry<Balance> {
        return new StorageEntry<Balance>("TransactionPayment", "ByteFee");
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
    static _computeFee(len: UInt32, info: DispatchInfo<Weight>, tip: Balance): Balance {
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
    static _computeActualFee(len: UInt32, info: DispatchInfo<Weight>, postInfo: PostDispatchInfo<Weight>, tip: Balance): Balance {
        return this._computeFeeRaw(len, postInfo.calcActualWeight(info), tip, postInfo.paysFee);
    };

    /**
     * @description Actual computation of transaction fees
     * @param len byte length of the transaction
     * @param weight weight of transaction
     * @param tip tip to be included 
     * @param paysFee simple boolean indicating whether initiator pays transaction fees
     */
    static _computeFeeRaw(len: UInt32, weight: Weight, tip: Balance, paysFee: Pays): Balance {
        if (paysFee == Pays.Yes) {
            let length: Balance = instantiate<Balance>(u128.fromU32(len.unwrap()));
            let perByte: Balance = TransactionPaymentStorageEntries.TransactionByteFee().get();
            if (perByte.unwrap() == u128.Zero) {
                perByte = instantiate<Balance>(u128.One);
            }

            // length fee. not adjusted
            let fixedLenFee = length.unwrap() * perByte.unwrap();

            // the adjustable part of the fee
            let unadjustedWeightFee = this._weightToFee(weight);
            let multiplier = instantiate<Balance>(u128.fromU64(TransactionPaymentStorageEntries.NextFeeMultiplier().get().unwrap()));

            // final adjusted part of the fee
            const adjustedWeightFee = multiplier.unwrap() * unadjustedWeightFee.unwrap();   
            let baseFee = this._weightToFee(SystemConfig.ExtrinsicBaseWeight());

            let basedFee = baseFee.unwrap() +  fixedLenFee + adjustedWeightFee + tip.unwrap();
            return instantiate<Balance>(basedFee);
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
    static _withdrawFee(who: AccountIdType, tip: Balance, info: DispatchInfo<Weight>, len: UInt32): void {
        const fee = this._computeFee(len, info, tip);
        Payment.withdrawFee(who, info, fee, tip);
    };

    /**
     * @description Query the data that we know about the fee of a given call.
     * NOTE: Because of the bug in UInt128 of as-scale-codec, we are currently returning static partial fee of 1;
     * @param ext 
     * @param len 
     */
    static _queryInfo(ext: UncheckedExtrinsic, len: UInt32): RuntimeDispatchInfo<UInt128, Weight> {
        const dispatchInfo = new DispatchInfo<Weight>(instantiate<Weight>(ext.encodedLength()), Pays.Yes, DispatchClass.Normal);
        const partialFee = this._computeFee(len, dispatchInfo, instantiate<Balance>(u128.Zero));
        return new RuntimeDispatchInfo<UInt128, Weight>(dispatchInfo.weight, dispatchInfo.klass, partialFee);
    }
}