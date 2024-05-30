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

library.parseJson('./JSON_data/ManageExpectedTestsLink.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Add MANAGE EXPECTED TESTS link on Bench and Supervisor review pages', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    
    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1: Verify Manage Expected Tests link is displayed on Bench and Supervisor Review', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyManageExpectedTestsIsPresent();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })
    it('Test case 2: Verify hovering over the "MANAGE EXPECTED TESTS" link will make color change and visible for click', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
         return benchAndSupervisorReview.VerifyColorChangeOfManageExpectedTests();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })
    it('Test case 3: Verify hovering over the "MANAGE EXPECTED TESTS" link will make it clickable ', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyManageExpectedTestsIsClickable();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })
  })