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

const library = new BrowserLibrary();
library.parseJson('./JSON_data/AccountManager.json').then(function(data) {
    jsonData = data;
  });
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

    it('Load Account Management E2E', function () {
        library.logStep('Load Account Management E2E Start');
        const testStart = new Date().getTime();
        let endTime;
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
            endTime = new Date().getTime();
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        }).then(function () {
            const totalTime = endTime - testStart;
            library.logStep('Total time ' + totalTime + ' milleseconds');
        });
        library.logStep('Load Account Management E2E End');
    });

    it('Test Case 1: Verify that clicking on Add Account button displays the Create Account page', function () {
        library.logStep('Test Case 1: Verify that clicking on Add Account button displays the Create Account page');
        library.logStep('Test Case 2: Verify fields displayed on Create Account page');
        library.logStep('Test Case 5: Verify the action on clicking Cancel Button On Create Account page.');
        library.logStep('Test Case 9: Verify *Required field on Create Account page');
        library.logStep('Test case 15: Verify scroll bar functionality');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyCreateAccountPageHeader().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.verifyCustomerSectionUI().then(function (customerSectionVerified) {
            expect(customerSectionVerified).toBe(true);
        });
        manager.verifyLabInformationSectionUI().then(function (labInformationSectionVerified) {
            expect(labInformationSectionVerified).toBe(true);
        });
        manager.verifyLabContactSectionUI().then(function (labContactSectionVerified) {
            expect(labContactSectionVerified).toBe(true);
        });
        manager.verifyLicenseInformationSectionUI().then(function (licenseInfoVerified) {
            expect(licenseInfoVerified).toBe(true);
        });
        manager.verifyCancelButton().then(function (cancelVerified) {
            expect(cancelVerified).toBe(true);
        });
        manager.verifyCreateAccountAddAccountButton().then(function (addAccount) {
            expect(addAccount).toBe(true);
        });
        manager.verifyRequiredText().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        manager.verifyScrollBar().then(function (status) {
            expect(status).toBe(true);
        });
        manager.clickCancelButton().then(function (verified) {
            expect(verified).toBe(true);
        });
    });

    it('Test Case 3: Verify mandatory field validation on clicking Add Account button', function () {
        library.logStep('Test Case 3: Verify mandatory field validation on clicking Add Account button');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyCreateAccountPageHeader().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickCreateAccountAddAccountButton().then(function (addAccountButtonClicked) {
            expect(addAccountButtonClicked).toBe(true);
        });
        manager.verifyErrorMsgs().then(function (errorMessages) {
            expect(errorMessages).toBe(true);
        });
        manager.clickCloseButton().then(function (closed) {
            expect(closed).toBe(true);
        });
    });

    it('Test Case 4: Verify mandatory field validation on TAB.', function () {
        library.logStep('Test Case 4: Verify mandatory field validation on TAB.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyCreateAccountErrorMsg().then(function (verified) {
            expect(verified).toBe(true);
        });
        manager.clickCloseButton().then(function (closed) {
            expect(closed).toBe(true);
        });
    });

    it('Test Case 6: Verify that clicking Cancel Button discards data entered on Create Account page.', function () {
        library.logStep('Test Case 6: Verify that clicking Cancel Button discards data entered on Create Account page');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.enterDataOnCreateAccountPage(jsonData, jsonData.Connectivity).then(function (entered) {
            expect(entered).toBe(true);
        });
        manager.clickCancelButton().then(function (verified) {
            expect(verified).toBe(true);
        });
    });

    it('Test Case 10: Verify that clicking Close Button discards data entered on Create Account page', function () {
        library.logStep('Test Case 10: Verify that clicking Close Button discards data entered on Create Account page');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.enterDataOnCreateAccountPage(jsonData, jsonData.Connectivity).then(function (entered) {
            expect(entered).toBe(true);
        });
        manager.clickCloseButton().then(function (verified) {
            expect(verified).toBe(true);
        });
    });

    it('Test Case 11: Verify value in Assign Date field', function () {
        library.logStep('Test Case 11: Verify value in Assign Date field');
        library.logStep('Test case 14: Verify values in License drop down');
        library.logStep('Test Case 16: To verify that the Comment field on Create Account Page accepts 1024 characters');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyCreateAccountPageHeader().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.verifyAssignDateValue().then(function (dateValidated) {
            expect(dateValidated).toBe(true);
        });
        manager.verifyLicenseDropdownValues().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyFieldLengthForComment().then(function (fieldsVerified) {
            expect(fieldsVerified).toBe(true);
        });
        manager.clickCloseButton().then(function (closed) {
            expect(closed).toBe(true);
        });
    });

    it('Test Case 8: Verify new user account details on Account Management Page @P1', function () {
        library.logStep('Test Case 8: Verify new user account details on Account Management Page');
        library.logStep('Test Case 7: Verify new user account creation.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickAddAccountButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.enterDataOnCreateAccountPage(jsonData, jsonData.Connectivity).then(function (added) {
            expect(added).toBe(true);
        });
        manager.clickCreateAccountAddAccountButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        manager.searchAccount().then(function (verified) {
            expect(verified).toBe(true);
        });
        manager.verifyAccountSaved().then(function (verified) {
            expect(verified).toBe(true);
        });
    });

    it('PBI-198633 TC 1: To verify the search account functionality using valid Ship-to number.', function () {
        library.logStep('PBI-198633 TC 1: To verify the search account functionality using valid Ship-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchShipToSoldTo(jsonData.ShipToSearch, jsonData.LabNameSearch).then(function (searchedAccount) {
            expect(searchedAccount).toBe(true);
        });
    });

    it('PBI-198633 TC 2: To verify the search account functionality using valid Sold-to number.', function () {
        library.logStep('PBI-198633 TC 2: To verify the search account functionality using valid Sold-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchShipToSoldTo(jsonData.SoldToSearch, jsonData.LabNameSearch).then(function (searchedAccount) {
            expect(searchedAccount).toBe(true);
        });
    });

    it('PBI-198633 TC 3: To verify the search accounts functionality using invalid Ship-to number.', function () {
        library.logStep('PBI-198633 TC 3: To verify the search accounts functionality using invalid Ship-to number.');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchInvalidShipToSoldTo(jsonData.InvalidShipTo).then(function (searchedAccount) {
            expect(searchedAccount).toBe(false);
        });
    });

    it('PBI-198633 TC 4: To verify the search accounts functionality using invalid Sold-to number', function () {
        library.logStep('PBI-198633 TC 4: To verify the search accounts functionality using invalid Sold-to number');
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.searchInvalidShipToSoldTo(jsonData.InvalidSoldTo).then(function (searchedAccount) {
            expect(searchedAccount).toBe(false);
        });
    });
});
