import { CommandModule, ArgumentsCamelCase } from 'yargs';
import {ICommand} from "../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import {IAppConfig, Services} from "../../../core/config/config";
import {ProducerService} from "../../../adapters/services/producer/ProducerService";

@injectable()
class ProducerCommand implements ICommand {


    constructor(
        @inject(Reference.ProducerService) private producerService: ProducerService,
        @inject(Reference.AppConfig) private config: IAppConfig,
    ) {
    }

    public async handler(argv: ArgumentsCamelCase): Promise<void> {
        const service = this.config.findService(Services.SYNC_PRODUCER);

        await this.producerService.run({
            service: service
        });
    }

    public getCommand(): CommandModule {
        return {
            command: 'producer',
            describe: 'Queue producer',
            handler: async (argv) => {
                await this.handler(argv);
            },
        };
    }
}

export default ProducerCommand;
