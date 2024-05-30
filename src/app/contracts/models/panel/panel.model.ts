// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { EntityType } from '../../enums/entity-type.enum';
import { TreePill } from '../lab-setup';
export class Panel {
  id: string;
  name: string;
  panelItemIds: Array<string>;
  parentNodeId: string;
  panelPriorItems?: Panel;
  panelItemList: TreePill[];
  panelItems: TreePill[];
  panelId?: string;
}

export interface DeletePanelConfig {
  nodeType: EntityType;
  panelId: string;
  locationId: string;
  panelPriorValue?: Panel;
  panelsList?: object;
}
