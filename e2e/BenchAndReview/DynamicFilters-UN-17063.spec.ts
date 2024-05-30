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

describe("Test Suite: UN-17063 : Bench Review: Application of Dynamic filters", function () {
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

  it("TC-1 : Verify Dynamic filter is displayed for Department, Instrumnet and Panel on bench and review page", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyDynamicFilterElementsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });  
  });

  it("TC-2 : Verify user is able to select/Deselect Department, Instrumnet and Panel values in dynamic filter", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyDynamicFilterElementsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    
  });

  it("TC-3 : Verify AUM and LUM combination roles with supervisor can access Supervisor review", function () {
    out.signOut().then(function (status) {
      expect(status).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LSCombinationUserName,
      jsonData.AUM_LUM_LSCombinationPassword, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifySupervisorPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-4 : Verify SWITCH TO BENCH REVIEW link is displayed" +
    "TC-5 : Verify SWITCH TO BENCH REVIEW link functionality" +
    "TC-6 : Verify SWITCH TO BENCH REVIEW confirmation message" +
    "TC-7 : Verify navigation to Bench Review page on clicking YES", function () {
      benchAndReview.navigateToQCResults().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      benchAndReview.verifySwitchToBenchLinkDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.clickOnSwitchToBenchLink().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyConfirmationMessageAndPerformAction("Yes").then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyBenchPageDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });

      benchAndReview.verifyConfirmationMessageAndPerformAction("No").then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifySupervisorPageDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });

    });

    it("TC-8 : Verify SWITCH TO SUPERVISOR REVIEW link functionality" +
    "TC-9 : Verify SWITCH TO SUPERVISOR REVIEW link functionality" +
    "TC-10 : Verify SWITCH TO SUPERVISOR REVIEW confirmation message" +
    "TC-11 : Verify navigation to Bench Review page on clicking YES", function () {
      benchAndReview.navigateToQCResults().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      benchAndReview.clickOnSwitchToBenchLink().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyConfirmationMessageAndPerformAction("Yes").then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.clickOnSwitchToSupervisorLink().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyConfirmationMessageAndPerformAction("No").then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyBenchPageDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      benchAndReview.clickOnSwitchToSupervisorLink().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifyConfirmationMessageAndPerformAction("Yes").then(function (clicked) {
        expect(clicked).toBe(true);
      });
      benchAndReview.verifySupervisorPageDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });
});