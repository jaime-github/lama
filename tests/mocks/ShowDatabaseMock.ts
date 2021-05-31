import { Show } from "../../src/model/Show";

export class BandDatabaseMock {
  public async addShow(show: Show): Promise<void> {}
}

export default new BandDatabaseMock();
