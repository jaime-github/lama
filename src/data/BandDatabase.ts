import { Band } from "../model/Band";
import { BaseDatabase } from "./BaseDatabase";

export class BandDatabase extends BaseDatabase {
  private static tableName: string = "Lama_Bands";
  private static dataToModel(data?: any) {
    return (
      data && new Band(data.id, data.name, data.music_genre, data.responsible)
    );
  }

  public createBand = async (band: Band): Promise<void> => {
    try {
      await BaseDatabase.connection
        .insert({
          id: band.id,
          name: band.name,
          music_genre: band.musicGenre,
          responsible: band.responsible,
        })
        .into(BandDatabase.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public selectAllBands = async (): Promise<Band[]> => {
    try {
      const result = await BaseDatabase.connection
        .select("*")
        .from(BandDatabase.tableName);
      const bands: Band[] = [];
      for (let data of result) {
        bands.push(BandDatabase.dataToModel(data));
      }
      return bands;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public selectBandById = async (property: string): Promise<Band> => {
    try {
      const result = await BaseDatabase.connection
        .select("*")
        .from(BandDatabase.tableName)
        .where({ id: property })
        .orWhere({ name: property });
      return BandDatabase.dataToModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };
}
