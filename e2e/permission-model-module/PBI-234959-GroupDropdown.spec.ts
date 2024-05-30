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

library.parseJson('./JSON_data/PBI-234959-GroupDropdown.json').then(function (data) {
    jsonData = data;
});

describe('Add and populate group selection dropdown list and display corresponding locations when group is selected', function () {
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

    it('Test case 1: To verify if group selection dropdown list is displayed based on the selected account' +
        'Test case 2: When a group is selected, it should display the list of locations that are associated with the group', function () {
            dashBoard.goToAccountManagementpage().then(function (status) {
                expect(status).toBe(true);
            });
            manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
                expect(pageDisplayed).toBe(true);
            });
            manager.clickLocationsButton().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyGroups(jsonData.Groups).then(function (matched) {
                expect(matched).toBe(true);
            });
            manager.clickGroupDropdown().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyGroupsInDropdown(jsonData.Groups).then(function (matched) {
                expect(matched).toBe(true);
            });
            manager.selectGroup(jsonData.GroupName1).then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyGroupLocations(jsonData.Locations).then(function (matched) {
                expect(matched).toBe(true);
            });
            manager.clickUpdateFormCloseButton().then(function (displayed) {
                expect(displayed).toBe(true);
            });
        });

    it('Test case 3: When a group is selected, and no location is present in that group then "No locations found" message should be displayed.', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickLocationsButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.clickGroupDropdown().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.selectGroup(jsonData.GroupName2).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyNoLocationsMsg().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        manager.clickUpdateFormCloseButton().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Test case 4: When there is no group for the account, the edit locations dropdown should not be displayed.', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.verifyAccountManagementDisplayed().then(function (pageDisplayed) {
            expect(pageDisplayed).toBe(true);
        });
        manager.clickLocationsNotPresentButton().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyNoGroupsMsg().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        manager.verifyGroupDropdownPresent().then(function (displayed) {
            expect(displayed).toBe(false);
        });
        manager.clickUpdateFormCloseButton().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });
});

