/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from "../page-objects/login-e2e.po";
import { LogOut } from "../page-objects/logout-e2e.po";
import { browser } from "protractor";
import { BrowserLibrary } from "../utils/browserUtil";
import { BenchAndReview } from "../page-objects/BenchAndReview-e2e.po";

const fs = require("fs");
const library = new BrowserLibrary();
let jsonData;

library
  .parseJson("./JSON_data/RenameSendToPeerQcButtonToSubmit-UN-17005.json")
  .then(function (data) {
    jsonData = data;
  });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: Ability To Manage Data Column", function () {
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

  it("Test case 1: Check user get Submit button in Instrument page.", function () {
    benchAndSupervisorReview
      .navigateToInstrumentAndVerifySummitBtn(jsonData.InputDat,jsonData.DepartmentName,jsonData.Instrument)
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 2: Check user get Submit button in COntrol page.", function () {
    benchAndSupervisorReview
      .navigateToControlAndVerifySummitBtn(jsonData.InputDat1,jsonData.DepartmentName,jsonData.Instrument,jsonData.ControlName)
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 3: Check user get Submit button in Analyte page.", function () {
    benchAndSupervisorReview
      .navigateToAnalyteAndVerifySummitBtn(jsonData.InputDat2,jsonData.DepartmentName,jsonData.Instrument,jsonData.ControlName,jsonData.AnalyteName)
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
  it("Test case 4: Check user get Submit button in panel page.", function () {
    benchAndSupervisorReview
      .navigateToPanelAndVerifySummitBtn(jsonData.InputDat3,jsonData.PanelNAme)
      .then(function (result) {
        expect(result).toBe(true);
      });
  });
});
