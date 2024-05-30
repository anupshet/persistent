import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../../../utils/browserUtil';
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const hdrpageHeader = './/h2[text()="Migrate Transformers"]';
const btnContinue = 'btnContinue';
const btnMigrateTransformers = './/button[text()="Migrate Selected Transformers"]';
const btnCheckTransformerMigrationStatus = './/button[contains(text(),"Check Migration Status")]';
const ddToBeMigrated = 'cmb1';
const ddToBeMigrated2 = 'cmb2';
const lblStatus = 'lblSatus';

export class MigrateTransformers {

  verifyPageHeader() {
    let flag = false;
    return new Promise((resolve) => {
      const pageHeader = element(by.xpath(hdrpageHeader));
      pageHeader.isDisplayed().then(function () {
        console.log('Migrate Transformers Page header is displayed');
        library.logStepWithScreenshot('Migrate Transformers Page header is displayed', 'headerVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Migrate Transformers Page header is not displayed');
        library.logStep('Migrate Transformers Page header is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConfigTableHeaders() {
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['', 'Customer Display Name', 'Legacy Transformer', 'Unity Next Transformer', 'To be Migrated'];
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblWCTransformer"]//tr/th')).each(function (options) {
        options.getText().then(function (headerText) {
          actualList.push(headerText);
        });
      }).then(function () {
        for (const x in expectedList) {
          console.log(actualList[x] + ' ' + expectedList[x]);
          library.logStep(actualList[x] + ' ' + expectedList[x]);
          if (actualList[x] !== expectedList[x]) {
            flag = false;
            console.log('Incorrect Column names are displayed');
            library.logStep('Incorrect Column names are displayed');
            resolve(flag);
          }
        }
      });
      resolve(flag);
    });
  }

  verifyConfigTableBody() {
    let flag = true;
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblWCTransformer"]//tbody/tr')).each(function (rows) {
        rows.all(by.tagName('td')).each(function (columns) {
          columns.getText().then(function (columnText) {
            console.log('Column Value: ' + columnText);
            library.logStep('Column Value: ' + columnText);
          });
        });
      });
    });
  }

  selectToBeMigratedOption(toBeMigrated) {
    let flag = true;
    return new Promise((resolve) => {
      const ToBeMigrated = element(by.id(ddToBeMigrated));
      ToBeMigrated.isDisplayed().then(function () {
        ToBeMigrated.click();
        console.log('To Be Migrated dropdown clicked');
        library.logStepWithScreenshot('To Be Migrated dropdown clicked', 'TBMDDClicked');
        const option = element(by.xpath('.//option[@value="' + toBeMigrated + '"]'));
        option.isDisplayed().then(function () {
          option.click();
          console.log('Option ' + toBeMigrated + ' is selected');
          library.logStepWithScreenshot('Option ' + toBeMigrated + ' is selected', 'Option' + toBeMigrated);
          resolve(flag);
        });
      }).catch(function () {
        console.log('Unable to select To be Migrated value' + toBeMigrated);
        library.logFailStep('Unable to select To be Migrated value' + toBeMigrated);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyMigrateTransformerButtonIsClickable() {
    let flag = true;
    return new Promise((resolve) => {
      const MigrateTransformers = element(by.xpath(btnMigrateTransformers));
      MigrateTransformers.isEnabled().then(function () {
        console.log('Continue To Migrate Transformer Button is enabled');
        library.logStepWithScreenshot('Continue To Migrate Transformer Button is enabled', 'CTMTEnabled');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Continue To Migrate Transformer Button is not enabled');
        library.logFailStep('Continue To Migrate Transformer Button is not enabled');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickMigrateTransformersButton() {
    let flag = true;
    return new Promise((resolve) => {
      const MigrateTransformers = element(by.xpath(btnMigrateTransformers));
      MigrateTransformers.isEnabled().then(function () {
        MigrateTransformers.click();
        console.log('Migrate Selected Transformers Button is clicked');
        library.logStepWithScreenshot('Migrate Selected Transformers Button is clicked', 'MigrateTransformersButtonClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        return browser.switchTo().alert().then(function (alert) {
          alert.accept();
          console.log('Alert accepted');
          library.logStepWithScreenshot('Alert accepted', 'AlertAccepted');
          flag = true;
          resolve(flag);
        });
      });
    });
  }

  verifyStatus() {
    let flag = true;
    return new Promise((resolve) => {
      const Status = element(by.id(lblStatus));
      Status.isDisplayed().then(function () {
        Status.getText().then(function (txt) {
          console.log('Transformer Migration Status is ' + txt);
          library.logStepWithScreenshot('Transformer Migration Status is ' + txt, 'Status' + txt);
          flag = true;
          resolve(flag);
        });
      }).catch(function () {
        console.log('Transformer Migration Status is not displayed');
        library.logFailStep('Transformer Migration Status is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickCheckTransformerMigrationStatusButtonTwice() {
    let flag = false;
    return new Promise((resolve) => {
      const CheckTransformerMigrationStatus = element(by.xpath(btnCheckTransformerMigrationStatus));
      // browser.wait(browser.ExpectedConditions.visibilityOf(CheckTransformerMigrationStatus), 50000, 'Button is not displayed');
      browser.sleep(60000);
      CheckTransformerMigrationStatus.isDisplayed().then(function () {
        CheckTransformerMigrationStatus.click();
        console.log('Check Transformer Migration Status Button is clicked');
        library.logStepWithScreenshot('Check Transformer Migration Status Button is clicked', 'CheckTransformerMigrationStatusClicked1');
        browser.sleep(60000);
        CheckTransformerMigrationStatus.isDisplayed().then(function () {
          CheckTransformerMigrationStatus.click();
          console.log('Check Transformer Migration Status Button is clicked');
          library.logStepWithScreenshot('Check Transformer Migration Status Button is clicked again', 'CheckTransformerMigrationStatusClicked2');
          browser.sleep(60000);
          CheckTransformerMigrationStatus.isDisplayed().then(function () {
            CheckTransformerMigrationStatus.click();
            console.log('Check Transformer Migration Status Button is clicked');
            library.logStepWithScreenshot('Check Transformer Migration Status Button is clicked again', 'CheckTransformerMigrationStatusClicked2');
            browser.sleep(60000);
          }).catch(function () {
            console.log('Transformer Migration Complete');
            library.logStepWithScreenshot('Transformer Migration Complete', 'TransformerMigrationComplete');
            flag = true;
            resolve(flag);
          });
        }).catch(function () {
          console.log('Transformer Migration Complete');
          library.logStepWithScreenshot('Transformer Migration Complete', 'TransformerMigrationComplete');
          flag = true;
          resolve(flag);
        });
      }).catch(function () {
        console.log('Transformer Migration Complete');
          library.logStepWithScreenshot('Transformer Migration Complete', 'TransformerMigrationComplete');
        flag = true;
        resolve(flag);
      });
    });
  }
}
