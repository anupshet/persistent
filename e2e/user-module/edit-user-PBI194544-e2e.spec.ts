/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Edit-User-PBI194544.json').then(function(data) {
  jsonData = data;
})


describe('Testing: PBI194544 Lot Viewer Admin Email Field should be non-editable', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const userManage = new UserManagement();
  const dashBoard = new Dashboard();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });

  it('PBI-194544 TC 1: To verify that the Lot Viewer Admin email field is not editable', function () {
    library.logStep('PBI-194544 TC 1: To verify that the Lot Viewer Admin email field is not editable');
    // tslint:disable-next-line: max-line-length
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerAdminUsername, jsonData.LotViewerAdminPassword, jsonData.LotViewerAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.expandUserCard(jsonData.LotViewerAdminFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function(emailDisabled) {
      expect(emailDisabled).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 2: To verify that the Lot Viewer User email field is editable', function () {
    library.logStep('PBI-194544 TC 2: To verify that the Lot Viewer User email field is editable');
    // tslint:disable-next-line: max-line-length
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerAdminUsername, jsonData.LotViewerAdminPassword, jsonData.LotViewerAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.expandUserCard(jsonData.LotViewerUserFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabledLotViewerUser().then(function(emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 3: To verify that the Unity-Next Admin email field is editable', function () {
    library.logStep('PBI-194544 TC 3: To verify that the Unity-Next Admin email field is editable');
    // tslint:disable-next-line: max-line-length
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdminUsername, jsonData.UnityNextAdminPassword, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.UnityNextAdminFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function(emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 4: To verify that the Unity-Next User email field is editable', function () {
    library.logStep('PBI-194544 TC 4: To verify that the Unity-Next User email field is editable');
    // tslint:disable-next-line: max-line-length
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdminUsername, jsonData.UnityNextAdminPassword, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.UnityNextUserFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function(emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });
});
