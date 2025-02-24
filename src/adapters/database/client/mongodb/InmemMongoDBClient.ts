import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db} from 'mongodb';
import {inject, injectable} from "inversify";
import {IMongoClient} from "./types";
import {Reference} from "../../../../types";
import {IAppConfig} from "../../../../core/config/config";

@injectable()
export class inmemMongoDBClient implements IMongoClient {
    private _client: MongoClient;
    private _db: Db;
    private mongoServer: MongoMemoryServer;

    constructor(
        @inject(Reference.AppConfig) private readonly config: IAppConfig,
    ) {
        this.mongoServer = new MongoMemoryServer();
        const service = this.config.findService('database-connection');

        this._client = new MongoClient('mongodb://host:27017/database');
        this._db = this._client.db(service.options.value);
    }

    async connect(): Promise<void> {
        await this.mongoServer.start();
        const uri = this.mongoServer.getUri();
        this._client = new MongoClient(uri);
        await this._client.connect();
        this._db = this._client.db();
    }

    async disconnect(): Promise<void> {
        await this._client.close();
        await this.mongoServer.stop();
    }

    get client(): MongoClient {
        return this._client;
    }

    get db(): Db {
        return this._db;
    }
}