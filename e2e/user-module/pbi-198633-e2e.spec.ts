/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const manager = new AccoutManager();


const fs = require('fs');
let jsonData;

// for Test Execution on DEV
// fs.readFile('./JSON_data/pbi-198633.json', (err, data) => {
//     if (err) { throw err; }
//     const manuallyAddNewUserData = JSON.parse(data);
//     jsonData = manuallyAddNewUserData;
// });
const library = new BrowserLibrary();
library.parseJson('./JSON_data/pbi-198633.json').then(function(data) {
    jsonData = data;
  });
// for Test Execution on Stage
/*
fs.readFile('./JSON_data/AccountManager_stage.json', (err, data) => {
    if (err) { throw err; }
    const manuallyAddNewUserData = JSON.parse(data);
    jsonData = manuallyAddNewUserData;
});*/

describe('Verify the Functionality of Account Management card', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const library = new BrowserLibrary();

    beforeEach(function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
            jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
                expect(loggedIn).toBe(true);
            });
    });

    afterEach(function () {
        out.signOut();
    });

    it('Test Case 1: To verify the search account functionality using valid Ship-to number.', function () {
        library.logStep('Test Case 1: To verify the search account functionality using valid Ship-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.searchShipToSoldTo(jsonData.ShipTo, jsonData.LabName).then(function (searchedAccount) {
            expect(searchedAccount).toBe(true);
        });
    });

    it('Test Case 2: To verify the search account functionality using valid Sold-to number.', function () {
        library.logStep('Test Case 2: To verify the search account functionality using valid Sold-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.searchShipToSoldTo(jsonData.SoldTo, jsonData.LabName).then(function (searchedAccount) {
            expect(searchedAccount).toBe(true);
        });
    });

    it('Test Case 3: To verify the search accounts functionality using invalid Ship-to number.', function () {
        library.logStep('Test Case 3: To verify the search accounts functionality using invalid Ship-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.searchInvalidShipToSoldTo(jsonData.InvalidShipTo).then(function (searchedAccount) {
            expect(searchedAccount).toBe(false);
        });
    });

    it('Test Case 4: To verify the search accounts functionality using invalid Sold-to number', function () {
        library.logStep('Test Case 4: To verify the search accounts functionality using invalid Sold-to number');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.searchInvalidShipToSoldTo(jsonData.InvalidSoldTo).then(function (searchedAccount) {
            expect(searchedAccount).toBe(false);
        });
    });
});
