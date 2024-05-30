/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from "protractor";
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { BrowserLibrary } from "../utils/browserUtil";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";

let jsonData;

const library = new BrowserLibrary();

library.parseJson("./JSON_data/Pegination-UN-16826.json").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-13950 : Implement selected items counter values and 'Reviewed' button", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndReview = new BenchAndReview();
  var initialCounterValue;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it("TC-1 : Verify run counter - Selected and total run is displayed on bench review page", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyRunCounterElements().then(function (displayed) {
      expect(displayed).toBe(true);
    });

  });

  it("TC-2 : Verify reviewed runs reflect in total and selected run count", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.getInitialRunCounterCount().then(function (initialCounterValue) {
      this.initialCounterValue = initialCounterValue;
    });
    benchAndReview.selectAnalyteForReview().then(function (selected) {
      expect(selected).toBe(true);
    });
    benchAndReview.clickOnReviewedBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    benchAndReview.verifyRunCounterValues(initialCounterValue).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

});