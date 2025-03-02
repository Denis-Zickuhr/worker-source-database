import Express from "express";
import {IHttpApp, IRouter} from "../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../types";
import {IAppConfig} from "../../core/config/config";
import ConsoleLogger from "../../adapters/logger/ConsoleLogger";
import {ZodError} from "zod";
import 'express-async-errors';
import {HttpStatus, HttpStatusMessage} from "../../adapters/http/status";

@injectable()
export class HttpApp implements IHttpApp {

    app: Express.Application;
    routers: Express.Router[];

    constructor(
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.AppRouter) private appRouter: IRouter,
        @inject(Reference.FollowedRouter) private followedRouter: IRouter,
        @inject(Reference.FollowedDataRouter) private followedDataRouter: IRouter,
        @inject(Reference.FollowedDataHistoryRouter) private followedDataHistoryRouter: IRouter,
        @inject(Reference.ConsoleLogger) private logger: ConsoleLogger,
    ) {
        this.app = Express();
        this.routers = [];

        this.register();
    }

    private register() {
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({ extended: true }));
        this.app.use(this.appRouter.router);
        this.app.use('/v1/followed', this.followedRouter.router);
        this.app.use('/v1/followed/data', this.followedDataRouter.router);
        this.app.use('/v1/followed/history', this.followedDataHistoryRouter.router);

        this.app.use(this.error);
    }

    private error(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        if (err instanceof ZodError) {
            res.status(HttpStatus.BAD_REQUEST).send({status: HttpStatusMessage(HttpStatus.BAD_REQUEST), error: err});
            return;
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({status: HttpStatusMessage(HttpStatus.INTERNAL_SERVER_ERROR)});
        next(err);
        return;
    }

    public run(): void {
        const port = this.config.dev?.port || 3000;
        this.app.listen(port, () => {
            this.logger.debug(`Server started`, {'port': port});
        });
    }

}