import { Ticket } from "../model/Ticket";
import { BaseDatabase } from "./BaseDatabase";

export class TicketDatabase extends BaseDatabase {
  private static tableName: string = "Lama_Tickets";

  public createTicket = async (ticket: Ticket): Promise<void> => {
    try {
      await BaseDatabase.connection
        .insert({
          id: ticket.id,
          name: ticket.name,
          value: ticket.value,
          quantity: ticket.quantity,
          show_id: ticket.showId,
        })
        .into(TicketDatabase.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public getAllTicket = async (name: string, show_id: string) => {
    try {
      const result = await BaseDatabase.connection
        .select("*")
        .from(TicketDatabase.tableName)
        .where({ name })
        .andWhere({ show_id });
      if (result.length > 0) {
        return result[0].quantity - result[0].sold;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };

  public buyTicket = async (name: string, quantity: number, showId: string) => {
    try {
      await BaseDatabase.connection.raw(`
        UPDATE Lama_Tickets
        SET sold = sold+${quantity}
        WHERE show_id="${showId}"
        AND name = "${name}"
      `);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  };
}
