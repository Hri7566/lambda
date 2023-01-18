import { LambdaClientMPP } from './LambdaClientMPP';

export interface Vector2 {
    x: number;
    y: number;
}

export class LambdaCursor {
    public pos: Vector2 = {
        x: 0,
        y: 0
    }

    public vel: Vector2 = {
        x: 0,
        y: 0
    }

    public follow: string = '';

    public followPos: Vector2 = {
        x: 0,
        y: 0
    }

    private sendInterval: NodeJS.Timer;
    private updateInterval: NodeJS.Timer;

    constructor(public cl: LambdaClientMPP) {
        this.cl.client.on('m', (msg: MPPCursorMessageIncoming) => {
            if (msg.id !== this.follow) return;

            let x = msg.x;
            let y = msg.y;

            if (typeof x == 'string') {
                try {
                    x = parseInt(x);
                } catch (err) {
                    x = 0;
                }
            }

            if (typeof y == 'string') {
                try {
                    y = parseInt(y);
                } catch (err) {
                    y = 0;
                }
            }

            this.followPos = { x, y };
        });

        this.sendInterval = setInterval(() => {
            this.sendCursorPos();
        }, 1000 / 20);

        this.updateInterval = setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    public sendCursorPos(): void {
        this.cl.client.sendArray([{
            m: 'm',
            x: this.pos.x,
            y: this.pos.y
        }]);
    }

    public update(): void {
        
    }
}
