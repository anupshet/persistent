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

library.parseJson("./JSON_data/UN-13947DataColumns.json").then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: UN-13947 : Bench and Review Data Columns", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndReview = new BenchAndReview();

  afterEach(function () {
    out.signOut();
    browser.manage().deleteAllCookies();
  });

  it("Click on Bench review tiles and check data columns in bench review page.", async () => {
    await loginEvent
      .loginToApplication(
        jsonData.URL,
        jsonData.AMUsername,
        jsonData.AMPassword,
        jsonData.AMFirstName
      )
      .then(function (result) {
        expect(result).toBe(true);
      });
    benchAndReview
      .verifyColumnHeaderOfBenchReviewPage()
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
});
