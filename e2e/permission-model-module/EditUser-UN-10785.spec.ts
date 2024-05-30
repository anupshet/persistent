/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();
const userMgmt = new UserManagement();

library.parseJson('./JSON_data/EditUser-UN-10785.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: UN-10785 : Edit and Delete a User', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  xit('Test case 1 : Verify edit user option dispalys on clicking on username from user management list' +
  'Test case 2 : Verify mandatory fields while updating existing user', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.verifyMandatoryFieldsOnUpdateUserPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });

  });

  xit('Test case 3 : Verify Updated username is displayed on user management page' +
          'Verify the update buttton is disabled by default when no changes are made', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.verifyUpdateBtnIsDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    userMgmt.updateUserDetails(jsonData.updatedFirstName,jsonData.updatedLastName,"","").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.userName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.updatedUserName, jsonData.UserNameColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  xit('Test case 4 : Verify error message is shown for the duplicate email id.', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.updateUserDetails("","",jsonData.existingEmailID,"").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //From Shubham's PO file - Note
    /* verifyErrorMessageForExistingUser */
  });

  //Need to check with DEV Team - Note
  /* Verify role dropdown is displayed with below 5 options for User managment */

  xit('Test case 5 : Verify admin is able to update the roles of user', function () {
    //Click on Such existing user which which will have only updated role present in search - Note
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.updateUserDetails("","","",jsonData.updatedUserRole).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.Role).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.updatedRole, jsonData.roleColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  xit('Test case 6 : Verify updated location is displayed', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //To only expand "ParentLocaitonName","true","false"
    userMgmt.selectItems(jsonData.locationName,jsonData.expandOrNot,jsonData.Select).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.Location).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.updatedLocation, jsonData.locationColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  xit('Test case 6 : Verify updated location is displayed', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //To only expand "ParentLocaitonName","true","false" - Note
    userMgmt.selectItems(jsonData.locationName,jsonData.expandOrNot,jsonData.Select).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.Location).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.updatedLocation, jsonData.locationColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  xit('Test case 7 : Verify the cancel buttton is disabled by default when no changes are made'+
        'Test case 8 : Verify the functionality of cancel button', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.clickOnCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.selectItems(jsonData.locationName,jsonData.expandOrNot,jsonData.Select).then(function (clicked) {
      expect(clicked).toBe(false);
    });
  });


  xit('Test case 7 : Verify Save and exit popup is displayed when clicked on close user management window while updating user', function () {
    userMgmt.clickOnExistingUser(jsonData.existingUser).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.updateUserDetails(jsonData.updatedFirstName,"","","").then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.closeUserManagementWindow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    userMgmt.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    userMgmt.clickOnExitWithoutSavingBtn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.Username).then(function (selected) {
      expect(selected).toBe(true);
    });
    //Updated Username should not be displayed
    accountsTab.searchAndVerify(jsonData.updatedUsername, jsonData.usernameColumnNo).then(function (verified) {
      expect(verified).toBe(false);
    });

  });

});
