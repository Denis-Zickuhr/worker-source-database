import { Container } from "inversify";
import {Reference} from "./types";

import {HttpApp} from "./core/handlers/http/HttpApp";
import {AppRouter} from "./core/handlers/http/routers/AppRouter";
import {DataRouter} from "./core/handlers/http/routers/v1/DataRouter";
import {AppConfig, IAppConfig} from "./core/config/config";
import ConfigLoader from "./core/config/loader";
import Logger from "./adapters/logger";
import CliApp from "./core/handlers/cli/CliApp";
import AmpqRabbitMQ from "./adapters/ampq/rabbitmq";
import ConsumeCommand from "./core/handlers/cli/Commands/ConsumeCommand";
import ProducerCommand from "./core/handlers/cli/Commands/ProduceCommand";
import {MongodbTableService} from "./services/table/mongodb";
import {ProducerService} from "./services/producer";

const container = new Container();

// Application interfaces
container.bind(Reference.HttpApp).to(HttpApp);
container.bind(Reference.CliApp).to(CliApp);

// Adapters
container.bind(Reference.Logger).to(Logger);
container.bind(Reference.IAmpq).to(AmpqRabbitMQ);

container.bind(Reference.AppRouter).to(AppRouter);
container.bind(Reference.DataRouter).to(DataRouter);
container.bind(Reference.SyncCommand).to(ConsumeCommand);
container.bind(Reference.ProducerCommand).to(ProducerCommand);
container.bind(Reference.ProducerService).to(ProducerService);
container.bind(Reference.MongodbTableService).to(MongodbTableService);

container.bind<IAppConfig>(Reference.AppConfig).toDynamicValue(() => {
    const config = new ConfigLoader("Config.yml");
    return new AppConfig(config.load());
});

export { container };