import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const serviceResponse = await this.matchService.getallMatches(inProgress as string);
    return res.status(200).json(serviceResponse.data);
  }

  async getMatchById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.getMatchById(+id);
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }
}
