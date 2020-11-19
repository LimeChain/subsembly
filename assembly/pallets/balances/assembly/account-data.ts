import { BytesReader } from "as-scale-codec";
import { DecodedData, IAccountData } from "subsembly-core";
import { Balance } from '../../../runtime/runtime';

/**
 * @description Class representing balance information for a given account 
 */
export class AccountData implements IAccountData {

    /**
     * Non-reserved part of the balance. It is the total pool what may in principle be transferred and reserved.
     */
    private free: Balance;

    /**
     * Balance which is reserved and may not be used at all.
     */
    private reserved: Balance;

    constructor(free: Balance = instantiate<Balance>(), reserved: Balance = instantiate<Balance>()) {
        this.free = free;
        this.reserved = reserved;
    }

    /**
    * @description SCALE Encodes the AccountData into u8[]
    */
    toU8a(): u8[] {
        return this.free.toU8a()
            .concat(this.reserved.toU8a());
    }

    /**
     * @description Sets new free value
     * @param newFree 
     */
    setFree(newFree: Balance): void {
        this.free = newFree;
    }

    /**
     * @description Sets new reserved value
     * @param newReserved
     */
    setReserved(newReserved: Balance): void {
        this.reserved = newReserved;
    }

    /**
     * @description Returns the free value
     */
    getFree(): Balance {
        return this.free;
    }

    /**
     * @description Returns the reserved value
     */
    getReserved(): Balance {
        return this.reserved;
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this.setFree(bytesReader.readInto<Balance>());
        this.setReserved(bytesReader.readInto<Balance>());
    }

    /**
     * @description Returns encoded byte length
     */
    encodedLength(): i32 {
        return this.free.encodedLength() + this.reserved.encodedLength();
    }

    /**
     * @description Instanciates new AccountData object from SCALE encoded byte array
     * @param input - SCALE encoded AccountData
     * @param index - index to start decoding from
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<AccountData> {
        const bytesReader = new BytesReader(input.slice(index));

        const free = bytesReader.readInto<Balance>();
        const reserved = bytesReader.readInto<Balance>();

        const result = new AccountData(free, reserved);
        return new DecodedData<AccountData>(result, bytesReader.getLeftoverBytes());
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    @inline @operator('==')
    static eq(a: AccountData, b: AccountData): bool {
        return a.free == b.free && a.reserved == b.reserved;
    }
    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    @inline @operator('!=')
    static notEq(a: AccountData, b: AccountData): bool {
        return !AccountData.eq(a, b);
    }
}