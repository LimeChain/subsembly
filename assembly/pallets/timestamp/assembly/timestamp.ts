import { Storage, Log, IInherent } from 'subsembly-core';
import { InherentData, Inherent, ResponseCodes } from 'subsembly-core';
import { Utils } from "subsembly-core";
import { UInt64, Bool, ByteArray } from 'as-scale-codec';

export class Timestamp{

    /**
     * Minimum period between timestamps
     */
    public static readonly MINIMUM_PERIOD: u64 = 5000;
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
     * Toggles the current value of didUpdate
     */
    static toggleUpdate(): void {
        const didUpdate = Storage.get(Timestamp.SCALE_TIMESTAMP_DID_UPDATE);
        const didUpdateValue: Bool = didUpdate.isSome() ? Bool.fromU8a((<ByteArray>didUpdate.unwrap()).values) : new Bool(false);
        if(didUpdateValue.value){
            const falseu8 = new Bool(false);
            Storage.set(Timestamp.SCALE_TIMESTAMP_DID_UPDATE, falseu8.toU8a());
        }
        else{
            const trueu8 = new Bool(true);
            Storage.set(Timestamp.SCALE_TIMESTAMP_DID_UPDATE, trueu8.toU8a());
        }
    }

    /**
     * Sets the current time. When setting the new time, 
     * it must be greater than the last one (set into storage) with at least a MinimumPeriod
     * @param now timestamp number
     */
    static set(now: u64): u8[] {
        const didUpdate = Storage.get(Timestamp.SCALE_TIMESTAMP_DID_UPDATE);
        const didUpdateValue: Bool = didUpdate.isSome() ? Bool.fromU8a((<ByteArray>didUpdate.unwrap()).values) : new Bool(false);
        if(didUpdateValue.value){
            Log.error('Validation error: Timestamp must be updated only once in the block');
            return this._tooFrequentResponseCode();
        }
        const prev: UInt64 = Timestamp.get();
        if(now < prev.value + Timestamp.MINIMUM_PERIOD){
            Log.error('Validation error: Timestamp must increment by at least <MinimumPeriod> between sequential blocks');
            return this._timeframeTooLowResponceCode();
        }

        const nowu8 = new UInt64(now);
        const trueu8 = new Bool(true);
        Storage.set(Timestamp.SCALE_TIMESTAMP_DID_UPDATE, trueu8.toU8a());
        Storage.set(Timestamp.SCALE_TIMESTAMP_NOW, nowu8.toU8a());
        return ResponseCodes.SUCCESS;
    }

    /**
     *  Gets the current time that was set. If this function is called prior 
     *  to setting the timestamp, it will return the timestamp of the previous block.
     */
    static get(): UInt64 {
        const now = Storage.get(Timestamp.SCALE_TIMESTAMP_NOW);
        return now.isSome() ? UInt64.fromU8a((<ByteArray>now.unwrap()).values) : new UInt64(0);
    }

    /**
     * Creates timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static createInherent(data: InherentData): IInherent {
        const timestampData: UInt64 = UInt64.fromU8a(extractInherentData(data).values);
        let nextTime = timestampData;
        if(Timestamp.get().value){
            let nextTimeValue = <u64>(Math.max(<f64>timestampData.value, <f64>(Timestamp.get().value + Timestamp.MINIMUM_PERIOD)));
            nextTime = new UInt64(nextTimeValue);
        }
        const inherent = new Inherent(
            Timestamp.CALL_INDEX, 
            Timestamp.API_VERSION, 
            Timestamp.PREFIX,
            nextTime
        );
        return inherent;
    }

    /**
     * Checks if the new value can be set as inherent data
     * @param t new value of the timestamp inherent data
     * @param data inherent data to extract timestamp from
     */
    static checkInherent(t: u64, data: InherentData): bool {
        const MAX_TIMESTAMP_DRIFT_MILLS: u64 = 30 * 1000;
        const timestampData: UInt64 = UInt64.fromU8a(extractInherentData(data).values);
        const minimum: u64 = Timestamp.get().value + Timestamp.MINIMUM_PERIOD;
        if (t > timestampData.value + MAX_TIMESTAMP_DRIFT_MILLS){
            return false;
        }
        else if(t < minimum){
            return false;
        }
        else{
            return true;
        }
    }

    /**
     * 
     * @param inherent 
     */
    static applyInherent(inherent: IInherent): u8[] {
        const resCode = Timestamp.set((<UInt64>inherent.getArgument()).value);
        if(Utils.areArraysEqual(resCode, ResponseCodes.SUCCESS)){
            Timestamp.toggleUpdate();
        }
        return resCode;
    }

    static _tooFrequentResponseCode(): u8[]{
        return ResponseCodes.dispatchError(this.MODULE_INDEX, 1);
    }
    static _timeframeTooLowResponceCode(): u8[]{
        return ResponseCodes.dispatchError(this.MODULE_INDEX, 2);
    }
}
 
/**
 * Gets timestamp inherent data
 * @param inhData inherentData instance provided 
 */
export function extractInherentData(inhData: InherentData): ByteArray {
    return inhData.data.get(Timestamp.INHERENT_IDENTIFIER);
}