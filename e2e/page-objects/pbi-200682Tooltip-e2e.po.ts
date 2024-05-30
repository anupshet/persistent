//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const toottip = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]';
const LevelonToolTip = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div//div//span[contains(text(),"Level 1")]';
const levelvalue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div//div//span[contains(text(),"Level 1")]//following-sibling::strong';
const MonthValue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//unext-date[1]';
const Time = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//unext-date[2]';
const Mean = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[1]//span[text()="Mean"]';
const MeanValue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[1]//span[2][contains(@class,"value")]';
const SD = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[2]//span[text()="SD"]';
const SDValue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[2]//span[2][contains(@class,"value")]';
const CV = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[3]//span[text()="CV"]';
const CVvalue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[3]//span[2][contains(@class,"value")]';
const Zscore = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[4]//span[1][text()="Z Score"]';
const Zscorevalue = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[4]//span[2][contains(@class,"value")]';
const correctiveaction = '//div[@role="menu"]//p';
const warningReason = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[5]//div//span[2]';
const RejectedReason = '//div[@role="menu"]//div//div[contains(@class,"last-data-entry-popup ")]//div[2]//div[5]//div//span[1]';
export class multipoint {
  hoverOverLastEntryLabel(analyte, level) {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const lastEntryLabel = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + analyte + '")]/parent::div/following-sibling::div[contains(@class, "analyte-multi-point-component")]//div//span[contains(@class, "is-last-data-entry")])[' + level + ']'));
      library.scrollToElement(lastEntryLabel);
      lastEntryLabel.isDisplayed().then(function () {
        library.hoverOverElement(lastEntryLabel);
        library.logStepWithScreenshot('Mouse Hover on Last Entry Label', 'Mouse Hover on Last Entry Label');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Unable to Mouse Hover on Last Entry Label');
        resolve(false);
      });
    });
  }
  verifyToolTipDisplayed() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const toolTip = element(by.xpath(toottip));
      toolTip.isDisplayed().then(function () {
        library.logStepWithScreenshot('ToolTip displayed', 'ToolTip displayed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('ToolTip not displayed');
        status = false;
        resolve(status);
      });
    });
  }
  verifyDatetimeonTootTip(Datevalue, Timevalue) {
    let Date, time, result = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const date = element(by.xpath(MonthValue));
      const Time1 = element(by.xpath(Time));
      dashBoard.waitForElement();
      date.getText().then(function (value) {
        if (value.includes(Datevalue)) {
          library.logStepWithScreenshot('Date is present', 'Date details');
          Date = true;
          resolve(Date);
        }
        else {
          library.logStepWithScreenshot('Date is not Present', 'Date Details');
          resolve(false);
        }
      }).then(function () {
        Time1.getText().then(function (value) {
          if (value.includes(Timevalue)) {
            library.logStepWithScreenshot(' Time is present', 'Time details');
            time = true;
            resolve(time);
          }
          else {
            library.logStepWithScreenshot('Time is not Present', 'Time Details');
            resolve(false);
          }
        });
      }).then(function () {
        if (Date && time === true) {
          result = true;
          library.logStepWithScreenshot('Date and time value are displayed', 'Date and time value are displayed');
          resolve(result);
        }
      });
    });
  }
  VerifyZScorelabelOnTooltip() {
    dashBoard.waitForElement();
    let status = false;
    return new Promise((resolve) => {
      const Zscore1 = element(by.xpath(Zscore));
      Zscore1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Zscore Label is displayed', 'Zscore Label is displayed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Zscore Label is not displayed');
        status = false;
        resolve(status);
      });
    });
  }
  verifyZscoreValueonTooltip(Text) {
    dashBoard.waitForElement();
    let result = false;
    return new Promise((resolve) => {
      const Zscorevalue1 = element(by.xpath(Zscorevalue));
      Zscorevalue1.getText().then(function (value) {
        if (value.includes(Text)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('value for Zscore is verified', 'value for Zscore is verified');
        }
        else {
          library.logStepWithScreenshot('value for Zscore is not verified', 'value for Zscore is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifyActiononToolTip(Text) {
    dashBoard.waitForElement();
    let result = false;
    return new Promise((resolve) => {
      const correctiveaction1 = element(by.xpath(correctiveaction));
      correctiveaction1.getText().then(function (value) {
        if (value.includes(Text)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Action is verified', 'Action is verified');
        }
        else {
          library.logStepWithScreenshot('Action is not verified', 'Action is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifyWarningreasononToolTip(reason) {
    dashBoard.waitForElement();
    let result = false;
    return new Promise((resolve) => {
      const warningReason1 = element(by.xpath(warningReason));
      warningReason1.getText().then(function (value) {
        if (value.includes(reason)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Warning Reason is verified', 'Reason is verified');
        }
        else {
          library.logStepWithScreenshot('Reason is not verified', 'Reason is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifyRejectionreasononToolTip(reason) {
    dashBoard.waitForElement();
    let result = false;
    return new Promise((resolve) => {
      const RejectedReason1 = element(by.xpath(RejectedReason));
      RejectedReason1.getText().then(function (value) {
        if (value.includes(reason)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Rejected Reason is verified', 'Reason is verified');
        }
        else {
          library.logStepWithScreenshot('Reason is not verified', 'Reason is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }
  isvalueonTooltipDisplayed(Levelvaluetext, Meanvaluetext, SDvaluetext, CVvaluetext, Zscoretext) {
    let LevelLabel, Levelvalue, Meanlabel, Meanvalue, SDLabel, SDvalue, CVLabel, CVValue, Zscorelabel, ZscoreValue, result = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const LevelonToolTip1 = element(by.xpath(LevelonToolTip));
      const levelvalue1 = element(by.xpath(levelvalue));
      const Mean1 = element(by.xpath(Mean));
      const MeanValue1 = element(by.xpath(MeanValue));
      const SD1 = element(by.xpath(SD));
      const SDValue1 = element(by.xpath(SDValue));
      const CV1 = element(by.xpath(CV));
      const CVvalue1 = element(by.xpath(CVvalue));
      const Zscore1 = element(by.xpath(Zscore));
      const Zscorevalue1 = element(by.xpath(Zscorevalue));
      library.waitForElement(LevelonToolTip1);
      LevelonToolTip1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Level', 'Level');
        LevelLabel = true;
        resolve(LevelLabel);
      }).then(function () {
        levelvalue1.getText().then(function (value) {
          if (value.includes(Levelvaluetext)) {
            Levelvalue = true;
            resolve(Levelvalue);
            library.logStepWithScreenshot('Level value is verified', 'Level value is verified');
          }
          else {
            library.logStepWithScreenshot('Level value is not  verified', 'Level value is not  verified');
            Levelvalue = false;
            resolve(Levelvalue);
          }
        });
      }).then(function () {
        Mean1.isDisplayed().then(function () {
          library.logStepWithScreenshot('Mean Label is displayed', 'Mean Label is displayed');
          Meanlabel = true;
          resolve(Meanlabel);
        });
      }).then(function () {
        MeanValue1.getText().then(function (value) {
          if (value.includes(Meanvaluetext)) {
            Meanvalue = true;
            resolve(Meanvalue);
            library.logStepWithScreenshot('Mean value is verified', 'Mean value is verified');
          }
          else {
            library.logStepWithScreenshot('Mean value is not verified', 'Mean value is not verified');
            Meanvalue = false;
            resolve(Meanvalue);
          }
        });
      }).then(function () {
        SD1.isDisplayed().then(function () {
          library.logStepWithScreenshot('SD Label is displayed', 'SD Label is displayed');
          SDLabel = true;
          resolve(SDLabel);
        });
      }).then(function () {
        SDValue1.getText().then(function (value) {
          if (value.includes(SDvaluetext)) {
            SDvalue = true;
            resolve(SDvalue);
            library.logStepWithScreenshot('SD value is verified', 'SD value is verified');
          }
          else {
            library.logStepWithScreenshot('SD value is not verified', 'SD value is not verified');
            SDvalue = false;
            resolve(SDvalue);
          }
        });
      }).then(function () {
        CV1.isDisplayed().then(function () {
          library.logStepWithScreenshot('CV Label is displayed', 'CV Label is displayed');
          CVLabel = true;
          resolve(CVLabel);
        });
      }).then(function () {
        CVvalue1.getText().then(function (value) {
          if (value.includes(CVvaluetext)) {
            CVValue = true;
            resolve(CVValue);
            library.logStepWithScreenshot('CV value is verified', 'CV value is verified');
          }
          else {
            library.logStepWithScreenshot('CV value is not verified', 'CV value is not verified');
            CVValue = false;
            resolve(CVValue);
          }
        });
      }).then(function () {
        Zscore1.isDisplayed().then(function () {
          library.logStepWithScreenshot('Zscore Label is displayed', 'Zscore Label is displayed');
          Zscorelabel = true;
          resolve(Zscorelabel);
        })
      }).then(function () {
        Zscorevalue1.getText().then(function (value) {
          if (value.includes(Zscoretext)) {
            ZscoreValue = true;
            resolve(ZscoreValue);
            library.logStepWithScreenshot('value for Zscore is verified', 'value for Zscore is verified');
          }
          else {
            library.logStepWithScreenshot('value for Zscore is not verified', 'value for Zscore is not verified');
            ZscoreValue = false;
            resolve(ZscoreValue);
          }
        });
      }).then(function () {
        if (LevelLabel && Levelvalue && Meanlabel && Meanvalue && SDLabel && SDvalue && CVLabel && CVValue && Zscorelabel && ZscoreValue === true) {
          result = true;
          library.logStepWithScreenshot('Previous entered values are displayed', 'Previous entered values are displayed');
          resolve(result);
        }
      });
    });
  }
}
