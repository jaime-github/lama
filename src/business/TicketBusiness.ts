import { TicketDatabase } from "../data/TicketDatabase";
import { BaseError } from "../error/BaseError";
import { BuyTicketDTO, Ticket, TicketInputDTO } from "../model/Ticket";
import { AuthenticationData, Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class TicketBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private authenticator: Authenticator,
    private ticketDatabase: TicketDatabase
  ) {}

  public addTicket = async (ticket: TicketInputDTO, token: string) => {
    try {
      if (!ticket.name || !ticket.quantity || !ticket.showId || !ticket.value) {
        throw new BaseError("Missin input", 422);
      }
      if (ticket.quantity <= 0) {
        throw new BaseError("Invalid quantity, it must be greater than 0", 406);
      }
      if (ticket.value <= 0) {
        throw new BaseError("Invalida value, it must be greater than 0", 406);
      }
      const authentication: AuthenticationData = this.authenticator.getData(
        token
      );
      if (authentication.role !== "ADMIN") {
        throw new BaseError("Only Administrators can register bands.", 401);
      }
      const id = this.idGenerator.generate();
      const newTicket = new Ticket(
        id,
        Ticket.stringToTicketType(ticket.name),
        ticket.value,
        ticket.quantity,
        ticket.showId
      );
      await this.ticketDatabase.createTicket(newTicket);
      return newTicket;
    } catch (error) {
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };

  public buyTicket = async (ticket: BuyTicketDTO, token: string) => {
    try {
      this.authenticator.getData(token);
      if (!ticket.showId || !ticket.name) {
        throw new BaseError("Missing input", 422);
      }
      if (ticket.quantity <= 0) {
        throw new BaseError("Invalid quantity, it must be greater than 0", 406);
      }
      const ticketsAvailables = await this.ticketDatabase.getAllTicket(
        ticket.showId,
        ticket.name
      );
      if (ticketsAvailables === 0) {
        throw new BaseError("We don't have tickets for the show", 404);
      }
      if (ticketsAvailables && ticket.quantity > ticketsAvailables) {
        throw new BaseError(`We have ${ticketsAvailables} for this show.`, 404);
      }
      await this.ticketDatabase.buyTicket(
        ticket.name,
        ticket.quantity,
        ticket.showId
      );
    } catch (error) {
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };
}
