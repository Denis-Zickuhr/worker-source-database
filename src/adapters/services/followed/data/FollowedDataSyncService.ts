import {IFollowedDataSyncService} from "../../types";
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
import {FollowedHistory} from "../../../database/model/FollowedHistory";
import {ObjectId} from "mongodb";

@injectable()
export class FollowedDataSyncService implements IFollowedDataSyncService {

    private followedDataRepository: IDataBaseRepository<FollowedData>;
    private followedRepository: IDataBaseRepository<Followed>;
    private followedDataHistoryRepository: IDataBaseRepository<FollowedHistory>;

    constructor(
        @inject(Reference.IFollowedDataPerformer) private readonly performer: IFollowedDataPerformer,
        @inject(Reference.IRepositoryFactory) private readonly repositoryFactory: IRepositoryFactory,
        @inject(Reference.ConsoleLogger) private readonly logger: ConsoleLogger,
    ) {
        this.followedRepository = this.repositoryFactory.create<Followed>('followed');
        this.followedDataRepository = this.repositoryFactory.create<FollowedData>('followed_data');
        this.followedDataHistoryRepository = this.repositoryFactory.create<FollowedHistory>('followed_data_history');
    }

    async sync(msg: ConsumeMessage): Promise<void> {
        const now = new Date();

        this.logger.debug(`validating message`);
        const message = SyncMessageSchema.parse(JSON.parse(msg.content.toString()));

        const metadata = { 'id' : message._id };

        this.logger.debug(`processing message`, metadata);
        const followed = await this.followedRepository.findOneById(message._id);
        const followedData = await this.followedDataRepository.findOneById(message.entry_id);

        if (!followed || !followedData) {
            this.logger.error(`failed to find followed`, metadata);
            return;
        }

        const performance = await this.performer.perform(followed);

        if (!performance.success || performance.value === undefined){
            this.logger.debug(`registered followed sync failure`, metadata);

            followed.last_status = FollowedStatus.errored;
            followed.last_sync = now;

            await this.followedRepository.patch(followed);
            await this.followedDataRepository.patch(followedData);
            await this.followedDataHistoryRepository.insert({
                _id: new ObjectId().toHexString(),
                followed_id: followedData._id,
                timestamp: now.getTime(),
                value: 0,
                error: true
            });
            return;
        }

        followed.last_status = FollowedStatus.synced;
        followed.last_sync = now;

        followedData.value = performance.value;
        followedData.l_value = Math.min(followedData.l_value, performance.value);
        followedData.h_value = Math.max(followedData.h_value, performance.value);

        await this.followedRepository.patch(followed);
        await this.followedDataRepository.patch(followedData);
        await this.followedDataHistoryRepository.insert({
            _id: new ObjectId().toHexString(),
            followed_id: followedData._id,
            timestamp: now.getTime(),
            value: performance.value,
            error: false
        });

        this.logger.debug(`successfully sync followed`, metadata);
    }

}