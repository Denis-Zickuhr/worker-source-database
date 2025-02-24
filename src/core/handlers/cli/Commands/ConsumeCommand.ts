import { CommandModule, ArgumentsCamelCase } from 'yargs';
import {ICommand} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import AmpqRabbitMQClient from "../../../../adapters/ampq/client/rabbitmq";
import {IAppConfig} from "../../../config/config";
import ConsoleLogger from "../../../../adapters/logger/ConsoleLogger";
import {ConsumeMessage} from "amqplib";

@injectable()
class ConsumeCommand implements ICommand {


    constructor(
        @inject(Reference.IAmpqClient) private consumer: AmpqRabbitMQClient,
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.ConsoleLogger) private logger: ConsoleLogger,
    ) {
    }

    public async handler(argv: ArgumentsCamelCase): Promise<void> {

        const service = this.config.findService('sync-consumer');

        const callback = (msg: (ConsumeMessage | null)) => {
            this.logger.info(JSON.stringify(msg?.content.toString()) || '');
        };

        await this.consumer.consume(
            {
                prefetchCount: 1,
                queue: service.options.value
            },
            callback
        );
    }

    public getCommand(): CommandModule {
        return {
            command: 'consumer',
            describe: 'Queue consumer',
            handler: async (argv) => {
                await this.handler(argv);
            },
        };
    }
}

export default ConsumeCommand;
