/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/LoadMultiPointE2E.json', (err, data) => {
  if (err) { throw err; }
  const multiPointData = JSON.parse(data);
  jsonData = multiPointData;
});

const runEntryRadioBtn = '//mat-radio-button[1]';
const levelEntryRadiioBtn = '//mat-radio-button[2]';
const storedValT1L1 = './/br-analyte-point-view//tr/td[2]//div/div[1]';
const cancelButton = 'cancelBtn';
const manuallyEnterData = './/a[@class="manually-enter-data"]';
const changeDatexPath = './/span[@id ="changeDate"]';
const dateOnCalendar = 'mat-calendar-period-button mat-button';
const submitBtnById = 'submitBtn';
const addCommentTxtArea = '//textarea[@placeholder=" Add a comment "]';
const pezIconComment = './/span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span';
const pezCommentStringEle = './/p[contains(@class, "allow-string-break")]';
const reviewSummaryDoneButton = './/button/span[contains(text(),"DONE")]';
const showOptionsEle = '//span[contains(text(),"Show options")]';
const countOnComment = '(//em[contains(@class, "spc_pezcell_comments_number")])[1]';
const countOnInteraction = '(//em[contains(@class,"spc_pezcell_interactions_number")])[1]';
const reviewSummary = '//h2[contains(text(),"Review Summary")]';
const revierSummaryComment = './/section[contains(@class, "review-summary-component")]//p[contains(@class, "allow-string-break")]';
const doneButton = '//button/span[contains(text(),"DONE")]'; // "//button[contains(text(),'DONE')]"
const addCommentTextBoxTestView = './/textarea[@name = "enteredCommentContent"]';
const saveUpdateBtnTestView = './/button/span[text() = "SUBMIT UPDATES"]';
const backArrow = './/mat-icon[@class = "arrowBack mat-icon"]';
const pezCommentStringEle2 = '(.//p[contains(@class, "allow-string-break")])[2]';
const paginationControls = './/pagination-controls';
const previousButton = './/pagination-controls//li[contains(@class, "previous")]';
const prevButtonForClick = './/pagination-controls//li[contains(@class, "previous")]/a';
const nextButton = './/pagination-controls//li[contains(@class, "next")]/a';
const currentPage = './/pagination-controls//li[contains(@class, "current")]/span[2]';
const secondNumberButton = './/pagination-controls//li/a//span[contains(text(), "2")]';
const deleteBtnTestView = './/button[contains(@class,"delete")]';
const confirmDelete = './/button/span[contains(text(), "Confirm Delete")]';


export class MultiEntryPoint {

  verifyRunEntrySelection() {
    let verifyRunEntrySelection = false;
    return new Promise((resolve) => {
      console.log('In verify Run Entry Selection');
      const runRadio = findElement(locatorType.XPATH, runEntryRadioBtn);
      runRadio.getAttribute('class').then(function (name) {
        console.log('Class name: ' + name);
        if (name.includes('checked')) {
          console.log('Pass: Run Entry is Selected');
          library.logStep('Pass: Run Entry is Selected');
          verifyRunEntrySelection = true;
          resolve(verifyRunEntrySelection);
        } else {
          console.log('Fail: Run Entry is not selected');
          library.logStep('Fail: Run Entry is not selected');
          verifyRunEntrySelection = false;
          resolve(verifyRunEntrySelection);
        }
      });
    });
  }


  verifyLevelEntrySelection() {
    let verifyLevelEntrySelection = false;
    return new Promise((resolve) => {
      const levelEntry = findElement(locatorType.XPATH, levelEntryRadiioBtn);
      levelEntry.getAttribute('class').then(function (name) {
        if (name.includes('checked') === false) {
          levelEntry.click().then(function (clicked) {
            console.log('Level Entry Selected ');
            library.logStep('Level Entry Selected ');
            verifyLevelEntrySelection = true;
            resolve(verifyLevelEntrySelection);
          });
        } else if (status === 'true') {
          console.log('Pass: Level Entry Selected ');
          library.logStep('Pass: Level Entry Selected ');
          verifyLevelEntrySelection = true;
          resolve(verifyLevelEntrySelection);
        } else {
          console.log('Fail: Level Entry Selected ');
          library.logStep('Fail: Level Entry Selected ');
          verifyLevelEntrySelection = false;
          resolve(verifyLevelEntrySelection);
        }
      });
    });
  }

  clickManuallyEnterData() {
    let status = false;
    return new Promise((resolve) => {
      const enterSummary = findElement(locatorType.XPATH, manuallyEnterData);
      enterSummary.isDisplayed().then(function () {
        library.clickJS(enterSummary);
        dashBoard.waitForScroll();
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        console.log('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }

  enterValues(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      dataMap.forEach(function (key, value) {
        const data = findElement(locatorType.XPATH, '//*[@tabindex="' + value + '"]');
        browser.executeScript('arguments[0].scrollIntoView(true);', data);
        data.clear().then(function () {
          data.sendKeys(key).then(function () {
            library.logStep('Values entered: ' + key);
            console.log('Data Entered : ' + key);
            status = true;
            resolve(status);
          });
        });
      });
    });
  }

  clickSubmitButton() {
    let status = false;
    return new Promise((resolve) => {
      const submit = findElement(locatorType.ID, submitBtnById);
      submit.isDisplayed().then(function () {
        // browser.executeScript('arguments[0].scrollIntoView();', submit);
        library.clickJS(submit);
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        library.logStep('Submit button is clicked.');
        status = true;
        resolve(status);
      });
    });
  }

  verifyEnteredValueStored(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      // dashBoard.waitForPage();
      dashBoard.waitForPage();
      const valueEle = findElement(locatorType.XPATH, storedValT1L1);
      dashBoard.waitForElement();
      valueEle.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          console.log('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = true;
        } else {
          console.log('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = false;
        }
      });
      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }
    });
  }

  verifyRunEntry(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        data.sendKeys(key).then(function () {
          console.log('Data entered ' + key + '');
          data.sendKeys(protractor.Key.TAB).then(function () {
            console.log('Tab key pressed');
            const key1 = tabElement.get(value);
            console.log('After Tab ' + key1);
            if (key1 === 'End') {
              console.log('First/last element');
            } else {
              const focusedElement = element(by.xpath('//*[@tabindex=' + key1 + ']/ancestor::mat-form-field'));
              browser.executeScript('arguments[0].scrollIntoView(true);', focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  console.log('Pass: Run Entry');
                  library.logStep('Pass: Run Entry');
                  resolve(result);
                } else {
                  result = false;
                  console.log('Fail: Run Entry');
                  library.logStep('Fail: Run Entry');
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  verifyLevelEntry(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = findElement(locatorType.XPATH, '//*[@tabindex="' + value + '"]');
        browser.executeScript('arguments[0].scrollIntoView();', data);
        data.sendKeys(key).then(function () {
          console.log('Data entered: ' + key + '');
          data.sendKeys(protractor.Key.TAB).then(function () {
            console.log('Tab key pressed');
            const key1 = tabElement.get(value);
            console.log('After Tab ' + key1);
            if (key1 === 'End') {
              console.log('First/last element');
            } else {
              const focusedElement = findElement(locatorType.XPATH, '//*[@tabindex=' + key1 + ']/ancestor::mat-form-field');
              browser.executeScript('arguments[0].scrollIntoView();', focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  library.logStep('Pass: Level Entry');
                  console.log('Pass: Level Entry');
                  resolve(result);
                } else {
                  result = false;
                  library.logStep('Fail: Level Entry');
                  console.log('Fail: Level Entry');
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
        const data = findElement(locatorType.XPATH, '//*[@tabindex="' + value + '"]');
        browser.executeScript('arguments[0].scrollIntoView();', data);
        data.sendKeys(key).then(function () {
          console.log('Data entered: ' + key);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            console.log('Enter key pressed');
            dashBoard.waitForScroll();
            const key1 = tabElement.get(value);
            console.log('After Enter ' + key1);
            if (key1 === 'End') {
              console.log('First/last element');
            } else {
              const focusedElement = findElement(locatorType.XPATH, '//*[@tabindex=' + key1 + ']/ancestor::mat-form-field');
              browser.executeScript('arguments[0].scrollIntoView();', focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  console.log('Pass: Run Entry with Enter Key');
                  library.logStep('Pass: Run Entry with Enter Key');
                  result = true;
                  resolve(result);
                } else {
                  result = false;
                  console.log('Fail: Run Entry with Enter Key');
                  library.logStep('Fail: Run Entry with Enter Key');
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  verifyLevelEntryUsingEnterKey(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {
      mapValues.forEach(function (key, value) {
        const data = findElement(locatorType.XPATH, '//*[@tabindex="' + value + '"]');
        browser.executeScript('arguments[0].scrollIntoView();', data);
        data.sendKeys(key).then(function () {
          console.log('Data entered: ' + key);
          data.sendKeys(protractor.Key.ENTER).then(function () {
            console.log('Enter key pressed');
            dashBoard.waitForScroll();
            const key1 = tabElement.get(value);
            console.log('After Enter ' + key1);
            if (key1 === 'End') {
              console.log('First/last element');
            } else {
              const focusedElement = findElement(locatorType.XPATH, '//*[@tabindex=' + key1 + ']/ancestor::mat-form-field');
              browser.executeScript('arguments[0].scrollIntoView();', focusedElement);
              dashBoard.waitForScroll();
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  console.log('Pass: Level Entry with Enter Key');
                  library.logStep('Pass: Level Entry with Enter Key');
                  resolve(result);
                } else {
                  result = false;
                  console.log('Fail: Level Entry with Enter Key');
                  library.logStep('Fail: Level Entry with Enter Key');
                  resolve(result);
                }
              });
            }
          });
        });
      });
    });
  }

  clickCancelBtn() {
    return new Promise((resolve) => {
      let clickCancelBtn = false;
      const cancelBtn = element(by.id(cancelButton));
      cancelBtn.click().then(function () {
        clickCancelBtn = true;
        dashBoard.waitForElement();
        library.logStep('Cancel button clicked.');
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  changeDate(year, month, day) {
    let changeDate = false;
    return new Promise((resolve) => {
      console.log('In Change Date');
      dashBoard.waitForElement();
      const changeDateLink = findElement(locatorType.XPATH, changeDatexPath);
      library.clickJS(changeDateLink);
      const yearDropDown = findElement(locatorType.CLASSNAME, dateOnCalendar);
      library.clickJS(yearDropDown);
      console.log('Calendar Clicked');
      const yearOpt = findElement(locatorType.XPATH, '//div[contains(@class, "calendar-body")][contains(text(),"' + year + '")]');
      library.clickJS(yearOpt);
      console.log('Year Selected: ' + year);
      const monthOpt = findElement(locatorType.XPATH, '//div[contains(@class, "calendar-body")][contains(text(), "' + month + '")]');
      library.clickJS(monthOpt);
      console.log('Month Selected: ' + month);
      const dayOpt = findElement(locatorType.XPATH, '(//div[contains(@class, "calendar-body")][contains(text(),"' + day + '")])[1]');
      library.clickJS(dayOpt);
      console.log('Day Selected: ' + day);
      changeDate = true;
      console.log('Pass: Date Changed');
      resolve(changeDate);
    });
  }

  hoverOverTest(testid) {
    let hover = false;
    return new Promise((resolve) => {
      // const mValue = element(by.xpath('.//h6["' + testid + '"]'));
      const analyteName = findElement(locatorType.XPATH, './/div[contains(@class, "analyte-point-entry-component")]//span[contains(@class, "test-analyte-name" )][contains(text(), "' + testid + '")]');
      browser.executeScript('arguments[0].scrollIntoView();', analyteName);
      browser.actions().mouseMove(analyteName).perform();
      // library.hoverOverElement(analyteName);
      // console.log('Hovered over test: ' + testid);
      dashBoard.waitForElement();
      hover = true;
      resolve(hover);
    });
  }

  addComment(cmnt) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let comment = false;
      const commentAdd = element(by.xpath(addCommentTxtArea));
      commentAdd.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', commentAdd);
        commentAdd.sendKeys(cmnt).then(function () {
          library.logStep('Comment added: ' + cmnt);
          console.log('Comment added: ' + cmnt);
          comment = true;
          resolve(comment);
        });
      });
    });
  }

  verifyPezCommentToolTip(expToolTip) {
    let verifyPezCommentToolTip = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      console.log('In hover Mosue On Pez Comment Icon');
      browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
      const pezIcnEle = findElement(locatorType.XPATH, pezIconComment);
      browser.executeScript('arguments[0].scrollIntoView();', pezIcnEle);
      browser.actions().mouseMove(pezIcnEle).perform(); // .then(function () {
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const actToolTipele = element(by.xpath(pezCommentStringEle));
      actToolTipele.getText().then(function (actToolTip) {
        const meanEle = element(by.xpath('.//input[@tabindex = "11"]'));
        browser.executeScript('arguments[0].scrollIntoView();', meanEle);
        meanEle.sendKeys(protractor.Key.ESCAPE).then(function () {
          console.log('Escape printed');
        });
        if (actToolTip.includes(expToolTip)) {
          console.log('Pass: Verify Pez Comment ToolTip');
          verifyPezCommentToolTip = true;
          resolve(verifyPezCommentToolTip);
        } else {
          console.log('Fail: Verify Pez Comment ToolTip');
          verifyPezCommentToolTip = false;
          resolve(verifyPezCommentToolTip);
        }
      });
      // });
      //  });
    });
  }

  clickOnDoneButton() {
    let clickOnDoneButton = false;
    return new Promise((resolve) => {
      const done = element(by.xpath(reviewSummaryDoneButton));
      // doneButton.click().then(function () {
      library.clickJS(done);
      dashBoard.waitForElement();
      console.log('Pass: Done Button Clicked');
      clickOnDoneButton = true;
      resolve(clickOnDoneButton);
      // })
    });
  }

  clickShowOptionnew() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const showOptionsLink = element(by.xpath(showOptionsEle));
      showOptionsLink.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', showOptionsLink);
        dashBoard.waitForElement();
        library.clickJS(showOptionsLink);
        library.logStep('Show Option Button clicked.');
        dashBoard.waitForPage();
        clickShowOpt = true;
        resolve(clickShowOpt);
      });
    });
  }

  verifyCommentSection(expectedValue) {
    let comment = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      browser.actions().mouseMove(element(by.xpath(countOnComment))).perform();
      const countOnComment1 = element(by.xpath(countOnComment));
      browser.executeScript('arguments[0].scrollIntoView();', countOnComment1);
      let actualvalue;
      countOnComment1.getText().then(function (txt) {
        actualvalue = txt;
        const meanEle = element(by.xpath('.//input[@tabindex = "11"]'));
        meanEle.sendKeys(protractor.Key.ESCAPE).then(function () {
          console.log('Escape printed');
        });
        if (actualvalue === expectedValue) {
          console.log('Pass: verifyCommentSection');
          comment = true;
          resolve(comment);
        } else {
          console.log(' Fail: verifyCommentSection');
          comment = false;
          resolve(comment);
        }
      });
    });
  }

  verifytheReviewSummaryPage(analyteName, expectedComment) {
    let pageSummary = false;
    return new Promise((resolve) => {
      const commentCount = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/em[contains(@class, "comments_number")]');
      browser.executeScript('arguments[0].scrollIntoView();', commentCount);
      library.clickJS(commentCount);
      const commentTxt = element(by.xpath(revierSummaryComment));
      const doneButtonEle = element(by.xpath(doneButton));
      commentTxt.getText().then(function (txt) {
        if (txt.includes(expectedComment)) {
          library.clickJS(doneButtonEle);
          console.log('Pass: Review Summary page displayed');
          library.logStep('Pass: Review Summary page displayed');
          pageSummary = true;
          resolve(pageSummary);
        }
      });
    });
  }

  verifyInteractionIconButtonOnProductLevel() {
    return new Promise((resolve) => {
      let comment = false;

      const countComment = element(by.xpath(countOnInteraction));
      const expectedValue = '1';
      let actualvalue;
      countComment.getText().then(function (txt) {
        actualvalue = txt;

        if (actualvalue === expectedValue) {
          comment = true;

          resolve(comment);
          browser.sleep(5000);
        }
      });
    });

  }

  editComment(value, newComment) {
    let editComment = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const valEle = element(by.xpath('.//span[@class="show"][contains(text(),"' + value + '")]'));
      // const valEle = findElement(locatorType.XPATH, '//span[@class="show"][contains(text(),"' + value + '")]');
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      dashBoard.waitForElement();
      valEle.isDisplayed().then(function () {

        // valEle.click().then(function () {
        library.clickJS(valEle);
        dashBoard.waitForPage();
        const commentBox = element(by.xpath(addCommentTextBoxTestView));
        commentBox.sendKeys(newComment).then(function () {
          dashBoard.waitForPage();
          const submitBtn = element(by.xpath(saveUpdateBtnTestView));
          submitBtn.click().then(function () {
            dashBoard.waitForPage();
            console.log('Pass: Comment Edited: ' + newComment);
            editComment = true;
            resolve(editComment);
          });
        });
        // })
      });
    });
  }

  clickOnBackArrow() {
    let clicked = false;
    return new Promise((resolve) => {
      const backBtn = element(by.xpath(backArrow));
      browser.wait(element(by.xpath(backArrow)).isPresent());
      backBtn.isDisplayed().then(function () {
        browser.actions().mouseMove(backBtn).perform();
        library.clickJS(backBtn);
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        clicked = true;
        resolve(clicked);
      });
    });
  }

  verifyPezCommentToolTipForComment2(expToolTipComment2) {
    let verifyPezCommentToolTipForComment2 = false;
    return new Promise((resolve) => {
      // console.log('In hover Mosue On Pez Comment Icon');
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForPage();
      const pezIcnEle = element(by.xpath(pezIconComment));
      browser.waitForAngular();
      browser.actions().mouseMove(pezIcnEle).perform(); // .then(function () {
      // library.hoverOverElement(pezIcnEle);
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const actToolTipele = element(by.xpath(pezCommentStringEle2));
      browser.executeScript('arguments[0].scrollIntoView();', actToolTipele);
      dashBoard.waitForElement();
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(expToolTipComment2)) {
          console.log('Pass: Expected tooltip: ' + expToolTipComment2 + ' Actual ToolTip: ' + actToolTip);
          verifyPezCommentToolTipForComment2 = true;
          resolve(verifyPezCommentToolTipForComment2);
        } else {
          console.log('Fail: Expected tooltip: ' + expToolTipComment2 + ' Actual ToolTip: ' + actToolTip);
          verifyPezCommentToolTipForComment2 = false;
          resolve(verifyPezCommentToolTipForComment2);
        }
      });
      // });
      // });
    });
  }

  verifyEnteredValueStoredL1AllTest(expectedVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let valEle;
      if (test === '1') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      } else if (test === '2') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      } else if (test === '3') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      } else if (test === '4') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      } else if (test === '5') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      } else if (test === '6') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[2]//div/div[1])[' + test + ']');
      }
      let valData;
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      dashBoard.waitForScroll();
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            // console.log('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Pass: Level 1 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            library.logStep('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            displayed = true;
            resolve(displayed);
          } else {
            // console.log('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Fail: Level 3 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            library.logStep('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            displayed = false;
            resolve(displayed);
          }
        }).catch(function () {
          console.log('Value not displayed for ' + test);
          library.logStep('Value not displayed for ' + test);
          displayed = false;
          resolve(displayed);
        });
      }).catch(function () {
        console.log('Value not displayed for ' + test);
        library.logStep('Value not displayed for ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }


  verifyEnteredValueStoredL2AllTest(expectedVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let valEle;
      if (test === '1') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      } else if (test === '2') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      } else if (test === '3') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      } else if (test === '4') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      } else if (test === '5') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      } else if (test === '6') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[3]//div/div[1])[' + test + ']');
      }
      let valData;
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      dashBoard.waitForScroll();
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            // console.log('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            console.log('Pass: Level 2 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStep('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            displayed = true;
            resolve(displayed);
          } else {
            // console.log('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            console.log('Fail: Level 2Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStep('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            displayed = false;
            resolve(displayed);
          }
        }).catch(function () {
          console.log('Value not displayed for ' + test);
          library.logStep('Value not displayed for ' + test);
          displayed = false;
          resolve(displayed);
        });
      }).catch(function () {
        console.log('Value not displayed for ' + test);
        library.logStep('Value not displayed for ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifyEnteredValueStoredL3AllTest(expectedVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let valEle;
      if (test === '1') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      } else if (test === '2') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      } else if (test === '3') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      } else if (test === '4') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      } else if (test === '5') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      } else if (test === '6') {
        valEle = findElement(locatorType.XPATH, '(.//br-analyte-point-view//tr/td[4]//div/div[1])[' + test + ']');
      }
      let valData;
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      valEle.getText().then(function (data) {
        valData = data;
        if (valData.includes(expectedVal)) {
          // console.log('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Pass: Level 3 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
          console.log('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          library.logStep('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          displayed = true;
          resolve(displayed);
        } else {
          // console.log('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Fail: Level 3 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
          library.logStep('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Value not displayed for ' + test);
        library.logStep('Value not displayed for ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  enterCommentForAllTests(commentText, testid) {
    let enterComment = false;
    return new Promise((resolve) => {
      const analyteName = findElement(locatorType.XPATH, './/div[contains(@class, "analyte-point-entry-component")]//span[contains(@class, "test-analyte-name" )][contains(text(), "' + testid + '")]');
      browser.executeScript('arguments[0].scrollIntoView();', analyteName);
      dashBoard.waitForElement();
      browser.actions().mouseMove(analyteName).perform();
      dashBoard.waitForElement();
      console.log('Hovered over test: ' + testid);
      const showOpt = findElement(locatorType.XPATH, './/br-analyte-point-entry//span[contains(@class, "test-analyte-name")][contains(text(), "' + testid + '")]/parent::div/parent::div/following-sibling::div//br-change-lot//span[contains(text(), "Show options")]');
      browser.executeScript('arguments[0].scrollIntoView();', showOpt);
      library.clickJS(showOpt);
      dashBoard.waitForPage();
      console.log('Show Option Button clicked.');
      const comTxtbox = findElement(locatorType.XPATH, './/br-analyte-point-entry//span[contains(@class, "test-analyte-name")][contains(text(), "' + testid + '")]/parent::div/parent::div/following-sibling::div//textarea');
      browser.executeScript('arguments[0].scrollIntoView();', comTxtbox);
      dashBoard.waitForPage();
      comTxtbox.sendKeys(commentText).then(function () {
        console.log('Pass: Comments added');
        library.logStep('Pass: Comments added');
        enterComment = true;
        resolve(enterComment);
      }).catch(function () {
        console.log('Fail: Unable to add comment');
        library.logStep('Fail: Unable to add comment');
        enterComment = false;
        resolve(enterComment);
      });
    });
  }

  verifyPezCommentToolTipAllTest(expToolTip, test) {
    let displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      let pezIcnEle;
      dashBoard.waitForElement();
      if (test === '1') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      } else if (test === '2') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      } else if (test === '3') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      } else if (test === '4') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      } else if (test === '5') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      } else if (test === '6') {
        pezIcnEle = element(by.xpath('(.//span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span)[' + test + ']'));
      }
      browser.executeScript('arguments[0].scrollIntoView();', pezIcnEle);
      dashBoard.waitForPage();
      browser.actions().mouseMove(pezIcnEle).perform(); // .then(() => {
      const actToolTipele = element(by.xpath(pezCommentStringEle));
      // browser.executeScript('arguments[0].scrollIntoView();', actToolTipele);
      dashBoard.waitForPage();
      dashBoard.waitForElement();
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(expToolTip)) {
          // console.log('Pass: Tool Tip Verified');
          console.log('Pass: Tool Tip Verified');
          library.logStep('Pass: Tool Tip Verified');
          displayed = true;
          resolve(displayed);
        } else {
          // console.log('Fail: Tool Tip Verified');
          console.log('Fail: Tool Tip Verified');
          library.logStep('Fail: Tool Tip Verified');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify tooltip for ' + test);
        library.logStep('Could not verify tooltip for ' + test);
        displayed = false;
        resolve(displayed);
      });
      // });
    });
  }

  verifyCommentNumberAllTest(expectedCommentNum, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let pezNumEle;
      dashBoard.waitForElement();
      if (test === '1') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      } else if (test === '2') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      } else if (test === '3') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      } else if (test === '4') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      } else if (test === '5') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      } else if (test === '6') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      }
      browser.executeScript('arguments[0].scrollIntoView();', pezNumEle);
      pezNumEle.getText().then(function (actualvalue) {
        if (actualvalue === expectedCommentNum) {
          // console.log('Pass: Comment Number Verified');
          console.log('Pass: Comment Number Verified');
          library.logStep('Pass: Comment Number Verified');
          displayed = true;
          resolve(displayed);
        } else {
          // console.log('Fail: Comment Number Verified');
          console.log('Fail: Comment Number Verified');
          library.logStep('Fail: Comment Number Verified');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify comment num for ' + test);
        library.logStep('Could not verify comment num for ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifyInteractionIconAllTests(expectedValue, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let interEle;
      dashBoard.waitForElement();
      if (test === '1') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      } else if (test === '2') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      } else if (test === '3') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      } else if (test === '4') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      } else if (test === '5') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      } else if (test === '6') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      }

      browser.executeScript('arguments[0].scrollIntoView(true);', interEle);
      interEle.isDisplayed().then(function () {
        interEle.getText().then(function (actualvalue) {
          if (actualvalue === expectedValue) {
            // console.log('Pass: Interaction Icon Verified');
            console.log('Pass: Interaction Icon Verified');
            library.logStep('Pass: Interaction Icon Verified');
            displayed = true;
            resolve(displayed);
          } else {
            // console.log('Fail: Interaction Icon Verified');
            console.log('Fail: Interaction Icon Verified');
            library.logStep('Fail: Interaction Icon Verified');
            displayed = false;
            resolve(displayed);
          }
        }).catch(function () {
          // console.log('Element not displayed for test: ' + test);
          console.log('Element not displayed for test: ' + test);
          library.logStep('Element not displayed for test: ' + test);
          displayed = false;
          resolve(displayed);
        });
      }).catch(function () {
        // console.log('Element not displayed for test: ' + test);
        console.log('Element not displayed for test: ' + test);
        library.logStep('Element not displayed for test: ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  paginationButtonsDisplayed() {
    let displayed = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      pagination.isDisplayed().then(function () {
        console.log('Pagination buttons displayed');
        library.logStep('Pagination buttons displayed');
        displayed = true;
        resolve(displayed);
      }).catch(function () {
        console.log('Pagination buttons are not displayed');
        library.logStep('Pagination buttons are not displayed');
        displayed = false;
        resolve(displayed);
      });
    });
  }

  clickOnSecondPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      const second = findElement(locatorType.XPATH, secondNumberButton);
      second.isDisplayed().then(function () {
        library.clickJS(second);
        dashBoard.waitForElement();
        console.log('Second page button clicked');
        library.logStep('Second page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Second page button not displayed');
        library.logStep('Second page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }

  verifyNavigationToPage(pagenum) {
    let verified = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      const current = findElement(locatorType.XPATH, currentPage);
      dashBoard.waitForElement();
      current.getText().then(function (num) {
        console.log('User nav to : ' + num + ' Expected is: ' + pagenum);
        if (num.includes(pagenum)) {
          console.log('User navigated to Second page');
          library.logStep('User navigated to Second page');
          verified = true;
          resolve(verified);
        } else {
          console.log('User not navigated to Second page');
          library.logStep('User not navigated to Second page');
          verified = false;
          resolve(verified);
        }
      });
    });
  }

  clickOnNextPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      const next = findElement(locatorType.XPATH, nextButton);
      next.isDisplayed().then(function () {
        library.clickJS(next);
        console.log('Next page button clicked');
        library.logStep('Next page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Next page button not displayed');
        library.logStep('Next page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }

  clickOnPreviousPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      const prev = findElement(locatorType.XPATH, prevButtonForClick);
      prev.isDisplayed().then(function () {
        library.clickJS(prev);
        console.log('Previous page button clicked');
        library.logStep('Previous page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Previous page button not displayed');
        library.logStep('Previous page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }

  verifyPrevButtonEnabled() {
    let enabled = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      browser.executeScript('arguments[0].scrollIntoView();', pagination);
      const prev = findElement(locatorType.XPATH, previousButton);
      prev.getAttribute('class').then(function (name) {
        if (name.includes('disabled')) {
          console.log('Previous Button is disabled');
          library.logStep('Previous Button is disabled');
          enabled = false;
          resolve(enabled);
        } else {
          console.log('Previous Button is Enabled');
          library.logStep('Previous Button is Enabled');
          enabled = true;
          resolve(enabled);
        }
      });
    });
  }

  clearAllTestsData(test) {
    let cleared = false;
    return new Promise((resolve) => {
      library.logStep('In Clear Test Data');
      const testName = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + test + '")]');
      library.clickJS(testName);
      library.logStep('Test Opened: ' + test);
      dashBoard.waitForElement();
      const firstDataEle = element(by.xpath('//tr[3]/td[3]//unext-value-cell'));
      firstDataEle.isDisplayed().then(function () {
        library.logStep('First data line found');
        element.all(by.xpath('//tr/td[3]//unext-value-cell')).then(function (txt) {
          console.log('Num of data found: ' + txt.length);
          for (let i = 0; i < txt.length; i++) {
            library.logStep('Data found: ' + txt.length);
            dashBoard.waitForElement();
            const scrollEle = element(by.xpath('//tr[3]/td[3]//unext-value-cell'));
            browser.executeScript('arguments[0].scrollIntoView();', scrollEle);
            library.clickJS(scrollEle);
            dashBoard.waitForElement();
            const deleteDataSet = findElement(locatorType.XPATH, deleteBtnTestView);
            deleteDataSet.click().then(function () {
              const confirm = findElement(locatorType.XPATH, confirmDelete);
              confirm.click().then(function () {
                dashBoard.waitForElement();
                cleared = true;
                resolve(cleared);
              });
            });
          }
        });
      }).catch(function () {
        console.log('Catch: Data not available in the test');
        library.logStep('Catch: Data not available in the test');
        cleared = true;
        resolve(cleared);
      });
    });
  }

  verifySpecificAnalyteComment(analyteName, commentString) {
    let displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const commentIcon = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/span[contains(@class, "chat")]/parent::span');
      browser.executeScript('arguments[0].scrollIntoView();', commentIcon);
      browser.actions().mouseMove(commentIcon).perform(); // .then(() => {
      const actToolTipele = element(by.xpath(pezCommentStringEle));
      dashBoard.waitForElement();
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(commentString)) {
          console.log('Pass: Tool Tip Comment Verified');
          library.logStep('Pass: Tool Tip Comment Verified');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Could not verify Tool Tip Comment');
          library.logStep('Fail: Could not verify Tool Tip Comment');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify tooltip for ' + analyteName);
        library.logStep('Could not verify tooltip for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
      // });
    });
  }

  verifySpecificAnalyteComment2(analyteName, commentString) {
    let displayed = false;
    return new Promise((resolve) => {
      const commentIcon = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/span[contains(@class, "chat")]/parent::span');
      browser.executeScript('arguments[0].scrollIntoView();', commentIcon);
      browser.actions().mouseMove(commentIcon).perform(); // .then(() => {
      const actToolTipele = element(by.xpath(pezCommentStringEle2));
      dashBoard.waitForElement();
      browser.executeAsyncScript('arguments[0].scrollIntoView();', actToolTipele);
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(commentString)) {
          console.log('Pass: Tool Tip Comment Verified');
          library.logStep('Pass: Tool Tip Comment Verified');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Could not verify Tool Tip Comment');
          library.logStep('Fail: Could not verify Tool Tip Comment');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify tooltip for ' + analyteName);
        library.logStep('Could not verify tooltip for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
      // });
    });
  }

  verifySpecificAnalyteCommentNumber(analyteName, expectedNumber) {
    let displayed = false;
    return new Promise((resolve) => {
      const commentCount = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/em[contains(@class, "comments_number")]');
      browser.executeScript('arguments[0].scrollIntoView();', commentCount);
      browser.actions().mouseMove(commentCount).perform();
      // const actToolTipele = element(by.xpath(pezCommentStringEle));
      dashBoard.waitForElement();
      commentCount.getText().then(function (actNum) {
        if (actNum.includes(expectedNumber)) {
          console.log('Pass: Comment Number verified');
          library.logStep('Pass: Comment Number verified');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Could not verify Comment number');
          library.logStep('Fail: Could not verify Comment number');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify comment number for ' + analyteName);
        library.logStep('Could not verify comment number for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifySpecificAnalyteInteractionNumber(analyteName, expectedNumber) {
    let displayed = false;
    return new Promise((resolve) => {
      const interactionCount = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span[2]/em');
      browser.executeScript('arguments[0].scrollIntoView();', interactionCount);
      browser.actions().mouseMove(interactionCount).perform();
      // const actToolTipele = element(by.xpath(pezCommentStringEle));
      dashBoard.waitForElement();
      interactionCount.getText().then(function (actNum) {
        if (actNum.includes(expectedNumber)) {
          console.log('Pass: Comment Number verified');
          library.logStep('Pass: Comment Number verified');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Could not verify Comment number');
          library.logStep('Fail: Could not verify Comment number');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify comment number for ' + analyteName);
        library.logStep('Could not verify comment number for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
    });
  }

}
