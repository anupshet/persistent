/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
declare const allure: any;
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/User-Login.json').then(function (data) {
    jsonData = data;
});

describe('Test suite: 109314 : Testing: User Login (Suite ID: 109569)', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const library = new BrowserLibrary();

    it('Test case 109818: Verify the username field on login page @P1', function () {
        library.logStep('Test case 109818: Verify the username field on login page');
        loginEvent.verifyUsername(jsonData.URL).then(function (result) {
            expect(result).toBe(true);
        });
    });

    it('Test case 109819: Verify the password field on login page @P1', function () {
        library.logStep('Test case 109819: Verify the password field on login page');
        loginEvent.verifyPassword(jsonData.URL).then(function (result) {
            expect(result).toBe(true);
        });
    });

    it('Test case 109820: Verify the remember me check box on login page @P1', function () {
        library.logStep('Test case 109820: Verify the remember me check box on login page');
        loginEvent.verifyRememberCheckBox(jsonData.URL).then(function (result) {
            expect(result).toBe(true);
        });
    });

    it('Test case 109821: Verify the forgot password link on login page @P1', function () {
        library.logStep('Test case 109821: Verify the forgot password link on login page');
        library.logStep('Test case 109823: Verify the email or username field on the reset password page');
        library.logStep('Test case 109825: Verify the Reset button on the reset password page');
        loginEvent.verifyForgotPasswordLink(jsonData.URL).then(function (result) {
            expect(result).toBe(true);
        });
        loginEvent.verifyResetPasswordButton(jsonData.Email, jsonData.ResetPasswordMessage).then(function (result) {
            expect(result).toBe(true);
        });
    });

    it('Test case 109822: Verify the Sign In button on login page @P1', function () {
        library.logStep('Test case 109822: Verify the Sign In button on login page');
        loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
        out.signOut();
    });
});
