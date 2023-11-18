import { LambdaClient } from '../LambdaClient';
import { LambdaCommandHandler } from '../LambdaCommandHandler';
import { LambdaData } from '../LambdaData';
import { LambdaLogger } from '../LambdaLogger';
import { LambdaCursor } from './LambdaCursor';
import MPPClient from "mpp-client-net";
const ftc = require('fancy-text-converter');

const MPPCLONE_TOKEN = process.env.MPPCLONE_TOKEN || "";

export class LambdaClientMPP extends LambdaClient {
    public client: MPPClient;
    public disabledCommands: string[];
    public logger = new LambdaLogger('Lambda Client');

    public desiredUser: MPPParticipant;
    public desiredChannel: string;

    public cursor;

    constructor(config: MPPChannelConfig, user: MPPParticipant) {
        super();
        this.client = new MPPClient(config.uri, MPPCLONE_TOKEN);
        this.client.setChannel(config._id, config.set);
        
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
            const _id = this.client.desiredChannelId;
            this.logger.info(ftc.normalise(_id) + `[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}`);
            LambdaCommandHandler.handleCommand(this, msg, this.disabledCommands);
        });

        this.client.on('hi', (msg) => {
            this.setUser();
        });

        (this.client as unknown as any).on('participant added', async (p: MPPParticipant) => {
            await LambdaData.insertUser(p);
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

    public pollChannelList(): void {
        this.client.sendArray([{
            m: '+ls'
        }]);

        this.client.once('ls', (msg: MPPChannelListMessageIncoming) => {
            this.client.sendArray([{
                m: '-ls'
            }]);
        });
    }
}
