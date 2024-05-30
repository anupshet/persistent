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

library.parseJson('./JSON_data/add-user-PBI196501.json').then(function(data) {
  jsonData = data;
});



describe('Test suite: 196501', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });

  // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line: max-line-length
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
    // tslint:disable-next-line: max-line-length
    userManage.addQCPUser(jsonData.MarketingFirstName, jsonData.MarketingLastName, email, jsonData.MarketingUserRole).then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('PBI-196501 TC 5: To verify a Unity Next Admin can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 5: To verify a Unity Next Admin can be created using the same FirstName, same LastName but different email address');
    // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line: max-line-length
  it('PBI-196501 TC 6: To verify a Unity Next User can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 6: To verify a Unity Next User can be created using the same FirstName, same LastName but different email address');
    // tslint:disable-next-line: max-line-length
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

  // tslint:disable-next-line: max-line-length
  it('PBI-196501 TC 8: To verify a Lot Viewer User can be created using the same FirstName, same LastName but different email address', function () {
    library.logStep('PBI-196501 TC 8: To verify a Lot Viewer User can be created using the same FirstName, same LastName but different email address');
    // tslint:disable-next-line: max-line-length
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
