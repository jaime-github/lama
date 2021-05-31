import { BaseError } from "../error/BaseError";

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly name: TicketTypes,
    public readonly value: number,
    public readonly quantity: number,
    public readonly showId: string
  ) {}

  static stringToTicketType(input: string): TicketTypes {
    switch (input.toUpperCase()) {
      case "NORMAL":
        return TicketTypes.NORMAL;
      case "VIP":
        return TicketTypes.VIP;
      default:
        throw new BaseError(
          "Invalid type name, choose between 'NORMAL' and 'VIP'",
          422
        );
    }
  }
}

export interface TicketInputDTO {
  name: string;
  value: number;
  quantity: number;
  showId: string;
}

export interface BuyTicketDTO {
  name: string;
  quantity: number;
  showId: string;
}

export enum TicketTypes {
  NORMAL = "NORMAL",
  VIP = "VIP",
}
