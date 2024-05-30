/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
const fs = require('fs');

const library = new BrowserLibrary();
const analytesListDisplayed = '//*[contains(@class,"list-item flex-container")]';
const slidegenList = '//*[@name="slidegen"]';
const slidegen = '//*[contains(@class,"mat-select-panel")]//mat-option';
const startDate = '//*[@formcontrolname="startDate"]';
const endDate = '//*[@formcontrolname="endDate"]';
const startTime = '//*[@formcontrolname="startTime"]';
const endTime = '//*[@formcontrolname="endTime"]';
const cancelBtn = '//*[text()="cancel"]';
const editBtn = '//*[text()="edit"]';
const updateBtn = '(//span[text()="update"])[1]';
const confirmBtn = '//*[text()="confirm"]';
const timeClock1 = '//*[@formcontrolname="startTime"]';
const timeClock2 = '//*[@formcontrolname="endTime"]';
const disabledAddSlidegenBtn = '//button[contains(@class,"add-slide-gen") and @disabled="true"]';
const addSlidegenBtn = '//*[contains(@class,"add-slide-gen")]//span';
const yesRadioBtn = '(//*[@value="yes"]//div[contains(@class,"mat-radio")])[1]';
const noRadioBtn = '(//*[@value="no"]//div[contains(@class,"mat-radio")])[1]';
const uploadBtn = "//*[contains(text(),'Upload')]/parent::button";

export class SlidgenSchedulerE2E {
  navigateToCategory(categoryName) {
    let flag = false;
    return new Promise((resolve) => {
      const categoryBtn = '//span[contains(text(),"' + categoryName + '")]';
      browser.wait(browser.ExpectedConditions.visibilityOf(
        (element(by.xpath(categoryBtn)))), 20000, 'Element is not Displayed');
      element(by.xpath(categoryBtn)).isDisplayed().then(function () {
        element(by.xpath(categoryBtn)).click().then(function () {
          library.logStepWithScreenshot('Clicked on - ' + categoryName, 'clicked on btn')
          library.logStep('Clicked on - ' + categoryName);
          resolve(true)
        }).catch(function () {
          library.logStepWithScreenshot('Failed : Unable to Click on - ' + categoryName, 'clicked on btn')
          library.logStep('Failed : Unable to Click on - ' + categoryName);
          resolve(false)
        })
      })
    });
  }

  verifyAnalytesDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(analytesListDisplayed)).isDisplayed().then(function () {
        console.log('Analyte list is displayed');
        library.logStepWithScreenshot('Analyte list is displayed', 'List is displayed')
        library.logStep('Analyte list is displayed');
        resolve(true)
      }).catch(function () {
        console.log('Failed : Analyte list is not displayed');
        library.logStepWithScreenshot('Failed : Analyte list is not displayed', 'List is not displayed')
        library.logStep('Failed : Analyte list is not displayed');
        resolve(false)
      })
    });
  }

  verifyAcceptedUI(analyte) {
    let count = 0;
    return new Promise((resolve) => {
      const editBtn = '//span[contains(text(),"' + analyte + '")]//parent::div//following::div//span[text()="edit"]';
      const pageUI = new Map<string, string>();
      pageUI.set(slidegenList, 'Slidegen List');
      pageUI.set(startDate, 'start Date');
      pageUI.set(endDate, 'End Date');
      pageUI.set(startTime, 'Start Time');
      pageUI.set(endTime, 'End Time');
      pageUI.set(disabledAddSlidegenBtn, 'Disabled add slidegen button');
      const editBtnElem = element(by.xpath(editBtn));
      editBtnElem.isDisplayed().then(function () {
        library.clickJS(editBtnElem);
        pageUI.forEach(function (key, value) {
          if (key == 'Slidegen List') {
            library.clickJS(element(by.xpath(value)));
            count++;
            element(by.xpath(slidegen)).isDisplayed().then(function () {
              console.log(key + 'and Slidgen are displayed');
              library.logStep(key + 'and Slidgen are displayed');
              resolve(true)
            })
          } else {
            const ele = element(by.xpath(value));
            ele.isDisplayed().then(function () {
              console.log(key + ' is displayed');
              library.logStep(key + ' is displayed');
              count++;
            }).catch(function () {
              library.logFailStep(key + ' is not displayed.');
            });
          }
        });
      }).then(function () {
        if (count === pageUI.size) {
          library.logStepWithScreenshot('Copy Instrument section UI is displayed properly', 'UIVerification');
          resolve(true);
        } else {
          library.logFailStep('Copy Instrument section UI is not displayed properly');
          resolve(false);
        }
      });
    });
  }

  clickOnEditBtn() {
    return new Promise((resolve) => {
      const editBtnEle = element(by.xpath(editBtn));
      editBtnEle.isDisplayed().then(function () {
        library.click(editBtnEle);
        element(by.xpath(slidegenList)).isDisplayed().then(function () {
          console.log('Cacnel Button is Clicked');
          library.logStep('Cancel Button is Clicked');
          resolve(true);
        }).catch(function () {
          console.log('Failed - Unable to Cancel slidgen options');
          library.logStep('Failed - Unable to Cacnel slidgen options');
          resolve(false);
        })
      });
    });
  }

  clickOnUpdateBtn() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(
        (element(by.xpath(updateBtn)))), 20000, 'Element is not Displayed');
      const updateBtnEle = element(by.xpath(updateBtn));
      updateBtnEle.isDisplayed().then(function () {
        library.click(updateBtnEle);
        if (element(by.xpath(slidegenList)).isElementPresent) {
          console.log('update Button is Clicked');
          library.logStep('update Button is Clicked');
          resolve(true);
        } else {
          console.log('Failed - Unable to click on update button');
          library.logStep('Failed - Unable to click on update button');
          resolve(false);
        }

      });
    });
  }

  clickOnCancelBtn() {
    return new Promise((resolve) => {
      const cancelBtnEle = element(by.xpath(cancelBtn));
      cancelBtnEle.isDisplayed().then(function () {
        library.click(cancelBtnEle);
        element(by.xpath(slidegenList)).isDisplayed().then(function () {
          console.log('Failed - Unable to Cancel slidgen options');
          library.logStep('Failed - Unable to Cacnel slidgen options');
          resolve(false);
        }).catch(function () {
          console.log('Cacnel Button is Clicked');
          library.logStep('Cancel Button is Clicked');
          resolve(true);
        })
      });
    });
  }

  clickOnConfirmBtn() {
    return new Promise((resolve) => {
      const confirmBtnEle = element(by.xpath(confirmBtn));
      confirmBtnEle.isDisplayed().then(function () {
        library.clickJS(confirmBtnEle);
        library.logStepWithScreenshot('Confirm Button is Clicked', 'Confirm Btn is clicked');
        console.log('Cacnel Button is Clicked');
        library.logStep('Cancel Button is Clicked');
        resolve(true);
      });
    });
  }

  clickOnAcceptBtn(val) {
    return new Promise((resolve) => {
      const acceptBtn = "(//span[contains(text(),'"+val+"')]//following::button/span[text()='accept'])[1]";
      const acceptBtnEle = element(by.xpath(acceptBtn));
      acceptBtnEle.isDisplayed().then(function () {
        library.click(acceptBtnEle);
        console.log('Accept Button is Clicked');
        library.logStep('Accept Button is Clicked');
        resolve(true);
      }).catch(function () {
        console.log('Failed - Unable to Accept slidgen analyte');
        library.logStep('Failed - Unable to Accept slidgen analyte');
        resolve(false);
      })
    });
  }

  setStartTime(time) {
    return new Promise((resolve) => {
      const clock = findElement(locatorType.XPATH, timeClock1);
      library.logStepWithScreenshot('Set time icon click.', 'timeIcon');
      clock.sendKeys(time);
      library.logStepWithScreenshot(time + ' is selected.', 'timeSet');
      resolve(true);
    });
  }

  setEndTime(time) {
    return new Promise((resolve) => {
      const clock = findElement(locatorType.XPATH, timeClock2);
      library.logStepWithScreenshot('Set time icon click.', 'timeIcon');
      clock.sendKeys(time);
      library.logStepWithScreenshot(time + ' is selected.', 'timeSet');
      resolve(true);
    });
  }

  setStartDate(y, m, d, rowNum) {
    return new Promise((resolve) => {
      const openCalendarBtn = '(//*[@formarrayname="slideGenList"]["' + rowNum + '"]//button[@aria-label="Open calendar"])[1]';
      const openCalendar = element(by.xpath(openCalendarBtn));
      library.clickJS(openCalendar);
      this.selectDate(y, m, d).then(function (Selected) {
        library.logStepWithScreenshot('Start Date is selected', 'Date selected');
        console.log('Start Date is selected');
        return (Selected)
      });
    });
  }

  setEndDate(y, m, d, rowNum) {
    return new Promise((resolve) => {
      const openCalendarBtn = '(//*[@formarrayname="slideGenList"]["' + rowNum + '"]//button[@aria-label="Open calendar"])[2]';
      const openCalendar = element(by.xpath(openCalendarBtn));
      library.clickJS(openCalendar);
      this.selectDate(y, m, d).then(function (Selected) {
        library.logStepWithScreenshot('End Date is selected', 'Date selected');
        console.log('End Date is selected');
        resolve(Selected)
      });
    });
  }

  selectDate(y, m, d) {
    return new Promise((resolve) => {
      const clickCalendarDate = '(//div[contains(@class,"mat-calendar-header")]//span[@class="mat-button-wrapper"])[1]';
      const Calendardate = element(by.xpath(clickCalendarDate));
      library.clickJS(Calendardate);
      const selectYear = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + y + '")]';
      const year = element(by.xpath(selectYear));
      library.clickJS(year);
      const selectMonth = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + m + '")]';
      const month = element(by.xpath(selectMonth));
      library.clickJS(month);
      const selectDate = '//div[contains(@class,"mat-calendar-body") and contains(text(),"' + d + '")]';
      const date = element(by.xpath(selectDate));
      library.clickJS(date);
      resolve(true);
    });
  }

  clickOnAddSlidegen() {
    return new Promise((resolve) => {
      element(by.xpath(addSlidegenBtn)).isDisplayed().then(function () {
        library.click(element(by.xpath(addSlidegenBtn)));
        library.logStepWithScreenshot('Add Slidegen Button is Clicked', 'Add Slidegen Btn is clicked');
        console.log('Add Slidegen Button is Clicked');
        library.logStep('Add Slidegen Button is Clicked');
        resolve(true);
      }).catch(function () {
        console.log('Add Slidegen Button is not displayed');
        library.logStep('Add Slidegen Button is not displayed');
        resolve(false);
      })
    });
  }

  selectSlidgenFrmList(rowNum, slidegenName) {
    return new Promise((resolve) => {
      const selectSlidgenBtnEle = element(by.xpath('(//*[@name="slidegen"])["' + rowNum + '"]'));
      selectSlidgenBtnEle.isDisplayed().then(function () {
        library.clickJS(selectSlidgenBtnEle);
        library.clickJS(element(by.xpath('//span[contains(text(),"'+slidegenName+'")]//parent::mat-option[1]')));
        library.logStepWithScreenshot(slidegenName + ' is Selected', 'Slidegen is selected');
        console.log(slidegenName + ' is Selected');
        library.logStep(slidegenName + ' is Selected');
        resolve(true);
      });
    });
  }

  selectRadioBtnYes() {
    return new Promise((resolve) => {
      const radioBtnElm = element(by.xpath(yesRadioBtn));
      library.clickJS(radioBtnElm);
      resolve(true);
    });
  }
  selectRadioBtnNo() {
    return new Promise((resolve) => {
      const radioBtnElm = element(by.xpath(noRadioBtn));
      library.clickJS(radioBtnElm);
      resolve(true);
    });
  }
  clickOnUploadBtn() {
    return new Promise((resolve) => {
      const tbdElm = element(by.xpath(uploadBtn));
      library.clickJS(tbdElm);
      resolve(true);
    });
  }


}
