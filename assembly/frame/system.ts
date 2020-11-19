import { ByteArray, BytesReader } from 'as-scale-codec';
import {
    ExtrinsicData, ext_trie_blake2_256_ordered_root_version_1,
    IAccountId, IHeader, Serialiser, Storage, Utils
} from 'subsembly-core';
import {
    BlockNumber, ExtrinsicDataType, ExtrinsicIndex,
    HashType, HeaderType, NonceType, RuntimeConstants
} from '../runtime/runtime';

/**
 * @description Provides low-level types, storage, and functions for your blockchain. 
 * All other pallets depend on the System library as the basis of your Subsembly runtime.
 */

export class System {
    // execution phases
    static readonly EXTRINSIC_INDEX: string = ":extrinsic_index";
    static readonly APPLY_EXTRINSIC: string = "ApplyExtrinsic";
    static readonly INITIALIZATION: string = "Initialization";
    static readonly FINALIZATION: string = "Finalization";
    /**
     * number of all modules in the runtime that creates inherents (timestamp, for now)
     * array is encoded as CompactInt
    */
    static readonly ALL_MODULES: u8[] = [4];
    // nonce key
    static readonly NONCE_KEY: string = "nonce";
    /**
     * System storage keys
     */
    // execution phase
    static readonly EXEC_PHASE: string[] = ["system", "exec_phase"];
    // parent hash
    static readonly PARENT_HSH: string[] = ["system", "parent_hsh"];
    // block number
    static readonly BLOCK_NUM0: string[] = ["system", "block_num0"];
    // extrinsics root
    static readonly EXTCS_ROOT: string[] = ["system", "extcs_root"];
    // digest items
    static readonly DIGESTS_00: string[] = ["system", "digests_00"];
    // block hash
    static readonly BLOCK_HASH: string[] = ["system", "block_hash"];
    // extrinsics count
    static readonly EXTCS_COUT: string[] = ["system", "extcs_cout"];
    // extrinsics data 
    static readonly EXTCS_DATA: string[] = ["system", "extcs_data"];
    // block hash count (max number of blocks to be stored)
    static readonly BHSH_COUNT: string[] = ["system", "bhash_cout"];
    
    /**
     * @description Sets up the environment necessary for block production
     * @param header Header instance
    */
   static initialize(header: IHeader): void{
    // maximum number of blocks
    const bhshCount = RuntimeConstants.blockHashCount();
    Storage.set(Utils.stringsToBytes(this.BHSH_COUNT, true), bhshCount.toU8a());
    Storage.set(Utils.stringsToBytes([this.EXTRINSIC_INDEX], true), [<u8>0]);
    Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.INITIALIZATION], true));
    Storage.set(Utils.stringsToBytes(this.PARENT_HSH, true), header.getParentHash().toU8a());
    Storage.set(Utils.stringsToBytes(this.BLOCK_NUM0, true), header.getNumber().toU8a());
    Storage.set(Utils.stringsToBytes(this.EXTCS_ROOT, true), header.getExtrinsicsRoot().toU8a());

    let digests: u8[] = [];
    for(let i: i32 = 0; i < header.getDigests().length; i++){
        digests.concat(header.getDigests()[i].toU8a());
    }

    Storage.set(Utils.stringsToBytes(this.DIGESTS_00, true), digests);
    const blockNumber: BlockNumber = instantiate<BlockNumber>((<BlockNumber>header.getNumber()).value - 1);
    this.setHashAtBlock(blockNumber, <HashType>header.getParentHash());
}
    /**
     * @description Removes temporary "environment" entries in storage and finalize block
     */
    static finalize(): HeaderType {
        Storage.clear(Utils.stringsToBytes(this.EXEC_PHASE, true));
        Storage.clear(Utils.stringsToBytes(this.EXTCS_COUT, true));
        let blockNumber = Storage.take(Utils.stringsToBytes(this.BLOCK_NUM0, true));
        let parentHash = Storage.take(Utils.stringsToBytes(this.PARENT_HSH, true));
        let digests = Storage.take(Utils.stringsToBytes(this.DIGESTS_00, true));
        let extrinsicsRoot = Storage.take(Utils.stringsToBytes(this.EXTCS_ROOT, true));
        
        // move block hash pruning window by one block
        let blockHashCount = (this.blockHashCount());
        let blockNum = BytesReader.decodeInto<BlockNumber>(blockNumber);
        if(blockNum.value > blockHashCount.value){
            let toRemove = blockNum.value - blockHashCount.value - 1;
            // keep genesis hash
            if(toRemove != 0){
                let toRemoveNum = instantiate<BlockNumber>(toRemove);
                const blockHashKey = Utils.stringsToBytes(this.BLOCK_HASH, true).concat(toRemoveNum.toU8a());
                Storage.clear(blockHashKey);
            }
        }

        let stateRoot = Storage.storageRoot();

        let result: u8[] = parentHash.concat(blockNumber)
            .concat(stateRoot)
            .concat(extrinsicsRoot)
            .concat(digests);
        return BytesReader.decodeInto<HeaderType>(result);
    }
    /**
     * @description Get the nonce value of the given AccountId
     * The format of the key for storing nonce in the storage is:
     * SCALE(AccountId) + SCALE("nonce")
     * @param who account for which to get the nonce
     */
    static accountNonce(who: IAccountId): NonceType{
        const nonceKey: u8[] = Utils.stringsToBytes([System.NONCE_KEY], true);
        const value = Storage.get(who.getAddress().concat(nonceKey));
        if(value.isSome()){
            return BytesReader.decodeInto<NonceType>((<ByteArray>value.unwrap()).values);
        }
        return instantiate<NonceType>(0);
    }

    /**
     * Increment nonce of this account
     * @param who account
     */
    static incAccountNonce(who: IAccountId): void{
        const oldNonce = System.accountNonce(who);
        const nonceKey: u8[] = Utils.stringsToBytes([System.NONCE_KEY], true);
        const newNonce = instantiate<NonceType>(oldNonce.value + 1);
        Storage.set(who.getAddress().concat(nonceKey), newNonce.toU8a());
    }

    /**
    * @description Maximum number of block number to block hash mappings to keep (oldest pruned first).
    */
   static blockHashCount(): BlockNumber {
    const value = Storage.get(Utils.stringsToBytes(this.BHSH_COUNT, true));
    if(value.isSome()){
        return BytesReader.decodeInto<BlockNumber>((<ByteArray>value.unwrap()).values);
    }
    return instantiate<BlockNumber>(0);
}

    /**
     * @description Gets the index of extrinsic that is currently executing.
     */
    static extrinsicIndex(): ExtrinsicIndex{
        const extIndex = Storage.take(Utils.stringsToBytes([System.EXTRINSIC_INDEX], true));
        return BytesReader.decodeInto<ExtrinsicIndex>(extIndex);
    }

    /**
     * @description Increment extrinsic index
     */
    static incExtrinsicIndex(): void {
        const count = this.extrinsicIndex();
        const newCount = instantiate<ExtrinsicIndex>(count.value + 1);
        Storage.set(Utils.stringsToBytes([System.EXTRINSIC_INDEX], true), newCount.toU8a());
    }

    /**
     * @description Computes the extrinsicsRoot for the given data and populates storage
     * @param data 
     */
    static computeExtrinsicsRoot(): void{
        let extrinsicsDataU8a = Storage.take(Utils.stringsToBytes(this.EXTCS_DATA, true));
        const extcsData = BytesReader.decodeInto<ExtrinsicDataType>(extrinsicsDataU8a);
        Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.APPLY_EXTRINSIC], true));
        const extcsRoot = this.extrinsicsDataRoot(extcsData.toEnumeratedValues());
        Storage.set(Utils.stringsToBytes(this.EXTCS_ROOT, true), extcsRoot.toU8a());
    }

    /**
     * @description Computes the ordered trie root hash of the extrinsics data
     * @param data enumerated values
     */
    static extrinsicsDataRoot(data: u8[]): HashType{
        let dataPtr = data.dataStart;
        let dataLen = data.length;
        __retain(dataPtr);
        const dataU64 = ((dataLen as u64) << 32) | dataPtr;
        let extrinsicRoot: i32 = ext_trie_blake2_256_ordered_root_version_1(dataU64);
        const hashU8a = Serialiser.deserialiseInput(extrinsicRoot, 32);
        return BytesReader.decodeInto<HashType>(hashU8a);
    }
    /**
     * @description Adds applied extrinsic to the current ExtrinsicData
     * @param ext extrinsic as bytes
     */
    static noteAppliedExtrinsic(ext: u8[]): void{
        const extrinsics = Storage.get(Utils.stringsToBytes(this.EXTCS_DATA, true));
        const extIndex = this.extrinsicIndex();
        const extValue = BytesReader.decodeInto<ByteArray>(ext);
        if (extrinsics.isSome()){
            let extrinsicsU8a: u8[] = (<ByteArray>extrinsics.unwrap()).values;
            const extcsData = ExtrinsicData.fromU8Array(extrinsicsU8a).getResult();
            extcsData.insert(extIndex, extValue);
            Storage.set(Utils.stringsToBytes(this.EXTCS_DATA, true), extcsData.toU8a());
            this.incExtrinsicIndex();
            return ;
        }
        const data: Map<ExtrinsicIndex, ByteArray> = new Map();
        data.set(extIndex, extValue);
        const extcsData = new ExtrinsicData(data);
        Storage.set(Utils.stringsToBytes(this.EXTCS_DATA, true), extcsData.toU8a());
        this.incExtrinsicIndex();
    }

    /**
     * @description Sets the new extrinsicsCount and set execution phase to finalization
     */
    static noteFinishedExtrinsics(): void{
        let extIndex = this.extrinsicIndex();
        Storage.set(Utils.stringsToBytes(this.EXTCS_COUT, true), extIndex.toU8a());
        Storage.set(Utils.stringsToBytes(this.EXEC_PHASE, true), Utils.stringsToBytes([System.FINALIZATION], true));
    }

    /**
     * @description Get hash of the block by the block number
     */
    static getHashAtBlock(number: BlockNumber): HashType{
        let blockHash = Storage.get(Utils.stringsToBytes(this.BLOCK_HASH, true).concat(number.toU8a()));
        let blockHashU8a: u8[] = blockHash.isSome() ? (<ByteArray>blockHash.unwrap()).values : [];
        return BytesReader.decodeInto<HashType>(blockHashU8a);
    }
    /**
     * @description Set hash of the block
     */
    static setHashAtBlock(number: BlockNumber, hash: HashType): void{
        const blockHashKey: u8[] = Utils.stringsToBytes(this.BLOCK_HASH, true).concat(number.toU8a());
        Storage.set(blockHashKey, hash.toU8a());
    }
}