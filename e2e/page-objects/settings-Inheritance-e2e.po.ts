/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Settings.json', (err, data1) => {
  if (err) { throw err; }
  const settings = JSON.parse(data1);
  jsonData = settings;
});

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addAnalyte = './/button/span[contains(text(), "Add an Analyte")]';
const controlNameDropDown = '//mat-select[contains(@aria-label,"Control Name")]';
const cancelBtnControl = '//button/span[contains(text(),"Cancel")]';
const updateBtnControl = '//button/span[contains(text(),"Update")]';
const pointToogle = '(//input[@type="radio"])[2]/../../..';
const decimalDropDown = './/br-select[@formcontrolname = "decimalPlaces"]';
const selectedDecimal = './/br-select[@formcontrolname = "decimalPlaces"]//mat-select//span/span';
const levelsInUse = './/div[contains(@class, "mat-checkbox-group")]';
const spcToggle = '(//mat-slide-toggle//div/input[@aria-checked="false"])[1]';
const cancelBtn = '//button/span[contains(text(),"Cancel")]';
const updateBtn = '//button/span[contains(text(),"Update")]';
const rulePopupClose = '//unext-spc-rules-dialog//button';
const popupGraph = '//unext-spc-rules-dialog//p/following-sibling::img';
const spcRulesComponent = './/div[contains(@class, "spc-rules-component")]';
const summaryDataEntryToggleInput = '(//input[@type="radio"])[1]/../../..';
const levelsChecked = './/mat-checkbox/label/span/ancestor::label//input[@aria-checked = "true"]';
const controlWarning = './/unext-update-settings-dialog/mat-dialog-content';
const warningOkBtn = './/button/span[contains(text(), "Ok")]';

export class InheritedSettings {

  verifyEditControlPage(control) {
    let addlink, controlnm, togg, decimalPlace, level, update, cancel, result = false;
    return new Promise((resolve) => {
      const addAnalyteLink = element((by.xpath(addAnalyte)));
      const controlName = element((by.xpath(controlNameDropDown)));
      const cancelBtnEle = element((by.xpath(cancelBtnControl)));
      const updateBtnEle = element((by.xpath(updateBtnControl)));
      const pointTogg = element((by.xpath(pointToogle)));
      const decimal = element((by.xpath(decimalDropDown)));
      const levels = element((by.xpath(levelsInUse)));

      addAnalyteLink.isDisplayed().then(function () {
        console.log('Add Analyte link displayed');
        library.logStep('Add Analyte link displayed');
        addlink = true;
      }).then(function () {
        controlName.isDisplayed().then(function () {
          controlName.getText().then(function (txt) {
            if (txt.includes(control)) {
              console.log('Control name drop down displayed');
              library.logStep('Control name drop down displayed');
              controlnm = true;
            }
          });
        });
      }).then(function () {
        pointTogg.isDisplayed().then(function () {
          console.log('Point toggle displayed');
          library.logStep('Point toggle displayed');
          togg = true;
        });
      }).then(function () {
        levels.isDisplayed().then(function () {
          console.log('Levels displayed');
          library.logStep('Levels displayed');
          level = true;
        });
      }).then(function () {
        decimal.isDisplayed().then(function () {
          console.log('Decimal Place displayed');
          library.logStep('Decimal Place displayed');
          decimalPlace = true;
        });
      }).then(function () {
        cancelBtnEle.isDisplayed().then(function () {
          console.log('Cancel button displayed');
          library.logStep('Cancel button displayed');
          cancel = true;
        });
      }).then(function () {
        updateBtnEle.isDisplayed().then(function () {
          console.log('Update button displayed');
          library.logStep('Update button displayed');
          update = true;
        });
      }).then(function () {
        if (addlink && controlnm && togg && decimalPlace && level && update && cancel === true) {
          result = true;
          console.log('Edit control page is displayed');
          library.logStep('Edit control page is displayed');
          resolve(result);
        }
      });
    });
  }

  verifySummaryToggleEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const pointTogg = element((by.xpath(pointToogle)));
      pointTogg.isDisplayed().then(function () {
        pointTogg.getAttribute('class').then(function (name) {
          if (name.includes('mat-radio-checked')) {
            result = true;
            console.log('Summary enabled');
            library.logStep('Summary enabled');
            resolve(result);
          }
        });
      }).catch(function () {
        result = false;
        console.log('Toggle not displayed');
        library.logStep('Toggle not displayed');
        resolve(result);
      });
    });
  }

  verifyDecimalPlaceSelected(selectedVal) {
    let result = false;
    return new Promise((resolve) => {
      const decimal = findElement(locatorType.XPATH, selectedDecimal);
      library.scrollToElement(decimal);
      decimal.isDisplayed().then(function () {
        decimal.getText().then(function (txt) {
          console.log('Text: ' + txt);
          const value = +txt;
          console.log('Value: ' + value);
          console.log('selectedVal: ' + selectedVal);
          if (value === selectedVal) {
            result = true;
            console.log('Decimal value selected is ' + value);
            library.logStep('Decimal value selected is ' + value);
            resolve(result);
          }
        });
      }).catch(function () {
        result = false;
        console.log('Decimal value not displayed');
        library.logStep('Decimal value not displayed');
        resolve(result);
      });
    });
  }

  isSPCRulesDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const dataEntryToggle = element(by.xpath(spcRulesComponent));
      dataEntryToggle.isDisplayed().then(function () {
        library.logStepWithScreenshot('SPC rules are displayed', 'spcDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStepWithScreenshot('SPC rules are not displayed', 'spcNotDisplayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickEnableSummaryToggleButton() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(summaryDataEntryToggleInput));
      library.click(clickBtn);
      console.log('Summary toggle already  enabled');
      library.logStep('Summary toggle already  enabled');
      library.logStepWithScreenshot('clickEnableSummaryToggleButton', 'clickEnableSummaryToggleButton');
      flag = true;
      resolve(flag);
    });
  }

  clickDisableSummaryToggleButton() {
    let flag = false;
    return new Promise((resolve) => {
      const dataEntryToggle = element((by.xpath(summaryDataEntryToggleInput)));
      dataEntryToggle.getAttribute('aria-checked').then(function (value) {
        console.log(value);
        if (value === 'false') {
          library.logStepWithScreenshot('Summary toggle already disabled', 'summarToggleDisabled');
          flag = true;
          resolve(flag);
        } else {
          library.clickJS(dataEntryToggle);
          library.logStepWithScreenshot('Summary toggle disabled', 'summarToggleDisabled');
          flag = true;
          resolve(flag);
        }
      });
    });
  }
  verifySPCUI() {
    let flag = false;
    return new Promise((resolve) => {
      const editElement = new Map<String, String>();
      const spcToggleEle = findElement(locatorType.XPATH, spcToggle);
      const cancelBtnEle = findElement(locatorType.XPATH, cancelBtn);
      const updateBtnEle = findElement(locatorType.XPATH, updateBtn);
      // Need to add rules in map
      editElement.set('2 of 2s', '2 of 2 s Rule');
      editElement.forEach(function (key, value) {
        const ruleText = findElement(locatorType.XPATH, '//span[contains(text(),"' + value + '")]');
        const rejectRadio = findElement(locatorType.XPATH, '//span[contains(text(),"' + value + '")]/ancestor::td[1]'
          + '/following-sibling::td//input[@value="R"]');
        const warningRadio = findElement(locatorType.XPATH, '//span[contains(text(),"' + value + '")]/ancestor::td[1]'
          + '/following-sibling::td//input[@value="W"]');
        const selectedDisableRadio = findElement(locatorType.XPATH, '//span[contains(text(),"' + value + '")]/ancestor::td[1]'
          + '/following-sibling::td//mat-radio-button[contains(@class,"checked")]//input[@value="D"]');
        if (ruleText.isDisplayed() && rejectRadio.isDisplayed() && warningRadio.isDisplayed() && selectedDisableRadio.isDisplayed()
          && spcToggleEle.isDisplayed() && cancelBtnEle.isDisplayed() && updateBtnEle.isDisplayed()) {
          flag = true;
          library.logStepWithScreenshot('All radio button and text displayed for ' + key, 'SPCUI');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('All radio button and text displayed for ' + key);
          resolve(flag);
        }

      });
    });
  }

  verifySPCInfoIcon() {
    let flag = false;
    let popup;
    return new Promise((resolve) => {
      const editElement = new Map<String, String>();
      // Need to add rules in map
      editElement.set('1-2s', '1-2s Rule');
      editElement.set('1-3s', '1-3s Rule');
      editElement.set('2 of 2s', '2 of 2 s Rule');
      // editElement.set('2 of 3/2s', '2 of 3/2 s Rule');
      editElement.set('10', '10x Rule');
      editElement.set('7-T', '7-T Rule');
      editElement.set('R-4s', 'R-4s Rule');
      editElement.set('3-1', '3-1 s Rule');

      editElement.forEach(function (key, value) {
        console.log('Rule: ' + value);
        if (value.includes('1-2s')) {
          popup = findElement(locatorType.XPATH, '(.//span[contains(text(),"1-")]/parent::span/following-sibling::span)[1]');
        } else if (value.includes('1-3s')) {
          popup = findElement(locatorType.XPATH, '(.//span[contains(text(),"1-")]/parent::span/following-sibling::span)[2]');
        } else if (value.includes('10')) {
          popup = findElement(locatorType.XPATH, '//span[contains(text(),"x")]/parent::span/following-sibling::span');
        } else if (value.includes('3-1')) {
          popup = findElement(locatorType.XPATH, '//span[contains(text(), "3-1")]/ancestor::mat-form-field/parent::span/parent::span/following-sibling::span');
        } else {
          popup = findElement(locatorType.XPATH, '//span[contains(text(),"' + value + '")]/following-sibling::span');
        }
        popup.isPresent().then(function () {
          console.log('Element Present: ' + value);
          // library.scrollToElement(popup);
          browser.executeScript('arguments[0].scrollIntoView();', popup);
          library.clickJS(popup);
          library.logStep('Info icon clicked for ' + key);
          console.log('Info icon clicked for ' + key);
          const close = findElement(locatorType.XPATH, rulePopupClose);
          const graph = findElement(locatorType.XPATH, popupGraph);
          // if (graph.isDisplayed()) {
          graph.isDisplayed().then(function () {
            console.log('Graph Displayed');
            library.logStepWithScreenshot('Popup graph displayed on clicking Info icon for ' + key, 'popup');
            library.clickJS(close);
            // close.click();
            library.logStep('Close button clicked');
            flag = true;
            resolve(flag);
          }).catch(function () {
            library.logFailStep('Popup graph not displayed on clicking Info icon for ' + key);
            flag = false;
            resolve(flag);
          });
        });
      });
    });
  }
  verifyRadioBtnSelected() {
    let flag1, flag2, flag3, flag = false;
    return new Promise((resolve) => {
      const rejectRadio = findElement(locatorType.XPATH, '//unext-spc-rules-component//span[contains(text(),"2 of 2s")]/ancestor::td[1]/following-sibling::td//input[@value="R"]//ancestor::mat-radio-button');
      const warningRadio = findElement(locatorType.XPATH, '//unext-spc-rules-component//span[contains(text(),"2 of 2s")]/ancestor::td[1]/following-sibling::td//input[@value="W"]//ancestor::mat-radio-button');
      const disableRadio = findElement(locatorType.XPATH, '//unext-spc-rules-component//span[contains(text(),"2 of 2s")]/ancestor::td[1]/following-sibling::td//input[@value="D"]//ancestor::mat-radio-button');
      rejectRadio.isDisplayed().then(function () {
        library.clickAction(rejectRadio);
        library.clickJS(rejectRadio);
        dashboard.waitForScroll();
        rejectRadio.getAttribute('class').then(function (text) {
          console.log(text);
          if (text.includes('checked')) {
            console.log('Reject selected');
            library.logStep('Reject selected');
            library.logStepWithScreenshot('Reject selected', 'reject');
            flag1 = true;
          } else {
            console.log('Reject not selected');
            library.logStep('Reject not selected');
            flag1 = true;
          }
        });
      }).then(function () {
        library.clickJS(warningRadio);
        library.clickAction(warningRadio);
        warningRadio.getAttribute('class').then(function (text) {
          console.log(text);
          if (text.includes('checked')) {
            console.log('warning selected');
            library.logStep('warning selected');
            library.logStepWithScreenshot('warning selected', 'warning');
            flag2 = true;
          } else {
            console.log('warning not selected');
            library.logFailStep('warning not selected');
            flag2 = false;
          }
        });
      }).then(function () {
        library.clickJS(disableRadio);
        library.clickAction(disableRadio);
        disableRadio.getAttribute('class').then(function (text) {
          if (text.includes('checked')) {
            console.log('disable selected');
            library.logStep('disable selected');
            library.logStepWithScreenshot('disable selected', 'disable');
            flag3 = true;
          } else {
            console.log('disable not selected');
            library.logFailStep('Reject not selected');
            flag3 = false;
          }
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 === true) {
          flag = true;
          resolve(flag);
        } else {
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickCancelButton() {
    let flag = false;
    return new Promise((resolve) => {
      const cancel = findElement(locatorType.XPATH, cancelBtn);
      library.clickJS(cancel);
      library.logStepWithScreenshot('Cancel button clicked. ', 'cancelClicked');
      flag = true;
      resolve(flag);
    });
  }
  isDisabledDisplayed(rule) {
    let flag = false;
    return new Promise((resolve) => {
      const selectedDisableRadio = findElement(locatorType.XPATH, '//span[contains(text(),"' + rule + '")]/ancestor::td[1]'
        + '/following-sibling::td//mat-radio-button[contains(@class,"checked")]//input[@value="D"]//ancestor::mat-radio-button');
      if (selectedDisableRadio.isDisplayed()) {
        flag = true;
        library.logStepWithScreenshot('Default selected radio button displayed.', 'disabledRadio');
        resolve(flag);
      } else {
        flag = false;
        library.logStepWithScreenshot('Default selected radio button not displayed.', 'disabledRadio');
        resolve(flag);
      }

    });
  }

  verifyNumberOfLevelDisplayed(expectedLevels) {
    let status = false;
    return new Promise((resolve) => {
      const levels = element(by.xpath(levelsInUse));
      levels.isDisplayed().then(function () {
        element.all(by.xpath(levelsChecked)).count().then(function (temp) {
          temp = temp - 1;
          console.log(temp);
          if (temp === expectedLevels) {
            console.log(temp + 'within expected ' + expectedLevels);
            library.logStep(temp + 'within expected ' + expectedLevels);
            library.logStepWithScreenshot('Selected level matched on', 'levelsDisplayed');
            status = true;
            resolve(status);
          } else {
            library.logFailStep('Selected level doesn\'t match expected levels');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        status = false;
        console.log('Levels not displayed');
        library.logStep('Levels not displayed');
        resolve(status);
      });
    });
  }

  selectDecimalPlaces(decimal) {
    let status = false;
    return new Promise((resolve) => {
      const decimalPls = findElement(locatorType.XPATH, decimalDropDown);
      decimalPls.isDisplayed().then(function () {
        library.click(decimalPls);
        const dec = findElement(locatorType.XPATH, './/mat-option/span[contains(text(),"' + decimal + '")]');
        library.click(dec);
        status = true;
        console.log('Decimal Selected');
        library.logStep('Decimal Selected');
        resolve(status);
      });
    });
  }

  selectSpcRule(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ruleValue = value.toLowerCase();
      const radioButtonEle = element(by.xpath('.//form//table//td//span[contains(text(),"' + rule + '")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"' + ruleValue + '")]'));
      radioButtonEle.isDisplayed().then(function () {
        library.clickJS(radioButtonEle);
        library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
        resolve(status);
      });
    });
  }

  // For verifying 2-2s, 2-3/2s, R4s, 7T rules
  isWestgardRuleSelected(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const radioButtonEle = element(by.xpath('//td//span[contains(text(),"' + rule + '")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"checked")][contains(@class,"' + value + '")]'));
      radioButtonEle.isDisplayed().then(function () {
        console.log('Rule Selected: ' + rule + ' ' + value);
        library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
        resolve(status);
      });
    });
  }

  // For verifying 7x, 8x, 9x, 10x, 12x Rules
  isKxRuleSelected(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ruleValue = rule.charAt(0);
      const radioButtonEle = element(by.xpath('//mat-select//span[contains(text(),"' + ruleValue + '")]/ancestor::td[1]//following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"checked")][contains(@class,"' + value + '")]'));
      radioButtonEle.isDisplayed().then(function () {
        console.log('Rule Selected: ' + rule + ' ' + value);
        library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
        resolve(status);
      });
    });
  }

  // For verifying 3-1s & 4-1s Rules
  isRuleSelected(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ruleValue = rule.substring(0, 3);
      const radioButtonEle = element(by.xpath('//mat-select//span[contains(text(),"' + ruleValue + '")]/ancestor::td[1]//following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"checked")][contains(@class,"' + value + '")]'));
      radioButtonEle.isDisplayed().then(function () {
        console.log('Rule Selected: ' + rule + ' ' + value);
        library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
        resolve(status);
      });
    });
  }

  // For verifying 1-2s & 1-3s rules
  isSPCRuleSelected(ruleSelected, value) {
    let status = false;
    const rule1_2Warning = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")])[1]';
    const rule1_3Reject = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")])[2]';
    const rule1_2Disable = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")])[2]';
    const rule1_3Disable = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")])[4]';
    return new Promise((resolve) => {
      const rule = ruleSelected.trim('s');
      const rulesPage = element(by.xpath('.//div[contains(@class, "spc-rules-component")]'));
      rulesPage.isDisplayed().then(function () {
        const ruleValue = value.toLowerCase();
        switch (ruleValue) {
          case 'disable': {
            if (rule.includes('1-')) {
              const ruleEle = rule.substr(2);
              if (ruleEle <= 2.99) {
                const radioButtonEle = element(by.xpath(rule1_2Disable));
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              } else if (ruleEle >= 3.00) {
                const radioButtonEle = element(by.xpath(rule1_3Disable));
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              }
            } else {
              const radioButtonEle = element(by.xpath('//td//span[contains(text(),"' + rule + '")]//ancestor::tr[@class = "bdr"]/td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"radio-disabled")]'));
              radioButtonEle.isDisplayed().then(function () {
                console.log('Radio buttpon displayed for rule ' + rule);
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              });
            }
            break;
          }
          case 'warning': {
            if (rule.includes('1-')) {
              const ruleEle = rule.substr(2);
              if (ruleEle <= 2.99) {
                const radioButtonEle = element(by.xpath(rule1_2Warning));
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              }
            } else {
              const radioButtonEle = element(by.xpath('//td//span[contains(text(),"' + rule + '")]//ancestor::tr[@class = "bdr"]/td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"radio-warning")]'));
              radioButtonEle.isDisplayed().then(function () {
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              });
            }
            break;
          }
          case 'reject': {
            if (rule.includes('1-')) {
              const ruleEle = rule.substr(2);
              if (ruleEle >= 3.00) {
                const radioButtonEle = element(by.xpath(rule1_3Reject));
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              }
            } else {
              const radioButtonEle = element(by.xpath('//td//span[contains(text(),"' + rule + '")]//ancestor::tr[@class = "bdr"]/td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"radio-reject")]'));
              radioButtonEle.isDisplayed().then(function () {
                radioButtonEle.getAttribute('class').then(function (buttonClassName) {
                  if (buttonClassName.includes('mat-radio-checked')) {
                    console.log('Rule Selected: ' + rule + ' ' + value);
                    library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
                    status = true;
                    resolve(status);
                  } else {
                    library.logStep('Rule ' + rule + ' is not selected as ' + value);
                    console.log('Rule ' + rule + ' is not selected as ' + value);
                    status = false;
                    resolve(status);
                  }
                });
              });
            }
            break;
          }
        }
      });
    });
  }

  enablePointDataEntry() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const pointDataOff = element(by.xpath(pointToogle));
      const updateBtnEle = element(by.xpath(updateBtn));
      pointDataOff.isDisplayed().then(function () {
        library.clickJS(pointDataOff);
        library.clickJS(updateBtnEle);
        result = true;
        console.log('Enabled point data entry');
        library.logStep('Enabled point data entry');
        resolve(result);
      }).catch(function () {
        result = true;
        console.log('Point data already enabled');
        library.logStep('Point data already enabled');
        resolve(result);
      });
    });
  }

  clickOkUpdateControlWarning() {
    let result = false;
    return new Promise((resolve) => {
      const controlWarningEle = element(by.xpath(controlWarning));
      const OkBtn = element(by.xpath(warningOkBtn));
      controlWarningEle.isDisplayed().then(function () {
        library.clickJS(OkBtn);
        result = true;
        console.log('Ok button clicked on warning');
        library.logStep('Ok button clicked on warning');
      }).catch(function () {
        result = true;
        console.log('Warning not displayed');
        library.logStep('Warning not displayed');
        resolve(result);
      });
    });
  }
  rejectRule(rule) {
    let flag = false;
    return new Promise((resolve) => {
      const rejectRadio = element(by.xpath('//unext-spc-rules-component//span[contains(text(),"' + rule + '")]/ancestor::td[1]/following-sibling::td//input[@value="R"]'));
      rejectRadio.isDisplayed().then(function () {
        library.clickJS(rejectRadio);
        library.clickAction(rejectRadio);
        rejectRadio.click();
        library.logStepWithScreenshot('Reject radio button clicked for ' + rule, 'rejectRadioClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStepWithScreenshot('Reject radio button not clicked for ' + rule, 'rejectRadioClicked');
        flag = false;
        resolve(flag);
      });
    });
  }

  setWarnRule(rule) {
    let flag = false;
    return new Promise((resolve) => {
      const warnRadio = findElement(locatorType.XPATH, '//unext-analyte-management-component//'
        + 'unext-spc-rules-component//span[contains(text(),"' + rule + '")]/ancestor::td[1]'
        + '/following-sibling::td//input[@value="W"]//ancestor::mat-radio-button');
      library.clickJS(warnRadio);
      library.clickAction(warnRadio);
      library.logStepWithScreenshot('Warning radio button clicked for ' + rule, 'warnRadioClicked');
      flag = true;
      resolve(flag);
    });
  }

  setDisableRule(rule) {
    let flag = false;
    return new Promise((resolve) => {
      const disableRadio = findElement(locatorType.XPATH, '//unext-analyte-management-component'
        + '//unext-spc-rules-component//span[contains(text(),"' + rule + '")]/ancestor::td[1]'
        + '/following-sibling::td//input[@value="D"]//ancestor::mat-radio-button');
      library.clickJS(disableRadio);
      library.clickAction(disableRadio);
      library.logStepWithScreenshot('Reject radio button clicked for ' + rule, 'rejectRadioClicked');
      flag = true;
      resolve(flag);
    });
  }

  // Please Specify Data Entry Type in Camel Case like 'Point' or 'Summary'
  verifyDataEntryType(dataEntry) {
    let flag = false;
    return new Promise((resolve) => {
      const dataEntryType = findElement(locatorType.XPATH, './/label[text()="' + dataEntry + '"]/following-sibling::mat-radio-button[contains(@class,"checked")]');
      dataEntryType.isDisplayed().then(function () {
        library.logStepWithScreenshot(dataEntry + ' Data Entry is enabled', dataEntry + 'enabled');
        console.log(dataEntry + ' Data Entry is enabled');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep(dataEntry + ' Data Entry is not enabled');
        console.log(dataEntry + ' Data Entry is not enabled');
        flag = false;
        resolve(flag);
      });
    });
  }
}
