import {ITableService, TableEntry} from "../../types";
import {injectable} from "inversify";

@injectable()
export class MongodbTableService implements ITableService {

    *paginate(): Generator<TableEntry> {
        const fakeData = [
            {
                id: "1a9747a6f83312354bb8d681dbb9eba2", document : "wp_ativos", "source": "https://x8zqplm3/SOkAIJS",
            },
            {
                id: "1a9747a6f83312354bb8d681dbb9eba2", document : "wp_ativos", "source": "https://x8zqplm3/SOkAIJS",
            },
            {
                id: "1a9747a6f83312354bb8d681dbb9eba2", document : "wp_ativos", "source": "https://x8zqplm3/SOkAIJS",
            },
        ];

        for (const fakeDatum of fakeData) {
            yield fakeDatum;
        }
    }
}