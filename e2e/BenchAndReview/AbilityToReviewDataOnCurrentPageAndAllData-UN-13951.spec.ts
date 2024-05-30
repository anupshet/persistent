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
  .parseJson("./JSON_data/AbilityToReviewDataOnCurrentPageAndAllData-UN-13951.json")
  .then(function (data) {
    jsonData = data;
  });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: Ability to review data on current page and/or All data", function () {
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
  it("Test case 1: Clicking on Analyte dropdown Check user able to get two dropdown option.", function () {
    benchAndSupervisorReview.verifyAnalyteDropDownOption().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 2: Selecting  SELECT ALL ANALYTE RUNS ON CURRENT PAGE from analyte dropdown check user able to Runs on the current page.", function () {
    benchAndSupervisorReview.verifyCurrentPageAnalyteChkBoxSelected().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 3: Selecting SELECT ALL ANALYTE RUNS ON ALL PAGES from analyte dropdown check user able to runs on all pages.", function () {
    benchAndSupervisorReview.verifyAllPageAnalyteChkBoxSelected().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 4: Clicking on Reviewed Button check selected runs as reviewed and remove from the list in current page.", function () {
    benchAndSupervisorReview.verifyReviewedAnalyteRemovedFromCurrentPage(jsonData.LocationName).then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 5: Clicking on Reviewed Button check selected runs as reviewed and remove from the list in All page.", function () {
    benchAndSupervisorReview.verifyReviewedAnalyteRemovedFromAllPage(jsonData.LocationName).then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 6: Clicking on 'GO TO DASHBOARD' check user navigate to dashboard.", function () {
    benchAndSupervisorReview.verifyGoToDashboardBtnFun(jsonData.LocationName).then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 7: Clicking on 'REFRESH RESULTS check' user will refresh Bench review data."+
  "Test case 10 : Clicking on CANCEL button and check user navigate to dashboard page.", function () {
    benchAndSupervisorReview.verifyRefreshResultBtnFun(jsonData.LocationName).then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 8: While the runs are selected and reviewer clicks on Dashboard (on breadcrumb) or tries to navigate out of Bench review Check Message is displayed.", function () {
    benchAndSupervisorReview.verifyOnClickDashboardPopUpMsg().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it("Test case 9: Clicking on Mark And Exit button and check user navigate out of Supervisor review.", function () {
    benchAndSupervisorReview.verifyOnClickMarkAndExitNavigateDashboard().then(function (result) {
      expect(result).toBe(true);
    });
  });

})