//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
const library=new BrowserLibrary();
const fs = require('fs');
let jsonData;

library.parseJson('./JSON_data/advancelj-206891.json').then(function(data) {
    jsonData = data;
  });



describe('Test Suite 206891: Create dialog to contain Advanced LJ Component', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const library = new BrowserLibrary();
    const labsetup = new NewLabSetup();
    const advancedLj = new AdvancedLJ();

    beforeEach(function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
    });

    afterEach(function () {
        out.signOut();
    });

    it('Test Case 1:To Verify action of clicking on to forward and backward button in Advanced LJ Chart', function () {
        library.logStep('To Verify action of clicking on to forward and backward button in Advanced LJ Chart')
        labsetup.navigateTO(jsonData.Department).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Control).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        advancedLj.clickLJChart().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.clickForwardAnalyteButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.clickBackwardAnalyteButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
    });
    it('Test Case 2:To Verify button gets disabled when no previous and next analyte is there.', function () {
        library.logStep('To Verify button gets disabled when no previous and next analyte is there.')
        labsetup.navigateTO(jsonData.Department).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Control).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
            expect(navigated).toBe(true);
        });
        advancedLj.clickLJChart().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.clickForwardAnalyteButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.verifyForwardAnalyteButtonDisabled().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.clickBackwardAnalyteButton().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        advancedLj.verifyBackwardAnalyteButtonDisabled().then(function (clicked) {
            expect(clicked).toBe(true);
        });
    });
});
