import {inject, injectable} from "inversify";
import {Reference} from "../../types";
import logger from "../../adapters/logger";
import {ITableService, ProducerOptions} from "../types";
import {IAmpq} from "../../adapters/ampq/types";

@injectable()
export class ProducerService {

    constructor(
        @inject(Reference.Logger) private logger: logger,
        @inject(Reference.MongodbTableService) private tableService: ITableService,
        @inject(Reference.IAmpq) private ampq: IAmpq,
    ) {
    }

    async run(options: ProducerOptions) {
        this.logger.info("Started syncing...");

        for (const entry of this.tableService.paginate()) {
            const message = JSON.stringify(entry);
            await this.ampq.produce(options.service.options.value, message).then(() => {
                this.logger.info(`Entry ${entry.id} sent to queue ${options.service.options.value} for processing`);
            })
        }

        this.logger.info("Syncing done...");
    }
}