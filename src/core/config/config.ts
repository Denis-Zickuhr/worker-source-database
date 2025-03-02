import { z } from "zod";

const ServiceSchema = z.object({
    name: z.string(),
    options: z.object({
        value: z.string(),
        url: z.string(),
        pass: z.string().optional(),
        user: z.string().optional(),
        token: z.string().optional(),
    }),
});

const DevSchema = z.object({
    port: z.number(),
});

const AppSchema =  z.object({
    name: z.string(),
    options: z.object({
        services: z.array(ServiceSchema),
        dev: DevSchema.optional(),
    })
});

export type Service = z.infer<typeof ServiceSchema>;
type Dev = z.infer<typeof DevSchema>;

export interface IAppConfig {
    name: string;
    services: Service[];
    dev: undefined|Dev;

    findService(serviceName: string): Service;
}

export class AppConfig implements IAppConfig {
    name: string;
    services: Service[];
    dev: undefined|Dev;

    findService(serviceName: string): Service {
        const service = this.services.find((v) => {
            return  v.name === serviceName;
        });

        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service;
    }

    constructor(app: Record<any, any>) {
        const parsedApp = AppSchema.parse(app);

        this.name = parsedApp.name;
        this.services = parsedApp.options.services;
        this.dev = parsedApp.options.dev;
    }
}

export enum Services {
    DATABASE_CONNECTION = 'database-connection',
    SYNC_PRODUCER = 'sync-producer',
    SYNC_CONSUMER = 'sync-consumer',
}
