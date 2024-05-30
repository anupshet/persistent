// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export interface GroupNode {
  displayName: string;
  children: [] | null;
}

export enum LocationState {
  SingleLocation = 0,
  MultiLocation = 1,
  MultiGroup = 2
}

export class GroupFlatNode {
  displayName: string;
  level: number;
  expandable: boolean;
  id: string;
  parentNodeId: string;
  isDefaultLocation: boolean;
}
