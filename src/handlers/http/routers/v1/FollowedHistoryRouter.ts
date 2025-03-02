import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import {IFollowedHistoryHttpService} from "../../../../adapters/services/types";

@injectable()
export class FollowedHistoryRouter implements IRouter {
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor(
        @inject(Reference.IFollowedHistoryHttpService) private service: IFollowedHistoryHttpService,
    ) {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.get('/list', this.service.list.bind(this.service));
    }
}