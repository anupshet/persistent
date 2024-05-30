/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const library = new BrowserLibrary();
const manager = new AccoutManager();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

library.parseJson('./JSON_data/PBI-232056-DeleteAccount.json').then(function (data) {
    jsonData = data;
});

describe('Delete an account', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();

    beforeEach(function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
            jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
                expect(loggedIn).toBe(true);
            });
    });

    afterEach(function () {
        out.signOut();
    });

    it('Test case 4: To verify Clicking on cancel button takes the user back to the account management page', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.clickDeleteIconWithZeroLoc().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.clickOnCancelFromPopup().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyAccountsReloaded().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
    });

    it('Test case 5: To verify Clicking on exit button takes the user back to the account management page', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.clickDeleteIconWithZeroLoc().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.clickOnCloseFromPopup().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyAccountsReloaded().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
    });

    it('Test case 1: To verify if the delete icon is present for the account having zero locartions' +
        'Test case 2 : To verify a confirmation dialogue box is presented after clicking on the delete icon' +
        'Test case 3 : To verify the confirmation dialogue box contains "cancle","confirm delete" and "exit" buttons ' +
        'Test case 6 : To verify if the account has deleted after clicking on confirm delete button', function () {
            dashBoard.goToAccountManagementpage().then(function (status) {
                expect(status).toBe(true);
            });
            manager.clickDeleteIconWithZeroLoc().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.clickOnConfirmDeleteLocation().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyAccountsDeleted().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
        });
});

