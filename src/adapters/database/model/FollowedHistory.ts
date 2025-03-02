import {DocumentWithId} from "../repository/types";

export type FollowedHistory = {
    followed_id: string,
    timestamp: number,
    value: number,
    error: boolean,
} & DocumentWithId;