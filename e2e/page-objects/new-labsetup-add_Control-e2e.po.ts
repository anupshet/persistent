/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';

const library = new BrowserLibrary();
const addControlIcon = './/mat-icon[contains(@class, "products")]';
const subTitleMessage = './/h5[@class="mat-h5"]';
// const controlNameEle = '(.//div[@class = "mat-select-value"])[1]/span';
const controlNameEle = '(//mat-select//span[contains(text()," Control Name ")])[1]';
const addAnother = './/span[contains(text(), "Another control?")]';
const cancelButton = './/button/span[text()="Cancel"]';
const addControlButton = './/button[@type="submit"]';
const addControlLink = '//button/span[contains(text(),"Add a Control")]';
// const defaultControls = './/mat-select[@role="listbox"]';
// const controlList1 = '(.//mat-select[@role = "listbox"])[1]';
// const controlList3 = '(.//mat-select[@role = "listbox"])[3]';
const defaultControls = '//mat-select//span[contains(text()," Control Name ")]';
const controlList1 = '(//mat-select//span[contains(text()," Control Name ")])[1]';
const controlList3 = '(//mat-select//span[contains(text()," Control Name ")])[3]';
const multipleLotNumbers = './/br-select[@formcontrolname = "lotNumber"]//*[@id = "multipleData"]';
const singleLotNumber = './/br-select[@formcontrolname = "lotNumber"]';
const customName = './/input[contains(@formcontrolname, "customName")]';
const customNameField = './/input[contains(@class, "customNameDisplay")]/ancestor-or-self::mat-form-field';
const editControlLink = '//span[contains(text(),"Edit this Control")]';
const addAnalyteLink = '//unext-lab-setup//unext-control-entry//span[contains(text(),"Add an Analyte")]';
const thirdLotNumbers = '(//br-select[@formcontrolname = "lotNumber"]//*[@id = "multipleData"])[2]';
const lotSelect = '(//mat-select//span[contains(text(),"Lot")])[1]';

export class AddControl {
  verifyAddControlPage() {
    let result, icon, subTitle, contName, another, cancel, add = false;
    return new Promise((resolve) => {

      const controlIcon = findElement(locatorType.XPATH, addControlIcon);
      const subTitleMsg = findElement(locatorType.XPATH, subTitleMessage);
      const controlName = findElement(locatorType.XPATH, controlNameEle);
      const anotherControl = findElement(locatorType.XPATH, addAnother);
      const cancelBtn = findElement(locatorType.XPATH, cancelButton);
      const addControlbtn = findElement(locatorType.XPATH, addControlButton);
      controlIcon.isDisplayed().then(function () {
        icon = true;
        library.logStep('Control icon displayed');
        console.log('icon' + icon);
      });
      subTitleMsg.isDisplayed().then(function () {
        subTitleMsg.getText().then(function (subTitle_Msg) {
          if (subTitle_Msg.includes('Add a Bio-Rad control to the')) {
            subTitle = true;
            library.logStep('Add control message displayed');
            console.log('subTitle' + subTitle);
          }
        });
      });
      controlName.isDisplayed().then(function () {
        controlName.getText().then(function (placeholder) {
          if (placeholder.includes('Control Name')) {
            contName = true;
            library.logStep('Control Name Displayed');
            console.log('contName' + contName);
          }
        });
      });

      anotherControl.isDisplayed().then(function () {
        another = true;
        library.logStep('Another Control link Displayed');
        console.log('another' + another);
      });
      cancelBtn.isDisplayed().then(function () {
        cancel = true;
        library.logStep('Cancel Button displayed');
        console.log('cancel' + cancel);
      });
      addControlbtn.isDisplayed().then(function () {
        add = true;
        library.logStep('Add Control Button displayed');
        console.log('add' + add);
        console.log(icon + ' ' + subTitle + ' ' + contName + ' ' + another + ' ' + cancel + ' ' + add);
        if (icon === true && subTitle === true && contName === true && another === true && cancel === true && add === true) {
          result = true;
          resolve(result);
        } else {
          result = false;
          resolve(result);
        }
      });
    });
  }

  verifyDefaultControlsDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(6000);
      element.all(by.xpath(defaultControls)).count().then(function (control_NameEle) {
        console.log('count ' + controlNameEle);
        if (control_NameEle === 3) {
          library.logStep('Default controls Count is: ' + controlNameEle);
          console.log('Default controls Count is: ' + controlNameEle);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Default controls Count is: ' + controlNameEle);
          console.log('Default controls Count is: ' + controlNameEle);
          result = false;
          resolve(result);
        }
      });
    });
  }

  clickOnFirstControlList() {
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(10000)
      //  browser.wait(element(by.xpath(controlList1)).isPresent());
      const openListIcn = findElement(locatorType.XPATH, controlList1);
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        result = true;
        library.logStep('Control list clicked');
        resolve(result);
      });
    });
  }

  selectControl(controlName) {
    let selected = false;
    return new Promise((resolve) => {
      // browser.sleep(5000);
      const controlOpt = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + controlName + '")]');
      library.clickJS(controlOpt);
      selected = true;
      library.logStepWithScreenshot('Control Selected: ' + controlName, 'controlAdded');
      console.log('Control Selected: ' + controlName);
      resolve(selected);
    });
  }

  clickEditThisControlLink() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = findElement(locatorType.XPATH, editControlLink);
      addAnalytebtn.isEnabled().then(function () {
        library.clickJS(addAnalytebtn);
        library.logStep('Edit this Control link Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click Edit this Control link');
        result = true;
        resolve(result);
      });
    });
  }

  verifyCustomNameDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const customNameEle = findElement(locatorType.XPATH, customName);
      customNameEle.isDisplayed().then(function () {
        result = true;
        library.logStep('Custom name displayed');
        console.log('Custom name displayed');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Custom name not displayed');
        console.log('Custom name not displayed');
        resolve(result);
      });
    });
  }

  verifyLotnumberDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const multiLotNumberEle = findElement(locatorType.XPATH, multipleLotNumbers);
      const singleLotNumberEle = findElement(locatorType.XPATH, singleLotNumber);
      if (multiLotNumberEle.isDisplayed() || singleLotNumberEle.isDisplayed()) {
        result = true;
        library.logStep('Lot Number List Displayed');
        console.log('Lot Number List Displayed');
        resolve(result);
      } else {
        result = false;
        library.logStep('Lot Number List Not Displayed');
        console.log('Lot Number List Not Displayed');
        resolve(result);
      }
    });
  }

  clickOnFirstLotNumberList() {
    let result = false;
    return new Promise((resolve) => {
      const openListIcn = findElement(locatorType.XPATH, lotSelect);
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        result = true;
        library.logStepWithScreenshot('Lot Number clicked', 'LotSelected');
        console.log('Lot Number clicked');
        resolve(result);
      });
    });
  }

  clickOnThirdLotNumberList() {
    let result = false;
    return new Promise((resolve) => {
      const openListIcn = findElement(locatorType.XPATH, multipleLotNumbers);
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        result = true;
        library.logStep('Lot Number clicked');
        console.log('Lot Number clicked');
        resolve(result);
      });
    });
  }

  selectControlLotNumber(lotNumber) {
    return new Promise((resolve) => {
      let selected = false;
      browser.sleep(1000);
      const lotOpt = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + lotNumber + '")]');
      library.clickJS(lotOpt);
      selected = true;
      library.logStep('Lot Number Selected: ' + lotNumber);
      console.log('Lot Number Selected: ' + lotNumber);
      resolve(selected);
    });
  }

  verifyAddControlButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const addControlbtn = element(by.xpath(addControlButton));
      addControlbtn.isEnabled().then(function (status) {
        if (status) {
          result = true;
          library.logStep('Add Control button is Enabled');
          console.log('Add Control button is Enabled');
          resolve(result);
        }
      });
    });
  }

  verifyAddControlButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const addControlbtn = element(by.xpath(addControlButton));
      addControlbtn.isEnabled().then(function (status) {
        if (!status) {
          result = true;
          library.logStep('Add Control button is disabled');
          console.log('Add Control button is disabled');
          resolve(result);
        }
      });
    });
  }

  addAnotherControl() {
    let result = false;
    return new Promise((resolve) => {
      const addAnotherControlLink = findElement(locatorType.XPATH, addAnother);

      library.clickJS(addAnotherControlLink);
      result = true;
      resolve(result);
    });
  }

  verifyAnotherControlAdded() {
    let result = false;
    return new Promise((resolve) => {
      const control_NameEle = element.all(by.xpath(defaultControls));
      control_NameEle.count().then(function (controlCount) {
        console.log('controlCount: ' + controlCount);
        if (controlCount >= 4) {
          library.logStep('Control added');
          console.log('Control added');
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Unable to add Control');
          console.log('Unable to add Control');
          result = false;
          resolve(result);
        }
      });
    });
  }

  enterDataControlName(data) {
    let result = false;
    return new Promise((resolve) => {
      const customNameEle = element(by.xpath(customName));
      browser.executeScript('arguments[0].scrollIntoView(true);', customNameEle);
      customNameEle.isDisplayed().then(function () {
        customNameEle.sendKeys(data).then(function () {
          library.logStep('Custom name Control entered');
          console.log('Custom name Control entered');
          result = true;
          resolve(result);
        }).catch(function () {
          library.logFailStep('Unable to add Custom Control name');
          console.log('Unable to add Custom Control name');
          result = false;
          resolve(result);
        });
      });
    });
  }
  verifyCustomNameMaxLength() {
    let result = false;
    return new Promise((resolve) => {
      const customNameMax = element(by.xpath(customName));
      customNameMax.getAttribute('maxlength').then(function (max) {
        console.log('max' + max);
        if (max === '50') {
          library.logStepWithScreenshot('Custom Name field max lenght is 50', 'CustomNameMaxLength');
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Custom Name field max lenght is not 50');
          result = false;
          resolve(result);
        }
      });

    });

  }

  verifyCustomControlNameErrorField() {
    let result = false;
    return new Promise((resolve) => {
      const customNamefieldEle = element(by.xpath(customNameField));
      customNamefieldEle.getAttribute('class').then(function (className) {
        if (className.includes('mat-form-field-invalid')) {
          library.logStepWithScreenshot('Custom Name field is displying error', 'CustomError');
          console.log('Custom Name field is displying error');
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Custom Name field is not displying error');
          console.log('Custom Name field is not displying error');
          result = false;
          resolve(result);
        }
      });
    });
  }

  clickOnCancel() {
    let result = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancelButton));
      cancelBtn.isDisplayed().then(function () {
        library.clickJS(cancelBtn);
        library.logStep('Cancel Button Clicked');
        console.log('Cancel Button Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click cancel button');
        console.log('Unable to click cancel button');
        result = false;
        resolve(result);
      });
    });
  }
  clickAddControlLink() {
    let result = false;
    return new Promise((resolve) => {
      const addControlbtn = findElement(locatorType.XPATH, addControlLink);
      addControlbtn.isEnabled().then(function () {
        library.clickJS(addControlbtn);
        library.logStep('Add Control link Clicked');
        console.log('Add Control link Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Add Control link');
        console.log('Unable to click Add Control link');
        result = true;
        resolve(result);
      });
    });
  }
  clickAddControlButton() {
    let result = false;
    return new Promise((resolve) => {
      const addControlbtn = findElement(locatorType.XPATH, addControlButton);
      addControlbtn.isEnabled().then(function () {
        library.clickJS(addControlbtn);
        library.logStep('Add Control button Clicked');
        console.log('Add Control button Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Add Control button');
        console.log('Unable to click Add Control button');
        result = true;
        resolve(result);
      });
    });
  }

  clickOnThirdControlList() {
    let result = false;
    return new Promise((resolve) => {
      const openListIcn = findElement(locatorType.XPATH, controlList3);
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        browser.sleep(10000);
        result = true;
        library.logStep('Third control list clicked');
        console.log('Third control list clicked');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Unable to click Control list');
        console.log('Unable to click Control list');
        resolve(result);
      });
    });
  }
  clickAddAnAnalyteLink() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalyteLnk = findElement(locatorType.XPATH, addAnalyteLink);

      library.clickJS(addAnalyteLnk);
      library.logStep('Add an analyte link Clicked');
      result = true;
      resolve(result);
    }).catch(function () {
      library.logFailStep('Unable to click Add an analyte link');
      result = false;
    });
  }
}
