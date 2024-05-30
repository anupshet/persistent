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

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/AbilityToManageDataColumn-UN-13949.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Save and persist column preferences by User', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    let selection;

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1: Verify the column preferences are preserved when navigated to other page then Back to Bench Supervisor page', async function () {
        await benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.invertCheckBoxSelectionAndSave();
        }).then((x) => {
            selection = x;
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.verifyCheckboxSelection(selection);
        })
    });

    it('Test case 2: Verify the columns are updated based on the saved preferences when navigated to other page then back to Supervisor Page', async function () {
       await benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.invertCheckBoxSelectionAndSave();
        }).then((x) => {
            selection = x;
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.verifyColumnPresentAbsent(selection);
        });
    });


    it('Test case 3: Verify the column preferences are preserved when user logs out and login back', async function () {
        await benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.invertCheckBoxSelectionAndSave();
        }).then((x) => {
            selection = x;
            return out.signOut();
        }).then(() => {
            return loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.verifyCheckboxSelection(selection);
        });
    });

    it('Test case 4: Verify the columns are updated based on the saved preferences when user logs out and login back',async function () {
        await benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.invertCheckBoxSelectionAndSave();
        }).then((x) => {
            selection = x;
            return out.signOut();
        }).then(() => {
            return loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.verifyColumnPresentAbsent(selection);
        });
    });

    it('Test case 5: Verify the column preferences are preserved across different locations', async function () {
        await benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.invertCheckBoxSelectionAndSave();
        }).then((x) => {
            selection = x;
            return benchAndSupervisorReview.switchToLocation2();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.openDataColumnWindow();
        }).then(() => {
            return benchAndSupervisorReview.verifyCheckboxSelection(selection);
        });
    });

});
