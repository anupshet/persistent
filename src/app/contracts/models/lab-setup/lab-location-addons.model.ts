// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class AddOnsFlags {
  valueAssignment: boolean;
  allowBR: boolean;
  allowNonBR: boolean;
  allowSiemensHematology: boolean;
  allowSysmexHemostasis: boolean;
}

export class AddOnDisplayItem {
  value: string;
  displayName: string;
}

export class AddOnDisplayItemGroup {
  displayName: string;
  addOnItems: AddOnDisplayItem[];
}

export const ValueAssignmentDefinition = 'valueAssignment';
export const AllowBRDefinition = 'allowBR';
export const AllowNonBRDefinition = 'allowNonBR';
export const AllowSiemensDefinition = 'allowSiemensHematology';
export const AllowSysmexDefinition = 'allowSysmexHemostasis';
