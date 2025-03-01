import { Container } from "inversify";
import {Reference} from "./types";

import {HttpApp} from "./handlers/http/HttpApp";
import {AppRouter} from "./handlers/http/routers/AppRouter";
import {FollowedRouter} from "./handlers/http/routers/v1/FollowedRouter";
import {AppConfig, IAppConfig} from "./core/config/config";
import ConfigLoader from "./core/config/loader";
import ConsoleLogger from "./adapters/logger/ConsoleLogger";
import CliApp from "./handlers/cli/CliApp";
import AmpqRabbitMQClient from "./adapters/ampq/client/rabbitmq";
import ConsumeCommand from "./handlers/cli/Commands/ConsumeCommand";
import ProducerCommand from "./handlers/cli/Commands/ProduceCommand";
import {FollowedService} from "./adapters/services/followed/FollowedService";
import {ProducerService} from "./adapters/services/producer/ProducerService";
import {MongoDBClient} from "./adapters/database/client/MongoDBClient";
import {RepositoryFactory} from "./adapters/factories/RepositoryFactory";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

const container = new Container();

// Application interfaces
container.bind(Reference.HttpApp).to(HttpApp);
container.bind(Reference.CliApp).to(CliApp);

// Adapters
container.bind(Reference.ConsoleLogger).to(ConsoleLogger);
container.bind(Reference.IAmpqClient).to(AmpqRabbitMQClient);

container.bind(Reference.AppRouter).to(AppRouter);
container.bind(Reference.FollowedRouter).to(FollowedRouter);
container.bind(Reference.SyncCommand).to(ConsumeCommand);
container.bind(Reference.ProducerCommand).to(ProducerCommand);
container.bind(Reference.ProducerService).to(ProducerService);
container.bind(Reference.IFollowedService).to(FollowedService);
container.bind(Reference.IDatabaseClient).to(MongoDBClient);
container.bind(Reference.IRepositoryFactory).to(RepositoryFactory);


container.bind<IAppConfig>(Reference.AppConfig).toDynamicValue(() => {
    const config = new ConfigLoader("Config.yml");
    return new AppConfig(config.load());
});

export { container };