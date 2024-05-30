/*
 * Copyright � 2021 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, By } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { stat } from 'fs';

const dashBoard = new Dashboard();
const library = new BrowserLibrary();

const spcRulesLabel = './/label[.="SPC rules"]';
const spcRulesToggleButton = './/label[.="SPC rules"]/parent::div/mat-slide-toggle';
const headerRULE = './/th[contains(text(), "RULE")]';
const headerREJECT = './/th[contains(text(), "REJECT")]';
const headerWARN = './/th[contains(text(), "WARN")]';
const headerDISABLE = './/th[contains(text(), "DISABLE")]';
const spcRulesRadioButtons = './/div[@class = "mat-radio-outer-circle"]';
const spcRules12s = '(//*[@formarrayname="ruleSettings"]//td[@class="w-95 ng-star-inserted"])[1]';
const spcRules13s = '(//*[@formarrayname="ruleSettings"]//td[@class="w-95 ng-star-inserted"])[2]';
const rule12sDisabledButton = '(//*[@formarrayname="ruleSettings"]//td[@class="w-95 ng-star-inserted"])[1]/parent::tr//tr/td[3]/mat-radio-button';
const rule13sDisabledButton = '(//*[@formarrayname="ruleSettings"]//td[@class="w-95 ng-star-inserted"])[1]/parent::tr//tr/td[3]/mat-radio-button';
const meanL1 = './/div[contains(@class, "level-1")]//mat-row[1]/mat-cell[2]';
const sdL1 = './/div[contains(@class, "level-1")]//mat-row[2]/mat-cell[2]';
const meanL2 = './/div[contains(@class, "level-2")]//mat-row[1]/mat-cell[2]';
const sdL2 = './/div[contains(@class, "level-2")]//mat-row[2]/mat-cell[2]';
const meanL3 = './/div[contains(@class, "level-3")]//mat-row[1]/mat-cell[2]';
const sdL3 = './/div[contains(@class, "level-3")]//mat-row[2]/mat-cell[2]';
const pointL1 = './/div[contains(@class, "level-1")]//mat-row[4]/mat-cell[2]';
const pointL2 = './/div[contains(@class, "level-2")]//mat-row[4]/mat-cell[2]';
const pointL3 = './/div[contains(@class, "level-3")]//mat-row[4]/mat-cell[2]';
const updateButton = './/button[@type="submit"]';
const returnToDataLink = 'spec_returnToData';
const headerTitle = './/h2[@id="spec_analyteTitle"]';
const summaryDataEntryLabel = './/label[contains(text(), "Summary")]';
const summaryDataEntryToggle = './/mat-radio-group[contains(@id, "spec_summarydataentry")]';
const summaryRadioButton = './/mat-radio-group//label[contains(text(), "Summary")]/parent::div//mat-radio-button';
const levelsInUseLabel = './/label[contains(text(),"Levels in use")]';
const levelsInUseCheckboxes = './/div[@formarrayname="levels"]';
const decimalPlacesLabel = './/label[contains(text(),"Decimal places")]';
const decimalPlacesDropdown = './/mat-select[@role="listbox"]';
const reagentManufacturerDropdown = './/br-select[@id="spec_reagentManufacturer"]/div[@id="singleData"]';
const reagentDropdown = './/br-select[@id="spec_reagents"]/mat-form-field';
const reagentLotDropdown = './/br-select[@id="spec_reagentLots"]/div[@id="singleData"]';
const calibratorManufacturerDropdown = './/br-select[@id="spec_calibratorManufacturer"]/div[@id="singleData"]';
const calibratorDropdown = './/br-select[@formcontrolname="calibrator"]/div[@id="singleData"]';
const calibratorLotDropdown = './/br-select[@id="spec_calibratorLots"]/div[@id="singleData"]';
const methodDropdown = './/br-select[@id="spec_method"]/div[@id="singleData"]';
const unitDropdown = './/br-select[@id="spec_unit"]';
const deleteButton = './/button[contains(@class, "delete")]';
const cancelButton = './/button[contains(@class, "cancel")]';
const spcRulesComponent = './/div[contains(@class, "spc-rules-component")]';
const confirmDeleteDialog = './/mat-dialog-container[@role="dialog"]';
const confirmDeleteText = './/p[contains(text(),"Are you sure you want to delete this ?")]';
const confirmDeleteDialogConfirmDeleteButton = './/span[contains(text(),"CONFIRM DELETE")]/parent::button';
const confirmDeleteDialogCancelButton = './/span[contains(text(),"CANCEL")]/parent::button';
const leftNavigationAnalytes = './/mat-nav-list[@role="navigation"]//div[@class="primary-dispaly-text"]';
const reagentDDArrow = './/mat-select[contains(@aria-label, "Reagent")]//div[contains(@class,"mat-select-value")]';
const reagentValue = './/mat-select[contains(@aria-label,"Reagent")]//span[contains(@class,"mat-select-value-text")]/span';
const unitDDArrow = './/mat-select[contains(@aria-label, "Unit of measure")]//div[contains(@class,"mat-select-value")]';
const unitOfMeasureValue = './/mat-select[contains(@aria-label,"Unit")]//span[contains(@class,"mat-select-value-text")]/span';
const decimalPlacesDDArrow = '(.//mat-select[@tabindex="0"]//div[contains(@class,"mat-select-value")])[1]';
const decimalValue = '(.//mat-select[@tabindex=0]//span[contains(@class,"mat-select-value-text")]/span)[1]';
const level2Checkbox = '(.//div[@formarrayname="levels"]//mat-checkbox)[2]';
const kxRuleDropdown = '(.//span[contains(text(),"x")])[2]/parent::span//mat-select';
const dontSeeYourReagentLink = './/span[contains(text(),"see your reagent?")]';
const dontSeeYourReagentLotLink = './/span[contains(text(),"see your reagent lot?")]';
const dontSeeYourCalibratorLink = './/span[contains(text(),"see your calibrator?")]';
const dontSeeYourCalibratorLotLink = './/span[contains(text(),"see your calibrator lot?")]';
const sendInformationButton = './/button[@id="spec_sendInformation"]';
const closePopupButton = './/mat-icon[contains(@class,"close")]';
const sendInformationButtonDisabled = './/button[@id="spec_sendInformation"][@disabled="true"]';
const fileUploadIcon = './/div[contains(@class, "draganddrop")]//mat-icon[@role="img"]';
const fileUploadMessage = './/h2/span[contains(text(),"Drop a file here or")]/following-sibling::label[contains(text(),"browse for a file.")]';
const popupCancelButton = './/mat-dialog-actions/button/span[contains(text(),"Cancel")]';
const popup = './/mat-dialog-container[@role="dialog"]';
const incorrectFileTypeError = './/small[contains(@class,"red center")][contains(text(),"File extension is incorrect.")]';
const incorrectFileSizeError = './/small[contains(@class,"red center")][contains(text(),"File exceeds 7 MB.")]';


export class AnalyteSettings {
  static pointLevelString1: String;
  static pointLevelString2: String;
  static pointLevelString3: String;

  spcRulesDisplayed() {
    browser.ignoreSynchronization = true;
    let displayed, headers, spcRules, radioButtons, rule1Disabled, rule2Disabled = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const rulesLabel = element(by.xpath(spcRulesLabel));
      const toggleButton = element(by.xpath(spcRulesToggleButton));
      const headerRule = element(by.xpath(headerRULE));
      const headerReject = element(by.xpath(headerREJECT));
      const headerWarn = element(by.xpath(headerWARN));
      const headerDisable = element(by.xpath(headerDISABLE));
      const spcRules12sEle = element(by.xpath(spcRules12s));
      const spcRules13sEle = element(by.xpath(spcRules13s));
      const spcRulesRadioButtonsEle = element.all(by.xpath(spcRulesRadioButtons));
      const spc12sDisabled = element(by.xpath(rule12sDisabledButton));
      const spc13sDisabled = element(by.xpath(rule13sDisabledButton));
      rulesLabel.isDisplayed().then(function () {
        console.log('Label');
        toggleButton.isDisplayed().then(function () {
          console.log('Toggle Button');
          headerRule.isDisplayed().then(function () {
            console.log('RULE');
            headerReject.isDisplayed().then(function () {
              console.log('REJECT');
              headerWarn.isDisplayed().then(function () {
                console.log('WARN');
                headerDisable.isDisplayed().then(function () {
                  console.log('DISABLE');
                  library.logStep('SPC Rules Header is displayed');
                  headers = true;
                  console.log('headers ' + headers);
                  if (spcRules12sEle.isDisplayed() && spcRules13sEle.isDisplayed()) {
                    console.log('1-2s');
                    console.log('1-3s');
                    library.logStep('SPC Rules column is Displayed');
                    spcRules = true;
                    console.log('spcRules ' + spcRules);
                  } else {
                    library.logFailStep('SPC Rules Column is not Displayed');
                    spcRules = false;
                    console.log('spcRules ' + spcRules);
                  }
                  spc12sDisabled.isDisplayed().then(function () {
                    spc12sDisabled.getAttribute('class').then(function (classrule1) {
                      if (classrule1.includes('checked')) {
                        console.log('For 1-2s Rule, Disable button is selected by default');
                        library.logStep('For 1-2s Rule, Disable button is selected by default');
                        rule1Disabled = true;
                        console.log('rule1Disabled ' + rule1Disabled);
                      }
                    });
                  });
                  spc13sDisabled.isDisplayed().then(function () {
                    spc13sDisabled.getAttribute('class').then(function (classrule1) {
                      if (classrule1.includes('checked')) {
                        console.log('For 1-3s Rule, Disable button is selected by default');
                        library.logStep('For 1-3s Rule, Disable button is selected by default');
                        rule2Disabled = true;
                        console.log('rule2Disabled ' + rule2Disabled);
                      }
                    });
                  });
                  spcRulesRadioButtonsEle.count().then(function (rdbCount) {
                    console.log('rdbCount ' + rdbCount);
                    if (rdbCount === 6) {
                      console.log('SPC Rules Radio Buttons Displayed: ' + rdbCount);
                      library.logStep('SPC Rules Radio Buttons Displayed: ' + rdbCount);
                      radioButtons = true;
                      console.log('radioButtons ' + radioButtons);
                    } else {
                      console.log('SPC Rules Radio Buttons are not Displayed');
                      library.logFailStep('SPC Rules Radio Buttons are not Displayed');
                      radioButtons = false;
                      console.log('radioButtons ' + radioButtons);
                    }
                  });
                  if (headers === true && spcRules === true && radioButtons === true && rule1Disabled === true && rule2Disabled === true) {
                    console.log('Pass: ' + headers + ' ' + spcRules + ' ' + radioButtons + ' ' + rule1Disabled + ' ' + rule2Disabled);
                    library.logStepWithScreenshot('Pass: SPC Rules Section Displayed', 'SPCRulesSectionDisplayed');
                    displayed = true;
                    resolve(displayed);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  clickUpdateButton() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      const update = element(by.xpath(updateButton));
      browser.executeScript('arguments[0].scrollIntoView();', update);
      browser.wait(browser.ExpectedConditions.elementToBeClickable(update), 8000, 'Unable to click update');
      update.isDisplayed().then(function () {
        library.clickJS(update);
        dashBoard.waitForElement();
        console.log('Update Button Clicked');
        library.logStep('Update Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Unable to click Update Button');
        library.logFailStep('Unable to click Update Button');
        status = false;
        resolve(status);
      });
    });
  }

  selectSpcRule(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const radioButtonEle = element(by.xpath('.//form//table//td[contains(text(),"' + rule + '")]/following-sibling::td/mat-radio-group//mat-radio-button[contains(@value,"' + value + '")]//input'));
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

  isSPCRuleSelected(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const radioButtonEle = element(by.xpath('.//td[contains(text(),"' + rule + '")]/following-sibling::td/mat-radio-group//mat-radio-button[contains(@value,"' + value + '")]'));
      radioButtonEle.isDisplayed().then(function () {
        radioButtonEle.getAttribute('class').then(function (buttonClassName) {
          if (buttonClassName.includes('mat-radio-checked')) {
            console.log('Rule Selected: ' + rule + ' ' + value);
            library.logStepWithScreenshot('Pass: SPC Rules Selected for ' + rule + ' ' + value, ' Rule Selected');
            status = true;
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
        resolve(status);
      });
    });
  }

  clickReturnToDataLink() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      const returnToData = element(by.id(returnToDataLink));
      returnToData.isDisplayed().then(function () {
        library.scrollToElement(returnToData);
        library.clickJS(returnToData);
        dashBoard.waitForElement();
        library.logStep('Return To Data Link clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to click Return To Data Link');
        status = false;
        resolve(status);
      });
    });
  }

  getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2) {
    const newData = new Array(2);
    return new Promise((resolve) => {
      const meanlocator1 = findElement(locatorType.XPATH, meanL1);
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
                  AnalyteSettings.pointLevelString1 = point1;
                  AnalyteSettings.pointLevelString2 = point2;
                  console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
                  console.log('Mean, SD & Point for Level 2: ' + meanInteger2 + ' ' + sdInteger2 + ' ' + AnalyteSettings.pointLevelString2);
                  library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
                    ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
                  library.logStep('Mean, SD & Point for Level 2: ' + meanInteger2 +
                    ' ' + sdInteger2 + ' ' + AnalyteSettings.pointLevelString2);
                  const val1 = meanInteger1 + multiplyL1 * sdInteger1 + addL1;
                  const val2 = meanInteger2 + multiplyL2 * sdInteger2 + addL2;
                  newData[0] = val1.toFixed(2);
                  newData[1] = val2.toFixed(2);
                  console.log('newData[0] ' + newData[0]);
                  console.log('newData[1] ' + newData[1]);
                  library.logStep('newData[0] ' + newData[0]);
                  library.logStep('newData[1] ' + newData[1]);
                  resolve(newData);
                });
              });
            });
          });
        });
      });
    });
  }

  getCalculatedValuesForAllLevelsFromCumulativeValues(multiplyL1, multiplyL2, multiplyL3, addL1, addL2, addL3) {
    const newData = new Array(3);
    return new Promise((resolve) => {
      browser.sleep(10000);
      const meanlocator1 = findElement(locatorType.XPATH, meanL1);
      const meanlocator2 = findElement(locatorType.XPATH, meanL2);
      const meanlocator3 = findElement(locatorType.XPATH, meanL3);
      const sdlocator1 = findElement(locatorType.XPATH, sdL1);
      const sdlocator2 = findElement(locatorType.XPATH, sdL2);
      const sdlocator3 = findElement(locatorType.XPATH, sdL3);
      const pointlocator1 = findElement(locatorType.XPATH, pointL1);
      const pointlocator2 = findElement(locatorType.XPATH, pointL2);
      const pointlocator3 = findElement(locatorType.XPATH, pointL3);
      meanlocator1.getText().then(function (testMean1) {
        meanlocator2.getText().then(function (testMean2) {
          meanlocator3.getText().then(function (testMean3) {
            sdlocator1.getText().then(function (testSd1) {
              sdlocator2.getText().then(function (testSd2) {
                sdlocator3.getText().then(function (testSd3) {
                  pointlocator1.getText().then(function (point1) {
                    pointlocator2.getText().then(function (point2) {
                      pointlocator3.getText().then(function (point3) {
                        const meanInteger1 = parseFloat(testMean1);
                        const meanInteger2 = parseFloat(testMean2);
                        const meanInteger3 = parseFloat(testMean3);
                        const sdInteger1 = parseFloat(testSd1);
                        const sdInteger2 = parseFloat(testSd2);
                        const sdInteger3 = parseFloat(testSd3);
                        AnalyteSettings.pointLevelString1 = point1;
                        AnalyteSettings.pointLevelString2 = point2;
                        AnalyteSettings.pointLevelString3 = point3;
                        console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' '
                          + AnalyteSettings.pointLevelString1);
                        console.log('Mean, SD & Point for Level 2: ' + meanInteger2 + ' ' + sdInteger2 + ' '
                          + AnalyteSettings.pointLevelString2);
                        console.log('Mean, SD & Point for Level 3: ' + meanInteger3 + ' ' + sdInteger3 + ' '
                          + AnalyteSettings.pointLevelString3);
                        library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
                          ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
                        library.logStep('Mean, SD & Point for Level 2: ' + meanInteger2 +
                          ' ' + sdInteger2 + ' ' + AnalyteSettings.pointLevelString2);
                        library.logStep('Mean, SD & Point for Level 3: ' + meanInteger3 +
                          ' ' + sdInteger2 + ' ' + AnalyteSettings.pointLevelString3);
                        const val1 = meanInteger1 + (multiplyL1 * sdInteger1) + addL1;
                        const val2 = meanInteger2 + (multiplyL2 * sdInteger2) + addL2;
                        const val3 = meanInteger3 + (multiplyL3 * sdInteger3) + addL3;
                        newData[0] = val1.toFixed(2);
                        newData[1] = val2.toFixed(2);
                        newData[2] = val3.toFixed(2);
                        console.log('newData[0] ' + newData[0]);
                        console.log('newData[1] ' + newData[1]);
                        console.log('newData[2] ' + newData[2]);
                        library.logStep('newData[0] ' + newData[0]);
                        library.logStep('newData[1] ' + newData[1]);
                        library.logStep('newData[2] ' + newData[2]);
                        resolve(newData);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  isWarningDisplayed(value) {
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const warning = element(by.xpath('.//span[@mattooltip= "Warning"][contains(text(),"' + value + '")][@class="show"]'));
      warning.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', warning);
        const color = element(by.xpath('.//span[@mattooltip= "Warning"][contains(text(),"' + value + '")][@class="show"]/parent::div[contains(@class,"yellow")]'));
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

  isRejectionDisplayed(value) {
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const warning = element(by.xpath('.//span[@mattooltip= "Rejection"][contains(text(),"' + value + '")][@class="show"]'));
      warning.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', warning);
        const color = element(by.xpath('.//span[@mattooltip= "Rejection"][contains(text(),"' + value + '")][@class="show"]/parent::div[contains(@class,"red strike")]'));
        color.isDisplayed().then(function () {
          library.logStepWithScreenshot('The Rejection is shown properly', 'RejectionShown');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        library.logStepWithScreenshot('The Rejection is not shown.', 'RejectionNotShown');
        result = false;
        resolve(result);
      });
    });
  }

  isStrikeThroughShown(value) {
    let result = false;
    return new Promise((resolve) => {
      const strike = element(by.xpath('.//span[contains(text(),"' + value + '")]/parent::div[contains(@class,"strike")]'));
      strike.isDisplayed().then(function () {
        library.logStep('The Strike Through is Displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('The Strike Through is not Displayed');
        result = false;
        resolve(result);
      });
    });
  }

  comparePointValue() {
    let result = false;
    let newPointl1, newPointl2, newPointl3;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const pointl1 = findElement(locatorType.XPATH, pointL1);
      const pointl2 = findElement(locatorType.XPATH, pointL2);
      const pointl3 = findElement(locatorType.XPATH, pointL3);
      pointl1.getText().then(function (point1) {
        pointl2.getText().then(function (point2) {
          pointl3.getText().then(function (point3) {
            newPointl1 = point1;
            newPointl2 = point2;
            newPointl3 = point3;
            if (AnalyteSettings.pointLevelString1 !== newPointl1 && AnalyteSettings.pointLevelString2 !== newPointl2 &&
              AnalyteSettings.pointLevelString3 !== newPointl3) {
              library.logStepWithScreenshot('Point Value is updated for all 3 levels', 'PointValueUpdated');
              console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1 + ' '
                + AnalyteSettings.pointLevelString2 + ' ' + newPointl2);
              result = true;
              resolve(result);
            } else {
              console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1 + ' '
                + AnalyteSettings.pointLevelString2 + ' ' + newPointl2 + ' ' + AnalyteSettings.pointLevelString3 + ' ' + newPointl3);
              library.logFailStep('Point Value is not updated for all 3 levels');
              result = false;
              resolve(result);
            }
          });
        }).catch(function () {
          library.logFailStep('Could not validate Point Value for all 3 levels');
          result = false;
          resolve(result);
        });
      });
    });
  }

  comparePointValues() {
    let result = false;
    let newPointl1, newPointl2;
    return new Promise((resolve) => {
      const pointl1 = element(by.xpath(pointL1));
      const pointl2 = element(by.xpath(pointL2));
      pointl1.getText().then(function (point1) {
        pointl2.getText().then(function (point2) {
          newPointl1 = point1;
          newPointl2 = point2;
          console.log('newPointl1= ' + AnalyteSettings.pointLevelString1 + 'newPointl2= ' + AnalyteSettings.pointLevelString2)
          if (AnalyteSettings.pointLevelString1 !== newPointl1 && AnalyteSettings.pointLevelString2 !== newPointl2) {
            library.logStepWithScreenshot('Point Value is updated for both the levels', 'PointValueUpdated');
            console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1 + ' ' + AnalyteSettings.pointLevelString2 + ' ' + newPointl2);
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
  /*
    comparePointValue() {
      let result = false;
      let newPointl1;
      return new Promise((resolve) => {
        dashBoard.waitForPage();
        const pointl1 = element(by.xpath(pointL1));
        pointl1.getText().then(function (point1) {
          newPointl1 = point1;
          if (AnalyteSettings.pointLevelString1 !== newPointl1) {
            library.logStepWithScreenshot('Point Value is updated for  the level', 'PointValueUpdated');
            console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1 + ' ' + AnalyteSettings.pointLevelString2 + ' ' + newPointl2);
            result = true;
            resolve(result);
          } else {
            library.logFailStep('Point Value is not updated for  the level');
            result = false;
            resolve(result);
          }
        }).catch(function () {
          library.logFailStep('Could not validate Point Value for  the level');
          result = false;
          resolve(result);
        });
      });
    }*/

  compareReason(value, expectedReason) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(2000);
      const reasonElement = element(by.xpath('.//span[contains(text(),"' + value + '")]' +
        '/ancestor::td/following-sibling::td[2]//div'));
      reasonElement.getText().then(function (actualReason) {
        console.log(actualReason + ' actual and expected ' + expectedReason);
        if (actualReason.includes(expectedReason)) {
          library.logStepWithScreenshot('Correct reason is displayed', 'ReasonDisplayed');
          console.log(actualReason + ' ' + expectedReason);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Incorrect reason is displayed');
          result = false;
          resolve(result);
        }
      }).catch(function () {
        library.logFailStep('Unable to verify the reason');
        result = false;
        resolve(result);
      });
    });
  }

  verifyRejectFromControlLevel(value) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const reject = element(by.xpath('.//div[contains(text(),"' + value + '")]'));
      reject.isDisplayed().then(function () {
        reject.getAttribute('class').then(function (text) {
          if (text.includes('red strike')) {
            library.logStepWithScreenshot('The Rejection is shown properly', 'Shown');
          }
        });
      }).catch(function () {
        library.logFailStep('The Rejection is not shown properly');
        result = false;
        resolve(result);
      });
    });
  }

  verifyWarningFromControlLevel(value, verifyStrike) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const reject = element(by.xpath('.//div[contains(text(),"' + value + '")]'));
      reject.isDisplayed().then(function () {
        reject.getAttribute('class').then(function (text) {
          if (verifyStrike === true) {
            if (text.includes('yellow strike')) {
              library.logStepWithScreenshot('The Warning is shown along with strikethrough', 'WarnStrikeShown');
              result = true;
              resolve(result);
            } else {
              result = false;
              resolve(result);
            }
          } else {
            if (text.includes('yellow')) {
              library.logStepWithScreenshot('The Warning is shown', 'WarnShown');
              result = true;
              resolve(result);
            } else {
              result = false;
              resolve(result);
            }
          }
        });
      }).catch(function () {
        library.logFailStep('The Warning is not shown properly');
        result = false;
        resolve(result);
      });
    });
  }

  verifyAnalyteSettingsPage(analyteName) {
    browser.ignoreSynchronization = true;
    let header, dataEntry, chkboxes, decimal, reagent, calibrator, methodUnit, buttons, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const headerLabel = element(by.xpath(headerTitle));
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsLabel = element(by.xpath(levelsInUseLabel));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));
      const reagentMfDD = element(by.xpath(reagentManufacturerDropdown));
      const reagentDD = element(by.xpath(reagentDropdown));
      const reagentLotDD = element(by.xpath(reagentLotDropdown));
      const calibratorMfDD = element(by.xpath(calibratorManufacturerDropdown));
      const calibratorDD = element(by.xpath(calibratorDropdown));
      const calibratorLotDD = element(by.xpath(calibratorLotDropdown));
      const methodDD = element(by.xpath(methodDropdown));
      const unitDD = element(by.xpath(unitDropdown));
      const cancelBtn = element(by.xpath(cancelButton));
      const updateBtn = element(by.xpath(updateButton));
      headerLabel.isDisplayed().then(function () {
        headerLabel.getText().then(function (text) {
          console.log(text);
          if (text.includes(analyteName)) {
            library.logStep('Edit Analyte Page Header is displayed.');
            header = true;
          }
        });
      });
      if (dataEntryLabel.isDisplayed() && dataEntryToggle.isDisplayed()) {
        library.logStep('Summary Data Entry Toggle button is displayed.');
        dataEntry = true;
      }
      levelsLabel.isDisplayed().then(function () {
        levelsCheckboxes.count().then(function (count) {
          if (count === 2) {
            library.logStep('Levels in Use, 2 checkboxes are displayed.');
            chkboxes = true;
          }
        });
      });
      if (decimalLabel.isDisplayed() && decimalDD.isDisplayed()) {
        library.logStep('Decimal Places dropdown is displayed.');
        decimal = true;
      }
      if (reagentMfDD.isDisplayed() && reagentDD.isDisplayed() && reagentLotDD.isDisplayed()) {
        library.logStep('Reagent Manufacturer, Reagnet & Reagent Lot doprdowns are displayed.');
        reagent = true;
      }
      if (calibratorMfDD.isDisplayed() && calibratorDD.isDisplayed() && calibratorLotDD.isDisplayed()) {
        library.logStep('Calibrator Manufacturer, Calibrator & Calibrator Lot doprdowns are displayed.');
        calibrator = true;
      }
      if (methodDD.isDisplayed() && unitDD.isDisplayed()) {
        library.logStep('Method & Unit of measure doprdowns are displayed.');
        methodUnit = true;
      }
      if (cancelBtn.isDisplayed() && updateBtn.isDisplayed()) {
        library.logStep('Delete, Cancel & Update buttons are displayed.');
        buttons = true;
      }
      if (dataEntry === true && decimal === true && reagent === true &&
        calibrator === true && methodUnit === true && buttons === true) {
        console.log('dataEntry ' + dataEntry + 'decimal ' + decimal + ' reagent ' + reagent +
          ' calibrator ' + calibrator + ' methodUnit ' + methodUnit + ' buttons ' + buttons);
        library.logStep('Edit Analyte Page is displayed properly.');
        displayed = true;
        resolve(displayed);
      } else {
        console.log(' dataEntry ' + dataEntry + ' decimal ' + decimal + ' reagent ' + reagent +
          ' calibrator ' + calibrator + ' methodUnit ' + methodUnit + ' buttons ' + buttons);
        displayed = false;
        resolve(displayed);
      }
    });
  }

  isSummaryEnabled() {
    browser.ignoreSynchronization = true;
    let summaryEnabled = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const dataEntryToggle = element(by.xpath(summaryRadioButton));
      dataEntryToggle.isDisplayed().then(function () {
        dataEntryToggle.getAttribute('class').then(function (text) {
          if (text.includes('checked')) {
            library.logStepWithScreenshot('Summary Toggle Button is enabled', 'SummaryEnabled');
            summaryEnabled = true;
            resolve(summaryEnabled);
          } else {
            summaryEnabled = false;
            resolve(summaryEnabled);
          }
        });
      });
    });
  }

  clickSummaryToggleButton() {
    browser.ignoreSynchronization = true;
    let summaryDisabled = false;
    return new Promise((resolve) => {
      //  browser.sleep(8000);
      //  const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const dataEntryToggle = findElement(locatorType.XPATH, summaryDataEntryToggle);
      dataEntryToggle.isDisplayed().then(function () {
        library.clickAction(dataEntryToggle);
        summaryDisabled = true;
        resolve(summaryDisabled);
      });
    });
  }

  verifySPCRulesComponentDisplayed() {
    browser.ignoreSynchronization = true;
    let spcComponent = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const spcRulesComp = element(by.xpath(spcRulesComponent));
      spcRulesComp.isDisplayed().then(function () {
        spcComponent = true;
        resolve(spcComponent);
      }).catch(function () {
        spcComponent = false;
        resolve(spcComponent);
      });
    });
  }

  clickCancelButton() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const cancelBtn = element(by.xpath(cancelButton));
      cancelBtn.isDisplayed().then(function () {
        // library.scrollToElement(cancelBtn);
        browser.executeScript('arguments[0].scrollIntoView();', cancelBtn);
        library.clickJS(cancelBtn);
        library.logStep('Cancel Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to click Cancel Button');
        status = false;
        resolve(status);
      });
    });
  }

  clickDeleteAnalyteButton() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const deleteBtn = element(by.xpath(deleteButton));
      deleteBtn.isDisplayed().then(function () {
        library.scrollToElement(deleteBtn);
        library.clickJS(deleteBtn);
        library.logStep('Delete Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to click Delete Button');
        status = false;
        resolve(status);
      });
    });
  }

  clickConfirmDeleteButton() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const deleteBtn = element(by.xpath(confirmDeleteDialogConfirmDeleteButton));
      deleteBtn.isDisplayed().then(function () {
        library.scrollToElement(deleteBtn);
        library.clickJS(deleteBtn);
        library.logStep('Confirm Delete Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to click Confirm Delete Button');
        status = false;
        resolve(status);
      });
    });
  }

  clickConfirmDeleteDialogCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const cancelBtn = element(by.xpath(confirmDeleteDialogCancelButton));
      cancelBtn.isDisplayed().then(function () {
        library.scrollToElement(cancelBtn);
        library.clickJS(cancelBtn);
        library.logStep('Confirm Dialog Cancel Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to click Confirm Dialog Cancel Button');
        status = false;
        resolve(status);
      });
    });
  }

  verifyAnalyteNotDeleted(analyteName) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const headerLabel = element(by.xpath(headerTitle));
      headerLabel.isDisplayed().then(function () {
        library.scrollToElement(headerLabel);
        headerLabel.getText().then(function (text) {
          if (text.includes(analyteName)) {
            status = true;
            library.logStepWithScreenshot('Analyte not deleted', 'notDeleted');
            resolve(status);
          } else {
            status = false;
            library.logFailStep('Analyte is deleted');
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Unable to verify if the Analyte is deleted');
        status = false;
        resolve(status);
      });
    });
  }

  verifySummaryToggleDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const toggleButton = element(by.xpath(summaryDataEntryToggle));
      toggleButton.isDisplayed().then(function () {
        toggleButton.getAttribute('class').then(function (text) {
          if (text.includes('disabled')) {
            library.logStepWithScreenshot('Summary Toggle is Disabled', 'Disabled');
            status = true;
            resolve(status);
          } else {
            library.logFailStep('Summary Toggle is not Disabled');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Unable to verify if the Summary Toggle is Disabled');
        status = false;
        resolve(status);
      });
    });
  }

  verifyConfirmDeleteDialog() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const dialog = element(by.xpath(confirmDeleteDialog));
      const message = element(by.xpath(confirmDeleteText));
      const deleteBtn = element(by.xpath(confirmDeleteDialogConfirmDeleteButton));
      const cancelBtn = element(by.xpath(confirmDeleteDialogCancelButton));
      dialog.isDisplayed().then(function () {
        message.isDisplayed().then(function () {
          library.logStep('Delete Confirmation Message is displayed');
          deleteBtn.isDisplayed().then(function () {
            library.logStep('Delete Button is displayed');
            cancelBtn.isDisplayed().then(function () {
              library.logStep('Cancel Button is displayed');
              library.logStepWithScreenshot('Delete Confirmation Dialog is displayed', 'DialogDisplayed');
              status = true;
              resolve(status);
            });
          });
        });
      }).catch(function () {
        library.logFailStep('Unable to verify Confirm Delete Dialog UI');
        status = false;
        resolve(status);
      });
    });
  }

  verifyAnalyteDeleted(deletedAnalyte) {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      const analytes = element.all(by.xpath(leftNavigationAnalytes));
      analytes.count().then(function (num) {
        for (let i = 0; i < num; i++) {
          analytes[i].getText().then(function (text) {
            console.log('Analyte Name ' + text);
            library.logStep('Analyte Displayed ' + text);
            if (text !== deletedAnalyte) {
              status = true;
              resolve(status);
            } else {
              status = false;
              resolve(status);
            }
          });
        }
      });
    });
  }

  verifyReagentManufacturerDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const reagentManufacturer = element(by.xpath(reagentManufacturerDropdown));
      reagentManufacturer.isDisplayed().then(function () {
        library.logStepWithScreenshot('Reagent Manufacturer Dropdown is Disabled', 'RMDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Reagent Manufacturer Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifyCalibratorManufacturerDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const calibratorManufacturer = element(by.xpath(calibratorManufacturerDropdown));
      calibratorManufacturer.isDisplayed().then(function () {
        library.logStepWithScreenshot('Calibrator Manufacturer Dropdown is Disabled', 'CMDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Calibrator Manufacturer Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifyCalibratorDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const calibrator = element(by.xpath(calibratorDropdown));
      library.scrollToElement(calibrator);
      calibrator.isDisplayed().then(function () {
        library.logStepWithScreenshot('Calibrator Dropdown is Disabled', 'CMDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Calibrator Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifyMethodDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const method = element(by.xpath(methodDropdown));
      library.scrollToElement(method);
      method.isDisplayed().then(function () {
        library.logStepWithScreenshot('Method Dropdown is Disabled', 'MDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Method Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifyReagentLotDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const reagentLot = element(by.xpath(reagentLotDropdown));
      reagentLot.isDisplayed().then(function () {
        library.logStepWithScreenshot('Reagent Lot Dropdown is Disabled', 'RLDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Reagent Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifyCalibratorLotDisabled() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const calibratorLot = element(by.xpath(calibratorLotDropdown));
      library.scrollToElement(calibratorLot);
      calibratorLot.isDisplayed().then(function () {
        library.logStepWithScreenshot('Calibrator Lot Dropdown is Disabled', 'CLDisabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Calibrator Dropdown is not verified');
        status = false;
        resolve(status);
      });
    });
  }

  verifySortingSelectAnotherReagent() {
    browser.ignoreSynchronization = true;
    let status: string;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const ddArrow = element(by.xpath(reagentDDArrow));
      browser.executeScript('arguments[0].scrollIntoView();', ddArrow);
      ddArrow.isPresent().then(function () {
        // library.scrollToElement(ddArrow);
        library.clickJS(ddArrow);
        console.log('Reagent dropdown arrow clicked');
        library.logStep('Reagent dropdown arrow clicked');
        browser.sleep(5000);
        const selectedReagent = element(by.xpath('.//mat-option[@aria-selected="true"]'));
        selectedReagent.isDisplayed().then(function () {
          selectedReagent.getText().then(function (text) {
            console.log('Reagent Already Selected ' + text);
            library.logStep('Reagent Already Selected ' + text);
          });
        }).then(function () {
          // const notSelectedReagent = element(by.xpath('.//mat-option[@aria-selected="false"]'));
          const notSelectedReagent = element(by.xpath('.//mat-option[@aria-disabled="false"]'));
          notSelectedReagent.isDisplayed().then(function () {
            notSelectedReagent.getText().then(function (newNext) {
              console.log('New Reagent Selected ' + newNext);
              library.logStep('New Reagent Selected ' + newNext);
              library.clickJS(notSelectedReagent);
              status = newNext;
              resolve(status);
            });
          });
        });
      }).catch(function () {
        console.log('Could not select another reagent');
        library.logFailStep('Could not select another reagent');
        status = '';
        resolve(status);
      });
    });
  }

  verifySelectedReagent(val) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const reagent = element(by.xpath(reagentValue));
      library.scrollToElement(reagent);
      reagent.isDisplayed().then(function () {
        browser.sleep(2000);
        reagent.getText().then(function (txt) {
          const text = txt.trim();
          const value = val.trim();
          console.log('Expected Value is: ' + value + ' Actual: ' + text);
          if (text.includes(value)) {
            console.log('The Selected Reagent is displayed');
            console.log('The Selected Reagent is displayed');
            library.logStepWithScreenshot('The Selected Reagent is displayed', 'ReagentDisplayed');
            status = true;
            resolve(status);
          } else {
            console.log('The Selected Reagent is not displayed');
            library.logStepWithScreenshot('The Selected Reagent is not displayed', 'ReagentNotDisplayed');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        console.log('Could not verify the Selected Reagent Value');
        library.logFailStep('Could not verify the Selected Reagent Value');
        status = false;
        resolve(status);
      });
    });
  }

  verifySortingSelectAnotherUnit() {
    browser.ignoreSynchronization = true;
    let status: string;
    return new Promise((resolve) => {
      const ddArrow = element(by.xpath(unitDDArrow));
      browser.executeScript('arguments[0].scrollIntoView();', ddArrow);
      ddArrow.isDisplayed().then(function () {
        library.clickJS(ddArrow);
        console.log('Unit of Measure dropdown arrow clicked');
        library.logStep('Unit of Measure dropdown arrow clicked');
        browser.sleep(5000);
        const selectedUnit = element(by.xpath('.//mat-option[@aria-selected="true"]'));
        selectedUnit.isDisplayed().then(function () {
          selectedUnit.getText().then(function (text) {
            console.log('Unit of Measure Selected ' + text);
            library.logStep('Unit of Measure Selected ' + text);
          });
        }).then(function () {
          const notSelectedUnit = element(by.xpath('.//mat-option[not(contains(@aria-selected,"true"))]'));
          notSelectedUnit.isDisplayed().then(function () {
            notSelectedUnit.getText().then(function (newNext) {
              console.log('New Unit of Measure Selected ' + newNext);
              library.logStep('New Unit of Measure Selected ' + newNext);
              status = newNext;
              console.log('methodreturning unit: ' + status);
              library.clickJS(notSelectedUnit);
              resolve(status);
            });
          });
        });
      }).catch(function () {
        console.log('Could not select another unit');
        library.logFailStep('Could not select another unit');
        status = '';
        resolve(status);
      });
    });
  }


  verifySelectedUnit(val) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const unit = element(by.xpath(unitOfMeasureValue));
      unit.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', unit);
        unit.getText().then(function (txt) {
          const text = txt.trim();
          const value = val.trim();
          console.log('Expected: ' + value + ' Actual: ' + text);
          if (text === value) {
            console.log('The Selected Unit of measure is displayed');
            library.logStepWithScreenshot('The Selected Unit of measure is displayed', 'UnitDisplayed');
            status = true;
            resolve(status);
          } else {
            console.log('The Selected Unit of measure is not displayed');
            library.logStepWithScreenshot('The Selected Unit of measure is not displayed', 'UnitNotDisplayed');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        console.log('Could not verify the Selected Unit of measure Value');
        library.logFailStep('Could not verify the Selected Unit of measure Value');
        status = false;
        resolve(status);
      });
    });
  }

  verifySortingSelectAnotherDecimal() {
    browser.ignoreSynchronization = true;
    let status: string;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const ddArrow = element(by.xpath(decimalPlacesDDArrow));
      ddArrow.isDisplayed().then(function () {
        library.scrollToElement(ddArrow);
        library.clickJS(ddArrow);
        console.log('Decimal Value dropdown arrow clicked');
        library.logStep('Decimal Value dropdown arrow clicked');
        browser.sleep(5000);
        const selectedDecimal = element(by.xpath('.//mat-option[@aria-selected="true"]'));
        selectedDecimal.isDisplayed().then(function () {
          selectedDecimal.getText().then(function (text) {
            console.log('Decimal Value Already Selected ' + text);
            library.logStep('Decimal Value Already Selected ' + text);
          });
        }).then(function () {
          const notSelectedDecimal = element(by.xpath('.//mat-option[@aria-selected="false"]'));
          notSelectedDecimal.isDisplayed().then(function () {
            notSelectedDecimal.getText().then(function (newNext) {
              console.log('New Decimal Value Selected ' + newNext);
              library.logStep('New Decimal Value Selected ' + newNext);
              status = newNext;
              library.clickJS(notSelectedDecimal);
              resolve(status);
            });
          });
        });
      }).catch(function () {
        console.log('Could not select another Decimal Value');
        library.logFailStep('Could not select another Decimal Value');
        status = '';
        resolve(status);
      });
    });
  }

  verifySelectedDecimal(val) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const decimal = element(by.xpath(decimalValue));
      decimal.isDisplayed().then(function () {
        library.scrollToElement(decimal);
        decimal.getText().then(function (txt) {
          const text = +txt.trim();
          const value = +val.trim();
          console.log('Expected: ' + value + ' Actual: ' + text);
          if (text === value) {
            console.log('The Selected Decimal Value is displayed');
            library.logStepWithScreenshot('The Selected Decimal Value is displayed', 'DecimalDisplayed');
            status = true;
            resolve(status);
          } else {
            console.log('The Selected Decimal Value is not displayed');
            library.logStepWithScreenshot('The Selected Decimal Value is not displayed', 'DecimalNotDisplayed');
            status = false;
            resolve(status);
          }
        });
      });
    });
  }


  uncheckLevel2Checkbox() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const level2 = findElement(locatorType.XPATH, level2Checkbox);
      level2.getAttribute('class').then(function (txt) {
        const cls = txt;
        if (cls.includes('checked')) {
          library.click(level2);
          console.log('Level 2 unchecked');
          library.logStepWithScreenshot('Level 2 unchecked', 'Level2Clicked');
          status = true;
          resolve(status);
        } else {
          console.log('Level 2 is already unchecked');
          library.logStepWithScreenshot('Level 2 is already unchecked', 'Level2unchecked');
          status = true;
          resolve(status);
        }
      }).catch(function () {
        console.log('Unable to click Level 2 checkbox.');
        library.logFailStep('Unable to click Level 2 checkbox.');
        status = false;
        resolve(status);
      });
    });
  }

  checkLevel2Checkbox() {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const level2 = element(by.xpath(level2Checkbox));
      level2.getAttribute('class').then(function (txt) {
        const cls = txt;
        if (cls.includes('checked')) {
          console.log('Level 2 is already checked');
          library.logStepWithScreenshot('Level 2 is already checked', 'Level2alreadyChecked');
          status = true;
          resolve(status);
        } else {
          library.click(level2);
          console.log('Level 2 is checked');
          library.logStepWithScreenshot('Level 2 is checked', 'Level2checked');
          status = true;
          resolve(status);
        }
      }).catch(function () {
        console.log('Unable to click Level 2 checkbox.');
        library.logFailStep('Unable to click Level 2 checkbox.');
        status = false;
        resolve(status);
      });
    });
  }

  verifyLevel2NotDisplayed() {
    let status, flag1, flag2 = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const level1 = element(by.xpath('(.//th/span[contains(text(), "Level")])[1]'));
      const level2 = element(by.xpath('(.//th/span[contains(text(), "Level")])[2]'));
      level1.isDisplayed().then(function () {
        level1.getText().then(function (txt) {
          if (txt === 'Level 1') {
            flag1 = true;
            console.log('Level 1 Displayed');
            library.logStep('Level 1 Displayed');
          }
        });
      }).then(function () {
        level2.isDisplayed().then(function () {
          level2.getText().then(function (txt) {
            if (txt === 'Level 2') {
              flag2 = false;
              console.log('Level 2 Displayed');
              library.logStep('Level 2 Displayed');
            }
          });
        }).catch(function () {
          flag2 = true;
          console.log('Level 2 not Displayed');
          library.logStep('Level 2 not Displayed');
        });
      }).then(function () {
        if (flag1 && flag2 === true) {
          console.log('Only Level 1 Displayed');
          library.logStep('Only Level 1 Displayed');
          status = true;
          resolve(status);
        }
      });
    });
  }
  selectKxRule(rule, value) {
    browser.ignoreSynchronization = true;
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const kxRuleDD = element(By.xpath(kxRuleDropdown));
      library.scrollToElement(kxRuleDD);
      kxRuleDD.click();
      const digit: string = rule.replace('x', '');
      console.log('Rule Digit' + digit);
      const DDOption = findElement(locatorType.XPATH, './/mat-option/span[contains(text(),"' + digit + '")]');
      DDOption.click();
      library.logStep('Rule ' + rule + ' is selected');
      const valueRadioButton = findElement(locatorType.XPATH, '(.//span[contains(text(),"x")])/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"' + value + '")]');
      valueRadioButton.click();
      library.logStepWithScreenshot('Rule value ' + value + ' is set', 'RuleValueSet');
    }).catch(function () {
      library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
      status = false;
    });
  }

  comparePointValueLevel1() {
    let result = false;
    let newPointl1;
    return new Promise((resolve) => {
      const pointl1 = element(by.xpath(pointL1));
      pointl1.getText().then(function (point1) {
        newPointl1 = point1;
        if (AnalyteSettings.pointLevelString1 !== newPointl1) {
          library.logStepWithScreenshot('Point Value is updated for level 1', 'PointValueUpdated');
          console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Point Value is not updated for level 1');
          result = false;
          resolve(result);
        }
      }).catch(function () {
        library.logFailStep('Could not validate Point Value level 1');
        result = false;
        resolve(result);
      });
    });
  }
  /*
    selectKxRule(rule, value) {
      browser.ignoreSynchronization = true;
      let status = false;
      return new Promise((resolve) => {
        dashBoard.waitForPage();
        // const kxRuleDD = findElement(locatorType.XPATH, kxRuleDropdown);
        const kxRuleDD = element(By.xpath(kxRuleDropdown));
        library.scrollToElement(kxRuleDD);
        kxRuleDD.click();
        const digit: string = rule.charAt(0);
        const DDOption = findElement(locatorType.XPATH, './/mat-option/span[contains(text(),"' + digit + '")]');
        DDOption.click();
        library.logStep('Rule ' + rule + ' is selected');
        const valueRadioButton = findElement(locatorType.XPATH,
          '(.//span[contains(text(),"x")])/parent::span/parent::div/parent::td/following-sibling::td/mat-radio-group//mat-radio-button[contains(@class,"' + value + '")]');
        valueRadioButton.click();
        library.logStepWithScreenshot('Rule value ' + value + ' is set', 'RuleValueSet');
      }).catch(function () {
        library.logFailStep('Fail: SPC Rules Failed to select for ' + rule + ' ' + value);
        status = false;
      });
    }

    comparePointValueLevel1() {
      let result = false;
      let newPointl1;
      return new Promise((resolve) => {
        dashBoard.waitForPage();
        const pointl1 = element(by.xpath(pointL1));
        pointl1.getText().then(function (point1) {
          newPointl1 = point1;
          if (AnalyteSettings.pointLevelString1 !== newPointl1) {
            library.logStepWithScreenshot('Point Value is updated for level 1', 'PointValueUpdated');
            console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1);
            result = true;
            resolve(result);
          } else {
            library.logFailStep('Point Value is not updated for level 1');
            result = false;
            resolve(result);
          }
        }).catch(function () {
          library.logFailStep('Could not validate Point Value level 1');
          result = false;
          resolve(result);
        });
      });
    }*/

  clickDontSeeReagentLink() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const requestReagentLink = element(by.xpath(dontSeeYourReagentLink));
      requestReagentLink.isDisplayed().then(function () {
        library.scrollToElement(requestReagentLink);
        library.clickJS(requestReagentLink);
        console.log('Don\'t see your reagent link clicked');
        library.logStep('Don\'t see your reagent link clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Don\'t see your reagent link is not visible');
        library.logStep('Don\'t see your reagent link is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  clickDontSeeReagentLotLink() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const requestReagentLotLink = element(by.xpath(dontSeeYourReagentLotLink));
      requestReagentLotLink.isDisplayed().then(function () {
        library.scrollToElement(requestReagentLotLink);
        library.clickJS(requestReagentLotLink);
        console.log('Don\'t see your reagent lot link clicked');
        library.logStep('Don\'t see your reagent lot link clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Don\'t see your reagent lot link is not visible');
        library.logStep('Don\'t see your reagent lot link is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  clickDontSeeCalibratorLink() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const requestCalibratorLink = element(by.xpath(dontSeeYourCalibratorLink));
      requestCalibratorLink.isDisplayed().then(function () {
        library.scrollToElement(requestCalibratorLink);
        library.clickJS(requestCalibratorLink);
        console.log('Don\'t see your Calibrator link clicked');
        library.logStep('Don\'t see your Calibrator link clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Don\'t see your Calibrator link is not visible');
        library.logStep('Don\'t see your Calibrator link is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  clickDontSeeCalibratorLotLink() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const requestCalibratorLotLink = element(by.xpath(dontSeeYourCalibratorLotLink));
      requestCalibratorLotLink.isDisplayed().then(function () {
        library.scrollToElement(requestCalibratorLotLink);
        library.clickJS(requestCalibratorLotLink);
        console.log('Don\'t see your Calibrator lot link clicked');
        library.logStep('Don\'t see your Calibrator lot link clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Don\'t see your Calibrator lot link is not visible');
        library.logStep('Don\'t see your Calibrator lot link is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  clickSendInformation() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const sendInformationBtn = element(by.xpath(sendInformationButton));
      sendInformationBtn.isDisplayed().then(function () {
        sendInformationBtn.click();
        dashBoard.waitForElement();
        console.log('Send Information clicked');
        library.logStep('Send Information clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Send Information not visible');
        library.logStep('Send Information not visible');
        status = false;
        resolve(status);
      });
    });
  }

  clickClosePopup() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const closePopup = element(by.xpath(closePopupButton));
      closePopup.isDisplayed().then(function () {
        closePopup.click();
        console.log('close Popup clicked');
        library.logStep('close Popup clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('close Popup not visible');
        library.logStep('close Popup not visible');
        status = false;
        resolve(status);
      });
    });
  }

  VerifyRequestNRRLCCLPopupUI(option) {
    let status = false;
    let count = 0;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const header = './/h5[contains(text(),"Set up a new")][contains(text(),"' + option + '")]';
      const pageUI = new Map<string, string>();
      pageUI.set(header, 'Request new ' + option + ' header');
      // pageUI.set(info, 'Request new ' + option + ' info');
      pageUI.set(fileUploadIcon, 'File upload icon ');
      pageUI.set(fileUploadMessage, 'File upload message');
      pageUI.set(popupCancelButton, 'Cancel Button');
      pageUI.set(sendInformationButtonDisabled, 'Send Information Disabled Button');
      pageUI.set(closePopupButton, 'Close Button');
      const overlay = element(by.xpath(popup));
      overlay.isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          status = true;
          library.logStepWithScreenshot('Request new ' + option + ' UI is displayed properly', 'UIVerification');
          resolve(status);
        } else {
          status = false;
          library.logFailStep('Request new ' + option + ' UI is not displayed properly');
          resolve(status);
        }
      });
    });
  }

  verifyIncorrectFileTypeError() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const incorrectFileTypeErrorMsg = element(by.xpath(incorrectFileTypeError));
      incorrectFileTypeErrorMsg.isDisplayed().then(function () {
        console.log('Incorrect FileType Error Msg is displayed');
        library.logStepWithScreenshot('Incorrect FileType Error Msg is displayed', 'errorMsg');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Incorrect FileType Error Msg is not visible');
        library.logFailStep('Incorrect FileType Error Msg is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  verifyIncorrectFileSizeError() {
    let status = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const incorrectFileSizeErrorMsg = element(by.xpath(incorrectFileSizeError));
      incorrectFileSizeErrorMsg.isDisplayed().then(function () {
        console.log('Incorrect File Size Error Msg is displayed');
        library.logStepWithScreenshot('Incorrect File Size Error Msg is displayed', 'errorMsg');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Incorrect File Size Error Msg is not visible');
        library.logFailStep('Incorrect File Size Error Msg is not visible');
        status = false;
        resolve(status);
      });
    });
  }

  isZscoreDisplayed(value) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(2000);
      const ZscoreElement = element(by.xpath('.//span[contains(text(),"' + value + '")]' +
        '/ancestor::td/following-sibling::td[1]//div'));
      ZscoreElement.isDisplayed().then(function () {
        library.logStepWithScreenshot('Z score is displayed for ' + value, ' Zscore ' + value);
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Z score is not displayed for ' + value, ' NoZscore ' + value);
        resolve(false);
      });
    });
  }

  getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1, addL1) {
    const newData = new Array(2);
    return new Promise((resolve) => {
      const meanlocator1 = findElement(locatorType.XPATH, meanL1);
      const sdlocator1 = findElement(locatorType.XPATH, sdL1);
      const pointlocator1 = findElement(locatorType.XPATH, pointL1);
      meanlocator1.getText().then(function (testMean1) {
        sdlocator1.getText().then(function (testSd1) {
          pointlocator1.getText().then(function (point1) {
            const meanInteger1 = parseFloat(testMean1);
            const sdInteger1 = parseFloat(testSd1);
            AnalyteSettings.pointLevelString1 = point1;
            console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
            library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
              ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
            const val1 = meanInteger1 + multiplyL1 * sdInteger1 + addL1;
            newData[0] = val1.toFixed(2);
            console.log('newData[0] ' + newData[0]);
            library.logStep('newData[0] ' + newData[0]);
            resolve(newData);
          });
        });
      });
    });
  }

  comparePointValueNotUpdatedLevel1() {
    let result = false;
    let newPointl1;
    return new Promise((resolve) => {
      const pointl1 = findElement(locatorType.XPATH, pointL1);
      pointl1.getText().then(function (point1) {
        newPointl1 = point1;
        if (AnalyteSettings.pointLevelString1 == newPointl1) {
          library.logStepWithScreenshot('Point Value is NOT updated for level 1', 'PointValueUpdate');
          console.log(AnalyteSettings.pointLevelString1 + ' ' + newPointl1);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Point Value is updated for level 1');
          result = false;
          resolve(result);
        }
      }).catch(function () {
        library.logFailStep('Could not validate Point Value level 1');
        result = false;
        resolve(result);
      });
    });
  }

  getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1) {
    const newData = new Array(2);
    return new Promise((resolve) => {
      const meanlocator1 = findElement(locatorType.XPATH, meanL1);
      const sdlocator1 = findElement(locatorType.XPATH, sdL1);
      const pointlocator1 = findElement(locatorType.XPATH, pointL1);
      meanlocator1.getText().then(function (testMean1) {
        sdlocator1.getText().then(function (testSd1) {
          pointlocator1.getText().then(function (point1) {
            const meanInteger1 = parseFloat(testMean1);
            const sdInteger1 = parseFloat(testSd1);
            AnalyteSettings.pointLevelString1 = point1;
            console.log('Mean, SD & Point for Level 1: ' + meanInteger1 + ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
            library.logStep('Mean, SD & Point for Level 1: ' + meanInteger1 +
              ' ' + sdInteger1 + ' ' + AnalyteSettings.pointLevelString1);
            const val1 = meanInteger1 + multiplyL1 * sdInteger1 + addL1;
            newData[0] = val1.toFixed(2);
            console.log('newData[0] ' + newData[0]);
            library.logStep('newData[0] ' + newData[0]);
            resolve(newData);
          });
        });
      });
    });
  }

  verifyValueRejectedAndReasonOnMultiEntryPage(val, rule) {
    let result;
    return new Promise((resolve) => {
      browser.sleep(2000);
      const reasonElement = findElement(locatorType.XPATH, './/div[contains(text(),"' + val + '")]/following-sibling::div[2]');
      reasonElement.getText().then(function (actualReason) {
        console.log(actualReason + ' actual and expected ' + rule);
        if (actualReason.includes(rule)) {
          library.logStepWithScreenshot('Correct reason is displayed', 'ReasonDisplayed');
          console.log(actualReason + ' ' + rule);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Incorrect reason is displayed');
          result = false;
          resolve(result);
        }
      }).catch(function () {
        library.logFailStep('Unable to verify the reason');
        result = false;
        resolve(result);
      });
    });
  }
}

