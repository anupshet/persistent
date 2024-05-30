import { PointDataResultStatus } from '../enums/analyte-point-view/point-data-result-status.enum';

export class BasePoint {
  value: number;
  z: number;
  displayZScore: boolean;
  ruleViolated?: any; // Rules model currently exists out of the BrComponentLibrary
  isAccepted = true;
  resultStatus = PointDataResultStatus.None;
  mean?: number;
  sd?: number;
  nPts?: number;
}
