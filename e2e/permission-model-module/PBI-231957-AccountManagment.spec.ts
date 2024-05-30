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
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-231957-AccountManagment.json').then(function (data) {
    jsonData = data;
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

    it('Test Case 1 : To verify if the account and location management page has Add an account button' +
        'Test Case 2 : Verify clicking on add an account button launches the "add an account" dialog box for entering the account details' +
        'Test Case 3 : Verify If the system generated account number is diaplayed and it is a label' +
        'Test Case 4 : Verify Account Name is a Required text field with 200 characters maximum limit.' +
        'Test Case 5 : Verify Account Address is a Required text field with 100 characters maximum limit.', function () {
            dashBoard.goToAccountManagementpage().then(function (status) {
                expect(status).toBe(true);
            });
            manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
                expect(pageDisplayed).toBe(true);
            });
            manager.clickAddAccountButton().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifySystemGeneratedAccountNoDisplayed().then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForAccountName(jsonData.DummyLabName).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForAccoutnAddress(jsonData.DummyAddressCreateAccount1).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForAccountAddress2(jsonData.DummyAddressCreateAccount2).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForAccountAddress3(jsonData.DummyAddressCreateAccount3).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.clickCancelButton().then(function (verified) {
                expect(verified).toBe(true);
            });
            manager.verifyExitWithoutSavingPopupDisplayed().then(function (verified) {
                expect(verified).toBe(true);
            });
            manager.clickOnExitWithoutSavingBtn().then(function (clicked) {
                expect(clicked).toBe(true);
            });
        });

    it('Test Case 7:Verify Account City , Zip code and State are required text field with respective maximum limit of 60 , 20 and 3 characters.'
        + 'Test Case 8: Verify Country is a Required dropdown field.'
        + 'Test Case 9: Verify First Name and Last Name are required text field with maximum limit of  50 characters.'
        + 'Test Case 10: Verify Email is a Required text field.'
        + 'Test Case 12: Verify Phone number is a Optional text field with maximum limit of 25 characters.', function () {
            dashBoard.goToAccountManagementpage().then(function (status) {
                expect(status).toBe(true);
            });
            manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
                expect(pageDisplayed).toBe(true);
            });
            manager.clickAddAccountButton().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyFieldLengthForCity(jsonData.DummyCityCreateAccount).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForZip(jsonData.DummyZipCreateAccount).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForState(jsonData.DummyStateCreateAccount).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldCountry().then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldEmail(jsonData.DummyLabContactEmail).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForPhone(jsonData.DummyLabPhoneNumber).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForFirstName(jsonData.DummyLabContactFirstName).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyFieldLengthForLastName(jsonData.DummyLabContactLastName).then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.verifyCancelButton().then(function (cancelVerified) {
                expect(cancelVerified).toBe(true);
            });
            manager.clickCancelButton().then(function (clicked) {
                expect(clicked).toBe(true);
            });
            manager.verifyExitWithoutSavingPopupDisplayed().then(function (verified) {
                expect(verified).toBe(true);
            });
            manager.clickOnExitWithoutSavingBtn().then(function (clicked) {
                expect(clicked).toBe(true);
            });
        });

    it('Test Case 13 : Verify Account is created', function () {
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
        manager.clickAddAccountButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        manager.clickCancelButton2().then(function (verified) {
            expect(verified).toBe(true);
        });
        manager.clickOnExitWithoutSavingBtn().then(function (clicked) {
            expect(clicked).toBe(true);
        });
    });
});
