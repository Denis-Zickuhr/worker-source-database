import {IConsumeOptions} from "./rabbitmq/types";
import * as amqp from 'amqplib';

export interface IAmpq {
    consume(
        options: IConsumeOptions,
        consumerCallback: (msg: amqp.ConsumeMessage | null) => void
    ): void;

    produce(
        queue: string,
        message: string,
        options?: amqp.Options.Publish
    ): Promise<void>;
}
