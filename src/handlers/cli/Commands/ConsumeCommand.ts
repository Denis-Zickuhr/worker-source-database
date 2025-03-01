import { CommandModule, ArgumentsCamelCase } from 'yargs';
import {ICommand} from "../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import {ConsumerService} from "../../../adapters/services/consumer/ConsumerService";
import {AppConfig, Services} from "../../../core/config/config";

@injectable()
class ConsumeCommand implements ICommand {


    constructor(
        @inject(Reference.ConsumerService) private consumerService: ConsumerService,
        @inject(Reference.AppConfig) private config: AppConfig,
    ) {
    }

    public async handler(argv: ArgumentsCamelCase): Promise<void> {
        const service = this.config.findService(Services.SYNC_CONSUMER);

        await this.consumerService.run({
            service: service
        });
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
