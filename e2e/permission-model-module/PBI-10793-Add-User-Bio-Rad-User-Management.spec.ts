/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BioRadUserManagementPage } from '../page-objects/bioRadUserManagement-e2e.po'

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const bioRadUserManagementPage = new BioRadUserManagementPage();

let jsonData;

library.parseJson('./JSON_data/PBI-10793-Add-User-Bio-Rad-User-Management.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Add a User in Bio-Rad User Management', function () {

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

  it("Test Case 1: To verify UI components of Bio-Rad User Management", async() => {

    library.logStep("TC#1: Verify The Bio-Rad Manager is able to see the BIO-RAD Logo");
    let isLogoDisplayed = await bioRadUserManagementPage.verifyThatBioRadLogoIsDisplay();
    expect(isLogoDisplayed).toBeTrue;

    library.logStep("TC#2: Verify The Bio-Rad Manager is able to see the 'ADD A BIO-RAD USER'");
    let isAddABioRadUserDisplayed = await bioRadUserManagementPage.verifyAddABioRadUserDisplayed();
    expect(isAddABioRadUserDisplayed).toBeTrue;

  });

  it("Test Case 3: To verify UI components of Bio-Rad User Management while adding user", async() => {

    library.logStep("TC#3: Verify The Bio-Rad Manager is able to see the First Name, Last Name, Email, Territory ID and Role fields");
    let isInputFieldsIsDisplay = await bioRadUserManagementPage.verifyThatAllInputFieldsForAddingUserIsDisplay();
    expect(isInputFieldsIsDisplay).toBe(true);

    library.logStep("TC#4: Verify The Bio-Rad Manager is able to see the following three roles under roles drop-down:- Bio-Rad Manager, Lot Viewer Sales, CTS User");
    let isRolesDropdownValuesAreDisplay = await bioRadUserManagementPage.verifyThatAllValueInRolesDropdownIsDisplay()
    expect(isRolesDropdownValuesAreDisplay).toBe(true);

    library.logStep("TC#11: Verify The Bio-Rad Manager is able to see the Cancel and Add Button");
    let isCancelButtonVisible = await bioRadUserManagementPage.verifyThat_ADD_and_CANCEL_Button_Are_Displayed();
    expect(isCancelButtonVisible).toBeTrue;

  });

  it("Test Case 5: Verify The Bio-Rad Manager is able to see the Territory ID field when Lot View Sales role is selected", async() => {
    library.logStep("TC#5: Verify The Bio-Rad Manager is able to see the Territory ID field when Lot View Sales role is selected");
    bioRadUserManagementPage.verifyTerritoryVisibilityForLotViewerSales();
  });

  it("Test Case 6: Verify The Bio-Rad Manager is not able to see Territory ID field when Bio-Rad Manager role is selected", async() => {
    library.logStep("TC#6: Verify The Bio-Rad Manager is not able to see Territory ID field when Bio-Rad Manager role is selected");
    bioRadUserManagementPage.verifyTerritoryVisibilityForBioRadManager();
  });

  it("Test Case 7: Verify The Bio-Rad Manager is not able to see Territory ID field when CTS role is selected", async() => {
    library.logStep("TC#7: Verify The Bio-Rad Manager is not able to see Territory ID field when CTS role is selected");
    bioRadUserManagementPage.verifyTerritoryVisibilityForCTS();
  });

  it("Test Case 8: Verify when The Bio-Rad Manager selects Lot Viewer Sales role then the Bio-Rad manager and CTS role should be disabled in the roles dropdown menu", async() => {
    library.logStep("TC#8: Verify when The Bio-Rad Manager selects Lot Viewer Sales role then the Bio-Rad manager and CTS role should be disabled in the roles dropdown menu");
    bioRadUserManagementPage.verifyDropDownOptionVisibilityForLVSales();
  });

  it("Test Case 9: Verify when The Bio-Rad Manager selects Bio-Rad manager role then the Lot Viewer should be disabled in the roles dropdown menu", async() => {
    library.logStep("TC#9: Verify when The Bio-Rad Manager selects Bio-Rad manager role then the Lot Viewer should be disabled in the roles dropdown menu");
    bioRadUserManagementPage.verifyDropDownOptionVisibilityForBioRadManager();
  });

  it("Test Case 10: Verify when The Bio-Rad Manager selects CTS role then the Lot Viewer should be disabled in the roles dropdown menu", async() => {
    library.logStep("TC#10: Verify when The Bio-Rad Manager selects CTS role then the Lot Viewer should be disabled in the roles dropdown menu");
    bioRadUserManagementPage.verifyDropDownOptionVisibilityForCTS();
  });

  it("Test Case 12: Verify The Bio-Rad Manager is presented with the Pop-Up message when he clicks the 'X'", async() => {
    bioRadUserManagementPage.verifyPopUpMessage(jsonData.FirstName, jsonData.LastName);
  });

  it("Test Case 14: Verify when the Bio-Rad Manager clicks on EXIT WITHOUT SAVING in the Pop-Up Message then the user is not added", async () => {
    bioRadUserManagementPage.verifyUserNotAddedWhenExitWithoutSavingPopUp(jsonData.FirstName, jsonData.LastName, jsonData.Email, jsonData.Role, jsonData.TerritoryID);
  });

  it("Test Case 15: Verify when the Bio-Rad Manager clicks on SAVE AND EXIT in the Pop-Up then the user is added successfully", async() => {
    bioRadUserManagementPage.verifyUserAddedWhenSaveAndExitPopUp(jsonData.FirstNameTC15, jsonData.LastNameTC15, jsonData.EmailTC15, jsonData.RoleTC15, jsonData.TerritoryIDTC15);
  });

  it("Test Case 16: Verify the user is added successfully when the Bio-Rad Manager enters all the fields and clicks Add", async() => {
    library.logStep("TC16: Verify the user is added successfully when the Bio-Rad Manager enters all the fields and clicks Add");
    let isUserAdded = bioRadUserManagementPage.verifyUserAdded(jsonData.FirstNameTC16, jsonData.LastNameTC16, jsonData.EmailTC16, jsonData.RoleTC16, jsonData.TerritoryIDTC16);
    expect(isUserAdded).toBeTrue;
  });

  it("Test Case 17: Verify the user is not added when the Bio-Rad Manager enters all the fields and clicks Cancel", async() => {
    bioRadUserManagementPage.verifyUserNotAdded(jsonData.FirstNameTC17, jsonData.LastNameTC17, jsonData.EmailTC17, jsonData.RoleTC17, jsonData.TerritoryIDTC17);
  });

  it("Test Case 18: Verify the details of user are same as entered by the Bio-Rad Manager", async() => {
    bioRadUserManagementPage.verifyUserDetailsAreSame(jsonData.FirstNameTC18, jsonData.LastNameTC18, jsonData.EmailTC18, jsonData.RoleTC18, jsonData.TerritoryIDTC18);
  });

  it("Test Case 19: Verify the Bio-Rad Manager gets an error when he enters an email for an already existing user", async() => {
    bioRadUserManagementPage.verifyErrorMessageForExistingUser(jsonData.FirstNameTC19, jsonData.LastNameTC19, jsonData.EmailTC19, jsonData.RoleTC19, jsonData.TerritoryIDTC19);
  });

});
