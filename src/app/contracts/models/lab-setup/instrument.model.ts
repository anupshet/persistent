// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Instrument } from '../portal-api/labsetup-data.model';
import { LabProduct } from './product.model';
import { TreePill } from './tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { Department } from '../lab-setup';
import { Settings } from './settings.model';

export class LabInstrument extends TreePill {
  manufacturerId?: string;
  children: LabProduct[];
  nodeType = EntityType.LabInstrument;
  isInstrumentChecked?: boolean;
  instrumentId: string;
  instrumentCustomName: string;
  instrumentSerial: string;
  instrumentInfo: Instrument;
  parentNode?: Department;
  isArchived?: boolean;
  typeOfOperation?: boolean;
}

export interface LabInstrumentValues {
  labConfigFormValues: LabInstrument[];
  archivedSettings: Settings;
  nodeType: EntityType;
  typeOfOperation?: boolean;
}
