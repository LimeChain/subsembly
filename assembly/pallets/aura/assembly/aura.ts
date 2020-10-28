import { Timestamp } from "subsembly-core";
import { Storage } from "subsembly-core";
import { InherentData, Option } from "subsembly-core";
import { ByteArray, UInt64 } from 'as-scale-codec';
import { Moment } from '../../../runtime/runtime';

/**
 * Class for Aura consensus 
 */
export class Aura {
    /**
     * Scale encoded key {scale("aura")}{scale("authorities"}
     * Key for the AuraInherentData
     */
    public static readonly AURA_AUTHORITIES: u8[] = [16, 97, 117, 114, 97, 44, 97, 117, 116, 104, 111, 114, 105, 116, 105, 101, 115];
    public static readonly INHERENT_IDENTIFIER: string = "auraslot";

    /**
     * The function calls the TimeStamp module and returns configured min period.
     */
    static getSlotDuration(): Moment {
        return instantiate<Moment>(Timestamp.MINIMUM_PERIOD);
    }

    /**
     * The function reads from the Storage the authorities that 
     * were set on genesis, creates a vector of AccountIds and return it
     */
    static getAuthorities(): Option<ByteArray> {
        return Storage.get(Aura.AURA_AUTHORITIES);
    }
    /**
     * The function sets the list of AccountIds to the storage
     */ 
    static setAuthorities(auths: u8[]): void {
        Storage.set(Aura.AURA_AUTHORITIES, auths);
    }

    static createInherent(data: InherentData): u8[] {
        // TO-DO meaningful checks
        return [];
    }

    /**
     * Verify the validity of the inherent using the timestamp.
     * @param t new value for the timestamp inherent data
     * @param data inherent data to extract aura inherent data from
     */
    static checkInherent(t: u64, data: InherentData): bool {
        const auraSlot = auraInherentData(data);
        const timestampBasedSlot = t / Aura.getSlotDuration().value;
        if (timestampBasedSlot == auraSlot) {
            return true;
        }
        else{
            return false;
        }
    }
}

/**
 * Gets timestamp inherent data
 * @param inhData 
 */
export function auraInherentData(inhData: InherentData): u64 {
    const value = inhData.data.get(Aura.INHERENT_IDENTIFIER);
    return UInt64.fromU8a(value.values).value;
}