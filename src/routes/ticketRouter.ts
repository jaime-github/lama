import express, { Router } from "express";
import { TicketController } from "../controller/TicketController";

export const ticketRouter = express.Router();

const ticketController = new TicketController();

ticketRouter.post("/create", ticketController.createTicket);
ticketRouter.post("/buy", ticketController.buyTicket);
