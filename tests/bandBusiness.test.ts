import { BandBusiness } from "../src/business/BandBusiness";
import { BandDatabase } from "../src/data/BandDatabase";
import idGeneratorMock from "./mocks/IdGeneratorMock";
import authenticatorMock from "./mocks/AuthenticatorMock";
import bandDatabaseMock from "./mocks/BandDatabaseMock";
import { BandInputDTO } from "../src/model/Band";
import { Authenticator } from "../src/services/Authenticator";

const bandBusiness = new BandBusiness(
  idGeneratorMock,
  authenticatorMock,
  bandDatabaseMock as BandDatabase
);

describe("Create band", () => {
  let authenticator = {} as Authenticator;

  test("Error when role is not admin", async () => {
    expect.assertions(2);
    authenticator = {
      getData: jest.fn(() => {
        return { id: "id", role: "NORMAL" };
      }),
    } as any;

    const newBand: BandInputDTO = {
      name: "Muito bom",
      musicGenre: "Pop",
      responsible: "Pica-pau",
    };
    try {
      await bandBusiness.createBand(newBand, "token");
    } catch (error) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Only Administrators can register bands.");
    }
  });

  test("Create succesfully", async () => {
    expect.assertions(0);
    authenticator = {
      getData: jest.fn(() => {
        return { id: "id", role: "ADMIN" };
      }),
    } as any;
    const newBand: BandInputDTO = {
      name: "Interestellar",
      musicGenre: "Trap",
      responsible: "Eren",
    };
    try {
      const result = await bandBusiness.createBand(newBand, "token");
      expect(result).toEqual({
        id: "bandId",
        name: "Interestellar",
        musicGenre: "Trap",
        responsible: "Eren",
      });
    } catch (error) {}
  });
});
