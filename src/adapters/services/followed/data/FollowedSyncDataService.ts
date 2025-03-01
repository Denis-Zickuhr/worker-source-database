import {IFollowedSyncService} from "../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import ConsoleLogger from "../../../logger/ConsoleLogger";
import {IRepositoryFactory} from "../../../factories/types";
import {IDataBaseRepository} from "../../../database/repository/types";
import {FollowedData} from "../../../database/model/FollowedData";
import {ConsumeMessage} from "amqplib";
import {SyncMessageSchema} from "../../consumer/types";
import {Followed, FollowedStatus} from "../../../database/model/Followed";
import {IFollowedDataPerformer} from "../../perform/types";

@injectable()
export class FollowedSyncDataService implements IFollowedSyncService {

    private followedDataRepository: IDataBaseRepository<FollowedData>;
    private followedRepository: IDataBaseRepository<Followed>;

    constructor(
        @inject(Reference.IFollowedDataPerformer) private readonly performer: IFollowedDataPerformer,
        @inject(Reference.IRepositoryFactory) private readonly repositoryFactory: IRepositoryFactory,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        this.followedRepository = this.repositoryFactory.create<Followed>('followed');
        this.followedDataRepository = this.repositoryFactory.create<FollowedData>('followed_data');
    }

    async sync(msg: ConsumeMessage): Promise<void> {
        const now = new Date();

        this.logger.debug(`validating message`);
        const message = SyncMessageSchema.parse(JSON.stringify(msg.content.toJSON()));

        const followed = await this.followedRepository.findOneById(message._id);
        const followedData = await this.followedDataRepository.findOneById(message.entry_id);

        if (!followed || !followedData) {
            this.logger.error(`failed to find followed for id ${message._id}`);
            return;
        }

        const performance = await this.performer.perform(followed);

        if (!performance.success || !performance.value){
            followed.last_status = FollowedStatus.errored;
            followed.last_sync = now;

            followedData.history.push({
                timestamp: now.getTime(),
                value: 0,
                error: true
            })

            await this.followedRepository.patch(followed);
            await this.followedDataRepository.patch(followedData);
            return;
        }

        followed.last_status = FollowedStatus.synced;
        followed.last_sync = now;

        followedData.history.push({
            timestamp: now.getTime(),
            value: performance.value,
            error: false
        });
        await this.followedRepository.patch(followed);
        await this.followedDataRepository.patch(followedData);

        this.logger.debug(`successfully sync followed for id ${message._id}`);
    }

}