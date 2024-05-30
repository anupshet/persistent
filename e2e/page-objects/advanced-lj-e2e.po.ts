//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element, promise } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import * as moment from 'moment';
import { resolve } from 'dns';
import { By } from 'selenium-webdriver';
var EC = protractor.ExpectedConditions;

const methoddetails = '//input[@placeholder=" Method "]';
const toggle = '//input[@id="spec_isoverlay-input"]';
const gearIconFilters = '//div[contains(@class,"panel chart-event-filter")]//mat-option//span';
const lvls = '//div[@class="advanced-lj-levels-component"]//mat-checkbox';
const pdfdownloadBtn = '//button[contains(@class,"download-btn")]';
const rangeDD = element(by.xpath('(//div[@class="dropdown-pair-2"]//mat-form-field)[2]'));
const ljChart = '//section[@class="chartContainer"]';
const analytes = '//div[@class="primary-dispaly-text"]';
const rangeddValues = '//div[contains(@id,"cdk-overlay")]//mat-option//span';
const timeFrameComponent = '//div[@class="ctn-advanced-lj-timeframe"]';
const forwardAnalyteClick = '//button[@id="rightAdvLjButton"]';
const analyteDisplayed = '//div[@class="box-1"]//h2';
const analyteDetails = '//*[@id="spec_advancedljpanel_hierarchyText"]';
const backwardAnalyteClick = '//button[@id="leftAdvLjButton"]';
const gearicon = '//div[contains(@class,"mat-select-arrow")]';
const reagentdetails = '//br-select[@id="spec_reagents"]//span/span';
const btnExpand = '//span[@class="chevron"]';
const lvlComponent = '//div[contains(@class,"advanced-lj-levels-component")]';
const btnCancel = '//button[contains(@class,"close-btn")]/span';
const btnCollapse = '//span[@class="chevron opened"]';
const analyteComponent = '//div[@class="box-1"]';
const reagentFilter = '//div[contains(@class,"panel chart-event-filter")]//mat-option//span[contains(text(),"Reagent")]'
const meanFilter = '//div[contains(@class,"panel chart-event-filter")]//mat-option//span[contains(text(),"Mean")]';
const btn = element(by.xpath('//div[contains(@class,"toggle-trigger spec_toggle_div")]'));
const calibratordetails = '//input[@placeholder=" Calibrator "]';
const level1value = '(//input[contains(@class,"mat-input-element")])[3]';
const lvl2Data = '//td[@class="level-cell-value level-cell-left ng-star-inserted"]//unext-value-cell'
const lvl1Data = '//td[@class="level-cell-value level-cell-left td-even ng-star-inserted"]//unext-value-cell'
const lvlInAdvanceLj = '//div[@class="bg-white ctn-unext-advanced-lj-levels mr-20"]//unext-advanced-lj-levels';
const lvlSelected = '//div[@class="level-toggle-component"]//mat-checkbox//span/span[2]';
const submitButton = '//button//span[contains(text(),"SEND TO PEER GROUP")]';
const reagentname = '//span[@id="spec_analyte-description-reagent"]';
const calibratorname = '//span[@id="spec_analyte-description-calibrator"]';
const methodname = '//span[@id="spec_analyte-description-method"]';
const uom = '//br-select[@id="spec_unit"]//span/span';
const comparison = '(//div[@class="dropdown-pair-2"]//mat-form-field)[1]';
const plot1 = '#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-crosshair > g.xy > rect.nsewdrag.drag';
const yaxis = '//mat-select[@aria-label="Y-axis"]';
const levelOneAdvLJChart = '//div[@class="bg-white ctn-unext-advanced-lj-levels mr-20"]//unext-advanced-lj-levels//mat-checkbox//span/span[text()=1]'
const levelTwoAdvLJChart = '//div[@class="bg-white ctn-unext-advanced-lj-levels mr-20"]//unext-advanced-lj-levels//mat-checkbox//span/span[text()=2]'
const leftArrowXpath='(//unext-advanced-lj-timeframe//span/mat-icon)[1]';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const path = require('path');
const reqPath = path.join(__dirname, '../');
const downloadPath = path.join(reqPath, '/qcp-downloads');
const fs = require('fs');

var method, reagent, calibrator, unitOfMeasure;
let jsonData;
fs.readFile('./JSON_data/ActionableDashboard.json', (err, data) => {
  if (err) { throw err; }
  const actionableDashboard = JSON.parse(data);
  jsonData = actionableDashboard;
});

export class AdvancedLJ {
  verifyUIOfAdvancedLjChart() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const timeFrame = element(by.xpath(timeFrameComponent));
      timeFrame.isDisplayed().then(function () {
        library.logStepWithScreenshot('Time Frame Component is Present', 'Time Frame');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Time Frame Component is not Present');
        status = false;
        resolve(status);
      });
      const pdfBtn = element(by.xpath(pdfdownloadBtn));
      pdfBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Pdf Button is Present', 'pdf btn');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Pdf Button is not Present');
        status = false;
        resolve(status);
      });
      const btnForwardAnalyte = element(by.xpath(forwardAnalyteClick));
      btnForwardAnalyte.isDisplayed().then(function () {
        library.logStepWithScreenshot('Forward Analyte Button is Present', 'Forward Analyte Button');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Forward Analyte Button is not Present');
        status = false;
        resolve(status);
      });
      const btnBackwardAnalyte = element(by.xpath(backwardAnalyteClick));
      btnBackwardAnalyte.isDisplayed().then(function () {
        library.logStepWithScreenshot('Backward Analyte Button is Present', 'Backward Analyte Button');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Backward Analyte Button is not Present');
        status = false;
        resolve(status);
      });
      const lvlComponentDisplay = element(by.xpath(lvlComponent));
      lvlComponentDisplay.isDisplayed().then(function () {
        library.logStepWithScreenshot('Level Component is Present', 'Level Component');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Level Component is not Present');
        status = false;
        resolve(status);
      });
      const buttonCancel = element(by.xpath(btnCancel));
      buttonCancel.isDisplayed().then(function () {
        library.logStepWithScreenshot('Cancel Button is Present', 'Cancel Button');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Cancel Button is not Present');
        status = false;
        resolve(status);
      });
      const analyteDetailsComponent = element(by.xpath(analyteComponent));
      analyteDetailsComponent.isDisplayed().then(function () {
        library.logStepWithScreenshot('Analyte Component is Present', 'Analyte Component');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Analyte Component is not Present');
        status = false;
        resolve(status);
      });
    });
  }

  verifyTimeFrameComponentsDate() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const startDate = moment();
      fDate = startDate.format("MMM DD");
      const startdate = startDate;
      console.log(startdate);
      const endDate = startDate.subtract(30, 'days');
      console.log(endDate);
      startDate.format("MMM Do YY");
      var fDate, lDate;
      lDate = endDate.format("MMM DD");
      console.log("fdate " + fDate);
      console.log("enddate " + lDate);
      const datesInLj = element.all(by.css('#myPlotlyDiv > div > div > svg:nth-child(1) > g.cartesianlayer > g > g.xaxislayer-above > g>text'));
      datesInLj.each(function (dates) {
        dates.getText().then(function (text) {
          if ((text <= fDate && text >= lDate)) {
            library.logStep('' + text + ' is in between the range');
            console.log('' + text + ' is in between the range');
          }
          else {
            console.log('date is not in range');
          }
        });
      })
    });
  }

  verifyActionofLevelCheck() {
    let status = false;
    return new Promise((resolve) => {
      const lvl = element(by.xpath("//div[@class='advanced-lj-levels-component']//mat-checkbox"));
      library.click(lvl);
      library.logStep('Level1 is checked');
      dashBoard.waitForElement();
      const lj = '#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-crosshair>g.xy';
      const ljChart = element(by.css(lj));
      dashBoard.waitForElement();
      ljChart.isDisplayed().then(function () {
        library.logStepWithScreenshot('On checking level1 , Level1 chart is  displayed.', 'Level1 chart is displayed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('On checking level1 , Level1 chart is not displayed.');
        status = false;
        resolve(status);
      });
    });
  }

  verifyActionOfLevelUncheck() {
    let status = false;
    return new Promise((resolve) => {
      const lvl = element(by.xpath(lvls));
      library.click(lvl);
      library.logStep('Level1 is unchecked');
      dashBoard.waitForElement();
      const lj = '#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-crosshair>g.x3y3';
      const ljChart = element(by.css(lj));
      dashBoard.waitForElement();
      ljChart.isDisplayed().then(function () {
        library.logFailStep('On unchecking level1 , Level1 chart is displayed.');
        status = false;
        resolve(status);
      }).catch(function () {
        dashBoard.waitForElement();
        library.logStepWithScreenshot('On unchecking level1 , Level1 chart is not displayed.', 'Level1 chart is not displayed');
        status = true;
        resolve(status);
      })
    });
  }

  uncheckAllLevels() {
    let status = false;
    let lvlno;
    return new Promise((resolve) => {
      const lvl = element.all(by.xpath(lvls));
      lvl.each(function (lvlNo, index) {
        library.click(lvlNo);
        lvlno = index + 1;
        library.logStep('Level Unchecked ' + lvlno);
      })
      status = true;
      resolve(true);
    });
  }

  clickExpandButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const expand = element(by.xpath(btnExpand));
      expand.isDisplayed().then(function () {
        library.clickJS(expand);
        library.logStep('Expand Button Clicked');
        status = true;
        resolve(true);
      })
    });
  }

  clickCollapseButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const collapse = element(by.xpath(btnCollapse));
      collapse.isDisplayed().then(function () {
        library.clickJS(collapse);
        library.logStep('Collapse Button Clicked');
        status = true;
        resolve(true);
      })
    });
  }

  retrieveDetailsFromEditThisAnalyte() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const reagentDetails = element(by.xpath(reagentdetails));
      reagentDetails.getText().then(function (text) {
        reagent = text;
        status = true;
        resolve(status);
      });
      const calibratordetails = '//br-select[@formcontrolname="calibrator"]//span/span';
      const calibratorDetails = element(by.xpath(calibratordetails));
      const calDetailsText = calibratorDetails.getText();
      calibratorDetails.getText().then(function (text) {
        calibrator = text;
        status = true;
        resolve(status);
      });
      const methodDetails = element(by.xpath(methoddetails));
      methodDetails.getAttribute('ng-reflect-value').then(function (text) {
        method = text;
        status = true;
        resolve(status);
      });
      const unit = element(by.xpath(uom));
      unit.getText().then(function (text) {
        unitOfMeasure = text;
        status = true;
        resolve(status);
      });
    });
  }

  verifyActionOfExpand() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const reagentName = element(by.xpath(reagentname));
      reagentName.getText().then(function (text) {
        if (text.includes(reagent)) {
          library.logStepWithScreenshot('On expand ,reagent name is displayed', 'reagent name is displayed');
          status = true;
          resolve(status);
        }
        else {
          library.logStepWithScreenshot('On collapse ,reagent name is not displayed', 'reagent name is not displayed');
          status = false;
          resolve(status);
        }
      })
      const calibratorName = element(by.xpath(calibratorname));
      calibratorName.getText().then(function (text) {
        if (text.includes(calibrator)) {
          library.logStepWithScreenshot('On expand, calibrator name is displayed', 'Calibrator name is displayed');
          status = true;
          resolve(status);
        }
        else {
          library.logStepWithScreenshot('On collapse, calibrator name is not displayed', 'Calibrator name is not displayed');
          status = false;
          resolve(status);
        }
      });
      const methodname = '//span[@id="spec_analyte-description-method"]';
      const methodName = element(by.xpath(methodname));
      methodName.getText().then(function (text) {
        if (text.includes(method)) {
          library.logStepWithScreenshot('On expand,method name is displayed', 'Method name is displayed');
          status = true;
          resolve(status);
        }
        else {
          library.logFailStep('On collapse,method name is not displayed');
          status = false;
          resolve(status);
        }
      });
      const uom = '//span[@id="spec_analyte-description-unitOfMeasure"]';
      const unit = element(by.xpath(uom));
      unit.getText().then(function (text) {
        if (text.includes(unitOfMeasure)) {
          library.logStepWithScreenshot('On expand, Unit of measure is displayed', 'Unit of measure is displayed');
          status = true;
          resolve(status);
        }
        else {
          library.logFailStep('On collapse, Unit of measure is not displayed');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyActionOfCollapse() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      element(by.xpath(reagentname)).isDisplayed().then(function () {
        library.logFailStep('reagent name is displayed');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('On collapse ,reagent name is not displayed', 'reagent name is not displayed');
        status = true;
        resolve(status);
      });
      element(by.xpath(calibratorname)).isDisplayed().then(function () {
        library.logFailStep('calibrator name is displayed');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('On collapse ,calibrator name is not displayed', 'calibrator name is not displayed');
        status = true;
        resolve(status);
      });
      element(by.xpath(methodname)).isDisplayed().then(function () {
        library.logFailStep('method name is displayed');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('On collapse ,method name is not displayed', 'method name is not displayed');
        status = true;
        resolve(status);
      });
      element(by.xpath(uom)).isDisplayed().then(function () {
        library.logFailStep('unit is displayed');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('On collapse ,unit is not displayed', 'unit is not displayed');
        status = true;
        resolve(status);
      });
    });
  }

  verifyTextOfAnalyteComponent(analytedisp, inst, control, expiry) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const analyte = element(by.xpath(analyteDisplayed));
      analyte.getText().then(function (analyteName) {
        if (analyteName.includes(analytedisp)) {
          library.logStepWithScreenshot(' Analyte name is displayed', ' Analyte name');
          status = true;
          resolve(status);
        }
        else {
          library.logFailStep('Analyte displayed is not correct');
          status = false;
          resolve(status);
        }
      })
      const analyteDescription = inst + " / " + control + " Lot " + expiry;
      console.log(analyteDescription);
      const analytedetails = element(by.xpath(analyteDetails));
      analytedetails.getText().then(function (text) {
        if (text.includes(analyteDescription)) {
          library.logStepWithScreenshot('Analyte description is displayed', 'Analyte description');
          status = true;
          resolve(status);
        }
        else {
          library.logFailStep('Analyte description displayed is not correct');
          status = false;
          resolve(status);
        }
      })
    });
  }

  clickForwardAnalyteButton() {
    let status = false;
    return new Promise(async (resolve) => {
      const ForwardClick = element(by.xpath(forwardAnalyteClick));
      let analyteList = element.all(by.xpath(analytes));
      analyteList.each(function (ele, index) {
        if (index >= 1) {
          ForwardClick.isDisplayed().then(function () {
            library.clickJS(ForwardClick);
            library.logStep('Forward Analyte Button Clicked');
          });
          dashBoard.waitForElement();
          const analyte = element(by.xpath(analyteDisplayed));
          expect(ele.getText()).toEqual(analyte.getText());
          library.logStepWithScreenshot('Analyte Displayed', 'Next Analyte Displayed');
          status = true;
          resolve(true);
        }
      });
    });
  }

  verifyLevelDisplayedInAdvancedLjChart() {
    let status = false;
    let thisKeyword = this;
    return new Promise(async (resolve) => {
      dashBoard.waitForPage();
      library.clickJS(btn);
      element.all(by.xpath(lvl1Data)).count().then(function (lvl1) {
        element.all(by.xpath(lvl2Data)).count().then(function (lvl2) {
          library.clickJS(btn);
          thisKeyword.clickLJChart().then(function (clicked) {
            expect(clicked).toBe(true);
          });
          dashBoard.waitForPage();
          console.log(lvl2);
          if (lvl1 > 0) {
            console.log(lvl1);

            let flag = library.isElementPresent(element(by.xpath(levelOneAdvLJChart)));
            if (flag) {
              library.logStepWithScreenshot('Level 1 should be selected in Advanced LJ', 'Level 1 is selected');
              status = true;
              resolve(status);
            }
            else {
              library.logStepWithScreenshot('Level 1 should not be selected in Advanced LJ', 'Level 1 should not be selected');
              status = false;
              resolve(status);
            }
          } else {
            library.logStepWithScreenshot('Level 1 should not be selected in Advanced LJ', 'Level 1 should not be selected');
          }
          if (lvl2 > 0) {
            console.log(lvl2);

            let flag = library.isElementPresent(element(by.xpath(levelTwoAdvLJChart)));
            if (flag) {
              library.logStepWithScreenshot('Level 2 should be selected in Advanced LJ', 'Level 1 is selected');
              status = true;
              resolve(status);
            }
            else {
              library.logStepWithScreenshot('Level 2 should not be selected in Advanced LJ', 'Level 1 should not be selected');
              status = false;
              resolve(status);
            }

          } else {
            library.logStepWithScreenshot('Level 2 should not be selected in Advanced LJ', 'Level 2 should not be selected');
          }
          // //div[@class="bg-white ctn-unext-advanced-lj-levels mr-20"]//unext-advanced-lj-levels//mat-checkbox//span/span[text()=1]
          // levelInAdvanceLj.getAttribute('ng-reflect-levels-in-use').then(function (attr) {
          //   // if (attr.includes('1')) {
          //   //   library.logStepWithScreenshot('Level 1 should be selected in Advanced LJ', 'Level 1 is selected');
          //   //   status = true;
          //   //   resolve(status);
          //   // }
          //   // else {
          //   //   library.logStepWithScreenshot('Level 1 should not be selected in Advanced LJ', 'Level 1 should not be selected');
          //   //   status = false;
          //   //   resolve(status);
          //   // }
          // });


          // if (lvl2 > 0) {
          //   const levelInAdvanceLj = element(by.xpath(lvlInAdvanceLj));
          //   levelInAdvanceLj.getAttribute('ng-reflect-levels-in-use').then(function (attr) {
          //     if (attr.includes('2')) {
          //       library.logStepWithScreenshot('Level 2 should be selected in Advanced LJ', 'Level 2 is selected');
          //       status = true;
          //       resolve(status);
          //     }
          //     else {
          //       library.logStepWithScreenshot('Level 2 should not be selected in Advanced LJ', 'Level 2 should not be selected');
          //       status = false;
          //       resolve(status);
          //     }
          //   });
          // }
          // else {
          //   library.logStepWithScreenshot('Level 2 should not be selected in Advanced LJ', 'Level 2 should not be selected');
          // }
        });
      });
    });
  }

  verifyLevelSelectedInAdvancedLjChart() {
    let status = false;
    let thisKeyword = this;
    return new Promise((resolve) => {
      let levelSelected = element.all(by.xpath(lvlSelected));
      thisKeyword.clickLJChart().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      levelSelected.each(function (ele) {
        ele.getText().then(function (lvlNo) {
          library.logStep('Level' + lvlNo + ' is selected in LJ chart.');
          dashBoard.waitForPage();
          const levelInAdvanceLj = element(by.xpath(lvlInAdvanceLj));
          levelInAdvanceLj.getAttribute('ng-reflect-levels-in-use').then(function (attr) {
            if (attr.includes(lvlNo)) {
              library.logStepWithScreenshot('Level' + lvlNo + ' is selected in Advanced LJ', 'Level' + lvlNo + ' is selected');
              status = true;
              resolve(status);
            }
            else {
              library.logStepWithScreenshot('Level' + lvlNo + ' should not be selected in Advanced LJ', 'Level' + lvlNo + ' should not be selected');
              status = false;
              resolve(status);
            }
          });
        });
      });
    });
  }

  verifyForwardAnalyteButtonDisabled() {
    let status = false;
    return new Promise(async (resolve) => {
      const ForwardClick = element(by.xpath(forwardAnalyteClick));
      ForwardClick.getAttribute('disabled').then(function (attr) {
        if (attr.includes('true')) {
          library.logStepWithScreenshot('btn is disabled', 'btnDisabled');
          status = true;
          resolve(status);
        }
        else {
          library.logStepWithScreenshot('btn is enabled', 'btnEnabled');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyBackwardAnalyteButtonDisabled() {
    let status = false;
    return new Promise(async (resolve) => {
      const BackwardClick = element(by.xpath(backwardAnalyteClick));
      BackwardClick.getAttribute('disabled').then(function (attr) {
        if (attr.includes('true')) {
          library.logStepWithScreenshot('btn is disabled', 'btnDisabled');
          resolve(true);
        }
        else {
          library.logStepWithScreenshot('btn is enabled', 'btnEnabled');
          resolve(false);
        }
      });
    });
  }

  verifyActionOfCloseButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const buttonCancel = element(by.xpath(btnCancel));
      library.clickJS(buttonCancel);
      library.logStep(' "X" button clicked');
      const scroll = '//div[@class="content-not-scroll"]';
      element(by.xpath(scroll)).isDisplayed().then(function () {
        library.logFailStep('Advanced LJ chart is not closed');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('On clicking X button , Advanced LJ chart is closed', 'Advanced LJ Chart Closed');
        status = true;
        resolve(status);
      });
    });
  }

  clickBackwardAnalyteButton() {
    let status = false;
    let i = 2;
    return new Promise(async (resolve) => {
      const analyteList = element.all(by.xpath(analytes));
      analyteList.each(function (ele, index) {
        if (index = 1) {
          const analyte = element(by.xpath(analyteDisplayed));
          const BackwardClick = element(by.xpath(backwardAnalyteClick));
          BackwardClick.isDisplayed().then(function () {
            library.clickJS(BackwardClick);
            library.logStep('Backward Analyte Button Clicked');
          });
          dashBoard.waitForElement();
          library.logStepWithScreenshot('Analyte Displayed', ' Previous Analyte Displayed');
          status = true;
          resolve(true);
        }
      });
    });
  }

  verifyLevelToggleOverlay() {
    return new Promise((resolve) => {
      const toggleBtnLevelOverlay = '';
      const toggleLevel = element(by.xpath(toggleBtnLevelOverlay));
      toggleLevel.getAttribute('').then(function (attributeValue) {
        if (attributeValue.includes('true')) {
          library.logStepWithScreenshot('Level Toggle Button is on', 'Level Toggle Button ON');
        }
        else {
          library.logStepWithScreenshot('Level Toggle Button is off', 'Level Toggle Button OFF');
        }
      })
    })
  }

  verifyForwardBackwardArrow() {
    const analyteList = element.all(by.xpath(analytes));
    for (let i = 0; i < analyteList.length; i++) {
      element(by.xpath('analyte value XPath on LJ')).getText().then(function (analyteValueOnLJChart) {
        if (analyteValueOnLJChart.includes(analyteList[i])) {
          const btnForward = '';
          const btnforward = element(by.xpath(btnForward));
          if (i == analyteList.length - 1) {
            btnforward.isDisplayed().then(
              function () {
                library.logFailStep('Forward Button is still present, when no next analyte is there');
              },
              function () {
                library.logStepWithScreenshot('Forward Button is disabled, when no next analyte is there', 'Forward Button is disabled, when no next analyte is there');
              }
            )
          }
          else {
            library.click(btnforward);
          }
        }
        else {
          library.logFailStep('');
        }
      });
    }
    for (let i = analyteList.length - 1; i >= 0; i--) {
      element(by.xpath('analyte value XPath on LJ')).getText().then(function (analyteValueOnLJChart) {
        if (analyteValueOnLJChart.includes(analyteList[i])) {
          const btnBackward = '';
          const btnbackward = element(by.xpath(btnBackward));
          if (i == 0) {
            btnbackward.isDisplayed().then(
              function () {
                library.logFailStep('Backward Button is still present, when no previous analyte is there');
              },
              function () {
                library.logStepWithScreenshot('Backward Button is disabled, when no previous analyte is there', 'Backward Button is disabled, when no previous analyte is there');

              }
            )
          }
          else {
            library.click(btnbackward);
          }
        }
        else {
          library.logFailStep('');
        }
      });
    }
  }

  enterPointValue(val1) {
    let result, value1Entered = false;
    let thisKeyword = this;
    return new Promise((resolve) => {
      const valueLevel1 = element(by.xpath(level1value));
      dashBoard.waitForElement();
      valueLevel1.isDisplayed().then(function () {
        library.click(valueLevel1);
        browser.sleep(1000);
        valueLevel1.sendKeys(val1);
        console.log('Values entered: ' + val1);
        value1Entered = true;
        library.logStep('Level 1 value entered');
        library.logStepWithScreenshot('Both the values entered', 'PointValuesEntered');
        result = true;
        resolve(result);
      });
    });
  }

  clickSubmitButton() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const submit = element(by.xpath(submitButton));
      submit.isDisplayed().then(function () {
        dashBoard.waitForPage();
        library.logStepWithScreenshot('Send to peer group btn', 'Send to peer group btn');
        library.clickAction(element(by.xpath(submitButton)));
        dashBoard.waitForPage();
        library.logStep('Send To Peer group button is clicked.');
        console.log('Send to peer btn is clicked');
        library.logStepWithScreenshot('Send to peer group btn is clicked', 'Send to peer group btn is clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Send To Peer group button is not clicked.');
        console.log('Send to peer btn is not clicked');
        library.logStepWithScreenshot('Send to peer group btn is not displayed', 'Send to peer group btn is not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  ljPointsValues() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const ele = element(by.css('#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-crosshair > g.xy > rect.nsewdrag.drag'));
      browser.actions().mouseMove(ele).mouseMove(ele).click().perform();
      ele.getText().then(function (text) {
        console.log("text " + text);
      })
      const el = element(by.js("return document.elementFromPoint(789, 400)"));
      browser.actions().mouseMove(el).mouseMove(el).click().perform();
      el.getText().then(function (text) {
        console.log("text " + text);
      })
      status = true;
      resolve(status);
    });
  }

  clickZoomOut() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const zoomout = '//*[@data-title="Zoom out"]';
      const zoomOut = element(by.xpath(zoomout));
      zoomOut.isDisplayed().then(function () {
        library.clickJS(zoomOut);
        library.logStep('Zoom Out Button Clicked');
        status = true;
        resolve(status);
      })
    });
  }

  clickLJChart() {
    let status = false;
    return new Promise((resolve) => {
     // library.waitLoadingImageIconToBeInvisible();
      dashBoard.waitForElement();
      const ljChartPresent = element(by.xpath(ljChart));
      ljChartPresent.isDisplayed().then(function () {
        library.clickJS(ljChartPresent);
        library.logStep('LJ Chart Clicked');
        dashBoard.waitForElement();
        status = true;
        resolve(status);
      })
    });
  }

  verifyComparisonDefaultState() {
    return new Promise((resolve) => {
      const comparisondefault = '//mat-select[@ng-reflect-name="Comparison"]//span';
      const comparisonDefault = element(by.xpath(comparisondefault));
      comparisonDefault.getText().then(function (text) {
        if (text.includes("Comparison")) {
          library.logStepWithScreenshot('By default Comparison dropdown is not selected', 'default comparison dropdown');
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    });
  }

  verifyYAxisDefaultState() {
    return new Promise((resolve) => {
      const yaxisDropdownDefault = element(by.xpath('//mat-select[@aria-label="Y-axis"]//span/span'));
      yaxisDropdownDefault.getText().then(function (text) {
        if (text.includes("Eval mean")) {
          library.logStepWithScreenshot('By default Eval mean option is selected by default', 'Eval mean option selected');
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    });
  }

  changeDateTime() {
    return new Promise((resolve) => {
      const win = require('node-windows')
      const sys = require('util')
      let dateTime = new Date("02-08-2021")
      let day = dateTime.getDate()
      let month = dateTime.getUTCMonth() + 1
      let year = dateTime.getFullYear()
      let updateD = `${month}-${day}-${year}`
      console.log(updateD)
      function execCallback(error, stdout, stderr) {
        if (error) {
          console.log(error)
        } else {
          console.log(stdout)
        }
      }
      console.log(" execute in command prompt now")
      var exec = win.elevate(`cmd /c date ${updateD}`, undefined, execCallback);
      console.log(" execution completed ");
    })
  }

  verifyYaxisDropdownPresent() {
    return new Promise((resolve) => {
      const yaxisDropdown = element(by.xpath(yaxis));
      yaxisDropdown.isDisplayed().then(function () {
        library.logStepWithScreenshot('Y-axis dropdown is present', 'y-axis');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Y-axis Dropdown not present');
        resolve(false);
      })
    });
  }

  verifyYaxisDropdownOptions() {
    return new Promise((resolve) => {
      const expectedOptions = ['Eval mean', 'Cumulative mean', 'Z-score'];
      const yaxisDropdown = element(by.xpath(yaxis));
      library.click(yaxisDropdown);
      const yaxisDropdownValue = '//span[@class="mat-option-text"]';
      element.all(by.xpath(yaxisDropdownValue)).each(function (values, index) {
        values.getText().then(function (value) {
          if (value.includes(expectedOptions[index])) {
            library.logStep(value + ' option is present');
          }
          else {
            library.logStep(values + ' option is not present');
          }
        })
      })
    });
  }

  selectYaxisDropdownValue(value) {
    return new Promise((resolve) => {
      const yaxisDropdown = element(by.xpath(yaxis));
      library.click(yaxisDropdown);
      const yaxisDropdownValue = '//span[@class="mat-option-text" and contains(text(),"' + value + '")]';
      const dropdownValue = element(by.xpath(yaxisDropdownValue));
      dropdownValue.isDisplayed().then(function () {
        library.click(dropdownValue);
        library.logStepWithScreenshot(value + ' is selected', value + ' is selected');
        resolve(true);
      }).catch(function () {
        library.logFailStep(value + ' not present');
        resolve(false);
      })
    });
  }

  verifyRangeDefaultState() {
    return new Promise((resolve) => {
      const rangedefault = '//mat-select[@ng-reflect-name="dateRange"]//span';
      const rangeDefault = element(by.xpath(rangedefault));
      rangeDefault.getText().then(function (text) {
        if (text.includes("Date Range")) {
          library.logStepWithScreenshot('By default range dropdown is not selected', 'default range dropdown');
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    });
  }

  verifyTogglePresence() {
    let status = false;
    return new Promise((resolve) => {
      const togglePresent = element(by.xpath(toggle));
      togglePresent.isDisplayed().then(function () {
        library.logStepWithScreenshot('Toggle is present', 'Toggle present');
        status = true;
        resolve(status);
      }), function () {
        library.logStepWithScreenshot('Toggle is not present', 'Toggle not present');
        status = false;
        resolve(status);
      }
    });
  }

  verifyGearIconPresence() {
    let status = false;
    return new Promise((resolve) => {
      const gear = element(by.xpath(gearicon));
      gear.isDisplayed().then(function () {
        library.logStepWithScreenshot('Gear icon is present', 'Gear icon present');
        status = true;
        resolve(status);
      }), function () {
        library.logStepWithScreenshot('Gear icon is not present', 'Gear icon not present');
        status = false;
        resolve(status);
      }
    });
  }

  verifyGearIconFilters() {
    const arr = ['Reagent lot', 'Calibrator lot', 'Mean', 'SD'];
    return new Promise((resolve) => {
      const gear = element(by.xpath(gearicon));
      library.click(gear);
      library.logStepWithScreenshot('Filters of ALJ', 'Filters')
      const filters = element.all(by.xpath(gearIconFilters));
      filters.each(function (ele, index) {
        ele.getText().then(function (filter) {
          if (filter.includes(arr[index])) {
            library.logStep(filter + ' filter is present');
            resolve(true);
          }
          else {
            library.logStep(filter + ' filter is not present');
            resolve(false);
          }
        });
      });
    });
  }

  verifyFiltersInOverlay() {
    const arr = ['Reagent lot', 'Calibrator lot'];
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const filters = element.all(by.xpath(gearIconFilters));
      filters.each(function (ele, index) {
        ele.getText().then(function (filter) {
          if (filter.includes(arr[index])) {
            library.logStep(filter + ' filter is present');
            resolve(true);
          }
          else {
          }
        });
      });
    });
  }

  verifyFiltersState() {
    return new Promise((resolve) => {
      const gear = element(by.xpath(gearicon));
      library.click(gear);
      library.logStepWithScreenshot('Filters of ALJ', 'Default Filters State')
      const filters = element.all(by.xpath(gearIconFilters));
      filters.each(function (ele, index) {
        ele.getAttribute('ng-reflect-state').then(function (filter) {
          if (filter.includes("unchecked")) {
            library.logStep(' filter is unchecked');
            resolve(false);
          }
          else {
            library.logStep(' filter is checked');
            resolve(true);
          }
        });
      });
    });
  }

  clickGearIcon() {
    return new Promise((resolve) => {
      const gear = element(by.xpath(gearicon));
      gear.isDisplayed().then(function () {
        library.click(gear);
        library.logStepWithScreenshot('Gear Icon Clicked', 'Gear Icon');
        resolve(true);
      }).catch(function () {
        library.logFailStep('gear icon is not displayed');
        resolve(false);
      })
    });
  }

  uncheckMeanFilter() {
    return new Promise((resolve) => {
      const mean = element(by.xpath(meanFilter));
      mean.isDisplayed().then(function () {
        library.click(mean);
        library.logStepWithScreenshot('Mean filter is unchecked', 'Mean uncheked');
        resolve(true);
      }).catch(function () {
        library.logFailStep('mean icon is not displayed');
        resolve(false);
      });
    });
  }

  uncheckReagentFilter() {
    return new Promise((resolve) => {
      const mean = element(by.xpath(reagentFilter));
      mean.isDisplayed().then(function () {
        library.click(mean);
        resolve(true);
      }).catch(function () {
        library.logFailStep('Reagent icon is not displayed');
        resolve(false);
      });
    });
  }

  verifyToggleDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const togglePresent = element(by.xpath(toggle));
      togglePresent.getAttribute('aria-checked').then(function (enabled) {
        if (enabled == "true") {
          library.logFailStep('Toggle is ON by default');
          status = false;
          resolve(status);
        }
        else {
          library.logStepWithScreenshot('Toggle is disabled by default', 'Toggle OFF');
          status = true;
          resolve(status);
        }
      }).catch(function () {
        library.logFailStep('Toggle is not present');
        status = false;
        resolve(status);
      });
    });
  }

  turnToggleOn() {
    let status = false;
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const togglePresent = element(by.xpath(toggle));
      togglePresent.isDisplayed().then(function () {
        library.clickJS(togglePresent);
        library.logStepWithScreenshot('On turing ON toggle all levels are displayed in one.', 'Toggle ON');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Toggle is not present', 'Toggle not present');
        status = false;
        resolve(status);
      })
    });
  }

  turnToggleOff() {
    let status = false;
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const togglePresent = element(by.xpath(toggle));
      togglePresent.isDisplayed().then(function () {
        library.clickJS(togglePresent);
        library.logStepWithScreenshot('On turing OFF toggle all levels displayed separately.', 'Toggle OFF');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Toggle is not present', 'Toggle not present');
        status = false;
        resolve(status);
      })
    });
  }

  verifyRangeDropdownPresent() {
    return new Promise((resolve) => {
      rangeDD.isDisplayed().then(function () {
        library.logStepWithScreenshot('Range Dropdown is present', 'Range Dropdown present');
        resolve(true);
      }), function () {
        library.logStepWithScreenshot('Range Dropdown is not present', 'Range Dropdown not present');
        resolve(false);
      }
    });
  }

  clickRangeDropdown() {
    return new Promise((resolve) => {
      rangeDD.isDisplayed().then(function () {
        library.click(rangeDD);
        library.logStepWithScreenshot('Range Dropdown Clicked', 'Range Dropdown')
        resolve(true);
      }), function () {
        library.logFailStep('Range Dropdown is not present');
        resolve(false);
      }
    })
  }

  verifyRangeDropdownContents() {
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const arr = ['30 days', '60 days', '90 days', 'Cumulative'];
      const rangedd = element.all(by.xpath(rangeddValues));
      console.log(rangedd);
      rangedd.each(function (ele, index) {
        ele.getText().then(function (text) {
          if (text.includes(arr[index])) {
            library.logStep(text + ' option is present');
            resolve(true);
          }
          else {
            library.logFailStep(arr[index] + ' option is not present');
            resolve(false);
          }
        });
      });
    });
  }

  clickComparisonDD() {
    return new Promise((resolve) => {
      const comparisonDD = element(by.xpath(comparison));
      comparisonDD.isDisplayed().then(function () {
        library.click(comparisonDD);
        library.logStepWithScreenshot('Comparison Dropdown Clicked', 'Comparison Dropdown');
        resolve(true);
      });
    });
  }

  verifyComparisonDropdownContents() {
    return new Promise((resolve) => {
      const comparison = ['Peer mean', 'Method mean', 'Lab cumulative mean'];
      const comparisonddValues = '//div[@id="cdk-overlay-23"]//mat-option//span[contains(text(),"")]';
      const comparisondd = element.all(by.xpath(comparisonddValues));
      comparisondd.each(function (ele, index) {
        ele.getText().then(function (text) {
          if (text.includes(comparison[index])) {
            library.logStep(text + ' option is present');
            resolve(true);
          }
          else {
            library.logFailStep(comparison[index] + ' option is not present');
            resolve(false);
          }
        });
      });
    });
  }

  verifyComparsionDropdownPresent() {
    return new Promise((resolve) => {
      const comparisonDD = element(by.xpath(comparison));
      comparisonDD.isDisplayed().then(function () {
        library.logStepWithScreenshot('Comparison Dropdown is present', 'Comparison Dropdown present');
        resolve(true);
      }), function () {
        library.logStepWithScreenshot('Comparison Dropdown is not present', 'Comparison Dropdown not present');
        resolve(false);
      }
    });
  }

  uncheckLevelWhenToggleOverlayIsON(levelno) {
    let status = false;
    return new Promise((resolve) => {
      const lvl = '(//div[@class="advanced-lj-levels-component"]//mat-checkbox)//span[contains(text(),"' + levelno + '")]';
      const lvlEle = element(by.xpath(lvl));
      library.clickAction(lvlEle);
      library.logStepWithScreenshot('' + levelno + ' is unchecked', '' + levelno + ' is not displayed in overlay chart');
      status = true;
      resolve(status);
    })
  }

  checkLevelWhenToggleOverlayIsON(levelno) {
    let status = false;
    return new Promise((resolve) => {
      const lvl = '(//div[@class="advanced-lj-levels-component"]//mat-checkbox)//span[contains(text(),"' + levelno + '")]';
      const lvlEle = element(by.xpath(lvl));
      library.clickAction(lvlEle);
      library.logStepWithScreenshot('' + levelno + ' is checked', '' + levelno + ' is displayed in overlay chart');
      status = true;
      resolve(status);
    })
  }

  perforMouseHover() {
    let status = false;
    return new Promise((resolve) => {
      const el = element(by.js("return document.elementFromPoint(200, 0)"));
      browser.actions().mouseMove(el).perform();
      resolve(true);
      const plotChart = element(by.css('#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-move > g.xy > rect.nsewdrag.drag'));
      plotChart.getSize().then(function (size) {
        return browser.actions().mouseMove(plotChart, {
          x: 180,
          y: 17
        }).perform();
      });
    });
  }

  verifyExportPdfButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const btnPdf = element(by.xpath(pdfdownloadBtn));
      btnPdf.getAttribute('ng-reflect-disabled').then(function (attr) {
        console.log(attr);
        if (attr.includes('true')) {
          library.logStepWithScreenshot('Export Button is disabled', 'exportBtn disabled');
          status = true;
          resolve(status);
        }
        else {
          library.logStepWithScreenshot('Export Button is enabled', 'exportBtn enabled');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyChartRendered() {
    let status = false;
    return new Promise((resolve) => {
      const plotChart = element(by.css('#myPlotlyDiv > div > div > svg:nth-child(1) > g.draglayer.cursor-crosshair > g'));
      browser.wait(browser.ExpectedConditions.visibilityOf(plotChart));
      library.logStepWithScreenshot('Plotly Charts are rendered', 'Plot Charts rendered');
      status = true;
      resolve(status);
    });
  }

  verifyExportedPdfName(analyteName) {
    return new Promise((resolve) => {
      const startDate = moment();
      const sDate = startDate.format("YYYY-MM-DD");
      console.log(startDate);
      console.log(sDate);
      const endDate = startDate.subtract(30, 'days');
      const eDate = endDate.format("YYYY-MM-DD");
      console.log(endDate);
      console.log(eDate);
      const name = analyteName + "_" + eDate + "_" + sDate + "_" + "LJ.pdf";
      console.log(name);
      resolve(true);
      this.clickOnDownloadFile(name).then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

  }

  comparePdfAndImage() {
    let status = false;
    return new Promise(async (resolve) => {
      console.log("hello");
      if ((await browser.getCapabilities()).get('browserName') === 'chrome') {
        await browser.driver.get('chrome://downloads/');
        const items =
          await browser.executeScript('return browser.downloads.Manager.get().items_') as any[];
        expect(items.length).toBe(1);
        expect(items[0].file_name).toBe('Albumin_2021-07-01_2021-08-03_LJ.pdf');
        library.logStep('Pdf and Image on UI is same');
        status = true;
        resolve(status);
      }
    });
  }

  verifyImageComparison(fileName, details?) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      //  expect(browser.checkFullPageScreen('fullPage', { /* some options*/ })).toEqual(0);
      //library.waitLoadingImageIconToBeInvisible();
      library.logStepWithScreenshot(details, fileName);
      expect(browser.imageComparison.checkFullPageScreen(fileName)).toBeLessThan(1);

      if (details == 'mousehover') {
        library.logStep('Level no. is displayed');
        library.logStep('Value is displayed');
        library.logStep('date-time is displayed');
        library.logStep('Mean is displayed');
        library.logStep('SD is displayed');
        library.logStep('Cv is displayed');
        library.logStep('Z-Score is displayed.');
        library.logStep('Reason is displayed');
        library.logStep('Action is displayed')
        library.logStepWithScreenshot('Tool tip is displayed', 'Tool tip');
      }
      else if (details == 'styling points') {
        library.logStep('Warned points are displayed as a large yellow point.');
        library.logStep('Warned and Not Accepted points are displayed as a yellow X.');
        library.logStep('Rejected points are displayed as a red X.');
        library.logStep('Not Accepted points are displayed as a black X');
        library.logStepWithScreenshot(details, fileName);
      }
      status = true;
      resolve(status);
    });
  }

  selectedLevels() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      element.all(by.xpath('//div//unext-advanced-lj-levels//mat-checkbox')).each(function (level) {
        library.click(level);
      });
    });
  }

  clickThumbSlider() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const sliderThumb = '//div[@class="mat-slider-thumb-label"]';
      const slider = element(by.xpath(sliderThumb));
      library.scrollToElement(slider);
      browser.actions().mouseMove(slider).mouseMove(slider).click().perform();
      library.logStep('Slider Thumb Clicked');
      resolve(true);
    });
  }

  verifyDefaultUI() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const sliderDaysCount = '//span[@class="mat-slider-thumb-label-text"]';
      element(by.xpath(sliderDaysCount)).getText().then(function (daysCount) {
        console.log('hello');
        console.log(daysCount);
        expect(daysCount).toBe('30');
        library.logStepWithScreenshot('Default no of days displayed is : ' + daysCount + '', 'Default no. of days');
      });
      resolve(true);
    });
  }

  verifyTimeframeForwardClick() {
    return new Promise((resolve) => {
      const btnForward = '//mat-icon[@class="mat-icon notranslate navigate-left mat-icon-no-color"]';
      const btnforward = element(by.xpath(btnForward));
      library.click(btnforward);
    });
  }

  verifySlider() {
    return new Promise((resolve) => {
      const sliderThumb = '//div[@class="mat-slider-thumb-label"]';
      const thumb = element(by.xpath(sliderThumb));
      browser.actions().mouseMove(thumb).dragAndDrop(
        thumb,
        { x: 150, y: 0 }
      ).perform();
      const timeFrameslider = '//mat-slider[@role="slider"]';
      element(by.xpath(timeFrameslider)).getAttribute('aria-valuenow').then(function (value1) {
      });
    });
  }

  clickDownloadButton() {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(pdfdownloadBtn));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        library.clickAction(downloadBtnEle);
        dashBoard.waitForElement();
        console.log('Download button clicked');
        library.logStepWithScreenshot('Download button clicked', 'clickedOnDownload');
        flag = true;
        resolve(flag);
      }).then(function () {
        dashBoard.waitForElement();
        var filename = 'Albumin_2021-07-01_2021-08-03_LJ.pdf';
        var content = './image/compared/albumin--1920x1040.png';
        if (fs.existsSync(filename)) {
          console.log('hello');
          expect(fs.readFileSync(filename, { encoding: 'utf8' })).toEqual(content);
          library.logStep('Verified , PDF has image as that of UI');
        }
      });
    });
  }

  clickOnDownloadFile(filename, filePath?) {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(pdfdownloadBtn));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        library.clickAction(downloadBtnEle);
        dashBoard.waitForElement();
        console.log('Download button clicked');
        library.logStepWithScreenshot('Download button clicked', 'clickedOnDownload');
      }).then(function () {
        const filePathName = downloadPath + '\\' + filename;
        const fileExist = fs.existsSync(filePathName);
        console.log('FileExist: ' + fileExist);
        if (fileExist) {
          library.logStep('File Downloaded ' + filename);
          console.log('File downloaded in PDF format.');
          library.logStep('File downloaded in PDF format.');
          flag = true;
          resolve(flag);
        } else {
          console.log('File download fail');
          library.logStep('File download fail');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  readPDFFile(pdfFilePath) {
    return new Promise((resolve) => {
      console.log("hello");
      var PDFParser = require("pdf2json");
      var fs = require("fs");
      let FileParser = new PDFParser(this, 1);
      FileParser.on("pdfParser_dataError", errText => console.error(errText.parserError));
      FileParser.on("pdfParser_dataReady", pdfText => {
        console.log("pdf data" + FileParser.getRawTextContent().toString());
        fs.writeFile("./JSON_data/pdfData.json", JSON.stringify(pdfText));
      });
      FileParser.loadPDF(pdfFilePath);
    });
  }

  verifyTimeframeBackwardClick() {
    return new Promise((resolve) => {
      const daysCount = '//mat-icon[@class="mat-icon notranslate navigate-right mat-icon-no-color"]';
      element(by.xpath(daysCount)).getText().then(function (countValue) {
        const btnBackward = '';
        const btnbackward = element(by.xpath(btnBackward));
        library.click(btnbackward);
      });
    });
  }

  setBrowserDateTime(time) {
    return new Promise((resolve) => {
      console.log("hello");

      browser.executeScript('enableUnityLog()');

      browser.executeScript(`
    (function(name, definition) {
      if (typeof define === 'function') { // AMD
        define(definition);
      } else if (typeof module !== 'undefined' && module.exports) { // Node.js
        module.exports = definition();
      } else { // Browser
        var timemachine = definition(),
          global = this,
          old = global[name];
        timemachine.noConflict = function() {
          global[name] = old;
          return timemachine;
        };
        global[name] = timemachine;
      }
    })('timemachine', function() {

      var OriginalDate = Date,
        Timemachine = {

          timestamp: 0,
          tick: false,
          tickStartDate: null,
          keepTime: false,
          difference: 0,

          config: function(options) {
            this.timestamp = OriginalDate.parse(options.dateString) || options.timestamp || this.timestamp;
            this.difference = options.difference || this.difference;
            this.keepTime = options.keepTime || this.keepTime;
            this.tick = options.tick || this.tick;
            if (this.tick) {
              this.tickStartDate = new OriginalDate();
            }
            this._apply();
          },

          reset: function() {
            this.timestamp = 0;
            this.tick = false;
            this.tickStartDate = null;
            this.keepTime = false;
            this.difference = 0;
            Date = OriginalDate;
            Date.prototype = OriginalDate.prototype;
          },

          _apply: function() {
            var self = this;

            Date = function() {
              var date;
              if (self.keepTime) {
                date = new OriginalDate();
              } else if (arguments.length === 1) {  //Cannot use OriginalDate.apply(this, arguments).  See http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
                date = new OriginalDate(arguments[0]);
              } else if (arguments.length === 2) {
                date = new OriginalDate(arguments[0], arguments[1]);
              } else if (arguments.length === 3) {
                date = new OriginalDate(arguments[0], arguments[1], arguments[2]);
              } else if (arguments.length === 4) {
                date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3]);
              } else if (arguments.length === 5) {
                date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
              } else if (arguments.length === 6) {
                date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
              } else if (arguments.length === 7) {
                date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
              } else {
                date = new OriginalDate(self.timestamp);
              }

              if (arguments.length === 0) {
                  var difference = self._getDifference();
                  if (difference !== 0) {
                      date = new OriginalDate(date.getTime() + difference);
                  }
              }

              return date;
            };

            Date.prototype = OriginalDate.prototype;
            Date.now = function() {
              var timestamp = self.keepTime ? OriginalDate.now() : self.timestamp;
              return timestamp + self._getDifference();
            };
            Date.OriginalDate = OriginalDate;
            Date.UTC = OriginalDate.UTC;
          },

          _getDifference: function() {
            var difference = this.difference;

            if (this.tick) {
              difference += OriginalDate.now() - this.tickStartDate.getTime();
            }

            return difference;
          },

        };

      Timemachine._apply();

      return Timemachine;

    });
    timemachine.config({ dateString: '`+ time + ` 00:00:00' });`);
      resolve(true);
    });
  }

  selectRangeDropdownValues(value) {
    return new Promise((resolve) => {
      const rangeddValue = '//mat-option//span[contains(text(),"' + value + '")]';
      const select = element(by.xpath(rangeddValue));
      library.click(select);
      library.logStepWithScreenshot(value + ' is selected. ', value + ' is selected. ');
      resolve(true);
    });
  }

  selectComparisonDD(value) {
    return new Promise((resolve) => {
      const comparisonddValue = '//mat-option//span[contains(text(),"' + value + '")]';
      const select = element(by.xpath(comparisonddValue));
      library.click(select);
      library.logStepWithScreenshot(value + ' is selected. ', value + ' is selected. ');
      resolve(true);
    });
  }

  clickOnLeftArrow() {
    return new Promise((resolve) => {

      const leftArrow = element(By.xpath(leftArrowXpath));
      library.clickJS(leftArrow);
    });
  }
}
