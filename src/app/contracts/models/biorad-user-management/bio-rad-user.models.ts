// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

export class BioRadUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRoles: Array<string>;
  territoryId: string;
  isEditing?: boolean;
  disAllowDelete?: boolean;
}

export class BioRadUserPageResponse {
  users: Array<BioRadUser>;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export class BioRadUserPageRequest {
  searchString: string;
  searchColumn: number;
  sortDescending: boolean;
  sortColumn: number;
  pageIndex: number;
  pageSize: number;
}
