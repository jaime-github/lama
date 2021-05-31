import { Request, Response } from "express";
import { TicketBusiness } from "../business/TicketBusiness";
import { TicketDatabase } from "../data/TicketDatabase";
import { BuyTicketDTO, TicketInputDTO } from "../model/Ticket";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

const ticketBusiness = new TicketBusiness(
  new IdGenerator(),
  new Authenticator(),
  new TicketDatabase()
);

export class TicketController {
  public createTicket = async (req: Request, res: Response) => {
    try {
      const token: string = req.headers.authorization as string;
      const input: TicketInputDTO = {
        name: req.body.name,
        value: req.body.value,
        quantity: req.body.quantity,
        showId: req.body.showId,
      };
      const result = await ticketBusiness.addTicket(input, token);
      res.status(201).send({ Ticket: result });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  };

  public buyTicket = async (req: Request, res: Response) => {
    try {
      const token: string = req.headers.authorization as string;
      const input: BuyTicketDTO = {
        name: req.body.name,
        quantity: req.body.quantity,
        showId: req.body.showId,
      };
      const result = await ticketBusiness.buyTicket(input, token);
      res.status(200).send({ message: "Ticket sold!" });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  };
}
