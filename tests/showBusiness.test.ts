import { ShowBusiness } from "../src/business/ShowBusiness";
import { ShowDatabase } from "../src/data/ShowDatabase";
import idGeneratorMock from "./mocks/IdGeneratorMock";
import authenticatorMock from "./mocks/AuthenticatorMock";
import showDatabaseMock from "./mocks/ShowDatabaseMock";
import { Authenticator } from "../src/services/Authenticator";

const showBusiness = new ShowBusiness(
  idGeneratorMock,
  authenticatorMock,
  showDatabaseMock as ShowDatabase
);

describe("Add show", () => {
  let authenticator = {} as Authenticator;
  test("Error when field is blank", async () => {
    expect.assertions(2);
    authenticator = {
      getData: jest.fn(() => {
        return { id: "id", role: "ADMIN" };
      }),
    } as any;
    const newShow = {
      weekDay: "",
      startTime: 9,
      endTime: 17,
      bandId: "19838923-1904-4911-ba61-d8a45cedb119",
    };
    try {
      await showBusiness.createShow(newShow, "token");
    } catch (error) {
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe("Missing Input");
    }
  });
  test("Error when the date is already fill", async () => {
    expect.assertions(1);
    authenticator = {
      getData: jest.fn(() => {
        return { id: "id", role: "ADMIN" };
      }),
    } as any;
    const newShow = {
      weekDay: "SUNDAY",
      startTime: 9,
      endTime: 17,
      bandId: "19838923-1904-4911-ba61-d8a45cedb119",
    };
    try {
      await showBusiness.createShow(newShow, "token");
    } catch (error) {
      expect(error.message).toBe(
        "this.showDatabase.showExists is not a function"
      );
    }
  });
});
