import { StorageEntry } from '../../frame';
import { Balance, Multiplier, SystemConfig, TransactionByteFee, Weight } from '../../runtime/runtime';
import { DispatchInfo, Pays, PostDispatchInfo } from './transaction-info';

export namespace StorageEntries {
    export function NextFeeMultiplier(): StorageEntry<Multiplier> {
        return new StorageEntry<Multiplier>("TransactionPayment", "Multiplier");
    }

    export function TransactionByteFee(): StorageEntry<TransactionByteFee> {
        return new StorageEntry<TransactionByteFee>("TransactionPayment", "ByteFee");
    }
}

export class TransactionPayment {
    static onFinalize() {};

    static integrityTest() {};

    static computeFee(len: u32, info: DispatchInfo, tip: Balance): Balance {
        this.computeFeeRaw(len, info.weight, tip, info.paysFee);
    };

    static computeActualFee(len: u32, info: DispatchInfo, postInfo: PostDispatchInfo, tip: Balance): Balance {
        this.computeFeeRaw(len, postInfo.calcActualWeight(info), tip, postInfo.paysFee);
    };

    static computeFeeRaw(len: u32, weight: Weight, tip: Balance, paysFee: Pays): Balance {
        if (paysFee == Pays.Yes) {
            let length: Balance = instantiate<Balance>(len);
            let perByte: TransactionByteFee = StorageEntries.TransactionByteFee().get();

            // length fee. not adjusted
            let fixedLenFee = length.unwrap() * perByte.unwrap();

            // the adjustable part of the fee
            let unadjustedWeightFee = this.weightToFee(weight);
        }
    };

    static weightToFee(weight: Weight): Balance {
        // cap the weight to the maximum defined in runtime, otherwise it will be the
        // `Bounded` maximum of its data type, which is not desired. 
        let cappedWeight = weight.unwrap() < SystemConfig.MaximumBlockWeight().unwrap() ? weight.unwrap() : SystemConfig.MaximumBlockWeight().unwrap();
        return Weigh
    };

    static withdrawFee() {};
}