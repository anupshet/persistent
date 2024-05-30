//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

let imageName, details;
const fs = require('fs');
let jsonData;
const library=new BrowserLibrary();
library.parseJson('./JSON_data/advancelj-210166.json').then(function(data) {
  jsonData = data;
});


describe("Test Suite 210166:Display mean lines and SD regions for evaluation mean & SD values across each level's points.", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const evalMeanSD = new EvalMeanSD();
  const labsetup = new NewLabSetup();
  const advancedLj = new AdvancedLJ();
  const pointData = new PointDataEntry();
  const time = 'November 10, 2021';
  beforeEach(async function () {

    browser.driver.manage().window().maximize();
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
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
  });

  afterEach(function () {
    advancedLj.verifyImageComparison(imageName, details).then(async function (clicked) {
      await expect(clicked).toBe(true);
    });
    out.signOut();
  });

  it('Test Case 1: To verify mean and sd regions when mean is fixed and sd is fixed.', function () {
    const floatPoint = '2';
    imageName = 'FixedMeanFixedSd'
    details = 'Mean and SD Regions when Mean is Fixed and SD is Fixed'
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
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedMeanValue('1', '10').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.addFixedSDValue('1', '1').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValue('10').then(function (entered) {
      expect(entered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.enterPointValue('11').then(function (entered) {
      expect(entered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.enterPointValue('12').then(function (entered) {
      expect(entered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 2: To verify mean and sd regions when mean is fixed and sd is float.', function () {
    imageName = 'FixedMeanFloatSd';
    details = 'Mean and SD Regions when Mean is Fixed and SD is Float'
    const floatPoint = '2';
    const dataMap = new Map<string, string>();
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
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
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedMeanValue('1', '10').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '10');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '12');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '15');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 3: To verify mean and sd regions when mean is float and sd is fixed.', function () {
    imageName = 'FloatMeanFixedSd'
    details = 'Mean and SD Regions when Mean is Float and SD is Fixed'
    const floatPoint = '2';
    const dataMap = new Map<string, string>();
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte3).then(function (navigated) {
      expect(navigated).toBe(true);
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
    evalMeanSD.selectFixedFloatMeanSD('1', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedSDValue('1', '2').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '10');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '11');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '12');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 4: To verify mean and sd regions when mean is float and sd is float.', function () {
    const floatPoint = '2';
    imageName = 'FloatMeanFloatSd';
    details = 'Mean and SD Regions when Mean is Float and SD is Float'
    const dataMap = new Map<string, string>();
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte4).then(function (navigated) {
      expect(navigated).toBe(true);
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
    evalMeanSD.selectFixedFloatMeanSD('1', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedSDValue('1', '2').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '10');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '15');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    dataMap.set('101', '12');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});
