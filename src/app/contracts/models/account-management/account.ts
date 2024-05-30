// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Address } from './address.model';
import { Contact } from './contact.model';
import { TreePill } from '../lab-setup/tree-pill.model';
import { EntityType } from '../../enums/entity-type.enum';
import { MigrationStates } from '../../enums/migration-state.enum';
import { AccountSettings } from '../lab-setup/account-settings.model';

export class Account extends TreePill {
  id = '';
  accountNumber = '';
  nodeType = EntityType.Account;
  parentNodeId = 'ROOT';
  displayName = '';
  accountName = '';
  accountContact: Contact;
  formattedAccountNumber?= '';
  sapNumber?= '';
  orderNumber?= '';
  primaryUnityLabNumbers?= '';
  shipTo?= '';
  soldTo?= '';
  labName?= '';
  accountAddressId?= '';
  accountAddress: Address;
  accountContactId?= '';
  licenseNumberUsers?: number;
  accountLicenseType?: number;
  licensedProducts?: any[];
  licenseAssignDate?: Date;
  licenseExpirationDate?: Date;
  comments?= '';
  lotViewer?= '';
  migrationStatus?: MigrationStates;
  usedArchive?: boolean;
  locationCount?: number;
  hasChildren?: boolean;
  settings?: AccountSettings; // move to location model for multi lcoation implmentation
  previousContactUserId: string; // After an update, if the previous contact of the account was
  // changed and is no longer referenced by account, location, or dept, this will contain the user id.
  isMigrationStatusEmpty?: boolean;
  languagePreference?: string
}

export class AccountPageResponse {
  accounts: Array<Account>;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export class AccountPageRequest {
  searchString: string;
  searchColumn: number;
  sortDescending: boolean;
  sortColumn: number;
  pageIndex: number;
  pageSize: number;
}
