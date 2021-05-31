import { UserBusiness } from "../src/business/UserBusiness";
import { UserDatabase } from "../src/data/UserDatabase";
import { UserRole } from "../src/model/User";
import hashGeneratorMock from "./mocks/HashManagerMock";
import idGeneratorMock from "./mocks/IdGeneratorMock";
import authenticatorMock from "./mocks/AuthenticatorMock";
import userDatabaseMock from "./mocks/UserDatabaseMock";

const userBusiness = new UserBusiness(
  idGeneratorMock,
  authenticatorMock,
  hashGeneratorMock,
  userDatabaseMock as UserDatabase
);

describe("Signup", () => {
  test("Error when name is blank", async () => {
    expect.assertions(2);
    const newUser = {
      name: "",
      email: "jose@gmail.com",
      password: "123456789",
      role: UserRole.NORMAL,
    };
    try {
      await userBusiness.createUser(newUser);
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe("Fill all the informations");
    }
  });
  test("Error when email is invalid", async () => {
    expect.assertions(2);
    try {
      const newUser = {
        name: "José",
        email: "josegmail.com",
        password: "123456789",
        role: UserRole.NORMAL,
      };
      await userBusiness.createUser(newUser);
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe("Invalid email");
    }
  });
  test("Error when password is invalid", async () => {
    expect.assertions(2);
    try {
      const newUser = {
        name: "José",
        email: "jose@gmail.com",
        password: "12",
        role: UserRole.NORMAL,
      };
      await userBusiness.createUser(newUser);
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe(
        "'password' must contain at least 6 characters"
      );
    }
  });
  test("Error when role is invalid", async () => {
    expect.assertions(2);
    try {
      const newUser = {
        name: "José",
        email: "jose@gmail.com",
        password: "123456789",
        role: "GUEST",
      };
      await userBusiness.createUser(newUser);
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe("Invalid user role");
    }
  });
  test("Success", async () => {
    expect.assertions(1);
    try {
      const newUser = {
        name: "José",
        email: "jose@gmail.com",
        password: "123456789",
        role: "ADMIN",
      };
      const { accessToken } = await userBusiness.createUser(newUser);
      expect(accessToken).toBe("token");
    } catch (error) {}
  });
});

describe("Login", () => {
  test("Error when some field is blank", async () => {
    expect.assertions(2);
    const newUser = {
      email: "",
      password: "123456789",
    };
    try {
      await userBusiness.login(newUser);
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe("Please, fill the fields email and password");
    }
  });
});
