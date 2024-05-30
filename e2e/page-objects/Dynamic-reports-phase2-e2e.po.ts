/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { by, browser, element, ElementFinder } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
import { resolve } from 'dns';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const reportsIcon = './/button[@class="mat-focus-indicator mr-40 grey mat-icon-button mat-button-base"]';
const Cancelbtn='.//button/span[contains(text(), " Cancel ")]'
export class DynamicReportsPhase2 {
  static navigateTO: any;

  clickOnReportsIcon() {
    return new Promise((resolve) => {
      
      const ReportsIconButton = element(by.xpath(reportsIcon));
      dashBoard.waitForPage();
      ReportsIconButton.isDisplayed().then(function () {
        library.logStep("Reports Icon Displayed");
        library.clickJS(ReportsIconButton);
        library.logStep("Clicked on reports Icon");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Reports icon is not displayed")
        resolve(false)
      })
    });
  }
  clickOnCancelbtn() {
    return new Promise((resolve) => {    
      const clickOnCancelbtn = element(by.xpath(Cancelbtn));
      dashBoard.waitForPage();
      clickOnCancelbtn.isDisplayed().then(function () {
        library.logStep("Cancel button is displayed");
        library.clickJS(clickOnCancelbtn);
        library.logStep("Cancel button is Clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Cancel button is not clicked")
        resolve(false)
      })
    });
  }
}

