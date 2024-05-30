/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';

const fs = require('fs');
const setting = 'icon-settings';
const overlay = 'cdk-overlay-container';
const btn = 'button';
const treeTop = 'treetop-padding';
const cardHeader = 'mat-card-header';
const header = 'header';
const h1 = 'h1';
const cardTitle = 'mat-card-title';
const aactMang = 'account-management';
const pagetTitle = 'page-title';
const userManagementtext = '//div[2]/div[2]/div/div/div/button/span[contains(text(),\'User Management\')]';

let jsonData;
fs.readFile('./JSON_data/GearIcon.json', (err, data) => {
    if (err) { throw err; }
    const gearIconData = JSON.parse(data);
    jsonData = gearIconData;
});

const dashBoard = new Dashboard();
export class GearIcon {
    gearIconLabSetup() {
        return new Promise((resolve) => {
            let foundNode = false;
            browser.driver.findElement(by.className(setting)).click().then(function () {
                dashBoard.waitForScroll();
                browser.driver.findElement(by.className(overlay)).findElements(by.tagName(btn))
                    .then(async function (options) {
                        let index = 0;
                        let statusOption = true;
                        do {
                            if (options[index]) {
                                await options[index].getText().then(function (optionText) {
                                    if (optionText === jsonData.LabSetup) {
                                        statusOption = false;
                                        options[index].click().then(function () {
                                            dashBoard.waitForPage();
                                            element(by.className(treeTop)).isDisplayed()
                                                .then(function (displayed) {
                                                    foundNode = displayed;
                                                });
                                        });
                                    }
                                });
                            } index = index + 1;
                        } while (statusOption);
                    });
            }).then(function () {
                resolve(foundNode);
            });
        });
    }

    gearIconUserManagement() {
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            let foundNode = false;
            browser.driver.findElement(by.className(setting)).click().then(function () {
                dashBoard.waitForScroll();
                browser.driver.findElement(by.className(overlay)).findElements(by.tagName(btn))
                    .then(async function (options) {
                        let index = 0;
                        let statusOption = true;
                        do {
                            if (options[index]) {
                                await options[index].getText().then(function (optionText) {
                                    if (optionText === jsonData.UserManagement) {
                                        statusOption = false;
                                        options[index].click().then(function () {
                                            browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(function () {
                                                dashBoard.waitForPage();
                                            });
                                            element.all(by.className(cardHeader)).count().then(function (cardCount) {
                                                if (cardCount >= 1) {
                                                    foundNode = true;
                                                }
                                            });
                                        });
                                    }
                                });
                            } index = index + 1;
                        } while (statusOption);
                    });
            }).then(function () {
                browser.sleep(200000);
                dashBoard.waitForPage();
                resolve(foundNode);
            });
        });
    }

    gearIconConnectivity() {
        return new Promise((resolve) => {
            let foundNode = false;
            browser.driver.findElement(by.className(setting)).click().then(function () {
                dashBoard.waitForScroll();
                browser.driver.findElement(by.className(overlay)).findElements(by.tagName(btn))
                    .then(async function (options) {
                        let index = 0;
                        let statusOption = true;
                        do {
                            if (options[index]) {
                                await options[index].getText().then(function (optionText) {
                                    if (optionText === jsonData.ConnectivityMapping) {
                                        statusOption = false;
                                        options[index].click().then(function () {
                                            browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(function () {
                                                dashBoard.waitForPage();
                                            });
                                            browser.driver.findElement(by.className(header)).then(function (hdr) {
                                                hdr.findElement(by.tagName(h1)).getText().then(function (headerText) {
                                                    if (headerText.includes('Connectivity')) {
                                                        foundNode = true;
                                                    }
                                                });

                                            });
                                        });
                                    }
                                });
                            } index = index + 1;
                        } while (statusOption);
                    });
            }).then(function () {
                resolve(foundNode);
            });
        });
    }

    gearIconDashboard() {
        return new Promise((resolve) => {
            let foundNode = false;
            browser.driver.findElement(by.className(setting)).click().then(function () {
                browser.sleep(5000);
                browser.driver.findElement(by.className(overlay)).findElements(by.tagName(btn))
                    .then(async function (options) {
                        let index = 0;
                        let statusOption = true;
                        do {
                            if (options[index]) {
                                await options[index].getText().then(function (optionText) {
                                    if (optionText === jsonData.Dashboard) {
                                        statusOption = false;
                                        options[index].click().then(function () {

                                            dashBoard.waitForPage();
                                            element.all(by.className(cardTitle)).count().then(function (cards) {
                                                if (cards === 7) {
                                                    foundNode = true;
                                                }
                                            });
                                        });
                                    }
                                });
                            } index = index + 1;
                        } while (statusOption);
                    });
            }).then(function () {
                resolve(foundNode);
            });
        });
    }

    gearAccountManagement() {
        return new Promise((resolve) => {
            let foundNode = false;
            browser.driver.findElement(by.className(setting)).click().then(function () {
                browser.sleep(5000);
                browser.driver.findElement(by.className(overlay)).findElements(by.tagName(btn))
                    .then(async function (options) {
                        let index = 0;
                        let statusOption = true;
                        do {
                            if (options[index]) {
                                await options[index].getText().then(function (optionText) {
                                    if (optionText === jsonData.AccountManagement) {
                                        statusOption = false;
                                        options[index].click().then(function () {
                                            browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(function () {
                                                dashBoard.waitForPage();
                                            });
                                            element(by.className(aactMang)).then(function (account) {
                                                account.findElement(by.className(pagetTitle)).getText().then(function (title) {

                                                    if (title === 'Account Management') {
                                                        foundNode = true;
                                                    }
                                                });
                                            });
                                        });
                                    }
                                });
                            } index = index + 1;
                        } while (statusOption);
                    });
            }).then(function () {
                resolve(foundNode);
            });
        });
    }

    checkUserManagementOptionNotDisplayed() {
        return new Promise(resolve => {
            let foundNode = true;
            const setting1 = browser.driver.findElement(by.className(setting));
            setting1.click().then(function () {
                const userM = browser.driver.findElement(by.xpath(userManagementtext));
                try {
                    userM.isDisplayed().then(function () {
                        foundNode = true;
                        resolve(foundNode);
                    }).catch(function (error) {
                        foundNode = false;
                        resolve(foundNode);
                    });
                } catch (Error) {
                }
            });
        });
    }
}
