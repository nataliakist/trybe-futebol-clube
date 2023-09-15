import MatchModel from '../models/MatchModel';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/teams/ITeamModel';
import { ILeaderboard, IFirstLeaderboard } from '../Interfaces/leaderboard/ILeaderboard';
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
  ) {
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
        .reduce((acc, goalsFavor) => acc + goalsFavor),
      goalsOwn: teamMatches.map((match) => match.awayTeamGoals)
        .reduce((acc, goalsOwn) => acc + goalsOwn),
    };
  }

  async getClassification(): Promise<IFirstLeaderboard[]> {
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
    return classification;
  }

  async getAwayClassification(): Promise<IFirstLeaderboard[]> {
    const getTeams = await this.teamModel.findAll() as ITeam[];
    const getMatches = await this.matchModel.findAll() as IMatch[];
    const getFinishedMatches = getMatches.filter(({ inProgress }) => !inProgress);
    const classification: IFirstLeaderboard[] = getTeams.map((team) => {
      const teamMatches = getFinishedMatches.filter((teamMatch) =>
        teamMatch.awayTeamId === team.id);
      const wins = teamMatches.filter((teamMatch) =>
        teamMatch.awayTeamGoals > teamMatch.homeTeamGoals);
      const draws = teamMatches.filter((teamMatch) =>
        teamMatch.awayTeamGoals === teamMatch.homeTeamGoals);
      return LeaderboardService.awayTeamStats(team.teamName, teamMatches, wins, draws);
    });
    return classification;
  }

  static orderClassification(completeClassification: ILeaderboard[]): ILeaderboard[] {
    const orderedClassification = completeClassification.sort((a, b) => {
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      return 0;
    });
    return orderedClassification;
  }

  static orderAwayClassification(completeClassification: IFirstLeaderboard[]): IFirstLeaderboard[] {
    const orderedClassification = completeClassification.sort((a, b) => {
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      return 0;
    });
    return orderedClassification;
  }

  async getNewClassification(team: 'home' | 'away' | undefined):
  Promise<ServiceResponse<ILeaderboard[] | IFirstLeaderboard[]>> {
    let classification: IFirstLeaderboard[];
    let orderedClassification: IFirstLeaderboard[] | ILeaderboard[];
    if (team === 'away') {
      classification = await this.getAwayClassification();
      orderedClassification = LeaderboardService.orderAwayClassification(classification);
    } else {
      classification = await this.getClassification();
      const completeClassification:ILeaderboard[] = classification.map((cTeam) => ({ ...cTeam,
        goalsBalance: cTeam.goalsFavor - cTeam.goalsOwn,
        efficiency: ((cTeam.totalPoints / (cTeam.totalGames * 3)) * 100).toFixed(2).toString(),
      }));
      orderedClassification = LeaderboardService.orderClassification(completeClassification);
    }
    return { status: 'SUCCESSFUL', data: orderedClassification };
  }
}
