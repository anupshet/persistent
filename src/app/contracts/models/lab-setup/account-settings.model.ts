// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DataEntryMode } from './data-entry-mode.enum';
import { EntityType } from '../../enums/entity-type.enum';
import { TreePill } from '../lab-setup';

// locationSettings after multiple locations feature(UN-7096)
export class AccountSettings {
  displayName: string;
  dataType: DataEntryMode;
  instrumentsGroupedByDept?: boolean; // need a confirmation on optional or not
  trackReagentCalibrator?: boolean; // need a confirmation on optional or not
  fixedMean: boolean;
  decimalPlaces: number;
  siUnits: boolean;
  labSetupRating: number;
  labSetupComments: string;
  isLabSetupComplete: boolean;
  labSetupLastEntityId: string;
  id?: string;
  parentNodeId: string;
  parentNode: string;
  nodeType: EntityType;
  children: Array<TreePill>;
  legacyPrimaryLab?: string;
  isUnavailable?: false;
  unavailableReasonCode?: string;
  locationId?: string;

  constructor() {
    this.dataType = DataEntryMode.Summary;
    this.decimalPlaces = 2;
    this.instrumentsGroupedByDept = true;
    this.trackReagentCalibrator = false;
  }
}
