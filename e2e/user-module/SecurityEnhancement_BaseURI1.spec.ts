/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
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
library.parseJson('./JSON_data/Manually-Add-New-User.json').then(function(data) {
  jsonData = data;
});


describe('Test suite: 109315 : Testing: Manually Add New User (Suite ID: 109570)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const library = new BrowserLibrary();


  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      dashBoard.goToUserManagementpage().then(function (result) {
      });
    });
  });

  afterEach(function () {
    out.signOut();
  });



  it('Test case 1 - To verify Base URL of add user', function () {
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const email = jsonData.NewUserEmail + timestamp + '@gmail.com';
    userManage.addUser(fname, lname, email, 'Admin').then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test 2 - To verify Base URL of delete user', function () {
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;

    userManage.verifyDeleteUserButton(fname).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.deleteExistingUser(fname).then(function (result) {
      expect(result).toBe(true);
    });
  });

});
