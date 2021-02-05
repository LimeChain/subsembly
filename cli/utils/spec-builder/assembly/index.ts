import { BytesReader, CompactInt, UInt64 } from 'as-scale-codec';
import { AccountData, AccountId, Utils } from 'subsembly-core';

// Note: Until we fix the issue with UInt128, fixed Balance type is UInt64
export type Balance = UInt64;

/**
 * Gets the AccountData converted to the bytes
 * @param freeBalance free balance for the AccountData
 */
export function getAccountDataBytes(freeBalance: u64): u8[] {
  const accData = new AccountData<Balance>(instantiate<Balance>(freeBalance), instantiate<Balance>(0));
  return accData.toU8a();
}

/**
 * 
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

export const UInt8Array_ID = idof<Uint8Array>();