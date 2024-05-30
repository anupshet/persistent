/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-231950-AccountListing.json').then(function (data) {
  jsonData = data;
});

describe('PBI_231950: Verify the Functionality of Account listing screen', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const manager = new AccoutManager();
    const library = new BrowserLibrary();

    beforeEach(function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
            jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
                expect(loggedIn).toBe(true);
            });
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
    });

    afterEach(function () {
        out.signOut();
    });

    it('TC-2: To verify the UI of Account & Location Management page, TC-5: To verify the delete Account Button appears for Accounts with 0 locations, TC-6: To verify the delete Account Button does not appear for Accounts with 1 or more locations, TC-7: To verify that the Location button is displayed for all the Accounts', function () {
        library.logStep('To verify the UI of Account & Location Management page');
        library.logStep('To verify the delete Account Button appears for Accounts with 0 locations');
        library.logStep('To verify the delete Account Button does not appear for Accounts with 1 or more locations');
        library.logStep('To verify that the Location button is displayed for all the Accounts');
        manager.verifyAccountLocationManagementPageUI().then(function (AccountLocationManagementPage) {
            expect(AccountLocationManagementPage).toBe(true);
        });
        manager.verifyDeleteButton(jsonData.NoLocationsAccount).then(function (deleteIconDisplayed) {
            expect(deleteIconDisplayed).toBe(true);
        });
        manager.verifyNoDeleteButton(jsonData.NotANoLocationsAccount).then(function (deleteIconNotDisplayed) {
            expect(deleteIconNotDisplayed).toBe(true);
        });
        manager.verifyLocationsDisplayedForAllAccounts().then(function (LocationsDisplayedForAllAccounts) {
            expect(LocationsDisplayedForAllAccounts).toBe(true);
        });
    });
});
