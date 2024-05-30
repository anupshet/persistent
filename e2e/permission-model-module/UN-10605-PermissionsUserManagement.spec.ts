/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountLabUser } from '../page-objects/users-e2e.po';
import { LocationListing } from '../page-objects/location-listing-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN-10605-PermissionsUserManagement.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: Permissions User Management', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const userManagement = new AccountLabUser();
  const locationsTab = new LocationListing();
  const userMgmt = new UserManagement();


  afterEach(function () {
    out.signOut();
    browser.manage().deleteAllCookies();
  });

  //User Management Access

  xit('To verify User Management Accessibility for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.isUserManagementOpen().then(function (result) {
      if (!result) {
        library.logFailStep("Account User Manger Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Lab User Manager', async () => {
    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.isUserManagementOpen().then(function (result) {
      if (!result) {
        library.logFailStep("Lab User Manger Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Lab Supervisor', async () => {
    let role = "Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (result) {
        library.logFailStep("Lab Supervisor Can Access User Management");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify User Management Accessibility for Lead Technician', async () => {
    let role = "Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (result) {
        library.logFailStep("Lead Technician Can Access User Management");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify User Management Accessibility for Technician', async () => {
    let role = "Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (result) {
        library.logFailStep("Technician Can Access User Management");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify User Management Accessibility for Lot Viewer Sales User', async () => {
    let role = "Lot Viewer Sales";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (result) {
        library.logFailStep("Lot Viewe Sales User Can Access User Management");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify User Management Accessibility for Bio-Rad Manager', async () => {
    let role = "Bio-Rad Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (result) {
        library.logFailStep("Bio-Rad Manager Can Access User Management");
      }
      expect(result).toBe(false);
    });
  });

  it('To verify User Management Accessibility for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (!result) {
        library.logFailStep("Account User Manager + Lab Supervisor Role Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (!result) {
        library.logFailStep("Account User Manager + Lab User Manager + Lab Supervisor Role Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (!result) {
        library.logFailStep("Lab User Manager + Lab Supervisor Role Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (!result) {
        library.logFailStep("Lab User Manager + Lead Technician Role Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  xit('To verify User Management Accessibility for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      if (!result) {
        library.logFailStep("Lab User Manager + Technician Role Cannot Access User Management");
      }
      expect(result).toBe(true);
    });
  });

  it('To verify User Management Accessibility for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });

  });

  //User Listing and Search In User Management

  xit('To verify User Listing And Search Functionality in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });

  });

  it('To verify User Listing And Search Functionality in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.labSearchKeyword).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify User Listing And Search Functionality in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  it('To verify User Listing And Search Functionality in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.labSearchKeyword).then(function (result) {
      if (!result)
        library.logFailStep("Search not working for " + role);
      expect(result).toBe(true);
    });
  });

  //Create User in User Management

  xit('To verify Add User Functionality in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = library.generateEmailWithTimeStamp(jsonData.AddUserName, jsonData.AddUserEmailDomain);
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });

  });

  it('To verify Add User Functionality in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", "Add User", email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  xit('To verify Add User Functionality in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if (!result)
        library.logFailStep("Add User not working for " + role);
      expect(result).toBe(true);
    });
  });

  it('To verify Add User Functionality in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  //Delete User in User Management

  xit('To verify Delete User Functionality in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });

  });

  xit('To verify Delete User Functionality in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });

  });

  it('To verify Delete User Functionality in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.isDeleteUserButtonPresent().then(function (flag) {
      expect(flag).toBe(false);
    });
  });

  xit('To verify Delete User Functionality in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify Delete User Functionality in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", "Delete", email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify Delete User Functionality in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify Delete User Functionality in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });
  });

  xit('To verify Delete User Functionality in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    let email = jsonData.AddUserName + Date.now() + jsonData.AddUserEmailDomain;
    await userManagement.enterAddUserDetails(jsonData.FirstName[role] + " Automation", role, email, jsonData.AddUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickDeleteUserButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickConfirmDelete().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.clickResetButton().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", email).then(function (result) {
      if(result) {
        library.logStepWithScreenshot("Dete User Not Working For "+role, "Delete User");
      }
      expect(result).toBe(false);
    });
  });

  it('To verify Delete User Functionality in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.isDeleteUserButtonPresent().then(function (clicked) {
      expect(clicked).toBe(false);
    });
  });

  //Edit User in User Management

  xit('To verify Edit User Functionality in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });

  });

  xit('To verify Edit User Functionality in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });

  });

  it('To verify Edit User Functionality in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName["Tech"]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Edit User Functionality in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });
  });

  xit('To verify Edit User Functionality in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });
  });

  xit('To verify Edit User Functionality in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });
  });

  xit('To verify Edit User Functionality in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });
  });

  xit('To verify Edit User Functionality in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let editFName = jsonData.FirstName[role] + " Edit " + Date.now();
    await userMgmt.updateUserDetails(editFName, "", "", "").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.verifyFirstNameEquals(editFName).then(function (clicked) {
      if(!clicked) {
        library.logFailStep(role+" Failed to Edit Account");
      }
      expect(clicked).toBe(true);
    });
  });

  it('To verify Edit User Functionality in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.search("Email", jsonData.UserName["Tech"]).then(function (result) {
      expect(result).toBe(true);
    });
    await userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  //Multi Group Multi Location Access in User Management

  xit('To verify Multi Locations within a Group control in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.selectLocation(jsonData.defaultlocation).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(false);
    });

  });

  it('To verify Multi Locations within a Group control in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(false);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(false);
    });
  });

  xit('To verify Multi Locations within a Group control in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocMultiGrp).then(function (status) {
      expect(status).toBe(false);
    });
  });

  it('To verify Multi Locations within a Group control in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  //Multi Group Multi Location Control in User Management

  xit('To verify Multi Group Multi Location control in User Management for Account User Manager', async () => {
    let role = "Account User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.selectLocation(jsonData.defaultlocation).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Lab User Manager', async () => {

    let role = "Lab User Manager";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });

  });

  it('To verify Multi Group Multi Location control in User Management for CTS User', async () => {
    let role = "CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Account User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Account User Manager + Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Account User Manager + Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Lab User Manager + Lab Supervisor Role', async () => {
    let role = "Lab User Manager + Lab Supervisor";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Lab User Manager + Lead Technician Role', async () => {
    let role = "Lab User Manager + Lead Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  xit('To verify Multi Group Multi Location control in User Management for Lab User Manager + Technician Role', async () => {
    let role = "Lab User Manager + Tech";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.openLocationsDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.expandAllGroups().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.selectLocations(jsonData.MultiLocWithinGrp).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('To verify Multi Group Multi Location control in User Management for Bio-Rad Manager + CTS User Role', async () => {
    let role = "Bio-Rad Manager + CTS User";
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    await dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.clickOnLocationTab().then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.search(jsonData.labSearchCategory, jsonData.labSearchKeyword).then(function (result) {
      expect(result).toBe(true);
    });
    await locationsTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.goToUserManagement().then(function (result) {
      expect(result).toBe(true);
    });
    await userManagement.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    await userManagement.checkInputFieldsDisabled().then(function (status) {
      expect(status).toBe(true);
    });
  });

});
