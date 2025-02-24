const CoreReference = {
    HttpApp: Symbol.for("IHttpApp"),
    CliApp: Symbol.for("ICliApp"),
    AppConfig: Symbol.for("IAppConfig"),
    AppRouter: Symbol.for("IAppRouter"),
    DataRouter: Symbol.for("IDataRouter"),
    SyncCommand: Symbol.for("ISyncCommand"),
    ProducerCommand: Symbol.for("IProducerCommand"),
};

const ServiceReference = {
    ProducerService: Symbol.for("IProducerService"),
    MongodbTableService: Symbol.for("IMongodbTableService"),
};

const AdaptersReference = {
    IAmpqRabbitMQClient: Symbol.for("IAmpqRabbitMQClient"),
    ConsoleLogger: Symbol.for("IConsoleLogger"),
};


export const Reference = {
    ...CoreReference,
    ...ServiceReference,
    ...AdaptersReference,
}