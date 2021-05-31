import { BaseError } from "../error/BaseError";

export class Show {
  constructor(
    public readonly id: string,
    public readonly weekDay: ShowDays,
    public readonly startTime: number,
    public readonly endTime: number,
    public readonly bandId: string
  ) {}

  static stringToShowDays(input: string): ShowDays {
    switch (input.toUpperCase()) {
      case "FRIDAY":
        return ShowDays.FRIDAY;
      case "SATURDAY":
        return ShowDays.SATURDAY;
      case "SUNDAY":
        return ShowDays.SUNDAY;
      default:
        throw new BaseError("Invalid day for show", 422);
    }
  }
}

export interface AddShowDTO {
  weekDay: string;
  startTime: number;
  endTime: number;
  bandId: string;
}

export enum ShowDays {
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
