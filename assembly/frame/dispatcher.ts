import { BytesReader } from "as-scale-codec";
import { AccountId, Call, ResponseCodes } from "subsembly-core";
import { Aura, Balances } from "../pallets";
import { Balance } from "../runtime";

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
                }
            }
            case Pallets.Balances: {
                switch(call.callIndex[1]) {
                    case BalancesCalls.setBalance: {
                        const bytesReader = new BytesReader(call.args);
                        const accountId = bytesReader.readInto<AccountId>();
                        const freeBalance = bytesReader.readInto<Balance>();
                        const reservedBalance = bytesReader.readInto<Balance>();
                        Balances.setBalance(accountId, freeBalance, reservedBalance);
                        return ResponseCodes.SUCCESS;
                    }
                }
            }
        }
    }
}