/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ElementFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';
import * as assert from 'assert';
const path = require('path');
const library = new BrowserLibrary();
const labSetupSettingIcon = './/mat-icon[contains(@class, "setupBegin")]';
const helloMessage = './/h4[@class="mat-h4"]';
const subTitleMessage = './/h6[@class="mat-h6"]';
const questionDataEntry = '(.//p[@class="mb-25"]//span)[1]';
const summaryText = '(.//mat-radio-group)[1]/mat-radio-button[1]//span[2]';
const pointText = '(.//mat-radio-group)[1]/mat-radio-button[2]//span[2]';
const questionInstrument = '(.//p[@class="mb-25"])[2]/span';
const yesByDepartment = '(.//mat-radio-group)[2]/mat-radio-button[1]//span[2]';
const noDepartments = '(.//mat-radio-group)[2]/mat-radio-button[2]//span[2]';
const questionTrack = '(.//p[@class="mb-25"])[3]/span';
const yesTrack = '(.//mat-radio-group)[3]/mat-radio-button[1]//span[2]';
const noTrack = '(.//mat-radio-group)[3]/mat-radio-button[2]//span[2]';
const questionDecimal = './/div[@class="flex-box"]/p';

const decimalPacesLabel = './/label[@id="mat-form-field-label-1"]';
const letsGoButton = '//*[normalize-space(text())="Skip department"]';
const infoToolTipDataEntry = '(//i[@class="icon-info"])[1]';
const toolTipText = './/p[@class="ng-star-inserted"]';
const infoToolTipDept = '(//i[@class="icon-info"])[2]';
const infoToolTipTrack = '(//i[@class="icon-info"])[3]';
const yesByDepartmentRadioButton = './/mat-radio-group[@formcontrolname="instrumentsGroupedByDept"]/mat-radio-button[1]';
const noDepartmentsRadioButton = '//input[@id="spc_skipDepartment-input"]';
const departmentSetupPageHeader = '//h5[@class="mat-h5"]';

const summaryRadioButton = '//span[contains(text(),"Summary")]//ancestor::mat-radio-group';
const pointRadioButton = '(//label[@class="mat-radio-label"]/parent::mat-radio-button)[2]';
const decimalDefaultVal = '//*[@formcontrolname="decimalPlaces"]';
const decimalErrorMsg = '//span[text()="Value can not be more than 4"]';
const decimalErrorMsgReq = '//span[text()="Required"]';
const trackUnityQ = '(//label[@class="mat-radio-label"]/parent::mat-radio-button)[6]';
const howManyDecimalQ = '//p[contains(text(),"How many decimal")]';

const addDepartmentPopup = '//h5[contains(text(),"What departments")]';
const instrumentIcon = '//unext-instrument-entry/mat-card/unext-lab-setup-header/div/div/mat-icon';
const instrumentHeader = '//h5[contains(text(),"Add instruments to")]';
const instrumentDropdown = '//mat-select[@aria-label=" Instrument manufacturer "]';
const anotherInstrumentLink = '//span[contains(text(),"Another instrument?")]';
const dontSeeInstrumentLink = '//span[contains(text(),"see your instrument")]';
const cancleButtonAddInstrument = '//button/span[contains(text(),"Cancel")]';
const addInstrumentButton = '//button/span[contains(text(),"Add instruments")]';
const addInstrumentButtonDisabled = '//button/span[contains(text(),"Add instruments")]/parent::button[@disabled="true"]';
const manufacturerDrpdwn = '(//mat-select)[1]';
const manufacturerDrpdwnAnotherInstrument = '(//mat-select)[5]';
const allOption = '//mat-option';
const setupNewInstrument = '//unext-request-new-config';
const setupNewInstrumentHeader = '//*[normalize-space(text())="Set up a new instrument"]';
const setupNewInstrumentInstruction = '//p[@class="grey"]';
const dropAFile = '//h2/span[contains(text(),"Drop a file")]';
const browseForFile = '//label[contains(text(),"browse for a file.")]';
const setupNewInstrumentClose = '(//mat-dialog-container//mat-icon)[1]';
const setupNewInstrumentCancel = '(//span[contains(text(),"Cancel")])[2]';
const setupNewInstumentSendinsformation = '//button/span[contains(text(),"Send Information")]';

const clearedInstrumentmanufacturer = '//form/div/div[1]//mat-select//span[contains(text(),"Instrument manufacturer")]';
const customName = '//input[contains(@formcontrolname,"customName")]';
const serialNumber = '//input[contains(@formcontrolname,"serialNumber")]';
const instrumentModelDropdown = '//mat-select[contains(@aria-label,"Instrument model")]//span[contains(text()," Instrument model")]';
const setupInstrumentSubHeader = '//*[normalize-space((text())="Please provide the manufacturer’s information' + ' (e.g., Instructions for Use, insert) for this instrument. It will be available to you to set up in Unity within a few days.")]';

const dontSeeAnalyte = '//span[contains(text(),"analyte?")]';
const addAnInstrumentLink = '//span[contains(text(),"Add an Instrument")]';
const addAControlLink = '//span[contains(text(),"Add a Control")]';
const addAnAnalyteLink = '//span[contains(text(),"Add an Analyte")]';
const multipleInstrumentModel = './/br-select[@formcontrolname = "instrumentModel"]//*[@id = "multipleData"]';

const instrumentManufacturerList3 = '(.//mat-select[@role = "listbox"])[3]';
const selectedFilesEle = './/div[contains(@class,"filename title")]';
const invalidFileError = './/small[contains(@class,"red")]';

const departmenticon = '//div[contains(@class,"lab-setup-header")]//*[name()="svg"]/*[name()="g"]';
const allListOptions = './/mat-option';
const defaultInstruments = './/mat-form-field//mat-select//span[contains(text(),"Instrument manufacturer")]';
const userErrorMessage = 'LoginComponent.NoTest';
const connectivityIcon = 'div.connectivity-link';
const decimalPlacesSelectedValue = './/div[@class="mat-select-value"]/span/span';
const decimalPlacesArrow = 'div.mat-select-arrow-wrapper';
const decimalValues = './/mat-option/span';
const decimalPlaceDrpdwn = 'mat-select-4';

const editThisInstrumentLink = '//span[contains(text(),"Edit this Instrument")]';
const backArrow = '//button[contains(@class,"backArrow")]';
const addDeptLink = '//span[contains(text(),"Add a Department")]';

const goToDept = '//unext-nav-hierarchy//li[1]/a[1]';
const goToSettings = '//unext-nav-current-location//h4';
const addInstrumentButtonDeptPage = './/button//span[contains(text(),"Add an Instrument")]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';
const addInstrumentPage = '//button[@id="spc_gotoAddInstrument"]';
const lotCardExpiringCount = '//*[contains(@class,"expiring-count")]';
const lotCardExpiringProdNameAll = './/span[contains(@class, "link-text")]';
const editanalyte = '//unext-analyte-data-entry//span[contains(text(),"Edit this analyte")]';
const meanL1 = './/div[contains(@class, "level-1")]//mat-row[1]/mat-cell[2]';
const welcomeHeader = '//h4[contains(text(),"Hello,")]';
const dataEntryHeader = '//*[contains(text(),"How will you be providing data to Unity?")]';
const dataEntryInfo = '//*[contains(text(),"How will you be providing data to Unity?")]//following::div[@class="info-tooltip-component"][1]';
const summaryDataEntry = '//*[text()="Summary"]//preceding::div[3]';
const pointDataEntry = '//*[text()="Point"]//preceding::div[3]';
const groupedByInfoHeader = '//*[contains(text(),"Are your instruments grouped by departments?")]';
const groupedByInfo = '//*[contains(text(),"Are your instruments grouped by departments?")]//following::div[@class="info-tooltip-component"][1]';
const groupByDept = '//*[text()="Yes, by department"]//preceding::div[3]';
const groupByNoDept = '//*[text()="We have no departments"]//preceding::div[3]';
const RCHeader = '//*[contains(text(),"Unity can track results by your reagent and calibrator lot")]';
const RCInfo = '//*[contains(text(),"Unity can track results by your reagent and calibrator lot")]//following::div[@class="info-tooltip-component"][1]';
const trackByRCYes = '//*[contains(text(),"Unity can track results by your reagent and calibrator lot")]//following::div[3]';
const trackByRCNo = '//*[contains(text(),"Unity can track results by your reagent and calibrator lot")]//following::div[8]';
const deciamlHeader = '//*[contains(text(),"How many decimal places do you use to display run data?")]';
const decimalDropdown = '//*[@aria-label="Decimal places"]';
const letsGoBtn = '//*[contains(text(),"Let\'s go!")]';


const EC = browser.ExpectedConditions;

export class NewLabSetup {
  
  async clickAddAnAnalyte() {
    library.logStep('Click On Add A Analyte');
    let flag = true;
    try {
      const ele = await element(by.xpath(addAnAnalyteLink));
      await browser.wait(EC.elementToBeClickable(ele), 8888);
      await ele.click();
    } catch (error) {
      flag = false;
      assert.fail('Click on Add An Analyte Failed\n\n'+error);
    }
    await library.waitLoadingImageIconToBeInvisible();
    return flag;
  }
  
  async clickAddAControl() {
    library.logStep('Click On Add A Control');
    let flag = true;
    try {
      const ele = await element(by.xpath(addAControlLink));
      await browser.wait(EC.elementToBeClickable(ele), 8888);
      await ele.click();
    } catch (error) {
      flag = false;
      assert.fail("Click On Add A Control Failed\n\n"+error);
    }
    await library.waitLoadingImageIconToBeInvisible();
    return flag;
  }
  
  verifyWelcomePage(firstname, lastname) {
    let result1;
    let icon, hello, subTitle, question1, summary, point, question2, yes, no, question3,
      yesT, noT, question4, decimalInput, decimalLabel, letsGo = false;
    return new Promise((resolve) => {
      const labSetupIcon = element(by.xpath(labSetupSettingIcon));
      const helloMsg = element(by.xpath(helloMessage));
      const subTitleMsg = element(by.xpath(subTitleMessage));
      const questionData = element(by.xpath(questionDataEntry));
      const summaryTxt = element(by.xpath(summaryText));
      const pointTxt = element(by.xpath(pointText));
      const questionInst = element(by.xpath(questionInstrument));
      const yesByDept = element(by.xpath(yesByDepartment));
      const noByDept = element(by.xpath(noDepartments));
      const questionTrck = element(by.xpath(questionTrack));
      const yesTrck = element(by.xpath(yesTrack));
      const noTrck = element(by.xpath(noTrack));
      const questionDcml = element(by.xpath(questionDecimal));
      const decimalPlacesTxtbox = element(by.xpath(decimalPlacesSelectedValue));
      const decimalPlacesLbl = element(by.xpath(decimalPacesLabel));
      const letsGoBtn = element(by.id(letsGoButton));
      labSetupIcon.isDisplayed().then(function () {
        icon = true;
        library.logStep('Lab Setup icon displayed');
        console.log('icon' + icon);
      });
      helloMsg.isDisplayed().then(function () {
        helloMsg.getText().then(function (helloText) {
          if (helloText.includes('Hello, ') && helloText.includes(firstname)) {
            hello = true;
            library.logStep('Hello message displayed');
            console.log('hello' + hello);
          }
        });
      });
      subTitleMsg.isDisplayed().then(function () {
        subTitleMsg.getText().then(function (subTitle_Msg) {
          if (subTitle_Msg === 'Lets set up some basic information. You can always change the defaults in Settings.') {
            subTitle = true;
            library.logStep('Lab Setup message displayed');
            console.log('subTitle' + subTitle);
          }
        });
      });
      questionData.isDisplayed().then(function () {
        questionData.getText().then(function (question1Msg) {
          if (question1Msg.includes('How will you be providing data to Unity?')) {
            question1 = true;
            library.logStep('Data Entry question displayed');
            console.log('question1' + question1);
          }
        });
      });
      summaryTxt.isDisplayed().then(function () {
        summaryTxt.getText().then(function (summaryOption) {
          if (summaryOption.includes('Summary') && summaryOption.includes('e.g. monthly')) {
            summary = true;
            library.logStep('Summary Data Entry option displayed');
            console.log('summary' + summary);
          }
        });
      });
      pointTxt.isDisplayed().then(function () {
        pointTxt.getText().then(function (pointOption) {
          if (pointOption.includes('Point') && pointOption.includes('e.g daily')) {
            point = true;
            library.logStep('Point Data Entry option displayed');
            console.log('point' + point);
          }
        });
      });
      questionInst.isDisplayed().then(function () {
        questionInst.getText().then(function (question2Msg) {
          if (question2Msg.includes('Are your instruments grouped by departments?')) {
            question2 = true;
            library.logStep('Department question displayed');
            console.log('question2' + question2);
          }
        });
      });
      yesByDept.isDisplayed().then(function () {
        yesByDept.getText().then(function (yesDept) {
          if (yesDept.includes('Yes, by department')) {
            yes = true;
            library.logStep('Department yes option displayed');
            console.log('yes' + yes);
          }
        });
      });
      noByDept.isDisplayed().then(function () {
        noByDept.getText().then(function (noDept) {
          if (noDept.includes('We have no departments')) {
            no = true;
            library.logStep('Department no option displayed');
            console.log('no' + no);
          }
        });
      });
      library.scrollToElement(questionInst);
      questionTrck.isDisplayed().then(function () {
        questionTrck.getText().then(function (question3Msg) {
          if (question3Msg.includes('Unity can track results by your reagent and calibrator lot numbers for more '
            + 'precise analysis and troubleshooting. Would you like to track this information?')) {
            question3 = true;
            library.logStep('Track result question displayed');
            console.log('question3' + question3);
          }
        });
      });
      yesTrck.isDisplayed().then(function () {
        yesTrck.getText().then(function (yesTr) {
          if (yesTr.includes('Yes')) {
            yesT = true;
            library.logStep('Track result yes option displayed');
            console.log('yesT' + yesT);
          }
        });
      });
      noTrck.isDisplayed().then(function () {
        noTrck.getText().then(function (noTr) {
          if (noTr.includes('No')) {
            noT = true;
            library.logStep('Track result no option displayed');
            console.log('noT' + noT);
          }
        });
      });
      library.scrollToElement(questionTrck);
      questionDcml.isDisplayed().then(function () {
        questionDcml.getText().then(function (question4Msg) {
          if (question4Msg.includes('How many decimal places do you use to display run data?')) {
            question4 = true;
            library.logStep('Decimal Places question displayed');
            console.log('question4' + question4);
          }
        });
      });
      decimalPlacesTxtbox.isDisplayed().then(function () {
        decimalPlacesTxtbox.getText().then(function (value) {
          console.log(value);
          if (value.includes('2')) {
            decimalInput = true;
            library.logStep('Decimal Places textbox displayed');
            console.log('decimalInput' + decimalInput);
          }
        });
      });
      decimalPlacesLbl.isDisplayed().then(function () {
        decimalPlacesLbl.getText().then(function (value) {
          if (value.includes('decimal places')) {
            decimalLabel = true;
            library.logStep('Decimal Places label displayed');
            console.log('decimalLabel' + decimalLabel);
          }
        });
      });
      library.scrollToElement(questionDcml);
      letsGoBtn.isDisplayed().then(function () {
        letsGo = true;
        library.logStep('Lets Go Button displayed');
        console.log('letsGo' + letsGo);
      });
      if (icon === true && hello === true && subTitle === true && question1 === true && summary === true &&
        point === true && question2 === true && yes === true && no === true && question3 === true && yesT === true
        && noT === true && question4 === true && decimalInput === true && decimalLabel === true && letsGo === true) {
        result1 = true;
        resolve(result1);
      }
    });
  }

  verifyToolTipDataEntry() {
    let result, infoIcon, infoText = false;
    return new Promise((resolve) => {
      const toolTipDataEntry = findElement(locatorType.XPATH, infoToolTipDataEntry);
      toolTipDataEntry.isDisplayed().then(function () {
        library.clickJS(toolTipDataEntry);
        infoIcon = true;
        library.logStep('Info icon is displayed');
        browser.wait(element(by.xpath(toolTipText)).isPresent());
        const toolTipText1 = element(by.xpath(toolTipText));
        toolTipText1.isDisplayed().then(function () {
          toolTipText1.getText().then(function (tooltip) {
            if (tooltip.includes('In a point mode you enter the value for each test run, generally daily or more frequently.'
              + 'In summary mode, you enter values (mean, SD and number of data points) for a set of test runs, often monthly.'
              + ' If you will need to do both, first select the mode you use most frequently, then later after setup, you may '
              + 'change the setting to the other mode.')) {
              infoText = true;
              library.logStep('Info Text displayed');
            }
          });
        });
      });
      if (infoIcon === true && infoText === true) {
        result = true;
        resolve(result);
      }
    });
  }

  verifyToolTipDept() {
    let result, infoIcon, infoText = false;
    return new Promise((resolve) => {
      const toolTipDept = findElement(locatorType.XPATH, infoToolTipDept);
      toolTipDept.isDisplayed().then(function () {
        library.clickJS(toolTipDept);
        infoIcon = true;
        library.logStep('Info icon is displayed');
        const toolTipText2 = element(by.xpath(toolTipText));
        toolTipText2.isDisplayed().then(function () {
          toolTipText2.getText().then(function (tooltip) {
            if (tooltip.includes('Larger labs may have separate departments such as Chemistry, Pathology, etc.'
              + ' If you have a small- to medium-sized lab, you may not need to group your instruments this way.')) {
              infoText = true;
              library.logStep('Info Text displayed');
            }
          });
        });
      });
      if (infoIcon === true && infoText === true) {
        result = true;
        resolve(result);
      }
    });
  }

  verifyToolTipTrack() {
    let result, infoIcon, infoText = false;
    return new Promise((resolve) => {
      const question1 = findElement(locatorType.XPATH, trackUnityQ);
      library.scrollToElement(question1);
      const toolTipTrack = element(by.xpath(infoToolTipTrack));
      toolTipTrack.isDisplayed().then(function () {
        library.clickJS(toolTipTrack);
        infoIcon = true;
        library.logStep('Info icon is displayed');
        const toolTipText3 = element(by.xpath(toolTipText));
        toolTipText3.isDisplayed().then(function () {
          toolTipText3.getText().then(function (tooltip) {
            if (tooltip.includes('If you select Yes, you will be asked for lot numbers for your calibrators and reagents during setup.'
              + ' You will then receive notices on the dashboard when calibrators and reagents are about to expire and be able to monitor '
              + 'lot changes on a Levey-Jennings chart to help in troubleshooting.')) {
              infoText = true;
              library.logStep('Info Text displayed');
            }
          });
        });
      });
      if (infoIcon === true && infoText === true) {
        result = true;
        resolve(result);
      }
    });
  }

  verifySummaryIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const summaryRadioBtn = findElement(locatorType.XPATH, summaryRadioButton);
      summaryRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          summaryRadioBtn.click();
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyPointIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const pointRadioBtn = findElement(locatorType.XPATH, pointRadioButton);
      pointRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          library.clickJS(pointRadioBtn);
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyYesByDepartmentIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const yesByDepartmentRadioBtn = findElement(locatorType.XPATH, yesByDepartmentRadioButton);
      yesByDepartmentRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          library.clickJS(yesByDepartmentRadioBtn);
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyNoDepartmentIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const noDepartmentRadioBtn = findElement(locatorType.XPATH, noDepartmentsRadioButton);
      noDepartmentRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          noDepartmentRadioBtn.click();
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyYesTrackIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const question1 = findElement(locatorType.XPATH, trackUnityQ);
      library.scrollToElement(question1);
      const yesTrackRadioBtn = element(by.xpath(yesTrack));
      yesTrackRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          yesTrackRadioBtn.click();
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyNoTrackIsSelected() {
    let result = false;
    return new Promise((resolve) => {
      const question1 = findElement(locatorType.XPATH, trackUnityQ);
      library.scrollToElement(question1);
      const noTrackRadioBtn = element(by.xpath(noTrack));
      noTrackRadioBtn.getAttribute('class').then(function (value) {
        if (value.includes('checked')) {
          result = true;
        } else {
          library.clickJS(noTrackRadioBtn);
          result = true;
        }
        resolve(result);
      });
    });
  }

  verifyInstPageHeader() {
    let result = false;
    return new Promise((resolve) => {
      const instPageHeader = findElement(locatorType.XPATH, departmentSetupPageHeader);
      instPageHeader.isDisplayed().then(function () {
        instPageHeader.getText().then(function (instPageHeaderText) {
          if (instPageHeaderText.includes('Add instruments to')) {
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  verifyDefaultValueDecimalPlace(defaultVal) {
    let result = false;
    return new Promise((resolve) => {
      const question1 = findElement(locatorType.XPATH, trackUnityQ);
      const question2 = element(by.xpath(howManyDecimalQ));
      library.scrollToElement(question1);
      library.scrollToElement(question2);
      const defaultDecimal = element(by.xpath(decimalDefaultVal));
      defaultDecimal.getAttribute('value').then(function (decimal) {
        console.log(decimal);
        result = true;
        library.logStep('Default Decimal Value is 2');
        resolve(result);
        library.logStep('Default value diplsyed is ' + decimal);
      });
    });
  }

  verifyDecimalValues(inputData) {
    let flag4 = false;
    let result, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {

      const defaultDecimal = findElement(locatorType.XPATH, decimalDefaultVal);
      defaultDecimal.clear();
      defaultDecimal.sendKeys(inputData.Decimal2Char);
      library.logStep('Value enterd in decimal field ' + inputData.Decimal2Char);
      let clickOnOtherElement = element(by.xpath(questionDecimal));
      library.clickJS(clickOnOtherElement);
      const error = element(by.xpath(decimalErrorMsg));
      if (error.isDisplayed()) {
        library.logStep('Error message displayed - Value can not be more than 4  ');
        flag1 = true;
      } else {
        library.logFailStep('Error message not displayed - Value can not be more than 4');
        flag1 = false;
      }
      defaultDecimal.clear();
      defaultDecimal.sendKeys(inputData.OutOfRangeVal);
      library.logStep('Value enterd in decimal field ' + inputData.OutOfRangeVal);
      clickOnOtherElement = element(by.xpath(questionDecimal));
      library.clickJS(clickOnOtherElement);
      const error1 = element(by.xpath(decimalErrorMsg));
      if (error1.isDisplayed()) {
        library.logStep('Error message displayed - Value can not be more than 4  on entering out of range value. ');
        flag2 = true;
      } else {
        library.logFailStep('Error message not displayed - Value can not be more than 4 on entering out of range value.');
        flag2 = false;
      }
      defaultDecimal.clear();
      defaultDecimal.sendKeys(inputData.AlphabetsSCharaters);
      library.logStep('Value enterd in decimal field ' + inputData.AlphabetsSCharaters);
      clickOnOtherElement = element(by.xpath(questionDecimal));
      library.clickJS(clickOnOtherElement);
      const error2 = element(by.xpath(decimalErrorMsgReq));
      if (error2.isDisplayed()) {
        library.logStep('User is able to enter special characters and alphabets in decimal feild. ');
        flag3 = true;
      } else {
        library.logFailStep('User is not able to enter special characters and alphabets in decimal feild.');
        flag3 = false;
      }
      defaultDecimal.clear();
      defaultDecimal.sendKeys(inputData.ValidDecimal);
      library.logStep('Value enterd in decimal field ' + inputData.ValidDecimal);
      clickOnOtherElement = element(by.xpath(questionDecimal));
      library.clickJS(clickOnOtherElement);
      const letsGo = element(by.xpath(letsGoButton));
      letsGo.isEnabled().then(function (status) {
        if (status === true) {
          flag4 = true;
          library.logStep('On entering valid decimal Lets Go button is enabled.');
        } else {
          library.logFailStep('On entering valid decimal Lets Go button is not enabled.');
          flag4 = false;
        }
        if (flag1 === flag2 === flag3 === flag4 === true) {
          result = true;
          resolve(result);
        } else {//
          result = false;
          resolve(result);
        }
      });
    });
  }

  verifyIncreaseDecreaseArrow(val) {
    let result = false;
    return new Promise((resolve) => {
      const defaultDecimal = element(by.xpath(decimalDefaultVal));
      defaultDecimal.clear();
      defaultDecimal.sendKeys(val);
      library.logStep('Value enterd in decimal field ' + val);
      result = true;
      resolve(result);
    });
  }

  selectNoDepartmentRadio() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(7000);
      const noDepartmentRadioBtn = element(by.xpath(noDepartmentsRadioButton));
      library.clickAction(noDepartmentRadioBtn);
      browser.sleep(5000);
      flag = true;
      library.logStep('We have no department radio button is selected');
      resolve(flag);
    });
  }

  verifyAddInstrumentPopupDisplayed() {
    let flag = false;
    return new Promise((resolve) => {

      const popupInstrument = element(by.xpath(addInstrumentPage));
      if (popupInstrument.isDisplayed()) {
        library.logStep('Add Instrument page is displayed.');
        flag = true;
      } else {
        library.logFailStep('Add Instrument page is not displayed.');
        flag = false;
      }
      resolve(flag);
    });
  }

  verifyAddDepartmentPopupDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const popupInstrument = findElement(locatorType.XPATH, addDepartmentPopup);
      if (popupInstrument.isDisplayed()) {
        library.logStep('Add Department popup is displayed.');
        flag = true;
      } else {
        library.logFailStep('Add Department popup is not displayed.');
        flag = false;
      }
      resolve(flag);
    });

  }

  verifyAddInstrumentUI() {
    const flag = false;
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      uiElements.set('Instrument icon', instrumentIcon);
      uiElements.set('Instrument Header', instrumentHeader);
      uiElements.set('Instrument Dropdown', instrumentDropdown);
      uiElements.set('Dont See Your Instrument', dontSeeInstrumentLink);
      uiElements.set('Cancle Button', cancleButtonAddInstrument);
      uiElements.set('Add Instrument Button', addInstrumentButton);
      uiElements.forEach(function (key, value) {
        const eleUI = findElement(locatorType.XPATH, key);
        browser.wait(element(by.xpath(key)).isPresent()).then(function () {
          library.scrollToElement(eleUI);
          if (key === instrumentDropdown) {
            const list = element.all(by.xpath(instrumentDropdown));
            list.count().then(function (elementCount) {
              flag1 = false;
              if (elementCount === 4) {
                library.logStep('Total 4 instrument dropdown is displayed.');
                flag1 = true;
                resolve(true);
              } else {
                library.logFailStep('Total ' + elementCount + ' instrument dropdown is displayed.');
                flag1 = false;
                resolve(false);
              }
            });
          } else {
            flag2 = false;
            if (eleUI.isDisplayed()) {
              library.logStep(value + ' is displayed.');
              flag2 = true;
              resolve(true);
            } else {
              library.logFailStep(value + ' is not displayed.');
              flag2 = false;
              resolve(false);
            }
          }
        });
      });
    });
  }


  verifyManufacturererNameSorting() {
    let flag = false;
    return new Promise((resolve) => {
      const manufatureNameArrow = findElement(locatorType.XPATH, manufacturerDrpdwn);
      library.clickJS(manufatureNameArrow);
      library.logStep('Intrument manufacturer dropdown clicked.');
      const options = element(by.xpath(allOption));
      const list = new Array();
      options.each(function (ele) {
        ele.getText(function (text) {
          list.push(text);
        });
      });
      const sortedList = list.sort();
      if (sortedList === list) {
        flag = true;
        library.logStep('Intrument Manufacturer name is sorted');
        resolve(flag);
      } else {
        flag = false;
        library.logStep('Intrument Manufacturer name is not sorted');
        resolve(flag);
      }
    });
  }

  selectManufacturerName(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(manufacturerDrpdwn))), 120000, 'Element is not visible');
      const manufatureNameArrow = findElement(locatorType.XPATH, manufacturerDrpdwn);
      library.clickJS(manufatureNameArrow);
      library.logStep('Intrument manufacturer dropdown clicked.');
      const selectName = element(by.xpath('//mat-option/span[contains(text(),"' + manufacturerName + '")]'));
      library.clickJS(selectName);
      library.logStep(manufacturerName + ' is selected');
      const instrumentModelEle = findElement(locatorType.XPATH, instrumentModelDropdown);
      const customNameEle = element(by.xpath(customName));
      const serialNumberEle = element(by.xpath(serialNumber));
      if (instrumentModelEle.isDisplayed() && customNameEle.isDisplayed() && serialNumberEle.isDisplayed()) {
        flag = true;
        library.logStep('Instrument mODEL, Custom Name, Serial Number is populated');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep('Instrument Model, Custom Name, Serial Number is not populated');
        resolve(flag);
      }
    });
  }
  clickOnAnotherInstrument() {
    let flag = false;
    return new Promise((resolve) => {
      const anotherEle = element(by.xpath(anotherInstrumentLink));
      library.clickJS(anotherEle);
      library.logStep('Another Instrument Link clicked');
      const another = element(by.xpath(manufacturerDrpdwnAnotherInstrument));
      if (another.isDisplayed()) {
        flag = true;
        library.logStep('One more instrument manufacturer is populated on clicking another instrument link.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep('One more instrument manufacturer is not populated on clicking another instrument link.');
        resolve(flag);
      }
    });
  }
  verifyAllValidFileUpload(validFile) {
    let flag = false;

    return new Promise((resolve) => {
      validFile.forEach(function (key, value) {
        const fileUpload = value;
        const absolutePath = path.resolve(__dirname, fileUpload);
        const link = findElement(locatorType.XPATH, dontSeeInstrumentLink);
        library.clickJS(link);
        library.logStep('Dont see your analyte link is clicked.');
        browser.sleep(3000);
        library.logStep('Browse for a file link is clicked.');
        const input = element(by.xpath('//input[@type="file"]'));
        browser.executeScript('arguments[0].style.display = "block";', input);
        input.sendKeys(absolutePath);

        const selectedFiles = findElement(locatorType.XPATH, selectedFilesEle);
        selectedFiles.isPresent().then(function (status) {

          library.logStepWithScreenshot(key + ' Files Added to upload for new instrument', 'FilesAddedToUploadForNewInstrument');

          const sendInfoBtn = findElement(locatorType.XPATH, setupNewInstumentSendinsformation);
          sendInfoBtn.isDisplayed().then(function (displayed) {
            library.logStep('Send Information button is enabled');

            flag = true;
            const cancel = element(by.xpath(setupNewInstrumentCancel));
            library.clickJS(cancel);
            resolve(flag);
          }).catch(function () {
            flag = false;
            library.logFailStep(key + ' File are not Added to upload for new instrument');
            resolve(flag);
          });
        });
      });

    });
  }

  verifyAllValidFileUploadAnalyte(validFile) {
    let flag = false;

    return new Promise((resolve) => {
      validFile.forEach(function (key, value) {
        const fileUpload = value;
        const absolutePath = path.resolve(__dirname, fileUpload);
        const anotherEle = findElement(locatorType.XPATH, dontSeeAnalyte);
        library.clickJS(anotherEle);
        library.logStep('Dont See your Analyte Link clicked');
        browser.sleep(6000);
        library.logStep('Browse for a file link is clicked.');
        const input = element(by.xpath('//input[@type="file"]'));
        browser.executeScript('arguments[0].style.display = "block";', input);
        input.sendKeys(absolutePath);

        const selectedFiles = findElement(locatorType.XPATH, selectedFilesEle);
        selectedFiles.isPresent().then(function (status) {

          library.logStepWithScreenshot(key + ' Files Added to upload for new instrument', 'FilesAddedToUploadForNewInstrument');

          const sendInfoBtn = findElement(locatorType.XPATH, setupNewInstumentSendinsformation);
          sendInfoBtn.isDisplayed().then(function (displayed) {
            library.logStep('Send Information button is enabled');

            flag = true;
            const cancel = element(by.xpath(setupNewInstrumentCancel));
            library.clickJS(cancel);
            resolve(flag);
          }).catch(function () {
            flag = false;
            library.logFailStep(key + ' File are not Added to upload for new instrument');
            resolve(flag);
          });
        });
      });

    });
  }
  clickOnDontSeeYourInstrument() {
    let flag = false;
    return new Promise((resolve) => {
      const anotherEle = findElement(locatorType.XPATH, dontSeeInstrumentLink);
      library.clickJS(anotherEle);
      library.logStep('Dont See your instrument Link clicked');
      const model = findElement(locatorType.XPATH, setupNewInstrument);
      if (model.isDisplayed()) {
        flag = true;
        library.logStep('Setup a new instrument model is displayed.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep('Setup a new instrument model is not displayed.');
        resolve(flag);
      }
    });
  }


  verifySetupNewInstrumentUI() {
    let flag = false;
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      uiElements.set('Instrument icon', setupNewInstrumentHeader);
      uiElements.set('Instrument Header', setupNewInstrumentInstruction);
      uiElements.set('Instrument Dropdown', dropAFile);
      uiElements.set('Another Instrument Link', browseForFile);
      uiElements.set('Dont See Your Instrument', setupNewInstrumentClose);
      uiElements.set('Cancle Button', setupNewInstrumentCancel);
      uiElements.set('Add Instrument Button', setupNewInstumentSendinsformation);
      uiElements.forEach(function (key, value) {
        const eleUI = element(by.xpath(key));
        if (eleUI.isDisplayed()) {
          flag = true;
          library.logStep(value + ' is displayed.');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep(value + ' is not displayed.');
          resolve(flag);
        }
      });
    });
  }

  clickCancelOnNewSetup() {
    let flag = false;
    return new Promise((resolve) => {
      const cancel = findElement(locatorType.XPATH, setupNewInstrumentCancel);
      library.clickJS(cancel);
      browser.sleep(3000);
      flag = true;
      library.logStep('Setup a new instrument model is canceled.');
      resolve(flag);
    }).catch(function () {
      flag = false;
      library.logFailStep('Setup a new instrument model is not canceled');
    });
  }


  clickCloseOnNewInstrumentSetup() {
    let flag = false;
    return new Promise((resolve) => {
      const close = findElement(locatorType.XPATH, setupNewInstrumentClose);
      library.clickJS(close);
      browser.sleep(5000);
      flag = true;
      library.logStep('Setup a new instrument model is closed.');
      resolve(flag);
    }).catch(function () {
      flag = false;
      library.logFailStep('Setup a new instrument model is not closed');
    });
  }

  addInstrument(manufacturerName, instrumentmodel, customNameVal, serialNumberVal) {
    let flag = false;
    return new Promise((resolve) => {
      const manufatureNameArrow = findElement(locatorType.XPATH, '(//mat-select//div/span[contains(text(),"Instrument manufacturer")])[1]');
      library.clickJS(manufatureNameArrow);
      library.logStep('Intrument manufacturer dropdown clicked.');
      const selectName = findElement(locatorType.XPATH, '//mat-option/span[contains(text()," ' + manufacturerName + '")]');
      library.scrollToElement(selectName);
      library.clickJS(selectName);
      library.logStep(manufacturerName + ' is selected');
      browser.sleep(10000);
      const instrumentModelEle = findElement(locatorType.XPATH, '(//mat-select//div/span[contains(text(),"Instrument model")])[1]');
      library.clickJS(instrumentModelEle);
      library.logStep('Intrument model dropdown clicked.');
      const selectModel = findElement(locatorType.XPATH, '//mat-option/span[contains(text(),"' + instrumentmodel + '")]');
      library.scrollToElement(selectModel);
      library.clickJS(selectModel);
      library.logStep(instrumentmodel + ' is selected');
      const customNameEle = findElement(locatorType.XPATH, customName);
      const serialNumberEle = element(by.xpath(serialNumber));
      library.scrollToElement(customNameEle);
      library.clickJS(customNameEle);
      customNameEle.sendKeys(customNameVal);
      library.clickJS(serialNumberEle);
      serialNumberEle.sendKeys(serialNumberVal);
      library.logStep('Custom Name ' + customName + ' is entered.');
      library.logStep('Serial Number ' + serialNumber + ' is entered.');
      const enabledAddInstrument = element(by.xpath(addInstrumentButton));
      library.scrollToElement(enabledAddInstrument);
      enabledAddInstrument.isDisplayed().then(function (status) {
        flag = true;
        library.logStep('Add Instrument is enabled.');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logFailStep('Add Instrument is disabled.');
        resolve(flag);
      });
    });
  }

  verifyCancelButtonFunctionality() {
    let flag1 = false;
    return new Promise((resolve) => {
      const clearedValue = findElement(locatorType.XPATH, clearedInstrumentmanufacturer);
      library.scrollToElement(clearedValue);
      if (clearedValue.isDisplayed()) {
        flag1 = true;
        library.logStep('Fields are cleared on clicking cancel button');
        resolve(flag1);
      } else {
        flag1 = false;
        library.logFailStep('Fields are not cleared on clicking cancel button');
        resolve(flag1);
      }
    });
  }

  verifyInstrumentNameSorting() {
    let flag = false;
    return new Promise((resolve) => {
      const instrumentModelArrow = findElement(locatorType.XPATH, instrumentModelDropdown);
      library.clickJS(instrumentModelArrow);
      library.logStep('Intrument model dropdown clicked.');
      const options = element(by.xpath(allOption));
      const list = new Array();
      options.each(function (ele) {
        ele.getText(function (text) {
          list.push(text);
        });
      });
      const sortedList = list.sort();
      for (let i = 0; i < sortedList.length; i++) {
        if (sortedList[i] === list[i]) {
          flag = true;
          library.logStep('Intrument Model is sorted');
          resolve(flag);
        } else {
          flag = false;
          library.logStep('Intrument Model is not sorted');
          resolve(flag);
        }
      }
    });
  }

  verifyCustomNameValidation(maxChar, spclChar) {
    let flag, flag1, flag2 = false;
    return new Promise((resolve) => {
      const custName = findElement(locatorType.XPATH, customName);
      custName.sendKeys(maxChar);
      custName.getAttribute('class').then(function (className) {
        if (className.includes('invalid')) {
          flag1 = true;
          library.logStepWithScreenshot('Custom Name highlighted in red on entering more than 20 characters', 'CustomName');
        } else {
          flag1 = true;
          library.logFailStep('Custom Name highlighted in red on entering more than 20 characters');
        }
        custName.clear();
        custName.sendKeys(spclChar);
        custName.getAttribute('class').then(function (class_Name) {
          if (class_Name.includes('invalid')) {
            flag2 = true;
            library.logStepWithScreenshot('Custom Name highlighted in red on entering special characters', 'CustomName');
          } else {
            flag2 = true;
            library.logFailStep('Custom Name highlighted in red on entering special characters');
          }
          if (flag1 === true && flag2 === true) {
            flag = true;
            resolve(flag);
          } else {
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }
  enterSerialNumber(serialNum) {
    let flag = false;
    return new Promise((resolve) => {
      const serialNo = findElement(locatorType.XPATH, serialNumber);
      serialNo.sendKeys(serialNum);
      library.logStep(serialNumber + ' serial no is entered.');
      flag = true;
      resolve(flag);
    });
  }

  verifySerialNoValidation(maxChar, spclChar) {
    let flag, flag1, flag2 = false;
    return new Promise((resolve) => {
      const serialNo = findElement(locatorType.XPATH, serialNumber);
      serialNo.sendKeys(maxChar);
      serialNo.getAttribute('maxlength').then(function (text) {
        if (text === '50') {
          flag1 = true;
          library.logStepWithScreenshot('Serial no accepts  50 Alphanumeric characters.', 'CustomName');
        } else {
          flag1 = false;
          library.logFailStep('Serial no accepts more than 50 Alphanumeric characters.');
        }
        serialNo.clear();
        serialNo.sendKeys(spclChar);
        serialNo.getAttribute('class').then(function (className) {
          if (className.includes('invalid')) {
            flag2 = true;
            library.logStepWithScreenshot('Serial Number is highlighted in red on entering special characters', 'CustomName');
          } else {
            flag2 = false;
            library.logFailStep('Serial Number is highlighted in red on entering special characters');
          }
          console.log('flag1 ' + flag1 + ' and flag2 ' + flag2);
          if (flag1 === true && flag2 === true) {
            flag = true;
            resolve(flag);
          } else {
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  verifyHeaderSubHeaderText() {
    return new Promise((resolve) => {
      let flag = false;
      const header = findElement(locatorType.XPATH, setupNewInstrumentHeader);
      const subHeader = element(by.xpath(setupInstrumentSubHeader));
      if (header.isDisplayed() && subHeader.isDisplayed()) {
        flag = true;
        library.logStepWithScreenshot('Header: Set up a new instrument and SubHeader: '
          + 'Please provide the manufacturer’s information (e.g., Instructions for Use, insert) for this '
          + 'instrument. It will be available to you to set up in Unity within a few days displayed', 'HeaderSubHeaderText');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep('Header: Set up a new instrument and SubHeader: Please provide the manufacturer’s '
          + 'information (e.g., Instructions for Use, insert) for this instrument. It will be available to you to '
          + 'set up in Unity within a few days is not displayed');
        resolve(flag);
      }
    });
  }

  browseFileToUpload(fileToUpload) {
    let flag = false;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    return new Promise((resolve) => {

      browser.sleep(2000);
      library.logStep('Browse for a file link is clicked.');

      const input = findElement(locatorType.XPATH, '//input[@type="file"]');
      browser.executeScript('arguments[0].style.display = "block";', input);
      input.sendKeys(absolutePath);
      browser.sleep(5000);
      flag = true;
      library.logStepWithScreenshot('Files added for new instrument', 'FilesForNewInstrument');
      resolve(flag);
    });
  }

  verifyFileisAddedToUpload() {
    let flag = false;
    return new Promise((resolve) => {
      const selectedFiles = findElement(locatorType.XPATH, selectedFilesEle);
      selectedFiles.isPresent().then(function (status) {
        if (status) {
          flag = true;
          library.logStepWithScreenshot('Files Added to upload for new instrument', 'FilesAddedToUploadForNewInstrument');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Files are not Added to upload for new instrument');
          resolve(flag);
        }
      });
    });
  }

  VerifyErrorInvalidFileExtention() {
    let flag = false;
    return new Promise((resolve) => {
      const errorEle = findElement(locatorType.XPATH, invalidFileError);
      errorEle.getText().then(function (text) {
        if (text.includes('File extension is incorrect.')) {
          flag = true;
          library.logStepWithScreenshot('Files with invalid Extentions are not added', 'InvalidFileExtentionError');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Files with invalid Extentions are added');
          resolve(flag);
        }
      });
    });
  }

  VerifyErrorMaxFileSize() {
    let flag = false;
    return new Promise((resolve) => {
      const errorEle = findElement(locatorType.XPATH, invalidFileError);
      errorEle.getText().then(function (text) {
        console.log(text);
        if (text.includes('Maximum file size exceeds 7 MB.')) {
          flag = true;
          library.logStepWithScreenshot('Files More than 8 MB are not added', 'MaxFileSizeError');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Files More than 8 MB are added');
          resolve(flag);
        }
      });
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

  selectInstrumentName(instrumentName) {
    let flag = false;
    return new Promise((resolve) => {
      const instrumentNameArrow = findElement(locatorType.XPATH, instrumentModelDropdown);
      library.scrollToElement(instrumentNameArrow);
      library.clickJS(instrumentNameArrow);
      library.logStep('Intrument Model dropdown clicked.');
      const selectName = element(by.xpath('//mat-option/span[contains(text(),"' + instrumentName + '")]'));
      library.clickJS(selectName);
      library.logStep(instrumentName + ' is selected');
      flag = true;
      resolve(flag);
    });
  }

  verifyAddInstrumentButtonDisable() {
    let flag = false;
    return new Promise((resolve) => {
      const buttonEle = element(by.xpath(addInstrumentButtonDisabled));
      library.scrollToElement(buttonEle);
      buttonEle.isDisplayed().then(function (status) {
        console.log(status);
        if (status) {
          flag = true;
          library.logStepWithScreenshot('Add Instrument is disabled.', 'ButtonDisabled');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Add Instrument is not  disabled.');
          resolve(flag);
        }
      });
    });
  }

  verifyAddInstrumentButtonEnabled() {
    let flag = false;
    return new Promise((resolve) => {
      const buttonEle = element(by.xpath(addInstrumentButton));
      buttonEle.isEnabled().then(function (status) {
        if (status) {
          flag = true;
          library.logStepWithScreenshot('Add Instrument is enabled.', 'ButtonEnabled');
          resolve(flag);
        } else {
          flag = false;
          library.logStep('Add Instrument is not enabled.');
          resolve(flag);
        }
      });
    });
  }

  verifyInstrumentControlAnalyteCreated(created) {
    let flag = false;
    return new Promise((resolve) => {
      const createdEle = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + created + '")]');
      library.scrollToElement(createdEle);
      if (createdEle.isDisplayed()) {
        flag = true;
        library.logStep(created + ' is added successfully.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep(created + ' is not added.');
        resolve(flag);
      }
    });
  }

  verifyInsrumentControlNameDisplayedUnderneathCustomName(instrName) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(20000);
      const createdEle = element(by.xpath('//mat-nav-list//div[contains(text(),"' + instrName + '")]'));
      library.scrollToElement(createdEle);
      if (createdEle.isDisplayed()) {
        flag = true;
        library.logStep(instrName + ' is displayed Underneath Custom Name.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep(instrName + ' is not displayed Underneath Custom Name.');
        resolve(flag);
      }
    });

  }
  verifyInsrumentNameDisplayedUnderneathCustomName(instrName) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(20000);
      const createdEle = element(by.xpath('//mat-nav-list//span[contains(text(),"' + instrName + '")]'));
      library.scrollToElement(createdEle);
      if (createdEle.isDisplayed()) {
        flag = true;
        library.logStep(instrName + ' is displayed Underneath Custom Name.');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep(instrName + ' is not displayed Underneath Custom Name.');
        resolve(flag);
      }
    });

  }



  clickLetsGoButton() {
    let letgo, newdept, result = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      const letsGoBtn = element(by.xpath(letsGoButton));
      letsGoBtn.isDisplayed().then(function () {
        library.scrollToElement(letsGoBtn);
        library.clickJS(letsGoBtn);
        browser.sleep(35000);
        letgo = true;
        resolve(letgo);
        library.logStep('Lets Go Button clicked.');
        console.log('Lets Go Button clicked.');


        const newDept = element(by.xpath(departmenticon));
        browser.executeScript('arguments[0].style.height="24px"', newDept).then(function () {
          newdept = true;
          result = true;
          library.logStep('Add Departments screen is displayed');
          console.log('Add Departments screen is displayed');
        });
      });
      if (result === true && newdept === true) {

        resolve(result);
      }
    });
  }

  selectYesDepartmentRadio() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(30000);
      const noDepartmentRadioBtn = element(by.xpath(yesByDepartmentRadioButton));
      library.clickAction(noDepartmentRadioBtn);
      flag = true;
      library.logStep('We have department radio button is selected');
      resolve(flag);
    });
  }

  navigateTO(to) {
    let flag = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const sideNav = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + to + '")]');
      library.clickJS(sideNav);
      flag = true;
      library.logStep('User is navigated to ' + to);
      resolve(flag);
    });
  }

  navigateTODept(to) {
    let flag = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const sideNav = findElement(locatorType.XPATH, '//mat-nav-list//div[text()=" ' + to + ' "]');
      library.clickJS(sideNav);
      flag = true;
      library.logStep('User is navigated to ' + to);
      resolve(flag);
    });
  }
  navigateTOSecondVal(to) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(2500);
      const sideNav = findElement(locatorType.XPATH, '(//mat-nav-list//div[contains(text(),"' + to + '")])[2]');
      library.clickJS(sideNav);
      flag = true;
      library.logStep('User is navigated to ' + to);
      resolve(flag);
    });
  }

  clickBackArrow() {
    let flag = false;
    return new Promise((resolve) => {
      const backArrowEle = element(by.xpath(backArrow));
      library.clickJS(backArrowEle);
      library.logStep('Back arrow clicked.');
      flag = true;
      resolve(flag);
    });
  }
  async clickAddAnInstrument() {
    library.logStep('Add an instrument link is clicked.');
    let flag = true;
    try {
      const addInstru = await element(by.xpath(addAnInstrumentLink));
      await browser.wait(EC.elementToBeClickable(addInstru), 8888);
      await addInstru.click();
    } catch (error) {
      flag = false;
      assert.fail("Click On Add An Instrument Failed\n\n"+error);
    }
    await library.waitLoadingImageIconToBeInvisible();
    return flag;
  }
  verifyListSortedAlphabetically(selectDropdown) {
    let result = false;
    const originalList: Array<string> = [];
    const tempList: Array<string> = [];
    let sortedTempList = [];
    let count = 0;
    return new Promise((resolve) => {
      const select = element(by.xpath('(//mat-select//span[contains(text(),"' + selectDropdown + '")])[1]'));
      library.clickJS(select);
      const ele = element.all(by.xpath(allListOptions));
      let i = 0;
      ele.each(function (optText) {
        optText.getText().then(function (text) {
          originalList[i] = text.toUpperCase();
          tempList[i] = text.toUpperCase();

          i++;
        });
      }).then(function () {
        sortedTempList = tempList.sort();
        for (const j in sortedTempList) {
          if (originalList[j] === sortedTempList[j]) {
            count++;
          }
        }
        if (count === originalList.length) {
          result = true;
          library.logStep(selectDropdown + ' list is Alphabetically sorted');
          log4jsconfig.log().info(selectDropdown + ' list is Alphabetically sorted');
          resolve(result);
        } else {
          result = false;
          library.logFailStep(selectDropdown + ' list is not sorted');
          log4jsconfig.log().info(selectDropdown + ' list is not sorted');
          resolve(result);
        }
      });
    });
  }

  clickAddInstrumentsButton() {
    let flag = false;
    return new Promise((resolve) => {
      const scroll = element(by.xpath('//span[contains(text(),"Another instrument ? ")]'));
      const addInstru = element(by.xpath(addInstrumentButton));
      library.clickJS(addInstru);
      flag = true;
      library.logStep('Add instruments Button is clicked.');
      resolve(flag);
    });
  }
  goToSettings() {
    let flag = false;
    return new Promise((resolve) => {
      const lab = findElement(locatorType.XPATH, goToSettings);
      library.clickJS(lab);
      flag = true;
      library.logStep('Go to settings is clicked.');
      resolve(flag);
    });
  }
  goToListOfDepartments() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      const lab = element(by.xpath(goToDept));
      browser.sleep(3000);
      library.clickJS(lab);
      flag = true;
      library.logStep('Go to list of Departments is clicked.');
      resolve(flag);
    });
  }

  verifyDefaultInstrumentManufacturerDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(4000);
      element.all(by.xpath(defaultInstruments)).count().then(function (InstruManuEle) {
        if (InstruManuEle <= 4) {
          library.logStep('Default Instrument Manufacturer Count is: ' + InstruManuEle);
          log4jsconfig.log().info('Default Instrument Manufacturer Count is: ' + InstruManuEle);
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Default Instrument Manufacturer Count is: ' + InstruManuEle);
          log4jsconfig.log().info('Default Instrument Manufacturer Count is: ' + InstruManuEle);
          result = false;
          resolve(result);
        }
      });
    });
  }

  verifyInstrumentModelDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const multiInstModel = findElement(locatorType.XPATH, multipleInstrumentModel);
      if (multiInstModel.isDisplayed()) {
        result = true;
        library.logStep('Instrument Model Displayed');
        log4jsconfig.log().info('Instrument Model Displayed');
        resolve(result);
      } else {
        result = false;
        library.logFailStep('Instrument Model Not Displayed');
        log4jsconfig.log().info('Instrument Model Not Displayed');
        resolve(result);
      }
    });
  }

  verifyCustomInstrumentNameDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const customNameEle = element(by.xpath(customName));
      customNameEle.isDisplayed().then(function () {
        result = true;
        library.logStep('Instrument Custom name displayed');
        log4jsconfig.log().info('Instrument Custom name displayed');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Instrument Custom name not displayed');
        log4jsconfig.log().info('Instrument Custom name not displayed');
        resolve(result);
      });
    });
  }

  verifySerialNumberDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const serialNum = element(by.xpath(serialNumber));
      serialNum.isDisplayed().then(function () {
        result = true;
        library.logStep('Serial number displayed');
        log4jsconfig.log().info('Serial number displayed');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Serial number not displayed');
        log4jsconfig.log().info('Serial number not displayed');
        resolve(result);
      });
    });
  }

  verifyAnotherInstrumentAdded() {
    let result = false;
    return new Promise((resolve) => {
      const instrumentNameEle = element.all(by.xpath(defaultInstruments));
      instrumentNameEle.count().then(function (Count) {
        if (Count >= 5) {
          library.logStep('Instrument added');
          log4jsconfig.log().info('Instrument added');
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Unable to add Instrument');
          log4jsconfig.log().info('Unable to add Instrument');
          result = false;
          resolve(result);
        }
      });
    });
  }

  clickOnCancelInstrument() {
    let result = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancleButtonAddInstrument));
      cancelBtn.isDisplayed().then(function () {
        library.clickJS(cancelBtn);
        library.logStep('Cancel Button Clicked');
        log4jsconfig.log().info('Cancel Button Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Unable to click cancel button');
        log4jsconfig.log().info('Unable to click cancel button');
        result = false;
        resolve(result);
      });
    });
  }

  clickOnThirdInstrumentManufacturer() {
    let result = false;
    return new Promise((resolve) => {
      const openListIcn = findElement(locatorType.XPATH, instrumentManufacturerList3);
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        browser.sleep(10000);
        result = true;
        library.logStep('Third Instrument Manufacturer list clicked');
        log4jsconfig.log().info('Third Instrument Manufacturer  list clicked');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Unable to click Instrument Manufacturer list');
        log4jsconfig.log().info('Unable to click Instrument Manufacturer list');
        resolve(result);
      });
    });
  }


  verifyMaxCharacterLimit(fieldFormControlName) {
    let flag = false;
    return new Promise((resolve) => {
      const fieldName = element(by.xpath('.//input[contains(@formcontrolname, "' + fieldFormControlName + '")]'));
      fieldName.isDisplayed().then(function () {
        fieldName.sendKeys('abcdefghijklmnopqrstuvwxyz0123456789-abcdefghijklmnopqrstuvwxyz0123456789').then(function () {
          fieldName.getAttribute('maxlength').then(function (text) {
            console.log('text.length ' + text);
            if (text === '50') {
              console.log('If :' + text);
              flag = true;
              library.logStep('Pass: Maximum character count is 50 for ' + fieldFormControlName);
              resolve(flag);
            } else {
              console.log('If :' + text);
              flag = false;
              library.logFailStep('Fail: Maximum character count is 50 for ' + fieldFormControlName);
              resolve(flag);
            }
          });
        });
      });
    });
  }

  selectInstrumentManufacturer(manufacturerName) {
    let result = false;
    return new Promise((resolve) => {
      const manufactOpt = findElement(locatorType.XPATH, './/mat-option/span[contains(text(), "' + manufacturerName + '")]');
      library.scrollToElement(manufactOpt);
      manufactOpt.click().then(function () {
        result = true;
        library.logStep('Instrument Manufacturer Selected: ' + manufacturerName);
        log4jsconfig.log().info('Instrument Manufacturer: ' + manufacturerName);
        resolve(result);
      }).catch(function () {
        result = false;
        library.logFailStep('Unable to select the Instrument Manufacturer');
        log4jsconfig.log().info('Unable to select the Instrument Manufacturer');
        resolve(result);
      });
    });
  }

  verifyUserErrorMessage() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const userError = element(by.id(userErrorMessage));
      userError.isDisplayed().then(function () {
        userError.getText().then(function (message) {
          if (message === 'We are waiting for the administrator to finish setting up your lab before you can start using Unity.') {
            console.log('Correct Error message is displayed');
            flag = true;
            library.logStep('Correct Error message is displayed');
            resolve(flag);
          }
        });
      });
    });
  }

  verifyConnectivityIconPresent() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const connectivity = element(by.css(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        console.log('Connectivity Icon is displayed');
        flag = true;
        library.logStep('Connectivity Icon is displayed');
        resolve(flag);
      }).catch(function () {
        flag = false;
        console.log('Connectivity Icon is not displayed');
        library.logFailStep('Connectivity Icon is not displayed');
        resolve(flag);
      });
    });
  }

  verifyDecimalPlaceValue(defaultVal) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const question1 = element(by.xpath(questionInstrument));
      const question2 = element(by.xpath(trackUnityQ));
      library.scrollToElement(question1);
      library.scrollToElement(question2);
      const defaultDecimal = element(by.xpath(decimalPlacesSelectedValue));
      defaultDecimal.getText().then(function (decimal) {
        if (parseInt(decimal, 10) === defaultVal) {
          result = true;
          library.logStep('Correct Decimal Value is displayed');
          console.log('Correct Decimal Value is displayed ' + decimal);
          resolve(result);
        } else {
          result = false;
          library.logFailStep('Incorrect Decimal Value is displayed');
          console.log('Incorrect Decimal Value is displayed ' + decimal);
          resolve(result);
        }
      });
    });
  }

  verifyDecimalPlacesDropdownValues() {
    let result = true;
    let actualList: Array<number>;
    actualList = [];
    let expectedList: Array<number>;
    expectedList = [0, 1, 2, 3, 4];
    return new Promise((resolve) => {
      const options = element.all(by.xpath(decimalValues));
      options.each(function (optionText) {
        optionText.getText().then(function (text) {
          console.log(text);
          actualList.push(parseInt(text, 10));
        });
      }).then(function () {
        for (let i = 0; i < expectedList.length; i++) {
          console.log(actualList[i]);
          console.log(expectedList[i]);
          if (actualList[i] !== expectedList[i]) {
            result = false;
            console.log('Incorrect Decimal values are displayed');
            library.logStep('Incorrect Decimal values are displayed');
            log4jsconfig.log().info('Incorrect Decimal values are displayed');
            resolve(result);
          }
        }
      });
    });
  }

  selectFirstDecimalValue() {
    let result = false;
    return new Promise((resolve) => {
      const options = element.all(by.xpath(decimalValues));
      options.first().isDisplayed().then(function () {
        options.first().click();
        result = true;
        console.log('first dropdown value selected');
        library.logStep('first dropdown value selected');
        log4jsconfig.log().info('first dropdown value selected');
        resolve(result);
      });
    });
  }

  clickDecimalPlacesDropDownArrow() {
    let result = false;
    return new Promise((resolve) => {
      const drpdwnArrow = element(by.css(decimalPlacesArrow));
      drpdwnArrow.isDisplayed().then(function () {
        drpdwnArrow.click();
        result = true;
        resolve(result);
      });
    });
  }

  clickEditThisInstrument() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const editInstrument = element(by.xpath(editThisInstrumentLink));

      library.clickJS(editInstrument);
      flag = true;
      library.logStep('Edit this instrument link is clicked.');
      resolve(flag);
    });
  }

  setDecimalPlaces(decimalCount) {
    let flag = false;
    return new Promise((resolve) => {
      library.waitForElementToBePresent(decimalPlaceDrpdwn);
      const decimalDrpdwn = element(by.xpath(decimalPlaceDrpdwn));
      library.clickJS(decimalDrpdwn);
      const decimalOption = element(by.xpath('//mat-option/span[contains(text(),"' + decimalCount + '")]'));
      library.logStep('Decimal places set to ' + decimalCount);
      flag = true;
      resolve(flag);
    });
  }

  clickUpdateButton() {
    let flag = false;
    return new Promise((resolve) => {
      const update1 = element(by.xpath('//button//span[contains(text(),"Update")]'));
      library.clickJS(update1);
      library.logStep('Update button clicked.');
      flag = true;
      resolve(flag);
    });
  }

  async clickLabName() {
    let flag = false;
    const update1 = await element(by.xpath('//unext-nav-bar-top//unext-nav-header//unext-nav-current-location/div'));
    await browser.wait(EC.elementToBeClickable(update1), 8888);
    await update1.click();
    library.logStep('Go to department setting');
    flag = true;
    return flag;
  }

  async clickAddADepartment() {
    library.logStep('Click Add A Department');
    let flag = true;
    try {
      const addDept: ElementFinder = await element(by.xpath(addDeptLink));
      await browser.wait(EC.elementToBeClickable(addDept), 8888);
      await addDept.click();
      await library.waitLoadingImageIconToBeInvisible();
    } catch (error) {
      flag = false;
      assert.fail("Click On Add A Department Failed\n\n"+error);
    }
    return (flag);
  }

  verifyLeftNavigationListSorted() {
    let result = false;
    const originalList: Array<string> = [];
    const tempList: Array<string> = [];
    let sortedTempList = [];
    let count = 0;
    return new Promise((resolve) => {
      const select = element(by.xpath('//mat-nav-list/unext-nav-side-bar-link/span/div[1]'));
      library.clickJS(select);
      const ele = element.all(by.xpath(allListOptions));
      let i = 0;
      ele.each(function (optText) {
        optText.getText().then(function (text) {
          originalList[i] = text.toUpperCase();
          tempList[i] = text.toUpperCase();

          i++;
        });
      }).then(function () {
        sortedTempList = tempList.sort();
        console.log(originalList);
        console.log(sortedTempList);

        for (const j in sortedTempList) {
          if (originalList[j] === sortedTempList[j]) {
            count++;
            library.logStep(originalList[i] + ' displayed.');
          }
        }
        if (count === originalList.length) {
          result = true;
          library.logStepWithScreenshot('Left navigation list is Alphabetically sorted', 'sorted');
          resolve(result);
        } else {
          result = false;
          library.logFailStep('Left navigation list is not sorted');
          resolve(result);
        }
      });
    });
  }

  clickAddAnInstrumentButton() {
    let flag = false;
    return new Promise((resolve) => {
      const addInst = findElement(locatorType.XPATH, addInstrumentButtonDeptPage);
      library.clickJS(addInst);
      library.logStep('Add an Instrument button clicked.');
      flag = true;
      resolve(flag);
    });
  }



  verifyExpiringLotCards() {
    let status = false;
    return new Promise((resolve) => {

      const expiredLotsCard = '//*[contains(@class,"expiring-lots-panel-component")]';
      browser.wait(EC.presenceOf(element(by.xpath(expiredLotsCard))), 10000);
      element(by.xpath(expiredLotsCard)).isDisplayed().then(function () {
        library.logStepWithScreenshot('Expired Lots Card is Present ', 'Expired Lots Card Present');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Expired Lots Card is not Present ', 'Expired Lots Card Not Present');
        status = false;
        resolve(status);
      })
    })
  }

  verifyRepetativeLotNumbersCountDisplayed(lotName, RepetatedCount) {
    return new Promise((resolve) => {
      if (RepetatedCount == '0') {
        const repetativeLotWithCount = '//span[contains(text(),"' + lotName + '")]';
        element(by.xpath(repetativeLotWithCount)).isDisplayed().then(function () {
          library.logStepWithScreenshot('Expired lot is displayed with zero or no repetation count', 'Element is Present');
          resolve(true);
        }).catch(function () {
          library.logStepWithScreenshot('Repetative expired lot is not displayed zero or no repetation count', 'Element is  Not Present');
          resolve(false);
        })
      } else {
        const repetativeLotWithCount = '//span[contains(text(),"' + lotName + '")]//child::span[contains(text(),"' + RepetatedCount + '")]';
        element(by.xpath(repetativeLotWithCount)).isDisplayed().then(function () {
          library.logStepWithScreenshot('Repetative expired lot is displayed with repetation count', 'Element is Present');
          resolve(true);
        }).catch(function () {
          library.logStepWithScreenshot('Repetative expired lot is not displayed with repetation count', 'Element is  Not Present');
          resolve(false);
        })
      }

    })
  }

  verifyOverlayForLots(RepetatedCount) {
    return new Promise((resolve) => {
      const OnMultipleInstru = '//*[contains(@class,"mat-radio-button spec_onMultiple")]';
      if (RepetatedCount == '0') {
        element(by.xpath(OnMultipleInstru)).getAttribute("class").then(function (isDisabled) {
          if (isDisabled.includes("disabled")) {
            library.logStepWithScreenshot('On multiple instruments option is disabled by default', 'Element is Present');
            resolve(true);
          }
        }).catch(function () {
          library.logStepWithScreenshot('On multiple instruments option is not disabled by default', 'Element is  Not Present');
          resolve(false);
        })
      } else {
        const onThisInstru = '//*[contains(@class,"mat-radio-button spec_onThis")]';
        element(by.xpath(onThisInstru)).getAttribute("class").then(function (isDisabled) {
          if (isDisabled.includes("disabled")) {
            library.logStepWithScreenshot('On this instrument option is disabled by default', 'Element is Present');
            resolve(true);
          }
        }).catch(function () {
          library.logStepWithScreenshot('On this instrument option is not disabled by default', 'Element is  Not Present');
          resolve(false);
        })
        element(by.xpath(OnMultipleInstru)).getAttribute("class").then(function (isDisabled) {
          if (isDisabled.includes("disabled")) {
            library.logStepWithScreenshot('Failed : On multiple instrument option is disabled by default', 'Element is not Present');
            resolve(fail);
          }
        });
      }
    })
  }

  verifyExpiringCardCount(expectedCount) {
    let status = false;
    return new Promise((resolve) => {
      browser.wait(EC.presenceOf(element(by.xpath(lotCardExpiringCount))), 10000);
      const numberOfLots = element(by.xpath(lotCardExpiringCount));
      numberOfLots.isDisplayed().then(function () {
        numberOfLots.getText().then(function (lotCount) {
          element.all(by.xpath(lotCardExpiringProdNameAll)).count().then(function (count) {
            let c = count.toString();
            if (lotCount.includes(c) || lotCount.includes(expectedCount)) {
              console.log('count is ' + lotCount);
              status = true;
              resolve(true);
            } else {
              library.logFailStep('Expected Count is not matched');
              library.logStepWithScreenshot('Expected Count is not matched', 'Expected Count is not matched');
              resolve(false);
            }
          });
        });
      });
    });

  }

  clickOnProductNameOnExpiringLotCard(prodName) {
    let clicked = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const lotname = findElement(locatorType.XPATH, './/span[contains(text(),"' + prodName + '")]');
      lotname.click();
      resolve(true);
    });
  }

  verifyOverlayForRepetativeLotNumber(RepetatedCount) {
    return new Promise((resolve) => {
      const OnMultipleInstru = '//*[contains(@class,"mat-radio-button spec_onMultiple")]';
      const instrumentList = '//*[@class="instrument-name"]';
      if (RepetatedCount == '0') {
        element(by.xpath(OnMultipleInstru)).getAttribute("class").then(function (isDisabled) {
          if (isDisabled.includes("disabled")) {
            library.logStepWithScreenshot('On multiple instruments option is disabled by default', 'Element is Present');
            resolve(true);
          }
        }).catch(function () {
          library.logStepWithScreenshot('On multiple instruments option is not disabled by default', 'Element is  Not Present');
          resolve(false);
        })
      } else {
        const onThisInstru = '//*[contains(@class,"mat-radio-button spec_onThis")]';
        element(by.xpath(onThisInstru)).getAttribute("class").then(function (isDisabled) {
          if (isDisabled.includes("disabled")) {
            library.logFailStep('Failed : On this instrument option is disabled by default');
            resolve(false);
          }
          element(by.xpath(OnMultipleInstru)).isDisplayed().then(function () {
            element(by.xpath(instrumentList)).isDisplayed().then(function () {
              library.logStepWithScreenshot('On multiple instruments option is enabled with instrument list', 'Element is Present');
              resolve(true);
            })
          });
        }).catch(function () {
          library.logStepWithScreenshot('On this instrument option is not diaplayed', 'Element is  Not Present');
          resolve(false);
        })
      }
    })
  }

  verifyControlChanged(lot) {
    let status = false;
    return new Promise((resolve) => {
      const ele = ' //span[contains(@class,"mat-small") and contains(text(),"' + lot + '")]';
      const elem = element(by.xpath(ele));
      elem.isPresent().then(
        function () {
          library.logStepWithScreenshot('Lot has been changed Successfully', 'Lot Changed');
        }, function () {
          library.logStepWithScreenshot('Lot has not changed', 'Lot not Changed');
        }
      );
    });
  }
  clickOnClearFieldIcon(itenName) {
    return new Promise((resolve) => {
      const clearFieldBtn = '//*[text()="' + itenName + '"]//ancestor::div[contains(@class,"panel-content-border")]//*[@mattooltip="Clear selection"]';
      const btn = element(by.xpath(clearFieldBtn));
      library.clickJS(btn);
      library.logStep('Clear field button is clicked for ' + itenName);
      library.logStepWithScreenshot('Clear field button is clicked', 'Done');
      resolve(true);
    });
  }

  clickOnClearFieldIconForAnalyte(analyteName) {
    return new Promise((resolve) => {
      const clearFieldBtnforAnalyte = '//*[contains(text(),"' + analyteName + '")]//preceding::button[1]';
      const btn = element(by.xpath(clearFieldBtnforAnalyte));
      library.clickJS(btn);
      library.logStep('Clear field button is clicked for ' + analyteName);
      library.logStepWithScreenshot('Clear field button is clicked', 'Done');
      resolve(true);
    });
  }

  verifyIsSelectedItemIsNotDisplayed(itemName) {
    return new Promise((resolve) => {
      element(by.xpath('//*[contains(text(),"' + itemName + '")]')).isDisplayed().then(function () {
        console.log('Failed : Dropdown is displayed after clicking on clear fields');
        library.logFailStep('Failed : Dropdown is displayed after clicking on clear fields');
        resolve(false);
      }).catch(function () {
        console.log('Dropdown is not displayed after clicking on clear fields');
        library.logStep('Dropdown is not displayed after clicking on clear fields');
        resolve(true);
      })
    });
  }

  clickEditThisAnalyte() {
    let flag = false;
    return new Promise((resolve) => {
      const addAnalytebtn = findElement(locatorType.XPATH, editanalyte);
      addAnalytebtn.isEnabled().then(function () {
        library.clickJS(addAnalytebtn);
        flag = true;
        library.logStep('Edit this Analyte link is clicked.');
        resolve(flag);
      });
    });
  }


  navigateToReagentLot(to) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(2500);
      const sideNav = element(by.xpath('//mat-nav-list//div/span[contains(text(),"' + to + '")]'));
      browser.wait(browser.ExpectedConditions.visibilityOf(sideNav), 20000);
      library.clickJS(sideNav);
      flag = true;
      library.logStep('User is navigated to ' + to);
      resolve(flag);
    });
  }
  waitForSummaryStatistics() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(2000);
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

  verifySelectReagentIsEnabled() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(2000);
      const reagentSel = element(by.xpath('//mat-select[@aria-label=" Reagent "]/div[@aria-hidden="true"]'));
      reagentSel.isDisplayed().then(function () {
        flag = true;
        library.logStep('Not able to select reagent');
        resolve(flag);
      }).catch(function () {
        flag = false;
        library.logStep('Not able to select reagent');
        resolve(flag);
      });
    });
  }

  verifyWelcomeScreenUI() {
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath("//unext-lab-setup-header[*]"))), 120000, 'Welcome screen elements are not displayed');
      uiElements.set('Welcome Page header', welcomeHeader);
      uiElements.set('Data entry type header', dataEntryHeader);
      uiElements.set('data entry type info', dataEntryInfo);
      uiElements.set('summary data entry radio button', summaryDataEntry);
      uiElements.set('Point data entry radio button', pointDataEntry);
      uiElements.set('Group by dept or not header', groupedByInfoHeader);
      uiElements.set('Group by dept or not info', groupedByInfo);
      uiElements.set('Group by dept radio button', groupByDept);
      uiElements.set('Group by No dept radio button', groupByNoDept);
      uiElements.set('Track By reagent and calibrator header', RCHeader);
      uiElements.set('Track By reagent and calibrator Info', RCInfo);
      uiElements.set('Track By reagent and calibrator - Yes radio Button', trackByRCYes);
      uiElements.set('Track By reagent and calibrator - No radio Button', trackByRCNo);
      uiElements.set('Select decimal places header', deciamlHeader);
      uiElements.set('Select decimal places dropdown', decimalDropdown);
      uiElements.set('Lets Go button', letsGoBtn);
      uiElements.forEach(function (key, value) {
        const eleUI = element(by.xpath(key));
        if (eleUI.isDisplayed()) {
          library.logStep(value + ' is displayed.');
          resolve(true);
        } else {
          library.logStepWithScreenshot('Failed : ' + value + ' is not displayed.', 'Element not displayed');
          library.logFailStep('Failed : ' + value + ' is not displayed.');
          resolve(false);
        }
      });
    });
  }
  verifyWelcomeUIOptionsSelectedByDefault() {
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      uiElements.set('summary data entry radio button', summaryDataEntry);
      uiElements.set('Group by dept radio button', groupByDept);
      uiElements.set('Track By reagent and calibrator - Yes radio Button', trackByRCYes);
      uiElements.forEach(function (key, value) {
        element(by.xpath(key)).isSelected().then(function () {
          console.log(value + 'is selected by default');
          library.logStep(value + 'is selected by default');
          resolve(true);
        }).catch(function () {
          console.log('Failed : ' + value + 'is selected by default');
          library.logStepWithScreenshot('Failed : ' + value + 'is selected by default', 'Element is not selected');
          resolve(false);
        })
      })
    });
  }

  selectDataEntryType(type) {
    return new Promise((resolve) => {
      if (type.includes("Summary")) {
        library.clickJS(element(by.xpath(summaryDataEntry)));
        library.logStep("Clicked on summary data entry type");
        console.log("Clicked on summary data entry type");
        resolve(true);
      } else {
        library.clickJS(element(by.xpath(pointDataEntry)));
        library.logStep("Clicked on point data entry type");
        console.log("Clicked on point data entry type");
        resolve(true);
      }
    });
  }

  selectIsGroupedByDept(isGroupByDept) {
    return new Promise((resolve) => {
      if (isGroupByDept.includes("Yes")) {
        library.clickJS(element(by.xpath(groupByDept)));
        library.logStep("Clicked on group by dept type");
        console.log("Clicked on group by dept type");
        resolve(true);
      } else {
        library.clickJS(element(by.xpath(groupByNoDept)));
        library.logStep("Clicked on group by no dept type");
        console.log("Clicked on group by no dept type");
        resolve(true);
      }
    });
  }
  selecttrackByCR(isTrackByCR) {
    return new Promise((resolve) => {
      if (isTrackByCR.includes("Yes")) {
        library.clickJS(element(by.xpath(trackByRCYes)));
        library.logStep("Clicked on track by calibrator and regaent lot");
        console.log("Clicked on track by calibrator and regaent lot");
        resolve(true);
      } else {
        library.clickJS(element(by.xpath(trackByRCNo)));
        library.logStep("Clicked on do not track by calibrator and regaent lot");
        console.log("Clicked on do not track by calibrator and regaent lot");
        resolve(true);
      }
    });
  }
  selectDecimalPoints(decimalPoints) {
    return new Promise((resolve) => {
      library.clickJS(element(by.xpath(decimalDropdown)));
      const selectDecimal = "(//span[contains(text(),'" + decimalPoints + "')])[1]";
      library.clickJS(element(by.xpath(selectDecimal)));
      library.logStep("Selected decimal Points : " + decimalPoints);
      console.log("Selected decimal Points : " + decimalPoints);
      resolve(true);
    });
  }
  veriifyLetsGoBtnIsEnabled() {
    return new Promise((resolve) => {
      const buttonEle = element(by.xpath(letsGoBtn))
      buttonEle.isEnabled().then(function (status) {
        if (status) {
          library.logStep('Let\' Go button is enabled by default');
          console.log('Let\' Go button is enabled by default');
          resolve(true);
        } else {
          library.logStepWithScreenshot('Failed : Let\' Go button is not enabled by default', 'Button is not enabled');
          library.logFailStep('Failed : Let\' Go button is enabled by defaul');
          console.log('Failed : Let\' Go button is enabled by default');
          resolve(false);
        }
      });
    });

  }
  clickOnLetsGoBtn() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(letsGoBtn))), 20000);
      library.clickJS(element(by.xpath(letsGoBtn)));
      library.logStep("Clicked on Lets Go button");
      console.log("Clicked on Lets Go button");
      resolve(true);
    });
  }
  verifySelectReagentLotNoCheckboxIsdisplayed() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath('//*[@formcontrolname="selectReagentLots"]'))), 20000);
      const selectReagentLotNoEle = element(by.xpath('//*[@formcontrolname="selectReagentLots"]'));
      selectReagentLotNoEle.isDisplayed().then(function () {
        console.log('Select reagent lot number checkbox is displayed');
        library.logStep('Select reagent lot number checkbox is displayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Select reagent lot number checkbox is not displayed');
        library.logFailStep('Failed : Select reagent lot number checkbox is not displayed');
        library.logStepWithScreenshot('Failed : Select reagent lot number checkbox is not displayed', 'Not displayed');
        resolve(false);
      });
    });
  }

  verifySelectCalibratorLotNoCheckboxIsDisplayed() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath('//*[@formcontrolname="defaultCalibrators"]'))), 20000);
      const selectReagentLotNoEle = element(by.xpath('//*[@formcontrolname="defaultCalibrators"]'));
      selectReagentLotNoEle.isDisplayed().then(function () {
        console.log('Select calibrator lot number checkbox is displayed');
        library.logStep('Select calibrator lot number checkbox is displayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Select calibrator lot number checkbox is not displayed');
        library.logFailStep('Failed : Select calibrator lot number checkbox is not displayed');
        library.logStepWithScreenshot('Failed : Select calibrator lot number checkbox is not displayed', 'Not displayed');
        resolve(false);
      });
    });
  }
}
