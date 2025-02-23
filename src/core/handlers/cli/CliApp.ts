import yargs from 'yargs';
import {inject, injectable} from "inversify";
import {ICliApp, ICommand} from "../../types";
import {Reference} from "../../../types";

@injectable()
class CliApp implements ICliApp {

    constructor(
        @inject(Reference.SyncCommand) private syncCommand: ICommand,
        @inject(Reference.ProducerCommand) private produceCommand: ICommand,
    ) {
    }

    async run(): Promise<void> {
        await yargs
            .command(this.syncCommand.getCommand())
            .command(this.produceCommand.getCommand())
            .demandCommand()
            .help()
            .alias('help', 'h')
            .argv;
    }
}

export default CliApp;
