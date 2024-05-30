// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export const enum UserRole {
  // SoftwareSupport
  Technician = 'Technician',
  LeadTechnician = 'LeadTechnician',
  LabSupervisor = 'LabSupervisor',
  LabUserManager = 'LabUserManager',
  AccountUserManager = 'AccountUserManager',
  Admin = "Admin"
}

// User List Columns
export enum DisplayedColumnsUser {
  UserName = 'UserName',
  UserEmail = 'UserEmail',
  UserRole = 'UserRole',
  UserLocation = 'UserLocation',
}

export enum UsersField {
  Name = 1,
  Email = 2,
  Role = 3,
  Location = 4,
}

export enum RolesFieldOptions {
  Technician = 'Technician',
  LeadTechnician = 'Lead Technician',
  LabSupervisor = 'Lab Supervisor',
  LabUserManager = 'Lab User Manager',
  AccountUserManager = 'Account User Manager'
}

export enum BioRadUserRoles {
  BioRadManager = 'AccountManager',
  CTSUser = 'CTSUser',
  LotViewerSales = 'SalesPerson',
  QCPUser = 'QCPUser',
  QCPCTSUser = 'QCP-CTSUser',
  DailyUser = 'QCPDailyUser',
  MarketingUser = 'MarketingUser'
}
