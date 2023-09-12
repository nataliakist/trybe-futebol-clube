import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import JWT from '../utils/JWTUtils';
import UserModel from '../models/UserModel';

export default class LoginController {
  private model: UserModel = new UserModel();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await this.model.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = JWT.sign({ user });
    console.log({ user });

    return res.status(200).json({
      token,
    });
  }
}
