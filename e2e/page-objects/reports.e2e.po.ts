/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, promise, $, protractor } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
const reportTab = 'LoginComponent.Reports';
const actionBar = 'mob-actions-bar';
const sortPanel = 'sort-panel';
const liTag = 'li';
const icon = 'icon-cancel';
const iframeTag = 'iframe';
const defaultText1 = 'ng-busy-default-text';
const defaulttext = 'ng-busy-default-text';
const createBtn = 'create-btn';
const chkbxLayout = 'mat-checkbox-layout';
const reportsTab = './/div[@class="mat-tab-label-content"][contains(text(),"REPORTS")]';
const createReportButton = './/button/span[contains(text(), "Create")]';
const reportSection = './/div[contains(@class, "report-holder")]';
const closeReportButton = './/button[contains(@class,"btn-close")]';

let jsonData;
fs.readFile('./JSON_data/Reports.json', (err, data) => {
    if (err) { throw err; }
    const reportsData = JSON.parse(data);
    jsonData = reportsData;
});

const dashBoard = new Dashboard();
const library = new BrowserLibrary();

export class Reports {
    reportsPage() {
        return new Promise((resolve) => {
            let foundReports = false;
            let tabCount;
            browser.driver.findElement(by.id(reportTab)).click().then(function () {
                dashBoard.waitForPage();
                browser.driver.findElement(by.className(actionBar)).then(function () {
                    element.all(by.tagName(liTag)).count().then(async function (actions) {
                        tabCount = actions;
                    });
                    element.all(by.tagName(liTag)).then(function (tab) {
                        let tabFound = false;
                        for (let index = 0; index < tabCount; index++) {
                            if (tab[index]) {
                                tab[index].getText().then(function (tabText) {

                                    if (tabText === jsonData.Reports) {
                                        tabFound = true;
                                        foundReports = true;
                                    }
                                });
                            }
                            if (tabFound) {
                                break;
                            }
                        }
                    });
                });
            }).then(function () {

                resolve(foundReports);
            });
        });
    }
    reportTab() {
        return new Promise((resolve) => {
            let tabCount;
            let reportAvailable = false;
            const EC = protractor.ExpectedConditions;
            browser.driver.findElement(by.className(actionBar)).then(function () {
                element.all(by.tagName(liTag)).count().then(function (actions) {
                    tabCount = actions;
                });
                element.all(by.tagName(liTag)).then(async function (tab) {
                    dashBoard.waitForScroll();
                    let tabFound = false;
                    for (let index = 0; index < tabCount; index++) {
                        if (tab[index]) {
                            await tab[index].getText().then(function (tabText) {
                                // if (tabText === 'REPORTS') {
                                if (tabText === jsonData.Reports) {
                                    tabFound = true;
                                    tab[index].click().then(function () {
                                        dashBoard.waitForPage();
                                    });
                                }
                            });
                        }
                        if (tabFound) {
                            break;
                        }
                    }
                });
            });
            browser.driver.findElement(by.className(sortPanel)).findElement(by.tagName('ul')).then(function () {
                element.all(by.tagName(liTag)).count().then(function (actionscount) {
                    tabCount = actionscount;
                });
                element.all(by.tagName(liTag)).then(async function (tab) {
                    dashBoard.waitForScroll();
                    let tabFound = false;
                    for (let index = 0; index < tabCount; index++) {
                        if (tab[index]) {
                            await tab[index].getText().then(function (tabText) {
                                // if (tabText === 'MONTHLY EVALUATION') {
                                if (tabText === jsonData.MonthlyEvaluation) {
                                    tabFound = true;
                                    tab[index].click().then(function () {
                                        dashBoard.waitForPage();
                                    });
                                }
                            });
                        }
                        if (tabFound) {
                            break;
                        }
                    }
                });
                browser.driver.findElement(by.className(chkbxLayout)).click().then(function () {
                    browser.driver.findElement(by.className(createBtn)).then(function (btn) {
                        btn.findElement(by.tagName('button')).click();
                        browser.wait(EC.presenceOf(element(by.className(defaulttext))), 10000).then(function () {
                        });
                        browser.wait(EC.invisibilityOf(element(by.className(defaultText1))), 10000).then(function () {
                            browser.sleep(5000);
                            const myElement = element(by.tagName(iframeTag));
                            if (myElement.isPresent()) {
                                browser.sleep(5000);
                                reportAvailable = true;
                            }
                        });
                    });
                    element(by.className(icon)).click();
                });
            }).then(function () {
                resolve(reportAvailable);
            });
        });
    }

    clickReportsTab() {
        const flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const reports = element(by.xpath(reportsTab));
            reports.isDisplayed().then(function () {
                reports.click();
                library.logStep('Reports Tab Clicked');
            });
        });
    }

    verifyCreateButtonDisplayed() {
        const flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const createReport = element(by.xpath(createReportButton));
            createReport.isDisplayed().then(function () {
                library.logStep('Create Report Button is displayed');
            });
        });
    }

    clickCreateReportButton() {
        const flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const createReport = element(by.xpath(createReportButton));
            createReport.isDisplayed().then(function () {
                createReport.click();
                library.logStep('Create Report Tab Clicked');
                browser.sleep(15000);
            });
        });
    }

    verifyReportCreated() {
        const flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const report = element(by.xpath(reportSection));
            report.isDisplayed().then(function () {
                library.logStep('Report is created');
            });
        });
    }

    clickCloseReportButton() {
        const flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const close = element(by.xpath(closeReportButton));
            close.isDisplayed().then(function () {
                close.click();
                library.logStep('Report is closed');
            });
        });
    }
}
