import MatchModel from '../models/MatchModel';
import { IMatch } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

const message = 'Match not found';

export default class MatchService {
  constructor(private matchModel: IMatchModel = new MatchModel()) {}

  async getallMatches(inProgress: string): Promise<ServiceResponse<IMatch[]>> {
    const allMatches = await this.matchModel.findAll();

    if (!inProgress) {
      return { status: 'SUCCESSFUL', data: allMatches };
    }

    if (inProgress === 'true') {
      const inProgressMatches = allMatches.filter((match) => match.inProgress === true);
      return { status: 'SUCCESSFUL', data: inProgressMatches };
    }

    const finishedMatches = allMatches.filter((match) => match.inProgress === false);
    return { status: 'SUCCESSFUL', data: finishedMatches };
  }

  async getMatchById(id: IMatch['id']): Promise<ServiceResponse<IMatch>> {
    const match = await this.matchModel.findById(id);
    if (!match) return { status: 'NOT_FOUND', data: { message } };
    return { status: 'SUCCESSFUL', data: match };
  }
}
