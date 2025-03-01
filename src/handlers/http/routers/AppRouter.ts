import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../types";
import {injectable} from "inversify";

@injectable()
export class AppRouter implements IRouter{
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor() {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.get('/ping', (req: Express.Request, res: Express.Response) => { res.send('alive')} )
    }
}