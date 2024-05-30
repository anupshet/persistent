/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { Locations } from '../page-objects/locations-e2e.po';


let jsonData;

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const userManage = new UserManagement();
const location = new Locations();
const loginEvent = new LoginEvent();
const out = new LogOut();
let temp = "";

library.parseJson('./JSON_data/DefaultingLocation-UN-7946.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: UN - 7946 Default location per user', function () {
  browser.waitForAngularEnabled(false);


  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify selected location is displayed on lab', function () {
    location.verifyDefaultLocation(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 2 :Verify Admin can add user for default selected location', function () {
    location.verifyDefaultLocation(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@gmail.com';
    temp = email;
    userManage.addUser(jsonData.UnityNextAdminFirstName, jsonData.UnityNextAdminLastName, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (windowClosed) {
      expect(windowClosed).toBe(true);
    });
  });

  it('Test case 3 : Verify default selected location while adding user is displayed on user', function () {
    out.signOut().then(function (status) {
      expect(status).toBe(true);
    });
    console.log("++++++ User email id +++++> ", temp)

    loginEvent.loginToApplication(jsonData.URL, temp,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    location.verifyDefaultLocation(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
  });
  it('Test case 4 : Verify selected location while adding user is displayed on user', function () {
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });

    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });

    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const email = jsonData.Email + timestamp + '@gmail.com';
    temp = email;
    userManage.addUser(jsonData.UnityNextAdminFirstName, jsonData.UnityNextAdminLastName, email, 'User').then(function (status) {
      expect(status).toBe(true);
    });

    out.signOut().then(function (status) {
      expect(status).toBe(true);
    });
    console.log("++++++ User email id +++++> ", temp)

    /* SetUp password Using utility */

    loginEvent.loginToApplication(jsonData.URL, temp,
      email, jsonData.NewPassword).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    location.verifyDefaultLocation(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 5 : Verify adding duplicate user is not allowed for same location' +
    'Test case 6 : Verify added user for one location is not displayed for another location', function () {
      location.openLocationDropdown().then(function (result) {
        expect(result).toBe(true);
      });
      location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
        expect(result).toBe(true);
      });
      location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
        expect(result).toBe(true);
      });
      dashBoard.goToUserManagementpage().then(function (result) {
        expect(result).toBe(true);
      });
      userManage.verifyUserIsPresent(jsonData.l2UserFName, jsonData.l2UserLName).then(function (windowClosed) {
        expect(windowClosed).toBe(false);
      });

      /* SetUp password Using utility */

      userManage.closeUserManagementWindow().then(function (windowClosed) {
        expect(windowClosed).toBe(true);
      });
      location.openLocationDropdown().then(function (result) {
        expect(result).toBe(true);
      });
      location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
        expect(result).toBe(true);
      });
      location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
        expect(result).toBe(true);
      });

      dashBoard.goToUserManagementpage().then(function (result) {
        expect(result).toBe(true);
      });
      /* Note - Add second duplicate user for location2 */
      /* temp = Already present email id */
      userManage.addUser(jsonData.UnityNextAdminFirstName, jsonData.UnityNextAdminLastName, temp, 'User').then(function (status) {
        expect(status).toBe(true);
      });
    });

  it('Test case 7 : Verify users are sorted as per locations on user management page', function () {
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyUsersAreSorted().then(function (result) {
      expect(result).toBe(true);
    });
  });


  it('Test case 8 : Verify added user can be deleted for selected location', function () {
    /* Blocked due to Defect */
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyDeleteUserButton("first name").then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyDeleteUserWarningMessageWindow("username", "email1").then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickConfirmMessageCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });
});
