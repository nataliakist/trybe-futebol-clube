import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import Validations from '../middlewares/Validations';

const loginRouter = Router();

const loginController = new LoginController();

loginRouter.get(
  '/role',
  Validations.validateToken,
  (req, res) => LoginController.getUserRole(req, res),
);

loginRouter.post(
  '/',
  Validations.validateLogin,
  (req, res) => loginController.login(req, res),
);

export default loginRouter;
