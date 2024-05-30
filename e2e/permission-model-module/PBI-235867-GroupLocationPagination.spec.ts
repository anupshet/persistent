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

library.parseJson('./JSON_data/PBI-235867-GroupLocationPagination.json').then(function (data) {
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

    it('Test case 1: Verify pagination controls is displayed for locations of a selected group when more than one page of locations exists.' +
        'Test case 3 : When a group is selected, and no location is present in that group then Pagination should not be shown. ', function () {
            dashBoard.goToAccountManagementpage().then(function (status) {
                expect(status).toBe(true);
            });
            manager.clickLocationsButton().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.clickGroupDropdown().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.selectGroup(jsonData.GroupName1).then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyPaginationForLocations().then(function (displayed) {
                expect(displayed).toBe(true);
            });
            manager.clickGroupDropdown().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.selectGroup(jsonData.GroupName2).then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
            manager.verifyPaginationForLocations().then(function (displayed) {
                expect(displayed).toBe(false);
            });
            manager.clickUpdateFormCloseButton().then(function (btnClicked) {
                expect(btnClicked).toBe(true);
            });
        });

    it('Test case 2: Verify pagination controls is not displayed for locations of a selected group when single page of locations exists.', function () {
        dashBoard.goToAccountManagementpage().then(function (status) {
            expect(status).toBe(true);
        });
        manager.clickNth_LocationsButton(3).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.clickGroupDropdown().then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.selectGroup(jsonData.GroupName3).then(function (btnClicked) {
            expect(btnClicked).toBe(true);
        });
        manager.verifyPaginationForLocations().then(function (displayed) {
            expect(displayed).toBe(false);
        });
        manager.clickUpdateFormCloseButton().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });
});

