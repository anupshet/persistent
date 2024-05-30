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

library.parseJson('./JSON_data/TopFiltersCounts-UN-17066.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Top filters- Counts', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    const westgard = new WestgardRule();
    let AcceptedFilterCount: string, RejectedFilterCount: string, WarningFilterCount: string, ActionsCommentsFilterCount: string;

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1: Verify runs with non accepted data to be reviewed  for all/selected departments/instruments', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyAcceptedFiltersAsZeroCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })

    it('Test case 2: Verify runs with non rejected data to be reviewed  for all/selected departments/instruments', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
         return benchAndSupervisorReview.VerifyRejectedFiltersAsZeroCount();
        }).then((x) => {
            expect(x).toBe(true);
        });

    })

    it('Test case 3: Verify runs with non warning data to be reviewed  for all/selected departments/instruments', async function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyWarningFiltersAsZeroCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })

    it('Test case 4: Verify runs with non action/commented data to be reviewed  for all/selected departments/instruments', async function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyActionCommentsZeroFiltersCount();
           }).then((x) => {
            expect(x).toBe(true);
        });
     })

    it('Test case 5: Verify number of Accepted runs for the presented data displays with respective count value for all/selected departments/instuments', async function () {
        dashBoard.clickUnityNext().then(() => {
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
            return benchAndSupervisorReview.VerifyAcceptedFiltersCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    });

    it('Test case 6: Verify number of Rejected runs for the presented data displays with respective count value for all/selected departments/instuments', async function () {
         dashBoard.clickUnityNext().then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument, jsonData.Control, jsonData.Analyte);
        }).then(() => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.RejectedLevel1Pvalue, jsonData.RejectedLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.VerifyRejectedFiltersCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    });

    it('Test case 7: Verify number of Warning runs for the presented data displays with respective count value for all/selected departments/instuments', async function () {
       dashBoard.clickUnityNext().then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument, jsonData.Control, jsonData.Analyte);
        }).then(() => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.WarningLevel1Pvalue, jsonData.WarningLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.VerifyWarningFiltersCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    });

    it('Test case 8: Verify number of Actions/Comments runs for the presented data displays with respective count value for all/selected departments/instuments', async function () {
       dashBoard.clickUnityNext().then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument, jsonData.Control, jsonData.Analyte);
        }).then(() => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.ActionsCommentsLevel1Pvalue, jsonData.ActionsCommentsLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.VerifyActionsCpommentsFiltersCount();
        }).then((x) => {
            expect(x).toBe(true);
        });
    });
})