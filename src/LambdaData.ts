import { Client } from 'pg';
import { LambdaLogger } from './LambdaLogger';

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export class LambdaData {
    public static db = new Client({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });

    public static logger = new LambdaLogger('Data');

    public static async connect(): Promise<void> {
        await this.db.connect();
        this.logger.info(`Connected to database`);

        this.db.on('error', err => {
            this.logger.error(err);
        });

        // await this.db.query('DROP TABLE users;');
        await this.defaultInit();
    }

    public static async defaultInit() {
        let existingTables = (await this.db.query(`SELECT * FROM pg_catalog.pg_tables;`)).rows.map(val => val.tablename);
        if (!existingTables.includes('users')) {
            await this.createTable('users', '_id varchar(24)', 'name varchar(512)', 'id varchar(24)', 'color varchar(9)');
        }
    }

    public static async createTable(table: string, ...args: string[]): Promise<void> {
        await this.db.query(`CREATE TABLE ${table} (${args.join(', ')});`);
    }
}
