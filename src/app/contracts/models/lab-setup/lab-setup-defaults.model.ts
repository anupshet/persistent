import { DataEntryMode } from './data-entry-mode.enum';

export class LabSetupDefaults {
  dataType: DataEntryMode;
  instrumentsGroupedByDept?: boolean;
  trackReagentCalibrator?: boolean;
  fixedMean?: boolean;
  decimalPlaces: number;
  siUnits: boolean;
}
