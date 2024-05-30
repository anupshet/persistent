/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Workbook } from 'exceljs';
import { WorkSheet } from 'xlsx/types';
import { Dashboard } from '../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../utils/browserUtil';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const fs = require('fs');
const csvmodule = require('papaparse');
const path = require('path');
const reqPath = path.join(__dirname, '../');
const downloadPath = path.join(reqPath, 'qcp-downloads');
const uploadPath = path.join(reqPath, 'qcp-resources');

const manufacturerDDL = './/button[contains(@data-id, "Manufacturer")]';
const searchBox = './/input[contains(@type, "search")]';
const showDefaultOption = './/div[contains(@class, "dataTables_length")]';
const instrumentDDL = './/label[contains(text(), "Instrument*")]/parent::div//button[contains(@data-id, "Instrument")][contains(@aria-disabled, "false")]';
const downloadBtn = './/button[@onclick = "DownloadCsv();"]';
const uploadedFileName = './/div[@class = "dz-filename"]/span';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const tableHeaderAll = './/table/thead/tr/th';
const checkBox = '(.//td/input[@class = "dataTableCheckbox"])[1]';
const deleteBtn = './/td/a[text() = "Delete"]';
const confirmOnDelete = './/button[contains(text(), " Confirm")]';
const reagDdl = '(.//div//button[contains(@data-id, "Reagent")])[1]';
const downloadBtnUnmapped = './/a[@href="/DataUnmappedConfigs/Download"]';
const toastMessage = './/div[contains(@class, "toast-message")]';
const confirmDeleteMessage = './/div[contains(@class, "bootbox-body")]';
const downloadButton = './/a[contains(@href, "Download")]';
const allHeaders = './/table/thead/tr/th';
const tableRows = '//tbody/tr';
const nextPageButton = './/li[contains(@id, "_next")]';
const previousPageButton = './/li[contains(@id, "_previous")]';
const resultInfoEle = './/div[contains(@class, "dataTables_info")]';
const cancelBtn = './/button[contains(text(), "Cancel")]';
const closeBtn = './/button[contains(text(), "Close")]';
const reloadTable = './/a[contains(text(), "Reload Table")]';
const warningOk = './/button[contains(text(), "OK")]';
const closeXBtn = './/button[contains(text(), "×")]';

export class QcpCentral {
  expandMainMenu(menuName) {
    let flag = false;
    return new Promise((resolve) => {
      const menuNameEle = element(by.xpath('.//a[@data-toggle="dropdown"][contains(text(),"' + menuName + '")]'));
      browser.wait(browser.ExpectedConditions.visibilityOf(menuNameEle), 15000, 'Menu not displayed: ' + menuName);
      library.click(menuNameEle);
      library.logStep('Main Menu expnaded: ' + menuName);
      console.log('Main Menu expnaded: ' + menuName);
      library.logStepWithScreenshot('Main Menu expnaded: ' + menuName, 'MainMenu');
      flag = true;
      resolve(flag);
    });
  }

  selectSubMenu(subMenuName) {
    let flag = false;
    return new Promise((resolve) => {
      const selectSubMenu = element(by.xpath('.//ul[contains(@class, "dropdown-menu")]//a[contains(text(), "' + subMenuName + '")]'));
      library.click(selectSubMenu);
      library.logStep('Menu selected: ' + subMenuName);
      console.log('Menu selected: ' + subMenuName);
      library.logStepWithScreenshot('Sub Menu expnaded: ' + subMenuName, 'SubMenu');
      flag = true;
      resolve(flag);
    });
  }

  selectSubMenuOption(subMenuName, subMenuOption) {
    let flag = false;
    return new Promise((resolve) => {
      browser.actions().mouseMove
        (element(by.xpath('(.//ul[contains(@class, "dropdown-menu")]//a[contains(text(), "' + subMenuName + '")])[1]'))).perform();
      const menuOpt = element(by.xpath('(.//ul/li/a[contains(text(), "' + subMenuOption + '")])[1]'));
      browser.wait(browser.ExpectedConditions.textToBePresentInElement(menuOpt, subMenuOption), 10000, subMenuOption + ' not visible');
      menuOpt.isDisplayed().then(function () {
        library.click(menuOpt);
        library.logStep('Menu selected: ' + subMenuOption);
        console.log('Menu selected: ' + subMenuOption);
        library.logStepWithScreenshot('Menu selected: ' + subMenuOption, 'Menu selected: ' + subMenuOption);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Menu not displayed: ' + subMenuOption);
        console.log('Menu not displayed: ' + subMenuOption);
        library.logStepWithScreenshot('Menu not displayed: ' + subMenuOption, 'subMenuOption');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectSubMenuOptionCodeList(subMenuName, subMenuOption) {
    let flag = false;
    return new Promise((resolve) => {
      browser.actions().mouseMove
        (element(by.xpath('(.//ul[contains(@class, "dropdown-menu")]//a[contains(text(), "' + subMenuName + '")])[1]'))).perform();
      const menuOpt = element(by.xpath('(.//ul/li/a[contains(text(), "' + subMenuOption + '")])[2]'));
      browser.wait(browser.ExpectedConditions.textToBePresentInElement(menuOpt, subMenuOption), 10000, subMenuOption + ' not visible');
      menuOpt.isDisplayed().then(function () {
        library.click(menuOpt);
        library.logStep('Menu selected: ' + subMenuOption);
        console.log('Menu selected: ' + subMenuOption);
        library.logStepWithScreenshot('Menu selected: ' + subMenuOption, 'Menu selected: ' + subMenuOption);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Menu not displayed: ' + subMenuOption);
        console.log('Menu not displayed: ' + subMenuOption);
        library.logStepWithScreenshot('Menu not displayed: ' + subMenuOption, 'subMenuOption');
        flag = false;
        resolve(flag);
      });
    });
  }


  selectManufacturer(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(manufacturerDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Manufacturer selected: ' + manufacturerName);
        console.log('Manufacturer selected: ' + manufacturerName);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturerName, 'Manufacturer selected: ' + manufacturerName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Manufacturer drop down not displayed');
          console.log('Manufacturer drop down not displayed');
          library.logStepWithScreenshot('Manufacturer drop down not displayed', 'Manufacturer drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  isInstrumentDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddl = element(by.xpath(instrumentDDL));
      browser.waitForAngular();
      ddl.getAttribute('aria-disabled').then(function (val) {
        if (val === 'false') {
          console.log('Instrument drop down is displayed');
          library.logStep('Instrument drop down is displayed');
          library.logStepWithScreenshot('Instrument drop down is displayed', 'Instrument drop down is displayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Instrument drop down is not displayed');
          console.log('Instrument drop down is not displayed');
          library.logStepWithScreenshot('Instrument drop down is not displayed', 'Instrument drop down is not displayed');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  isManufacturerDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddl = element(by.xpath(manufacturerDDL));
      browser.waitForAngular();
      ddl.getAttribute('aria-disabled').then(function (val) {
        if (val === 'false') {
          console.log('Manufacturer drop down is displayed');
          library.logStep('Manufacturer drop down is displayed');
          library.logStepWithScreenshot('Manufacturer drop down is displayed', 'Manufacturer drop down is displayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Manufacturer drop down is not displayed');
          console.log('Manufacturer drop down is not displayed');
          library.logStepWithScreenshot('Manufacturer drop down is not displayed', 'Manufacturer drop down is not displayed');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  addSearchItemName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const searchEle = element(by.xpath(searchBox));
      searchEle.isDisplayed().then(function () {
        searchEle.clear();
        searchEle.sendKeys(name);
        library.logStep('Searching for ' + name);
        console.log('Searching for ' + name);
        library.logStepWithScreenshot('Searching for ' + name, 'Searching for ' + name);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Search box not found');
        console.log('Search box not found');
        library.logStepWithScreenshot('Search box not found', 'Search box not found');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectDefaultOptionsDisplayed(number) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(showDefaultOption));
      browser.executeScript('arguments[0].scrollIntoView(false);', ddl);
      ddl.isDisplayed().then(function () {
        library.click(ddl);
        const option = element
          (by.xpath('.//div[contains(@class, "dataTables_length")]//select/option[contains(@value, "' + number + '")]'));
        library.click(option);
        library.logStep('Default view Option selected: ' + number);
        console.log('Default view Option selected: ' + number);
        library.logStepWithScreenshot('Default view Option selected: ' + number, 'Default view Option selected: ' + number);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Default view not found');
        console.log('Default view not found');
        library.logStepWithScreenshot('Default view not found', 'Default view not found');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTableDisplayedWithSelectedNumbers(number) {
    let flag = false;
    return new Promise((resolve) => {
      const dataTable = element(by.xpath(tableRows));
      dataTable.isDisplayed().then(function () {
        const rows = element.all(by.xpath(tableRows));
        rows.count().then(function (num) {
          if (num === number) {
            library.logStep('Table displayed with selected number of records' + number);
            console.log('Table displayed with selected number of records' + number);
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        library.logStepWithScreenshot('Data table not displayed', 'Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTableResultInfo(number) {
    let flag = false;
    return new Promise((resolve) => {
      const resultText = element(by.xpath(resultInfoEle));
      browser.executeScript('arguments[0].scrollIntoView();', resultText);
      dashboard.waitForScroll();
      resultText.isDisplayed().then(function () {
        resultText.getText().then(function (actText) {
          if (actText.includes(number)) {
            console.log('Result Info: ' + actText);
            library.logStepWithScreenshot('Result Info: ' + actText, 'Result Info: ' + actText);
            flag = true;
            resolve(flag);
          } else {
            console.log('Result Info not as per selected number: ' + number);
            library.logStepWithScreenshot
            ('Result Info not as per selected number: ' + number, 'Result Info not as per selected number: ' + number);
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Result info not found');
        console.log('Result info not found');
        library.logStepWithScreenshot('Result info not found', 'Result info not found');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTableFilteredWithManufacturer(expectedManufacturer) {
    let flag = false;
    return new Promise((resolve) => {
      const dataTable = element(by.xpath('.//table[@id =  "tblReagent"]//tbody/tr'));
      dataTable.isDisplayed().then(function () {
        const manufacturer = element.all(by.xpath('.//table[@id =  "tblReagent"]//tbody/tr/td[3]'));
        manufacturer.forEach(function (item) {
          item.getText().then(function (actualTxt) {
            const actualManufacturer = actualTxt.trim();
            if (expectedManufacturer === actualManufacturer) {
              library.logStep('Table is filtered with manufacturer: ' + actualManufacturer);
              console.log('Table is filtered with manufacturer: ' + actualManufacturer);
              flag = true;
              resolve(flag);
            }
          });
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        library.logStepWithScreenshot('Data table not displayed', 'Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectInstrument(instrumentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(instrumentDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Instrument Dropdown is not clickable');
      browser.executeScript('arguments[0].scrollIntoView();', ddl);
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        dashboard.waitForScroll();
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + instrumentName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 20000, 'Instrument Dropdown Options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        library.clickJS(options);
        browser.sleep(10000);
        library.logStep('Instrument selected: ' + instrumentName);
        console.log('Instrument selected: ' + instrumentName);
        library.logStepWithScreenshot('Instrument selected: ' + instrumentName, 'Instrument selected: ' + instrumentName);
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOnDownloadToExcel(filename) {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(downloadBtn));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        library.clickAction(downloadBtnEle);
        browser.sleep(50000);
        console.log('Download To Excel button clicked');
        library.logStep('Download To Excel button clicked');
        library.logStepWithScreenshot('Download To Excel button clicked', 'clickOnDownloadToExcel');
      }).then(function () {
        const filePathName = downloadPath + '\\' + filename;
        const fileExist = fs.existsSync(filePathName);
        console.log('FileExist: ' + fileExist);
        if (fileExist) {
          console.log('File downloaded');
          library.logStep('File downloaded');
          flag = true;
          resolve(flag);
        } else {
          console.log('File download fail');
          library.logStep('File download fail');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnDownloadToExcelUnmapped(filename) {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(downloadBtnUnmapped));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        library.clickAction(downloadBtnEle);
        browser.sleep(50000);
        console.log('Download To Excel button clicked');
        library.logStep('Download To Excel button clicked');
        library.logStepWithScreenshot('Download To Excel button clicked', 'clickOnDownloadToExcel');
      }).then(function () {
        const filePathName = downloadPath + '\\' + filename;
        console.log('Download Path::: ' + filePathName);
        dashboard.waitForElement();
        const fileExist = fs.existsSync(filePathName);
        console.log('FileExist: ' + fileExist);
        if (fileExist) {
          console.log('File downloaded');
          library.logStep('File downloaded');
          flag = true;
          resolve(flag);
        } else {
          console.log('File download fail');
          library.logStep('File download fail');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  readDataInFile(filename) {
    let flag = false;
    let data;
    const tdataArry = [], lines = [];
    const filePathName = downloadPath + '\\' + filename;
    console.log('FileNamePath: ' + filePathName);
    return new Promise((resolve) => {
      console.log('In ReadFile');
      browser.sleep(5000);
      const fileExist = fs.existsSync(filePathName);
      console.log('FileExist: ' + fileExist);
      const tmp = fs.readFileSync(filePathName);
      const csv = tmp.toString();
      const allTextLines = csv.split(/\n/);
      console.log('allTextLENGHTH: ' + allTextLines.length);
      for (let i = 0; i < allTextLines.length - 1; i++) {
        data = allTextLines[i].split(',');
        console.log('DATA: ' + data);
        for (let j = 0; j < data.length; j++) {
          tdataArry.push(data[j]);
        }
        lines.push(tdataArry);
      }
      flag = true;
      resolve(lines);
    });
  }

  async readDataCSV(filename, expectedColumnName, expectedValue) {
    let flag, colfound, valfound = false;
    let colNum = 0;
    const columnNames = [];
    const filePathName = downloadPath + '\\' + filename;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const fileExist = fs.existsSync(filePathName);
      if (fileExist) {
        const tempRead = fs.readFileSync(filePathName, 'utf16le');
        const readF = tempRead.replace(/^\uFEFF/, '');
        csvmodule.parse(readF, {
          complete: (csvValues) => {
            for (let i = 0; i < csvValues.data[0].length - 1; i++) {
              columnNames.push(csvValues.data[0][i]);
            }
            for (const text of columnNames) {
              if (text === expectedColumnName) {
                colNum = columnNames.indexOf(text);
                colfound = true;
                break;
              }
            }
            for (let j = 1; j < csvValues.data.length - 1; j++) {
              const tempTxt = csvValues.data[j][colNum];
              const tempAct = tempTxt.trim();
              const actulaVal = tempAct.replace(/\s/g, '');
              const expected = expectedValue.replace(/\s/g, '');
              if (expected === actulaVal) {
                valfound = true;
              }
            }
          }
        });
        if (colfound && valfound === true) {
          console.log('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          library.logStep('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          flag = true;
          resolve(flag);
        } else {
          flag = false;
          console.log('Exepcted Value: ' + valfound + ' and column: ' + colfound);
          console.log('Exepcted Value ' + expectedValue + ' and column ' + expectedColumnName + ' not found');
          library.logStep('Expected Value ' + expectedValue + ' and column ' + expectedColumnName + ' not found');
          resolve(flag);
        }
      } else {
        console.log('File not available');
      }
    });
  }

  deleteDownloadedFile(filename) {
    let flag = false;
    const filePathName = downloadPath + '\\' + filename;
    console.log('FileNamePath: ' + filePathName);
    return new Promise((resolve) => {
      const fileExist = fs.existsSync(filePathName);
      console.log('FileExist: ' + fileExist);
      if (fileExist) {
        fs.unlinkSync(filePathName);
        console.log('File Deleted: ' + filePathName);
        library.logStep('File Deleted: ' + filePathName);
        flag = true;
        resolve(flag);
      } else {
        console.log('File is not available to delete: ' + filePathName);
        library.logStep('File is not available to delete: ' + filePathName);
        flag = true;
        resolve(flag);
      }
    });
  }

  uploadFile(fileToUpload) {
    let flag = false;
    const absolutePath = uploadPath + '\\' + fileToUpload;
    return new Promise((resolve) => {
      const fileNameDisp = element(by.xpath(uploadedFileName));
      library.logStep('Browse link clicked');
      console.log('Browse link clicked');
      const elm = element(by.css('input[type="file"]'));
      browser.executeScript('arguments[0].style = {};', elm.getWebElement());
      elm.sendKeys(absolutePath);
      browser.wait(browser.ExpectedConditions.textToBePresentInElement(fileNameDisp, fileToUpload), 15000, 'File is not uploaded');
      library.logStepWithScreenshot('File Uploaded: ' + fileToUpload, 'FileUploaded');
      library.logStep('New Valid Config File added: ' + fileToUpload);
      console.log('New Valid Config File added: ' + fileToUpload);
      flag = true;
      resolve(flag);
    });
  }

  readColumnDataExcel(fileToRead, expectedColumnName) {
    const wb: Workbook = new Workbook();
    let sh: WorkSheet;
    let colNum = 0;
    const columnValues = [];
    const absolutePath = uploadPath + '\\' + fileToRead;
    return new Promise((resolve) => {
      wb.xlsx.readFile(absolutePath).then(function () {
        sh = wb.getWorksheet('Sheet1');
        const firstRow = sh.getRow(1);
        firstRow.eachCell(function (cell, colNumber) {
          if ((cell.value) === (expectedColumnName)) {
            colNum = colNumber;
          }
        });
        const colName = sh.getColumn(colNum);
        colName.eachCell(function (cell) {
          columnValues.push(cell.value);
        });
        dashboard.waitForScroll();
        resolve(columnValues);
      });
    });
  }


  waitUntilTableLoaded() {
    let flag = false;
    return new Promise((resolve) => {
      const tableValues = element(by.xpath(tableFirstVal));
      browser.wait(browser.ExpectedConditions.visibilityOf(tableValues), 25000, 'Table is not loaded');
      tableValues.getText().then(function (text) {
        if (text !== '') {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          flag = true;
          resolve(flag);
        } else {
          console.log('Table is not displayed with Values');
          library.logStep('Table is not displayed with Values');
          flag = false;
          resolve(flag);
        }
      }).catch(function () {
        console.log('Table is not loaded');
        library.logStep('Table is not loaded');
        library.logStepWithScreenshot('Table is not loaded', 'Table is not loaded');
        flag = false;
        resolve(flag);
      });
    });
  }

  isTableDisplayedWithValues() {
    let flag = false;
    return new Promise((resolve) => {
      const tableValues = element(by.xpath(tableFirstVal));
      tableValues.getText().then(function (text) {
        if (text !== '') {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          library.logStepWithScreenshot('Table is displayed with Values', 'Table is displayed with Values');
          flag = true;
          resolve(flag);
        } else {
          console.log('Table is not displayed with Values');
          library.logStep('Table is not displayed with Values');
          library.logStepWithScreenshot('Table is not displayed with values', 'Table is not displayed with values');
          flag = false;
          resolve(flag);
        }
      }).catch(function () {
        console.log('Table is not loaded');
        library.logStep('Table is not loaded');
        library.logStepWithScreenshot('Table is not loaded', 'Table is not loaded');
        flag = false;
        resolve(flag);
      });
    });
  }

  findElementsInTable(expectedColumnName, ElemenetName) {
    let flag = false;
    let colIndex, count = 0;
    let actualText;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath('.//table/thead/tr/th'));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text;
            if (actualText.includes(ElemenetName)) {
              count++;
            }
          });
        }).then(function () {
          if (count > 0) {
            library.logStep('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + ElemenetName);
            console.log('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + ElemenetName);
            library.logStepWithScreenshot('Data displayed in Column ' + colIndex + ' ' + expectedColumnName, 'findElementsInTable');
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            console.log('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            library.logStepWithScreenshot
              ('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText, 'FailfindElementsInTable');
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  searchColumnWithExpectedValue(expectedColumnName, ElemenetToSearch) {
    let flag = false;
    let colIndex = 0;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(tableHeaderAll));
      const tableValues = element(by.xpath(tableFirstVal));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const searchInput = element.all(by.xpath('.//tfoot/tr/th[' + colIndex + ']//input'));
        searchInput.clear();
        searchInput.sendKeys(ElemenetToSearch);
        dashboard.waitForPage();
        tableValues.getText().then(function (text) {
          if (text !== '') {
            console.log('Table is displayed with Values');
            library.logStep('Table is displayed with Values');
            library.logStepWithScreenshot('Table is displayed with Values', 'Table is displayed with Values');
            flag = true;
            resolve(flag);
          } else {
            console.log('Table is not displayed with Values');
            library.logStep('Table is not displayed with Values');
            library.logStepWithScreenshot('Table is not displayed with Values', 'Table is not displayed with Values');
            flag = false;
            resolve(flag);
          }
        }).catch(function () {
          console.log('Table is not displayed');
          library.logStep('Table is not displayed');
          library.logStepWithScreenshot('Table is not loaded', 'Table is not loaded');
          flag = false;
          resolve(flag);
        });
      });
    });
  }

  selectCheckbox() {
    let flag = false;
    return new Promise((resolve) => {
      const chb = element(by.xpath(checkBox));
      chb.isDisplayed().then(function () {
        library.clickJS(chb);
        console.log('Check box is selected for first row');
        library.logStep('Check box is selected for first row');
        library.logStepWithScreenshot('Check box is selected for first row', 'Check box is selected for first row');
        browser.wait(browser.ExpectedConditions.elementToBeSelected(chb), 15000, 'Checkbox is not clickable');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Check box is not displayed');
        console.log('Check box is not displayed');
        library.logStepWithScreenshot('Check box is not displayed', 'Check box is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnDeleteButton() {
    let flag = false;
    return new Promise((resolve) => {
      const deletebtn = element(by.xpath(deleteBtn));
      deletebtn.isDisplayed().then(function () {
        library.clickJS(deletebtn);
        console.log('Delete clicked for first row');
        library.logStep('Delete clicked for first row');
        library.logStepWithScreenshot('Delete clicked for first row', 'Delete clicked for first row');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Delete is not displayed');
        console.log('Delete is not displayed');
        library.logStepWithScreenshot('Delete is not displayed', 'Delete is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnDeleteConfirmButton() {
    let flag = false;
    return new Promise((resolve) => {
      const deleteconfirm = element(by.xpath(confirmOnDelete));
      deleteconfirm.isDisplayed().then(function () {
        library.click(deleteconfirm);
        console.log('Clicked Confirm on Delete');
        library.logStep('Clicked Confirm on Delete');
        library.logStepWithScreenshot('Clicked Confirm on Delete', 'Clicked Confirm on Delete');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Confirm is not displayed');
        console.log('Confirm is not displayed');
        library.logStepWithScreenshot('Confirm is not displayed', 'Confirm is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  isReagentDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath('.//div[contains(@id, "divReagent")][contains(@style, "display: block;")]'));
      ddl.isDisplayed().then(function () {
        console.log('Reagent drop down is displayed');
        library.logStep('Reagent drop down is displayed');
        library.logStepWithScreenshot('Reagent drop down is displayed', 'Reagent drop down is displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Reagent drop down is not displayed');
        console.log('Reagent drop down is not displayed');
        library.logStepWithScreenshot('Reagent drop down is not displayed', 'Reagent drop down is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyToastMessageDisplayed(expMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const toast = element(by.xpath(toastMessage));
      browser.wait(browser.ExpectedConditions.visibilityOf(toast), 40000, 'Toast Message Not Displayed');
      toast.isDisplayed().then(function () {
        toast.getText().then(function (actualMsg) {
          if (actualMsg.includes(expMessage)) {
            console.log('Toast Message is displayed: ' + actualMsg);
            library.logStep('Toast Message is displayed: ' + actualMsg);
            library.logStepWithScreenshot('Toast Message is displayed: ' + actualMsg, 'Toast Message is displayed: ' + actualMsg);
            flag = true;
            resolve(flag);
          } else {
            console.log('exp: ' + expMessage);
            console.log('act: ' + actualMsg);
            library.logStep('Expected Toast Message not displayed');
            console.log('Expected Toast Message not displayed');
            library.logStepWithScreenshot('Expected Toast Message not displayed', 'Expected Toast Message not displayed');
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Toast Message not displayed');
        console.log('Toast Message not displayed');
        library.logStepWithScreenshot('Toast Message not displayed', 'Toast Message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  searchColumnWaitUntilDataDisplayed(expectedColumnName, ElemenetToSearch) {
    let flag = false;
    let colIndex = 0;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(tableHeaderAll));
      const tableValues = element(by.xpath(tableFirstVal));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const searchInput = element.all(by.xpath('.//tfoot/tr/th[' + colIndex + ']//input'));
        searchInput.clear();
        searchInput.sendKeys(ElemenetToSearch);
        dashboard.waitForPage();
        tableValues.getText().then(function (text) {
          if (text !== '') {
            console.log('Table is displayed with Values');
            library.logStep('Table is displayed with Values');
            library.logStepWithScreenshot('Table is displayed with Values', 'Table is displayed with Values');
            flag = true;
            resolve(flag);
          } else {
            console.log('Table is not displayed with Values');
            library.logStep('Table is not displayed with Values');
            library.logStepWithScreenshot('Table is not displayed with Values', 'Table is not displayed with Values');
            flag = false;
            resolve(flag);
          }
        }).catch(function () {
          console.log('Table is not displayed');
          library.logStep('Table is not displayed');
          library.logStepWithScreenshot('Table is not loaded', 'Table is not loaded');
          flag = false;
          resolve(flag);
        });
      });
    });
  }

  isReagentDropdownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddl = element(by.xpath(reagDdl));
      browser.waitForAngular();
      ddl.getAttribute('aria-disabled').then(function (val) {
        if (val === 'false') {
          console.log('Reagent drop down is displayed');
          library.logStep('Reagent drop down is displayed');
          library.logStepWithScreenshot('Reagent drop down is displayed', 'Reagent drop down is displayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Reagent drop down is not displayed');
          console.log('Reagent drop down is not displayed');
          library.logStepWithScreenshot('Reagent drop down is not displayed', 'Reagent drop down is not displayed');
          flag = false;
          resolve(flag);
        }
      });
    });
  }


  selectReagent(reagentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      browser.executeScript('arguments[0].scrollIntoView();', ddl);
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Reagent Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + reagentName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Reagent Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Reagent selected: ' + reagentName);
        console.log('Reagent selected: ' + reagentName);
        library.logStepWithScreenshot('Reagent selected: ' + reagentName, 'Reagent selected: ' + reagentName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Reagent drop down not displayed');
          console.log('Reagent drop down not displayed');
          library.logStepWithScreenshot('Reagent drop down not displayed', 'Reagent drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  clickOnDeleteAgainstColumnValue(valueToSearch) {
    let flag = false;
    return new Promise((resolve) => {
      const delEle = element(by.xpath('.//td[contains(text(), "' + valueToSearch + '")]/parent::tr/td/a[contains(text(), "Delete")]'));
      delEle.isDisplayed().then(function () {
        library.clickJS(delEle);
        library.logStep('Delete Clicked against: ' + valueToSearch);
        console.log('Delete Clicked against: ' + valueToSearch);
        library.logStepWithScreenshot('Delete Clicked against: ' + valueToSearch, 'Delete Clicked against: ' + valueToSearch);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Delete not displayed for ' + valueToSearch);
        console.log('Delete not displayed for ' + valueToSearch);
        library.logStepWithScreenshot('Delete not displayed for ' + valueToSearch, 'Delete not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConfirmationMessage(expectedMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const msgEle = element(by.xpath(confirmDeleteMessage));
      dashboard.waitForScroll();
      msgEle.isDisplayed().then(function () {
        msgEle.getText().then(function (actualTxt) {
          if (actualTxt.includes(expectedMessage)) {
            library.logStep('Confirmation message displayed: ' + actualTxt);
            console.log('Confirmation message displayed: ' + actualTxt);
            library.logStepWithScreenshot
              ('Confirmation message displayed: ' + actualTxt, 'Confirmation message displayed: ' + actualTxt);
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Expected Confirmation message not displayed: ' + expectedMessage);
        console.log('Expected Confirmation message not displayed: ' + expectedMessage);
        library.logStepWithScreenshot('Expected Confirmation message not displayed: ' + expectedMessage, 'Expected Confirmation message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }


  clickOnDownloadToExcelReagentLots(filename) {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(downloadButton));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        library.clickAction(downloadBtnEle);
        browser.sleep(50000);
        console.log('Download To Excel button clicked');
        library.logStep('Download To Excel button clicked');
        library.logStepWithScreenshot('Download To Excel button clicked', 'clickOnDownloadToExcel');
      }).then(function () {
        const filePathName = downloadPath + '\\' + filename;
        const fileExist = fs.existsSync(filePathName);
        console.log('FileExist: ' + fileExist);
        if (fileExist) {
          console.log('File downloaded');
          library.logStep('File downloaded');
          flag = true;
          resolve(flag);
        } else {
          console.log('File download fail');
          library.logStep('File download fail');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnColumnToSort(expectedColumnName, sortType) {
    let flag = false;
    return new Promise((resolve) => {
      const colNameFound = element(by.xpath('.//thead/tr/th[contains(text(), "' + expectedColumnName + '")]'));
      library.click(colNameFound);
      colNameFound.getAttribute('aria-sort').then(function (text) {
        if (sortType === 'Ascending') {
          if (text.includes('descending')) {
            library.click(colNameFound);
            dashboard.waitForElement();
            console.log(expectedColumnName + ' clicked to sort in Ascending');
            library.logStep(expectedColumnName + ' clicked to sort in Ascending');
            library.logStepWithScreenshot(expectedColumnName + ' clicked to sort in Ascending', 'clickedSortAscending');
            flag = true;
            resolve(flag);
          } else {
            console.log(expectedColumnName + ' is already sorted in Ascending order');
            library.logStep(expectedColumnName + ' is already sorted in Ascending order');
            library.logStepWithScreenshot(expectedColumnName + ' is already sorted in Ascending order', 'AlreadyAscendingSorted');
            flag = true;
            resolve(flag);
          }
        } else if (sortType === 'Descending') {
          if (text.includes('ascending')) {
            library.click(colNameFound);
            dashboard.waitForElement();
            console.log(expectedColumnName + ' clicked to sort in Descending');
            library.logStep(expectedColumnName + ' clicked to sort in Descending');
            library.logStepWithScreenshot(expectedColumnName + ' clicked to sort in Descending', 'clickedSortDescending');
            flag = true;
            resolve(flag);
          } else {
            console.log(expectedColumnName + ' is already sorted in Descending order');
            library.logStep(expectedColumnName + ' is already sorted in Descending order');
            library.logStepWithScreenshot(expectedColumnName + ' is already sorted in Descending order', 'AlreadyDescendingSorted');
            flag = true;
            resolve(flag);
          }
        }
      }).catch(function () {
        console.log(expectedColumnName + ' not displayed');
        library.logStep(expectedColumnName + ' not displayed');
        library.logStepWithScreenshot(expectedColumnName + ' not displayed', 'ColumnNotDisplayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyAscendingSorting(expectedColumnName) {
    let flag = false;
    let colIndex = 0;
    let actualText;
    const tableValBefore = new Array;
    const tableValAfter = new Array;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(allHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text.toLocaleLowerCase();
            tableValBefore.push(actualText);
            tableValAfter.push(actualText);
          });
        });
      }).then(function () {
        tableValAfter.sort((a, b) => 0 - (a > b ? -1 : 1));
        if (JSON.stringify(tableValBefore) === JSON.stringify(tableValAfter)) {
          console.log('Pass: ' + expectedColumnName + ' is sorted in Ascending order');
          library.logStep('Pass: ' + expectedColumnName + ' is sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is sorted in Ascending order', expectedColumnName + ' is sorted in Ascending order');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          console.log('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is not sorted in Ascending order', expectedColumnName + ' is not sorted in Ascending order');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  verifyDescendingSorting(expectedColumnName) {
    let flag = false;
    let colIndex = 0;
    let actualText;
    const tableValBefore = new Array;
    const tableValAfter = new Array;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(allHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text.toLocaleLowerCase();
            tableValBefore.push(actualText);
            tableValAfter.push(actualText);
          });
        });
      }).then(function () {
        tableValAfter.sort((a, b) => 0 - (a > b ? 1 : -1));
        if (JSON.stringify(tableValBefore) === JSON.stringify(tableValAfter)) {
          console.log('Pass: ' + expectedColumnName + ' is sorted in Descending order');
          library.logStep('Pass: ' + expectedColumnName + ' is sorted in Descending order');
          library.logStepWithScreenshot(expectedColumnName + ' is sorted in Descending order', expectedColumnName + ' is sorted in Ascending order');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          console.log('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is not sorted in Ascending order', expectedColumnName + ' is not sorted in Ascending order');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  verifyAscendingSortingIntegerData(expectedColumnName) {
    let flag = false;
    let colIndex = 0;
    let actualText;
    const tableValBefore = new Array;
    const tableValAfter = new Array;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(allHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text.toLocaleLowerCase();
            tableValBefore.push(actualText);
            tableValAfter.push(actualText);
          });
        });
      }).then(function () {
        tableValAfter.sort((a, b) => 0 - (a - b ? -1 : 1));
        if (JSON.stringify(tableValBefore) === JSON.stringify(tableValAfter)) {
          console.log('Pass: ' + expectedColumnName + ' is sorted in Ascending order');
          library.logStep('Pass: ' + expectedColumnName + ' is sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is sorted in Ascending order', expectedColumnName + ' is sorted in Ascending order');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          console.log('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is not sorted in Ascending order', expectedColumnName + ' is not sorted in Ascending order');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  verifyDescendingSortingIntegerData(expectedColumnName) {
    let flag = false;
    let colIndex = 0;
    let actualText;
    const tableValBefore = new Array;
    const tableValAfter = new Array;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(allHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text.toLocaleLowerCase();
            tableValBefore.push(actualText);
            tableValAfter.push(actualText);
          });
        });
      }).then(function () {
        tableValAfter.sort((a, b) => 0 - (a - b ? 1 : -1));
        if (JSON.stringify(tableValBefore) === JSON.stringify(tableValAfter)) {
          console.log('Pass: ' + expectedColumnName + ' is sorted in Descending order');
          library.logStep('Pass: ' + expectedColumnName + ' is sorted in Descending order');
          library.logStepWithScreenshot(expectedColumnName + ' is sorted in Descending order', expectedColumnName + ' is sorted in Ascending order');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          console.log('Fail: ' + expectedColumnName + ' is not sorted in Ascending order');
          library.logStepWithScreenshot(expectedColumnName + ' is not sorted in Ascending order', expectedColumnName + ' is not sorted in Ascending order');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnEditAgainstColumnValue(valueToSearch) {
    let flag = false;
    return new Promise((resolve) => {
      const edtEle = element(by.xpath('.//td[contains(text(), "' + valueToSearch + '")]/parent::tr/td/a[contains(text(), "Edit")]'));
      edtEle.isDisplayed().then(function () {
        library.clickJS(edtEle);
        library.logStep('Edit Clicked against: ' + valueToSearch);
        console.log('Edit Clicked against: ' + valueToSearch);
        library.logStepWithScreenshot('Edit Clicked against: ' + valueToSearch, 'Edit Clicked against: ' + valueToSearch);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Edit not displayed for ' + valueToSearch);
        console.log('Edit not displayed for ' + valueToSearch);
        library.logStepWithScreenshot('Edit not displayed for ' + valueToSearch, 'Edit not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickNextButtonPagination() {
    let flag = false;
    return new Promise((resolve) => {
      const next = element(by.xpath(nextPageButton));
      next.isDisplayed().then(function () {
        library.clickJS(next);
        library.logStep('Next Button clicked');
        console.log('Next Button clicked');
        library.logStepWithScreenshot('Next Button clicked', 'Next Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Next Button Not displayed');
        console.log('Next Button Not displayed');
        library.logStepWithScreenshot('Next Button Not displayed', 'Next Button Not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickPreviosButtonPagination() {
    let flag = false;
    return new Promise((resolve) => {
      const prev = element(by.xpath(previousPageButton));
      prev.isDisplayed().then(function () {
        library.clickJS(prev);
        library.logStep('Previous Button clicked');
        console.log('Previous Button clicked');
        library.logStepWithScreenshot('Previous Button clicked', 'Previous Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Previous Button Not displayed');
        console.log('Previous Button Not displayed');
        library.logStepWithScreenshot('Previous Button Not displayed', 'Previous Button Not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickPageNumButtonPagination(pageNum) {
    let flag = false;
    return new Promise((resolve) => {
      const pageNumBtn = element(by.xpath('.//li[contains(@class, "paginate_button ")]/a[text() = "' + pageNum + '"]'));
      pageNumBtn.isDisplayed().then(function () {
        library.clickJS(pageNumBtn);
        library.logStep('Page Button clicked: ' + pageNum);
        console.log('Page Button clicked: ' + pageNum);
        library.logStepWithScreenshot('Page Button clicked: ' + pageNum, 'Page Button clicked: ' + pageNum);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Page ' + pageNum + ' Button Not displayed');
        console.log('Page ' + pageNum + ' Button Not displayed');
        library.logStepWithScreenshot('Page ' + pageNum + ' Button Not displayed', 'Page ' + pageNum + ' Button Not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  isPrevButtonEnabled() {
    let flag = false;
    return new Promise((resolve) => {
      const prev = element(by.xpath(previousPageButton));
      prev.isDisplayed().then(function () {
        prev.getAttribute('class').then(function (text) {
          if (text.includes('disabled')) {
            library.logStep('Previous Button is disabled');
            console.log('Previous Button is disabled');
            library.logStepWithScreenshot('Previous Button is disabled', 'Previous Button is disabled');
            flag = false;
            resolve(flag);
          } else {
            library.logStep('Previous Button is enabled');
            console.log('Previous Button is enabled');
            library.logStepWithScreenshot('Previous Button is enabled', 'Previous Button is enabled');
            flag = true;
            resolve(flag);
          }
        });
      });
    });
  }

  isNextButtonEnabled() {
    let flag = false;
    return new Promise((resolve) => {
      const next = element(by.xpath(nextPageButton));
      next.isDisplayed().then(function () {
        next.getAttribute('class').then(function (text) {
          if (text.includes('disabled')) {
            library.logStep('Next Button is disabled');
            console.log('Next Button is disabled');
            library.logStepWithScreenshot('Next Button is disabled', 'Next Button is disabled');
            flag = false;
            resolve(flag);
          } else {
            library.logStep('Next Button is enabled');
            console.log('Next Button is enabled');
            library.logStepWithScreenshot('Next Button is enabled', 'Next Button is enabled');
            flag = true;
            resolve(flag);
          }
        });
      });
    });
  }

  clickOnDownloadToExcelCodeList(filename) {
    let flag = false;
    return new Promise((resolve) => {
      const downloadBtnEle = element(by.xpath(downloadButton));
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      browser.executeScript('arguments[0].scrollIntoView();', downloadBtnEle);
      downloadBtnEle.isDisplayed().then(function () {
        browser.actions().mouseMove(downloadBtnEle).click().perform();
        browser.sleep(50000);
        console.log('Download To Excel button clicked');
        library.logStep('Download To Excel button clicked');
        library.logStepWithScreenshot('Download To Excel button clicked', 'clickOnDownloadToExcel');
      }).then(function () {
        const filePathName = downloadPath + '\\' + filename;
        const fileExist = fs.existsSync(filePathName);
        console.log('FileExist: ' + fileExist);
        if (fileExist) {
          console.log('File downloaded');
          library.logStep('File downloaded');
          flag = true;
          resolve(flag);
        } else {
          console.log('File download fail');
          library.logStep('File download fail');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  async readCSVCodeList(filename, expectedColumnName, expectedValue) {
    let flag, colfound, valfound = false;
    let colNum = 0;
    const columnNames = [];
    const filePathName = downloadPath + '\\' + filename;
    return new Promise((resolve) => {
      browser.sleep(3000);
      const fileExist = fs.existsSync(filePathName);
      if (fileExist) {
        const tempRead = fs.readFileSync(filePathName, 'utf16le');
        const readF = tempRead.replace(/^\uFEFF/, '');
        csvmodule.parse(readF, {
          complete: (csvValues) => {
            for (let i = 0; i <= csvValues.data[0].length - 1; i++) {
              columnNames.push(csvValues.data[0][i]);
            }
            for (const text of columnNames) {
              if (text.includes(expectedColumnName)) {
                colNum = columnNames.indexOf(text);
                colfound = true;
                break;
              } else {
                colNum = columnNames.indexOf(text);
                colfound = false;
                continue;
              }
            }
            for (let j = 1; j < csvValues.data.length - 1; j++) {
              const tempTxt = csvValues.data[j][colNum];
              const tempAct = tempTxt.trim();
              const actulaVal = tempAct.replace(/\s/g, '');
              const expected = expectedValue.replace(/\s/g, '');
              if (expected === actulaVal) {
                valfound = true;
                break;
              } else {
                valfound = false;
              }
            }
          }
        });
        if (colfound && valfound === true) {
          console.log('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          library.logStep('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          flag = true;
          resolve(flag);
        } else {
          flag = false;
          console.log('Exepcted Value: ' + valfound + ' and column: ' + colfound);
          console.log('Exepcted Value ' + expectedValue + ' and column ' + expectedColumnName + ' not found');
          library.logStep('Expected Value ' + expectedValue + ' and column ' + expectedColumnName + ' not found');
          resolve(flag);
        }
      } else {
        console.log('File not available');
      }
    });
  }

  clickOnCancelButton() {
    let flag = false;
    return new Promise((resolve) => {
      const cancel = element(by.xpath(cancelBtn));
      cancel.isDisplayed().then(function () {
        library.clickJS(cancel);
        console.log('Cancel Button clicked');
        library.logStep('Cancel Button clicked');
        library.logStepWithScreenshot('Cancel Button clicked', 'Cancel Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Cancel is not displayed');
        console.log('Cancel is not displayed');
        library.logStepWithScreenshot('Cancel is not displayed', 'Cancel is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnCloseButton() {
    let flag = false;
    return new Promise((resolve) => {
      const close = element(by.xpath(closeBtn));
      close.isDisplayed().then(function () {
        library.clickJS(close);
        console.log('Close Button clicked');
        library.logStep('Close Button clicked');
        library.logStepWithScreenshot('Close Button clicked', 'Close Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Close is not displayed');
        console.log('Close is not displayed');
        library.logStepWithScreenshot('Close is not displayed', 'Close is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnCloseXButton() {
    let flag = false;
    return new Promise((resolve) => {
      const close = element(by.xpath(closeXBtn));
      close.isDisplayed().then(function () {
        library.clickJS(close);
        console.log('Close X Button clicked');
        library.logStep('Close X Button clicked');
        library.logStepWithScreenshot('Close X Button clicked', 'Close X Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Close X is not displayed');
        console.log('Close X is not displayed');
        library.logStepWithScreenshot('Close X is not displayed', 'Close X is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickReloadButton() {
    let flag = false;
    return new Promise((resolve) => {
      const reload = element(by.xpath(reloadTable));
      reload.isDisplayed().then(function () {
        library.clickJS(reload);
        console.log('Reload Button clicked');
        library.logStep('Reload Button clicked');
        library.logStepWithScreenshot('Reload Button clicked', 'Reload Button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Reload is not displayed');
        console.log('Reload is not displayed');
        library.logStepWithScreenshot('Reload is not displayed', 'Reload is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOkOnWarning() {
    let flag = false;
    return new Promise((resolve) => {
      const okBtn = element(by.xpath(warningOk));
      okBtn.isDisplayed().then(function () {
        library.clickJS(okBtn);
        console.log('Warning Ok button clicked');
        library.logStep('Warning Ok button clicked');
        library.logStepWithScreenshot('Warning Ok button clicked', 'Warning Ok button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Warning not displayed');
        library.logStep('Warning not displayed');
        library.logStepWithScreenshot('Warning not displayed', 'Warning not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  isColumnDisplayed(expectedColumnName) {
    let flag, found = false;
    const colMap = new Map();
    let colnameVal;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(allHeaders));
      colNamesList.isDisplayed().then(function () {
        colNamesList.each(function (colname, index) {
          colname.getText().then(function (colName) {
            colMap.set(index, colName);
          });
        });
      }).then(function () {
        for (colnameVal of colMap.values()) {
          if (colnameVal.includes(expectedColumnName)) {
            found = true;
            break;
          } else {
            found = false;
          }
        }
      }).then(function () {
        if (found === true) {
          library.logStep('Column is displayed: ' + colnameVal);
          console.log('Column is displayed: ' + colnameVal);
          library.logStepWithScreenshot('Expected Colum Displayed' + expectedColumnName, 'Expected Colum Displayed' + expectedColumnName);
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Column is not displayed: ' + expectedColumnName);
          console.log('Column is not displayed: ' + expectedColumnName);
          library.logStepWithScreenshot('Column is not displayed: ' + expectedColumnName, 'Column is not displayed: ' + expectedColumnName);
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
