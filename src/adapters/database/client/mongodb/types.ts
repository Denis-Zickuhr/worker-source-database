import {Db, MongoClient} from "mongodb";

export interface IMongoClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get client(): MongoClient;
    get db(): Db;
}