import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';
import Validations from '../middlewares/Validations';

const matchController = new MatchController();

const matchesRouter = Router();

matchesRouter.post(
  '/',
  Validations.validateToken,
  Validations.validateNewMatch,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);

matchesRouter.get('/', (req: Request, res: Response) =>
  matchController.getAllMatches(req, res));

matchesRouter.patch(
  '/:id/finish',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.updateProgress(req, res),
);

matchesRouter.patch(
  '/:id',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.updateGoals(req, res),
);

export default matchesRouter;
