import {DocumentWithId} from "../repository/types";

type FollowedDataHistory = {
    timestamp: number,
    value: number,
}

export type FollowedData = {
    name: string,
    value: number,
    h_value: number,
    l_value: number,
    history: FollowedDataHistory[]
} & DocumentWithId
