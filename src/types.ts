import {FollowedDataPerformer} from "./adapters/services/perform/FollowedDataPerformer";

const CoreReference = {
    HttpApp: Symbol.for("IHttpApp"),
    CliApp: Symbol.for("ICliApp"),
    AppConfig: Symbol.for("IAppConfig"),
    AppRouter: Symbol.for("IAppRouter"),
    FollowedRouter: Symbol.for("IFollowedRouter"),
    FollowedDataRouter: Symbol.for("IFollowedDataRouter"),
    SyncCommand: Symbol.for("ISyncCommand"),
    ProducerCommand: Symbol.for("IProducerCommand"),
};

const ServiceReference = {
    ProducerService: Symbol.for("IProducerService"),
    ConsumerService: Symbol.for("IConsumerService"),
    IFollowedHttpService: Symbol.for("IFollowedService"),
    IFollowedHttpDataService: Symbol.for("IFollowedDataService"),
    IFollowedSyncDataService: Symbol.for("IFollowedSyncDataService"),
    IFollowedDataPerformer: Symbol.for("IFollowedDataPerformer"),
};

const AdaptersReference = {
    IAmpqClient: Symbol.for("IAmpqClient"),
    ConsoleLogger: Symbol.for("IConsoleLogger"),
    IDatabaseClient: Symbol.for("IDatabaseClient"),
    IRepositoryFactory: Symbol.for("IRepositoryFactory"),
};


export const Reference = {
    ...CoreReference,
    ...ServiceReference,
    ...AdaptersReference,
}