import { ByteArray, BytesReader, Codec } from "as-scale-codec";
import { Storage, Utils } from "subsembly-core";

export class StorageEntry<T extends Codec>{
    private prefix: string;
    private key: string;

    constructor(prefix: string, key: string, value: T | null = null){
        this.prefix = prefix;
        this.key = key;
        Storage.set(Utils.stringsToBytes([prefix, key]), value ? value.toU8a() : []);
    }
    get(): T | null{
        const value = Storage.get(Utils.stringsToBytes([this.prefix, this.key]));
        if(value.isSome()){
            return BytesReader.decodeInto<T>((<ByteArray>value.unwrap()).unwrap());
        }
        return null;
    }
    set(value: T| null): void{
        Storage.set(Utils.stringsToBytes([this.prefix, this.key]), value ? value.toU8a() : []);
    }
}