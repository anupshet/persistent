/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { ElementArrayFinder, ElementFinder, browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';

const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const EC = protractor.ExpectedConditions;
const until = protractor.ExpectedConditions;
const dataTableTab = '//a[contains(text(),"DATA TABLE")]';
// const submitDisabled = '//button[@disabled=''][text()='Submit Data']'
// const submitDisabled = '//button[@id="submitBtn"][@disabled=""]';
const submitDisabled = '//button[@id="submitBtn"][@disabled="true"]';
const submitButton = '//span[contains(text(),"SEND TO PEER GROUP")]//parent::button';
const spclink = 'a.spcrules-link';
const cancelButton = 'cancelBtn';
const dontSave = 'dialog_button1';
const lvl2Check = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[2]//input[@aria-checked="true"]';
const lvl1Val0 = '//mat-select[1]//span[text()="0"]';
const lvl2Val1 = '//mat-select//span[text()="1"]';
const test2Mean = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span';
const test2SD = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span';
const test2Point = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span';
const test2InstMean = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span';
const test2InstSD = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span';
const test2Instpoint = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span';
const mean1 = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span)[1]';
const sd1 = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span)[1]';
const point1 = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span)[1]';
const mean1Lvl2 = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[3]/div/div/span';
const sd1Lvl2 = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[3]/div/div/span';
const point1Lvl2 = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[3]/div/div/span';
const mean1L2test2 = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[3]/div/div/span';
const sd1L2test2 = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[3]/div/div/span';
const point1L2test2 = '//div[2]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[3]/div/div/span';
const mean1L2test1Inst = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[3]/div/div/span';
const sd1L2test1Inst = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[3]/div/div/span';
const point1L2test1Inst = '//div[3]/div/section/br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[3]/div/div/span';
const meanValNotDisplay = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[3]/div/div/span[@class="noshow"]';
const dateUndefined = 'undefinedDate';
const datePick = 'mat-icon-button';
const calenderNext = 'mat-calendar-next-button mat-icon-button';
const nextMonthDisabled = '//button[@class="mat-calendar-next-button mat-icon-button"][@disabled=""]';
const dateSelected = '//div[@class="mat-calendar-body-cell-content mat-calendar-body-today"]';
const cmtVal = '//mat-dialog-container/br-pez-dialog/section//div//span/following-sibling::p';
const wndCount = '//br-review-summary/section/div[2]/div[1]/section/ul/li/p';
const addCmtText = '(//span[contains(text(),"Add comment")])[1]/parent::div/following-sibling::form//textarea';
const testSummarySubmit = '(//button[contains(text(),"Submit Data")])[2]';
const expndProd = '//span[contains(text(),"Assayed")]/ancestor::div/preceding-sibling::tree-node-expander/span/span';
const allLevels = '//table[@class="mat-typography"]//td';
const scrollFirstTest = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[1])[1]';
const deleteData = '//span/mat-icon[contains(text(),"delete")]';
const sortInstrument = '//unext-side-nav/mat-sidenav-container/mat-sidenav/div/perfect-scrollbar' +
  '/div/div[1]/unext-node/section/mat-accordion/mat-expansion-panel/em';
/*const test1H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[1]'
const test2H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[2]'
const test3H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[3]'
const test4H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[4]'
const test5H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[5]'
const test6H = '(//br-analyte-summary-entry/div/div[1]/div[1]/h6)[5]'*/
const test1H = '(//br-analyte-summary-entry//h6)[1]';
const test2H = '(//br-analyte-summary-entry//h6)[2]';
const test3H = '(//br-analyte-summary-entry//h6)[3]';
const test4H = '(//br-analyte-summary-entry//h6)[4]';
const test5H = '(//br-analyte-summary-entry//h6)[5]';
const test6H = '(//br-analyte-summary-entry//h6)[6]';
// const pageheading = './/div[@class='heading']';
const pageheading = './/unext-page-section//div/h1';
const calender = 'mat-datepicker-toggle-default-icon ng-star-inserted';
const calenderSelect = 'mat-calendar-period-button mat-button';
const currentYear = 'mat-calendar-body-cell-content mat-calendar-body-selected mat-calendar-body-today';
const currentMon = 'mat-calendar-body-cell-content mat-calendar-body-today';
const displayMonth = '//span[@id="spc_summary_view_date"]';
// const applyButton = '//button[contains(text(),'APPLY')]';
const applyButton = '//span[contains(text(),"APPLY")]';
const headerInst = 'mat-h5';
const runRadioBtn = '//mat-radio-button[1]';
const levelRadioBtn = '//mat-radio-button[2]';
const test1SummaryEntry = '(//br-analyte-summary-entry/div)[1]';
const test2SummaryEntry = '(//br-analyte-summary-entry/div)[2]';
const test3SummaryEntry = '(//br-analyte-summary-entry/div)[3]';
const dateTimePicker = 'undefinedDate';
const level1 = '//span[contains(text(),"Level 1")]';
const level2 = '//span[contains(text(),"Level 2")]';
const level3 = '//span[contains(text(),"Level 3")]';
const level4 = '//span[contains(text(),"Level 4")]';
const decimalSelect1 = '//section[1]/mat-select/div/div[2]';
const decimalSelect2 = '//section[2]/mat-select/div/div[2]';
const decimalSelect3 = '//section[3]/mat-select/div/div[2]';
const decimalSelect4 = '//section[4]/mat-select/div/div[2]';
const level1Cheked = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[1]//input[@aria-checked="true"]';
const toggle = 'mat-slide-toggle-thumb';
const meanNotStored = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span';
const sdNotStored = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span';
const pointNotStored = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span';
const datepick = 'mat-icon-button';
const previousDate = '//button[@aria-label="Previous month"][@disabled="true"]';
const today = './/div[contains(@class, "today")]';
const tblLink = './/a[@class = "table-link"]';
// const title = '//h1[@class='mat-dialog-title']'
const showOptionsarrow = '//br-change-lot//span[@mattooltip="Show options"]';
const title = '//h3';
const message = 'mat-dialog-content';
const dontsave = 'dialog_button1';
const savedata = 'dialog_button2';
const modal1 = './/mat-dialog-container[@class="mat-dialog-container ng-tns-c42-140 ng' +
  'trigger ng-trigger-dialogContainer ng-star-inserted"]';
const closeDialog = 'button[aria-label="Close dialog"]';
const pointListEle = './/td[@class="br-uppercase mat-cell cdk-column-label mat-column-label ng-star-inserted"][text() = "points"]';
const lotlist = './/span[@class="link-text open-lot-select"][text() = "Change lot"]';
const addCmtlist = './/span[@class="link-text add-comment-link ng-star-inserted"][text() = "Add comment"]';
const DefailtActiveDataTable = './/li[@class="active"]//a[@class="table-link"][text()="DATA TABLE"]';
const spcEle = './/ul[@class="nav mob-actions-bar"]/li[2]/a';
const reportEle = './/ul[@class="nav mob-actions-bar"]/li[3]/a';
const connEleInstru = './/ul[@class="nav mob-actions-bar"]/li[4]/a';
const connEleProd = './/ul[@class="nav mob-actions-bar"]/li[3]/a';
const levelDisplay = './/table[@class="mat-typography"]/tbody/tr[1]/td[1]/span';
// const footerSubmit = './/button[@id='submitButton']'
const footerSubmit = './/button[@id="submitBtn"]';
const footerDate = './/input[@class="dateInput mat-input-element mat-form-field-autofill' +
  '-control cdk-text-field-autofill-monitored ng-untouched ng-pristine"]';
const footerCancel = './/button[@id="cancelBtn"]';
// const meanChar = './/td[@class="br-uppercase mat-small mat-cell cdk-column-label mat-column-' +
//   'label ng-star-inserted"][.="mean"]//following-sibling::td[1]/div/div';
const meanChar = '//mat-form-field//div//input[@tabindex="11"]';
const sdChar = '//mat-form-field//div//input[@tabindex="12"]';
const pointChar = '//mat-form-field//div//input[@tabindex="13"]';
const backButton = '//button[contains(@class,\'backArrow\')]/span';
const backArrrow = '//unext-nav-header//mat-icon[contains(@class,"Back")]';
const delBtn = './/button[@class="btn"][@id=saveButton]';
const addCmnt = '(//span[contains(text(),"Add comment")])[2]';
const addCmntTestArea = '//textarea[@placeholder="Add a comment "]';
const submitCmnt = '//div[@class="data-entry-edit-component mat-typography"]//button[2]';
const selectCalibrator = '(//mat-select[1])[2]';
const selectReagent = '(//mat-select[1])[1]';
const chngLot = '(//span[contains(text(),"Change lot")])[2]';
const cancelBtnOnDelete = '(//button[@id=cancelButton])[2]';
const reagentLotSelect = '(.//div[@class="mat-select-value"]/span/span)[1]';
const calibratorLotSel = '(.//div[@class="mat-select-value"]/span/span)[2]';
const firstMean = '//*[@id="11"]';
// const manuallyEnterData = 'Manually enter data';
const manuallyEnterSummary = 'Manually enter summary';
const saveButton = 'dialog_button2';
const showOptionsEle = '//span[contains(text(),"Show options")]';
const addCommentTextBox = '(.//textarea[@formcontrolname="comments"])[1]';
// const changeCallibratorLot = '//span[contains(text(),'Calibrator Lot')]'
// const changeReagentLot = '//span[contains(text(),'Reagent Lot')]'
const changeCallibratorLot = '//label[contains(text(),"Calibrator Lot")]';
const changeReagentLot = '//label[contains(text(),"Reagent Lot")]';
const addCommentTxtArea = '//textarea[@placeholder="Add a comment "]';
const hoverTest = '(//*[@class="wrapper analyte-point-entry-component"])[1]';
// const reagentLotSelectEle = '//span[contains(text(),'Calibrator Lot ')]'
// const calibratorLotSelectEle = '//span[contains(text(),'Reagent Lot ')]'
const reagentLotSelectEle = '//label[contains(text(),"Calibrator Lot ")]';
const calibratorLotSelectEle = '//label[contains(text(),"Reagent Lot ")]';
const addCommentEle = '//textarea[@placeholder=" Add a comment "]';
const hideOption = 'hide-options ng-star-inserted';
const optionsForm = '//br-change-lot//*[@class="flex-container"]/div[@class="flex-container flex-column"]' +
  '//div[@ng-reflect-name="BrChangeLotSelectLotForm"]';
const testCollapse = 'chevron';
const sumDataToggEleEnabled = './/mat-slide-toggle[@class="summary-toggle-slider mat-slide-toggle mat-accent mat-checked"]';
const summEle = './/div[@class = "summary-data-entry"]';
const runLevel = '//mat-radio-button[1]';
const levelEntry = '//mat-radio-button[2]';
const runEntryRadioBtn = '//mat-radio-button[1]';
const naivigateAwayMsg = '//br-dialog//p[contains(text(),"If you navigate away from this page, your data will not be saved. ")]';
const dontSaveDataBtn = '//mat-dialog-container//span[contains(text()," Dont save data ")]';
const saveDataBtn = '//span[contains(text()," Save data ")]';
const noData = '//span[contains(text(),"No Data")]';
const summaryEntrySection = '//unext-page-section//br-analyte-summary-entry';
const paginationControls = '//unext-data-management//pagination-controls//li';
const manuallyEnterData = '//a[contains(text(),"MANUALLY ENTER DATA")]';
const allTest = '//br-analyte-summary-view//p';
const displatDate = '//br-analyte-summary-view//span[contains(@id,"date")]';
const reportsTab = '//unext-nav-secondary-nav//div[contains(text(),"REPORTS")]';
const createBtn = '//button/span[contains(text(),"Create")]';
const reportCreated = '//h3[contains(text(),"Save Your Report")]';
const cancelReport = 'printCancel';
const timeClock = 'undefinedTime';
const dateLable = 'dateLabel';
const date = '//br-analyte-summary-view//div/span[@id="spc_summary_view_date"]';
const meanElnew = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span';
const sdEl = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span';
const pointEl = '//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span';
const analyteDate = '//br-analyte-summary-view//span[@id="spc_summary_view_date"]';
const firstRun = '//br-analyte-summary-view//section';
const submitUpdatebutton = 'Submit Updates';
const editRunCalenderInput = '(//input[@id="undefinedDate"])[2]';
const editRunCalenderButton = '(//button[@aria-label="Open calendar"])[2]';
const calibratorLotValue = '//mat-select[@aria-label="Calibrator Lot "]';
const calibratorLotOptions = '//mat-option';
const reagentLotValue = '//mat-select[@aria-label="Reagent Lot "]';
const reagentLotOptions = '//mat-option';
const editCommentBox = '(//textarea)[2]';

export class MultiSummary {
  async addEditComment(text: string) {
    library.logStep("Add Comment - "+text);
    let ele = await element(by.xpath(editCommentBox));
    await library.waitTillVisible(ele, 8888);
    await ele.sendKeys(text);
  }
  async selectReagentLotOtherThanCurrent() {
    let ele = await element(by.xpath(reagentLotValue));
    let text = (await ele.getText()).trim();
    await library.waitTillClickable(ele, 8888);
    await ele.click();
    let ele1: ElementFinder[] = await element.all(by.xpath(reagentLotOptions));
    let changedLot;
    for (let i = 0; i < ele1.length; i++) {
      if (!(await ele1[i].getText()).includes(text)) {
        await ele1[i].click();
        changedLot = (await ele1[i].getText()).trim();
        library.logStep("Clicked On " + ele1[i].getText());
        break;
      }
    }
    return changedLot;
  }
  async selectCalibratorLotOtherThanCurrent() {
    let ele = await element(by.xpath(calibratorLotValue));
    let text = (await ele.getText()).trim();
    await library.waitTillClickable(ele, 8888);
    await ele.click();
    let ele1: ElementFinder[] = await element.all(by.xpath(calibratorLotOptions));
    let changedLot;
    for (let i = 0; i < ele1.length; i++) {
      if (!(await ele1[i].getText()).includes(text)) {
        await ele1[i].click();
        changedLot = (await ele1[i].getText()).trim();
        library.logStep("Clicked On " + ele1[i].getText());
        break;
      }
    }
    return changedLot;
  }
  async clickHistoryIconWithValues(values: string[]) {
    library.logStep("Click on Run with values " + values);
    let xpath = '//td[contains(., "value")]/../..';
    let fxpath = '';
    for (let i = 0; i < values.length; i++) {
      let x = values[i];
      fxpath += xpath;
      fxpath = fxpath.replace("value", x);
      console.log("x " + x);
    }
    fxpath = fxpath + '/ancestor::br-analyte-summary-view//br-pez-cell//span[contains(@class, "ic-pez")]';
    console.log("XXXX " + fxpath);
    let ele = await element(by.xpath(fxpath));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
  }
  async clickRunWithValues(values: string[]) {
    library.logStep("Click on Run with values " + values);
    let xpath = '//td[contains(., "value")]/../..';
    let fxpath = '';
    for (let i = 0; i < values.length; i++) {
      let x = values[i];
      fxpath += xpath;
      fxpath = fxpath.replace("value", x);
      console.log("x " + x);
    }
    console.log("XXXX " + fxpath);
    let ele = await element(by.xpath(fxpath));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }
  async selectDateOtherThanCurrentDay() {
    let ele = await element(by.xpath(editRunCalenderInput));
    let ele1 = await element(by.xpath(editRunCalenderButton));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8888);
    let currentDate: string = await ele.getAttribute('value');
    let day = parseInt(currentDate.substring(currentDate.indexOf(' '), currentDate.lastIndexOf(' ')))
    if (day == 1)
      day++;
    else
      day--;
    let month = currentDate.substring(0, currentDate.indexOf(' ')).toUpperCase();
    let year = currentDate.substring(currentDate.lastIndexOf(' ') + 1);
    library.clickJS(ele1);
    await this.selectDate(year, month, day);
    return [year, currentDate.substring(0, currentDate.indexOf(' ')), day];
  }
  async selectDate(y, m, d) {
    library.logStep("Setect Date " + d + " " + m + " " + y);
    const clickCalendarDate = '(//div[contains(@class,"mat-calendar-header")]//span[@class="mat-button-wrapper"])[1]';
    const Calendardate = await element(by.xpath(clickCalendarDate));
    await browser.wait(browser.ExpectedConditions.visibilityOf(Calendardate), 8888);
    await Calendardate.click();
    const selectYear = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + y + '")]';
    const year = await element(by.xpath(selectYear));
    await browser.wait(browser.ExpectedConditions.visibilityOf(year), 8888);
    library.clickJS(year);
    const selectMonth = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + m + '")]';
    const month = await element(by.xpath(selectMonth));
    await browser.wait(browser.ExpectedConditions.visibilityOf(month), 8888);
    library.clickJS(month);
    const selectDate = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + d + '")]';
    const date = await element(by.xpath(selectDate));
    await browser.wait(browser.ExpectedConditions.visibilityOf(date), 8888);
    library.clickJS(date);
  }
  async clickSubmitUpdateButton() {
    library.logStep('Click Submit Update Button');
    let ele = await element(by.buttonText(submitUpdatebutton));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }
  async clickFirstRun() {
    library.logStep('Click First Run');
    let ele = await element(by.xpath(firstRun));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }
  static datePrev;
  static summaryDate;
  verifyRunEntryEnter(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value entered at ' + value);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            library.logStep('TAB pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '37') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus1) {
                if (focus1.includes('mat-focused')) {
                  library.logStep('Cursor focused at ' + key1);
                  result = true;
                  resolve(result);
                } else {
                  library.logFailStep('Cursor focused not at ' + key1);
                  result = false;
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  clickBackArrow() {
    let result = false;
    return new Promise((resolve) => {
      const backBtn = findElement(locatorType.XPATH, backButton);
      library.scrollToElement(backBtn);
      library.clickJS(backBtn);
      result = true;
      library.logStep('back button clicked');
      console.log('back button clicked');
      resolve(result);
    });
  }

  clickShowOptionNew() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const showOptionsarrow1 = element(by.xpath(showOptionsarrow));
      library.scrollToElement(showOptionsarrow1);
      // library.clickAction(showOptionsLink)
      browser.sleep(5000);
      library.clickJS(showOptionsarrow1);
      console.log('Show Option Button clicked.');
      library.logStepWithScreenshot('Show option arrow is clicked', 'Show option arrow after clicked');
      // dashBoard.waitForPage();
      browser.sleep(3000);
      clickShowOpt = true;
      resolve(clickShowOpt);
    });
  }
  verifyLevelEntryEnterKey(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value entered at ' + value);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            library.logStep('TAB pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '30') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus2) {
                if (focus2.includes('mat-focused')) {
                  result = true;
                  library.logStep('Cursor focused at ' + key1);
                  resolve(result);
                } else {
                  result = false;
                  library.logFailStep('Cursor is not focused at ' + key1);
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }
  verifyNoData(analyteName) {
    let status = false;
    return new Promise((resolve) => {
      // tslint:disable-next-line: no-shadowed-variable
      const noData = element(by.xpath('//p[contains(text(),' + analyteName + ')]/following::span[text()="No Data"])'));
      library.scrollToElement(noData);
      noData.isDisplayed().then(function () {
        library.logStep('No Data label is displayed');
        status = true;
        resolve(status);
      });
    });
  }
  verifySubmitButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const submitButton1 = findElement(locatorType.XPATH, submitButton);
      library.scrollToElement(submitButton1);
      submitButton1.isEnabled().then(function () {
        library.logStep('Submit data button is Enabled.');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit data button is not Enabled.');
        status = false;
        resolve(status);
      });
    });
  }

  clickCancelBtn() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = findElement(locatorType.ID, cancelButton);
      library.clickJS(cancelBtn);
      clickCancelBtn = true;
      dashBoard.waitForElement();
      library.logStep('Cancel button clicked.');
      resolve(clickCancelBtn);
    });

  }

  clickCancle() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = element(by.id(cancelButton));
      cancelBtn.click().then(function () {
        clickCancelBtn = true;
        library.logStep('Cancel button clicked.');
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  clickDontSaveData() {
    let save = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      element(by.id(dontSave)).click().then(function () {
        dashBoard.waitForElement();
        library.logStep('Dont Save Data button clicked.');
        save = true;
        resolve(save);
      });
    });
  }

  isLevel2CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(lvl2Check));
      error.isDisplayed().then(function () {
        status = true;
        resolve(status);
        library.logStep('Level 2 Checkbox is checked.');
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  verifyNoOfLevels(levels) {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const levelCnt = element.all(by.xpath(allLevels));
      levelCnt.count().then(function (cnt) {
        if (cnt === levels) {
          library.logStep
            ('The number of levels displayed in the Multi-Summary page  match the number of levels configured in Analyte page');
          status = true;
          resolve(status);
        } else {
          library.logStep('The number of levels displayed in the Multi-Summary page not match the number of levels configured in Analyte page');
          status = false;
          resolve(status);
        }
      });
    });
  }

  verifyDecimalPlaces() {
    let verified = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const level1Val0 = element(by.xpath(lvl1Val0));
      const level2Val1 = element(by.xpath(lvl2Val1));
      if (level1Val0.isDisplayed() && level2Val1.isDisplayed()) {
        verified = true;
        library.logStep('Level 1 value is set to 0 and Level 2 value is set to 1.');
        resolve(verified);
      } else {
        verified = false;
        resolve(verified);
      }
    });
  }

  verifyEnteredValueStoredTest2InstrumentLvl(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      const ele23 = element(by.id('23'));
      ele23.click().then(function () {
      });
      dashBoard.waitForPage();
      const meanEle = element(by.xpath(test2InstMean));

      const sdEle = element(by.xpath(test2InstSD));

      const pointEle = element(by.xpath(test2Instpoint));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (mean_Val) {
        if (mean_Val === expectedMean) {
          mean = true;
          library.logStep(mean_Val + ' mean value is same as expected value ' + expectedMean);
        } else {
          library.logFailStep(mean_Val + ' mean value is not same as expected value ' + expectedMean);
          mean = false;
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sd_Val) {
        if (sd_Val === expectedSD) {
          sd = true;
          library.logStep(sd_Val + ' SD value is same as expected value ' + expectedSD);
        } else {
          sd = false;
          library.logFailStep(sd_Val + ' SD value is not same as expected value ' + expectedSD);
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (point_Val) {
        if (point_Val === (expectedPoint)) {
          point = true;
          library.logStep(point_Val + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
          library.logFailStep(point_Val + ' point value is not same as expected value ' + expectedPoint);
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('Mean SD Point value constified successfully');
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredL2AllTest(expectedMean, expectedSD, expectedPoint, test) {
    let mean = false, sd = false, point = false, displayed = false;
    let mean_Ele, sd_Ele, point_Ele;

    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (test === '1') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));
        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));
      } else if (test === '2') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));

      } else if (test === '3') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));

      } else if (test === '4') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));

      } else if (test === '5') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));

      } else if (test === '6') {
        dashBoard.waitForElement();
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[3]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[3]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[3]/div/div/span)[' + test + ']'));

      }
      library.scrollToElement(mean_Ele);
      mean_Ele.getText().then(function (meanVal) {
        if (meanVal.includes(expectedMean)) {
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sd_Ele.getText().then(function (sdVal) {
        if (sdVal.includes(expectedSD)) {
          sd = true;
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
        } else {
          sd = false;
        }
      });
      point_Ele.getText().then(function (pointVal) {
        if (pointVal.includes(expectedPoint)) {
          point = true;
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        library.logStep('Mean SD Point value constified successfully');
        displayed = true;
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredL1AllTest(expectedMean, expectedSD, expectedPoint, test) {
    let mean = false, sd = false, point = false, displayed = false;
    let mean_Ele, sd_Ele, point_Ele;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (test === '1') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));

      } else if (test === '2') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));

      } else if (test === '3') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));

      } else if (test === '4') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));
      } else if (test === '5') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));

      } else if (test === '6') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[2]/div/div/span)[' + test + ']'));
        library.scrollToElement(mean_Ele);

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[2]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[2]/div/div/span)[' + test + ']'));

      }
      library.scrollToElement(mean_Ele);
      mean_Ele.getText().then(function (meanVal) {
        if (meanVal.includes(expectedMean)) {
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sd_Ele.getText().then(function (sdVal) {
        if (sdVal.includes(expectedSD)) {
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
          sd = true;
        } else {
          sd = false;
        }
      });
      point_Ele.getText().then(function (pointVal) {
        if (pointVal.includes(expectedPoint)) {
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
          point = true;
        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('Mean SD Point value constified successfully');
        resolve(displayed);
      }
    });
  }

  async enterMeanSDPointValues(dataMap: Map<String, String>) {
    let status = false;
    let keys = dataMap.keys();
    let value = keys.next().value;
    let key;
    do {
      key = dataMap.get(value);
      console.log('//*[@id="' + value + '"]');
      const data = await element(by.xpath('//*[@id="' + value + '"]'));
      await browser.wait(browser.ExpectedConditions.presenceOf(data), 8888);
      await data.clear();
      try {
        await data.sendKeys(key);
        library.logStep(key + 'entered ' + value);
        console.log('Mean, SD, Point values are entered');
        status = true;
      } catch (error) {
        console.log('Mean, SD, Point values are not entered');
        library.logStep('Mean, SD, Point values are not entered');
        status = false;
      }
      value = keys.next().value;
    } while (value != null);
    console.log("Done");
    return status;
  }

  verifyRunEntryDetails(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      dataMap.forEach(function (key, value) {
        // const data = element(by.xpath('//*[@id="' + value + '"]'));
        const data = '//*[@id="' + value + '"]';
        const dtavalue = findElement(locatorType.XPATH, data);
        library.scrollToElement(dtavalue);
        dtavalue.clear().then(function () {
          dtavalue.sendKeys(key).then(function () {
            dtavalue.sendKeys(protractor.Key.TAB).then(function () {
              library.logStep(key + 'entered ' + value);
              status = true;
              resolve(status);
            });
          });
        });
      });
    });
  }

  verifyLevelEntryDetails(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      dataMap.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.clear().then(function () {
          data.sendKeys(key).then(function () {
            data.sendKeys(protractor.Key.TAB).then(function () {
              library.logStep(key + 'entered ' + value);
              library.logStepWithScreenshot('Level entry working.', 'levelentry');
              status = true;
              resolve(status);
            });
          });
        });
      });
    });
  }

  verifyEnteredValueStored(expectedMean, expectedSD, expectedPoint, testNo) {
    let mean, sd, point, displayed;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const ele23 = element(by.xpath('23'));
      ele23.isDisplayed().then(function () {
        library.scrollToElement(ele23);
        ele23.click().then(function () {
          dashBoard.waitForElement();
        });
      }).catch(function () {
        const ele13 = element(by.xpath('13'));
        ele13.isDisplayed().then(function () {
          library.scrollToElement(ele13);
          ele13.click().then(function () {
            dashBoard.waitForElement();
          });
        }).catch(function () {
          dashBoard.waitForElement();
        });
        dashBoard.waitForElement();
      });
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      browser.actions()
        .mouseMove(element(by.id(cancelButton)))
        .perform();
      const cancelBtn = element(by.id(cancelButton));
      library.clickJS(cancelBtn);
      dashBoard.waitForElement();
      dashBoard.waitForPage();
      const meanEle = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span)[' + testNo + ']'));

      library.scrollToElement(meanEle);
      const sdEle = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[2]/td[2]/div/div/span)[' + testNo + ']'));

      const pointEle = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[3]/td[2]/div/div/span)[' + testNo + ']'));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {
        meanVal.trim();
        console.log('mean' + meanVal + 'and' + expectedMean);
        if (meanVal.includes(expectedMean)) {
          console.log('same');
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
        } else {
          console.log('diff');
          mean = false;
          library.logFailStep(meanVal + ' mean value is not same as expected value ' + expectedMean);
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sdVal) {
        sdVal.trim();
        console.log('sd' + sdVal + 'and' + expectedSD);
        if (sdVal.includes(expectedSD)) {
          console.log('same');
          sd = true;
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
        } else {
          console.log('diff');
          sd = false;
          library.logFailStep(sdVal + ' mean value is not same as expected value ' + expectedSD);
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (pointVal) {
        pointVal.trim();
        console.log('point' + pointVal + ' and ' + expectedPoint);
        if (pointVal.includes(expectedPoint)) {
          point = true;
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
          library.logFailStep(pointVal + ' mean value is not same as expected value ' + expectedPoint);
        }
        console.log(mean + ' and ' + sd + ' and ' + point);
        if (mean === true && sd === true && point === true) {
          displayed = true;
          library.logStep('Mean SD Point value verified successfully');
          resolve(displayed);
        } else {
          displayed = false;
          library.logFailStep('Mean SD Point values not same as entered value.');
          resolve(displayed);
        }
      });
    });
  }


  verifyLatestDataDisplayed(Mean, SD, Point) {
    // let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      const meanEle = findElement(locatorType.XPATH, mean1);
      const sdEle = element(by.xpath(sd1));
      const pointEle = element(by.xpath(point1));
      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {
        console.log('+++++> ', meanVal);
        if (meanVal === Mean) {
          console.log('true 1');
          library.logStep(meanVal + ' mean value is same as expected value ' + Mean);
          library.scrollToElement(sdEle);
          sdEle.getText().then(function (sdVal) {
            if (sdVal === SD) {
              console.log('true 2');
              library.logStep(sdVal + ' sd value is same as expected value ' + SD);
              library.scrollToElement(pointEle);
              pointEle.getText().then(function (pointVal) {
                if (pointVal === Point) {
                  console.log('true 3');
                  console.log('+++++++++++');
                  library.logStep(pointVal + ' point value is same as expected value ' + Point);
                  resolve(true);
                }
              });
            }
          });
        }
      });


      // console.log('=======> ')
      /* if (mean === false && sd === false && point === false) {
        console.log('true 4')
        displayed = true;
        library.logStep('Mean SD Point value verified successfully');
        resolve(displayed);
      } else {
        console.log('false 4')
        displayed = false;
        library.logFailStep('Mean SD Point values not same as entered value.');
        resolve(displayed);
      } */
    });
  }

  verifyEnteredValueStoredL2(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      dashBoard.waitForElement();
      const ele23 = element(by.xpath('23'));
      ele23.isDisplayed().then(function () {
        library.scrollToElement(ele23);
        ele23.click().then(function () {
          dashBoard.waitForElement();
        });
      }).catch(function () {
        const ele13 = element(by.xpath('13'));
        ele13.isDisplayed().then(function () {
          library.scrollToElement(ele13);
          ele13.click().then(function () {
            dashBoard.waitForElement();
          });
        }).catch(function () {
          dashBoard.waitForElement();
        });
        dashBoard.waitForElement();
      });
      dashBoard.waitForPage();
      const meanEle = element(by.xpath(mean1Lvl2));

      library.scrollToElement(meanEle);
      const sdEle = element(by.xpath(sd1Lvl2));

      const pointEle = element(by.xpath(point1Lvl2));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {
        if (meanVal.includes(expectedMean)) {
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sdEle.getText().then(function (sdVal) {
        if (sdVal.includes(expectedSD)) {
          sd = true;
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
        } else {
          sd = false;
        }
      });
      pointEle.getText().then(function (pointVal) {
        if (pointVal.includes(expectedPoint)) {
          point = true;
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
        }
        if (mean === true && sd === true && point === true) {
          displayed = true;
          library.logStep('Mean SD Point value of L2  verified successfully');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Mean SD Point value  of L2 not verified successfully');
          resolve(displayed);
        }
      });
    });
  }

  // verifyLevelEntryUsingEnterKey(mapValues, tabElement) {
  //   let result = false;
  //   return new Promise((resolve) => {
  //     mapValues.forEach(function (key, value) {
  //       const data = element(by.xpath('//*[@id="' + value + '"]'));
  //       library.scrollToElement(data);
  //       data.sendKeys(key).then(function () {
  //         library.logStep(key + ' value is entered at ' + value);
  //         data.sendKeys(protractor.Key.ENTER).then(function () {
  //           library.logStep('Enter key is pressed.');
  //           const key1 = tabElement.get(value);
  //           if (key1 === '30') {
  //           } else {
  //             const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
  //             library.scrollToElement(focusedElement);

  //             focusedElement.getAttribute('class').then(function (focus) {
  //               if (focus.includes('mat-focused')) {
  //                 library.logStep('Cursor focused at ' + key1);
  //                 result = true;
  //                 resolve(result);
  //               } else {
  //                 result = false;
  //                 resolve(result);
  //               }
  //             });
  //           }
  //         });
  //       });
  //     });
  //   });
  // }

  // verifyRunEntryUsingEnterKey(mapValues, tabElement) {
  //   let result = false;
  //   return new Promise((resolve) => {
  //     mapValues.forEach(function (key, value) {
  //       const data = element(by.xpath('//*[@id="' + value + '"]'));
  //       library.scrollToElement(data);
  //       data.sendKeys(key).then(function () {
  //         library.logStep(key + ' value is entered at ' + value);
  //         data.sendKeys(protractor.Key.ENTER).then(function () {
  //           library.logStep('Enter key is pressed.');
  //           const key1 = tabElement.get(value);
  //           if (key1 === '37') {
  //           } else {
  //             const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
  //             library.scrollToElement(focusedElement);

  //             focusedElement.getAttribute('class').then(function (focus) {
  //               if (focus.includes('mat-focused')) {
  //                 result = true;
  //                 library.logStep('Cursor focused at ' + key1);
  //                 resolve(result);
  //               } else {
  //                 result = false;
  //                 resolve(result);
  //               }
  //             });
  //           }
  //         });
  //       });
  //     });
  //   });
  // }

  verifyDisplayedMonth(mon) {
    let verifyMonth = false;
    return new Promise((resolve) => {
      const dispDateEle = element(by.xpath(displayMonth));
      const month = findElement(locatorType.XPATH, displayMonth);
      dispDateEle.getAttribute('textContent').then(function (text) {
        if (text.includes(mon)) {
          verifyMonth = true;
          resolve(verifyMonth);
        } else {
          verifyMonth = false;
          resolve(verifyMonth);
        }
      });
    });
  }
  // VerifyFuturedateAndSelectPrevYearDisabled(lastYear) {
  //   let disabled = false;
  //   return new Promise((resolve) => {
  //     const calendarSelect = findElement(locatorType.CLASSNAME, calender);
  //     calendarSelect.click();
  //       const prevYear = element
  //        (by.xpath
  // tslint:disable-next-line: max-line-length
  //        ('.//td[@class="mat-calendar-body-cell mat-focus-indicator mat-calendar-body-disabled ng-star-inserted"][@aria-label="' + lastYear + '"]'));
  //       prevYear.getAttribute('aria-disabled').then(function (status) {
  //         if (status === 'true') {
  //           element(by.className(calenderSelect)).click().then(function () {
  //             dashBoard.waitForElement();
  //             dashBoard.waitForElement();
  //             const setFutureDate = element(by.xpath(nextMonthDisabled));
  //             setFutureDate.isDisplayed().then(function () {
  //               dashBoard.waitForElement();
  //               const date = element(by.xpath('//*[text()="2"]'));
  //               library.clickJS(date);
  //               browser.sleep(3000);
  //               disabled = true;
  //               resolve(disabled);
  //             }).catch(function () {
  //               disabled = false;
  //               resolve(disabled);
  //             });
  //           });
  //         } else {
  //           element(by.xpath('.//div[contains(text(), "' + yy + '")]')).click().then(function () {
  //             dashBoard.waitForElement();
  //             element(by.xpath(today)).click().then(function () {
  //               dashBoard.waitForElement();
  //               element(by.xpath('.//div[text() ="1"]')).click().then(function () {
  //                 dashBoard.waitForElement();
  //                 dashBoard.waitForPage();
  //                 element(by.xpath(tblLink)).click();
  //                 disabled = false;
  //                 resolve(disabled);
  //               });
  //             });
  //           });
  //         }
  //       });
  //   });
  // }

  verifySDCharType(testVal) {
    return new Promise((resolve) => {
      let verifySdCharType = false;
      // element(by.id('12')).sendKeys(testVal);
      // const tLen = testVal.length;
      // element(by.id('12')).sendKeys('10');
      // element(by.id('13')).sendKeys('15');
      // element(by.id(submitButton)).click().then(function () {
      browser.sleep(8000);
      library.scrollToElement(element(by.xpath(sdChar)));
      element(by.xpath(sdChar)).getText().then(function (dispVal) {
        if (dispVal !== testVal) {
          verifySdCharType = true;
          resolve(verifySdCharType);
          library.logStep('SD value not entered');
          console.log('SD value not entered');
        } else {
          verifySdCharType = false;
          library.logStep('SD value entered');
          resolve(verifySdCharType);
        }
      });
    });
  }
  // verifySdCharType(testVal) {
  //   return new Promise((resolve) => {
  //     let verifySdCharType = false;
  //     element(by.id('12')).sendKeys(testVal);
  //     const tLen = testVal.length;
  //     // element(by.id('11')).sendKeys('10');
  //     // element(by.id('13')).sendKeys('15');
  //    // dashBoard.waitForScroll();
  //     element(by.id(submitButton)).click().then(function () {
  //       browser.sleep(8000);
  //       library.scrollToElement(element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk - column - label mat'
  //         + ' - column - label ng - star - inserted"][.="sd"]//following-sibling::td[2]/div/div')));
  //       // element(by.xpath
  //       // ('(.//div[@class='ng-star-inserted']//span[@class='ng-star-inserted'])[2]')).getText().then(function(dispVal) ;
  //       // element(by.xpath('.//td[@class='br-uppercase mat-small mat-cell cdk-column-label mat-column-label ng-star-inserted'][.='sd']'
  //       // +'//following-sibling::td[2]/div/div')).click().then(function () {
  //       element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk - column - label mat - column'
  //         + ' - label ng - star - inserted"][.="sd"]//following-sibling::td[2]/div/div')).getText().then(function (dispVal) {
  //           if (dispVal !== testVal) {
  //             verifySdCharType = true;
  //             resolve(verifySdCharType);
  //           } else {
  //             verifySdCharType = false;
  //             resolve(verifySdCharType);
  //           }
  //         });
  //     });
  //   });
  // }

  enterComment(commentText) {
    let enterComment = false;
    return new Promise((resolve) => {
      const addCommentTxtEle = element(by.xpath(addCommentTextBox));
      library.scrollToElement(addCommentTxtEle);
      addCommentTxtEle.sendKeys(commentText).then(function () {
        library.logStep(commentText + ' comment entered.');
        dashBoard.waitForPage();
        enterComment = true;
        resolve(enterComment);
      });
    });
  }

  OptionNotDisplayed() {
    let flag = true;
    return new Promise((resolve) => {
      const addCommentTxtEle = element(by.xpath(optionsForm));
      addCommentTxtEle.isDisplayed().then(function () {
        flag = true;
        resolve(flag);
      }).catch(function () {
        flag = false;
        resolve(flag);
      });
    });
  }

  clickTestCollapse() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let flag = false;
      const chevron = element(by.className(testCollapse));
      chevron.click().then(function () {
        dashBoard.waitForPage();
        library.logStep('Chevron clicked.');
        flag = true;
      }).then(function () {
        resolve(flag);
      });
    });
  }

  clickBack() {
    let flag = false;
    return new Promise((resolve) => {
      const navEle = findElement(locatorType.XPATH, backArrrow);
      library.clickJS(navEle);
      library.logStep('Navigation back arrow clicked.');
      flag = true;
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');
      resolve(flag);
    });
  }

  verifyRunEntry(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value entered at ' + value);
          data.sendKeys(protractor.Key.TAB).then(function () {
            library.logStep('TAB pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '37' || key1 === '21') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus1) {
                if (focus1.includes('mat-focused')) {
                  library.logStep('Cursor focused at ' + key1);
                  result = true;
                  resolve(result);
                } else {
                  library.logFailStep('Cursor focused not at ' + key1);
                  result = false;
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }



  verifyRunEntrySelection() {
    let verifyRunEntrySelection = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In verify Run Entry Selection');
      dashBoard.waitForElement();
      const runRadio = element(by.xpath(runEntryRadioBtn));
      runRadio.getAttribute('value').then(function (status) {
        if (status) {
          log4jsconfig.log().info('Pass: Run Entry is Selected');
          verifyRunEntrySelection = true;
          resolve(verifyRunEntrySelection);
        } else {
          log4jsconfig.log().info('Fail: Run Entry is not selected');
          verifyRunEntrySelection = false;
          resolve(verifyRunEntrySelection);
        }
      });
    });
  }


  verifyLevelEntry(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value entered at ' + value);
          data.sendKeys(protractor.Key.TAB).then(function () {
            library.logStep('TAB pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '30') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus2) {
                if (focus2.includes('mat-focused')) {
                  result = true;
                  library.logStep('Cursor focused at ' + key1);
                  resolve(result);
                } else {
                  result = false;
                  library.logFailStep('Cursor is not focused at ' + key1);
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  goToDataTable() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const dataTable = element(by.xpath(dataTableTab));
      library.clickJS(dataTable);
      dashBoard.waitForElement();
      status = true;
      library.logStep('User is on Data table page.');
      resolve(status);
    });
  }

  verifyErrorMsgDisplayed(verifyErrorMsgDisplayed) {
    let status = false;
    return new Promise((resolve) => {
      browser.wait(element(by.xpath('//mat-hint[contains(text(),"' + verifyErrorMsgDisplayed + '")]')).isPresent());
      const error = element(by.xpath('//mat-hint[contains(text(),"' + verifyErrorMsgDisplayed + '")]'));
      library.hoverOverElement(error);
      library.scrollToElement(error);
      error.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot(verifyErrorMsgDisplayed + ' error message displayed.', 'errorMessageDisplayed');
        resolve(status);
      }).catch(function () {
        library.logFailStep(verifyErrorMsgDisplayed + ' error message not displayed.');
        status = false;
        resolve(status);
      });
    });
  }

  verifySubmitButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      dashBoard.waitForElement();
      const error = findElement(locatorType.XPATH, submitDisabled);
      error.isDisplayed().then(function () {
        library.logStep('Submit data button is Disabled.');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit data button is not Disabled.');
        status = false;
        resolve(status);
      });
    });
  }

  clearValues(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dataMap.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.clear().then(function () {
          dashBoard.waitForElement();
          library.logStep('Value cleared at ' + value);
          status = true;
          resolve(status);
        });
      });
    });
  }

  clickSpcRule() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let spcrules = false;
      const spcRules1 = element(by.css(spclink));
      spcRules1.click().then(function () {
        dashBoard.waitForPage();
        library.logStep('SPC Rule page is displayed.');
        spcrules = true;
      }).then(function () {
        resolve(spcrules);
      });
    });
  }

  clickSaveData() {
    let save = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      element(by.xpath(saveDataBtn)).click().then(function () {
        dashBoard.waitForElement();
        library.logStep('Dont Save Data button clicked.');
        save = true;
        resolve(save);
      });
    });
  }

  verifyEnteredValueStoredTest2(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      const ele23 = element(by.id('23'));
      ele23.click().then(function () {
      });
      dashBoard.waitForPage();
      const meanEle = element(by.xpath(test2Mean));

      const sdEle = element(by.xpath(test2SD));

      const pointEle = element(by.xpath(test2Point));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (mean_Val) {
        if (mean_Val === expectedMean) {
          mean = true;
          library.logStep(mean_Val + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
          library.logFailStep(mean_Val + ' mean value is not same as expected value ' + expectedMean);
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sd_Val) {
        if (sd_Val === expectedSD) {
          sd = true;
          library.logStep(sd_Val + ' SD value is same as expected value ' + expectedSD);
        } else {
          sd = false;
          library.logFailStep(sd_Val + ' SD value is not same as expected value ' + expectedSD);
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (point_Val) {
        if (point_Val === (expectedPoint)) {
          point = true;
          library.logStep(point_Val + ' point value is same as expected value ' + expectedPoint);
        } else {
          library.logFailStep(point_Val + ' point value is not same as expected value ' + expectedPoint);
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredL3AllTest(expectedMean, expectedSD, expectedPoint, test) {
    let mean = false, sd = false, point = false, displayed = false;
    let mean_Ele, sd_Ele, point_Ele;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (test === '1') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]' +
          '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      } else if (test === '2') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      } else if (test === '3') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      } else if (test === '4') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      } else if (test === '5') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      } else if (test === '6') {
        mean_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[1]/td[4]/div/div/span)[' + test + ']'));

        sd_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[2]/td[4]/div/div/span)[' + test + ']'));

        point_Ele = element(by.xpath('(//br-analyte-summary-view/section/div[2]/div[1]'
          + '/table/tbody/tr[3]/td[4]/div/div/span)[' + test + ']'));

      }
      library.scrollToElement(mean_Ele);
      mean_Ele.getText().then(function (meanVal) {
        if (meanVal.includes(expectedMean)) {
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sd_Ele.getText().then(function (sdVal) {
        if (sdVal.includes(expectedSD)) {
          sd = true;
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
        } else {
          sd = false;
        }
      });
      point_Ele.getText().then(function (pointVal) {
        if (pointVal.includes(expectedPoint)) {
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
          point = true;
        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('Mean SD Point value constified successfully');
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredTestNew(expectedMean, expectedSD, expectedPoint) {
    browser.sleep(10000);
    let mean = false, sd = false, point = false, displayed = false, result = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const dateAdded = findElement(locatorType.XPATH, date);
      dateAdded.getText().then(function (date1) {
        console.log('date :' + date1);
        const scrollEle1 = element(by.xpath(scrollFirstTest));

        scrollEle1.isDisplayed().then(function () {
          element.all(by.xpath(analyteDate)).then(function (test1) {
            library.logStep('Data is present.');

            for (let i = 0; i < test1.length; i++) {
              test1[i].getText().then(function (analytedate) {
                if (analytedate.includes(date1)) {
                  const meanEle = findElement(locatorType.XPATH, meanElnew);
                  const sdEle = element(by.xpath(sdEl));
                  const pointEle = element(by.xpath(pointEl));
                  library.scrollToElement(meanEle);
                  meanEle.getText().then(function (meanVal) {
                    browser.sleep(5000);
                    if (meanVal === expectedMean) {
                      mean = true;
                      console.log('meanEle' + meanEle);
                    } else {
                      mean = false;
                    }
                  });
                  library.scrollToElement(sdEle);
                  sdEle.getText().then(function (sdVal) {
                    browser.sleep(5000);
                    if (sdVal.includes(expectedSD)) {
                      sd = true;
                      console.log('sdval' + sdVal);
                    } else {
                      sd = false;
                    }
                  });
                  library.scrollToElement(pointEle);
                  pointEle.getText().then(function (pointVal) {
                    browser.sleep(5000);


                    if (pointVal.includes(expectedPoint)) {
                      point = true;
                      console.log('pointval' + pointVal);

                    } else {
                      point = false;
                    }
                  });
                  if (mean === true && sd === true && point === true) {
                    displayed = true;
                    library.logStep('verified entered value stored test');
                    console.log('verified entered value stored test');
                    resolve(displayed);
                  }
                }
              });
            }
          });
        });
        result = true;
        resolve(result);
      }).catch(function () {
        result = false;
        resolve(result);
      });
    });
  }

  verifyEnteredValueStoredTestPriorDateTime(expectedMean, expectedSD, expectedPoint, year, mon) {
    let status = false;
    return new Promise((resolve) => {
      const meanval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedMean + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]/following-sibling::span[contains(text(),"' + year + '")]');
      const sdval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedSD + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]/following-sibling::span[contains(text(),"' + year + '")]');
      const pointval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedPoint + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]/following-sibling::span[contains(text(),"' + year + '")]');
      library.scrollToElement(meanval);
      library.clickJS(meanval);
      if (meanval.isDisplayed() && sdval.isDisplayed() && pointval.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Prior date mean, sd, point is disaplayed on analyte level page along with the month and year', 'dataAdded');
        resolve(status);
      } else {
        status = false;
        library.logStepWithScreenshot('Prior date mean, sd, point is not disaplayed on analyte level page along with the month and year', 'dataAdded');
        resolve(status);
      }
    });
  }
  verifyEnteredValueStoredTestMonth(expectedMean, expectedSD, expectedPoint, mon) {
    let status = false;
    return new Promise((resolve) => {
      console.log('//span[contains(text(),"' + expectedMean + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]');
      const meanval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedMean + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]');
      const sdval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedSD + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]');
      const pointval = findElement(locatorType.XPATH, '//span[contains(text(),"' + expectedPoint + '")]/ancestor::tbody/ancestor::div[2]/preceding-sibling::div/span[contains(text(),"' + mon + '")]');
      library.scrollToElement(meanval);
      library.clickJS(meanval);
      if (meanval.isDisplayed() && sdval.isDisplayed() && pointval.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Prior date mean, sd, point is disaplayed on analyte level page along with the month and year', 'dataAdded');
        resolve(status);
      } else {
        status = false;
        library.logStepWithScreenshot('Prior date mean, sd, point is not disaplayed on analyte level page along with the month and year', 'dataAdded');
        resolve(status);
      }
    });
  }

  verifyEnteredValueStoredL2Test2(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const meanEle = element(by.xpath(mean1L2test2));

      library.scrollToElement(meanEle);
      const sdEle = element(by.xpath(sd1L2test2));

      const pointEle = element(by.xpath(point1L2test2));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (mean_Val) {
        if (mean_Val.includes(expectedMean)) {
          mean = true;
          library.logStep(mean_Val + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sdEle.getText().then(function (sd_Val) {
        if (sd_Val.includes(expectedSD)) {
          sd = true;
          library.logStep(sd_Val + ' sd value is same as expected value ' + expectedSD);
        } else {
          sd = false;
        }
      });
      pointEle.getText().then(function (point_Val) {
        if (point_Val.includes(expectedPoint)) {
          point = true;
          library.logStep(point_Val + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('Mean SD Point value constified successfully');
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredL2Test2InstrumentLvl(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const meanEle = element(by.xpath(mean1L2test1Inst));

      library.scrollToElement(meanEle);
      const sdEle = element(by.xpath(sd1L2test1Inst));

      const pointEle = element(by.xpath(point1L2test1Inst));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (mean_Val) {
        if (mean_Val.includes(expectedMean)) {
          mean = true;
          library.logStep(mean_Val + ' mean value is same as expected value ' + expectedMean);
        } else {
          mean = false;
        }
      });
      sdEle.getText().then(function (sd_Val) {
        if (sd_Val.includes(expectedSD)) {
          sd = true;
          library.logStep(sd_Val + ' sd value is same as expected value ' + expectedSD);
        } else {
          sd = false;
        }
      });
      pointEle.getText().then(function (point_Val) {
        if (point_Val.includes(expectedPoint)) {
          point = true;
          library.logStep(point_Val + ' point value is same as expected value ' + expectedPoint);
        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('Mean SD Point value constified successfully');
        resolve(displayed);
      }
    });
  }

  veryfyL2ValuesNotDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const meanEle = element(by.xpath(meanValNotDisplay));
      meanEle.isDisplayed().then(function () {
        library.logStep('Mean value is not displayed.');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  verifyLevelEntryUsingEnterKey(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value is entered at ' + value);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            library.logStep('Enter key is pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '30') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);

              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  library.logStep('Cursor focused at ' + key1);
                  result = true;
                  resolve(result);
                } else {
                  result = false;
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  verifyRunEntryUsingEnterKey(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@id="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          library.logStep(key + ' value is entered at ' + value);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            library.logStep('Enter key is pressed.');
            const key1 = tabElement.get(value);
            if (key1 === '37') {
            } else {
              const focusedElement = element(by.xpath('//*[@id=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  library.logStep('Cursor focused at ' + key1);
                  resolve(result);
                } else {
                  result = false;
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  } verifyDateTimePicker() {
    return new Promise((resolve) => {
      let displayed = false;
      const date = element(by.id(dateUndefined));
      date.isDisplayed().then(function () {
        displayed = true;
        library.logStep('Date Time Picker is displayed.');
        resolve(displayed);
      }).catch(function () {
        library.logStep('Date Time Picker is not displayed.');
        displayed = false;
        resolve(displayed);
      });
    });
  }
  async clickSubmitButton() {
    let status = false;
    const submit = await element(by.xpath(submitButton));
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(submit), 8888);
    await submit.click();
    library.logStep('Submit button is clicked.');
    await library.waitLoadingImageIconToBeInvisible();
    status = true;
    return status;
  }
  verifyEnteredValueStoredNew(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const ele23 = element(by.xpath('23'));
      ele23.isDisplayed().then(function () {
        library.scrollToElement(ele23);
        ele23.click().then(function () {
          dashBoard.waitForElement();
        });
      }).catch(function () {
        const ele13 = element(by.xpath('13'));
        ele13.isDisplayed().then(function () {
          library.scrollToElement(ele13);
          ele13.click().then(function () {
            dashBoard.waitForElement();
          });
        }).catch(function () {
          dashBoard.waitForElement();
        });
        dashBoard.waitForElement();
      });
      browser.actions()
        .mouseMove(element(by.id(cancelButton)))
        .perform();
      const cancelBtn = element(by.id(cancelButton));
      library.clickJS(cancelBtn);

      const meanEle = findElement(locatorType.XPATH, mean1);

      library.scrollToElement(meanEle);
      const sdEle = element(by.xpath(sd1));

      const pointEle = element(by.xpath(point1));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {
        if (meanVal === expectedMean) {
          mean = true;
          library.logStep(meanVal + ' mean value is same as expected value ' + expectedMean);
          console.log(' mean value is same as expected value ');
        } else {
          mean = false;
          library.logFailStep(meanVal + ' mean value is not same as expected value ' + expectedMean);
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sdVal) {
        if (sdVal === expectedSD) {
          sd = true;
          library.logStep(sdVal + ' sd value is same as expected value ' + expectedSD);
          console.log(' sd value is same as expected value ');
        } else {
          sd = false;
          library.logFailStep(sdVal + ' mean value is not same as expected value ' + expectedSD);
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (pointVal) {
        if (pointVal === expectedPoint) {
          point = true;
          library.logStep(pointVal + ' point value is same as expected value ' + expectedPoint);
          console.log(' point value is same as expected value ');
        } else {
          point = false;
          library.logFailStep(pointVal + ' mean value is not same as expected value ' + expectedPoint);
        }
        console.log(mean + ' and ' + sd + ' and ' + point);
        if (mean === true && sd === true && point === true) {
          displayed = true;
          library.logStep('Mean SD Point value verified successfully');
          console.log(' Mean SD Point value verified successfully');
          resolve(displayed);
        } else {
          displayed = false;
          library.logFailStep('Mean SD Point values not same as entered value.');
          resolve(displayed);
        }
      });
    });
  }

  setFutureDate() {
    let set = false;
    return new Promise((resolve) => {
      const datePicker = element(by.className(datePick));
      datePicker.click();
      const nextMonth = element(by.className(calenderNext));
      nextMonth.isDisplayed().then(function () {
        nextMonth.click();
        dashBoard.waitForElement();
      }).catch(function () {
      });
      const nextMonthDisabled1 = element(by.xpath(nextMonthDisabled));
      if (nextMonthDisabled1.isDisplayed()) {
        const selectedDate = element(by.xpath(dateSelected));
        selectedDate.click();
        set = true;
        resolve(set);
      } else {
        set = false;
        resolve(set);
      }
    });
  }

  addComment(cmnt, test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let comment = false;
      const commentAdd = element(by.xpath(addCommentTxtArea));
      commentAdd.isDisplayed().then(function () {
        library.scrollToElement(commentAdd);
        commentAdd.sendKeys(cmnt).then(function () {
          comment = true;
          resolve(comment);
        });
      });
    });
  }

  verifyCommentAndInteractionIcon(cmntCountExpected, cmnt, test) {
    let verified, flag1, flag2;
    let flag3 = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const cmntIcon = element(by.xpath('(//span[contains(@class,"grey pez")])[' + test + ']'));
      library.scrollToElement(cmntIcon);
      const cmntCount = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      const interIcon = element(by.xpath('(//span[contains(@class, "grey pez icon-Reviewers")])[' + test + ']'));
      library.scrollToElement(interIcon);
      const interCount = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      cmntCount.getText().then(function (cmnt_Text) {
        interCount.getText().then(function (inter_Text) {
          if (cmnt_Text.includes(cmntCountExpected) && inter_Text.includes(cmntCountExpected)
            && cmntIcon.isDisplayed() && interIcon.isDisplayed()) {
            library.scrollToElement(cmntIcon);
            browser.actions().mouseMove(element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'))).perform();
            dashBoard.waitForElement();
            flag1 = true;
          } else {
            flag1 = false;
          }
          library.hoverOverElement(cmntCount);
          console.log('hovered');
          //  browser.actions().mouseMove(element(by.xpath('(//em[@class='spc_pezcell_comments_number'])[' + test + ']'))).perform();
          dashBoard.waitForElement();
          const commentValue = element(by.xpath(cmtVal));
          library.scrollToElement(commentValue);
          commentValue.getText().then(function (actualText) {
            if (actualText.includes(cmnt)) {
              library.clickJS(commentValue);
              flag2 = true;
              const icon = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
              icon.click().then(function () {
                dashBoard.waitForElement();
              });
            } else {
              flag2 = false;
            }
            dashBoard.waitForElement();
            browser
              .actions()
              .mouseMove(element(by.xpath(wndCount)))
              .perform()
              .then(function () {
              });
            const windowCmt = element(by.xpath(wndCount));
            library.scrollToElement(windowCmt);
            windowCmt.getText().then(function (actualCommentCmtIcon) {
              const done = element(by.xpath('//button[text()="DONE"]'));
              done.click().then(function () {
                dashBoard.waitForElement();
              });
              dashBoard.waitForElement();
              const inter_Icon = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
              library.scrollToElement(inter_Icon);
              inter_Icon.click().then(function () {
                dashBoard.waitForElement();
                dashBoard.waitForElement();
                const windowCmtInter = element(by.xpath(wndCount));
                library.scrollToElement(windowCmtInter);
                windowCmtInter.getText().then(function (actualCommentInterIcon) {
                  done.click().then(function () {
                    dashBoard.waitForElement();
                    /*
                                            //Code to handle IE browser Issue
                                            const mean1 = element(by.xpath('//*[@id='11']'));
                                            mean1.isDisplayed().then(function () {
                                             library.scrollToElement(mean1)
                                              mean1.sendKeys(protractor.Key.ESCAPE).then(function () {
                                              }).catch(function () {
                                                const cancelBtn1 = element(by.id(cancelButton));
                                                cancelBtn1.click().then(function () {
                                                  dashBoard.waitForElement();
                                                })
                                              })*/
                    library.scrollToElement(interIcon);
                    if (actualCommentInterIcon.includes(cmnt) && actualCommentCmtIcon.includes(cmnt)) {
                      flag3 = true;
                    } else {
                      flag3 = false;
                    }
                  });
                });
                if (flag1 === true && flag2 === true && flag3 === true) {
                  verified = true;
                  resolve(verified);
                }
              });
            });
          });
        });
      });
    });
  }

  verifyCommentAndCount(cmntCountExpected, cmnt, test, checkOnlyCount) {
    return new Promise((resolve) => {
      let flag1 = false;
      let flag2 = false;
      let status = false;
      browser.actions().mouseMove(element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'))).perform();
      dashBoard.waitForElement();
      const cmt = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      cmt.getText().then(function (actualcnt) {
        if (actualcnt.includes(cmntCountExpected)) {
          flag1 = true;
        } else {
          flag1 = false;
        }
        dashBoard.waitForElement();
        if (checkOnlyCount === false) {
          const commentValue = element(by.xpath(cmtVal));
          library.scrollToElement(commentValue);
          commentValue.getText().then(function (actualText) {
            const mean_1 = element(by.xpath(firstMean));
            mean_1.isDisplayed().then(function () {
              library.scrollToElement(mean_1);
              mean_1.sendKeys(protractor.Key.ESCAPE).then(function () {
                library.scrollToElement(cmt);
              });
            }).catch(function () {
              //
              if (actualText.includes(cmnt)) {
                flag2 = true;
              } else {
                flag2 = false;
              }
            });
          });
          if (flag1 === true && flag2 === true) {
            status = true;
            resolve(status);
          }
        }
        if (flag1 === true) {
          status = true;
          resolve(status);
        }
      });
    });
  }

  addCommentCollapse() {
    return new Promise((resolve) => {
      let collapse = false;
      const comment1 = element(by.xpath(addCmtText));
      comment1.isDisplayed().then(function () {
      }).catch(function () {
        collapse = true;
        resolve(collapse);
      });
    });
  }

  verifySubmitButtonEnabledinTestSummaryView() {
    let status = false;
    return new Promise((resolve) => {
      const error = element(by.xpath(testSummarySubmit));
      error.isDisplayed().then(function () {
        error.click();
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  clearAllTestsData(test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let cleared = false;
      // const testName = element(by.xpath('//span[contains(text(),'' + test + '')]'));
      const testName = element(by.xpath('//mat-nav-list//div[contains(text(),"' + test + '")]'));
      testName.isDisplayed().then(function () {
        library.clickJS(testName);
        library.logStep(test + ' is clicked.');
        dashBoard.waitForElement();
      }).then(function () {
        dashBoard.waitForElement();
        browser.sleep(10000);
        const scrollEle1 = element(by.xpath(scrollFirstTest));
        scrollEle1.isDisplayed().then(function () {
          element.all(by.xpath(allTest)).then(function (test1) {
            library.logStep('Data is present.');
            for (let i = 0; i < test1.length; i++) {
              dashBoard.waitForElement();
              const scrollEle = element(by.xpath(scrollFirstTest));
              library.scrollToElement(scrollEle);
              library.clickJS(scrollEle);
              dashBoard.waitForElement();
              const deleteDataSet = element(by.xpath(deleteData));
              library.clickJS(deleteDataSet);
              const confirmDelete = element(by.id('dialog_button2'));
              library.clickJS(confirmDelete);
              library.logStep('Confirm Delete Button is clicked.');
              dashBoard.waitForPage();
              cleared = true;
              resolve(cleared);
            }
          });
        }).catch(function () {
          cleared = true;
          resolve(cleared);
        });
      });
    });
  }

  verifySortingOfAnalyteSummeryEntryIntrumentBased(expectedTest1, expectedTest2, expectedTest3, instruFlag) {
    return new Promise((resolve) => {
      let sorted = false;
      element(by.xpath(test1H)).getText().then(function (test1) {
        const test2Elel = element(by.xpath(test2H));
        library.scrollToElement(test2Elel);
        test2Elel.getText().then(function (test2) {
          const test3Ele2 = element(by.xpath(test3H));
          library.scrollToElement(test3Ele2);
          test3Ele2.getText().then(function (test3) {
            console.log(test1 + '' + expectedTest1 + '' + test2 + '' + expectedTest2 + '' + test3 + '' + expectedTest3);
            if (test1 === expectedTest1 && test2 === expectedTest2 && test3 === expectedTest3) {
              library.logStep('Analyte sorting is displayed as :' + test1 + ', ' + test2 + ', ' + test3);
              sorted = true;
              resolve(sorted);
            } else {
              library.logFailStep('Analyte sorting is displayed as :' + test1 + ', ' + test2 + ', ' + test3);
              sorted = false;
              resolve(sorted);
            }
          });
        });
      });
    });
  }

  navigateToInstrument(instrumentId) {
    return new Promise((resolve) => {
      let navigateToInstrument = false;
      const ele = element(by.xpath('.//span[@class="ml-2 line-height-fix ng-star-inserted"][text()=" ' + instrumentId + ' "]'));
      library.clickAction(ele);
      browser.sleep(5000);
      navigateToInstrument = true;
      resolve(navigateToInstrument);
    });
  }

  verifyDontSaveBtnClick(instrumentId) {
    return new Promise((resolve) => {
      let verifyDontSaveBtnClick = false;
      element(by.id('dialog_button1')).click()
        .then(function (clicked) {
          library.logStep('Dont save button clicked');
          dashBoard.waitForPage();
          const pageHeading = element(by.xpath(pageheading));
          pageHeading.getText().then(function (head) {
            if (head.includes(instrumentId)) {
              verifyDontSaveBtnClick = true;
              resolve(verifyDontSaveBtnClick);
            } else {
              verifyDontSaveBtnClick = false;
              resolve(verifyDontSaveBtnClick);
            }
          });
        });
    });
  }

  changeDate(year, month, day) {
    let changeDate = false;
    return new Promise((resolve) => {
      //  const calenderIcon = findElement(locatorType.ID, 'changeDate');
      const calenderIcon = findElement(locatorType.CLASSNAME, calender);
      library.scrollToElement(calenderIcon);
      library.clickAction(calenderIcon);

      const cal = findElement(locatorType.CLASSNAME, calenderSelect);
      library.clickAction(cal);
      const yearEle = findElement(locatorType.XPATH, '//div[@class="mat-calendar-body-cell-content" and text()=" ' + year + ' "]');
      dashBoard.waitForScroll();
      library.clickJS(yearEle);
      const monthEle = findElement(locatorType.XPATH, '//div[@class="mat-calendar-body-cell-content" and text()=" ' + month + ' "]');
      dashBoard.waitForElement();
      library.clickJS(monthEle);
      const dateEle = element(by.xpath('//div[@class="mat-calendar-body-cell-content" and text()=" ' + day + ' "]'));
      library.clickJS(dateEle);
      changeDate = true;
      resolve(changeDate);
    });
  }

  changeDateCurrentMonth(year, month, day) {
    let changeDateCurrentMonth = false;
    return new Promise((resolve) => {
      browser.sleep(2000);
      element(by.className(calender)).click().then(function () {
        browser.sleep(3000);
        element(by.className(calenderSelect)).click().then(function () {
          browser.sleep(5000);
          element(by.className(currentYear)).click().then(function () {
            browser.sleep(3000);
            element(by.className(currentMon)).click().then(function () {
              browser.sleep(3000);
              // tslint:disable-next-line: no-shadowed-variable
              const date = element(by.xpath('//*[text()="' + day + '"]'));
              library.clickJS(date);
              browser.sleep(3000);
              changeDateCurrentMonth = true;
              resolve(changeDateCurrentMonth);
            });
          });
        });
      });
    });
  }

  verifyMonthYear(lastYear) {
    let verifyMonthYear = false;
    return new Promise((resolve) => {
      const dispDateEle = element(by.xpath(displatDate));
      dispDateEle.getAttribute('textContent').then(function (text) {
        const mYear = text.split(' ');
        const expMon = mYear[0];
        const expYear = mYear[1];
        if (expYear.match(lastYear)) {
          verifyMonthYear = true;
          resolve(verifyMonthYear);
        } else {
          verifyMonthYear = false;
          resolve(verifyMonthYear);
        }
      });
    });
  }

  verifyMonth(mon) {
    let verifyMonth = false;
    return new Promise((resolve) => {
      console.log('verify month');
      const dispDateEle = findElement(locatorType.XPATH, displatDate);
      library.clickJS(dispDateEle);
      dispDateEle.getText().then(function (monthText) {
        console.log(monthText);
        if (monthText.includes(mon)) {
          library.logStepWithScreenshot('Data is getting saved with the changed month', 'date');
          verifyMonth = true;
          resolve(verifyMonth);
        } else {
          library.logFailStep('Data is not getting saved with the changed month');
          verifyMonth = false;
          resolve(verifyMonth);
        }
      });
    });
  }

  verifyMonthMultiEntry(mon) {
    let verifyMonth = false;
    return new Promise((resolve) => {
      console.log('Inside verifyMonthMultiEntry ++++++++++>');
      console.log('verify month');
      const dispDateEle = findElement(locatorType.XPATH, '(//span[contains(text(),"' + mon + '")])[1]');
      if (dispDateEle.isDisplayed()) {
        library.logStepWithScreenshot('Month displayed correctly on multientry page', 'month');
        verifyMonth = true;
        resolve(verifyMonth);
      } else {
        library.logFailStep('Month is not displayed correctly on multientry page');
        verifyMonth = false;
        resolve(verifyMonth);
      }
    });
  }

  clickApply() {
    let clicked = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const apply = element(by.xpath(applyButton));
      library.clickJS(apply);
      library.logStep('Apply Button clicked. ');
      dashBoard.waitForElement();
      dashBoard.waitForPage();
      clicked = true;
      resolve(clicked);
    });
  }

  verifyToastMsg(toastMsg) {
    let msgDisplayed = false;
    return new Promise((resolve) => {
      const msg = element(by.xpath('//snack-bar-container/simple-snack-bar/span[contains(text(),"' + toastMsg + '")]'));
      msg.isDisplayed().then(function () {
        msgDisplayed = true;
        dashBoard.waitForPage();
        resolve(msgDisplayed);
      }).catch(function (error) {
        msgDisplayed = true;
        resolve(msgDisplayed);
      });
    });
  }

  verifyIntrumentLevelPageUIElements(instru_prod_Name) {
    let verified, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const header = element(by.className(headerInst));
      header.getText().then(function (text) {
        if (text.includes(instru_prod_Name)) {
          const runRadio = element(by.xpath(runRadioBtn));
          const levelRadio = element(by.xpath(levelRadioBtn));
          if (runRadio.isDisplayed() || levelRadio.isDisplayed()) {
            flag1 = true;
          }
        }
        const lot = element(by.xpath('//h5/span'));
        if (lot.isDisplayed()) {
          flag2 = true;
        }
        const test1 = element(by.xpath(test1H));
        const test1SummaryEntry1 = element(by.xpath(test1SummaryEntry));
        const test2 = element(by.xpath(test2H));
        const test2SummaryEntry1 = element(by.xpath(test2SummaryEntry));
        const test3 = element(by.xpath(test3H));
        const test3SummaryEntry1 = element(by.xpath(test3SummaryEntry));
        const dateTimePicker1 = element(by.id(dateTimePicker));
        const level11 = element(by.xpath(level1));
        const level21 = element(by.xpath(level2));
        if (test1.isDisplayed() && test1SummaryEntry1.isDisplayed() &&
          test2.isDisplayed() && test2SummaryEntry1.isDisplayed() &&
          test3.isDisplayed() && test3SummaryEntry1.isDisplayed() &&
          dateTimePicker1.isDisplayed() && level11.isDisplayed() && level21.isDisplayed()) {
          flag3 = true;
        }
        if (flag1 === flag2 === flag3 === true) {
          verified = true;
          resolve(verified);
        }
      });
    });
  }

  verifyIntrumentLevelPageUIElementsSixTests(instru_prod_Name) {
    let verified, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const header = element(by.className(headerInst));
      header.getText().then(function (text) {
        if (text.includes(instru_prod_Name)) {
          const runRadio = element(by.xpath(runRadioBtn));
          const levelRadio = element(by.xpath(levelRadioBtn));
          if (runRadio.isDisplayed() || levelRadio.isDisplayed()) {
            flag1 = true;
          }
        }
        const lot = element(by.xpath('//h5/span'));
        if (lot.isDisplayed()) {
          flag2 = true;
        }
        browser.actions().mouseMove(element(by.xpath(test1H))).perform();
        const test1 = element(by.xpath(test1H));
        const test1SummaryEntry1 = element(by.xpath(test1SummaryEntry));
        browser.actions().mouseMove(element(by.xpath(test2H))).perform();
        const test2 = element(by.xpath(test2H));
        const test2SummaryEntry1 = element(by.xpath(test2SummaryEntry));
        browser.actions().mouseMove(element(by.xpath(test3H))).perform();
        const test3 = element(by.xpath(test3H));
        const test3SummaryEntry1 = element(by.xpath(test3SummaryEntry));
        browser.actions().mouseMove(element(by.xpath(test4H))).perform();
        const test4 = element(by.xpath(test4H));
        const test4SummaryEntry1 = element(by.xpath(test1SummaryEntry));
        browser.actions().mouseMove(element(by.xpath(test5H))).perform();
        const test5 = element(by.xpath(test5H));
        const test5SummaryEntry1 = element(by.xpath(test2SummaryEntry));
        browser.actions().mouseMove(element(by.xpath(test6H))).perform();
        const test6 = element(by.xpath(test6H));
        const test6SummaryEntry1 = element(by.xpath(test3SummaryEntry));
        const dateTimePicker1 = element(by.id(dateTimePicker));
        browser.actions().mouseMove(element(by.xpath(level1))).perform();
        const level11 = element(by.xpath(level1));
        const level21 = element(by.xpath(level2));
        const level31 = element(by.xpath(level3));
        const level41 = element(by.xpath(level4));
        if (test1.isDisplayed() && test1SummaryEntry1.isDisplayed() && test2.isDisplayed()
          && test2SummaryEntry1.isDisplayed() && test3.isDisplayed() && test3SummaryEntry1.isDisplayed()
          && test4.isDisplayed() && test4SummaryEntry1.isDisplayed() && test5.isDisplayed() &&
          test5SummaryEntry1.isDisplayed() && test6.isDisplayed() && test6SummaryEntry1.isDisplayed() &&
          dateTimePicker1.isDisplayed() && level11.isDisplayed() && level21.isDisplayed()
          && level31.isDisplayed() && level41.isDisplayed()) {
          flag3 = true;
        }
        if (flag1 === flag2 === flag3 === true) {
          verified = true;
          resolve(verified);
        }
      });
    });
  }

  setDecimalPlaces(level12, level1Val, level22, level2Val, level32, level3Val, level42, level4Val) {
    let level = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (level12 === true) {
        const selectArrrow = element(by.xpath(decimalSelect1));
        library.clickAction(selectArrrow);
        const selectValue = element(by.xpath('//span[text()="' + level1Val + '"][@class="mat-option-text"]'));
        library.clickAction(selectValue);
        library.logStep(level1Val + ' value is set for Level 1');
        dashBoard.waitForElement();
      }
      if (level22 === true) {
        const selectArrrow2 = element(by.xpath(decimalSelect2));
        library.clickAction(selectArrrow2);
        const selectValue2 = element(by.xpath('//span[text()="' + level2Val + '"][@class="mat-option-text"]'));
        library.clickAction(selectValue2);
        library.logStep(level2Val + ' value is set for Level 2');
        dashBoard.waitForElement();
      }
      if (level32 === true) {
        const selectArrrow3 = element(by.xpath(decimalSelect3));
        library.clickAction(selectArrrow3);
        const selectValue3 = element(by.xpath('//span[text()="' + level3Val + '"][@class="mat-option-text"]'));
        library.clickAction(selectValue3);
        library.logStep(level3Val + ' value is set for Level 3');
        dashBoard.waitForElement();
      }
      if (level42 === true) {
        const selectArrrow4 = element(by.xpath(decimalSelect4));
        library.clickAction(selectArrrow4);
        const selectValue4 = element(by.xpath('//span[text()="' + level4Val + '"][@class="mat-option-text"]'));
        library.clickAction(selectValue4);
        dashBoard.waitForElement();
        library.logStep(level4Val + ' value is set for Level 4');
      }
      dashBoard.waitForElement();
      level = true;
      resolve(level);
    });
  }

  isLevel1CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(level1Cheked));
      error.isDisplayed().then(function () {
        status = true;
        resolve(status);
      });
    });
  }

  checkVerifySummaryEntryToggleButton() {
    let diplayed = false;
    return new Promise((resolve) => {
      const toggleButton = element(by.className(toggle));
      toggleButton.isDisplayed().then(function () {
        diplayed = true;
        resolve(diplayed);
      });
    });
  }

  verifyValuesNotStored(expectedMean, expectedSD, expectedPoint) {
    return new Promise((resolve) => {
      let mean, sd, point, notDisplayed = false;
      let verifyValuesNotStored = false;
      if (element(by.xpath('.//section[@class="wrapper analyte-summary-view-component"]')).isElementPresent) {
        dashBoard.waitForPage();
        const meanEle = element(by.xpath(meanNotStored));

        const sdEle = element(by.xpath(sdNotStored));
        const pointEle = element(by.xpath(pointNotStored));

        meanEle.getText().then(function (mVal) {
          if (mVal.indexOf(expectedMean) < 0) {
            mean = true;
          } else {
            mean = false;
          }
        });
        sdEle.getText().then(function (sVal) {
          if (sVal.indexOf(expectedSD) < 0) {
            sd = true;
          } else {
            sd = false;
          }
        });
        pointEle.getText().then(function (pVal) {
          if (pVal.indexOf(expectedPoint) < 0) {
            point = true;
          } else {
            point = false;
          }
        });
        if (mean === true && sd === true && point === true) {
          notDisplayed = true;
          verifyValuesNotStored = true;
          resolve(verifyValuesNotStored);
        }
      } else {
        verifyValuesNotStored = true;
        resolve(verifyValuesNotStored);
      }
    });
  }

  goToProductLevelOld(productName) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const product = element(by.xpath('//span[contains(text()," ' + productName + ' ")]/ancestor::div//em'));
      product.click().then(function () {
        dashBoard.waitForElement();
        status = true;
        return (status);
      });
    });
  }

  setPastDate(month) {
    return new Promise((resolve) => {
      const set = false;
      const datePicker = element(by.className(datepick));
      datePicker.click();
      const previousMonth = element(by.className(previousDate));
      if (month === '1') {
        previousMonth.click();
      } else if (month === '2') {
        previousMonth.click();
        dashBoard.waitForElement();
        previousMonth.click();
      } else {
      }
      const previousSetDate = element(by.xpath('(//mat-calendar-header//button/span)[1]'));
      previousSetDate.getText().then(function (selectedDate) {
        const firstDate = element(by.xpath('(//div[@class="mat - calendar - body - cell - content"])[1]'));
        firstDate.click();
        resolve(selectedDate);
      });
    });
  }

  verifyDateForTest(month) {
    return new Promise((resolve) => {
      const month3 = '2';
      let datePrev;
      const set = false;
      const datePicker = element(by.className(datepick));
      datePicker.click();
      const previousMonth = element(by.className(previousDate));
      if (month === '1') {
        previousMonth.click();
      } else if (month === '2') {
        previousMonth.click();
        dashBoard.waitForElement();
        previousMonth.click();
      } else {
        dashBoard.waitForElement();
      }
      const previousSetDate = element(by.xpath('(//mat-calendar-header//button/span)[1]'));
      previousSetDate.getText().then(function (selectedDate) {
        datePrev = selectedDate;
        const firstDate = element(by.xpath('(//div[@class="mat - calendar - body - cell - content"])[1]'));
        firstDate.click();
      });
      dashBoard.waitForElement();
      const submit = element(by.id(submitButton));
      submit.isDisplayed().then(function () {
        library.clickJS(submit);
        dashBoard.waitForPage();
      });
      let verified4 = false;
      dashBoard.waitForPage();
      const Albumin = element(by.xpath('//tree-node-collection/div/tree-node[1]/div/tree-node-children/div'
        + '/tree-node-collection/div/tree-node/div/tree-node-children/div/tree-node-collection/div/tree-node[1]'
        + '/div/tree-node-wrapper/div/div/tree-node-content/section/span/span'));
      library.clickJS(Albumin);
      dashBoard.waitForPage();
      const scrollEle = element(by.xpath(scrollFirstTest));
      library.scrollToElement(scrollEle);
      const summaryView = element(by.xpath('(//h6[@id="spc_summary_view_date"])[1]'));
      library.scrollToElement(summaryView);
      summaryView.getText().then(function (summaryDate) {
        const upperSummary = summaryDate;
        const monthVal = upperSummary.substring(0, 2);
        const up = month.toUpperCase();
        if (datePrev.includes(up)) {
          verified4 = true;
        }
        resolve(verified4);
      });
    });
  }

  VerifyFuturedateAndSelectPrevYearDisabled(yy) {
    let disabled = false;
    return new Promise((resolve) => {
      const lastYear = yy - 1;
      dashBoard.waitForElement();
      element(by.className(calenderSelect)).click().then(function () {
        dashBoard.waitForPage();
        const prevYear = element(by.xpath('.//td[@class="mat - calendar - body - cell mat - calendar - body'
          + ' - disabled ng - star - inserted"][@aria-label="' + lastYear + '"]'));
        prevYear.getAttribute('aria-disabled').then(function (status) {
          if (status === 'true') {
            element(by.className(calenderSelect)).click().then(function () {
              dashBoard.waitForElement();
              dashBoard.waitForElement();
              const setFutureDate = element(by.xpath(nextMonthDisabled));
              setFutureDate.isDisplayed().then(function () {
                dashBoard.waitForElement();
                // tslint:disable-next-line: no-shadowed-variable
                const date = element(by.xpath('//*[text()="2"]'));
                library.clickJS(date);
                browser.sleep(3000);
                disabled = true;
                resolve(disabled);
              }).catch(function () {
                disabled = false;
                resolve(disabled);
              });
            });
          } else {
            element(by.xpath('.//div[contains(text(), "' + yy + '")]')).click().then(function () {
              dashBoard.waitForElement();
              element(by.xpath(today)).click().then(function () {
                dashBoard.waitForElement();
                element(by.xpath('.//div[text() ="1"]')).click().then(function () {
                  dashBoard.waitForElement();
                  dashBoard.waitForPage();
                  element(by.xpath(tblLink)).click();
                  disabled = false;
                  resolve(disabled);
                });
              });
            });
          }
        });
      });
    });
  }

  selectPrevMonthDisabled() {
    return new Promise((resolve) => {
      let disabled = false;
      dashBoard.waitForPage();
      element(by.className(calender)).click();
      const prevMonth = element(by.className(previousDate));
      prevMonth.isEnabled().then(function (status) {
        if (status === false) {
          disabled = true;
          resolve(disabled);
        }
      });
    });
  }

  verifyModalComponent() {
    return new Promise((resolve) => {
      let verifyModalComponent, modalDisp, title2, text2, btn22, btn23 = false;
      dashBoard.waitForElement();
      const expTitle = 'You have unsaved data';
      const expMsg = 'If you navigate away from this page, your data will not be saved.';
      const btnTxt1 = 'Dont save data';
      const btnTxt2 = 'Save data and leave page';
      const modal = element(by.xpath('.//mat-dialog-container[@class="mat - dialog - container'
        + ' ng - tns - c42 - 140 ng - trigger ng - trigger - dialogContainer ng - star - inserted"]'));
      if (modal.isPresent) {
        modalDisp = true;
      }
      element(by.xpath(title)).getText()
        .then(function (title1) {
          if (title1.match(expTitle)) {
            title2 = true;
          }
        });

      element(by.className(message)).getText()
        .then(function (text1) {
          if (text1.match(expMsg)) {
            text2 = true;
          }
        });
      const bt1 = element(by.id(dontsave));
      bt1.getText()
        .then(function (btn1) {
          if (bt1.isDisplayed()) {
            btn22 = true;
          }
        });
      const bt2 = element(by.id(savedata));
      bt2.getText()
        .then(function (btn2) {
          if (bt1.isDisplayed()) {
            btn23 = true;
          }
        });
      if (modalDisp === title2 === text2 === btn22 === btn23 === true) {
        library.logStep('You have unsaved data model UI verified');
        verifyModalComponent = true;
        resolve(verifyModalComponent);
      } else {
        library.logFailStep('You have unsaved data model UI not verified');
        verifyModalComponent = false;
        resolve(verifyModalComponent);
      }
    });
  }

  closeModalDialog() {
    return new Promise((resolve) => {
      let closeModalDialog;
      const modalDisp = false;
      const modal = element(by.xpath(modal1));

      const clsIcn = element(by.css(closeDialog));

      clsIcn.click().then(function () {
        if (!modal.isPresent) {
          closeModalDialog = true;
          resolve(closeModalDialog);
        }
      });
    });
  }

  verifySummaryEntryComponents(instrument2, prod1, prod2, prod1Test1, prod2Test1) {
    return new Promise((resolve) => {
      let verifySummaryEntryComponents, instrumentId, prod1Id, prod2Id, prod1Test1id, prod2Test1id = false;
      dashBoard.waitForElement();

      const instHeadEle = element(by.xpath('.//h5[@class="mat - h5"][text()= " ' + instrument2 + ' "]'));
      const prod1Ele = element(by.xpath('.//h5[@class="mat - h5"][text()= "' + prod1 + '"]'));
      const prod1Test1Ele = element(by.xpath('.//h6[@class="mat - h6 ng - star - inserted"][text()= "' + prod1Test1 + '"]'));
      const prod2Ele = element(by.xpath('.//h5[@class="mat - h5"][text()= "' + prod2 + '"]'));
      const prod2Test1Ele = element(by.xpath('.//h6[@class="mat - h6 ng - star - inserted"][text()= "' + prod2Test1 + '"]'));
      instHeadEle.getText().then(function (instHeader) {
        if (instHeader.match(instrument2)) {
          instrumentId = true;
        } else {
          instrumentId = false;
        }
      });

      prod1Ele.getText().then(function (prodHeader) {
        if (prodHeader.match(prod1)) {
          prod1Id = true;
        } else {
          prod1Id = false;
        }
      });

      prod1Test1Ele.getText().then(function (testHeader) {
        if (testHeader.includes(prod1Test1)) {
          prod1Test1id = true;
        } else {
          prod1Test1id = false;
        }
      });

      library.scrollToElement(prod2Ele);
      prod2Ele.getText().then(function (prodHeader) {
        if (prodHeader.includes(prod2)) {
          prod2Id = true;
        } else {
          prod2Id = false;
        }
      });

      prod2Test1Ele.getText().then(function (testHeader) {
        if (testHeader.includes(prod2Test1)) {
          prod2Test1id = true;
        } else {
          prod2Test1id = false;
        }
      });
      prod2Test1Ele.isDisplayed().then(function (status) {
        if (instrumentId && prod1Id && prod1Test1id && prod2Id && prod2Test1id === true) {
          verifySummaryEntryComponents = true;
          resolve(verifySummaryEntryComponents);
        } else {
          verifySummaryEntryComponents = false;
          resolve(verifySummaryEntryComponents);
        }
      });
    });
  }

  verifyChangeLotAddComments() {
    return new Promise((resolve) => {
      let verifyChangeLotAddComments = false;
      dashBoard.waitForElement();
      const pointList = element.all(by.xpath(pointListEle));
      const changeLotList = element.all(by.xpath(lotlist));
      const addCommentList = element.all(by.xpath(addCmtlist));
      pointList.count().then(function (pointsNum) {
        changeLotList.count().then(function (changeLotNum) {
          addCommentList.count().then(function (addCommentNum) {
            if (pointsNum === changeLotNum && pointsNum === addCommentNum) {
              verifyChangeLotAddComments = true;
              resolve(verifyChangeLotAddComments);
            } else {
              verifyChangeLotAddComments = false;
              resolve(verifyChangeLotAddComments);
            }
          });
        });
      });
    });
  }

  verifyTopPageHeaderInstrumentView(instrumentId) {
    return new Promise((resolve) => {
      let verifyTopPageHeader, instrumentheader1, instrumentheader2, defaultDataTable, spcRuleDisp, reportDisp, connDisp = false;
      dashBoard.waitForElement();
      const instHeadEle = element(by.xpath('.//div[@class="heading"]//h1[text()= "' + instrumentId + '"]'));
      const instHeadele2 = element(by.xpath('.//p[@class="instrument - description ng - star - inserted"]'
        + '[text()= "' + instrumentId + '"]'));
      const defaultActiveLink = element(by.xpath(DefailtActiveDataTable));
      const spcRuleEle = element(by.xpath(spcEle));
      const reportsElm = element(by.xpath(reportEle));
      const connElm = element(by.xpath(connEleInstru));
      instHeadEle.getText().then(function (head1) {
        if (head1.includes(instrumentId)) {
          instrumentheader1 = true;
        } else {
          instrumentheader1 = false;
        }
      });
      instHeadele2.getText().then(function (head2) {
        if (head2.includes(instrumentId)) {
          instrumentheader2 = true;
        } else {
          instrumentheader2 = false;
        }
      });
      defaultActiveLink.isPresent().then(function (status) {
        if (status) {
          defaultDataTable = true;
        } else {
          defaultDataTable = false;
        }
      });
      spcRuleEle.isPresent().then(function (status) {
        if (status) {
          spcRuleDisp = true;
        } else {
          spcRuleDisp = false;
        }
      });
      reportsElm.isPresent().then(function (status) {
        if (status) {
          reportDisp = true;
        } else {
          reportDisp = false;
        }
      });
      connElm.isPresent().then(function (status) {
        if (status) {

          connDisp = true;
        } else {
          connDisp = false;
        }
      });
      connElm.isDisplayed().then(function (status) {
        if (instrumentheader1 && instrumentheader2 && defaultDataTable && spcRuleDisp && reportDisp && connDisp === true) {
          verifyTopPageHeader = true;
          resolve(verifyTopPageHeader);
        } else {
          verifyTopPageHeader = false;
          resolve(verifyTopPageHeader);
        }
      });
    });
  }

  verifyTopPageHeaderProductView(product) {
    return new Promise((resolve) => {
      let verifyTopPageHeader, productHeader, defaultDataTable, spcRuleDisp, connDisp = false;
      dashBoard.waitForElement();
      const prodHeadEle = element(by.xpath('.//div[@class="heading"]//h1[text()= "' + product + '"]'));
      // const instHeadele2 = element(by.xpath('.//p[@class='instrument-description ng-star-inserted'][text()= ''+instrumentId+'']'));
      const defaultActiveLink = element(by.xpath(DefailtActiveDataTable));
      const spcRuleEle = element(by.xpath(spcEle));
      // const reportsElm = element(by.xpath('.//ul[@class='nav mob-actions-bar']/li[3]/a'))
      const connElm = element(by.xpath(connEleProd));
      prodHeadEle.getText().then(function (head1) {
        if (head1.includes(product)) {
          productHeader = true;
        } else {
          productHeader = false;
        }
      });
      defaultActiveLink.isPresent().then(function (status) {
        if (status) {
          defaultDataTable = true;
        } else {
          defaultDataTable = false;
        }
      });
      spcRuleEle.isPresent().then(function (status) {
        if (status) {
          spcRuleDisp = true;
        } else {
          spcRuleDisp = false;
        }
      });
      connElm.isPresent().then(function (status) {
        if (status) {
          connDisp = true;
        } else {
          connDisp = false;
        }
      });
      connElm.isDisplayed().then(function (status) {
        if (productHeader && defaultDataTable && spcRuleDisp && connDisp === true) {
          verifyTopPageHeader = true;
          resolve(verifyTopPageHeader);
        } else {
          verifyTopPageHeader = false;
          resolve(verifyTopPageHeader);
        }
      });
    });
  }

  verifyDefaultRunEntrySelection(instrumentId) {
    return new Promise((resolve) => {
      let verifyTopPageHeader, verifyDefaultRunEntrySelection = false;
      dashBoard.waitForElement();
      const instHeadEle = element(by.xpath('.//h5[@class="mat - h5"][text()= " ' + instrumentId + ' "]'));
      const runRadio = element(by.xpath(runRadioBtn));
      instHeadEle.getText().then(function (instHeader) {
        if (instHeader.match(instrumentId)) {
          verifyTopPageHeader = true;
        } else {
          verifyTopPageHeader = false;
        }
      });
      runRadio.getAttribute('value').then(function (status) {
        if (status) {
          verifyDefaultRunEntrySelection = true;
          resolve(verifyDefaultRunEntrySelection);
        } else {
          verifyDefaultRunEntrySelection = false;
          resolve(verifyDefaultRunEntrySelection);
        }
      });
    });
  }

  verifyLevelsDisplayed() {
    return new Promise((resolve) => {
      let verifyLevelsDisplayed = false;
      const levelEle = element(by.xpath(levelDisplay));
      levelEle.isDisplayed().then(function (status) {
        if (status) {
          verifyLevelsDisplayed = true;
          resolve(verifyLevelsDisplayed);
        } else {
          verifyLevelsDisplayed = false;
          resolve(verifyLevelsDisplayed);
        }
      });
    });
  }

  verifyFooterComponents() {
    return new Promise((resolve) => {
      let verifyFooterComponents, datePicker, cancelBtn, submitBtn = false;
      const dateElm = element(by.xpath(footerDate));
      const cancelElm = element(by.xpath(footerCancel));
      const submitElm = element(by.xpath(footerSubmit));
      dateElm.isPresent().then(function (status) {
        if (status) {
          datePicker = true;
        } else {
          datePicker = false;
        }
      });
      cancelElm.isPresent().then(function (status) {
        if (status) {
          cancelBtn = true;
        } else {
          cancelBtn = false;
        }
      });
      submitElm.getAttribute('disabled').then(function (status) {
        if (status) {
          submitBtn = true;
        } else {
          submitBtn = false;
        }
      });
      submitElm.isDisplayed().then(function (status) {
        if (datePicker && cancelBtn && submitBtn === true) {
          verifyFooterComponents = true;
          resolve(verifyFooterComponents);
        } else {
          verifyFooterComponents = false;
          resolve(verifyFooterComponents);
        }
      });
    });
  }

  verifySummaryEntryComponentsProductView(product, test) {
    return new Promise((resolve) => {
      let verifySummaryEntryComponentsProductView, productId, testId = false;
      dashBoard.waitForElement();
      const prod1Ele = element(by.xpath('.//h5[contains(text(),"' + product + '")]'));
      const prod1Test1Ele = element(by.xpath('.//h6[@class="mat - h6 ng - star - inserted"][text()= "' + test + '"]'));

      prod1Ele.getText().then(function (prodHeader) {
        if (prodHeader.match(product)) {
          productId = true;
        } else {
          productId = false;
        }
      });

      prod1Test1Ele.getText().then(function (testHeader) {
        if (testHeader.includes(test)) {
          testId = true;
        } else {
          testId = false;
        }
      });
      prod1Test1Ele.isDisplayed().then(function (status) {
        if (productId && testId === true) {
          verifySummaryEntryComponentsProductView = true;
          resolve(verifySummaryEntryComponentsProductView);
        } else {
          verifySummaryEntryComponentsProductView = false;
          resolve(verifySummaryEntryComponentsProductView);
        }
      });
    });
  }

  verifySaveBtnClick(instrumentId) {
    return new Promise((resolve) => {
      let verifySaveBtnClick = false;
      dashBoard.waitForElement();
      element(by.id(saveButton)).click()
        .then(function (clicked) {
          dashBoard.waitForPage();
          const pageHeading = element(by.xpath(pageheading));
          pageHeading.getText().then(function (head) {
            if (head.includes(instrumentId)) {
              verifySaveBtnClick = true;
              resolve(verifySaveBtnClick);
            }
          });
        });
    });
  }

  verifyMaxLength(testMaxLen, xid) {
    return new Promise((resolve) => {
      let verifyMaxLength = false;
      const mValue = element(by.xpath('//*[@id="' + xid + '"]'));
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
      const tLen = testVal.length;
      element(by.id('12')).sendKeys('10');
      element(by.id('13')).sendKeys('15');
      element(by.id(submitButton)).click().then(function () {
        browser.sleep(8000);
        library.scrollToElement(element(by.xpath(meanChar)));
        element(by.xpath(meanChar)).getText().then(function (dispVal) {
          if (dispVal !== testVal) {
            verifyMeanCharType = true;
            resolve(verifyMeanCharType);
          } else {
            verifyMeanCharType = false;
            resolve(verifyMeanCharType);
          }
        });
      });
    });
  }

  verifyValidInput() {
    return new Promise((resolve) => {
      let verifyValidInput, meanVal, sdVal, pointVal = false;
      library.scrollToElement(element(by.id('11')));
      element(by.id('11')).sendKeys('5');
      element(by.id('12')).sendKeys('10');
      element(by.id('13')).sendKeys('15');
      element(by.id(submitButton)).click().then(function () {
        browser.sleep(8000);
        element(by.xpath(meanChar)).getText().then(function (dispVal) {
          if (dispVal === '5') {
            meanVal = true;
          }
        });
        element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk -' + ' column - label mat - column'
          + ' - label ng - star - inserted"]' + '[.="sd"]//following-sibling::td[2]/div/div')).getText().then(function (dispVal) {
            if (dispVal === '10') {
              sdVal = true;
            }
          });
        element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk - column - label mat - column'
          + ' - label ng - star - inserted"][.="points"]//following-sibling::td[2]/div/div')).getText().then(function (dispVal) {
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
      const tLen = testVal.length;
      element(by.id('11')).sendKeys('10');
      element(by.id('13')).sendKeys('15');
      dashBoard.waitForScroll();
      element(by.id(submitButton)).click().then(function () {
        browser.sleep(8000);
        library.scrollToElement(element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk - column - label mat'
          + ' - column - label ng - star - inserted"][.="sd"]//following-sibling::td[2]/div/div')));
        // element(by.xpath('(.//div[@class='ng-star-inserted']//span[@class='ng-star-inserted'])[2]')).getText().then(function(dispVal) ;
        // element(by.xpath('.//td[@class='br-uppercase mat-small mat-cell cdk-column-label mat-column-label ng-star-inserted'][.='sd']'
        // +'//following-sibling::td[2]/div/div')).click().then(function () {
        element(by.xpath('.//td[@class="br - uppercase mat - small mat - cell cdk - column - label mat - column'
          + ' - label ng - star - inserted"][.="sd"]//following-sibling::td[2]/div/div')).getText().then(function (dispVal) {
            if (dispVal !== testVal) {
              verifySdCharType = true;
              resolve(verifySdCharType);
            } else {
              verifySdCharType = false;
              resolve(verifySdCharType);
            }
          });
      });
    });
  }

  verifyPointInvalidData(testVal) {
    return new Promise((resolve) => {
      let verifyPointInvalidData = false;
      const tLen = testVal.length;
      element(by.id('11')).sendKeys('10');
      element(by.id('12')).sendKeys('15');
      element(by.id('13')).sendKeys(testVal);
      element(by.id(submitButton)).click().then(function () {
        browser.sleep(8000);
        // element(by.xpath('(.//div[@class='ng-star-inserted']//span[@class='ng-star-inserted'])[3]')).getText().then(function(dispVal)
        const pointValue = element(by.xpath('(.//div[@class="ng - star - inserted"]//span[@class="ng - star - inserted"])[3]'));
        library.scrollToElement(pointValue);
        dashBoard.waitForScroll();
        pointValue.getText().then(function (dispVal) {
          if (dispVal !== testVal) {
            verifyPointInvalidData = true;
            resolve(verifyPointInvalidData);
          } else {
            verifyPointInvalidData = false;
            resolve(verifyPointInvalidData);
          }
        });
      });
    });
  }

  deleteSavedData(test) {
    let deleteSavedData = false;
    return new Promise((resolve) => {
      const insEle = element(by.xpath('(.//span[@class="toggle - children - wrapper toggle - children - wrapper '
        + '- collapsed ng - star - inserted"]/span[@class="toggle - children"])[1]'));
      insEle.click();
      dashBoard.waitForElement();
      insEle.click();
      dashBoard.waitForElement();
      const testEle = element(by.xpath('.//span[@class="ml - 2 line - height - fix ng - star - inserted"]'
        + '[contains(text(), "' + test + '")]'));
      testEle.click();
      dashBoard.waitForElement();
      let num;
      element.all(by.xpath('.//span[@class="ng - star - inserted"]')).count().then(function (temp) {
        num = temp / 3;
      });
      for (let i = 0; i <= num; i++) {
        const sValEle = element(by.xpath('(.//span[@class="ng - star - inserted"])[1]'));
        library.scrollToElement(sValEle);
        sValEle.click();
        dashBoard.waitForPage();
        const delEle = element(by.xpath('.//mat-icon[@class="white - icon mat - icon material - icons"]'));
        delEle.click();
        dashBoard.waitForPage();
        const delBtnEle = element(by.xpath(delBtn));
        delBtnEle.click();
        dashBoard.waitForElement();
      }
      deleteSavedData = true;
      resolve(deleteSavedData);
    });
  }

  addCommentInTest(cmnt, test, meanNo) {
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const mean = element(by.xpath('(//td[contains(text(),"mean")])[' + meanNo + ']'));
      library.scrollToElement(mean);
      mean.click().then(function () {
        dashBoard.waitForElement();
        let comment = false;
        const commentAdd = element(by.xpath(addCmnt));
        library.scrollToElement(commentAdd);
        commentAdd.click().then(function () {
          const comment1 = element(by.xpath(addCmntTestArea));
          comment1.sendKeys(cmnt).then(function () {
            const submit = element(by.xpath(submitCmnt));
            submit.isDisplayed().then(function () {
              library.clickJS(submit);
              dashBoard.waitForPage();
              comment = true;
              resolve(comment);
            });
          });
        });
      });
    });
  }

  clickVerifyChangeLot() {
    let displayed = false;
    return new Promise((resolve) => {
      try {
        dashBoard.waitForPage();
        //  const changeLot = element(by.xpath(chngLot));
        const reagent = element(by.xpath(changeReagentLot));
        const calibrator = element(by.xpath(changeCallibratorLot));
        library.scrollToElement(calibrator);
        /*changeLot.click().then(function () {
          dashBoard.waitForElement();
          dashBoard.waitForPage();
        })*/
        if (reagent.isDisplayed() && calibrator.isDisplayed()) {
          displayed = true;
          resolve(displayed);
        } else {
          displayed = false;
          resolve(displayed);
        }
      } catch (error) {
        displayed = false;
        resolve(displayed);
      }
    });
  }

  changeReagentLot(newReagentLot) {
    let oldReagentLotVal;
    // let changeReagentLot = false;
    return new Promise((resolve) => {
      const reagentLotEle = element(by.xpath(reagentLotSelect));
      library.scrollToElement(reagentLotEle);
      // oldReagentLotVal
      reagentLotEle.getAttribute('textContent').then(function (oldText) {
        oldReagentLotVal = oldText;
        reagentLotEle.click().then(function () {
          element(by.xpath('.//span[@class="mat - option - text"][contains(text(),"' + newReagentLot + '")]')).click().then(function () {
            dashBoard.waitForElement();
            // changeReagentLot = true;
            resolve(oldReagentLotVal);
          });
        });
      });
      // return oldReagentLotVal;
    });
  }

  clickCancelBtnOnDeleteItom() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = element(by.xpath(cancelBtnOnDelete));
      cancelBtn.click().then(function () {
        library.logStep('Cancel button on delete test is clicked.');
        clickCancelBtn = true;
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  changeCallibratortLot(newCallibratorLot) {
    let oldCallibratorLotVal;
    // let changeCallibratortLot = false;
    return new Promise((resolve) => {
      const callibratorLotEle = element(by.xpath(calibratorLotSel));
      library.scrollToElement(callibratorLotEle);
      callibratorLotEle.getAttribute('textContent').then(function (oldText) {
        oldCallibratorLotVal = oldText;
        callibratorLotEle.click().then(function () {
          element(by.xpath('.//span[@class="mat - option - text"]'
            + '[contains(text(),"' + newCallibratorLot + '")]')).click().then(function () {
              dashBoard.waitForElement();
              resolve(oldCallibratorLotVal);
            });
        });
      });
      // return oldCallibratorLotVal
    });
  }

  verifyNewLotValue(oldReagentLot, oldCallibratorLot) {
    let verifyNewLotValue, reagentLotVal, CallibratorLotVal = false;
    return new Promise((resolve) => {
      const reagentLotEle = element(by.xpath(reagentLotSelect));
      library.scrollToElement(reagentLotEle);
      reagentLotEle.getAttribute('textContent').then(function (newReagentLot) {
        if (newReagentLot !== oldReagentLot) {
          reagentLotVal = true;
        } else {
          reagentLotVal = false;
        }
      });
      const callibratorLotEle = element(by.xpath(calibratorLotSel));
      library.scrollToElement(callibratorLotEle);
      callibratorLotEle.getAttribute('textContent').then(function (newCallibratorLot) {
        if (newCallibratorLot !== oldCallibratorLot) {
          CallibratorLotVal = true;
        } else {
          CallibratorLotVal = false;
        }
      });
      callibratorLotEle.isDisplayed().then(function (status) {
        if (status) {
          if (reagentLotVal && CallibratorLotVal === true) {
            verifyNewLotValue = true;
            resolve(verifyNewLotValue);
          }
        }
      });
    });
  }

  clickManuallyEnterData() {
    return new Promise((resolve) => {
      let status = false;
      browser.sleep(2000);
      const enterSummary = findElement(locatorType.XPATH, manuallyEnterData);
      browser.sleep(2000);
      library.clickJS(enterSummary);
      status = true;
      resolve(status);
      library.logStepWithScreenshot('Manually Enter Data Clicked.', 'ManuallyEnterDataClicked');
    });
  }

  clickManuallyEnterSummary() {
    return new Promise((resolve) => {
      let status = false;
      browser.wait(element(by.partialLinkText(manuallyEnterSummary)).isPresent());
      const enterSummary = element(by.partialLinkText(manuallyEnterSummary));
      enterSummary.isDisplayed().then(function () {
        library.clickAction(enterSummary);
        status = true;
        resolve(status);
        library.logStep('Manually Enter Data Clicked.');
      }).catch(function () {
        status = false;
        resolve(status);
        library.logFailStep('Manually Enter Data Not Displyed.');
      });
    });
  }

  hoverOverTest(testid) {
    let hover = false;
    return new Promise((resolve) => {
      // const mValue = element(by.xpath('(//*[@class="wrapper mat - typography analyte - summary - entry - component"])[' + testid + ']'));
      const mValue = element(by.xpath('(//*[@class="wrapper mat-typography analyte-summary-entry-component"])[' + testid + ']'));
      library.scrollToElement(mValue);
      library.hoverOverElement(mValue);
      library.logStep('Hovered over test.');
      dashBoard.waitForElement();
      hover = true;
      resolve(hover);
    });
  }

  hoverTestClick(idEle) {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const mValue = element(by.xpath('//*[@id="' + idEle + '"]'));
      library.clickJS(mValue);
      library.logStep('Hovered over test.');
      dashBoard.waitForElement();
      clickShowOpt = true;
      resolve(clickShowOpt);
    });
  }

  clickShowOption(xid) {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const mValue = element(by.xpath('//*[@id="' + xid + '"]'));
      library.hoverOverElement(mValue);
      const showOptionsLink = element(by.xpath(showOptionsEle));
      library.clickJS(showOptionsLink);
      library.logStep('Show Option Button clicked.');
      dashBoard.waitForPage();
      clickShowOpt = true;
      resolve(clickShowOpt);
    });
  }

  clickShowOptionnew() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const showOptionsLink = element(by.xpath(showOptionsEle));
      showOptionsLink.isDisplayed().then(function () {
        library.scrollToElement(showOptionsLink);
        // library.clickAction(showOptionsLink)
        library.clickJS(showOptionsLink);
        library.logStep('Show Option Button clicked.');
        dashBoard.waitForPage();
        clickShowOpt = true;
        resolve(clickShowOpt);
      });
    });
  }

  clickHideOption() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const hideOptionsLink = element(by.className(hideOption));
      hideOptionsLink.isDisplayed().then(function () {
        library.scrollToElement(hideOptionsLink);
        library.clickAction(hideOptionsLink);
        library.logStep('Hide Option Link clicked.');
        dashBoard.waitForPage();
        clickShowOpt = true;
        resolve(clickShowOpt);
      });
    });
  }

  isShowOptionVisible() {
    let statusVisible = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      library.logStep('Page down Pressed.');
      const showOptionsLink = element(by.xpath(showOptionsEle));
      showOptionsLink.isDisplayed().then(function () {
        statusVisible = true;
        // library.logStep('Show Option Button displayed.');
        library.logStepWithScreenshot('Show Option Button displayed.', 'ShowOptionVisible');
        resolve(statusVisible);
      }).catch(function () {
        statusVisible = false;
        library.logFailStep('Show Option Button not displayed.');
        resolve(statusVisible);
      });
    });
  }

  isOptionDisplayed() {
    let reagent, calibrator, comment, flag, hideFlag = false;
    return new Promise((resolve) => {
      const reagent_LotSelect = element(by.xpath(reagentLotSelectEle));
      library.scrollToElement(reagent_LotSelect);
      const calibratorLotSelect = element(by.xpath(calibratorLotSelectEle));
      const addComment = element(by.xpath(addCommentEle));
      const hide = element(by.className(hideOption));
      reagent_LotSelect.isDisplayed().then(function () {
        reagent = true;
        library.logStep(' Reagent lot displayed.');
      }).catch(function () {
        reagent = false;
        library.logFailStep(' Reagent lot not displayed.');
      });
      calibratorLotSelect.isDisplayed().then(function () {
        calibrator = true;
        library.logStep(' Calibrator lot displayed.');
      }).catch(function () {
        calibrator = false;
        library.logFailStep(' Calibrator lot not displayed.');
      });
      addComment.isDisplayed().then(function () {
        comment = true;
        library.logStep(' Add a Comment displayed.');
      }).catch(function () {
        comment = false;
        library.logFailStep(' Add a Comment not displayed.');
      });
      hide.isDisplayed().then(function () {
        hideFlag = true;
        library.logStep('Hide option is displayed.');
      }).catch(function () {
        hideFlag = false;
        library.logFailStep('Hide option is not displayed.');
      });
      if (reagent && calibrator && comment && hideFlag === true) {
        library.logStepWithScreenshot('Options are displayed', 'OptionDisplayed');
        flag = true;
        resolve(flag);
      }
    });
  }

  verifyMultiSummaryEntryDisabled() {
    let verifyMultiSummaryEntryDisabled = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const sumDataToggEleEnabled1 = element(by.xpath(sumDataToggEleEnabled));
      const summEle1 = element(by.xpath(summEle));
      library.scrollToElement(summEle1);
      browser.wait(until.presenceOf(summEle1), 50000, 'Message: took too long');
      dashBoard.waitForElement();
      sumDataToggEleEnabled1.isPresent().then(function (selected) {
        if (selected) {
          sumDataToggEleEnabled1.click().then(function () {
            element(by.xpath('.//button[text() = " APPLY "]')).click();
            verifyMultiSummaryEntryDisabled = true;
            resolve(verifyMultiSummaryEntryDisabled);
          });
        } else if (!selected) {
          verifyMultiSummaryEntryDisabled = true;
          resolve(verifyMultiSummaryEntryDisabled);
        } else {
          verifyMultiSummaryEntryDisabled = false;
          resolve(verifyMultiSummaryEntryDisabled);
        }
      });

    });
  }
  selectRunEntry() {
    let flag = false;
    return new Promise((resolve) => {
      const summEle1 = element(by.xpath(runLevel));
      library.clickJS(summEle1);
      library.logStep('Run Entry Radio button is clicked.');
      flag = true;
      resolve(flag);
    });
  }

  selectLevelEntry() {
    let flag = false;
    return new Promise((resolve) => {
      const summEle1 = element(by.xpath(levelEntry));
      library.clickJS(summEle1);
      library.clickAction(summEle1);
      library.logStep('Level Entry Radio button is clicked.');
      flag = true;
      resolve(flag);
    });
  }
  // ----------------------------------------------------------
  verifyNavigateAwayModelUI() {
    let flag = false;
    return new Promise((resolve) => {
      const msg = findElement(locatorType.XPATH, naivigateAwayMsg);
      const dontSaveEle = findElement(locatorType.XPATH, dontSaveDataBtn);
      const saveDataEle = findElement(locatorType.XPATH, saveDataBtn);
      if (msg.isDisplayed() && dontSaveEle.isDisplayed() && saveDataEle.isDisplayed()) {
        flag = true;
        library.logStepWithScreenshot(' If you navigate away from this page, your data will not be saved.'
          + ' Popup along with save data and dont save data button is displayed', 'UIVerified');
        resolve(flag);
      } else {
        flag = false;
        library.logFailStep(' If you navigate away from this page, your data will not be saved.'
          + ' Popup along with save data and dont save data button is not displayed');
        resolve(flag);
      }

    });

  }
  isNoDataDisplayed(analyteName) {
    let flag = false;
    let noDataEle;
    return new Promise((resolve) => {
      browser.sleep(2000);
      try {
        if (analyteName === 'Amylase') {
          noDataEle = findElement(locatorType.XPATH, '//*[contains(text(),"' + analyteName + '")]'
            + '/following-sibling::span[contains(text(),"No Data")]');
        } else {
          noDataEle = findElement(locatorType.XPATH, '//*[contains(text(),"' + analyteName + '")]'
            + '/following-sibling::span[contains(text(),"No Data")]');
        }
        if (noDataEle.isDisplayed()) {
          library.scrollToElement(noDataEle);
          library.logStepWithScreenshot('No Data is displaying for the analyte having no data saved.', 'NoData');
          flag = true;
          resolve(flag);
        } else {
          library.logFailStep('No Data is not displaying for the analyte having no data saved.');
          flag = false;
          resolve(flag);
        }
      } catch (error) {
        library.logFailStep('No Data is not displaying for the analyte having no data saved.');
        flag = false;
        resolve(flag);
      }

    });
  }

  isDataEntrySectionDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const entrySection = findElement(locatorType.XPATH, summaryEntrySection);
      if (entrySection.isDisplayed()) {
        library.logStepWithScreenshot('On clicking Manually enter data link summary data entry section displayed.', 'NoData');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('On clicking Manually enter data link summary data entry section not displayed.');
        flag = false;
        resolve(flag);
      }
    });
  }

  verifyNavigatedToPage(pageno) {
    let flag = false;
    return new Promise((resolve) => {
      const pagination = findElement(locatorType.XPATH, '//span[contains(text(),"on page")]' +
        '/following-sibling::span[contains(text(),"' + pageno + '")]');
      if (pagination.isDisplayed()) {
        library.scrollToElement(pagination);
        library.logStepWithScreenshot('Pagination Controls displayed.', 'pagination');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('On clicking Manually enter data link summary data entry section not displayed.');
        flag = false;
        resolve(flag);
      }
    });
  }
  clickDontSaveDataBtn() {
    let flag = false;
    return new Promise((resolve) => {
      const dontSaveEle = findElement(locatorType.XPATH, dontSaveDataBtn);
      library.clickJS(dontSaveDataBtn);
      library.logStepWithScreenshot('Dont save data button is clicked.', 'DontSaveDataClick');
      flag = true;
      resolve(flag);
    });
  }

  clickSaveDataBtn() {
    let flag = false;
    return new Promise((resolve) => {
      const saveEle = findElement(locatorType.XPATH, saveDataBtn);
      library.clickJS(saveEle);
      library.logStepWithScreenshot('Save data button is clicked.', 'DontSaveDataClick');
      flag = true;
      resolve(flag);
    });
  }

  isPaginationDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 40000, 'Element is visible');
      const pagination = element(by.xpath(paginationControls));
      if (pagination.isDisplayed()) {
        library.scrollToElement(pagination);
        library.logStepWithScreenshot('Pagination Controls displayed.', 'pagination');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('On clicking Manually enter data link summary data entry section not displayed.');
        flag = false;
        resolve(flag);
      }
    });
  }

  goToPage(pageNO) {
    let flag = false;
    return new Promise((resolve) => {
      const pageNumber = findElement(locatorType.XPATH, '//pagination-controls//li//span[contains(text(),"' + pageNO + '")]');
      library.clickJS(pageNumber);
      browser.sleep(5000);
      library.logStepWithScreenshot('Navigated to page ' + pageNO + '', 'pageNo');
      flag = true;
      resolve(flag);
    });
  }

  verifyNextButtonClicked() {
    let flag = false;
    return new Promise((resolve) => {
      const pageNumber = findElement(locatorType.XPATH, '//pagination-controls//a[contains(text(),"Next")]');
      library.clickJS(pageNumber);
      const nextClick = findElement(locatorType.XPATH, '//span[contains(text(),"You")]/following-sibling::span[contains(text(),"2")]');
      if (nextClick.isDisplayed()) {
        library.logStepWithScreenshot('Pagination Next button clicked ', 'nextClicked');
        flag = true;
        resolve(flag);
      } else {
        library.logStepWithScreenshot('Pagination Previous button clicked ', 'previousClicked');
        flag = false;
        resolve(flag);
      }

    });
  }
  verifyPreviousButtonClicked() {
    let flag = false;
    return new Promise((resolve) => {
      const pageNumber = findElement(locatorType.XPATH, '//pagination-controls//a[contains(text(),"Previous")]');
      library.clickJS(pageNumber);
      const nextClick = findElement(locatorType.XPATH, '//span[contains(text(),"You")]/following-sibling::span[contains(text(),"1")]');
      if (nextClick.isDisplayed()) {
        library.logStepWithScreenshot('Pagination Previous button clicked ', 'previousClicked');
        flag = true;
        resolve(flag);
      } else {
        library.logStepWithScreenshot('Pagination Previous button clicked ', 'previousClicked');
        flag = false;
        resolve(flag);
      }

    });
  }
  verifyAnalytesSortedOnMultiEntry(exparr) {
    let flag = false;
    return new Promise((resolve) => {
      const analyteName = [];

      browser.sleep(3000);

      element.all(by.xpath(allTest)).getText().then(function (test1) {
        for (let i = 1; i <= 5; i++) {
          const ele = findElement(locatorType.XPATH, '(//br-analyte-summary-view//p)[' + i + ']');
          library.scrollToElement(ele);
          const analyteNameEle = findElement(locatorType.XPATH, '(//br-analyte-summary-view//p)[' + i + ']');
          library.clickJS(analyteNameEle);
          analyteNameEle.getText().then(function (txt) {
            console.log(txt + ' and ' + exparr[i - 1]);
            if (exparr[i - 1].includes(txt)) {
              library.logStepWithScreenshot('Analyte names are sorted alphabetically on control multi data entry page', 'analyteSorted');
              flag = true;
              resolve(flag);
            } else {
              library.logFailStep('Analyte names are not sorted alphabetically on control multi data entry page');
              flag = false;
              resolve(flag);
            }

          });
        }
      });
    });
  }
  clickReportsTab() {
    let flag = false;
    return new Promise((resolve) => {
      const report = findElement(locatorType.XPATH, reportsTab);
      library.clickJS(report);
      library.logStepWithScreenshot('Navigated to Report Tab', 'reportsTab');
      flag = true;
      resolve(flag);
    });
  }

  clickCreateBtn() {
    let flag = false;
    return new Promise((resolve) => {
      const report = findElement(locatorType.XPATH, createBtn);
      library.clickJS(report);
      library.logStepWithScreenshot('Report create button clicked.', 'reportsCreate');
      flag = true;
      resolve(flag);
    });
  }
  isReportCreated() {
    let flag = false;
    return new Promise((resolve) => {
      const report = findElement(locatorType.XPATH, reportCreated);
      if (report.isDisplayed()) {
        library.logStepWithScreenshot('Report created successfully.', 'reportsCreate');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('Report not created.');
        flag = false;
        resolve(flag);
      }
    });
  }
  clickReportCancel() {
    let flag = false;
    return new Promise((resolve) => {
      const report = findElement(locatorType.ID, cancelReport);
      library.clickJS(report);
      library.logStepWithScreenshot('Report cancel button clicked', 'cancelBtn');
      flag = true;
      resolve(flag);
    });
  }
  setTime(time) {
    let flag = false;
    return new Promise((resolve) => {
      const clock = findElement(locatorType.ID, timeClock);
      library.logStepWithScreenshot('Set time icon click.', 'timeIcon');
      clock.sendKeys(time);
      library.logStepWithScreenshot(time + ' is selected.', 'timeSet');
      flag = true;
      resolve(flag);
    });
  }
}

function greet(first: string, second: string) {
  first = 'first';
  second = 'second';
  return [first, second];
}
