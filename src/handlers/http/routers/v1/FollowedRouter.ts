import Express, {Router} from "express";
import e from "express";
import {IRouter} from "../../../types";
import {inject, injectable} from "inversify";
import {Reference} from "../../../../types";
import {IFollowedHttpService} from "../../../../adapters/services/types";

@injectable()
export class FollowedRouter implements IRouter {
    private readonly _router: Router;


    get router(): e.Router {
        return this._router;
    }

    constructor(
        @inject(Reference.IFollowedHttpService) private followedService: IFollowedHttpService,
    ) {
        this._router = Express.Router();
        this.setup();
    }

    private setup() {
        this._router.post('', this.followedService.post.bind(this.followedService));
        this._router.patch('', this.followedService.patch.bind(this.followedService));
        this._router.get('', this.followedService.get.bind(this.followedService));
        this._router.delete('', this.followedService.delete.bind(this.followedService));
        this._router.get('/list', this.followedService.list.bind(this.followedService));
    }
}