import {Service} from "../../core/config/config";
import {Followed} from "../database/model/Followed";
import {ConsumeMessage} from "amqplib";

export type ProducerOptions = {
    service: Service
}

export interface IFollowedHttpService {
    get(req: Express.Request, res: Express.Response): Promise<void>;
    list(req: Express.Request, res: Express.Response): Promise<void>;
    patch(req: Express.Request, res: Express.Response): Promise<void>;
    post(req: Express.Request, res: Express.Response): Promise<void>;
    delete(req: Express.Request, res: Express.Response): Promise<void>;
    paginatePending(ignoreRate?: boolean): AsyncGenerator<Followed>;
}

export interface IFollowedHttpDataService {
    get(req: Express.Request, res: Express.Response): Promise<void>;
    list(req: Express.Request, res: Express.Response): Promise<void>;
    delete(req: Express.Request, res: Express.Response): Promise<void>;
}

export interface IFollowedSyncService {
    sync(id: ConsumeMessage): Promise<void>;
}

