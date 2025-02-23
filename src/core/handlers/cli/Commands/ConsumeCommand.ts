import { CommandModule, ArgumentsCamelCase } from 'yargs';
import {ICommand} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import AmpqRabbitMQ from "../../../../adapters/ampq/rabbitmq";
import {IAppConfig} from "../../../config/config";
import Logger from "../../../../adapters/logger";
import {ConsumeMessage} from "amqplib";

@injectable()
class ConsumeCommand implements ICommand {


    constructor(
        @inject(Reference.IAmpq) private consumer: AmpqRabbitMQ,
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.Logger) private logger: Logger,
    ) {
    }

    public async handler(argv: ArgumentsCamelCase): Promise<void> {

        const serviceName = 'sync-consumer';
        const service = this.config.findService(serviceName);

        if (!service){
            throw new Error(`could not find service '${serviceName}'`);
        }

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
