/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from "protractor";
import { Dashboard } from "../page-objects/dashboard-e2e.po";
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { BrowserLibrary } from "../utils/browserUtil";
import { AccountLabUser } from "../page-objects/users-e2e.po";
import { LocationListing } from "../page-objects/location-listing-e2e.po";
import { UserManagement } from "../page-objects/user-management-e2e.po";
import { AccoutManager } from "../page-objects/account-management-e2e.po";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";
import { AccountsListing } from "../page-objects/accounts-listing-e2e.po";

const fs = require("fs");
let jsonData;

const library = new BrowserLibrary();

library
  .parseJson("./JSON_data/UN-13945DashboardCard.json")
  .then(function (data) {
    jsonData = data;
  });

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: UN-16267 : Bench and Review Account management", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const userManagement = new AccountLabUser();
  const locationsTab = new LocationListing();
  const userMgmt = new UserManagement();
  const AccMgmt = new AccoutManager();
  const benchAndReview = new BenchAndReview();
  const AccountListing = new AccountsListing();

  afterEach(function () {
    out.signOut();
    browser.manage().deleteAllCookies();
  });

  it("Create Account and location by adding advance qc in license type for location and check bench review card displayed", async () => {
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
    await benchAndReview
      .verifyBenchTiles(jsonData.CardName)
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
});
