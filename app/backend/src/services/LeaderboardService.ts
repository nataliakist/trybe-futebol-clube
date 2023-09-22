import MatchModel from '../models/MatchModel';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/teams/ITeamModel';
import { ILeaderboard, IFirstLeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
import { ITeam } from '../Interfaces/teams/ITeam';
import { IMatch, IMatchFromDB } from '../Interfaces/matches/IMatch';

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
  ) {
    return {
      name: teamName,
      totalPoints: teamWins.length * 3 + teamDraws.length,
      totalGames: teamMatches.length,
      totalVictories: teamWins.length,
      totalDraws: teamDraws.length,
      totalLosses: teamMatches.length - teamWins.length - teamDraws.length,
      goalsFavor: teamMatches.map((match) => match.homeTeamGoals)
        .reduce((acc, goalsFavor) => acc + goalsFavor, 0),
      goalsOwn: teamMatches.map((match) => match.awayTeamGoals)
        .reduce((acc, goalsOwn) => acc + goalsOwn, 0),
    };
  }

  static awayTeamStats(
    teamName: string,
    teamMatches: IMatch[],
    teamWins: IMatch[],
    teamDraws: IMatch[],
  ) {
    return {
      name: teamName,
      totalPoints: teamWins.length * 3 + teamDraws.length,
      totalGames: teamMatches.length,
      totalVictories: teamWins.length,
      totalDraws: teamDraws.length,
      totalLosses: teamMatches.length - teamWins.length - teamDraws.length,
      goalsFavor: teamMatches.map((match) => match.awayTeamGoals)
        .reduce((acc, goalsFavor) => acc + goalsFavor, 0),
      goalsOwn: teamMatches.map((match) => match.homeTeamGoals)
        .reduce((acc, goalsOwn) => acc + goalsOwn, 0),
    };
  }

  async getClassification(): Promise<ServiceResponse<ILeaderboard[]>> {
    const getTeams = await this.teamModel.findAll() as ITeam[];
    const getMatches = await this.matchModel.findAll() as IMatch[];
    const getFinishedMatches = getMatches.filter(({ inProgress }) => !inProgress);
    const classification: IFirstLeaderboard[] = getTeams.map((team) => {
      const teamMatches = getFinishedMatches.filter((teamMatch) =>
        teamMatch.homeTeamId === team.id);
      const wins = teamMatches.filter((teamMatch) =>
        teamMatch.homeTeamGoals > teamMatch.awayTeamGoals);
      const draws = teamMatches.filter((teamMatch) =>
        teamMatch.homeTeamGoals === teamMatch.awayTeamGoals);
      return LeaderboardService.teamStats(team.teamName, teamMatches, wins, draws);
    });
    const completeClassification = LeaderboardService.completeClassification(classification);
    const orderHomeTeams = LeaderboardService.orderClassification(completeClassification);
    return { status: 'SUCCESSFUL', data: orderHomeTeams };
  }

  async getAwayClassification(): Promise<ServiceResponse<ILeaderboard[]>> {
    const getTeams = await this.teamModel.findAll() as ITeam[];
    const getMatches = await this.matchModel.findAll() as IMatchFromDB[];
    const getFinishedMatches = getMatches.filter(({ inProgress }) => !inProgress);
    const classification: IFirstLeaderboard[] = getTeams.map(({ teamName }) => {
      const teamMatches = getFinishedMatches.filter(({ awayTeam }) =>
        awayTeam.teamName === teamName);
      const wins = teamMatches.filter((teamMatch) =>
        teamMatch.awayTeamGoals > teamMatch.homeTeamGoals);
      const draws = teamMatches.filter((teamMatch) =>
        teamMatch.awayTeamGoals === teamMatch.homeTeamGoals);
      return LeaderboardService.awayTeamStats(teamName, teamMatches, wins, draws);
    });
    const completeClassification = LeaderboardService.completeClassification(classification);
    const orderHomeTeams = LeaderboardService.orderClassification(completeClassification);
    return { status: 'SUCCESSFUL', data: orderHomeTeams };
  }

  static completeClassification(classification: IFirstLeaderboard[]): ILeaderboard[] {
    const completeClassification:ILeaderboard[] = classification.map((cTeam) => ({ ...cTeam,
      goalsBalance: cTeam.goalsFavor - cTeam.goalsOwn,
      efficiency: ((cTeam.totalPoints / (cTeam.totalGames * 3)) * 100).toFixed(2).toString(),
    }));
    return completeClassification;
  }

  static orderClassification(completeClassification: ILeaderboard[]) {
    const orderedClassification = completeClassification.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
    return orderedClassification;
  }
}
