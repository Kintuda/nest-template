require("dotenv").config();
import { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    connectionString: process.env.DB_CONNECTION_URL,
    timezone: "utc",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "migrations",
  },
};

export default config;
