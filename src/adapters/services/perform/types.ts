import {Followed} from "../../database/model/Followed";

export interface IFollowedDataPerformer {
    perform(followed: Followed): Promise<PerformanceResult>;
}

export type PerformanceResult = {
    success: boolean;
    value?: number;
    detail?: string;
}