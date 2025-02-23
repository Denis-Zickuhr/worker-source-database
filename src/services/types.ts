import {Service} from "../core/config/config";

export type ProducerOptions = {
    service: Service
}

export interface ITableService {
    paginate(): Generator<TableEntry>;
}

export type TableEntry = {
    id: string,
    document: string,
    source: string,
}