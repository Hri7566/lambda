import { readFileSync } from 'fs';
import { resolve } from 'path';
import YAML from 'yaml';

export class LambdaUtil {
    public static loadConfig<T>(path: string): T {
        return YAML.parse(readFileSync(resolve((globalThis as any).__configroot, path)).toString());
    }
}
