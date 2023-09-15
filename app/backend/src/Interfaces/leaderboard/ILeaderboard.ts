export interface IFirstLeaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export interface ILeaderboard extends IFirstLeaderboard {
  goalsBalance: number;
  efficiency: string;
}
