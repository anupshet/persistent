/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const manufacturerDdl = './/button[contains(@data-id, "manufacturerId")]';
const searchManufacturer = './/button[contains(@data-id , "manufacturerId")]/following-sibling::div//input';
const instrumentDdl = './/button[contains(@data-id, "instrumentId")]';
const searchInstrument = './/button[contains(@data-id , "instrumentId")]/following-sibling::div//input';
const productDdl = './/button[contains(@data-id, "productId")]';
const searchProd = './/button[contains(@data-id , "productId")]/following-sibling::div//input';
const methodDdl = './/button[contains(@data-id, "methodId")]';
const searchMethod = './/button[contains(@data-id , "methodId")]/following-sibling::div//input';
const includeRdb = './/input[contains(@id, "RadioChoiceInclude")]';
const excludeRdb = './/input[contains(@id, "RadioChoiceExclude")]';
const submitBtn = './/button[contains(text(), "SUBMIT")]';
const confirmDelete = './/input[contains(@id, "btnDeleteInclusion")]';
const deletedOk = './/button[contains(text(), "OK")]';

export class InstrumentTiering {
  clickOnGroupName(groupName) {
    let flag = false;
    return new Promise((resolve) => {
      const groupEle = element(by.xpath('.//tbody/tr/td[contains(text(),"' + groupName + '")]'));
      groupEle.isDisplayed().then(function () {
        groupEle.click();
        console.log('Group Name is clicked: ' + groupName);
        library.logStepWithScreenshot('Group Name is clicked: ' + groupName, 'Group Name is clicked: ' + groupName);
        flag = true;
        resolve(flag);
      });
    });
  }

  getIncludedCount(groupName) {
    return new Promise((resolve) => {
      const includeCount = element(by.xpath('.//tbody/tr/td[contains(text(),"' + groupName + '")]/following-sibling::td[1]'));
      includeCount.isDisplayed().then(function () {
        includeCount.getText().then(function (actTxt) {
          if (actTxt !== '') {
            console.log('Included Count is: ' + actTxt);
            library.logStepWithScreenshot('Included Count is: ' + actTxt, 'Included Count is: ' + actTxt);
            resolve(actTxt);
          }
        });
      }).catch(function () {
        console.log('Include Count is not displayed');
        library.logStepWithScreenshot('Include Count is not displayed', 'Include Count is not displayed');
        resolve('undefined');
      });
    });
  }

  getExcludeCount(groupName) {
    return new Promise((resolve) => {
      const excludeCount = element(by.xpath('.//tbody/tr/td[contains(text(),"' + groupName + '")]/following-sibling::td[2]'));
      excludeCount.isDisplayed().then(function () {
        excludeCount.getText().then(function (actTxt) {
          if (actTxt !== '') {
            console.log('Excluded Count is: ' + actTxt);
            library.logStepWithScreenshot('Excluded Count is: ' + actTxt, 'Excluded Count is: ' + actTxt);
            resolve(actTxt);
          }
        });
      }).catch(function () {
        console.log('Excluded Count is not displayed');
        library.logStepWithScreenshot('Excluded Count is not displayed', 'Excluded Count is not displayed');
        resolve('undefined');
      });
    });
  }

  selectManufacturer(manufacturer) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(manufacturerDdl));
      dashboard.waitForScroll();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Manufacturer Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', ddl);
        const options = element(by.xpath('.//span[contains(text(), "' + manufacturer + '")]'));
        const search = element(by.xpath(searchManufacturer));
        search.sendKeys(manufacturer);
        dashboard.waitForScroll();
        browser.executeScript('arguments[0].click();', options);
        console.log('Manufacturer selected: ' + manufacturer);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturer, 'Manufacturer selected: ' + manufacturer);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Manufacturer drop down not displayed');
        library.logStepWithScreenshot('Manufacturer drop down not displayed', 'Manufacturer drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectInstrument(instrument) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(instrumentDdl));
      dashboard.waitForScroll();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Instrument Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', ddl);
        const options = element(by.xpath('.//span[contains(text(), "' + instrument + '")]'));
        const search = element(by.xpath(searchInstrument));
        search.sendKeys(instrument);
        dashboard.waitForScroll();
        browser.executeScript('arguments[0].click();', options);
        console.log('Instrument selected: ' + instrument);
        library.logStepWithScreenshot('Instrument selected: ' + instrument, 'Instrument selected: ' + instrument);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Instrument drop down not displayed');
        library.logStepWithScreenshot('Instrument drop down not displayed', 'Instrument drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectProduct(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(productDdl));
      dashboard.waitForScroll();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Product Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', ddl);
        const options = element(by.xpath('.//span[contains(text(), "' + productName + '")]'));
        const search = element(by.xpath(searchProd));
        search.sendKeys(productName);
        dashboard.waitForScroll();
        browser.executeScript('arguments[0].click();', options);
        console.log('Product selected: ' + productName);
        library.logStepWithScreenshot('Product selected: ' + productName, 'Product selected: ' + productName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Product drop down not displayed');
        library.logStepWithScreenshot('Product drop down not displayed', 'Product drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectMethod(methodName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(methodDdl));
      dashboard.waitForScroll();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Method Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', ddl);
        const options = element(by.xpath('.//span[contains(text(), "' + methodName + '")]'));
        const search = element(by.xpath(searchMethod));
        search.sendKeys(methodName);
        dashboard.waitForScroll();
        browser.executeScript('arguments[0].click();', options);
        console.log('Method selected: ' + methodName);
        library.logStepWithScreenshot('Method selected: ' + methodName, 'Method selected: ' + methodName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Method drop down not displayed');
        library.logStepWithScreenshot('Method drop down not displayed', 'Method drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectAnalyte(analyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(methodDdl));
      dashboard.waitForScroll();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Analyte Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', ddl);
        const options = element(by.xpath('.//span[contains(text(), "' + analyteName + '")]'));
        const search = element(by.xpath(searchMethod));
        search.sendKeys(analyteName);
        dashboard.waitForScroll();
        browser.executeScript('arguments[0].click();', options);
        console.log('Analyte selected: ' + analyteName);
        library.logStepWithScreenshot('Analyte selected: ' + analyteName, 'Analyte selected: ' + analyteName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Analyte drop down not displayed');
        library.logStepWithScreenshot('Analyte drop down not displayed', 'Analyte drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectIncludeRdb() {
    let flag = false;
    return new Promise((resolve) => {
      const include = element(by.xpath(includeRdb));
      include.isDisplayed().then(function () {
        library.clickJS(include);
        console.log('Include Selected');
        library.logStepWithScreenshot('Include Selected', 'Include Selected');
        flag = true;
        resolve(flag);
      });
    });
  }

  selectExcludeRdb() {
    let flag = false;
    return new Promise((resolve) => {
      const exclude = element(by.xpath(excludeRdb));
      exclude.isDisplayed().then(function () {
        exclude.click();
        console.log('Exclude Selected');
        library.logStepWithScreenshot('Exclude Selected', 'Exclude Selected');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickSubmitBtn() {
    let flag = false;
    return new Promise((resolve) => {
      const submit = element(by.xpath(submitBtn));
      submit.isDisplayed().then(function () {
        library.clickJS(submit);
        dashboard.waitForElement();
        console.log('Submit Clicked');
        library.logStepWithScreenshot('Submit Clicked', 'Submit Clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyInclusionAdded(instrumentName, productName, MethodName, AnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const inst = './/table[contains(@id, "inclusion")]/tbody/tr/td[2][contains(text(), "' + instrumentName + '")]';
      const prod = '/following-sibling::td[1][contains(text(), "' + productName + '")]';
      const meth = '/following-sibling::td[1][contains(text(), "' + MethodName + '")]';
      const analyte = '/following-sibling::td[1][contains(text(), "' + AnalyteName + '")]';
      const includeEle = element(by.xpath(inst + prod + meth + analyte));
      dashboard.waitForElement();
      includeEle.isDisplayed().then(function () {
        console.log('Inclusion added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStep('Inclusion added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStepWithScreenshot('verifyInclusionAdded', 'verifyInclusionAdded');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Inclusion not added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStep('Inclusion not added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStepWithScreenshot('InclusionNotAdded', 'InclusionNotAdded');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyExclusionAdded(instrumentName, productName, MethodName, AnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const inst = './/table[contains(@id, "exclusion")]/tbody/tr/td[2][contains(text(), "' + instrumentName + '")]';
      const prod = '/following-sibling::td[1][contains(text(), "' + productName + '")]';
      const meth = '/following-sibling::td[1][contains(text(), "' + MethodName + '")]';
      const analyte = '/following-sibling::td[1][contains(text(), "' + AnalyteName + '")]';
      const exclusionEle = element(by.xpath(inst + prod + meth + analyte));
      dashboard.waitForElement();
      exclusionEle.isDisplayed().then(function () {
        console.log('Exclusion added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStep('Exclusion added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStepWithScreenshot('verifyExclusionAdded', 'verifyExclusionAdded');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Exclusion not added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStep('Exclusion not added for ' + instrumentName + ' ' + productName + ' ' + MethodName + ' ' + AnalyteName);
        library.logStepWithScreenshot('ExclusionNotAdded', 'ExclusionNotAdded');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyIncludeInstrumentIsUnique(groupName, expInclude) {
    let flag = false;
    return new Promise((resolve) => {
      const includeCount = element(by.xpath('.//tbody/tr/td[contains(text(),"' + groupName + '")]/following-sibling::td[1]'));
      browser.wait(browser.ExpectedConditions.visibilityOf(includeCount), 20000, 'Include Count is not displayed');
      includeCount.isDisplayed().then(function () {
        includeCount.getText().then(function (actTxt) {
          console.log('ActCount: ' + actTxt);
          console.log('ExpCount: ' + expInclude);
          if (actTxt.includes(expInclude)) {
            console.log(groupName + ' group include count is unique: ' + actTxt);
            library.logStep(groupName + ' group include count is unique: ' + actTxt);
            library.logStepWithScreenshot('verifyIncludeInstrumentIsUnique', 'verifyIncludeInstrumentIsUnique');
            flag = true;
            resolve(flag);
          } else {
            console.log(groupName + ' group include count is not unique : ' + actTxt);
            library.logStep(groupName + ' group include count is not unique : ' + actTxt);
            library.logStepWithScreenshot('IncludeInstrumentIsNotUnique', 'IncludeInstrumentIsNotUnique');
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        console.log('Include Count is not displayed');
        library.logStep('Include Count is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyExcludeInstrumentIsUnique(groupName, expExclude) {
    let flag = false;
    return new Promise((resolve) => {
      const excludeCount = element(by.xpath('.//tbody/tr/td[contains(text(),"' + groupName + '")]/following-sibling::td[2]'));
      excludeCount.isDisplayed().then(function () {
        excludeCount.getText().then(function (actTxt) {
          if (actTxt.includes(expExclude)) {
            console.log(groupName + ' group exclude count is unique: ' + actTxt);
            library.logStep(groupName + ' group exclude count is unique: ' + actTxt);
            library.logStepWithScreenshot('verifyExcludeInstrumentIsUnique', 'verifyExcludeInstrumentIsUnique');
            flag = true;
            resolve(flag);
          } else {
            console.log(groupName + ' group exclude count is not unique : ' + actTxt);
            library.logStep(groupName + ' group exclude count is not unique : ' + actTxt);
            library.logStepWithScreenshot('ExcludeInstrumentNotUnique', 'ExcludeInstrumentNotUnique');
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        console.log('Exclude Count is not displayed');
        library.logStep('Exclude Count is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickDeleteInclusion(instrumentName, productName, MethodName, AnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const inst = './/table[contains(@id, "inclusion")]/tbody/tr/td[2][contains(text(), "' + instrumentName + '")]';
      const prod = '/following-sibling::td[1][contains(text(), "' + productName + '")]';
      const meth = '/following-sibling::td[1][contains(text(), "' + MethodName + '")]';
      const analyte = '/following-sibling::td[1][contains(text(), "' + AnalyteName + '")]';
      const delBtn = element(by.xpath(inst + prod + meth + analyte + '/following-sibling::td'));
      browser.wait(browser.ExpectedConditions.visibilityOf(delBtn), 20000, 'Delete Button not displayed');
      delBtn.isDisplayed().then(function () {
        browser.executeScript('arguments[0].click();', delBtn);
        console.log('Include Delete clicked against' + instrumentName);
        library.logStep('Include Delete clicked against' + instrumentName);
        library.logStepWithScreenshot('clickDeleteInclusion', 'clickDeleteInclusion');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Include Delete not displayed for ' + instrumentName);
        library.logStepWithScreenshot
          ('Include Delete not displayed for ' + instrumentName, 'Include Delete not displayed for ' + instrumentName);
        flag = false;
        resolve(flag);
      });
    });
  }

  clickDeleteExclusion(instrumentName, productName, MethodName, AnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const inst = './/table[contains(@id, "exclusion")]/tbody/tr/td[2][contains(text(), "' + instrumentName + '")]';
      const prod = '/following-sibling::td[1][contains(text(), "' + productName + '")]';
      const meth = '/following-sibling::td[1][contains(text(), "' + MethodName + '")]';
      const analyte = '/following-sibling::td[1][contains(text(), "' + AnalyteName + '")]';
      const delBtn = element(by.xpath(inst + prod + meth + analyte + '/following-sibling::td'));
      browser.wait(browser.ExpectedConditions.visibilityOf(delBtn), 20000, 'Delete Button not displayed');
      delBtn.isDisplayed().then(function () {
        library.clickJS(delBtn);
        console.log('Exclude Delete clicked against ' + instrumentName);
        library.logStep('Exclude Delete clicked against ' + instrumentName);
        library.logStepWithScreenshot('clickDeleteExclusion', 'clickDeleteExclusion');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Exclude Delete not displayed for ' + instrumentName);
        library.logStepWithScreenshot
          ('Exclude Delete not displayed for ' + instrumentName, 'Exclude Delete not displayed for ' + instrumentName);
        flag = false;
        resolve(flag);
      });
    });
  }

  clickConfirmDelete() {
    let flag = false;
    return new Promise((resolve) => {
      const confirm = element(by.xpath(confirmDelete));
      confirm.isDisplayed().then(function () {
        library.clickJS(confirm);
        console.log('Confirmed Clicked');
        library.logStepWithScreenshot('Confirmed Clicked', 'Confirmed Clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOkOnDeletedMessage() {
    let flag = false;
    return new Promise((resolve) => {
      const okBtn = element(by.xpath(deletedOk));
      browser.wait(browser.ExpectedConditions.visibilityOf(okBtn), 20000, 'Ok Button not displayed');
      okBtn.isDisplayed().then(function () {
        library.clickJS(okBtn);
        console.log('Ok Clicked');
        library.logStepWithScreenshot('Ok Clicked', 'Ok Clicked');
        flag = true;
        resolve(flag);
      });
    });
  }
}
