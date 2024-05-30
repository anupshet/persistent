import { ValueCell } from './value-cell.model';
import { ZScoreCell } from './zscore-cell.model';

export class LevelSection {
  levelNumber: number;
  valueCell: ValueCell;
  zScoreCell: ZScoreCell;
  reasons: string[];
}
