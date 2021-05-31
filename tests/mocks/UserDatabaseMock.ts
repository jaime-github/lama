import { User } from "../../src/model/User";

export class UserDatabaseMock {
  public async createUser(user: User): Promise<void> {}
}

export default new UserDatabaseMock();
