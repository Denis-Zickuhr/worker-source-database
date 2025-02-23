import {Router} from "express";
import {ArgumentsCamelCase, CommandModule} from "yargs";

export type IHttpApp = {
    run(): void;
}

export type ICliApp = {
    run(): Promise<void>;
}

export type IRouter = {
    router: Router
}

export type ICommand = {
    handler(argv: ArgumentsCamelCase): void;
    getCommand(): CommandModule
}