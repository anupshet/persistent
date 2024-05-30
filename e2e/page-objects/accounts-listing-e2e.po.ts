/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { by, browser, element, ElementFinder } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const locationTab = '//div[@role="tab"]/div[text()="LOCATIONS"]';
const locationHeaders = '//mat-header-row//span';
const rowsOnPage = '//mat-row';
const nextButton = '//button[@class="mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary"]';
const prevButton = '//button[@class="mat-focus-indicator pagination-button spec-prev-button mat-stroked-button mat-button-base mat-primary"]'
const noOfPagesButton = '//div[@class="ng-star-inserted"]/button';
const lastPage = '(//div[@class="ng-star-inserted"]/button)[last()]';
const firstPage = '(//div[@class="ng-star-inserted"]/button)[1]';
const prevButtonDisabled = '//button[@class="mat-focus-indicator pagination-button spec-prev-button mat-stroked-button mat-button-base mat-primary selected disable-button"]';
const lastButtonDisabled = '//button[@class="mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary selected disable-button"]'
const firstPageCss = '.custom-pagination > div:nth-of-type(1) .mat-button-wrapper';
const catagoryDD = ".//div/mat-select";
const keywordInputBox = "//input[@id='accounts-field' or contains(@class,'input-element')]";
const searchBtn = "//span[.='Search' or contains(text(),'Search')]";
const resetBtnXpath = './/button/span/span[contains(text(),"Reset")]';

export class AccountsListing {
  clickOnLocationTab() {
    return new Promise((resolve) => {
      const eleLocator1: ElementFinder = element(by.xpath(locationTab));
      const isDisplayed = library.isElementPresent(eleLocator1);
      if (isDisplayed) {
        browser.driver.findElement(by.xpath(locationTab)).then(function () {
          const ele = findElement(locatorType.XPATH, locationTab);
          library.clickJS(ele);
          library.logStepWithScreenshot('location tab is displayed and clickable', 'location tab displayed');
          console.log('location tab displayed');
          resolve(true);
        });
      } else {
        library.logStepWithScreenshot('location tab is not displayed and clickable', 'location tab is not displayed');
        console.log('location tab  not displayed');
        resolve(false);
      }
    });
  }

  verifyColumnsUnderLocationTab(expectedColumns) {
    return new Promise((resolve) => {
      var expected = true;
      var columnvaluesInArray: string[];
      columnvaluesInArray = library.convertTolist(expectedColumns);
      var i = 0;
      element.all(by.xpath(locationHeaders))
        .each((ele, index) => {
          if (ele != undefined) {
            ele.getText().then((text) => {
              if (columnvaluesInArray.includes(text)) {
                expected = true;
              } else
                expected = false;
            });
          }
          i++;
        });
      library.logStepWithScreenshot('Header is displayed', 'Displayed headers');
      var length = columnvaluesInArray.length;
      resolve(expected);
    });
  }

  verifyLabDetailsUnderColumn(labHeader, labHeaderDetails) {
    return new Promise((resolve) => {
      var columnCount = [];
      var count = 1;
      var xpathForLabValue;
      element.all(by.xpath(locationHeaders))
        .each((ele, index) => {
          if (ele != undefined) {
            ele.getText().then((text) => {
              if (labHeader.includes(text)) {
                xpathForLabValue = '//mat-row[1]/mat-cell[' + count + ']'
                this.verifyDetails(xpathForLabValue, labHeaderDetails);
                return;
              } else {
                count++;
              }
            });
          }
        });
      library.logStepWithScreenshot('Column details', 'Displayed column details');
    });
  }

  verifyDetails(xpathForLabValue, labHeaderDetails) {
    return new Promise((resolve) => {
      var eleFromUI = library.getTextFromElement(xpathForLabValue);
      eleFromUI.then(function (placeholder) {
        console.log(placeholder, labHeaderDetails);
        placeholder = placeholder.replace(" ", "");
        labHeaderDetails = labHeaderDetails.replace(" ", "");
        placeholder = placeholder.replace("\n", " ");
        labHeaderDetails = labHeaderDetails.replace("\n", " ");
        if (labHeaderDetails.includes(placeholder)) {
          resolve(true);
        } else {
          console.log("false");
          resolve(false);
        }
      });
    });
  }

  verifyPaginationOnLocationListingPage(noOfItemsPerPage) {
    var flag;
    return new Promise((resolve) => {
      this.verfySize(noOfItemsPerPage).then(function (status) {
        expect(status).toBe(true);
      });
      var count = 0;
      var eleLists = element.all(by.xpath(noOfPagesButton));
      eleLists.each(function (ele) {
        library.clickJS(eleLists.get(count));
        count++;
        library.logStepWithScreenshot("Clicked on page " + count, "PageClicked" + count);
      });
      flag = library.isElementPresent(element(by.xpath(nextButton)));
      library.logStepWithScreenshot("Next Button is displayed", "Next Button");
      flag = library.isElementPresent(element(by.xpath(prevButton)));
      library.logStepWithScreenshot("Previous Button is displayed", "Previous Button")
      library.clickJS(element(by.xpath(firstPage)));
      if (library.isElementPresent(element(by.xpath(prevButtonDisabled))))
        flag = true;
      else
        flag = false;
      library.logStepWithScreenshot("Previous Button after clicking on first page", "Previous Button_1");
      library.clickJS(element(by.xpath(lastPage)));
      if (library.isElementPresent(element(by.xpath(lastButtonDisabled))))
        flag = true;
      else
        flag = false;
      library.logStepWithScreenshot("Next Button after clicking on last page", "Next Button_1");
      resolve(flag);
    });
  }

  verfySize(noOfItemsPerPage) {
    var flag = true;
    return new Promise((resolve) => {
      var list = (element.all(by.xpath(rowsOnPage)));
      (list.count().then(function (count) {
      }));
      expect(list.count()).toBe(noOfItemsPerPage);
    });
  }

  verifysortingAscendingOrder(columnName, columnNo) {
    let count = 0;
    return new Promise((resolve) => {
      let columnButton;
      if (columnName.includes("Account Name") || columnName.includes("Name")) {
        element(by.xpath("(//span[contains(text()," + columnName + ")]/following::mat-icon)[1]")).getAttribute("class").then(function (value) {
          if (value.includes("rotate")) {
            columnButton = ".//mat-header-cell/div/button/span[contains(text(),'" + columnName + "')]";
            /**
            * Clicking on Ascending order sort option
            */
            const columnbtn = element(by.xpath(columnButton));
            library.clickJS(columnbtn);
            console.log('Clicked on Sort by Ascending order button');
            library.logStep('Clicked on Sort by Ascending order button');
          } else {
            console.log('Column is sorted in Ascending order by default');
            library.logStep('Column is sorted in Ascending order by default');
          }
        })
      }else{
        columnButton = ".//mat-header-cell/div/button/span[contains(text(),'" + columnName + "')]";
        /**
        * Clicking on Ascending order sort option
        */
        const columnbtn = element(by.xpath(columnButton));
        library.clickJS(columnbtn);
        console.log('Clicked on Sort by Ascending order button');
        library.logStep('Clicked on Sort by Ascending order button');
      }
      const columnTexts = ".//mat-row/mat-cell[" + columnNo + "]";
      const originalList: Array<any> = [];
      const tempList: Array<string> = [];
      let sortedTempList = [];
      let i = 0;
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele.each(function (optText) {
          library.scrollToElement(optText);
          optText.getText().then(function (text) {
            originalList[i] = text.toUpperCase();
            tempList[i] = text.toUpperCase();
            library.logStep(originalList[i]);
            i++;
          });
        }).then(function () {
          sortedTempList = tempList.sort();
          for (const j in sortedTempList) {
          }
          for (const j in sortedTempList) {
            if (originalList[j] === sortedTempList[j]) {
              count++;
              library.logStep(originalList[i] + ' displayed.');
            } else {
              library.logStep(originalList[i] + ' not displayed.');
            }
          }
          if (count === originalList.length) {
            library.logStepWithScreenshot('List is Alphabetically sorted in Ascending order', 'List is Alphabetically sorted');
            console.log('List is alphabetically sorted in Ascending order');
            resolve(true);
          } else {
            library.logFailStep('List is not sorted in Ascending order');
            console.log('List is not alphabetically sorted in Ascending order');
            resolve(false);
          }
        });
      });
    });
  }

  verifysortingDescendingOrder(columnName, columnNo) {
    let columnButton;
    if (!columnName.includes("Account Name")) {
      element(by.xpath("(//span[contains(text()," + columnName + ")]/following::mat-icon)[1]")).getAttribute("class").then(function (value) {
        if (value.includes("rotate")) {
          console.log('Column is sorted in Descending order by default');
          library.logStep('Column is sorted in Descending order by default');
        } else {
          columnButton = ".//mat-header-cell/div/button/span[contains(text(),'" + columnName + "')]";
          /**
          * Clicking on Descending order sort option
          */
          const columnbtn = element(by.xpath(columnButton));
          library.clickJS(columnbtn);
          console.log('Clicked on Sort by Descending order button');
          library.logStep('Clicked on Sort by Descending order button');
        }
      })
    }
    const columnTexts = ".//mat-row/mat-cell[" + columnNo + "]";
    const originalList: Array<any> = [];
    const tempList: Array<string> = [];
    let sortedTempList = [];
    let count = 0;
    return new Promise((resolve) => {
      let i = 0;
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele.each(function (optText) {
          library.scrollToElement(optText);
          optText.getText().then(function (text) {
            originalList[i] = text.toUpperCase();
            tempList[i] = text.toUpperCase();
            library.logStep(originalList[i]);
            i++;
          });
        }).then(function () {
          sortedTempList = tempList.sort().reverse();
          for (const j in sortedTempList) {
          }
          for (const j in sortedTempList) {
            if (originalList[j] === sortedTempList[j]) {
              count++;
              library.logStep(originalList[i] + ' displayed.');
            } else {
              library.logStep(originalList[i] + ' not displayed.');
            }
          }
          if (count === originalList.length) {
            library.logStepWithScreenshot('List is Alphabetically sorted in Descending Order', 'List is Alphabetically sorted');
            console.log('List is alphabetically sorted in Descending Order');
            resolve(true);
          } else {
            library.logFailStep('List is not sorted in Descending Order');
            console.log('List is not alphabetically sorted in Descending Order');
            resolve(false);
          }

        });
      });
    });
  }

  selectSearchCatagory(catagory) {
    return new Promise((resolve) => {
      const catagoryOptionsXpath = ".//mat-option/span[contains(.,'" + catagory + "')]";
      const catagoryDDBtn = element(by.xpath(catagoryDD));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(catagoryDDBtn), 20000);
      library.clickJS(catagoryDDBtn);
      const selectedCatagory = element(by.xpath(catagoryOptionsXpath));
      selectedCatagory.isDisplayed().then(function () {
        library.clickJS(selectedCatagory);
      }).then(function () {
        console.log(catagory + " Catagory selected");
        library.logStep(catagory + " Catagory selected");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Failed : " + catagory + "Catagory not selected");
        resolve(false);
      });
    });
  }

  enterKeyword(keyword) {
    return new Promise((resolve) => {
      const inputBox = element(by.xpath(keywordInputBox));
      const search = element(by.xpath(searchBtn));
      library.clickJS(inputBox);
      inputBox.sendKeys(keyword);
      library.logStep("Keyword entered")
      library.clickJS(search);
      resolve(true);
    });
  }

  searchAndVerify(keyword, columnNo) {
    const inputBox = element(by.xpath(keywordInputBox));
    const search = element(by.xpath(searchBtn));
    library.clickJS(inputBox);
    inputBox.sendKeys(keyword);
    library.logStep("Keyword entered")
    library.clickJS(search);
    const columnTexts = ".//mat-row/mat-cell[" + columnNo + "]";
    const nextPageBtn = element(by.xpath(nextButton));
    let result = false;
    const originalList: Array<any> = [];
    let count = 0;
    return new Promise((resolve) => {
      let i = 0;
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele.each(function (optText) {
          library.scrollToElement(optText)
          optText.getText().then(function (text) {
            originalList[i] = text.toUpperCase();
            i++;
          });
        }).then(function () {
          for (let j = 0; j <= 20; j++) {
            nextPageBtn.isPresent().then(function () {
              library.clickJS(nextPageBtn);
              const ele = element.all(by.xpath(columnTexts));
              ele.each(function (optText) {
                library.scrollToElement(optText)
                optText.getText().then(function (text) {
                  originalList[i] = text.toUpperCase();
                  i++;
                });
              });
            }).catch(function () {
              j = 20;
            });
          }
        }).then(function () {
          console.log(originalList)
          for (const element of originalList) {
            if (element.includes(keyword.toUpperCase())) {
              count++;
            }
          }
          console.log(count);
          if (count === originalList.length) {

            result = true;
            resolve(true);
          }
          else {
            library.logFailStep("search functionaliyt failed");
            result = false;
            resolve(result);
          }
        });
      });
    });
  }

  resetFunction() {
    const resetBtn = element(by.xpath(resetBtnXpath));
    const catagoryDDBtn = element(by.xpath(catagoryDD));
    const inputBox = element(by.xpath(keywordInputBox));
    resetBtn.isDisplayed().then(function () {
      library.clickJS(resetBtn);
      library.logStep("Reset button clicked ");
    }).catch(function () {
      library.logFailStep("reset button not clicked");
    });
    return new Promise((resolve) => {
      let catagoryresult = false;
      let inputresult = false;
      catagoryDDBtn.getAttribute("ng-reflect-value").then(function (value) {
        if (value === "0") {
          catagoryresult = true;
        }
      }).then(function () {
        inputBox.getAttribute("ng-reflect-value").then(function (value) {
          if (value === null) {
            inputresult = true;
          }
        });
      }).then(function () {
        if (inputresult === true && catagoryresult === true) {
          library.logStep("Reset functionality worked fine");
          resolve(true);
        }
        else {
          library.logFailStep("reset functionality failed");
          resolve(false);
        }
      });
    });
  }

  verfyUIComponents() {
    return new Promise((resolve) => {
      let catagory = false, input = false, searchbox = false;
      const catagoryDDBtn = element(by.xpath(catagoryDD));
      const inputBox = element(by.xpath(keywordInputBox));
      const search = element(by.xpath(searchBtn));
      catagoryDDBtn.isDisplayed().then(function () {
        library.logStep("catagory drop down displayed");
        catagory = true;
      }).catch(function () {
        library.logFailStep("catagory drop down displayed");
      }).then(function () {
        inputBox.isDisplayed().then(function () {
          input = true;
          library.logStep("input box displayed");
        });
      }).then(function () {
        search.isDisplayed().then(function () {
          searchbox = true;
          library.logStep("search box displayed");
        });
      }).then(function () {
        if (catagory === true && input === true && searchbox === true) {
          library.logStep("UI components verified");
          resolve(true);
        }
      });
    });
  }
}
