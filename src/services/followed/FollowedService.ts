import {ITableService} from "../types";
import {id, inject, injectable} from "inversify";
import Express from "express";
import {IAppConfig} from "../../core/config/config";
import {Reference} from "../../types";
import {IMongoClient} from "../../adapters/database/client/mongodb/types";
import {Followed, FollowedStatus} from "../../adapters/database/model/Followed";
import {ObjectId} from "mongodb";
import {
    DeleteFollowedSchema,
    GetFollowedSchema,
    ListFollowedSchema,
    PatchFollowedSchema,
    PostFollowedSchema
} from "./schemas";
import ConsoleLogger from "../../adapters/logger/ConsoleLogger";
import {HttpStatus, HttpStatusMessage} from "../../adapters/http/status";
import {undefined} from "zod";

type AsyncCallback = () => Promise<void>;

@injectable()
export class FollowedService implements ITableService {

    private tableName: string;

    constructor(
        @inject(Reference.AppConfig) private readonly config: IAppConfig,
        @inject(Reference.IMongoDBClient) private readonly mongoClient: IMongoClient,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        const service = this.config.findService('database-connection');

        this.tableName = service.options.value;
    }

    async _connectionClosure(closure: AsyncCallback): Promise<void> {
        try {
            await this.mongoClient.connect();
            await closure();
        } finally {
            await this.mongoClient.disconnect();
        }
    }

    async get(req: Express.Request, res: Express.Response) {
        await this._connectionClosure(
            async () => {
                const getRequestData = GetFollowedSchema.parse(req.query);
                const followed = await this.mongoClient.db.collection<Followed>(this.tableName).findOne({_id: getRequestData.id});

                if (!followed) {
                    res.status(HttpStatus.NOT_FOUND).json({});
                    this.logger.debug(`row ${getRequestData.id} not found`);
                    return;
                }

                this.logger.debug(`retrieved row ${followed._id}`);

                res.status(HttpStatus.OK).json(followed);
            });
    }

    async list(req: Express.Request, res: Express.Response) {
        await this._connectionClosure(
            async () => {
                const { page, limit, sortBy, sortOrder, filter } = ListFollowedSchema.parse(req.query);

                const query: any = {};
                if (filter?.name) {
                    query.name = { $regex: filter.name, $options: 'i' };
                }
                if (filter?.source) {
                    query.source = { $regex: filter.source, $options: 'i' };
                }

                const sortOptions: any = {};
                if (sortBy) {
                    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
                }

                const skip = (page - 1) * limit;
                const followed = await this.mongoClient.db.collection<Followed>(this.tableName)
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions)
                    .toArray();

                const total = await this.mongoClient.db.collection<Followed>(this.tableName)
                    .countDocuments(query);

                res.status(HttpStatus.OK).json({
                    data: followed,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                });
            });
    }

    async patch(req: Express.Request, res: Express.Response) {
        await this._connectionClosure(
            async () => {

                const patchRequestData = PatchFollowedSchema.parse(req.body);

                const followed = await this.mongoClient.db.collection<Followed>(this.tableName).findOne({_id: patchRequestData.id});

                if (!followed) {
                    res.status(HttpStatus.NOT_FOUND).json({status: HttpStatusMessage(HttpStatus.NOT_FOUND), message: `entry ${patchRequestData.id} not found`});
                    return;
                }

                this.logger.debug(`retrieved row ${followed._id}`);

                const { id, ...updateData } = patchRequestData;

                const result = await this.mongoClient.db.collection<Followed>(this.tableName).updateOne(
                    {_id: id},
                    {$set: updateData}
                );

                this.logger.debug(`${result.modifiedCount} field(s) modified on ${patchRequestData.id}`);

                res.status(HttpStatus.OK).json({message: 'Updated successfully'});
            });
    }

    async post(req: Express.Request, res: Express.Response) {
        await this._connectionClosure(
            async () => {

                const postRequestData = PostFollowedSchema.parse(req.body);

                const newFollowed: Followed = {
                    _id: new ObjectId().toHexString(),
                    name: postRequestData.name,
                    entry_id: new ObjectId().toHexString(),
                    source: postRequestData.source,
                    sync_rate: postRequestData.sync_rate,
                    last_sync: null,
                    last_status: FollowedStatus.never_synced,
                };

                await this.mongoClient.db.collection<Followed>(this.tableName).insertOne(newFollowed);
                res.status(HttpStatus.CREATED).json({message: 'Created successfully', id: newFollowed._id});
            });
    }

    async delete(req: Express.Request, res: Express.Response) {
        await this._connectionClosure(
            async () => {
                const deleteRequestData = DeleteFollowedSchema.parse(req.query);

                const followed = await this.mongoClient.db.collection<Followed>(this.tableName).findOne({_id: deleteRequestData.id});

                if (!followed) {
                    res.status(HttpStatus.NOT_FOUND).json({});
                    this.logger.debug(`row ${deleteRequestData.id} not found`);
                    return;
                }

                const result = await this.mongoClient.db.collection<Followed>(this.tableName).deleteOne({_id: followed._id});

                if (result.deletedCount === 0) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Failed to delete"});
                    this.logger.debug(`failed to delete row ${deleteRequestData.id}`);
                    return;
                }

                this.logger.debug(`deleted row ${deleteRequestData.id}`);

                res.status(HttpStatus.NO_CONTENT).json({});
            });
    }

    async* paginatePending(): AsyncGenerator<Followed> {
        try {
            await this.mongoClient.connect();

            const cursor = this.mongoClient.db.collection<Followed>(this.tableName).find();

            for await (const doc of cursor) {
                const now = new Date();
                const nextSyncTime = doc.last_sync ? new Date(doc.last_sync.getTime() + Number(doc.sync_rate) * 1000) : null;

                if (nextSyncTime && now < nextSyncTime) {
                    continue;
                }

                await this.mongoClient.db.collection<Followed>(this.tableName).updateOne(
                    { _id: doc._id },
                    { $set: { last_sync: now } }
                );

                yield doc;
            }
        } finally {
            await this.mongoClient.disconnect();
        }
    }
}