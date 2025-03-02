import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import {IFollowedDataHttpService} from "../../../../adapters/services/types";

@injectable()
export class FollowedDataRouter implements IRouter {
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor(
        @inject(Reference.IFollowedDataHttpService) private service: IFollowedDataHttpService,
    ) {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.get('', this.service.get.bind(this.service));
        this._router.get('/list', this.service.list.bind(this.service));
        this._router.delete('', this.service.delete.bind(this.service));
    }
}