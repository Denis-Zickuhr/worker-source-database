import {Service} from "../../core/config/config";
import {Followed} from "../database/model/Followed";

export type ProducerOptions = {
    service: Service
}

export interface IFollowedService {
    get(req: Express.Request, res: Express.Response): Promise<void>;
    list(req: Express.Request, res: Express.Response): Promise<void>;
    patch(req: Express.Request, res: Express.Response): Promise<void>;
    post(req: Express.Request, res: Express.Response): Promise<void>;
    delete(req: Express.Request, res: Express.Response): Promise<void>;
    paginatePending(ignoreRate?: boolean): AsyncGenerator<Followed>;
}
