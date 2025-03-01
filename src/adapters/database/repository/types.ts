import {ClientSession, Document, Filter, OptionalUnlessRequiredId} from "mongodb";
import {PaginatedListFilters} from "../../services/followed/schemas";

export interface IDataBaseRepository<T> {
    find(params: Filter<T>, operationParams?: OperationParams): Promise<T[]>;
    findOneById(id: string, operationParams?: OperationParams): Promise<T>;
    findOne(params: Filter<DocumentWithId>, operationParams?: OperationParams): Promise<T>;
    list(pagination: PaginatedListFilters, query: Filter<T>, operationParams?: OperationParams): Promise<ListResponse<T>>;
    delete(id: string, operationParams?: OperationParams): Promise<boolean>;
    insert(data: T, operationParams?: OperationParams): Promise<T>;
    update(id: string, data: Partial<T>, operationParams?: OperationParams): Promise<boolean>;
    patch(data: Partial<T>, operationParams?: OperationParams): Promise<boolean>;
    paginate(query: Filter<T>, operationParams?: OperationParams): AsyncGenerator<T>;
}

export type OperationParams = {
    session?: ClientSession
}

export type DocumentWithId = Document & {_id: string};

export type ListResponse<T> = { data: T[], count: number };