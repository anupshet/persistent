//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from './utils/browserUtil';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { RevisedSummaryData } from './page-objects/summary-form-revision.po';
import { RevisedPointData } from './page-objects/point-form-revision.po';
import { MultiSummary } from './page-objects/multi-summary-e2e.po';
import { SingleSummary } from './page-objects/single-summary.po';
import { PointDataEntry } from './page-objects/point-data-entry-e2e.po';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/form-revision-nonconnectivityuser.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: Revised Point Data and summary Data form for Non connectivity user', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const RevisedPointData1 = new RevisedPointData();
  const summaryRevised = new RevisedSummaryData();
  const multiSummary = new MultiSummary();
  const singleSummary = new SingleSummary();
  const pointData = new PointDataEntry();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.firstname).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
      browser.sleep(10000);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it("verify the Entry form is open byDefeault and cursor is placed at the first value field for point data form", function () {
    library.logStep('Test Case :verify the Entry form is open byDefeault and cursor is placed at the first value field for point data form');
    labsetup.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.AnalyteName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    summaryRevised.verifyenterdatalinkisnotvisible().then(function (verified) {
      expect(verified).toBe(true);
    });
    RevisedPointData1.verifyDataEntryFormNC().then(function (verified) {
      expect(verified).toBe(true);
    });
    RevisedPointData1.VerifyfocusonFirstElement().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.enterPointValue(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
  });

  it("verify the Entry form is open byDefeault and cursor is placed at the first value field for summary form", function () {
    library.logStep('Test Case :verify the Entry form is open byDefeault and cursor is placed at the first value field');
    labsetup.navigateTO(jsonData.DepartmentName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ControlName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.AnalyteName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    summaryRevised.verifyenterdatalinkisnotvisible().then(function (verified) {
      expect(verified).toBe(true);
    });
    summaryRevised.verifyDataEntryFormNC().then(function (verified) {
      expect(verified).toBe(true);
    });
    summaryRevised.VerifyfocusonFirstElement().then(function (result) {
      expect(result).toBe(true);
    });
    const dataMap = new Map<string, string>();
    browser.sleep(2000);
    dataMap.set('11', jsonData.mean);
    dataMap.set('12', jsonData.SD);
    dataMap.set('13', jsonData.Points);
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(jsonData.mean, jsonData.SD, jsonData.Points).then(function (stored) {
      expect(stored).toBe(true);
    });
  });
});
