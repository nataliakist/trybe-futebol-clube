import { NextFunction, Request, Response } from 'express';
import Email from './Email';

export default class Validations {
  private static passwordMinLength = 6;
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

    if (!Email.isValidEmail(email) || password.length < Validations.passwordMinLength) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    next();
  }

  static validateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization;
    if (!token) return res.status(404).json({ message: 'Token not found' });
    next();
  }
}
