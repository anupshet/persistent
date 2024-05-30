/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, protractor } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addAnalyteIcon = './/mat-icon[contains(@class, "test")]';
const subTitleMessage = './/h5[@class="mat-h5"]';
const levelsInUse = './/div[contains(@class,"mat-checkbox-group")]';
const reagentForAllChx = './/mat-checkbox[contains(@formcontrolname, "defaultReagents")]';
const callibratorForAllChx = './/mat-checkbox[contains(@formcontrolname, "defaultCalibrators")]';
const selectAllAnalytesChx = './/mat-checkbox//strong[contains(text(), "Select all analytes")]';
const analyteChx = './/mat-checkbox[@formcontrolname = "analyte"]';
const dontSeeYourAnalyteLink = './/span[contains(text(), "your analyte?")]';
const addAnalyteButton = '//mat-card-actions//button//span[contains(text(),"Add Analytes")]';
const addanalytetitle = '//h5[contains(text(),"Add analytes")]';
const imageicon = '//mat-icon[contains(@class,"tests mat-icon")]';
const levelsinusecheckbox = '//div[@formarrayname="levelCheckboxes"]';
const reagentcheckbox = '//input[@id="mat-checkbox-1-input"]';
const calibratorcheckbox = '//input[@id="mat-checkbox-2-input"]';
const selectallcheckbox = '//input[@id="mat-checkbox-3-input"]';
const ALTcheckbox = '//input[@id="mat-checkbox-4-input"]';
const cancelbutton = '//span[contains(text(),"Cancel")]';
const addanalytebutton = '//span[contains(text(),"Add Analytes")]';
const selectAllAnalyteReagentChkBx = '//span[contains(text(),"reagents")]/preceding-sibling::div/input[@type="checkbox"]';
const selectAllAnalyteCalibChkBx = '//mat-checkbox[@formcontrolname="defaultCalibrators"]//div[@class="mat-checkbox-inner-container"]';
const selectAllAnalyteChkBx = '//span[@class="mat-checkbox-label"]//strong[contains(text(),"Select all analytes")]/ancestor'
  + '::mat-checkbox//input[@type="checkbox"]';
const allAnalyteCheckbx = '//mat-checkbox[@formcontrolname="analyte"]';
const calibrator = '//mat-select[@aria-label=" Calibrator "]';
const reagent = '//mat-select[@aria-label=" Reagent "]';
const allOptions = '//mat-option/span';
const dontSeeAnalyteLink = '//span[contains(text()," analyte? ")]';
const newanalytemodal = '//*[normalize-space(text())="Set up a new analyte"]';
const instructiontext = '//p[@class="grey"]';
const dropfileherebox = '//h2/span[contains(text(),"Drop a file here or ")]';
const browsefile = '//label[contains(text(),"browse for a file.")]';
const fileicon = '//mat-icon[contains(@class,"publish mat-icon")]';
const closeicon = '//mat-icon[contains(@class,"close mat-icon")]';
const cancelbuttondialog = '//mat-dialog-actions[@class="mat-dialog-actions"]/button/span[contains(text(),"Cancel")]';
const sendinfobutton = '//span[contains(text(),"Send Information")]';
const sendinfobuttondisabled = '//span[contains(text(),"Send Information")]/parent::button[@disabled="true"]';
const dontSeeAnalyte = '//span[contains(text(),"analyte?")]';
const analyteAllCheckboxes = '//input[@type="checkbox"]';
const levelsInUseCheckBoxes = '//mat-checkbox[@formcontrolname="level"]//input[@type="checkbox"]';
const setupNewInstrumentCancel = '//button[@aria-label="Close dialog"]';
const editAnalyteLink = '//unext-analyte-data-entry//span[contains(text(),"Edit this analyte")]';
const summaryEntryToggle = 'mat-slide-toggle-thumb-container';
const returnDataLink = 'spec_returnToData';
//const updateBtnEle = '//unext-lab-setup//button//span[contains(text(),"Update")]';
// tslint:disable-next-line: max-line-length
const selectReagentLotNumberCheckbox = '//span[contains(text(),"Select reagent lot number")]/preceding-sibling::div/input[@type="checkbox"]';
const selectCalibratorLotNumberCheckbox = '//span[contains(text(),"Select calibrator lot number")]/preceding-sibling::div/input[@type="checkbox"]';
const levelsStatus = '//div[@formarrayname="levels"]//input[@type="checkbox"]';
const updateBtnEle = '//unext-lab-setup//button//span[contains(text(),"Update")]';
const errorElement = '//div[contains(text(),"An analyte with this configuration already exists for the selected control.")]';
const addAnalyteBtn = '//*//span[text()="Add Analytes"]/parent::span/parent::button';

export class AddAnalyte {
  verifyAddAnalytePage() {
    let icon, subTitle, levels, reagentForAll, callibratorForAll, analyteName, dontSee, cancel, add = false;
    let result = true;
    return new Promise((resolve) => {
      const analyteIcon = findElement(locatorType.XPATH, addAnalyteIcon);
      const subTitleMsg = findElement(locatorType.XPATH, subTitleMessage);
      const levelsInUseEle = findElement(locatorType.XPATH, levelsInUse);
      const reagentForAllCxb = findElement(locatorType.XPATH, reagentForAllChx);
      const callibratorForAllCxb = findElement(locatorType.XPATH, callibratorForAllChx);
      const analyteChxEle = findElement(locatorType.XPATH, analyteChx);
      const dontSeeYourAnalyteLinkEle = findElement(locatorType.XPATH, dontSeeYourAnalyteLink);
      const cancelBtn = findElement(locatorType.XPATH, cancelbutton);
      const addAnalytebtn = findElement(locatorType.XPATH, addAnalyteButton);
      analyteIcon.isDisplayed().then(function () {
        icon = true;
        library.logStep('Analyte icon displayed');
        console.log('icon' + icon);
      });
      subTitleMsg.isDisplayed().then(function () {
        subTitleMsg.getText().then(function (subTitleMsg1) {
          if (subTitleMsg1.includes('Add analytes to ')) {
            subTitle = true;
            library.logStep('Add Analyte subtitle displayed');
            console.log('subTitle' + subTitle);
          }
        });
      });
      levelsInUseEle.isDisplayed().then(function () {
        levels = true;
        library.logStep('Levels in use displayed');
        console.log('levels' + levels);
      });
      reagentForAllCxb.isDisplayed().then(function () {
        reagentForAll = true;
        library.logStep('Reagent For All Checkbox displayed');
        console.log('reagentForAll' + reagentForAll);
      });
      callibratorForAllCxb.isDisplayed().then(function () {
        callibratorForAll = true;
        library.logStep('Callibrator For All Checkbox displayed');
        console.log('callibratorForAll' + callibratorForAll);
      });
      analyteChxEle.isDisplayed().then(function () {
        analyteName = true;
        library.logStep('analyte displayed');
        console.log('analyteName' + analyteName);
      });
      library.scrollToElement(dontSeeYourAnalyteLinkEle);
      dontSeeYourAnalyteLinkEle.isDisplayed().then(function () {
        dontSee = true;
        library.logStep('Dont See your analyte? link displayed');
        console.log('dontSee' + dontSee);
      });
      cancelBtn.isDisplayed().then(function () {
        cancel = true;
        library.logStep('cancel Button displayed');
        console.log('cancel' + cancel);
      });
      addAnalytebtn.isDisplayed().then(function () {
        add = true;
        library.logStep('Add Analyte Button displayed');
        console.log('add' + add);
      });
      if (icon === true && subTitle === true && levels === true && reagentForAll === true &&
        callibratorForAll === true && analyteName === true && dontSee === true &&
        cancel === true && add === true) {
        result = true;
      }
      resolve(result);
    });
  }

  selectAnalyte(AnalyteName) {
    let selected = false;
    return new Promise((resolve) => {
      const analyteOpt = findElement(locatorType.XPATH,
        './/mat-checkbox[@formcontrolname = "analyte"]//span[contains(text(), "' + AnalyteName + '")]');
      library.scrollToElement(analyteOpt);
      analyteOpt.click().then(function () {
        selected = true;
        library.logStep('Analyte Selected: ' + analyteOpt);
        console.log('Analyte Selected: ' + analyteOpt);
        resolve(selected);
      }).catch(function () {
        selected = false;
        library.logFailStep('Unable to select the Analyte');
        console.log('Unable to select the Analyte');
        resolve(selected);
      });
    });
  }

  verifyAddAnalyteButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = element(by.xpath(addAnalyteButton));
      addAnalytebtn.isEnabled().then(function (status) {
        if (status) {
          result = true;
          library.logStepWithScreenshot('Add Analyte button is Enabled', 'AddAnalyteEnable');
          console.log('Add Analyte button is Enabled');
          resolve(result);
        } else {
          result = true;
          library.logStep('Add Analyte button is Enabled');
          console.log('Add Analyte button is Enabled');
          resolve(result);
        }
      });
    });
  }

  verifyAddAnalyteButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = element(by.xpath(addAnalyteButton));
      addAnalytebtn.isEnabled().then(function (status) {
        if (!status) {
          result = true;
          library.logStep('Add Analyte button is disabled');
          console.log('Add Analyte button is disabled');
          resolve(result);
        }
      });
    });
  }

  clickOnCancel() {
    let result = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancelbutton));
      cancelBtn.isDisplayed().then(function () {
        library.click(cancelBtn);
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

  verifyAddAnalyteFormCleared(analyte) {
    let result = false;
    return new Promise((resolve) => {
      const analyteCheckbx = element(by.xpath('//span[contains(text(),"' + analyte + '")]/'
        + 'preceding-sibling::div/input[@aria-checked="true"]'));
      analyteCheckbx.isDisplayed().then(function (status1) {
        console.log(status1);
        if (status1 === true) {
          result = false;
          library.logStepWithScreenshot('On clicking cancel button add analyte form gets cleared', 'addAnalyteFormCleared');
          resolve(result);
        } else {
          result = true;
          library.logFailStep('On clicking cancel button add analyte form is not getting cleared');
          resolve(result);
        }
      }).catch(function () {
        result = true;
        library.logFailStep('On clicking cancel button add analyte form is not getting cleared');
        resolve(result);
      });
    });
  }

  verifyCancelClicked(analyteName) {
    let result = false;
    return new Promise((resolve) => {
      const chkbx = element(by.xpath('//span[contains(text(),"' + analyteName + '")]/ancestor::mat-checkbox'));
      chkbx.getAttribute('class').then(function (focus) {
        if (focus.includes('checked')) {
          result = false;
          library.logFailStep('Analyte is still selected on clicking Cancel button');
          resolve(result);
        } else {
          result = true;
          library.logStep('Analyte is not selected on clicking Cancel button');
          resolve(result);
        }
      });
    });
  }

  clickAddAnalyteButton() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = findElement(locatorType.XPATH, addAnalyteButton);
      addAnalytebtn.isDisplayed().then(function () {
        library.clickJS(addAnalytebtn);
        library.logStep('Add Analyte button Clicked');
        browser.sleep(9000);
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Add Analyte button');
        result = true;
        resolve(result);
      });
    });
  }

  clickSummaryEntryToggle() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = element(by.className(summaryEntryToggle));
      addAnalytebtn.isEnabled().then(function () {
        library.clickJS(addAnalytebtn);
        library.logStep('Summary Entry Toggle button Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Summary Entry Toggle button');
        result = true;
        resolve(result);
      });
    });
  }

  clickUpdateButton() {
    let result = false;
    return new Promise((resolve) => {
      const updateBtn = element(by.xpath(updateBtnEle));
      updateBtn.isEnabled().then(function () {
        library.clickJS(updateBtn);
        library.logStepWithScreenshot('Update button Clicked', 'UpdateClick');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click Update button');
        result = true;
        resolve(result);
      });
    });
  }

  clickReturnToDataLink() {
    let result = false;
    return new Promise((resolve) => {
      const toggleBtn = findElement(locatorType.ID, returnDataLink);
      toggleBtn.isEnabled().then(function () {
        library.clickJS(toggleBtn);
        library.logStep('Return to data link Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Return to data link');
        result = true;
        resolve(result);
      });
    });
  }

  clickEditThisAnalyteLink() {
    let result = false;
    return new Promise((resolve) => {
      const addAnalytebtn = findElement(locatorType.XPATH, editAnalyteLink);
      addAnalytebtn.isEnabled().then(function () {
        library.clickJS(addAnalytebtn);
        library.logStep('Edit this Analyte link Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click Edit this Analyte link');
        result = true;
        resolve(result);
      });
    });
  }

  verifyNumberOfLevelDisplayed(expectedLevels) {
    return new Promise((resolve) => {
      let status = false;
      findElement(locatorType.XPATH, '//span[contains(text(),"Level")]');
      browser.sleep(7000);
      element.all(by.xpath('//span[contains(text(),"Level")]')).count().then(function (temp) {
        console.log(temp);
        if (temp === 3) {
          library.logStepWithScreenshot('Selected level matched on  summary page', 'levelsDisplayed');
          status = true;
          resolve(status);
        } else {
          library.logFailStep('Selected level doesn\'t match with  summary page levels');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyNumberOfLevelDisplayedPoint(expectedLevels) {
    return new Promise((resolve) => {
      let status = false;
      findElement(locatorType.XPATH, '//span[contains(text(),"Level")]');
      element.all(by.xpath('//span[contains(text(),"Level")]')).count().then(function (temp) {
        console.log(temp);
        if (temp === 3) {
          console.log(temp + 'within expected ' + expectedLevels);
          library.logStepWithScreenshot('Selected level matched on  summary page', 'levelsDisplayed');
          status = true;
          resolve(status);
        } else {
          library.logFailStep('Selected level doesn\'t match with  summary page levels');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyAddAnalyte() {
    return new Promise((resolve) => {
      let status = false;
      const analytetitle = findElement(locatorType.XPATH, addanalytetitle);
      if (analytetitle.isDisplayed()) {
        library.logStep('Add analyte page displays');
        status = true;
        resolve(status);
      } else {
        library.logStep('Add analyte page not displayed');
        status = false;
        resolve(status);
      }
    });
  }

  verifyAddAnalytePageControls() {
    let imagedisplayed, levelcheckbox, reagentcheckboxcontrol, calibratorcheckboxcontrol = false;
    let selectallcheckboxcontrol, ALTcheckboxcontrol, cancelbuttoncontrol, addanalytecontrol = false;
    return new Promise((resolve) => {
      const image = findElement(locatorType.XPATH, imageicon);
      image.isDisplayed().then(function () {
        imagedisplayed = true;
        library.logStep('Header Image Icon displayed');
        console.log('image displayed');
        resolve(imagedisplayed);
      }).catch(function () {
        imagedisplayed = false;
        library.logStep('Header Image Icon not displayed');
        console.log('Header Image not displayed');
      });
      const levelscheckbox = element.all(by.xpath(levelsinusecheckbox));
      levelscheckbox.count().then(function (count) {
        if (count === 3) {
          levelcheckbox = true;
          library.logStep('Total Levels in use check boxes are 3');
          console.log('count ' + count);
          resolve(levelcheckbox);
        } else {
          levelcheckbox = false;
          resolve(levelcheckbox);
          library.logStep('Levels in use check boxes not displayed');
        }
      });
      const reagentcheckboxanalyte = element(by.xpath(reagentcheckbox));
      reagentcheckboxanalyte.isDisplayed().then(function () {
        reagentcheckboxcontrol = true;
        library.logStep('reagentcheckbox displayed');
        console.log('reagentcheckbox displayed');
        resolve(reagentcheckboxcontrol);
      }).catch(function () {
        reagentcheckboxcontrol = false;
        library.logStep('reagentcheckbox not displayed');
        console.log('reagentcheckbox not displayed');
      });
      const caliberatorcheckboxanalyte = element(by.xpath(calibratorcheckbox));
      caliberatorcheckboxanalyte.isDisplayed().then(function () {
        calibratorcheckboxcontrol = true;
        library.logStep('caliberatorcheck displayed');
        console.log('caliberatorcheck displayed');
        resolve(calibratorcheckboxcontrol);
      }).catch(function () {
        calibratorcheckboxcontrol = false;
        library.logStep('caliberatorcheck not displayed');
        console.log('caliberatorcheck not displayed');
      });
      const selectallcheckboxanalyte = element(by.xpath(selectallcheckbox));
      selectallcheckboxanalyte.isDisplayed().then(function () {
        selectallcheckboxcontrol = true;
        library.logStep('SelectAllcheckbox displayed');
        console.log('SelectAllcheckbox  displayed');
        resolve(selectallcheckboxcontrol);
      }).catch(function () {
        selectallcheckboxcontrol = false;
        library.logStep('SelectAllcheckbox not displayed');
        console.log('SelectAllcheckbox not displayed');
      });
      const ALTcheckboxanalyte = element(by.xpath(ALTcheckbox));
      ALTcheckboxanalyte.isDisplayed().then(function () {
        ALTcheckboxcontrol = true;
        library.logStep('ALTcheckbox displayed');
        console.log('ALTcheckbox  displayed');
        resolve(ALTcheckboxanalyte);
      }).catch(function () {
        ALTcheckboxcontrol = false;
        library.logStep('ALTcheckbox not displayed');
        console.log('ALTcheckbox not displayed');
      });
      const cancelbuttonanalyte = element(by.xpath(cancelbutton));
      cancelbuttonanalyte.isDisplayed().then(function () {
        cancelbuttoncontrol = true;
        library.logStep('Cancel button displayed');
        console.log('Cancel button  displayed');
        resolve(cancelbuttoncontrol);
      }).catch(function () {
        cancelbuttoncontrol = false;
        library.logStep('Cancel button not displayed');
        console.log('Cancel button not displayed');
      });
      const addanalytecontrolanalyte = element(by.xpath(addanalytebutton));
      addanalytecontrolanalyte.isDisplayed().then(function () {
        addanalytecontrol = true;
        library.logStep('Add Analyte button displayed');
        console.log('Add Analyte button displayed');
        resolve(addanalytecontrol);
      }).catch(function () {
        addanalytecontrol = false;
        library.logStep('Add Analyte button not displayed');
        console.log('Add Analyte button not displayed');
      });
    });
  }

  verifyLevelsInUse() {
    let result = false;
    return new Promise((resolve) => {
      element.all(by.xpath(levelsInUseCheckBoxes)).each(function (checkBoxes) {
        checkBoxes.getAttribute('aria-checked').then(function (status) {
          console.log('status is: ' + status);
          if (status === 'false') {
            result = true;

            library.logStep('Level in use check box is unchecked by default.');
            resolve(result);
          } else {

            library.logStep('Level in use check box is checked by default.');
            result = false;
            resolve(result);
          }
        });
      });
    });
  }

  checkUncheckAllTheseAnalyteReagent(check) {
    let result = false;
    return new Promise((resolve) => {
      const selectAllAnalyteReagent = element(by.xpath(selectAllAnalyteReagentChkBx));
      selectAllAnalyteReagent.getAttribute('aria-checked').then(function (status) {
        console.log('status of reagents check box: ' + status);
        if (status) {
          // library.clickJS(selectAllAnalyteReagent);
          library.logStep('\'All These Analyte use reagent\' checkbox is Unchecked.');
          result = true;
          resolve(result);
        } else {
          library.clickJS(selectAllAnalyteReagent);
          library.logStep('\'All These Analyte use reagent\' checkbox is checked.');
          result = true;
          resolve(result);
        }
      });
    });
  }

  checkUncheckAllTheseAnalyteCalibrators(check) {
    let result = false;
    return new Promise((resolve) => {
      const selectAllAnalyteCalibrators = element(by.xpath(selectAllAnalyteCalibChkBx));
      const status = selectAllAnalyteCalibrators.getAttribute('aria-checked');
      if (status === check) {
        library.clickJS(selectAllAnalyteCalibrators);
        library.logStep('\'All These Analyte use calibrators\' checkbox is Unchecked.');
        result = true;
        resolve(result);
      } else {
        library.clickJS(selectAllAnalyteCalibrators);
        library.logStep('\'All These Analyte use calibrators\' checkbox is checked.');
        result = true;
        resolve(result);
      }
    });
  }

  selectAllAnalytes() {
    let result = false;
    return new Promise((resolve) => {
      const selectAll = element(by.xpath(selectAllAnalyteChkBx));
      library.scrollToElement(selectAll);
      library.clickJS(selectAll);
      browser.sleep(10000);
      console.log('Select All Analytes checkbox clicked');
      selectAll.getAttribute('aria-checked').then(function (status) {
        console.log('statusof checkbox ' + status);
        library.logStep('Select All Analytes checkbox is checked');
        console.log('Select All Analytes checkbox is checked');
        result = true;
        console.log(result);
        resolve(result);
      });
    });
  }

  verifyAllAnalytesSelected() {
    let result = false;
    return new Promise((resolve) => {
      element.all(by.xpath(allAnalyteCheckbx)).each(function (analytes) {
        analytes.getAttribute('class').then(function (focus) {
          if (focus.includes('checked')) {
            result = true;
            library.logStep('All analytes selected on clicking select all analyte checkbox');
            resolve(result);
          } else {
            result = false;
            library.logFailStep('Analyte is not selected on clicking select all analyte checkbox');
            resolve(result);
          }
        });
      });
    });
  }

  selectAnalyteName(analyteName) {
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(5000)
      const analyte = findElement(locatorType.XPATH, '//mat-checkbox//span[contains(text(),"' + analyteName + '")]');
      // library.scrollToElement(analyte)
      library.clickJS(analyte);
      browser.sleep(5000);
      library.logStep(analyteName + ' is selected.');
      result = true;
      resolve(result);
    });
  }

  verifyFieldPopulated() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const populatedFields: string[] = [];
      populatedFields.push(' Reagent ');
      populatedFields.push(' Calibrator ');
      populatedFields.push(' Method ');
      populatedFields.push('Unit');
      populatedFields.forEach(function (field) {
        if (field === 'Unit') {
          const elements = element(by.xpath('//span[contains(text(),"' + field + '")]'));
          elements.isDisplayed().then(function (status) {
            if (status === true) {
              library.logStepWithScreenshot(field + ' field populated', 'UnitField');
              flag = true;
              resolve(flag);
            }
          }).catch(function () {
            library.logFailStep(field + ' field not populated');
            flag = false;
            resolve(flag);
          });
        } else {
          const elementPopulated = element(by.xpath('//input[@placeholder="' + field + '"]'));
          elementPopulated.isDisplayed().then(function (status1) {
            if (status1 === true) {
              library.logStepWithScreenshot(field + ' field populated', 'UnitField');
              flag = true;
              resolve(flag);
            }
          }).catch(function () {
            library.logFailStep(field + ' field not populated');
            flag = false;
            resolve(flag);
          });
        }
      });
    });
  }

  uncheckAnalyteName(analyteName) {
    let result = false;
    return new Promise((resolve) => {
      const analyte = element(by.xpath('//mat-checkbox//span[contains(text(),"' + analyteName + '")]'));
      library.clickJS(analyte);
      library.logStep(analyteName + ' is unchecked.');
      result = true;
      resolve(result);
    });
  }

  selectCalibrator(calibratorName) {
    let result = false;
    return new Promise((resolve) => {
      const cal = findElement(locatorType.XPATH, calibrator);
      library.clickJS(cal);
      const calOption = element(by.xpath('//mat-option/span[contains(text(),"' + calibratorName + '")]'));
      library.clickJS(calOption);
      library.logStep(calibratorName + ' is selected.');
      result = true;
      resolve(result);
    });
  }

  selectReagent(reagentName) {
    let result = false;
    return new Promise((resolve) => {
      browser.wait(element(by.xpath(reagent)).isPresent());
      const cal = findElement(locatorType.XPATH, reagent);
      library.clickJS(cal);
      const calOption = element(by.xpath('//mat-option/span[contains(text(),"' + reagentName + '")]'));
      library.clickJS(calOption);
      library.logStep(reagentName + ' is selected.');
      result = true;
      resolve(result);
    });
  }

  selectUnit(measureUnit, unitNo) {
    let result = false;
    return new Promise((resolve) => {

      const drpdwn = findElement(locatorType.XPATH, '(//mat-select[@aria-label=" Unit "])[' + unitNo + ']');
      library.clickJS(drpdwn);

      const calOption = findElement(locatorType.XPATH, '//mat-option/span[contains(text(),"' + measureUnit + '")]');
      library.clickJS(calOption);
      library.logStep(measureUnit + ' is selected.');
      const esc = element(by.tagName('body'));
      esc.sendKeys(protractor.Key.ESCAPE);
      result = true;
      resolve(result);
    });
  }
  clickDontSeeAnalyte() {
    let result = false;
    return new Promise((resolve) => {
      const link = findElement(locatorType.XPATH, dontSeeAnalyte);
      library.clickJS(link);
      library.logStep('Dont see your analyte link is clicked.');
      result = true;
      resolve(result);
    });
  }
  verifySorting(dropdown) {
    let result = false;
    return new Promise((resolve) => {
      const dropdownEle = findElement(locatorType.XPATH, '//mat-select[@aria-label="' + dropdown + '"]');
      library.clickJS(dropdownEle);
      let expected: string[];
      const actual: string[] = [];
      element.all(by.xpath(allOptions)).each(function (options) {
        options.getText().then(function (text) {
          actual.push(text.toUpperCase());
        });
      }).then(function () {
        expected = actual.sort();
        console.log('Expected: ' + expected + 'Actual: ' + actual);
        for (let i = 0; i < expected.length; i++) {
          console.log(actual[i]);
          console.log(expected[i]);
          if (actual[i] !== expected[i]) {
            result = true;
            library.logStep('Options are sorted of ' + dropdown + ' dropdown.');
            resolve(result);
          } else {
            result = false;
            library.logStep('Options are not sorted of ' + dropdown + ' dropdown.');
            resolve(result);
          }
        }
      });
    });
  }

  selectLevelInUse(totalLevels) {
    return new Promise((resolve) => {
      browser.sleep(10000);
      let result = false;
      let i = 1;
      for (i = 1; i <= totalLevels; i++) {
        const levels = findElement(locatorType.XPATH, '(//mat-checkbox[contains(@class,"levels")])[' + i + ']');
        library.scrollToElement(levels);
        library.clickAction(levels);
        library.logStep(i + ' level selected.');
      }
      result = true;
      resolve(result);
    });
  }

  selectReagentOtherAnalyte(AnalyteName, ReagentName) {
    let result = false;
    return new Promise((resolve) => {
      const reagent1 = findElement(locatorType.XPATH, '//mat-checkbox//span[contains(text(),"' + AnalyteName + '")]//ancestor'
        + '::mat-checkbox/following-sibling::div//br-select[@formcontrolname = "reagents"]/mat-form-field[@id = "multipleData"]');
      //  library.scrollToElement(reagent);
      browser.actions().mouseMove(reagent1).click().perform();
      const reagentOptions = element(by.xpath('//mat-option/span[contains(text(),"' + ReagentName + '")]'));
      library.clickJS(reagentOptions);
      library.logStep(ReagentName + ' is selected.');
      result = true;
      resolve(result);
    });
  }

  selectCalibratorOtherAnalyte(AnalyteName, calibratorName2) {
    let result = false;
    return new Promise((resolve) => {
      const calibrator1 = findElement(locatorType.XPATH, '//mat-checkbox//span[contains(text(),"' + AnalyteName + '")]//ancestor'
        + '::mat-checkbox/following-sibling::div//br-select[contains(@formcontrolname,"calibrator")]/mat-form-field'
        + '[@id = "multipleData"]');
      // library.scrollToElement(calibrator);
      // calibrator.click();
      library.clickJS(calibrator1);
      const calOption = element(by.xpath('//mat-option/span[contains(text(),"' + calibratorName2 + '")]'));
      library.clickJS(calOption);
      library.logStep(calibratorName2 + ' is selected.');
      result = true;
      resolve(result);
    });
  }
  setUpNewAnalyteDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const analytelink = element(by.xpath(dontSeeAnalyteLink));
      library.clickJS(analytelink);
      library.logStep('Dont See your analyte Link clicked');
      const model = element(by.xpath(newanalytemodal));
      if (model.isDisplayed()) {
        flag = true;
        library.logStep('Setup a new analyte model is displayed.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep('Setup a new analyte model is not displayed.');
        resolve(flag);
      }
    });
  }

  setUpNewAnalyteControls(jsontext) {
    let result, header, textflag, filebox, filelink, fileiconflag, closeflag, cancelbuttonflag, sendinfoflag = false;
    return new Promise((resolve) => {
      const analyteheader = findElement(locatorType.XPATH, newanalytemodal);
      analyteheader.isDisplayed().then(function () {
        header = true;
        library.logStep('Header on modal displays');
      });
      const text = element(by.xpath(instructiontext));
      text.getText().then(function (textdisplayed) {
        if (textdisplayed === jsontext) {
          textflag = true;
          library.logStep('Instruction text on modal displays');
        }
      });
      const dropfile = element(by.xpath(dropfileherebox));
      dropfile.isDisplayed().then(function () {
        filebox = true;
        library.logStep('Drop file here modal box displays');
      });
      const browsefilelink = element(by.xpath(browsefile));
      browsefilelink.isDisplayed().then(function () {
        filelink = true;
        library.logStep('Browse file here link on modal box displays');

      });
      const fileiconcontrol = element(by.xpath(fileicon));
      fileiconcontrol.isDisplayed().then(function () {
        fileiconflag = true;
        library.logStep('File icon on modal box displays');
      });
      const closecontrol = element(by.xpath(closeicon));
      closecontrol.isDisplayed().then(function () {
        closeflag = true;
        library.logStep('Close button on modal box displays');
      });
      const cancelbuttoncontrol = element(by.xpath(cancelbuttondialog));
      cancelbuttoncontrol.isDisplayed().then(function () {
        cancelbuttonflag = true;
        library.logStep('Cancel button on modal box displays');
      });
      const sendinfocontrol = element(by.xpath(sendinfobutton));
      cancelbuttoncontrol.isDisplayed().then(function () {
        sendinfoflag = true;
        library.logStep('Send Information button on modal box displays');
      });
      if (header === true && textflag === true && filebox === true
        && filelink === true && fileiconflag === true && closeflag === true
        && cancelbuttonflag === true && sendinfoflag === true) {
        console.log('All values true');
        result = true;
        resolve(result);
      }
    });
  }

  cancelButtonNewAnalyte() {
    let analyteflag = false;
    return new Promise((resolve) => {
      const cancelbuttoncontrol = findElement(locatorType.XPATH, cancelbuttondialog);
      library.clickJS(cancelbuttoncontrol);
      library.logStep('Clicked Cancel button on Set up a new analyte screen');
      library.attachScreenshot('Cancelbuttonfunctionality');
      const analytetitle = element(by.xpath(addanalytetitle));
      analytetitle.isDisplayed().then(function () {
        analyteflag = true;
        library.logStep('Add analytes to Control page display');
        console.log('Add analytes to Control page display');
        if (analyteflag === true) {
          resolve(analyteflag);
        } else {
          library.logStep('Add analytes to Control page not display');
          console.log('Add analytes to Control page not display');
        }
      });
    });
  }

  closeiconnewanalyte() {
    let analyteflag = false;
    return new Promise((resolve) => {
      const closebuttoncontrol = element(by.xpath(closeicon));
      library.clickJS(closebuttoncontrol);
      library.attachScreenshot('Closeiconfunctionality');
      const analytetitle = element(by.xpath(addanalytetitle));
      analytetitle.isDisplayed().then(function () {
        analyteflag = true;
        library.logStep('Add analytes to Control page display');
        console.log('Add analytes to Control page display');
      });
      resolve(analyteflag);
    });
  }

  selectAllCheckboxes() {
    let checkboxes = false;
    return new Promise((resolve) => {
      element.all(by.xpath(levelsInUseCheckBoxes)).each(function (checkbox) {
        browser.actions().mouseMove(checkbox).click().perform();
      });
      const selectAllChkBox = element(by.xpath(selectAllAnalytesChx));
      library.clickJS(selectAllChkBox);
      checkboxes = true;
      resolve(checkboxes);
    });
  }

  clickCancelButton() {
    let result = false;
    browser.sleep(10000);
    return new Promise((resolve) => {
      const cancelButton = element(by.xpath(cancelbutton));
      cancelButton.isDisplayed().then(function () {
        library.clickJS(cancelButton);
        result = true;
        resolve(result);
        console.log('cancel button clicked');
      });
    });
  }

  verifySendInformationButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const sendInfoBtn = findElement(locatorType.XPATH, sendinfobutton);
      sendInfoBtn.isDisplayed().then(function (displayed) {
        result = true;
        library.logStep('Send Information button is enabled');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStepWithScreenshot('Send Information button is enable', 'SendInfoDisabled');
        resolve(result);
      });
    });
  }

  verifySendInformationButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const sendInfoBtn = findElement(locatorType.XPATH, sendinfobuttondisabled);
      sendInfoBtn.isDisplayed().then(function (displayed) {
        result = true;
        library.logStep('Send Information button is Disabled');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStepWithScreenshot('Send Information button is Disabled', 'SendInfoDisabled');
        resolve(result);
      });
    });
  }

  verifyCancelCloseButtonClicked() {
    let flag = false;
    return new Promise((resolve) => {
      const cancel = element(by.xpath(setupNewInstrumentCancel));
      cancel.isDisplayed().then(function (disp) {
        console.log('disp' + disp);
        if (disp === true) {
          flag = false;
          library.logFailStep('Setup a new instrument model is canceled.');
          resolve(flag);
        } else {
          flag = true;
          library.logStepWithScreenshot('Model is not displayed on clicking cancel', 'ModelNotDisplayed');
          resolve(flag);
        }
      }).catch(function () {
        flag = true;
        library.logStepWithScreenshot('Model is not displayed on clicking cancel', 'ModelNotDisplayed');
        resolve(flag);
      });
    });
  }

  deselectAllCheckBoxes() {
    console.log('inside deselectall');
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      element.all(by.xpath(analyteAllCheckboxes)).each(function (checkbox) {
        checkbox.getAttribute('aria-checked').then(function (value) {
          if (value === 'false') {
            result = true;
            resolve(result);
          }
        });
      });
      console.log('All changes cancelled');
      library.logStep('All changes cancelled');
    });
  }

  select2LevelsAnalyte() {
    let result = false;
    return new Promise((resolve) => {
      const level1 = findElement(locatorType.XPATH, '(//mat-checkbox//div[@class="mat-checkbox-inner-container"])[1]');
      library.scrollToElement(level1);
      level1.isDisplayed().then(function () {
        library.clickJS(level1);
      });
      const level2 = element(by.xpath('(//mat-checkbox//div[@class="mat-checkbox-inner-container"])[2]'));
      library.scrollToElement(level2);
      level2.isDisplayed().then(function () {
        library.clickJS(level2);
      });
      result = true;
      resolve(result);
    });
  }

  selectReagentLotNumberCheckbox() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const reagentLotNumber = element(by.xpath(selectReagentLotNumberCheckbox));
      reagentLotNumber.isDisplayed().then(function () {
        library.clickJS(reagentLotNumber);
        library.logStep('Select Reagent Lot Number checkbox is checked.');
        result = true;
        resolve(result);
      });
    });
  }

  selectCalibratorLotNumberCheckbox() {
    let result = false;
    return new Promise((resolve) => {
      const calibratorLotNumber = element(by.xpath(selectCalibratorLotNumberCheckbox));
      calibratorLotNumber.isDisplayed().then(function () {
        library.clickJS(calibratorLotNumber);
        library.logStep('Select calibrator Lot Number checkbox is checked.');
        result = true;
        resolve(result);
      });
    });
  }

  verifyLevelsStatus() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      element.all(by.xpath(levelsStatus)).each(function (checkBoxes) {
        checkBoxes.getAttribute('aria-checked').then(function (status) {
          console.log('status is: ' + status);
          if (status === 'false') {
            result = true;
            library.logFailStep('Level in use check boxes are unchecked.');
            resolve(result);
          } else {
            library.logStepWithScreenshot('Level in use check boxes are checked.', 'Level Checked');
            result = false;
            resolve(result);
          }
        });
      });
    });
  }

  uncheckLevel(levelName) {
    let result = false;
    return new Promise((resolve) => {
      const level = element(by.xpath('//mat-checkbox//span[contains(text(),"' + levelName + '")]'));
      library.clickJS(level);
      library.logStepWithScreenshot('level' + levelName + ' is unchecked.', 'Levels Status');
      result = true;
      resolve(result);
    });
  }

  uncheckAllLevels() {
    let result = false;
    return new Promise((resolve) => {
      element.all(by.xpath(levelsStatus)).each(function (checkBoxes) {
        library.clickJS(checkBoxes);
        checkBoxes.getAttribute('aria-checked').then(function (status) {
          if (status === 'false') {
            result = true;
            library.logStepWithScreenshot('Level unchecked.', 'levelUnchecked');
          } else {
            library.logStepWithScreenshot('Cannot Uncheck all levels', 'Levels Status');
            result = false;
          }
        });
      });
      resolve(result);
    });
  }

  selectUnits(measureUnit) {
    let result = false;
    return new Promise((resolve) => {
      const drpdwn = findElement(locatorType.XPATH, '(//mat-select[@aria-label=" Unit "])');
      library.clickJS(drpdwn);
      const unitOption = findElement(locatorType.XPATH, '//mat-option/span[contains(text(),"' + measureUnit + '")]');
      library.clickJS(unitOption);
      library.logStep(measureUnit + ' is selected.');
      // const esc = element(by.tagName('body'));
      // esc.sendKeys(protractor.Key.ESCAPE);
      result = true;
      resolve(result);
    });
  }

  selectReagentLot(reagentName){
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const reagentLot='(//mat-select[@aria-label=" Lot number "])[1]';
      const reagentlot=element(by.xpath(reagentLot));
      library.clickAction(reagentlot);
      const newReagent=element(by.xpath('//span[contains(text()," '+reagentName+' ")]'));
      library.clickAction(newReagent);
      library.logStep('New reagent '+ reagentName+' is selected');
      result=true;
      resolve(result);
    });
  }


  selectCalibratortLot(calibratorName){
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const calibratorLot='(//mat-select[@aria-label=" Lot number "])[2]';
      const calibratorlot=element(by.xpath(calibratorLot));
      library.clickAction(calibratorlot);
      const newCalibrator=element(by.xpath('//span[contains(text()," '+calibratorName+' ")]'));
      library.clickAction(newCalibrator);
      library.logStep('New calibrator '+ calibratorName+' is selected');
      result=true;
      resolve(result);
    });
  }

  verifyErrorSameAnalyte() {
    let status = false;
    return new Promise((resolve) => {
      const error = element(by.xpath(errorElement));
      error.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Error Displayed :An analyte with this configuration already exists for the selected control','ErrorMsg');
        console.log('Error displayed');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStep('Error NOT Displayed');
        console.log('Error not displayed');
        resolve(status);
      });
    });
  }

  isAddAnalytesBtnEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const addAnalyteBtn1 = element(by.xpath(addAnalyteBtn));
      library.scrollToElement(addAnalyteBtn1);
      addAnalyteBtn1.isDisplayed().then(function () {
        const value = addAnalyteBtn1.getAttribute('disabled');
        if(!addAnalyteBtn1.getAttribute('disabled')){
          status = true;
          library.logStepWithScreenshot('ADD ANALYTES Button Displayed and Enabled','AddAnalyte');
          console.log('ADD ANALYTES Button Displayed and Enabled');
        }
        else{
          status = false;
          library.logStepWithScreenshot('ADD ANALYTES Button Displayed but NOT Enabled','AddAnalyte');
          console.log('ADD ANALYTES Button Displayed but NOT Enabled');
        }
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStep('ADD ANALYTES Button NOT Displayed');
        console.log('ADD ANALYTES Button NOT Displayed');
        resolve(status);
      });
    });
  }
}
