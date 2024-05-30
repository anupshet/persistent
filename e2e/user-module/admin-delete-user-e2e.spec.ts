/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Delete-User.json').then(function(data) {
  jsonData = data;
});

describe('Test suite: 111361 : Testing: Manually Delete a User (Suite ID: 111362)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const userManage = new UserManagement();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const year = new Date(new Date().getFullYear().toString()).getTime();
  const timestamp = Date.now() - year;
  let fname1, lname1, username, email1;

  beforeAll(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName);
    dashBoard.goToUserManagementpage();
    fname1 = jsonData.SetupUser1FirstName + timestamp;
    lname1 = jsonData.SetupUser1LastName + timestamp;
    username = fname1 + ' ' + lname1;
    email1 = jsonData.SetupUser1Email + timestamp + '@bio-rad.com';
    userManage.addUser(fname1, lname1, email1, 'User');
    out.signOut();
  });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName);
    dashBoard.goToUserManagementpage().then(function () {
    });
  });

  afterEach(function () {
    out.signOut().then(function(loggedOut){
      expect(loggedOut).toBe(true);
    })
  });

  it('Test case 111363: Verify the delete button from edit user pop up', function () {
    library.logStep('Test case 111363: Verify the delete button from edit user pop up');
    library.logStep('Test case 111367: Verify the Warning message for delete on user management grid');
    library.logStep('Test case 111368: Verify the Confirm button from Warning message pop up on user management grid');
    library.logStep('Test case 111369: Verify the Cancel button from Warning message pop up on user management grid');
    userManage.verifyDeleteUserButton(fname1).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyDeleteUserWarningMessageWindow(username, email1).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickConfirmMessageCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 111365: Verify the delete user from edit user pop up on user management @P1', function () {
    library.logStep('Test case 111365: Verify the delete user from edit user pop up on user management');
    userManage.verifyDeleteUserButton(fname1).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.deleteExistingUser(fname1).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });
});
