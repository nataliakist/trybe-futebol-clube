import { Identificable } from '..';

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser extends Identificable, ILogin {
  username: string;
  role: string;
}

export interface IUserVerify {
  user: IUser;
}

export type IUserResponse = Omit<IUser, 'password'>;
