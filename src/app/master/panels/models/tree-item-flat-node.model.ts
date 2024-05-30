
/** Flat item node with expandable, level and loading information */
export class TreeItemFlatNode {
  displayName: string;
  level: number;
  expandable: boolean;
  isLoading = false;
  isArchived: boolean;
  isLotExpired: boolean;
  secondaryText: string;
}
