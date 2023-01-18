import { LambdaClient } from './LambdaClient';
import { LambdaClientManager } from './LambdaClientManager';
import { LambdaData } from './LambdaData';
import { LambdaLogger } from './LambdaLogger';
import { LambdaUtil } from './LambdaUtil';

export interface LambdaConfig {
    
}

export class Lambda {
    public static config: LambdaConfig = LambdaUtil.loadConfig<LambdaConfig>('lambda.yml')
    public static logger: LambdaLogger = new LambdaLogger('Lambda', str => `\x1b[33m${str}\x1b[0m`);

    public static async start(): Promise<void> {
        await LambdaData.connect();
        LambdaClientManager.start();
        this.logger.info('Ready');
    }

    public static async stop(): Promise<void> {
        
    }
}
