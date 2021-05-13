import { ByteArray } from "as-scale-codec";
import { AccountData, Storage, Utils } from "subsembly-core";
import { StorageEntry } from "../../frame";
import { Balance, BlockNumber } from "../../runtime";

export namespace GrandpaStorageEntries{
    /**
     * @description Stores information about accountId
     * @storage_map AccountId
     */
    export function Account(): StorageEntry<AccountData<Balance>>{
        return new StorageEntry<AccountData<Balance>>("Balances", "Account");
    }
}

export class Grandpa {
    // static _onFinalize(blockNumber: BlockNumber): void {
        
    // }
    static readonly GRANDPA_AUTHORITIES_KEY = ':grandpa_authorities';

    static grandpaAuthorities(): u8[] {
        const authU8a = Storage.get(Utils.stringsToBytes([this.GRANDPA_AUTHORITIES_KEY]));
        if(authU8a.isSome()){
            return ((<ByteArray>authU8a.unwrap()).unwrap());
        }
        return [];
    }

    static setGrandpaAuthorities(): void  {
        
    }
}