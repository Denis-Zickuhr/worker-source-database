import {IConsumeOptions} from "./client/rabbitmq/types";
import * as amqp from 'amqplib';

export interface IAmpqClient {
    consume(
        options: IConsumeOptions,
        consumerCallback: (msg: amqp.ConsumeMessage | null) => Promise<void>
    ): void;

    produce(
        queue: string,
        message: string,
        options?: amqp.Options.Publish
    ): Promise<void>;
}
