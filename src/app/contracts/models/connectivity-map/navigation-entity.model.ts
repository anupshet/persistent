// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class NavigationEntity {
  unmappedCount: number;
  entityType: string;
  children: Array<ChildNavigationEntity>;
}

export class ChildNavigationEntity {
  title: string;
  subTitle: string;
  unmappedCount: number;
  displayState: boolean;
  entityId: string;
}

export class TestNavigationEntity extends NavigationEntity{
  unmappedLotCount: number;
}
