import { ByteArray, BytesReader, CompactInt } from 'as-scale-codec';
import {
    ExecutionPhase,
    ext_trie_blake2_256_ordered_root_version_1,
    Header, Phase,
    Serialiser, Storage
} from 'subsembly-core';
import {
    AccountInfoType,
    BlockNumber, ExtrinsicDataType, ExtrinsicIndexType,
    HashType, HeaderType, SystemConfig, UncheckedExtrinsic
} from '../runtime/runtime';
import { StorageEntry } from './models/storage-entry';

/**
 * @description Storage entries for System module
 */
export namespace SystemStorageEntries{
    /**
     * @description Stores nonce of the account 
     * @storage_map AccountId
     */
    export function Account(): StorageEntry<AccountInfoType>{
        return new StorageEntry<AccountInfoType>("System", "Account");
    };

    /**
     * @description Total extrinsics count for the current block.
     * @storage
     */
    export function ExtrinsicCount(): StorageEntry<ExtrinsicIndexType>{
        return new StorageEntry<ExtrinsicIndexType>("System", "ExtrinsicCount");
    };

    /**
     * @description Total length (in bytes) for all extrinsics put together, for the current block.
     * @storage
     */
    export function AllExtrinsicsLen(): StorageEntry<ExtrinsicIndexType>{
        return new StorageEntry<ExtrinsicIndexType>("System", "AllExtrinsicsLen");
    };

    /**
     * @description Hash of the previous block.
     * @storage_map BlockNumber
     */
    export function ParentHash(): StorageEntry<HashType>{
        return new StorageEntry<HashType>("System", "ParentHash");
    };

    /**
     * @description Extrinsics root of the current block, also part of the block header.
     * @storage
     */
    export function ExtrinsicsRoot(): StorageEntry<HashType>{
        return new StorageEntry<HashType>("System", "ExtrinsicsRoot");
    };
    /**
     * @description Digest of the current block, also part of the block header.
     * @storage
     */
    export function Digest(): StorageEntry<ByteArray>{
        return new StorageEntry<ByteArray>("System", "Digest");
    };

    /**
     * @description Extrinsics data for the current block (maps an extrinsic's index to its data).
     * @storage_map Index
     */
    export function ExtrinsicData(): StorageEntry<ExtrinsicDataType>{
        return new StorageEntry<ExtrinsicDataType>("System", "ExtrinsicData");
    };

    /**
     * @description Map of block numbers to block hashes.
     * @storage_map BlockNumber
     */
    export function BlockHash(): StorageEntry<HashType>{
        return new StorageEntry<HashType>("System", "BlockHash");
    };
    /**
     * @description The current block number being processed. Set by `execute_block`.
     * @storage
     */
    export function Number(): StorageEntry<BlockNumber>{
        return new StorageEntry<BlockNumber>("System", "Number");
    };

    /**
     * @description The index of the last executed extrinsic
     * @storage
     */
    export function ExtrinsicIndex(): StorageEntry<ExtrinsicIndexType>{
        return new StorageEntry<ExtrinsicIndexType>("System", "ExtrinsicsRoot");
    };

    /**
     * @description Block execution phase
     * @storage
     */
    export function ExecutionPhase(): StorageEntry<Phase>{
        return new StorageEntry<Phase>("System", "ExecutionPhase");
    };
};

/**
 * @description Provides low-level types, storage, and functions for your blockchain. 
 * All other pallets depend on the System library as the basis of your Subsembly runtime.
 */
export class System {
    /**
     * number of all modules in the runtime that creates inherents (timestamp, for now)
     * array is encoded as CompactInt
    */
    static readonly ALL_MODULES: u8[] = [4];
    
    /**
     * @description Sets up the environment necessary for block production
     * @param header Header instance
    */
    static _initialize(header: HeaderType): void {
        SystemStorageEntries.ExtrinsicIndex().set(instantiate<ExtrinsicIndexType>(0));
        SystemStorageEntries.ExecutionPhase().set(new Phase(ExecutionPhase.Initialization));
        SystemStorageEntries.ParentHash().set(header.getParentHash());
        SystemStorageEntries.Number().set(header.getNumber());
        SystemStorageEntries.ExtrinsicsRoot().set(header.getExtrinsicsRoot());

        let digestsArr = header.getDigests();
        let digests: u8[] = (new CompactInt(digestsArr.length)).toU8a();

        for (let i: i32 = 0; i < digestsArr.length; i++) {
            digests = digests.concat(digestsArr[i].toU8a());
        }

        SystemStorageEntries.Digest().set(new ByteArray(digests));
        const blockNumber: BlockNumber = instantiate<BlockNumber>((<BlockNumber>header.getNumber()).unwrap() - 1);
        SystemStorageEntries.BlockHash().set(header.getParentHash(), blockNumber);
    }
    /**
     * @description Removes temporary "environment" entries in storage and finalize block
     */
    static _finalize(): HeaderType {
        SystemStorageEntries.ExecutionPhase().clear();
        SystemStorageEntries.ExtrinsicCount().clear();
        let blockNumber = SystemStorageEntries.Number().take();
        let parentHash = SystemStorageEntries.ParentHash().take();
        let digests = SystemStorageEntries.Digest().take();
        let extrinsicsRoot = SystemStorageEntries.ExtrinsicsRoot().take();

        // move block hash pruning window by one block
        let blockHashCount = SystemConfig.BlockHashCount();
        if (blockNumber && blockNumber.unwrap() > blockHashCount.unwrap()) {
            let toRemove = blockNumber.unwrap() - blockHashCount.unwrap() - 1;
            // keep genesis hash
            if (toRemove != 0) {
                SystemStorageEntries.BlockHash().clear(instantiate<BlockNumber>(toRemove));
            }
        }
        const root = BytesReader.decodeInto<HashType>(Storage.storageRoot());
        const digest = Header.decodeOptionalDigest(digests.unwrap());
        return instantiate<HeaderType>(parentHash, blockNumber, root, extrinsicsRoot, digest.getResult());
    }

    /**
     * @description Computes the extrinsicsRoot for the given data and populates storage
     * @param data 
     */
    static _computeExtrinsicsRoot(): void {
        const extcsData = SystemStorageEntries.ExtrinsicData().get();
        SystemStorageEntries.ExecutionPhase().set(new Phase(ExecutionPhase.ApplyExtrinsic));
        const extcsRoot = this._extrinsicsDataRoot(extcsData.toEnumeratedValues());
        SystemStorageEntries.ExtrinsicsRoot().set(extcsRoot);
    }

    /**
     * @description Computes the ordered trie root hash of the extrinsics data
     * @param data enumerated values
     */
    static _extrinsicsDataRoot(data: u8[]): HashType {
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
    static _noteAppliedExtrinsic(ext: UncheckedExtrinsic): void {
        const extrinsics = SystemStorageEntries.ExtrinsicData().get();
        const extIndex = SystemStorageEntries.ExtrinsicIndex().get();
        extrinsics.insert(extIndex, new ByteArray(ext.toU8a()));
        SystemStorageEntries.ExtrinsicData().set(extrinsics);
        SystemStorageEntries.ExtrinsicIndex().set(instantiate<ExtrinsicIndexType>(extIndex.unwrap() + 1));
        SystemStorageEntries.Events().set(extIndex, new Event());
    }

    /**
     * @description Sets the new extrinsicsCount and set execution phase to finalization
     */
    static _noteFinishedExtrinsics(): void {
        SystemStorageEntries.ExtrinsicCount().set(SystemStorageEntries.ExtrinsicIndex().get());
        SystemStorageEntries.ExecutionPhase().set(new Phase(ExecutionPhase.ApplyExtrinsic));
    }
}
