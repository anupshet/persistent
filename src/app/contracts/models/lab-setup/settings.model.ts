// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { RunSettings } from './run-settings.model';
import { RuleSetting } from './rule-setting.model';
import { EntityType } from '../../enums/entity-type.enum';
import { LevelSettings } from './levels-settings.model';
import { TestSpec } from '../portal-api/labsetup-data.model';
import { LabTest } from './test.model';
import { LabProduct } from './product.model';
import { CustomControlRequest } from '../control-management/custom-control-request.model';
import { ArchiveState } from '../../enums/lab-setup/archive-state.enum';

export class Settings {
  entityId?: string;
  entityIds?: Array<string>;
  entityType: EntityType;
  levelSettings: LevelSettings;
  runSettings: RunSettings;
  ruleSettings: Array<RuleSetting>;
  hasEvaluationMeanSd: boolean;
  parentEntityId: string;
  locationId?: string;
  archiveState?: ArchiveState;
}

export interface SettingsParameter {
  entityType: EntityType;
  entityId: string;
  parentEntityId: string;
}

export interface AnalyteSettingsValues {
  analytes: TestSpec[];
  settings: Settings;
  typeOfOperation?:boolean;
}

export interface ControlSettingsValues {
  labConfigFormValues: any;
  settings: Settings;
  typeOfOperation?:boolean;
}

export interface AnalyteConfig {
  labAnalytes: LabTest[];
  settings: Settings;
  nodeType: EntityType;
  typeOfOperation?:boolean;
}

export interface ControlConfig {
  labControls: LabProduct[];
  settings: Settings;
  nodeType: EntityType;
  typeOfOperation?:boolean;
}

export interface NonBrControlConfig {
  request: CustomControlRequest[];
  settings: Settings;
}
