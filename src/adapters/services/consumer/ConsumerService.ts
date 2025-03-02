import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import logger from "../../logger/ConsoleLogger";
import {IFollowedDataSyncService, ProducerOptions} from "../types";
import {IAmpqClient} from "../../ampq/types";
import {ConsumeMessage} from "amqplib";
import {IConsumeOptions} from "../../ampq/client/rabbitmq/types";

@injectable()
export class ConsumerService {

    constructor(
        @inject(Reference.ConsoleLogger) private logger: logger,
        @inject(Reference.IFollowedDataSyncService) private service: IFollowedDataSyncService,
        @inject(Reference.IAmpqClient) private ampq: IAmpqClient,
    ) {
    }

    async run(options: ProducerOptions) {
        const opts = {
            queue: options.service.options.value,
            prefetchCount: 1
        } as IConsumeOptions;

        const callback = async (msg: ConsumeMessage|null) => {
            const metadata = { 'message' : msg?.content.toString() };
            try {
                if (msg) {
                    await this.service.sync(msg);
                }
            } catch (error) {
                this.logger.error(JSON.stringify(error).replace(/\n/g, ''), metadata);
            }
        }

        this.ampq.consume(opts, callback);
    }
}