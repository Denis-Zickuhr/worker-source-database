
export const Reference = {
    AppRouter: Symbol.for("IAppRouter"),
    DataRouter: Symbol.for("IDataRouter"),
    SyncCommand: Symbol.for("ISyncCommand"),
    ProducerCommand: Symbol.for("IProducerCommand"),
    ProducerService: Symbol.for("IProducerService"),
    MongodbTableService: Symbol.for("IMongodbTableService"),
    IAmpq: Symbol.for("IAmpqRabbitMQ"),
    HttpApp: Symbol.for("IHttpApp"),
    CliApp: Symbol.for("ICliApp"),
    AppConfig: Symbol.for("IAppConfig"),
    Logger: Symbol.for("ILogger"),
}