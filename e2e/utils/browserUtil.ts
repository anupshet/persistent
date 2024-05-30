//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
declare const allure: any;
import * as assert from 'assert';
import * as moment from 'moment';
import { browser, by, element, ElementFinder, ExpectedConditions, logging } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
const EC = browser.ExpectedConditions;
let browserName = '';
browser.getCapabilities().then(function (map) {
    browserName = map.get('browserName');
    console.log(browserName);
});
const until = browser.ExpectedConditions;
const path = require('path');
const browseFileLink = './/span[contains(text(),"browse")]';
const browseFileNRCL = './/label[contains(text(),"browse")]';
const loadingImage = '//div/img[@src="assets/images/bds/icn_loader.gif"]';
const waitXpath = "//invlElementsWaitXapth";
let errorMessage = element(by.xpath("//unext-error-message"));
let errorMessageOk = element(by.xpath("//unext-error-message//button"));
const LoadingRunTxt = "//div[text()=' Loading runs... ']";
let logContent: logging.Entry[] = [];

export enum locatorType {
    XPATH = 'xpath',
    ID = 'id',
    CLASSNAME = 'className',
    TAGNAME = 'tagName',
    CSS = 'css',
    LINKTEXT = 'linkText',
    PARTIALLINKTEXT = 'partialLinkText'
}
export class BrowserLibrary {

    async waitTillVisible(ele, timeout) {
        await browser.wait(browser.ExpectedConditions.visibilityOf(ele), timeout);
    }

    async waitTillInVisible(ele, timeout) {
        await browser.wait(browser.ExpectedConditions.invisibilityOf(ele), timeout);
    }

    async waitTillPresent(ele, timeout) {
        await browser.wait(browser.ExpectedConditions.presenceOf(ele), timeout);
    }

    async waitTillClickable(ele, timeout) {
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), timeout);
    }

    async verifyPayloadDataAndValidTime(api, payLoad) {
        let postData, flag;
        postData = await this.getPayLoad(api);
        flag = await this.compareJsonValuesValidTime(payLoad, postData);
        if (!flag) {
            this.logFailStep("There is an issue with the payload values");
        }
        return flag;
    }

    async compareJsonValuesValidTime(expectedJson, actualJson) {
        let keys1 = Object.keys(expectedJson);
        let flag: boolean;
        for (let i = 0; i < keys1.length; i++) {
            if (typeof (expectedJson[keys1[i]]) != "object") {
                if (keys1[i].endsWith("Time")) {
                    flag = isNaN(Date.parse(actualJson[keys1[i]]));
                    if (flag) {
                        this.logFailStep(actualJson[keys1[i]] + " is null");
                        return flag;
                    };
                    continue;
                }
                flag = expectedJson[keys1[i]] === actualJson[keys1[i]];
                if (!flag) {
                    this.logFailStep("Json Values Not Match For " + keys1[i] + ". Expected = " + expectedJson[keys1[i]] + " Actual " + actualJson[keys1[i]]);
                    return flag;
                };
            } else {
                flag = await this.compareJsonValuesValidTime(expectedJson[keys1[i]], actualJson[keys1[i]]);
            }
        }
        return flag;
    }


    closeErrorMessageIfAppears() {
        setInterval(async function () {
            try {
                if (await errorMessage.isPresent()) {
                    await browser.wait(ExpectedConditions.elementToBeClickable(errorMessageOk), 5000);
                    await errorMessageOk.click();
                }
            } catch (error) { console.log(error); }
        }, 100);
    }

    async verifyAPIStatusAndPayloadStructure(api: any, payLoad: any, statusCode: any) {
        let postData, flag;
        postData = await this.getPayLoad(api);
        if (postData == null || typeof (postData) == "undefined") {
            assert.fail("The Actual Payload is either null or of undefined type\n\nPayload - " + postData);
        }
        flag = await this.compareJsonStructure(payLoad, postData);
        if (!flag) {
            this.logFailStep("There is an issue with the payload");
            assert.fail("Expected Payload Structure - \n\n" + JSON.stringify(payLoad) + "\n\nActual Payload Structure - \n\n" + JSON.stringify(postData));
            return flag;
        }
        return this.verifyStatusCode(api, statusCode);
    }

    /** 
     * Make Sure To Clear Performance Logs using clearPerformanceLogs(), Before Performing Action That Calls The API
    */
    async verifyStatusCode(api, statusCode) {
        let status;
        logContent.push(...(await browser.manage().logs().get(logging.Type.PERFORMANCE)));
        for (let i = 0; i < logContent.length; i++) {
            console.log("Inside For")
            try {
                console.log("Inside Try")
                if (JSON.parse(logContent[i].message).message.method == "Network.responseReceived") {
                    console.log("Inside first if")
                    console.log("URL:" + JSON.parse(logContent[i].message).message.params.response.url);
                    if (JSON.parse(logContent[i].message).message.params.response.url == api) {
                        console.log("Inside secnd if")
                        status = JSON.stringify(JSON.parse(logContent[i].message).message.params.response.status);
                        if (status == statusCode)
                            console.log("Inside third if")
                        return true;
                        break;
                    }
                }
            } catch (error) {
            }
        }
        this.logFailStep("API Status Code Is Not " + statusCode);
        return false;
    }

    /** 
     * Make Sure To Clear Performance Logs using clearPerformanceLogs(), Before Performing Action That Calls The API
    */
    async getPayLoad(api) {
        let postData, i;
        logContent.push(...(await browser.manage().logs().get(logging.Type.PERFORMANCE)));
        for (i = 0; i < logContent.length; i++) {
            if (JSON.parse(logContent[i].message).message.method == 'Network.requestWillBeSent') {
                if (JSON.parse(logContent[i].message).message.params.request.url.includes(api)) {
                    postData = JSON.parse(logContent[i].message).message.params.request.postData;
                    if ((typeof (postData) != "undefined")) {
                        postData = JSON.parse(postData);
                        break;
                    }
                }
            }
        }
        if (i >= logContent.length)
            assert.fail("API call with the given URL not found. URL - " + api);
        return postData;
    }

    async clearPerformanceLogs() {
        await browser.manage().logs().get(logging.Type.PERFORMANCE);
        logContent = [];
    }

    async compareJsonStructure(expectedJson, actualJson) {
        let keys1 = Object.keys(expectedJson);
        let keys2 = Object.keys(actualJson);
        let flag: boolean;
        for (let i = 0; i < keys1.length; i++) {
            flag = keys2.includes(keys1[i]);
            if (!flag) {
                return flag;
            };
            if (typeof (expectedJson[keys1[i]]) == "object") {
                flag = await this.compareJsonStructure(expectedJson[keys1[i]], actualJson[keys1[i]]);
            }
        }
        return flag;
    }

    generateEmailWithTimeStamp(userName, emailDomain) {
        return userName + Date.now() + emailDomain;
    }

    waitForPage() {
        browser.manage().timeouts().pageLoadTimeout(15000);
    }

    waitForElementToBeClickable(locator) {
        browser.wait(EC.elementToBeClickable(locator), 20000);
    }

    waitForElementToBeVisible(locator) {
        browser.wait(EC.visibilityOf(locator), 20000);
    }

    waitForElementToBePresent(locator) {
        browser.wait(browser.element(by.xpath(locator)).isPresent);
    }

    scrollToElement(locator) {
        browser.executeScript('arguments[0].scrollIntoView();', locator);
        log4jsconfig.log().info('Scrolled to ' + locator);
    }

    hoverOverElement(locator) {
        browser.actions().mouseMove(locator).perform();
        browser.sleep(3000);
    }

    waitForElement(locator) {
        browser.wait(until.visibilityOf((locator)), 10000, 'Element not visible: ' + locator);
    }

    clickAction(locator) {
        browser.actions().mouseMove(locator).click().perform();
        browser.sleep(5000);
    }

    clickJS(locator) {
        browser.executeScript('arguments[0].scrollIntoView(true);', locator);
        browser.executeScript('arguments[0].click();', locator);
        browser.sleep(3000);
    }
    async clickJS_async(locator) {
        await browser.executeScript('arguments[0].scrollIntoView(true);', locator);
        await browser.executeScript('arguments[0].click();', locator);
        await browser.sleep(3000);
    }

    click(locator) {
        browser.actions().mouseMove(locator).perform();
        locator.click().then(function () {
            browser.sleep(1000);
        });
    }

    clickOnEle(locator) {

        locator.click().then(function () {
            browser.sleep(1000);
        });
    }

    async scrollToElement_async(locator) {
        await browser.executeScript('arguments[0].scrollIntoView();', locator);
        log4jsconfig.log().info('Scrolled to ' + locator);
    }

    setText(locator, data) {
        browser.actions().mouseMove(locator).perform();
        locator.sendKeys(data).then(function () {
            browser.sleep(3000);
        });
    }

    refreshBrowser() {
        browser.refresh();
    }

    logStep(msg) {
        console.log(msg);
        allure.createStep(msg, function () {
        })();
    }

    logStepWithScreenshot(msg, screenshotName) {
        allure.createStep(msg, function () {
        })();
        browser.takeScreenshot().then(function (png) {
            allure.createAttachment(screenshotName, function () {
                return new Buffer(png, 'base64');
            }, 'image/png')();
        });
    }

    logFailStep(msg) {
        console.log(msg);
        allure.createStep(msg, function () {
            allure._allure.endStep('failed');
        })();
        browser.takeScreenshot().then(function (png) {
            allure.createAttachment('FailedStep', function () {
                return new Buffer(png, 'base64');
            }, 'image/png')();
        });
    }

    attachScreenshot(screenshotname) {
        browser.takeScreenshot().then(function (png) {
            allure.createAttachment(screenshotname, function () {
                return new Buffer(png, 'base64');
            }, 'image/png')();
        });
    }

    selectRadioButton(locator) {
        if (locator.isSelected() === true) {
            console.log('The Radio Button is already selected');
        } else {
            locator.click().then(function () {
                console.log('The Radio Button is selected');
            });
        }
    }

    setTextJS(locator, value) {
        browser.executeScript('arguments[0].value="' + value + '"', locator);
    }


    browseFileToUpload(fileToUpload) {
        let flag = false;
        const absolutePath = path.resolve(__dirname, fileToUpload);
        return new Promise((resolve) => {
            browser.wait(browser.ExpectedConditions.visibilityOf(
                (element(by.xpath(browseFileLink)))), 20000, 'Element is not Displayed');
            const browse = element(by.xpath(browseFileLink));
            this.clickJS(browse);
            this.logStep('Browse link is clicked');
            const elm = element(by.css('input[type="file"]'));
            browser.executeScript('arguments[0].style = {};', elm.getWebElement());
            elm.sendKeys(absolutePath);
            flag = true;
            this.logStep('Files added for new instrument');
            resolve(flag);
        });
    }

    browseFileToUploadNRCL(fileToUpload) {
        let flag = false;
        const absolutePath = path.resolve(__dirname, fileToUpload);
        return new Promise((resolve) => {
            const browse = element(by.xpath(browseFileNRCL));
            this.clickJS(browse);
            this.logStep('Browse link is clicked');
            const elm = element(by.css('input[type="file"]'));
            browser.executeScript('arguments[0].style = {};', elm.getWebElement());
            elm.sendKeys(absolutePath);
            flag = true;
            this.logStepWithScreenshot('File Uploaded', 'FileUploaded');
            resolve(flag);
        });
    }
    parseJson(jPath) {
        const fs = require('fs');
        let jsonData, testEnv;
        return new Promise((resolve) => {
            fs.readFile(jPath, (err, data) => {
                if (err) { throw err; }
                let settings = JSON.parse(data);
                jsonData = settings;
                testEnv = browser.params.user.env;
                switch (testEnv) {
                    case 'DEV': {
                        jsonData = jsonData.DEV
                        break;
                    }
                    case 'QA': {
                        jsonData = jsonData.QA
                        break;
                    }
                    case 'STAGE': {
                        jsonData = jsonData.STAGE
                        break;
                    }
                    case 'Local': {
                        jsonData = jsonData.Local
                        break;
                    }
                }
                resolve(jsonData);
            });
        });
    }
    verifyBaseURL(dataType, paramType, baseURL) {
        return new Promise((resolve) => {
            browser.manage().logs().get('performance').then((browserLogs) => {
                let type;
                if (dataType == 'requestData') {
                    type = 'Network.requestWillBeSent';
                }
                let requestType =
                    browserLogs.forEach((browserLog) => {
                        var message = JSON.parse(browserLog.message).message;
                        if (message.method == type) {
                            if (message.params.type == paramType) {
                                if (message.params.request.url.includes(baseURL)) {
                                    var requestUrl = new String(message.params.request.url);
                                    console.log('++++ Output url is ++++> ', requestUrl);
                                    var requestUrlSize = requestUrl.length;
                                    console.log("++++ Last char of url ++++> ", requestUrlSize, '   ', requestUrl.charAt(requestUrlSize - 1));
                                    if (requestUrl.charAt(requestUrlSize) == "") {
                                        console.log("Request URL appends nothing")
                                        resolve(true)
                                    } else {
                                        console.log("Failed : Request URL appends information")
                                        resolve(false)
                                    }

                                }
                            }
                        }
                    });

            });

        });
    }

    isElementPresent(elementFinder: ElementFinder): Function {
        return elementFinder.isPresent.bind(elementFinder);
    }
    generateRandomNumber(letters, length) {
        var string = '';
        var i;
        for (i = 0; i < length; i++) {
            string += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return string;
    }
    createTimeStamp() {
        const now = moment();
        const timestamp = now.format('YYYYMMDDHHmmss');
        return timestamp;
    }

    waitForElementToBeInvisible(locator) {
        browser.wait(EC.invisibilityOf(locator), 50000);
    }

    async waitLoadingImageIconToBeInvisible() {
        while (true) {
            try {
                await browser.wait(browser.ExpectedConditions.visibilityOf(await element(by.xpath(loadingImage))), 20000);
            } catch (error) {
                break;
            }
            await browser.wait(browser.ExpectedConditions.invisibilityOf(await element(by.xpath(loadingImage))), 40000);
        }
    }

    async waitLoadingRunImageIconToBeInvisible() {
        while (true) {
            try {
                await browser.wait(browser.ExpectedConditions.visibilityOf(await element(by.xpath(LoadingRunTxt))), 13000);
            } catch (error) {
                break;
            }
            await browser.wait(browser.ExpectedConditions.invisibilityOf(await element(by.xpath(LoadingRunTxt))), 40000);
        }
    }

    getTextFromElement(locator) {
        var textFromEle = element(by.xpath(locator)).getText();
        return textFromEle;
    }

    convertTolist(commaSeperatedValues) {
        var array = commaSeperatedValues.split(',');
        return array;
    }

    async waitTillLoading() {
        return browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 20000, 'Element is visible');
    }

    waitAndClick(locator) {
        this.waitForElementToBeClickable(locator);
        this.click(locator);
    }

    async waitAndClickJS(locator) {
        this.waitForElementToBeClickable(locator);
        this.clickJS(locator);
    }

    async waitForElements(time_in_milliseconds) {
        try {
            await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath("//invlxpath"))), time_in_milliseconds, 'Wait For Elements To Load');
        }
        catch (err) {
            console.log("Wait for " + time_in_milliseconds + " milliseconds")
        }
    }

}

export function findElement(locator_Type: string, locatorEle: string) {
    let eleLocator;
    browser.sleep(1000);
    try {
        switch (locator_Type) {
            case 'xpath': {
                const eleLocator1: ElementFinder = element(by.xpath(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'id': {
                const eleLocator1: ElementFinder = element(by.id(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'className': {
                const eleLocator1: ElementFinder = element(by.className(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'css': {
                const eleLocator1: ElementFinder = element(by.css(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'linkText': {
                const eleLocator1: ElementFinder = element(by.linkText(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'partialLinkText': {
                const eleLocator1: ElementFinder = element(by.partialLinkText(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
            case 'tagName': {
                const eleLocator1: ElementFinder = element(by.tagName(locatorEle));
                const isDisplayed = presenceOf(eleLocator1);
                browser.wait(isDisplayed, 30000);
                eleLocator = eleLocator1;
                break;
            }
        }
        browser.sleep(1000);
    } catch (e) {
        console.log(e);
    }
    return eleLocator;
}
function presenceOf(elementFinder: ElementFinder): Function {
    return elementFinder.isPresent.bind(elementFinder);
}
