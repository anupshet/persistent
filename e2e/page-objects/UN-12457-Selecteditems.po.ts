/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { by, browser, element, ElementFinder } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
import { resolve } from 'dns';
import { Department } from 'src/app/contracts/models/lab-setup';
import { departmentName } from 'src/app/core/config/constants/general.const';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const reportsIcon = './html/body/unext-root/unext-nav-bar-top/div[2]/div/unext-nav-header/div/div[2]/div[1]/button';
const Clearselection = './/*[contains(text()," CLEAR SELECTION ")]';
const Clearconfirm = './/*[contains(text()," continue ")]'
const Selecteditemstray = './/*[contains(text()," SELECTED ITEMS ")]'
const InstrumentTab = './/*[@id="mat-tab-label-1-1"]'
const ControlTab = './/*[@id="mat-tab-label-1-2"]'
const AnalyteTab = './/*[@id="mat-tab-label-1-3"]'
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

  DeptCheckbox(deptName) {
    return new Promise((resolve) => {
      // const MarkCheckbox1 = './/*[contains(text(),"' + deptName + '")]';
      const MarkdeptCheckbox = element(by.xpath("//*[contains(text(),'"+deptName+"')]"));
      dashBoard.waitForPage();
      MarkdeptCheckbox.isDisplayed().then(function () {
        library.logStep("Dept checkbox is Displayed");
        library.clickJS(MarkdeptCheckbox);
        library.logStep("Clicked on dept Checkbox");
        resolve(true);
      }).catch(function () {
        library.logFailStep("dept Checkbox is not displayed")
        resolve(false)
      })
    });
  }

  InstCheckbox(InstName) {
    return new Promise((resolve) => {
      const MarkinstCheckbox = element(by.xpath("//*[contains(text(),'"+InstName+"')]"));
      dashBoard.waitForPage();
      MarkinstCheckbox.isDisplayed().then(function () {
        library.logStep("Instrument checkbox is Displayed");
        library.clickJS(MarkinstCheckbox);
        library.logStep("Clicked on Instrument Checkbox");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Instrument Checkbox is not displayed")
        resolve(false)
      })
    });
  }

  CtrlCheckbox(CtrlName) {
    return new Promise((resolve) => {
      const MarkCtrlCheckbox = element(by.xpath("//*[contains(text(),'"+CtrlName+"')]"));
      dashBoard.waitForPage();
      MarkCtrlCheckbox.isDisplayed().then(function () {
        library.logStep("Control checkbox1 is Displayed");
        library.clickJS(MarkCtrlCheckbox);
        library.logStep("Clicked on Control Checkbox1");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Control Checkbox is not displayed")
        resolve(false)
      })
    });
  }
  clickOnClearselection() {
    return new Promise((resolve) => {
      const Clearselectionbutton = element(by.xpath(Clearselection));
      dashBoard.waitForPage();
      Clearselectionbutton.isDisplayed().then(function () {
        library.logStep("Clear selection is Displayed");
        library.clickJS(Clearselectionbutton);
        library.logStep("Clicked on Clear selection");
        resolve(true);
      })
      const ClearselectionConfirm = element(by.xpath(Clearconfirm));
      dashBoard.waitForPage();
      ClearselectionConfirm.isDisplayed().then(function () {
        library.logStep("Clear selection confirmation is Displayed");
        library.clickJS(ClearselectionConfirm);
        library.logStep("Clicked on Confirm Clear selection");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Clear select confirmation is not displayed")
        resolve(false)
      })
    });
  }
  
  clickOnSelecteditems() {
    return new Promise((resolve) => {
      const Selecteditems = element(by.xpath(Selecteditemstray));
      dashBoard.waitForPage();
      Selecteditems.isDisplayed().then(function () {
        library.logStep("Selected Items tray Displayed");
        library.clickJS(Selecteditems);
        library.logStep("Clicked on Selected Items");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Selected Items is not displayed")
        resolve(false)
      })
    });
  }


  clickOnInsttab() {
    return new Promise((resolve) => {
      const InstTab = element(by.xpath(InstrumentTab));
      dashBoard.waitForPage();
      InstTab.isDisplayed().then(function () {
        library.logStep("Instrument tab Displayed");
        library.clickJS(InstTab);
        library.logStep("Clicked on Instrument tab");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Instrument tab is not displayed")
        resolve(false)
      })
    });
  }
  
  clickOnCtrltab() {
    return new Promise((resolve) => {
      const CtrlTab = element(by.xpath(ControlTab));
      dashBoard.waitForPage();
      CtrlTab.isDisplayed().then(function () {
        library.logStep("Control tab Displayed");
        library.clickJS(CtrlTab);
        library.logStep("Clicked on Control tab");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Control tab is not displayed")
        resolve(false)
      })
    });
  }
  
  clickOnAnalytetab() {
    return new Promise((resolve) => {
      const AnlyteTab = element(by.xpath(AnalyteTab));
      dashBoard.waitForPage();
      AnlyteTab.isDisplayed().then(function () {
        library.logStep("Analyte tab Displayed");
        library.clickJS(AnlyteTab);
        library.logStep("Clicked on Analyte tab");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Analyte tab is not displayed")
        resolve(false)
      })
    });
  }
  
  verifySelectedItems() {
    return new Promise(resolve => {
      let flag = false;
      const Selecteditems = element(by.xpath(Selecteditemstray));
      Selecteditems.getText().then(function (text) { });
      if (Selecteditems.isDisplayed) {
        flag = true;
        library.logStep('Selected Items UI is verified');
        resolve(flag);
      }
    });
  }
}

