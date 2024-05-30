/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/AdditionalFilters-UN-14917.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Ability To Manage Data Column', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    afterEach(function () {
        out.signOut();
    });

    it('Test case 1: Clicking on bench review card check whether the bench review page displays  with the additional filters icon', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(function (res) {
                return benchAndSupervisorReview.verifyAdditionalFilterIcon();
            });
    });

    it("Test case 2: Clicking on additional filters icon check bench review page displays  with the Additional filter window" +
       "Test case 3:Go to the additonal filter window and Verify the UI Components of Additional Filter Window" , function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then(() => {
            return benchAndSupervisorReview.openAdditionalFilterWindow();
        })
        .then(() => {
            return benchAndSupervisorReview.verifyAdditionalFilterWindowUIComponents();
        })
        .then((x) => {
            expect(x).toBe(true);
        });
    });
    it("Test case 4:By clicking on 'Last 30 Days ' and 'Violations' additional filters checkbox check whether the additional filters 'Last 30 Days' and 'Violations' can be selected/unselected."+
        "Test case 5: By Selecting the additional filters check whether UPDATE button get enabled", function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openAdditionalFilterWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyAdditionalFiltersSelectd_UpdatedBTnEnabled();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it("Test case 6: By selecting  'Last 30 Days' filter's checkbox check whether it displays all runs entered in last 30 days only." + 
       "Test case 7: Verify 'Last 30 Days' filters can selected independently." +
       "Test Case 8: By clicking on 'UPDATE' button check whether filters are apply and runs are displayed on the main page",function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openAdditionalFilterWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.VerifyIsSelectedLast30DaysFilterDisplayedRun();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });
    
    it("Test case 9: Verify 'Last 30 Days' filters can selected along with top filters." +function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openAdditionalFilterWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.VerifyIsLast30DaysFilterSelectedWithTopFilters();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it("Test case 10: By selecting 'Violations' filters checkbox check whether the 'Warning and Rejected' top filter's selected on the main page.", function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openAdditionalFilterWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyIsSelectedViolationsFilter();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it("Test case 11: By selecting 'Warning and Rejected' top filters on main page check whether 'Violations' additional filter checkbox is auto selected in additional filter window", function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openAdditionalFilterWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyIsViolationsAutoSelected();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it("Test case 12: By clicking on 'Last 30 Days' and 'Violations' filter's checkbox  check whether both additional filters can be selected together.", function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyAdditionalFiltersSelectedTogether();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

   

    it("Test case 13:Clicking on 'X' check additional filters window get closed", function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyAdditionalFilterCloseButtonFunctionality();
            })
            .then((x) => {
                expect(x).toBe(false);
            });
    });
});
