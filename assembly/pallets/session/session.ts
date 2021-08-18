import {Log} from "subsembly-core";
import {BlockNumber, SessionConfig, SessionIndex} from "../../runtime";
import {StorageEntry, SystemStorageEntries} from "../../frame";

export namespace SessionStorageEntries {
    /**
     * @description Access session from storage
     */
    export function currentIndex(): StorageEntry<SessionIndex> {
        return new StorageEntry<SessionIndex>("Session", "CurrentIndex");
    }

    /**
     * @description Access block number
     */
    export function currentBlock(): StorageEntry<BlockNumber> {
        return SystemStorageEntries.Number();
    }
}

export class Session extends SessionConfig {
    index: SessionIndex = SessionStorageEntries.currentIndex().get();

    constructor() {
        super();
    }

    start(index: SessionIndex): void {
        SessionStorageEntries.currentIndex().set(index);
    }
}

export class SessionManager {
    static _run(): Session {
        const currentBlock = SessionStorageEntries.currentBlock().get();
        const s = new Session();

        if (currentBlock.unwrap() == 1) {
            s.start(instantiate<SessionIndex>(1));
        }

        const lastSessionBlock = Session.SessionPeriod * s.index.unwrap();

        // if (currentBlock.unwrap() == lastSessionBlock) {
        //     this._on_session_end();
        // }

        if (currentBlock.unwrap() == lastSessionBlock + 1) {
            s.start(instantiate<SessionIndex>(
                s.index.unwrap() + 1
            ));
            //this._on_session_start();
            Log.info('New Session started');
        }
        return s;
    }

    static _on_session_start(): void {

    }

    static _on_session_end(): void {

    }
}