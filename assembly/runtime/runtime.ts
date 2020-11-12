import { Codec, CompactInt, Hash, UInt128, UInt32, UInt64 } from "as-scale-codec";
import { Block, DigestItem, Header, RuntimeVersion, Signature, SupportedAPIs } from "subsembly-core";
import { AccountId } from "subsembly-core";

/**
 * General Runtime types
 */
export type BlockNumber = CompactInt;
export type AccountIdType = AccountId;
export type SignatureType = Signature;
export type HashType = Hash;
export type DigestItemType = DigestItem;
export type Balance = UInt128;
export type HeaderType = Header;
export type BlockType = Block;
export type Moment = UInt64;
export type NonceType = UInt64;
export type BlockHashType = UInt32;
export type ExtrinsicIndex = UInt32;

export class RuntimeConstants {
    /**
     * Instanciates new RuntimeVersion Configration
    */


    static blockHashCount(): UInt32{
        return new UInt32(1000);
    }
}

export class TimestampTypes{
    static minimumPeriod(): u64{
        return 5000;
    }
}

export function runtimeVersion(): RuntimeVersion{
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