import { User, UserRole } from "../../src/model/User";

export const normalUserMock = new User(
  "id",
  "name",
  "normal@email.com",
  "normal password",
  UserRole.NORMAL
);

export const adminUserMock = new User(
  "id",
  "name",
  "admin@email.com",
  "admin password",
  UserRole.ADMIN
);
