/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, protractor, WebElement } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
const library = new BrowserLibrary();
const fs = require('fs');
const lotViewerCard = '//mat-card-title/h4[contains(text(),"QC lot viewer")]';
const lotViewerWindow = '//unext-lotviewer-dialog//div[@id="pbi-report"]';
const logoutUname = 'navBarUserNameText';
const logOut = '//span[contains(text(),"Logout")]';
const table = '//transform//visual-modern//div[@title="Catalog#"]';
const cardQCLotViewer = 'mat-card';
const soldToNameDropdown = '//transform//visual-modern//div[contains(@aria-label, "Sold to Name")]';
const shipToNameDropdown = '//transform//visual-modern//div[contains(@aria-label, "Ship to Name")]';
const powerBIFrame = 'iframe';
const firstRowInTable = '//div[@class="rowHeaders"]';

const Ec = protractor.ExpectedConditions;
let jsonData;
fs.readFile('./JSON_data/LogOut.json', (err, data) => {
  if (err) { throw err; }
  const logoutData = JSON.parse(data);
  jsonData = logoutData;
});

export class QCLotViewer {
  clickQCLotViewerCard() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(40000);
      const lotviewercardElement = element(by.xpath(lotViewerCard));
      library.clickJS(lotviewercardElement);
      browser.sleep(8000);
      library.logStepWithScreenshot('QC lot viewer card clicked', 'lotViewer');
      flag = true;
      resolve(flag);
    });
  }

  verifyLotViewerWindow() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const lotviewerWndElement = element(by.xpath(lotViewerWindow));
      if (lotviewerWndElement.isDisplayed()) {
        library.logStepWithScreenshot('QC lot viewer Window displayed', 'lotViewer');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('QC lot viewer Window displayed');
        flag = false;
        resolve(flag);
      }
    });
  }
  closeLotViewerWindow() {
    let flag = false;
    return new Promise((resolve) => {
      browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
      library.logStep('Esc key pressed');
      console.log('Esc key pressed');
      browser.sleep(2000);
      const lotviewercardElement = element(by.xpath(lotViewerCard));

      if (lotviewercardElement.isDisplayed()) {
        flag = true;
        library.logStepWithScreenshot('Lot viewer window closed', 'windowclosed');
        resolve(flag);
      } else {
        flag = true;
        library.logFailStep('Lot viewer window not closed');
        resolve(flag);
      }
    });
  }
  logout() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const logout = element(by.id(logoutUname));
      library.clickJS(logout);
      browser.sleep(2000);
      const signOut = element(by.xpath(logOut));
      library.clickJS(signOut);
      library.logStepWithScreenshot('User Signout successfully', 'logout');
      flag = true;
      resolve(flag);
    });
  }
  verifyLotDetailsTableDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(10000);
      browser.switchTo().frame(element(by.tagName('iframe')).getWebElement());
      console.log('Switched to iframe');
      const dataTable = element(by.xpath(table));
      if (dataTable.isDisplayed()) {
        flag = true;
        browser.switchTo().defaultContent();
        library.logStepWithScreenshot('Power BI data table displayed', 'dataTable');
        resolve(flag);
      } else {
        flag = false;
        browser.switchTo().defaultContent();
        library.logStepWithScreenshot('Power BI data table is not displayed', 'dataTable');
        resolve(flag);
      }
    });
  }

  verifyQCLotViewerCardDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(4000);
      const card = element(by.tagName(cardQCLotViewer));
      card.isDisplayed().then(function () {
        flag = true;
        resolve(flag);
      }).catch(function () {
        flag = false;
        resolve(flag);
      });
    });
  }

  verifySoldToShipToDropdowns() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(30000);
      const powerBI: WebElement = element(by.tagName(powerBIFrame)).getWebElement();
      browser.switchTo().frame(powerBI);
      const soldTo = element(by.xpath(soldToNameDropdown));
      const shipTo = element(by.xpath(shipToNameDropdown));
      soldTo.isDisplayed().then(function () {
        library.logStep('Sold to Name dropdown is displayed');
        shipTo.isDisplayed().then(function () {
          library.logStep('Ship to Name dropdown is displayed');
          library.logStepWithScreenshot('Sold to Name & Ship to Name dropdowns displayed to Sales User', 'dropdownsDisplayed');
          flag = true;
          resolve(flag);
        });
      }).catch(function () {
        library.logFailStep('Sold to Name or Ship to Name dropdown is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickSoldToDropdown() {
    let flag = false;
    return new Promise((resolve) => {
      const soldTo = element(by.xpath(soldToNameDropdown));
      soldTo.isDisplayed().then(function () {
        soldTo.click();
        library.logStepWithScreenshot('Sold To Name dropdown clicked', 'soldToClicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickShipToDropdown() {
    let flag = false;
    return new Promise((resolve) => {
      const shipTo = element(by.xpath(shipToNameDropdown));
      shipTo.isDisplayed().then(function () {
        shipTo.click();
        library.logStepWithScreenshot('Ship To Name dropdown clicked', 'shipToClicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  selectSoldToFromDropdown() {
    let flag = false;
    return new Promise((resolve) => {
      const soldTo = element(by.xpath('//div[contains(@class,"slicer-dropdown-popup")][contains(@style,"block")]//div[@role="radio"][1]'));
      soldTo.isDisplayed().then(function () {
        soldTo.click();
        library.logStepWithScreenshot('Value selected from SoldTo dropdown', 'soldToValueSelected');
        flag = true;
        resolve(flag);
      });
    });
  }

  selectShipToFromDropdown() {
    let flag = false;
    return new Promise((resolve) => {
      const soldTo = element(by.xpath('//div[contains(@class,"slicer-dropdown-popup")][contains(@style,"block")]//div[@role="radio"][1]'));
      soldTo.isDisplayed().then(function () {
        soldTo.click();
        library.logStepWithScreenshot('Value selected from ShipTo dropdown', 'shipToValueSelected');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyFirstRowInTable() {
    let flag = false;
    return new Promise((resolve) => {
      const dataRow = element(by.xpath(firstRowInTable));
      dataRow.isDisplayed().then(function () {
        library.logStepWithScreenshot('Data Exists in the Table', 'tableData');
        browser.switchTo().defaultContent();
        flag = true;
        resolve(flag);
      });
    });
  }
}
