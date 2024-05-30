/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const reportsTab = './/div[text()=" REPORTS "]//parent::div[@role="tab"]'
const createReportBtn = "Create";
const loadingPopUp = '//*[@src="assets/images/bds/icn_loader.gif"]';
const pastreports = '(//div[contains(text(),"PAST REPORTS")])[2]';
const closeicononpreviewform = '//past-reports-preview//span[contains(@class,"close-icon")]';
const previewbutton = '//mat-icon[contains(text(),"preview")]//parent::span//parent::button';
const Okbutton = "//button//span[text()='OK']";
const savebutton = "//button//span[text()=' SAVE REPORT']";
const notificationonsavereport = "//p[text()='The report you requested is being saved, and we’ll notify you when it’s ready. Please check the notification icon ']"
const downloadbutton = '//mat-icon[contains(text(),"download")]//parent::span//parent::button';
const correctiveaction = '//div[@class="all-lots"]//input[contains(@class,"mat-input-element")]';

browser.waitForAngularEnabled(true);
let jsonData;

library.parseJson('./JSON_data/UN-15363DynamicReportAt.json').then(function (data) {
  jsonData = data;
});
export class DynamicReport {
  async createReport() {
    library.logStep("Click On Create Report");
    let ele = await element(by.buttonText(createReportBtn));
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 25000);
    await library.clickJS(ele);
    await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))), 25000);
    await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(loadingPopUp))), 25000);
  }
  async clickOnReportsTab() {
    library.logStep("Click On Reports Tab");
    let ele = await element(by.xpath(reportsTab));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 11000);
    await ele.click();
    await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))), 25000);
    await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(loadingPopUp))), 25000);
  }
  async clickOnSaveButton() {
    library.logStep("Click On Save Report button");
    let SaveButton = await element(by.xpath(savebutton));
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(SaveButton), 20000, 'Failed:Save button is not clickable');
    await SaveButton.click();
    library.logStepWithScreenshot("Save Button is Displayed and Clicked", "Save Button is Displayed and Clicked");
    await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))), 25000);
  }
  async VerifyPopUpAfterSaving() {
    const Notificationonsavereport = await element(by.xpath(notificationonsavereport));
    const OKButton = await element(by.xpath(Okbutton));
    await browser.wait(browser.ExpectedConditions.visibilityOf(Notificationonsavereport), 10000, 'Faied:Notification is not visible');
    library.logStepWithScreenshot("Notification of save Report is displayed", "Notificationon of save report is displayed");
    await OKButton.click();
    library.logStepWithScreenshot("Ok button on popup is displayed and clicked", "Ok button on popup is displayed and clicked");;
  }
  async clickOnPastReportTab() {
    library.logStep("Click On Past Report Tab");
    const Pastreports = await element(by.xpath(pastreports));
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(Pastreports), 10000, 'Failed:Report tab is not visible');
    await Pastreports.click();
    library.logStepWithScreenshot('Past Reports Tab is displayed and Clicked', 'Past Reports Tab is displayed and Clicked');
    await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))), 25000);
    await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(loadingPopUp))), 35000);
  }
  async enterCorrectiveActions(correctiveactiontext) {
    library.logStep("Enter corrective action");
    const Correctiveaction = await element(by.xpath(correctiveaction));
    await browser.wait(browser.ExpectedConditions.visibilityOf(Correctiveaction), 20000, 'Failed:Corrective action field is not visible');
    await Correctiveaction.sendKeys(correctiveactiontext);
    library.logStepWithScreenshot("Corrective action is entered", "Corrective action is entered");
  }
  async clickonPastReportsPreviewbutton() {
    library.logStep("Click on Preview button");
    const Previewbutton = await element(by.xpath(previewbutton));
    await browser.wait(browser.ExpectedConditions.visibilityOf(Previewbutton), 20000, 'Failed:Preview button is not visible');
    await Previewbutton.click();
    library.logStepWithScreenshot("Preview button is Clicked", "Preview button is Clicked");
    await dashBoard.waitForElement();
  }
  async clickCloseIconOnPastReportsPreviewForm() {
    library.logStep("Click on close icon on past report preview form");
    const closeicononform = await element(by.xpath(closeicononpreviewform));
    await browser.wait(browser.ExpectedConditions.visibilityOf(closeicononform), 30000, 'Failed:Close icon is not visible');
    library.clickAction(closeicononform);
    library.logStepWithScreenshot("Close icon on Past Reports Preview form is displayed and clicked", "close icon on Past Reports Preview form is displayed and clicked");
  }
  async clickOnDownloadButton() {
    library.logStep("Click on Download button");
    const Downloadbutton = await element(by.xpath(downloadbutton));
    await browser.wait(browser.ExpectedConditions.visibilityOf(Downloadbutton), 20000, 'Failed:Download button is not visible');
    await Downloadbutton.click();
    library.logStepWithScreenshot("Download button is Clicked", "Download button is clicked");
    await dashBoard.waitForElement();
  }
}
