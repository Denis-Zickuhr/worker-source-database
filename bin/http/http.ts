import 'reflect-metadata';
import {config} from 'dotenv';
import {container} from "../../src/container";
import {IHttpApp} from "../../src/core/types";
import {Reference} from "../../src/types";

config();

(() => {
    try {
        const app = container.get<IHttpApp>(Reference.HttpApp);
        app.run();
    } catch (err: unknown) {
        console.error(err);
    }
})();