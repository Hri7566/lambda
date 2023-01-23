import { LambdaClient } from './LambdaClient';
import { LambdaLogger } from './LambdaLogger';
import { LambdaUtil } from './LambdaUtil';
import { LambdaClientMPP } from './MPP/LambdaClientMPP';

export interface ClientManagerConfig {
    enable_mpp: boolean;
}

export interface ClientManagerConfigMPP {
    channels: MPPChannelConfig[];
    user: MPPParticipant;
}

const config: ClientManagerConfig = LambdaUtil.loadConfig('client_manager.yml');
const mppConfig: ClientManagerConfigMPP = LambdaUtil.loadConfig('mpp.yml');

export class LambdaClientManager {
    public static clients: LambdaClient[] = [];
    public static logger: LambdaLogger = new LambdaLogger('Client Manager');

    public static started = false;

    public static start() {
        if (this.started) return;
        this.started = true;
        this.logger.info('Starting clients...');
        
        if (config.enable_mpp) {
            this.logger.info('Starting MPP clients...');
            
            for (let chConfig of mppConfig.channels) {
                let cl = new LambdaClientMPP(chConfig, mppConfig.user);
                this.clients.push(cl);
            }

            delete process.env.MPPCLONE_TOKEN;
            this.logger.info('Deleted MPP token environment variable');
        }

        for (const cl of this.clients) {
            cl.start();
        }
    }

    public static stop() {

    }
}
