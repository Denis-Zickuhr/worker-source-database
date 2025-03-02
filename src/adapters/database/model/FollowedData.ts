import {DocumentWithId} from "../repository/types";

export type FollowedData = {
    name: string,
    value: number,
    h_value: number,
    l_value: number,
} & DocumentWithId
