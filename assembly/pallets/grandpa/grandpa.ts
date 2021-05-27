import { ByteArray } from "as-scale-codec";
import { Storage, Utils } from "subsembly-core";

export namespace GrandpaStorageEntries {}

/**
 * @description Class representing GRANDPA module
 */
export class Grandpa {
    static readonly GRANDPA_AUTHORITIES: string = ":grandpa_authorities";

    /**
     * @description Get GRANDPA authorities from the storage
     * @returns concatenated list of Grandpa authorities
     */
    static _authorities(): u8[] {
        const entry = Storage.get(Utils.stringsToBytes([this.GRANDPA_AUTHORITIES], false));
        const auths =  entry.isSome() ? (<ByteArray>entry.unwrap()).unwrap() : [];
        return auths;
    }

    /**
     * @description Set GRANDPA authorities
     * @param auths list of Grandpa authorities
     */
    static _setAuthorities(auths: u8[]): void {
        Storage.set(Utils.stringsToBytes([this.GRANDPA_AUTHORITIES], false), auths);
    }
}