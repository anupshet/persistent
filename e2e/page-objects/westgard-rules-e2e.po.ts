/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';

const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const meanL1 = './/div[contains(@class, "level-1")]//mat-row[1]/mat-cell[2]';
const sdL1 = './/div[contains(@class, "level-1")]//mat-row[2]/mat-cell[2]';
const meanL2 = './/div[contains(@class, "level-2")]//mat-row[1]/mat-cell[2]';
const sdL2 = './/div[contains(@class, "level-2")]//mat-row[2]/mat-cell[2]';
const pointL1 = './/div[contains(@class, "level-1")]//mat-row[4]/mat-cell[2]';
const pointL2 = './/div[contains(@class, "level-2")]//mat-row[4]/mat-cell[2]';
const hideDataBtn = './/span[contains(@class,"chevron")]';
const hideDataBtnState = './/span[contains(@class, "chevron")]/parent::div';
const rulePage = './/div[contains(@class, "spc-rules-component")]';
const addValTo1_2Tbx = '(.//table[@formarrayname = "ruleSettings"]//input[@formcontrolname = "value"])[1]';
const addValTo1_3Tbx = '(.//table[@formarrayname = "ruleSettings"]//input[@formcontrolname = "value"])[2]';
const rule1_2Warning = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")])[1]';
const rule1_3Reject = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")])[2]';
const rule1_2Disable = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")])[2]';
const rule1_3Disable = '(.//table//td//span[contains(text(),"1-")]/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")])[4]';
const rule7xDropDown = '(.//table[@formarrayname = "ruleSettings"]//mat-select[@formcontrolname = "value"])[1]';
const rule7xWarning = './/span[contains(text(), "x")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const rule7xReject = './/span[contains(text(), "x")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const rule7xDisable = './/span[contains(text(), "x")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
const rule3_1sDropDown = '(.//table[@formarrayname = "ruleSettings"]//mat-select[@formcontrolname = "value"])[2]';
const rule3_1sWarning = './/span[contains(text(), "-1")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const rule3_1sReject = './/span[contains(text(), "-1")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const rule3_1sDisable = './/span[contains(text(), "-1")]/ancestor::td//span/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
const rule2of2sWarning = './/table//td//span[contains(text(),"2 of 2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const rule2of2sReject = './/table//td//span[contains(text(),"2 of 2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const rule2of2sDisabled = './/table//td//span[contains(text(),"2 of 2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
const rule2of3_2sWarning = './/table//td//span[contains(text(),"2 of 3/2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const rule2of3_2sReject = './/table//td//span[contains(text(),"2 of 3/2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const rule2of3_2sDisable = './/table//td//span[contains(text(),"2 of 3/2s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
const rule7TWarning = './/table//td//span[contains(text(),"7-T")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const rule7TReject = './/table//td//span[contains(text(),"7-T")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const rule7TDisabled = './/table//td//span[contains(text(),"7-T")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
const ruleR4sWarning = './/table//td//span[contains(text(),"R-4s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"warning")]';
const ruleR4sReject = './/table//td//span[contains(text(),"R-4s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"reject")]';
const ruleR4sDisable = './/table//td//span[contains(text(),"R-4s")]/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"disabled")]';
// const level1value = './/input[@tabindex="1"]';
const level1value = './/input[@tabindex="101"]';
// const level2Value = './/input[@tabindex="2"]'
const level2Value = './/input[@tabindex="102"]';
const manuallyEnterData = ".//a[contains(@class,'manually-enter-test-run')]";
const spcSection = './/unext-spc-rules-component';
const enterValLvl1 = '(.//tr[@class="ng-star-inserted"])[1]/td[3]/unext-value-cell//span[contains(@class, "show")]';
const enterValLvl2 = '(.//tr[@class="ng-star-inserted"])[1]/td[7]/unext-value-cell//span[contains(@class, "show")]';
const SubmitPointDataValues = "//span[contains(text(),'Submit ')]";
const minGraphView = "//div[@class='toggle-trigger spec_toggle_div ng-tns-c505-35']";
const levelbarongraphView = "//div[@class='flex-1 ng-tns-c505-35']";
const editThisAnalyteButton = './/button//span[contains(text(), "Edit this analyte")]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';

//filter data
const datavalue = "//tr[@class='ng-star-inserted']";
const deletedata = "//button[@class='mat-focus-indicator delete-icon mat-fab mat-button-base mat-warn']";
const confirmDelete = "//button[@class='mat-focus-indicator dialog-ok mat-button mat-flat-button mat-button-base ng-star-inserted']"
const acceptedData = "//div[@class='mark radius-5']";
const rejecteddata = "//div[@class='mark radius-5 red strike']";
const warningData = "//div[@class='mark radius-5 yellow']";
const actioncommentedData = "//span[@class='ic-pez ic-change-history-24px' or @class='ic-pez ic-chat-bubble-outline-24px']";

export class WestgardRule {
  static pointLevelString1: String;
  static pointLevelString2: String;



  selectRule(rule, value) {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const rulesPage = findElement(locatorType.XPATH, rulePage);
      rulesPage.isDisplayed().then(function () {
        if (rule.includes('1-')) {
          const ruleVal = rule.substr(2);
          if (value === 'warning') {
            const setVal = findElement(locatorType.XPATH, addValTo1_2Tbx);
            const radioBtn = findElement(locatorType.XPATH, rule1_2Warning);
            setVal.clear();
            setVal.sendKeys(ruleVal);
            library.click(radioBtn);
            console.log('Warning selected for rule ' + rule);
            library.logStep('Warning selected for rule ' + rule);
            status = true;
            resolve(status);
          } else if (value === 'reject') {
            const setVal = findElement(locatorType.XPATH, addValTo1_3Tbx);
            const radioBtn = findElement(locatorType.XPATH, rule1_3Reject);
            setVal.clear();
            setVal.sendKeys(ruleVal);
            library.click(radioBtn);
            console.log('Reject selected for rule ' + rule);
            library.logStep('Reject selected for rule ' + rule);
            status = true;
            resolve(status);
          } else if (value === 'disabled') {
            if (ruleVal <= 2.99) {
              const radioBtn = findElement(locatorType.XPATH, rule1_2Disable);
              library.click(radioBtn);
              console.log('Disabled Selected for ' + rule);
              library.logStep('Disabled Selected for ' + rule);
              status = true;
              resolve(status);
            } else if (ruleVal >= 3.00) {
              const radioBtn = findElement(locatorType.XPATH, rule1_3Disable);
              library.click(radioBtn);
              console.log('Disabled Selected for ' + rule);
              library.logStep('Disabled Selected for ' + rule);
              status = true;
              resolve(status);
            }
          }
        } else if (rule.includes('x')) {
          const ruleVal = rule.replace('x', '');
          if (value === 'warning') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule7xDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule7xWarning);
            clickRuleDropDown.isPresent().then(function () {
              browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
              clickRuleDropDown.click();
              const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
              library.click(selectRule);
              library.click(radioBtn);
              console.log('Warning selected for rule ' + rule);
              library.logStep('Warning selected for rule ' + rule);
              status = true;
              resolve(status);
            });
          } else if (value === 'reject') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule7xDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule7xReject);
            browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
            library.click(clickRuleDropDown);
            const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
            library.click(selectRule);
            library.click(radioBtn);
            console.log('Reject selected for rule ' + rule);
            library.logStep('Reject selected for rule ' + rule);
            status = true;
            resolve(status);
          } else if (value === 'disabled') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule7xDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule7xDisable);
            browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
            library.click(clickRuleDropDown);
            const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
            library.click(selectRule);
            library.click(radioBtn);
            console.log('Disabled selected for rule ' + rule);
            library.logStep('Disabled selected for rule ' + rule);
            status = true;
            resolve(status);
          }
        } else if (rule.includes('3-1s') || rule.includes('4-1s')) {
          const ruleVal = rule.replace('s', '');
          if (value === 'warning') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule3_1sDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule3_1sWarning);
            browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
            library.click(clickRuleDropDown);
            const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
            library.click(selectRule);
            library.click(radioBtn);
            console.log('Warning selected for rule ' + rule);
            library.logStep('Warning selected for rule ' + rule);
          } else if (value === 'reject') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule3_1sDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule3_1sReject);
            browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
            library.click(clickRuleDropDown);
            const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
            library.click(selectRule);
            library.click(radioBtn);
            console.log('Reject selected for rule ' + rule);
            library.logStep('Reject selected for rule ' + rule);
            status = true;
            resolve(status);
          } else if (value === 'disabled') {
            const clickRuleDropDown = findElement(locatorType.XPATH, rule3_1sDropDown);
            const radioBtn = findElement(locatorType.XPATH, rule3_1sDisable);
            browser.executeScript('arguments[0].scrollIntoView();', clickRuleDropDown);
            library.click(clickRuleDropDown);
            const selectRule = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + ruleVal + '")]');
            library.click(selectRule);
            library.click(radioBtn);
            console.log('Disabled selected for rule ' + rule);
            library.logStep('Disabled selected for rule ' + rule);
            status = true;
            resolve(status);
          }
        } else {
          switch (rule) {
            case '2 of 2s': {
              if (value === 'warning') {
                const radioBtn = findElement(locatorType.XPATH, rule2of2sWarning);
                library.clickJS(radioBtn);
                console.log('Warning selected for rule ' + rule);
                library.logStep('Warning selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'reject') {
                const radioBtn = findElement(locatorType.XPATH, rule2of2sReject);
                library.click(radioBtn);
                console.log('Reject selected for rule ' + rule);
                library.logStep('Reject selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'disabled') {
                const radioBtn = findElement(locatorType.XPATH, rule2of2sDisabled);
                library.click(radioBtn);
                console.log('Disabled selected for rule ' + rule);
                library.logStep('Disabled selected for rule ' + rule);
                status = true;
                resolve(status);
              }
              break;
            }
            case '2 of 3/2s': {
              if (value === 'warning') {
                const radioBtn = findElement(locatorType.XPATH, rule2of3_2sWarning);
                library.click(radioBtn);
                console.log('Warning selected for rule ' + rule);
                library.logStep('Warning selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'reject') {
                const radioBtn = findElement(locatorType.XPATH, rule2of3_2sReject);
                library.click(radioBtn);
                console.log('Reject selected for rule ' + rule);
                library.logStep('Reject selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'disabled') {
                const radioBtn = findElement(locatorType.XPATH, rule2of3_2sDisable);
                library.click(radioBtn);
                console.log('Disabled selected for rule ' + rule);
                library.logStep('Disabled selected for rule ' + rule);
                status = true;
                resolve(status);
              }
              break;
            }
            case '7-T': {
              if (value === 'warning') {
                const radioBtn = findElement(locatorType.XPATH, rule7TWarning);
                library.click(radioBtn);
                console.log('Warning selected for rule ' + rule);
                library.logStep('Warning selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'reject') {
                const radioBtn = findElement(locatorType.XPATH, rule7TReject);
                library.click(radioBtn);
                console.log('Reject selected for rule ' + rule);
                library.logStep('Reject selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'disabled') {
                const radioBtn = findElement(locatorType.XPATH, rule7TDisabled);
                library.click(radioBtn);
                console.log('Disabled selected for rule ' + rule);
                library.logStep('Disabled selected for rule ' + rule);
                status = true;
                resolve(status);
              }
              break;
            }
            case 'R-4s': {
              if (value === 'warning') {
                const radioBtn = findElement(locatorType.XPATH, ruleR4sWarning);
                library.click(radioBtn);
                console.log('Warning selected for rule ' + rule);
                library.logStep('Warning selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'reject') {
                const radioBtn = findElement(locatorType.XPATH, ruleR4sReject);
                library.click(radioBtn);
                console.log('Reject selected for rule ' + rule);
                library.logStep('Reject selected for rule ' + rule);
                status = true;
                resolve(status);
              } else if (value === 'disabled') {
                const radioBtn = findElement(locatorType.XPATH, ruleR4sDisable);
                library.click(radioBtn);
                console.log('Disabled selected for rule ' + rule);
                library.logStep('Disabled selected for rule ' + rule);
                status = true;
                resolve(status);
              }
              break;
            }
          }
        }
      });
    });
  }

  getCalculatedValuesForBothLevels3_1s_4_1s(operation, addVal) {
    const newData = new Array(2);
    return new Promise((resolve) => {
      // browser.sleep(10000);
      const meanlocator1 = findElement(locatorType.XPATH, meanL1);
      browser.wait(browser.ExpectedConditions.visibilityOf(meanlocator1), 5000, 'Summary Statistics not displayed');
      const meanlocator2 = findElement(locatorType.XPATH, meanL2);
      const sdlocator1 = findElement(locatorType.XPATH, sdL1);
      const sdlocator2 = findElement(locatorType.XPATH, sdL2);
      const pointlocator1 = findElement(locatorType.XPATH, pointL1);
      const pointlocator2 = findElement(locatorType.XPATH, pointL2);
      meanlocator1.getText().then(function (testMean1) {
        meanlocator2.getText().then(function (testMean2) {
          sdlocator1.getText().then(function (testSd1) {
            sdlocator2.getText().then(function (testSd2) {
              pointlocator1.getText().then(function (point1) {
                pointlocator2.getText().then(function (point2) {
                  const meanInteger1 = parseFloat(testMean1);
                  const meanInteger2 = parseFloat(testMean2);
                  const sdInteger1 = parseFloat(testSd1);
                  const sdInteger2 = parseFloat(testSd2);
                  WestgardRule.pointLevelString1 = point1;
                  WestgardRule.pointLevelString2 = point2;
                  console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' ' + WestgardRule.pointLevelString1);
                  console.log('Mean, SD & Point for Level 2: ' + meanInteger2 + ' ' + sdInteger2 + ' ' + WestgardRule.pointLevelString2);
                  library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
                    ' ' + sdInteger1 + ' ' + WestgardRule.pointLevelString1);
                  library.logStep('Mean, SD & Point for Level 2: ' + meanInteger2 +
                    ' ' + sdInteger2 + ' ' + WestgardRule.pointLevelString2);
                  if (operation === 'Positive') {
                    const val1 = meanInteger1 + sdInteger1 + addVal;
                    const val2 = meanInteger2 + sdInteger2 + addVal + 0.01;
                    newData[0] = val1.toFixed(2);
                    newData[1] = val2.toFixed(2);

                    library.logStep('newData[0] ' + newData[0]);
                    library.logStep('newData[1] ' + newData[1]);
                    resolve(newData);
                  } else if (operation === 'Negative') {
                    const val1 = meanInteger1 - sdInteger1 - addVal;
                    const val2 = meanInteger2 - sdInteger2 - addVal - 0.01;
                    newData[0] = val1.toFixed(2);
                    newData[1] = val2.toFixed(2);

                    library.logStep('newData[0] ' + newData[0]);
                    library.logStep('newData[1] ' + newData[1]);
                    resolve(newData);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  clickHideData() {
    let status = false;
    return new Promise((resolve) => {
      const hideDataButton = element(by.xpath(hideDataBtn));
      browser.wait(browser.ExpectedConditions.visibilityOf(hideDataButton), 5000, 'Hide data button not displayed');
      hideDataButton.isDisplayed().then(function () {
        const state = findElement(locatorType.XPATH, hideDataBtnState);
        state.getAttribute('class').then(function (txt) {
          if (txt.includes('opened')) {
            library.click(hideDataButton);
            // dashBoard.waitForPage();
            status = true;
            library.logStep('Hide Data Button clicked');
            resolve(status);
          }
        });
      }).catch(function () {
        status = true;
        library.logStep('Hide Data Button not displayed');
        resolve(status);
      });
    });
  }

  clickShowData() {
    let status = false;
    return new Promise((resolve) => {
      // dashBoard.waitForPage();
      const hideDataButton = findElement(locatorType.XPATH, hideDataBtn);
      hideDataButton.isDisplayed().then(function () {
        const state = findElement(locatorType.XPATH, hideDataBtnState);
        state.getAttribute('class').then(function (txt) {
          if (txt.includes('opened')) {
            status = true;
            library.logStep('Show Data displayed');
            resolve(status);
          } else {
            library.click(hideDataButton);
            // dashBoard.waitForPage();
            status = true;
            library.logStep('Hide Data Button clicked');
            resolve(status);
          }
        });
      }).catch(function () {
        status = true;
        library.logStep('Hide Data Button not displayed');
        resolve(status);
      });
    });
  }

  getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2, operation) {
    const newData = new Array(2);
    return new Promise((resolve) => {
      // browser.sleep(10000);
      const meanlocator1 = element(by.xpath(meanL1));
      browser.wait(browser.ExpectedConditions.visibilityOf(meanlocator1), 8000, 'Summary Statistics values not displayed');
      const meanlocator2 = element(by.xpath(meanL2));
      const sdlocator1 = element(by.xpath(sdL1));
      const sdlocator2 = element(by.xpath(sdL2));
      const pointlocator1 = element(by.xpath(pointL1));
      const pointlocator2 = element(by.xpath(pointL2));
      meanlocator1.getText().then(function (testMean1) {
        meanlocator2.getText().then(function (testMean2) {
          sdlocator1.getText().then(function (testSd1) {
            sdlocator2.getText().then(function (testSd2) {
              pointlocator1.getText().then(function (point1) {
                pointlocator2.getText().then(function (point2) {
                  const meanInteger1 = parseFloat(testMean1);
                  const meanInteger2 = parseFloat(testMean2);
                  const sdInteger1 = parseFloat(testSd1);
                  const sdInteger2 = parseFloat(testSd2);
                  WestgardRule.pointLevelString1 = point1;
                  WestgardRule.pointLevelString2 = point2;
                  console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' ' + WestgardRule.pointLevelString1);
                  console.log('Mean, SD & Point for Level 2: ' + meanInteger2 + ' ' + sdInteger2 + ' ' + WestgardRule.pointLevelString2);
                  library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
                    ' ' + sdInteger1 + ' ' + WestgardRule.pointLevelString1);
                  library.logStep('Mean, SD & Point for Level 2: ' + meanInteger2 +
                    ' ' + sdInteger2 + ' ' + WestgardRule.pointLevelString2);
                  if (operation === 'Positive') {
                    const val1 = meanInteger1 + multiplyL1 * sdInteger1 + addL1;
                    const val2 = meanInteger2 + multiplyL2 * sdInteger2 + addL2;
                    newData[0] = val1.toFixed(2);
                    newData[1] = val2.toFixed(2);
                    console.log('newData[0] ' + newData[0]);
                    console.log('newData[1] ' + newData[1]);
                    library.logStep('newData[0] ' + newData[0]);
                    library.logStep('newData[1] ' + newData[1]);
                    resolve(newData);
                  } else if (operation === 'Negative') {
                    const val1 = meanInteger1 - multiplyL1 * sdInteger1 - addL1;
                    const val2 = meanInteger2 - multiplyL2 * sdInteger2 - addL2;
                    newData[0] = val1.toFixed(2);
                    newData[1] = val2.toFixed(2);
                    console.log('newData[0] ' + newData[0]);
                    console.log('newData[1] ' + newData[1]);
                    library.logStep('newData[0] ' + newData[0]);
                    library.logStep('newData[1] ' + newData[1]);
                    resolve(newData);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  enterPointValues(val1, val2) {
    let result, value1Entered, value2Entered = false;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      const valueLevel2 = findElement(locatorType.XPATH, level2Value);
      // browser.executeScript('arguments[0].scrollIntoView();', valueLevel1);
      valueLevel1.isDisplayed().then(function () {
        // valueLevel1.click();
        valueLevel1.sendKeys(val1).then(function () {
          // browser.sleep(5000);
          console.log('Values entered: ' + val1);
          value1Entered = true;
          library.logStep('Level 1 value entered');
        });
      }).then(function () {
        valueLevel2.isDisplayed().then(function () {
          valueLevel2.click();
          valueLevel2.sendKeys(val2).then(function () {
            // browser.sleep(5000);
            console.log('Values entered: ' + val2);
            value2Entered = true;
            library.logStep('Level 2 value entered');
          });
        });
      }).then(function () {
        if (value1Entered === true && value2Entered === true) {
          library.logStepWithScreenshot('Both the values entered', 'PointValuesEntered');
          console.log('Both the values entered');
          result = true;
          resolve(result);
        }
      }).catch(function () {
        library.logStepWithScreenshot('Data Entry fields not displayed', 'DataEntryNotDisplayed');
        console.log('ata Entry fields not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  SubmitPointDataValues() {
    return new Promise((resolve) => {
      console.log("In Submit ");
      library.logStep("In Submit");
      let Submit = element(by.xpath(SubmitPointDataValues));
      let minimizeGraphView = element(by.xpath(minGraphView));
      library.waitTillClickable(Submit, 5000).then(() => {
        return Submit.click();
      }).then(() => {
        console.log("Clicked Submit");
        return library.waitLoadingImageIconToBeInvisible();
      }).then(() => {
        resolve(true);
      }).catch((e) => {
        library.logFailStep("Clicking submit button failed");
        resolve(false);
      });
    });

  }


  verifyEnteredPointValues(val1, val2) {
    let result, value1Entered, value2Entered = false;
    return new Promise((resolve) => {
      //browser.sleep(13000);
      const enteredValueLevel1 = findElement(locatorType.XPATH, enterValLvl1);
      browser.wait(browser.ExpectedConditions.visibilityOf(enteredValueLevel1), 5000, 'Value not displayed');
      const enteredValueLevel2 = findElement(locatorType.XPATH, enterValLvl2);
      library.scrollToElement(enteredValueLevel1);
      enteredValueLevel1.getText().then(function (text1) {
        library.logStep(text1);
        if (text1.includes(val1)) {
          value1Entered = true;
          library.logStep('Verified level 1 value');
          console.log('Verified level 1 value');
        }
      });
      enteredValueLevel2.getText().then(function (text2) {
        library.logStep(text2);
        if (text2.includes(val2)) {
          value2Entered = true;
          library.logStep('Verified level 2 value');
          console.log('Verified level 2 value');
          browser.sleep(5000);
        }
      });

      if (value1Entered === true && value2Entered === true) {
        console.log("Verified level 1 & level 2 values");
        result = true;
        library.logStepWithScreenshot('Verified level 1 & level 2 values', 'VerifiedValues');

      }
      resolve(result);

    });

  }

  isWarningDisplayed(value) {
    let result = false;
    return new Promise((resolve) => {
      const warning = element(by.xpath('.//span[@mattooltip= "Warning"][contains(text(),"' + value + '")][@class="show"]'));
      const color = element(by.xpath('.//span[@mattooltip= "Warning"][contains(text(),"' + value + '")][@class="show"]/parent::div[contains(@class,"yellow")]'));
      warning.isDisplayed().then(function () {
        color.isDisplayed().then(function () {
          library.logStepWithScreenshot('The Warning is shown properly', 'WarningShown');
          console.log('The Warning is shown properly');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        library.logStepWithScreenshot('The Warning is not shown.', 'WarningNotShown');
        console.log('The Warning is not shown');
        result = false;
        resolve(result);
      });
    });
  }

  waitForSummaryStatistics() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const meanlocator1 = element(by.xpath(meanL1));
      browser.wait(browser.ExpectedConditions.visibilityOf(meanlocator1), 40000);
      meanlocator1.isDisplayed().then(function () {
        flag = true;
        library.logStep('Summary Stats Visible');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logStep('Summary Stats Not Visible');
        resolve(flag);
      });
    });
  }
  compareReason(value, expectedReason) {
    let result = false;
    return new Promise((resolve) => {
      const reasonElement = element(by.xpath('.//span[contains(text(),"' + value + '")]/ancestor::td/following-sibling::td[2]//div'));
      reasonElement.isDisplayed().then(function () {
        reasonElement.getText().then(function (text) {
          console.log('txt found: ' + text);
          console.log('txt dneed: ' + expectedReason);
          const actualReason = text.trim();
          console.log('txt tneed: ' + actualReason);
          console.log('actualReason: ' + actualReason + ' expectedReason ' + expectedReason);
          if (actualReason.includes(expectedReason)) {
            console.log('IF actualReason: ' + actualReason + ' expectedReason ' + expectedReason);
            library.logStepWithScreenshot('Correct reason is displayed', 'ReasonDisplayed');
            console.log(actualReason + ' ' + expectedReason);
            result = true;
            resolve(result);
          } else {
            console.log('Else actualReason: ' + actualReason + ' expectedReason ' + expectedReason);
            library.logFailStep('Incorrect reason is displayed');
            result = false;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Catch actualReason:  expectedReason ' + expectedReason);
        library.logFailStep('Unable to verify the reason');
        result = false;
        resolve(result);
      });
    });
  }

  CloseManuallyenterData()
  {
    console.log('In close manualDataentryclick');
    let status = false;
    return new Promise((resolve) => {
      // dashBoard.waitForScroll();
      const enterSummary = findElement(locatorType.XPATH, manuallyEnterData);
      browser.executeScript('arguments[0].scrollIntoView(true);', enterSummary);
      const level1 = element(by.xpath(level1value));
      level1.isDisplayed().then(function () {
        status = true;
        enterSummary.click();
        library.logStep('Data entry fields closed');
        resolve(status);
      }).catch(function () {
        library.clickJS(enterSummary);
        status = false;
        library.logStep('Manually Enter Data Clicked.');
        console.log('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }

  clickManuallyEnterData() {
    console.log('In manualDataentryclick');
    let status = false;
    return new Promise((resolve) => {
      // dashBoard.waitForScroll();
      const enterSummary = findElement(locatorType.XPATH, manuallyEnterData);
      browser.executeScript('arguments[0].scrollIntoView(true);', enterSummary);
      const level1 = element(by.xpath(level1value));
      level1.isDisplayed().then(function () {
        status = true;
        library.logStep('Data entry fields already displayed');
        console.log('Data entry fields already displayed');
        resolve(status);
      }).catch(function () {
        library.clickJS(enterSummary);
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        console.log('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }

  isSpcRuleSectionDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const section = element(by.xpath(spcSection));
      section.isDisplayed().then(function () {
        console.log('SPC Rules Section displayed');
        library.logStep('SPC Rules Section displayed');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('SPC Rules Section not displayed');
        library.logStep('SPC Rules Section not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  comparePointValues() {
    let result = false;
    let newPointl1, newPointl2;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const pointl1 = element(by.xpath(pointL1));
      const pointl2 = element(by.xpath(pointL2));
      pointl1.getText().then(function (point1) {
        pointl2.getText().then(function (point2) {
          newPointl1 = point1;
          newPointl2 = point2;
          if (WestgardRule.pointLevelString1 !== newPointl1 && WestgardRule.pointLevelString2 !== newPointl2) {
            library.logStepWithScreenshot('Point Value is updated for both the levels', 'PointValueUpdated');
            console.log(WestgardRule.pointLevelString1 + ' ' + newPointl1 + ' ' + WestgardRule.pointLevelString2 + ' ' + newPointl2);
            result = true;
            resolve(result);
          } else {
            library.logFailStep('Point Value is not updated for both the levels');
            result = false;
            resolve(result);
          }
        });
      }).catch(function () {
        library.logFailStep('Could not validate Point Value for both the levels');
        result = false;
        resolve(result);
      });
    });
  }
  setValueRange(val) {
    let status = false;
    return new Promise((resolve) => {
      const ele = findElement(locatorType.XPATH, '(//mat-form-field//input[contains(@formcontrolname,"value")])[1]');
      ele.clear();
      ele.sendKeys(val);
      status = true;
      library.logStep(val + ' Value Range entered in 1-2s rule.');
      resolve(status);
    });
  }

  clickEditThisAnalyteLink() {
    let status = true;
    return new Promise((resolve) => {
      const editAnalyte = element(by.xpath(editThisAnalyteButton));
      browser.wait(browser.ExpectedConditions.visibilityOf(editAnalyte), 5000, 'Edit Analyte link not displayed');
      editAnalyte.isDisplayed().then(function () {
        // editAnalyte.click().then(function () {
        library.clickJS(editAnalyte);
        library.logStep('Edit Analyte link clicked');
        status = true;
        resolve(status);
        // });
      }).catch(function () {
        library.logFailStep('Unable to click Edit Analyte link');
        status = false;
        resolve(status);
      });
    });
  }
}
