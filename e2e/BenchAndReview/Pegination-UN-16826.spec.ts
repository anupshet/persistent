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

describe("Test Suite: UN-16826 : Bench review: Implement Pagination", function () {
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

  it("TC-1 : Verify bottom bar elements are displayed on bench review page", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyPeginationElements().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-2 : Verify pegination is displayed when more than 25 records are added in bench review", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyPeginationDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-3 : Verify user is navigated to next or previous page on clicking pegination arrows", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyPeginationDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.verifyPrevButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    benchAndReview.clickOnNextPageBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    benchAndReview.verifyAnalyteDetailsBoxDisplayed().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyPrevButtonEnabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    benchAndReview.clickOnPreviousPageBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    benchAndReview.verifyPrevButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});