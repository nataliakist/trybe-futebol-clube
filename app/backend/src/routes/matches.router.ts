import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) =>
  matchController.getAllMatches(req, res));

matchesRouter.get('/:id', (req: Request, res: Response) => matchController.getMatchById(req, res));

export default matchesRouter;
