/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';

const manager = new AccoutManager();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

fs.readFile('./JSON_data/PBI-233541-EditAccount.json', (err, data) => {
    if (err) { throw err; }
    const manuallyAddNewUserData = JSON.parse(data);
    jsonData = manuallyAddNewUserData;
});

describe('Verify the Functionality of Account Management card', function () {
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

    it('Test case 1: To verify if user is able to add a new account with valid field values.', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.addAccountValidDetails(jsonData).then(function (detailsAdded) {
            expect(detailsAdded).toBe(true);
        });
        manager.clickAddAccountSubmitButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        manager.searchAccountbyEmail(jsonData.LabContactEmail).then(function (verified) {
            expect(verified).toBe(true);
        });
    });

    it('Test case 2 : Verify user is able to edit an existing account with valid field values.', function () {
        manager.searchAccountbyEmail(jsonData.LabContactEmail).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.updateLabAccountDetails(jsonData).then(function (update) {
            expect(update).toBe(true);
        });
        manager.clickUpdateAccountButton().then(function (update) {
            expect(update).toBe(true);
        });
        manager.searchAccountbyEmailNew(jsonData.LabContactEmail).then(function (verified) {
            expect(verified).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyUpdatedDetails(jsonData).then(function (update) {
            expect(update).toBe(true);
        });
        manager.clickCancelButton().then(function (update) {
            expect(update).toBe(true);
        });
    });

    it('Test case 3 : Verify error message is displayed if entered email already exists.', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchAccountNew(jsonData.LabContactEmail).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.updateEmailtoExisting(jsonData.ExistingEmail).then(function (update) {
            expect(update).toBe(true);
        });
        manager.clickUpdateAccountButton().then(function (update) {
            expect(update).toBe(true);
        });
        manager.verifyUpdatedEmail(jsonData.LabContactEmail).then(function (update) {
            expect(update).toBe(true);
        });
    });

    it('Test case 4 : Verify if the warning message with "save" and "Exit without saving" option is displayed', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchAccountNew(jsonData.LabContactEmailSearch).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.updateEmailtoExisting(jsonData.ExistingEmail).then(function (update) {
            expect(update).toBe(true);
        });
        manager.clickUpdateFormCloseButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Test case 5 : Verify Update account button is disabled by default.', function () {
        manager.searchAccountbyEmail(jsonData.LabContactEmailSearch).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyUpdateButton().then(function (enabled) {
            expect(enabled).toBe(false);
        });
        manager.clickCancelButton().then(function (enabled) {
            expect(enabled).toBe(true);
        });
    });

    it('Test case 6 : Verify Update account button enables upon updating any value from account details.', function () {
        manager.searchAccountbyEmail(jsonData.LabContactEmailSearch).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.goToEditLabAccount().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.updateEmailtoExisting(jsonData.ExistingEmail).then(function (update) {
            expect(update).toBe(true);
        });
        manager.verifyUpdateButton().then(function (enabled) {
            expect(enabled).toBe(true);
        });
        manager.clickCancelButton().then(function (enabled) {
            expect(enabled).toBe(true);
        });
        manager.clickOnExitWithoutSavingBtn().then(function (clicked) {
            expect(clicked).toBe(true);
        });
    });
});
