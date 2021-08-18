import {Log} from "subsembly-core";
import {SessionManager} from "../../pallets";

export class Hooks {
    /**
     * @description Executed after the block initialization
     */
    static _on_block_initialize(): void {
        Log.info("New block initialized");
        SessionManager._run();
    }

    /**
     * @description Executed after the block has been finalised
     */
    static _on_block_finalize(): void {}

    /**
     * @description Executed in the first block of the session
     */
    static _on_session_start(): void {
        Log.info('New Session started');
    }

    /**
     * @description Executed in the last block of the session
     */
    static _on_session_end(): void {}
}