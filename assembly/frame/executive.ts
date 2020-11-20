import { Bool, BytesReader, CompactInt, Hash, UInt64 } from 'as-scale-codec';
import {
    Crypto, ExtrinsicType, IBlock, IExtrinsic, IHeader,
    IInherent, IInherentData, ISignedTransaction,
    Log, ResponseCodes, TransactionTag, Utils, ValidTransaction
} from 'subsembly-core';
import { Aura, Balances, Timestamp } from '../pallets';
import {
    AccountIdType, BlockNumber, HeaderType,
    InherentType, NonceType, SignatureType, SignedTransactionType
} from '../runtime/runtime';
import { System } from './system';


/**
 * @description Acts as the orchestration layer for the runtime.
 * It dispatches incoming extrinsic calls to the respective pallets in the runtime.
 */
export namespace Executive{
    /**
     * @description Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: IHeader): void{
        System.initialize(header);
    }

    /**
     * @description Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: IBlock): void{
        let header = <HeaderType>block.getHeader();
        let n: BlockNumber = <BlockNumber>header.getNumber();
        // check that parentHash is valid
        const previousBlock: BlockNumber = instantiate<BlockNumber>(n.value - 1);
        const parentHash: Hash = System.getHashAtBlock(previousBlock);

        if(n == instantiate<BlockNumber>(0) && parentHash != header.getParentHash()){
            Log.error("Initial checks: Parent hash should be valid.");
            throw new Error("Executive: Initial checks for block execution failed");
        }
    }

    /**
     * @description Final checks before including block in the chain
     * @param header 
     */
    export function finalChecks(header: IHeader): void{
        System.computeExtrinsicsRoot();
        let newHeader = System.finalize();
        let storageRoot = newHeader.getStateRoot();
        if(header.getStateRoot() != storageRoot){
            Log.error("Storage root must match that calculated");
            throw new Error("Executive: Final checks for block execution failed");
        }
    }

    /**
     * @description Actually execute all transactions for Block
     * @param block Block instance
     */
    export function executeBlock(block: IBlock): void{
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
        System.noteFinishedExtrinsics();
        System.computeExtrinsicsRoot();
        return System.finalize();
    }
    /**
     * @description creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: IInherentData): u8[] {
        const timestamp: InherentType = Timestamp.createInherent(data);
        const aura = Aura.createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * @description Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = BytesReader.decodeInto<CompactInt>(ext);
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen.value as u32);
        // if applying extrinsic succeeded, notify System about it
        if(Utils.areArraysEqual(result, ResponseCodes.SUCCESS)){
            System.noteAppliedExtrinsic(ext);
        }
        return result;
    }
    
    /**
     * @description Orchestrating function for applying extrinsic
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: u8[], encodedLen: u32): u8[]{
        switch(encodedLen){
            case ExtrinsicType.Inherent:{
                const inherent: IInherent = BytesReader.decodeInto<InherentType>(ext);
                return Timestamp.applyInherent(<InherentType>inherent)
            }
            case ExtrinsicType.SignedTransaction:{
                const signedTransaction: IExtrinsic = BytesReader.decodeInto<SignedTransactionType>(ext);
                return Balances.applyExtrinsic(<SignedTransactionType>signedTransaction);
            }
            default:{
                return ResponseCodes.CALL_ERROR;
            }
        }
    }

    /**
     * @description Execute given extrinsics and take care of post-extrinsics book-keeping
     * @param extrinsics byte array of extrinsics 
     */
    export function executeExtrinsicsWithBookKeeping(extrinsics: IExtrinsic[]): void{
        for(let i=0; i<extrinsics.length; i++){
            Executive.applyExtrinsic(extrinsics[i].toU8a());
        }
        System.noteFinishedExtrinsics();
    }

    /**
     * @description Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(utx: ISignedTransaction): u8[] {
        const from: AccountIdType = BytesReader.decodeInto<AccountIdType>(utx.getFrom().toU8a());
        const transfer = utx.getTransferBytes();

        if(!Crypto.verifySignature(<SignatureType>utx.getSignature(), transfer, from)){
            Log.error("Validation error: Invalid signature");
            return ResponseCodes.INVALID_SIGNATURE;
        }   
        const nonce = System.accountNonce(from);
        if (nonce.value >= (<NonceType>utx.getNonce()).value){
            Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
            return ResponseCodes.NONCE_TOO_LOW;
        }
        const validated = Balances.validateTransaction(<ISignedTransaction>utx);
        if(!validated.valid){
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
     * @description module hook
     */
    export function onFinalize(): void{
        Log.info("onInitialize() called");
    }
}
