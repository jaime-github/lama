export class IdGeneratorMock {
  public generate(): string {
    return "id";
  }
}

export default new IdGeneratorMock();
