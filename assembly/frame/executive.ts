import { ByteArray, BytesReader, CompactInt, Hash } from 'as-scale-codec';
import {
    Crypto, InherentData,
    Log, ResponseCodes, TransactionSource, Utils
} from 'subsembly-core';
import { Aura, Timestamp } from '../pallets';
import {
    BlockNumber, BlockType, HeaderType,
    InherentType, SignatureType, UncheckedExtrinsic
} from '../runtime/runtime';
import { StorageEntries as SystemStorageEntries, System } from './system';

/**
 * @description Acts as the orchestration layer for the runtime.
 * It dispatches incoming extrinsic calls to the respective pallets in the runtime.
 */
export namespace Executive {
    /**
     * @description Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: HeaderType): void {
        System._initialize(header);
    }

    /**
     * @description Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: BlockType): void {
        let header = <HeaderType>block.getHeader();
        let n: BlockNumber = <BlockNumber>header.getNumber();
        // check that parentHash is valid
        const previousBlock: BlockNumber = instantiate<BlockNumber>(n.unwrap() - 1);
        const parentHash: Hash = SystemStorageEntries.BlockHash().get(previousBlock);

        if (n == instantiate<BlockNumber>(0) && parentHash != header.getParentHash()) {
            Log.error("Initial checks: Parent hash should be valid.");
            throw new Error("Executive: Initial checks for block execution failed");
        }
    }

    /**
     * @description Final checks before including block in the chain
     * @param header 
     */
    export function finalChecks(header: HeaderType): void {
        System._computeExtrinsicsRoot();
        let newHeader = System._finalize();
        let storageRoot = newHeader.getStateRoot();
        if (header.getStateRoot() != storageRoot) {
            Log.error("Storage root must match that calculated");
            throw new Error("Executive: Final checks for block execution failed");
        }
    }

    /**
     * @description Actually execute all transactions for Block
     * @param block Block instance
     */
    export function executeBlock(block: BlockType): void {
        Executive.initializeBlock(block.getHeader());
        Executive.initialChecks(block);

        Executive.executeExtrinsicsWithBookKeeping(block.getExtrinsics());
        Executive.finalChecks(block.getHeader());
    }
    /**
     * @description Finalize the block - it is up the caller to ensure that all header fields are valid
     * except state-root.
     */
    export function finalizeBlock(): HeaderType {
        System._noteFinishedExtrinsics();
        System._computeExtrinsicsRoot();
        return System._finalize();
    }
    /**
     * @description creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: InherentData<ByteArray>): u8[] {
        const timestamp: InherentType = Timestamp._createInherent(data);
        const aura = Aura._createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * @description Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = BytesReader.decodeInto<CompactInt>(ext);
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen.unwrap() as u32);
        // if applying extrinsic succeeded, notify System about it
        if (Utils.areArraysEqual(result, ResponseCodes.SUCCESS)) {
            System._noteAppliedExtrinsic(ext);
        }
        return result;
    }

    /**
     * @description Orchestrating function for applying extrinsic
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: u8[], encodedLen: u32): u8[] {
        switch (encodedLen) {
            default: {
                return ResponseCodes.SUCCESS;
            }
        }
    }

    /**
     * @description Execute given extrinsics and take care of post-extrinsics book-keeping
     * @param extrinsics byte array of extrinsics 
     */
    export function executeExtrinsicsWithBookKeeping(extrinsics: UncheckedExtrinsic[]): void {
        for (let i = 0; i < extrinsics.length; i++) {
            Executive.applyExtrinsic(extrinsics[i].toU8a());
        }
        System._noteFinishedExtrinsics();
    }

    /**
     * @description Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(utx: UncheckedExtrinsic): u8[] {
        if(utx.isSigned()){
            const extSignature = utx.signature;
            const from = extSignature.signer;
            const transfer = utx.asTransfer();
    
            const nonce = SystemStorageEntries.AccountNonce().get(from);
            if (nonce && nonce.unwrap() >= transfer.nonce.unwrap()) {
                Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
                return ResponseCodes.NONCE_TOO_LOW;
            }
            
            if (!Crypto.verifySignature(<SignatureType>utx.signature.signature, transfer.toU8a(), from)) {
                Log.error("Validation error: Invalid signature");
                return ResponseCodes.INVALID_SIGNATURE;
            }
            return utx.validate(TransactionSource.External).toU8a();
        }
        return utx.validateUnsigned().valid ? ResponseCodes.SUCCESS : ResponseCodes.CALL_ERROR;
    }

    /**
     * @description module hook
     */
    export function onFinalize(): void {
        Log.info("onInitialize() called");
    }
}
