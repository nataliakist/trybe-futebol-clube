import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import JWT from '../utils/JWTUtils';
import UserModel from '../models/UserModel';
import { IUserVerify } from '../Interfaces/users/IUser';
import LoginService from '../services/LoginService';

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

    return res.status(200).json({
      token,
    });
  }

  static async getUserRole(req: Request, res: Response) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'user not found' });

    const verifyUser = JWT.verify(token);

    const { user } = verifyUser as IUserVerify;

    const userRole = await LoginService.getUserRole(user.email);
    if (user.role === undefined) return res.status(401).json({ message: 'Invalid user' });

    return res.status(200).json({ role: userRole.role });
  }
}
