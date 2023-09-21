import MatchModel from '../models/MatchModel';
import { IMatch, INewMatch } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';
import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/teams/ITeamModel';

const message = 'Match not found';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

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

  async updateProgress(id: IMatch['id']): Promise<ServiceResponse<ServiceMessage>> {
    const match = await this.matchModel.findById(id);
    if (!match) return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };

    const updatedMatch = await this.matchModel.updateProgress(id);
    if (!updatedMatch) {
      return { status: 'CONFLICT',
        data: { message: `There are no updates to perform in Match ${id}` } };
    }
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  async updateGoals(id: IMatch['id'], homeTeamGoals: number, awayTeamGoals: number):
  Promise<ServiceResponse<ServiceMessage>> {
    const match = await this.matchModel.findById(id);
    if (!match) return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };

    const updatedMatch = await this.matchModel.updateGoals(id, homeTeamGoals, awayTeamGoals);
    if (!updatedMatch) {
      return { status: 'CONFLICT',
        data: { message: `There are no updates to perform in Match ${id}` } };
    }
    return { status: 'SUCCESSFUL', data: { message: 'Updated' } };
  }

  public async createMatch(match: INewMatch):
  Promise<ServiceResponse<IMatch> | ServiceResponse<ServiceMessage>> {
    const homeTeam = await this.teamModel.findById(match.homeTeamId);
    const awayTeam = await this.teamModel.findById(match.awayTeamId);

    if (!homeTeam || !awayTeam) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    const newMatch = await this.matchModel.create(match);
    return { status: 'SUCCESSFUL', data: newMatch };
  }
}
