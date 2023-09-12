import { JwtPayload, Secret, SignOptions, sign, verify } from 'jsonwebtoken';

export default class JWT {
  private static jwtSecret: Secret = process.env.JWT_SECRET || 'xablau';

  private static jwtConfig: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '1d',
  };

  static sign(payload: JwtPayload): string {
    return sign(payload, JWT.jwtSecret, JWT.jwtConfig);
  }

  static verify(token: string) {
    try {
      const tokenUnbearer = token.includes('Bearer') ? token.split(' ')[1] : token;
      return verify(tokenUnbearer, JWT.jwtSecret);
    } catch (e) {
      return 'Token must be a valid token';
    }
  }
}
