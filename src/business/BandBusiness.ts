import { BandDatabase } from "../data/BandDatabase";
import { BaseError } from "../error/BaseError";
import { Band, BandInputDTO } from "../model/Band";
import { AuthenticationData, Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private authenticator: Authenticator,
    private bandDatabase: BandDatabase
  ) {}

  public createBand = async (
    band: BandInputDTO,
    token: string
  ): Promise<any> => {
    try {
      if (!band.name || !band.musicGenre || !band.responsible) {
        throw new BaseError("Fill all the informations", 422);
      }
      const authentication: AuthenticationData = this.authenticator.getData(
        token
      );
      if (authentication.role !== "ADMIN") {
        throw new BaseError("Only Administrators can register bands.", 401);
      }
      const bands = await this.bandDatabase.selectAllBands();
      const bandAlreadyExists =
        bands && bands.find((item) => item.name === band.name);
      if (bandAlreadyExists) {
        throw new BaseError("This band is already registered", 422);
      }
      const id = this.idGenerator.generate();
      const newBand = new Band(
        id,
        band.name,
        band.musicGenre,
        band.responsible
      );
      await this.bandDatabase.createBand(newBand);
      return newBand;
    } catch (error) {
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };

  public getBandByIdOrName = async (
    token: string,
    property: string
  ): Promise<Band> => {
    try {
      this.authenticator.getData(token);
      const band = await this.bandDatabase.selectBandById(property);
      if (!band) {
        throw new BaseError("Band not found.", 404);
      }
      return band;
    } catch (error) {
      throw new BaseError(error.message || error.sqlMessage, error.statusCode);
    }
  };
}
