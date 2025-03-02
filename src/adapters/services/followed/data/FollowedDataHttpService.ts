import {IFollowedDataHttpService, IFollowedHttpService} from "../../types";
import {inject, injectable} from "inversify";
import Express from "express";
import {Reference} from "../../../../types";
import {
    DeleteDocumentByIdSchema,
    GetDocumentByIdSchema,
    ListFollowedDataSchema,
} from "../schemas";
import ConsoleLogger from "../../../logger/ConsoleLogger";
import {HttpStatus} from "../../../http/status";
import {IRepositoryFactory} from "../../../factories/types";
import {IDataBaseRepository} from "../../../database/repository/types";
import {FollowedData} from "../../../database/model/FollowedData";

@injectable()
export class FollowedDataHttpService implements IFollowedDataHttpService {

    private followedDataRepository: IDataBaseRepository<FollowedData>;

    constructor(
        @inject(Reference.IRepositoryFactory) private readonly repositoryFactory: IRepositoryFactory,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        this.followedDataRepository = this.repositoryFactory.create<FollowedData>('followed_data');
    }

    async get(req: Express.Request, res: Express.Response) {
        const getRequestData = GetDocumentByIdSchema.parse(req.query);
        const followedData = await this.followedDataRepository.findOneById(getRequestData.id);

        if (!followedData) {
            res.status(HttpStatus.NOT_FOUND).json({});
            this.logger.debug(`row ${getRequestData.id} not found`);
            return;
        }

        this.logger.debug(`retrieved row ${followedData._id}`);

        res.status(HttpStatus.OK).json(followedData);
    }

    async list(req: Express.Request, res: Express.Response) {
        const parsedRequest = ListFollowedDataSchema.parse(req.query);
        const { page, limit, sortBy, sortOrder, name } = parsedRequest;
        const filter = { name };
        const pagination = { page, limit, sortBy, sortOrder };

        const query: any = {};
        if (filter?.name) {
            query.name = { $regex: filter.name, $options: 'i' };
        }

        const data = await this.followedDataRepository.list(pagination, query);

        this.logger.debug(`retrieved ${data.count} row(s)`, parsedRequest);

        res.status(HttpStatus.OK).json({
            data: data.data,
            pagination: {
                ...pagination,
                totalPages: Math.ceil(data.count / pagination.limit),
            },
        });
    }

    async delete(req: Express.Request, res: Express.Response) {
        const requestData = DeleteDocumentByIdSchema.parse(req.query);
        const followed = await this.followedDataRepository.findOneById(requestData.id);

        if (!followed) {
            res.status(HttpStatus.NOT_FOUND).json({});
            this.logger.debug(`row ${requestData.id} not found`);
            return;
        }

        if (!await this.followedDataRepository.deleteOneById(followed._id)) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Failed to delete"
            });
            this.logger.debug(`failed to delete row ${requestData.id}`);
            return;
        }

        this.logger.debug(`deleted row ${requestData.id}`);

        res.status(HttpStatus.NO_CONTENT).json({});
    }

}