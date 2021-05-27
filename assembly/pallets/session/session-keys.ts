import { BytesReader, Codec, CompactInt, UInt32 } from "as-scale-codec";
import { AccountId, ext_crypto_sr25519_generate_version_1, Serialiser, Utils, Crypto, SignatureTypes } from "subsembly-core";
import { SessionConfig } from "../../runtime";

export class SessionKey implements Codec {
    private _id: AccountId;
    private _keyTypeId: UInt32;

    constructor(id: AccountId, keyTypeId: UInt32) {
        this._id = id;
        this._keyTypeId = keyTypeId;
    }

    get id(): AccountId {
        return this._id;
    }
    get keyTypeId(): UInt32 {
        return this._keyTypeId;
    }

    toU8a(): u8[] {
        return this._id.toU8a().concat(this._keyTypeId.toU8a());
    }

    encodedLength(): i32 {
        return this._id.encodedLength() + this._keyTypeId.encodedLength();
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._id = bytesReader.readInto<AccountId>();
        this._keyTypeId = bytesReader.readInto<UInt32>();
    }

    eq(other: SessionKey): bool {
        return this._id.eq(other.id) && this._keyTypeId.eq(other.keyTypeId);
    }

    notEq(other: SessionKey): bool {
        return !this.eq(other);
    }
}

/**
 * @description "hot keys" that are used by validators to sign consensus-related messages.
 */
export class SessionKeys {
    /**
     * @description Generate a set of keys with optionally using the given seed.
     * @param seed optional seed
     * @returns the concatenated SCALE encoded public keys. 
     */
    static generate(seed: u8[]): u8[] {
        let keys: u8[] = (new CompactInt(SessionConfig.keyTypeIds.length)).toU8a();
        for (let i: i32 = 0; i < SessionConfig.keyTypeIds.length; i++) {
            const type: SignatureTypes = SessionConfig.keyTypeIds[i] == 'gran' ? SignatureTypes.ed25519 : SignatureTypes.sr25519;
            const key = Crypto.generate(SessionConfig.keyTypeIds[i], seed, type);
            keys = keys.concat(key);
        }
        return keys;
    }

    /**
     * @description 0\Decode `Self` from the given `encoded` slice and convert `Self` into the raw public keys
     * @param encoded encoded list of raw public keys to decode
     * @returns None if decoding fails, Option<T>(_) otherwise
     */
    static decodeIntoRawPublicKeys(encoded: u8[]): SessionKey[] {
        const bytesReader = new BytesReader(encoded);
        const len = bytesReader.readInto<CompactInt>();
        const keys: SessionKey[] = [];
        for (let i: i32 = 0; i < len.unwrap(); i++) {
            const sessionKey = bytesReader.readInto<SessionKey>();
            keys.push(sessionKey);
        }
        return keys;
    }
}