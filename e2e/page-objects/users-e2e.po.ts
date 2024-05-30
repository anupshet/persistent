/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { resolve } from 'dns';
import { browser, by, element, ElementFinder } from 'protractor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { assert } from 'console';



const library = new BrowserLibrary();
const dashboard = new Dashboard();
const loginEvent = new LoginEvent();
const dashBoard = new Dashboard();
const out = new LogOut();

const fname = './/input[@id="firstName"]';
const lname = './/input[@id="lastName"]';
const userEmail = './/input[@id="userEmail"]';
const userRole = './/div/mat-select[@id="userRole"]';
const userLocation = './/mat-select[@id="userLocation"]';
const cancelBtn = './/button/span[text()=" CANCEL "]';
const errorEmail = './/mat-error[contains(text(),"Email already exists.")]';

const gearIcon = '//unext-nav-bar-setting//mat-icon';
const userManagement = './/button/span[text()="User Management"]';
const addUserbtn = './/button/span/span[contains(text(),"Add a user")]';
const fname_err = './/mat-error[contains(text(),"Please enter a first name.")]';
const lname_err = './/mat-error[contains(text(),"Please enter a last name.")]';
const userEmail_err = './/mat-error[contains(text(),"Please enter an email address.")]';
const userRole_err = './/mat-error[contains(text(),"Please select a role.")]';
const addBtn = './/button/span[text()=" Add "]';
const updateBtn = './/button/span[text()=" Update "]';
const deleteBtn= './/button[contains(@class ,"spec-delete mat-icon-button")]';
const confirmBtn= './/button/span[text()="CONFIRM DELETE"]';
const defaultLoc = './/mat-option/span[@class="mat-option-text"]/descendant::button[1]';
const closeIcon = './/button[contains(@class ,"close mat-icon-button")]';
const exitPopupMessage = './/span[@class ="lose-changes-msg"]';
const Tech = element(by.xpath('.//div/mat-option/span[text()=" Technician "]/parent::mat-option'));
const LeadTech = element(by.xpath('.//div/mat-option/span[text()=" Lead Technician "]/parent::mat-option'));
const LabSuper = element(by.xpath('.//div/mat-option/span[text()=" Lab Supervisor "]/parent::mat-option'));
const userManagementScreen = "//unext-user-management";
const userListingLoadingMessage = "//div[contains(text(), 'Loading users..')]";
const categoryDropdown = "//mat-select";
const categoryOptionEmail = "//mat-option[contains(.,'Email')]";
const categoryOptionRole = "//mat-option[contains(.,'Role')]";
const categoryOptionName = "//mat-option[contains(.,'Name')]";
const categoryOptionLocation = "//mat-option[contains(., 'Location')]";
const headerColCells = "//mat-header-row/mat-header-cell";
const tableCellWithText = "//mat-row/mat-cell[contains(., 'keyword')]"; // <keyword> will be replaces with required keyword using replace function
const pointRadioBtn = '//span[text()="Point"]/../../../div/input';
const labSettings = '//div[@role="menu"]//div/button/span[contains(text(),"Lab Settings")]';

const searchKeywordInput = "//input[@name='searchInput']";
const searchButton = "//button[contains(., 'Search')]";
const userNameAtRow = "//mat-row[rowNum]/mat-cell/div";
const userEmailAtRow = "//mat-row[rowNum]/mat-cell[2]";
const userRolesAtRow = "//mat-row[rowNum]/mat-cell[3]/div/div";
const userLocationsAtRow = "//mat-row[rowNum]/mat-cell[4]/div/div";
const resetBtn = "//button[contains(@class, 'spec-reset-btn')]";
const toast = "//snack-bar-container";
const expandGrpsInLocationDropDown = "//mat-icon[contains(., 'chevron_right')]";
const locationsDropDownLabs = "//mat-checkbox[contains(., 'keyword')]";

export class AccountLabUser {
  async checkInputFieldsDisabled() {
    const fnameEle = await element(by.xpath(fname));
    const lnameEle = await element(by.xpath(lname));
    const userRoleEle = await element(by.xpath(userRole));
    const userEmailEle = await element(by.xpath(userEmail));
    const userLocationEle = await element(by.xpath(userLocation));
    let flag1 = await fnameEle.isEnabled();
    library.logStep("First Name Input Field Enable - " + flag1);
    let flag2 = await lnameEle.isEnabled();
    library.logStep("Last Name Input Field Enable - " + flag2);
    let flag3 = await userRoleEle.getAttribute("aria-disabled") != "true";
    library.logStep("User Role Drop Down Enable - " + flag3);
    let flag4 = await userEmailEle.isEnabled();
    library.logStep("Email Input Field Enable - " + flag4);
    let flag5 = await userLocationEle.getAttribute("aria-disabled") != "true";
    library.logStep("Location Drop Down Enable - " + flag5);
    if (flag1 || flag2 || flag3 || flag4 || flag5) {
      return false;
    }
    else {
      return true;
    }
  }

  async selectLocations(locations: string[]) {
    library.logStep("Select Locations " + locations);
    try {
      for (let x of locations) {
        let ele = await element(by.xpath(locationsDropDownLabs.replace("keyword", x)));
        await ele.isPresent().then((x) => {
          if (x) {
            library.scrollToElement(ele);
          }
        });
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 5000, x + " can't be clicked");
        await ele.click();
      }
      return true;
    } catch (error) {
      library.logFailStep("Select Locations Failed \n" + error);
      return false;
    }
  }

  async expandAllGroups() {
    let expandBtn = element.all(by.xpath(expandGrpsInLocationDropDown));
    let flag = true, error;
    for (let i = 0; i < (await expandBtn).length; i++) {
      let x = await expandBtn.get(i);
      try {
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(x), 5000);
        await x.click();
      } catch (err) {
        error = err;
        flag = false;
        break;
      }
    }
    library.logStep("Expand All Groups");
    if (!flag) {
      library.logFailStep("Expand All Groups" + error);
    }
    return flag;
  }

  async clickResetButton() {
    try {
      let btn = element(by.xpath(resetBtn));
      await browser.wait(browser.ExpectedConditions.elementToBeClickable(btn), 20000);
      // await btn.click();
      library.clickJS(btn);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 25000);
      library.logStep("Clicked on Reset Button");
      return true;
    } catch (error) {
      assert(false, "Click Reset Button Failed /n" + error);
      return false;
    }
  }

  async verifyFirstNameEquals(firstName: string) {
    let text: string;
    let fnameEle = element(by.xpath(fname));
    await fnameEle.isDisplayed().then((disp) => {
      if (disp) {
        fnameEle.getAttribute('value').then((x) => { text = x; });
      }
    });
    return firstName == text;
  }

  async getUserLocationsAtRow(rowNum) {
    let locationEle = element.all(by.xpath(userLocationsAtRow.replace("rowNum", rowNum)));
    let arr = [];
    await locationEle.then((items) => {
      items.forEach((x) => {
        x.getText().then((text) => { arr.push(text.trim()) });
      });
    });
    return arr;
  }

  async getUserRolesAtRow(rowNum) {
    let rolesEle = element.all(by.xpath(userRolesAtRow.replace("rowNum", rowNum)));
    let arr = [];
    await rolesEle.then((items) => {
      items.forEach((x) => {
        x.getText().then((text) => { arr.push(text.trim()) });
      });
    });
    return arr;
  }

  async getUserEmailAtRow(rowNum) {
    let emailEle = await element(by.xpath(userEmailAtRow.replace("rowNum", rowNum)));
    let email;
    await emailEle.getText().then(function (result) { email = result.trim(); });
    return email;
  }

  async getUserNameAtRow(rowNum) {
    let nameEle = element(by.xpath(userNameAtRow.replace("rowNum", rowNum)));
    let name;
    await nameEle.getText().then(function (result) { name = result.trim(); });
    return name;
  }

  isUserManagementOpen() {
    return new Promise((resolve) => {
      let flag = false;
      let um = element(by.xpath(userManagementScreen));
      browser.wait(browser.ExpectedConditions.visibilityOf(um), 8000);
      um.isDisplayed().then(function (result) {
        flag = result;
        console.log("User Management Displayed : " + flag);
        browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 20000);
        resolve(flag);
      });
    });
  }

  goToUserManagement() {
    return new Promise(async (resolve) => {
      library.logStep("Open User Management");
      const gearElement = await element(by.xpath(gearIcon));
      await browser.wait(browser.ExpectedConditions.visibilityOf(gearElement), 8000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const userManagementEle = await element(by.xpath(userManagement));
      await browser.wait(browser.ExpectedConditions.visibilityOf(userManagementEle), 20000);
      await userManagementEle.isPresent().then(async function (result) {
        console.log("User Management Present in Gear Icon Options : " + result);
        if (result) {
          library.clickJS(userManagementEle);
        }
        await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 20000);
        resolve(result);
      });
    });
  }
  ClickLabSettings() {
    return new Promise(async (resolve) => {
      library.logStep("Open Lab Setting");
      const gearElement = await element(by.xpath(gearIcon));
      await browser.wait(browser.ExpectedConditions.visibilityOf(gearElement), 8000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const labSettingsEle = await element(by.xpath(labSettings));
      await browser.wait(browser.ExpectedConditions.visibilityOf(labSettingsEle), 20000);
      await labSettingsEle.isPresent().then(async function (result) {
        console.log("Lab setting Present in Gear Icon Options : " + result);
        if (result) {
          library.clickJS(labSettingsEle);
        }
        //await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(pointRadioBtn))), 20000);
        resolve(result);
      });
    });

  }
  async clickAddUser() {
    // return new Promise((resolve) => {
    let flag = false;
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(element(by.xpath(addUserbtn))), 8000);
    const addUserbtnEle = await element(by.xpath(addUserbtn));
    await addUserbtnEle.click();
    library.logStep('addUserbtnEle Clicked.');
    flag = true;
    return flag;
    // resolve(true);
    // });
  }
  clickCloseButton() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(closeIcon))), 25000);
      const closeIconEle = element(by.xpath(closeIcon));
      closeIconEle.click();
      library.logStep('closeIconEle Clicked.');
      resolve(true);
    });
  }

  clickCancelButton() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(closeIcon))), 25000);
      const closeIconEle = element(by.xpath(closeIcon));
      closeIconEle.click();
      library.logStep('closeIconEle Clicked.');
      resolve(true);
    });
  }

  clickAddButton() {
    return new Promise(async (resolve) => {
      await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(addBtn))), 25000);
      const addBtnbtnEle = await element(by.xpath(addBtn));
      library.clickJS(addBtnbtnEle);
      library.logStep('addBtnbtnEle Clicked.');
      let loadingPopUp = element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'));
      await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUp), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);
      resolve(true);
    });
  }
  clickUpdateButton() {
    return new Promise(async (resolve) => {
      const fnameEle = await element(by.xpath(fname));
      //await fnameEle.click();
      await library.clickJS_async(fnameEle);
      //await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(updateBtn))), 25000);
      //await library.scrollToElement_async(updateBtn);
      const updateBtnEle = await element(by.xpath(updateBtn));
      await library.clickJS_async(updateBtnEle);
      library.logStep('updateBtnEle Clicked.');
      let loadingPopUp = element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'));
      await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUp), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);
      resolve(true);
    });
  }
  clickDeleteAndConfirmButton() {
    return new Promise(async (resolve) => {
      await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(deleteBtn))), 25000);
      const deleteBtnEle = await element(by.xpath(deleteBtn));
      library.clickJS_async(deleteBtnEle);
      library.logStep('deleteBtnEle Clicked.');
      let loadingPopUp = element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'));
      await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUp), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);

      await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(confirmBtn))), 25000);
      const confirmBtnEle = await element(by.xpath(confirmBtn));
      library.clickJS(confirmBtnEle);
      library.logStep('confirmBtnEle Clicked.');
      let loadingPopUp1 = element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'));
      await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUp1), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);
      resolve(true);
    });
  }
  verifyAddUserFields() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(fname))), 25000);
      const fnameEle = element(by.xpath(fname));
      const lnameEle = element(by.xpath(lname));
      const userRoleEle = element(by.xpath(userRole));
      const userEmailEle = element(by.xpath(userEmail));
      const userLocationEle = element(by.xpath(userLocation));
      const fname_errEle = element(by.xpath(fname_err));
      const lname_errEle = element(by.xpath(lname_err));
      const userRole_errEle = element(by.xpath(userRole_err));
      const userEmail_errEle = element(by.xpath(userEmail_err));

      fnameEle.isDisplayed().then(() => {
        library.clickJS(fnameEle);
      })

      userEmailEle.isDisplayed().then(() => {
        library.clickJS(userEmailEle);
        library.clickJS(userEmailEle);
      })
      lnameEle.isDisplayed().then(() => {
        lnameEle.click();
      })
      fnameEle.isDisplayed().then(() => {
        library.clickJS(fnameEle);
      })

      if (fname_errEle.isDisplayed() && lname_errEle.isDisplayed() && userEmail_errEle.isDisplayed()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  openRolesDropdown() {
    return new Promise(async (resolve) => {
      await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(userRole))), 5000);
      const userRoleEle = element(by.xpath(userRole));
      await userRoleEle.click();
      library.logStep('userRoleEle Clicked.');
      resolve(true);
    });
  }
  openLocationsDropdown() {
    return new Promise(async (resolve) => {
      try {
        await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(userLocation))), 5000);
        const userLocationEle = element(by.xpath(userLocation));
        await userLocationEle.click();
        library.logStep('userLocationEle Clicked.');
        resolve(true);
      } catch (error) {
        library.logFailStep("Location Drop Down Click Failed\n " + error);
        return (false);
      }
    });
  }
  selectUserFromUserList(UserName){
    return new Promise(async (resolve) => {
      library.logStep('//span[text()="Name"]/../../../../../mat-row[*]/mat-cell[1]/div[text()= " ' +UserName+ ' "]');
      const UserToSelect = await element(by.xpath('//span[text()="Name"]/../../../../../mat-row[*]/mat-cell[1]/div[text()= " '+UserName+' "]'));
      
      await library.scrollToElement_async(UserToSelect);
      await browser.wait(browser.ExpectedConditions.visibilityOf(UserToSelect), 20000);
      await UserToSelect.click();
      const fnameEle = await element(by.xpath(fname));
      
      await library.clickJS_async(fnameEle);
     
      resolve(true);
    });

  }
  selectUserRole(role) {
    return new Promise(async (resolve) => {
      let roles: String[];
      let rolesAll: String = role;
      if (role.includes("_")) {
        roles = rolesAll.split("_");
        for (let s of roles) {
          const roleEle = await element(by.xpath('.//div/mat-option/span[contains(text(), "' + s + '")]'));
          await browser.wait(browser.ExpectedConditions.visibilityOf(roleEle), 20000);
          await roleEle.click();
        }
        resolve(true);
      }
      else {
        const roleEle = await element(by.xpath('.//div/mat-option/span[contains(text(), "' + role + '")]'));
        await browser.wait(browser.ExpectedConditions.visibilityOf(roleEle), 20000);
        await roleEle.click();
        library.logStep('roleEle Clicked.');
        resolve(true);
      }
    });
  }
  verifyAddUserDisplayed() {
    return new Promise((resolve) => {
      const addUserbtnEle = element(by.xpath(addUserbtn));
      addUserbtnEle.isDisplayed().then(function () {
        resolve(true);
      }).catch(function () {
        resolve(false);
      });
    });
  }

  verifyexitPopupMsgDisplayed() {
    return new Promise((resolve) => {
      const exitPopupMessageEle = element(by.xpath(exitPopupMessage));
      exitPopupMessageEle.isDisplayed().then(function () {
        resolve(true);
      }).catch(function () {
        resolve(false);
      });
    });
  }

  enterAddUserDetails(firstName, lastName, email, role) {
    return new Promise(async (resolve) => {
      const fnameEle = await element(by.xpath(fname));
      const lnameEle = await element(by.xpath(lname));
      const userRoleEle = await element(by.xpath(userRole));
      const userEmailEle = await element(by.xpath(userEmail));

      await browser.wait(browser.ExpectedConditions.presenceOf(fnameEle), 5000);
      await browser.wait(browser.ExpectedConditions.presenceOf(lnameEle), 5000);
      await browser.wait(browser.ExpectedConditions.presenceOf(userRoleEle), 5000);
      await browser.wait(browser.ExpectedConditions.presenceOf(userEmailEle), 5000);

      await fnameEle.sendKeys(firstName);
      await lnameEle.sendKeys(lastName);
      await userEmailEle.sendKeys(email);

      await userRoleEle.click();

      await this.selectUserRole(role).then(function (status) {
        resolve(status);
      });

    });
  }
  isfieldClear() {
    return new Promise((resolve) => {
      const fnameEle = element(by.xpath(fname));
      const lnameEle = element(by.xpath(lname));
      const userRoleEle = element(by.xpath(userRole));
      const userEmailEle = element(by.xpath(userEmail));

      let flag1, flag2, flag3, flag4;
      fnameEle.getAttribute('text').then(function (value) {
        if (value == '') {
          flag1 = true;
        }
      });
      lnameEle.getAttribute('text').then(function (value) {
        if (value == '') {
          flag2 = true;
        }
      });
      userRoleEle.getAttribute('text').then(function (value) {
        if (value == '') {
          flag3 = true;
        }
      });
      userEmailEle.getAttribute('text').then(function (value) {
        if (value == '') {
          flag4 = true;
        }
      });

      if (flag1 && flag2 && flag3 && flag4)
        resolve(true);
      else
        resolve(false);

    });
  }

  verifyErrorMessageForExistingUser(firstName, lastName, email, role) {
    return new Promise((resolve) => {
      let flag = false;
      const addBtnEle = element(by.xpath(addBtn));
      const errorEmailEle = element(by.xpath(errorEmail));

      this.enterAddUserDetails(firstName, lastName, email, role).then(function (status) {
        expect(status).toBe(true);
      });

      library.click(addBtnEle);
      if (errorEmailEle.isDisplayed) {
        flag = true;
      }
      else {
        flag = false;
        library.logStepWithScreenshot("Error message does not appear for existing user", "ErrorMessageExistingUser");
      }
      resolve(flag);
    });
  }


  verifyRoleDropdownLabUser(loginrole) {
    return new Promise((resolve) => {
      let flag = false;
      const userRoleEle = element(by.xpath(userRole));
      userRoleEle.click();
      var labUserroles: String[]
      if (loginrole == "LabUser")
        labUserroles = [" Technician ", " Lead Technician ", " Lab Supervisor ", " Lab User Manager "];
      else
        labUserroles = [" Technician ", " Lead Technician ", " Lab Supervisor ", " Lab User Manager ", " Account User Manager "];

      for (let i = 0; i < labUserroles.length; i++) {
        if (element(by.xpath('.//div/mat-option/span[text()="' + labUserroles[i] + '"]')).isDisplayed) {
          flag = true;
        }
        else {
          flag = false;
          break;
        }
      }
      resolve(flag);
    });
  }


  verifyTechRoleField(roleSelected) {
    return new Promise((resolve) => {
      let techval, leadtechval, labsuperval;
      if (roleSelected.includes("Technician")) {
        LeadTech.getAttribute('aria-disabled').then(function (value) {
          leadtechval = value;
        });
        LabSuper.getAttribute('aria-disabled').then(function (value) {
          labsuperval = value;
        });
        if ((leadtechval.includes("true") && (labsuperval.includes("true"))))
          resolve(true);
        else
          resolve(false);
      }
      else if (roleSelected == " Lead Technician ") {
        Tech.getAttribute('aria-disabled').then(function (value) {
          techval = value;
        });
        LabSuper.getAttribute('aria-disabled').then(function (value) {
          labsuperval = value;
        });

        if ((techval.includes("true") && (labsuperval.includes("true"))))
          resolve(true);
        else
          resolve(false);
      }
      else {
        LeadTech.getAttribute('aria-disabled').then(function (value) {
          leadtechval = value;
        });
        Tech.getAttribute('aria-disabled').then(function (value) {
          techval = value;
        });
        if ((techval.includes("true") && (leadtechval.includes("true"))))
          resolve(true);
        else
          resolve(false);
      }
    });
  }
  verifyDefaultLocIsGrey() {
    return new Promise((resolve) => {
      let flag = false;
      const defaultLocEle = element(by.xpath(defaultLoc));
      const userLocationEle = element(by.xpath(userLocation));
      userLocationEle.isDisplayed().then(() => {
        library.clickJS(userLocationEle);
      })
      if (defaultLocEle.isEnabled()) {
        flag = false;
      }
      else {
        flag = true;
      }
      resolve(flag);
    });
  }
  expandGroupOrLocation(group1) {
    return new Promise((resolve) => {
      const grouptoexpand = element(by.xpath('.//div[text() = " ' + group1 + '"]/ancestor::mat-tree-node/div/button'));
      grouptoexpand.click();
      resolve(true);
    });
  }

  selectDeptOrLoc(Dept1) {
    return new Promise((resolve) => {
      const depttoselect = element(by.xpath('.//div[text() = "' + Dept1 + '"]'));
      depttoselect.click();
      resolve(true);
    });
  }


  isLocSelected(Loc1) {
    return new Promise((resolve) => {
      let flag = false;
      const locationverify = element(by.xpath('.//div[text() = "' + Loc1 + '"]/ancestor::mat-checkbox'));

      locationverify.getAttribute('class').then(function (value) {
        if (value.includes("mat-checkbox-checked")) {
          flag = true;
        }
      });
      resolve(flag);
    });
  }

  selectSearchCategory(category) {
    return new Promise(async (resolve) => {
      try {
        let categoryOption: ElementFinder;
        if (category == "Email") {
          categoryOption = element(by.xpath(categoryOptionEmail));
        }
        else if (category == "Name") {
          categoryOption = element(by.xpath(categoryOptionName));
        }
        else if (category == "Role") {
          categoryOption = element(by.xpath(categoryOptionRole));
        }
        else if (category == "Location") {
          categoryOption = element(by.xpath(categoryOptionLocation));
        }
        else {
          resolve(false);
        }
        let catDropDown = await element(by.xpath(categoryDropdown));
        await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 20000);
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(catDropDown), 8000);
        // browser.wait(browser.ExpectedConditions.elementToBeClickable(catDropDown), 20000).then(function () {
        // library.clickJS(catDropDown);
        catDropDown.click();
        // });
        await browser.wait(browser.ExpectedConditions.presenceOf(categoryOption), 20000);
        await categoryOption.isDisplayed().then(function (result) {
          if (result) { library.clickJS(categoryOption); } else { resolve(false); }
        });
        resolve(true);
      } catch (e) {
        library.logFailStep(e);
        console.log(e);
        resolve(false);
      }
    });
  }

  getHeaderColumnNumber(columnName) {
    let headerCells = element.all(headerColCells);
    let l;
    headerCells.count().then((result) => { l = result; });
    for (let i = 0; i < l; i++) {
      let txt: String;
      headerCells.get(i).getText().then((result) => { txt = result; });
      console.log(txt);
      if (txt.toLocaleLowerCase == columnName.toLocaleLowerCase)
        return i;
    }
  }

  search(category, keyword) {
    return new Promise(async (resolve) => {
      library.logStep("Search " + category + " " + keyword);
      await this.selectSearchCategory(category).then(function (result) {
        expect(result).toBe(true);
      });
      await element(by.xpath(searchKeywordInput)).clear();
      await element(by.xpath(searchKeywordInput)).sendKeys(keyword);
      await element(by.xpath(searchButton)).click();
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 20000);
      let tableCellWithTextXPath = tableCellWithText;
      tableCellWithTextXPath = tableCellWithTextXPath.replace("keyword", keyword);
      console.log("Cell Xpath " + tableCellWithTextXPath);
      let ele = element.all(by.xpath(tableCellWithTextXPath));
      ele.count().then(function (result) {
        console.log("Search Result Row Count " + result);
        if (result > 0)
          resolve(true);
        else
          resolve(false);
      });
    });
  }

}

