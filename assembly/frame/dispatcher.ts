import { BytesReader } from "as-scale-codec";
import { AccountId, Call, ResponseCodes } from "subsembly-core";
import { Aura, Balances, Timestamp } from "../pallets";
import { Balance, Moment } from "../runtime";

export enum Pallets {
    System = 0, 
    Aura = 1, 
    Balances = 2, 
    Timestamp = 3, 
    FeeCalculator = 4
}

enum AuraCalls {
    getSlotDuration = 0, 
    getAuthorities = 1
}

enum BalancesCalls {
    setBalance = 0, 
    transfer = 1, 
    withdraw = 2
}

enum TimestampCalls {
    set = 0
}
export namespace Dispatcher {
    export function dispatch(call: Call): u8[] {
        switch(call.callIndex[0]) {
            case Pallets.Aura: {
                switch(call.callIndex[1]) {
                    case AuraCalls.getSlotDuration: {
                        
                        return Aura.getSlotDuration().toU8a();
                    }
                    case AuraCalls.getAuthorities: {
                        
                        return Aura.getAuthorities();
                    }
                    default: {
                        return ResponseCodes.CALL_ERROR
                    }
                }
            }
            case Pallets.Balances: {
                switch(call.callIndex[1]) {
                    case BalancesCalls.setBalance: {
                        let bytesReader = new BytesReader(call.args);
                        const accountId = bytesReader.readInto<AccountId>();
                        const freeBalance = bytesReader.readInto<Balance>();
                        const reservedBalance = bytesReader.readInto<Balance>();
                        Balances.setBalance(accountId, freeBalance, reservedBalance);
                        return ResponseCodes.SUCCESS;
                    }
                    case BalancesCalls.transfer: {
                        let bytesReader = new BytesReader(call.args);
                        const source = bytesReader.readInto<AccountId>();
                        const dest = bytesReader.readInto<AccountId>();
                        const value = bytesReader.readInto<Balance>();
                        Balances.transfer(source, dest, value);
                        return ResponseCodes.SUCCESS;
                    }
                    case BalancesCalls.withdraw: {
                        let bytesReader = new BytesReader(call.args);
                        const who = bytesReader.readInto<AccountId>();
                        const value = bytesReader.readInto<Balance>();
                        Balances.withdraw(who, value);
                        return ResponseCodes.SUCCESS;
                    }
                    default: {
                        return ResponseCodes.CALL_ERROR
                    }
                }
            }
            case Pallets.Timestamp: {
                switch(call.callIndex[1]) {
                    case TimestampCalls.set: {
                        let bytesReader = new BytesReader(call.args);
                        const now = bytesReader.readInto<Moment>();
                        return Timestamp.set(now);
                    }
                    default: {
                        return ResponseCodes.CALL_ERROR
                    }
                }
            }
            default: {
                return ResponseCodes.CALL_ERROR
            }
        }
    }
}