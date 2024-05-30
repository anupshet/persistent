/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
declare const allure: any;
import { browser, by, element, protractor } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;
const dashboard = new Dashboard();
const library = new BrowserLibrary();
const username = 'okta-signin-username';
const password = 'okta-signin-password';
const signin = 'okta-signin-submit';
const rememberCheckBox = 'div[class="custom-checkbox"]';
const forgotPasswordLink = 'a.link.js-forgot-password';
// const emailOrUsername = 'input[name="username"][placeholder="Email or Username"]';
const emailOrUsername = './/input[@placeholder="Username"]';
const backToSignInLink = 'a[data-se="back-link"]';
// const resetButton = 'a[data-se="email-button"]';
const resetButton = './/button[@class="button-email"]';
const backToSignIn = 'a[data-se="back-button"]';
const message = 'p[data-se="o-form-explain"]';
const avatar = '(.//mat-icon[@role="img"])[1]/../span';
const unityNext = './/button/span[text() = "Unity Next"]';
const unityNex = './/div[contains(@aria-label, "Email has been sent to")]';
const acceptCookiesBtn = '//button//span[text()="accept & continue"]';

fs.readFile('./JSON_data/LoginEvent.json', (err, data) => {
    if (err) { throw err; }
    const loginEventData = JSON.parse(data);
    jsonData = loginEventData;
});
export class LoginEvent {
    loginPage() {
        return new Promise((resolve) => {
            let userFound = false;
            browser.get(jsonData.URL);
            const username1 = element(by.id(username));
            const password1 = element(by.id(password));
            const signin1 = element(by.id(signin));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(username1), 15000);
            browser.wait(EC.presenceOf(password1), 15000);
            browser.wait(EC.presenceOf(signin1), 15000);
            username1.sendKeys(jsonData.AccountManagerUsername);
            password1.sendKeys(jsonData.AccountManagerPassword);
            signin1.click().then(function () {
                const avatar1 = element(by.className(avatar));
                browser.wait(EC.presenceOf(avatar1), 15000);
                avatar1.getText().then(function (avatarIcon) {
                    if (avatarIcon.includes(jsonData.AccountManagerFirstName)) {
                        userFound = true;
                    }
                });
            }).then(function () {
                resolve(userFound);
            });
        });
    }
    verifyUsername(url) {
        return new Promise((resolve) => {
            let usernameFound = false;
            browser.get(url);
            this.clickAcceptAndDecline();
            const username1 = element(by.id(username));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(username1), 15000);
            username1.isDisplayed().then(function (value) {
                if (value === true) {
                    usernameFound = true;
                    library.logStepWithScreenshot('Username verified.', 'verified');
                }
            }).then(function () {
                resolve(usernameFound);
            });
        });
    }
    verifyPassword(url) {
        let passwordFound = false;
        return new Promise((resolve) => {
            browser.get(url);
            this.clickAcceptAndDecline();
            const password1 = element(by.id(password));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(password1), 15000);
            password1.isDisplayed().then(function (value) {
                if (value === true) {
                    passwordFound = true;
                    library.logStepWithScreenshot('Password verified.', 'PasswordVerified');
                } else {
                    library.logFailStep('Password not verified.');
                }
            }).then(function () {
                resolve(passwordFound);
            });
        });
    }
    verifyRememberCheckBox(url) {
        return new Promise((resolve) => {
            let checkboxFound = false;
            browser.get(url);
            this.clickAcceptAndDecline();
            const rememberCheckBox1 = element(by.css(rememberCheckBox));
            const username1 = element(by.id(username));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(username1), 15000);
            rememberCheckBox1.isDisplayed().then(function (value) {
                if (value === true) {
                    checkboxFound = true;
                    library.logStepWithScreenshot('Remember Me Checkbox verified.', 'verified');
                }
            }).then(function () {
                resolve(checkboxFound);
            });
        });
    }
    verifyForgotPasswordLink(url) {
        return new Promise((resolve) => {
            let forgotPasswordFound = false;
            browser.get(url);
            this.clickAcceptAndDecline();
            const forgotPasswordLink1 = findElement(locatorType.CSS, forgotPasswordLink);
            library.scrollToElement(forgotPasswordLink1);
            forgotPasswordLink1.click().then(function () {
                const emailOrUsername1 = findElement(locatorType.XPATH, emailOrUsername);
                emailOrUsername1.isDisplayed().then(function (value) {
                    if (value === true) {
                        forgotPasswordFound = true;
                        library.logStepWithScreenshot('Forgot Password Link verified.', 'verified');
                        browser.sleep(2000);
                    }
                }).then(function () {
                    resolve(forgotPasswordFound);
                });
            });
        });
    }
    verifyBackToSignIn() {
        return new Promise((resolve) => {
            let bckToSignIn = false;
            browser.sleep(2000);
            const backToSignInLink1 = element(by.css(backToSignInLink));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(backToSignInLink1), 15000);
            backToSignInLink1.click().then(function () {
                const username1 = element(by.id(username));
                browser.wait(EC.presenceOf(username1), 15000);
                username1.isDisplayed().then(function (value) {
                    if (value === true) {
                        bckToSignIn = true;
                        library.logStepWithScreenshot('Back to Sign in verified.', 'signIn');
                        browser.sleep(2000);
                    }
                }).then(function () {
                    resolve(bckToSignIn);
                });
            });
        });
    }
    verifyResetPasswordButton(email, ResetPasswordMessage) {
        return new Promise((resolve) => {
            let resetPasswordFunctionality = false;
            const emailOrUsername1 = findElement(locatorType.XPATH, emailOrUsername);
            emailOrUsername1.sendKeys(email).then(function () {
                const resetButton1 = element(by.xpath(resetButton));
                resetButton1.click().then(function (value) {
                    const message1 = findElement(locatorType.XPATH, './/div[contains(@aria-label, "Email has been sent to")]');
                    const expected_message = ResetPasswordMessage;
                    message1.getText().then(function (actual_message) {
                        if (expected_message === actual_message) {
                            library.logStepWithScreenshot('Password Reset Button verified.', 'resetPassword');
                            resetPasswordFunctionality = true;
                        }
                    }).then(function () {
                        resolve(resetPasswordFunctionality);
                    });
                });
            });
        });
    }
    loginPageUser() {
        return new Promise((resolve) => {
            let userFound = false;
            browser.get(jsonData.URL);
            const username1 = element(by.id(username));
            const password1 = element(by.id(password));
            const signin1 = element(by.id(signin));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(username1), 15000);
            browser.wait(EC.presenceOf(password1), 15000);
            browser.wait(EC.presenceOf(signin1), 15000);
            username1.sendKeys(jsonData.UserUsername);
            password1.sendKeys(jsonData.UserPassword);
            signin1.click().then(function () {
                const avatar1 = element(by.className(avatar));
                browser.wait(EC.presenceOf(avatar1), 15000);
                avatar1.getText().then(function (avatarIcon) {
                    if (avatarIcon.includes(jsonData.UserFirstName)) {
                        library.logStep('Logged In Successfully');
                        userFound = true;
                    }
                });
            }).then(function () {
                resolve(userFound);
            });
        });
    }
    doLogin(Username, Password, Firstname) {
        return new Promise((resolve) => {
            let userFound = false;
            const username1 = findElement(locatorType.ID, username);
            const password1 = findElement(locatorType.ID, password);
            const signin1 = findElement(locatorType.ID, signin);
            username1.sendKeys(Username);
            password1.sendKeys(Password);
            library.clickJS(signin1);
            const avatar1 = findElement(locatorType.XPATH, avatar);
            if (avatar1.isDisplayed()) {
                userFound = true;
                library.logStep('Logged In with user: ' + Username);
            }
            resolve(userFound);
        });
    }
    loginPageAdmin() {
        return new Promise((resolve) => {
            let userFound = false;
            browser.get(jsonData.URL);
            const username1 = element(by.id(username));
            const password1 = element(by.id(password));
            const signin1 = element(by.id(signin));
            const EC = protractor.ExpectedConditions;
            browser.wait(EC.presenceOf(username1), 15000);
            browser.wait(EC.presenceOf(password1), 15000);
            browser.wait(EC.presenceOf(signin1), 15000);
            username1.sendKeys(jsonData.AdminUsername);
            password1.sendKeys(jsonData.AdminPassword);
            signin1.click().then(function () {
                const avatar1 = element(by.className(avatar));
                browser.wait(EC.presenceOf(avatar1), 15000);
                avatar1.getText().then(function (avatarIcon) {
                    if (avatarIcon.includes(jsonData.AdminFirstName)) {
                        userFound = true;
                    }
                });
            }).then(function () {
                resolve(userFound);
            });
        });
    }
    // loginToApplication(url, uname, pword, fname) {
    //     browser.get(url);
    //     return new Promise((resolve) => {
    //         let userFound = false;
    //         browser.get(url);
    //         const username1 = findElement(locatorType.ID, username);
    //         const password1 = findElement(locatorType.ID, password);
    //         const signin1 = findElement(locatorType.ID, signin);
    //         username1.sendKeys(uname);
    //         password1.sendKeys(pword);
    //         signin1.click().then(function () {
    //             //   const unityBtn = element(by.xpath(unityNext));
    //             const unityBtn = findElement(locatorType.XPATH, unityNext);
    //             library.clickJS(unityBtn);
    //             //   const avatar1 = element(by.xpath(avatar));
    //             const avatar1 = findElement(locatorType.XPATH, avatar);
    //             //  browser.wait(EC.presenceOf(avatar1), 5000);
    //             avatar1.getText().then(function (avatarIcon) {
    //                 if (avatarIcon.includes(fname)) {
    //                     userFound = true;
    //                     log4jsconfig.log().info('User logged in');
    //                     library.logStepWithScreenshot('User logged in', 'login');
    //                     resolve(userFound);
    //                 }
    //             });
    //         });
    //     });
    // }

    async loginToApplication(url, uname, pword, fname) {
        console.log("url="+url);
        let userFound = false;
        await browser.get(url);
        const username1 = await element(by.id(username));
        const password1 = await element(by.id(password));
        const signin1 = await element(by.id(signin));
        var acceptButton = await element(by.xpath(acceptCookiesBtn));
        await browser.wait(browser.ExpectedConditions.presenceOf(username1), 5000);
        await browser.wait(browser.ExpectedConditions.presenceOf(password1), 5000);
        await browser.wait(browser.ExpectedConditions.presenceOf(signin1), 5000);
        await this.clickAcceptAndDecline();
        await browser.wait(browser.ExpectedConditions.invisibilityOf(acceptButton), 5000);
        await username1.sendKeys(uname);
        await password1.sendKeys(pword);
        library.scrollToElement(signin1);
        await library.clickJS(signin1);
        await library.waitLoadingImageIconToBeInvisible();
        const avatar1 = await element(by.xpath(avatar));
        await browser.wait(browser.ExpectedConditions.visibilityOf(avatar1), 5000);
        let text = await avatar1.getText();
        if (text.includes(fname)) {
            userFound = true;
            log4jsconfig.log().info('User logged in');
            library.logStepWithScreenshot('User logged in', 'login');
        }
        return userFound;
    }
    async clickAcceptAndDecline() {
        let flag = false;
        var acceptButton = await element(by.xpath(acceptCookiesBtn));
        await acceptButton.isPresent().then(function (result) {
            if (result) {
                flag = result;
                library.logStepWithScreenshot('Cookies Displayed', 'Cookies displayed');
                library.clickJS(acceptButton);
            } else {
                library.logStepWithScreenshot('Cookies not Displayed', 'Cookies not displayed');
            }
        });
        return flag;
    }


    async loginToApplication1(url,uname, pword, fname) {
       // console.log("url="+url);
        let userFound = false;
        //await browser.get(url);
        const username1 = await element(by.id(username));
        const password1 = await element(by.id(password));
        const signin1 = await element(by.id(signin));
        var acceptButton = await element(by.xpath(acceptCookiesBtn));
        //await browser.wait(browser.ExpectedConditions.presenceOf(username1), 2500);
        //await browser.wait(browser.ExpectedConditions.presenceOf(password1), 2500);
       // await browser.wait(browser.ExpectedConditions.presenceOf(signin1), 2500);
       // await this.clickAcceptAndDecline();
       await browser.wait(browser.ExpectedConditions.invisibilityOf(acceptButton), 5000);
        await username1.sendKeys(uname);
        await password1.sendKeys(pword);
        library.scrollToElement(signin1);
        await library.clickJS(signin1);
        await library.waitLoadingImageIconToBeInvisible();
        const avatar1 = await element(by.xpath(avatar));
        await browser.wait(browser.ExpectedConditions.visibilityOf(avatar1), 5000);
        let text = await avatar1.getText();
        if (text.includes(fname)) {
            userFound = true;
            log4jsconfig.log().info('User logged in');
            library.logStepWithScreenshot('User logged in', 'login');
        }
        return userFound;
    }
    async clickAcceptAndDecline1(url) {
        console.log("url="+url);
        await browser.get(url);
        let flag = false;
        var acceptButton = await element(by.xpath(acceptCookiesBtn));
        await browser.wait(browser.ExpectedConditions.visibilityOf(acceptButton), 5000);
        await acceptButton.isPresent().then(function (result) {
            if (result) {
                flag = result;
                library.logStepWithScreenshot('Cookies Displayed', 'Cookies displayed');
                library.clickJS(acceptButton);
            } else {
                library.logStepWithScreenshot('Cookies not Displayed', 'Cookies not displayed');
            }
        });
        return flag;
    }
    loginToQCP(url, uname, pword) {
        let userFound = false;
        return new Promise((resolve) => {
            browser.get(url);
            // browser.sleep(5000);
            const clickLogin = element(by.xpath('.//a[contains(text(), "Log in")]'));
            browser.wait(browser.ExpectedConditions.visibilityOf(clickLogin), 20000, 'Login not visible');
            library.click(clickLogin);
            // browser.sleep(5000);
            const username1 = element(by.id(username));
            const password1 = element(by.id(password));
            browser.wait(browser.ExpectedConditions.visibilityOf(username1), 20000, 'Username not visible');
            username1.sendKeys(uname);
            password1.sendKeys(pword);
            const signin1 = element(by.id(signin));
            signin1.click().then(function () {
                browser.sleep(5000);
                console.log('Clicked');
                userFound = true;
                resolve(userFound);
            });
        });
    }
}


