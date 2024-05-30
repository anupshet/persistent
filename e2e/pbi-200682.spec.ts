//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from './utils/browserUtil';
import { multipoint } from './page-objects/pbi-200682-e2e.po';
const fs = require('fs');
let jsonData;
// For Test Execution on DEV
// fs.readFile('./JSON_data/PBI-200682.json', (err, data) => {
//   if (err) { throw err; }
//   const pointData = JSON.parse(data);
//   jsonData = pointData;
// });
// For Test Execution on QA
/*
fs.readFile('./JSON_data/Point-Data-Entry.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});*/
// For Test Execution on Stage
fs.readFile('./JSON_data/PBI-200682_stage.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
})
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('PBI 200682:- Multi-Point Data Entry ToolTip Component Creation', function () {
  browser.waitForAngularEnabled(false);
  const newLabSetup = new NewLabSetup();
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const multiEntryInst = new multipoint();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it('Test case 1: To verify that the ToolTip is displayed correctly for Valid previous data entry on Instrument Page', function () {
    library.logStep('Test case 1: To verify that the ToolTip is displayed correctly for Valid previous data entry on Instrument Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.Analyte, jsonData.Level1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.isvalueonTooltipDisplayed(jsonData.levelValue, jsonData.Mean, jsonData.SD, jsonData.CV, jsonData.Zscore).then(function (Valueontooltipdisplayed) {
      expect(Valueontooltipdisplayed).toBe(true);
    });
    multiEntryInst.verifyDatetimeonTootTip(jsonData.datetime, jsonData.time).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
  });
  it('Test case 2: To verify that the ToolTip is displayed correctly for previous data entry with Warning,Rejection and actions on Instrumnent Page', function () {
    library.logStep('Test case 2:  To verify that the ToolTip is displayed correctly for previous data entry with Warning,Rejection and actions on Instrumnent Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.Analyte, jsonData.level3).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.verifyActiononToolTip(jsonData.CorrectiveAction).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiEntryInst.verifyRejectionreasononToolTip(jsonData.RejectedReason).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiEntryInst.verifyWarningreasononToolTip(jsonData.WarningReason).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
  it('Test case 3: To verify that the ToolTip is displayed correctly for Valid previous data entry on control Page', function () {
    library.logStep('Test case 3: To verify that the ToolTip is displayed correctly for Valid previous data entry on Control Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (control) {
      expect(control).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.Analyte, jsonData.Level1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.isvalueonTooltipDisplayed(jsonData.levelValue, jsonData.Mean, jsonData.SD, jsonData.CV, jsonData.Zscore).then(function (Valueontooltipdisplayed) {
      expect(Valueontooltipdisplayed).toBe(true);
    });
    multiEntryInst.verifyDatetimeonTootTip(jsonData.datetime, jsonData.time).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
  });
  it('Test case 4: To verify that the ToolTip is displayed correctly for previous data entry with Warning,Rejection and actions on Control Page', function () {
    library.logStep('Test case 4:  To verify that the ToolTip is displayed correctly for previous data entry with Warning,Rejection and actions on Control Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (control) {
      expect(control).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.Analyte, jsonData.level3).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.verifyActiononToolTip(jsonData.CorrectiveAction).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiEntryInst.verifyRejectionreasononToolTip(jsonData.RejectedReason).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiEntryInst.verifyWarningreasononToolTip(jsonData.WarningReason).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
