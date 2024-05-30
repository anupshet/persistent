// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestSpec } from '../portal-api/labsetup-data.model';
import { LevelEvaluationMeanSd } from './level-evaluation-mean-sd.model';

export class AnalyteEvaluationMeanSd {
  entityId: string;
  parentEntityId?: string;
  parentMasterLotId?: number;
  testSpecInfo?: TestSpec;
  levelEvaluationMeanSds: Array<LevelEvaluationMeanSd>;
  isPost?: boolean;
}

export class DecimalPlacesById {
  entityId: string;
  decimalPlaces: number;
}

export class EntityIdWithLevel {
  entityId: string;
  level: number;
}
