// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { EntityType } from '../../enums/entity-type.enum';
import { LevelSettingsDto } from '../portal-api/level-test-settings.model';
import { AccountSettings } from './account-settings.model';
import { Permissions } from '../../../security/model/permissions.model';

export class TreePill {
  id: string;
  nodeType: EntityType;
  parentNodeId: string;
  displayName: string;
  children?: Array<TreePill>;
  levelSettings?: LevelSettingsDto;
  accountSettings?: AccountSettings;
  hasOwnAccountSettings?: boolean;
  isUnavailable?: boolean;
  unavailableReasonCode?: string;
  isArchived?: boolean;
  sortOrder?: number;
  permissions?: Array<Permissions>;
  reportCreate?: string;
}
