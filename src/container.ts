import { Container } from "inversify";
import {Reference} from "./types";

import {HttpApp} from "./core/handlers/http/HttpApp";
import {AppRouter} from "./core/handlers/http/routers/AppRouter";
import {DataRouter} from "./core/handlers/http/routers/v1/DataRouter";
import {AppConfig, IAppConfig} from "./core/config/config";
import ConfigLoader from "./core/config/loader";
import ConsoleLogger from "./adapters/logger/ConsoleLogger";
import CliApp from "./core/handlers/cli/CliApp";
import AmpqRabbitMQClient from "./adapters/ampq/client/rabbitmq";
import ConsumeCommand from "./core/handlers/cli/Commands/ConsumeCommand";
import ProducerCommand from "./core/handlers/cli/Commands/ProduceCommand";
import {FollowedService} from "./services/followed/FollowedService";
import {ProducerService} from "./services/producer/ProducerService";
import {MongoDBClient} from "./adapters/database/client/mongodb/MongoDBClient";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

const container = new Container();

// Application interfaces
container.bind(Reference.HttpApp).to(HttpApp);
container.bind(Reference.CliApp).to(CliApp);

// Adapters
container.bind(Reference.ConsoleLogger).to(ConsoleLogger);
container.bind(Reference.IAmpqClient).to(AmpqRabbitMQClient);

container.bind(Reference.AppRouter).to(AppRouter);
container.bind(Reference.DataRouter).to(DataRouter);
container.bind(Reference.SyncCommand).to(ConsumeCommand);
container.bind(Reference.ProducerCommand).to(ProducerCommand);
container.bind(Reference.ProducerService).to(ProducerService);
container.bind(Reference.IFollowedService).to(FollowedService);
container.bind(Reference.IMongoDBClient).to(MongoDBClient);


container.bind<IAppConfig>(Reference.AppConfig).toDynamicValue(() => {
    const config = new ConfigLoader("Config.yml");
    return new AppConfig(config.load());
});


export { container };