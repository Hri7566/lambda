import { readdirSync } from 'fs';
import { LambdaClient } from './LambdaClient';
import { LambdaLogger } from './LambdaLogger';
import { resolve } from 'path';
import EventEmitter from 'events';

export class LambdaCommand {
    constructor(
        public id: string,
        public aliases: string[],
        public commandGroup: string,
        public permissionGroups: string[],
        public callback: (msg: LambdaExtendedChatMessage, cl: LambdaClient) => Promise<void | string> | void | string,
        public visible: boolean = false
    ) {}
}

export interface LambdaPrefix {
    prefix: string;
    separated: boolean;
}

export interface LambdaExtendedChatMessage extends MPPChatMessageIncoming {
    args: string[];
    argcat: string;
    cmd: string;
    usedPrefix: LambdaPrefix;
}

export class LambdaCommandHandler {
    public static logger = new LambdaLogger(`Command Handler`);

    public static prefixes: LambdaPrefix[] = [
        {
            prefix: '=',
            separated: false
        },
        {
            prefix: 'lambda',
            separated: true
        },
        {
            prefix: 'λ',
            separated: false
        }
    ];

    public static commands: LambdaCommand[] = [];

    public static handleCommand(cl: LambdaClient, omsg: MPPChatMessageIncoming, disabled?: string[]) {
        // check message prefix
        let msg: LambdaExtendedChatMessage;
        let args = omsg.a.split(' ');
        let usedPrefix;
        let cmd = '';
        let argcat = omsg.a.substring(args[0].length).trim();

        for (let prefix of this.prefixes) {
            if (prefix.separated) {
                if (args[0] == prefix.prefix) {
                    usedPrefix = prefix;
                    args.shift();
                    cmd = args[0];
                }
            } else {
                if (omsg.a.startsWith(prefix.prefix)) {
                    usedPrefix = prefix;
                    cmd = args[0].substring(prefix.prefix.length);
                }
            }
        }

        if (!usedPrefix) return;

        // check for command
        
        let foundCmd;
        for (let c of this.commands) {
            for (let a of c.aliases) {
                if (cmd == a) {
                    foundCmd = c
                }
            }
        }

        if (!foundCmd) return;

        if (disabled) {
            if (disabled.includes(foundCmd.id)) return cl.sendChat('This command is disabled.');
        }

        msg = {
            a: omsg.a,
            m: omsg.m,
            p: omsg.p,
            t: omsg.t,
            argcat,
            args,
            cmd,
            usedPrefix
        }

        try {
            (async () => {
                let out = await foundCmd.callback(msg, cl);
                this.emit('command output', msg, cl, out);
                if (out) {
                    cl.sendChat(out);
                }
            })();
        } catch (err) {
            cl.sendChat(`An error has occurred.`);
            this.logger.error(err);
        }
    }

    public static registerCommands(): void {
        this.commands = [];

        let files = readdirSync(resolve((globalThis as any).__approot, '../cmd'));

        for (let file of files) {
            if (file.endsWith('.js')) {
                let cmd: LambdaCommand = require(resolve((globalThis as any).__approot, '../cmd/', file));
                this.logger.debug(`Registering command ${cmd.id}`);
                LambdaCommandHandler.addCommand(cmd);
            }
        }
    }

    public static addCommand(cmd: LambdaCommand): void {
        this.commands.push(cmd);
    }

    public static on = EventEmitter.prototype.on;
    public static off = EventEmitter.prototype.off;
    public static once = EventEmitter.prototype.once;
    public static emit = EventEmitter.prototype.emit;
}
