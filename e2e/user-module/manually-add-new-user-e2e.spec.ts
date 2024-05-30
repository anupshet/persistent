/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Manually-Add-New-User.json').then(function (data) {
  jsonData = data;
});


describe('Test suite: 109315 : Testing: Manually Add New User (Suite ID: 109570)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 109571:Verify the ADD USER  button on page', function () {
    library.logStep('Test Case 1: Verify User Management Page Header');
    library.logStep('Test Case 109571:Verify the ADD USER  button on page');
    library.logStep('Test Case 109573:Verify the first name field on ADD USER pop up on page');
    library.logStep('Test Case 109574:Verify the last name field on ADD USER pop up on  page');
    library.logStep('Test case 109575: Verify the email ID field on ADD USER pop up on User Management page');
    library.logStep('Test case 109576: Verify the role toggle on ADD USER pop up on User Management page');
    library.logStep('Test Case 109578:Verify the cancel button on add user pop up on page');
    library.logStep('Test case 109585: Verify the Single user will be assigned to single lab');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    userManage.clickAddUserButton().then(function (addUserButton) {
      expect(addUserButton).toBe(true);
    });
    userManage.verifyfirstname(jsonData.FirstName).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.verifyLastname(jsonData.LastName).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.verifyEmailIdTextBox(jsonData.EmailID).then(function (verified) {
      expect(verified).toBe(true);
    });
    userManage.clickUserRoleToggleButton().then(function (roleClicked) {
      expect(roleClicked).toBe(true);
    });
    userManage.clickAddUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
    userManage.verifyLabIdDisplayed().then(function (labIdDisplayed) {
      expect(labIdDisplayed).toBe(true);
    });
  });

  it('Test Case 109572:Verify the required fields for ADD USER pop up on page', function () {
    library.logStep('Test Case 109572:Verify the required fields for ADD USER pop up on  page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickAddUserButton().then(function (addUserClicked) {
      expect(addUserClicked).toBe(true);
    });
    userManage.verifyMandatoryFieldsOnAddUserPopUp().then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickAddUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 109579: Verify the First and Last name combination is identical on User Management page', function () {
    library.logStep('Test case 109579: Verify the First and Last name combination is identical on User Management page');
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const email = jsonData.NewUserEmail + timestamp + '@gmail.com';
    userManage.addUser(fname, lname, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.addUser(fname, lname, email, 'User').then(function (status1) {
      expect(status1).toBe(true);
    });
    userManage.verifyErrorMessageForUniqueUserName().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    userManage.clickAddUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });
  it('Test case 109580: Verify the login name (email) is currently in use on User Management page', function () {
    library.logStep('Test case 109580: Verify the login name (email) is currently in use on User Management page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const email = jsonData.NewUserEmail + timestamp + '@bio-rad.com';
    userManage.addUser(fname, lname, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });
    const timestamp1 = Date.now() - year;
    const fname1 = jsonData.NewUserFirstName + timestamp1 + '5';
    const lname1 = jsonData.NewUserLastName + timestamp1 + '5';
    userManage.addUser(fname1, lname1, email, 'User').then(function (status1) {
      expect(status1).toBe(true);
    });
    userManage.verifyErrorMessageForUniqueEmail().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    userManage.clickAddUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 109581: Verify the create new user on User Management page @P1', function () {
    library.logStep('Test case 109581: Verify the create new user on User Management page');
    library.logStep('Test case 109577: Test case 109577: Verify the add user button on add user pop up on User Management page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const email = jsonData.NewUserEmail + timestamp + '@bio-rad.com';
    userManage.addUser(fname, lname, email, 'Admin').then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 109582: Verify the valid email id for Login Email field', function () {
    library.logStep('Test case 109582: Verify the valid email id for Login Email field');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const email = jsonData.IncorrectEmail;
    userManage.enterUserDetails(fname, lname, email, 'Admin').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.verifyErrorMessageForInvalidEmail().then(function (error) {
      expect(error).toBe(true);
    });
    userManage.clickAddUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-196501 TC 1: To verify a QCPAdmin user can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 1: To verify a QCPAdmin user can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.QCPAdmin, jsonData.Password, jsonData.QCPAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@bio-rad.com';
    userManage.addQCPUser(jsonData.QCPAdminFirstName, jsonData.QCPAdminLastName, email, jsonData.QCPAdminRole).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 2: To verify a QCP Daily user can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 2: To verify a QCP Daily user can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.QCPAdmin, jsonData.Password, jsonData.QCPAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@bio-rad.com';
    userManage.addQCPUser(jsonData.QCPDailyFirstName, jsonData.QCPDailyLastName, email, jsonData.QCPDailyUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 3: To verify a CTS user can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 3: To verify a CTS user can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.QCPAdmin, jsonData.Password, jsonData.QCPAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@bio-rad.com';
    userManage.addQCPUser(jsonData.CTSFirstName, jsonData.CTSLastName, email, jsonData.CTSUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 4: To verify a Marketing user can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 4: To verify a Marketing user can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.QCPAdmin, jsonData.Password, jsonData.QCPAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@bio-rad.com';
    userManage.addQCPUser(jsonData.MarketingFirstName, jsonData.MarketingLastName, email, jsonData.MarketingUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 5: To verify a Unity Next Admin can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 5: To verify a Unity Next Admin can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdmin, jsonData.Password, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@gmail.com';
    userManage.addUser(jsonData.UnityNextAdminFirstName, jsonData.UnityNextAdminLastName, email, 'Admin').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 6: To verify a Unity Next User can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 6: To verify a Unity Next User can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdmin, jsonData.Password, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@gmail.com';
    userManage.addUser(jsonData.UnityNextUserFirstName, jsonData.UnityNextUserLastName, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('PBI-196501 TC 8: To verify a Lot Viewer User can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 8: To verify a Lot Viewer User can be created using the same FirstName, same LastName but different email address');
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerAdmin, jsonData.Password, jsonData.LotViewerAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@gmail.com';
    userManage.addUser(jsonData.LotViewerUserFirstName, jsonData.LotViewerUserLastName, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });
});
