/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { async } from '@angular/core/testing';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/AdditionalFilterCounts-UN-17067.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Additional filters-Counts', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    const westgard = new WestgardRule();
    let Last30daysFilterCount: string, violationsFilterCount: string;

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1: Verify Last 30 Days additional filters count displays with the runs available for review from the last 30 days', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument, jsonData.Control, jsonData.Analyte);
        }).then(() => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.AcceptedLevel1Pvalue, jsonData.AcceptedLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.verifylast30dayfilterCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    });


    it('Test case 2: Verify Violations additional filters count displays with the runs available for review under Warning and Rejection', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument, jsonData.Control, jsonData.Analyte);
        }).then(() => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.AcceptedLevel1Pvalue, jsonData.AcceptedLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.verifyViolationsfilterCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })

    it('Test case 3: Verify Violations filters count is addition of Warning and Rejection top filters count', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
        }).then(() => {
            return benchAndSupervisorReview.verifyViolationsIsCombinationOFWarningRejection();
        }).then((x) => {
           expect(x).toBe(true);
        });
    })

    it('Test case 4: Verify Last 30 Days filters count and Violations filters count updated when available runs got reviewed', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                //return benchAndSupervisorReview.reviewedRuns();
                return benchAndSupervisorReview.verifyReviewedAnalyteRemovedFromCurrentPage(jsonData.LocationName);
            })
            .then((x) => {
                expect(x).toBe(true);
            })
            .then(() => {
                return benchAndSupervisorReview.verifyAdditionalfilterCountAfterReview();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it("Test case 5: Clicking on 'X' Icon and check Additional Filters window get closed", function () {
        benchAndSupervisorReview.openBenchReviewPage()
          .then(() => {
         return benchAndSupervisorReview.verifyAdditionalFilterwindowOnXIconClick();
          })
          .then((x) => {
            expect(x).toBe(true); 
         });
      });
    });  
