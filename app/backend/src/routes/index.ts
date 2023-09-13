import { Router } from 'express';
import teamsRouter from './teams.router';
import loginRouter from './login.router';
import matchesRouter from './matches.router';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);
router.use('/matches', matchesRouter);

export default router;
