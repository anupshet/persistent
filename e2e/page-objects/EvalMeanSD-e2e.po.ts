/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Settings.json', (err, data1) => {
  if (err) { throw err; }
  const settings = JSON.parse(data1);
  jsonData = settings;
});

const path = require('path');
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const setValues = '//unext-analyte-entry-component//button/span[contains(text(),"SET VALUES")]';
const evalUpdate = '//unext-evaluation-mean-sd//button/span[contains(text(),"Update")]';
const evalCancel = '//unext-evaluation-mean-sd//button/span[contains(text(),"Cancel")]';
const errormsg = '//span[contains(text(),"You are about to lose changes. Is that OK?")]';
const dontSave = '//Button/span[contains(text(),"EXIT WITHOUT SAVING")]';
const save = '//Button/span[contains(text(),"SAVE AND EXIT")]';
const evalClose = './/button[contains(@class, "close-button")]';
const floatingStatisticsLabel = './/label[text()="Use floating statistics to set new fixed mean and SD"]';
const floatingStatisticsToggle = './/mat-slide-toggle[@id="spec_floatingStatistcs"]';
const floatTypeDropdown = './/mat-select[@formcontrolname="timeFrame"]';
const floatTypeOptions = './/mat-option/span';
const currentValueLabel = './/span[contains(text(),"Current value")]';
const floatPoints = './/input[contains(@formcontrolname, "floatPoint")]';
const enteredFloatPoints = '//input[contains(@formcontrolname, "floatPoint")][@aria-invalid="false"]';
const clickOnFirstEntry = '(//*[@class="run-data-page-set-table"])[2]//tr[3]';
const toggleTrigger = '//*[contains(@class,"toggle-trigger")]//span';
// const restartfloatWithThisRunBtn = '(//*[@name="restartFloatstatistics"])[1]';
const restartfloatWithThisRunBtn = './/mat-slide-toggle[@name="restartFloatstatistics"]';
const submitUpdatesBtn = '//*[text()="SUBMIT UPDATES"]';

const controlSetValues = '//button/span[contains(text(),"SET VALUES")]';

export class EvalMeanSD {
  clickSetValues() {
    return new Promise((resolve) => {
      let flag = false;
      const sideNav = findElement(locatorType.XPATH, setValues);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        flag = true;
        console.log('Set Values Button clicked.');
        library.logStep('Set Values Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        console.log('Set Values Button not displayed.');
        library.logStep('Set Values Button not displayed.');
        resolve(flag);
      });
    });
  }

  enterEvalMeanSdold(dataType, level, mean, sd) {
    return new Promise((resolve) => {
      let flag = false;
      if (dataType === 'Float') {
        const floatradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[2]');
        library.clickJS(floatradio);
        library.logStep('Float radio button selected.');
        flag = true;
      } else {
        const fixedradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[1]');
        library.clickJS(fixedradio);
        library.logStep('Fixed radio button selected.');
        const meanFixed = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field//input');
        meanFixed.sendKeys(mean);
        library.logStep('Fixed mean value entered.');
        const sdFixed = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/ancestor::div[1]/following-sibling::div//mat-form-field//input[@formcontrolname="sd"]');
        meanFixed.sendKeys(sd);
        library.logStep('Fixed sd value entered.');
        flag = true;
      }
      resolve(flag);
    });
  }

  enterEvalMeanSd(level, mean, sd, cv) {
    let flag, meanflag, sdflag = false;
    return new Promise((resolve) => {
      const meanFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFixed")]');
      const sdFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFixed")]');
      const meanInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-form-field//input');
      const sdInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "sd")]');
      const cvInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]');
      const cvLabel = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]/parent::div/parent::div/following-sibling::div[contains(@class, "underline")]');
      browser.executeScript('arguments[0].scrollIntoView();', meanFixed);
      meanFixed.isDisplayed().then(function () {
        meanFixed.getAttribute('class').then(function (classval) {
          if (classval.includes('checked')) {
            browser.executeScript('arguments[0].scrollIntoView();', meanInput);
            meanInput.sendKeys(mean);
            console.log('Mean value added: ' + mean);
            library.logStep('Mean value added: ' + mean);
            meanflag = true;
          } else {
            console.log('Mean is float');
            library.logStep('Mean is float');
            meanflag = true;
          }
        });
      }).then(function () {
        sdFixed.getAttribute('class').then(function (className) {
          if (className.includes('checked')) {
            if (sd > 0) {
              browser.executeScript('arguments[0].scrollIntoView();', sdInput);
              sdInput.sendKeys(sd);
              console.log('SD value added: ' + sd);
              library.logStep('SD value added: ' + sd);
              sdflag = true;
            } else if (cv > 0) {
              browser.executeScript('arguments[0].scrollIntoView();', sdInput);
              library.clickJS(cvLabel);
              console.log('CV label clicked');
              cvInput.clear().then(function () {
                cvInput.sendKeys(cv);
                console.log('CV value added: ' + cv);
                library.logStep('CV value added: ' + cv);
                sdflag = true;
              });
            }
          } else {
            console.log('SD/CV is float');
            library.logStep('SD/CV is float');
            sdflag = true;
          }
        });
      }).then(function () {
        if (meanflag === true && sdflag === true) {
          console.log('Pass: Mean and SD values added');
          library.logStep('Pass: Mean and SD values added');
          flag = true;
          resolve(flag);
        } else {
          console.log('Fail: Mean and SD value is not added');
          library.logStep('Fail: Mean and SD value is not added');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
  verifyEvalMeanSdPage(level) {
    let flotPointFlag, meanFixedflag, sdfixedflag,meanInputFlag,sdInputFlag,cvInputFlag,cvLabelFlag,floatradioFlag,fixedradioFlag,displayed = false;
    return new Promise((resolve) => {
      const floatPointField = findElement(locatorType.XPATH, enteredFloatPoints);

      const meanFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFixed")]');
      const sdFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFixed")]');
      const meanInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-form-field//input');
      const sdInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "sd")]');
      const cvInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]');
      const cvLabel = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]/parent::div/parent::div/following-sibling::div[contains(@class, "underline")]');
      const floatradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[2]');
      const fixedradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[1]');

      //browser.executeScript('arguments[0].scrollIntoView();', meanFixed);
      if(floatPointField.isDisplayed()) {
        flotPointFlag=true
      }
      if(meanFixed.isDisplayed()) {
        library.logStep('meanFixed are displayed.');

        meanFixedflag=true
      }
      if(sdFixed.isDisplayed()) {
        library.logStep('sdFixed are displayed.');

        sdfixedflag=true
      }
      if(meanInput.isDisplayed()) {
        library.logStep('meanInput are displayed.');

        meanInputFlag=true
      }
      if(sdInput.isDisplayed()) {
        library.logStep('sdInput are displayed.');

        sdInputFlag=true
      }
      if(cvInput.isDisplayed()) {
        library.logStep('cvInput  are displayed.');

        cvInputFlag=true
      }
      if(cvLabel.isDisplayed()){
        library.logStep('cvlabel  are displayed.');

        cvLabelFlag=true
      }
      if(floatradio.isDisplayed()){
        library.logStep('floatradio buttons are displayed.');

        floatradioFlag=true
      }
      if(fixedradio.isDisplayed()){
        library.logStep('fixedradio buttons are displayed.');

        fixedradioFlag=true
      }

      if (flotPointFlag === true && meanFixedflag === true && sdfixedflag === true && meanInputFlag===true && sdInputFlag === true && cvInputFlag === true && cvLabelFlag === true && floatradioFlag===true && fixedradioFlag===true) {
        console.log('flotPointFlag ' + flotPointFlag + 'meanFixedflag ' + meanFixedflag +' sdfixedflag ' + sdfixedflag +' meanInputFlag ' + meanInputFlag +' sdInputFlag ' + sdInputFlag +' cvInputFlag ' + cvInputFlag +' cvLabelFlag ' + cvLabelFlag +' floatradioFlag ' + floatradioFlag +' fixedradioFlag ' + fixedradioFlag);
        library.logStep('EvalMeanSD Page displayed properly.');
        displayed = true;
        resolve(displayed);
      } else {
        console.log('flotPointFlag ' + flotPointFlag + 'meanFixedflag ' + meanFixedflag +' sdfixedflag ' + sdfixedflag +' meanInputFlag ' + meanInputFlag +' sdInputFlag ' + sdInputFlag +' cvInputFlag ' + cvInputFlag +' cvLabelFlag ' + cvLabelFlag +' floatradioFlag ' + floatradioFlag +' fixedradioFlag ' + fixedradioFlag);
        displayed = false;
        resolve(displayed);
      }

    });
  };


  clickUpdate() {
    return new Promise((resolve) => {
      let flag = false;
      const updateBtn = findElement(locatorType.XPATH, evalUpdate);
      updateBtn.isDisplayed().then(function () {
        library.clickJS(updateBtn);
        flag = true;
        library.logStep('Update Button clicked.');
        console.log('Update Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        console.log('Update Button not displayed.');
        library.logStep('Update Button not displayed.');
        resolve(flag);
      });
    });
  }

  clickCancel() {
    return new Promise((resolve) => {
      let flag = false;
      const cancelBtn = findElement(locatorType.XPATH, evalCancel);
      cancelBtn.isDisplayed().then(function () {
        library.clickJS(cancelBtn);
        flag = true;
        library.logStep('Cancel Button clicked.');
        console.log('Cancel Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logStep('Cancel Button not displayed.');
        console.log('Cancel Button not displayed.');
        resolve(flag);
      });
    });
  }

  clickCloseEvalMeanSD() {
    return new Promise((resolve) => {
      let flag = false;
      const CloseBtn = findElement(locatorType.XPATH, evalClose);
      CloseBtn.isDisplayed().then(function () {
        library.clickJS(CloseBtn);
        flag = true;
        library.logStep('Eval Mean SD Close Button clicked.');
        console.log('Eval Mean SD Close Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logStep('Eval Mean SD Close Button not displayed.');
        console.log('Eval Mean SD Close Button not displayed.');
        resolve(flag);
      });
    });
  }

  verifyExitConfirmationMessage() {
    return new Promise((resolve) => {
      let flag, errorMsg, withoutsave, saveandexit = false;
      const error = findElement(locatorType.XPATH, errormsg);
      const withoutSaving = findElement(locatorType.XPATH, dontSave);
      const SaveAndExit = findElement(locatorType.XPATH, save);
      error.isDisplayed().then(function () {
        console.log('Error message displayed');
        library.logStep('Error message displayed');
        errorMsg = true;
      }).then(function () {
        withoutSaving.isDisplayed().then(function () {
          console.log('Exit without Saving button displayed.');
          library.logStep('Exit without Saving button displayed.');
          withoutsave = true;
        });
      }).then(function () {
        SaveAndExit.isDisplayed().then(function () {
          console.log('Save and Exit button displayed.');
          library.logStep('Save and Exit button displayed.');
          saveandexit = true;
        });
      }).then(function () {
        if (errorMsg === true && withoutsave === true && saveandexit === true) {
          flag = true;
          console.log('Error message, Save and Exit and Exit without Save button displayed.');
          library.logStep('Error message, Save and Exit and Exit without Save button displayed.');
          resolve(flag);
        } else {
          flag = false;
          console.log('Error message, Save and Exit and Exit without Save button not displayed.');
          library.logStep('Error message, Save and Exit and Exit without Save button not displayed.');
          resolve(flag);
        }
      });
    });
  }

  clickSaveAndExit() {
    return new Promise((resolve) => {
      let flag = false;
      const SaveAndExit = findElement(locatorType.XPATH, save);
      SaveAndExit.isDisplayed().then(function () {
        library.clickJS(SaveAndExit);
        flag = true;
        library.logStep('Save and Exit Button clicked.');
        console.log('Save and Exit Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logStep('Save and Exit Button not displayed.');
        console.log('Save and Exit Button not displayed.');
        resolve(flag);
      });
    });
  }

  clickExitWitoutSaving() {
    return new Promise((resolve) => {
      let flag = false;
      const withoutSaving = findElement(locatorType.XPATH, dontSave);
      withoutSaving.isDisplayed().then(function () {
        library.clickJS(withoutSaving);
        flag = true;
        console.log('Pass: Exit without saving Button clicked.');
        library.logStep('Pass: Exit without saving Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        console.log('Fail: Exit without saving Button not displayed.');
        library.logStep('Fail: Exit without saving Button not displayed.');
        resolve(flag);
      });
    });
  }

  clickFloatingStatisticsToggle() {
    let result = false;
    return new Promise((resolve) => {
      const toggle = findElement(locatorType.XPATH, floatingStatisticsToggle);
      toggle.isDisplayed().then(function () {
        library.scrollToElement(toggle);
        toggle.click();
        const currentValue = findElement(locatorType.XPATH, currentValueLabel);
        currentValue.isDisplayed().then(function () {
          library.logStep('Floating Statistics Toggle button clicked');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        library.logFailStep('Unable to click Floating Statistics Toggle button');
        result = false;
        resolve(result);
      });
    });
  }

  clickFloatTypeDropdown() {
    let result = false;
    return new Promise((resolve) => {
      const floatTypeDD = findElement(locatorType.XPATH, floatTypeDropdown);
      floatTypeDD.isDisplayed().then(function () {
        floatTypeDD.click();
        library.logStep('Float Type dropdown clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click Float Type dropdown button');
        result = false;
        resolve(result);
      });
    });
  }

  verifyDropdownValues() {
    let result = false;
    return new Promise((resolve) => {
      const expectedOptions: string[] = ['Cumulative', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days'];
      const actualOptions: string[] = [];
      element.all(by.xpath(floatTypeOptions)).each(function (options) {
        options.getText().then(function (text) {
          console.log(text);
          // actualOptions.push(text.replace(/\s/g, ''));
          actualOptions.push(text.trim());
        });
      }).then(function () {
        const len = actualOptions.length;
        let count = 0;
        console.log('Exp: ' + expectedOptions);
        console.log('Act: ' + actualOptions);
        for (let i = 0; i < len; i++) {
          if (expectedOptions[i] === actualOptions[i]) {
            // console.log('Pass: Dropdown verified');
            console.log('Value not matching');
            // library.logStepWithScreenshot('The Float Type dropdown options are correctly displayed', 'FloatTypeOptions');
            count = count + 1;
          } else {
            console.log('Value not matching');
            // console.log('Fail: Dropdown not verified');
            // library.logFailStep('The Float Type dropdown options are not correctly displayed');
          }
        }
        if (count === len) {
          console.log('Pass: Dropdown verified');
          result = true;
          resolve(result);
        }
      });
    });
  }

  verifyCurrentValueLabel() {
    let result = false;
    return new Promise((resolve) => {
      const currentValue = findElement(locatorType.XPATH, currentValueLabel);
      currentValue.isDisplayed().then(function () {
        library.logStepWithScreenshot('Current value Label is displayed', 'currentvaluelabel');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Current value Label is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyCurrentValuesforLevels(level) {
    let result = false;
    return new Promise((resolve) => {
      const mean = findElement(locatorType.XPATH, '(.//span[contains(text(),"Level")]/following-sibling::span[contains(text(),"' + level + '")]/parent::label/following::span[contains(@class,"current-value-mean")])[1]');
      const SD = findElement(locatorType.XPATH, '(.//span[contains(text(),"Level")]/following-sibling::span[contains(text(),"' + level + '")]/parent::label/following::span[contains(@class,"current-value-mean")])[2]');
      const CV = findElement(locatorType.XPATH, '(.//span[contains(text(),"Level")]/following-sibling::span[contains(text(),"' + level + '")]/parent::label/following::span[contains(@class,"current-value-mean")])[3]');
      browser.executeScript('arguments[0].scrollIntoView();', mean);
      mean.isDisplayed().then(function () {
        mean.getText().then(function (mtext) {
          console.log(mtext);
          SD.isDisplayed().then(function () {
            SD.getText().then(function (sdtext) {
              console.log(sdtext);
              CV.isDisplayed().then(function () {
                CV.getText().then(function (cvtext) {
                  console.log(cvtext);
                  result = true;
                  resolve(result);
                });
              });
            });
          });
        });
      }).catch(function () {
        result = false;
        resolve(result);
      });
    });
  }

  selectFixedFloatMeanSD(level, meanType, sdType) {
    let selected, meanflag, sdflag = false;
    return new Promise((resolve) => {
      const meanFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFixed")]');
      const meanFloat = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFloat")]');
      const sdFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFixed")]');
      const sdFloat = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFloat")]');
      meanFixed.isDisplayed().then(function () {
        if ((meanType === 'Fixed') || (meanType === 'fixed')) {
          browser.executeScript('arguments[0].scrollIntoView();', meanFixed);
          library.click(meanFixed);
          console.log('Mean Selected as Fixed for level ' + level);
          library.logStep('Mean Selected as Fixed for level ' + level);
          meanflag = true;
        } else if ((meanType === 'Float') || (meanType === 'float')) {
          library.click(meanFloat);
          console.log('Mean Selected as Float for level ' + level);
          library.logStep('Mean Selected as Float for level ' + level);
          meanflag = true;
        }
      }).then(function () {
        if ((sdType === 'Fixed') || (sdType === 'fixed')) {
          browser.executeScript('arguments[0].scrollIntoView();', sdFixed);
          library.click(sdFixed);
          console.log('SD CV Selected as Fixed for level ' + level);
          library.logStep('SD CV Selected as Fixed for level ' + level);
          sdflag = true;
        } else if ((sdType === 'Float') || (sdType === 'float')) {
          library.click(sdFloat);
          console.log('SD CV Selected as Float for level ' + level);
          library.logStep('SD CV Selected as Float for level ' + level);
          sdflag = true;
        }
      }).then(function () {
        if (meanflag === true && sdflag === true) {
          console.log('Pass: Mean and SD selected');
          library.logStep('Pass: Mean and SD selected');
          selected = true;
          resolve(selected);
        } else {
          console.log('Fail: Mean and SD is not selected');
          library.logStep('Fail: Mean and SD is not selected');
          selected = false;
          resolve(selected);
        }
      });
    });
  }

  verifyPreSetMeanValue(level, meanValue) {
    let displayed = false;
    return new Promise((resolve) => {
      const meanValField = findElement(locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-form-field//input[contains(@formcontrolname, "mean")]');
      browser.executeScript('arguments[0].scrollIntoView();', meanValField);
      meanValField.getAttribute('value').then(function (val) {
        if (val.includes(meanValue)) {
          console.log('Pass: Correct mean value displayed');
          library.logStep('Pass: Correct mean value displayed');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Mean value is different');
          library.logStep('Fail: Mean value is different');
          displayed = false;
          resolve(displayed);
        }
      });
    });
  }

  verifyPreSetSDValue(level, sdValue) {
    let displayed = false;
    return new Promise((resolve) => {
      const sdValField = findElement(locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]/mat-form-field//input[contains(@formcontrolname, "sd")]');
      browser.executeScript('arguments[0].scrollIntoView();', sdValField);
      sdValField.getAttribute('value').then(function (val) {
        if (val === sdValue) {
          console.log('Pass: Correct sd value displayed');
          library.logStep('Pass: Correct sd value displayed');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: sd value is different');
          library.logStep('Fail: sd value is different');
          displayed = false;
          resolve(displayed);
        }
      });
    });
  }

  verifyPreSetCVValue(level, cvValue) {
    let displayed = false;
    return new Promise((resolve) => {
      const cvValField = findElement(locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]/mat-form-field//input[contains(@formcontrolname, "cv")]');
      browser.executeScript('arguments[0].scrollIntoView();', cvValField);
      cvValField.getAttribute('value').then(function (val) {
        if (val.includes(cvValue)) {
          console.log('Pass: Correct cv value displayed');
          library.logStepWithScreenshot('Pass: Correct cv value ' + cvValue + ' is displayed for Level ' + level, 'CorrectCVValue');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: cv value is different');
          library.logStep('Fail: cv value is different');
          displayed = false;
          resolve(displayed);
        }
      });
    });
  }

  verifyFloatPointValue(fpValue) {
    let displayed = false;
    return new Promise((resolve) => {
      const floatPointField = findElement(locatorType.XPATH, enteredFloatPoints);
      //  floatPointField.getAttribute('value').then(function(val) {
      if (floatPointField.isDisplayed()) {
        console.log('Pass: Correct float point value displayed');
        library.logStep('Pass: Correct float point value displayed');
        displayed = true;
        resolve(displayed);
      } else {
        console.log('Fail: float point value is different');
        library.logStep('Fail: float point value is different');
        displayed = false;
        resolve(displayed);
      }
    });
  }

  verifySelectedFixedFloatMeanSD(level, meanType, sdType) {
    let selected, meanflag, sdflag = false;
    return new Promise((resolve) => {
      const meanFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFixed")]');
      const meanFloat = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFloat")]');
      const sdFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFixed")]');
      const sdFloat = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFloat")]');
      meanFixed.isDisplayed().then(function () {
        if ((meanType === 'Fixed') || (meanType === 'fixed')) {
          meanFixed.getAttribute('class').then(function (className) {
            if (className.includes('checked')) {
              console.log('Mean is Fixed');
              library.logStep('Mean is Fixed');
              meanflag = true;
            }
          });
        } else if ((meanType === 'Float') || (meanType === 'float')) {
          meanFloat.getAttribute('class').then(function (className) {
            if (className.includes('checked')) {
              console.log('Mean is Float');
              library.logStep('Mean is Float');
              meanflag = true;
            }
          });
        }
      }).then(function () {
        if ((sdType === 'Fixed') || (sdType === 'fixed')) {
          sdFixed.getAttribute('class').then(function (className) {
            if (className.includes('checked')) {
              console.log('SD CV is Fixed');
              library.logStep('SD CV is Fixed');
              sdflag = true;
            }
          });
        } else if ((sdType === 'Float') || (sdType === 'float')) {
          sdFloat.getAttribute('class').then(function (className) {
            if (className.includes('checked')) {
              console.log('SD CV is Float');
              library.logStep('SD CV is Float');
              sdflag = true;
            }
          });
        }
      }).then(function () {
        if (meanflag === true && sdflag === true) {
          console.log('Pass: Mean and SD is selected');
          library.logStepWithScreenshot
          ('For Level ' + level + ' Mean is ' + meanType + ' & SD/CV is ' + sdType, 'MeanSDCVSelectionCorrect');
          selected = true;
          resolve(selected);
        } else {
          console.log('Fail: Mean and SD is not selected');
          library.logFailStep('For Level ' + level + ' Mean is ' + meanType + ' & SD/CV is ' + sdType + ' is not selected');
          selected = false;
          resolve(selected);
        }
      });
    });
  }

  addFloatPointValue(fpValue) {
    let added = false;
    return new Promise((resolve) => {
      const floatPointField = findElement(locatorType.XPATH, floatPoints);
      // floatPointField.isDisplayed().then(function() {
      floatPointField.clear().then(function () {
        floatPointField.sendKeys(fpValue);
        console.log('Pass: Float point value added');
        library.logStep('Pass: Float point value added');
        added = true;
        resolve(added);
      }).catch(function () {
        console.log('Fail: Could not add float point');
        library.logStep('Fail: Could not add float point');
        added = false;
        resolve(added);
      });
      // });
    });
  }

  disableFloatingStatisticsToggle() {
    let result = false;
    return new Promise((resolve) => {
      const toggle = findElement(locatorType.XPATH, floatingStatisticsToggle);
      toggle.isDisplayed().then(function () {
        library.scrollToElement(toggle);
        library.click(toggle);
        library.logStep('Floating Statistics Toggle button clicked to disable');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click Floating Statistics Toggle button');
        result = false;
        resolve(result);
      });
    });
  }

  selectValueFromDropDown() {
    let result = false;
    return new Promise((resolve) => {
      const opt = findElement(locatorType.XPATH, './/mat-option//span[contains(text(), "Cumulative")]');
      opt.isDisplayed().then(function () {
        library.clickJS(opt);
        library.logStep('Cumulative selected');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Cumulative selected');
        result = false;
        resolve(result);
      });
    });
  }

  enterValues(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      dataMap.forEach(function (key, value) {
        const data = findElement(locatorType.XPATH, '//*[@tabindex="' + value + '"]');
        library.clickJS(data);
        // browser.executeScript('arguments[0].scrollIntoView();', data);
        // browser.executeScript('argument[0].scrollIntoViewOptions({inline: "nearest"});', data);
        data.clear().then(function () {
          // browser.manage().timeouts().implicitlyWait(5000);
          data.sendKeys(key); // .then(function () {
          console.log('Values entered: ' + key);
          library.logStep('Data Entered : ' + key);
          status = true;
          resolve(status);
          // });
        });
      });
    });
  }

  // Level 1 values - Fixed
  verifyRestartToggleAndValuesDisplayed(level, i, valueType1, valueType2) {
    return new Promise((resolve) => {
      // browser.wait(browser.ExpectedConditions.elementToBeClickable((unityBtn)), 5000, 'unityBtn not clickable');
      /*  const firstEntry = element(by.xpath(clickOnFirstEntry));
       firstEntry.isDisplayed().then(function () {
         library.clickJS(firstEntry); */
      const restartFloatBtn = element(by.xpath(restartfloatWithThisRunBtn));
      browser.wait(browser.ExpectedConditions.elementToBeClickable((restartFloatBtn)), 5000, 'Restart float with this run toggle is not visible');
      const j = i + 1;
      const verifyLevel3MeanLabel = '(//*[@class="level-info ng-star-inserted"]//tr)[' + i + ']//th[contains(text(),"' + valueType1 + '")][1]';
      const verifyLevel3MeanValue = '(//*[@class="level-info ng-star-inserted"]//tr)[' + j + ']//td[3]';
      const verifyLevel3CVLabel = '(//*[@class="level-info ng-star-inserted"]//tr)[' + i + ']//th[contains(text(),"' + valueType2 + '")]';
      const verifyLevel3CVValue = '(//*[@class="level-info ng-star-inserted"]//tr)[' + j + ']//td[5]';
      console.log('Label xpath : ' + verifyLevel3MeanLabel);
      console.log('Value1 xpath : ' + verifyLevel3MeanValue);
      console.log('Labe2 xpath : ' + verifyLevel3CVLabel);
      console.log('Value2 xpath : ' + verifyLevel3CVLabel);
      browser.sleep(5000);
      element(by.xpath(verifyLevel3MeanLabel)).isDisplayed().then(function () {
        element(by.xpath(verifyLevel3MeanValue)).isDisplayed().then(function () {
          element(by.xpath(verifyLevel3CVLabel)).isDisplayed().then(function () {
            element(by.xpath(verifyLevel3CVValue)).isDisplayed().then(function () {
              console.log(level + ' values of type ' + valueType1 + ',' + valueType2 + ' are displayed');
              library.logStep(level + ' values of type ' + valueType1 + ',' + valueType2 + ' are displayed');
              resolve(true);
            }).catch(function () {
              library.logStep('CV Value is not displayed');
              resolve(false);
            });
          }).catch(function () {
            library.logStep('CV Label is not displayed');
            resolve(false);
          });
        }).catch(function () {
          library.logStep('Mean Value is not displayed');
          resolve(false);
        });
      }).catch(function () {
        library.logStep('Mean Label is not displayed');
        resolve(false);
      });
    });
  }

  clickRestartToggle() {
    return new Promise((resolve) => {
      const restartFloatBtn = element(by.xpath(restartfloatWithThisRunBtn));
      browser.wait(browser.ExpectedConditions.elementToBeClickable((restartFloatBtn)), 5000, 'Restart float with this run toggle is not visible');
      restartFloatBtn.isDisplayed().then(function(){
        library.scrollToElement(restartFloatBtn);
        library.click(restartFloatBtn);
        library.logStep('Restart float with this run toggle is on');
      });
    });
  }

  VerifyZScoreValues(beforeRestart, afterRestart, level) {
    return new Promise((resolve) => {
      const flag = false;
      const zScore = element(by.xpath('.//span[contains(text(), "Level")]/ancestor::div[contains(@class, "runs-table-component")]//div[contains(@class, "table-container")]//tr[3]//td[contains(@class, "evel-cell-z")][' + level + ']'));
      zScore.isDisplayed().then(function () {
        zScore.getText().then(function (zscoreValue) {
          if (beforeRestart === true) {
            if (zscoreValue !== '') {
              console.log('Z score is displayed');
              library.logStep('Z score is displayed');
              resolve(true);
            }
          }
          if (afterRestart === true) {
            if (zscoreValue === '') {
              library.logStep('Z score is not displayed');
              resolve(true);
            }
          }
        });
      });
    });
  }

  verifyValuesNotSet(level) {
    let flag, mean, sd, cv = false;
    return new Promise((resolve) => {
      const meanInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-form-field//input');
      const sdInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "sd")]');
      const cvInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]');
      meanInput.getAttribute('value').then(function (text) {
        if (text === '') {
          console.log('Mean value not set for level ' + level);
          library.logStep('Mean value not set for level ' + level);
          mean = true;
        } else {
          console.log('Mean value displayed for level ' + level);
          library.logStep('Mean value displayed for level ' + level);
          mean = false;
        }
      }).then(function () {
        sdInput.getAttribute('value').then(function (text) {
          if (text === '') {
            console.log('SD value not set for level ' + level);
            library.logStep('SD value not for level ' + level);
            sd = true;
          } else {
            console.log('SD value displayed for level ' + level);
            library.logStep('SD value displayed for level ' + level);
            sd = false;
          }
        });
      }).then(function () {
        cvInput.getAttribute('value').then(function (text) {
          if (text === '') {
            console.log('CV value not set for level ' + level);
            library.logStep('CV value not set for level ' + level);
            cv = true;
          } else {
            console.log('CV value displayed for level ' + level);
            library.logStep('CV value displayed for level ' + level);
            cv = false;
          }
        });
      }).then(function () {
        if (mean && sd && cv === true) {
          console.log('Values not set for level ' + level);
          library.logStepWithScreenshot('Values not set for level ' + level, 'NotSet');
          flag = true;
          resolve(flag);
        } else {
          console.log('Values are displayed for level ' + level);
          library.logStep('Values are displayed for level ' + level);
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickControlSetValues() {
    return new Promise((resolve) => {
      let flag = false;
      const sideNav = findElement(locatorType.XPATH, controlSetValues);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        flag = true;
        console.log('Control Set Values Button clicked.');
        library.logStep('Control Set Values Button clicked.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        console.log('Control Set Values Button not displayed.');
        library.logStep('Control Set Values Button not displayed.');
        resolve(flag);
      });
    });
  }

  addFixedSDValue(level, sdValue) {
    let status = false;
    return new Promise((resolve) => {
      const sdValField = findElement(locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "'+ level +'")]/parent::label/parent::div/parent::div/div[2]/mat-form-field//input[contains(@formcontrolname, "sd")]');
      browser.executeScript('arguments[0].scrollIntoView();', sdValField);
      sdValField.isDisplayed().then(function(){

      let ele= element(by.xpath('.//span[contains(@class, "spec_level")][contains(text(), "'+ level +'")]/parent::label/parent::div/parent::div/div[2]/mat-form-field//input[contains(@formcontrolname, "sd")]'));
      ele.clear();
      ele.sendKeys(sdValue);
      //  sdValField.sendKeys(sdValue);
      library.logStep('sdvalue '+sdValue+' is set for level '+level);;
        status=true;
        resolve(status);
      })
    });
  }

  addFixedMeanValue(level,meanValue){
    let status = false;
    return new Promise((resolve) => {
      const meanValField = findElement(locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "'+ level +'")]/parent::label/following-sibling::mat-form-field//input[contains(@formcontrolname, "mean")]');
      browser.executeScript('arguments[0].scrollIntoView();', meanValField);
      meanValField.isDisplayed().then(function(){
        let ele= element(by.xpath('.//span[contains(@class, "spec_level")][contains(text(), "'+ level +'")]/parent::label/following-sibling::mat-form-field//input[contains(@formcontrolname, "mean")]'));
        ele.clear();
        ele.sendKeys(meanValue);
        meanValField.sendKeys(meanValue);
        library.logStep('Meanvalue '+meanValue+' is set for level '+level);
        status=true;
        resolve(status);
      })
    });
  }
  verifyEvalMeanSdPage(level) {
    let flotPointFlag, meanFixedflag, sdfixedflag,meanInputFlag,sdInputFlag,cvInputFlag,cvLabelFlag,floatradioFlag,fixedradioFlag,displayed = false;
    return new Promise((resolve) => {
      const floatPointField = findElement(locatorType.XPATH, enteredFloatPoints);

      const meanFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-radio-group[contains(@formcontrolname, "meanEvaluationType")]/mat-radio-button[contains(@class, "spec_meanEvaluationFixed")]');
      const sdFixed = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//mat-radio-group[contains(@formcontrolname, "sdEvaluationType")]/mat-radio-button[contains(@class, "spec_sdcvEvaluationFixed")]');
      const meanInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/following-sibling::mat-form-field//input');
      const sdInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "sd")]');
      const cvInput = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]');
      const cvLabel = findElement
        (locatorType.XPATH, './/span[contains(@class, "spec_level")][contains(text(), "' + level + '")]/parent::label/parent::div/parent::div/div[2]//input[contains(@formcontrolname, "cv")]/parent::div/parent::div/following-sibling::div[contains(@class, "underline")]');
      const floatradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[2]');
      const fixedradio = findElement(locatorType.XPATH, '//unext-level-evaluation-mean-sd//label/span[contains(text(),' + level + ')]/parent::label/following-sibling::mat-form-field/following-sibling::mat-radio-group/mat-radio-button[1]');

      //browser.executeScript('arguments[0].scrollIntoView();', meanFixed);
      if(floatPointField.isDisplayed()) {
        flotPointFlag=true
      }
      if(meanFixed.isDisplayed()) {
        library.logStep('meanFixed are displayed.');

        meanFixedflag=true
      }
      if(sdFixed.isDisplayed()) {
        library.logStep('sdFixed are displayed.');

        sdfixedflag=true
      }
      if(meanInput.isDisplayed()) {
        library.logStep('meanInput are displayed.');

        meanInputFlag=true
      }
      if(sdInput.isDisplayed()) {
        library.logStep('sdInput are displayed.');

        sdInputFlag=true
      }
      if(cvInput.isDisplayed()) {
        library.logStep('cvInput  are displayed.');

        cvInputFlag=true
      }
      if(cvLabel.isDisplayed()){
        library.logStep('cvlabel  are displayed.');

        cvLabelFlag=true
      }
      if(floatradio.isDisplayed()){
        library.logStep('floatradio buttons are displayed.');

        floatradioFlag=true
      }
      if(fixedradio.isDisplayed()){
        library.logStep('fixedradio buttons are displayed.');

        fixedradioFlag=true
      }

      if (flotPointFlag === true && meanFixedflag === true && sdfixedflag === true && meanInputFlag===true && sdInputFlag === true && cvInputFlag === true && cvLabelFlag === true && floatradioFlag===true && fixedradioFlag===true) {
        console.log('flotPointFlag ' + flotPointFlag + 'meanFixedflag ' + meanFixedflag +' sdfixedflag ' + sdfixedflag +' meanInputFlag ' + meanInputFlag +' sdInputFlag ' + sdInputFlag +' cvInputFlag ' + cvInputFlag +' cvLabelFlag ' + cvLabelFlag +' floatradioFlag ' + floatradioFlag +' fixedradioFlag ' + fixedradioFlag);
        library.logStep('EvalMeanSD Page displayed properly.');
        displayed = true;
        resolve(displayed);
      } else {
        console.log('flotPointFlag ' + flotPointFlag + 'meanFixedflag ' + meanFixedflag +' sdfixedflag ' + sdfixedflag +' meanInputFlag ' + meanInputFlag +' sdInputFlag ' + sdInputFlag +' cvInputFlag ' + cvInputFlag +' cvLabelFlag ' + cvLabelFlag +' floatradioFlag ' + floatradioFlag +' fixedradioFlag ' + fixedradioFlag);
        displayed = false;
        resolve(displayed);
      }

    });
  };

}

