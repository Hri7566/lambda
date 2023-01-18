import EventEmitter from 'events';

export abstract class LambdaClient extends EventEmitter {
    constructor() {
        super();
    }

    public abstract start(): void;

    public abstract stop(): void;

    public abstract sendChat(str: string): void;

    protected abstract bindEventListeners(): void;
}
