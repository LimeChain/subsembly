import { Bool, ByteArray, BytesReader } from 'as-scale-codec';
import { InherentData, Log, ResponseCodes, Utils } from 'subsembly-core';
import { StorageEntry } from '../../../frame';
import { InherentType, Moment, TimestampConfig } from '../../../runtime/runtime';
export namespace TimestampStorageEntries{
    export function Now(): StorageEntry<Moment>{
        return new StorageEntry<Moment>("Timestamp", "Now");
    };
    
    export function DidUpdate(): StorageEntry<Bool>{
        return new StorageEntry<Bool>("Timestamp", "DidUpdate");  
    };
};

/**
 * @description The Timestamp pallet provides functionality to get and set the on-chain time.
 */
export class Timestamp {
    /**
     * Scale encoded key {scale("timestamp")}{scale("now")} 
     * Scale encoded key {scale("timestamp")}{scale("didupdate")} 
     */
    public static readonly SCALE_TIMESTAMP_NOW: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 12, 110, 111, 119];
    public static readonly SCALE_TIMESTAMP_DID_UPDATE: u8[] = [36, 116, 105, 109, 101, 115, 116, 97, 109, 112, 36, 100, 105, 100, 117, 112, 100, 97, 116, 101];
    public static readonly INHERENT_IDENTIFIER: string = "timstap0";

    /**
     * Call index for timestamp inherent
     */
    public static readonly CALL_INDEX: u8[] = [2, 0];
    /**
     * Runtime API version
     */
    public static readonly API_VERSION: u8 = 4;
    /**
     * Module prefix
     */
    public static readonly PREFIX: u8 = 11;

    /**
     * index of the timestamp module
     */
    public static readonly MODULE_INDEX: u8 = 1;

    /**
     * @description Toggles the current value of didUpdate
     */
    static _toggleUpdate(): void {
        const value = TimestampStorageEntries.DidUpdate().get();
        TimestampStorageEntries.DidUpdate().set(new Bool(!(value.unwrap())));
    }

    /**
     * @description Sets the current time. When setting the new time, 
     * it must be greater than the last one (set into storage) with at least a MinimumPeriod
     * @param now timestamp number
     */
    static set(now: Moment): u8[] {
        const didUpdate = TimestampStorageEntries.DidUpdate().get();
        if (didUpdate.unwrap()) {
            Log.error('Validation error: Timestamp must be updated only once in the block');
            return this._tooFrequentResponseCode();
        }
        let minValue = TimestampStorageEntries.Now().get().unwrap() + TimestampConfig.minimumPeriod().unwrap();
        if (now.unwrap() < minValue) {
            Log.error('Validation error: Timestamp must increment by at least <MinimumPeriod> between sequential blocks');
            return this._timeframeTooLowResponceCode();
        }

        TimestampStorageEntries.DidUpdate().set(new Bool(true));
        TimestampStorageEntries.Now().set(now);

        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Creates timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static _createInherent(data: InherentData<ByteArray>): InherentType {
        const timestampData: Moment = BytesReader.decodeInto<Moment>(this._extractInherentData(data).unwrap());
        let nextTime = timestampData;

        const now = TimestampStorageEntries.Now().get();
        if (now.unwrap()) {
            let nextTimeValue = timestampData.unwrap() > now.unwrap() + TimestampConfig.minimumPeriod().unwrap()
                ? timestampData.unwrap() : now.unwrap() + TimestampConfig.minimumPeriod().unwrap();

            nextTime = instantiate<Moment>(nextTimeValue);
        }
        const inherent = instantiate<InherentType>(
            Timestamp.CALL_INDEX,
            Timestamp.API_VERSION,
            Timestamp.PREFIX,
            nextTime
        );
        return inherent;
    }

    /**
     * @description Checks if the new value can be set as inherent data
     * @param t new value of the timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static _checkInherent(t: Moment, data: InherentData<ByteArray>): bool {
        const MAX_TIMESTAMP_DRIFT_MILLS: Moment = instantiate<Moment>(30 * 1000);
        const timestampData: Moment = BytesReader.decodeInto<Moment>(this._extractInherentData(data).unwrap());
        const minimum: Moment = instantiate<Moment>(TimestampStorageEntries.Now().get().unwrap() + TimestampConfig.minimumPeriod().unwrap());
        if (t.unwrap() > timestampData.unwrap() + MAX_TIMESTAMP_DRIFT_MILLS.unwrap()) {
            return false;
        }
        else if (t.unwrap() < minimum.unwrap()) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * @description Applies given inherent
     * @param inherent 
     */
    static _applyInherent(inherent: InherentType): u8[] {
        const resCode = Timestamp.set((<Moment>inherent.getArgument()));
        if (Utils.areArraysEqual(resCode, ResponseCodes.SUCCESS)) {
            Timestamp._toggleUpdate();
        }
        return resCode;
    }

    /**
     * @description Construct too frequent response error
     */
    static _tooFrequentResponseCode(): u8[] {
        return ResponseCodes.dispatchError(this.MODULE_INDEX, 1);
    }

    /**
     * @description Construct too low response error
     */
    static _timeframeTooLowResponceCode(): u8[] {
        return ResponseCodes.dispatchError(this.MODULE_INDEX, 2);
    }

    /**
     * @description Gets timestamp inherent data
     * @param inhData inherentData instance provided 
     */
    static _extractInherentData(inhData: InherentData<ByteArray>): ByteArray {
        return inhData.getData().get(Timestamp.INHERENT_IDENTIFIER);
    }
}