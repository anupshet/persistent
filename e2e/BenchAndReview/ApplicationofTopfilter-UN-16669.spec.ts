
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

library.parseJson('./JSON_data/ApplicationofTopfilter-UN-16669.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Application of Top filters Part 2', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    const westgard = new WestgardRule();
  
    beforeEach(async function () {
        
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
        
    });

    it('Test case 1:Selecting/Clicking the top filter-Accepted on the bench review page check whether background color change to light green color and also it displays with all the runs under Accepted Filter', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyAcceptedFilterRuns();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })

    xit('Test case 2:Selecting the top filter-Warning on the bench review page check whether the background color change to light orange color and it displays with all the runs under Warning Filter', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then((x) => {
                return benchAndSupervisorReview.verifyWarningFilterRuns();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    xit('Test case 3: Selecting the top filter-Rejected on the bench review page check whether  the background color of that filter change to light red color and  it displays with all the runs under Rejected Filter.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyRejectedFilterRuns();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    xit('Test case 4:Selecting the top filter-Action/Comments on the bench review page check whether the background color of that filter change to gray color and  it displays with all the runs under Action/Comments Filter.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyActionCommentsFilterRuns();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    xit('Test case 5: Check whether the Accepted, Warning (multiple) top filters can be selected at a time/together.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyselectionOfAcceptedWarningTopFilters();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    
    xit('Test case 6: Check whether the Accepted, Rejected (multiple) top filters can be selected at a time/together.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyselectionOfAcceptedRejectedTopFilters();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    xit('Test case 7: Check whether the Accepted, Action/Comments (multiple) top filters can be selected at a time/together.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyselectionOfAcceptedActioncommentsTopFilters();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    xit('Test case 8:  Deselecting the all top filters check whether the all runs for review are display on the bench review page.', function () {
       benchAndSupervisorReview.openBenchReviewPage()
        .then(() => {
            return benchAndSupervisorReview.verifyDeselectionOfAllTopFilters();
        })
        .then((x) => {
            expect(x).toBe(true);
        });
    });
   

});
