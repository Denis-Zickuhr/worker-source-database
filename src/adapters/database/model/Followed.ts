export enum FollowedStatus {
    never_synced = 0,
    synced = 1,
    errored = 2,
}

export type Followed = {
    _id: string
    name: string,
    entry_id: string,
    source: string,
    sync_rate: number|undefined,
    last_sync: null|Date,
    last_status: FollowedStatus,
}