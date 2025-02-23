import * as amqp from 'amqplib';
import {inject, injectable} from "inversify";
import {IConsumeOptions} from "./types";
import {Reference} from "../../../types";
import {IAppConfig} from "../../../core/config/config";
import logger from "../../logger";
import {IAmpq} from "../types";
import {promise} from "zod";
import {resolve} from "inversify/lib/cjs/resolution/resolver";

@injectable()
class AmpqRabbitMQ implements IAmpq {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    constructor(
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.Logger) private logger: logger,
    ) {}

    private async connect(): Promise<void> {
        if (!this.connection) {
            const serviceName = 'sync-consumer';
            const service = this.config.findService(serviceName);

            if (!service){
                throw new Error(`${serviceName} not found`);
            }

            this.connection = await amqp.connect(service?.options.url);
            this.logger.debug(`Started connection attempt to ${service.name} - ${service.options.url}`);
        }

        if (!this.channel) {
            this.channel = await this.connection.createChannel();
            this.logger.debug('Connection was successful');
        }
    }

    private async setupQueue(options: IConsumeOptions): Promise<void> {
        if (!this.channel) throw new Error('Channel is not initialized');
        await this.channel.assertQueue(options.queue, { durable: true });
        if (options.prefetchCount) {
            await this.channel.prefetch(options.prefetchCount);
        }
    }

    public async consume(options: IConsumeOptions, consumerCallback: (msg: amqp.ConsumeMessage | null) => void): Promise<void> {
        await this.connect();
        await this.setupQueue(options);

        this.logger.info(`Started consuming messages in queue: ${options.queue}`);
        await this.channel!.consume(options.queue, (msg) => {
            if (msg) {
                consumerCallback(msg);
                this.channel?.ack(msg);
            }
        });
    }

    public async produce(queue: string, message: string, options: amqp.Options.Publish = {}): Promise<void> {
        await this.connect();

        if (!this.channel) {
            throw new Error('Channel is not initialized');
        }

        this.logger.debug(`Sending message to queue: ${queue}`);
        try {
            this.channel!.sendToQueue(queue, Buffer.from(message), options);
            this.logger.debug(`Message sent: ${message}`);
        } catch (error: any & {message: string}) {
            this.logger.debug(`Error sending message to ${queue}: ${error.message}`);
            throw error;
        }
    }
}

export default AmpqRabbitMQ;
