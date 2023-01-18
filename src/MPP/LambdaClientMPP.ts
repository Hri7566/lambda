import { LambdaClient } from '../LambdaClient';
import { LambdaLogger } from '../LambdaLogger';
import { LambdaCursor } from './LambdaCursor';
const MPPClient = require('mppclone-client');

const MPPCLONE_TOKEN = process.env.MPPCLONE_TOKEN;

export class LambdaClientMPP extends LambdaClient {
    public client: typeof MPPClient;
    public disabledCommands: string[];
    public logger = new LambdaLogger('Lambda Client');

    public desiredUser: MPPParticipant;
    public desiredChannel: string;

    public cursor;

    constructor(config: MPPChannelConfig, user: MPPParticipant) {
        super();
        this.client = new MPPClient(config.uri, MPPCLONE_TOKEN);
        this.client.setChannel(config);
        
        this.disabledCommands = [];
        if (config.disable) {
            this.disabledCommands.push(...config.disable);
        }

        this.desiredUser = config.user || user;
        this.desiredChannel = config._id;

        this.cursor = new LambdaCursor(this);

        this.bindEventListeners();
    }

    public override start(): void {
        this.client.start();
        this.client.setChannel(this.desiredChannel);
    }

    public override stop(): void {
        this.client.stop();
    }

    protected override bindEventListeners(): void {
        this.client.on('a', (msg: MPPChatMessageIncoming) => {
            this.logger.info(`${msg.p.name}: ${msg.a}`);
        });

        this.client.on('hi', (msg: MPPHiMessageIncoming) => {
            this.setUser();
        });
    }

    public override sendChat(str: string): void {
        this.client.sendArray([{
            m: 'a',
            message: `\u034f${str}`
        }]);
    }

    public setUser(user: MPPParticipant = this.desiredUser): void {

        this.client.sendArray([{
            m: 'userset',
            set: user
        }]);
    }
}
