import 'reflect-metadata';
import {config} from 'dotenv';
import {container} from "../../src/container";
import {ICliApp} from "../../src/core/types";
import {Reference} from "../../src/types";

config();

(async () => {
    try {
        const app = container.get<ICliApp>(Reference.CliApp);
        await app.run();
    } catch (err: unknown) {
        console.error(err);
    }
})();