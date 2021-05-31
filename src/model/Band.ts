export class Band {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly musicGenre: string,
    public readonly responsible: string
  ) {}
}

export interface BandInputDTO {
  name: string;
  musicGenre: string;
  responsible: string;
}
