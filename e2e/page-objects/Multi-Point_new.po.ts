/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { protractor } from 'protractor/built/ptor';
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const testResultsTab = './/div[@role="tab" and @tabindex="0"]';
const reportsTab = './/div[@role="tab" and @tabindex="-1"]';
const editInstrumentButton = './/button//span[contains(text(), "Edit this Instrument")]';
const manuallyEnterDataLink = './/a[text()="MANUALLY ENTER DATA"]';
const levelsInUse = './/h3[contains(text(), "Level")]';
const noDataLabel = './/span[@class="analyte-name blue" and contains(text(), "No Data")]';
const navigationSection = './/ul[@role="navigation"]';
const previousButton = './/ul[@role="navigation"]/li[contains(@class,"pagination")]/span[contains(text(),"Previous")]';
const page1Button = './/ul[@role="navigation"]/li[contains(@class, "small") and contains(text(), "1")]';
const page2Button = './/ul[@role="navigation"]/li//span[contains(text(), "2")]';
const nextButton = './/ul[@role="navigation"]/li//a[contains(text(), "Next")]';
const dateLabel = './/label[@class="dateLabel"]';
const changeDateButton = './/span[@id="changeDate"]';
const timeInput = './/input[@type="time"]';
const cancelButton = './/button//span[contains(text(),"Cancel")]';
const submitButton = './/button//span[contains(text(),"Submit This Page")]';
const addCommentTextArea = './/textarea[contains(@placeholder, "Add a comment")]';
const calibratorLotDropdown = './/input[contains(@placeholder, "Calibrator Lot")]';
const reagentLotDropdown = './/input[contains(@placeholder, "Reagent Lot")]';
const hideOptions = './/a//span[contains(text(),"Hide options")]';
const analytesAll = './/span[@class="analyte-name"]';
const nextMonthDisabled = './/button[@aria-label="Next month"][@disabled="true"]';
const nextYearDisabled = './/button[@aria-label="Next 20 years"][@disabled="true"]';
const submitDisabled = './/span[contains(text(),"Submit This Page") or contains(text(),"Submit Data")]/parent::button[@disabled="true"]';
const submitEnabled = './/span[contains(text(),"Submit This Page")]/parent::button';
const unsavedDataDialog = './/mat-dialog-container[@role="dialog"]';
const unsavedDataHeader = './/mat-dialog-container[@role="dialog"]//h2[contains(text(), "You have unsaved data")]';
const unsavedDataText = './/mat-dialog-container[@role="dialog"]//p[contains(text(), "If you navigate away from this page, your data will not be saved.")]';
const dontSaveDataButton = './/button/span[contains(text(), "Dont save data")]';
const saveDataButton = './/button/span[contains(text(), "Save data and leave page")]';
const previousButtonEnabled = './/ul[@role="navigation"]//a[contains(text(),"Previous")]';
const editControlLink = './/button//span[contains(text(), "Edit this Control")]';
const unityNext = './/button/span[text() = "Unity Next"]';
const runEntryRadioBtn = '//mat-radio-button[1]';
const levelEntryRadiioBtn = '//mat-radio-button[2]';
const storedValT1L1 = './/br-analyte-point-view//tr/td[2]//div/div[1]';
const cancelButtonId = 'cancelBtn';
const manuallyEnterData = './/a[contains(@class, "manually-enter-data") or contains(@class,"manually-enter-test-run")]';
const changeDatexPath = './/span[@id ="changeDate"]';
const dateOnCalendar = 'mat-calendar-period-button mat-button';
const addCommentTxtArea = '//textarea[@placeholder=" Add a comment "]';
const pezIconComment = './/span[contains(@class, "grey pez")]/span[contains(@class, "chat")]/parent::span';
const pezCommentStringEle = './/p[contains(@class, "allow-string-break")]';
const reviewSummaryDoneButton = './/button/span[contains(text(),"DONE")]';
const showOptionsEle = '//span[contains(text(),"Show options")]';
const countOnComment = '(//em[contains(@class, "spc_pezcell_comments_number")])[1]';
const countOnInteraction = '(//em[contains(@class,"spc_pezcell_interactions_number")])[1]';
const revierSummaryComment = './/section[contains(@class, "review-summary-component")]//p[contains(@class, "allow-string-break")]';
const doneButton = '//button/span[contains(text(),"DONE")]';
const addCommentTextBoxTestView = './/textarea[@name = "enteredCommentContent"]';
const saveUpdateBtnTestView = './/button/span[text() = "SUBMIT UPDATES"]';
const backArrow = './/mat-icon[@class = "arrowBack mat-icon"]';
const pezCommentStringEle2 = '(//*[contains(@class, "allow-string-break")])[2]';
const paginationControls = '//*[@role="navigation" and contains(@class,"ngx-pagination")]';
const previousButtonMul = './/pagination-controls//li[contains(@class, "previous")]';
const prevButtonForClick = './/pagination-controls//li[contains(@class, "previous")]/a';
const nextButtonMul = './/pagination-controls//li[contains(@class, "next")]/a';
const currentPage = './/pagination-controls//li[contains(@class, "current")]/span[2]';
const secondNumberButton = './/pagination-controls//li/a//span[contains(text(), "2")]';
const deleteBtnTestView = './/button[contains(@class,"delete")]';
const confirmDelete = './/button/span[contains(text(), "Confirm Delete")]';
const priorDateTimeDialog = './/mat-dialog-container[@role="dialog"]';
const priorDateTimeDialogText = './/mat-dialog-container[@role="dialog"]//h2';
const priorDateTimeDialogCloseButton = './/mat-dialog-container[@role="dialog"]//button';
const monthSelector = './/button[contains(@class,"mat-calendar-period-button")]';
const editThisPanel = './/span[text()="Edit this Panel"]';

export class MultiPointDataEntryInstrument {
  verifyDefaultMultiPointInstrumentUI(instrument, control, lot, levels, analyte1) {
    let status = false;
    const instrumentNameHeader = './/h1[contains(text(), "' + instrument + '")]';
    const analyteName = control + '-' + lot + ' ' + analyte1;
    const analyteNameEle = './/span[@class="analyte-name" and contains(text(),"' + analyteName + '")]';
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const pageUI = new Map<string, string>();
      pageUI.set(testResultsTab, 'Test Results Tab is displayed');
      pageUI.set(reportsTab, 'Reports Tab is displayed');
      pageUI.set(instrumentNameHeader, 'Instrument Name Header is displayed');
      pageUI.set(editInstrumentButton, 'Edit Instrument Button is displayed');
      pageUI.set(manuallyEnterDataLink, 'Manually Enter Data link is displayed');
      pageUI.set(levelsInUse, 'Levels are displayed correctly');
      pageUI.set(analyteNameEle, 'Analyte Name is displayed');
      pageUI.set(noDataLabel, 'No Data value is displayed');
      pageUI.set(navigationSection, 'Pagination section is displayed');
      pageUI.set(previousButton, 'Previous Button is displayed');
      pageUI.set(page1Button, 'Page 1 Button is displayed');
      pageUI.set(page2Button, 'Page 2 Button is displayed');
      pageUI.set(nextButton, 'Next Button is displayed');
      pageUI.set(dateLabel, 'Date is displayed');
      pageUI.set(changeDateButton, 'Change Date Button is displayed');
      pageUI.set(timeInput, 'Time input box is displayed');
      pageUI.set(cancelButton, 'Cancel Button is displayed');
      pageUI.set(submitButton, 'Submit Button is displayed');
      pageUI.forEach(function (key, value) {
        if (value === levelsInUse) {
          const list = element.all(by.xpath(levelsInUse));
          if (list.count() === levels) {
            status = true;
            library.logStep(key);
          }
        }
        const ele = element(by.xpath(value));
        ele.isDisplayed().then(function () {
          status = true;
          library.logStep(key);
        }).catch(function () {
          library.logFailStep('Instrument Level Multi Point default page UI is not displayed properly');
          status = false;
        });
      });
      if (status === true) {
        library.logStepWithScreenshot('Instrument Level Multi Point default page UI is displayed properly', 'MultiPointUI');
        resolve(status);
      }
    });
  }

  verifyMultiPointInstrumentPageDataEntryUI(analyte, levels) {
    let status = false;
    const analyteNameElement = './/div[@class="analyte-point-entry-component"][1]//span[text()="' + analyte + '"]';
    const dataEntryTextBox = './/div[@class="analyte-point-entry-component"][1]//span[text()="' + analyte + '"]/parent::div/parent::div/following-sibling::div//mat-table//input';
    return new Promise((resolve) => {
      const ele = element(by.xpath(analyteNameElement));
      browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000, 'Analyte name not displayed');
      const dataPageUI = new Map<string, string>();
      dataPageUI.set(analyteNameElement, 'Analyte name header is displayed on Data Entry section');
      dataPageUI.set(dataEntryTextBox, 'Data Entry Text Boxes displayed for all the levels');
      dataPageUI.set(showOptionsEle, 'Show Options link is displayed');
      dataPageUI.forEach(function (key, value) {
        if (value === dataEntryTextBox) {
          const list = element.all(by.xpath(dataEntryTextBox));
          list.count().then(function (theCount) {
            console.log('The count is: ' + theCount);
            if (theCount === levels) {
              status = true;
              library.logStep(key);
            } else {
              status = false;
              library.logFailStep('Data Entry Text Boxes are not displayed for all the levels');
            }
          });
          list.each(function (listElement) {
            listElement.getText().then(function (val) {
              if (val === '') {
                library.logStep('The Data Entry field is empty');
                status = true;
              } else {
                library.logFailStep('The Data Entry field is not empty');
              }
            });
          });
        }
        const ele1 = element(by.xpath(value));
        ele1.isDisplayed().then(function () {
          status = true;
          library.logStep(key);
        }).catch(function () {
          library.logFailStep('Instrument/Control Level Multi Point data entry page UI is not displayed properly');
          status = false;
        });
      });
      if (status === true) {
        library.logStepWithScreenshot('Instrument/Control Level Multi Point Data Entry page UI is displayed properly', 'MultiPointDataUI');
        resolve(status);
      }
    });
  }

  verifyOptions() {
    let status = false;
    return new Promise((resolve) => {
      const optionsUI = new Map<string, string>();
      optionsUI.set(addCommentTextArea, 'Add Comment Text Area is displayed');
      optionsUI.set(calibratorLotDropdown, 'Calibrator Lot Dropdown is displayed');
      optionsUI.set(reagentLotDropdown, 'Reagent Lot Dropdown is displayed');
      optionsUI.set(hideOptions, 'Hide Options link is displayed');
      optionsUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        ele.isDisplayed().then(function () {
          status = true;
          library.logStep(key);
        }).catch(function () {
          library.logFailStep('Show options elements are not displayed properly');
          status = false;
        });
      });
      if (status === true) {
        library.logStepWithScreenshot('Show options elements are displayed properly', 'ShowOptionsUI');
        resolve(status);
      }
    });
  }

  verifySortingByAnalyteNames() {
    let status = false;
    return new Promise((resolve) => {
      const analytesBeforeSorting: string[] = [];
      let analytesAfterSorting: string[] = [];
      const listAnalytes = element.all(by.xpath(analytesAll));
      listAnalytes.each(function (analyteEach) {
        analyteEach.getText().then(function (analyteText) {
          analytesBeforeSorting.push(analyteText);
        });
      });
      analytesAfterSorting = analytesBeforeSorting;
      if (analytesBeforeSorting === analytesAfterSorting.sort()) {
        status = true;
        library.logStepWithScreenshot('The Analyte names are sorted by default', 'AnalyteSorting');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('The Analyte names are not sorted by default');
        resolve(status);
      }
    });
  }

  clickChangeDateButton() {
    let status = false;
    return new Promise((resolve) => {
      const changeDateBtn = findElement(locatorType.XPATH, changeDateButton);
      changeDateBtn.isDisplayed().then(function () {
        library.clickJS(changeDateBtn);
        library.logStep('Change Date button clicked');
        status = true;
        resolve(status);
      });
    });
  }

  verifyNextMonthDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const nextMonthDisabledEle = findElement(locatorType.XPATH, nextMonthDisabled);
      nextMonthDisabledEle.isDisplayed().then(function () {
        library.logStep('Next Month button is Disabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Next Month button is not Disabled');
        status = false;
        resolve(status);
      });
    });
  }

  verifyNextYearDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const nextYearDisabledEle = element(by.xpath(nextYearDisabled));
      nextYearDisabledEle.isDisplayed().then(function () {
        library.logStep('Next Year button is Disabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Next Year button is not Disabled');
        status = false;
        resolve(status);
      });
    });
  }

  enterData(analyte, value) {
    let status = false;
    const dataEntryTextBox = '(.//div[@class="analyte-point-entry-component"][1]//span[text()="' + analyte + '"]/parent::div/parent::div/following-sibling::div//mat-table//input)[1]';
    return new Promise((resolve) => {
      const dataEntrytxtbx = element(by.xpath(dataEntryTextBox));
      browser.executeScript('arguments[0].scrollIntoView();', dataEntrytxtbx);
      dataEntrytxtbx.isDisplayed().then(function () {
        dataEntrytxtbx.sendKeys(value);
        console.log('Data Entered: ' + value);
        library.logStepWithScreenshot('Data Entered', 'dataEntry');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        console.log('Failed to enter Data');
        library.logFailStep('Failed to enter Data');
        resolve(status);
      });
    });
  }

  clearData(analyte) {
    let status = false;
    const dataEntryTextBox = './/div[@class="analyte-point-entry-component"][1]//span[text()="' + analyte + '"]/parent::div/parent::div/following-sibling::div//mat-table//input';
    return new Promise((resolve) => {
      const dataEntrytxtbx = element(by.xpath(dataEntryTextBox));
      dataEntrytxtbx.isDisplayed().then(function () {
        dataEntrytxtbx.clear();
        library.logStepWithScreenshot('Data cleared', 'dataCleared');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  clickCancel() {
    let status = false;
    return new Promise((resolve) => {
      const cancelButtonEle = element(by.xpath(cancelButton));
      cancelButtonEle.isDisplayed().then(function () {
        cancelButtonEle.click();
        library.logStep('Cancel Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  verifySubmitButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const submitEnabledEle = element(by.xpath(submitEnabled));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(submitEnabledEle), 8000, 'Submit not clickable');
      submitEnabledEle.isDisplayed().then(function () {
        library.logStep('Submit button is Enabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit button is not Enabled');
        status = false;
        resolve(status);
      });
    });
  }

  verifySubmitButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const submitDisabledEle = element(by.xpath(submitDisabled));
      const submitDis = browser.ExpectedConditions.not(browser.ExpectedConditions.elementToBeClickable(submitDisabledEle));
      browser.wait(submitDis, 8000, 'Submit clickable');
      submitDisabledEle.isDisplayed().then(function () {
        console.log('Submit button is Disabled');
        library.logStep('Submit button is Disabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit button is not Disabled');
        status = false;
        resolve(status);
      });
    });
  }

  // Flag value should be 'valid' for valid data
  compareEnteredValue(analyte, entered, flag) {
    let status = false;
    // const dataEntryTextBox = '(.//div[@class="analyte-point-entry-component"][1]//
    // span[text()="' + analyte + '"]/parent::div/parent::div/following-sibling::div//mat-table//input)[1]';
    return new Promise((resolve) => {
      const  dataEntrytxtbxEle = Promise.resolve(browser.executeScript('return document.getElementById("level-1").value'));
      dataEntrytxtbxEle.then(function (txt) {
      dashBoard.waitForScroll();
      // dataEntrytxtbx.getAttribute('value').then(function (txt) {
        console.log('txt: ' + txt);
        console.log('entered: ' + entered);
        const actual = txt;
        // const actual = txt.trim();
        console.log('actual: ' + actual);
        if (flag === 'valid' && entered === actual) {
          library.logStep('Entered Value ' + entered);
          library.logStep('Actual Value ' + actual);
          status = true;
          resolve(status);
        } else if (flag !== 'valid' && entered !== actual) {
          library.logStep('Entered Value ' + entered);
          library.logStep('Actual Value ' + actual);
          status = true;
          resolve(status);
        } else {
          library.logStep('Entered Value ' + entered);
          library.logStep('Actual Value ' + actual);
          status = false;
          resolve(status);
        }
      });
     });
  }

  clickPaginationNextButton() {
    let status = false;
    return new Promise((resolve) => {
      const nextBtn = element(by.xpath(nextButton));
      browser.executeScript('arguments[0].scrollIntoView();', nextBtn);
      nextBtn.isDisplayed().then(function () {
        library.clickJS(nextBtn);
        library.logStep('Next Button is clicked');
        console.log('Next Button is clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        library.logFailStep('Could not click Next Button');
        console.log('Could not click Next Button');
        resolve(status);
      });
    });
  }

  clickPaginationPreviousButton() {
    let status = false;
    return new Promise((resolve) => {
      const previousBtnEnabled = element(by.xpath(previousButtonEnabled));
      previousBtnEnabled.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', previousBtnEnabled);
        library.clickJS(previousBtnEnabled);
        library.logStep('Previous Button is clicked');
        console.log('Previous Button is clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        library.logFailStep('Could not click Previous Button');
        console.log('Could not click Previous Button');
        resolve(status);
      });
    });
  }

  verifyUnsavedDataDialog() {
    let status = false;
    return new Promise((resolve) => {
      const elem = element(by.xpath(unsavedDataDialog));
      browser.wait(browser.ExpectedConditions.visibilityOf(elem), 8000, 'Save data confirmation popup not displayed');
      const dialogUI = new Map<string, string>();
      dialogUI.set(unsavedDataDialog, 'Unsaved Data Dialog box is displayed');
      dialogUI.set(unsavedDataHeader, 'Header "You have unsaved data" is displayed');
      dialogUI.set(unsavedDataText, 'Text "If you navigate away from this page, your data will not be saved." is displayed');
      dialogUI.set(dontSaveDataButton, 'Button "Dont save data" is displayed');
      dialogUI.set(saveDataButton, 'Button "Save data and leave page" is displayed');
      dialogUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        ele.isDisplayed().then(function () {
          status = true;
          library.logStep(key);
        }).catch(function () {
          library.logFailStep('Unsaved Data Dialog is not displayed properly');
          status = false;
        });
      });
      if (status === true) {
        library.logStepWithScreenshot('Dialog is displayed properly', 'DialogDisplayed');
        resolve(status);
      }
    });
  }

  clickDontSaveDataButton() {
    let status = false;
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(dontSaveDataButton)))), 10000, 'Button is not clickable');
      const dontSaveDataBtn = element(by.xpath(dontSaveDataButton));
      dontSaveDataBtn.isDisplayed().then(function () {
        library.clickJS(dontSaveDataBtn);
        library.logStep('Dont Save Data Button Clicked');
        console.log('Dont Save Data Button Clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        status = false;
        library.logFailStep('Unable to click the Dont Save Data Button');
        console.log('Unable to click the Dont Save Data Button');
        resolve(status);
      });
    });
  }

  clickSaveDataButton() {
    let status = false;
    return new Promise((resolve) => {
      const saveDataBtn = element(by.xpath(saveDataButton));
      saveDataBtn.isDisplayed().then(function () {
        saveDataBtn.click();
        status = true;
        dashBoard.waitForElement();
        resolve(status);
      }).catch(function () {
        status = false;
        resolve(status);
      });
    });
  }

  verifyPageSelected(pageNumber) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForScroll();
      const selectedPage = element(by.xpath('.//li[contains(@class, "current")]/span[contains(text(), "' + pageNumber + '")]'));
      browser.executeScript('arguments[0].scrollIntoView();', selectedPage);
      selectedPage.isDisplayed().then(function () {
        status = true;
        console.log(pageNumber + ' is Selected');
        library.logStepWithScreenshot(pageNumber + ' is Selected', pageNumber + 'selected');
        resolve(status);
      }).catch(function () {
        status = false;
        console.log('Incorrect Page');
        library.logFailStep('Incorrect Page');
        resolve(status);
      });
    });
  }

  verifyDataEntered(analyte, data) {
    let status = false;
    return new Promise((resolve) => {
      if (data === 'No Data') {
        const valueDisplayed = findElement(locatorType.XPATH, './/span[@class="analyte-name" and contains(text(),"' + analyte + '")]/following-sibling::span[@class="analyte-name blue" and contains(text(),"' + data + '")]');
        valueDisplayed.isDisplayed().then(function () {
          status = true;
          library.logStepWithScreenshot('No Data is displayed', 'NoData');
          resolve(status);
        }).catch(function () {
          console.log('Fail: No data not displayed');
          status = false;
          resolve(status);
        });
      } else {
        const valueDisplayed = element(by.xpath('.//span[@class="analyte-name" and contains(text(),"' + analyte + '")]/parent::div/following-sibling::div//div[contains(@class, "mark radius-5") and contains(text(),"' + data + '")]'));
        browser.executeScript('arguments[0].scrollIntoView();', valueDisplayed);
        browser.wait(browser.ExpectedConditions.visibilityOf(valueDisplayed), 8000, data + ' data not displayed for analyte: ' + analyte);
        valueDisplayed.isDisplayed().then(function () {
          status = true;
          library.logStepWithScreenshot('Data is displayed', 'DataShown');
          resolve(status);
        }).catch(function () {
          console.log('Fail: data not displayed ' + data);
          status = false;
          resolve(status);
        });
      }
    });
  }

  verifyDefaultMultiPointControlUI(control, lot, levels, analyte1) {
    let status = false;
    const controlNameHeader = './/h1[contains(text(), "' + control + '")]';
    const lotNumberHeader = './/h1[contains(text(), "' + control + '")]/span[contains(text(),"Lot""' + lot + '")]';
    const analyteName = control + '-' + lot + ' ' + analyte1;
    const analyteNameEle = './/span[@class="analyte-name" and contains(text(),"' + analyteName + '")]';
    return new Promise((resolve) => {
      const ele = element(by.xpath(controlNameHeader));
      browser.wait(browser.ExpectedConditions.visibilityOf(ele), 8000, 'Control name not displayed');
      const pageUI = new Map<string, string>();
      pageUI.set(controlNameHeader, 'Control Name Header is displayed');
      pageUI.set(lotNumberHeader, 'Lot Number Name Header is displayed');
      pageUI.set(editControlLink, 'Edit Control Button is displayed');
      pageUI.set(manuallyEnterDataLink, 'Manually Enter Data link is displayed');
      pageUI.set(levelsInUse, 'Levels are displayed correctly');
      pageUI.set(analyteNameEle, 'Analyte Name is displayed');
      pageUI.set(noDataLabel, 'No Data value is displayed');
      pageUI.set(navigationSection, 'Pagination section is displayed');
      pageUI.set(previousButton, 'Previous Button is displayed');
      pageUI.set(page1Button, 'Page 1 Button is displayed');
      pageUI.set(page2Button, 'Page 2 Button is displayed');
      pageUI.set(nextButton, 'Next Button is displayed');
      pageUI.set(dateLabel, 'Date is displayed');
      pageUI.set(changeDateButton, 'Change Date Button is displayed');
      pageUI.set(timeInput, 'Time input box is displayed');
      pageUI.set(cancelButton, 'Cancel Button is displayed');
      pageUI.set(submitButton, 'Submit Button is displayed');
      pageUI.forEach(function (key, value) {
        if (value === levelsInUse) {
          const list = element.all(by.xpath(levelsInUse));
          if (list.count() === levels) {
            status = true;
            library.logStep(key);
          }
        }
        const ele1 = element(by.xpath(value));
        ele1.isDisplayed().then(function () {
          status = true;
          library.logStep(key);
        }).catch(function () {
          library.logFailStep('Control Level Multi Point default page UI is not displayed properly');
          status = false;
        });
      });
      if (status === true) {
        library.logStepWithScreenshot('Control Level Multi Point default page UI is displayed properly', 'MultiPointUI');
        resolve(status);
      }
    });
  }

  clickSubmitButton() {
    let status = false;
    return new Promise((resolve) => {
      const submitEnabledEle = element(by.xpath(submitEnabled));
      submitEnabledEle.isDisplayed().then(function () {
        library.clickJS(submitEnabledEle);
        dashBoard.waitForPage();
        library.logStep('Submit button clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Submit button is not clicked');
        status = false;
        resolve(status);
      });
    });
  }

  verifyMonthDay(month, day) {
    let status = false;
    return new Promise((resolve) => {
      const monthDay: string = month + ' ' + day;
      const monthDayEle = element(by.xpath('.//span[@class="analyte-month-day"][contains(text(),"' + monthDay + '")]'));
      monthDayEle.isDisplayed().then(function () {
        library.logStepWithScreenshot('Month & Day is displayed correctly', 'monthDay');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Month & Day is not displayed correctly');
        status = false;
        resolve(status);
      });
    });
  }

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
          library.logStepWithScreenshot('Pass-verifyRunEntrySelection', 'Pass-verifyRunEntrySelection');
          verifyRunEntrySelection = true;
          resolve(verifyRunEntrySelection);
        } else {
          console.log('Fail: Run Entry is not selected');
          library.logStep('Fail: Run Entry is not selected');
          library.logStepWithScreenshot('Fail-verifyRunEntrySelection', 'Fail-verifyRunEntrySelection');
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
          levelEntry.click().then(function () {
            console.log('Level Entry Selected ');
            library.logStep('Level Entry Selected ');
            verifyLevelEntrySelection = true;
            resolve(verifyLevelEntrySelection);
          });
        } else if (status === 'true') {
          console.log('Pass: Level Entry Selected ');
          library.logStep('Pass: Level Entry Selected ');
          library.logStepWithScreenshot('Pass-verifyLevelEntrySelection', 'Pass-verifyLevelEntrySelection');
          verifyLevelEntrySelection = true;
          resolve(verifyLevelEntrySelection);
        } else {
          console.log('Fail: Level Entry Selected ');
          library.logStep('Fail: Level Entry Selected ');
          library.logStepWithScreenshot('Fail-verifyLevelEntrySelection', 'Fail-verifyLevelEntrySelection');
          verifyLevelEntrySelection = false;
          resolve(verifyLevelEntrySelection);
        }
      });
    });
  }

  clickManuallyEnterData() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const enterSummary = element(by.xpath(manuallyEnterData));
      browser.wait(browser.ExpectedConditions.visibilityOf((enterSummary)), 30000, 'Manually Enter not visible');
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
            library.logStepWithScreenshot('Pass-enterValues', 'Pass-enterValues');
            status = true;
            resolve(status);
          });
        });
      });
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
                  library.logStepWithScreenshot('Pass-verifyRunEntry', 'Pass-verifyRunEntry');
                  resolve(result);
                } else {
                  result = false;
                  console.log('Fail: Run Entry');
                  library.logStep('Fail: Run Entry');
                  library.logStepWithScreenshot('Fail-verifyRunEntry', 'Fail-verifyRunEntry');
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
                  library.logStepWithScreenshot('Pass-verifyLevelEntry', 'Pass-verifyLevelEntry');
                  resolve(result);
                } else {
                  result = false;
                  library.logStep('Fail: Level Entry');
                  console.log('Fail: Level Entry');
                  library.logStepWithScreenshot('Fail-verifyLevelEntry', 'Fail-verifyLevelEntry');
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
                  library.logStepWithScreenshot('Pass-verifyRunEntryUsingEnterKey', 'Pass-verifyRunEntryUsingEnterKey');
                  result = true;
                  resolve(result);
                } else {
                  result = false;
                  console.log('Fail: Run Entry with Enter Key');
                  library.logStep('Fail: Run Entry with Enter Key');
                  library.logStepWithScreenshot('Fail-verifyRunEntryUsingEnterKey', 'Fail-verifyRunEntryUsingEnterKey');
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
      const cancelBtn = element(by.id(cancelButtonId));
      cancelBtn.click().then(function () {
        clickCancelBtn = true;
        library.logStep('Cancel button clicked.');
      }).then(function () {
        resolve(clickCancelBtn);
      });
    });
  }

  changeDate(year, month, day) {
    console.log('+++++++++> ', year, month, day);
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
      const analyteName = findElement(locatorType.XPATH, './/div[contains(@class, "analyte-point-entry-component")]//span[contains(@class, "test-analyte-name" )][contains(text(), "' + testid + '")]');
      browser.executeScript('arguments[0].scrollIntoView();', analyteName);
      browser.actions().mouseMove(analyteName).perform();
      console.log('Hovered over test: ' + testid);
      library.logStepWithScreenshot('Pass-hoverOverTest', 'Pass-hoverOverTest');
      hover = true;
      resolve(hover);
    });
  }

  addComment(cmnt) {
    let comment = false;
    return new Promise((resolve) => {
      const commentAdd = findElement(locatorType.XPATH, addCommentTxtArea);
      commentAdd.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', commentAdd);
        commentAdd.sendKeys(cmnt).then(function () {
          library.logStep('Comment added: ' + cmnt);
          console.log('Comment added: ' + cmnt);
          library.logStepWithScreenshot('Pass-addComment', 'Pass-addComment');
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
      const pezIcnEle = element(by.xpath(pezIconComment));
      browser.wait(browser.ExpectedConditions.visibilityOf(pezIcnEle), 8000, 'Pez Comment Icon not displayed');
      pezIcnEle.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', pezIcnEle);
        browser.actions().mouseMove(pezIcnEle).perform();
        const actToolTipele = element(by.xpath(pezCommentStringEle));
        browser.wait(browser.ExpectedConditions.visibilityOf(actToolTipele), 8000, 'Pez Comment not displayed');
        actToolTipele.getText().then(function (actToolTip) {
          const meanEle = element(by.xpath('.//input[@tabindex = "11"]'));
          browser.executeScript('arguments[0].scrollIntoView();', meanEle);
          library.logStepWithScreenshot('verifyPezCommentToolTip', 'verifyPezCommentToolTip');
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
      }).catch(function () {
        console.log('Fail: Pez icon nopt displyed');
        library.logStep('Fail: Pez icon nopt displyed');
        verifyPezCommentToolTip = false;
        resolve(verifyPezCommentToolTip);
      });
    });
  }

  clickOnDoneButton() {
    let clickOnDoneButton = false;
    return new Promise((resolve) => {
      const done = element(by.xpath(reviewSummaryDoneButton));
      library.clickJS(done);
      dashBoard.waitForElement();
      console.log('Pass: Done Button Clicked');
      clickOnDoneButton = true;
      resolve(clickOnDoneButton);
    });
  }

  clickShowOptions() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const showOptionsLink = element(by.xpath(showOptionsEle));
      showOptionsLink.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', showOptionsLink);
        browser.wait(browser.ExpectedConditions.elementToBeClickable(showOptionsLink), 8000, 'Show option link is not clickable');
        library.clickJS(showOptionsLink);
        library.logStep('Show Option Button clicked.');
        library.logStepWithScreenshot('Pass-clickShowOptions', 'Pass-clickShowOptions');
        clickShowOpt = true;
        resolve(clickShowOpt);
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

  verifyEnteredValueStored(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      browser.actions().mouseMove(unityBtn).perform();
      const valueEle = element(by.xpath(storedValT1L1));
      browser.wait(browser.ExpectedConditions.visibilityOf(valueEle), 12000, 'Entered values not displayed');
      valueEle.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          console.log('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStepWithScreenshot('Pass-verifyEnteredValueStored', 'Pass-verifyEnteredValueStored');
          valueData = true;
        } else {
          console.log('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStepWithScreenshot('Fail-verifyEnteredValueStored', 'Fail-verifyEnteredValueStored');
          valueData = false;
        }
      });
      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }
    });
  }

  verifyEnteredValueStoredForAnalyte(expectedVal, analyteName) {
    return new Promise((resolve) => {
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      browser.actions().mouseMove(unityBtn).perform();
      const analyteValue = '//span[contains(text(),"' + analyteName + '")]//parent::div//following::div[1]//div[contains(@class,"level-data")]//div[1]';
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analyteValue))), 12000, 'Entered values not displayed');
      element(by.xpath(analyteValue)).getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          console.log('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStepWithScreenshot('Pass-verifyEnteredValueStored', 'Pass-verifyEnteredValueStored');
          resolve(true);
        } else {
          console.log('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStep('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          library.logStepWithScreenshot('Fail-verifyEnteredValueStored', 'Fail-verifyEnteredValueStored');
          resolve(false);
        }
      });
    });
  }

  verifyCommentSection(expectedValue) {
    let comment = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const countOnComment1 = element(by.xpath(countOnComment));
      browser.wait(browser.ExpectedConditions.visibilityOf(countOnComment1), 8000, 'Comment Count not displayed');
      countOnComment1.isDisplayed().then(function () {
        browser.actions().mouseMove(element(by.xpath(countOnComment))).perform();
        browser.executeScript('arguments[0].scrollIntoView();', countOnComment1);
        let actualvalue;
        countOnComment1.getText().then(function (txt) {
          actualvalue = txt;
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
          library.logStepWithScreenshot('Pass-verifytheReviewSummaryPage', 'Pass-verifytheReviewSummaryPage');
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
        }
      });
    });

  }

  editComment(value, newComment) {
    let editComment = false;
    return new Promise((resolve) => {
      const valEle = element(by.xpath('.//span[@class="show"][contains(text(),"' + value + '")]'));
      browser.wait(browser.ExpectedConditions.visibilityOf(valEle), 12000, 'Value not displayed');
      valEle.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', valEle);
        library.clickJS(valEle);
        const commentBox = element(by.xpath(addCommentTextBoxTestView));
        browser.wait(browser.ExpectedConditions.visibilityOf(commentBox), 8000, 'Comment box not displayed');
        commentBox.sendKeys(newComment).then(function () {
          const submitBtn = element(by.xpath(saveUpdateBtnTestView));
          library.clickJS(submitBtn);
          console.log('Pass: Comment Edited: ' + newComment);
          library.logStepWithScreenshot('Pass-editComment', 'Pass-editComment');
          editComment = true;
          resolve(editComment);
        });
      }).catch(function () {
        console.log('Fail: Comment Icon not displayed');
        library.logStepWithScreenshot('Fail: Comment Icon not displayed', 'Fail-editComment');
        editComment = false;
        resolve(editComment);
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
      const pezIcnEle = element(by.xpath(pezIconComment));
      browser.actions().mouseMove(pezIcnEle).perform();
      dashBoard.waitForPage();
      const actToolTipele = element(by.xpath(pezCommentStringEle2));
      browser.executeScript('arguments[0].scrollIntoView();', actToolTipele);
      dashBoard.waitForPage();
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
    });
  }

  verifySpecificAnalyteComment(analyteName, commentString) {
    let displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const commentIcon = element(by.xpath('.//span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/span[contains(@class, "chat")]/parent::span'));
      commentIcon.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', commentIcon);
        browser.actions().mouseMove(commentIcon).perform();
        const actToolTipele = element(by.xpath(pezCommentStringEle));
        browser.wait(browser.ExpectedConditions.visibilityOf(actToolTipele), 8000, 'Comment not displayed');
        actToolTipele.getText().then(function (actToolTip) {
          if (actToolTip.includes(commentString)) {
            console.log('Pass: Tool Tip Comment Verified ' + analyteName);
            library.logStep('Pass: Tool Tip Comment Verified ' + analyteName);
            library.logStepWithScreenshot('Pass-verifySpecificAnalyteComment', 'Pass-verifySpecificAnalyteComment');
            displayed = true;
            resolve(displayed);
          } else {
            console.log('Fail: Could not verify Tool Tip Comment ' + analyteName);
            library.logStep('Fail: Could not verify Tool Tip Comment ' + analyteName);
            library.logStepWithScreenshot('Fail-verifySpecificAnalyteComment', 'Fail-verifySpecificAnalyteComment');
            displayed = false;
            resolve(displayed);
          }
        });
      }).catch(function () {
        console.log('Could not verify tooltip for ' + analyteName);
        library.logStep('Could not verify tooltip for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifySpecificAnalyteComment2(analyteName, commentString) {
    let displayed = false;
    return new Promise((resolve) => {
      const commentIcon = findElement(locatorType.XPATH, './/span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/span[contains(@class, "chat")]/parent::span');
      browser.executeScript('arguments[0].scrollIntoView();', commentIcon);
      browser.actions().mouseMove(commentIcon).perform();
      const actToolTipele = element(by.xpath(pezCommentStringEle2));
      dashBoard.waitForElement();
      browser.executeScript('arguments[0].scrollIntoView();', actToolTipele);
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(commentString)) {
          console.log('Pass: Tool Tip Comment Verified ' + analyteName);
          library.logStep('Pass: Tool Tip Comment Verified ' + analyteName);
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Could not verify Tool Tip Comment ' + analyteName);
          library.logStep('Fail: Could not verify Tool Tip Comment ' + analyteName);
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify tooltip for ' + analyteName);
        library.logStep('Could not verify tooltip for ' + analyteName);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifySpecificAnalyteCommentNumber(analyteName, expectedNumber) {
    let displayed = false;
    return new Promise((resolve) => {
      const commentCount = element(by.xpath('.//span[contains(@class, "analyte-name")][contains(text(), "' + analyteName + '")]/ancestor::div[@class = "analyte-point-view-component"]//br-pez-cell/span/em[contains(@class, "comments_number")]'));
      commentCount.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', commentCount);
        browser.actions().mouseMove(commentCount).perform();
        dashBoard.waitForElement();
        commentCount.getText().then(function (actNum) {
          if (actNum.includes(expectedNumber)) {
            console.log('Pass: Comment Number verified for ' + analyteName);
            library.logStep('Pass: Comment Number verified ' + analyteName);
            displayed = true;
            resolve(displayed);
          } else {
            console.log('Fail: Could not verify Comment number ' + analyteName);
            library.logStep('Fail: Could not verify Comment number ' + analyteName);
            displayed = false;
            resolve(displayed);
          }
        });
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

  verifyEnteredValueStoredL1AllTest(expectedVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let valEle;
      dashBoard.waitForPage();
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
      browser.wait(browser.ExpectedConditions.presenceOf(valEle), 10000, 'Value not displayed for test: ' + test);
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            console.log('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Pass: Level 1 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            library.logStep('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);
            library.logStepWithScreenshot('Pass-verifyEnteredValueStoredL1AllTest', 'Pass-verifyEnteredValueStoredL1AllTest');
            displayed = true;
            resolve(displayed);
          } else {
            console.log('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            console.log('Fail: Level 1 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            library.logStep('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            library.logStepWithScreenshot('Fail-verifyEnteredValueStoredL1AllTest', 'Fail-verifyEnteredValueStoredL1AllTest');
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
      dashBoard.waitForPage();
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
      browser.wait(browser.ExpectedConditions.visibilityOf(valEle), 12000, 'Value not displayed for test: ' + test);
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            console.log('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            console.log('Pass: Level 2 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStep('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStepWithScreenshot('Pass-verifyEnteredValueStoredL2AllTest', 'Pass-verifyEnteredValueStoredL2AllTest');
            displayed = true;
            resolve(displayed);
          } else {
            console.log('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            console.log('Fail: Level 2Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
            console.log('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStep('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            library.logStepWithScreenshot('Fail-verifyEnteredValueStoredL2AllTest', 'Fail-verifyEnteredValueStoredL2AllTest');
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
      dashBoard.waitForPage();
      browser.actions().mouseMove(element(by.xpath(unityNext))).perform();
      browser.actions().mouseMove(element(by.xpath(unityNext))).perform();
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
      browser.wait(browser.ExpectedConditions.visibilityOf(valEle), 8000, 'Value not displayed for test: ' + test);
      valEle.getText().then(function (data) {
        valData = data;
        if (valData.includes(expectedVal)) {
          console.log('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Pass: Level 3 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
          console.log('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          library.logStep('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          library.logStepWithScreenshot('Pass-verifyEnteredValueStoredL3AllTest', 'Pass-verifyEnteredValueStoredL3AllTest');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          console.log('Fail: Level 3 Test ' + test + ' Expected Data: ' + expectedVal + ' Actual: ' + valData);
          library.logStep('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          library.logStepWithScreenshot('Fail-verifyEnteredValueStoredL3AllTest', 'Fail-verifyEnteredValueStoredL3AllTest');
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
      browser.actions().mouseMove(analyteName).perform();
      console.log('Hovered over test: ' + testid);
      const showOpt = findElement(locatorType.XPATH, './/br-analyte-point-entry//span[contains(@class, "test-analyte-name")][contains(text(), "' + testid + '")]/parent::div/parent::div/following-sibling::div//br-change-lot//span[contains(text(), "Show options")]');
      browser.executeScript('arguments[0].scrollIntoView();', showOpt);
      library.clickJS(showOpt);
      console.log('Show Option Button clicked.');
      const comTxtbox = findElement(locatorType.XPATH, './/br-analyte-point-entry//span[contains(@class, "test-analyte-name")][contains(text(), "' + testid + '")]/parent::div/parent::div/following-sibling::div//textarea');
      browser.executeScript('arguments[0].scrollIntoView();', comTxtbox);
      comTxtbox.sendKeys(commentText).then(function () {
        console.log('Pass: Comments added');
        library.logStep('Pass: Comments added');
        library.logStepWithScreenshot('Pass-enterCommentForAllTests', 'Pass-enterCommentForAllTests');
        enterComment = true;
        resolve(enterComment);
      }).catch(function () {
        console.log('Fail: Unable to add comment');
        library.logStep('Fail: Unable to add comment');
        library.logStepWithScreenshot('Fail-enterCommentForAllTests', 'Fail-enterCommentForAllTests');
        enterComment = false;
        resolve(enterComment);
      });
    });
  }

  verifyPezCommentToolTipAllTest(expToolTip, test) {
    let displayed = false;
    return new Promise((resolve) => {
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
      browser.actions().mouseMove(pezIcnEle).perform();
      const actToolTipele = element(by.xpath(pezCommentStringEle));
      browser.wait(browser.ExpectedConditions.visibilityOf(actToolTipele), 8000, 'Cooment Tooltip not displayed for test: ' + test);
      actToolTipele.getText().then(function (actToolTip) {
        if (actToolTip.includes(expToolTip)) {
          console.log('Pass: Tool Tip Verified');
          console.log('Pass: Tool Tip Verified');
          library.logStep('Pass: Tool Tip Verified');
          library.logStepWithScreenshot('Pass-verifyPezCommentToolTipAllTest', 'Pass-verifyPezCommentToolTipAllTest');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Tool Tip Verified');
          console.log('Fail: Tool Tip Verified');
          library.logStep('Fail: Tool Tip Verified');
          library.logStepWithScreenshot('Fail-verifyPezCommentToolTipAllTest', 'Fail-verifyPezCommentToolTipAllTest');
          displayed = false;
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Could not verify tooltip for ' + test);
        library.logStep('Could not verify tooltip for ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifyCommentNumberAllTest(expectedCommentNum, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let pezNumEle;
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
      browser.wait(browser.ExpectedConditions.visibilityOf(pezNumEle), 8000, 'Pez icon not displayed for test: ' + test);
      browser.executeScript('arguments[0].scrollIntoView();', pezNumEle);
      pezNumEle.getText().then(function (actualvalue) {
        if (actualvalue === expectedCommentNum) {
          console.log('Pass: Comment Number Verified');
          console.log('Pass: Comment Number Verified');
          library.logStep('Pass: Comment Number Verified');
          displayed = true;
          resolve(displayed);
        } else {
          console.log('Fail: Comment Number Verified');
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
      browser.wait(browser.ExpectedConditions.visibilityOf(interEle), 8000, 'Interaction icon not displayed for test: ' + test);
      browser.executeScript('arguments[0].scrollIntoView(true);', interEle);
      interEle.isDisplayed().then(function () {
        interEle.getText().then(function (actualvalue) {
          if (actualvalue === expectedValue) {
            console.log('Pass: Interaction Icon Verified');
            console.log('Pass: Interaction Icon Verified');
            library.logStep('Pass: Interaction Icon Verified');
            displayed = true;
            resolve(displayed);
          } else {
            console.log('Fail: Interaction Icon Verified');
            console.log('Fail: Interaction Icon Verified');
            library.logStep('Fail: Interaction Icon Verified');
            displayed = false;
            resolve(displayed);
          }
        }).catch(function () {
          console.log('Element not displayed for test: ' + test);
          console.log('Element not displayed for test: ' + test);
          library.logStep('Element not displayed for test: ' + test);
          displayed = false;
          resolve(displayed);
        });
      }).catch(function () {
        console.log('Element not displayed for test: ' + test);
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
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 40000, 'Element is visible');
      dashBoard.waitForScroll();
      browser.executeScript('arguments[0].scrollIntoView();', element(by.xpath(paginationControls)));
      const pagination = element(by.xpath(paginationControls));
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
      const next = findElement(locatorType.XPATH, nextButtonMul);
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
      const prev = findElement(locatorType.XPATH, previousButtonMul);
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

  verifyPriorDateTimeDialog() {
    let status = false;
    return new Promise((resolve) => {
      const priorDateTimeDlg = element(by.xpath(priorDateTimeDialog));
      const priorDateTimeDialogTxt = element(by.xpath(priorDateTimeDialogText));
      priorDateTimeDlg.isDisplayed().then(function () {
        library.logStep('Prior Date Time Dialog is displayed');
        priorDateTimeDialogTxt.isDisplayed().then(function () {
          priorDateTimeDialogTxt.getText().then(function (txt) {
            if (txt === 'You are about to submit data for date or time prior to your most recently entered test runs. For point data entry, the run(s) will not be included in the peer data. For summary data entry, the run(s) will be included in the peer data.') {
              library.logStepWithScreenshot('The message on the dialog is displayed correctly', 'dialogtext');
              status = true;
              resolve(status);
            } else {
              library.logFailStep('The message on the dialog is incorrect');
              status = false;
              resolve(status);
            }
          });
        });
      }).catch(function () {
        library.logFailStep('Prior Date Time Dialog is not displayed properly');
        status = false;
        resolve(status);
      });
    });
  }

  closePriorDateTimeDialog() {
    let status = false;
    return new Promise((resolve) => {
      const priorDateTimeDialogCloseBtn = findElement(locatorType.XPATH, priorDateTimeDialogCloseButton);
      priorDateTimeDialogCloseBtn.isDisplayed().then(function () {
        library.clickJS(priorDateTimeDialogCloseBtn);
        library.logStep('Prior Date Time Dialog is closed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Prior Date Time Dialog is not closed');
        status = false;
        resolve(status);
      });
    });
  }

  verifyInsertedPointData(value, date) {
    let displayed, flag1, flag2 = false;
    return new Promise((resolve) => {
      dashBoard.waitForScroll();
      console.log('.//unext-value-cell//span[contains(text(), "' + value + '")]/ancestor::tr//unext-date-time-cell//unext-date[contains(text(), "' + date + '")]');
      const valEle = findElement(locatorType.XPATH, './/unext-value-cell//span[contains(text(), "' + value + '")]/ancestor::tr//unext-date-time-cell//unext-date[contains(text(), "' + date + '")]');
      library.scrollToElement(valEle);
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      valEle.isDisplayed().then(function () {
        flag1 = true;
        console.log('Value & Date displayed: ' + value + ' ' + date);
        library.logStep('Value & Date displayed: ' + value + ' ' + date);
      }).then(function () {
        dashBoard.waitForScroll();
        const inserted = element(by.xpath('.//unext-value-cell//span[contains(text(), "' + value + '")]/ancestor::tr//unext-date-time-cell//unext-date[contains(text(), "' + date + '")]/following-sibling::em[contains(@class, "inserted")]'));
        inserted.isDisplayed().then(function () {
          flag2 = true;
          console.log('Value is inserted ' + value);
          library.logStep('Value is inserted ' + value);
        });
      }).then(function () {
        if (flag1 && flag2 === true) {
          displayed = true;
          console.log('Value is saved as inserted');
          library.logStep('Value is saved as inserted');
          resolve(displayed);
        }
      }).catch(function () {
        console.log('Value insertion icon not displayed');
        library.logStep('Value insertion icon not displayed');
        flag2 = false;
      });
    });
  }

  verifyInsertedTime(value, date, time) {
    let displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForScroll();
      const valEle = element(by.xpath('.//unext-value-cell//span[contains(text(), "' + value + '")]/ancestor::tr//unext-date-time-cell//unext-date[contains(text(), "' + date + '")]'));
      const timeEle = element(by.xpath('.//unext-value-cell//span[contains(text(), "' + value + '")]/ancestor::tr//unext-date-time-cell//unext-date[contains(text(), "' + time + '")]'));
      browser.executeScript('arguments[0].scrollIntoView();', valEle);
      timeEle.isDisplayed().then(function () {
        displayed = true;
        console.log('Time Verified: ' + value);
        library.logStep('Time Verified: ' + value);
        resolve(displayed);
      }).catch(function () {
        console.log('Time not verified');
        library.logStep('Time not verified');
        displayed = false;
        resolve(displayed);
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

  clickManuallyEnterDataInstrumentControl() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const enterPoint = findElement(locatorType.XPATH, manuallyEnterDataLink);
      enterPoint.isDisplayed().then(function () {
        library.clickJS(enterPoint);
        dashBoard.waitForScroll();
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        console.log('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }

  verifyPanelMultipointUI(levels, controlAnalyteName, panelName) {
    let status = false;
    return new Promise((resolve) => {
      const list = element.all(by.xpath(levelsInUse));
      const pageUI = new Map<string, string>();
      const panelNm = '//h1[contains(text(),"' + panelName + '")]';
      pageUI.set(panelNm, 'Panel name');
      pageUI.set(editThisPanel, 'Edit this Panel link');
      pageUI.set(runEntryRadioBtn, 'run Entry Radio Btn');
      pageUI.set(levelEntryRadiioBtn, 'level Entry Radiio Btn');
      pageUI.set(manuallyEnterDataLink, 'manually Enter Data Link');
      pageUI.set(noDataLabel, 'no Data Label');
      pageUI.set(dateLabel, 'date Label');
      pageUI.set(changeDateButton, 'changeDate Button ');
      pageUI.set(timeInput, 'time Input');
      pageUI.set(cancelButton, 'cancel Button');
      pageUI.set(submitButton, 'submit Button');

      pageUI.forEach(function (key, value) {
        const Ele = findElement(locatorType.XPATH, value);
        if (Ele.isDisplayed()) {
          library.logStep(key + '  displayed ');
          status = true;
          resolve(status);
        } else {
          library.logStep(key + 'not  displayed ');
          status = false;
          resolve(status);
        }
      });
      if (list.count() === levels) {
        library.logStep('levels  displayed correctly');
        status = true;
        resolve(status);

      } else {
        library.logFailStep('levels not displayed correctly');
        status = false;
        resolve(status);
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
          noDataEle = findElement(locatorType.XPATH, '//span[contains(text(),"' + analyteName + '")]'
            + '/following-sibling::span[contains(text(),"No Data")]');
        } else {
          console.log('+++++++> ', '//span[contains(text(),"' + analyteName + '")]/following-sibling::span[contains(text(),"No Data")]');
          noDataEle = findElement(locatorType.XPATH, '//span[contains(text(),"' + analyteName + '")]/following-sibling::span[contains(text(),"No Data")]');
        }
        if (noDataEle.isDisplayed()) {
          library.scrollToElement(noDataEle);
          console.log('No Data is displaying for the analyte having no data saved.');
          library.logStepWithScreenshot('No Data is displaying for the analyte having no data saved.', 'NoData');
          flag = true;
          resolve(flag);
        } else {
          console.log('Failed : No Data is not displaying for the analyte having no data saved.');
          library.logFailStep('No Data is not displaying for the analyte having no data saved.');
          flag = false;
          resolve(flag);
        }
      } catch (error) {
        console.log('Failed : No Data is not displaying for the analyte having no data saved.');
        library.logFailStep('No Data is not displaying for the analyte having no data saved.');
        flag = false;
        resolve(flag);
      }

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
  hoverOverLastEntryLabel(analyte, level) {
    let status = false;
    return new Promise((resolve) => {
      const lastEntryLabel = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + analyte + '")]/parent::div/following-sibling::div[contains(@class, "analyte-multi-point-component")]//div//span[contains(@class, "is-last-data-entry")])[' + level + ']'));
      lastEntryLabel.isDisplayed().then(function () {
        library.hoverOverElement(lastEntryLabel);
        library.logStepWithScreenshot('Mouse Hover on Last Entry Label', 'lastEntry');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to Mouse Hover on Last Entry Label');
        status = false;
        resolve(status);
      });
    });
  }

  verifyToolTipDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const toolTip = element(by.xpath(''));
      toolTip.isDisplayed().then(function () {
        library.logStepWithScreenshot('ToolTip displayed', 'ToolTip');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('ToolTip not displayed');
        status = false;
        resolve(status);
      });
    });
  }
}
