/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { DepFlags } from '@angular/compiler/src/core';
import { async } from '@angular/core/testing';
import * as assert from 'assert';
import { by, browser, element, protractor } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

var random_number, random_state, accountDeleted;
const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/AccountManager.json', (err, data) => {
  if (err) { throw err; }
  const accountManagerData = JSON.parse(data);
  jsonData = accountManagerData;
});

export class BioRadUserManagementPage {
  instrument_title = element(by.xpath("//div[contains(@class,'instrument-title')]"))
  bioRadLogo = element(by.xpath("//div[@class='biorad-user-management-component']//div[@class='bio-rad-logo']"))
  categoryDropdown = element(by.xpath("//unext-biorad-user-management//mat-form-field[contains(@class, 'field-Category')]"))
  dropdownValueName = element(by.xpath("//mat-option//span[contains(text(), 'Name')]"))
  dropdownValueEmail = element(by.xpath("//mat-option//span[contains(text(), 'Email')]"))
  dropdownValueRole = element(by.xpath("//mat-option//span[contains(text(), 'Role')]"))
  dropdownTerritoryID = element(by.xpath("//mat-option//span[contains(text(), 'Territory ID')]"))
  searchInput = element(by.xpath("//unext-biorad-user-management//input[@name='searchInput']"))
  searchButton = element(by.xpath("//unext-biorad-user-management//button//span[contains(text(), 'Search')]"))
  resetButton = element(by.xpath("//unext-biorad-user-management//button//span[contains(text(), 'Reset')]"))

  inputFieldFirstname = element(by.xpath("//unext-biorad-user-management//input[@id='firstName']"))
  inputFieldLastname = element(by.xpath("//unext-biorad-user-management//input[@id='lastName']"))
  inputFieldEmail = element(by.xpath("//unext-biorad-user-management//input[@id='userEmail']"))
  inputFieldRoleDropdown = element(by.xpath("//unext-biorad-user-management//mat-select[@formcontrolname='userRole']//div/span"))
  inputFieldTerritoryID = element(by.xpath("//unext-biorad-user-management//input[@id='territoryId']"))
  roleDropDownError = element(by.xpath("//unext-biorad-user-management//mat-error[contains(text(), 'Please select at least one Role')]"))

  roleDropdownValueBioRadManager = element(by.xpath("//mat-option//span[contains(text(), 'Bio-Rad Manager')]/.."))
  roleDropdownValueCTSUser = element(by.xpath("//mat-option//span[contains(text(), 'CTS user')]/.."))
  roleDropdownValueLotViewerSales = element(by.xpath("//mat-option//span[contains(text(), 'Lot Viewer sales')]/.."))

  addButton = element(by.xpath("//unext-biorad-user-management//button//span[contains(text(), 'Add')]"))
  cancelButton = element(by.xpath("//unext-biorad-user-management//button//span[contains(text(), 'Cancel')]"))
  updateButton = element(by.xpath("//unext-biorad-user-management//button[contains(., 'Update')]"))
  nextPageBtn = element(by.xpath("//unext-biorad-user-management//button[contains(@class, 'spec-next-button')]"))
  paginationBtns = element.all(by.xpath('//*[@id="paginationBioRadUsers"]/div/div/button'))
  btnAddABioRadUser = element(by.xpath("//div[contains(@class, 'add-user-btn')]//button"));
  btnClose = element(by.xpath("//unext-biorad-user-management//button[contains(@class, 'close')]"));
  popUpMessage = element(by.xpath("//unext-biorad-user-management//div[@id='spec_warningBox']"));
  searchList = by.xpath("//unext-biorad-user-management//mat-row");
  btnExitWithoutSaving = element(by.buttonText("EXIT WITHOUT SAVING"));
  btnSaveAndExit = element(by.buttonText("SAVE AND EXIT"));
  searchResultName = element.all(by.xpath("//unext-biorad-user-management//mat-row/mat-cell[1]/div"));
  searchResultEmail = element.all(by.xpath("//unext-biorad-user-management//mat-row/mat-cell[2]"));
  searchResultRole = element.all(by.xpath("//unext-biorad-user-management//mat-row/mat-cell[3]"));
  searchResultTerritoryID = element.all(by.xpath("//unext-biorad-user-management//mat-row/mat-cell[4]"));
  errorMessageForExistingUser = element(by.xpath("//p[contains(text(), 'A user with the same email already exists')]"));
  loadingMessage = element(by.xpath("//div[contains(text(), 'Loading Bio-Rad users')]"));

  async verifyThatBioRadLogoIsDisplay() {
    let flag = false;
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath("//invlxpath"))), 5000,'Wait For Elements To Load');
    if (await this.bioRadLogo.isDisplayed()) {
      flag = true;
      console.log("Logo is display")
    }
    else {

      console.log("Logo is not display at Bio_RadUserManagementPage")

    }
    return flag;
  }
  async verifyThatCategoryDropdownIsDisplay() {
    let flag = false;
    if (await this.categoryDropdown.isDisplayed()) {
      flag = true;
      console.log("CategoryDropdown is display")
    }
    else {
      console.log("CategoryDropdown is not display at Bio_RadUserManagementPage")
    }
    return flag;
  }
  async verifyThatAllValueInCategoryDropdownIsDisplay() {
    let flag = false;
    library.click(this.categoryDropdown)
    if (await this.categoryDropdown.isDisplayed()) {
      library.clickJS_async(await this.categoryDropdown);
      if (await this.dropdownValueName.isDisplayed() && await this.dropdownValueEmail.isDisplayed() && await this.dropdownValueRole.isDisplayed() && await this.dropdownTerritoryID.isDisplayed()) {
        flag = true;
        console.log("CategoryDropdown Values is display")
      }

    }
    else {
      console.log("CategoryDropdown is not display at Bio_RadUserManagementPage")
    }
    return flag;
  }
  async verifyThatSearchBarSearchButtonAndResetButtonIsDisplay() {
    let flag = false;
    this.searchInput.sendKeys("QWERTY");
    if (await this.searchInput.isDisplayed() && await this.searchButton.isDisplayed() && await this.resetButton.isDisplayed()) {
      flag = true;
      console.log("SearchBar, Search and Reset button is display")
    }
    else {
      console.log("SearchBar, Search and Reset button is not display")

    }
    return flag
  }
  async verifyThatAllInputFieldsForAddingUserIsDisplay() {
    let flag = false;
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser));
    library.click(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown));
    library.click(this.inputFieldRoleDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueLotViewerSales));
    library.click(this.roleDropdownValueLotViewerSales);
    if (await this.inputFieldFirstname.isDisplayed() && await this.inputFieldLastname.isDisplayed() && await this.inputFieldEmail.isDisplayed() && await this.inputFieldRoleDropdown.isDisplayed() && await this.inputFieldTerritoryID.isDisplayed()) {
      flag = true;
      console.log("All InputFields are display")
    }
    else {
      console.log("All InputFields are not display")
    }
    return flag;
  }
  async verifyThat_ADD_and_CANCEL_Button_Are_Displayed() {
    let flag = false;
    if (await this.addButton.isDisplayed() && await this.cancelButton.isDisplayed()) {
      flag = true;
      console.log("Add and Cancel button is display")
    }
    else {
      console.log("Add and Cancel button is not display")
    }
    return flag;
  }
  async verifyThatAllValueInRolesDropdownIsDisplay() {
    let flag = false;
    if (await this.roleDropdownValueBioRadManager.isDisplayed() && await this.roleDropdownValueCTSUser.isDisplayed() && await this.roleDropdownValueLotViewerSales.isDisplayed()) {
      flag = true;
      console.log("All Values in RoleDropdown is display")
    }
    else {
      console.log("RoleDropdownValues is not display in roles dropdown")
    }
    return flag;
  }
  async addUserInBioRadManagementPage(firstName, lastName, email, role, id) {
    let flag = false;
    if (await this.inputFieldFirstname.isDisplayed()) {
      await this.inputFieldFirstname.clear();
      await this.inputFieldFirstname.sendKeys(firstName);
      console.log("First name value is enter");
      library.logStep("First name value is enter");
      flag = true;
    }
    else {
      console.log("FirstName value is not getting enter");

      return flag;
    }
    if (await this.inputFieldLastname.isDisplayed()) {

      await this.inputFieldLastname.clear();
      await this.inputFieldLastname.sendKeys(lastName);
      console.log("Lastname  value is enter");
      library.logStep("Lastname value is enter");
      flag = true;
    }
    else {
      console.log("Lastname  value is not getting enter");
      return flag;
    }

    if (await this.inputFieldEmail.isDisplayed()) {
      await this.inputFieldEmail.clear();
      await this.inputFieldEmail.sendKeys(email);
      console.log("Email value is enter");
      library.logStep("Email value is enter");
      flag = true;
    }
    else {
      console.log("Email value is not enter");
      return flag;
    }

    if (await this.inputFieldRoleDropdown.isDisplayed()) {

      library.clickJS_async(await this.inputFieldRoleDropdown);
      //library.clickWithJS(await this.inputFieldRoleDropdown);
      console.log("RoleDropdown value is selected");
      library.logStep("RoleDropdown value is selected");
      flag = true;
    }
    else {
      console.log("RoleDropdown value is not getting selected");
      return flag;
    }
    if (await this.inputFieldTerritoryID.isDisplayed()) {
      await this.inputFieldTerritoryID.clear();
      await this.inputFieldTerritoryID.sendKeys(id);
      console.log("TerritoryID value is enter");
      library.logStep("TerritoryID  value is enter");
      flag = true;
    }
    else {
      console.log("TerritoryID value is not getting enter");
      return flag;
    }
  }
  async clickOn_ADD_Button() {
    let flag = false;
    if (await this.addButton.isDisplayed()) {
      library.clickJS_async(await this.addButton);
      console.log("Add Button is getting clicked")
      flag = true;
    }
    else {
      console.log("ADD Button is not getting clicked")
    }
    return flag;
  }
  async clickOn_CANCEL_Button() {
    let flag = false;
    if (await this.cancelButton.isDisplayed()) {
      library.clickJS_async(await this.cancelButton);
      console.log("CANCEL Button is getting clicked")
      flag = true;
    }
    else {
      console.log("CANCEL Button is not getting clicked")
    }
    return flag;
  }
  async selectSearchCatagory(catagory) {
    let flag = false;
    let catagoryOption;
    switch (catagory) {
      case "Name":
        catagoryOption = this.dropdownValueName;
        break;
      case "Email":
        catagoryOption = this.dropdownValueEmail;
        break;
      case "Role":
        catagoryOption = this.dropdownValueRole;
        break;
      case "Territory ID":
        catagoryOption = this.dropdownTerritoryID;
        break;
      default:
        catagoryOption = element(by.xpath("//mat-option/span[contains(.,'" + catagory + "')]"));
    }
    library.waitAndClick(this.categoryDropdown);
    if (await catagoryOption.isDisplayed()) {
      library.waitAndClickJS(await catagoryOption);
      console.log(catagory + " CatagoryOption is getting clicked")
      flag = true;
    }
    else {
      console.log(catagory + " CatagoryOption Button is not getting clicked")
    }
    return flag;

  }

  async enterTheValueInSearchBar(keyword) {
    let flag = false;
    await this.searchInput.sendKeys(keyword);
    console.log("Keyword entered")
    library.logStep("Keyword entered")
    flag = true;
    return flag;
  }

  async clickOnSearch() {
    let flag = false;
    if (await this.searchButton.isDisplayed()) {
      library.waitAndClickJS(await this.searchButton);
      console.log("Click on search button")
      library.logStep("Click on search button")
      flag = true;
    }
    return flag;
  }

  async clickOnResetAndVerify() {
    await dashBoard.waitForElement_async();
    let flag = false;

    if (await this.resetButton.isDisplayed()) {
      library.clickJS_async(await this.resetButton);
      let inputValue = await this.searchInput.getText();
      console.log(inputValue);
      if (inputValue == "") {
        console.log("Reset button is getting clicked and it works properly ")
        flag = true;
      }
      else {
        console.log("Reset button is getting clicked but NOT works properly")
      }

    }
    return flag;
  }
  async searchAndVerify(keyword, columnNo) {
    let flag = true;
    await this.searchInput.sendKeys(keyword);
    library.logStep("Keyword entered")
    await library.clickJS_async(this.searchButton);
    await dashBoard.waitForElement_async();
    let columnTextValues = element.all(by.xpath("//mat-cell[contains(@class,'mat-cell')][" + columnNo + "]"));
    let totalCountOfColumnValues = await columnTextValues.count();
    console.log("totalCountOfColumnValues ", totalCountOfColumnValues)
    for (let i = 0; i < totalCountOfColumnValues; i++) {
      await library.scrollToElement_async(await columnTextValues.get(i));

      let text = await columnTextValues.get(i).getText();
      let textUppercase = text.toUpperCase();
      console.log("Filter ", textUppercase, i)

      if (textUppercase.includes(keyword.toUpperCase())) {
        console.log("Filter Works", textUppercase, " ", keyword.toUpperCase())
      }
      else {
        console.log("Filter is not Works", textUppercase, " ", keyword.toUpperCase())
        flag = false;
        break;
      }
    }
    if (flag) {
      console.log(keyword + " Search for user using filters. is working")
    }
    else {
      console.log(keyword + " Search for user using filters not is working")
      library.logStepWithScreenshot(keyword + ' Search for user using filters is not working ', 'FilteringIs_NOT_WorkingProperly');
    }
    return flag;
  }

  async verifyPaginationForSearchResults() {
    let flag = false;
    await library.waitForElements(5000);
    let paginationCount = await this.paginationBtns.count();
    console.log("Pagination Button Count - " + paginationCount)
    if (paginationCount >= 2) {
      library.logStep('Paginations is works properly ');
      flag = true;

    } else {

      flag = false;

    }
    return flag;

  }

  async verifyAddABioRadUserDisplayed() {
    await library.waitForElements(5000);
    let flag = false;
    if (await this.btnAddABioRadUser.isDisplayed()) {
      flag = true;
      console.log("'ADD A BIO-RAD USER' button is display");
    }
    else {
      console.log("'ADD A BIO-RAD USER' button is not display at Bio-Rad User Management Page");
    }
    return flag;
  }

  async verifyTerritoryVisibilityForLotViewerSales() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.clickJS(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    library.clickJS(this.inputFieldRoleDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueLotViewerSales), 10000);
    library.clickJS(this.roleDropdownValueLotViewerSales);

    this.inputFieldTerritoryID.isPresent().then(function (flag) {
      if (flag == false) {
        library.logFailStep("Territory ID Not Visible")
      }
      expect(flag).toBe(true);
    });
  }

  verifyTerritoryVisibilityForBioRadManager() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    this.inputFieldRoleDropdown.click();
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueBioRadManager), 10000);
    library.click(this.roleDropdownValueBioRadManager);
    library.waitForElements(2000);

    this.inputFieldTerritoryID.isPresent().then(function (flag) {
      if (flag == true) {
        library.logFailStep("Territory ID Visible")
      }
      expect(flag).toBe(false);
    });
  }
  async verifyTerritoryVisibilityForCTS() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.clickJS(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    this.inputFieldRoleDropdown.click();
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueCTSUser), 10000);
    library.click(this.roleDropdownValueCTSUser);

    this.inputFieldTerritoryID.isPresent().then(function (flag) {
      if (flag == true) {
        console.log("Territory ID Visible")
        library.logFailStep("Territory ID Visible")
      }
      expect(flag).toBe(false);
    });
  }

  async verifyTerritoryIDDisplayed() {
    let flag = false;
    library.click(this.btnAddABioRadUser);
    if (await this.inputFieldTerritoryID.isDisplayed) {
      flag = true;
      console.log("Territory ID is display");
    }
    else {
      console.log("Territory ID not is display");
      library.logStepWithScreenshot("Territory ID not Displayed at Bio_RadUserManagementPage", "Territory ID Field");
    }
    return flag;
  }

  async verifyDropDownOptionVisibilityForLVSales() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    library.click(this.inputFieldRoleDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueLotViewerSales), 10000);
    library.click(this.roleDropdownValueLotViewerSales);
    await library.waitForElements(2000);
    this.roleDropdownValueBioRadManager.getAttribute("aria-disabled").then(function (value) {
      if (value == "false") {
        console.log("Bio-Rad Manager is enable when Lot Viewer Sales Role is selected");
        library.logFailStep("Bio-Rad Manager is enable when Lot Viewer Sales Role is selected");
      }
      expect(value).toBe("true");
    });
    this.roleDropdownValueCTSUser.getAttribute("aria-disabled").then(function (value) {
      if (value == "false") {
        console.log("CTS role is enable when Lot Viewer Sales Role is selected");
        library.logFailStep("CTS role is enable when Lot Viewer Sales Role is selected");
      }
      expect(value).toBe("true");
    });
  }

  verifyDropDownOptionVisibilityForBioRadManager() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    library.click(this.inputFieldRoleDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueBioRadManager), 10000);
    library.click(this.roleDropdownValueBioRadManager);
    library.waitForElements(2000);
    this.roleDropdownValueCTSUser.getAttribute("aria-disabled").then(function (value) {
      if (value == "true") {
        console.log("CTS Role is disable when Bio-Rad Manager Role is selected");
        library.logStepWithScreenshot("CTS Role is disable when Bio-Rad Manager is selected", "Bio-Rad Manager Dropdown Option");
      }
      expect(value).toBe("false");
    });
    this.roleDropdownValueLotViewerSales.getAttribute("aria-disabled").then(function (value) {
      if (value == "false") {
        console.log("Lot Viewer Sales role is enable when Bio-Rad Manager Role is selected");
        library.logStepWithScreenshot("Lot Viewer Sales role is enable when Bio-Rad Manager is selected", "Bio-Rad Manager Dropdown Option");
      }
      expect(value).toBe("true");
    });
  }

  async verifyDropDownOptionVisibilityForCTS() {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.inputFieldRoleDropdown), 10000);
    library.click(this.inputFieldRoleDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.roleDropdownValueCTSUser), 10000);
    library.click(this.roleDropdownValueCTSUser);
    await library.waitForElements(2000);
    this.roleDropdownValueBioRadManager.getAttribute("aria-disabled").then(function (value) {
      if (value == "true") {
        console.log("Bio-Rad Manager Role is disable when CTS Role is selected");
        library.logStepWithScreenshot("Bio-Rad Manager Role is disable when CTS is selected", "Bio-Rad Manager Dropdown Option");
      }
      expect(value).toBe("false");
    });
    this.roleDropdownValueLotViewerSales.getAttribute("aria-disabled").then(function (value) {
      if (value == "false") {
        console.log("Lot Viewer Sales role is enable when CTS Role is selected");
        library.logStepWithScreenshot("Lot Viewer Sales role is enable when CTS is selected", "Lot Viewer Sales Dropdown Option");
      }
      expect(value).toBe("true");
    });
  }

  async verifyPopUpMessage(firstName, lastName) {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    this.inputFieldFirstname.sendKeys(firstName);
    this.inputFieldLastname.sendKeys(lastName);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnClose), 10000);
    library.click(this.btnClose);
    await library.waitForElements(2000);
    this.popUpMessage.isDisplayed().then(function (value) {
      if (value == false) {
        library.logStep("Pop-Up Message Is Not Displayed");
      }
      expect(value).toBe(true);
    });
  }

  async enterAddUserDetails(firstName, lastName, email, role, territoryID) {
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnAddABioRadUser), 10000);
    library.click(this.btnAddABioRadUser);
    await library.waitForElements(2000);
    this.inputFieldFirstname.clear();
    this.inputFieldLastname.clear();
    this.inputFieldEmail.clear();
    this.inputFieldFirstname.sendKeys(firstName);
    this.inputFieldLastname.sendKeys(lastName);
    this.inputFieldEmail.sendKeys(email);
    library.click(this.inputFieldRoleDropdown)
    switch (role) {
      case 'BioRadManager':
        library.click(this.roleDropdownValueBioRadManager);
        break;
      case 'LotViewerSales':
        library.click(this.roleDropdownValueLotViewerSales);
        break;
      case 'CTSUser':
        library.click(this.roleDropdownValueCTSUser);
        break;
      default:
        library.logFailStep("Invalid Role Data Supplied")
        assert(false, "Invalid Role Data Supplied");
    }
    if (role == "LotViewerSales") {
      this.inputFieldLastname.clear();
      this.inputFieldLastname.sendKeys(territoryID);
    }
  }

  async enterEditUserDetails(firstName, lastName, email, role, territoryID) {
    await await library.waitForElements(2000);
    await this.inputFieldFirstname.clear();
    await this.inputFieldLastname.clear();
    await this.inputFieldEmail.clear();
    await this.inputFieldFirstname.sendKeys(firstName);
    await this.inputFieldLastname.sendKeys(lastName);
    await this.inputFieldEmail.sendKeys(email);
    library.click(this.inputFieldRoleDropdown);
    await this.deSelectAllRolesInDropdown();
    switch (role) {
      case 'BioRadManager':
        library.click(this.roleDropdownValueBioRadManager);
        break;
      case 'LotViewerSales':
        library.click(this.roleDropdownValueLotViewerSales);
        break;
      case 'CTSUser':
        library.click(this.roleDropdownValueCTSUser);
        break;
      default:
        library.logFailStep("Invalid Role Data Supplied");
    }
    await await library.waitForElements(2000);
    if (role == "LotViewerSales") {
      library.waitForElementToBeVisible(this.inputFieldTerritoryID);
      library.clickAction(this.inputFieldTerritoryID)
      await this.inputFieldTerritoryID.clear();
      await this.inputFieldTerritoryID.sendKeys(territoryID);
    }
  }

  async verifyUserNotAddedWhenExitWithoutSavingPopUp(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnClose), 10000);
    library.clickJS(this.btnClose);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnExitWithoutSaving), 10000);
    library.clickJS(this.btnExitWithoutSaving);
    dashBoard.goToBioRadUserManagementpage();
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.categoryDropdown), 10000);
    library.click(this.categoryDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.dropdownValueEmail), 10000);
    library.clickJS(this.dropdownValueEmail);
    this.searchInput.sendKeys(email);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.searchButton), 10000);
    library.clickJS(this.searchButton);
    element.all(this.searchList).then(function (searchItems) {
      console.log("Number of Elements - " + searchItems.length);
      if (searchItems.length != 0) {
        library.logFailStep("The user is added when clicking on EXIT WITHOUT SAVING in the Pop-Up Message");
        expect(true).toBe(false);
      }
    });
  }

  verifyUserAddedWhenSaveAndExitPopUp(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnClose), 10000);
    library.clickJS(this.btnClose);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.btnSaveAndExit), 10000);
    library.clickJS(this.btnSaveAndExit);
    library.waitTillLoading();
    dashBoard.goToBioRadUserManagementpage();
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.categoryDropdown), 10000);
    library.click(this.categoryDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.dropdownValueEmail), 10000);
    library.click(this.dropdownValueEmail);
    this.searchInput.sendKeys(email);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.searchButton), 10000);
    library.click(this.searchButton);
    element.all(this.searchList).then(function (searchItems) {
      console.log("Number of Elements - " + searchItems.length);
      if (searchItems.length == 0) {
        library.logFailStep("The user is not added when clicking on SAVE AND EXIT in the Pop-Up Message");
        expect(true).toBe(false);
      }
    });
  }

  verifyUserAdded(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.addButton), 10000);
    library.clickJS(this.addButton);
    library.waitTillLoading();
    browser.wait(browser.ExpectedConditions.invisibilityOf(this.loadingMessage), 10000);
    library.waitForElements(2000);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.categoryDropdown), 10000);
    library.click(this.categoryDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.dropdownValueEmail), 10000);
    library.clickJS(this.dropdownValueEmail);
    this.searchInput.sendKeys(email);
    library.click(this.searchButton);
    element.all(this.searchList).then(function (searchItems) {
      console.log("Number of Elements - " + searchItems.length);
      if (searchItems.length == 0) {
        library.logFailStep("The user is not added when the Bio-Rad Manager enters all the fields and clicks Add");
        expect(true).toBe(false);
      }
    });
  }

  verifyUserNotAdded(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.cancelButton), 10000);
    library.clickJS(this.cancelButton);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.categoryDropdown), 10000);
    library.click(this.categoryDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.dropdownValueEmail), 10000);
    library.clickJS(this.dropdownValueEmail);
    this.searchInput.sendKeys(email);
    library.click(this.searchButton);
    element.all(this.searchList).then(function (searchItems) {
      console.log("Number of Elements - " + searchItems.length);
      if (searchItems.length != 0) {
        library.logFailStep("The user is already exist or added when the Bio-Rad Manager enters all the fields and clicks Add");
        expect(true).toBe(false);
      }
    });
  }

  async verifyUserDetailsAreSame(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.addButton), 10000);
    library.clickJS(this.addButton);
    library.waitTillLoading();
    browser.wait(browser.ExpectedConditions.invisibilityOf(this.loadingMessage), 10000);
    await library.waitForElements(2000);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.categoryDropdown), 10000);
    library.click(this.categoryDropdown);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.dropdownValueEmail), 10000);
    library.clickJS(this.dropdownValueEmail);
    this.searchInput.sendKeys(email);
    library.click(this.searchButton);
    browser.wait(browser.ExpectedConditions.invisibilityOf(this.loadingMessage), 10000);
    this.searchResultRole.getText().then(function (roleValue) {
      console.log("Role - " + roleValue);
      if ((role == "BioRadManager" && roleValue != "Bio-Rad manager") ||
        (role == "CTSUser" && roleValue != "CTS user") ||
        (role == "LotViewerSales" && roleValue != "Lot Viewer sales")) {
        library.logFailStep("Role is not same as entered while adding user");
        expect(roleValue).toBe(role);
      }
    });
    await library.waitForElements(2000);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.searchResultName[0]), 10000);
    library.clickJS(this.searchResultName);
    await library.waitForElements(2000);
    this.inputFieldFirstname.getAttribute('value').then(function (fname) {
      console.log("First Name - " + fname);
      if (fname != firstName) {
        library.logFailStep("First Name is not same as entered while adding user");
        expect(true).toBe(false);
      }
    });
    this.inputFieldLastname.getAttribute('value').then(function (lName) {
      console.log("Last Name - " + lName);
      if (lName != lastName) {
        library.logFailStep("Last Name is not same as entered while adding user");
        expect(true).toBe(false);
      }
    });
    this.inputFieldEmail.getAttribute('value').then(function (eMail) {
      console.log("Email - " + eMail);
      if (eMail != email) {
        library.logFailStep("Email is not same as entered while adding user");
        expect(true).toBe(false);
      }
    });
    if (role == "LotViewerSales") {
      this.inputFieldTerritoryID.getAttribute('value').then(function (tid) {
        console.log("Territory ID - " + tid);
        if (tid != territoryID) {
          library.logFailStep("Territory ID is not same as entered while adding user");
          expect(true).toBe(false);
        }
      });
    }
  }

  verifyErrorMessageForExistingUser(firstName, lastName, email, role, territoryID) {
    this.enterAddUserDetails(firstName, lastName, email, role, territoryID);
    browser.wait(browser.ExpectedConditions.elementToBeClickable(this.addButton), 10000);
    library.clickJS(this.addButton);
    library.waitTillLoading();
    this.errorMessageForExistingUser.isDisplayed().then(function (flag) {
      console.log("Error Message Displayed - " + flag)
      if (!flag) {
        library.logFailStep("Error Message Is Not Displayed For Existing User");
        expect(true).toBe(false);
      }
    });
  }

  async searchEmail(email) {
    let flag = false;
    flag = await this.selectSearchCatagory("Email");
    flag = await this.enterTheValueInSearchBar(email);
    flag = await this.clickOnSearch();
    await browser.wait(browser.ExpectedConditions.invisibilityOf(this.loadingMessage), 10000);
    await library.waitForElements(2000);
    return flag;
  }

  async clickNameInListAt(pos) {
    let flag = false;
    await await library.waitForElements(2000);
    library.waitAndClickJS(this.searchResultName.get(pos));
    await this.searchResultName.get(pos).getText().then(function (text) {
      library.logStep("Clicked On " + text);
      flag = true;
    });
    return flag;
  }

  async getEmailInListAt(pos) {
    return await this.searchResultEmail.get(pos).getText();
  }

  async getRoleInListAt(pos) {
    return await this.searchResultRole.get(pos).getText();
  }

  async getTerritoryIDInListAt(pos) {
    return await this.searchResultTerritoryID.get(pos).getText();
  }

  async getNameInListAt(pos) {
    return await this.searchResultName.get(pos).getText();
  }

  async verifyInputDataForEditUser(name, email, role, territoryID) {
    await await library.waitForElements(2000);
    console.log("Received Name - " + name);
    let inputName = "";
    await this.inputFieldFirstname.getAttribute('value').then(function (text) {
      inputName = text;
      console.log("Input Data - " + text);
    });
    await this.inputFieldLastname.getAttribute('value').then(function (text) {
      inputName = inputName + " " + text;
      console.log("Input Data - " + text);
    });
    library.logStep("Check Name");
    expect(inputName).toEqual(name);

    await this.inputFieldEmail.getAttribute('value').then(function (text) {
      library.logStep("Check Email");
      expect(text).toEqual(email);
    });

    await this.inputFieldRoleDropdown.getText().then(function (text) {
      library.logStep("Check Role");
      if (role == "BioRadManager") {
        expect(text).toEqual("Bio-Rad Manager");
      }
      if (role == "CTSUser") {
        expect(text).toEqual("CTS User");
      }
      if (role == "LotViewerSales") {
        expect(text).toEqual("Lot Viewer sales");
      }
      if (text == "Lot Viewer Sales") {
        this.inputFieldTerritoryID.getAttribute('value').then(function (text) {
          library.logStep("Check Territory ID");
          expect(text).toEqual(territoryID);
        });
      }
    });
  }

  async isUpdateButtonDisplayed() {
    let flag = await this.updateButton.isDisplayed();
    if (flag) {
      library.logStep("Update Button Displayed");
    }
    else {
      library.logStep("Update Button Not Displayed");
    }
    return flag;
  }

  async isCancelButtonDisplayed() {
    let flag = await this.cancelButton.isDisplayed();
    if (flag) {
      library.logStep("Cancel Button Displayed");
    }
    else {
      library.logStep("Cancel Button Not Displayed");
    }
    return flag;
  }

  async isPopUpDisplayed() {
    library.waitForElementToBeVisible(this.popUpMessage);
    let flag = await this.popUpMessage.isDisplayed();
    if (flag) {
      library.logStep("Pop Up Displayed");
    }
    else {
      library.logStep("Pop Up Not Displayed");
    }
    return flag;
  }

  async clickClose() {
    library.click(this.btnClose);
  }

  async isUpdateButtonEnabled() {
    let flag = await this.updateButton.isEnabled();
    if (flag) {
      library.logStep("Update Button is Enabled");
    }
    else {
      library.logStep("Update Button is Not Enabled");
    }
    return flag;
  }

  async clickOn_Update_Button() {
    await library.waitAndClickJS(this.updateButton);
  }

  async verifyThatAllInputFieldsForEditUserIsDisplay() {
    console.log("Territory ID - " + this.inputFieldTerritoryID.isPresent());
    await this.inputFieldFirstname.isDisplayed().then(function (flag) {
      expect(flag).toBe(true);
      if (!flag) {
        library.logFailStep("First Name field is not displayed");
      }
      else {
        library.logStep("First Name field is not displayed");
      }
    });
    await this.inputFieldLastname.isPresent().then(function (flag) {
      expect(flag).toBe(true);
      if (!flag) {
        library.logFailStep("Last Name field is not displayed");
      }
      else {
        library.logStep("Last Name field is not displayed");
      }
    });
    await this.inputFieldEmail.isPresent().then(function (flag) {
      expect(flag).toBe(true);
      if (!flag) {
        library.logFailStep("Email field is not displayed");
      }
      else {
        library.logStep("Email field is not displayed");
      }
    });
    await this.inputFieldRoleDropdown.isPresent().then(function (flag) {
      expect(flag).toBe(true);
      if (!flag) {
        library.logFailStep("Role Dropdown field is not displayed");
      }
      else {
        library.logStep("Role Dropdown field is not displayed");
      }
    });
    await this.inputFieldTerritoryID.isPresent().then(function (flag) {
      expect(flag).toBe(true);
      if (!flag) {
        library.logFailStep("Territory ID field is not displayed");
      }
      else {
        library.logStep("Territory ID field is not displayed");
      }
    });
  }

  async verifyPreviousData(Email) {
    let name, email, role, territoryID;
    await this.searchEmail(Email);
    await this.getNameInListAt(0).then(function (result) { name = result; console.log("Details - " + result + " " + name); });
    await this.getEmailInListAt(0).then(function (result) { email = result; console.log("Details - " + result + " " + email); });
    await this.getRoleInListAt(0).then(function (result) { role = result; console.log("Details - " + result + " " + role); });
    await this.getTerritoryIDInListAt(0).then(function (result) { territoryID = result; console.log("Details - " + result + " " + territoryID); });

    await this.clickNameInListAt(0);
    await this.verifyInputDataForEditUser(name, email, role, territoryID);
  }

  async deSelectAllRolesInDropdown() {
    library.waitForElementToBeVisible(this.roleDropdownValueBioRadManager);
    if (await this.roleDropdownValueBioRadManager.getAttribute('aria-selected') == 'true') {
      await this.roleDropdownValueBioRadManager.click();
      library.logStep("Deselected Bio-Rad Manager Role");
    }
    if (await this.roleDropdownValueCTSUser.getAttribute('aria-selected') == 'true') {
      await this.roleDropdownValueCTSUser.click();
      library.logStep("Deselected CTS User Role");
    }
    if (await this.roleDropdownValueLotViewerSales.getAttribute('aria-selected') == 'true') {
      await this.roleDropdownValueLotViewerSales.click();
      library.logStep("Deselected Lot Viewer Sales Role");
    }
  }

  async isRoleErrorTextVisisble() {
    let flag = await this.roleDropDownError.isPresent();
    if (!flag) {
      library.logFailStep("Role Error Message Is Not Dispalyed");
    }
    return flag;
  }

}
