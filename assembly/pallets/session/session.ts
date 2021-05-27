import { Bool, ByteArray } from "as-scale-codec";
import { StorageEntry } from "./assembly/frame";
import { BlockNumber, SessionIndex, ValidatorId } from "./assembly/runtime";

export namespace SessionStorageEntries {
    /**
     * @description List of validators
     */
    export function validators(): StorageEntry<ByteArray> {
        return new StorageEntry<ByteArray>("Session", "Validators");
    }
    /**
     * @description List of validators
     */
    export function disabledValidators(): StorageEntry<ByteArray> {
        return new StorageEntry<ByteArray>("Session", "DisabledValidators");
    }
    /**
     * @description List of validators
     */
    export function QueuedChanged() : StorageEntry<Bool> {
        return new StorageEntry<Bool>("Session", "QueuedChanged");
    }
    /**
     * @description List of validators
     * @storage_map AccountId
     */
    export function keyOwner(): StorageEntry<BlockNumber> {
        return new StorageEntry<BlockNumber>("Session", "KeyOwner");
    }
    /**
     * @description List of validators
     * @storage_map AccountId
     */
    export function nextKeys(): StorageEntry<ByteArray> {
        return new StorageEntry<ByteArray>("Session", "NextKeys");
    }
    /**
     * @description List of validators
     */
    export function currentIndex(): StorageEntry<SessionIndex> {
        return new StorageEntry<SessionIndex>("Session", "CurrentIndex");
    }
    /**
     * @description List of validators
     */
    export function QueuedKeys(): StorageEntry<ByteArray> {
        return new StorageEntry<ByteArray>("Session", "QueuedKeys");
    }
}

/**
 * @description The Timestamp pallet provides functionality to get and set the on-chain time.
 */
export class Session {
    /**
     * @description Rotate session
     */
    static _rotateSession(): void {
        let sessionIndex: SessionIndex = SessionStorageEntries.currentIndex().get();
        let changed = SessionStorageEntries.QueuedChanged().get();
        
        Session._onBeforeSessionEnding();
        Session._endSession(sessionIndex);

        let keys = SessionStorageEntries.QueuedKeys().get();
        SessionStorageEntries.validators().set(keys);

        if (changed) {
            SessionStorageEntries.disabledValidators().take();
        }
        
        sessionIndex = instantiate<SessionIndex>(sessionIndex.unwrap() + 1);
        SessionStorageEntries.currentIndex().set(sessionIndex);

        Session._startSession(sessionIndex);

        const maybeNextValidators = Session._newSession(instantiate<SessionIndex>(sessionIndex.unwrap() + 1));
        const nextValidators = validators || [];
        const identitiesChanged = maybeNextValidators ? true : false;
        
        changed = instantiate<Bool>(identitiesChanged);
        let nowSessionKeys = keys;
        let queuedAmalgamated = [];
        if(changed){

        }
    }
    static _onBeforeSessionEnding() : void {

    }

    static _endSession(index: SessionIndex): void {

    }

    static _startSession(index: SessionIndex): void {

    }

    static _newSession(index: SessionIndex): u8[] {

    }

    static _loadKeys(v: ValidatorId): u8[] {

    }
}