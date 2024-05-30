//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element, Browser, protractor, ExpectedConditions } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const updatedIcon = '(//span[@class="ic-pez ic-history-18dp"])[1]';
const message = '//div[@class="flex-ctn-1"]//h2';
const DonebtnonPOPUP = '//span[text()="DONE"]//parent::button';
const sendtopeergroupbtn = '//span[text()=" SEND TO PEER GROUP "]//parent::button';
const labellevel = '//div[contains(@class,"mat-form-field")]//label';
const firstValue = '//input[@tabindex="101"]';
const FocusedElement = '//input[@tabindex="101"]//parent::div//parent::div//parent::div//parent::mat-form-field';
const level1value = '//input[@tabindex="101"]';
const showOptionsarrow = '//span[@mattooltip="Show options"]';
const Insertadifferentdatelink = '//a[text()="Insert a different date"]';
const undefinedDate = 'undefinedDate';
const undefinedTime = 'undefinedTime';
const dateicon = '(//span//span[@class="ic-info-24px"])[2]';
const insertdateicondata = '//p[contains(text(),"Test runs must be captured in correct sequence to be included in the peer data")]';
const commentbox = '//textarea[contains(@placeholder,"Comment")]';
const commentboxinmultiform = '//textarea[contains(@placeholder,"comment")]';
const deleteRecord = '//mat-icon[contains(@class,"white-icon")]';
const Donebtn = '//span[text()="DONE"]//parent::button';
const scrollTestLevel = '(//tr[@class="ng-star-inserted"])[2]/td[3]';
const submitUpdates = '//span[text()="SUBMIT UPDATES"]//parent::button';
const restartfloat = '//input[@name="restartFloatstatistics"]//parent::div//div//div[1]';
const restartupdatedicon = '//div//em[@mattooltip="Restart float on this run"][1]';
const correctiveactiondropdown = '(//span[text()="Corrective action"])[1]';
const Correctiveactionname = '//mat-option[@role="option"]//span';
const chooseaaction = '(//span[text()="Choose an action"])[1]';
const correctiveactionicon = '//span[contains(@class,"ic-pez ic-change-history")]';
const textoncorrectiveicon = '//section[@class="ctn-actions"]//p';
const DataentryformNC = '//unext-run-insert//section[@class="run-insert-component"]';
const cancelbtn = '//span[text()="Cancel"]//parent::button';
const submitbtnmultidata = '//button//span[contains(text(),"Send To Peer Group")]';
const actionTooltip = '//mat-dialog-container[@role="dialog"]';
const actionvalueontooltip = '//p[contains(text(),"Actions")]//parent::div//span//parent::li//p';
const Previousdata = '(//tr[@class="ng-star-inserted"]//td[1]//span[contains(text()," Sep 14")]//ancestor::div[1])[1]';
const confirmDel = './/button[@id="dialog_button2"]';
export class RevisedPointData {
  presenceofupdatedActivityicon() {
    dashBoard.waitForPage();
    let text1 = false;
    return new Promise((resolve) => {
      const updatedicon1 = element(by.xpath(updatedIcon));
      updatedicon1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Updated Activity/History Icon is displayed', 'Updated Activity/History Icon');
        browser.actions().mouseMove(findElement(locatorType.XPATH, updatedIcon)).click().perform();
        text1 = true;
        resolve(text1);
        library.logStepWithScreenshot('Updated Activity/History Icon is clicked', 'Updated Activity/History Icon is clicked');
      }).catch(function () {
        library.logStepWithScreenshot('Updated icon is not present', 'Updated icon is not present');
        text1 = false;
        resolve(text1);
      });
    });
  }
  verifythecommentsonIcon() {
    dashBoard.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      browser.actions().mouseMove(findElement(locatorType.XPATH, updatedIcon)).click().perform();
      const act = element(by.xpath(message));
      const Donebtn = element(by.xpath(DonebtnonPOPUP));
      library.logStep('updated icon is present and clicked');
      const exp = 'Review Summary';
      act.getText().then(function (actual) {
        if (actual === exp) {
          result = true;
          dashBoard.waitForElement();
          library.clickJS(Donebtn);
          library.logStep('Verified message on POPUP');
          resolve(result);
        }
        else {
          result = false;
          resolve(result);
        }
      });
    });
  }
  presenceofSendToPeerGroupbtnOnPointForm() {
    dashBoard.waitForPage();
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
  presenceOfLevelHeader(levelHeader) {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const levellabel = element.all(by.xpath(labellevel));
      levellabel.then(function (items) {
        if (items.length === 0) {
          result = false;
          resolve(result);
          library.logStepWithScreenshot('Label for level is not displayed', 'Label for level is not displayed');
        }
        else {
          const expectedlevelList = levelHeader.split(",")
          let i = 0;
          for (i; i < items.length; i++) {
            items[i].getText().then(function (actuallevelvalue) {
              console.log(actuallevelvalue);
              expectedlevelList.forEach(function (expectedlevelvalue) {
                console.log(expectedlevelvalue);
                if (actuallevelvalue.includes(expectedlevelvalue)) {
                  console.log("enteredif ", expectedlevelvalue)
                  dashBoard.waitForElement();
                  library.logStepWithScreenshot('levelheader' + actuallevelvalue + ' for level ' + actuallevelvalue + ' is displayed', 'levelheader' + actuallevelvalue + ' for level ' + actuallevelvalue + ' is displayed');
                  resolve(true);
                }
              })
            });
          }
        }
      }).catch(function () {
        resolve(result);
      })
    })
  }
  clickManuallyEnterData() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const enterdatalink = findElement(locatorType.XPATH, '//a[text()="Manually enter data"]');
      library.waitForElement(enterdatalink);
      library.scrollToElement(enterdatalink);
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
  VerifyfocusonFirstElement() {
    dashBoard.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const FirstElement = element(by.xpath(firstValue));
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
  VerifythepresenceofShowOptionArrow() {
    dashBoard.waitForPage();
    let clickShowOptbtn = false;
    return new Promise((resolve) => {
      const showOptionsarrow1 = element(by.xpath(showOptionsarrow));
      library.scrollToElement(showOptionsarrow1);
      showOptionsarrow1.isDisplayed().then(function () {
        library.logStepWithScreenshot('ShowOptionArrow is displayed', 'ShowOptionArrow is displayed');
        library.clickJS(showOptionsarrow1);
        library.logStepWithScreenshot('Show Option arrow is present and clicked', 'Show Option arrow is present and clicked');
        clickShowOptbtn = true;
        resolve(clickShowOptbtn);
      }).catch(function () {
        library.logStepWithScreenshot('Show Option arrow is not present', 'Show Option arrow is not present');
        clickShowOptbtn = false;
        resolve(clickShowOptbtn);
      });
    });
  }
  verifythepresenceofInsertadifferentDate() {
    dashBoard.waitForPage();
    let insertadifferentdate = false;
    return new Promise((resolve) => {
      const Insertadifferentdatelink1 = element(by.xpath(Insertadifferentdatelink));
      Insertadifferentdatelink1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Insertadifferentdatelink is present', 'Insertadifferentdatelink is present');
        library.clickJS(Insertadifferentdatelink1);
        library.logStepWithScreenshot('Insertadifferentdatelink is clicked', 'Insertadifferentdatelink is clicked');
        insertadifferentdate = true;
        resolve(insertadifferentdate);
      }).catch(function () {
        library.logStepWithScreenshot('Insertadifferentlink is not present', 'Insertadifferentlink is not present');
        insertadifferentdate = false;
        resolve(insertadifferentdate);
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
  verifyTimePicker() {
    return new Promise((resolve) => {
      let displayed = false;
      const date = element(by.id(undefinedTime));
      date.isDisplayed().then(function () {
        displayed = true;
        library.logStepWithScreenshot('Timepicker is displayed', 'TimePicker is displayed');
        resolve(displayed);
      }).catch(function () {
        library.logStepWithScreenshot('Timepicker is not displayed', 'TimePicker is not displayed');
        displayed = false;
        resolve(displayed);
      });
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
  addCommentOnEditDialog(comment) {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const addCommentTextarea = findElement(locatorType.XPATH, commentbox);
      addCommentTextarea.isDisplayed().then(function () {
        addCommentTextarea.click().then(function () {
          dashBoard.waitForPage();
          addCommentTextarea.sendKeys(comment);
          status = true;
          library.logStep('Comment Added');
          resolve(status);
        });
      });
    });
  }
  verifythepresenceoftextondateicon() {
    return new Promise((resolve) => {
      let displayed = false;
      const icon = element(by.xpath(insertdateicondata));
      icon.isDisplayed().then(function () {
        icon.getText().then(function () {
        })
        displayed = true;
        library.logStep('Date icon is displayed and clicked.');
        resolve(displayed);
      }).catch(function () {
        library.logStep(' Date icon is displayed and clicked');
        displayed = false;
        resolve(displayed);
      });
    });
  }
  ClickOnEditDialogueButtonOnTestLevel() {
    dashBoard.waitForPage();
    let editDialogBtnClicked = false;
    return new Promise((resolve) => {
      const scroll = findElement(locatorType.XPATH, scrollTestLevel);
      library.clickJS(scroll);
      library.logStep('Clicked on edit dialogue button on test level');
      library.logStepWithScreenshot('Editdata', 'Editdata Screenshot');
      editDialogBtnClicked = true;
      resolve(editDialogBtnClicked);
    });
  }
  clickSubmitUpdatesButton() {
    let status = false;
    return new Promise((resolve) => {
      const submitUpdatesButton = findElement(locatorType.XPATH, submitUpdates);
      submitUpdatesButton.isDisplayed().then(function () {
        library.clickJS(submitUpdatesButton);
        status = true;
        library.logStepWithScreenshot('Submit Updates Button is clicked ', 'Submit Updates Button ');
        resolve(status);
      });
    });
  }
  clickonrestartFloatIcon() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const Restartfloatbtn = findElement(locatorType.XPATH, restartfloat);
      Restartfloatbtn.isDisplayed().then(function () {
        library.clickJS(Restartfloatbtn);
        status = true;
        library.logStepWithScreenshot('Restart float is present and clicked', 'Restart float is clicked');
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot(' Restartfloatbtn on Edit Dialog is not clicked', ' Restartfloatbtn on Edit Dialog is not clicked');
        status = false;
        resolve(status);
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
  clickEditDialogDeleteButton() {
    let status = false;
    return new Promise((resolve) => {
      const deleteRecordButton = findElement(locatorType.XPATH, deleteRecord);
      library.scrollToElement(deleteRecordButton);
      deleteRecordButton.isDisplayed().then(function () {
        library.clickJS(deleteRecordButton);
        status = true;
        library.logStep('Edit dialog Delete Button is clicked');
        resolve(status);
      });
    });
  }
  verifyDateTime(date) {
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const editdata = element(by.xpath(Previousdata));
      const deleteRecordButton = element(by.xpath(deleteRecord));
      const confirmDeleteButton = element(by.xpath(confirmDel));
      library.scrollToElement(editdata);
      editdata.getText().then(function (txt: any) {
        if (txt.includes(date)) {
          library.logStepWithScreenshot('Date is present', 'Date is present');
          dashBoard.waitForElement();
          library.scrollToElement(editdata);
          library.clickJS(editdata);
          library.waitForElement(deleteRecordButton);
          library.clickJS(deleteRecordButton);
          library.clickJS(confirmDeleteButton);
          resolve(true);
        }
        else {
          resolve(false);
          library.logFailStep('Date is not present');
        }
      })
    })
  }
  verifypresenceofupdatedRestartIcon() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const restartupdatedicon1 = findElement(locatorType.XPATH, restartupdatedicon);
      restartupdatedicon1.isDisplayed().then(function () {
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
  clickoncorrectiveactiondropdown() {
    dashBoard.waitForPage();
    let clicked = false;
    return new Promise((resolve) => {
      const correctiveactiondropdown1 = findElement(locatorType.XPATH, correctiveactiondropdown);
      correctiveactiondropdown1.isDisplayed().then(function () {
        library.clickJS(correctiveactiondropdown1);
        clicked = true;
        library.logStep('correctiveactiondropdown is displayed and clicked');
        library.logStepWithScreenshot('correctiveactiondropdown', 'correctiveactiondropdown');
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
    let status = false;
    return new Promise((resolve) => {
      const Correctiveactionname1 = element.all(by.xpath(Correctiveactionname));
      Correctiveactionname1.then(function (items) {
        expect(items.length).not.toEqual(0);
        for (let i = 0; i < items.length; i++) {
          items[i].getText().then(function (txt: any) {
            if (txt === actionname) {
              dashBoard.waitForPage();
              items[i].click();
              library.logStepWithScreenshot('correctiveactionname is displayed and clicked', 'correctiveactionname');
              status = true;
              resolve(status);
            }
            else {
              if (i === items.length - 1) {
                library.logStepWithScreenshot('correctiveactionname is not Displayed', 'correctiveactionname is not displayed');
                status = false;
                resolve(status);
              }

            }
          })
        }
      }).catch(function () {
        resolve(status);
      })
    });
  }
  clickonchooseaaction() {
    dashBoard.waitForPage();
    let clicked = false;
    return new Promise((resolve) => {
      const chooseaaction1 = findElement(locatorType.XPATH, chooseaaction);
      chooseaaction1.isDisplayed().then(function () {
        library.clickJS(chooseaaction1);
        clicked = true;
        library.logStepWithScreenshot('chooseaaction is displayed and clicked', 'chooseaaction is displayed and clicked');
        resolve(clicked);
      },
        function () {
          library.logStep('chooseaaction dropdown is not clicked');
          clicked = false;
          resolve(clicked);
        });
    });
  }
  clickoncorrectiveactionicon() {
    dashBoard.waitForPage();
    let clicked = false;
    return new Promise((resolve) => {
      const correctiveactionicon1 = findElement(locatorType.XPATH, correctiveactionicon);
      correctiveactionicon1.isDisplayed().then(function () {
        dashBoard.waitForPage();
        browser.actions().mouseMove(findElement(locatorType.XPATH, correctiveactionicon)).click().perform();
        library.logStepWithScreenshot('correctiveactionicon is clicked', 'correctiveactionicon is clicked');
        clicked = true;
        resolve(clicked);
      },
        function () {
          library.logStepWithScreenshot('correctiveactionicon is not clicked', 'correctiveactionicon is not clicked');
          clicked = false;
          resolve(clicked);
        });
    });
  }
  presenceofDataonacorrectiveactionicon(com) {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const textoncorrectiveicon1 = findElement(locatorType.XPATH, textoncorrectiveicon);
      textoncorrectiveicon1.getText().then(function (value) {
        if (value.includes(com)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Action comments on icon is verified', 'Action on icon is verified');
          browser.actions().mouseMove(findElement(locatorType.XPATH, Donebtn)).click().perform();
        }
        else {
          library.logStepWithScreenshot('Action comments on icon is not present', 'Action comments on icon is not present');
          result = false;
          resolve(result);
        }
      });
    });
  }
  verifyDataEntryFormNC() {
    let result = false;
    return new Promise((resolve) => {
      const DataentryformNC1 = findElement(locatorType.XPATH, DataentryformNC);
      DataentryformNC1.isDisplayed().then(function () {
        dashBoard.waitForPage();
        library.logStepWithScreenshot('DataEntryForm is displayed', 'DataEntryForm is displayed');
        result = true;
        resolve(result);
      },
        function () {
          library.logStepWithScreenshot('DataEntryForm is not displayed', 'DataEntryForm is not displayed');
          result = false;
          resolve(result);
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
  clickonshowoptionarrowformultidata(Analyte) {
    dashBoard.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const AnalyteLabel = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + Analyte + '")])'));
      library.scrollToElement(AnalyteLabel);
      const showoptionmultidata1 = element(by.xpath('//unext-analyte-multi-point//span[text()="' + Analyte + '"]//parent::div//following-sibling::div//div[contains(@class,"relative")]//div//span[@mattooltip="Show options"]'));
      showoptionmultidata1.isDisplayed().then(function () {
        library.clickJS(showoptionmultidata1);
        library.logStepWithScreenshot('Show option is clicked', 'Show option is clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStepWithScreenshot('Show option is not clicked', 'Show option is not clicked');
        result = false;
        resolve(result);
      });
    });
  }
  addcommentonmultidata(comment) {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const addCommentTextarea = findElement(locatorType.XPATH, commentboxinmultiform);
      addCommentTextarea.isDisplayed().then(function () {
        addCommentTextarea.click().then(function () {
          addCommentTextarea.sendKeys(comment);
          status = true;
          library.logStep('Comment Added');
          resolve(status);
        });
      });
    });
  }
  dataEntryFormformultidata(Analyte, val1) {
    dashBoard.waitForPage();
    let value1Entered = false;
    return new Promise((resolve) => {
      const AnalyteLabel = element(by.xpath('//unext-analyte-multi-point/div/span[contains(text(),"' + Analyte + '")]/parent::div/following-sibling::div//input'));
      library.scrollToElement(AnalyteLabel);
      AnalyteLabel.isDisplayed().then(function () {
        AnalyteLabel.sendKeys(val1);
        value1Entered = true;
        library.logStepWithScreenshot('values entered', 'PointValuesEntered');
        value1Entered = true;
        resolve(value1Entered);
      });
    });
  }
  clickonsendtopeerbtnMultiForm() {
    dashBoard.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const submitbtn = findElement(locatorType.XPATH, submitbtnmultidata);
      submitbtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Send to peer group btn', 'Send to peer group btn');
        browser.actions().mouseMove(findElement(locatorType.XPATH, submitbtnmultidata)).click().perform();
        library.logStepWithScreenshot('Send to peer group btn is clicked', 'Send to peer group btn is clicked');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Send to peer group btn is not displayed', 'Send to peer group btn is not displayed');
        status = false;
        resolve(status);
      });
    });
  }
  hoverOvercorrectiveactionIcon() {
    library.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const correctiveactionicon1 = element(by.xpath(correctiveactionicon));
      correctiveactionicon1.isDisplayed().then(function () {
        library.hoverOverElement(correctiveactionicon1);
        library.logStepWithScreenshot('Mouse Hover on Corrective action icon', 'Mouse Hover on Corrective action icon');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep('Unable to Mouse Hover on Correctice action icon');
        status = false;
        resolve(status);
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
  presenceofactiononToolTip(com) {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const actionvalueontooltip1 = findElement(locatorType.XPATH, actionvalueontooltip);
      actionvalueontooltip1.getText().then(function (value) {
        if (value.includes(com)) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot('Action value is verified', 'Action value is verified');
        }
        else {
          library.logStepWithScreenshot('Action comments on Tooltip is not verified', 'Action comments on Tooltip is not verified');
          result = false;
          resolve(result);
        }
      });
    });
  }

}
