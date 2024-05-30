/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from "protractor";
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { BrowserLibrary } from "../utils/browserUtil";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";

const fs = require("fs");
let jsonData;

const library = new BrowserLibrary();

library.parseJson("./JSON_data/AnalyteDetails-UN-17002.json").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-17002 : Bench Review: Analyte details/options for the run", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndReview = new BenchAndReview();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it("TC-1 : Verify user can see 'QC results ready for review' tab and data entered count on dashboard", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });

  it("TC-2 : Verify 'Analyte details/options' tab is displayed on the left side of each run on bench review page" +
    "TC-3 : Verify Reagent Lot # is displayed for that Analyte on respective run" +
    "TC-4 : Verify Calibrator Lot # is displayed for that Analyte on respective run" +
    "TC-5 : Verify LJ chart icon is displayed for that Analyte on respective run" +
    "TC-6 : Verify LJ chart is displayed for that Analyte on respective run on clicking on LJ chart icon", function () {
      benchAndReview.navigateToQCResults().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      benchAndReview.verifyAnalyteDetailsBoxDisplayed().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      benchAndReview.verifyRegantDetailsAreDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.verifyCalibratorDetailsAreDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });

    });

  it("TC-5 : Verify LJ chart icon is displayed for that Analyte on respective run" +
    "TC-6 : Verify LJ chart is displayed for that Analyte on respective run on clicking on LJ chart icon", function () {
      benchAndReview.navigateToQCResults().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      benchAndReview.verifyLJChartOptionAreDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.verifyLJChartIsDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it("TC-7 : Verify action dropdown with predefined values popuplated is displayed for that run" +
    "TC-8 : Verify actions count on updating selected action for that run", function () {
      benchAndReview.verifyChooseActionDrpdwnDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.verifySelectedActionDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it("TC-9 : Verify Add comment textbox is displayed for that run" +
    "TC-10 : Verify comments count adding comment for that run", function () {
      benchAndReview.verifyCommentTextBoxDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.verifyAddedCommentDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

    it("TC-9 : Verify history icon is displayed and history details are displayed", function () {
      /**
       * Functionality is not ready yet
       */
    });
});