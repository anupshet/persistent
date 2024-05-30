/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { by, browser, element, protractor, utils } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const moment = require('moment');
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const duplicateLotButton = '//*[text()="DUPLICATE LOT"]//parent::button';
const duplicateLotPopUp = '//*[contains(@class,"mat-dialog-container")]';
const dupicateLotDropdown = '(//*[contains(@aria-label,"Lot Number")])[2]';
const customName = '(//*[@formcontrolname="customName"])[2]';
const submitBtn = '//*[text()="DUPLICATE"]//parent::button[1]';

const codeList = '//a[contains(text(),"Code List")]';
const manufacturer = '//a[contains(text(),"Manufacturers")]';
const addNewManfBtn = '//*[contains(text(),"Add New Manufacturer")]';
const addNewManfTextBox = '//label[contains(text(),"Manufacturer")]//following::input[1]';
const submitManfBtn = '//button[contains(text(),"Add") and @type="submit"]';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/AccountManager.json', (err, data) => {
  if (err) { throw err; }
  const accountManagerData = JSON.parse(data);
  jsonData = accountManagerData;
});

let jsonData1;
fs.readFile('./JSON_data/ActionableDashboard.json', (err, data) => {
  if (err) { throw err; }
  const actionableDashboard = JSON.parse(data);
  jsonData1 = actionableDashboard;
});

export class DuplicateLots1 {
  static labName: String;
  static firstName: string;
  static address1: String;
  static ts: String;

  ClickDuplicateLotButton() {
    return new Promise((resolve) => {
      const duplicateLotBtn = element(by.xpath(duplicateLotButton));
      duplicateLotBtn.isDisplayed().then(function () {
        library.clickJS(duplicateLotBtn);
        console.log('clicked on duplicate lot button');
        library.logStep('clicked on duplicate lot button');
      }).catch(function () {
        console.log('Failed : unable to click on duplicate lot button');
        library.logStep('Failed : unable to click on duplicate lot button');
        library.logStepWithScreenshot('Failed : unable to click on duplicate lot button', 'DuplicateLotBtnNotClicked');
        resolve(false);
      });
    });
  }

  VerifyDuplicateLotsPopupUI() {
    return new Promise((resolve) => {
      const duplicateLotPopUpEnt = element(by.xpath(duplicateLotPopUp));
      duplicateLotPopUpEnt.isDisplayed().then(function () {
        element(by.xpath(dupicateLotDropdown)).isDisplayed().then(function () {
          element(by.xpath(customName)).isDisplayed().then(function () {
            element(by.xpath(submitBtn)).isDisplayed().then(function () {
              console.log('Duplicate Lot Pop up is displayed');
              library.logStep('Duplicate Lot Pop up is displayed');
              library.logStepWithScreenshot('Duplicate Lot Pop up is displayed', 'Popup Diplayed');
              resolve(true);
            }).catch(function () {
              console.log('Failed : Submit button is not displayed');
              library.logStep('Failed : Submit button is not displayed');
              library.logStepWithScreenshot('Failed : Submit button is not displayed', 'submitBtnNotDiplayed');
              resolve(false);
            });
          }).catch(function () {
            console.log('Failed : Custome Name option is not displayed');
            library.logStep('Failed : Custome Name option is not displayed');
            library.logStepWithScreenshot('Failed : Custome Name option is not displayed', 'customnNameNotDiplayed');
            resolve(false);
          });
        }).catch(function () {
          console.log('Failed : Duplcate Lot dropdown is not displayed');
          library.logStep('Failed : Duplcate Lot dropdown is not displayed');
          library.logStepWithScreenshot('Failed : Duplcate Lot dropdown is not displayed', 'dropdownNotDisplayed');
          resolve(false);
        });
      });
    });
  }

  VerifyDuplicateLotBtnDisplayed() {
    return new Promise((resolve) => {
      const duplicateLotBtn = element(by.xpath(duplicateLotButton));
      duplicateLotBtn.isDisplayed().then(function () {
        console.log('Duplicate Lot Button is displayed');
        library.logStep('Duplicate Lot Button is displayed');
        library.logStepWithScreenshot('Duplicate Lot Button is displayed', 'DuplicateLotBtnDisplayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Duplicate Lot Button is displayed');
        library.logStep('Failed : Duplicate Lot Button is displayed');
        library.logStepWithScreenshot('Failed : Duplicate Lot Button is displayed', 'DuplicateLotBtnNotDisplayed');
        resolve(false);
      });
    });
  }

  testQCPAddManufacturer() {
    return new Promise((resolve) => {
      element(by.xpath(codeList)).isDisplayed().then(function () {
        element(by.xpath(codeList)).click();
        element(by.xpath(manufacturer)).isDisplayed().then(function () {
          element(by.xpath(manufacturer)).click();
          element(by.xpath(addNewManfBtn)).isDisplayed().then(function () {
            element(by.xpath(addNewManfBtn)).click();
            element(by.xpath(addNewManfTextBox)).isDisplayed().then(function () {
              // element(by.xpath(addNewManfTextBox)).click();
              element(by.xpath(addNewManfTextBox)).sendKeys('Test QCP');
              element(by.xpath(submitManfBtn)).isDisplayed().then(function () {
                element(by.xpath(submitManfBtn)).click();
                resolve(true);
              });
            });
          });
        });
      });

    });
  }

}
