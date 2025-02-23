import { CommandModule, ArgumentsCamelCase } from 'yargs';
import {ICommand} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import {IAppConfig} from "../../../config/config";
import {ProducerService} from "../../../../services/producer";

@injectable()
class ProducerCommand implements ICommand {


    constructor(
        @inject(Reference.ProducerService) private producerService: ProducerService,
        @inject(Reference.AppConfig) private config: IAppConfig,
    ) {
    }

    public async handler(argv: ArgumentsCamelCase): Promise<void> {

        const serviceName = 'sync-producer';
        const service = this.config.findService(serviceName);

        if (!service){
            throw new Error(`could not find service '${serviceName}'`);
        }

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
