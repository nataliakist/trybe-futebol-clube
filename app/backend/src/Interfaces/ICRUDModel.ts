import { ID } from '.';

export interface ICRUDModelCreator<T> {
  create(data: Partial<T>): Promise<T>,
}

export interface ICRUDModelReader<T> {
  findAll(): Promise<T[]>,
  findById(id: ID): Promise<T | null>,
}

export interface ICRUDModelUpdater {
  updateProgress(id: ID): Promise<boolean>,
  updateGoals(id: ID, homeTeamGoals: number, awayTeamGoals: number): Promise<boolean>,
}

export interface ICRUDModelDeleter {
  delete(id: ID): Promise<number>,
}

export interface ICRUDModel<T>
  extends ICRUDModelCreator<T>, ICRUDModelReader<T>, ICRUDModelUpdater,
  ICRUDModelDeleter { }
