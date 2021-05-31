import { ShowDatabase } from "../data/ShowDatabase";
import { BaseError } from "../error/BaseError";
import { AddShowDTO, Show } from "../model/Show";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private authenticator: Authenticator,
    private showDatabase: ShowDatabase
  ) {}

  public createShow = async (show: AddShowDTO, token: string): Promise<any> => {
    try {
      this.authenticator.getData(token);
      if (!show.weekDay || !show.startTime || !show.endTime || !show.bandId) {
        throw new BaseError("Missing Input", 422);
      }
      if (show.weekDay) {
        Show.stringToShowDays(show.weekDay);
      }
      if (show.startTime % 1 !== 0 || show.endTime % 1 !== 0) {
        throw new BaseError(`We only accept "0'clock" hours`, 406);
      }
      if (show.startTime >= show.endTime) {
        throw new BaseError(
          "The start time need to be earlier than end time",
          406
        );
      }
      if (show.startTime < 8 || show.endTime > 23) {
        throw new BaseError("Show hours are only between 8 and 23", 406);
      }
      const showAlreadyExists = await this.showDatabase.showExists(
        show.weekDay,
        show.startTime,
        show.endTime
      );
      if (showAlreadyExists) {
        throw new BaseError("This time already have a show", 406);
      }
      const id = this.idGenerator.generate();
      const newShow = new Show(
        id,
        Show.stringToShowDays(show.weekDay),
        show.startTime,
        show.endTime,
        show.bandId
      );
      await this.showDatabase.addShow(newShow);
      return newShow;
    } catch (error) {
      throw new BaseError(error.message, error.statusCode);
    }
  };

  public getShowsByDay = async (token: string, weekDay: string) => {
    this.authenticator.getData(token);
    if (!weekDay) {
      throw new BaseError("Missing input", 422);
    }
    if (weekDay) {
      Show.stringToShowDays(weekDay);
    }
    const shows = await this.showDatabase.selectShowByDay(weekDay);
    return shows;
  };
}
