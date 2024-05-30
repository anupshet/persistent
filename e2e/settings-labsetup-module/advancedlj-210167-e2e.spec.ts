//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { RevisedPointData } from '../page-objects/point-form-revision.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/advancedlj-210167.json').then(function (data) {
  jsonData = data;
});



describe('Test Suite 210167:Show chart events: For each level of the run, display reagent lot changes, calibrator lot changes. Also, show evaluation type changes in mean and SD.', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const advancedLj = new AdvancedLJ();
  const analyte = new AddAnalyte();
  const evalMeanSD = new EvalMeanSD();
  const RevisedPointData1 = new RevisedPointData();
  const multiSummary = new MultiSummary();
  const pointData = new PointDataEntry();
  const time = jsonData.date;
  let imageName, details;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
    browser.executeScript('enableUnityLog()');
    advancedLj.setBrowserDateTime(time).then(function (set) {
      expect(set).toBe(true);
    });
  });
  //   browser.executeScript(`
  //   (function(name, definition) {
  //     if (typeof define === 'function') { // AMD
  //       define(definition);
  //     } else if (typeof module !== 'undefined' && module.exports) { // Node.js
  //       module.exports = definition();
  //     } else { // Browser
  //       var timemachine = definition(),
  //         global = this,
  //         old = global[name];
  //       timemachine.noConflict = function() {
  //         global[name] = old;
  //         return timemachine;
  //       };
  //       global[name] = timemachine;
  //     }
  //   })('timemachine', function() {
  //     var OriginalDate = Date,
  //       Timemachine = {
  //         timestamp: 0,
  //         tick: false,
  //         tickStartDate: null,
  //         keepTime: false,
  //         difference: 0,
  //         config: function(options) {
  //           this.timestamp = OriginalDate.parse(options.dateString) || options.timestamp || this.timestamp;
  //           this.difference = options.difference || this.difference;
  //           this.keepTime = options.keepTime || this.keepTime;
  //           this.tick = options.tick || this.tick;
  //           if (this.tick) {
  //             this.tickStartDate = new OriginalDate();
  //           }
  //           this._apply();
  //         },
  //         reset: function() {
  //           this.timestamp = 0;
  //           this.tick = false;
  //           this.tickStartDate = null;
  //           this.keepTime = false;
  //           this.difference = 0;
  //           Date = OriginalDate;
  //           Date.prototype = OriginalDate.prototype;
  //         },
  //         _apply: function() {
  //           var self = this;
  //           Date = function() {
  //             var date;
  //             if (self.keepTime) {
  //               date = new OriginalDate();
  //             } else if (arguments.length === 1) {  //Cannot use OriginalDate.apply(this, arguments).  See http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
  //               date = new OriginalDate(arguments[0]);
  //             } else if (arguments.length === 2) {
  //               date = new OriginalDate(arguments[0], arguments[1]);
  //             } else if (arguments.length === 3) {
  //               date = new OriginalDate(arguments[0], arguments[1], arguments[2]);
  //             } else if (arguments.length === 4) {
  //               date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3]);
  //             } else if (arguments.length === 5) {
  //               date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
  //             } else if (arguments.length === 6) {
  //               date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
  //             } else if (arguments.length === 7) {
  //               date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
  //             } else {
  //               date = new OriginalDate(self.timestamp);
  //             }
  //             if (arguments.length === 0) {
  //                 var difference = self._getDifference();
  //                 if (difference !== 0) {
  //                     date = new OriginalDate(date.getTime() + difference);
  //                 }
  //             }
  //             return date;
  //           };
  //           Date.prototype = OriginalDate.prototype;
  //           Date.now = function() {
  //             var timestamp = self.keepTime ? OriginalDate.now() : self.timestamp;
  //             return timestamp + self._getDifference();
  //           };
  //           Date.OriginalDate = OriginalDate;
  //           Date.UTC = OriginalDate.UTC;
  //         },
  //         _getDifference: function() {
  //           var difference = this.difference;
  //           if (this.tick) {
  //             difference += OriginalDate.now() - this.tickStartDate.getTime();
  //           }
  //           return difference;
  //         },
  //       };
  //     Timemachine._apply();
  //     return Timemachine;
  //   });
  //   timemachine.config({ dateString: '`+ time + ` 00:00:00' });`);
  // });

  afterEach(function () {
    advancedLj.verifyImageComparison(imageName, details).then(async function (clicked) {
      await expect(clicked).toBe(true);
    });

    out.signOut();
  });

  it('Test Case 1: To verfiy change in reagent and calibrator lot is displayed for all levels in advanced LJ.', function () {
    imageName = "reagentCalibratorLotChange";
    details = "Change in Reagent and Calibrator lot us displayed."
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectReagentLot(jsonData.ReagentLot).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectCalibratortLot(jsonData.CalibratorLot).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterAllPointValues(11, 11.1, 11.2).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    })
    pointData.clickOnSendToPeerGrpButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 2: To verfiy change in reagent lot, calibrator lot  and evaluation type for mean and sd is displayed in advanced LJ. @P1', function () {
    const floatPoint = 2;
    imageName = "reagentCalibratorLotChangeAndMeanSD";
    details = "Change in Reagent and Calibrator lot and Evaluation type of mean and SD is displayed."
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectReagentLot(jsonData.ReagentLot2).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectCalibratortLot(jsonData.CalibratorLot2).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedMeanValue('1', '10').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedSDValue('1', '2').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterAllPointValues(11, 11.4, 11.5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    })
    pointData.clickOnSendToPeerGrpButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});
