/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from "protractor";
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { BrowserLibrary } from "../utils/browserUtil";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";
import { NewLabSetup } from "../page-objects/new-labsetup-e2e.po";
import { PointDataEntry } from "../page-objects/point-data-entry-e2e.po";
import { Settings } from "../page-objects/settings-labsetup-e2e.po";

const fs = require("fs");
let jsonData;

const library = new BrowserLibrary();

library.parseJson("./JSON_data/AnalyteDataHeader-UN-16827.json").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-16827 : Bench Review: Data Header (Grey bar) + Bread crumb menu", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndReview = new BenchAndReview();
  const newLabSetup = new NewLabSetup();
  const pointData = new PointDataEntry();
  const setting = new Settings();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.BenchUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
    //browser.manage().deleteAllCookies();
  });

  it("Click on Bench review tiles and check data columns in bench review page.", async () => {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyColumnHeaderOfBenchReviewPage().then(function (result) {
        expect(result).toBe(true);
      });
  });

  it("Verify analyte data header elements", async () => {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyAnalyteDataHeaderElementsAreDisplayed().then(function (result) {
        expect(result).toBe(true);
      });
  });

  it("Verify analyte data header is displayed for recent data entered on bench page", async () => {
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterPointValues(jsonData.lev1Value, jsonData.lev2Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton2().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyLatestAnalyteDataHeaderValues(jsonData.ControlName,jsonData.Departmentname,jsonData.InstrumentName).then(function (result) {
      expect(result).toBe(true);
    });  

  });

  it("Verify analyte data header is displayed for recent data entered on supervisor page", async () => {
    out.signOut().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.SupervisorUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyLatestAnalyteDataHeaderValues(jsonData.ControlName,jsonData.Departmentname,jsonData.InstrumentName).then(function (result) {
      expect(result).toBe(true);
    });  

  });

});
