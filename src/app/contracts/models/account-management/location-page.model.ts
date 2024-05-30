// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { LabLocation } from '../lab-setup/lab-location.model';

export class LocationPage {
  locations: Array<LabLocation>;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export class LocationSearchRequest {
  groupId: string;
  searchString: string;
  searchColumn: number;
  sortDescending: boolean;
  sortColumn: number;
  pageIndex: number;
  pageSize: number;
}
