import Express, {NextFunction} from "express";
import {IHttpApp, IRouter} from "../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../types";
import {IAppConfig} from "../../config/config";
import ConsoleLogger from "../../../adapters/logger/ConsoleLogger";

@injectable()
export class HttpApp implements IHttpApp {

    app: Express.Application;
    routers: Express.Router[];

    constructor(
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.AppRouter) private appRouter: IRouter,
        @inject(Reference.DataRouter) private dataRouter: IRouter,
        @inject(Reference.ConsoleLogger) private logger: ConsoleLogger,
    ) {
        this.app = Express();
        this.routers = [];

        this.register();
    }

    private register() {
        this.app.use(this.appRouter.router);
        this.app.use(this.dataRouter.router);


        this.app.use(this.error)
    }

    private error(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        console.error(err);
        const status = err.status || 500;
        res.send({
            error: {
                message: err.message || "Internal Server Error",
                status: status,
            },
        });
    }

    public run(): void {
        const port = this.config.dev?.port || 3000;
        this.app.listen(port, () => {
            this.logger.debug(`Server started`, {'port': port});
        });
    }

}