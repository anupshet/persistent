// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { EntityType } from '../../enums/entity-type.enum';
import { LabInstrument } from './instrument.model';
import { TreePill } from './tree-pill.model';
import { Contact } from '../portal-api/portal-data.model';
import { LabLocation } from '../lab-setup';
import { Settings } from './settings.model';

export class Department extends TreePill {
  children: LabInstrument[];
  nodeType = EntityType.LabDepartment;
  departmentManagerGroup: {};
  departmentName: string;
  departmentManagerId: string;
  departmentManager: Contact;
  parentNode?: LabLocation;
  isArchived?: boolean;
  typeOfOperation?: boolean;
}

export interface LabDepartmentValues {
  labConfigFormValues: Department[];
  archivedSettings: Settings;
  typeOfOperation?: boolean;
}
