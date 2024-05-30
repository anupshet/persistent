/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import {
  browser,
  by,
  element,
  ElementFinder,
  protractor,
  WebElement,
} from "protractor";
import { BrowserLibrary, findElement, locatorType } from "../utils/browserUtil";

const until = protractor.ExpectedConditions;
const dataTable = "LoginComponent.DataTable";
const reports = "LoginComponent.Reports";
const spcRules = "LoginComponent.SpcRules";
const connectivity = "LoginComponent.ConnectivityMapping";
const labSetup = "LoginComponent.LabSetup";
const userManagement = "LoginComponent.UserManagement";
const lab = '(//div[@class="nav-bar-button"]//span)[2]';
const dashboardBack = './/h1[@class="page-title"][text() = "< Dashboard"]';
const dashBoardArrow = '//h1[contains(text(),"Dashboard")]';
const spcRulessetup = "LoginComponent.SetupSpcRules";
const spcRuleTabEle = './/a[@class = "spcrules-link"]';
const sumDataToggEleEnabled =
  './/mat-slide-toggle[@class="summary-toggle-slider mat-slide-toggle mat-accent mat-checked"]';
const summEle = './/div[@class = "summary-data-entry"]';
const userManagementCard = "LoginComponent.UserManagement";
const matTitle = "mat-card-title";
const navBar = "unext-nav-bar";
const pageTitle = "page-title";
const h1Title = "mat-display-1";
const expiringLots = "expiring-lots-panel-component ng-star-inserted";
const labSetupMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Lab Setup")]';
const userManagementMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"User Management")]';
const connectivityMappingMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Connectivity Mapping")]';
const dashboardMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Dashboard")]';
const releaseNoteMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Release Notes")]';
const termsOfUseMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Terms of Use, Service Agreement, and Privacy Policy")]';
const spcRuleMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"SPC Rules")]';
const helpCenter =
  '//div[@role="menu"]//div/button/span[contains(text(),"Help Center")]';
const gearIcon = "//unext-nav-bar-setting//mat-icon";
const accountManagementMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Account")]';
const bioRadUserManagementMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Bio")]';

const titleLogo = "header_logo_button";
const unityNext = "//span[text() =' Unity Next ']";
const labName = './/div[@class="breadcrumb-wrapper"]//h4';
const sideNavigation = "sideNav";
const quickReferenceGuideMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Quick Reference Guide")]';
const BioRadUserManagementMenu =
  '//div[@role="menu"]//div/button/span[contains(text(),"Bio-Rad User Management")]';
const LabSetupPannel =
  "//span[contains(text(),'Add a Department')]//ancestor::div[@class='ps-content']";

const agreeTermsCheckBox = "//span[contains(text(), 'You agree to the')]";
const agreeTermsButton = "//span[contains(text(), 'Agree & Continue')]";
const loadingAccountsMessage = "//div[contains(text(), 'Loading accounts...')]";
const locationRadioBtn = " //mat-radio-button[contains(., 'keyword')]";
const proceedBtn = "Proceed";
const loadingPopUp = '//*[@src="assets/images/bds/icn_loader.gif"]';
const sidebarOption = "//unext-nav-side-bar//div[contains(text(), 'keyword')]";
const reportsTab =
  "//unext-nav-secondary-nav-menu//div[contains(text(), 'REPORTS')]";
const createReportBtn = "Create";
const notificationCount = "notification-count";
const notificationEleWithCount =
  "//unext-notification//span[contains(text(), 'keyword')]";
const reportPopUpBtn = "OK";
const notification = "//span[contains(@class, 'report-notification')]/p[2]";
const report = "//unext-preview-report";
const correctiveActionsInput =
  "//input[contains(@placeholder, 'Corrective actions')]";
const saveReportBtn = "Save";
const expandReportsBtn = "//mat-panel-description//button";
const savedReports = "//a/time";
const clearNotification = "spec_dismiss_notification";
const clearAllNotifications = "Clear";
const reportTypeDropDown = "//mat-select[@formcontrolname='reports']";
const reportTypeDropDownOption = "//mat-option[contains(., 'keyword')]";
const sendToPeerGroupBtn = "Send To Peer Group";
const startNewLotBtn = "//span[contains(text(), '<controlLot>')]/../..//button";
const startNewLotBtnText = "START NEW LOT";
const dataInputField =
  "//span[contains(text(), '<controlLot>')]/../..//input[@id='level-<level>']";
const selectLotDropDown = "//span[contains(text(), 'Select Lot')]";
const selectLotDropDownOption = "//mat-option[contains(span, '<lot>')]";
const showOptionsBtn =
  "//span[contains(text(),'<controlLot>')]/../..//span[@mattooltip='Show options']";
const correctiveActionDropDown =
  "//span[contains(text(),'<controlLot>')]/../..//mat-select";
const commentField = "//span[contains(text(),'<controlLot>')]/../..//textarea";
const correctiveActionDropDownOption =
  "//mat-option[contains(span,'<correctiveAction>')]";
const btnEditInstrument = "Edit this Instrument";
const btnEditControl = "Edit this Control";
const btnEditAnalyte = "Edit this analyte";
const archivedItemsToggle = "//input[@name='archivedItems']";

//----------------------------------
const locationTab = '//div[@role="tab"]/div[text()="LOCATIONS"]';
//const searchCategory='//label[@id="mat-form-field-label-1"]';
const searchCategory = '//mat-select[@id = "mat-select-1"]';
const searchInp = './/input[@id= "accounts-field"]';
const AccountName = '//span[text()="Account Name "]';
const searchBtn = '//span[text() = "Search"]';
const dropdownCategory =
  './/mat-select[@role="listbox"]/following-sibling::span/label/mat-label[text()="Category"]';
const benchAndSupervisorReviewCard = '//unext-qc-review-result';

const Department = "//mat-nav-list[contains(., '<text>')]";
const Instrument = "//mat-nav-list[contains(., '<text>')]";
const Control = "//mat-nav-list[contains(., '<text>')]";
const Analyte = "//div[contains(text(), '<text>')]";


const EC = browser.ExpectedConditions;
const fs = require("fs");
const library = new BrowserLibrary();
let jsonData;

fs.readFile("./JSON_data/Dashboard.json", (err, data) => {
  if (err) {
    throw err;
  }
  const dashboardData = JSON.parse(data);
  jsonData = dashboardData;
});

export class Dashboard {

 
  SelectDeptToAnalyte(departmnet, instrument, control, analyte) {
    return new Promise((resolve) => {
      console.log("json analyte="+analyte);
      let D = element(by.xpath(Department.replace("<text>", departmnet)));
      let I = element(by.xpath(Instrument.replace("<text>", instrument)));
      let C = element(by.xpath(Control.replace("<text>", control)));
      let A = element(by.xpath(Analyte.replace("<text>", analyte)));
      //let A = element(by.xpath("//span[contains(@class,'sidenav-link')]"));
      library.waitLoadingImageIconToBeInvisible().then(() => {
        library.logStep("Select Department");
        return D.click();
      }).then(() => {
        console.log("Clicked Department");
        return library.waitLoadingImageIconToBeInvisible();
      }).then(() => {
        library.logStep("Select Instrument");
        return I.click();
      }).then(() => {
        console.log("Clicked Instrument");
        return library.waitLoadingImageIconToBeInvisible();
      }).then(() => {
        library.logStep("Select Control");
        return C.click();
      })
      .then(() => {
        console.log("Clicked Control");
        library.waitLoadingImageIconToBeInvisible();  
        library.logStep("Select Analyte");        
         return A.click();
       }) 
       .then(()=>{
        console.log("Clicked Analyte");
        return library.waitLoadingImageIconToBeInvisible();
       })
       .then(()=>{
        resolve(true);
      })
    });
  }


  isBenchSupervisorReviewCardPresent(): any {
    return new Promise((resolve) => {
      let ele = element(by.xpath(benchAndSupervisorReviewCard));
      ele.isPresent().then((x) => {
        resolve(x);
      })
    });
  }

  SearchAccountByAccountName(accountName) {
    let status = false;
    return new Promise((resolve) => {
      library.clickJS(dropdownCategory);
      library.logStep("search Icon Clicked.");
      library.click(AccountName);
      library.logStep("AccountName Icon Clicked.");
      const labNameEle = element(by.xpath(searchInp));
      labNameEle.sendKeys(accountName);
      library.click(searchBtn);

      status = true;
      resolve(status);
    });
  }

  async enableAchrivedItems() {
    library.logStep("Enable Archived Items");
    let ele: ElementFinder = await element(by.xpath(archivedItemsToggle));
    await browser.wait(EC.visibilityOf(ele), 8888);
    if ((await ele.getAttribute("aria-checked")) == "false") {
      library.clickJS(ele);
      await library.waitLoadingImageIconToBeInvisible();
    }
  }

  async clickEditThisAnalyte() {
    library.logStep("Click Edit Analyte Button");
    let ele = await element(by.buttonText(btnEditAnalyte));
    await browser.wait(EC.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickEditThisControl() {
    library.logStep("Click Edit Control Button");
    let ele = await element(by.buttonText(btnEditControl));
    await browser.wait(EC.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickEditThisInstrument() {
    library.logStep("Click Edit Instrument Button");
    let ele = await element(by.buttonText(btnEditInstrument));
    await browser.wait(EC.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async addComment(controlLot: any, comment: any) {
    library.logStep("Add Comment - " + comment);
    let ele = await element(
      by.xpath(commentField.replace("<controlLot>", controlLot))
    );
    await ele.sendKeys(comment);
  }

  async selectCorrectiveAction(controlLot: any, correctiveAction: any) {
    library.logStep("Select Corrective Action " + correctiveAction);
    let ele = correctiveActionDropDown.replace("<controlLot>", controlLot);
    let ele1 = await element(by.xpath(ele));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await ele1.click();
    ele1 = await element(
      by.xpath(
        correctiveActionDropDownOption.replace(
          "<correctiveAction>",
          correctiveAction
        )
      )
    );
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await ele1.click();
  }

  async showOptions(controlLot) {
    library.logStep("Show options for " + controlLot);
    await library.waitLoadingImageIconToBeInvisible();
    let ele = showOptionsBtn.replace("<controlLot>", controlLot);
    let ele1 = await element(by.xpath(ele));
    await library.scrollToElement_async(ele1);
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await ele1.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async selectLot(newLotOption: string) {
    library.logStep("Select Lot " + newLotOption);
    let ele = await element(by.xpath(selectLotDropDown));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele),
      8000
    );
    await ele.click();
    let ele1 = await element(
      by.xpath(selectLotDropDownOption.replace("<lot>", newLotOption))
    );
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await ele1.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickStartNewLot() {
    library.logStep("Click Start New Lot Button");
    let ele1 = await element(by.buttonText(startNewLotBtnText));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await ele1.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickStartNewLotWithLot(controlLot: string) {
    library.logStep("Click Start New Lot Button For " + controlLot);
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(
        await element(by.xpath(loadingPopUp))
      ),
      25000
    );
    await library.waitLoadingImageIconToBeInvisible();
    let ele = startNewLotBtn.replace("<controlLot>", controlLot);
    let ele1 = await element(by.xpath(ele));
    await library.scrollToElement_async(ele1);
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele1),
      8000
    );
    await library.waitLoadingImageIconToBeInvisible();
    await ele1.click();
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(
        await element(by.xpath(loadingPopUp))
      ),
      25000
    );
    await library.waitLoadingImageIconToBeInvisible();
  }

  async sendToPeerGroup() {
    library.logStep("Click Send To Peer Group Button");
    await library.waitLoadingImageIconToBeInvisible();
    let ele = await element(by.buttonText(sendToPeerGroupBtn));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele),
      8000
    );
    await ele.click();
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(
        await element(by.xpath(loadingPopUp))
      ),
      25000
    );
    await library.waitLoadingImageIconToBeInvisible();
  }

  async enterData(controlLot: string, data: any[]) {
    library.logStep("Enter Data");
    await library.waitLoadingImageIconToBeInvisible();
    await library.waitLoadingImageIconToBeInvisible();
    for (let i = 1; i <= data.length; i++) {
      let ele = dataInputField.replace("<controlLot>", controlLot);
      ele = ele.replace("<level>", i.toString());
      console.log("Data XPath " + ele);
      let ele1 = await element(by.xpath(ele));
      await browser.wait(browser.ExpectedConditions.presenceOf(ele1), 8888);
      await library.scrollToElement_async(ele1);
      await ele1.sendKeys(data[i - 1]);
    }
  }

  async selectReportType(reportType) {
    library.logStep("Select Report Type " + reportType);
    let ele = await element(by.xpath(reportTypeDropDown));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele),
      8000
    );
    await ele.click();
    ele = await element(
      by.xpath(reportTypeDropDownOption.replace("keyword", reportType))
    );
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
  }

  async clearAllNotifications() {
    library.logStep("Clear All Notifications");
    let ele = await element(by.buttonText(clearAllNotifications));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clearFirstNotification() {
    library.logStep("Clear First Notification");
    let ele = await element(by.className(clearNotification));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickFirstNotification() {
    library.logStep("Click First Notification");
    let ele = await element(by.xpath(notification));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async clickNotificationBellIcon() {
    library.logStep("Click On Notification Bell Icon");
    await library.waitLoadingImageIconToBeInvisible();
    let ele = await element(by.className(notificationCount));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async savedReportsPresent() {
    let ele = await element(by.xpath(savedReports));
    let flag = await ele.isPresent();
    library.logStep("Saved Report Present - " + flag);
    return flag;
  }

  async expandSavedReports() {
    library.logStep("Expand Saved Reports");
    let ele = await element(by.xpath(expandReportsBtn));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
  }

  async isSaveReportButtonPresent() {
    let ele = await element(by.buttonText(saveReportBtn));
    let flag = await ele.isPresent();
    library.logStep("Save Report Button Present - " + flag);
    return flag;
  }

  async correctiveActionsInputNotPresent() {
    let ele = element.all(by.xpath(correctiveActionsInput));
    let l = (await ele).length;
    return l == 0 ? true : false;
  }

  async openRecentReport() {
    library.logStep("Open Recent Report");
    let ele = await element(by.className(notificationCount));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    await ele.click();
    let notificationEle = await element(by.xpath(notification));
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(notificationEle),
      8000
    );
    await notificationEle.click();
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(element(by.xpath(report))),
      8000
    );
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))),
      25000
    );
    await browser.wait(
      browser.ExpectedConditions.invisibilityOf(
        element(by.xpath(loadingPopUp))
      ),
      25000
    );
  }

  async checkNotificationCountPresent(count) {
    let ele: ElementFinder = await element(
      by.xpath(notificationEleWithCount.replace("keyword", count))
    );
    console.log(
      "Noti Count XPath " + notificationEleWithCount.replace("keyword", count)
    );
    await browser.wait(browser.ExpectedConditions.presenceOf(ele), 120000);
    let flag = await ele.isPresent();
    library.logStep("Notification With Count " + count + " Present = " + flag);
    return flag;
  }

  async closeCreateReportsPopUp() {
    library.logStep("Close Create Reports Pop Up");
    let ele = await element(by.buttonText(reportPopUpBtn));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 11000);
    await ele.click();
  }

  async getNotificationCount() {
    let ele = await element(by.className(notificationCount));
    if (!(await ele.isPresent())) return 0;
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000);
    let count = parseInt(await ele.getText());
    library.logStep("Notification Count = " + count);
    return count;
  }

  async createReport() {
    library.logStep("Click On Create Report");
    let ele = await element(by.buttonText(createReportBtn));
    await browser.wait(
      browser.ExpectedConditions.elementToBeClickable(ele),
      25000
    );
    await library.clickJS(ele);
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))),
      25000
    );
    await browser.wait(
      browser.ExpectedConditions.invisibilityOf(
        element(by.xpath(loadingPopUp))
      ),
      25000
    );
  }

  async clickOnReportsTab() {
    library.logStep("Click On Reports Tab");
    let ele = await element(by.xpath(reportsTab));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 11000);
    await ele.click();
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(element(by.xpath(loadingPopUp))),
      25000
    );
    await browser.wait(
      browser.ExpectedConditions.invisibilityOf(
        element(by.xpath(loadingPopUp))
      ),
      25000
    );
  }

  async selectSidebarOption(keyword: string) {
    library.logStep("Select Sidebar Option - " + keyword);
    let option = await element(
      by.xpath(sidebarOption.replace("keyword", keyword))
    );
    await browser.wait(browser.ExpectedConditions.presenceOf(option), 20000);
    await library.scrollToElement_async(option);
    await option.click();
    await library.waitLoadingImageIconToBeInvisible();
  }

  async selectLocation(location: string) {
    try {
      let locRadioBtn = await element(
        by.xpath(locationRadioBtn.replace("keyword", location))
      );
      await browser.wait(
        browser.ExpectedConditions.elementToBeClickable(locRadioBtn),
        8000
      );
      await locRadioBtn.click();
      let btn = await element(by.buttonText(proceedBtn));
      await browser.wait(browser.ExpectedConditions.presenceOf(btn), 8000);
      library.clickJS(btn);
      await browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(loadingPopUp))
        ),
        25000
      );
      await browser.wait(
        browser.ExpectedConditions.invisibilityOf(
          element(by.xpath(loadingPopUp))
        ),
        25000
      );
      library.logStep("Select Location " + location);
      return true;
    } catch (error) {
      library.logFailStep("Select Location Failed " + error);
      return false;
    }
  }

  dashboardCards() {
    return new Promise((resolve) => {
      let isCardsAvailable = false;
      this.waitForPage();
      element
        .all(by.className(matTitle))
        .count()
        .then(function (cards) {
          browser.sleep(3000);
          if (cards >= 6) {
            isCardsAvailable = true;
            resolve(isCardsAvailable);
          } else {
            isCardsAvailable = true;
            resolve(isCardsAvailable);
          }
        });
    });
  }

  backToDashboard() {
    const pageTitle1 = browser
      .findElement(by.tagName(navBar))
      .findElement(by.className(pageTitle));
    pageTitle1
      .getText()
      .then(function (title) {
        if (title.includes("< Dashboard")) {
          pageTitle1.click().then(function () { });
        }
      })
      .then(this.waitForElement);
  }

  waitForPage() {
    browser.sleep(8000);
  }
  async waitForPage_async() {
    await browser.sleep(8000);
  }

  async waitForElement() {
    await browser.sleep(30000);
  }
  async waitForElement_async() {
    await browser.sleep(30000);
  }

  waitForRefresh() {
    browser.refresh();
    browser.sleep(5000);
  }

  waitForScroll() {
    browser.sleep(2000);
  }

  dashboardCardsForUser() {
    return new Promise((resolve) => {
      let isCardsAvailable = false;
      this.waitForElement();
      element
        .all(by.className(matTitle))
        .count()
        .then(function (cards) {
          if (cards >= 3) {
            isCardsAvailable = true;
          }
        })
        .then(function () {
          resolve(isCardsAvailable);
        });
    });
  }

  verifyAvailableCards(role) {
    return new Promise((resolve) => {
      this.waitForPage();
      browser
        .actions()
        .mouseMove(element(by.id(dataTable)))
        .perform();
      const dataTbl = element(by.id(dataTable));
      library.scrollToElement(dataTbl);
      browser.sleep(3000);
      console.log("In available");
      let availableCards = false;
      let dataPresent,
        reportsPresent,
        spcRulesPresent,
        connectivityPresent,
        labSetupPresent,
        userManagementPresent = false;
      const dataTable1 = element(by.id(dataTable));
      const reports1 = element(by.id(reports));
      const connectivity1 = element(by.id(connectivity));
      library.scrollToElement(connectivity1);
      const pgTitle = element(by.className(h1Title));
      pgTitle
        .isDisplayed()
        .then(function () {
          dataTable1.isDisplayed().then(function () {
            dataTable1.getText().then(function (text) {
              if (text === jsonData.DataTable) {
                dataPresent = true;
              }
            });
          });
          reports1.isDisplayed().then(function () {
            reports1.getText().then(function (text) {
              if (text === jsonData.Reports) {
                reportsPresent = true;
              }
            });
          });
          connectivity1
            .isDisplayed()
            .then(function () {
              connectivity1.getText().then(function (text) {
                if (text === jsonData.Connectivity) {
                  connectivityPresent = true;
                }
                if (role === "user") {
                  if (
                    dataPresent === true &&
                    reportsPresent === true &&
                    connectivityPresent === true
                  ) {
                    availableCards = true;
                    resolve(availableCards);
                  }
                }
              });
            })
            .catch(function () {
              connectivityPresent = false;
            });
          if (role === "admin") {
            const spcRules1 = element(by.id(spcRules));
            spcRules1.isDisplayed().then(function () {
              spcRules1.getText().then(function (text) {
                if (text === jsonData.SPCRules) {
                  spcRulesPresent = true;
                }
              });
            });
          }
          if (role === "admin") {
            const userManagement1 = element(by.id(userManagement));
            const labSetup1 = element(by.id(labSetup));
            labSetup1.isDisplayed().then(function () {
              labSetup1.getText().then(function (text) {
                if (text === jsonData.LabSetup) {
                  labSetupPresent = true;
                }
              });
            });
            userManagement1.isDisplayed().then(function () {
              userManagement1.getText().then(function (text) {
                if (text === jsonData.UserManagement) {
                  userManagementPresent = true;
                  if (
                    dataPresent === true &&
                    reportsPresent === true &&
                    spcRulesPresent === true &&
                    connectivityPresent === true &&
                    labSetupPresent === true &&
                    userManagementPresent === true
                  ) {
                    availableCards = true;
                    resolve(availableCards);
                  }
                }
              });
            });
          }
        })
        .then(function () {
          resolve(availableCards);
        });
    });
  }

  verifyAssignedLabToUser(assignedLab) {
    let verified = false;
    return new Promise((resolve) => {
      const lab1 = element(by.xpath(lab));
      lab1.getText().then(function (actualText) {
        if (actualText === assignedLab) {
          verified = true;
          resolve(verified);
        }
      });
    });
  }

  verifyUserManagementDisplayed() {
    let isUserManagementDisplayed = false;
    return new Promise((resolve) => {
      const userManagement1 = element(by.id(userManagement));
      userManagement1
        .isDisplayed()
        .then(function () {
          isUserManagementDisplayed = true;
          resolve(isUserManagementDisplayed);
        })
        .catch(function () {
          isUserManagementDisplayed = false;
          resolve(isUserManagementDisplayed);
        });
    });
  }

  goToDashboard() {
    let dashboard = false;
    return new Promise((resolve) => {
      const dashboardBack1 = element(by.xpath(dashboardBack));
      dashboardBack1
        .click()
        .then(function () {
          dashboard = true;
          resolve(dashboard);
        })
        .catch(function () {
          dashboard = false;
          resolve(dashboard);
        });
    });
  }

  clickOnDashBoardArrow() {
    return new Promise((resolve) => {
      const dashBoardArrow1 = element(by.xpath(dashBoardArrow));
      library.scrollToElement(dashBoardArrow1);
      dashBoardArrow1.click().then(function () {
        resolve(true);
      });
    });
  }

  scrollToElement(elmnt) {
    let scrollToElement = false;
    return new Promise((resolve) => {
      library.scrollToElement(elmnt);
      this.waitForElement();
      scrollToElement = true;
      resolve(scrollToElement);
    });
  }

  goToSpcRules() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const spcRules1 = element(by.id(spcRulessetup));
      spcRules1.isDisplayed().then(function () {
        library.clickJS(spcRules1);
        browser.sleep(8000);
        status = true;
        resolve(status);
      });
    });
  }

  goToSpcRuleTab() {
    let goToSpcRuleTab = false;
    return new Promise((resolve) => {
      const spcRuleTabEle1 = element(by.xpath(spcRuleTabEle));
      spcRuleTabEle1.click().then(function () {
        browser.sleep(6000);
        goToSpcRuleTab = true;
        resolve(goToSpcRuleTab);
      });
    });
  }

  goToDataTableTab() {
    let goToDataTableTab = false;
    return new Promise((resolve) => {
      const dataTableTabEle = element(by.xpath('.//a[@class = "table-link"]'));
      dataTableTabEle.click().then(function () {
        browser.sleep(6000);
        goToDataTableTab = true;
        resolve(goToDataTableTab);
      });
    });
  }

  backToDashboardPage() {
    let backToDashboardPage = false;
    this.waitForElement();
    return new Promise((resolve) => {
      const backBtn = element(by.xpath(dashboardBack));
      browser.wait(until.presenceOf(backBtn), 50000, "Message: took too long");
      backBtn.click();
      this.waitForElement();
      backToDashboardPage = true;
      resolve(backToDashboardPage);
    });
  }

  goToUserManagementpage() {
    let status = false;
    return new Promise((resolve) => {
      this.waitForPage();
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(
        protractor.ExpectedConditions.presenceOf(gearElement),
        15000
      );
      library.clickJS(gearElement);
      library.logStep("Gear Icon Clicked.");
      const userManagementEle = findElement(
        locatorType.XPATH,
        userManagementMenu
      );
      library.clickJS(userManagementEle);
      library.logStep("User Management clicked.");
      library.logStepWithScreenshot(
        "User is on User Management Page.",
        "UserMgmt"
      );
      status = true;
      resolve(status);
    });
  }

  verifyMenuItemsForAdmin(role) {
    let flagAdmin,
      flagUser = false;
    return new Promise((resolve) => {
      if (role === "admin") {
        const menuItemsadmin = new Map<string, string>();
        menuItemsadmin.set("User Management", userManagementMenu);
        menuItemsadmin.set("Release Note", releaseNoteMenu);
        menuItemsadmin.set("Terms of Use", termsOfUseMenu);
        menuItemsadmin.set("Quick Reference Guide", quickReferenceGuideMenu);
        menuItemsadmin.forEach(function (key, value) {
          console.log("Inside menu Item4 admin");
          const menuItemsList = element(by.xpath(menuItemsadmin.get(value)));
          if (menuItemsList.isDisplayed()) {
            flagAdmin = true;
            library.logStep(value + " are displayed for admin user.");
            console.log(value + " are displayed for admin user.");
          } else {
            flagAdmin = false;
            library.logFailStep(value + " are not displayed for admin user.");
            console.log(value + " are not displayed for admin user.");
          }
        });
        if (flagAdmin === true) {
          library.logStep("Menu Items are displayed for admin user.");
          library.attachScreenshot("MenuItemms");
        } else {
          library.logFailStep("Menu Items are not displayed for admin user.");
          library.attachScreenshot("MenuItemms");
        }
        resolve(flagAdmin);
      }
      if (role === "user") {
        const menuItemsuser = new Map<string, string>();
        menuItemsuser.set("Release Notes", releaseNoteMenu);
        menuItemsuser.set("Terms of Use", termsOfUseMenu);
        menuItemsuser.set("Quick Reference Guide", quickReferenceGuideMenu);
        menuItemsuser.forEach(function (key, value) {
          const menuItemsListUser = element(by.xpath(menuItemsuser.get(value)));
          if (menuItemsListUser.isDisplayed()) {
            flagUser = true;
            library.logStep(value + " are displayed for  user.");
          } else {
            library.logFailStep(value + " are not displayed for user.");
            flagUser = false;
          }
        });
        if (flagUser === true) {
          library.logStep("Menu Items are displayed for  user.");
          library.attachScreenshot("MenuItemms");
        } else {
          library.logFailStep("Menu Items are not displayed for user.");
          library.attachScreenshot("MenuItemms");
        }
        resolve(flagUser);
      }
    }).catch(function () {
      console.log("");
    });
  }

  clickGearIcon() {
    let status = false;
    return new Promise((resolve) => {
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 5000);
      library.clickJS(gearElement);
      status = true;
      library.logStepWithScreenshot("Gear Icon Clicked.", "gearclicked");
      resolve(status);
    });
  }

  async goToAccountManagementpage() {
    let status = false;
    return new Promise((resolve) => {
      this.waitForElement();
      browser.sleep(2000);
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(
        protractor.ExpectedConditions.elementToBeClickable(gearElement),
        15000
      );
      library.clickJS(gearElement);
      library.logStep("Gear Icon Clicked.");
      const accountManagementEle = element(by.xpath(accountManagementMenu));
      library.clickJS(accountManagementEle);
      library.logStep("Account Management clicked.");
      library.logStepWithScreenshot(
        "Account Management clicked.",
        "AccountManagementClicked"
      );
      library.logStep("User is on Account Management Page.");
      status = true;
      resolve(status);
    });
  }
  async goToBioRadUserManagementpage() {
    let status = false;
    return new Promise((resolve) => {
      // this.waitForElement();
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(
        browser.ExpectedConditions.elementToBeClickable(gearElement),
        15000
      );
      library.clickJS(gearElement);
      library.logStep("Gear Icon Clicked.");
      const bioRadUserManagementEle = element(
        by.xpath(bioRadUserManagementMenu)
      );
      library.clickJS(bioRadUserManagementEle);
      library.logStep("Bio_RadUser Management clicked.");
      library.logStepWithScreenshot(
        "Bio_RadUser Management clicked.",
        "Bio_RadUserManagementClicked"
      );
      library.logStep("User is on BioRadUserManagement Page.");
      status = true;
      resolve(status);
    });
  }

  clickTitleLogo() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const title = element(by.id(titleLogo));
      title.click();
      status = true;
      resolve(status);
    });
  }

  breadcrumbLevel(level) {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const breadcrumbItem = element(
        by.xpath(
          './/li[contains(@class,"breadcrumb-item")]/a[contains(text(),"' +
          level +
          '")]'
        )
      );
      breadcrumbItem.isDisplayed().then(function () {
        breadcrumbItem.click();
        status = true;
        resolve(status);
      });
    });
  }

  clickUnityNext() {
    console.log("In dashboard");
    let status = false;
    return new Promise((resolve) => {
      const unityBtn = element(by.xpath(unityNext));
      browser.wait(
        browser.ExpectedConditions.elementToBeClickable(unityBtn),
        5000,
        "unityBtn not clickable"
      ).then(async () => {
        library.clickJS(unityBtn);
        await library.waitLoadingImageIconToBeInvisible();
        library.logStep("Unity Next (Home) button clicked");
        status = true;
        resolve(status);
      });
    });
  }

  verifyLabNameDisplayed(labNameText) {
    let status = false;
    return new Promise((resolve) => {
      const labNameHeader = element(
        by.xpath(
          './/div[@class="breadcrumb-wrapper"]//h4[contains(text(),"' +
          labNameText +
          '")]'
        )
      );
      labNameHeader
        .isDisplayed()
        .then(function () {
          library.logStep(
            "Lab Name " + labNameText + " is displayed in Header"
          );
          status = true;
          resolve(status);
        })
        .catch(function () {
          library.logStep(
            "Lab Name " + labNameText + " is not displayed in Header"
          );
          status = false;
          resolve(status);
        });
    });
  }

  verifySideNavigationDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const leftNavigation = element(by.id(sideNavigation));
      leftNavigation
        .isDisplayed()
        .then(function () {
          library.logStep("Left Navigation is displayed");
          status = true;
          resolve(status);
        })
        .catch(function () {
          library.logStep("Left Navigation is not displayed");
          status = false;
          resolve(status);
        });
    });
  }
  async verifyConfigurationLabSetup() {
    let status = false;
    await browser.wait(
      browser.ExpectedConditions.invisibilityOf(
        element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'))
      ),
      20000,
      "Element is visible"
    );
    let configLabSetup = element(by.xpath(LabSetupPannel));

    if (await configLabSetup.isPresent()) {
      status = true;
      console.log(status, " , ConfigurationLabSetup is getting display");
      library.logStepWithScreenshot(
        status + " ConfigurationLabSetup is shown",
        "ConfigurationLabSetupDisplay"
      );
    } else {
      console.log(status + " , ConfigurationLabSetup is not display");
      library.logStepWithScreenshot(
        status + "  ConfigurationLabSetup is not shown.",
        "ConfigurationLabSetupNotDisplay"
      );
    }
    return status;
  }
  async newModifiedName(actualName) {
    let randomNo = Math.floor(Math.random() * (99 + 10));
    let modifiedname = actualName + randomNo;

    return modifiedname;
  }
}
