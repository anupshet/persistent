// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ShipTo } from '../../contracts/models/user-management/user.model';
import { Permissions } from './permissions.model';

// ToDo: Replace Assigned Labs from App User to User Data
export class AppUser {
  userOktaId: string;
  userName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  roles: string[];
  permissions: Array<Permissions>;
  userData: UserData;
  accountNumber: string;
  accountId: string;
  labLocationId: string;
  labLocationIds: string[];
  accountNumberArray: string[];
  accessToken: any;
  id: string;
  labId: string;
  allowedShipTo?: ShipTo;
  awsCorrelationId?: string;

  public constructor(init?: Partial<AppUser>) {
    Object.assign(this, init);
    // tslint:disable-next-line: no-use-before-declare
    this.userData = new UserData();
    // tslint:disable-next-line: no-use-before-declare
  }
}

export class UserData {
  assignedLabNumbers: number[];
  defaultLab: any;
}



