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

library.parseJson("./JSON_data/HistoryIcon-UN-17003.json").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-17003 : Bench Review: Data table History icons", function () {
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

  it("TC-1 : Verify Actions, Comment and History icons are displayed for that analyte run", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyLJChartOptionAreDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.verifyCommentTextBoxDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.verifyHistoryOptionDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-2 : Verify Actions are displayed on hover over actions icon", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyActionsDisplayedOnHoverOver().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
  
  it("TC-3 : Verify Comments are displayed on hover over Comments icon", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyCommentsDisplayedOnHoverOver().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-4 : Verify History are displayed on hover over History icon", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyHistoryDisplayedOnHoverOver().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it("TC-5 : Verify History/Action logs section is displayed on clicking on history icon", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.clickActionsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    benchAndReview.verifyActionDetailsPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.clickCommentsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    benchAndReview.verifyActionDetailsPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.clickHistoryIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    benchAndReview.verifyActionDetailsPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    /**
     * Note -
     * Adding comments and actions from bench review page and verifying it on history section - Pending
     * Part of other story
     */
  });
  
});