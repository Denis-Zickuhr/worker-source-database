import {Service} from "../core/config/config";
import {Followed} from "../adapters/database/model/Followed";

export type ProducerOptions = {
    service: Service
}

export interface ITableService {
    paginatePending(): AsyncGenerator<Followed>;
}

export type TableEntry = {
    id: string,
    document: string,
    source: string,
}