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
  .parseJson("./JSON_data/updatedDataPointsResentForBenchReview-UN-17126.json")
  .then(function (data) {
    jsonData = data;
  });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe("Test Suite: Updated Data points resent for Bench review.", function () {
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
  it("Test case 1: Data Point Update for Reviewed Analyte and check Bench and review page updated data point."+
  "Test case 2:Corrective Actions Update for Reviewed Analyte and check Bench and review page updated Corrective Actions."+
  "Test case 3:Reagent lot Update for Reviewed Analyte and check Bench and review page updated Reagent lot."+
  "Test case 4:Reagent lot Update for Reviewed Analyte and check Bench and review page updated Reagent lot.", function () {
    benchAndSupervisorReview.verifyAnalyteRemovedFromList().then(function (result) {
      expect(result).toBe(true);
    });
    benchAndSupervisorReview.navigateToAnalyteAndVerifySummitBtn(jsonData.InputDat2,jsonData.DepartmentName,jsonData.Instrument,jsonData.ControlName,jsonData.AnalyteName).then(function (result) {
      expect(result).toBe(true);
    });
  });
});