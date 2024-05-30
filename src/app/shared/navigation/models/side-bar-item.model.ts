import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';

export class SideBarItem {
  primaryText: string;
  secondaryText: string;
  additionalText: string;
  node: TreePill;
  sortOrder: number;
  entityId: string;

  constructor() {
    this.primaryText = '';
    this.secondaryText = '';
    this.additionalText = '';
    this.sortOrder = 0;
  }
}
