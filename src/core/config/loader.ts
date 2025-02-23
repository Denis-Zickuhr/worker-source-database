import * as path from "node:path";
import * as fs from "node:fs";
import { parse } from "yaml";

class ConfigLoader {
    private readonly filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    public load(): Record<any, any> {
        const filePath = path.resolve(__dirname, "..", "..", "..", this.filename);
        const rawData = fs.readFileSync(filePath, "utf-8");
        return this.loadAndProcessConfig(rawData);
    }

    private loadAndProcessConfig(fileContent: string): any {
        const processedContent = fileContent.replace(/\${{([^}]+)}}/g, (match) => {
            return this.resolveEnvVar(match) || match;
        });

        return parse(processedContent);
    }

    private resolveEnvVar(placeholder: string): string | null {
        const regex = /\${{([^}]+)}}/;

        const match = placeholder.match(regex);
        if (!match) return placeholder;

        const envVarName = match[1].split(':-')[0];
        const defaultValue = match[1].split(':-')[1] || null;

        const envValue = process.env[envVarName];

        return envValue || defaultValue || null;
    }
}

export default ConfigLoader;
