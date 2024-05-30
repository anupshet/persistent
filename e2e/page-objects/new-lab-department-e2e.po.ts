/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';

const library = new BrowserLibrary();
const departmentIcon = './/mat-icon[contains(@class, "departments")]';
const departmentSetupPageHeader = '//h5[@class="mat-h5"]';
// const dontAddDeptCheckbox = 'mat-checkbox-9-input'
const dontAddDeptCheckbox = 'spc_skipDepartment-input';
const dontAddDeptCheckboxLabel = './/mat-checkbox[@id="spc_skipDepartment"]//span[@class = "mat-checkbox-label"]';
const departmentTextboxes = '//unext-department-entry-component//mat-card-content//input[contains(@class,"spec_departmentName")]';
const departmentTextboxeFirst = '(//unext-department-entry-component//mat-card-content//input[@formcontrolname = "departmentName"])[1]';
const anotherDepartmentLink = './/span[contains(text(), "Another department")]';
// const cancelButtonDisabled = './/button[@class="mat-button mat-primary"][@disabled=""]';
const cancelButtonDisabled = '//span[contains(text(),"Cancel")]/parent::button[@disabled="true"]';
const addDepartmentsButtonDisabled = './/button[contains(@class, "mat-flat-button")][@disabled="true"]';
// const cancelButtonDisabled = './/button[@class='mat-button mat-primary']'
// const addDepartmentsButtonDisabled = './/button[contains(@class, 'mat-flat-button')]'
const skipDepartmentButton = './/button[contains(@class, "mat-flat-button")][2]';
const managerNameDropDown = '//mat-select[contains(@aria-label,"Manager name")]';
const addDepartmentsButtonEnabled = './/button[contains(@class, "mat-flat-button")][@type="submit"]';
const cancelButtonEnabled = '//button/span[contains(text(),"Cancel")]';
const firstManagerName = './/mat-option[1]';
const optionsInDropdown = './/mat-option';
const singleDataManagerUser = './/div[@id="singleData"]';
const thirdDeptTextBox = '(.//input[@formcontrolname = "departmentName"])[3]';
const departmentSetupCard = './/mat-card[contains(@class,"department-entry-component")]';
const addADepartmentButton = './/span[text()=" Add a Department "]/ancestor::button';

export class NewLabDepartment {
  verifyDepartmentSetupPage(labName) {
    let result, icon, header, deprtmentTextboxes, addAnotherDeptLink, cancel, addDeptsBtn = false;
    let dontAddDept, dontAddDeptLabel = false;
    return new Promise((resolve) => {
      //  browser.sleep(40000);
      // browser.wait(element(by.xpath(departmentIcon)).isPresent())
      // const deptIcon = element(by.xpath(departmentIcon));
      const deptIcon = findElement(locatorType.XPATH, departmentIcon);
      deptIcon.isDisplayed().then(function () {
        icon = true;
        library.logStep('Department icon displayed');
        console.log('icon' + icon);
      });
      // const deptPageHeader = element(by.xpath(departmentSetupPageHeader));
      const deptPageHeader = findElement(locatorType.XPATH, departmentSetupPageHeader);
      deptPageHeader.isDisplayed().then(function () {
        deptPageHeader.getText().then(function (deptPageHeaderText) {
          if (deptPageHeaderText.includes('What departments are in')) {
            header = true;
            library.logStep('Department page header is displayed');
            console.log('header' + header);
          }
        });
      });
      // const dontAddDeptChkbx = element(by.id(dontAddDeptCheckbox));
      const dontAddDeptChkbx = findElement(locatorType.ID, dontAddDeptCheckbox);
      dontAddDeptChkbx.isDisplayed().then(function () {
        dontAddDept = true;
        library.logStep('Dont Add Department checkbox is displayed');
        console.log('dontAddDept' + dontAddDept);
      });
      // const dontAddDeptChkbxlbl = element(by.xpath(dontAddDeptCheckboxLabel));
      const dontAddDeptChkbxlbl = findElement(locatorType.XPATH, dontAddDeptCheckboxLabel);
      dontAddDeptChkbxlbl.isDisplayed().then(function () {
        dontAddDeptChkbxlbl.getText().then(function (text) {
          if (text.includes('Dont add departments')) {
            dontAddDeptLabel = true;
            library.logStep('Dont Add Department checkbox label is displayed');
            console.log('dontAddDeptLabel' + dontAddDeptLabel);
          }
        });
      });
      element.all(by.xpath(departmentTextboxes)).count().then(function (count) {
        // As per acceptance critaria the count should be 4
        if (count === 3) {
          deprtmentTextboxes = true;
          library.logStep('Department textboxes are displayed');
          console.log('deprtmentTextboxes' + deprtmentTextboxes);
        }
      });
      // Manager name textbox is not displayed by default
      //  const anotherDeptLink = element(by.xpath(anotherDepartmentLink));
      const anotherDeptLink = findElement(locatorType.XPATH, anotherDepartmentLink);
      anotherDeptLink.isDisplayed().then(function () {
        anotherDeptLink.getText().then(function (linktext) {
          if (linktext.includes('Another Department?')) {
            addAnotherDeptLink = true;
            library.logStep('Add another Department link is displayed');
            console.log('addAnotherDeptLink' + addAnotherDeptLink);
          }
        });
      });
      // //  const cancelDisabled = element(by.xpath(cancelButtonDisabled));
      const cancelDisabled = findElement(locatorType.XPATH, cancelButtonDisabled);
      cancelDisabled.isDisplayed().then(function () {
        cancel = true;
        library.logStep('Cancel Button is displayed and its disabled');
        console.log('cancel' + cancel);
      });
      // const addDeptsDisabled = element(by.xpath(addDepartmentsButtonDisabled));
      const addDeptsDisabled = findElement(locatorType.XPATH, addDepartmentsButtonDisabled);
      addDeptsDisabled.isDisplayed().then(function () {
        addDeptsBtn = true;
        library.logStep('Add Departments Button is displayed and its disabled');
        console.log('addDeptsBtn' + addDeptsBtn);
      });
      if (icon === true && header === true && dontAddDept === true && dontAddDeptLabel === true
        && deprtmentTextboxes === true && addAnotherDeptLink === true && cancel === true && addDeptsBtn === true) {
        result = true;
        resolve(result);
      }
    });
  }

  verifyDeptPageHeader(labName) {
    let result = false;
    return new Promise((resolve) => {

      const deptPageHeader = findElement(locatorType.XPATH, departmentSetupPageHeader);
      deptPageHeader.isDisplayed().then(function () {
        deptPageHeader.getText().then(function (deptPageHeaderText) {
          if (deptPageHeaderText.includes('What departments are in ' + labName)) {
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  selectDontAddDepartmentCheckBox() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const dontAddDeptChkbx = element(by.id(dontAddDeptCheckbox));
      dontAddDeptChkbx.isDisplayed().then(function () {
        // dontAddDeptChkbx.click();
        library.clickJS(dontAddDeptChkbx);
        result = true;
        resolve(result);
      });
    });
  }

  verifySkipDepartmentButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      const skipDeptBtn = element(by.xpath(skipDepartmentButton));
      skipDeptBtn.isDisplayed().then(function () {
        skipDeptBtn.isEnabled().then(function () {
          result = true;
          resolve(result);
        });
      });
    });
  }

  verifyCountOfDepartmentFields() {
    let result = 0;
    return new Promise((resolve) => {
      //  browser.sleep(12000);
      const ele = findElement(locatorType.XPATH, departmentTextboxes);
      element.all(by.xpath(departmentTextboxes)).count().then(function (count) {
        // As per acceptance critaria the count should be 4
        result = count;
        library.logStep('Total count of department fields are ' + count);
        resolve(result);
      });
    });
  }

  clickAnotherDepartmentLink() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(1000);
      const anotherDeptLink = findElement(locatorType.XPATH, anotherDepartmentLink);
      //  const anotherDeptLink = element(by.xpath(anotherDepartmentLink));
      library.scrollToElement(anotherDeptLink);
      anotherDeptLink.isDisplayed().then(function () {

        library.clickJS(anotherDeptLink);
        library.logStep('Add another department link is clicked.');
        result = true;
        resolve(result);

      });
    });
  }

  verifyManagerNameDropdown() {
    let result = false;
    return new Promise((resolve) => {
      const managerNamedrpdwn = element.all(by.xpath(managerNameDropDown));
      managerNamedrpdwn.isDisplayed().then(function () {
        result = true;
        resolve(result);
      });
    });
  }

  clickCancelButton() {
    let result = false;
    return new Promise((resolve) => {
      // const cancelButton = element(by.xpath(cancelButtonEnabled));
      const cancelButton = findElement(locatorType.XPATH, cancelButtonEnabled);
      library.scrollToElement(cancelButton);
      cancelButton.isDisplayed().then(function () {
        library.clickJS(cancelButton);
        library.logStep('Cancel button clicked');
        result = true;
        resolve(result);
      });
    });
  }

  firstDeptNameFieldBlank() {
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(10000);
      const ele = findElement(locatorType.XPATH, departmentTextboxes);
      const firstDept = element.all(by.xpath(departmentTextboxes)).first();
      firstDept.isDisplayed().then(function () {
        firstDept.getAttribute('value').then(function (value) {
          if (value === null) {
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  addFirstDepartmentName(dname) {
    console.log('Inside addFirstDepartmentName : ');
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(40000);
      //  const firstDept = element(by.xpath(departmentTextboxeFirst));
      // library.scrollToElement(firstDept);
      browser.sleep(5000);
      const firstDept = findElement(locatorType.XPATH, departmentTextboxeFirst);
      firstDept.isDisplayed().then(function () {
        library.clickJS(firstDept);
        firstDept.sendKeys(dname).then(function () {
          library.logStep(dname + ' department name entered.');
          result = true;
          resolve(result);
        });
      });
    });
  }

  verifyAddDeptButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      //  const addDeptEnabled = element(by.xpath(addDepartmentsButtonEnabled));
      const addDeptEnabled = findElement(locatorType.XPATH, addDepartmentsButtonEnabled);
      library.scrollToElement(addDeptEnabled);
      addDeptEnabled.isDisplayed().then(function () {
        result = true;
        resolve(result);
      });
    });
  }

  clickAddDepartmentsButton() {
    let result = false;
    return new Promise((resolve) => {
      const addDepartmentsButton = findElement(locatorType.XPATH, addDepartmentsButtonEnabled);
      // const addDepartmentsButton = element(by.xpath(addDepartmentsButtonEnabled));
      addDepartmentsButton.isDisplayed().then(function () {
        library.clickJS(addDepartmentsButton);
        result = true;
        resolve(result);
      });
    });
  }

  verifyAddAnotherDeptLinkDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const anotherDeptLink = element(by.xpath(anotherDepartmentLink));
      anotherDeptLink.isDisplayed().then(function () {
        library.logStep('Another department link is displayed');
        result = false;
        resolve(result);
      }).catch(function () {
        library.logStep('Another department link is not displayed');
        result = true;
        resolve(status);
      });
    });
  }

  deptNameFieldValidation() {
    let result = false;
    return new Promise((resolve) => {
      //  browser.sleep(3000);
      // const firstDept = element(by.xpath(departmentTextboxes));
      const firstDept = findElement(locatorType.XPATH, departmentTextboxes);
      firstDept.getAttribute('value').then(function (chars) {
        if (chars.length === 50) {
          library.logStep('Department name field accepts 50 characters');
          result = true;
          resolve(result);
        }
      });
    });
  }

  selectManagerNameValue() {
    let result = false;
    return new Promise((resolve) => {
      const managerDropDown = findElement(locatorType.XPATH, managerNameDropDown);
      managerDropDown.isDisplayed().then(function () {
        library.clickJS(managerDropDown);
        const firstName = findElement(locatorType.XPATH, firstManagerName);
        firstName.isDisplayed().then(function () {
          firstName.click();
          result = true;
          resolve(result);
        });
      });
    });
  }

  verifySelectManagerUser() {
    let result = false;
    return new Promise((resolve) => {
      try {
        element(by.xpath(singleDataManagerUser)).isPresent().then(function () {
          library.logStep('Only 1 user is present, so dropdown is not displayed');
          result = true;
          resolve(result);
        });
      } catch (e) {
        library.logStep('Manager Drop down is displayed');
        const manager_DropDown = findElement(locatorType.XPATH, managerNameDropDown);
        manager_DropDown.isDisplayed().then(function () {
          // library.clickJS(element(by.xpath(singleDataManagerUser)));
          manager_DropDown.click();
          const firstName = findElement(locatorType.XPATH, firstManagerName);
          firstName.isDisplayed().then(function () {
            // library.clickJS(firstName);
            firstName.click();
            result = true;
            resolve(result);
          });
        });
      }
    });
  }
  addThirdDeptName(dname) {
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(30000);
      //  const firstDept = element(by.xpath(thirdDeptTextBox));
      const firstDept = findElement(locatorType.XPATH, thirdDeptTextBox);
      firstDept.isDisplayed().then(function () {
        firstDept.sendKeys(dname).then(function () {
          library.logStep(dname + ' department name is entered.');
          result = true;
          resolve(result);
        });
      });
    });
  }

  verifyDepartmentSetupCardDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const deptetup = element(by.xpath(departmentSetupCard));
      deptetup.isDisplayed().then(function () {
        library.logStep('Department Setup card is displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Department Setup card is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickAddADepartmentButton() {
    let result = false;
    return new Promise((resolve) => {
      const addDepartmentButton = findElement(locatorType.XPATH, addADepartmentButton);
      addDepartmentButton.isDisplayed().then(function () {
        library.click(addDepartmentButton);
        result = true;
        resolve(result);
      });
    });
  }

  selectManagerUser(num) {
    let result = false;
    return new Promise((resolve) => {
      library.logStep('Manager Drop down is displayed');
      const manager_DropDown = findElement(locatorType.XPATH, '(//mat-select[contains(@aria-label,"Manager name")])[' + num + ']');
      manager_DropDown.isDisplayed().then(function () {
        library.clickJS(manager_DropDown);
        // manager_DropDown.click();
        const firstName = findElement(locatorType.XPATH, firstManagerName);
        firstName.isDisplayed().then(function () {
          // library.clickJS(firstName);
          firstName.click();
          result = true;
          resolve(result);
        });
      });
    });
  }
}
