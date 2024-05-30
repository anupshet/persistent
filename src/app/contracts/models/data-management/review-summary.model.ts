import { PezContent } from 'br-component-library';

export class ReviewSummary {
  levelSummaries: LevelSummary[];
  actions: PezContent[];
  comments: PezContent[];
  interactions: PezContent[];
}

export class LevelSummary {
  levelNum: number;
  value: number;
  isAccept: boolean;
  decimalPlaces: number;
}
