/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { browser } from "protractor";
import { BrowserLibrary } from "../utils/browserUtil";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";

const library = new BrowserLibrary();
let jsonData;

library
  .parseJson("./JSON_data/AbilityToReviewIndividualDataRuns-UN-16749.json")
  .then(function (data) {
    jsonData = data;
  });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: Ability to review runs individually on any pages", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndSupervisorReview = new BenchAndReview();

  beforeEach(async function () {
    await loginEvent.loginToApplication(
      jsonData.URL,
      jsonData.Username,
      jsonData.Password,
      jsonData.FirstName
    );
  });

  afterEach(function () {
    out.signOut();
  });
  it("Test case 1: Clicking on Individual Analyte Checkbox and Check user able Reviews individually Analyte.", function () {
    benchAndSupervisorReview.verifyAnalyteCheckbox().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 2: Clicking on Individual Analyte Checkbox in any page and Check user able run/Reviews individually Analyte.", function () {
    benchAndSupervisorReview
      .verifyAnalyteFromNextPageCheckbox()
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 3: Clicking on Reviewed Button for individual Analyte run and check selected runs as reviewed Analyte and remove from the Analyte data table list.", function () {
    benchAndSupervisorReview
      .verifyAnalyteRemovedFromList()
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 4: Clicking individual Analyte run then Go to Dashboard and check user navigate to dashboard..", function () {
    benchAndSupervisorReview
      .verifyOnClickDashboardMsgPopUp()
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 5: Clicking on Mark And Exit button and check user navigate out of Supervisor review.", function () {
    benchAndSupervisorReview
      .verifyOnClickMarkAndExitDashboard()
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 6: Clicking on X Icon and check user in same page with no change.", function () {
    benchAndSupervisorReview.verifyOnXIconClick().then(function (result) {
      expect(result).toBe(true);
    });
  });
});
