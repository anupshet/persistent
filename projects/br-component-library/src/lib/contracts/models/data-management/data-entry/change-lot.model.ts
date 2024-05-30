// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CalibratorLot } from '../../codelist-management/calibrator-lot.model';
import { ReagentLot } from '../../codelist-management/reagent-lot.model';
import { TranslationLabels } from '../../global-labels.model';
import { Action } from '../../../../contracts';

export class ChangeLotModel {
  labTestId: string;
  reagentLots: ReagentLot[];
  calibratorLots: CalibratorLot[];
  errorMessages: TranslationLabels[];
  defaultReagentLot: ReagentLot;
  defaultCalibratorLot: CalibratorLot;
  selectedReagentLot: ReagentLot;
  selectedCalibratorLot: CalibratorLot;
  comment: string;
  action?: Action;
  labelCorrective?: string;
  labelReagentLot?: string;
  labelCalibratorLot?: string;
  labelReagent?: string;
  labelCalibrator?: string;
  labelHide?: string;
  labelShow?: string;
  labelTestRuns?: string;
  labelForgot?: string;
  labelExpired?: string;
  labelComment?: string;
}

// remove label properties after br library removal
