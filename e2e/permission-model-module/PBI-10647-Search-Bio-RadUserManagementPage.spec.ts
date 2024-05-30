/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BioRadUserManagementPage } from '../page-objects/bioRadUserManagement-e2e.po'


let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();
const bioRadUserManagementPage = new BioRadUserManagementPage();


const fs = require('fs');
library.parseJson('./JSON_data/PBI-10647-BioRadUserManagementPage.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bio-Rad UserManagement', function () {
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

  it("Test case 1:To verify UI components of bio-rad usermanagementpage", async () => {
    library.logStep("TC#1: Verify that user should be able to see Bio-rad logo at Bio-rad user management page when user login as a Account manager");
    library.logStep("TC#4: Verify that user should be able to see search bar at Bio-rad user management page");
    library.logStep("TC#5: Verify that user should be able to see search and reset button at Bio-rad user management page r");
    library.logStep("TC#6: Verify that user should be able to see the input field for add user (i.e First name, Last name, Email, RoleDropdown, Territory ID) at Bio-rad user management page");
    library.logStep("TC#7: Verify that user should be able to see the buttons (i.e ADD and CANCEL) at Bio-rad user management page");

    let isLogoDisplay = await bioRadUserManagementPage.verifyThatBioRadLogoIsDisplay()
    expect(isLogoDisplay).toBe(true);

    let isInputSearchBarSearchAndResetButtonDisplay = await bioRadUserManagementPage.verifyThatSearchBarSearchButtonAndResetButtonIsDisplay()
    expect(isInputSearchBarSearchAndResetButtonDisplay).toBe(true);

    let isInputFieldsIsDisplay = await bioRadUserManagementPage.verifyThatAllInputFieldsForAddingUserIsDisplay()
    expect(isInputFieldsIsDisplay).toBe(true);

    let isAddAndCancelBtnAreDisplay = await bioRadUserManagementPage.verifyThat_ADD_and_CANCEL_Button_Are_Displayed()
    expect(isAddAndCancelBtnAreDisplay).toBe(true);

  });

  it("Test case 2:Verify that user should be able to see category dropdown at Bio-rad user management page", async () => {
    library.logStep("TC#2: Verify that user should be able to see category dropdown at Bio-rad user management page");
    library.logStep("TC#3: Verify that user should be able to see values in category dropdown (i.e Name, Email, Role, Territory ID) at Bio-rad user management page");

    let isCategoryDropdownDisplay = await bioRadUserManagementPage.verifyThatCategoryDropdownIsDisplay()
    expect(isCategoryDropdownDisplay).toBe(true);

    let isCategoryDropdownValuesAreDisplay = await bioRadUserManagementPage.verifyThatAllValueInCategoryDropdownIsDisplay()
    expect(isCategoryDropdownValuesAreDisplay).toBe(true);

  });

  it("Test case 8:Verify that user should be able to see category dropdown at Bio-rad user management page", async () => {
    library.logStep("TC#8: Verify that user should be able to see the values in RoleDropdown (i.e Bio-Rad Manager, CTS user, Lot viewer sales) at Bio-rad user management page");

    let isRolesDropdownValuesAreDisplay = await bioRadUserManagementPage.verifyThatAllValueInRolesDropdownIsDisplay()
    expect(isRolesDropdownValuesAreDisplay).toBe(true);
  });

  it("Test case 9:Verify search functionality based on 'Name' At Bio-rad user management page", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Name")
    expect(isCateogerySelected).toBe(true);

    let isSearchFunctionalityWorksWithName = await bioRadUserManagementPage.searchAndVerify(jsonData.KeywordForName, jsonData.ColumnNo1)
    expect(isSearchFunctionalityWorksWithName).toBe(true);
  });

  it("Test case 10:Verify search functionality based on 'Email' At Bio-rad user management page", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Email")
    expect(isCateogerySelected).toBe(true);

    let isSearchFunctionalityWorksWithEmail = await bioRadUserManagementPage.searchAndVerify(jsonData.KeywordForEmail, jsonData.ColumnNo2)
    expect(isSearchFunctionalityWorksWithEmail).toBe(true);
  });

  it("Test case 11:Verify search functionality based on 'Role' At Bio-rad user management page", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Role");
    expect(isCateogerySelected).toBe(true);

    let isSearchFunctionalityWorksWithRole = await bioRadUserManagementPage.searchAndVerify(jsonData.KeywordForRole, jsonData.ColumnNo3)
    expect(isSearchFunctionalityWorksWithRole).toBe(true);
  });

  it("Test case 12:Verify search functionality based on 'Territory ID' At Bio-rad user management page", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Territory ID");
    expect(isCateogerySelected).toBe(true);

    let isSearchFunctionalityWorksWithTerritoryID = await bioRadUserManagementPage.searchAndVerify(jsonData.KeywordForTerritoryId, jsonData.ColumnNo4)
    expect(isSearchFunctionalityWorksWithTerritoryID).toBe(true);
  });

  it("Test case 13:Verify that user should be able to see default view after clicking on Reset", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Name")
    expect(isCateogerySelected).toBe(true);

    let isValueGettingEntered = await bioRadUserManagementPage.enterTheValueInSearchBar(jsonData.KeywordForName);
    expect(isValueGettingEntered).toBe(true);

    let isResetFunctionalityWorks = await bioRadUserManagementPage.clickOnResetAndVerify();
    expect(isResetFunctionalityWorks).toBe(true);
  });

  it("Test case 14:Verify that pagination should be displayed at Bio-rad user management page if there is more than 25 result for perticular search category", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Role")
    expect(isCateogerySelected).toBe(true);

    let isValueGettingEntered = await bioRadUserManagementPage.enterTheValueInSearchBar(jsonData.keyWordForPagi);
    expect(isValueGettingEntered).toBe(true);

    let isClickedOnSearch = await bioRadUserManagementPage.clickOnSearch();
    expect(isClickedOnSearch).toBe(true);

    let isPaginatinWorks = await bioRadUserManagementPage.verifyPaginationForSearchResults();
    expect(isPaginatinWorks).toBe(true);
  });

  it("Test case 15:Verify that pagination should NOT be displayed if there is less than 25 result Or No result for perticular search category", async () => {
    let isCateogerySelected = await bioRadUserManagementPage.selectSearchCatagory("Email");
    expect(isCateogerySelected).toBe(true);

    let isValueGettingEntered = await bioRadUserManagementPage.enterTheValueInSearchBar(jsonData.keyWordForNoPagi);
    expect(isValueGettingEntered).toBe(true);

    let isClickedOnSearch = await bioRadUserManagementPage.clickOnSearch();
    expect(isClickedOnSearch).toBe(true);

    let isPaginatinWorks = await bioRadUserManagementPage.verifyPaginationForSearchResults();
    expect(isPaginatinWorks).toBe(false);
  });


});
