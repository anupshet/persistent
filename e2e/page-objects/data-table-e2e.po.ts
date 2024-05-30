/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const assignedName = 'panel-title mat-body-2';
const dataTabletab = '//a[contains(text(),\'DATA TABLE\')]';
const dept2Expand = '//span[@class=\'toggle-children-wrapper ng-star-inserted toggle-children-wrapper-collapsed\']/span';
const collapseInstrument1 = '(//span[@class=\'toggle-children-wrapper toggle-children-wrapper-expanded ng-star-inserted\']/span)[1]';
const collapseInstrument2 = '(//span[@class=instrumentAfterLot]/span)[2]';
const inst1Expand = '(//span[@class=\'toggle-children-wrapper toggle-children-wrapper-collapsed ng-star-inserted\']/span)[2]';
const inst2Expand = '(//span[@class=\'toggle-children-wrapper toggle-children-wrapper-collapsed ng-star-inserted\']/span)[3]';
const hamburgerIcon = 'i.icon-menu';
const spcRules = 'a.spcrules-link';
const pointValue = '(.//div[@class="ng-star-inserted"]//span[@class="ng-star-inserted"])[3]';
const countOnComment = '(//em[@class=\'spc_pezcell_comments_number\'])[1]';
const countOnInteraction = '//em[@class=\'spc_pezcell_interactions_number\']';
const clickOnCommentXpath = './/span[@class="grey pez icon-Comment ng-star-inserted"]';
const reviewSummary = '//h2[contains(text(),\'Review Summary\')]';
const doneButton = '//button/span[contains(text(),\'DONE\')]'; // "//button[contains(text(),'DONE')]"
const addComment = '(//span[contains(text(),\'Add comment\')])[1]';
const countOnInteractionTest1 = '(//em[@class=\'spc_pezcell_interactions_number\'])[1]';
const LatestCommentValue = '(//mat-dialog-container/br-pez-dialog/section//div//span/following-sibling::p)[2]';
const productName = '//h5[contains(text(),\'Assayed Chemistry\')]';
const lotName = '(//span[contains(text(),\'Lot 26430\')])[2]';
const timeZone = '//li[@class=\'ng-star-inserted\']/span/span[2]';
const labSetup = 'LoginComponent.LabSetup';
const allTest = '//tree-node-content//span[contains(text(),\'Lot\')]/ancestor::tree-node-wrapper/following-sibling::tree-node-children//section/span/span';
const goDataTable = 'LoginComponent.DataTable';
const zoomout = 'zoomOut';
const locationAlltest = '//*[@class=\'pill-test ng-star-inserted\']/*[@fill=\'#000000\']';
const delBtnLocation = 'btn2 btn-link btn-br-link delete-btn ng-star-inserted';
const confirmDelLocation = 'btn btn-br-link float-right mr-3';
const deldataset = '//span/mat-icon[contains(text(),\'delete\')]';
const confirmDel = 'dialog_button2';
const scrolltest1 = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[1])[1]';
const allData = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[1]';
const testafterLot = '//tree-node-content//span[contains(text(),\'Lot\')]/ancestor::tree-node-wrapper//span[@class=instrumentAfterLot]';
const productafterLot = '//tree-node-content//span[contains(text(),\'Lot\')]/ancestor::tree-node-children/preceding-sibling::tree-node-wrapper//span[@class=instrumentAfterLot]';
const instrumentAfterLot = 'toggle-children-wrapper ng-star-inserted toggle-children-wrapper-expanded';
const expandDept = 'toggle-children-wrapper toggle-children-wrapper-collapsed ng-star-inserted';
const expantProd = 'toggle-children-wrapper ng-star-inserted toggle-children-wrapper-collapsed';
const countLinkText = '(//span[contains(@class,\'link-text add\')])[(//span[contains(text(),\'Add comment\')])]';
const empryValCnt = '//input[contains(@class,\'mat-input-element\')]';
const oldCmtVal = '(//mat-dialog-container/br-pez-dialog/section//div//span/following-sibling::p)[1]';
const chartype = './/td[@class="br-uppercase mat-small mat-cell cdk-column-label mat-column-label ng-star-inserted"][.="sd"]//following-sibling::td[2]/div/div';
const charTypeMean = './/td[@class="br-uppercase mat-small mat-cell cdk-column-label mat-column-label ng-star-inserted"][.="mean"]//following-sibling::td[1]/div/div';
const charTypepoint = './/td[@class="br-uppercase mat-small mat-cell cdk-column-label mat-column-label ng-star-inserted"][.="points"]//following-sibling::td[2]/div/div';
const actionBar = 'mob-actions-bar';
const liTag = 'li';
const sidenav = 'sidenav-content';
const angularTree = 'angular-tree-component';
const nodeL1 = 'tree-node-level-1';
const deptCol = '.toggle-children-wrapper.toggle-children-wrapper-collapsed.ng-star-inserted';
const nodeL2 = 'tree-node-level-2';
const nodeL3 = 'tree-node-level-3';
const nodeL4 = 'tree-node-level-4';
const tableBody = 'div.table-body';
const runResult = 'runs-result-table';
const div = 'div > div.ps-content > table > tbody > tr';
const addRun = 'add-run-btn';
const componentrun = 'component-run-new-data';
const formField = 'mat-form-field';
const historyIcon = '//br-pez-cell//span[contains(@class, "ic-pez")]';
const historyTitle = 'ReviewSummaryComponent.Actions';
const historyCount = '//span[contains(@class, "ic-pez ic-history-18dp")]/../em';
const historyItems = '//p[contains(@id, "ReviewSummaryComponent.Actions")]/..//ul/li';
const closeBtn = '//button[contains(., "close")]';
const userNameText = '//p[@id="ReviewSummaryComponent.Actions"]/..//strong';
const dateHistorySection = '//p[@id="ReviewSummaryComponent.Actions"]/..//span/span[1]';
const timeHistorySection = '//p[@id="ReviewSummaryComponent.Actions"]/..//span/span[3]';
const historyActionText = '(//p[@id="ReviewSummaryComponent.Actions" and contains(text(), "History")]/..//strong)[2]';
const historyActionComment = '//p[@id="ReviewSummaryComponent.Actions" and contains(text(), "History")]/..//strong';

browser.waitForAngularEnabled(true);
export class DataTable {
    async verifyHistoryAction(userName: any) {
        let ele = await element(by.xpath(historyActionComment));
        await browser.wait(browser.ExpectedConditions.textToBePresentInElement(ele, "updated action"), 8888);
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " updated action");
    }
    async verifyHistoryAccept(userName: any, level: number) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" Accepted");
    }
    async verifyHistoryReject(userName: any, level: number) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" Rejected");
    }
    async verifyHistoryLevel(userName: any, level: number, value) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" to "+value);
    }
    async verifyHistoryRestartFloat(userName: any) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " enabled Restart Float");
    }
    async verifyHistoryComment(userName: any) {
        let ele = await element(by.xpath(historyActionComment));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " updated comment");
    }
    async verifyHistoryReagentLot(userName: any, lot: any) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Reagent Lot to "+lot);
    }
    async verifyHistoryCalibratorLot(userName: any, lot: number) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Calibrator Lot to "+lot);
    }
    async verifyHistoryPoint(userName: any, level: any, value: any) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" Point to "+value);
    }
    async verifyHistorySD(userName: any, level: any, value: any) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" SD to "+value);
    }
    async verifyHistoryMean(userName: any, level: any, value: any) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        expect(text).toEqual(userName + " changed Level "+level+" Mean to "+value);
    }
    async verifyHistoryDate(userName: any, date: (string | number)[]) {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        if (date[2].toString().length == 1)
            date[2] = "0" + date[2];
        expect(text).toEqual(userName + " changed Run Date to " + date[1] + " " + date[2] + ", " + date[0]);
    }
    async isCommasPrsentInHistoryAction() {
        let ele = await element(by.xpath(historyActionText));
        let text: string = await ele.getText();
        return text.includes(',');
    }
    async isUserNameDisplayed() {
        let ele = await element(by.xpath(userNameText));
        return await ele.isDisplayed();
    }
    async isDateDisplayed() {
        let ele = await element(by.xpath(dateHistorySection));
        return await ele.isDisplayed();
    }
    async isTimeDisplayed() {
        let ele = await element(by.xpath(timeHistorySection));
        return await ele.isDisplayed();
    }
    async isHistoryVisible() {
        return await element(by.xpath(historyTitle)).isPresent();
    }
    async closeHistory() {
        library.logStep('Click On Close History Button');
        let ele = await element(by.xpath(closeBtn));
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
        await ele.click(ele);
    }
    async getHistoryItemsLength() {
        return (await element.all(by.xpath(historyItems))).length;
    }
    async scrollHistoryToScreen() {
        library.scrollToElement(await element(by.xpath(historyIcon)));
    }
    async isHistoryCountPresent() {
        return await element(by.xpath(historyCount)).isPresent();
    }
    async getHistoryCount() {
        await library.waitLoadingImageIconToBeInvisible();
        let ele = await element(by.xpath(historyCount));
        await browser.wait(browser.ExpectedConditions.presenceOf(ele), 8888);
        console.log("Test = " + await ele.getText());
        return parseInt(await ele.getText());
    }
    async getHistoryTitle() {
        return await element(by.id(historyTitle)).getText();
    }
    async isHistoryTitlePresent() {
        return await element(by.id(historyTitle)).isPresent();
    }
    async isHistoryIconPresent() {
        return await element(by.xpath(historyIcon)).isPresent();
    }
    async clickHistoryIcon() {
        library.logStep('Click on History Icon');
        let ele = await element(by.xpath(historyIcon));
        await library.scrollToElement(ele);
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
        await ele.click(ele);
    }
    dataTable() {
        return new Promise((resolve) => {
            let availableButton = false;
            let tabCount;
            browser.driver.findElement(by.id(goDataTable)).click().then(function () {
                dashBoard.waitForPage();
                browser.driver.findElement(by.className(actionBar)).then(function () {
                    element.all(by.tagName(liTag)).count().then(function (actions) {
                        tabCount = actions;
                    });
                    element.all(by.tagName(liTag)).then(function (tab) {
                        let tabFound = false;
                        for (let index = 0; index < tabCount; index++) {
                            if (tab[index]) {
                                tab[index].getText().then(function (tabText) {
                                    if (tabText === 'DATA TABLE') {
                                        tabFound = false;
                                        availableButton = true;
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
                resolve(availableButton);
            });
        });
    }
    findTest(department, instrument, product, test) {
        return new Promise((resolve) => {
            let testFound = false;
            let nodecount;
            browser.driver.findElement(by.id(goDataTable)).click();
            dashBoard.waitForPage();
            browser.driver.findElement(by.className(sidenav)).click().then(function () {
                browser.driver.findElement(by.className(angularTree)).then(function () {
                    element.all(by.className(nodeL1)).count().then(function (nodes) {
                        nodecount = nodes;
                    });
                    element.all(by.className(nodeL1))
                        .then(async function (dept) {
                            let deptFound = false;
                            for (let index = 0; index < nodecount; index++) {
                                if (dept[index]) {
                                    await browser.actions().mouseMove(dept[index]).perform();
                                    await dept[index].getText().then(function (nodeName) {
                                        if (nodeName === department) {
                                            deptFound = true;
                                            dashBoard.waitForScroll();
                                            // tslint:disable-next-line: no-shadowed-variable
                                            const dept = element.all(by.css(deptCol)).get(index);
                                            dept.click().then(function () {
                                                dashBoard.waitForScroll();
                                                element.all(by.className(nodeL2)).count().then(function (children) {
                                                    nodecount = children;
                                                });
                                                element.all(by.className(nodeL2))
                                                    .then(async function (inst) {
                                                        let instFound = false;
                                                        // tslint:disable-next-line: no-shadowed-variable
                                                        for (let index = 0; index < nodecount; index++) {
                                                            if (inst[index]) {
                                                                await browser.actions().mouseMove(inst[index]).perform();
                                                                await inst[index].getText().then(function (instName) {
                                                                    if (instName === instrument) {
                                                                        instFound = true;
                                                                        dashBoard.waitForScroll();
                                                                        // tslint:disable-next-line: no-shadowed-variable
                                                                        // tslint:disable-next-line: no-shadowed-variable
                                                                        const inst = browser.
                                                                            driver.findElement(by.className(nodeL2)).findElement(by.className('toggle-children'));
                                                                        inst.click().then(function () {
                                                                            dashBoard.waitForScroll();
                                                                            element.all
                                                                                (by.className(nodeL3)).count().then(function (children) {
                                                                                    nodecount = children;
                                                                                });
                                                                            element.all(by.className(nodeL3))
                                                                                .then(async function (level) {
                                                                                    let prdFound = false;
                                                                                    for (let index = 0; index < nodecount; index++) {
                                                                                        if (level[index]) {
                                                                                            await browser.
                                                                                                actions().mouseMove(level[index]).perform();
                                                                                            await level[index].
                                                                                                getText().then(function (nodeName) {
                                                                                                    if (nodeName.includes(product)) {
                                                                                                        prdFound = true;
                                                                                                        dashBoard.waitForScroll();
                                                                                                        const prd = browser.driver.
                                                                                                            findElement(by.className(nodeL3)).
                                                                                                            findElement(by.className('toggle-children'));
                                                                                                        prd.click().then(function () {
                                                                                                            dashBoard.waitForScroll();
                                                                                                            element.all(by.className(nodeL4))
                                                                                                                .count()
                                                                                                                .then(function (testChildren) {
                                                                                                                    nodecount = testChildren;
                                                                                                                });
                                                                                                            element.all(by.className(nodeL4))
                                                                                                                .then(async function (testS) {
                                                                                                                    for (let index = 0; index < nodecount; index++) {
                                                                                                                        if (testS[index]) {
                                                                                                                            await browser.
                                                                                                                                actions().
                                                                                                                                mouseMove(testS[index]).perform();
                                                                                                                            await testS[index].
                                                                                                                                getText().then(function (testName) {
                                                                                                                                    if (testName.includes(test)) {
                                                                                                                                        testS[index].click().then(function () {
                                                                                                                                            browser.sleep(15000);
                                                                                                                                            // tslint:disable-next-line: max-line-length
                                                                                                                                            // tslint:disable-next-line: max-line-length
                                                                                                                                            testFound = true;
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                });
                                                                                                                        }
                                                                                                                        if (testFound) {
                                                                                                                            break;
                                                                                                                        }
                                                                                                                    }
                                                                                                                });
                                                                                                        });
                                                                                                    } else {
                                                                                                    }
                                                                                                });
                                                                                        }
                                                                                        if (prdFound) {
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                });
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                            if (instFound) {
                                                                break;
                                                            }
                                                        }
                                                    });
                                            });
                                        }
                                    });
                                }
                                if (deptFound) {
                                    break;
                                }
                            }
                        });
                    dashBoard.waitForScroll();
                });
            }).then(function () {
                resolve(testFound);
            });
        });
    }
    addResult() {
        return new Promise((resolve) => {
            let oldtestRunCount;
            let resultadded = false;
            let tabCount;
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
                                if (tabText === 'DATA TABLE') {
                                    tabFound = true;
                                    tab[index].click().then(function () {
                                        dashBoard.waitForElement();
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
            browser.driver.findElement(by.css(tableBody)).then(function (tBody) {
                tBody.findElement(by.className(runResult)).then(function () {
                    element.all(by.css(div)).count().then(function (runCount) {
                        oldtestRunCount = runCount;
                    });
                });
            });
            const runButton = browser.driver.findElement(by.className(addRun));
            runButton.getText().then(function (button) {
                if (button === 'ADD RESULT') {
                    runButton.click();
                }
            });
            dashBoard.waitForScroll();
            browser.driver.findElement(by.className(componentrun)).then(function () {
                let inputCount;
                element.all(by.className(formField)).then(function (containers) {
                    inputCount = containers;
                    for (let index = 0; index < inputCount.length; index++) {
                        if (index >= 2) {
                            element.all(by.tagName('input')).get(index).sendKeys('1.5');
                            dashBoard.waitForScroll();
                        }
                    }
                });
            });
            browser.driver.
                findElement(by.className(componentrun)).findElement(by.css('div.col-3 > button.btn.right')).click().then(function () {
                    // dashBoard.waitForElement();
                    dashBoard.waitForPage();
                    browser.driver.findElement(by.className('btn-cta')).click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            browser.driver.findElement(by.className('table-body')).then(function (tBody) {
                tBody.findElement(by.className(runResult)).then(function () {
                    element.all(by.css('table > tbody > tr')).count().then(function (runCount) {
                        if (runCount > oldtestRunCount) {
                            resultadded = true;
                        }
                        dashBoard.waitForScroll();
                    });
                });
            }).then(function () {
                resolve(resultadded);
            });
        });
    }
    goToDataTablePage() {
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            let displayed = false;
            browser.actions().mouseMove(element(by.id(goDataTable))).perform();
            const dataTbl = element(by.id(goDataTable));
            library.scrollToElement(dataTbl);
            library.clickJS(dataTbl);
            dashBoard.waitForElement();
            browser.actions().mouseMove(element(by.xpath(dataTabletab))).perform();
            const dataTable1 = element(by.xpath(dataTabletab));
            dashBoard.waitForPage();
            dataTable1.isDisplayed().then(function () {
                displayed = true;
                log4jsconfig.log().info('User is on Data Table Page.');
                resolve(displayed);
            });
        });
    }
    collapseInstrument1() {
        let col1 = false;
        return new Promise((resolve) => {
            const dept2Expand1 = element(by.xpath(dept2Expand));
            dept2Expand1.isDisplayed().then(function () {
                library.clickJS(dept2Expand1);
                dashBoard.waitForElement();
            }).catch(function () {
                const collapseInstrument11 = element(by.xpath(collapseInstrument1));
                collapseInstrument11.isDisplayed().then(function () {
                    library.clickJS(collapseInstrument11);
                    dashBoard.waitForElement();
                    col1 = true;
                    resolve(col1);
                }).catch(function () {
                    col1 = true;
                    resolve(col1);
                });
            });
        });
    }
    collapseInstrument2() {
        let col1 = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const dept2Expand1 = element(by.xpath(dept2Expand));
            dept2Expand1.isDisplayed().then(function () {
                library.clickJS(dept2Expand1);
                dashBoard.waitForElement();
            }).catch(function () {
                const collapseInstrument11 = element(by.xpath(collapseInstrument2));
                collapseInstrument11.isDisplayed().then(function () {
                    library.clickJS(collapseInstrument11);
                    dashBoard.waitForElement();
                    col1 = true;
                    resolve(col1);
                }).catch(function () {
                    col1 = true;
                    resolve(col1);
                });
            });
        });
    }
    goToProduct(dept, inst, prod) {
        return new Promise((resolve) => {
            let flag = false;
            dashBoard.waitForElement();
            if (inst === '1') {
                const inst1Expand1 = element(by.xpath(inst1Expand));
                inst1Expand1.isDisplayed().then(function () {
                    library.clickJS(inst1Expand1);
                    dashBoard.waitForElement();
                    const prod1 = element(by.xpath('//span[contains(text(),\'' + prod + '\')]'));
                    library.clickJS(prod1);
                    dashBoard.waitForPage();
                }).catch(function () {
                });
                flag = true;
                resolve(flag);
            } else if (inst === '2') {
                const inst2Expand1 = element(by.xpath(inst2Expand));
                inst2Expand1.isDisplayed().then(function () {
                    dashBoard.waitForElement();
                    inst2Expand1.click();
                    const prod1 = element(by.xpath('//span[contains(text(),\'' + prod + '\')]'));
                    prod1.click();
                    dashBoard.waitForElement();
                    flag = true;
                    resolve(flag);
                });
            }
        });
    }
    verifyShowLastToggle() {
        return new Promise((resolve) => {
            const toggleBtn = '//div[text()="Show last entry"]//parent::div//mat-slide-toggle//input';
            const toggle = element(by.xpath(toggleBtn));
            toggle.isPresent().then(function () {
                library.logStepWithScreenshot('Show Last Toggle  is present', 'Toggle Present');
                resolve(true);
            }).catch(function () {
                library.logStepWithScreenshot('Show Last Toggle  is not present', 'Toggle not Present');
                resolve(false);
            });
        });
    }
    verifyShowLastToggleStatus() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const toggleBtn = '//div[text()="Show last entry"]//parent::div//mat-slide-toggle//input';
            const toggle = element(by.xpath(toggleBtn));
            toggle.getAttribute('aria-checked').then(function (status) {
                if (status.includes('false')) {
                    library.logStepWithScreenshot('Toggle is set to OFF for a Non Connectivity User', 'Non Connectivity User-Toggle Status');
                    resolve(false);
                }
                else {
                    library.logStepWithScreenshot('Toggle is set to ON for a Connectivity User', 'Connectivity User-Toggle Status');
                    resolve(true);
                }
            });
        });
    }
    enterData(analyte, level, value) {
        let status = false;
        const dataEntryTextBox = '(//unext-analyte-multi-point/div/span[contains(text(),' + analyte + ')]/parent::div/following-sibling::div//input)[' + level + ']';
        return new Promise((resolve) => {
            const dataEntrytxtbx = element(by.xpath(dataEntryTextBox));
            browser.executeScript('arguments[0].scrollIntoView();', dataEntrytxtbx);
            dataEntrytxtbx.isDisplayed().then(function () {
                dataEntrytxtbx.sendKeys(value);
                console.log('Data Entered: ' + value);
                library.logStepWithScreenshot('Data Entered', 'dataEntry');
                status = true;
                resolve(status);
            }).catch(function () {
                status = false;
                console.log('Failed to enter Data');
                library.logFailStep('Failed to enter Data');
                resolve(status);
            });
        });
    }
    verifyDateBarPosition() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const dateBar = '//div[@class="wrapper"]//div[@class="flex-ctn"]';
            const bar = element(by.xpath(dateBar));
            expect(bar.getLocation()).toEqual(jasmine.objectContaining({
                x: 311,//left
                y: 280,//top
            }));
            library.logStepWithScreenshot('Bar containing the date controls and cancel/submit buttons is located on the top of the view above the data table', 'Date Control Bar');
            resolve(true);
        });
    }
    verifyDateBarPositionControlLevel() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const dateBar = '//div[@class="wrapper"]//div[@class="flex-ctn"]';
            const bar = element(by.xpath(dateBar));
            expect(bar.getLocation()).toEqual(jasmine.objectContaining({
                x: 311,//left
                y: 231,//top
            }));
            console.log('Bar containing the date controls and cancel/submit buttons is located on the top of the view above the data table');
            library.logStepWithScreenshot('Bar containing the date controls and cancel/submit buttons is located on the top of the view above the data table', 'Date Control Bar');
            resolve(true);
        });
    }
    verifyDateBarIsFixed() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const dateControlBar = '(//perfect-scrollbar//div[@style="position: static;"])[3]';
            const dateControl = element(by.xpath(dateControlBar));
            dateControl.getAttribute('class').then(function (attribute) {
                if (attribute.includes('ps--active-y')) {
                    console.log('Date Control Bar is scrollable');
                    library.logFailStep('Date Control Bar is scrollable');
                    resolve(false);
                }
                else {
                    console.log('Date Control Bar is Fixed');
                    library.logStepWithScreenshot('Date Control Bar is Fixed', 'Date Control Bar is Fixed');
                    resolve(true);
                }
            });
        });
    }
    goToInstrument_ProductName(Name) {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            let flag = false;
            const inst1 = element(by.xpath('(.//span[contains(text(),\'' + Name + '\')])[1]'));
            library.scrollToElement(inst1);
            library.clickJS(inst1);
            dashBoard.waitForPage();
            flag = true;
            log4jsconfig.log().info(Name + ' clicked.');
            resolve(flag);
        });
    }
    verifyDataEntryLinkPresent() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const manuallyEnterData = '//a[contains(text(),"Manually")]';
            const manualEnterData = element(by.xpath(manuallyEnterData));
            dashBoard.waitForElement();
            manualEnterData.isDisplayed().then(function () {
                console.log('Manually Enter Data link is present');
                library.logFailStep('Manually Enter Data link is present');
                resolve(false);
            },
                function () {
                    console.log('Manually Enter Data link is not present');
                    library.logStepWithScreenshot('Manually Enter Data link is not present', 'Link not present');
                    resolve(true);
                }
            );
        });
    }
    verifyDataEntryFormIsAlreadyOpen(form) {
        return new Promise((resolve) => {
            const datadataentry = '//unext-analyte-' + form + '//div[contains(@class,"analyte-' + form + '-component")]';
            const DataEntryTablePresent = element(by.xpath(datadataentry));
            dashBoard.waitForElement();
            library.scrollToElement(DataEntryTablePresent);
            DataEntryTablePresent.isDisplayed().then(
                function () {
                    library.logStepWithScreenshot('Data Entry Form is already open', 'Data Entry Form is always open');
                    resolve(true);
                },
                function () {
                    library.logFailStep('Data Entry Form is not already opened');
                    resolve(false);
                })
        });
    }
    verifyShowLastToggleFunctionalityNonConnectivity() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const toggleBtn = '//div[text()="Show last entry"]//parent::div//mat-slide-toggle//input';
            const toggle = element(by.xpath(toggleBtn));
            //when toggle is on
            const nopreviousdatabox = '//span[contains(@class,"box")]';
            const data = element(by.xpath(nopreviousdatabox));
            dashBoard.waitForElement();
            data.isDisplayed().then(function () {
                console.log('When toggle is OFF previous data is present');
                library.logStepWithScreenshot('When toggle is OFF previous data is present', 'OFF-Previous data  present');
                resolve(false);
            })
                .catch(function () {
                    //this should get executed as per functionality
                    console.log('When toggle is OFF Previous data is not present');
                    library.logStepWithScreenshot('When toggle is OFF Previous data is not present', 'OFF-Previous data not present');
                    resolve(true);
                })
            library.clickJS(toggle);
            library.logStepWithScreenshot('Toggle is turned ON', 'Toggle ON')
            dashBoard.waitForElement();
            data.isDisplayed().then(function () {
                //this should get executed as per functionality
                console.log('When toggle is ON Previous data is present');
                library.logStepWithScreenshot('When toggle is ON Previous data is present', 'ON-Previous data present');
                resolve(true);
            }).catch(function () {
                console.log('When toggle is ON Previous data is not present');
                library.logStepWithScreenshot('When toggle is ON Previous data is not present', 'ON-Previous data not present');
                resolve(false);

            })
        });
    }
    verifyShowLastToggleFunctionalityConnectivity() {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const toggleBtn = '//div[text()="Show last entry"]//parent::div//mat-slide-toggle//input';
            const toggle = element(by.xpath(toggleBtn));
            //when toggle is on
            const nopreviousdatabox = '//span[contains(@class,"box")]';
            const data = element(by.xpath(nopreviousdatabox));
            dashBoard.waitForElement();
            data.isDisplayed().then(function () {
                console.log('When toggle is ON "No previous data" box is present');
                library.logStepWithScreenshot('When toggle is "ON no previous data box"  is present', 'ON-no previous data box present');
                resolve(true);
            })
                .catch(function () {
                    //this should get executed as per functionality
                    console.log('When toggle is ON Previous data is not present');
                    library.logStepWithScreenshot('When toggle is ON No Previous data box is not present', 'ON-No Previous data box not present');
                    resolve(false);
                })
            library.clickJS(toggle);
            library.logStepWithScreenshot('Toggle is turned OFF', 'Toggle OFF')
            dashBoard.waitForElement();
            data.isDisplayed().then(function () {
                //this should get executed as per functionality
                console.log('When toggle is OFF "No Previous data" box is present');
                library.logStepWithScreenshot('When toggle is OFF Previous data box is present', 'OFF-Previous data box is present');
                resolve(false);
            }).catch(function () {
                console.log('When toggle is OFF "No Previous data" is not present');
                library.logStepWithScreenshot('When toggle is OFF No Previous data box is not present', 'OFF-No Previous data box is not present');
                resolve(true);
            })
            library.clickJS(toggle);
        });
    }
    goToInstrument(dept, inst) {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            let flag = false;
            const dept2Expand1 = element(by.xpath('(//span[@class=expantProd]/span)[' + dept + ']'));
            dept2Expand1.isDisplayed().then(function () {
                library.clickJS(dept2Expand1);
                dashBoard.waitForElement();
                flag = true;
                resolve(flag);
            }).catch(function () {
                const inst1 = element(by.xpath('//span[contains(text(),\'' + inst + '\')]'));
                library.clickJS(inst1);
                dashBoard.waitForElement();
                flag = true;
                resolve(flag);
            });
        });
    }
    clickHamburgerIcon() {
        let click = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            browser.actions().mouseMove(element(by.css(hamburgerIcon))).perform();
            const hamburgerIcon1 = element(by.css(hamburgerIcon));
            library.clickJS(hamburgerIcon1);
            const labA = element(by.className(assignedName));
            library.clickAction(labA);
            log4jsconfig.log().info('Hamburger Clicked.');
            click = true;
            resolve(click);
        });
    }
    clickSpcRule() {
        let verifyMaxLength = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const spcRules1 = element(by.css(spcRules));
            spcRules1.click().then(function () {
                verifyMaxLength = true;
            }).then(function () {
                resolve(verifyMaxLength);
            });
        });
    }
    verifyMaxLength(testMaxLen, xid) {
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            let verifyMaxLength = false;
            // var mValue = element(by.id("11"));
            const mValue = element(by.xpath('//*[@id=\'' + xid + '\']'));
            const sLen = testMaxLen.length;
            mValue.sendKeys(testMaxLen)
                .then(function () {
                    mValue.getAttribute('Value').then(function (displayedVal) {
                        if (displayedVal !== sLen) {
                            verifyMaxLength = true;
                        }
                    });
                }).then(function () {
                    element(by.id('cancelBtn')).click();
                    resolve(verifyMaxLength);
                });
        });
    }
    verifyMeanCharType(testVal) {
        return new Promise((resolve) => {
            let verifyMeanCharType = false;
            element(by.id('11')).sendKeys(testVal);
            element(by.id('12')).sendKeys('10');
            element(by.id('13')).sendKeys('15');
            element(by.id('submitBtn')).click().then(function () {
                browser.sleep(8000);
                element(by.xpath(charTypeMean)).click().then(function () {
                    element(by.xpath(charTypeMean)).getText().then(function (dispVal) {
                        // tslint:disable-next-line: triple-equals
                        if (dispVal != testVal) {
                            verifyMeanCharType = true;
                        }
                    });
                });
            }).then(function () {
                resolve(verifyMeanCharType);
            });
        });
    }
    verifyValidInput() {
        return new Promise((resolve) => {
            let verifyValidInput, meanVal, sdVal, pointVal = false;
            element(by.id('11')).sendKeys('5');
            element(by.id('12')).sendKeys('10');
            element(by.id('13')).sendKeys('15');
            element(by.id('submitBtn')).click().then(function () {
                browser.sleep(8000);
                element(by.xpath(charTypeMean)).getText().then(function (dispVal) {
                    if (dispVal === '5') {
                        meanVal = true;
                    }
                });
                element(by.xpath(chartype)).getText().then(function (dispVal) {
                    if (dispVal === '10') {
                        sdVal = true;
                    }
                });
                element(by.xpath(charTypepoint)).getText().then(function (dispVal) {
                    if (dispVal === '15') {
                        pointVal = true;
                    }
                });
                if (meanVal === true && sdVal === true && pointVal === true) {
                    verifyValidInput = true;
                }

            }).then(function () {
                resolve(verifyValidInput);
            });

        });
    }
    verifySdCharType(testVal) {
        return new Promise((resolve) => {
            let verifySdCharType = false;
            element(by.id('12')).sendKeys(testVal);
            element(by.id('11')).sendKeys('10');
            element(by.id('13')).sendKeys('15');
            element(by.id('submitBtn')).click().then(function () {
                browser.sleep(8000);
                element(by.xpath(chartype)).click().then(function () {
                    element(by.xpath(chartype)).getText().then(function (dispVal) {

                        if (dispVal !== testVal) {
                            verifySdCharType = true;
                        }
                    });
                });
            }).then(function () {
                resolve(verifySdCharType);
            });
        });
    }
    verifyPointInvalidData(testVal) {
        return new Promise((resolve) => {
            let verifyPointInvalidData = false;
            element(by.id('13')).sendKeys(testVal);
            element(by.id('11')).sendKeys('10');
            element(by.id('12')).sendKeys('15');
            element(by.id('submitBtn')).click().then(function () {
                browser.sleep(10000);
                const pointValue1 = element(by.xpath(pointValue));
                library.scrollToElement(pointValue1);
                pointValue1.getText().then(function (dispVal) {

                    if (dispVal !== testVal) {
                        verifyPointInvalidData = true;
                    }
                });

            }).then(function () {
                resolve(verifyPointInvalidData);
            });
        });
    }
    addInvalidData() {
        return new Promise(() => {
        });
    }
    verifyCommentSection(expectedValue) {
        return new Promise((resolve) => {
            let comment = false;
            dashBoard.waitForElement();
            browser.actions().mouseMove(element(by.xpath(countOnComment))).perform();
            const countOnComment1 = element(by.xpath(countOnComment));
            library.scrollToElement(countOnComment1);
            // var expectedValue="1";
            countOnComment1.getText().then(function (actualvalue) {
                const meanEle = element(by.xpath('.//input[@tabindex = \'11\']'));
                library.scrollToElement(meanEle);
                meanEle.sendKeys(protractor.Key.ESCAPE).then(function () {
                    console.log('Escape printed');
                });
                if (actualvalue === expectedValue) {
                    console.log('Pass: verifyCommentSection');
                    comment = true;
                    resolve(comment);
                } else {
                    console.log('Fail: verifyCommentSection');
                    comment = false;
                    resolve(comment);
                }
            });
        });
    }
    verifytheReviewSummaryPage() {
        return new Promise((resolve) => {
            let pageSummary, doneBbutton, review = false;
            const clickOnComment1 = element(by.xpath(clickOnCommentXpath));
            library.clickJS(clickOnComment1);
            const reviewSummary1 = element(by.xpath(reviewSummary));
            const expectedValue = 'Review Summary';
            reviewSummary1.getText().then(function (actualvalue) {
                if (actualvalue === expectedValue) {
                    pageSummary = true;
                }
                const doneButton1 = element(by.xpath(doneButton));
                const expectedValue1 = 'DONE';
                doneButton1.getText().then(function (actualvalue1) {
                    const meanEle = element(by.xpath('.//input[@tabindex = \'11\']'));
                    library.scrollToElement(meanEle);
                    meanEle.sendKeys(protractor.Key.ESCAPE).then(function () {
                    });
                    if (actualvalue1 === expectedValue1) {
                        doneBbutton = true;
                    }
                });
                if (pageSummary === true && doneBbutton === true) {
                    review = true;
                    resolve(review);
                }
            });
        });
    }
    clickOnCommentIconAndEnterValue() {
        return new Promise((resolve) => {
            let enter_comment = false;
            const addComment11 = element(by.xpath(addComment));
            library.scrollToElement(addComment11);
            addComment11.click();
            const addComment1 = browser.driver.findElement(by.xpath(addComment));
            library.scrollToElement(addComment1);
            addComment1.sendKeys('Test');
            enter_comment = true;
            resolve(enter_comment);
        });
    }
    verifyInteractionIconButtonOnProductLevel() {
        return new Promise((resolve) => {
            let comment = false;
            // tslint:disable-next-line: no-shadowed-variable
            const countOnComment = element(by.xpath(countOnInteraction));
            const expectedValue = '1';
            countOnComment.getText().then(function (actualvalue) {
                if (actualvalue === expectedValue) {
                    comment = true;
                    resolve(comment);
                    browser.sleep(5000);
                }
            });
        });
    }
    verifyInteractionIconButtonOnTestLevel() {
        return new Promise((resolve) => {
            let comment = false;
            // tslint:disable-next-line: no-shadowed-variable
            const countOnComment = element(by.xpath(countOnInteractionTest1));
            const expectedValue = '1';
            countOnComment.getText().then(function (actualvalue) {
                if (actualvalue === expectedValue) {
                    comment = true;
                    resolve(comment);
                    browser.sleep(5000);
                }
            });
        });
    }
    verifyOlderAndLatestCommentValueFromTooltip() {
        return new Promise((resolve) => {
            let tooltip, older, latest = false;
            const OlderCommentValue = element(by.xpath(oldCmtVal));
            const expectedValue = 'Test';
            OlderCommentValue.getText().then(function (actualvalue) {
                if (actualvalue === expectedValue) {
                    older = true;
                }
            });
            const LatestCommentValue1 = element(by.xpath(LatestCommentValue));
            const expectedValue1 = 'Test12';
            LatestCommentValue1.getText().then(function (actualvalue1) {
                if (actualvalue1 === expectedValue1) {
                    latest = true;
                }
                if (older === true && latest === true) {
                    tooltip = true;
                }
                resolve(tooltip);
            });
        });
    }
    // tslint:disable-next-line: no-shadowed-variable
    goToProductLevelOld(productName) {
        let status = false;
        return new Promise(() => {
            dashBoard.waitForElement();
            const product = element(by.xpath('//span[contains(text(),\' ' + productName + ' \')]/ancestor::div//em'));
            product.click().then(function () {
                dashBoard.waitForElement();
                status = true;
                return (status);
            });
        });
    }
    verifyAlltheFieldsareEmpty() {
        return new Promise((resolve) => {
            let totalEmptyValue = false;
            let countEmpty = 0, i, CountOnAllEmptyValuesInstrumentLevel;
            CountOnAllEmptyValuesInstrumentLevel = element.all(by.xpath(empryValCnt));
            CountOnAllEmptyValuesInstrumentLevel.count().then(function (countE) {
                for (i = 0; i < countE; i++) {
                    const expectedValue = '';
                    CountOnAllEmptyValuesInstrumentLevel.get(i).getText().then(function (actualvalue) {
                        if (actualvalue === expectedValue) {
                            countEmpty = countEmpty + 1;
                        }
                    });
                }
                if (countEmpty === countE) {
                    totalEmptyValue = true;
                    resolve(totalEmptyValue);
                }
            });
        });
    }
    verifyAlltheFieldsareEmpty1() {
        return new Promise((resolve) => {
            let totalEmptyValue;
            // tslint:disable-next-line: prefer-const
            let countEmpty = 19, CountOnAllEmptyValuesInstrumentLevel;
            CountOnAllEmptyValuesInstrumentLevel = element.all(by.xpath(empryValCnt));
            CountOnAllEmptyValuesInstrumentLevel.count().then(function (countE) {
                // tslint:disable-next-line: triple-equals
                if (countEmpty == countE) {
                    totalEmptyValue = true;
                    resolve(totalEmptyValue);
                }
            });
        });
    }
    countOnAllAddCommentsOnInstrumentLevel() {
        return new Promise((resolve) => {
            let totalAddCommentsValue = false;
            const count3 = 3;
            const count1 = element.all(by.xpath(countLinkText));
            count1.count().then(function (text) {
                if (count3 === text) {
                    totalAddCommentsValue = true;

                    resolve(totalAddCommentsValue);
                }
            });
        });
    }
    countOnAllChangeLotsOnInstrumentLevel() {
        return new Promise((resolve) => {
            let totalChangeLotsValue = false;
            // tslint:disable-next-line: prefer-const
            let countlot = 3, CountOnAllChangeLotsLinksOnInstrumentLevel;
            CountOnAllChangeLotsLinksOnInstrumentLevel = element.all(by.xpath('(//span[contains(@class,\'link-text open\')])[(//span[contains(text(),\'Change lot\')])]'));
            CountOnAllChangeLotsLinksOnInstrumentLevel.count().then(function (lot) {
                if (countlot === lot) {
                    totalChangeLotsValue = true;

                    resolve(totalChangeLotsValue);
                }
            });
        });
    }
    verifyProductNameandLotNuberfromtheInstrumentLevel() {
        return new Promise((resolve) => {
            // tslint:disable-next-line: prefer-const
            let product, lot, final1 = false;
            const productName1 = element(by.xpath(productName));
            const expectedValue = 'Assayed Chemistry';
            productName1.getText().then(function (actualvalue) {
                if (actualvalue === expectedValue) {
                    // tslint:disable-next-line: no-unused-expression
                    product === true;
                }
                const lotName1 = element(by.xpath(lotName));
                const expectedValue1 = 'Lot 26430';
                lotName1.getText().then(function (actualvalue1) {
                    if (actualvalue1 === expectedValue1) {
                        // tslint:disable-next-line: no-unused-expression
                        lot === true;
                    }
                    if (product === true && lot === true) {
                        final1 = true;
                        resolve(final1);
                    } else {
                        final1 = false;
                        resolve(final1);
                    }
                    // resolve(final1);
                });
            });
        });
    }
    verifyTimeZoneOnCommentSection() {
        return new Promise((resolve) => {
            let older = false;
            // var webTime
            browser.actions().mouseMove(element(by.xpath(timeZone))).perform();
            const timeZone1 = element(by.xpath(timeZone));
            timeZone1.getText().then(function () {
                older = true;
                resolve(older);
            });
        });
    }
    expandTree() {
        let status = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            log4jsconfig.log().info('Expanding left navigation.');
            element.all(by.className(expandDept)).isDisplayed().then(function () {
                const allExpands = element.all(by.className(expandDept));
                allExpands.each(function (expand) {
                    library.scrollToElement(expand);
                    expand.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
            element.all(by.className(expantProd)).isDisplayed().then(function () {
                const allExpands1 = element.all(by.className(expantProd));
                allExpands1.each(function (expand1) {
                    library.scrollToElement(expand1);
                    expand1.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
            status = true;
            resolve(status);
            element.all(by.className(expandDept)).isDisplayed().then(function () {
                const allExpands2 = element.all(by.className(expandDept));
                allExpands2.each(function (expand2) {
                    library.scrollToElement(expand2);
                    expand2.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
        });
    }

    collapseTree() {
        let status = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            element.all(by.xpath(testafterLot)).isDisplayed().then(function () {
                const allCollapse = element.all(by.xpath(testafterLot));
                allCollapse.each(function (collapse) {
                    collapse.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
            element.all(by.xpath(productafterLot)).isDisplayed().then(function () {
                const allCollapse1 = element.all(by.xpath(productafterLot));
                allCollapse1.each(function (collapse1) {
                    collapse1.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
            element.all(by.className(instrumentAfterLot)).isDisplayed().then(function () {
                const allCollapse2 = element.all(by.className(instrumentAfterLot));
                allCollapse2.each(function (collapse2) {
                    collapse2.click().then(function () {
                        dashBoard.waitForElement();
                    });
                });
            }).catch(function () {
            });
            status = true;
            resolve(status);
        });
    }
    deleteAlltestData() {
        let cleared = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            browser.actions().mouseMove(element(by.xpath(allTest))).perform();
            const allTest1 = element.all(by.xpath(allTest));
            allTest1.each(function (test) {
                library.scrollToElement(test);
                browser.actions().mouseMove(test).perform();
                library.clickJS(test);
                dashBoard.waitForElement();
                const scrollEle1 = element(by.xpath(scrolltest1));
                scrollEle1.isDisplayed().then(function () {
                    // tslint:disable-next-line: no-shadowed-variable
                    element.all(by.xpath(allData)).then(function (test) {
                        for (let i = 0; i < test.length; i++) {
                            dashBoard.waitForElement();
                            const scrollEle = element(by.xpath(scrolltest1));
                            library.scrollToElement(scrollEle);
                            scrollEle.click().then(function () {
                            });
                            dashBoard.waitForElement();
                            const deleteDataSet = element(by.xpath(deldataset));
                            deleteDataSet.click().then(function () {
                                const confirmDelete = element(by.id(confirmDel));
                                confirmDelete.click();
                                dashBoard.waitForPage();
                                cleared = true;
                                resolve(cleared);
                            });
                        }
                    });
                }).catch(function () {
                    cleared = true;
                    resolve(cleared);
                });
            });
        });
    }


    deleteAllTest() {
        return new Promise((resolve) => {
            let deleted = false;
            dashBoard.waitForPage();
            browser.driver.findElement(by.id(labSetup)).click().then(function () {
                dashBoard.waitForPage();
                const zoomOut = element(by.id(zoomout));
                zoomOut.click().then(function () {
                    zoomOut.click();
                    dashBoard.waitForElement();
                });
                // tslint:disable-next-line: no-shadowed-variable
                const allTest = element.all(by.xpath(locationAlltest));
                allTest.each(function (test) {
                    library.scrollToElement(test);
                    test.click().then(function () {
                        dashBoard.waitForPage();

                        const deleteBtn = element(by.className(delBtnLocation));
                        deleteBtn.click().then(function () {
                            dashBoard.waitForPage();
                            const deleteBtnConfirm = element(by.className(confirmDelLocation));
                            deleteBtnConfirm.click().then(function () {
                                dashBoard.waitForElement();
                            });
                        });
                    });
                });
                deleted = true;
                resolve(deleted);
            });
        });
    }
    goToTest2withSameName(Name) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const test2 = element(by.xpath('(.//span[contains(text(),\'' + Name + '\')])[2]'));
            library.scrollToElement(test2);
            library.scrollToElement(test2);
            dashBoard.waitForElement();
            test2.isDisplayed().then(function () {
                library.clickJS(test2);
                dashBoard.waitForElement();

                flag = true;
                resolve(flag);
            });
        });
    }
    verifyExpControlLotPresent(control) {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const expLot = '//div[contains(@class,"control-name") and contains(text(),"' + control + '")]/following-sibling::div[contains(@class,"expired-lot")]';
            const expControlLot = element(by.xpath(expLot));
            expControlLot.isDisplayed().then(function () {
                library.logStepWithScreenshot('Expired Control Lot is Present', 'Expired Control Lot Present');
                resolve(true);
            }).catch(function () {
                library.logFailStep('Expired Control Lot is Present');
                resolve(false);
            })
        })
    }
    verifyStartNewLotButtonPresent(control) {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const btnStartNewLot = '//div[contains(@class,"control-name") and contains(text(),"' + control + '")]/following-sibling::div//button/span/span[contains(text(),"start new lot")]';
            const startNewLot = element(by.xpath(btnStartNewLot));
            startNewLot.isDisplayed().then(function () {
                library.logStepWithScreenshot('Start New Lot Button is Present', 'Start New Lot Button Present');
                resolve(true);
            }).catch(function () {
                library.logFailStep('Start New Lot Button is not Present');
                resolve(false);
            })
        })
    }
    clickStartNewLotButton() {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const btnStartNewLot = '//button/span/span[contains(text(),"start new lot")]';
            const startNewLot = element(by.xpath(btnStartNewLot));
            startNewLot.isDisplayed().then(function () {
                library.click(startNewLot);
                library.logStep('Start new lot button clicked')
                resolve(true);
            }).catch(function () {
                library.logFailStep('Start New Lot Button is not Present');
                resolve(false);
            })
        })
    }
    verifyShowOptionsDisplayed() {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const showOpt = '//div//span[@mattooltip="Show options"]';
            const showOptions = element(by.xpath(showOpt));
            showOptions.isDisplayed().then(function () {
                library.logStepWithScreenshot('show options button is displayed', 'show options button Displayed');
                resolve(true);
            }).catch(function () {
                library.logFailStep('show options button is not displayed');
                resolve(false);
            })
        })
    }

    verifySummaryDataEntryEnabled(control) {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const dataEntry = '//div[contains(@class,"' + control + '")]/following-sibling::div/following-sibling::div/unext-analyte-summary-entry//mat-form-field//input';
            const dataEntryField = element(by.xpath(dataEntry));

            dataEntryField.getAttribute('disabled').then(function (disabled) {
                if (disabled == "true") {
                    library.logStepWithScreenshot("Data entry option is disabled", "data entry disbaled");
                    resolve(false);
                }
                else {
                    library.logStepWithScreenshot("Data entry option is enabled", "data entry enabled");
                    resolve(true);
                }
            })
        })
    }

    verifyDataEntryEnabled(control) {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const dataEntry = '//div[contains(@class,"' + control + '")]/following-sibling::div/following-sibling::unext-analyte-multi-point/div/div//mat-table//input';
            const dataEntryField = element(by.xpath(dataEntry));
            dataEntryField.getAttribute('disabled').then(function (disabled) {
                if (disabled == "true") {
                    library.logStepWithScreenshot("Data entry option is disabled", "data entry disbaled");
                    resolve(false);
                }
                else {
                    library.logStepWithScreenshot("Data entry option is enabled", "data entry enabled");
                    resolve(true);
                }
            })
        })

    }

    clickStartNewLotButton2(control) {
        dashBoard.waitForElement();
        return new Promise((resolve) => {
            const btnStartNewLot = '(//*[contains(text(),"' + control + '") and contains(@class,"control-name")]//following::span[contains(text(),"start new lot")])[1]';
            const startNewLot = element(by.xpath(btnStartNewLot));
            startNewLot.isDisplayed().then(function () {
                library.click(startNewLot);
                library.logStep('Start new lot button clicked')
                resolve(true);
            }).catch(function () {
                library.logFailStep('Start New Lot Button is not Present');
                resolve(false);
            })
        })
    }
}
