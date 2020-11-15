import {
    IHeader, IExtrinsic, InherentData, ISignedTransaction,
    Inherent, ValidTransaction, TransactionTag, ResponseCodes,
    ExtrinsicType, Signature, IInherent, SignedTransaction, IBlock,
    Utils, Log, Crypto
} from 'subsembly-core';
import { Timestamp, Aura, Balances } from '../pallets';
import { CompactInt, Bool, UInt64, BytesReader } from 'as-scale-codec';
import { System } from './system';

import { AccountIdType, BlockNumber, NonceType } from '../runtime/runtime';

export namespace Executive {
    /**
     * Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: IHeader): void {
        System.initialize(header);
    }

    /**
     * Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: IBlock): void {
        let header = block.getHeader();
        let n: BlockNumber = header.getNumber();
        // check that parentHash is valid
        const previousBlock: BlockNumber = new CompactInt(n.value - 1);
        const parentHash = System.getHashAtBlock(previousBlock);

        if (n.value == 0 && parentHash != header.getParentHash()) {
            Log.error("Initial checks: Parent hash should be valid.");
            throw new Error("Executive: Initial checks for block execution failed");
        }
    }

    /**
     * Final checks before including block in the chain
     * @param header 
     */
    export function finalChecks(header: IHeader): void {
        System.computeExtrinsicsRoot();
        let newHeader = System.finalize();
        let storageRoot = newHeader.getStateRoot();
        if (header.getStateRoot() != storageRoot) {
            Log.error("Storage root must match that calculated");
            throw new Error("Executive: Final checks for block execution failed");
        }
    }

    /**
     * Actually execute all transactions for Block
     * @param block Block instance
     */
    export function executeBlock(block: IBlock): void {
        Executive.initializeBlock(block.getHeader());
        Executive.initialChecks(block);

        Executive.executeExtrinsicsWithBookKeeping(block.getExtrinsics());
        Executive.finalChecks(block.getHeader());
    }
    /**
     * Finalize the block - it is up the caller to ensure that all header fields are valid
     * except state-root.
     */
    export function finalizeBlock(): IHeader {
        System.noteFinishedExtrinsics();
        System.computeExtrinsicsRoot();
        return System.finalize();
    }
    /**
     * creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: InherentData): u8[] {
        const timestamp = Timestamp.createInherent(data);
        const aura = Aura.createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = BytesReader.decodeInto<CompactInt>(ext);
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen.value as u32);
        // if applying extrinsic succeeded, notify System about it
        if (Utils.areArraysEqual(result, ResponseCodes.SUCCESS)) {
            System.noteAppliedExtrinsic(ext);
        }
        return result;
    }

    /**
     * 
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: u8[], encodedLen: u32): u8[] {
        switch (encodedLen) {
            case ExtrinsicType.Inherent: {
                const inherent: IInherent = BytesReader.decodeInto<Inherent>(ext);
                return Timestamp.applyInherent(inherent)
            }
            case ExtrinsicType.SignedTransaction: {
                const signedTransaction: ISignedTransaction = BytesReader.decodeInto<SignedTransaction>(ext);
                return Balances.applyExtrinsic(signedTransaction);
            }
            default: {
                return ResponseCodes.CALL_ERROR;
            }
        }
    }

    /**
     * Execute given extrinsics and take care of post-extrinsics book-keeping
     * @param extrinsics byte array of extrinsics 
     */
    export function executeExtrinsicsWithBookKeeping(extrinsics: IExtrinsic[]): void {
        for (let i = 0; i < extrinsics.length; i++) {
            Executive.applyExtrinsic(extrinsics[i].toU8a());
        }
        System.noteFinishedExtrinsics();
    }

    /**
     * Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(utx: ISignedTransaction): u8[] {
        const from = BytesReader.decodeInto<AccountIdType>(utx.getFrom().toU8a());
        const transfer = utx.getTransferBytes();
        Log.info("tx bytes: " + transfer.toString());

        Log.info("Signature: " + utx.getSignature().toU8a().toString());
        if (!Crypto.verifySignature(<Signature>utx.getSignature(), transfer, from)) {
            Log.error("Validation error: Invalid signature");
            return ResponseCodes.INVALID_SIGNATURE;
        }
        const nonce = System.accountNonce(from);
        if (<u64>nonce.value >= <u64>(<NonceType>utx.getNonce()).value) {
            Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
            return ResponseCodes.NONCE_TOO_LOW;
        }
        const validated = Balances.validateTransaction(utx);
        if (!validated.valid) {
            Log.error(validated.message);
            return validated.error;
        }

        /**
         * If all the validations are passed, construct validTransaction instance
         */
        const priority: UInt64 = new UInt64(<u64>ExtrinsicType.SignedTransaction);
        const requires: TransactionTag[] = [];
        const provides: TransactionTag[] = [new TransactionTag(from, <UInt64>utx.getNonce())];
        const longevity: UInt64 = new UInt64(64);
        const propogate: Bool = new Bool(true);
        const validTransaction = new ValidTransaction(
            priority,
            requires,
            provides,
            longevity,
            propogate
        );
        return validTransaction.toU8a();
    }

    /**
     * module hooks
     */
    export function onFinalize(): void {
        Log.info("onInitialize() called");
    }
}
