/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/BenchReviewPermissionsForNewRoles-UN-15018.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review Permissions For New Roles', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();

    afterEach(async function () {
        await out.signOut();
    });

    it('Test case 1 A: Verify the Bench Review Card Visibility for Account User Manager', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AUM, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(false, "Bench And Supervisor Review Card is Present for Account User Manager");
        });
    });

    it('Test case 1 B: Verify the Bench Review Card Visibility for Lab User Manager', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUM, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(false, "Bench And Supervisor Review Card is Present for Lab User Manger");
        });
    });

    it('Test case 1 C: Verify the Bench Review Card Visibility for Lab Supervisor', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LS, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for Lab Supervisor");
        });
    });

    it('Test case 1 D: Verify the Bench Review Card Visibility for Lead Technician', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LT, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for Lead Technician");
        });
    });

    it('Test case 1 E: Verify the Bench Review Card Visibility for Technician', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.T, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for Technician");
        });
    });

    it('Test case 1 F: Verify the Bench Review Card Visibility for Lot Viewer Sales User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LVS, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(false, "Bench And Supervisor Review Card is Present for Lot Viewer Sales User");
        });
    });

    it('Test case 1 G: Verify the Bench Review Card Visibility for Bio-Rad Manager', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.BM, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(false, "Bench And Supervisor Review Card is Present for Bio-Rad Manager");
        });
    });

    it('Test case 1 H: Verify the Bench Review Card Visibility for AUM+LS User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AUMLS, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for AUM+LS User");
        });
    });

    it('Test case 1 I: Verify the Bench Review Card Visibility for AUMLUMLS User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.AUMLUMLS, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for AUMLUMLS User");
        });
    });

    it('Test case 1 J: Verify the Bench Review Card Visibility for LUMLS User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUMLS, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for LUMLS User");
        });
    });

    it('Test case 1 K: Verify the Bench Review Card Visibility for LUMLT User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUMLT, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for LUMLT User");
        });
    });

    it('Test case 1 L: Verify the Bench Review Card Visibility for LUMT User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUMT, jsonData.Password, jsonData.FirstName).then(() => {
            return dashBoard.isBenchSupervisorReviewCardPresent();
        }).then((result) => {
            expect(result).toBe(true, "Bench And Supervisor Review Card is not Present for LUMT User");
        });
    });

    it('Test case 2 A: Verify the Bench Review Data Visibility for Lead Technician', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LT, jsonData.Password, jsonData.FirstName).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.isDataPresent();
        }).then((result) => {
            expect(result).toBe(true, "Data is not Present for Lead technician");
        });
    });

    it('Test case 2 B: Verify the Bench Review Data Visibility for Technician', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.T, jsonData.Password, jsonData.FirstName).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.isDataPresent();
        }).then((result) => {
            expect(result).toBe(true, "Data is not Present for Technician");
        });
    });

    it('Test case 2 C: Verify the Bench Review Data Visibility for LUM+LT User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUMLT, jsonData.Password, jsonData.FirstName).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.isDataPresent();
        }).then((result) => {
            expect(result).toBe(true, "Data is not Present for LUM+LT User");
        });
    });

    it('Test case 2 D: Verify the Bench Review Data Visibility for LUM+T User', function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.LUMT, jsonData.Password, jsonData.FirstName).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage();
        }).then(() => {
            return benchAndSupervisorReview.isDataPresent();
        }).then((result) => {
            expect(result).toBe(true, "Data is not Present for LUM+T User");
        });
    });

});
