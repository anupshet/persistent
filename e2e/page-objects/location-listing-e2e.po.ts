/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { resultMemoize } from "@ngrx/store";
import {
  by,
  browser,
  element,
  ElementFinder,
  protractor,
  ExpectedConditions,
} from "protractor";
import { BrowserLibrary, findElement, locatorType } from "../utils/browserUtil";
import { Dashboard } from "./dashboard-e2e.po";

const dashBoard = new Dashboard();
const library = new BrowserLibrary();

const locationTab = '//div[@role="tab"]/div[text()="LOCATIONS"]';
const locationHeaders = "//mat-header-row//span";
const rowsOnPage = "//mat-row";
const nextButton =
  '//button[@class="mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary"]';
const prevButton =
  '//button[@class="mat-focus-indicator pagination-button spec-prev-button mat-stroked-button mat-button-base mat-primary"]';
const noOfPagesButton = '//div[@class="ng-star-inserted"]/button';
const lastPage = '(//div[@class="ng-star-inserted"]/button)[last()]';
const firstPage = '(//div[@class="ng-star-inserted"]/button)[1]';
const prevButtonDisabled =
  '//button[@class="mat-focus-indicator pagination-button spec-prev-button mat-stroked-button mat-button-base mat-primary selected disable-button"]';
const lastButtonDisabled =
  '//button[@class="mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary selected disable-button"]';
const catagoryDD = ".//div/mat-select";
const keywordInputBoxLocation = "//input[@id='locations-field']";
const searchBtn = "//span[.='Search']";
const resetBtnXpath = './/button/span/span[contains(text(),"Reset")]';
const firstPageCss =
  ".custom-pagination > div:nth-of-type(1) .mat-button-wrapper";
const firstLabName = './/mat-row/mat-cell//span[contains(@class, "lab-name")]';
const shipTo = './/input[@id="shipTo"]';
const soldTo = './/input[@id="soldTo"]';
const locationListingLoadingMessage =
  "//div[contains(text(), 'Loading locations...')]";
const tableCellWithText = "//mat-row/mat-cell[contains(., 'keyword')]"; // <keyword> will be replaces with required keyword using replace function
const launchLabBtnWIthLab = "//mat-cell[contains(., 'keyword')]/..//button"; // <keyword> will be replaces with required keyword using replace function

export class LocationListing {
  clickOnLocationTab() {
    return new Promise(async (resolve) => {
      const eleLocator1: ElementFinder = await element(by.xpath(locationTab));
      await browser.wait(
        browser.ExpectedConditions.visibilityOf(eleLocator1),
        15000
      );
      const isDisplayed = library.isElementPresent(eleLocator1);
      if (isDisplayed) {
        await browser.driver
          .findElement(by.xpath(locationTab))
          .then(async function () {
            const ele = findElement(locatorType.XPATH, locationTab);
            library.clickJS(ele);
            await browser.wait(
              browser.ExpectedConditions.invisibilityOf(
                element(by.xpath(locationListingLoadingMessage))
              ),
              15000
            );
            library.logStepWithScreenshot(
              "location tab is displayed and clickable",
              "location tab displayed"
            );
            console.log("location tab displayed");
            resolve(true);
          });
      } else {
        library.logStepWithScreenshot(
          "location tab is not displayed and clickable",
          "location tab is not displayed"
        );
        console.log("location tab  not displayed");
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
      element.all(by.xpath(locationHeaders)).each((ele, index) => {
        if (ele != undefined) {
          ele.getText().then((text) => {
            if (columnvaluesInArray.includes(text)) {
              expected = true;
            } else expected = false;
          });
        }
        i++;
      });
      library.logStepWithScreenshot("Header is displayed", "Displayed headers");
      var length = columnvaluesInArray.length;
      resolve(expected);
    });
  }

  verifyLabDetailsUnderColumn(labHeader, labHeaderDetails) {
    return new Promise((resolve) => {
      var columnCount = [];
      var count = 1;
      var xpathForLabValue;
      element.all(by.xpath(locationHeaders)).each((ele, index) => {
        if (ele != undefined) {
          ele.getText().then((text) => {
            if (labHeader.includes(text)) {
              xpathForLabValue = "//mat-row[1]/mat-cell[" + count + "]";
              this.verifyDetails(xpathForLabValue, labHeaderDetails);
              return;
            } else {
              count++;
            }
          });
        }
      });
      library.logStepWithScreenshot(
        "Column details",
        "Displayed column details"
      );
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
        library.logStepWithScreenshot(
          "Clicked on page " + count,
          "PageClicked" + count
        );
      });
      flag = library.isElementPresent(element(by.xpath(nextButton)));
      library.logStepWithScreenshot("Next Button is displayed", "Next Button");
      flag = library.isElementPresent(element(by.xpath(prevButton)));
      library.logStepWithScreenshot(
        "Previous Button is displayed",
        "Previous Button"
      );
      library.clickJS(element(by.xpath(firstPage)));
      if (library.isElementPresent(element(by.xpath(prevButtonDisabled))))
        flag = true;
      else flag = false;
      library.logStepWithScreenshot(
        "Previous Button after clicking on first page",
        "Previous Button_1"
      );
      library.clickJS(element(by.xpath(lastPage)));
      if (library.isElementPresent(element(by.xpath(lastButtonDisabled))))
        flag = true;
      else flag = false;
      library.logStepWithScreenshot(
        "Next Button after clicking on last page",
        "Next Button_1"
      );
      resolve(flag);
    });
  }

  verfySize(noOfItemsPerPage) {
    var flag = true;
    return new Promise((resolve) => {
      var list = element.all(by.xpath(rowsOnPage));
      list.count().then(function (count) {});
      expect(list.count()).toBe(noOfItemsPerPage);
    });
  }

  verfyUIComponents() {
    return new Promise((resolve) => {
      let catagory = false,
        input = false,
        searchbox = false;
      const catagoryDDBtn = element(by.xpath(catagoryDD));
      const inputBox = element(by.xpath(keywordInputBoxLocation));
      const search = element(by.xpath(searchBtn));
      catagoryDDBtn
        .isDisplayed()
        .then(function () {
          library.logStep("catagory drop down displayed");
          catagory = true;
        })
        .catch(function () {
          library.logFailStep("catagory drop down displayed");
        })
        .then(function () {
          inputBox.isDisplayed().then(function () {
            input = true;
            library.logStep("input box displayed");
          });
        })
        .then(function () {
          search.isDisplayed().then(function () {
            searchbox = true;
            library.logStep("search box displayed");
          });
        })
        .then(function () {
          if (catagory === true && input === true && searchbox === true) {
            library.logStep("UI components verified");
            resolve(true);
          }
        });
    });
  }

  verifysortingAscendingOrder(columnName, columnNo) {
    dashBoard.waitForElement();
    let columnTexts;
    if (columnName != "Lab") {
      const columnButton =
        ".//mat-header-cell/div/button/span[contains(text(),'" +
        columnName +
        "')]";
      const columnbtn = element(by.xpath(columnButton));
      library.clickJS(columnbtn);
      dashBoard.waitForElement();
    }
    if (columnName == "License Type") {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]//div/div[1]";
    } else if (columnName == "License Status") {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]//div/div[2]";
    } else {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]/div/span[1]";
    }
    const originalList: Array<any> = [];
    return new Promise((resolve) => {
      let i = 0;
      library.logStep("Ascending Order");
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele
          .each(function (optText) {
            library.scrollToElement(optText);
            optText.getText().then(function (text) {
              originalList[i] = text.toUpperCase();
              library.logStep(originalList[i]);
              i++;
            });
          })
          .then(function () {
            library.logStepWithScreenshot(
              "sorted Column in ascending order of " + columnName,
              "AscendingSorting" + columnName
            );
            resolve(true);
          });
      });
    });
  }

  verifysortingDescendingOrder(columnName, columnNo) {
    let columnTexts;
    const columnButton =
      ".//mat-header-cell/div/button/span[contains(text(),'" +
      columnName +
      "')]";
    const columnbtn = element(by.xpath(columnButton));
    library.clickJS(columnbtn);
    dashBoard.waitForElement();
    if (columnName == "License Type") {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]//div/div[1]";
    } else if (columnName == "License Status") {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]//div/div[2]";
    } else {
      columnTexts = ".//mat-row/mat-cell[" + columnNo + "]/div/span[1]";
    }
    const originalList: Array<any> = [];
    return new Promise((resolve) => {
      let i = 0;
      library.logStep("Descending Order");
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele
          .each(function (optText) {
            library.scrollToElement(optText);
            optText.getText().then(function (text) {
              originalList[i] = text.toUpperCase();
              library.logStep(originalList[i]);
              i++;
            });
          })
          .then(function () {
            library.logStepWithScreenshot(
              "sorted Column in decending order of " + columnName,
              "DescendingSorting" + columnName
            );
            resolve(true);
          });
      });
    });
  }

  selectSearchCatagory(catagory) {
    return new Promise(async (resolve) => {
      await browser.wait(
        browser.ExpectedConditions.invisibilityOf(
          element(by.xpath(locationListingLoadingMessage))
        ),
        20000
      );
      const catagoryOptionsXpath =
        ".//mat-option/span[contains(.,'" + catagory + "')]";
      const catagoryDDBtn = await element(by.xpath(catagoryDD));
      library.clickJS(catagoryDDBtn);
      const selectedCatagory = await element(by.xpath(catagoryOptionsXpath));
      await browser.wait(
        browser.ExpectedConditions.visibilityOf(selectedCatagory),
        15000
      );
      await selectedCatagory
        .isDisplayed()
        .then(async function () {
          await selectedCatagory.click();
        })
        .then(function () {
          library.logStep(catagory + " Catagory selected");
          resolve(true);
        })
        .catch(function () {
          library.logFailStep(catagory + "Catagory not selected");
          resolve(false);
        });
    });
  }

  search(category, keyword) {
    return new Promise(async (resolve) => {
      library.logStep("Search " + category + " " + keyword);
      await this.selectSearchCatagory(category).then(function (result) {
        expect(result).toBe(true);
      });
      await element(by.xpath(keywordInputBoxLocation)).sendKeys(keyword);
      await element(by.xpath(searchBtn)).click();
      await browser.wait(
        browser.ExpectedConditions.invisibilityOf(
          element(by.xpath(locationListingLoadingMessage))
        ),
        20000
      );
      let tableCellWithTextXPath = tableCellWithText;
      tableCellWithTextXPath = tableCellWithTextXPath.replace(
        "keyword",
        keyword
      );
      console.log("Cell Xpath " + tableCellWithTextXPath);
      let ele = element.all(by.xpath(tableCellWithTextXPath));
      ele.count().then(function (result) {
        console.log("Search Result Row Count " + result);
        if (result > 0) resolve(true);
        else resolve(false);
      });
    });
  }

  searchAndVerify(keyword, columnNo) {
    let columnTexts;
    const inputBox = element(by.xpath(keywordInputBoxLocation));
    const search = element(by.xpath(searchBtn));
    library.clickJS(inputBox);
    inputBox.sendKeys(keyword);
    library.logStep("Keyword entered");
    library.clickJS(search);
    columnTexts = ".//mat-row/mat-cell[" + columnNo + "]";
    const nextPageBtn = element(by.xpath(nextButton));
    let result = false;
    const originalList: Array<any> = [];
    let count = 0;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let i = 0;
      const ele = element.all(by.xpath(columnTexts));
      ele.isDisplayed().then(function () {
        ele
          .each(function (optText) {
            library.scrollToElement(optText);
            optText.getText().then(function (text) {
              originalList[i] = text.toUpperCase();
              i++;
            });
          })
          .then(function () {
            for (let j = 0; j <= 20; j++) {
              nextPageBtn
                .isPresent()
                .then(function () {
                  library.clickJS(nextPageBtn);
                  const ele = element.all(by.xpath(columnTexts));
                  ele.each(function (optText) {
                    library.scrollToElement(optText);
                    optText.getText().then(function (text) {
                      originalList[i] = text.toUpperCase();
                      i++;
                    });
                  });
                })
                .catch(function () {
                  j = 20;
                });
            }
          })
          .then(function () {
            console.log(originalList);
            for (const element of originalList) {
              if (element.includes(keyword.toUpperCase())) {
                count++;
              }
            }
            console.log(count);
            if (count === originalList.length) {
              library.logStepWithScreenshot(
                "Search function Verified for respective catagory",
                "List of searched keyword"
              );
              result = true;
              resolve(true);
            } else {
              library.logFailStep("search functionaliyt failed");
              result = false;
              resolve(result);
            }
          });
      });
    });
  }

  enterKeyword(keyword) {
    return new Promise((resolve) => {
      const inputBox = element(by.xpath(keywordInputBoxLocation));
      const search = element(by.xpath(searchBtn));
      library.clickJS(inputBox);
      inputBox.sendKeys(keyword);
      library.logStep("Keyword entered");
      library.clickJS(search);
      resolve(true);
    });
  }

  resetFunction() {
    const resetBtn = element(by.xpath(resetBtnXpath));
    const catagoryDDBtn = element(by.xpath(catagoryDD));
    const inputBox = element(by.xpath(keywordInputBoxLocation));
    resetBtn
      .isDisplayed()
      .then(function () {
        library.clickJS(resetBtn);
        library.logStep("Reset button clicked ");
      })
      .catch(function () {
        library.logFailStep("reset button not clicked");
      });
    return new Promise((resolve) => {
      let catagoryresult = false;
      let inputresult = false;
      catagoryDDBtn
        .getAttribute("class")
        .then(function (value) {
          console.log("value1= " + value);
          if (value.includes("empty")) {
            catagoryresult = true;
            console.log("catagoryresult " + catagoryresult);
          }
        })
        .then(function () {
          inputBox.getAttribute("ng-reflect-value").then(function (value) {
            console.log("value2= " + value);
            if (value === null) {
              inputresult = true;
            }
          });
        })
        .then(function () {
          if (inputresult === true && catagoryresult === true) {
            library.logStepWithScreenshot(
              "Reset functionality worked fine",
              "resetWorked"
            );
            resolve(true);
          } else {
            library.logFailStep("reset functionality failed");
            resolve(false);
          }
        });
    });
  }

  clickFirstLabName() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const firstLabNameLink = element(by.xpath(firstLabName));
      library.clickJS(firstLabNameLink);
      library.logStep("First Result Link clicked");
      resolve(true);
    });
  }

  verifyShipToSoldTo(field, value) {
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      if (field == "shipTo") {
        const shipToInput = element(by.xpath(shipTo));
        library.scrollToElement(shipToInput);
        shipToInput.getAttribute("value").then(function (shipToValue) {
          if (shipToValue == value) {
            console.log("shipToValue " + shipToValue);
            library.logStepWithScreenshot(
              "Correct Search results displayed for Ship To value " + value,
              "CorrectSearchResultShipTo"
            );
            resolve(true);
          }
        });
      } else if (field == "soldTo") {
        const soldToInput = element(by.xpath(soldTo));
        library.scrollToElement(soldToInput);
        soldToInput.getAttribute("value").then(function (soldToValue) {
          if (soldToValue == value) {
            console.log("soldToValue " + soldToValue);
            library.logStepWithScreenshot(
              "Correct Search results displayed for Sold To value " + value,
              "CorrectSearchResultSoldTo"
            );
            resolve(true);
          }
        });
      }
      library.logStep("First Result Link clicked");
      resolve(true);
    });
  }

  async launchLabWithLabName(labName) {
    let labRow: ElementFinder = await element(
      by.xpath(launchLabBtnWIthLab.replace("keyword", labName))
    );
    await browser.wait(
      protractor.ExpectedConditions.visibilityOf(labRow),
      15000
    );
    await labRow.click();
    let loadingPopUp = await element(
      by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')
    );
    let heading = await element(
      by.xpath("//h4[contains(., '" + labName + "')]")
    );
    await browser.wait(
      protractor.ExpectedConditions.visibilityOf(heading),
      15000
    );
    await browser.wait(
      browser.ExpectedConditions.invisibilityOf(loadingPopUp),
      25000
    );
    library.logStep("Launch Lab " + labName);
    let flag = false;
    await heading.isPresent().then(function (result) {
      flag = result;
    });
    return flag;
  }
}
