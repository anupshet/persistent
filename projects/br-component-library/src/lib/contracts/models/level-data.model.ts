import { BaseSummary } from './summary-stats.model';
import { BasePoint } from './point.model';

export abstract class LevelData<T> {
  level: number;
  decimalPlace: number;
  controlLotId: number;
  isPristine: boolean;
  data: T;
}

export class Level {
  id: number;
  levelInUse: boolean;
  decimalPlace: any;
}

export class LevelValue extends LevelData<BasePoint> { }
export class LevelSummary extends LevelData<BaseSummary> { }
