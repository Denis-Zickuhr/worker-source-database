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
    IFollowedService: Symbol.for("IFollowedService"),
};

const AdaptersReference = {
    IAmpqClient: Symbol.for("IAmpqClient"),
    ConsoleLogger: Symbol.for("IConsoleLogger"),
    IMongoDBClient: Symbol.for("IMongoDBClient"),
};


export const Reference = {
    ...CoreReference,
    ...ServiceReference,
    ...AdaptersReference,
}