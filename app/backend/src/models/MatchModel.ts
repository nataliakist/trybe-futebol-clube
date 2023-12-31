import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { IMatch, INewMatch } from '../Interfaces/matches/IMatch';
import { IMatchModel } from '../Interfaces/matches/IMatchModel';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;

  async findAll(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({ include: [
      { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
      { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
    ],
    });
    return dbData;
  }

  async findById(id: IMatch['id']): Promise<IMatch | null> {
    const dbData = await this.model.findByPk(id, {
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    if (dbData == null) return null;
    return dbData;
  }

  async updateProgress(id: IMatch['id']): Promise<boolean> {
    const [affectedRows] = await this.model.update({ inProgress: false }, { where: { id } });
    if (affectedRows === 0) return false;

    return true;
  }

  async updateGoals(id: IMatch['id'], homeTeamGoals: number, awayTeamGoals: number):
  Promise<boolean> {
    const [affectedRows] = await this.model.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    if (affectedRows === 0) return false;

    return true;
  }

  async create(data: INewMatch): Promise<IMatch> {
    const dbData = await this.model.create({ ...data, inProgress: true });

    return dbData;
  }
}
