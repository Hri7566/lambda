import { Client } from 'pg';
import { LambdaLogger } from './LambdaLogger';

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export class LambdaData {
    public static db = new Client({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        connectionTimeoutMillis: 30000
    });

    public static logger = new LambdaLogger('Data');

    public static async connect(): Promise<void> {
        await this.db.connect();
        this.logger.info(`Connected to database`);

        this.db.on('error', err => {
            this.logger.error(err);
        });

        await this.defaultInit();
    }

    public static async disconnect() {
        await this.db.end();
    }

    public static async defaultInit() {
        let existingTables = (await this.db.query(`SELECT * FROM pg_catalog.pg_tables;`)).rows.map(val => val.tablename);
        if (!existingTables.includes('users')) {
            await this.createTable('users', '_id varchar(24)', 'name varchar(512)', 'color varchar(9)');
        }
        if (!existingTables.includes('nh')) {
            await this.createTable('nh', '_id varchar(24)', 'history TEXT');
        }
    }

    public static async createTable(table: string, ...args: string[]): Promise<void> {
        await this.db.query(`CREATE TABLE ${table} (${args.join(', ')});`);
    }

    public static async insertUser(user: MPPParticipant): Promise<boolean> {
        if (await this.userExists(user._id)) return false;
        await this.db.query(`INSERT INTO users VALUES($1, $2, $3)`, [user._id, user.name, user.color]);
        return true;
    }

    public static async userExists(_id: string) {
        return (await this.db.query(`SELECT * FROM users WHERE _id = $1`, [_id])).rowCount > 0;
    }

    public static async nameHistoryExists(_id: string) {
        return (await this.db.query(`SELECT * FROM nh WHERE _id = $1`, [_id])).rowCount > 0;
    }

    public static async getNameHistory(_id: string) {
        let nhstr = await (await this.db.query(`SELECT * FROM nh WHERE _id = $1`, [_id])).rows[0];
        console.log(nhstr);
        if (!nhstr) return;
        return JSON.parse(nhstr);
    }

    public static async setNameHistory(_id: string, nh: string[]) {
        await this.db.query(`UPDATE nh SET history = $1 WHERE _id = $2;`, [JSON.stringify(nh), _id]);
    }

    public static async insertNameHistory(_id: string, ...names: string[]) {
        if (await this.nameHistoryExists(_id)) return false;
        await this.db.query(`INSERT INTO nh VALUES($1, $2)`, [_id, JSON.stringify(names)]);
    }

    public static async getUser(_id: string) {
        return (await this.db.query(`SELECT * FROM users WHERE _id = $1`, [_id])).rows[0];
    }

    public static async updateUser(_id: string, user: MPPParticipant) {
        await this.db.query(`UPDATE users SET name = $2, color = $3 WHERE _id = $1`, [user._id, user.name, user.color]);
    }

    public static async addName(_id: string, name: string) {
        if (!(await this.nameHistoryExists(_id))) {
            await this.insertNameHistory(_id, name);
        }

        let nh = await this.getNameHistory(_id);
        nh.push(name);
        await this.setNameHistory(_id, nh);
    }
}
