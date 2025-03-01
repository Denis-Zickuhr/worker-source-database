import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import logger from "../../logger/ConsoleLogger";
import {IFollowedService, ProducerOptions} from "../types";
import {IAmpqClient} from "../../ampq/types";

@injectable()
export class ProducerService {

    constructor(
        @inject(Reference.ConsoleLogger) private logger: logger,
        @inject(Reference.IFollowedService) private followedService: IFollowedService,
        @inject(Reference.IAmpqClient) private ampq: IAmpqClient,
    ) {
    }

    async run(options: ProducerOptions) {
        this.logger.info("Started syncing...");

        for await (const entry of this.followedService.paginatePending()) {
            const message = JSON.stringify(entry);
            await this.ampq.produce(options.service.options.value, message).then(() => {
                this.logger.info(`Entry ${entry._id} sent to queue ${options.service.options.value} for processing`);
            })
        }

        this.logger.info("Syncing done...");
    }
}