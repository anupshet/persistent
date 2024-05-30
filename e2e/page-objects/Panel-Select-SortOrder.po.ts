/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { stat } from 'fs';
import { browser, By, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');



const library = new BrowserLibrary();
const AtoZButton = '//*[contains(text(),"A-Z")]/parent::button[1]';
const cancelBtn = '//*[contains(text(),"Cancel")]/parent::button[1]';
const doneBtn = '//*[contains(text(),"Done")]/parent::button[1]';

export class CustomSortOrder {


  verifyDefaultItemSorting(itemName) {
    return new Promise((resolve) => {
      let myElement;
      const originalList: Array<string> = [];
      const tempList: Array<string> = [];
      let sortedTempList = [];
      let count = 0;
      let i = 0;
      if (itemName === 'Panel') {
        myElement = '//*[text()="Panels"]//parent::div//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'Department') {
        myElement = '//*[text()="Panels"]//parent::div/parent::div/div[3]//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'Instrument' || itemName === 'Control' || itemName === 'Analyte') {
        myElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'DataTabel') {
        myElement = '//*[contains(@class,"analyte-form")]//li//*[contains(@class,"-view-component")]//div[contains(@class,"hdr-ctn ") or contains(@class,"flex-ctn ")]//span[1]';
      }


      /* const decimal = findElement(locatorType.XPATH, selectedDecimal);
      library.scrollToElement(decimal); */


      const ele = element.all(by.xpath(myElement));
      ele.each(function (eachElement) {
        // browser.wait(browser.ExpectedConditions.visibilityOf(eachElement), 10000, 'Failed : Department List is not visible');
        browser.executeScript('arguments[0].scrollIntoView(true);', eachElement);
        eachElement.getText().then(function (text) {
          text.trim();
          originalList[i] = text.toUpperCase();
          tempList[i] = text.toUpperCase();
          i++;
        });
      }).then(function () {
        sortedTempList = tempList.sort();
        for (const j in sortedTempList) {
          if (originalList[j] === sortedTempList[j]) {
            count++;
            library.logStep(originalList[i] + ' displayed.');
          } else {
            library.logStep(originalList[i] + ' not displayed.');
          }
        }
        if (count === originalList.length) {
          library.logStepWithScreenshot(itemName + ' list is Alphabetically sorted', 'sorted');
          console.log(itemName + ' - list is alphabetically sorted');
          resolve(true);
        } else {
          library.logFailStep(itemName + ' Left navigation list is not sorted');
          console.log(itemName + ' - list is not alphabetically sorted');
          resolve(false);
        }
      });
    });
  }

  clickOnSortButton(itemName) {
    let ele;
    if (itemName === 'Panel' || itemName === 'Instrument' || itemName === 'Control' || itemName === 'Analyte') {
      ele = '(//*[text()="Sort"])[1]';
    }
    if (itemName === 'Department') {
      ele = '(//*[text()="Sort"])[2]';
    }
    return new Promise((resolve) => {
      browser.executeScript('arguments[0].scrollIntoView(true);', element(by.xpath(ele)));
      library.clickJS(element(by.xpath(ele)));
      resolve(true);
    });


  }

}
