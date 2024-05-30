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

library.parseJson("./JSON_data/SupportDataForColumnsPeerMeanPeerSdPeerCv-UN-17129.json").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-17129 : Support data for columns Peer Mean, Peer SD and Peer CV", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const benchAndReview = new BenchAndReview();

  beforeEach(async function () {
    await loginEvent.clickAcceptAndDecline1(jsonData.URL)
    .then((x) => {
     return loginEvent.loginToApplication1(jsonData.URL,jsonData.Username, jsonData.Password, jsonData.FirstName);
    })
  .then((x) => {
   expect(x).toBe(true);
  });
});

  afterEach(function () {
    out.signOut();
  });

  it("TC-1 : Check when I select columns (Peer mean, Peer SD or Peer CV), I should be presented with the relevant peer data for the Analyte by level on Bench/Supervisor Review", function () {
    benchAndReview.openBenchReviewPage1()
    .then(function (res) {
        return benchAndReview.verifyGearIcon();
    });
    
    benchAndReview.ClickOnGearIcon().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    //SelectCheckBox
    benchAndReview.SelectCheckBox().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.SelectCheckBox().then(function (displayed) {
      expect(displayed).toBe(true);    
  });


  it("TC-2 : Check when I select columns (Peer mean, Peer SD or Peer CV), I should be presented with the relevant peer data for the Analyte by level on Bench/Supervisor Review.", function () {
    benchAndReview.navigateToQCResults().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    benchAndReview.verifyRunCounterElements().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    benchAndReview.verifyAnalyteRemovedFromList().then(function (result) {
      expect(result).toBe(true);
  });
    benchAndReview.verifyAnalyteRemovedFromList().then(function (result) {
        expect(result).toBe(true);
    });
  });
  });
});