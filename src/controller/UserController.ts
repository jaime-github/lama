import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";

const userBusiness = new UserBusiness(
  new IdGenerator(),
  new Authenticator(),
  new HashManager(),
  new UserDatabase()
);

export class UserController {
  public signup = async (req: Request, res: Response) => {
    try {
      const input: UserInputDTO = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
      };
      const token = await userBusiness.createUser(input);
      res.status(201).send({ token });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  };

  public login = async (req: Request, res: Response) => {
    try {
      const loginData: LoginInputDTO = {
        email: req.body.email,
        password: req.body.password,
      };
      const token = await userBusiness.login(loginData);
      res.status(200).send({ token });
    } catch (error) {
      res.status(error.statusCode).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  };
}
