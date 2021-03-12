import { ByteArray, BytesReader, CompactInt, Hash, UInt128, UInt32, UInt64 } from "as-scale-codec";
import {
    AccountData, AccountId, AccountInfo, Block, DigestItem, ExtrinsicData,
    GenericExtrinsic, Header, RuntimeVersion, Signature, SignedTransaction, SupportedAPIs
} from "subsembly-core";

export type HashType = Hash;
export type Moment = UInt64;
export type NonceType = UInt32;
export type ExtrinsicIndexType = UInt32;
export type AmountType = Balance;
export type SignedTransactionType = SignedTransaction<HashType, AmountType, NonceType, SignatureType>;
export type BlockNumber = CompactInt;
export type AccountIdType = AccountId;
export type SignatureType = Signature;
export type DigestItemType = DigestItem;
export type Balance = UInt128;
export type HeaderType = Header<BlockNumber, HashType>;
export type BlockType = Block<HeaderType, UncheckedExtrinsic>;
export type Inherent = UncheckedExtrinsic;
export type ExtrinsicDataType = ExtrinsicData<ExtrinsicIndexType, ByteArray>;
export type Multiplier = UInt64;
export type ByteFee = Balance;
export type Weight = UInt64;
export type UncheckedExtrinsic = GenericExtrinsic<AccountIdType, Balance, NonceType, SignatureType>;
export type AccountDataType = AccountData<Balance>;
export type AccountInfoType = AccountInfo<NonceType, AccountDataType>;
/**
 * Note: Originally Events are stored as a vector of RawEvents,
 * since we don't have support for vector of Codec types (i.e Codec[]),
 * we are using opaque bytes to store events 
 */
export type VecEvent = ByteArray;
/**
 * @description Constants for runtime
 */
export class RuntimeConfig {
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

/**
 * System config
 */
export class SystemConfig{
    static readonly WEIGHT_PER_SECOND: u64 = 1_000_000_000_000;
    static readonly WEIGHT_PER_MILLIS: u64 = SystemConfig.WEIGHT_PER_SECOND / 1_000;
    static readonly WEIGHT_PER_MICROS: u64 = SystemConfig.WEIGHT_PER_MILLIS / 1_000;
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
    
    /**
     * @description The maximum weight of a block.
     */
    static MaximumBlockWeight(): Weight {
        return instantiate<Weight>(2 * this.WEIGHT_PER_SECOND);
    }

    /**
     * @description The base weight of an Extrinsic in the block, independent of the of extrinsic being executed.
     */
    static ExtrinsicBaseWeight(): Weight {
        return instantiate<Weight>(125 * this.WEIGHT_PER_MICROS);
    }

    /**
     * @description Importing a block with 0 txs takes ~5 ms
     */
    static BlockExecutionWeight(): Weight {
        return instantiate<Weight>(5 * this.WEIGHT_PER_MILLIS);
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
/**
 * @description Constants used in Balances module
 */
export class BalancesConfig {
    /**
     * @description Existential deposit
     */
    static existentialDeposit(): Balance {
        return BytesReader.decodeInto<Balance>([<u8>0xfd]);
    }
}