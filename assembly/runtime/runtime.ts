import { ByteArray, CompactInt, Hash, ScaleMap, UInt128, UInt32, UInt64 } from "as-scale-codec";
import {
    AccountData,
    AccountId, Block, DigestItem, Extrinsic, ExtrinsicData, Header, Inherent,
    RuntimeVersion, Signature, SignedTransaction, SupportedAPIs, Utils
} from "subsembly-core";

export type HashType = Hash;
export type Moment = UInt64;
export type NonceType = UInt64;
export type ExtrinsicIndex = UInt32;
export type AmountType = UInt64;
export type SignedTransactionType = SignedTransaction<HashType, AmountType, NonceType, SignatureType>;
export type BlockNumber = CompactInt;
export type AccountIdType = AccountId;
export type SignatureType = Signature;
export type DigestItemType = DigestItem;
export type Balance = UInt128;
export type HeaderType = Header<BlockNumber, HashType>;
export type UncheckedExtrinsic = Extrinsic;
export type BlockType = Block<HeaderType, UncheckedExtrinsic>;
export type InherentType = Inherent<Moment>;
export type ExtrinsicDataType = ExtrinsicData<ExtrinsicIndex, ByteArray>;

export namespace TimestampStorageEntries{
    /**
     * Current time for the current block.
     */
    export type Now = Moment;
    
    /**
     * Did the timestamp get updated in this block?
     */
    export type DidUpdate = bool;
};

export namespace AuraStorageEntries{};

export namespace BalancesStorageEntries{
    /**
     * The total units issued in the system.
     */
    export type TotalIssuance = Balance;

    /**
     *  The balance of an account.,
        NOTE: This is only used in the case that this module is used to store balances.
     */
    export type Account = ScaleMap<AccountId, AccountData<Balance>>;    
};

/**
 * @description Runtime specific methods
 */
export namespace Runtime {
    /**
     * @description Metadata of the runtime
     */
    export function metadata(): u8[] {
        // returns hard-coded value, currently
        let metadata: u8[] = [24]
        metadata = metadata.concat(Utils.stringsToBytes(["meta"], false));
        return metadata.concat([12]).concat([0]);
    }
}

/**
 * @description Constants for runtime
 */
export class RuntimeConstants {
    /**
     * @description Instanciates new RuntimeVersion Configration
    */
    static runtimeVersion(): RuntimeVersion {
        const SPEC_NAME: string = "node-template";
        const IMPL_NAME: string = "AssemblyScript"
        const AUTHORING_VERSION: u32 = 1;
        const SPEC_VERSION: u32 = 1;
        const IMPL_VERSION: u32 = 1;

        const APIS_VEC: SupportedAPIs = new SupportedAPIs();
        APIS_VEC.addAPI([1, 1, 1, 1, 1, 1, 1, 1], 10);

        const TRANSACTION_VERSION: u32 = 1;

        return new RuntimeVersion(
            SPEC_NAME,
            IMPL_NAME,
            AUTHORING_VERSION,
            SPEC_VERSION,
            IMPL_VERSION,
            APIS_VEC,
            TRANSACTION_VERSION
        );
    };
}

export class SystemConstants{
    /**
     * @description Number of block hashes to store in the storage, pruning starts with the oldest block 
    */
    static BlockHashCount(): BlockNumber {
        return instantiate<BlockNumber>(1000);
    }

    /**
     * @description The maximum length of a block (in bytes).
     */
    static MaximumBlockLength(): UInt32 {
        return new UInt32(5000);
    }
}

/**
 * @description Types and constants used in Timestamp pallet
 */
export class TimestampConfig {
    /**
     * @description Minimum period between timestamps
     */
    static minimumPeriod(): Moment {
        return instantiate<Moment>(5000);
    }
}