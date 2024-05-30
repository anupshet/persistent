/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const tbxTaskDescription = './/input[@id="inputSearch0"]';
const endDateColHead = './/thead/tr/th[contains(text(), "End date")]';
const firstCol = './/tbody/tr/td[1]';

export class UnityDataSync {
searchTaskDescription(taskToBeSearched) {
  let flag = false;
  return new Promise((resolve) => {
    console.log('Method Task Search: ' + taskToBeSearched);
    const inputBoxTaskDescription = element(by.xpath(tbxTaskDescription));
    inputBoxTaskDescription.isDisplayed().then(function() {
      inputBoxTaskDescription.clear();
      inputBoxTaskDescription.sendKeys(taskToBeSearched);
      console.log('Task Description to be Searhed: ' + taskToBeSearched);
      library.logStep('Task Description to be Searhed: ' + taskToBeSearched);
      library.logStepWithScreenshot('searchTaskDescription', 'searchTaskDescription');
      flag = true;
      resolve(flag);
    }).catch(function() {
      console.log('Table is not loaded');
      library.logStep('Table is not loaded');
      flag = false;
      resolve(flag);
    });
  });
}

sortEndDate(sortType) {
  let flag = false;
  return new Promise((resolve) => {
    const endDateEle = element(by.xpath(endDateColHead));
    browser.executeScript('arguments[0].scrollIntoView();', endDateEle);
    endDateEle.getAttribute('aria-sort').then(function(text) {
      if (sortType === 'Ascending') {
        if (text.includes('descending')) {
          library.clickJS(endDateEle);
          console.log('End Date Sorted Ascending');
          library.logStep('End Date Sorted Ascending');
          flag = true;
          resolve(flag);
        } else {
          console.log('End Date is already sorted in Ascending order');
          library.logStep('End Date is already sorted in Ascending order');
          flag = true;
          resolve(flag);
        }
      } else if (sortType === 'Descending') {
        if (text.includes('ascending')) {
          library.clickJS(endDateEle);
          console.log('End Date Sorted Descending');
          library.logStep('End Date Sorted Descending');
          flag = true;
          resolve(flag);
        } else {
          console.log('End Date is already sorted in Descending order');
          library.logStep('End Date is already sorted in Descending order');
          flag = true;
          resolve(flag);
        }
      }
    }).catch(function() {
      console.log('End Date not displayed');
      library.logStep('End Date not displayed');
      flag = false;
      resolve(flag);
    });
  });
}

isTaskDisplayedForImport(analyteId, MethodId, Instrumentid, ReagentId) {
  let flag, found = false;
  let rowCount = 0;
  return new Promise((resolve) => {
    const dataInTable = element(by.xpath(firstCol));
    element.all(by.xpath(firstCol)).count().then(function(count) {
      rowCount = count;
    }).then(function() {
      dataInTable.getText().then(function(text) {
        if (text !== '') {
            let i = 1;
            do {
            const dataEle = element(by.xpath('.//tbody/tr[' + i + ']/td[1]'));
            dataEle.getText().then(function(textFound) {
              if (textFound.includes(analyteId) && textFound.includes(MethodId) &&
              textFound.includes(Instrumentid) && textFound.includes(ReagentId)) {
                console.log('Sync Job Found');
                library.logStep('Sync Job Found');
                library.logStepWithScreenshot('Sync Job Displayed', 'Sync Job Displayed');
                found = true;
              }
            });
            i++;
          } while ( i <= rowCount);
        } else {
          console.log('Table is  Empty, Job not found');
          library.logStep('Table is  Empty, Job not found');
          found = false;
        }
      });
    }).then(function() {
      if (found === true) {
        console.log('Sync Job Found');
        library.logStep('Sync Job Found');
        library.logStepWithScreenshot('Sync Job Displayed', 'Sync Job Displayed');
        flag = true;
        resolve(flag);
      } else {
        console.log('Sync not Job Found');
        library.logStep('Sync Job not Found');
        library.logStepWithScreenshot('Sync Job not Displayed', 'Sync not Job Displayed');
        flag = false;
        resolve(flag);
      }
    });
  });
}

waitForSycnJobToBeAdded() {
  let flag = false;
  return new Promise((resolve) => {
    browser.sleep(100000);
      flag = true;
      resolve(flag);
  });
}
}
