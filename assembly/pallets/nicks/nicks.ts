import { ScaleString } from "as-scale-codec";
import { Log, ResponseCodes } from "subsembly-core";
import { StorageEntry } from "../../frame";
import { Pallets } from "../../generated/dispatcher";
import { AccountIdType, NicksConfig } from "../../runtime";

/**
 * @description Nicks Pallet storage entries
 */
export namespace NicksStorageEntries {
    /**
     * @description Name of AccountId
     * @storage_map AccountId
     */
    export function NameOf(): StorageEntry<ScaleString>{
        return new StorageEntry<ScaleString>("Nicks", "NameOf");
    };
}

/**
 * @description Nicks modules declaration
 */
export class Nicks {
    /**
     * @description Error code for too short name
     */
    static TOO_SHORT_ERROR: u8 = 0;
    /**
     * @description Error code for too long name
     */
    static TOO_LONG_ERROR: u8 = 1;
    /**
     * @description Sets name of the origin
     * @param origin AccountId
     * @param name Name of the account
     * @returns 
     */
    static set_name(origin: AccountIdType, name: ScaleString): u8[] {
        if (name.unwrap().length <= NicksConfig.minLength().unwrap()) {
            Log.error("Nicks: Name too short!");
            return ResponseCodes.dispatchError(Pallets.Nicks, Nicks.TOO_SHORT_ERROR);
        }
        else if(name.unwrap().length >= NicksConfig.maxLength().unwrap()) {
            Log.error("Nicks: Name too long!");
            return ResponseCodes.dispatchError(Pallets.Nicks, Nicks.TOO_LONG_ERROR);
        }
        NicksStorageEntries.NameOf().set(name, origin);
        return ResponseCodes.SUCCESS;
    }
}