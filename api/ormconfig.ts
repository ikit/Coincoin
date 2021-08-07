require("dotenv").config();
import { ConnectionOptions } from 'typeorm';

const isDev = process.env.NODE_ENV === "development";
const srcPath = isDev ? "src" : "build";
const fileExt = isDev ? "ts" : "js";

export default {
    name: "default",
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [`${srcPath}/entities/**/*.${fileExt}`],
    migrations: [`${srcPath}/migration/**/*.${fileExt}`],
    subscribers: [`${srcPath}/subscriber/**/*.${fileExt}`],
    cli: {
        entitiesDir: `${srcPath}/entities`,
        migrationsDir: `${srcPath}/migration`,
        subscribersDir: `${srcPath}/subscriber`
    }
} as ConnectionOptions;
