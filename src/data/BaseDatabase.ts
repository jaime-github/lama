import dotenv from "dotenv";
import knex from "knex";
import Knex from "knex";

dotenv.config();
export abstract class BaseDatabase {
  protected static connection: Knex = knex({
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
    },
  });

  public static async destroyConnection(): Promise<void> {
    await BaseDatabase.connection.destroy();
  }
}
