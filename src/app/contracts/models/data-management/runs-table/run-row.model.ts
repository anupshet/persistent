// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved
import { LevelSection } from './level-section.model';
import { LabDataCollection } from '../runs-result.model';
import { PezCell } from './pez-cell.model';

export class RunRow {
  rowType: RowType;
  dataSource: LabDataCollection;
  runId: string;
  runIndex: number;
  runDateTime: Date;
  levelSections: LevelSection[];
  pezCell: PezCell;
  decimalPlaces: Array<any>;
  isInsert: boolean;
  isRestartFloat: boolean;
}

export enum RowType {
  Run, InsertComponent
}
