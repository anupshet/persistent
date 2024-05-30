/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { ElementFinder, browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const undefinedTime = './/input[@id="undefinedTime"]';
const Donebtn = '//span[text()="DONE"]';
const Insertadifferentdatelink = '//a[text()="Insert a different date"]';
const chooseaaction = '(//span[text()="Choose an action"])[1]';
const correctiveactiondropdown = '(//span[text()="Corrective action"])[1]';
const actionTooltip = '//mat-dialog-container[@role="dialog"]';
const Correctiveactionname = '//mat-option[@role="option"]//span';
const undefinedDate = 'undefinedDate';
const cancelbtn = '//span[text()="Cancel"]//parent::button';
const commentsonicon = '//section[@class="ctn-comments"]//p';
const updatedIcon = '(//span[@class="ic-pez ic-history-18dp"])[1]';
const dateicon = '(//span//span[@class="ic-info-24px"])[2]';
const submitButton = '//span[contains(text(),"SEND TO PEER GROUP")]//parent::button';
const restartupdatedicon = '//div//em[@mattooltip="Restart float on this run"][1]';
const showOptionsarrow = '//span[@mattooltip="Show options"]';
const level1value = './/input[@tabindex="101"]';
const level2Value = './/input[@tabindex="102"]';
const level3Value = './/input[@tabindex="103"]';
const cancel = './/span[text()="Cancel"]';
const enterValLvl1 = '(.//tr[@class="ng-star-inserted"])[1]/td[3]';
const enterValLvl2 = '(.//tr[@class="ng-star-inserted"])[1]/td[7]';
const enterValLvl3 = '(.//tr[@class="ng-star-inserted"])[1]/td[11]';
const submitBtn = '//span[text()="Submit Data"]';
const enterValRow = '(//tr[@class=\"ng-star-inserted\"])[1]/td[3]';
const correctiveactionicon = '//span[contains(@class,"ic-pez ic-change-history")]';
const deleteRecord = '//mat-icon[contains(@class,"white-icon")]';
const confirmDelPopup = './/div[@class="cdk-overlay-pane"]';
const sendtopeergroupbtn = '//span[text()=" SEND TO PEER GROUP "]//parent::button';
const scrollTestLevel = '(//tr[@class="ng-star-inserted"])[1]/td[3]';
const editdatapopup = '//unext-run-edit-data//form';
const showDataArrow = './/unext-analytical-section/section//div/span[contains(@class,"chevron")]';
const firstValue = '//input[@tabindex="101"]';
const FocusedElement = '//input[@tabindex="101"]//parent::div//parent::div//parent::div//parent::mat-form-field';
const notifyBeforeDelete = './/h2[contains(text(),"Are you sure you want to delete this test run?")]';
const cancelOnPopup = './/button[@id="dialog_button1"]';
const confirmDel = './/button[@id="dialog_button2"]';
const addCmtTxtArea = '(.//textarea[contains(@placeholder,"Add a comment")])[2]';
const submitUpdates = './/span[text()=" SUBMIT UPDATES "]';
const summarychartwithdata = '//td[contains(@class,"main-cell")]//div[contains(@class,"table-level")]'
const commentbox = '//textarea[contains(@placeholder,"Add a comment")]';
const changeLot = '//span[contains(text(),"Change lot")]';
const reagentLotval1 = '(//div[@class="mat-select-value"])[1]';
const optionText = 'mat-option-text';
const callibratorLotDrpdwn = '(//div[@class="mat-select-value"])[2]';
const hideDataBtn = '//unext-analytical-section//div[contains(@class,"toggle-trigger")]//span[contains(@class,"chevron")]';
const shwdata = 'div.toggle-trigger';
const manualEnterData = '//a[text()="Manually enter data"]';
const reagentValSelected = '(//span[contains(@class,"mat-select-value-text")])[1]';
const calibratorValSelected = '(//span[contains(@class,"mat-select-value-tex;t")])[2]';
const testEle = '(//*[contains(text(),"Calcium")])[1]';
const reagentLotSpan = './/mat-select[@id="reagentLot"]//span/span';
const calibratorLotSpan = './/mat-select[@id="calibratorLot"]//span/span';
const insertPastResult = '//span[contains(text(),"Insert past result")]';
const datePicker = './/button[contains(@aria-label ,"Open calendar")]';
const monthSelector = './/button[contains(@class,"mat-calendar-period-button")]';
const dateLabel = 'label.dateLabel';
const submitDisabled = './/span[text()=" SEND TO PEER GROUP "]//parent::button[@disabled="true"]';
const testSection = './/section[@class="flex-ctn"]';
const calibratorLotSelectEle = '//label[contains(text(),"Calibrator Lot")]';
const reagentLotSelectEle = '//label[contains(text(),"Reagent Lot")]';
const hideOption = './/span[contains(text(),"Hide options")]';
const pastResultLink = './/a[contains(text(),"Forgot to enter a prior run?")]';
const optionsForm = './/div[@class="flex-container"]//div[@class="flex-container flex-column"]';
const forgotToEnterPastResultLink = './/a[contains(text(),"Forgot to enter a prior run?")]';
const reagentLotDropdownNotAvailable = './/input[@placeholder="Reagent Lot"][@aria-invalid="false"]';
const calibratorLotDropdownNotAvailable = './/input[@placeholder="Calibrator Lot"][@aria-invalid="false"]';
const editDialogCancelButton = './/span[text()="CANCEL"]';
const editThisAnalyteButton = './/button//span[contains(text(), "Edit this analyte")]';
const editDialogLevel1Textbox = '(.//input[@type="number"])[1]';
const editDialogLevel2Textbox = '(.//input[@type="number"])[2]';
const commentBox = '(.//span[contains(@class, "grey pez")])[1]';
const commentIcon = '(.//span[contains(@class, "grey pez")])[1]/span[contains(@class, "chat")]';
const commentCount = '(.//span[contains(@class, "grey pez")])[1]//em';
const reviewSummarySection = './/section[@class="review-summary-component"]';
const commentEntered = './/section[@class="ctn-comments"]//p';
const reviewSummaryDoneButton = './/button/span[.="DONE"]';
const pointDataPresent = './/div[@class="table-body hasInsertRow"]//div[@class="ps-content"]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';
const restartfloat = '(//input[@name="restartFloatstatistics"])';
const showOptions = './/span[@mattooltip="Show options"]';
const reagentLotOptions = '//mat-select[@aria-label="Reagent Lot"]';
const manuallyMultiEntryData = '//a[contains(text(),"MANUALLY ENTER DATA")]';
const sendToPeerGrp = '//button/span[text()=" SEND TO PEER GROUP "]';
const insertDiiferentDate = '//div/a[@class="link-text"]'
const chooseAnAction = '(//span[contains(text(),"Choose an action")])[1]';
const clickOnActionDisplayIcon = '//*[@class="ic-pez ic-change-history-24px"][1]';
const manuallyEnterDataWhenEdit = '//a[@class="manually-enter-summary"]';
const firstRun = '(//table[@class="run-data-page-set-table"]//tr)[4]';
const levelInputs = '//unext-point-data-entry//input';
const calibratorLotValue = '//mat-select[@aria-label="Calibrator Lot"]';
const matOptions = '//mat-option';
const editRunCalenderInput = '(//input[@placeholder="Date"])';
const editRunCalenderButton = '(//button[@aria-label=\"Open calendar\"])[2]';
const editLevelValues = '//unext-run-edit-data//input[@name="level"]';
const rejectRadioButton = '(//h2[contains(., "Level <level>")]/..//input)[3]/..';
const acceptRadioButton = '(//h2[contains(., "Level <level>")]/..//input)[2]/..';

export class PointDataEntry {
  async chooseARandomAction() {
    let ele1 = await element(by.xpath(chooseaaction));
    await library.waitTillClickable(ele1, 8888);
    await ele1.click();
    let ele = await element.all(by.xpath(matOptions));
    let n = Math.floor(Math.random() * ele.length);
    await library.waitTillClickable(ele[n], 8888);
    let action = ele[n].getText().toString();
    library.logStep("Click on " + action);
    await ele[n].click();
    return action;
  }
  async clickAccept(level) {
    library.logStep('Click Accept for Level ' + level);
    let ele = await element(by.xpath(acceptRadioButton.replace('<level>', level)));
    await library.waitTillVisible(ele, 8888);
    library.clickJS(ele);
  }
  async clickReject(level) {
    library.logStep('Click Reject for Level ' + level);
    console.log(rejectRadioButton.replace('<level>', level));
    let ele = await element(by.xpath(rejectRadioButton.replace('<level>', level)));
    await library.waitTillVisible(ele, 8888);
    library.clickJS(ele);
  }
  async enterRandomLevel1Values() {
    let ele = await element(by.xpath(editLevelValues));
    await library.waitTillVisible(ele, 8888);
    let value = (Math.random() * 10).toString().substring(0, 3);
    await ele.clear();
    await ele.sendKeys(value);
    return value;
  }
  async selectDateOtherThanCurrentDay() {
    let ele = await element(by.xpath(editRunCalenderInput));
    let ele1 = await element(by.xpath(editRunCalenderButton));
    await browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8888);
    let currentDate: string = await ele.getAttribute('value');
    let day = parseInt(currentDate.substring(currentDate.indexOf('/') + 1, currentDate.lastIndexOf('/')))
    if (day == 1)
      day++;
    else
      day--;
    let mon = parseInt(currentDate.substring(0, currentDate.indexOf('/'))) - 1;
    var monthArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let month = monthArr[mon];
    let year = currentDate.substring(currentDate.lastIndexOf('/') + 1);
    library.clickJS(ele1);
    await this.selectDateFromCalender(year, month, day);
    return [year, currentDate.substring(0, currentDate.indexOf(' ')), day];
  }
  async selectDateFromCalender(y, m, d) {
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
  async selectReagentLotOtherThanCurrent() {
    let ele = await element(by.xpath(reagentLotOptions));
    let text = (await ele.getText()).trim();
    await library.waitTillClickable(ele, 8888);
    await ele.click();
    let ele1: ElementFinder[] = await element.all(by.xpath(matOptions));
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
    library.logStep("Click on History Icon with values " + values);
    let xpath = '//td[contains(., "value")]/../.';
    let fxpath = '';
    for (let i = 0; i < values.length; i++) {
      let x = values[i];
      fxpath += xpath;
      fxpath = fxpath.replace("value", x);
      console.log("x " + x);
    }
    fxpath = fxpath + '//span[@class="ic-pez ic-history-18dp"]';
    console.log("XXXX " + fxpath);
    let ele = await element(by.xpath(fxpath));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
  }
  async selectCalibratorLotOtherThanCurrent() {
    let ele = await element(by.xpath(calibratorLotValue));
    let text = (await ele.getText()).trim();
    await library.waitTillClickable(ele, 8888);
    await ele.click();
    let ele1: ElementFinder[] = await element.all(by.xpath(matOptions));
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
  async clickRunWithValues(values: any[]) {
    library.logStep("Click on Run with values " + values);
    let xpath = '//td[contains(., "value")]/../.';
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
  async fillRandomLevelValues() {
    let ele = await element.all(by.xpath(levelInputs));
    let values = [];
    for (let i = 0; i < ele.length; i++) {
      let n = (Math.random() * 10).toString().substring(0, 3);
      await ele[i].sendKeys(n);
      values.push(n);
    }
    library.logStep("Entered Values");
    return values;
  }
  async clickFirstRun() {
    library.logStep('Click First Run');
    let ele = await element(by.xpath(firstRun));
    library.scrollToElement(ele);
    await browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 8888);
    await ele.click();
    await library.waitLoadingImageIconToBeInvisible();
  }
  verifyPointEntryPage(test) {
    let result, testHeader, timeDisplayed, value1Displayed, value2Displayed = false;
    return new Promise((resolve) => {
      const testNameHeader = element(by.xpath('.//h1[contains(text(),"' + test + '")]'));
      const timeTextBox = element(by.xpath(undefinedTime));
      const valueLevel1 = element(by.xpath(level1value));
      const valueLevel2 = element(by.xpath(level2Value));
      testNameHeader.isDisplayed().then(function () {
        testHeader = true;
        library.logStep(testHeader);
      });
      timeTextBox.isDisplayed().then(function () {
        timeDisplayed = true;
        library.logStep(timeDisplayed);
      });
      valueLevel1.isDisplayed().then(function () {
        value1Displayed = true;
        library.logStep(value1Displayed);
      });
      valueLevel2.isDisplayed().then(function () {
        value2Displayed = true;
        library.logStep(value2Displayed);
      });
      if (testHeader === true && timeDisplayed === true && value1Displayed === true && value2Displayed === true) {
        library.logStep('inside if block');
        result = true;
        resolve(result);
      } else {
        result = false;
        resolve(result);
      }
    });
  }
  verifythepresenceofInsertadifferentDate() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const Insertadifferentdatelink1 = element(by.xpath(Insertadifferentdatelink));
      Insertadifferentdatelink1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Insertadifferentdatelink is present', 'Insertadifferentdatelink is present');
        library.clickJS(Insertadifferentdatelink1);
        library.logStepWithScreenshot('Insertadifferentdatelink is clicked', 'Insertadifferentdatelink is clicked');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Insertadifferentlink is not present', 'Insertadifferentlink is not present');
        resolve(false);
      });
    });
  }
  insertdifferentlinkvisibleonclickingCancelBtn() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const cancelbtn1 = findElement(locatorType.XPATH, cancelbtn);
      library.clickJS(cancelbtn1);
      const Insertadifferentdatelink1 = element(by.xpath(Insertadifferentdatelink));
      Insertadifferentdatelink1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Insertadifferentdatelink  is present after clicking on cancel btn', 'Insertadifferentdatelink  is present after clicking on cancel btn');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStepWithScreenshot('Insertadifferentdatelink is not present after clicking on cancel button', 'Insertadifferentdatelink is not present after clicking on cancel button');
        result = false;
        resolve(result);
      });
    });
  }
  verifyDateTimePicker() {
    return new Promise((resolve) => {
      let displayed = false;
      const date = element(by.id(undefinedDate));
      date.isDisplayed().then(function () {
        library.logStepWithScreenshot('Date Time Picker is displayed', 'Date Time Pickerscreenshot');
        displayed = true;
        resolve(displayed);
      }).catch(function () {
        library.logStepWithScreenshot('Date Time Picker is not displayed', 'Date Time Picker is not displayed');
        displayed = false;
        resolve(displayed);
      });
    });
  }
  ClickOnEditDataOnTestLevel() {
    dashBoard.waitForPage();
    let editDialogBtnClicked = false;
    return new Promise((resolve) => {
      const scroll = findElement(locatorType.XPATH, scrollTestLevel);
      library.clickJS(scroll);
      library.logStepWithScreenshot('Clicked on edit dialogue button on test level', 'Clicked on edit dialogue button on test level');
      editDialogBtnClicked = true;
      resolve(editDialogBtnClicked);
    });
  }
  verifythepresenceofinsertdateIcon() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      let displayed = false;
      const icon = element(by.xpath(dateicon));
      icon.isDisplayed().then(function () {
        library.clickJS(icon);
        displayed = true;
        library.logStepWithScreenshot('Date icon is present and clicked', 'Date icon is present and clicked');
        resolve(displayed);
      }).catch(function () {
        library.logStepWithScreenshot('Date icon is not present', 'Date Icon is not present');
        displayed = false;
        resolve(displayed);
      });
    });
  }
  VerifyfocusonFirstElement() {
    let result = false;
    return new Promise((resolve) => {
      const FirstElement = element(by.xpath(firstValue));
      library.waitForElement(FirstElement);
      library.scrollToElement(FirstElement);
      const focusedelement1 = element(by.xpath(FocusedElement));
      focusedelement1.getAttribute('class').then(function (value) {
        if (value.includes('mat-focused')) {
          dashBoard.waitForElement();
          library.logStepWithScreenshot("Cursor is placed at first value field", "Cursor is placed at first value field");
          result = true;
          resolve(result);
        } else {
          library.logStepWithScreenshot("Cursor is not placed at first value field", "Cursor is not placed at first value field");
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifypresenceofupdatedRestartIcon() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const restartfloaticon = findElement(locatorType.XPATH, restartupdatedicon);
      library.scrollToElement(restartfloaticon);
      restartfloaticon.isDisplayed().then(function () {
        library.logStepWithScreenshot('Restart float icon is displayed', 'Restart float icon is displayed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Restartfloaticon is not  displayed', 'Restartfloaticon is not  displayed');
        status = false;
        resolve(status);
      });
    });
  }
  presenceofDataonActivityIcon(com) {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const commentsonicon1 = findElement(locatorType.XPATH, commentsonicon);
      commentsonicon1.getText().then(function (value) {
        if (value.includes(com)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Text on icon is verified', 'Text on icon is verified');
          browser.actions().mouseMove(findElement(locatorType.XPATH, Donebtn)).click().perform();
        }
        else {
          library.logStepWithScreenshot('Text on icon is verified', 'Text on icon is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifychartsPositionSwapped(Position) {
    let result = false;
    let leveyJenning;
    let summarystat;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      if (Position === '1') {
        console.log("Entered if")
        leveyJenning = findElement(locatorType.XPATH, '//section[contains(@class,"unext-analytical-section")]//div//unext-lj-chart//ancestor::div[2]//child::div[' + Position + ']');
        summarystat = findElement(locatorType.XPATH, '//section[contains(@class,"unext-analytical-section")]//div//br-summary-statistics-table//ancestor::div[4]//child::div[' + Position + ']');
        if (leveyJenning.isDisplayed()) {
          library.logStepWithScreenshot('Jenning charts on left side', 'Jenning charts on left side');
          result = true;
          resolve(result);
        } else if (summarystat.isDisplayed()) {
          library.logStepWithScreenshot('Summary chart on left Side', 'Summary on left Side');
          result = false;
          resolve(result);
        }
      } else if (Position === '2') {
        console.log("Entered else")
        leveyJenning = findElement(locatorType.XPATH, '//section[contains(@class,"unext-analytical-section")]//div//unext-lj-chart//ancestor::div[2]//child::div[' + Position + ']');
        summarystat = findElement(locatorType.XPATH, '//section[contains(@class,"unext-analytical-section")]//div//br-summary-statistics-table//ancestor::div[4]//child::div[' + Position + ']');
        if (summarystat.isDisplayed()) {
          library.logStepWithScreenshot('Summary charts on right side', 'Summary charts on right side');
          result = true;
          resolve(result);
        } else if (leveyJenning.isDisplayed()) {
          library.logStepWithScreenshot('Jenningschart on Right Side', 'JenningsChart on Right Side');
          result = false;
          resolve(result);
        }
      } else {
        library.logStep('Charts are not present');
      }
    });
  }
  presenceofSendToPeerGroupbtnOnPointForm() {
    let status = false;
    return new Promise((resolve) => {
      const btn = findElement(locatorType.XPATH, sendtopeergroupbtn);
      library.scrollToElement(btn);
      btn.isDisplayed().then(function () {
        library.logStepWithScreenshot("Send to peer group button is present", "Send to peer group button");
        status = true;
        resolve(status);
      },
        function () {
          library.logStepWithScreenshot("Send to peer group button not displayed", "Send to peer group button ");
          status = false;
          resolve(status);
        });
    });
  }
  clickonToggleArrow() {
    let result = false;
    return new Promise((resolve) => {
      const showData = element(by.xpath(showDataArrow));
      showData.isDisplayed().then(function () {
        library.scrollToElement(showData);
        library.clickJS(showData);
        library.logStep("Showdata  toggle is clicked")
        result = true;
        resolve(result);
      });
    });
  }
  insertDateThroughCalender(y, m, d) {
    return new Promise((resolve) => {
      const openCalendarBtn = '//button[@aria-label="Open calendar"]';
      const openCalendar = element(by.xpath(openCalendarBtn));
      library.clickJS(openCalendar);
      dashBoard.waitForElement();
      const clickCalendarDate = '(//div[contains(@class,"mat-calendar-header")]//span[@class="mat-button-wrapper"])[1]';
      const Calendardate = element(by.xpath(clickCalendarDate));
      library.clickJS(Calendardate);
      const selectYear = '//div[contains(@class,"mat-calendar-body") and text()= " ' + y + ' "]';
      const year = element(by.xpath(selectYear));
      dashBoard.waitForElement();
      library.clickJS(year);
      dashBoard.waitForElement();
      const selectMonth = '//div[contains(@class,"mat-calendar-body") and text()=" ' + m + ' "]';
      const month = element(by.xpath(selectMonth));
      library.clickJS(month);
      const selectDate = '//div[contains(@class,"mat-calendar-body") and text()=" ' + d + ' "]';
      const date = element(by.xpath(selectDate));
      dashBoard.waitForElement();
      library.clickJS(date);
      resolve(true);
    });
  }
  enterPointValue(val1) {
    let result, value1Entered = false;
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const valueLevel1 = element(by.xpath(level1value));
      valueLevel1.isDisplayed().then(function () {
        valueLevel1.sendKeys(val1);
        value1Entered = true;
        library.logStepWithScreenshot('values entered', 'PointValuesEntered');
        result = true;
        resolve(result);
      });
    });
  }
  presenceOfLevelHeader() {
    return new Promise((resolve) => {
      const levelheader = element.all(by.xpath('//div[contains(@class,"mat-form-field")]//label'));
      levelheader.then((items) => {
        for (let i = 1; i <= items.length; i++) {
          const LevelHeader = element(by.xpath('(//div[contains(@class,"mat-form-field")]//label)[' + i + ']'));
          LevelHeader.isDisplayed().then(function () {
            LevelHeader.getText().then(function (header) {
              library.logStepWithScreenshot('level header ' + header + ' is displayed', 'level header ' + header + ' is displayed');
              resolve(true);
            });
          }).catch(function () {
            library.logFailStep("level header is not displayed");
            resolve(false);
          })
        }
      });
    });
  }
  VerifythepresenceofShowOptionArrow() {
    return new Promise((resolve) => {
      const showoptionsarrow = element(by.xpath(showOptionsarrow));
      library.scrollToElement(showoptionsarrow);
      showoptionsarrow.isDisplayed().then(function () {
        library.logStepWithScreenshot('ShowOptionArrow is displayed', 'ShowOptionArrow is displayed');
        library.clickJS(showoptionsarrow);
        library.logStepWithScreenshot('Show Option arrow is clicked', 'Show Option arrow is clicked');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Show Option arrow is not present', 'Show Option arrow is not present');
        resolve(false);
      });
    });
  }
  async addCommentOnEditDialog(comment) {
    library.logStep("Add Comment - " + comment);
    const addCommentTextarea = await element(by.xpath(commentbox));
    await library.waitTillVisible(addCommentTextarea, 8888);
    await addCommentTextarea.sendKeys(comment);
  }
  async clickSubmitButton() {
    // return new Promise((resolve) => {
    const submit = await element(by.xpath(submitButton));
    library.scrollToElement(submit);
    // submit.isDisplayed().then(function () {
    // library.hoverOverElement(submit);
    library.clickJS(submit);
    await library.waitLoadingImageIconToBeInvisible();
    library.logStepWithScreenshot('Submit button is clicked.', 'Submit button is clicked');
    // resolve(true);
    // });
    // });
  }
  clickSubmitButton2() {
    return new Promise(async (resolve) => {
      const submit = await element(by.xpath(submitButton));
      library.scrollToElement(submit);
      // submit.isDisplayed().then(function () {
      // library.hoverOverElement(submit);
      library.clickJS(submit);
      await library.waitLoadingImageIconToBeInvisible();
      library.logStepWithScreenshot('Submit button is clicked.', 'Submit button is clicked');
      resolve(true);
    });
  }
  presenceofupdatedActivityicon() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const updatedicon = element(by.xpath(updatedIcon));
      updatedicon.isDisplayed().then(function () {
        library.logStepWithScreenshot('Updated Activity/History Icon is displayed', 'Updated Activity/History Icon');
        browser.actions().mouseMove(findElement(locatorType.XPATH, updatedIcon)).click().perform();
        resolve(true);
        library.logStepWithScreenshot('Updated Activity/History Icon is clicked', 'Updated Activity/History Icon is clicked');
      }).catch(function () {
        library.logFailStep('Updated icon is not present');
        resolve(false);
      });
    });
  }
  hoverOvercorrectiveactionIcon() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const Correctiveactionicon = element(by.xpath(correctiveactionicon));
      Correctiveactionicon.isDisplayed().then(function () {
        library.hoverOverElement(Correctiveactionicon);
        library.logStepWithScreenshot('Mouse Hover on Corrective action icon', 'Mouse Hover on Corrective action icon');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Unable to Mouse Hover on Correctice action icon');
        resolve(false);
      });
    });
  }
  verifypresenceofcorrectiveactiontooltip() {
    library.waitForPage();
    let Display = false;
    return new Promise((resolve) => {
      const actionTooltip1 = element(by.xpath(actionTooltip));
      actionTooltip1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Action ToolTip is displayed', 'ActionTooltip is displayed');
        Display = true;
        resolve(Display);
      }).catch(function () {
        library.logFailStep('Action ToolTip is not displayed');
        Display = false;
        resolve(Display);
      });
    });
  }
  verifyCancelButton() {
    return new Promise((resolve) => {
      const error = findElement(locatorType.XPATH, cancel);
      error.isDisplayed().then(function () {
        library.logStep('Cancel Button is displayed');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Cancel Button is not displayed');
        resolve(false);
      });
    });
  }
  verifyPointValueEntry() {
    let result, value1Displayed, value2Displayed = false;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      const valueLevel2 = findElement(locatorType.XPATH, level2Value);
      valueLevel1.isDisplayed().then(function () {
        value1Displayed = true;
        library.logStep('Level 1 value input box is displayed');
      });
      valueLevel2.isDisplayed().then(function () {
        value2Displayed = true;
        library.logStep('Level 2 value input box is displayed');
      });
      if (value1Displayed === true && value2Displayed === true) {
        result = true;
        library.logStep('Point Value Entry Text boxes are displayed');
        library.logStepWithScreenshot('Point Data Entry Page validated', 'PointDataEntry');
        resolve(result);
      }
    });
  }
  verifyPointEntryPageHeader(test) {
    let result, testHeader = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const testNameHeader = element(by.xpath('.//h1[contains(text(),"' + test + '")]'));
      testNameHeader.isDisplayed().then(function () {
        testHeader = true;
      });
      if (testHeader === true) {
        library.logStepWithScreenshot('Point Value Entry Text boxes are displayed', 'Point Value Entry Text boxes are displayed');
        result = true;
        resolve(result);
      }
    });
  }
  enterPointValues(val1, val2) {
    let result, value1Entered, value2Entered = false;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      const valueLevel2 = findElement(locatorType.XPATH, level2Value);
      valueLevel1.isDisplayed().then(function () {
        valueLevel1.sendKeys(val1);
        console.log('Values entered: ' + val1);
        value1Entered = true;
        library.logStep('Level 1 value entered');
        valueLevel2.isDisplayed().then(function () {
          valueLevel2.sendKeys(val2);
          console.log('Values entered: ' + val2);
          value2Entered = true;
          library.logStep('Level 2 value entered');
        });
      });
      if (value1Entered === true && value2Entered === true) {
        library.logStepWithScreenshot('Both the values entered', 'PointValuesEntered');
        result = true;
        resolve(result);
      }
    });
  }
  clickoncorrectiveactiondropdown() {
    let clicked = false;
    return new Promise((resolve) => {
      const Correctiveactiondropdown = findElement(locatorType.XPATH, correctiveactiondropdown);
      library.waitForElement(Correctiveactiondropdown);
      Correctiveactiondropdown.isDisplayed().then(function () {
        library.clickJS(Correctiveactiondropdown);
        clicked = true;
        library.logStepWithScreenshot('correctiveactiondropdown is displayed and clicked', 'correctiveactiondropdown is clicked');
        resolve(clicked);
      },
        function () {
          clicked = false;
          resolve(clicked);
        });
    });
  }
  selectthecorrectiveactions(actionname) {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const correctiveaction = element(by.xpath('//mat-option[@role="option"]//span[contains(text(),"' + actionname + '")]'));
      correctiveaction.isDisplayed().then(function () {
        library.clickJS(correctiveaction);
        library.logStepWithScreenshot('corrective action name is displayed and clicked', 'corrective action name is displayed and clicked');
        resolve(true);
      }).catch(function () {
        library.logFailStep('action value is not displayed');
        resolve(false);
      });;
    });
  }
  presenceofactiononToolTip(com) {
    library.waitForPage();
    return new Promise((resolve) => {
      const actionvalue = '//p[contains(text(),"Actions")]//parent::div//span//parent::li//p[contains(text(),"' + com + '")]';
      const actionvalueontooltip1 = findElement(locatorType.XPATH, actionvalue);
      actionvalueontooltip1.isDisplayed().then(function () {
        library.logStepWithScreenshot('action value  is displayed', 'action value  is displayed');
        resolve(true);
      }).catch(function () {
        library.logFailStep('action value is not displayed');
        resolve(false);
      });
    });
  }
  clickoncorrectiveactionicon() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const Correctiveactionicon = findElement(locatorType.XPATH, correctiveactionicon);
      Correctiveactionicon.isDisplayed().then(function () {
        dashBoard.waitForPage();
        browser.actions().mouseMove(findElement(locatorType.XPATH, correctiveactionicon)).click().perform();
        library.logStepWithScreenshot('correctiveactionicon is clicked', 'correctiveactionicon is clicked');
        resolve(true);
      },
        function () {
          library.logStepWithScreenshot('correctiveactionicon is not clicked', 'correctiveactionicon is not clicked');
          resolve(false);
        });
    });
  }
  presenceofDataonacorrectiveactionicon(com) {
    library.waitForPage();
    return new Promise((resolve) => {
      const actionvalue = '//p[contains(text(),"Actions")]//parent::div//span//parent::li//p[contains(text(),"' + com + '")]';
      const Textoncorrectiveicon = findElement(locatorType.XPATH, actionvalue);
      Textoncorrectiveicon.isDisplayed().then(function () {
        library.logStepWithScreenshot('Action comments on icon is verified', 'Action comments on icon is verified');
        browser.actions().mouseMove(findElement(locatorType.XPATH, Donebtn)).click().perform();
        resolve(true);
      }).catch(function () {
        library.logFailStep('Action comments on icon is not displayed');
        resolve(false);
      });
    });
  }
  clickonchooseaaction() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const chooseaaction1 = findElement(locatorType.XPATH, chooseaaction);
      chooseaaction1.isDisplayed().then(function () {
        library.clickJS(chooseaaction1);
        library.logStepWithScreenshot('chooseaaction is displayed and clicked', 'chooseaaction is displayed and clicked');
        resolve(true);
      },
        function () {
          library.logStep('chooseaaction dropdown is not clicked');
          resolve(false);
        });
    });
  }
  verifyEnteredPointValues(val1, val2) {
    library.waitForPage();
    let result, value1Entered, value2Entered = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const enteredValueLevel1 = findElement(locatorType.XPATH, enterValLvl1);
      const enteredValueLevel2 = findElement(locatorType.XPATH, enterValLvl2);
      enteredValueLevel1.getText().then(function (text1) {
        library.logStep(text1);
        if (text1.includes(val1)) {
          value1Entered = true;
          library.logStep('Verified level 1 value');
          console.log('Verified level 1 value');
        }
      });
      enteredValueLevel2.getText().then(function (text2) {
        library.logStep(text2);
        if (text2.includes(val2)) {
          value2Entered = true;
          library.logStep('Verified level 2 value');
          console.log('Verified level 2 value');
        }
      });
      if (value1Entered === true && value2Entered === true) {
        result = true;
        library.logStepWithScreenshot('Verified level 1 & level 2 values', 'VerifiedValues');
        resolve(result);
      }
    });
  }
  verifyEnteredPointValuesLvl1(val1) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const enteredValueLevel1 = findElement(locatorType.XPATH, "//span[contains(text(),'" + val1 + "') and @class='show']");
      enteredValueLevel1.isDisplayed().then(function () {
        library.logStep('Verified level 1 value');
        console.log('Verified level 1 value');
        library.logStepWithScreenshot('Verified level 1 value', 'VerifiedValues');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Failed : Values not Verified level 1');
        resolve(false);
      });
    });
  }
  clickEnteredValuesRow() {
    let status = false;
    return new Promise((resolve) => {
      const enteredValuesRow = findElement(locatorType.XPATH, enterValRow);
      library.scrollToElement(enteredValuesRow);
      enteredValuesRow.isDisplayed().then(function () {
        library.logStepWithScreenshot('Entered Values Row displayed', 'Entered Values Row displayed');
        library.clickJS(enteredValuesRow);
        library.logStep("entered row value is clicked")
        status = true;
        resolve(status);
      });
    });
  }
  isEditDialogDisplayed() {
    library.waitForPage();
    return new Promise((resolve) => {
      const Editdatapopup = findElement(locatorType.XPATH, editdatapopup);
      library.waitForElement(Editdatapopup);
      Editdatapopup.isDisplayed().then(function () {
        library.logStepWithScreenshot('Edit dialog is displayed', 'Edit dialog is displayed');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Edit dialog is not displayed');
        resolve(false);
      });;
    });
  }
  clickEditDialogCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      const editDialogBoxCancelButton = findElement(locatorType.XPATH, editDialogCancelButton);
      editDialogBoxCancelButton.isDisplayed().then(function () {
        library.clickJS(editDialogBoxCancelButton);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Edit dialog Cancel Button is clicked');
        resolve(status);
      });
    });
  }
  clickEditDialogDeleteButton() {
    library.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const deleteRecordButton = findElement(locatorType.XPATH, deleteRecord);
      library.waitForElement(deleteRecordButton);
      deleteRecordButton.isDisplayed().then(function () {
        library.clickJS(deleteRecordButton);
        status = true;
        library.logStepWithScreenshot('Edit dialog Delete Button is clicked', 'Edit dialog Delete Button is clicked');
        resolve(status);
      });
    });
  }
  verifyConfirmDeleteBtnOnPopUp() {
    return new Promise((resolve) => {
      const confirmDeleteButton = element(by.xpath(confirmDel));
      confirmDeleteButton.isDisplayed().then(function () {
        library.logStepWithScreenshot('Confirm Delete button is displayed', 'Confirm Delete button is displayed')
        confirmDeleteButton.click();
        library.logStep('Confirm Delete button is clicked');
        resolve(true);
      }).catch(function () {
        library.logFailStep('CConfirm Delete button is not  displayed');
        resolve(false);
      });
    });
  }
  verifyConfirmDeletePopup() {
    let status = false;
    return new Promise((resolve) => {
      const confirmDeletePopup = findElement(locatorType.XPATH, confirmDelPopup);
      library.waitForElement(confirmDeletePopup);
      confirmDeletePopup.isDisplayed().then(function () {
        const notification = findElement(locatorType.XPATH, notifyBeforeDelete);
        library.logStep('Confirm Delete Pop up displayed');
        notification.isDisplayed().then(function () {
          const cancelButtonOnPopup = element(by.xpath(cancelOnPopup));
          library.logStep('Notification Message - Are you sure you want to delete this test run? is displayed');
          cancelButtonOnPopup.isDisplayed().then(function () {
            const confirmDeleteButton = element(by.xpath(confirmDel));
            confirmDeleteButton.isDisplayed().then(function () {
              status = true;
              library.logStep('Cancel Button is displayed');
              library.logStep('Confirm Delete Button is displayed');
              resolve(status);
            });
          });
        });
      });
    });
  }
  clickConfirmDeleteButton() {
    let status = false;
    return new Promise((resolve) => {
      const confirmDeleteButton = findElement(locatorType.XPATH, confirmDel);
      confirmDeleteButton.isDisplayed().then(function () {
        library.clickJS(confirmDeleteButton);
        status = true;
        library.logStep('Edit dialog Confirm Delete Button is clicked');
        resolve(status);
      });
    });
  }
  clickManuallyEnterData() {
    library.waitForPage();
    return new Promise((resolve) => {
      const enterdatalink = findElement(locatorType.XPATH, manualEnterData);
      library.waitForElement(enterdatalink);
      enterdatalink.isDisplayed().then(function () {
        library.logStepWithScreenshot('Manually enter data is displayed', 'Manually enter data is displayed');
        library.clickJS(enterdatalink);
        library.logStepWithScreenshot('Manually enter data is clicked', 'Manually enter data is clicked');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Manually enter data is not displayed');
        resolve(false);
      });
    });
  }
  enteredDataRowExists() {
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const enteredValuesRow = element(by.xpath(enterValRow));
      enteredValuesRow.isDisplayed().then(function () {
        library.logStep('Entered values row is displayed.');
        resolve(true);
      }).catch(function () {
        library.waitForPage();
        library.logStepWithScreenshot('Entered values row is not displayed.', 'Entered values row is not displayed');
        resolve(false);
      });
    });
  }
  // once the tool tip is visible, put tool tip validation code in below method
  hoverOverDateOfEnteredValuesRow() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const dateOfEnteredValuesRow = element(by.xpath(enterValRow));
      library.scrollToElement(dateOfEnteredValuesRow);
      dateOfEnteredValuesRow.isDisplayed().then(function () {
        browser.actions().mouseMove(dateOfEnteredValuesRow);
        library.logStep('Mouse hovered over Date.');
        status = true;
        resolve(status);
      });
    });
  }

  // once the tool tip is visible, put tool tip validation code in below method
  hoverOverEditDialogDeleteButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const deleteRecordButton = element(by.xpath(deleteRecord));
      deleteRecordButton.isDisplayed().then(function () {
        browser.actions().mouseMove(deleteRecordButton);
        status = true;
        library.logStep('Mouse hovered over Delete Button of Edit dialog');
        resolve(status);
      });
    });
  }
  verifySubmitButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const submit = element(by.xpath(submitBtn));
      submit.isDisplayed().then(function () {
        library.logStep('Submit Data Enabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit Data is not Enabled');
        status = false;
        resolve(status);
      });
    });
  }
  // once the tool tip is visible, put tool tip validation code in below method
  hoverOverSubmitDataButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const submit = element(by.xpath(submitBtn));
      submit.isDisplayed().then(function () {
        browser.actions().mouseMove(submit);
        status = true;
        library.logStep('Mouse hovered over Submit Data Button');
        resolve(status);
      });
    });
  }
  clickCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      const cancelButton = findElement(locatorType.XPATH, cancel);
      cancelButton.isDisplayed().then(function () {
        library.scrollToElement(cancelButton);
        library.clickJS(cancelButton);
        status = true;
        library.logStep('Cancel Button is clicked');
        resolve(status);
      });
    });
  }
  clickDeleteConfirmationPopupCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const cancelButtonOnPopup = element(by.xpath(cancelOnPopup));
      cancelButtonOnPopup.isDisplayed().then(function () {
        library.clickJS(cancelButtonOnPopup);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Cancel Button is clicked');
        resolve(status);
      });
    });
  }
  async clickSubmitUpdatesButton() {
    const submitUpdatesButton = await element(by.xpath(submitUpdates));
    await library.waitTillClickable(submitUpdatesButton, 8888);
    library.clickJS(submitUpdatesButton);
    await library.waitLoadingImageIconToBeInvisible();
    library.logStep('Submit Updates Button on Edit Dialog is clicked');
  }
  verifyTopPageHeaderTestView(test) {
    library.waitForPage();
    let verifyTopPageHeader, productHeader = false;
    return new Promise((resolve) => {
      library.logStep('In verify Top Page Header - Product View');
      const prodHeadEle = findElement(locatorType.XPATH, './/h1[contains(text(),"' + test + '")]');
      library.waitForElement(prodHeadEle);
      prodHeadEle.getText().then(function (head1) {
        if (head1.includes(test)) {
          library.logStep('Header 1 is: ' + head1);
          productHeader = true;
        }
      });
      if (productHeader === true) {
        library.logStepWithScreenshot('In Test View all Header Components are displayed', 'In Test View all Header Components are displayed');
        verifyTopPageHeader = true;
        resolve(verifyTopPageHeader);
      }
    });
  }
  verifySummaryStatisticsTableIsEmpty() {
    return new Promise((resolve) => {
      const tableWithData = element(by.xpath(summarychartwithdata));
      tableWithData.isDisplayed().then(function () {
        library.logFailStep('Summary Statistics is displayed with data');
        resolve(false);
      }).catch(function () {
        library.logStepWithScreenshot('Empty Summary Statistics is displayed', 'Empty Summary Statistics is displayed ');
        resolve(true);
      });
    });
  }
  enterPointValuesEditDialog(val1, val2) {
    let result, value1Entered, value2Entered = false;
    return new Promise(async (resolve) => {
      const level1txtbx = await element(by.xpath(editDialogLevel1Textbox));
      const level2txtbx = await element(by.xpath(editDialogLevel2Textbox));
      library.waitForElement(level1txtbx);
      await level1txtbx.isDisplayed().then(function () {
        level1txtbx.clear();
        level1txtbx.sendKeys(val1);
        value1Entered = true;
        library.logStepWithScreenshot('Level 1 value entered', 'Level 1 value entered');
      });
      await level2txtbx.isDisplayed().then(function () {
        level2txtbx.clear();
        level2txtbx.sendKeys(val2);
        value2Entered = true;
        library.logStepWithScreenshot('Level 2 value entered', 'Level 2 value entered');
      });
      if (value1Entered === true && value2Entered === true) {
        result = true;
        console.log("Entered Here");
        resolve(result);
      }
    });
  }
  clickChangeLotLink() {
    let status = false;
    return new Promise((resolve) => {
      const changeLotLink = element(by.xpath(changeLot));
      changeLotLink.isDisplayed().then(function () {
        library.clickJS(changeLotLink);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Change Lot link is clicked');
        resolve(status);
      });
    });
  }
  clickReagentLotDropDown() {
    let status = false;
    return new Promise((resolve) => {
      const reagentLotDropDown = element(by.xpath(reagentLotval1));
      reagentLotDropDown.isDisplayed().then(function () {
        library.clickJS(reagentLotDropDown);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Reagent Lot DropDown arrow is clicked');
        resolve(status);
      });
    });
  }
  optionsInDropDown(dropDownName) {
    let status = false;
    return new Promise((resolve) => {
      const options = element.all(by.className(optionText));
      options.each(function (option) {
        option.getText().then(function (value) {
          library.logStep('Available values in dropdown' + dropDownName + ' ' + value);
          status = true;
          resolve(status);
        });
      });
    });
  }
  clickCalibratorLotDropDown() {
    let status = false;
    return new Promise((resolve) => {
      const calibratorLotDropDown = element(by.xpath(callibratorLotDrpdwn));
      calibratorLotDropDown.isDisplayed().then(function () {
        library.clickJS(calibratorLotDropDown);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Calibrator Lot DropDown arrow is clicked');
        resolve(status);
      });
    });
  }
  clickHideData() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const hideDataButton = findElement(locatorType.XPATH, hideDataBtn);
      library.waitForElement(hideDataButton);
      hideDataButton.isDisplayed().then(function () {
        library.clickJS(hideDataButton);
        library.logStep('Hide Data Button clicked');
        resolve(true);
      }).catch(function () {
        library.logStep('Hide Data Button not displayed');
        resolve(false);
      });
    });
  }
  clickShowData() {
    let status = false;
    return new Promise((resolve) => {
      const showDataButton = findElement(locatorType.CSS, shwdata);
      library.clickJS(showDataButton);
      dashBoard.waitForPage();
      status = true;
      library.logStep('Show Data Button clicked');
      resolve(status);
    });
  }
  getSelectedValuesReagentCalibrator() {
    let reagent, calibrator, status;
    return new Promise((resolve) => {
      const reagentSelectedValue = element(by.xpath(reagentValSelected));
      const calibratorSelectedValue = element(by.xpath(calibratorValSelected));
      reagentSelectedValue.isDisplayed().then(function () {
        reagentSelectedValue.getText().then(function (reagentValue) {
          reagent = reagentValue;
        });
      });
      calibratorSelectedValue.isDisplayed().then(function () {
        calibratorSelectedValue.getText().then(function (calibratorValue) {
          calibrator = calibratorValue;
          status = reagent + ',' + calibrator;
          resolve(status);
        });
      });
    });
  }
  goToTestFromLabSetup(test) {
    let status = false;
    return new Promise((resolve) => {
      const testElement = element(by.xpath(testEle));
      testElement.isDisplayed().then(function () {
        // library.clickJS(testElement);
        testElement.click().then(function () {
          dashBoard.waitForElement();
          status = true;
          resolve(status);
          library.logStep(test + ' Test Link Clicked');
        });
      });
    });
  }
  getReagentLotNumberFromLabSetup() {
    let status;
    return new Promise((resolve) => {
      const testElement = element(by.xpath(reagentLotSpan));
      testElement.isDisplayed().then(function () {
        testElement.getText().then(function (selectedReagentLot) {
          status = selectedReagentLot;
          resolve(status);
        });
      });
    });
  }
  getCalibratorLotNumberFromLabSetup() {
    let status;
    return new Promise((resolve) => {
      const testElement = element(by.xpath(calibratorLotSpan));
      library.scrollToElement(testElement);
      testElement.getText().then(function (selectedCalibratorLot) {
        status = selectedCalibratorLot;
        resolve(status);
      });
    });
  }
  selectReagentFromReagentLotDropDown(reagent) {
    let status = false;
    return new Promise((resolve) => {
      const reagentValue = element(by.xpath('//span[@class=optionText][contains(text(),"' + reagent + '")]'));
      reagentValue.isDisplayed().then(function () {
        library.clickJS(reagentValue);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Reagent Value selected from the Reagent Lot dropdown');
        resolve(status);
      });
    });
  }
  selectCalibratorFromCalibratorLotDropDown(calibrator) {
    let status = false;
    return new Promise((resolve) => {
      const calibratorValue = element(by.xpath('//span[@class="mat-option-text" and contains(text(),"' + calibrator + '")]'));
      calibratorValue.isDisplayed().then(function () {
        library.clickJS(calibratorValue);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Calibrator Value selected from the Calibrator Lot dropdown');
        resolve(status);
      });
    });
  }
  clickInsertPastResultsLink() {
    let status = false;
    return new Promise((resolve) => {
      const insertPastResultLink = element(by.xpath(insertPastResult));
      insertPastResultLink.isDisplayed().then(function () {
        library.clickJS(insertPastResultLink);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Insert past result link is clicked');
        resolve(status);
      });
    });
  }
  clickOpenCalendarButton() {
    let status = false;
    return new Promise((resolve) => {
      const datePickerButton = findElement(locatorType.XPATH, datePicker);
      datePickerButton.isDisplayed().then(function () {
        library.clickJS(datePickerButton);
        status = true;
        library.logStep('Open Calendar Button is clicked');
        resolve(status);
      });
    });
  }
  clickYearMonthSelectorButton() {
    let status = false;
    return new Promise((resolve) => {
      const yearMonthSelectorButton = findElement(locatorType.XPATH, monthSelector);
      yearMonthSelectorButton.isDisplayed().then(function () {
        library.clickJS(yearMonthSelectorButton);
        status = true;
        library.logStep('Date Picker Button is clicked');
        resolve(status);
      });
    });
  }
  selectYear(year) {
    let status = false;
    return new Promise((resolve) => {
      const yearToBeSelected = findElement(locatorType.XPATH, '//div[@class="mat-calendar-body-cell-content"][contains(text(),"' + year + '")]');
      yearToBeSelected.isDisplayed().then(function () {
        library.clickJS(yearToBeSelected);
        status = true;
        library.logStep('Year ' + year + ' Selected');
        resolve(status);
      });
    });
  }
  selectMonth(month) {
    let status = false;
    return new Promise((resolve) => {
      const monthToBeSelected = findElement(locatorType.XPATH, '//div[@class="mat-calendar-body-cell-content"][contains(text(),"' + month + '")]');
      monthToBeSelected.isDisplayed().then(function () {
        library.clickJS(monthToBeSelected);
        status = true;
        library.logStep('Month ' + month + ' Selected');
        resolve(status);
      });
    });
  }
  selectDate(date) {
    let status = false;
    return new Promise((resolve) => {
      const dateToBeSelected = findElement(locatorType.XPATH, '//div[@class="mat-calendar-body-cell-content"][contains(text(),"' + date + '")]');
      dateToBeSelected.isDisplayed().then(function () {
        library.clickJS(dateToBeSelected);
        status = true;
        library.logStep('Date ' + date + ' Selected');
        resolve(status);
      });
    });
  }
  verifyValuesCleared() {
    let result, value1Cleared, value2Cleared = false;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      const valueLevel2 = findElement(locatorType.XPATH, level2Value);
      valueLevel1.isDisplayed().then(function () {
        valueLevel2.getText().then(function (val1) {
          if (val1 === '') {
            value1Cleared = true;
            library.logStep('Level 1 value cleared');
          }
        });
      });
      valueLevel2.isDisplayed().then(function () {
        valueLevel2.getText().then(function (val2) {
          if (val2 === '') {
            value2Cleared = true;
            library.logStep('Level 2 value cleared');
          }
        });
      });
      if (value1Cleared === true && value2Cleared === true) {
        library.logStepWithScreenshot('Both the values cleared', 'ValuesCleared');
        result = true;
        resolve(result);
      }
    });
  }
  dateLabelDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const dateLabel1 = findElement(locatorType.CSS, dateLabel);
      dateLabel1.isDisplayed().then(function () {
        result = true;
        resolve(result);
      });
    });
  }
  verifyPastResultInserted(date, val1) {
    let result = false;
    return new Promise((resolve) => {
      const dataRows = element(by.xpath('(.//tr[@class="ng-star-inserted"])'));
      const count = dataRows.length();
      library.logStep(count);
      for (let i = 2; i <= count; i++) {
        const dataRow = element(by.xpath('(.//tr[@class="ng-star-inserted"])["' + i + '"]'));
        dataRow.isDisplayed().then(function () {
          element(by.xpath('(.//tr[@class="ng-star-inserted"])["' + i + '"]/td[1]')).getText().then(function (text) {
            if (text.includes(date)) {
              element(by.xpath('(.//tr[@class="ng-star-inserted"])["' + i + '"]/td[3]')).getText().then(function (value1) {
                if (value1.includes(val1)) {
                  result = true;
                  library.logStepWithScreenshot('Verified Past Result Inserted', 'PastResult');
                  resolve(result);
                }
              });
            }
          });
        });
      }
    });
  }
  scrollToTop() {
    let result = false;
    return new Promise((resolve) => {
      const valueLevel1 = element(by.xpath('.//input[@tabindex="1"]'));
      browser.executeScript('arguments[0].scrollIntoView();', valueLevel1);
      valueLevel1.isDisplayed().then(function () {
        result = true;
        library.logStep('Scrolled to top');
        resolve(result);
      });
    });
  }
  verifySubmitButtonDisabled() {
    library.waitForPage();
    return new Promise((resolve) => {
      const error = findElement(locatorType.XPATH, submitDisabled);
      error.isDisplayed().then(function () {
        library.logStepWithScreenshot('Submit data button is Disabled.', 'Submit data button is Disabled.');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Submit data button is not Disabled.');
        resolve(false);
      });
    });
  }
  hoverOverTest() {
    let hover = false;
    return new Promise((resolve) => {
      const mValue = element(by.xpath(testSection));
      library.scrollToElement(mValue);
      library.hoverOverElement(mValue);
      library.logStep('Hovered over test.');
      dashBoard.waitForElement();
      hover = true;
      resolve(hover);
    });
  }

  isOptionDisplayed() {
    let reagent, calibrator, comment, flag, hideFlag = false;
    return new Promise((resolve) => {
      const reagentLotSelect = element(by.xpath(reagentLotSelectEle));
      library.scrollToElement(reagentLotSelect);
      const calibratorLotSelect = element(by.xpath(calibratorLotSelectEle));
      const pastResult = element(by.xpath(pastResultLink));
      const hide = element(by.xpath(hideOption));
      reagentLotSelect.isDisplayed().then(function () {
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
      pastResult.isDisplayed().then(function () {
        comment = true;
        library.logStep(' Forgot to enter a prior run? link is displayed.');
      }).catch(function () {
        comment = false;
        library.logFailStep(' Forgot to enter a prior run? link is not displayed.');
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

  clickHideOption() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const hideOptionsLink = element(by.xpath(hideOption));
      library.clickJS(hideOptionsLink);
      library.logStep('Hide Option Link clicked.');
      dashBoard.waitForPage();
      clickShowOpt = true;
      resolve(clickShowOpt);
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

  clickForgotToEnterPastResultsLink() {
    let status = false;
    return new Promise((resolve) => {
      const insertPastResultLink = findElement(locatorType.XPATH, forgotToEnterPastResultLink);
      insertPastResultLink.isDisplayed().then(function () {
        library.clickJS(insertPastResultLink);
        status = true;
        library.logStep('Forgot to enter prior result link is clicked');
        resolve(status);
      });
    });
  }

  verifyReagentLotDropdownUnavailable() {
    let status = false;
    return new Promise((resolve) => {
      const noreagentLotDropdownValues = element(by.xpath(reagentLotDropdownNotAvailable));
      noreagentLotDropdownValues.isDisplayed().then(function () {
        library.logStepWithScreenshot('Reagent Lot Dropdown Unavailable', 'ReagentLotDropdownUnavailable');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Reagent Lot Dropdown available');
        status = false;
        resolve(status);
      });
    });
  }

  verifyCalibratorLotDropdownUnavailable() {
    let status = true;
    return new Promise((resolve) => {
      const calibratorLotDropdownValues = element(by.xpath(calibratorLotDropdownNotAvailable));
      calibratorLotDropdownValues.isDisplayed().then(function () {
        library.logStepWithScreenshot('Calibrator Lot Dropdown Unavailable', 'CalibratorLotDropdownUnavailable');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Calibrator Lot Dropdown available');
        status = true;
        resolve(status);
      });
    });
  }

  // New Lab Setup 'Edit This Analyte' link
  verifyEditThisAnalyteLinkIsPresent() {
    let status = true;
    return new Promise((resolve) => {
      const editAnalyte = element(by.xpath(editThisAnalyteButton));
      editAnalyte.isDisplayed().then(function () {
        library.logStep('Edit This Analyte link is present');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Edit This Analyte link is not present');
        status = false;
        resolve(status);
      });
    });
  }

  clickEditThisAnalyteLink() {
    let status = true;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const editAnalyte = findElement(locatorType.XPATH, editThisAnalyteButton);
      editAnalyte.isDisplayed().then(function () {
        editAnalyte.click().then(function () {
          library.logStep('Edit Analyte link clicked');
          status = true;
          resolve(status);
        });
      }).catch(function () {
        library.logFailStep('Unable to click Edit Analyte link');
        status = false;
        resolve(status);
      });
    });
  }

  scrollToPointEntryTextbox() {
    let status = true;
    return new Promise((resolve) => {
      const valueLevel1 = element(by.xpath(level1value));
      library.scrollToElement(valueLevel1);
      library.clickJS(valueLevel1);
      dashBoard.waitForScroll();
      library.logStep('Scrolled to Point Data Entry Textbox');
      status = true;
      resolve(status);
    });
  }

  scrollToCommentBox() {
    let status = true;
    return new Promise((resolve) => {
      const cmtbx = findElement(locatorType.XPATH, commentBox);
      library.scrollToElement(cmtbx);
      library.logStepWithScreenshot('Scrolled to Comment Box', 'Scrolled to Comment Box');
      status = true;
      resolve(status);
    });
  }

  isCommentIconPresent() {
    let status = false;
    return new Promise((resolve) => {
      const cmtIcon = element(by.xpath(commentIcon));
      cmtIcon.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Comment Icon is present', 'CommentIcon');
        resolve(status);
      }).catch(function () {
        library.logFailStep('Comment Icon not present');
        status = false;
        resolve(status);
      });
    });
  }

  clickCommentIcon() {
    let status = false;
    return new Promise((resolve) => {
      const cmtIcon = element(by.xpath(commentIcon));
      cmtIcon.isDisplayed().then(function () {
        cmtIcon.click();
        status = true;
        library.logStepWithScreenshot('Comment Icon clicked', 'CommentIconClicked');
        resolve(status);
      }).catch(function () {
        library.logFailStep('Comment Icon not present');
        status = false;
        resolve(status);
      });
    });
  }

  isReviewSummaryDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const reviewSummary = element(by.xpath(reviewSummarySection));
      reviewSummary.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Review Summary displayed', 'ReviewSummaryDisplayed');
        resolve(status);
      }).catch(function () {
        library.logFailStep('Review Summary not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  checkCommentText(comment) {
    let status = false;
    return new Promise((resolve) => {
      const cmt = element(by.xpath(commentEntered));
      cmt.isDisplayed().then(function () {
        cmt.getText().then(function (text) {
          if (text.includes(comment)) {
            status = true;
            library.logStepWithScreenshot('Comment is correct', 'CommentCorrect');
            resolve(status);
          } else {
            library.logFailStep('Incorrect Comment');
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Comment is not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  clickReviewSummaryDoneButton() {
    let status = false;
    return new Promise((resolve) => {
      const doneBtn = element(by.xpath(reviewSummaryDoneButton));
      doneBtn.isDisplayed().then(function () {
        doneBtn.click();
        status = true;
        library.logStepWithScreenshot('Done Button clicked', 'DoneClicked');
        resolve(status);
      }).catch(function () {
        library.logFailStep('Done Button not clicked');
        status = false;
        resolve(status);
      });
    });
  }

  checkCommentCount(count) {
    let status = false;
    return new Promise((resolve) => {
      const cmtCount = element(by.xpath(commentCount));
      cmtCount.isDisplayed().then(function () {
        cmtCount.getText().then(function (num) {
          if (num === count) {
            status = true;
            library.logStepWithScreenshot('Comment count is correct', 'CommentIcon');
            resolve(status);
          } else {
            library.logFailStep('Incorrect Comment count');
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Comment Count not displayed');
        status = false;
        resolve(status);
      });
    });
  }
  enterAllPointValues(val1, val2, val3) {
    let result;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      const valueLevel2 = findElement(locatorType.XPATH, level2Value);
      const valueLevel3 = findElement(locatorType.XPATH, level3Value);
      console.log(val1);
      browser.sleep(700);
      valueLevel1.clear();
      valueLevel1.sendKeys(val1);

      library.logStep('Level 1 value entered');
      valueLevel2.clear();
      valueLevel2.sendKeys(val2);

      library.logStep('Level 2 value entered');
      valueLevel3.clear();
      valueLevel3.sendKeys(val3);

      library.logStep('Level 3 value entered');
      library.logStepWithScreenshot('All the values entered', 'PointValuesEntered');
      result = true;
      resolve(result);

    });
  }
  verifyEnteredPointValue(val1, val2, val3) {
    let result, value1Entered, value2Entered, value3Entered = false;
    return new Promise((resolve) => {
      const enteredValueLevel1 = findElement(locatorType.XPATH, enterValLvl1);
      const enteredValueLevel2 = findElement(locatorType.XPATH, enterValLvl2);
      const enteredValueLevel3 = findElement(locatorType.XPATH, enterValLvl3);
      // library.scrollToElement(enteredValueLevel1);
      enteredValueLevel1.getText().then(function (text1) {
        library.logStep(text1);
        if (text1.includes(val1)) {
          value1Entered = true;
          library.logStep('Verified level 1 value');
        }
      });
      enteredValueLevel2.getText().then(function (text2) {
        library.logStep(text2);
        if (text2.includes(val2)) {
          value2Entered = true;
          library.logStep('Verified level 2 value');
        }
      });
      enteredValueLevel3.getText().then(function (text3) {
        library.logStep(text3);
        if (text3.includes(val3)) {
          value3Entered = true;
          library.logStep('Verified level 3 value');
        }
      });
      if (value1Entered === true && value2Entered === true && value3Entered === true) {
        result = true;
        library.logStepWithScreenshot('Verified level 1 & level 2 values', 'VerifiedValues');
        resolve(result);
      }
    });
  }
  enterPointValueLevel1(val1) {
    let result = false;
    return new Promise((resolve) => {
      const valueLevel1 = findElement(locatorType.XPATH, level1value);
      valueLevel1.isDisplayed().then(function () {
        valueLevel1.sendKeys(val1);
        library.logStep('Level 1 value entered');
        result = true;
        resolve(result);
      });
    });
  }
  verifyEnteredPointValueLevel1(val1) {
    let result = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const enteredValueLevel1 = element(by.xpath(enterValLvl1));
      browser.wait(browser.ExpectedConditions.visibilityOf(enteredValueLevel1), 120000, 'Value is not visible');
      enteredValueLevel1.getText().then(function (text1) {
        library.logStep(text1);
        if (text1.includes(val1)) {
          result = true;
          library.logStep('Verified level 1 value');
          resolve(result);
        }
      });
    });
  }
  verifyFutureDateSelection(date) {
    let status = false;
    return new Promise((resolve) => {
      const dateToBeSelected = element(by.xpath('//div[@class="mat-calendar-body-cell-content"][contains(text(),"' + date + '")]/parent::td[@aria-disabled="true"][@aria-selected="false"]'));
      dateToBeSelected.isDisplayed().then(function () {
        status = true;
        library.logStep('Future Date ' + date + ' cannot be Selected');
        resolve(status);
      });
    });
  }
  verifySubmitButtonTooltip() {
    let status = false;
    return new Promise((resolve) => {
      const idString = 'cdk-describedby-message-';
      const toolTipMessage = 'Your results will be submitted to your peers';
      const toolTipElement = element(by.xpath('.//div[contains(@id,"' + idString + '")][contains(text(),"' + toolTipMessage + '")]'));
      toolTipElement.isDisplayed().then(function () {
        library.logStep('Tool Tip Displayed as: Your results will be submitted to your peers');
      });
      const submitButton = element(by.xpath('//span[text()=" SEND TO PEER GROUP "]/parent::button[contains(@aria-describedby,"' + idString + '")]'));
      submitButton.isDisplayed().then(function () {
        library.hoverOverElement(submitButton);
        library.logStepWithScreenshot('Submit Button is displayed with Tooltip as Your results will be submitted to your peers', 'submitToolTip');
        status = true;
        resolve(status);
      });
    });
  }
  verifyEditButtonTooltip() {
    let status = false;
    return new Promise((resolve) => {
      const idString = 'cdk-describedby-message-';
      const toolTipMessage = 'View and edit data';
      const toolTipElement = element(by.xpath('.//div[contains(@id,"' + idString + '")][contains(text(),"' + toolTipMessage + '")]'));
      toolTipElement.isDisplayed().then(function () {
        library.logStep('Tool Tip Displayed as: View and edit data');
      });
      const editButton = element(by.xpath('//td[contains(@aria-describedby,"' + idString + '")]'));
      editButton.isDisplayed().then(function () {
        library.hoverOverElement(editButton);
        library.logStepWithScreenshot('Edit Button is displayed with Tooltip as View and edit data', 'editToolTip');
        status = true;
        resolve(status);
      });
    });
  }
  verifyDeleteButtonTooltip() {
    let status = false;
    return new Promise((resolve) => {
      const deleteButton = element(by.xpath('.//button[@mattooltip="Delete this data set"]'));
      deleteButton.isDisplayed().then(function () {
        library.hoverOverElement(deleteButton);
        library.logStepWithScreenshot('Delete Button is displayed with Tooltip as Delete this data set', 'deleteToolTip');
        status = true;
        resolve(status);
      });
    });
  }
  verifyPointDataTablePageEmpty() {
    let status = false;
    return new Promise((resolve) => {
      const dataPresent = element(by.xpath(pointDataPresent));
      dataPresent.isDisplayed().then(function () {
        status = false;
        library.logFailStep('Point Data Table Page is not empty');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStepWithScreenshot('Point Data Table Page is empty', 'EmptyPage');
        resolve(status);
      });
    });
  }
  verifyTimeFormatForSummary() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath('//*[contains(@class,"ic-chat-bubble-outline")]'))), 10000, 'Element is not visible');
      element(by.xpath('//*[contains(@class,"ic-chat-bubble-outline")]')).click().then(function () {
        element(by.xpath('(//*[contains(@class,"small gray inline-block")]//span[3])[1]')).getText().then(function (text) {

          if (text.length == 10) {
            console.log('Time displayed width matched - 1')
            library.logStepWithScreenshot('Time displayed width matched', 'Matched');
            resolve(true)
          } else {
            console.log('Failed : Time displayed width is not matched - 1')
            library.logStepWithScreenshot('Failed : Time displayed width is not matched', 'No Matched');
            resolve(false)
          }
        });
        element(by.xpath(reviewSummaryDoneButton)).click().then(function () {
          console.log('Clicked on Done button')
        });
      });
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath('//*[contains(@class,"ic-history")]'))), 10000, 'Element is not visible');
      element(by.xpath('//*[contains(@class,"ic-history")]')).click().then(function () {
        element(by.xpath('(//*[contains(@class,"small gray inline-block")]//span[3])[1]')).getText().then(function (text) {

          if (text.length == 10) {
            console.log('Time displayed width matched - 2')
            library.logStepWithScreenshot('Time displayed width matched', 'Matched');
            resolve(true)
          } else {
            console.log('Failed : Time displayed width is not matched - 2')
            library.logStepWithScreenshot('Failed : Time displayed width is not matched', 'No Matched');
            resolve(false)
          }
        });
        element(by.xpath(reviewSummaryDoneButton)).click().then(function () {
          console.log('Clicked on Done button')
        });
      });
    });
  }
  verifyTimeFormatForPointEntry() {
    return new Promise((resolve) => {
      browser.sleep(3000);
      browser.wait(browser.ExpectedConditions.elementToBeClickable
        (element(by.xpath('//*[contains(@class,"ic-pez ic-history")]//preceding::span[1]'))), 30000, 'Element is not visible');
      element(by.xpath('//*[contains(@class,"ic-pez ic-history")]//preceding::span[1]')).click().then(function () {
        element(by.xpath('(//*[contains(@class,"small gray inline-block")]//span[3])[1]')).getText().then(function (text) {

          if (text.length == 10) {
            console.log('Time displayed width matched - 3')
            library.logStepWithScreenshot('Time displayed width matched', 'Matched');
            resolve(true)
          } else {
            console.log('Failed : Time displayed width is not matched - 3')
            library.logStepWithScreenshot('Failed : Time displayed width is not matched', 'No Matched');
            resolve(false)
          }
        });
        element(by.xpath(reviewSummaryDoneButton)).click().then(function () {
          console.log('Clicked on Doen button')
        });
      });
    });
  }

  ClickOnEditDialogueButtonOnTestLevel(lValue) {
    dashBoard.waitForPage();
    let editDialogBtnClicked = false;
    return new Promise((resolve) => {
      let scrollTestLevelRow = '(//tr[@class="ng-star-inserted"])//td//span[text()=" ' + lValue + ' " and @class="show"]';
      const scroll = findElement(locatorType.XPATH, scrollTestLevelRow);
      library.clickJS(scroll);
      library.logStep('Clicked on edit dialogue button on test level');
      console.log('Clicked on edit dialogue button on test level');
      library.logStepWithScreenshot('Editdata', 'Editdata Screenshot');
      browser.sleep(2000);

      editDialogBtnClicked = true;
      resolve(editDialogBtnClicked);
    });
  }
  async clickonrestartFloatIcon() {
    let status = false;
    const Restartfloatbtn = await element(by.xpath(restartfloat));
    await library.waitTillClickable(Restartfloatbtn, 8888);
    try {
      library.clickJS(Restartfloatbtn);
      status = true;
      library.logStep('Restartfloatbtn on Edit Dialog is clicked');
      console.log('Restart float icon is clicked');
      library.logStepWithScreenshot('Restart float', 'Restart float');
    }
    catch (e) {
      library.logStep(' Restartfloatbtn on Edit Dialog is not clicked');
      console.log('Restart float icon is not clicked');
      status = false;
    };
    return status;
  }
  clickShowOptions() {
    let status = false;
    return new Promise((resolve) => {
      const showbutton = element(by.xpath(showOptions));
      showbutton.isPresent().then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(showbutton), 25000, 'Unable to click show options button');
        library.clickJS(showbutton);
        status = true;
        library.logStep('Show options Clicked.');
        resolve(status);
      });
    });
  }
  selectReagentLotAtDataEntry(reagentLot) {
    let status1 = false;
    return new Promise((resolve) => {
      const reagentLotOptionsEle = element(by.xpath(reagentLotOptions));
      reagentLotOptionsEle.isPresent().then(function () {
        library.clickJS(reagentLotOptionsEle);
        library.logStep('Reagent lot option Clicked.');
        console.log('Reagent lot option Clicked.')
        const reagentLotElement = element(by.xpath('.//mat-option//span[contains(text(),"' + reagentLot + '")]'));
        reagentLotElement.isDisplayed().then(function () {
          library.clickJS(reagentLotElement);
          dashBoard.waitForScroll();
          status1 = true;
          console.log("Reagent sleected = " + reagentLot);
          library.logStepWithScreenshot('Reagent lot selected = ' + reagentLot, 'ReagentUpdated');
          resolve(true);
        });
      }).catch(function () {
        library.logFailStep('Not able to select Reagent lot');
        status1 = false;
        resolve(status1);
      });
    });
  }
  clickManuallyMultiEntryEnterData() {
    let status = false;
    return new Promise((resolve) => {
      const enterSummary = findElement(locatorType.XPATH, manuallyMultiEntryData);
      enterSummary.isDisplayed().then(function () {
        library.clickJS(enterSummary);
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }
  enterMultiPointValue(tabIndex, val1) {
    let result, value1Entered = false;
    return new Promise((resolve) => {
      const valueLevel1 = element(by.xpath('.//input[@tabindex="' + tabIndex + '"]'));
      valueLevel1.isDisplayed().then(function () {
        library.scrollToElement(valueLevel1);
        valueLevel1.sendKeys(val1);
        console.log('Values entered: ' + val1);
        value1Entered = true;
        library.logStep('Level 1 value entered');
        library.logStepWithScreenshot('Both the values entered', 'PointValuesEntered');
        result = true;
        resolve(result);
      });
    });
  }
  clickEnteredValuesRow2(val) {
    let status = false;
    return new Promise((resolve) => {
      const enteredValuesRow = findElement(locatorType.XPATH, "//span[contains(text(),'" + val + "') and @class='show']");
      library.scrollToElement(enteredValuesRow);
      enteredValuesRow.isDisplayed().then(function () {
        library.clickJS(enteredValuesRow);
        library.logStep('Entered Values Row Clicked');
        status = true;
        resolve(status);
      });
    });
  }
  chooseAnAction(action) {
    return new Promise((resolve) => {
      library.clickJS(findElement(locatorType.XPATH, chooseAnAction));
      const actionName = element(by.xpath('//*[contains(text(),"' + action + '")]'));
      library.scrollToElement(actionName);
      library.logStepWithScreenshot('Width Dsiplayed Correctly', 'Width displayed');
      library.clickJS(actionName);
      library.logStepWithScreenshot('Action Selected', 'Selected');
      resolve(true);
    });
  }
  verifyActionDisplayed(action) {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(clickOnActionDisplayIcon))), 10000, 'Element is not visible');
      element(by.xpath(clickOnActionDisplayIcon)).click().then(function () {
        const isActionDisplayed = findElement(locatorType.XPATH, '//*[contains(text(),"' + action + '")]');
        isActionDisplayed.isDisplayed().then(function () {
          library.logStepWithScreenshot('Action Displayed', 'Selected');
          resolve(true);
        }).catch(function () {
          library.logStepWithScreenshot('Failed - Action Not Displayed', 'Not Displayed');
          resolve(false);
        });
      });
    });
  }
  clickOnSendToPeerGrpButton() {
    return new Promise((resolve) => {
      const button = element(by.xpath(sendToPeerGrp));
      button.isDisplayed().then(function () {
        library.clickJS(button);
        library.logStep('Send to peer group button clicked');
        resolve(true);
      });
    });
  }

  clickOnInsertDifferentDate() {
    return new Promise((resolve) => {
      const link = element(by.xpath(insertDiiferentDate));
      link.isDisplayed().then(function () {
        library.clickJS(link);
        library.logStep('Insert Different button is clicked');
        resolve(true);
      });
    });
  }
  clickManuallyEnterDataWhenEdit() {
    let status = false;
    return new Promise((resolve) => {
      library.waitForPage();
      const enterSummary = findElement(locatorType.XPATH, manuallyEnterDataWhenEdit);
      enterSummary.isDisplayed().then(function () {
        library.clickJS(enterSummary);
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }
}
