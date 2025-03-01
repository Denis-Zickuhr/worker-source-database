import {DocumentWithId, IDataBaseRepository, ListResponse, OperationParams} from "./types";
import {unmanaged} from "inversify";
import {ClientSession, Filter, OptionalUnlessRequiredId} from "mongodb";
import {IDataBaseClient} from "../client/types";
import {PaginatedListFilters} from "../../services/followed/schemas";

export class DataBaseRepository<T extends DocumentWithId> implements IDataBaseRepository<T> {

    constructor(
        @unmanaged() private readonly client: IDataBaseClient,
        @unmanaged() private readonly table: string,
    ) {
    }

    async find(params: Filter<T>, operationParams: OperationParams = {}): Promise<T[]> {
        await this.client.connect();
        const documents = await this.client.db.collection<T>(this.table).find(
            params,
            operationParams
        ).toArray();
        await this.client.disconnect();
        return documents as T[];
    }

    async findOneById(id: string, operationParams: OperationParams = {}): Promise<T> {
        await this.client.connect();
        const document = await this.client.db.collection<T>(this.table).findOne(
            { _id: id } as Filter<T>,
            operationParams
        );
        await this.client.disconnect();
        return document as T;
    }

    async findOne(params: Filter<T>, operationParams: OperationParams = {}): Promise<T> {
        await this.client.connect();
        const document = await this.client.db.collection<T>(this.table).findOne(params, operationParams)
        await this.client.disconnect();
        return document as T;
    }

    async list(pagination: PaginatedListFilters, query: Filter<T>, operationParams: OperationParams = {}): Promise<ListResponse<T>> {
        await this.client.connect();
        const sortOptions: any = {};

        if (pagination.sortBy) {
            sortOptions[pagination.sortBy] = pagination.sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (pagination.page - 1) * pagination.limit;
        const followed = await this.client.db.collection<T>(this.table)
            .find(query, operationParams)
            .skip(skip)
            .limit(pagination.limit)
            .sort(sortOptions)
            .toArray();

        const total = await this.client.db.collection<T>(this.table).countDocuments(query);
        await this.client.disconnect();
        return {
            data: followed as T[],
            count: total
        } as ListResponse<T>;
    }

    async delete(id: string, operationParams: OperationParams = {}): Promise<boolean> {
        await this.client.connect();
        const result = await this.client.db.collection<T>(this.table).deleteOne(
            { _id: id } as Filter<T>,
            operationParams
        );
        await this.client.disconnect();
        return result.deletedCount > 0;
    }

    async insert(data: T, operationParams: OperationParams = {}): Promise<T> {
        await this.client.connect();
        const newDocument = { ...data } as OptionalUnlessRequiredId<T>;
        await this.client.db.collection<T>(this.table).insertOne(newDocument, operationParams);
        await this.client.disconnect();
        return newDocument as T;
    }

    async update(id: string, data: Partial<T>, operationParams: OperationParams = {}): Promise<boolean> {
        await this.client.connect();
        const result = await this.client.db.collection<T>(this.table).updateOne(
            { _id: id } as Filter<T>,
            { $set: data },
            operationParams
        );
        await this.client.disconnect();
        return result.modifiedCount > 0;
    }

    async patch(data: Partial<T>, operationParams: OperationParams = {}): Promise<boolean> {
        await this.client.connect();
        const result = await this.client.db.collection<T>(this.table).updateOne(
            { _id: data._id } as Filter<T>,
            { $set: data },
            operationParams
        );
        await this.client.disconnect();
        return result.modifiedCount > 0;
    }

    async *paginate(query: Filter<T> = {}, operationParams: OperationParams = {}): AsyncGenerator<T> {
        await this.client.connect();
        const cursor = this.client.db.collection<T>(this.table).find(query);

        for await (const item of cursor) {
            yield item as T;
        }

        await this.client.disconnect();
    }

}