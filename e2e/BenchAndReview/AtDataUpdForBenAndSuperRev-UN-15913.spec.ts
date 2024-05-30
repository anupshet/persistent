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
  .parseJson("./JSON_data/AtDataUpdForBenAndSuperRev-UN-15913.json")
  .then(function (data) {
    jsonData = data;
  });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe("Test Suite: Audit Trail: Data updates for Bench and Supervisor review", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();  
  const library = new BrowserLibrary();
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
  it("Test case 1: Update data updates and check Audit trail capture actions taken for data updates by Bench reviewer under Bench review and Supervisor reviewer under Supervisor review respectively.", function () {
    benchAndSupervisorReview.verifyAnalyteDropDownOption().then(function (result) {
      expect(result).toBe(true);
    });
    
    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload1, jsonData.statusCode1);

    benchAndSupervisorReview.verifyCurrentPageAnalyteChkBoxSelected().then(function (result) {
      expect(result).toBe(true);
    });    
    benchAndSupervisorReview.verifyReviewedAnalyteRemovedFromCurrentPage(jsonData.LocationName).then(function (result) {
      expect(result).toBe(true);
    });
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
      return benchAndSupervisorReview.VerifyEditButton();
    }).then((x) => {
      expect(x).toBe(true);
    }); benchAndSupervisorReview.openBenchReviewPage().then(() => {
      return benchAndSupervisorReview.VerifyIsStautsEditable();
    }).then((x) => {
      expect(x).toBe(true);
    });
    
    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload1, jsonData.statusCode1);
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
      return benchAndSupervisorReview.VerifyIsResultEditable();
    }).then((x) => {
      expect(x).toBe(true);
    });
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
      return benchAndSupervisorReview.VerifyActionCommentHistory();
    }).then((x) => {
      expect(x).toBe(true);
    });
    
    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload1, jsonData.statusCode1);
  });
});