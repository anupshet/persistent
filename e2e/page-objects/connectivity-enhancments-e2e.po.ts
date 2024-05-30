/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { BrowserLibrary } from '../utils/browserUtil';
import { browser, by, element, protractor } from 'protractor';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Connectivity.json', (err, data) => {
    if (err) { throw err; }
    const connectivityData = JSON.parse(data);
    jsonData = connectivityData;
});

const configurationTab = "//*[text()='CONFIGURATIONS']";
const createEdgeDeviceCongLink = "//*[text()='create edge device configuration']";
const edgeTransformersList = "//*[contains(@class,'edge-list')]//*[@class='list ng-star-inserted']";
const transformerList = "//*[contains(@class,'transformers-list')]//*[@class='list ng-star-inserted']";
const edgeDeviceConfgEditBtn = "(//*[contains(@class,'edge-list')]//*[@class='list ng-star-inserted'][1]//following::span[contains(text(),'Edit')])[1]";
const transformerEditBtn = "(//*[contains(@class,'transformers-list')]//*[@class='list ng-star-inserted'][1]//following::span[contains(text(),'Edit')])[1]";
const edgDeleteBtn = "(//*[contains(@class,'edge-list')]//*[@class='list ng-star-inserted'][1]//following::button[contains(@class,'delete')])[1]";
const savebtn = "//*[contains(text(),'SAVE')]";
const cancelBtn = "//*[contains(text(),'CANCEL')]";
const instructionName = "//*[@id='spec_inst_rules_inst_name']";
const edgeBoxIdentifierDropdown = "//*[@id='edgeBoxIdentifier']";
const pointDataEntryRadioBtn = "//*[@id='spec_inst_rules_point_entry-input']/preceding::div[1]";
const summaryDataEntryRadioBtn = "//*[@id='spec_inst_rules_summary_entry-input']/preceding::div[1]";
const instrumentCode = "//*[@id='spec_inst_rules_inst_code']";
const staticInstrumentCode = "//*[@id='spec_inst_rules_static_inst_code']";
const productLotAndLevel = "//*[@id='spec_inst_rules_product_code']";
const testCode = "//*[@id='spec_inst_rules_test_code']";
const dateTimeFormat = "//*[@formcontrolname='dateTimeFormats']";
const dateOrTimeResulted = "//*[@placeholder='Date/Time Resulted']";
const timeResulted = "//*[@formcontrolname='timeResulted']";
const value = "//*[@id='spec_inst_rules_value']";
const decimalSeperatorRadioBtn = "//*[contains(@id,'decimal')]//child::div[@class='mat-radio-outer-circle']";
const commaSeperatorRadioBtn = "//*[contains(@id,'comma')]//child::div[@class='mat-radio-outer-circle']";
const configurationName = '//input[@placeholder="Configuration Name"]';

const library = new BrowserLibrary();


let browserName = '';
browser.getCapabilities().then(function (map) {
    browserName = map.get('browserName');
});

export class ConnectivityEnhancment {
    verifyAndClickOnConfigurationTab() {
        return new Promise((resolve) => {
            element(by.xpath(configurationTab)).isDisplayed().then(function () {
                library.clickJS(element(by.xpath(configurationTab)));
                library.logStepWithScreenshot("Clicked on Configuration tab", 'Clicked succesfully');
                console.log("Clicked on Configuration tab");
                resolve(true);
            });
        });
    }

    verifyConfigurationTabUI() {
        return new Promise((resolve) => {
            let count = 0;
            const pageUI = new Map<string, string>();
            pageUI.set(createEdgeDeviceCongLink, 'Create Edge Device Link');
            pageUI.set(edgeTransformersList, 'Edge Transformer List');
            pageUI.set(transformerList, 'transformer list');
            pageUI.set(edgeDeviceConfgEditBtn, 'Edge device confg edit button');
            pageUI.set(transformerEditBtn, 'Transformer Edit Button');
            pageUI.set(edgDeleteBtn, 'Edge Delete Button');
            pageUI.forEach(function (key, value) {
                const ele = element(by.xpath(value));
                ele.isDisplayed().then(function () {
                    console.log(key + ' is displayed');
                    library.logStep(key + ' is displayed');
                    count++;
                }).catch(function () {
                    library.logFailStep(key + ' is not displayed.');
                });
            });
            if (count === pageUI.size) {
                library.logStepWithScreenshot('Configuration tab UI is displayed properly', 'UIVerification');
                resolve(true);
            } else {
                library.logFailStep('Configuration tab UI is not displayed properly');
                resolve(false);
            }
        });
    }

    /*  readPDF() {
         return new Promise((resolve) => {
             let fileParser = new pdfParser();


             fileParser.on("pdfParser_dataError", errText=>
                 console.error(errText.parseError)
             );


             fileParser.on("pdfParser_dataReady", pdfData => {
                 console.log(pdfData.parseJson);
                 fs.writeFile("C:/Users/nitin_ghugare/Downloads/test.json", JSON.stringify(pdfData));
                 //done();
             });
             fileParser.loadPDF("C:/Users/nitin_ghugare/Downloads/Dimension EXL-81287822022.pdf");
         })
     } */

    verifyTransformerDisplayed(transformerName) {
        return new Promise((resolve) => {
            element(by.xpath("//div[contains(@class,'list ng-star')]//span[contains(text(),'"
                + transformerName + "')]")).isDisplayed().then(function () {
                    library.logStepWithScreenshot(transformerName + " - is displayed on configuration page", 'Element displayed');
                    console.log(transformerName + " - is displayed on configuration page");
                    resolve(true);
                }).catch(function () {
                    library.logFailStep("Failed  : " + transformerName + " - is not displayed on configuration page");
                    console.log("Failed  : " + transformerName + " - is not displayed on configuration page");
                    resolve(false);
                })
        });
    }

    verifyTransformerListIsSorted() {
        const edgeList = element.all(by.xpath('//*[contains(@class,"edge-list")]//div[contains(@class,"list")]/child::span'));
        const tranformerList = element.all(by.xpath('//*[contains(@class,"transformers-list")]//div[contains(@class,"list")]/child::span'));
        this.sortAndVerifyOrder(edgeList).then(function (sorted) {
            expect(sorted).toBe(true);
        });
        this.sortAndVerifyOrder(tranformerList).then(function (sorted) {
            expect(sorted).toBe(true);
        });
    }

    sortAndVerifyOrder(elements) {
        return new Promise((resolve) => {
            const originalList: Array<string> = [];
            const tempList: Array<string> = [];
            let sortedTempList = [];
            let count = 0;
            let i = 0;
            elements.each(function (eachElement) {
                eachElement.getText().then(function (text) {
                    text.trim();
                    originalList[i] = text.toUpperCase();
                    tempList[i] = text.toUpperCase();
                    i++;
                });
            }).then(function () {
                sortedTempList = tempList.sort();
                for (const j in sortedTempList) {
                    if (originalList[j] === sortedTempList[j]) {
                        count++;
                        library.logStep(originalList[i] + ' displayed.');
                    } else {
                        library.logStep(originalList[i] + ' not displayed.');
                    }
                }
                if (count === originalList.length) {
                    library.logStepWithScreenshot('Given list is Alphabetically sorted', 'list is Alphabetically sorted');
                    console.log('Given list is alphabetically sorted');
                    resolve(true);
                } else {
                    library.logFailStep('Given list is not sorted');
                    console.log('Given list is not alphabetically sorted');
                    resolve(false);
                }
            });
        });
    }

    clickOnConfigureButtonOfTransformer(transformerName) {
        return new Promise((resolve) => {
            element(by.xpath(configurationTab)).isDisplayed().then(function () {
                library.clickJS(element(by.xpath("//span[contains(text(),'" + transformerName + "')]//following-sibling::button[@value='configure']")));
                library.logStepWithScreenshot("Clicked on Configuration button of " + transformerName + "transformer", 'Clicked succesfully');
                console.log("Clicked on Configuration tab of " + transformerName + "transformer");
                resolve(true);
            });
        });
    }

    clickOnEditButtonOfTransformer(transformerName) {
        return new Promise((resolve) => {
            element(by.xpath(configurationTab)).isDisplayed().then(function () {
                library.clickJS(element(by.xpath("//span[contains(text(),'" + transformerName + "')]//following-sibling::button/span[contains(text(),'Edit')]")));
                library.logStepWithScreenshot("Clicked on Edit button of " + transformerName + "transformer", 'Clicked succesfully');
                console.log("Clicked on Edit button of " + transformerName + "transformer");
                resolve(true);
            });
        });
    }

    clickOnSaveBtn() {
        return new Promise((resolve) => {
            var saveEle = element(by.xpath(savebtn));
            saveEle.isDisplayed().then(function () {
                library.clickJS(saveEle);
                library.logStepWithScreenshot("Clicked on Save button", 'Clicked succesfully');
                console.log("Clicked on Save button");
                resolve(true);
            });
        });
    }

    clickOnCancelBtn() {
        return new Promise((resolve) => {
            var cancelEle = element(by.xpath(cancelBtn));
            cancelEle.isDisplayed().then(function () {
                library.clickJS(cancelEle);
                library.logStepWithScreenshot("Clicked on cancel button", 'Clicked succesfully');
                console.log("Clicked on cancel button");
                resolve(true);
            });
        });
    }

    verifySaveBtnIsDisbled() {
        return new Promise((resolve) => {
            element(by.xpath(savebtn)).isEnabled().then(function () {
                library.logStepWithScreenshot("Save button is enabled", "Save Button is enabled");
                console.log("Save button is enabled");
                resolve(false);
            }).catch(function () {
                library.logStepWithScreenshot("Save button is disabled", 'Button is disabled');
                console.log("Save button is disabled");
                resolve(true);
            })
        });
    }

    verifyEdgeDeviceConfigurationUI() {
        /**
         * Not Completed
         */
        return new Promise((resolve) => {
            let count = 0;
            const pageUI = new Map<string, string>();
            pageUI.set(createEdgeDeviceCongLink, 'Create Edge Device Link');
            pageUI.set(edgeTransformersList, 'Edge Transformer List');
            pageUI.set(transformerList, 'transformer list');
            pageUI.set(edgeDeviceConfgEditBtn, 'Edge device confg edit button');
            pageUI.set(transformerEditBtn, 'Transformer Edit Button');
            pageUI.set(edgDeleteBtn, 'Edge Delete Button');
            pageUI.forEach(function (key, value) {
                const ele = element(by.xpath(value));
                ele.isDisplayed().then(function () {
                    console.log(key + ' is displayed');
                    library.logStep(key + ' is displayed');
                    count++;
                }).catch(function () {
                    library.logFailStep(key + ' is not displayed.');
                });
            });
            if (count === pageUI.size) {
                library.logStepWithScreenshot('Configuration tab UI is displayed properly', 'UIVerification');
                resolve(true);
            } else {
                library.logFailStep('Configuration tab UI is not displayed properly');
                resolve(false);
            }
        });
    }

    createEditEdgeDeviceConfiguration(option, value) {
        return new Promise((resolve) => {
            let status = false;
            switch (option) {
                case 'Instruction Name': {
                    const ele = element(by.xpath(instructionName));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Edge Box Identifier': {
                    const ele = element(by.xpath(edgeBoxIdentifierDropdown));
                    ele.click();
                    element(by.xpath("//*[contains(@class,'transformPanelWrap')]//*[@class='mat-option-text' and contains(text(),'" + value + "')]"
                    )).click();
                    library.logStepWithScreenshot("Edge box identifier is updated to " + value, "Edge box identifier is updated");
                    console.log("Edge box identifier is updated to " + value);
                    status = true;
                    break;
                }
                case 'Type of data entry': {
                    if (value == "Point") {
                        element(by.xpath(pointDataEntryRadioBtn)).click();
                    } else {
                        element(by.xpath(summaryDataEntryRadioBtn)).click();
                    }
                    status = true;
                    break;
                }
                case 'Instrument Code': {
                    const ele = element(by.xpath(instrumentCode));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Static Instrument Code': {
                    const ele = element(by.xpath(staticInstrumentCode));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Static Instrument Code': {
                    const ele = element(by.xpath(staticInstrumentCode));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Product Lot and Level': {
                    const ele = element(by.xpath(productLotAndLevel));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Test Code': {
                    const ele = element(by.xpath(testCode));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Date time format': {
                    const ele = element(by.xpath(dateTimeFormat));
                    ele.click();
                    element(by.xpath("//*[contains(@class,'transformPanel mat-select-panel')]//*[@class='mat-option-text' and contains(text(),'" + value + "')]"
                    )).click();
                    library.logStepWithScreenshot("Date time format is updated to " + value, "Date time format is updated");
                    console.log("Date time format is updated to " + value);
                    status = true;
                    break;
                }
                case 'Date/Time resulted': {
                    const ele = element(by.xpath(dateOrTimeResulted));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Time resulted (optional)': {
                    const ele = element(by.xpath(timeResulted));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Captured date time': {
                    if (value == "Yes") {
                        element(by.xpath("//*[@id='spec_inst_rules_yes_button']//*[contains(@class,'mat-radio-input')]//preceding::div[1]")).click();
                    } else {
                        element(by.xpath("//*[@id='spec_inst_rules_no_button']//*[contains(@class,'mat-radio-input')]//preceding::div[1]")).click();
                    }
                    status = true;
                    break;
                }
                case 'Value': {
                    const ele = element(by.xpath(value));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
                case 'Separator': {
                    if (value == "Decimal") {
                        element(by.xpath(decimalSeperatorRadioBtn)).click();
                    } else {
                        element(by.xpath(commaSeperatorRadioBtn)).click();
                    }
                    status = true;
                    break;
                }
                case 'Separate qualitative & quantitative': {
                    if (value == "Yes") {
                        element(by.xpath("//*[@id='spec_inst_rules_yes']//*[contains(@class,'mat-radio-input')]//preceding::div[2]")).click();
                    } else {
                        element(by.xpath("//*[@id='spec_inst_rules_no']//*[contains(@class,'mat-radio-input')]//preceding::div[2]")).click();
                    }
                    status = true;
                    break;
                }
            }
            resolve(status);
        });
    }

    clearAndUpdateValueInTextBox(ele, value, option) {
        return new Promise((resolve) => {
            ele.clear();
            ele.sendKeys(value);
            library.logStepWithScreenshot(option + " is updated to " + value, option + " is updated");
            console.log(option + " is updated to " + value);
            resolve(true);
        });
    }

    updateTransformer(option, value) {
        return new Promise((resolve) => {
            let status = false;
            switch (option) {
                case 'Configuration Name': {
                    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(configurationName))), 120000, 'Failed : Element is not displayed');
                    const ele = element(by.xpath(configurationName));
                    this.clearAndUpdateValueInTextBox(ele, value, option);
                    status = true;
                    break;
                }
            }
            resolve(status);
        });
    }



}
