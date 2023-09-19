import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRouter = Router();

const leaderboardController = new LeaderboardController();

leaderboardRouter.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getHomeLeaderboard(req, res),
);

leaderboardRouter.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.getAwayLeaderboard(req, res),
);

leaderboardRouter.get(
  '/',
  (req: Request, res: Response) => leaderboardController.getHomeLeaderboard(req, res),
);

export default leaderboardRouter;
