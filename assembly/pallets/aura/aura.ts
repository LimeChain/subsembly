import { ByteArray, BytesReader } from 'as-scale-codec';
import { InherentData, Storage } from "subsembly-core";
import { Moment, TimestampConfig } from '../../runtime/runtime';

/**
 * Storage entries for Aura module
 */
export namespace AuraStorageEntries {
};

/**
 * @description Aura provides a slot-based block authoring mechanism. 
 * In Aura a known set of authorities take turns producing blocks.
 */
export class Aura {
    /**
     * Scale encoded key {scale("aura")}{scale("authorities"}
     * Key for the AuraInherentData
     */
    public static readonly AURA_AUTHORITIES: u8[] = [16, 97, 117, 114, 97, 44, 97, 117, 116, 104, 111, 114, 105, 116, 105, 101, 115];
    public static readonly INHERENT_IDENTIFIER: string = "auraslot";

    /**
     * @description Calls the TimeStamp module and returns configured min period.
     */
    static getSlotDuration(): Moment {
        return TimestampConfig.minimumPeriod();
    }

    /**
     * @description Reads from the Storage the authorities that 
     * were set on genesis, creates a vector of AccountIds and return it
     */
    static getAuthorities(): u8[] {
        const authorities = Storage.get(Aura.AURA_AUTHORITIES);
        return authorities.isSome() ? (<ByteArray>authorities.unwrap()).unwrap() : [];
    }
    /**
     * @description Sets the list of AccountIds to the storage
     * @param auths SCALE encoded list of authorities
     */
    static _setAuthorities(auths: u8[]): void {
        Storage.set(Aura.AURA_AUTHORITIES, auths);
    }

    /**
     * @description Creates Aura inherent
     * NOTE: Draft implementation
     * @param data Inherent data
     */
    static _createInherent(data: InherentData<ByteArray>): u8[] {
        return [];
    }

    /**
     * @description Verify the validity of the inherent using the timestamp.
     * @param t new value for the timestamp inherent data
     * @param data inherent data to extract aura inherent data from
     */
    static _checkInherent(t: Moment, data: InherentData<ByteArray>): bool {
        const auraSlot = Aura._extractAuraInherentData(data);
        const timestampBasedSlot: Moment = instantiate<Moment>(t.unwrap() / Aura.getSlotDuration().unwrap());
        if (timestampBasedSlot == auraSlot) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @description Gets timestamp inherent data
     * @param inhData 
     */
    static _extractAuraInherentData(inhData: InherentData<ByteArray>): Moment {
        const value = inhData.getData().get(Aura.INHERENT_IDENTIFIER);
        return BytesReader.decodeInto<Moment>(value.unwrap());
    }
}