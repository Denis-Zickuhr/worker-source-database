import {MongoClient, Db, Collection, ClientSession} from 'mongodb';
import {IDataBaseClient} from "./types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import {IAppConfig, Services} from "../../../core/config/config";
import ConsoleLogger from "../../logger/ConsoleLogger";

@injectable()
export class MongoDBClient implements IDataBaseClient {
  private readonly _client: MongoClient;
  private readonly _db: Db;

  constructor(
      @inject(Reference.AppConfig) private readonly config: IAppConfig,
      @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
  ) {
    const service = this.config.findService(Services.DATABASE_CONNECTION);

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
