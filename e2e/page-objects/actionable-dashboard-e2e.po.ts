/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/ActionableDashboard.json', (err, data) => {
  if (err) { throw err; }
  const actionableDashboard = JSON.parse(data);
  jsonData = actionableDashboard;
});

const dashboardBackBtn = '/html/body/unext-root/unext-nav-bar/div/div[1]/h1';
const modalEle = './/mat-dialog-container[contains(@id, "mat-dialog")]';
const lotChangesModalTitleOptions = './/p[contains(text(), "Provide a new lot for ")]';

const lotChangeModalDropDown = './/span[contains(text(), "Lot number")]';
const lotChangeModalInstrumentInfo = './/label[@for =  "instrumentInfo"]';
const lotChangeModalInstrumentCheckBoxLabel = './/mat-checkbox[contains(@id ,"mat-checkbox-")]';
const lotChangeModalSingleInstrumentLabel = './/label[contains(@id ,"singleInstrument")]';
const lotChangeModalCancelBtn = './/span[contains(text() ,"Cancel")]';
const lotChangeModalCloseBtn = '(.//button[@aria-label = "Close dialog"])[1]';
const lotChangeModalChangeLotBtn = './/span[contains(text() ," Change Lot")]';
const emptyLots = '//h2[contains(text(), "You\'re all caught up on action items.")]';
const lotNumber = './/span[contains(text(), "Lot number")]';
const selectlotValueFromDropdown = '(//span[@class="mat-option-text"])[1]';

const labSetupCardById = 'LoginComponent.LabSetup';
const zoomout = 'zoomOut';
const formProdLotDdl = './/mat-select[@id = "productLotSelect"]';
const expiredLotsCard = '//mat-card//mat-card-title//h2';
const QCLotViewerPresent = '//mat-card//div[@class="card-content"]';

export class ActionableDashboard {
  /**
   * NOT SURE TO DELETE THIS CODE OR NOT
   * */

  // expiringLotsCardContent() {
  // const selectlotValueFromDropdownValue = '(span[@class="mat-option-text"])[1]';
  // const licenseCardTitle = './/h2[contains(text(), "license")]';
  // const licenseCardExpirigRemainingDays = './/h2[contains(text(), "license")]/ancestor::mat-card-title/following-sibling::mat-card-subtitle/span';
  // const licenseCardExpiringDateEle = './/unext-expiring-license-panel/div/mat-card/div/p';
  // const licenseCardInfoEle = './/h2[contains(text(), "license")]/ancestor::mat-card-title/following-sibling::strong';
  // const actDashboardSection = './/div[@class = "actionable-dashboard-component"]';
  // const lotCardTitle = './/h2[contains(text(), "Expiring lots")]';
  // const lotCardExpiringCount = './/h2[contains(text(), "lots")]/ancestor::mat-card-title/following-sibling::mat-card-subtitle/span';
  // const lotCardExpiringDateFirstEle = '(.//span[contains(@class, "when warn")])[1]';
  // const lotCardExpringProdNameFirstEle = '(.//span[contains(@class, "link-text")])[1]';
  // const lotCardExpiringProdNameAll = './/span[contains(@class, "link-text")]';
  //const lotChangesModalTitleNoOptions = '';

  //   let title, lotNum, expDate, expProdName, displayed = false;
  //   return new Promise((resolve) => {
  //     const cardTitle = element(by.xpath(lotCardTitle));
  //     const numberOfLots = element(by.xpath(lotCardExpiringCount));
  //     const expiringDate = element(by.xpath(lotCardExpiringDateFirstEle));
  //     const expiringProdName = element(by.xpath(lotCardExpringProdNameFirstEle));
  //     cardTitle.isDisplayed().then(function () {
  //       title = true;
  //     });
  //     numberOfLots.isDisplayed().then(function () {
  //       numberOfLots.getText().then(function (lotCount) {
  //         element.all(by.xpath(lotCardExpiringProdNameAll)).count().then(function (count) {
  //           if (lotCount === count) {
  //             lotNum = true;
  //           }
  //         });
  //       });
  //     });
  //     expiringDate.isDisplayed().then(function () {
  //       expDate = true;
  //     });
  //     expiringProdName.isDisplayed().then(function () {
  //       expProdName = true;
  //     });
  //     if (title && lotNum && expDate && expProdName === true) {
  //       displayed = true;
  //       resolve(displayed);
  //     }
  //   });
  // }

  // expiringLicenseCardContent() {
  //   let title, daysRemaining, expDate, expInfoMessage, displayed = false;
  //   return new Promise((resolve) => {
  //     const cardTitle = element(by.xpath(licenseCardTitle));
  //     const numberOfDaysRemaining = element(by.xpath(licenseCardExpirigRemainingDays));
  //     const expiringDate = element(by.xpath(licenseCardExpiringDateEle));
  //     const infoEle = element(by.xpath(licenseCardInfoEle));
  //     cardTitle.isDisplayed().then(function (status2) {
  //       cardTitle.getText().then(function (titletext) {
  //         console.log('Card Title Displayed: ' + titletext);
  //         console.log('cardTitle: ' + status2);
  //         title = true;
  //       });
  //     });
  //     numberOfDaysRemaining.isDisplayed().then(function () {
  //       numberOfDaysRemaining.getText().then(function (tempActRemaining) {
  //         expiringDate.getText().then(function (textDisp) {
  //           const actRemainingDays = parseInt(tempActRemaining.trim(), 10);
  //           const dayMonText = textDisp.substr(8);
  //           const temp = dayMonText.split(' ');
  //           const monthDispayed = temp[0];
  //           const days = temp[1];
  //           const expectedDaysRemaining = ActionableDashboard.expiringLicenseDateToDays(days, monthDispayed);
  //           if (actRemainingDays === expectedDaysRemaining) {
  //             daysRemaining = true;
  //           } else {
  //             daysRemaining = false;
  //           }
  //         });
  //       });
  //     });
  //     expiringDate.isDisplayed().then(function () {
  //       expDate = true;
  //     });
  //     infoEle.isDisplayed().then(function () {
  //       expInfoMessage = true;
  //       if (title && daysRemaining && expDate && expInfoMessage === true) {
  //         displayed = true;
  //         resolve(displayed);
  //       } else {
  //         displayed = false;
  //         resolve(displayed);
  //       }
  //     });
  //   });
  // }

  // static expiringLicenseDateToDays(day, mon) {
  //   const date = new Date();
  //   const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const expMon = (month.indexOf(mon)) + 1;
  //   const currMon = (date.getMonth()) + 1;
  //   const todaysDay = date.getDate();
  //   const yyyy = date.getFullYear();
  //   const actDayDisp = day;
  //   const d1 = currMon + '/' + todaysDay + '/' + yyyy;
  //   const atodayD = moment(d1, 'MM/DD/YYYY');
  //   const d2 = expMon + '/' + actDayDisp + '/' + yyyy;
  //   const bexpiryD = moment(d2, 'MM/DD/YYYY');
  //   const diffDays = (bexpiryD.diff(atodayD, 'days')) + 1;
  //   return diffDays;
  // }

  clickOnProductNameOnExpiringLotCard(prodName) {
    let clicked = false;
    return new Promise((resolve) => {
      const expiringProdName = element(by.xpath('.//span[contains(text(),"' + prodName + '")]'));
      expiringProdName.click().then(function () {
        dashBoard.waitForElement();
        clicked = true;
        resolve(clicked);
      });
    });
  }

  isModalDisplayed() {
    let displayed = false;
    return new Promise((resolve) => {
      const modal = element(by.xpath(modalEle));
      modal.isDisplayed().then(function () {
        displayed = true;
        resolve(displayed);
      });
    });
  }

  isModalClosed() {
    let closed = false;
    return new Promise((resolve) => {
      const modal = element(by.xpath(modalEle));
      modal.isDisplayed().then(function () {
        closed = false;
        resolve(closed);
      }).catch(function () {
        closed = true;
        resolve(closed);
      });
    });
  }

  lotChangesModalDialogContentsWithOptions() {
    let titleDisp, dropDown, instrumentName, cancelBtn, closeBtn, changeLotBtn, displayed = false;
    return new Promise((resolve) => {
      const titleEle = element(by.xpath(lotChangesModalTitleOptions));
      const ddlEle = element(by.xpath(lotChangeModalDropDown));
      const instrumentInfo = element(by.xpath(lotChangeModalInstrumentInfo));
      const cancelBtnEle = element(by.xpath(lotChangeModalCancelBtn));
      const closeBtnEle = element(by.xpath(lotChangeModalCloseBtn));
      const changeLotBtnEle = element(by.xpath(lotChangeModalChangeLotBtn));
      dashBoard.waitForElement();
      dashBoard.waitForElement();
      dashBoard.waitForElement();
      dashBoard.waitForElement();
      titleEle.isDisplayed().then(function () {
        titleDisp = true;
      });
      ddlEle.isDisplayed().then(function () {
        dropDown = true;
      });
      instrumentInfo.getText().then(function (info) {
        if (info = 'On:') {
          const singleInstrument = element(by.xpath(lotChangeModalSingleInstrumentLabel));
          singleInstrument.isDisplayed().then(function () {
            instrumentName = true;
          });
        } else if (info = 'On these instruments: ') {
          const multipleInstruments = element(by.xpath(lotChangeModalInstrumentCheckBoxLabel));
          multipleInstruments.isDisplayed().then(function () {
            instrumentName = true;
          });
        } else {
          instrumentName = false;
        }
      });
      cancelBtnEle.isDisplayed().then(function () {
        cancelBtn = true;
      });
      closeBtnEle.isDisplayed().then(function () {
        closeBtn = true;
      });
      changeLotBtnEle.isDisplayed().then(function () {
        changeLotBtn = true;
      });
      if (titleDisp && dropDown && instrumentName && cancelBtn && closeBtn && changeLotBtn === true) {
        displayed = true;
        resolve(displayed);
      }
    });
  }

  CloselotChangesModalDialog() {
    let closed = false;
    return new Promise((resolve) => {
      const closeBtnEle = element(by.xpath(lotChangeModalCloseBtn));
      library.click(closeBtnEle);
      closed = true;
      resolve(closed);
    });
  }

  lotChangesDialogSelctLotValueFromDropdown(newLotVal) {
    let selectVal = false;
    return new Promise((resolve) => {
      const clickOnlotnumberDdl = element(by.xpath(lotNumber));
      library.click(clickOnlotnumberDdl);
      const selectLotValue = element(by.xpath('.//span[contains(text(), "' + newLotVal + '")]'));
      library.click(selectLotValue);
      selectVal = true;
      resolve(selectVal);
    });
  }

  lotChangesDialogClickOnChangeLotBtn() {
    let clicked = false;
    return new Promise((resolve) => {
      const changelotBtn = element(by.xpath(lotChangeModalChangeLotBtn));
      library.click(changelotBtn);
      dashBoard.waitForElement();
      clicked = true;
      resolve(clicked);
    });
  }

  navigateToLabSetupPage() {
    let navigated = false;
    return new Promise((resolve) => {
      const labsetupCard = element(by.id(labSetupCardById));
      library.scrollToElement(labsetupCard);
      library.click(labsetupCard);
      dashBoard.waitForElement();
      browser.sleep(40000);
      navigated = true;
      resolve(navigated);
    });
  }

  verifyLabSetupPageForChangedLot(prodName, newLotVal) {
    let verified = false;
    return new Promise((resolve) => {
      element(by.id(zoomout)).click().then(function () {
        dashBoard.waitForElement();
      });
      element(by.id(zoomout)).click().then(function () {
        dashBoard.waitForElement();
      });
      element(by.id(zoomout)).click().then(function () {
        dashBoard.waitForElement();
      });
      const prodNamePill = element(by.xpath('.//*[contains(text(), "' + prodName + '")]'));
      library.click(prodNamePill);
      dashBoard.waitForElement();
      const selectLotDdlForm = element(by.xpath(formProdLotDdl));
      selectLotDdlForm.getText().then(function (lotText) {
        const lotNum = lotText.substr(0, 5);
        if (lotNum === newLotVal) {
          verified = true;
          resolve(verified);
        }
      });
    });
  }

  CanclelotChangesModalDialog() {
    let cancel = false;
    return new Promise((resolve) => {
      const closeBtnEle = element(by.xpath(lotChangeModalCancelBtn));
      library.click(closeBtnEle);
      cancel = true;
      resolve(cancel);
    });
  }

  VerifyEmptyLotMessage() {
    let empty = false;
    return new Promise((resolve) => {
      const expEmptyMsg = jsonData.expEmptyMessage;
      const modal = element(by.xpath(emptyLots));
      modal.isDisplayed().then(function (actualEmtMsg) {
        if (actualEmtMsg === expEmptyMsg) {
          empty = true;
          resolve(empty);
        }
      });
    });
  }

  SelctLotValueFromDropdown() {
    let value = false;
    return new Promise((resolve) => {
      const clickOnlotnumber = element(by.xpath(lotNumber));
      clickOnlotnumber.click();
      const selectLotValue = element(by.xpath(selectlotValueFromDropdown));
      selectLotValue.click();
      value = true;
      resolve(value);
    });
  }

  waitForPageToLoad() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      browser.waitForAngular();
      console.log('In waitForPageToLoad ');
      status = true;
      resolve(status);
    });
  }

  backToDashboard() {
    let navigated = false;
    return new Promise((resolve) => {
      console.log('Browser sleep done');
      const dashboardBackBtnEle = element(by.xpath(dashboardBackBtn));
      dashboardBackBtnEle.click().then(function () {
        console.log('In Back To Dashboard');
        browser.sleep(5000);
        navigated = true;
        resolve(navigated);
      });
    });
  }

  gotoDashboardUrl() {
    let navigated = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      console.log('Browser sleep done');
      browser.get('http://localhost:4200/dashboard');
      navigated = true;
      resolve(true);
    });
  }
  verifyControlChanged(lot) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const ele = ' //span[contains(@class,"mat-small") and contains(text(),"' + lot + '")]';
      const elem = element(by.xpath(ele));
      elem.isPresent().then(
        function () {
          library.logStepWithScreenshot('Lot has been changed Successfully', 'Lot Changed');
          status = true;
          resolve(status);
        }, function () {
          library.logStepWithScreenshot('Lot has not changed', 'Lot not Changed');
          status = false;
          resolve(status);
        });
    });
  }
  verifyExpiringLotCards() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const expiredLot = element(by.xpath(expiredLotsCard));
      expiredLot.isDisplayed().then(function () {
        library.logStepWithScreenshot('Expired Lots Card is Present ', 'Expired Lots Card Present');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('Expired Lots Card is not Present ', 'Expired Lots Card Not Present');
        status = false;
        resolve(status);
      });
    });
  }
  verifyQcLotViewer() {
    let status = false;
    return new Promise((resolve) => {
      const QCLotViewer = element(by.xpath(QCLotViewerPresent));
      QCLotViewer.isDisplayed().then(function () {
        library.logStepWithScreenshot('QC Lot Viewer is Present', 'QC Lot Viewer Present');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot('QC Lot Viewer is not Present', 'QC Lot Viewer Not Present');
        status = true;
        resolve(status);
      })
    })
  }
}
