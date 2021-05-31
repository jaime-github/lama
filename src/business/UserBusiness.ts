import { UserInputDTO, LoginInputDTO, User } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";

export class UserBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private authenticator: Authenticator,
    private hashManager: HashManager,
    private userDatabase: UserDatabase
  ) {}

  public createUser = async (user: UserInputDTO): Promise<any> => {
    try {
      if (!user.email || !user.password || !user.name) {
        throw new BaseError("Fill all the informations", 422);
      }
      if (user.password.length < 6) {
        throw new BaseError(
          "'password' must contain at least 6 characters",
          422
        );
      }
      if (user.email.indexOf("@") === -1) {
        throw new BaseError("Invalid email", 422);
      }
      const id = this.idGenerator.generate();
      const hashPassword = await this.hashManager.hash(user.password);
      const newUser = new User(
        id,
        user.name,
        user.email,
        hashPassword,
        User.stringToUserRole(user.role)
      );
      await this.userDatabase.createUser(newUser);
      const accessToken = this.authenticator.generateToken({
        id,
        role: user.role,
      });

      return accessToken;
    } catch (error) {
      if (error.message.includes("key", "email")) {
        throw new BaseError("Email already in use", 409);
      }
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };

  public login = async (user: LoginInputDTO): Promise<any> => {
    try {
      if (!user.email || !user.password) {
        throw new BaseError("Please, fill the fields email and password", 422);
      }
      const userFromDB = await this.userDatabase.login(user.email);
      if (!user) {
        throw new BaseError("Invalid credentials", 401);
      }
      const hashCompare = await this.hashManager.compare(
        user.password,
        userFromDB.password
      );
      if (!hashCompare) {
        throw new BaseError("Invalid credentials", 401);
      }
      const accessToken = this.authenticator.generateToken({
        id: userFromDB.id,
        role: userFromDB.role,
      });
      return accessToken;
    } catch (error) {
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };
}
