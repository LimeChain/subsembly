import { ByteArray, Hash } from 'as-scale-codec';
import {
    Crypto, InherentData,
    Log, ResponseCodes, SignatureTypes, TransactionSource, Utils
} from 'subsembly-core';
import { Dispatcher } from '../generated/dispatcher';
import { Aura, Timestamp } from '../pallets';
import {
    BlockNumber, BlockType, HeaderType,
    Inherent, RuntimeConfig, SignatureType, UncheckedExtrinsic
} from '../runtime/runtime';
import { System, SystemEvents, SystemStorageEntries } from './system';

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
        const timestamp: Inherent = Timestamp._createInherent(data);
        const aura = Aura._createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * @description Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: UncheckedExtrinsic): u8[] {
        const encodedLen = ext.encodedLength();
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen);
        // if applying extrinsic succeeded, notify System about it
        if (Utils.areArraysEqual(result, ResponseCodes.SUCCESS)) {
            System._noteAppliedExtrinsic(ext); 
        }
        else {
            System._depositEvent(SystemEvents.ExtrinsicFailure, []);
        }
        return result;
    }

    /**
     * @description Orchestrating function for applying extrinsic
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: UncheckedExtrinsic, encodedLen: u32): u8[] {
        return Dispatcher.dispatch(ext);
    }

    /**
     * @description Execute given extrinsics and take care of post-extrinsics book-keeping
     * @param extrinsics byte array of extrinsics 
     */
    export function executeExtrinsicsWithBookKeeping(extrinsics: UncheckedExtrinsic[]): void {
        for (let i = 0; i < extrinsics.length; i++) {
            Executive.applyExtrinsic(extrinsics[i]);
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
            const signedExt = extSignature.signedExtension;
    
            const nonce = SystemStorageEntries.Account().get(from).nonce;
            if (nonce && nonce.unwrap() > signedExt.nonce.unwrap()) {
                Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
                return ResponseCodes.NONCE_TOO_LOW;
            }
            
            const blockNumber = SystemStorageEntries.Number().get();
            const blockHash = SystemStorageEntries.BlockHash().get(instantiate<BlockNumber>(blockNumber.unwrap() - 1));
            const genesisHash = SystemStorageEntries.BlockHash().get(instantiate<BlockNumber>(0));
            const specVersion = RuntimeConfig.runtimeVersion().specVersion;
            const transactionVersion = RuntimeConfig.runtimeVersion().transactionVersion;
            const payload = utx.createPayload(blockHash, genesisHash, specVersion, transactionVersion);
            Log.info("payload: " + Utils.toHexString(payload));
            Log.info("sign: " + Utils.toHexString(extSignature.signature.toU8a()));

            if (!Crypto.verifySignature(<SignatureType>extSignature.signature, payload, from, SignatureTypes.sr25519)) {
                Log.error("Validation error: Invalid signature");
                return ResponseCodes.INVALID_SIGNATURE;
            }
            return utx.validate(TransactionSource.External).toU8a();
        }
        return utx.validateUnsigned().toU8a();
    }

    /**
     * @description module hook
     */
    export function onFinalize(): void {
        Log.info("onInitialize() called");
    }
}