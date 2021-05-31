import { Request, Response } from "express";
import { BandBusiness } from "../business/BandBusiness";
import { BandDatabase } from "../data/BandDatabase";
import { BandInputDTO } from "../model/Band";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

const bandBusiness = new BandBusiness(
  new IdGenerator(),
  new Authenticator(),
  new BandDatabase()
);

export class BandController {
  public createBand = async (req: Request, res: Response) => {
    try {
      const token: string = req.headers.authorization as string;
      const input: BandInputDTO = {
        name: req.body.name,
        musicGenre: req.body.musicGenre,
        responsible: req.body.responsible,
      };
      const result = await bandBusiness.createBand(input, token);
      res.status(201).send({ Band: result });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  };

  public selectOneBand = async (req: Request, res: Response) => {
    try {
      const token: string = req.headers.authorization as string;
      const { term } = req.query;
      const band = await bandBusiness.getBandByIdOrName(token, term as string);
      res.status(200).send({ Band: band });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  };
}
