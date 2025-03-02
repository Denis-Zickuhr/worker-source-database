import {IFollowedHttpService} from "../../types";
import {inject, injectable} from "inversify";
import Express from "express";
import {Reference} from "../../../../types";
import {Followed, FollowedStatus} from "../../../database/model/Followed";
import {ObjectId} from "mongodb";
import {
    DeleteDocumentByIdSchema, FollowedIncludeTypes,
    GetFollowedSchema,
    ListFollowedSchema,
    PatchFollowedSchema,
    PostFollowedSchema
} from "../schemas";
import ConsoleLogger from "../../../logger/ConsoleLogger";
import {HttpStatus, HttpStatusMessage} from "../../../http/status";
import {IRepositoryFactory} from "../../../factories/types";
import {IDataBaseRepository} from "../../../database/repository/types";
import {FollowedData} from "../../../database/model/FollowedData";
import {FollowedHistory} from "../../../database/model/FollowedHistory";

@injectable()
export class FollowedHttpService implements IFollowedHttpService {

    private followedRepository: IDataBaseRepository<Followed>;
    private followedDataRepository: IDataBaseRepository<FollowedData>;
    private followedDataHistoryRepository: IDataBaseRepository<FollowedHistory>;

    constructor(
        @inject(Reference.IRepositoryFactory) private readonly repositoryFactory: IRepositoryFactory,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        this.followedRepository = this.repositoryFactory.create<Followed>('followed');
        this.followedDataRepository = this.repositoryFactory.create<FollowedData>('followed_data');
        this.followedDataHistoryRepository = this.repositoryFactory.create<FollowedHistory>('followed_data_history');
    }

    async get(req: Express.Request, res: Express.Response) {
        const getRequestData = GetFollowedSchema.parse(req.query);
        const followed = await this.followedRepository.findOneById(getRequestData.id);

        if (!followed) {
            res.status(HttpStatus.NOT_FOUND).json({});
            this.logger.debug(`row ${getRequestData.id} not found`);
            return;
        }

        let followedData = null;
        if (getRequestData.included?.includes(FollowedIncludeTypes.FOLLOWED_DATA)){
            followedData = await this.followedDataRepository.findOneById(followed.entry_id);
        }

        this.logger.debug(`retrieved row ${followed._id}`);

        res.status(HttpStatus.OK).json({...followed, ...(followedData ? {followedData: followedData} : {})});
    }

    async list(req: Express.Request, res: Express.Response) {
        const parsedRequest = ListFollowedSchema.parse(req.query);
        const { page, limit, sortBy, sortOrder, filter } = parsedRequest;
        const pagination = { page, limit, sortBy, sortOrder };

        const query: any = {};
        if (filter?.name) {
            query.name = { $regex: filter.name, $options: 'i' };
        }
        if (filter?.source) {
            query.source = { $regex: filter.source, $options: 'i' };
        }

        const data = await this.followedRepository.list(pagination, query);

        this.logger.debug(`retrieved ${data.count} row(s)`, parsedRequest);

        res.status(HttpStatus.OK).json({
            data: data.data,
            pagination: {
                ...pagination,
                totalPages: Math.ceil(data.count / pagination.limit),
            },
        });
    }

    async patch(req: Express.Request, res: Express.Response) {
        const requestData = PatchFollowedSchema.parse(req.body);

        if (!await this.followedRepository.findOneById(requestData.id)) {
            res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatusMessage(HttpStatus.NOT_FOUND),
                message: `entry ${requestData.id} not found`
            });
            return;
        }

        this.logger.debug(`retrieved row ${requestData.id}`);

        const { id, ...updateData } = requestData;
        if (await this.followedRepository.update(id, updateData)){
            res.status(HttpStatus.OK).json({message: 'Updated successfully'});
            this.logger.debug(`successfully updated row ${id}`);
        } else {
            res.status(HttpStatus.OK).json({message: 'No content has been updated'});
            this.logger.debug(`no modifications were made to ${id}`);
        }
    }

    async post(req: Express.Request, res: Express.Response) {
        const postRequestData = PostFollowedSchema.parse(req.body);

        if (await this.followedRepository.findOne({name: postRequestData.name})){
            res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                status: HttpStatusMessage(HttpStatus.UNPROCESSABLE_ENTITY),
                message: `Followed ${postRequestData.name} already exists`
            });
            return;
        }

        const followedData = await this.followedDataRepository.insert({
            _id: new ObjectId().toHexString(),
            name: postRequestData.name,
            value: 0,
            h_value: 0,
            l_value: 0
        });
        const followed = await this.followedRepository.insert({
            _id: new ObjectId().toHexString(),
            name: postRequestData.name,
            entry_id: followedData._id,
            source: postRequestData.source,
            sync_rate: postRequestData.sync_rate,
            last_sync: null,
            last_status: FollowedStatus.never_synced,
        });

        res.status(HttpStatus.CREATED).json({message: 'Created successfully', id: followed._id});
    }

    async delete(req: Express.Request, res: Express.Response) {
        const requestData = DeleteDocumentByIdSchema.parse(req.query);
        const followed = await this.followedRepository.findOneById(requestData.id);

        if (!followed) {
            res.status(HttpStatus.NOT_FOUND).json({});
            this.logger.debug(`row ${requestData.id} not found`);
            return;
        }

        await this.followedDataHistoryRepository.delete({ followed_id: followed.entry_id });
        await this.followedDataRepository.deleteOneById(followed.entry_id);

        if (!await this.followedRepository.deleteOneById(followed._id)) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Failed to delete"});
            this.logger.debug(`failed to delete row ${requestData.id}`);
            return;
        }

        this.logger.debug(`deleted row ${requestData.id}`);

        res.status(HttpStatus.NO_CONTENT).json({});
    }

    async* paginatePending(ignoreRate: boolean = false): AsyncGenerator<Followed> {
        for await (const doc of this.followedRepository.paginate({})) {

            const now = new Date();
            const nextSyncTime = doc.last_sync ? new Date(doc.last_sync.getTime() + Number(doc.sync_rate) * 1000) : null;

            if (nextSyncTime && now < nextSyncTime && !ignoreRate) {
                continue;
            }

            doc.last_sync = now;

            await this.followedRepository.patch(doc);
            yield doc;
        }
    }
}