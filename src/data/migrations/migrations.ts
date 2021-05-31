import { BaseDatabase } from "../BaseDatabase";

class Migrations extends BaseDatabase {
  public createTables = async (): Promise<void> => {
    try {
      await BaseDatabase.connection.raw(`
      CREATE TABLE IF NOT EXISTS Lama_Bands (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        music_genre VARCHAR(255) NOT NULL,
        responsible VARCHAR(255) UNIQUE NOT NULL 
      );

      CREATE TABLE IF NOT EXISTS Lama_Shows (
        id VARCHAR(255) PRIMARY KEY,
        week_day VARCHAR(255) NOT NULL,
        start_time INT NOT NULL,
        end_time INT NOT NULL,
        band_id VARCHAR(255) NOT NULL,
        FOREIGN KEY(band_id) REFERENCES Lama_Bands(id)
      );

      CREATE TABLE IF NOT EXISTS Lama_Users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT "NORMAL"
      );

      CREATE TABLE IF NOT EXISTS Lama_Tickets (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        value INT NOT NULL,
        quantity INT NOT NULL,
        sold INT NOT NULL,
        show_id VARCHAR(255) NOT NULL,
        FOREIGN KEY(show_id) REFERENCES Lama_Shows(id)
      )

      `);

      console.log("Tables created.");

      BaseDatabase.connection.destroy();
    } catch (error) {
      console.log(error.sqlMessage || error.message);
      BaseDatabase.connection.destroy();
    }
  };
}

new Migrations().createTables();
