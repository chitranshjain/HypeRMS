import type { Knex } from "knex";
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            database: process.env.DB_NAME || "release_tracker",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./src/db/migrations"
        }
    },
    test: {
        client: "postgresql",
        connection: {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            database: "release_tracker_test", // Separate test database
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./src/db/migrations"
        }
    }
};

export default config;
