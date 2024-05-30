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

library.parseJson('./JSON_data/EditDataMode-View-UN17117.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Edit Data Mode- View', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1:Verify In the editable form,for a specific data run,locate a result value field and make changes and clicking on the "Update" button changes are saved.".', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyIsResultValuesUpdated(jsonData.Result);
        }).then((x) => {
            expect(x).toBe(true);
        });

    })

    it('Test case 3: Click on the edit icon for a data run and toggle the status of a result value to "Accept/Reject" to update the Status as "Accept"(Toggle ON)/"Reject"(Toggle OFF).', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyIsStautsUpdated();
        }).then((x) => {
            expect(x).toBe(true);
        });

    })

    it('Test case 4: In the "Edit" button functionality,verify clicking on the "CANCEL" button changes are abort.', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyCancelBtnFunctionality(jsonData.Result);
        }).then((x) => {
            expect(x).toBe(true);
        });

    })


})