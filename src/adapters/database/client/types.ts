import {ClientSession, Db, MongoClient} from "mongodb";

export interface IDataBaseClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get client(): MongoClient;
    get db(): Db;
}