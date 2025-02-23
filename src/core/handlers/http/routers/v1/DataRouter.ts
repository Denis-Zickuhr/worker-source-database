import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../../types";
import {IAppConfig} from "../../../../config/config";

@injectable()
export class DataRouter implements IRouter{
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor(
        @inject(Reference.AppConfig) private config: IAppConfig,
    ) {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.get('/v1/sample', (req: Express.Request, res: Express.Response) => { res.send({
            status: 200,
            data: {
                ...this.config,
            }
        })}
        )
    }
}