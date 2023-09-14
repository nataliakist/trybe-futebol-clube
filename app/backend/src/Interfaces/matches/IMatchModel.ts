import { ICRUDModelReader, ICRUDModelUpdater } from '../ICRUDModel';
import { IMatch } from './IMatch';

export interface IMatchModel extends ICRUDModelReader<IMatch>, ICRUDModelUpdater {}
