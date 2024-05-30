/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser, ExpectedConditions } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BioRadUserManagementPage } from '../page-objects/bioRadUserManagement-e2e.po'
import { async } from '@angular/core/testing';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const bioRadUserManagementPage = new BioRadUserManagementPage();

let jsonData;

library.parseJson('./JSON_data/PBI-10794-Edit-A-User-Bio-Rad-User-Management.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Edit A User In Bio-Rad User Management', function () {

  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToBioRadUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it("Test Case 1: Verify that the Bio-Rad Manager can view the edit user details screen by clicking the user name", async () => {
    await bioRadUserManagementPage.searchEmail(jsonData.UserDetailsScreenEmail)
    await bioRadUserManagementPage.clickNameInListAt(0);
    await bioRadUserManagementPage.verifyThatAllInputFieldsForEditUserIsDisplay();
  });

  it("Test Case 2: Verify that the Bio-Rad Manager can see the previous data for by clicking on user name", async () => {
    bioRadUserManagementPage.verifyPreviousData(jsonData.PreviousDataEmail);
  });

  it("Test Case 3: Verify that the Bio-Rad Manager can see the Cancel and Update Button when he clicks on user name", async () => {
    await bioRadUserManagementPage.clickNameInListAt(0);
    let cancelButtonFlag = await bioRadUserManagementPage.isCancelButtonDisplayed();
    expect(cancelButtonFlag).toBeTrue;
    let updateButtonFlag = await bioRadUserManagementPage.isUpdateButtonDisplayed();
    expect(updateButtonFlag).toBeTrue;
  });

  it("Test Case 4: Verify that the Bio-Rad Manager can see the red error text 'Select a role' if the Role is left unselected", async () => {
    await bioRadUserManagementPage.searchEmail(jsonData.TC1Email)
    await bioRadUserManagementPage.clickNameInListAt(0);
    library.waitAndClickJS(bioRadUserManagementPage.inputFieldRoleDropdown);
    await bioRadUserManagementPage.deSelectAllRolesInDropdown();
    library.clickAction(bioRadUserManagementPage.inputFieldEmail);
    let flag = await bioRadUserManagementPage.isRoleErrorTextVisisble();
    expect(flag).toBe(true);
  });

  it("Test Case 5: Verify The Bio-Rad Manager is presented with the Pop-Up message when he clicks the 'X'", async () => {
    await bioRadUserManagementPage.searchEmail(jsonData.TC1Email)
    await bioRadUserManagementPage.clickNameInListAt(0);
    library.waitAndClickJS(bioRadUserManagementPage.inputFieldRoleDropdown);
    await bioRadUserManagementPage.deSelectAllRolesInDropdown();
    await library.waitForElements(2000);
    await library.waitAndClickJS(bioRadUserManagementPage.btnClose);
    let popUpFlag = await bioRadUserManagementPage.isPopUpDisplayed();
    if (!popUpFlag) {
      library.logStepWithScreenshot("The Bio-Rad Manager is not presented with the Pop-Up message when he clicks the 'X'", "Pop Up Message");
    }
    expect(popUpFlag).toBe(true);
  });

  it("Test Case 6: Verify that the User Details are not updated when the Bio-Rad Manager clicks on Cancel button", async () => {
    bioRadUserManagementPage.searchEmail(jsonData.TC1Email)
    bioRadUserManagementPage.clickNameInListAt(0);
    let name = bioRadUserManagementPage.getNameInListAt(0);
    let email = bioRadUserManagementPage.getEmailInListAt(0);
    let role = bioRadUserManagementPage.getRoleInListAt(0);
    let territoryID = bioRadUserManagementPage.getTerritoryIDInListAt(0);
    bioRadUserManagementPage.enterEditUserDetails(jsonData.CancelButtonFirstName, jsonData.CancelButtonLastName, jsonData.CancelButtonEmail, jsonData.CancelButtonRole, jsonData.CancelButtonTerritoryID);
    bioRadUserManagementPage.clickOn_CANCEL_Button();
    bioRadUserManagementPage.clickNameInListAt(0);
    bioRadUserManagementPage.verifyInputDataForEditUser(name, email, role, territoryID);
  });

  it("Test Case 7: Verify that the Update button is disabled if no change is made by the Bio-Rad Manager ", async () => {
    bioRadUserManagementPage.searchEmail(jsonData.TC1Email)
    bioRadUserManagementPage.clickNameInListAt(0);
    let updatedFlag = bioRadUserManagementPage.isUpdateButtonEnabled();
    if (updatedFlag) {
      library.logStepWithScreenshot("The Update button is disabled if no change is made by the Bio-Rad Manager", "User Details");
    }
    expect(updatedFlag).toBeFalse;
  });

  it("Test Case 8: Verify that the User Details are updated when the Bio-Rad Manager clicks on 'UPDATE' button", async () => {
    await bioRadUserManagementPage.searchEmail(jsonData.UpdateButtonEmail);
    await bioRadUserManagementPage.clickNameInListAt(0);
    await bioRadUserManagementPage.enterEditUserDetails(jsonData.UpdateButtonFirstName, jsonData.UpdateButtonlastName, jsonData.UpdateButtonEmail, jsonData.UpdateButtonRole, jsonData.UpdateButtonTerritoryID);
    await bioRadUserManagementPage.clickOn_Update_Button();
    await library.waitTillLoading();
    await library.waitForElements(5000);
    await library.waitAndClickJS(bioRadUserManagementPage.btnClose);
    await library.waitForElements(2000);
    await dashBoard.goToBioRadUserManagementpage();
    await library.waitForElements(5000);
    await bioRadUserManagementPage.searchEmail(jsonData.TC7email);
    await bioRadUserManagementPage.clickNameInListAt(0);
    await bioRadUserManagementPage.verifyInputDataForEditUser(jsonData.TC7firstName+" "+jsonData.TC7lastName, jsonData.TC7email, jsonData.TC7role, jsonData.TC7territoryID);
  });

})
