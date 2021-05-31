import * as jwt from "jsonwebtoken";

export class Authenticator {
  private static expiresIn: string = process.env.JWT_EXPIRE_TIME!;

  public generateToken = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
        role: input.role,
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: Authenticator.expiresIn,
      }
    );
    return newToken;
  };

  public getData(token: string) {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = { id: payload.id, role: payload.role };
    return result;
  }
}

export interface AuthenticationData {
  id: string;
  role: string;
}

export default new Authenticator();
