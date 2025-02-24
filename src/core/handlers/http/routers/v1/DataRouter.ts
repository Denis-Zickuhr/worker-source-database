import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../../types";
import {IAppConfig} from "../../../../config/config";
import {FollowedService} from "../../../../../services/followed/FollowedService";

@injectable()
export class DataRouter implements IRouter{
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor(
        @inject(Reference.AppConfig) private config: IAppConfig,
        @inject(Reference.IFollowedService) private followedService: FollowedService,
    ) {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.post('/v1/followed', this.followedService.post.bind(this.followedService));
        this._router.patch('/v1/followed', this.followedService.patch.bind(this.followedService));
        this._router.get('/v1/followed', this.followedService.get.bind(this.followedService));
        this._router.delete('/v1/followed', this.followedService.delete.bind(this.followedService));
        this._router.get('/v1/followed/list', this.followedService.list.bind(this.followedService));
    }
}