/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, protractor } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Connectivity.json', (err, data) => {
    if (err) { throw err; }
    const connectivityData = JSON.parse(data);
    jsonData = connectivityData;
});

const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const connectivity = 'LoginComponent.ConnectivityMapping';
const headerHolder = 'header-holder';
const tableFooter = 'table-foot';
const inputEle = 'mat-input-element';
const btn = 'button';
// ************New Elements*************/
const mappingTab = '//li/a[contains(text(),"MAPPING")]';
const leftNavigationInstCount = '//span[contains(text(),"INSTRUMENTS")]/following-sibling::span[contains(@class,"count")]';
const leftNavigationProdCount = '//span[contains(text(),"PRODUCTS")]/following-sibling::span[contains(@class,"count")]';
const leftNavigationTestCount = '//span[contains(text(),"TESTS")]/following-sibling::span[contains(@class,"count")]';
const unmappedInstrCode = '//button[@class="mat-small btn-code ng-star-inserted"]/strong';
const locationDDL = '//unext-instrument-map//unext-dropdown-filter//mat-select[@aria-label="Location"]';
const departmentDDl = '//unext-instrument-map//unext-dropdown-filter//mat-select[@aria-label="Department"]';
const instrumentDDL = '//unext-instrument-map//unext-dropdown-filter//mat-select[@aria-label="Instrument"]';
const resetButton = '//button/span[contains(text(),"Reset")]';
const instrumentCard = '//mat-card-title[@class="mat-card-title instrument-name"]';
const unmappedProdCode = '//button[@class="mat-small btn-code ng-star-inserted"]/strong';
const locationDDLProd = '//unext-product-map//unext-dropdown-filter//mat-select[@aria-label="Location"]';
const departmentDDlProd = '//unext-product-map//unext-dropdown-filter//mat-select[@aria-label="Department"]';
const instrumentDDLProd = '//unext-product-map//unext-dropdown-filter//mat-select[@aria-label="Instrument"]';
const resetButtonProd = '//button/span[contains(text(),"Reset")]';
const departmentProdDDl = '//unext-product-map//unext-dropdown-filter//mat-select[@aria-label="Department"]';
const departmentTestDDl = '//unext-test-map//unext-dropdown-filter//mat-select[@aria-label="Department"]';

const productCard = '//mat-card-title[@class="mat-card-title name"]';
const unmappedTestCode = '//button[@class="mat-small btn-code ng-star-inserted"]/strong';
const locationDDLTest = '//unext-connectivity-map//unext-dropdown-filter//mat-select[@aria-label="Location"]';
const departmentDDlTest = '//unext-connectivity-map//unext-dropdown-filter//mat-select[@aria-label="Department"]';
const instrumentDDLTest = '//unext-connectivity-map//unext-dropdown-filter//mat-select[@aria-label="Instrument"]';
const resetButtonTest = '//button/span[contains(text(),"Reset")]';
const instrumentCardTest = '//mat-card-title[@class="mat-card-title test-name"]';
const unmappedProductCount = '//span[contains(text(),"Unmapped")]/parent::span/preceding-sibling::strong[contains(text(),"All Products")]';
const reset = '//button/span[contains(text(),"Reset")]';
const closeMapping = '//mat-icon[contains(text(),"close")]';
const linkMsg2 = '//span/span[contains(text(),"will be mapped to")]';
const cancel = '//button/span[contains(text(),"Cancel")]';
const link = '//button/span[contains(text(),"Link")]';
const unlinkLInk = '//mat-card//mat-card-content//span[contains(text(),"Unlink")]';
const fileUploadLink = '//a[contains(text(),"FILE UPLOAD")]';
const instructionDDL = '//mat-select[@aria-label="Instructions Name *"]';
let browserName = '';
browser.getCapabilities().then(function (map) {
    browserName = map.get('browserName');

});


export class Connectivity {
    connect() {
        return new Promise((resolve) => {
            let foundPage = false;
            browser.driver.findElement(by.id(connectivity)).click().then(function () {

                dashBoard.waitForPage();
            });
            this.connectPage().then(function (page) {
                if (page) {
                    foundPage = true;
                }

            }).then(function () {
                resolve(foundPage);
            });
        });
    }

    connectPage() {
        return new Promise((resolve) => {
            let foundheader = false;
            browser.driver.findElement(by.className(headerHolder)).getText().then(function (header) {
                if (header.includes('Connectivity')) {
                    foundheader = true;
                }
            }).then(function () {
                resolve(foundheader);
            });
        });
    }

    addInstruction() {
        return new Promise((resolve) => {
            const footerButton = browser.driver.findElement(by.className(tableFooter));
            footerButton.findElement(by.tagName(btn)).then(function (button) {
                button.click();
                const inputElement = browser.driver.findElement(by.className(inputEle));
                inputElement.click().then(function () {
                    inputElement.sendKeys(jsonData.InstrumentName);
                    browser.sleep(5000);
                });
                browser.findElement(by.className('btns')).then(function (buttons) {
                    buttons.findElement(by.className('btn')).then(function (add) {
                        add.click().then(function () {
                            const footButton = browser.driver.findElement(by.className(tableFooter));
                            footButton.findElement(by.tagName(btn)).then(function (buttonBack) {
                                buttonBack.click().then(function () {

                                });
                            });
                        });
                    });
                });
            });
        });
    }
    gotoConnectivityPage() {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(9000).then(function () {
                const conn = element(by.id('spc_route_to_connectivity_button'));
                library.clickJS(conn);
                library.logStepWithScreenshot('connectivity icon clicked', 'connectivity-page');
                flag = true;
                resolve(flag);
            });
        });
    }

    clickMappingTab() {
        let flagmap = false;
        return new Promise((resolve) => {
            browser.wait(browser.ExpectedConditions.visibilityOf(
                (element(by.xpath(mappingTab)))), 20000, 'Element is not Displayed');
            const map = element(by.xpath(mappingTab));
            library.clickJS(map);
            browser.sleep(30000);
            library.logStepWithScreenshot('Mapping Page displayed.', 'mapping-page');
            flagmap = true;
            resolve(flagmap);
        });
    }

    verifyMappingPageInstrumentUI() {
        let flag1 = false;
        return new Promise((resolve) => {
            const mapInstrument = new Map<string, string>();
            mapInstrument.set('left Navigation Instrument Count', leftNavigationInstCount);
            mapInstrument.set('left Navigation Product Count', leftNavigationProdCount);
            mapInstrument.set('left Navigation Test Count', leftNavigationTestCount);
            mapInstrument.set('location DDL', locationDDL);
            mapInstrument.set('department DDl', departmentDDl);
            mapInstrument.set('instrument DDL', instrumentDDL);
            mapInstrument.set('reset Button', resetButton);
            mapInstrument.set('instrument Card', instrumentCard);

            mapInstrument.forEach(function (key, value) {
                const ele = element(by.xpath(key));
                if (ele.isDisplayed()) {

                    flag1 = true;
                    library.logStep(value + ' is displayed.');

                } else {
                    flag1 = false;
                    library.logFailStep(value + ' is not displayed.');
                }

            });
            if (flag1 === true) {
                library.logStepWithScreenshot('Mapping page of Instrument UI verified', 'mappingPageVerified');
                resolve(flag1);
            } else {
                library.logFailStep('Mapping page UI not verified');
                resolve(flag1);
            }

        });
    }
    verifyMappingPageProductUI() {
        let flag2 = false;
        return new Promise((resolve) => {
            const mapProduct = new Map<string, string>();
            mapProduct.set('location DDL Product', locationDDLProd);
            mapProduct.set('instrument DDL Product', instrumentDDLProd);
            mapProduct.set('reset Button Product', resetButtonProd);
            mapProduct.set('product Card', productCard);

            mapProduct.forEach(function (key, value) {
                const ele = element(by.xpath(key));
                if (ele.isDisplayed()) {

                    flag2 = true;
                    library.logStep(value + ' is displayed.');

                } else {
                    flag2 = false;
                    library.logFailStep(value + ' is not displayed.');
                }
            });
            if (flag2 === true) {
                library.logStepWithScreenshot('Mapping page of product UI verified', 'mappingPageVerified');
                resolve(flag2);
            } else {
                library.logFailStep('Mapping page UI not verified');
                resolve(flag2);
            }
        });
    }
    verifyMappingPageTestUI() {
        let flag3 = false;
        return new Promise((resolve) => {
            const maptest = new Map<string, string>();
            maptest.set('location DDL Test', locationDDLTest);
            maptest.set('department DDl Test', departmentDDlTest);
            maptest.set('instrument DDL Test', instrumentDDLTest);
            maptest.set('reset Button Test', resetButtonTest);
            maptest.set('Test Card', instrumentCardTest);
            maptest.forEach(function (key, value) {
                const ele = element(by.xpath(key));
                if (ele.isDisplayed()) {

                    flag3 = true;
                    library.logStep(value + ' is displayed.');
                } else {
                    flag3 = false;
                    library.logFailStep(value + ' is not displayed.');
                }
            });
            if (flag3 === true) {
                library.logStepWithScreenshot('Mapping page of Test UI verified', 'mappingPageVerified');
                resolve(flag3);
            } else {
                library.logFailStep('Mapping page UI not verified');
                resolve(flag3);
            }
        });
    }
    clickLeftNavigationProduct() {
        let flag = false;
        return new Promise((resolve) => {
            const productcnt = element(by.xpath(leftNavigationProdCount));
            library.clickJS(productcnt);
            library.logStepWithScreenshot('Left Navigation Product clicked', 'Product map');
            flag = true;
            resolve(flag);
        });
    }
    clickLeftNavigationInstrument() {
        let flag = false;
        return new Promise((resolve) => {
            const instcnt = element(by.xpath(leftNavigationInstCount));
            library.clickJS(instcnt);
            library.logStepWithScreenshot('Left Navigation Instrument clicked', 'Instrument map');
            flag = true;
            resolve(flag);
        });
    }


    clickLeftNavigationTest() {
        let flag = false;
        return new Promise((resolve) => {
            const testcnt = element(by.xpath(leftNavigationTestCount));
            library.clickJS(testcnt);
            library.logStepWithScreenshot('Left Navigation Test clicked', 'Test map');
            flag = true;
            resolve(flag);
        });
    }
    applyDepartmentFilter(departmentname) {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(5000);
            const deptDDl = element(by.xpath(departmentDDl));
            library.clickJS(deptDDl);
            dashBoard.waitForScroll();
            const dept = element(by.xpath('//span[contains(text(),"' + departmentname + '")]/preceding-sibling::mat-pseudo-checkbox'));
            library.clickJS(dept);
            dashBoard.waitForScroll();
            dashBoard.waitForScroll();
            library.logStepWithScreenshot('Department Filter Applied', 'filterApplied');
            const esc = element(by.tagName('body'));
            esc.sendKeys(protractor.Key.ESCAPE);
            flag = true;
            resolve(flag);
        });
    }

    applyInstrumentFilter(instrument) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const instDDl = element(by.xpath(instrumentDDL));
            library.clickJS(instDDl);
            const inst = element(by.xpath('// span[contains(text(),"' + instrument + '")]/preceding-sibling::mat-pseudo-checkbox'));
            library.clickJS(inst);
            const map = element(by.xpath(locationDDLTest));
            library.clickJS(map);
            library.logStepWithScreenshot('Instrument Filter Applied', 'filterApplied');
            const esc = element(by.tagName('body'));
            esc.sendKeys(protractor.Key.ESCAPE);
            flag = true;
            resolve(flag);
        });
    }
    verifyFilterAppliedInstrument(cardName1, cardName2, instr1, instr2) {
        let flag = false, flag1 = false, verified = false;
        return new Promise((resolve) => {
            const card1 = findElement(locatorType.XPATH, '// mat-card-title[contains(text(),"' + cardName1 + '")]');
            const card2 = findElement(locatorType.XPATH, '// mat-card-title[contains(text(),"' + cardName2 + '")]');
            dashBoard.waitForElement();
            if (card1.isDisplayed() && card2.isDisplayed()) {
                flag = true;
                library.logStepWithScreenshot('Instrument card displayed as per the applied filter', 'InstrumentCard');

            } else {
                flag = false;
                library.logFailStep('Instrument card is not displayed as per the applied filter');

            }
            const instDDl = element(by.xpath(instrumentDDL));
            library.clickJS(instDDl);
            const instrName1 = element(by.xpath('// span[contains(text(),"' + instr1 + '")]/preceding-sibling::mat-pseudo-checkbox'));
            const instrName2 = element(by.xpath('// span[contains(text(),"' + instr2 + '")]/preceding-sibling::mat-pseudo-checkbox'));
            if (instrName1.isDisplayed() && instrName2.isDisplayed()) {
                flag1 = true;
                library.logStepWithScreenshot('Instrument option displayed in dropdown as per the applied filter', 'InstrumentCard');
                resolve(flag);
            } else {
                flag1 = false;
                library.logFailStep('Instrument option is not displayed in dropdown as per the applied filter');
                resolve(flag);
            }
            if (flag === true && flag1 === true) {
                library.logStepWithScreenshot('Instrument option/card displayed  as per the applied filter', 'InstrumentCard');
                verified = true;
                resolve(verified);
            } else {
                library.logStepWithScreenshot('Instrument option/card is not displayed  as per the applied filter', 'InstrumentCard');
                verified = false;
                resolve(verified);
            }
        });
    }
    verifyCardDisplayed(pcard1) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const card1 = findElement(locatorType.XPATH, '// mat-card-title[contains(text(),"' + pcard1 + '")]');
            dashBoard.waitForElement();
            if (card1.isDisplayed()) {
                flag = true;
                library.logStepWithScreenshot(pcard1 + ' Card displayed as per the applied filter', 'InstrumentCard');
                resolve(flag);
            } else {
                flag = false;
                library.logFailStep(pcard1 + ' Card is not displayed as per the applied filter');
                resolve(flag);
            }
        });
    }
    verifyProductUnmappedCountDisplayed(expectedCount, productName) {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(1000);
            const unmappedCount = element(by.xpath('// span[contains(text(),"' + expectedCount + '")]/span[contains(text(),"Unmapped")]/parent::span/preceding-sibling::strong[contains(text(),"All Products")]'));
            library.clickJS(unmappedCount);
            const productCount = element(by.xpath('// button/span[contains(text(),"' + expectedCount + '")]/following-sibling::strong[contains(text(),"' + productName + '")]'));
            library.clickJS(productCount);
            if (unmappedCount.isDisplayed() && productCount.isDisplayed()) {
                flag = true;
                library.logStepWithScreenshot('Product Name and Unmapped Count Displayed', 'unmappedCount');
                resolve(flag);
            } else {
                flag = false;
                library.logFailStep('Product Name and Unmapped Count is not Displayed');
                resolve(flag);
            }
        });
    }
    verifyTestUnmappedCountDisplayed(expectedCount, productName) {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(2000);
            const unmappedCount = element(by.xpath('// span[contains(text(),"' + expectedCount + '")]/span[contains(text(),"Unmapped")]/parent::span/preceding-sibling::strong[contains(text(),"All Tests")]'));
            library.scrollToElement(unmappedCount);
            const productCount = element(by.xpath('// button/span[contains(text(),"' + expectedCount + '")]/following-sibling::strong[contains(text(),"' + productName + '")]'));
            library.scrollToElement(productCount);
            if (unmappedCount.isDisplayed() && productCount.isDisplayed()) {
                flag = true;
                library.logStepWithScreenshot('Test Name and Unmapped Count Displayed', 'unmappedCount');
                resolve(flag);
            } else {
                flag = false;
                library.logFailStep('Test Name and Unmapped Count is not Displayed');
                resolve(flag);
            }
        });
    }
    clickUnmappedCount(expectedCount, productName) {
        let flag = false;
        return new Promise((resolve) => {
            const productCount = element(by.xpath('// button/span[contains(text(),"' + expectedCount + '")]/following-sibling::strong[contains(text(),"' + productName + '")]'));
            library.clickJS(productCount);
            library.logStepWithScreenshot('Unmapped count clicked.', 'unmappedCount');
            flag = true;
            resolve(flag);
        });
    }
    verifyLocationDepartmentInstrumentDisplayed(expectedLocation, expectedDept, expectedInstrument) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForPage();
            const filters = new Map<string, string>();
            filters.set('Location', expectedLocation);
            filters.set('Department', expectedDept);
            filters.set('Instrument', expectedInstrument);
            filters.forEach(function (key, value) {
                const DDL = element(by.xpath('// mat-select[@aria-label="' + value + '"]// span/span'));
                DDL.getText().then(function (actual) {
                    console.log('actual: ' + actual + ' Key ' + key);
                    if (actual.trim() === key) {
                        flag = true;
                        library.logStepWithScreenshot(key + ' is displayed in ' + value, 'filter');
                        resolve(flag);
                    } else {
                        flag = false;
                        library.logStepWithScreenshot(key + ' is not displayed in ' + value, 'filter');
                        resolve(flag);
                    }
                });
            });
        });

    }
    clickResetButton() {
        let flag = false;
        return new Promise((resolve) => {
            const resetBtn = element(by.xpath(reset));
            library.clickJS(resetBtn);
            dashBoard.waitForElement();
            library.logStepWithScreenshot('Reset button clicked', 'resetclicked');
            flag = true;
        });
    }

    verifyFilterReset(filtername) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            const filterReset = element(by.xpath('// mat-select[@aria-label="' + filtername + '"]// span[contains(text(),"' + filtername + '")]'));
            if (filterReset.isDisplayed()) {
                library.logStepWithScreenshot('Filter reset', 'reset');
                flag = true;
                resolve(flag);
            } else {
                library.logFailStep('Filter not reset');
                flag = false;
                resolve(flag);
            }

        });
    }
    closeMapping() {
        let flag = false;
        return new Promise((resolve) => {
            const closeBtn = element(by.xpath(closeMapping));
            library.clickJS(closeBtn);
            library.logStepWithScreenshot('Mapping window closed', 'Mappingclosed');
            flag = true;
            resolve(flag);
        });
    }

    mapCodesToCards(code, card, level) {
        let flag = false;
        return new Promise((resolve) => {
            dashBoard.waitForElement();
            if (level === 'Product') {
                const codeEle = element(by.xpath('// button/strong[contains(text(),"' + code + '")]'));
                const cardEle = element(by.xpath('// mat-card-title[contains(text(),"' + card + '")]'));
                library.clickJS(codeEle);
                library.logStepWithScreenshot('Code clicked', 'codeClicked');
                dashBoard.waitForElement();
                library.clickJS(cardEle);
                library.hoverOverElement(cardEle);
                browser.sleep(3000);
                const levelMap = element(by.xpath('//mat-card/mat-card-content/section/span//button[contains(@class,"levelButton")]'));


                library.clickJS(levelMap);
                library.logStepWithScreenshot('Card level clicked', 'cardLevelClicked');
                flag = true;
                resolve(flag);
            } else {
                const codeEle = element(by.xpath('// button/strong[contains(text(),"' + code + '")]'));
                const cardEle = element(by.xpath('// mat-card-title[contains(text(),"' + card + '")]'));
                library.clickJS(codeEle);
                library.logStepWithScreenshot('Code clicked', 'codeClicked');

                library.clickJS(cardEle);
                library.logStepWithScreenshot('Card clicked', 'cardClicked');
                flag = true;
                resolve(flag);
            }
        });
    }
    VerifyCodeLinkFooterUI(msg) {
        let flag = false;
        return new Promise((resolve) => {
            const linkmsg = element(by.xpath(linkMsg2));
            const linkMsg1 = element(by.xpath('// mat-dialog-content// div[contains(text(),"' + msg + '")]'));
            const cancelEle = element(by.xpath(cancel));
            const linkEle = element(by.xpath(link));
            dashBoard.waitForElement();
            if (linkmsg.isDisplayed() && linkMsg1.isDisplayed() && cancelEle.isDisplayed() && linkEle.isDisplayed()) {
                flag = true;
                library.logStepWithScreenshot('Link button, cancel button and link message displayed', 'LinkBtn');
                resolve(flag);
            } else {
                flag = false;
                library.logFailStep('Link button, cancel button and link message is not displayed');
                resolve(flag);
            }

        });
    }
    clickLinkButton() {
        let flag = false;
        return new Promise((resolve) => {
            const linkBtn = element(by.xpath(link));
            library.clickJS(linkBtn);
            library.logStepWithScreenshot('Link button clicked', 'linkClick');
            flag = true;
            resolve(flag);
        });
    }
    verifyCodeLinked(Code, Card, unmappedCode, levelType) {
        let flag = false;
        return new Promise((resolve) => {
            if (levelType = 'Test') {
                const codeLinkedToCard = element(by.xpath('// mat-card-title[contains(text(),"' + Card + '")]/parent::section/parent::mat-card-header/following-sibling::mat-card-content// span[contains(text(),"' + Code + '")]'));
                dashBoard.waitForElement();

                if (codeLinkedToCard.isDisplayed()) {
                    library.logStepWithScreenshot('Mapped code is displayed on card ', 'linkClick');
                    flag = true;
                    resolve(flag);
                } else {
                    library.logStepWithScreenshot('Mapped code is not displayed on card.', 'linkClick');
                    flag = false;
                    resolve(flag);
                }
            } else {
                const codeLinkedToCard = element(by.xpath('// mat-card-title[contains(text(),"' + Card + '")]/parent::section/parent::mat-card-header/following-sibling::mat-card-content// span[contains(text(),"' + Code + '")]'));
                const unmappedCodeOnCard = element(by.xpath('// mat-card-content// p[contains(text(),"' + unmappedCode + '")]'));
                dashBoard.waitForElement();
                if (codeLinkedToCard.isDisplayed() && unmappedCodeOnCard.isDisplayed()) {
                    library.logStepWithScreenshot('Mapped code is displayed on card along with the unmapped count', 'linkClick');
                    flag = true;
                    resolve(flag);
                } else {
                    library.logStepWithScreenshot('Mapped code is not displayed on card along with the unmapped count', 'linkClick');
                    flag = false;
                    resolve(flag);
                }
            }
        });
    }
    verifyUnmappedCountLeftNavigation(level, expectedCount, levelType) {
        let flag = false;
        return new Promise((resolve) => {
            if (levelType === 'Test') {
                browser.sleep(2000);
                const unmappedCount = element(by.xpath('// span[contains(text(),"' + expectedCount + '")]/span[contains(text(),"Unmapped")]/parent::span/preceding-sibling::strong[contains(text(),"All Tests")]'));
                library.scrollToElement(unmappedCount);
                if (unmappedCount.isDisplayed()) {
                    library.logStepWithScreenshot('After mapping test unmapped count in left navigation displayed as 0', 'leftNavigationUnmappedCode');
                    flag = true;
                    resolve(flag);
                } else {
                    library.logStepWithScreenshot('After mapping test unmapped count in left navigation is not  displayed as 0', 'leftNavigationUnmappedCode');
                    flag = false;
                    resolve(flag);
                }
            } else {
                browser.sleep(2000);
                const leftNavCount = element(by.xpath('// span[contains(text(),"' + level + '")]/following-sibling::span'));
                library.scrollToElement(leftNavCount);
                browser.sleep(2000);
                leftNavCount.getText().then(function (cnt) {
                    console.log(cnt + ' and expected ' + expectedCount);
                    if (cnt.includes(expectedCount)) {
                        library.logStepWithScreenshot('Unmapped code count in left navigation verified', 'leftNavigationUnmappedCode');
                        flag = true;
                        resolve(flag);
                    } else {
                        library.logStepWithScreenshot('Unmapped code count in left navigation not verified', 'leftNavigationUnmappedCode');
                        flag = false;
                        resolve(flag);
                    }
                });
            }
        });
    }
    verifyUnlinkDisplayed(card) {
        let flag = false;
        return new Promise((resolve) => {

            const card1 = element(by.xpath('// mat-card// mat-card-content// span[contains(text(),"' + card + '")]'));
            card1.isDisplayed().then(function () {
                if (browserName === 'MicrosoftEdge') {
                    library.scrollToElement(card1);
                    library.clickAction(card1);
                } else {
                    library.scrollToElement(card1);
                    library.clickAction(card1);
                }
                const unLinkEle = element(by.xpath(unlinkLInk));
                library.scrollToElement(unLinkEle);
                unLinkEle.isDisplayed().then(function () {
                    library.logStepWithScreenshot('Unlink link displayed', 'unlink');
                    flag = true;
                    resolve(flag);
                }).catch(function () {
                    library.logFailStep('Unlink link not displayed');
                    flag = false;
                    resolve(flag);
                });
            }).catch(function () {
                library.logFailStep('Card/Unlink link not displayed');
                flag = false;
                resolve(flag);
            });

        });
    }
    clickAndVerifyCardUnlink(code) {
        let flag = false;
        return new Promise((resolve) => {
            const unLinkEle = element(by.xpath(unlinkLInk));
            library.clickJS(unLinkEle);
            library.logStepWithScreenshot('Unlink link clicked', 'unlink');
            browser.sleep(8000);
            const codeEle = element(by.xpath('//span[contains(text(),"'+code+'")]'));
            library.hoverOverElement(codeEle);
            library.clickJS(element(by.xpath('//span[contains(text(),"'+code+'")]//following::span[contains(text(),"Unlink")]')));
            if (codeEle.isDisplayed()) {
                library.logStepWithScreenshot('Code is not unmapped', 'Not unmappedCode');
                resolve(false);
            } else {
                library.logStepWithScreenshot('Code is unmapped', 'unmappedCode');
                resolve(true);
            }
        });
    }
    waitForFileUpload() {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(60000);
            flag = true;
            resolve(flag);
        });
    }
    clickFileUploadTab() {
        let flag = false;
        return new Promise((resolve) => {
            const linkBtn = element(by.xpath(fileUploadLink));
            library.clickJS(linkBtn);
            library.logStepWithScreenshot('File upload Link button clicked', 'navigatedFileUpload');
            flag = true;
            resolve(flag);
        });
    }
    selectInstruction(instName) {
        let flag = false;
        return new Promise((resolve) => {
            browser.wait(browser.ExpectedConditions.visibilityOf(
                (element(by.xpath(instructionDDL)))), 20000, 'Element is not Displayed');
            const linkBtn = element(by.xpath(instructionDDL));
            library.clickJS(linkBtn);
            library.logStepWithScreenshot('select instrument dropdown clicked', 'select instrument');
            const option = element(by.xpath('// mat-option/span[contains(text(),"' + instName + '")]'));
            library.clickJS(option);
            flag = true;
            resolve(flag);
        });
    }

    applyTestDepartmentFilter(departmentname) {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(5000);
            const deptDDl = element(by.xpath(departmentTestDDl));
            library.clickJS(deptDDl);
            const dept = element(by.xpath('//span[contains(text(),"' + departmentname + '")]/preceding-sibling::mat-pseudo-checkbox'));
            library.clickJS(dept);
            const map = element(by.xpath(locationDDLTest));
            library.clickJS(map);
            library.logStepWithScreenshot('Department Filter Applied', 'filterApplied');
            const esc = element(by.tagName('body'));
            esc.sendKeys(protractor.Key.ESCAPE);
            flag = true;
            resolve(flag);
        });
    }

    applyProdDepartmentFilter(departmentname) {
        let flag = false;
        return new Promise((resolve) => {
            browser.sleep(5000);
            const deptDDl = element(by.xpath(departmentProdDDl));
            library.clickJS(deptDDl);
            const dept = element(by.xpath('//span[contains(text(),"' + departmentname + '")]/preceding-sibling::mat-pseudo-checkbox'));
            library.clickJS(dept);
            const map = element(by.xpath(locationDDLTest));
            library.clickJS(map);
            library.logStepWithScreenshot('Department Filter Applied', 'filterApplied');
            const esc = element(by.tagName('body'));
            esc.sendKeys(protractor.Key.ESCAPE);
            flag = true;
            resolve(flag);
        });
    }
    verifyNTo1Mapping(ele) {
        return new Promise((resolve) => {
            const nTo1Element = '//mat-card-title[contains(text(),"'+ele+'")]//following::*[contains(@class,"codes mat-small")]//div//span';
            element.all(by.xpath(nTo1Element)).then(function (numbers) {
                console.log("Mapped Count +++> ", numbers.length);
                if (numbers.length <= 0) {
                    console.log("Failed : N to 1 Mapping is not present");
                    library.logStepWithScreenshot("Failed : N tp 1 Mapping is not present", 'Mapping is Not present');
                    resolve(false);
                } else {
                    console.log("N to 1 Mapping is present");
                    library.logStepWithScreenshot("N tp 1 Mapping is present", 'Mapping is present');
                    resolve(true);
                }
            });
        });
    }
}
