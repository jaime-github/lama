import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static tableName: string = "Lama_Users";

  public async createUser(user: User): Promise<void> {
    try {
      await BaseDatabase.connection
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        })
        .into(UserDatabase.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async login(email: string): Promise<User> {
    try {
      const result = await BaseDatabase.connection
        .select("*")
        .from(UserDatabase.tableName)
        .where({ email });

      return User.toUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new UserDatabase();
