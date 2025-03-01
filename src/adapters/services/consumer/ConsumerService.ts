import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import logger from "../../logger/ConsoleLogger";
import {IFollowedSyncService, ProducerOptions} from "../types";
import {IAmpqClient} from "../../ampq/types";
import {ConsumeMessage} from "amqplib";

@injectable()
export class ConsumerService {

    constructor(
        @inject(Reference.ConsoleLogger) private logger: logger,
        @inject(Reference.IFollowedSyncDataService) private service: IFollowedSyncService,
        @inject(Reference.IAmpqClient) private ampq: IAmpqClient,
    ) {
    }

    async run(options: ProducerOptions) {
        const opts = { queue: options.service.options.value };

        const callback = async (msg: ConsumeMessage|null) => {
            try {
                if (msg) {
                    await this.service.sync(msg);
                }
            } catch (error) {
                this.logger.error(JSON.stringify(error).replace(/\n/g, ''));
            }
        }

        this.ampq.consume(opts, callback);
    }
}