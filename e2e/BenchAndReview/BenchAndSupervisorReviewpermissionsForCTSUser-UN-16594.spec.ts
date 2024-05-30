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

library.parseJson("./JSON_data/BenchAndSupervisorReviewpermissionsForCTSUser-UN-16594").then(function (data) {
  jsonData = data;
});

describe("Test Suite: UN-16594 : Bench and Supervisor Review permissions for CTS User", function () {
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

  it('Test case 1: Click on Dashboard check By default CTS user will land on Bench Review',async function () {
    await benchAndReview.ClickOnLaunchLabForCtsUser(jsonData.LabName)
    .then(function (result) {expect(result).toBe(true);
    });
    await benchAndReview.verifyBenchTiles(jsonData.CardName).then(function (result) {expect(result).toBe(true);
    });
});
it('Test case 2: Click on Bench and Review card and check CTS user will be allowed to use filters, additional filters, pagination, launch Adv LJ, view history'+
'Test case 4: Click on Bench and Review card and check CTS user should have the ability to view Actions list for each run'+
'Test case 6: Click on Bench and Review card and check CTS and check Check boxes next to data runs should be disabled.',async function () {
  await benchAndReview.ClickOnLaunchLabForCtsUser(jsonData.LabName)
    .then(function (result) {expect(result).toBe(true);
    });
    await benchAndReview.openBenchReviewPage1()
    .then(function (res) {
        return benchAndReview.verifyGearIcon();
    });
    await benchAndReview.ClickONFilterPaginationLjHistory().then(function (result) {expect(result).toBe(true);
    });

});
it('Test case 3: Click on Bench and Review card and check CTS user will have access to the link to      toggle from Bench and Supervisor review using the link “Switch to Supervisor review” and vice versa', async function () {
  await benchAndReview.ClickOnLaunchLabForCtsUser(jsonData.LabName)
    .then(function (result) {expect(result).toBe(true);
    });
  await benchAndReview.openBenchReviewPage1()
      .then(function (res) {
          return benchAndReview.verifyGearIcon();
      });
  await benchAndReview.SwitchToBenToSupReviewAndViceVersa().then(function (result) {expect(result).toBe(true);
      });
});

});