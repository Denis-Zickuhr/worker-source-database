import {DocumentWithId, IDataBaseRepository} from "../database/repository/types";

export interface IRepositoryFactory {
    create<T extends DocumentWithId>(table: string): IDataBaseRepository<T>;
}