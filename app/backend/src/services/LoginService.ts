import UserModel from '../database/models/SequelizeUser';

export default class LoginService {
  static async getUserRole(email: string) {
    const user = await UserModel.findOne({ where: { email } });

    const role = user?.dataValues.role;

    return { role };
  }
}
