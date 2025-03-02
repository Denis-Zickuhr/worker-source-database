import {IFollowedHistoryHttpService} from "../../types";
import {inject, injectable} from "inversify";
import Express from "express";
import {Reference} from "../../../../types";
import {ListFollowedHistoryResponseSchema, ListFollowedHistorySchema,} from "../schemas";
import ConsoleLogger from "../../../logger/ConsoleLogger";
import {HttpStatus, HttpStatusMessage} from "../../../http/status";
import {IRepositoryFactory} from "../../../factories/types";
import {IDataBaseRepository} from "../../../database/repository/types";
import {FollowedHistory} from "../../../database/model/FollowedHistory";
import {Followed} from "../../../database/model/Followed";

@injectable()
export class FollowedHistoryHttpService implements IFollowedHistoryHttpService {

    private followedHistoryRepository: IDataBaseRepository<FollowedHistory>;
    private followedRepository: IDataBaseRepository<Followed>;

    constructor(
        @inject(Reference.IRepositoryFactory) private readonly repositoryFactory: IRepositoryFactory,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        this.followedHistoryRepository = this.repositoryFactory.create<FollowedHistory>('followed_data_history');
        this.followedRepository = this.repositoryFactory.create<Followed>('followed');
    }

    async list(req: Express.Request, res: Express.Response) {
        const parsedRequest = ListFollowedHistorySchema.parse(req.query);
        const { page, limit, sortBy, sortOrder, after, id, before, name } = parsedRequest;
        const filter = { after, id, before, name };
        const pagination = { page, limit, sortBy, sortOrder };

        const queryFollowed: any = {};
        if (filter?.name) {
            queryFollowed.name = { $regex: `^${filter.name}$`, $options: 'i' };

            const followed = await this.followedRepository.findOne(queryFollowed);
            if (!followed) {
                res.status(HttpStatus.NOT_FOUND).send({
                    status: HttpStatusMessage(HttpStatus.NOT_FOUND),
                    message: `followed ${filter.name} not found`
                });
                return;
            }
        }


        const query: any = {};
        if (filter?.after || filter?.before) {
            query.timestamp = {};

            if (filter?.after) {
                query.timestamp.$gte = new Date(filter?.after).getTime();
            }

            if (filter?.before) {
                query.timestamp.$lte = new Date(filter?.before).getTime();
            }
        }

        if (filter?.id) {
            query._id = { $regex: filter.id, $options: 'i' };
        }

        const data = await this.followedHistoryRepository.list(pagination, query);

        this.logger.debug(`retrieved ${data.count} row(s)`, parsedRequest);

        res.status(HttpStatus.OK).json({
            data: ListFollowedHistoryResponseSchema.parse(data.data),
            pagination: {
                ...pagination,
                totalPages: Math.ceil(data.count / pagination.limit),
            },
        });
    }

}