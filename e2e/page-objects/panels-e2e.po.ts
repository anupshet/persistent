/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, By, by, element } from 'protractor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Panels.json', (err, data1) => {
    if (err) { throw err; }
    const settings = JSON.parse(data1);
    jsonData = settings;
});

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const errorMsg = './/mat-error[contains(@role, "alert")]';
const save = './/button/span[contains(text(), "SAVE")]';
const cancel = './/button/span[contains(text(), "Cancel")]';
const deleteIcon = './/button[contains(@class, "spec_deleteButton")]';
const editThisPanel = './/span[text()="Edit this Panel"]';
const addAPanelLink = '//span[contains(text(),"ADD A PANEL")]';
const panelName_2 = '//input[contains(@class,"spec_panelName")]';
const itemSelection = '//*[text()="Select items to include"]//following::div[@class="panel-item-selection-container"]';
const NoItemSelectedIndicator = '//*[text()="No items selected"]';
const saveBtnDisabled = '//*[text()="SAVE"]//parent::button[@disabled="true"]';
const cancelBtnDisabled = '//*[text()="Cancel"]//parent::button[@disabled="true"]';
const saveDisabled = '//button[@disabled="true"]//span[contains(text(),"SAVE")]';
const panelItemsList = './/div[@class="cdk-drop-list panel-items-list"]';
const noItemsSelected = './/p[text()="No items selected"]';
const confirmDeleteButton = './/span[text()="CONFIRM DELETE"]/parent::button';
const closePanelIcon = '//*[contains(@class,"icn-close")]';
const panelLeftNav = '(//*[contains(@class,"sidenav-expansion-panel")])[1]';
const panelComponenet = '//*[@class="panels-component"]';

export class Panels {
    clickRemoveIcon(itemName) {
        let flag;
        return new Promise((resolve) => {
            dashboard.waitForPage();
            const removeItem = findElement(locatorType.XPATH, '//span[contains(text(),"' + itemName + '")]/ancestor::span/following-sibling::div/mat-icon');
            library.clickJS(removeItem);
            library.logStepWithScreenshot(itemName + ' Item Removed.', 'ItemRemoved');
            flag = true;
            resolve(flag);
        });

    }

    verifyItemsRemovedFromPanelItem(itemName) {
        let flag;
        return new Promise((resolve) => {
            dashboard.waitForPage();
            try {
                const removeItemDisp = element(by.xpath('//span[contains(text(),"' + itemName + '")]'));
                if (removeItemDisp.isDisplayed()) {
                    library.logFailStep(itemName + ' Removed Item is still displaing in panel Items.');
                    flag = false;
                    resolve(flag);
                } else {
                    library.logStepWithScreenshot(itemName + ' Removed Item is not displaing in panel Items.', 'ItemRemoved');
                    flag = true;
                    resolve(flag);
                }
            } catch (e) {
                library.logStepWithScreenshot(itemName + ' Removed Item is not displaing in panel Items.', 'ItemRemoved');
                flag = true;
                resolve(flag);
            }
        });
    }

    enterPanelName(panelNameEnter) {
        let flag;
        return new Promise((resolve) => {
            const panelNameEle = findElement(locatorType.XPATH, panelName_2);
            panelNameEle.clear();
            panelNameEle.sendKeys(panelNameEnter);
            library.logStepWithScreenshot(panelNameEnter + 'Panel Name Entered.', 'PanelNameEntered');
            flag = true;
            resolve(flag);
        });
    }

    rearrangePanelItems(fromElementNumber, toElementNumber) {
        let flag;
        return new Promise((resolve) => {
            try {
                const elem = findElement
                    (locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + fromElementNumber + ']');
                const target = findElement
                    (locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + toElementNumber + ']');
                browser.actions().dragAndDrop(elem, target).mouseUp().perform();
                library.logStepWithScreenshot(fromElementNumber + '  item moved to ' + toElementNumber, 'rearrange item');
                flag = true;
                resolve(flag);
            } catch (e) {
                console.log(e);
                library.logFailStep(fromElementNumber + '  item not moved to ' + toElementNumber);
                flag = false;
                resolve(flag);
            }
        });
    }

    verifyItemsRearranged(itemName, ItemIndex) {
        let flag;
        return new Promise((resolve) => {
            const arrangedItem = findElement(locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + ItemIndex + ']/span/span[contains(text(),"' + itemName + '")]');
            if (arrangedItem.isDisplayed()) {
                library.logStepWithScreenshot(itemName + ' Item moved to ' + ItemIndex + ' successfully', 'rearrange item');
                flag = true;
                resolve(flag);
            } else {
                library.logFailStep(itemName + ' Item is not moved to ' + ItemIndex + ' successfully');
                flag = false;
                resolve(flag);
            }
        });
    }

    verifyInfoIconInLeftNav(analyte) {
        let result = false;
        let actualName, expectedName;
        return new Promise((resolve) => {
            dashboard.waitForElement();
            const infoIconEle = element(By.xpath('//mat-nav-list//div[contains(text(),"' + analyte + '")]//span[contains(@class, "ic-info")]'));
            const toolTip = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]'));
            const analyteNameEle = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]/dl/dt[contains(text(), "Analyte")]/following-sibling::dd[1]'));
            infoIconEle.isDisplayed().then(function () {
                library.scrollToElement(infoIconEle);
                library.clickJS(infoIconEle);
                dashboard.waitForPage();
                toolTip.isDisplayed().then(function () {
                    analyteNameEle.getText().then(function (txt) {
                        actualName = txt.trim();
                        expectedName = analyte.trim();
                        console.log('After trim Expected: ' + actualName + ' Actual: ' + expectedName);
                        if (expectedName === actualName) {
                            console.log('Expected: ' + expectedName + ' Actual: ' + actualName);
                            library.logStepWithScreenshot('Analyte name is displayed on info icon', 'AnalyteNameShown');
                            console.log('Analyte name is displayed on info icon');
                            result = true;
                            resolve(result);
                        }
                    });
                }).catch(function () {
                    result = false;
                    console.log('Tool Tip not displayed');
                    library.logFailStep('ToolTipNotDisplayed');
                    resolve(result);
                });
            }).catch(function () {
                result = false;
                console.log('Info Icon not displayed');
                library.logFailStep('InfoIconnotDisplayed');
                resolve(result);
            });
        });
    }

    verifyInfoIconInSelectedItemList(analyte) {
        let result = false;
        let actualName, expectedName;
        return new Promise((resolve) => {
            dashboard.waitForElement();
            const infoIconEle = element(By.xpath('.//unext-panel-item-list//div//span[contains(text(),"' + analyte + '")]/following-sibling::unext-node-info//span[contains(@class, "spec_icon")]'));
            const toolTip = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]'));
            const analyteNameEle = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]/dl/dt[contains(text(), "Analyte")]/following-sibling::dd[1]'));
            infoIconEle.isDisplayed().then(function () {
                library.scrollToElement(infoIconEle);
                library.clickJS(infoIconEle);
                dashboard.waitForPage();
                toolTip.isDisplayed().then(function () {
                    analyteNameEle.getText().then(function (txt) {
                        actualName = txt.trim();
                        expectedName = analyte.trim();
                        console.log('After trim Expected: ' + actualName + ' Actual: ' + expectedName);
                        if (expectedName === actualName) {
                            console.log('Expected: ' + expectedName + ' Actual: ' + actualName);
                            library.logStepWithScreenshot('Analyte name is displayed on info icon', 'AnalyteNameDisplayed');
                            console.log('Analyte name is displayed on info icon');
                            result = true;
                            resolve(result);
                        }
                    });
                }).catch(function () {
                    result = false;
                    console.log('Tool Tip not displayed');
                    library.logFailStep('ToolTipNotDisplayed');
                    resolve(result);
                });
            }).catch(function () {
                result = false;
                console.log('Info Icon not displayed');
                library.logFailStep('InfoIconnotDisplayed');
                resolve(result);
            });
        });
    }

    verifyErrorMessageDisplayed(errormsg) {
        let result = false;
        let actualMsg, expectedMsg;
        return new Promise((resolve) => {
            const errorEle = element(By.xpath(errorMsg));
            errorEle.getText().then(function (txt) {
                actualMsg = txt.trim();
                expectedMsg = errormsg.trim();
                if (actualMsg === expectedMsg) {
                    console.log('Error message displayed: ' + actualMsg);
                    library.logStepWithScreenshot('Error message displayed', 'Error message displayed');
                    result = true;
                    resolve(result);
                } else {
                    console.log('Error message is different: ' + actualMsg);
                    result = false;
                    resolve(result);
                }
            }).catch(function () {
                console.log('Error message not displayed');
                result = false;
                resolve(result);
            });
        });
    }


    clickSaveButton() {
        let result = false;
        return new Promise((resolve) => {
            const saveBtn = findElement(locatorType.XPATH, save);
            saveBtn.isDisplayed().then(function () {
                library.clickJS(saveBtn);
                console.log('Save Button clicked');
                library.logStep('Save Button clicked');
                result = true;
                resolve(result);
            });
        });
    }
    verifySaveButtonDisabled() {
        let result = false;
        return new Promise((resolve) => {
            const saveBtn = findElement(locatorType.XPATH, saveDisabled);
            if (saveBtn.isDisplayed()) {
                console.log('Save Button Disabled');
                library.logStepWithScreenshot('Save Button disabled', 'disabledSave');
                result = true;
                resolve(result);
            } else {
                console.log('Save Button Enabled');
                library.logFailStep('Save Button Enabled');
                result = false;
                resolve(result);
            }

        });
    }

    clickCancelButton() {
        let result = false;
        return new Promise((resolve) => {
            const cancelBtn = element(By.xpath(cancel));
            cancelBtn.isDisplayed().then(function () {
                library.click(cancelBtn);
                console.log('Cancel Button clicked');
                library.logStep('Cancel Button clicked');
                result = true;
                resolve(result);
            });
        });
    }

    clickDeleteButton() {
        let result = false;
        return new Promise((resolve) => {
            const deleteBtn = element(By.xpath(deleteIcon));
            deleteBtn.isDisplayed().then(function () {
                library.click(deleteBtn);
                console.log('Delete Button clicked');
                library.logStep('Delete Button clicked');
                result = true;
                resolve(result);
            }).catch(function () {
                console.log('Delete Button not displayed');
                library.logStep('Delete Button not displayed');
                result = false;
                resolve(result);
            });
        });
    }

    verifyPanelCreated(panelname) {
        let result = false;
        return new Promise(async (resolve) => {
            browser.sleep(3000);
            const createdPanel = element(by.xpath('//mat-nav-list//div[contains(text(),"' + panelname + '")]'));
            createdPanel.isDisplayed().then(function () {
                result = true;
                library.logStep('Panel is created ' + panelname);
                console.log('Panel is created ' + panelname);
                resolve(result);
            }).catch(function () {
                result = false;
                library.logStep('Panel not created ' + panelname);
                console.log('Panel not created ' + panelname);
                resolve(result);
            });
        });
    }

    clickEditThisPanelLink() {
        let status = false;
        return new Promise((resolve) => {
            dashboard.waitForPage();
            const editThisPanelLink = findElement(locatorType.XPATH, editThisPanel);
            editThisPanelLink.isDisplayed().then(function () {
                editThisPanelLink.click();
                library.logStep('Edit This Panel Link clicked');
                status = true;
                resolve(status);
            });
        });
    }

    verifyArchivedAnalyteDisplayed(analyteName) {
        let status = false;
        return new Promise((resolve) => {
            const archivedAnalyte = element(by.xpath('.//span[contains(text(),"' + analyteName + '")]/ancestor::mat-checkbox[contains(@class,"disabled")]'));
            archivedAnalyte.isDisplayed().then(function () {
                library.logStep('Archived Analyte is Displayed');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logStep('Archived Analyte is not Displayed');
                status = false;
                resolve(status);
            });
        });
    }

    verifyExpandedDeptInstCont(itemName) {
        let status = false;
        return new Promise((resolve) => {
            dashboard.waitForPage();
            const expandedItem = element(by.xpath
                ('.//mat-tree-node[@aria-expanded="true"]/button[contains(@aria-label,"' + itemName + '")]'));
            expandedItem.isDisplayed().then(function () {
                library.logStep(itemName + ' is expanded');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logFailStep(itemName + ' is not expanded');
                status = false;
                resolve(status);
            });
        });
    }

    verifyExpandedAnalyte(analyteName) {
        let status = false;
        return new Promise((resolve) => {
            dashboard.waitForPage();
            const expandedItem = element(by.xpath('.//mat-tree-node[@aria-expanded="true"]//span[contains(text(),"' + analyteName + '")]'));
            expandedItem.isDisplayed().then(function () {
                library.logStep(analyteName + ' Analyte is expanded');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logFailStep(analyteName + ' Analyte is not expanded');
                status = false;
                resolve(status);
            });
        });
    }

    verifyAddPanelsInLeftNavigation() {
        return new Promise((resolve) => {
            const addAPanel = element(by.xpath(addAPanelLink));
            addAPanel.isDisplayed().then(function () {
                console.log('Add A Panel Button is displayed in Left navigation panel');
                library.logStep('Add A Panel Button is displayed in Left navigation panel');
                library.logStepWithScreenshot('Add A Panel Button is displayed', 'BtnDisplayed');
                resolve(true);
            }).catch(function () {
                console.log('Failed : Add A Panel Button is not displayed in Left navigation panel');
                library.logStep('Failed : Add A Panel Button is not displayed in Left navigation panel');
                library.logStepWithScreenshot('Failed : Add A Panel Button is not displayed', 'BtnNotDisplayed');
                resolve(false);
            });
        });
    }

    verifyAddPanelPageUI() {
        return new Promise((resolve) => {
            const panelNameTb = element(by.xpath(panelName_2));
            panelNameTb.isDisplayed().then(function () {
                console.log('Panel Name textbox displayed');
                library.logStep('Panel Name textbox is displayed');
                library.logStepWithScreenshot('Panel Name textbox is displayed', 'PanelNameDisplayed');
                const itemSelectionOptions = element(by.xpath(itemSelection));
                itemSelectionOptions.isDisplayed().then(function () {
                    console.log('Item Selection Option is displayed');
                    library.logStep('Item Selection Option is displayed');
                    library.logStepWithScreenshot('Item Selection Option is displayed', 'itemSelectionDisplayed');
                    const NoItemSelected = element(by.xpath(NoItemSelectedIndicator));
                    NoItemSelected.isDisplayed().then(function () {
                        console.log('No Item Selected Indicator is displayed');
                        library.logStep('No Item Selected Indicator is displayed');
                        library.logStepWithScreenshot('No Item Selected Indicator is displayed', 'NoItemSelectedIndicatorDisplayed');
                        const saveBtnDb = element(by.xpath(saveBtnDisabled));
                        saveBtnDb.isDisplayed().then(function () {
                            console.log('By default Disabled save button is displayed');
                            library.logStep('By default Disabled save button is displayed');
                            library.logStepWithScreenshot('By default Disabled save button is displayed', 'saveBtnDbDisplayed');
                            const cancelBtnDb = element(by.xpath(cancelBtnDisabled));
                            cancelBtnDb.isDisplayed().then(function () {
                                console.log('By default Disabled cancel button is displayed');
                                library.logStep('By default Disabled cancel button is displayed');
                                library.logStepWithScreenshot('By default Disabled cancel button is displayed', 'BtnDisplayed');
                                resolve(true);

                            }).catch(function () {
                                console.log('Failed : By default Disabled cancel button is not displayed');
                                library.logFailStep('Failed : By default Disabled cancel button is not displayed');
                                library.logStepWithScreenshot
                                    ('Failed : By default Disabled cancel button is not displayed', 'BtnDisplayed');
                                resolve(false);
                            });
                        }).catch(function () {
                            console.log('Failed : By default Disabled save button is displayed');
                            library.logFailStep('Failed : By default Disabled save button is displayed');
                            library.logStepWithScreenshot('Failed : By default Disabled save button is displayed', 'NotDisplayed');
                            resolve(false);
                        });
                    }).catch(function () {
                        console.log('Failed : No Item Selected Indicator is not displayed');
                        library.logFailStep('Failed : No Item Selected Indicator is not displayed');
                        library.logStepWithScreenshot('Failed : No Item Selected Indicator is not displayed', 'NotDisplayed');
                        resolve(false);
                    });
                }).catch(function () {
                    console.log('Failed : Item Selection Option is not displayed');
                    library.logFailStep('Failed : Item Selection Option is not displayed');
                    library.logStepWithScreenshot('Failed : Item Selection Option is displayed', 'itemSelectionNotDisplayed');
                    resolve(false);
                });
            }).catch(function () {
                console.log('Failed : Panel Name textbox is displayed');
                library.logFailStep('Failed : Panel Name textbox is displayed');
                library.logStepWithScreenshot('Failed : Panel Name textbox is displayed', 'PanelNameNotDisplayed');
                resolve(false);
            });
        });
    }

    clickOnAddPanel() {
        return new Promise((resolve) => {
            const addAPanel = findElement(locatorType.XPATH, addAPanelLink);
            addAPanel.isDisplayed().then(function () {
                library.clickJS(addAPanel);
                console.log('Clicked on Add panel link');
                library.logStep('Clicked on Add panel link');
                library.logStepWithScreenshot('Clicked on Add panel link', 'addAPanelLinkClicked');
                resolve(true);
            }).catch(function () {
                console.log('Failed : Add A Panel Button is not displayed in Left navigation panel');
                library.logFailStep('Failed : Add A Panel Button is not displayed in Left navigation panel');
                library.logStepWithScreenshot('Failed : Add A Panel Button is not displayed', 'BtnNotDisplayed');
                resolve(false);
            });
        });
    }

    selectItems(elementName, expand, selectElement) {
        return new Promise((resolve) => {
            if (expand === 'true') {
                const isAnalyteExpanded = '//span[contains(text(),"' + elementName + '")]//preceding::button[1]//parent::mat-tree-node';
                browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath(isAnalyteExpanded)))), 10000, 'Expand button is not clickable');
                const isAlreadyExpanded = element(by.xpath(isAnalyteExpanded));
                isAlreadyExpanded.getAttribute('aria-expanded').then(function (value) {
                    if (value === 'false') {
                        const clickOnExpand = element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::button[1]'));
                        library.clickJS(clickOnExpand);
                        console.log('Clicked on Expand for : ', elementName);
                        library.logStep('Clicked on Expand for : ' + elementName);
                        resolve(true);
                    }
                });
            }
            if (selectElement === 'true') {
                browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::input[1]')))), 10000, 'Select checkbox is not clickable');
                const selectAnalyte = element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::input[1]'));
                selectAnalyte.isDisplayed().then(function (status) {
                    library.clickJS(selectAnalyte);
                    browser.wait
                        // tslint:disable-next-line: max-line-length
                        (browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');
                    console.log('Element is selected 1 : ', elementName);
                    library.logStep('Element is selected : ' + elementName);
                    resolve(true);
                }).catch(function () {
                    console.log('Failed : Element is not displayed : ', elementName);
                    library.logStep('Failed : Element is not displayed : ' + elementName);
                    resolve(true);
                });
            }

        });
    }

    deSelectItems(elementName, expand, deSelectElement) {
        return new Promise((resolve) => {
            const isAnalyteExpanded = '//span[contains(text(),"' + elementName + '")]//preceding::button[1]//parent::mat-tree-node';
            if (expand === 'true') {
                browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath(isAnalyteExpanded)))), 10000, 'Expand button is not clickable');
                const isAlreadyExpanded = element(by.xpath(isAnalyteExpanded));
                isAlreadyExpanded.getAttribute('aria-expanded').then(function (value) {
                    if (value === 'false') {
                        const clickOnExpand = element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::button[1]'));
                        library.clickJS(clickOnExpand);
                        console.log('Clicked on Expand for : ', elementName);
                        library.logStep('Clicked on Expand for : ' + elementName);
                        resolve(true);
                    }
                });
            }
            if (deSelectElement === 'true') {
                browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::input[1]')))), 10000, 'Select checkbox is not clickable');
                const selectAnalyte = element(by.xpath('//span[contains(text(),"' + elementName + '")]//preceding::input[1]'));
                selectAnalyte.isDisplayed().then(function (status) {
                    library.clickJS(selectAnalyte);
                    browser.wait
                        (browser.ExpectedConditions.invisibilityOf
                        ((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');

                    console.log('Element is de selected 2: ', elementName);
                    library.logStep('Element is selected : ' + elementName);
                    resolve(true);
                }).catch(function () {
                    console.log('Failed : Element is not displayed : ', elementName);
                    library.logStep('Failed : Element is not displayed : ' + elementName);
                    resolve(true);
                });
            }

        });
    }

    VerifyItemSelected(elementName) {
        return new Promise((resolve) => {
            const verifyItemIsSelected = element(by.xpath('(//span[contains(text(),"' + elementName + '")]//preceding::input[1])[1]'));
            verifyItemIsSelected.getAttribute('aria-checked').then(function (value) {
                const verifyItemInPanelItems =
                    '//*[@class="cdk-drag panel-item-box ng-star-inserted"]//span[contains(text(),"' + elementName + '")]';
                if (value === 'false') {
                    element(by.xpath(verifyItemInPanelItems)).isDisplayed().then(function () {
                        console.log('for not Element : ', elementName, ' Is selected');
                        library.logStep('Element : ' + elementName + ' Is selected');
                        resolve(false);
                    }).catch(function () {
                        console.log('Failed : Element - ', elementName, ' Is not selected');
                        library.logStep('Failed : Element 1 - ' + elementName + ' Is not selected');
                        resolve(true);
                    });
                } else {
                    browser.sleep(2000);
                    browser.wait
                    (browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');
                    element(by.xpath(verifyItemInPanelItems)).getTagName().then(function () {
                        console.log('Element : ', elementName, ' Is selected');
                        library.logStep('Element : ' + elementName + ' Is selected');
                        resolve(true);
                    }).catch(function () {
                        console.log('Failed : Element 2 - ', elementName, ' Is not selected');
                        library.logStep('Failed : Element - ' + elementName + ' Is not selected');
                        resolve(false);
                    });
                }
            });
        });
    }

    verifyEditPanelPageUI() {
        return new Promise((resolve) => {
            const panelNameTb = element(by.xpath(panelName_2));
            panelNameTb.isDisplayed().then(function () {
                console.log('Panel Name textbox displayed');
                library.logStep('Panel Name textbox is displayed');
                library.logStepWithScreenshot('Panel Name textbox is displayed', 'PanelNameDisplayed');
                const itemSelectionOptions = element(by.xpath(itemSelection));
                itemSelectionOptions.isDisplayed().then(function () {
                    console.log('Item Selection Option is displayed');
                    library.logStep('Item Selection Option is displayed');
                    library.logStepWithScreenshot('Item Selection Option is displayed', 'itemSelectionDisplayed');
                    const ItemSelected = element(by.xpath(panelItemsList));
                    ItemSelected.isDisplayed().then(function () {
                        console.log('Selected Items are displayed');
                        library.logStep('Selected Items are displayed');
                        library.logStepWithScreenshot('Selected Items are displayed', 'SelectedItemsDisplayed');
                        const saveBtnDb = element(by.xpath(saveBtnDisabled));
                        saveBtnDb.isDisplayed().then(function () {
                            console.log('By default Disabled save button is displayed');
                            library.logStep('By default Disabled save button is displayed');
                            library.logStepWithScreenshot('By default Disabled save button is displayed', 'saveBtnDbDisplayed');
                            const cancelBtnDb = element(by.xpath(cancelBtnDisabled));
                            cancelBtnDb.isDisplayed().then(function () {
                                console.log('By default Disabled cancel button is displayed');
                                library.logStep('By default Disabled cancel button is displayed');
                                library.logStepWithScreenshot('By default Disabled cancel button is displayed', 'BtnDisplayed');
                                const deletebtn = element(by.xpath(deleteIcon));
                                deletebtn.isDisplayed().then(function () {
                                    console.log('Delete button is displayed');
                                    library.logStep('Delete button is displayed');
                                    library.logStepWithScreenshot('Delete button is displayed', 'DeleteDisplayed');
                                    resolve(true);
                                }).catch(function () {
                                    console.log('Failed : Delete button is not displayed');
                                    library.logFailStep('Failed : Delete button is not displayed');
                                    library.logStepWithScreenshot('Failed : Delete button is not displayed', 'DeleteNotDisplayed');
                                    resolve(false);
                                });
                            }).catch(function () {
                                console.log('Failed : By default Disabled cancel button is not displayed');
                                library.logFailStep('Failed : By default Disabled cancel button is not displayed');
                                library.logStepWithScreenshot
                                    ('Failed : By default Disabled cancel button is not displayed', 'BtnDisplayed');
                                resolve(false);
                            });
                        }).catch(function () {
                            console.log('Failed : By default Disabled save button is displayed');
                            library.logFailStep('Failed : By default Disabled save button is displayed');
                            library.logStepWithScreenshot('Failed : By default Disabled save button is displayed', 'NotDisplayed');
                            resolve(false);
                        });
                    }).catch(function () {
                        console.log('Failed : Selected items are not displayed');
                        library.logFailStep('Failed : Selected items are not displayed');
                        library.logStepWithScreenshot('Failed : Selected items are not displayed', 'NotDisplayed');
                        resolve(false);
                    });
                }).catch(function () {
                    console.log('Failed : Item Selection Option is not displayed');
                    library.logFailStep('Failed : Item Selection Option is not displayed');
                    library.logStepWithScreenshot('Failed : Item Selection Option is displayed', 'itemSelectionNotDisplayed');
                    resolve(false);
                });
            }).catch(function () {
                console.log('Failed : Panel Name textbox is displayed');
                library.logFailStep('Failed : Panel Name textbox is displayed');
                library.logStepWithScreenshot('Failed : Panel Name textbox is displayed', 'PanelNameNotDisplayed');
                resolve(false);
            });
        });
    }

    verifyNoItemsSelectedDisplayed() {
        let status = false;
        return new Promise((resolve) => {
            const errorText = element(by.xpath(noItemsSelected));
            errorText.isDisplayed().then(function () {
                library.logStep('No Items selected error is Displayed');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logFailStep('No Items selected error is not Displayed');
                status = false;
                resolve(status);
            });
        });
    }

    verifySaveDisabled() {
        let status = false;
        return new Promise((resolve) => {
            const saveButtonDisabled = element(by.xpath(saveDisabled));
            saveButtonDisabled.isDisplayed().then(function () {
                library.logStep('Save Button is disabled');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logFailStep('Save Button is not Disabled');
                status = false;
                resolve(status);
            });
        });
    }

    verifyEditPanelLinkDisplayed() {
        let status = false;
        return new Promise((resolve) => {
            const editThisPanelLink = element(editThisPanel);
            editThisPanelLink.isDisplayed().then(function () {
                library.logStep('Edit Panel Link is Displayed');
                status = true;
                resolve(status);
            }).catch(function () {
                library.logFailStep('Edit Panel Link is not Displayed');
                status = false;
                resolve(status);
            });
        });
    }

    clickConfirmDeleteButton() {
        let status = false;
        return new Promise((resolve) => {
            const confirmDeleteBtn = element(by.xpath(confirmDeleteButton));
            confirmDeleteBtn.isDisplayed().then(function () {
                confirmDeleteBtn.click();
                status = true;
                library.logStep('Confirm Delete Button clicked');
                resolve(status);
            }).catch(function () {
                library.logFailStep('Confirm Delete Button is not visible');
                resolve(status);
            });
        });
    }

    clickTooltipLeftNavigation(analyte) {
        let status = false;
        return new Promise((resolve) => {
            dashboard.waitForScroll();
            const tooltip = element(by.xpath('(.//mat-nav-list//div[@class="primary-dispaly-text"][contains(text(),"' + analyte + '")]//br-info-tooltip)[1]'));
            tooltip.isDisplayed().then(function () {
                library.scrollToElement(tooltip);
                library.clickJS(tooltip);
                status = true;
                library.logStepWithScreenshot('Tool tip icon clickedfor analyte' + analyte, 'tooltipClicked');
                resolve(status);
            });
        });
    }

    clickOutside(analyte) {
        let status = false;
        return new Promise((resolve) => {
            const infoIconEle = element(By.xpath('//mat-nav-list//div[contains(text(),"' + analyte + '")]//span[contains(@class, "ic-info")]'));
            infoIconEle.isDisplayed().then(function () {
                library.clickJS(infoIconEle);
                status = true;
                library.logStep('Clicked outside');
                resolve(status);
            });
        });
    }

    clickOutsideSelectedItemsList(analyte) {
        let status = false;
        return new Promise((resolve) => {
            const infoIconEle = element(By.xpath('.//unext-panel-item-list//div//span[contains(text(),"' + analyte + '")]/following-sibling::unext-node-info//span[contains(@class, "spec_icon")]'));
            infoIconEle.isDisplayed().then(function () {
                library.clickJS(infoIconEle);
                status = true;
                library.logStep('Clicked outside');
                resolve(status);
            });
        });
    }

    /* verifyArchiveAnalytesPositionedBelow() {
        return new Promise((resolve) => {
            browser.sleep(8000);
            element(by.xpath(archivePositionInPanelItems)).isDisplayed().then(function () {
                console.log('Archive analytes are displayed below unarchived analytes');
                library.logStep('Archive analytes are displayed below unarchived analytes');
                resolve(true);
            }).catch(function () {
                console.log('Failed : Archive analytes are not displayed below unarchived analytes');
                library.logStep('Failed : Archive analytes are not displayed below unarchived analytesd');
                resolve(false);
            });
        });
    } */

    verifyOrderOfArchivePanelItems() {
        const originalList: Array<string> = [];
        const tempList: Array<string> = [];
        let sortedTempList = [];
        let count = 0;
        let i = 0;
        return new Promise((resolve) => {
            const ele = element.all(by.xpath('//*[@class=\'archived\']'));
            ele.each(function (eachElement) {
                // browser.wait(browser.ExpectedConditions.visibilityOf(eachElement), 10000, 'Failed : Department List is not visible');
                browser.executeScript('arguments[0].scrollIntoView(true);', eachElement);
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
                    library.logStepWithScreenshot('Archive list is Alphabetically sorted', 'Archive list is Alphabetically sorted');
                    console.log('Archive list is alphabetically sorted');
                    resolve(true);
                } else {
                    library.logFailStep('Archive Left navigation list is not sorted');
                    console.log('Archive list is not alphabetically sorted');
                    resolve(false);
                }
            });
        });
    }

    verifyCloseButtonIsDisplayed(){
        return new Promise((resolve) => {
            element(by.xpath(closePanelIcon)).isDisplayed().then(function () {
                console.log('Close Panel Icon is displayed on edit panel UI');
                library.logStepWithScreenshot('Close Panel Icon is displayed on edit panel UI','Icon Displayed');
                resolve(true);
            }).catch(function () {
                console.log('Failed : Close Panel Icon is not displayed on edit panel UI');
                library.logFailStep('Failed : Close Panel Icon is not displayed on edit panel UI');
                library.logStepWithScreenshot('Failed : Close Panel Icon is not displayed on edit panel UI','Icon Not Displayed');
                resolve(false);
            });
        });
    }

    clickOnCloseButton() {
        let flag;
        return new Promise((resolve) => {
            const closeIcon = findElement(locatorType.XPATH, closePanelIcon);
            library.clickJS(closeIcon);
            library.logStepWithScreenshot('Clicked on CLose Button','Clicked');
            resolve(true);
        });
    }

    verifyPanelsMDEDashboardPageDisplayed(){
        return new Promise((resolve) => {
            const panelsMDEUI = new Map<string, string>();
            panelsMDEUI.set('Panel Left Navigation', panelLeftNav);
            panelsMDEUI.set('Panel Dashboard Component', panelComponenet);
            panelsMDEUI.forEach(function (key, value) {
                const eleUI = element(by.xpath(key));
                if (eleUI.isDisplayed()) {
                  library.logStep(value + ' is displayed.');
                  resolve(true);
                } else {
                  library.logFailStep(value + ' is not displayed.');
                  resolve(false);
                }
            });
        });
    }
}
