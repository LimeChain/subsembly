import { u128 } from 'as-bignum';
import { BytesReader, CompactInt, UInt128 } from 'as-scale-codec';
import { AccountData, AccountId, Utils } from 'subsembly-core';

export type Balance = UInt128;

/**
 * @description Gets the AccountData converted to the bytes
 * @param freeBalance free balance for the AccountData
 */
export function getAccountDataBytes(freeBalance: Uint8Array): u8[] {
  const balance = BytesReader.decodeInto<Balance>(Utils.toU8Array(freeBalance));
  const accData = new AccountData<Balance>(balance, instantiate<Balance>(u128.Zero));
  return accData.toU8a();
}

/**
 * @description Get bytes as AccountID
 * @param authorities list of authorities in bytes
 */
export function getAccountIdBytes(authorities: Uint8Array): u8[] {
  let input = Utils.toU8Array(authorities);
  let auths: u8[] = [];
  let bytesReader = new BytesReader(input);
  let counter = 0;
  
  while (bytesReader.getLeftoverBytes().length != 0){
    let accId = bytesReader.readInto<AccountId>();
    auths = auths.concat(accId.getAddress());
    counter += 1;
  }

  let result: u8[] = [];
  const length = new CompactInt(counter);
  return result.concat(length.toU8a())
    .concat(auths);
}

/**
 * @description Encode string
 * @param str value
 * @param scale SCALE encoded if true
 */
export function stringToU8a(str: string, scale: bool): u8[] {
  return Utils.stringsToBytes([str], scale);
}

export const UInt8Array_ID = idof<Uint8Array>();