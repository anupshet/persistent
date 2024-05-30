/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const product = '(//h5[contains(text(),"ADVIA 1200")])';
const meanEl = '(//br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span)[1]';
const meanElnew = '((//span[contains(text(),"mean")])[2]//parent::td//following-sibling::td//span)[1]';
const sdEl = '((//span[contains(text(),"sd")])[2]//parent::td//following-sibling::td//span)[1]';
const pointEl = '((//span[contains(text(),"points")])[2]//parent::td//following-sibling::td//span)[1]';
const instrumentLink = '(//span[@class="toggle-children"])[3]';
const cancelBtnButton = '(//button[contains(text(),"Cancel")])[2]';
const cancelButtonOnSummary = '//button/span[contains(text(),"Cancel")]';
const meanE = '//br-analyte-summary-view//tr[1]/td[3]/div/div/span';
const sdE = '//br-analyte-summary-view//tr[2]/td[3]/div/div/span';
const pointE = '//br-analyte-summary-view//tr[3]/td[3]/div/div/span';
const productLink = '(//tree-node-children/div/tree-node-collection/div/tree-node/div/tree-node-wrapper/div/tree-node-expander/span/span)[2]';
const verifyDeleteMessage = '//button[@mattooltip="Delete this data set"]';
const VerifyMessageOpenCommandField = '//div[@class="mat-tooltip ng-trigger ng-trigger-state"]';
const deleteDataSetValue = '//mat-dialog-container/unext-data-entry-edit//button/span/mat-icon[contains(text(),"delete")]';
const SubmitButtonMsgVerified = '//br-analyte-summary-entry//div/button[contains(@aria-describedby,"cdk-describedby-message")]';
const trashIconMessageVerified = '//mat-dialog-container/br-dialog/section/div/h2[contains(text(),"Are you sure you want to delete this test run?")]';
const deleteDataSetvalue = '//mat-dialog-container/unext-data-entry-edit//button/span/mat-icon[contains(text(),"delete")]';
const ClickdoneButton = '//button[contains(text(),"DONE")]';
const zoomOutScreen = 'zoomOut';
const cancelBtn1 = 'cancelBtn';
const pointValue = '//mat-form-field//input[@id="13"]';
const confirmDeleteMsg = '//br-dialog//span[text()=" Confirm Delete "]';
const deleteDataSetDialouge = '//div[@class="data-entry-edit-component mat-typography"]';
const verifyCommentInputfielsValue = 'enteredCommentContent';
const scrolltoSubmitDataButtonDisabledV = '//button[@disabled][text()="Submit Data"]';
const commentLink = '(//span[contains(text(),"Add comment")])[1]';
const CommentValue2 = '(//mat-dialog-container/br-pez-dialog/section//div//span/following-sibling::p)[1]';
const meanEleV = '21';
const sdEleV = '22';
const pointEleV = '23';
const deleteDataSetDisplayed = '//div[@class="wrapper mat-typography analyte-summary-entry-component"]';
const dataTableText = 'DATA TABLE';
const spcRulesLink = '//a[contains(text(),"SPC RULES")]';
const connectivityLink = '//a[contains(text(),"Connectivity")]';
const actualValueOfLastMonth = '//button[@aria-label="Choose month and year"]/span[@class="mat-button-wrapper"]';
const lastDateSelectedActualValue = '//div[contains(@class,"calendar-body-selected")]';
const nextMonthDate = 'mat-calendar-next-button mat-icon-button';
const checkNextdayDisabled = '//div[@class="mat-calendar-body-cell-content mat-calendar-body-today"]/parent::td/following-sibling::td';
const nextMonthDisabledValue = '//button[contains(@class,"mat-calendar-next-button mat-icon-button")][@disabled="true"]';
const selectedDateToday = '//div[@class="mat-calendar-body-cell-content mat-calendar-body-today"]';
const userInformation = 'user-info';
const dataTableLink = '//a[contains(text(),"DATA TABLE")]';
const editDialogueCancelBtn = '(//button/span[text()="Cancel"])';
const outSideDatepicker = 'cdk-overlay-backdrop mat-overlay-transparent-backdrop cdk-overlay-backdrop-showing';
const callibratorLotEle1 = '(.//div[@class="mat-select-value"]/span/span)[2]';
const reagentLotEle2 = '(.//div[@class="mat-select-value"]/span/span)[1]';
const clickDatepicker1 = '//button[@aria-label="Open calendar"]';
const changeLotValue = '(//span[contains(text(),"Change lot")])[1]';
const reagentValue = '(//mat-select[1])[1]';
const calibratorValue = '(//mat-select[1])[2]';
const changeLotValueNew = '(//span[contains(text(),"Change lot")])[2]';
const clickOnTest1 = '//*[@id="svg"]//*[@class="pill-test ng-star-inserted"]/*[@fill="#000000"][text()="Calcium"]';
const clickOnDashboard = '//h1[@class="page-title"]';
const clickLabsetup = 'LoginComponent.LabSetup';
const submitButton = '(//Button[@id="submitBtn"])[2]';
const submitButtonData = 'submitBtn';
const submitButtonmsg = '//span[text()="Submit Data"]';
const reagentLotEleValue = '(//mat-select[1])[5]';
const calibratorNewValue = '(//mat-select[1])[9]';
const scrollTestLevel = '(//br-analyte-summary-view//div//table//tr//td//span[contains(text(),"mean")])[1]';
const deleteVerifyMsg = '//button[contains(@class,"delete-icon")]';
const addCommentValue = '//span[contains(text(),"Add comment")]';
const showOptionsEle = './/span[contains(@class, "show-options")]';
const addCommentTextBox = '(.//textarea[@formcontrolname="comments"])[1]';
const editdata = 'data-entry-edit-component';
const cumText = '//mat-header-cell[contains(text(),"CUM")]';
const submitButtonEdit = '//span[contains(text(),"Submit Updates")]';
const editTooltipMsg = '//br-analyte-summary-view//table//tr[1]//td[contains(@aria-describedby,"cdk-describedby")][1]';
const CancelOnEditBox = '//mat-button-toggle-group/button/span[contains(text(),"Cancel")]';
const backArrow = '//button[contains(@class,"backArrow")]/span';
const addCommentTxtArea = '//textarea[@placeholder="Add a comment "]';
const addComments = '(//br-pez-cell/span[contains(@class,"grey pez ng-star-inserted")])[1]';
const submitDisabled = '//button[@id="submitBtn"][@disabled="true"]';
const doneBtnHistory = '//br-review-summary//button/span[text()="DONE"]';
const showDataArrow = '//unext-analytical-section/section//div/span[contains(@class,"chevron")]';
const submitUpdates = './/span[text()="Submit Updates"]';
const summaryDataPresent = './/table[@role="grid"]';
const manuallyEnterDataOption = '//*[contains(@class,"page-title-manual-container")]//a';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Single-Summary.json', (err, data) => {
  if (err) {
    throw err;
  }
  const multiSummaryData = JSON.parse(data);
  jsonData = multiSummaryData;
});

export class SingleSummary {
  navigateTO(to) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(20000);
      browser.wait(element(by.xpath('//mat-nav-list//div[contains(text(),"' + to + '")]')).isPresent());
      const sideNav = element(by.xpath('//mat-nav-list//div[contains(text(),"' + to + '")]'));
      library.clickJS(sideNav);
      flag = true;
      library.logStep('User is navigated to ' + to);
      resolve(flag);
    });
  }

  getProducttext() {
    return new Promise((resolve) => {
      const text = element(by.xpath(product));
      const expect = 'ADVIA 1200';
      text.getText().then(function (actual) {
        if (actual === expect) {
          log4jsconfig.log().info('Verify product text');
          resolve(true);
        }
      });
    });
  }

  getLastDayofPreviousMonth() {
    let lastmonth, status = false;
    return new Promise((resolve) => {
      const date = element(by.id('undefinedDate'));
      date.getText().then(function (actual) {
        const d = new Date();
        d.setDate(1);
        console.log('last month ::' + d.getMonth());
        console.log('Actual date::' + actual);
        lastmonth = true;
        if (lastmonth) {
          status = true;
          resolve(status);
        }
      });
    });
  }

  // verifyEnteredValueByMonth(expectedMean, expectedSD, expectedPoint,month) {
  //   var mean = false, sd = false, point = false, displayed = false;
  //   return new Promise((resolve) => {
  //     const today = new Date();
  //     const months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  //     const now       = new Date();
  //     const thisMonth = months[now.getMonth()];
  //     const monthDisplayed = element(by.xpath('//h6[contains(text(),"' + month + '")]'));
  //     console.log(thisMonth);
  //       monthDisplayed.getText().then(function (monthtext) {
  //       if(monthtext.includes(thisMonth)){
  //         dashBoard.waitForPage();
  //         const meanEle = element(by.xpath(meanElnew));
  //         const sdEle = element(by.xpath(sdEl));
  //         const pointEle = element(by.xpath(pointEl));
  //         library.scrollToElement(meanEle);
  //         meanEle.getText().then(function (meanVal) {
  //           if (meanVal == expectedMean) {
  //             mean = true;
  //           } else {
  //             mean = false;
  //          }
  //         })
  //         library.scrollToElement(sdEle);
  //         sdEle.getText().then(function (sdVal) {
  //         if (sdVal.includes(expectedSD)) {
  //             sd = true;
  //          } else {
  //             sd = false;
  //           }
  //         })
  //         library.scrollToElement(pointEle);
  //         pointEle.getText().then(function (pointVal) {
  //         if (pointVal.includes(expectedPoint)) {
  //             point = true;
  //         } else {
  //             point = false;
  //           }
  //         })
  //         if (mean === true && sd === true && point === true) {
  //           displayed = true;
  //           library.logStep('verified entered value stored test');
  //           resolve(displayed);
  //         }
  //       }
  //     })

  //   })
  // }

  verifyEnteredValueByMonth(month) {
    let displayed = false;
    return new Promise((resolve) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const now = new Date();
      const thisMonth = months[now.getMonth()];
      const showData = element(by.xpath(showDataArrow));
      library.scrollToElement(showData);
      library.clickJS(showData);
      browser.sleep(5000);
      const monthDisplayed = element(by.xpath('//br-analyte-summary-view//span[contains(text(),"' + month + '")]'));
      browser.sleep(5000);
      library.scrollToElement(monthDisplayed);
      monthDisplayed.getText().then(function (monthtext) {
        if (monthtext.includes(thisMonth)) {
          library.logStep('Single Summary Page shows Multiple Views Summary by Month');
          displayed = true;
          resolve(displayed);
        } else {
          library.logStep('Single Summary Page do not shows Multiple Views Summary by Month');
          displayed = false;
          resolve(displayed);
        }
      });
    });
  }

  addComment(cmnt, test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let comment = false;
      const commentAdd = element(by.xpath(addCommentTxtArea));
      commentAdd.isDisplayed().then(function () {
        library.scrollToElement(commentAdd);
        commentAdd.sendKeys(test).then(function () {
          comment = true;
          resolve(comment);
        });
      });
    });
  }
  verifyEnteredValueStoredTest(expectedMean, expectedSD, expectedPoint) {
    browser.sleep(10000);
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      console.log('Entered in value stored function');
      const meanEle = findElement(locatorType.XPATH, meanElnew);
      const sdEle = element(by.xpath(sdEl));
      const pointEle = element(by.xpath(pointEl));
      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {

        if (meanVal === expectedMean) {
          mean = true;
          console.log('meanEle' + meanEle);
        } else {
          mean = false;
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sdVal) {

        if (sdVal.includes(expectedSD)) {
          sd = true;
        } else {
          sd = false;
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (pointVal) {

        if (pointVal.includes(expectedPoint)) {
          point = true;

        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('verified entered value stored test');

        resolve(displayed);
      }
    });
  }
  verifyEnteredValueStoredTestLevel2(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      const meanEle = findElement(locatorType.XPATH, meanE);

      const sdEle = element(by.xpath(sdE));

      const pointEle = element(by.xpath(pointE));

      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {


        if (meanVal.includes(expectedMean)) {
          mean = true;

        } else {
          mean = false;
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sdVal) {


        if (sdVal.includes(expectedSD)) {
          sd = true;

        } else {
          sd = false;
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (pointVal) {

        if (pointVal.includes(expectedPoint)) {
          point = true;

        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('verified entered value stored test Level2');
        resolve(displayed);
      }

    });

  }

  clickOnInstrumentLink() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let spcrules = false;
      const iLink = element(by.xpath(instrumentLink));
      iLink.click().then(function () {
        library.logStep('licked on instrument link');
        dashBoard.waitForElement();

        spcrules = true;
      }).then(function () {
        resolve(spcrules);
      });
    });
  }

  clickOnProductLink() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let spcrules = false;
      const pLink = element(by.xpath(productLink));
      pLink.click().then(function () {
        library.logStep('Clicked on the product link');
        dashBoard.waitForElement();

        spcrules = true;
      }).then(function () {
        resolve(spcrules);
      });
    });
  }

  clickCancelButtonOnTest() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = element(by.xpath(cancelBtnButton));
      cancelBtn.click().then(function () {
        library.logStep('Clicked on cancel button on test');

        clickCancelBtn = true;
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  ClickOnEditDialogueButtonOnTestLevel() {
    console.log('entered in edit ');
    return new Promise((resolve) => {
      let editDialogBtnClicked = false;
      const scroll = findElement(locatorType.XPATH, scrollTestLevel);
      library.scrollToElement(scroll);
      library.clickJS(scroll);
      library.logStep('Clicked on edit dialogue button on test level');
      console.log('Clicked on edit dialogue button on test level');
      editDialogBtnClicked = true;
      resolve(editDialogBtnClicked);
    });
  }

  deleteButtonTooltipVerified() {
    return new Promise((resolve) => {
      let text2 = false;

      browser.actions().mouseMove(findElement(locatorType.XPATH, deleteVerifyMsg)).perform();
      dashBoard.waitForElement();
      const exp = jsonData.VerifyDeleteMessage;
      const act = element(by.xpath(verifyDeleteMessage));
      act.getText().then(function (actual) {
        if (actual === exp) {
          text2 = true;
          library.logStep('Verified delete message');
          resolve(text2);
        }
      });
    });
  }

  VerifiedMessageOpenCommentfieldOnAddComment() {
    return new Promise((resolve) => {

      let text1 = false;

      browser.actions().mouseMove(element(by.xpath(addCommentValue))).perform();
      dashBoard.waitForElement();
      const exp = jsonData.AddCommentMessage;
      const act = element(by.xpath(VerifyMessageOpenCommandField));
      act.getText().then(function (actual) {

        if (actual === exp) {
          text1 = true;
          library.logStep('Verified message open comment field on add comment');
          resolve(text1);
        }


      });
    });
  }


  DeleteData() {
    return new Promise((resolve) => {

      let cleared = false;

      const deleteDataSet = element(by.xpath(deleteDataSetValue));
      deleteDataSet.click().then(function () {


        const confirmDelete = element(by.id(confirmDeleteMsg));
        confirmDelete.click();
        library.logStep('clicked on delete data');

        dashBoard.waitForPage();
        cleared = true;
        resolve(cleared);


      });
    });
  }

  HoverEditMsgVerified() {
    return new Promise((resolve) => {
      let text1 = false;
      const testLevel = findElement(locatorType.XPATH, scrollTestLevel);
      library.scrollToElement(testLevel);
      // browser.actions().mouseMove(element(by.xpath(scrollTestLevel))).perform().then(function(){
      const act = element(by.xpath(editTooltipMsg));
      library.scrollToElement(act);
      act.isDisplayed().then(function () {
        console.log('View and Edit Data tooltip displayed');
        library.logStep('View and Edit Data tooltip displayed');
        text1 = true;
        resolve(text1);
      }).catch(function () {
        console.log('View and Edit Data tooltip not displayed');
        library.logStep('View and Edit Data tooltip not displayed');
        text1 = false;
        resolve(text1);
      });
    });
    // });
  }

  VerifySubmitButtonToolTip() {
    return new Promise((resolve) => {
      let text1 = false;
      const submitBtn = findElement(locatorType.XPATH, submitButtonmsg);
      library.scrollToElement(submitBtn);

      const act = element(by.xpath(SubmitButtonMsgVerified));
      library.scrollToElement(act);

      act.isDisplayed().then(function () {
        library.logStep('submit button tool tip verified');
        console.log('submit button tool tip verified');
        text1 = true;
        resolve(text1);
      }).then(function () {
        text1 = false;
        library.logStep('Hover the submit button msg not displayed');
        resolve(text1);
      });
    });
  }

  confirmDeleteMessageVerified() {
    return new Promise((resolve) => {
      let text1 = false;
      const exp = jsonData.trashIconMessageVerified;
      const act = element(by.xpath(trashIconMessageVerified));
      act.getText().then(function (actual) {
        if (actual.includes(exp)) {
          text1 = true;
          library.logStep('Trash icon message verified');
          resolve(text1);
        }
      });
    });
  }


  ClickonTrashIcon() {
    return new Promise((resolve) => {
      let cleared = false;
      dashBoard.waitForElement();
      const deleteDataSet = element(by.xpath(deleteDataSetvalue));
      library.clickAction(deleteDataSet);
      cleared = true;
      library.logStep('Clicked on trash icon');
      resolve(cleared);
    });
  }

  ConfirmDeleteIsEnabledVerified() {
    return new Promise((resolve) => {
      let delete1 = false;
      const deleteDataSet = element(by.xpath(confirmDeleteMsg));
      deleteDataSet.isEnabled().then(function () {
        library.logStep('Confirm delete isEnabled verified');
        delete1 = true;
        resolve(delete1);
      }).then(function () {
        delete1 = false;
        library.logStep('Confirm delete is not enabled');
        resolve(delete1);
      });
    });
  }

  ClickOnCancleBUttonOnTrashPopup() {
    return new Promise((resolve) => {
      let cancel1 = false;
      const cancelButtonOnPopUp = element(by.xpath(CancelOnEditBox));
      cancelButtonOnPopUp.isDisplayed().then(function (value) {
        if (value === true) {
          library.clickJS(cancelButtonOnPopUp);
          library.logStep('Clicked on Cancel on pop up');
          cancel1 = true;
          resolve(cancel1);
        }
      });
    });
  }

  VerifiedDialougeBox() {
    return new Promise((resolve) => {
      let Dialogue = false;
      const deleteDataSet = element(by.xpath(deleteDataSetDialouge));
      deleteDataSet.isDisplayed().then(function (act) {
        if (act === true) {
          Dialogue = true;
          log4jsconfig.log().info('Verified dialouge box');
          resolve(Dialogue);
        }
      });
    });
  }

  ClickOnAddCommentandVerifyInputField(test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let inputField = false;

      const commentAdd = element(by.xpath('(//span[contains(text(),"Add comment")])[' + test + ']'));
      library.scrollToElement(commentAdd);

      commentAdd.click().then(function () {

        const verifyCommentInputfiels = element(by.name(verifyCommentInputfielsValue));
        verifyCommentInputfiels.isDisplayed().then(function (act) {
          if (act === true) {
            inputField = true;
            log4jsconfig.log().info('Clicked On add comment and verify input field');


            resolve(inputField);

          }

        });
      });
    });
  }
  scrolltoSubmitDataButtonDisabled() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();

      const scrolltoSubmitDataButtonDisabled1 = element(by.xpath(scrolltoSubmitDataButtonDisabledV));
      library.scrollToElement(scrolltoSubmitDataButtonDisabled1);
      scrolltoSubmitDataButtonDisabled1.click().then(function () {
        resolve(true);
        log4jsconfig.log().info('Scrolled to submit data button disabled');

      });
    });
  }

  clickonAddCommentLink() {
    return new Promise((resolve) => {
      let addComment = false;

      const comment = element(by.xpath(commentLink));
      comment.click().then(function () {
        dashBoard.waitForPage();

        addComment = true;
        log4jsconfig.log().info('clicked on addd comment link');
        resolve(addComment);
      });
    });
  }


  verifyCommentValueFromTooltip(test) {
    return new Promise((resolve) => {
      let tooltip = false;
      const cmntIcon = element(by.xpath('(//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));
      library.scrollToElement(cmntIcon);
      browser.actions().mouseMove(cmntIcon).perform();
      dashBoard.waitForElement();

      const CommentValue1 = element(by.xpath(CommentValue2));
      const expectedValue = 'Test Comment';
      CommentValue1.getText().then(function (actualvalue) {


        if (actualvalue === expectedValue) {
          tooltip = true;
          log4jsconfig.log().info('verified comment value from tooltip');

          resolve(tooltip);
        }
      });
    });
  }
  verifyEnteredValueStoredTestEditDialogueBox(expectedMean, expectedSD, expectedPoint) {
    let mean = false, sd = false, point = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();

      const meanEle = element(by.id(meanEleV));

      const sdEle = element(by.id(sdEleV));

      const pointEle = element(by.id(pointEleV));
      library.scrollToElement(meanEle);
      meanEle.getText().then(function (meanVal) {

        if (meanVal.includes(expectedMean)) {
          mean = true;

        } else {
          mean = false;
        }
      });
      library.scrollToElement(sdEle);
      sdEle.getText().then(function (sdVal) {

        if (sdVal.includes(expectedSD)) {
          sd = true;

        } else {
          sd = false;
        }
      });
      library.scrollToElement(pointEle);
      pointEle.getText().then(function (pointVal) {

        if (pointVal.includes(expectedPoint)) {
          point = true;

        } else {
          point = false;
        }
      });
      if (mean === true && sd === true && point === true) {
        displayed = true;
        library.logStep('verified entered value on edit dialouge box');
        resolve(displayed);
      }
    });

  }


  deleteValuesOnEditDialogueBoxTestLevel() {

    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const meanEle = element(by.id(meanEleV));
      meanEle.sendKeys(protractor.Key.CONTROL, 'a');
      meanEle.sendKeys(protractor.Key.DELETE).then(function () {
      });

      const sdEle = element(by.id(sdEleV));
      sdEle.sendKeys(protractor.Key.CONTROL, 'a');
      sdEle.sendKeys(protractor.Key.DELETE).then(function () {

      });

      const pointEle = element(by.id(pointEleV));
      pointEle.sendKeys(protractor.Key.CONTROL, 'a');
      pointEle.sendKeys(protractor.Key.DELETE).then(function () {


      });
      resolve(true);
    });
  }


  VerifySingleSummaryPage() {
    return new Promise((resolve) => {

      let Dialogue = false;


      const deleteDataSet = element(by.xpath(deleteDataSetDisplayed));
      deleteDataSet.isDisplayed().then(function (act) {
        if (act === true) {
          Dialogue = true;
          log4jsconfig.log().info('verified single summary page');
          resolve(Dialogue);
        }
        resolve(Dialogue);

      });
    });
  }


  VerifyDataTableSpcRuleConnectivityTestLevel() {
    let data, spc, connect, testlevel = false;
    return new Promise((resolve) => {


      const dataTable = element(by.linkText(dataTableText));
      const spcRules = element(by.xpath(spcRulesLink));
      const connectivity = element(by.xpath(connectivityLink));

      dataTable.isDisplayed().then(function () {
        data = true;


        spcRules.isDisplayed().then(function () {
          spc = true;


          connectivity.isDisplayed().then(function () {
            connect = true;



            if (data === true && spc === true && connect === true) {

              testlevel = true;
              log4jsconfig.log().info('Verified data table spcRule connectivity test level');
              resolve(testlevel);

            }
          });
        });
      });

    });
  }


  verifyTestNameProductLevel(test) {
    let result, testHeader = false;
    return new Promise((resolve) => {
      const testName = element(by.xpath('.//h6[text()="' + test + '"]'));
      testName.isDisplayed().then(function () {
        testHeader = true;
        if (testHeader === true) {
          result = true;
          log4jsconfig.log().info('verified test name on product level');
          resolve(result);
        }
      });
    });
  }

  verifySingleEntryPageHeader(test) {
    let result, testHeader = false;
    return new Promise((resolve) => {
      const testNameHeader = element(by.xpath('.//h1[text()="' + test + '"]'));
      testNameHeader.isDisplayed().then(function () {
        testHeader = true;
        if (testHeader === true) {
          result = true;
          log4jsconfig.log().info('verified single entry page header');
          resolve(result);
        }
      });
    });
  }

  verifyLastdayoftheLastmonth() {
    let lastdate = false;
    return new Promise((resolve) => {
      const date = new Date();
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const lastMonthExpValue = months[date.getMonth() - 1];
      const actualValueLastMonth = element(by.xpath(actualValueOfLastMonth));
      const lastDateSelectedActual = element(by.xpath(lastDateSelectedActualValue));
      actualValueLastMonth.getText().then(function (actual1) {
        const lastMonthActualValue = actual1.substr(4, 3);
        if (lastMonthExpValue === lastMonthActualValue) {
          if (lastMonthExpValue === 'JAN' || lastMonthExpValue === 'MAR' ||
            lastMonthExpValue === 'MAY' || lastMonthExpValue === 'JULY' ||
            lastMonthExpValue === 'AUG' || lastMonthExpValue === 'OCT' || lastMonthExpValue === 'DEC') {
            lastDateSelectedActual.getText().then(function (lastDateActual) {
              const expDate = '31';
              if (lastDateActual === expDate) {
                lastdate = true;
                library.logStep('verified month jan,mar,may,july,aug,oct,dec');
                console.log('verified month jan,mar,may,july,aug,oct,dec');
                resolve(lastdate);
              }
            });
          }
        } else if (lastMonthExpValue === 'APR' ||
          lastMonthExpValue === 'JUN' || lastMonthExpValue === 'SEP' || lastMonthExpValue === 'NOV') {
          lastDateSelectedActual.getText().then(function (lastDateActual) {
            const expDate = '30';
            if (lastDateActual === expDate) {
              lastdate = true;
              library.logStep('verified month apr,jun,sep,nov');
              console.log('verified month apr,jun,sep,nov');
              resolve(lastdate);
            }
          });
        } else {
          lastDateSelectedActual.getText().then(function (lastDateActual) {
            if (lastDateActual === '29' || lastDateActual === '28') {
              lastdate = true;
              library.logStep('verified Feb month');
              console.log('verified Feb month');
              resolve(lastdate);
            }
          });
        }
      });
    });
  }

  clickonDatePickerLink() {
    return new Promise((resolve) => {
      let datePicker = false;
      // const point = findElement(locatorType.XPATH, pointValue);
      // library.scrollToElement(point);
      const datepicker1 = findElement(locatorType.XPATH, clickDatepicker1);
      // const datepicker1 = findElement(locatorType.CLASSNAME, clickDatepicker1) ;
      library.scrollToElement(datepicker1);
      // browser.actions().mouseMove(datepicker1).perform();
      //  datepicker1.click().then(function () {
      //   datePicker = true;
      //   log4jsconfig.log().info('click on date picker Link');
      // }).then(function () {
      //   resolve(datePicker);
      // });
      library.clickJS(datepicker1);
      datePicker = true;
      resolve(datePicker);
    });
  }

  verifyEnteredComment(com) {
    browser.sleep(10000);
    return new Promise((resolve) => {
      let comment = false;

      const commentBox = findElement(locatorType.XPATH, addComments);
      library.scrollToElement(commentBox);
      commentBox.isDisplayed().then(function () {
        library.clickAction(commentBox);
        console.log('comment box displayed and clicked');
        library.logStep('comment box displayed and clicked');
        const doneBtn = element(by.xpath(doneBtnHistory));
        library.scrollToElement(doneBtn);

        doneBtn.isDisplayed().then(function () {
          library.clickJS(doneBtn);
          comment = true;
          resolve(comment);
        });
      });
    });

  }



  hoverTestClick(idEle) {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const mValue = findElement(locatorType.XPATH, '//*[@id="' + idEle + '"]');
      library.scrollToElement(mValue);
      mValue.sendKeys('');
      library.clickJS(mValue);
      console.log('Hovered over test.');
      library.logStep('Hovered over test.');
      clickShowOpt = true;
      resolve(clickShowOpt);
    });
  }

  clickonPoint() {
    let set = false;
    return new Promise((resolve) => {
      const point = findElement(locatorType.XPATH, pointValue);
      library.scrollToElement(point);
      set = true;
      library.logStep('future date cannot set');
      resolve(set);
    });
  }


  setFutureDate() {
    let set = false;
    return new Promise((resolve) => {
      const nextMonthDisabled = findElement(locatorType.XPATH, nextMonthDisabledValue);
      library.scrollToElement(nextMonthDisabled);
      nextMonthDisabled.isDisplayed().then(function (nextmonth) {
        if (nextmonth === true) {
          const selectedDate = element(by.xpath(selectedDateToday));
          library.clickJS(selectedDate);
          set = true;
          library.logStep('future date not set');
          resolve(set);
        } else {
          set = false;
          library.logStep('future date set');
          resolve(set);
        }
      });
    });
  }

  clickVerifyChangeLot() {
    return new Promise((resolve) => {
      try {
        let displayed = false;


        const changeLot = element(by.xpath(changeLotValue));
        library.scrollToElement(changeLot);



        const reagent = element(by.xpath(reagentValue));
        const calibrator = element(by.xpath(calibratorValue));
        changeLot.click();
        dashBoard.waitForElement();
        if (reagent.isDisplayed() && calibrator.isDisplayed()) {

          displayed = true;
          log4jsconfig.log().info('clicked to Verify Change Lot');
          resolve(displayed);
        } else {
          displayed = false;
          resolve(displayed);
        }
      } catch (error) {
        const displayed = false;
        resolve(displayed);
      }
    });
  }
  clickVerifyChangeLot2() {
    return new Promise((resolve) => {

      let displayed = false;
      const changeLot = element(by.xpath(changeLotValue));
      library.scrollToElement(changeLot);
      const reagent = element(by.xpath(reagentValue));
      const calibrator = element(by.xpath(calibratorValue));
      changeLot.click();
      dashBoard.waitForElement();
      if (reagent.isDisplayed() && calibrator.isDisplayed()) {

        displayed = true;
        log4jsconfig.log().info('clicked to Verify ChangeLot2');
        resolve(displayed);
      }
    });

  }

  clickVerifyChangeLot1() {
    return new Promise((resolve) => {

      let displayed = false;

      const reagent = element(by.xpath(reagentValue));
      const calibrator = element(by.xpath(calibratorValue));

      dashBoard.waitForElement();
      if (reagent.isDisplayed() && calibrator.isDisplayed()) {

        displayed = true;
        log4jsconfig.log().info('Verified ChangeLot value');
        resolve(displayed);
      } else {
        displayed = false;
        resolve(displayed);
      }
    });

  }



  clickVerifyChangeLotEditDialogueBox() {
    return new Promise((resolve) => {
      dashBoard.waitForElement();

      let displayed = false;

      const changeLot = element(by.xpath(changeLotValueNew));

      changeLot.click().then(function () {
        dashBoard.waitForElement();

        displayed = true;
        log4jsconfig.log().info('clicked on verify change lot edit dialogue box');
      }).then(function () {
        resolve(displayed);
      });
    });
  }
  verifyLotValues(ReagentLot, CallibratorLot) {
    let verifyNewLotValue, result, CallibratorLotVal = false;
    return new Promise((resolve) => {

      const reagentLotEle = element(by.xpath(reagentValue));
      const calibrator = element(by.xpath(calibratorValue));

      reagentLotEle.getText().then(function (actVal) {

        if (actVal === ReagentLot) {

          verifyNewLotValue = true;

          resolve(verifyNewLotValue);
        }



        calibrator.getText().then(function (actVal1) {

          if (actVal1 === CallibratorLot) {

            CallibratorLotVal = true;
            resolve(CallibratorLotVal);
          }


          if (verifyNewLotValue === true && CallibratorLotVal === true) {

            result = true;
            log4jsconfig.log().info('verify lot values');
            resolve(result);

          }
        });
      });
    });
  }

  clickonPerticulartextonLabSetupPage() {
    return new Promise((resolve) => {
      let test = false;

      const test1 = element(by.xpath(clickOnTest1));
      browser.actions().mouseMove(test1).perform();


      test1.click().then(function () {

        test = true;
        log4jsconfig.log().info('clicked on perticular text on lab setup page');
        resolve(test);
      });
    });
  }

  clickonPerticulartextonLabSetupPage1() {
    return new Promise((resolve) => {

      let test = false;
      library.clickJS(element);
      test = true;
      log4jsconfig.log().info('clicked on perticular text on lab setup page');
      resolve(test);

    });
  }

  clickonDashboardArrow() {
    return new Promise((resolve) => {
      let test = false;

      const dashboard = element(by.xpath(clickOnDashboard));
      dashboard.click().then(function () {

        test = true;
        log4jsconfig.log().info('clicked on dashboard arrow');
      }).then(function () {
        resolve(test);
      });
    });
  }

  clickonLabSetupPage() {
    return new Promise((resolve) => {
      let test = false;

      const labsetup = element(by.id(clickLabsetup));
      labsetup.click().then(function () {

        test = true;
        log4jsconfig.log().info('clicked on lab setup page');
      }).then(function () {
        resolve(test);
      });
    });
  }

  clickonSubmitButtonOnEditDialogueBox() {
    return new Promise((resolve) => {
      let test = false;

      const labsetup = element(by.xpath(submitButton));
      labsetup.click().then(function () {

        test = true;
        log4jsconfig.log().info('clicked on submit button on edit dialogueBox');
      }).then(function () {
        resolve(test);
      });
    });
  }

  verifyLotValuesOnLabSetuppage(ReagentLot, CallibratorLot) {

    return new Promise((resolve) => {
      let verifyNewLotValue, result, CallibratorLotVal = false;

      const reagentLotEle = element(by.xpath(reagentLotEleValue));
      dashBoard.waitForElement();
      library.scrollToElement(reagentLotEle);
      dashBoard.waitForElement();
      reagentLotEle.getText().then(function (actVal) {

        if (actVal.includes(ReagentLot)) {

          verifyNewLotValue = true;
        }


        const calibrator = element(by.xpath(calibratorNewValue));
        dashBoard.waitForElement();
        library.scrollToElement(calibrator);
        dashBoard.waitForElement();

        calibrator.getText().then(function (actVal1) {
          if (actVal1.includes(CallibratorLot)) {

            CallibratorLotVal = true;
          }


          if (verifyNewLotValue === true && CallibratorLotVal === true) {
            result = true;
            log4jsconfig.log().info('verified lot values on lab setup page');

            dashBoard.waitForElement();
            resolve(result);

          }
        });
      });
    });
  }

  changeReagentLot() {

    let changeReagentLot = false;
    return new Promise((resolve) => {


      const reagentLotEle = element(by.xpath(reagentLotEle2));
      library.scrollToElement(reagentLotEle);

      reagentLotEle.click();

      element(by.xpath('.//span[@class="mat-option-text"][text() ="" + newReagentLot + ""]')).click();
      dashBoard.waitForElement();

      changeReagentLot = true;
      log4jsconfig.log().info('changeed reagent Lot valued');
      resolve(changeReagentLot);


    });

  }

  clickBackArrow() {
    let statData = false;
    return new Promise((resolve) => {
      const controlBackArrow = element(by.xpath(backArrow));
      library.scrollToElement(controlBackArrow);
      browser.sleep(2000);
      controlBackArrow.isDisplayed().then(function () {
        console.log('back arrow displayed');
        library.clickJS(controlBackArrow);
        browser.sleep(10000);
        console.log('clicked control back arrow');
        library.logStep('clicked control back arrow');
        statData = true;
        resolve(statData);
      });
    });
  }
  clickAnalyte(analyte1) {
    let statData = false;
    return new Promise((resolve) => {
      const analyte = element(by.xpath('//mat-sidenav/div/div/div//unext-nav-side-bar-link/span/div[contains(text(),"' + analyte1 + '")]'));
      library.scrollToElement(analyte);
      browser.sleep(15000);
      analyte.isDisplayed().then(function () {
        library.clickJS(analyte);
        browser.sleep(15000);

        console.log('Analyte name displayed ');
        library.logStep('Analyte name displayed ');
        statData = true;
        resolve(statData);
      });
    });
  }
  changeCallibratortLot() {

    let changeCallibratortLot = false;
    return new Promise((resolve) => {


      const callibratorLotEle = element(by.xpath(callibratorLotEle1));
      library.scrollToElement(callibratorLotEle);

      callibratorLotEle.click();

      element(by.xpath('.//span[@class="mat-option-text"][text() ="" + newCallibratorLot + ""]')).click();

      dashBoard.waitForElement();

      changeCallibratortLot = true;
      log4jsconfig.log().info('changeed  callibratortLot value');
      resolve(changeCallibratortLot);


    });

  }

  verifyNewLotValue(oldReagentLot, oldCallibratorLot) {
    let verifyNewLotValue, reagentLotVal, CallibratorLotVal = false;
    return new Promise((resolve) => {


      const reagentLotEle = element(by.xpath(reagentLotEle2));
      library.scrollToElement(reagentLotEle);

      reagentLotEle.getAttribute('textContent').then(function (newReagentLot) {
        if (newReagentLot !== oldReagentLot) {
          reagentLotVal = true;

        } else {
          reagentLotVal = false;

        }
      });

      const callibratorLotEle = element(by.xpath(callibratorLotEle1));
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
            log4jsconfig.log().info('verified new lot values');
            resolve(verifyNewLotValue);
          }
        }
      });


    });


  }

  changeReagentLotonEditDialogueBox() {

    let changeReagentLot = false;
    return new Promise((resolve) => {


      const reagentLotEle = element(by.xpath(reagentLotEle2));
      library.scrollToElement(reagentLotEle);

      reagentLotEle.click();

      element(by.xpath('.//span[@class="mat-option-text"][text() ="" + newReagentLot + ""]')).click();
      dashBoard.waitForElement();

      changeReagentLot = true;
      log4jsconfig.log().info('changeed reagentLot on edit dialogue box');
      resolve(changeReagentLot);


    });
  }

  changeCallibratortLotonEditDialogueBox() {

    let changeCallibratortLot = false;
    return new Promise((resolve) => {


      const callibratorLotEle = element(by.xpath(callibratorLotEle1));
      library.scrollToElement(callibratorLotEle);

      callibratorLotEle.click();

      element(by.xpath('.//span[@class="mat-option-text"][text() ="" + newCallibratorLot + ""]')).click();

      dashBoard.waitForElement();

      changeCallibratortLot = true;
      log4jsconfig.log().info('changeed on callibratortLot on edit dialogue box');
      resolve(changeCallibratortLot);


    });

  }
  clickonOutsidetheCalender() {
    return new Promise((resolve) => {
      let datePicker = false;
      const datepicker1 = element(by.className(outSideDatepicker));
      library.scrollToElement(datepicker1);
      datepicker1.click().then(function () {
        datePicker = true;
        log4jsconfig.log().info('clicked on out side calender');
      }).then(function () {
        resolve(datePicker);
      });
    });
  }

  clickEditDialogCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const editDialogBoxCancelButton = element(by.xpath(editDialogueCancelBtn));
      // browser.actions().mouseMove(editDialogBoxCancelButton).perform();
      library.scrollToElement(editDialogBoxCancelButton);

      editDialogBoxCancelButton.isDisplayed().then(function () {
        library.clickJS(editDialogBoxCancelButton);
        dashBoard.waitForPage();
        status = true;
        library.logStep('Edit dialog Cancel Button is clicked');
        resolve(status);
      });
    });
  }

  addCommentonEditDialogueBox(cmnt, test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();

      let comment = false;
      const commentAdd = element(by.xpath('(//span[contains(text(),"Add comment")])[' + test + ']'));
      library.scrollToElement(commentAdd);
      commentAdd.click().then(function () {
        dashBoard.waitForElement();
        const comment1 = element(by.xpath('(//span[contains(text(),"Add comment")])[' + test + ']/parent::div/following-sibling::form//textarea'));
        comment1.sendKeys(cmnt).then(function () {

          comment = true;
          log4jsconfig.log().info('added comment on dialogue box');
          resolve(comment);
        });
      });
    });

  }

  clickonDataTable() {
    return new Promise((resolve) => {
      let level = false;

      const data = element(by.xpath(dataTableLink));
      browser.actions().mouseMove(data).perform();
      dashBoard.waitForElement();
      data.click().then(function () {
        dashBoard.waitForElement();

        level = true;
        log4jsconfig.log().info('clicked on data table');
      }).then(function () {
        resolve(level);
      });
    });
  }

  clickonLevel3() {
    let level = false;
    return new Promise((resolve) => {


      const userInfo = browser.driver.findElement(by.className(userInformation));
      library.scrollToElement(userInfo);
      browser.actions().mouseMove(element(by.className(userInformation))).perform();


      level = true;
      log4jsconfig.log().info('clicked on level');
      resolve(true);

    });

  }

  VerifyCancelBtn() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = findElement(locatorType.XPATH, cancelButtonOnSummary);
      // const cancelBtn = element(by.xpath(cancelButtonOnSummary));
      library.scrollToElement(cancelBtn);
      cancelBtn.isDisplayed().then(function () {
        clickCancelBtn = true;
        library.logStep('Cancel button is displayed.');
        resolve(clickCancelBtn);
      });
    });
  }


  clickCancelBtn() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;

      const cancelBtn = element(by.id(cancelBtn1));
      cancelBtn.isDisplayed().then(function () {
        library.clickJS(cancelBtn);
        clickCancelBtn = true;
        log4jsconfig.log().info('verified cancel button');
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  zoomOut() {
    return new Promise((resolve) => {
      let zoom = false;
      dashBoard.waitForElement();
      const zoomOut = element(by.id(zoomOutScreen));
      zoomOut.click().then(function () {
        dashBoard.waitForElement();

        zoom = true;
        log4jsconfig.log().info('zoom out successful');
      }).then(function () {
        resolve(zoom);
      });
    });
  }


  clickonDone() {
    return new Promise((resolve) => {
      let review = false;
      dashBoard.waitForPage();
      dashBoard.waitForElement();
      dashBoard.waitForElement();

      const doneButton = element(by.xpath(ClickdoneButton));
      doneButton.click().then(function () {
        dashBoard.waitForElement();
        dashBoard.waitForElement();


        review = true;
        log4jsconfig.log().info('clicked on done button');
      }).then(function () {
        resolve(review);
      });
    });
  }

  singleSummaryPage() {
    return new Promise((resolve) => {
      let status = false;
      // browser.wait(element(by.xpath('//h1[contains(text(),'' + analytename + '')]')).isPresent())
      const enterSummary = findElement(locatorType.XPATH, '//a[text()="Manually enter summary"]');
      enterSummary.isDisplayed().then(function () {
        status = true;
        library.logStep('Single Summary page display.');
        console.log('Single Summary page display.');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStep('Single Summary page not display.');
        resolve(status);
      });
    });
  }

  verifyEmptySummaryStatisticTable() {
    let statisticsData = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const CUM = element(by.xpath(cumText));
      CUM.isDisplayed().then(function () {
        console.log('Summary Statistics table is not empty');
        library.logStep('Summary Statistics is not empty');
        statisticsData = false;
        resolve(statisticsData);
      }).catch(function () {
        statisticsData = true;
        console.log('Empty Summary Statistics table  display.');
        library.logStep('Empty Summary Statistics table  display');
        resolve(statisticsData);
      });
    });
  }
  clickManuallyEnterData() {
    return new Promise((resolve) => {
      let status = false;
      const enterSummary = findElement(locatorType.XPATH, '//a[text()="Manually enter data"]');
      library.scrollToElement(enterSummary);
      enterSummary.isDisplayed().then(function () {
        library.clickJS(enterSummary);
        status = true;
        console.log('Manually Enter data Clicked.');
        resolve(status);
      }).catch(function () {
        status = false;
        console.log('Manually Enter data Not Displayed.');
        resolve(status);
      });
    });
  }

  verifySubmitButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(submitDisabled));
      library.scrollToElement(error);
      error.isDisplayed().then(function () {
        console.log('Submit data button is Disabled.');
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

  clickSubmitButtonData() {

    let status = false;
    return new Promise((resolve) => {
      const submit = findElement(locatorType.ID, submitButtonData);
      library.scrollToElement(submit);
      submit.isDisplayed().then(function () {
        library.clickJS(submit);
        dashBoard.waitForPage();
        library.logStep('Submit button is clicked.');
        status = true;
        resolve(status);
      });
    });
  }

  clickSubmitButton() {
    let status = false;
    return new Promise((resolve) => {
      const submit = findElement(locatorType.XPATH, submitButtonEdit);

      browser.actions().mouseMove(submit).perform();
      library.clickJS(submit);
      dashBoard.waitForPage();
      library.logStep('Submit button is clicked.');
      console.log('Edit dialogue Submit button is clicked.');
      status = true;
      resolve(status);
    });
  }

  enteredDataRowExists() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const enteredValuesRow = element(by.xpath(meanEl));
      enteredValuesRow.isDisplayed().then(function () {
        log4jsconfig.log().info('Entered values row is displayed.');
        status = true;
        resolve(status);
      }).catch(function () {
        log4jsconfig.log().info('Entered values row is not displayed.');
        status = false;
        resolve(status);
      });
    });
  }

  checkFutureDayDisabled() {
    let set = false;
    return new Promise((resolve) => {
      const nextMonth = findElement(locatorType.CLASSNAME, nextMonthDate);
      nextMonth.isDisplayed().then(function () {
        library.clickJS(nextMonth);
        const nextdayDisabled = element(by.xpath(checkNextdayDisabled));
        library.scrollToElement(nextdayDisabled);
        nextdayDisabled.isDisplayed().then(function (nextday) {
          if (nextday === true) {
            set = true;
            library.logStep('check future day disabled');
            resolve(set);
          } else {
            set = false;
            library.logStep('check future day is enabled');
            resolve(set);
          }
        });
      });
    });
  }
  editDialogDisplay() {
    let status = false;
    return new Promise((resolve) => {

      const editPopup = element(by.className(editdata));

      editPopup.isDisplayed().then(function () {
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });


  }

  verifyCancelDisabledSubmitDisplayed() {
    let status = false;
    return new Promise((resolve) => {

      status = true;
      resolve(status);
    });
  }

  clickShowOption(xid) {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const mValue = element(by.xpath('//*[@tabindex="' + xid + '"]'));
      mValue.click().then(function () {
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.clickJS(showOptionsLink);
        dashBoard.waitForPage();
        clickShowOpt = true;
        resolve(clickShowOpt);
      });
    });
  }

  enterComment(commentText) {
    let enterComment = false;
    return new Promise((resolve) => {
      const addCommentTxtEle = element(by.xpath(addCommentTextBox));
      library.scrollToElement(addCommentTxtEle);
      addCommentTxtEle.sendKeys(commentText).then(function () {
        dashBoard.waitForPage();
        enterComment = true;
        resolve(enterComment);
      });
    });
  }

  clickTestToEdit(testno) {
    console.log('Entered in edit');
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const test = element(by.xpath('(//br-analyte-summary-view//*[contains(text(),"mean")])[' + testno + ']'));
      library.scrollToElement(test);
      library.clickJS(test);
      status = true;
      resolve(status);
    });
  }


  verifyLevel1Level2Textboxes() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const mean1 = element(by.id('11'));
      const sd1 = element(by.id('12'));
      const point1 = element(by.id('13'));
      const mean2 = element(by.id('14'));
      const sd2 = element(by.id('15'));
      const point2 = element(by.id('16'));
      library.scrollToElement(mean1);
      mean1.isDisplayed().then(function () {
        library.logStep('Level 1 Mean is displayed');
        library.scrollToElement(sd1);
        sd1.isDisplayed().then(function () {
          library.logStep('Level 1 SD is displayed');
          library.scrollToElement(point1);
          point1.isDisplayed().then(function () {
            library.logStep('Level 1 Point is displayed');
            library.logStep('Level 1 is displayed');
          });
        });
      }).catch(function () {
        library.logFailStep('Level 1 is not displayed');
        status = false;
        resolve(status);
      });
      mean2.isDisplayed().then(function () {
        library.logStep('Level 2 Mean is displayed');
        library.scrollToElement(sd2);
        sd2.isDisplayed().then(function () {
          library.logStep('Level 2 SD is displayed');
          library.scrollToElement(point2);
          point2.isDisplayed().then(function () {
            library.logStep('Level 2 Point is displayed');
            library.logStep('Level 2 is displayed');
          });
        });
      }).catch(function () {
        library.logFailStep('Level 2 is not displayed');
        status = false;
        resolve(status);
      });
      status = true;
      resolve(status);
    });
  }

  verifyDataExists(mean) {
    let status = false;
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const enteredValuesRow = element(by.xpath(meanElnew));
      enteredValuesRow.isDisplayed().then(function () {
        library.logStep('Entered values row is displayed.');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Entered values row is not displayed.');
        status = false;
        resolve(status);
      });
    });

  }

  clickSubmitUpdatesButton() {
    let status = false;
    return new Promise((resolve) => {
      const submitUpdatesButton = findElement(locatorType.XPATH, submitUpdates);
      submitUpdatesButton.isDisplayed().then(function () {
        library.clickJS(submitUpdatesButton);
        status = true;
        library.logStep('Submit Updates Button on Edit Dialog is clicked');
        resolve(status);
      });
    });
  }

  /*
    setFutureDate() {
      var set = false;
      return new Promise((resolve) => {
        dashBoard.waitForElement();

        var nextMonthDisabled = element(by.xpath(nextMonthDisabledValue));
        dashBoard.waitForElement();
        if (nextMonthDisabled.isDisplayed()) {


          var selectedDate = element(by.xpath(selectedDateToday));
          dashBoard.waitForElement();
          selectedDate.click();
          dashBoard.waitForElement();
          set = true;
          log4jsconfig.log().info('set future date');
          resolve(set);
        }
        else {

          set = false;
          resolve(set);
        }

      })
    }*/

  verifySummaryDataTablePageEmpty() {
    let status = false;
    return new Promise((resolve) => {
      const dataPresent = element(by.xpath(summaryDataPresent));
      dataPresent.isDisplayed().then(function () {
        status = false;
        library.logFailStep('Summary Data Table Page is not empty');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStepWithScreenshot('Summary Data Table Page is empty', 'EmptyPage');
        resolve(status);
      });
    });
  }

  verifyManuallyEnterDataOption() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.presenceOf(element(by.xpath(manuallyEnterDataOption))), 300000, '');
      const enterDataOption = element(by.xpath(manuallyEnterDataOption));
      enterDataOption.getText().then(function (value) {
        if (value !== 'Manually enter data') {
          console.log('Failed : Manually enter data text is not matched');
          library.logFailStep('Failed : Manually enter data text is not matched');
          resolve(false);
        } else {
          console.log('Manually enter data text is matched');
          library.logStep('Manually enter data text is matched');
          resolve(true);
        }
      });
    });
  }
}


