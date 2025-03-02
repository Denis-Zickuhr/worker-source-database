import {DocumentWithId, IDataBaseRepository} from "../database/repository/types";
import {DataBaseRepository} from "../database/repository/DataBaseRepository";
import {inject, injectable} from "inversify";
import {Reference} from "../../types";
import {IDataBaseClient} from "../database/client/types";
import {IRepositoryFactory} from "./types";

@injectable()
export class RepositoryFactory implements IRepositoryFactory {

    constructor(
        @inject(Reference.IDatabaseClient) private readonly client: IDataBaseClient,
    ) {
    }

    create<T extends DocumentWithId>(table: string): IDataBaseRepository<T> {
        return new DataBaseRepository<T>(this.client, table);
    }

}