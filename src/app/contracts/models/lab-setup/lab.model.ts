// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { EntityType } from '../../enums/entity-type.enum';
import { LabLocation } from './lab-location.model';
import { TreePill } from './tree-pill.model';

export class Lab extends TreePill {
  nodeType = EntityType.Lab;
  children ?: LabLocation[];
  labName ?= '';
  name ?= '';
  hasChildren ?: boolean;
}
