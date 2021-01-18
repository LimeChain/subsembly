import { Bool, ByteArray, BytesReader } from 'as-scale-codec';
import { Call, InherentData, Log, ResponseCodes } from 'subsembly-core';
import { StorageEntry } from '../../frame';
import { Pallets, TimestampCalls } from '../../generated/dispatcher';
import { Inherent, Moment, TimestampConfig } from '../../runtime/runtime';

/**
 * @description Storage entries for Timestamp
 */
export namespace TimestampStorageEntries{
    /**
     * Current set Timestamp value
     */
    export function Now(): StorageEntry<Moment>{
        return new StorageEntry<Moment>("Timestamp", "Now");
    };
    
    /**
     * Checks if Timestamp was updated for current slot
     */
    export function DidUpdate(): StorageEntry<Bool>{
        return new StorageEntry<Bool>("Timestamp", "DidUpdate");  
    };
};

/**
 * @description The Timestamp pallet provides functionality to get and set the on-chain time.
 */
export class Timestamp {
    public static readonly INHERENT_IDENTIFIER: string = "timstap0";
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
        Timestamp._toggleUpdate();
        return ResponseCodes.SUCCESS;
    }

    /**
     * @description Creates timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static _createInherent(data: InherentData<ByteArray>): Inherent {
        const timestampData: Moment = BytesReader.decodeInto<Moment>(this._extractInherentData(data).unwrap());
        let nextTime = timestampData;

        const now = TimestampStorageEntries.Now().get();
        if (now.unwrap()) {
            let nextTimeValue = timestampData.unwrap() > now.unwrap() + TimestampConfig.minimumPeriod().unwrap()
                ? timestampData.unwrap() : now.unwrap() + TimestampConfig.minimumPeriod().unwrap();

            nextTime = instantiate<Moment>(nextTimeValue);
        }
        const call = new Call([<u8>Pallets.Timestamp, <u8>TimestampCalls.set], nextTime.toU8a());
        return instantiate<Inherent>(call);
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
     * @description Construct too frequent response error
     */
    static _tooFrequentResponseCode(): u8[] {
        return ResponseCodes.dispatchError(<u8>Pallets.Timestamp, 1);
    }

    /**
     * @description Construct too low response error
     */
    static _timeframeTooLowResponceCode(): u8[] {
        return ResponseCodes.dispatchError(<u8>Pallets.Timestamp, 2);
    }

    /**
     * @description Gets timestamp inherent data
     * @param inhData inherentData instance provided 
     */
    static _extractInherentData(inhData: InherentData<ByteArray>): ByteArray {
        return inhData.getData().get(Timestamp.INHERENT_IDENTIFIER);
    }
}