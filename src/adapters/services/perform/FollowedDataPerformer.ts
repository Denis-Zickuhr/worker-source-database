import {inject, injectable} from "inversify";
import {IFollowedDataPerformer, PerformanceResult} from "./types";
import {Followed} from "../../database/model/Followed";
import {Reference} from "../../../types";
import ConsoleLogger from "../../logger/ConsoleLogger";

@injectable()
export class FollowedDataPerformer implements IFollowedDataPerformer {

    constructor(
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
    }

    async perform(followed: Followed): Promise<PerformanceResult> {
        try{
            // Todo invocar scrapper
            this.logger.info(`followedDataPerformer successfully performed (value ${0})`);
            return {
                success: true,
                value: Math.floor(Math.random() * (1000 - 200 + 1) + 200),
            }
        } catch(err: any) {
            this.logger.error(err.message);
            return {
                success: false,
                detail: err.message,
            }
        }
    }

}