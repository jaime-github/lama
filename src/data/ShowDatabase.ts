import { BaseError } from "../error/BaseError";
import { Show } from "../model/Show";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  private static tableName: string = "Lama_Shows";

  public addShow = async (show: Show): Promise<void> => {
    try {
      await BaseDatabase.connection
        .insert({
          id: show.id,
          week_day: show.weekDay,
          start_time: show.startTime,
          end_time: show.endTime,
          band_id: show.bandId,
        })
        .into(ShowDatabase.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public showExists = async (
    weekDay: string,
    startTime: number,
    endTime: number
  ): Promise<any> => {
    try {
      const result = await BaseDatabase.connection
        .select("*")
        .from(ShowDatabase.tableName)
        .where({ week_day: weekDay })
        .andWhere("start_time", "<", endTime)
        .andWhere("end_time", ">", startTime);
      if (result.length > 0) {
        return true;
      }
    } catch (error) {
      throw new BaseError("This time already have a show", 406);
    }
  };

  public selectShowByDay = async (weekDay: string): Promise<any> => {
    try {
      const show = await BaseDatabase.connection.raw(`
      SELECT Lama_Bands.name as bandName, Lama_Bands.music_genre as musicGenre
      FROM Lama_Shows
      LEFT JOIN Lama_Bands
      ON Lama_Shows.band_id = Lama_Bands.id
      WHERE Lama_Shows.week_day = "${weekDay}"
      ORDER BY Lama_Shows.start_time ASC;
      `);
      return show[0];
    } catch (error) {
      throw new Error(error.message || error.message);
    }
  };
}
