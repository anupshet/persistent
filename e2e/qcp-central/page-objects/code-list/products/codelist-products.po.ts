/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addProductPopup = './/h4[contains(text(), "Add New Product")]';
const addProductsButton = './/button[contains(text(), "Add New Product")]';
const addProductsName = '(.//input[contains(@id, "Name")])[1]';
const addProductsAddButton = './/button[contains(@type, "submit")]';
const mainTitle = './/h2[contains(text(), "Products")]';
const infoTitle = './/p[contains(text(), "Below is the current Product Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const manufacturerDropdown = '//label[@for="ddlManufacturer"]/following-sibling::div//select[@id="ddlManufacturer"]';
const productsPage = '//a[contains(@href, "/Products/Products")]';
const addProductManufacturer = '//button[@data-id="ManufacturerId"]';
const addProductMatrix = '//button[@data-id="MatrixId"]';

export class Products {
  goToProducts() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(productsPage));
      clickBtn.isDisplayed().then(function() {
        library.clickJS(clickBtn);
        console.log('Products submenu option clicked');
        library.logStep('Products submenu option  clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Products submenu not displayed');
        library.logStep('Products submenu not displayed');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOnAddProducts() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addProductsButton));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add new Products button clicked');
        library.logStep('Add new Products button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Products button not displayed');
        library.logStep('Products button not displayed');
        flag = true;
        resolve(flag);
      });
    });
  }

  addProducts(pname, matrixname, manufacturername) {
    let flag = false;
    return new Promise((resolve) => {
      const addPopup = element(by.xpath(addProductPopup));
      addPopup.isDisplayed().then(function() {
        const addProdManufacturerDrpdwn = element(by.xpath(addProductManufacturer));
        const addProdMatrixDrpdwn = element(by.xpath(addProductMatrix));
        const nameInput = element(by.xpath(addProductsName));
        browser.wait(browser.ExpectedConditions.visibilityOf(addProdManufacturerDrpdwn), 25000, 'Manufacurer dropdown not displayed');
        addProdManufacturerDrpdwn.isDisplayed().then(function() {
          library.clickJS(addProdManufacturerDrpdwn);
          const manufacturerName = element(by.xpath
          ('.//button[@data-id="ManufacturerId"]/following-sibling::div//span[contains(text(),"' + manufacturername + '")]'));
          library.clickJS(manufacturerName);
          library.logStep('Manufacturer Selected: ' + manufacturerName);
          console.log('Manufacturer Selected: ' + manufacturerName);
        }).then(function() {
          addProdMatrixDrpdwn.isDisplayed().then(function() {
            library.clickJS(addProdMatrixDrpdwn);
            const matrixName = element
            (by.xpath('//button[@data-id="MatrixId"]/following-sibling::div//span[contains(text(),"' + matrixname + '")]'));
            library.clickJS(matrixName);
            library.logStep('Matrix Selected: ' + matrixname);
            console.log('Matrix Selected: ' + matrixname);
          });
        }).then(function() {
          nameInput.isDisplayed().then(function() {
            nameInput.clear();
            nameInput.sendKeys(pname);
            library.logStep('Add product button clicked');
            library.logStep('Added Product: ' + pname);
            console.log('Added Product: ' + pname);
            flag = true;
            resolve(flag);
          });
        });
      }).catch(function() {
        library.logStep('Add product popup not displayed');
        console.log('Add product popup not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddOnAddProductsPopup() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(addProductsAddButton));
      clickAdd.isDisplayed().then(function() {
        library.click(clickAdd);
        console.log('Add new Products button clicked');
        library.logStep('Add new Products button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add button not displayed');
        library.logStep('Add button not displayed');
        flag = true;
        resolve(flag);
      });
    });
  }


  editProductsName(pname) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(addProductsName));
      nameInput.isDisplayed().then(function() {
        nameInput.clear();
        nameInput.sendKeys(pname);
        library.logStep('Product Name Edited: ' + pname);
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyProductsAdded(expectedProducts) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath('.//table[@id =  "tblProduct"]//tbody/tr[1]'));
      dataTable.isDisplayed().then(function () {
        const ProductsEle = element(by.xpath('.//tr/th[@aria-controls = "tblProduct"]/ancestor::table//tbody/tr/td[2]'));
        ProductsEle.getText().then(function (actualTxt) {
          const actualProducts = actualTxt.trim();
          console.log('expected ' + expectedProducts + 'actualProducts' + actualProducts);
          if (expectedProducts === actualProducts) {
            library.logStep('Products is displayed in the table: ' + actualProducts);
            console.log('Products is displayed in the table: ' + actualProducts);
            library.logStepWithScreenshot('ProductsDisplayed', 'ProductsDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const maptest = new Map<string, string>();
      maptest.set('Header Displayed', mainTitle);
      maptest.set('Manufacturer Dropdown', manufacturerDropdown);
      maptest.set('Sub Header Displayed', infoTitle);
      maptest.set('Show Default Displayed', showEntriesDdl);
      maptest.set('Search Displayed', searchBox);
      maptest.set('Table Displayed', tableFirstVal);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        maptest.forEach(function (key, value) {
          const ele = element(by.xpath(key));
          ele.isDisplayed().then(function () {
            console.log(value + ' is displayed.');
            library.logStep(value + ' is displayed.');
            count++;
          }).catch(function () {
            library.logStep(value + ' is not displayed.');
            console.log(value + ' is not displayed.');
          });
        });
      }).then(function() {
        if (maptest.size === count) {
          console.log('Product Page UI Verified');
          library.logStepWithScreenshot('Product Page UI Verified', 'Product Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Product page UI not verified');
          library.logStep('Product page UI not verified');
          library.logStepWithScreenshot('Product Page UI not Verified', 'Product Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
