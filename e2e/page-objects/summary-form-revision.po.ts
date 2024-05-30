//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element, protractor } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const sendtopeergroupButton = './/span[text()="SEND TO PEER GROUP"]//parent::button[@id="submitBtn"]';
const manualenterdatalink = '//a[text()="Manually enter data"]';
const updatedIcon = '//span[contains(@class,"grey pez ng-star-inserted")]//span//span[1]';
const firstValue = '//span[contains(@class,"level-1")]//parent::td//div//mat-form-field//input';
const FocusedElement = '//span[contains(text(),"mean")]//parent::td//following-sibling::td//div//mat-form-field';
const Dataentryform = '//div[@class="wrapper mat-typography analyte-summary-entry-component"]';
const Summaryform = '//div[@class="wrapper mat-typography analyte-summary-entry-component"]/parent::br-analyte-summary-entry/parent::div/following-sibling::div//section';
const showOptionsarrow = '//br-change-lot//span[@mattooltip="Show options"]';
const addComments = '//br-pez-cell//span[contains(@class,"grey pez ng-star-inserted")][1]';
const icon = './/br-pez-cell//span//span[contains(@class,"ic-pez ic-perm-identity-24px")][1]';
const yearHeader = './/div[contains(@class,"flex-ctn flex-ctn-1")]//span[1]';
const YearHeaderDiv = '//div[contains(@class,"flex-ctn flex-ctn-1")]//span[1]//parent::div';
const showDataArrow = './/unext-analytical-section/section//div/span[contains(@class,"chevron")]';
const submitUpdates = '//span[text()="SUBMIT UPDATES"]//parent::button';
const commentsonicon = '//section[@class="ctn-comments"]//p';
const Donebtn = '//span[text()="DONE"]';
const levellabels = '//td[contains(@class,"mat-column")]//span[contains(@class,"level-label")]'
export class RevisedSummaryData {
  presenceofsendToPeerGroupBtn() {
    library.waitForPage();
    let status = false;
    return new Promise((resolve) => {
      const btn = findElement(locatorType.XPATH, sendtopeergroupButton);
      library.scrollToElement(btn);
      btn.isDisplayed().then(function () {
        library.logStepWithScreenshot("Send to peer group button is present", "Send to peer group button is present");
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Send to peer group button is not present', 'Send to peer group button is not present');
        status = false;
        resolve(status);
      });
    });
  }
  presenceofManuallyEnterDataLink() {
    library.waitForPage();
    return new Promise((resolve) => {
      const Manualenterdatalink = element(by.xpath(manualenterdatalink));
      library.waitForElement(Manualenterdatalink);
      Manualenterdatalink.isDisplayed().then(function () {
        library.logStepWithScreenshot("manualenterdatalink is present", "Manual enter data");
        resolve(true);
      },
        function () {
          console.log("enteredcatch");
          library.logFailStep("manualenterdatalink is not present");
          resolve(false);
        });
    });
  }
  presenceofupdatedIcon() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const updatedIcon1 = element(by.xpath(updatedIcon));
      updatedIcon1.isDisplayed().then(function () {
        library.logStepWithScreenshot("updated icon is present", "IconUpdated");
        browser.actions().mouseMove(findElement(locatorType.XPATH, updatedIcon)).click().perform();
        library.logStepWithScreenshot("clicked on updated icon screenshot", "clicked on updated icon screenshot");
        result = true;
        resolve(result);
      },
        function () {
          library.logStepWithScreenshot("updated icon is not present", "updated icon is not present");
          result = false;
          resolve(result);
        });
    });
  }
  VerifyfocusonFirstElement() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const FirstElement = element(by.xpath(firstValue));
      library.scrollToElement(FirstElement);
      const focusedelement1 = element(by.xpath(FocusedElement));
      focusedelement1.getAttribute('class').then(function (value) {
        if (value.includes('mat-focused')) {
          dashBoard.waitForElement();
          library.logStepWithScreenshot("cursor is placed ar first data entry field", "FocusedElementscreenshot");
          result = true;
          resolve(result);
        } else {
          library.logStepWithScreenshot('Cursor is not placed at first value field', 'Cursor is not placed at first value field');
          result = false;
          resolve(result);
        }
      })
    });
  }
  enterMeanSdPoints(levelno, mean, sd, points) {
    library.waitForPage();
    return new Promise((resolve) => {
      const MeanValue = '//span[contains(text(),"mean")]//parent::td//following-sibling::td//span[contains(@class,"level-' + levelno + '")]//parent::td//div//mat-form-field//input';
      const SDvalue = '(//span[contains(text(),"sd")]//parent::td//following-sibling::td//input)[' + levelno + ']'
      const Pointvalue = '(//span[contains(text(),"points")]//parent::td//following-sibling::td//input)[' + levelno + ']'
      const meanvalue = element(by.xpath(MeanValue));
      const sdvalue = element(by.xpath(SDvalue));
      const pointvalue = element(by.xpath(Pointvalue));
      meanvalue.sendKeys(mean).then(function () {
        library.logStepWithScreenshot('mean value entered', 'mean value entered');
        console.log('Mean value entered');
        resolve(true);
      }).then(function () {
        sdvalue.sendKeys(sd).then(function () {
          library.logStepWithScreenshot('SD value entered', 'SD value entered');
          console.log('SD value entered');
          resolve(true);
        });
      }).then(function () {
        library.scrollToElement(pointvalue);
        pointvalue.sendKeys(points).then(function () {
          library.logStepWithScreenshot('points value entered', 'points value entered');
          console.log('points value entered');
          resolve(true);
        });
      })
    });
  }
  presenceofActivityicon() {
    library.waitForPage();
    return new Promise((resolve) => {
      let elementpresent = false;
      const icon1 = element(by.xpath(icon));
      icon1.isDisplayed().then(function () {
        elementpresent = true;
        browser.actions().mouseMove(icon1).click().perform();
        library.logStepWithScreenshot("Updated Activity icon is present", "Updated Activity icon is present");
        resolve(elementpresent);
      }).catch(function () {
        library.logStepWithScreenshot("Updated Activity icon is not present", "Updated Activity icon is not present");
        elementpresent = false;
        resolve(elementpresent);
      });;
    })
  }
  VerifyDataEntryformonTop() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const Dataentryform1 = element(by.xpath(Dataentryform));
      const Summaryform1 = element(by.xpath(Summaryform));
      Dataentryform1.isDisplayed().then(function () {
        Summaryform1.isDisplayed().then(function () {
          library.logStepWithScreenshot("Dataentry form is present above Header", "DataEntryForm");
          result = true;
          resolve(result);
        }).catch(function () {
          result = false;
          resolve(result);
        });
      }).catch(function () {
        library.logStepWithScreenshot('DataEntry from is not Displayed', 'DataEntry from is not Displayed');
        result = false;
        resolve(result);
      });
    });
  }
  VerifythepresenceofShowOptionArrow() {
    let ShowOptbtn = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const showOptionsarrow1 = element(by.xpath(showOptionsarrow));
      library.scrollToElement(showOptionsarrow1);
      showOptionsarrow1.isDisplayed().then(function () {
        library.logStepWithScreenshot('Show option arrow is present', 'Show option arrow');
        ShowOptbtn = true;
        resolve(ShowOptbtn);
      }).catch(function () {
        library.logStepWithScreenshot('Show option arrow is not present', 'Show option arrow is not present');
        ShowOptbtn = false;
        resolve(ShowOptbtn);
      });
    });
  }
  verifyEnteredComment(com) {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const commentBox = findElement(locatorType.XPATH, addComments);
      dashBoard.waitForElement();
      commentBox.isDisplayed().then(function () {
        browser.actions().mouseMove(findElement(locatorType.XPATH, addComments)).click().perform();
        result = true;
        library.logStepWithScreenshot('comment box is displayed', 'comment box displayed');
        resolve(result);
      }).catch(function () {
        library.logStepWithScreenshot('comment box is not displayed', 'comment box is not displayed');
        result = false;
        resolve(result);
      });
    });
  }
  VerifypresenceofHeaderForYear() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const Yearheader1 = element(by.xpath(yearHeader));
      const YearHeaderDiv1 = element(by.xpath(YearHeaderDiv));
      library.scrollToElement(YearHeaderDiv1);
      Yearheader1.getAttribute('class').then(function (value) {
        dashBoard.waitForElement();
        if (value.includes('analyte-date analyte-year')) {
          result = true;
          resolve(result);
          library.logStepWithScreenshot("Seperator is placed for year", "Seperator for year is present");
        } else {
          result = false;
          resolve(result);
          library.logStepWithScreenshot("Header/Seperator is not placed for year", "Header/Seperator is not placed for year");
        }
      });
    });
  }
  presenceOfLevelHeader() {
    return new Promise((resolve) => {
      const levelheader = element.all(by.xpath('//td[contains(@class,"mat-column")]//span[contains(@class,"level-label")]'));
      levelheader.then((items) => {
        for (let i = 1; i <= items.length; i++) {
          const LevelHeader = element(by.xpath('(//td[contains(@class,"mat-column")]//span[contains(@class,"level-label")])[' + i + ']'));
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
  clickonToggleArrow() {
    let result = false;
    return new Promise((resolve) => {
      const showData = element(by.xpath(showDataArrow));
      showData.isDisplayed().then(function () {
        library.scrollToElement(showData);
        library.waitForElement(showData);
        library.clickJS(showData);
        library.logStep("Showdata  toggle is clicked")
        result = true;
        resolve(result);
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
        library.logStepWithScreenshot('Submit Updates Button on Edit Dialog is clicked', 'Submit Updates Button on Edit Dialog is clicked');
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Submit Updates Button is not displayed', 'Submit Updates Button is not displayed');
        status = false;
        resolve(status);
      });
    });
  }
  verifyenterdatalinkisnotvisible() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const manualenterdatalink1 = element.all(by.xpath(manualenterdatalink));
      manualenterdatalink1.then(function (items) {
        expect(items.length).toBe(0);
        library.logStepWithScreenshot('Enter data link is not present', 'Enter data link is not present');
        result = true;
        resolve(result);
      }).catch(function () {
        result = false;
        resolve(result);
        library.logStepWithScreenshot('Enter data link is present', 'Enter data link is present');
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
  verifyDataEntryFormNC() {
    library.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      const DataentryformNC = findElement(locatorType.XPATH, Dataentryform);
      DataentryformNC.isDisplayed().then(function () {
        library.logStepWithScreenshot(' Summary DataEntryForm is displayed', 'Summary DataEntryForm');
        result = true;
        resolve(result);
      },
        function () {
          library.logStep('Summary DataEntryForm is not displayed');
          result = false;
          resolve(result);
        });
    });
  }
  ClickonDoneBtn() {
    dashBoard.waitForPage();
    let result = false;
    return new Promise((resolve) => {
      browser.actions().mouseMove(findElement(locatorType.XPATH, Donebtn)).click().perform();
      result = true;
      resolve(result);
    });
  }
}
