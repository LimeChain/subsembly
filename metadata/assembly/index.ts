import { BytesReader, CompactInt, ScaleString } from 'as-scale-codec';

export function stringEncode(str: string): u8[]{
    const scaleStr = new ScaleString(str);
    return scaleStr.toU8a();
}

export function stringDecode(str: Uint8Array): string{
  // return "nice";
  return BytesReader.decodeInto<ScaleString>(toU8Array(str)).toString();
}

function toU8Array(typedArr: Uint8Array): u8[] {
  let res = new Array<u8>(2);
  for (let i = 0; i < typedArr.length; i++) {
      res[i] = typedArr[i];
  }
  return res;
}

export function cmpToDecimal(cmp: Uint8Array): i32{
    return <i32>(BytesReader.decodeInto<CompactInt>(toU8Array(cmp)).unwrap());
}

export const UInt8Array_ID = idof<Uint8Array>();
