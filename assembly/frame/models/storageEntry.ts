import { ByteArray, BytesReader, Codec } from "as-scale-codec";
import { Storage, Utils } from "subsembly-core";

/**
 * @description Represents an entry in the Storage
 */
export class StorageEntry<T extends Codec>{
    /**
     * Module prefix
     */
    private prefix: string;

    /**
     * Key name
     */
    private key: string;

    constructor(prefix: string, key: string ){
        this.prefix = prefix;
        this.key = key;
    }
    
    /**
     * @description Returns value mapped to the key, if the value exists in storage
     * If not, returns new instance of the value.
     * @param suffix suffix to append in the end of key (f.e, for storing balance of account, accountId is appended)
     */
    get(suffix: Codec | null = null): T{
        const value = Storage.get(Utils.stringsToBytes([this.prefix, this.key]).concat(suffix ? suffix.toU8a() : []));
        if(value.isSome()){
            return BytesReader.decodeInto<T>((<ByteArray>value.unwrap()).unwrap());
        }
        return instantiate<T>();
    }
    /**
     * @description Set value in the storage
     * @param value 
     * @param append suffix to append in the end of key (f.e, for storing balance of account, accountId is appended)
     */
    set(value: T, suffix: Codec | null = null): void{
        const key = Utils.stringsToBytes([this.prefix, this.key]).concat(suffix ? suffix.toU8a() : []);
        Storage.set(key, value.toU8a());
    }

    /**
     * @description Clears the entry from storage
     * @param suffix suffix to append in the end of key (f.e, for storing balance of account, accountId is appended)
     */
    clear(suffix: Codec | null = null): void{
        const key = Utils.stringsToBytes([this.prefix, this.key]).concat(suffix ? suffix.toU8a() : []);
        Storage.clear(key);
    }

    /**
     * @description Retrieves value and gets rid of the entry in the storage
     * @param suffix suffix to append in the end of key (f.e, for storing balance of account, accountId is appended)
     */
    take(suffix: Codec | null = null): T{
        const value = Storage.take(Utils.stringsToBytes([this.prefix, this.key]).concat(suffix ? suffix.toU8a() : []));
        return value.length ? BytesReader.decodeInto<T>(value) : instantiate<T>();
    }
}