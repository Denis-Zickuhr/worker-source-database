import {MongoClient, Db} from 'mongodb';
import {IMongoClient} from "./types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import {IAppConfig} from "../../../../core/config/config";

@injectable()
export class MongoDBClient implements IMongoClient{
  private readonly _client: MongoClient;
  private readonly _db: Db;

  constructor(
      @inject(Reference.AppConfig) private readonly config: IAppConfig,
  ) {
    const service = this.config.findService('database-connection');

    this._client = new MongoClient(service.options.url);
    this._db = this._client.db(service.options.value);
  }

  async connect(): Promise<void> {
    await this._client.connect();
  }

  async disconnect(): Promise<void> {
    await this._client.close();
  }

  get client(): MongoClient {
    return this._client;
  }

  get db(): Db {
    return this._db;
  }

}
