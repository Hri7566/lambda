function timeLog(method: string, ...args: any[]) {
    let ms = Date.now();

    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    
    let ss = Math.floor(s % 60).toString();
    let mm = Math.floor(m % 60).toString();
    let hh = Math.floor(h % 12).toString();

    let time = `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss.padStart(2, '0')}`;
    (console as any)[method](time, ...args);
}

export class LambdaLogger {
    constructor(
        public id: string,
        public color: (str: string) => string = str => {
            return `\x1b[33m${str}\x1b[0m`;
        }
    ) {}

    public info(...args: any[]) {
        timeLog('log', `\x1b[35mINFO\x1b[0m`, `${this.color(this.id)}`, ...args);
    }

    public error(...args: any[]) {
        timeLog('error', `\x1b[35mERROR\x1b[0m`, `${this.color(this.id)}`, ...args);
    }

    public warn(...args: any[]) {
        timeLog('warn', `\x1b[35mWARNING\x1b[0m`, `${this.color(this.id)}`, ...args);
    }

    public debug(...args: any[]) {
        timeLog('debug', `\x1b[35mDEBUG\x1b[0m`, `${this.color(this.id)}`, ...args);
    }
}
