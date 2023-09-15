import MatchModel from '../models/MatchModel';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/teams/ITeamModel';
import ILeaderboard from '../Interfaces/leaderboard/ILeaderboard';
import { ITeam } from '../Interfaces/teams/ITeam';
import { IMatch } from '../Interfaces/matches/IMatch';

export default class LeaderboardService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  static teamStats(
    teamName: string,
    teamMatches: IMatch[],
    teamWins: IMatch[],
    teamDraws: IMatch[],
  ): ILeaderboard {
    return {
      name: teamName,
      totalPoints: teamWins.length * 3 + teamDraws.length,
      totalGames: teamMatches.length,
      totalVictories: teamWins.length,
      totalDraws: teamDraws.length,
      totalLosses: teamMatches.length - teamWins.length - teamDraws.length,
      goalsFavor: teamMatches.map((match) => match.homeTeamGoals)
        .reduce((acc, goalsFavor) => acc + goalsFavor),
      goalsOwn: teamMatches.map((match) => match.awayTeamGoals)
        .reduce((acc, goalsOwn) => acc + goalsOwn),
    };
  }

  async getClassification(): Promise<ServiceResponse<ILeaderboard[]>> {
    const getTeams = await this.teamModel.findAll() as ITeam[];
    const getMatches = await this.matchModel.findAll() as IMatch[];
    const getFinishedMatches = getMatches.filter(({ inProgress }) => !inProgress);
    const classification: ILeaderboard[] = getTeams.map((team) => {
      const teamMatches = getFinishedMatches.filter((teamMatch) =>
        teamMatch.homeTeamId === team.id);
      const wins = teamMatches.filter((teamMatch) =>
        teamMatch.homeTeamGoals > teamMatch.awayTeamGoals);
      const draws = teamMatches.filter((teamMatch) =>
        teamMatch.homeTeamGoals === teamMatch.awayTeamGoals);
      return LeaderboardService.teamStats(team.teamName, teamMatches, wins, draws);
    });
    return { status: 'SUCCESSFUL', data: classification };
  }
}
