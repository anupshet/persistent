/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from '../../node_modules/protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Manually-Edit-User.json').then(function (data) {
  jsonData = data;
});

describe('Testing: Manually Edit a User (Suite ID: 109596)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const userManage = new UserManagement();
  const dashBoard = new Dashboard();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });

  it('Test case 109600: Verify the Assign User Role when Logged in user updated as Admin @P1', function () {
    library.logStep('Test case 109600: Verify the Assign User Role when Logged in user updated as Admin');
    library.logStep('Test case 109597: Verify Admin user is able to Navigate to User Management screen');
    library.logStep('Test case 109598: Verify Logged in user is able to Scroll the User Management screen');
    library.logStep('Test case 109814: Verify the editable functionality of Role toggle on Edit user card');
    library.logStep('Test case 109815: Verify the Role change functionality at Edit User page');
    library.logStep('Test case 109816: Verify user is able to change Role for existing user at User Management page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.Firstname).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickEditUserRoleToggleButton().then(function (roleClicked) {
      expect(roleClicked).toBe(true);
    });
    userManage.clickSaveChangesButton().then(function (saved) {
      expect(saved).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
    out.signOut().then(function (success) {
      expect(success).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.Email, jsonData.Password, jsonData.Firstname).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.clickGearIcon().then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.verifyMenuItemsForAdmin('admin').then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 109601: Verify the Assign User Role when Logged in user updated as User @P1', function () {
    library.logStep('Test case 109601: Verify the Assign User Role when Logged in user updated as User');
    library.logStep('Test case 109817: Verify Change User Role Assignment Functionality for Lab User');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.Firstname).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.clickEditUserRoleToggleButton().then(function (roleClicked) {
      expect(roleClicked).toBe(true);
    });
    userManage.clickSaveChangesButton().then(function (saved) {
      expect(saved).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
    out.signOut().then(function (success) {
      expect(success).toBe(true);
    });
    loginEvent.doLogin(jsonData.Email, jsonData.Password, jsonData.Firstname).then(function (login) {
      expect(login).toBe(true);
    });
    dashBoard.clickGearIcon().then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.verifyMenuItemsForAdmin('user').then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 109603: Verify the required fields on Edit User card', function () {
    library.logStep('Test case 109603: Verify the required fields on Edit User card');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.Firstname).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyRequiredFieldsEditUser().then(function (reqFields) {
      expect(reqFields).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 109604: Verify unique user update functionality on edit user', function () {
    library.logStep('Test case 109604: Verify unique user update functionality on edit user');
    library.logStep('Test case 109813: Verify Logged in user is able to select the Existing User');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.Firstname).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.uniqueUserEditEmail(jsonData.Email2).then(function (uniqueUser) {
      expect(uniqueUser).toBe(true);
    });
    userManage.clickSaveChangesButton().then(function (saved) {
      expect(saved).toBe(true);
    });
    userManage.verifyErrorMessageForUniqueEmail().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    userManage.clickEditUserCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 1: To verify that the Lot Viewer Admin email field is not editable', function () {
    library.logStep('PBI-194544 TC 1: To verify that the Lot Viewer Admin email field is not editable');
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerAdminUsername, jsonData.LotViewerAdminPassword, jsonData.LotViewerAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.expandUserCard(jsonData.LotViewerAdminFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function (emailDisabled) {
      expect(emailDisabled).toBe(true);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 2: To verify that the Lot Viewer User email field is editable', function () {
    library.logStep('PBI-194544 TC 2: To verify that the Lot Viewer User email field is editable');
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerAdminUsername, jsonData.LotViewerAdminPassword, jsonData.LotViewerAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.expandUserCard(jsonData.LotViewerUserFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabledLotViewerUser().then(function (emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 3: To verify that the Unity-Next Admin email field is editable', function () {
    library.logStep('PBI-194544 TC 3: To verify that the Unity-Next Admin email field is editable');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdminUsername, jsonData.UnityNextAdminPassword, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.UnityNextAdminFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function (emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('PBI-194544 TC 4: To verify that the Unity-Next User email field is editable', function () {
    library.logStep('PBI-194544 TC 4: To verify that the Unity-Next User email field is editable');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UnityNextAdminUsername, jsonData.UnityNextAdminPassword, jsonData.UnityNextAdminFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (found) {
      expect(found).toBe(true);
    });
    userManage.verifyDeleteUserButton(jsonData.UnityNextUserFirstName).then(function (result) {
      expect(result).toBe(true);
    });
    userManage.verifyEmailDisabled().then(function (emailDisabled) {
      expect(emailDisabled).toBe(false);
    });
    userManage.closeUserManagementWindow().then(function (closed) {
      expect(closed).toBe(true);
    });
  });
});
