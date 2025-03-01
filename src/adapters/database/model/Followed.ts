import {DocumentWithId} from "../repository/types";

export enum FollowedStatus {
    never_synced = 0,
    synced = 1,
    errored = 2,
}

export type Followed = {
    name: string,
    entry_id: string,
    source: string,
    sync_rate: number|undefined,
    last_sync: null|Date,
    last_status: FollowedStatus,
} & DocumentWithId