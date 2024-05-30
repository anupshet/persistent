/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const userMgmt = new UserManagement();

library.parseJson('./JSON_data/PeginationUserManagment-UN-9441.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: UN-9441 : Implement pagination for User management page', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify Pegination is displayed on User management page', function () {
    userMgmt.paginationButtonsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    const pageno = '2';
    userMgmt.goToPage(pageno).then(function (page) {
      expect(page).toBe(true);
    });
  });

  it('Test case 2 : Verify Save and exist poup displayed when clicked on '+
          'pegination while Adding/Editing Users', function () {
    userMgmt.paginationButtonsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    userMgmt.clickOnFirstUser().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.closeUserManagementWindow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
