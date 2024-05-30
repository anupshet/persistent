// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

// Location List Columns
export enum DisplayedColumnsLocations {
  lab = 'lab',
  labContact = 'labContact',
  account = 'account',
  group = 'group',
  locations = 'locations',
  licenseType = 'licenseType',
  licenseStatus = 'licenseStatus',
  launchLab = 'launchLab',
  addOns = 'addOns'
}

export enum LocationField {
  LocationLabInfo = 1,
  LocationAccount = 2,
  LocationContact = 3,
  LocationGroup = 4,
  LocationLicenseType = 5,
  LocationLicenseStatus = 6,
  LocationSoldToShipTo = 7,
  LocationAddOns = 8,
}

// Accounts List Columns
export enum DisplayedColumnsAccounts {
  accountName = 'accountName',
  accountNumber = 'accountNumber',
  accountAddress = 'accountAddress',
  accountLocations = 'accountLocations',
  accountOperations = 'accountOperations'
}

export enum AccountsField {
  AccountName = 1,
  AccountNumber = 2,
  AccountAddress = 3
}
