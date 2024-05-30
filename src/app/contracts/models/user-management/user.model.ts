// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { UserRole } from '../../enums/user-role.enum';
import { TreePill } from '../lab-setup/tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { PortalDataDocumentType } from '../portal-api/portal-data.model';
import { UserPreference } from '../portal-api/portal-data.model';
import { Account } from '../account-management/account';
import { LabLocation } from '../lab-setup';
import { Permissions } from '../../../security/model/permissions.model';

export class ContactInfo {
  email = '';
  entityType = PortalDataDocumentType.Contact;
  firstName = '';
  id = '';
  lastName = '';
  middleName = '';
  name = '';
  phone = '';
}

export class UserPage {
  users: Array<User>;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  locationUserCount: number;
}

export class User extends TreePill {
  firstName = '';
  lastName = '';
  email = '';
  id = '';
  userRoles: Array<UserRole>;
  contactInfo = new ContactInfo();
  nodeType = EntityType.User;
  userOktaId: string;
  contactId?: string;
  children: [];
  preferences?: UserPreference;
  parentAccounts: Account[];
  allowedShipTo?: ShipTo;
  defaultLabLocation?: string;
  labLocation?: LabLocation[];
  isPrimaryContact?: boolean;
  permissions?: Array<Permissions>;
}

export class OKTAUser {
  firstName = '';
  lastName = '';
  email = '';
  id = null;
  role = '';
  contactId = null;
  constructor(firstName, lastName, email, role, id?, contactId?) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.id = id;
    this.contactId = contactId;
  }
}

export enum ShipTo {
  single = 'Single',
  all = 'All'
}

export function findByName(list: Array<User>, searchName: string): User {
  if (searchName && searchName.length > 0) {
    let position = 0;
    while (list[position]) {
      const name = (list[position].displayName)
        .replace(/\s/g, '')
        .toLowerCase();
      const modSearchName = searchName
        .replace(/\s/g, '')
        .toLowerCase();
      if (name === modSearchName) {
        return list[position];
      }
      position++;
    }
  }
  return new User();
}

export function findById(list: Array<User>, searchId: string): User {
  let position = 0;
  while (list[position]) {
    if (list[position].contactId === searchId) {
      return list[position];
    }
    position++;
  }
  return new User();
}

export class UserSearchRequest {
  accountId: string;
  locationId: string;
  searchString: string;
  searchColumn: number;
  sortDescending: boolean;
  sortColumn: number;
  pageIndex: number;
  pageSize: number;
}

export class AddEditUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userRoles: Array<string>;
  groups: Array<Object>;
  userOktaId?: string;
  id?: string;
  contactId?: string;
}

export class UMUser extends User {
  isEditable: boolean;
}
