import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../../../utils/browserUtil';
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const pageHeader = './/h2[text()="WebConnect Transformer Administration"]';
const manageSystemTransformersRadioButton = 'radio1';
const manageSystemTransformersLabel = './/input[@id="radio1"]/following-sibling::label[text()="Manage System Transformers"]';
const manageCustomerTransformerRadioButton = 'radio2';
const manageCustomerTransformerLabel = './/input[@id="radio2"]/following-sibling::label[text()="Manage Customer Transformers"]';
const goButton = 'btnGo';
const MSTHeader = './/h2[text()="WebConnect Transformer Administration - Manage System Transformers"]';
const MCTHeader = './/h2[text()="WebConnect Transformer Administration - Manage Customer Transformers"]';
const TransformersInstalledTabActive = './/button[@id="btnTab1"][contains(@class,"active")][text()="Transformers Installed"]';
const TransformersReadyToInstallTab = './/button[@id="btnTab2"][text()="Transformers Ready to Install"]';
const TransformersLabListTabActive = './/button[@id="btnTab3"][contains(@class,"active")][text()="Transformer Lab List"]';
const transformerLabelTLLTab = './/label[@id="lblTransformer"]';
const accountNumberTextBox = './/input[@id="txtAccountNumber"]';
const retrieveTransformersButton = './/button[@id="btnRetrieve"]';

export class TransformerAdministrator {
  static labCount: string;
  static transformerName: string;

  verifyPageHeader() {
    let flag = false;
    return new Promise((resolve) => {
      const pageHdr = element(by.xpath(pageHeader));
      pageHdr.isDisplayed().then(function () {
        console.log('WebConnect Transformer Administration header is displayed');
        library.logStepWithScreenshot('WebConnect Transformer Administration header is displayed', 'headerVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('WebConnect Transformer Administration header is not displayed');
        library.logStep('WebConnect Transformer Administration header is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyRadioButtons() {
    let flag = false;
    return new Promise((resolve) => {
      const radiobtn1 = element(by.id(manageSystemTransformersRadioButton));
      const radiobtn2 = element(by.id(manageCustomerTransformerRadioButton));
      const label1 = element(by.xpath(manageSystemTransformersLabel));
      const label2 = element(by.xpath(manageCustomerTransformerLabel));
      radiobtn1.isDisplayed().then(function () {
        console.log('Manage System Transformers Radio Button is displayed');
        library.logStep('Manage System Transformers Radio Button is displayed');
        radiobtn2.isDisplayed().then(function () {
          console.log('Manage Customer Transformers Radio Button is displayed');
          library.logStep('Manage Customer Transformers Radio Button is displayed');
          label1.isDisplayed().then(function () {
            console.log('Manage System Transformers Label is displayed');
            library.logStep('Manage System Transformers Label is displayed');
            label2.isDisplayed().then(function () {
              console.log('Manage Customer Transformers Label is displayed');
              library.logStep('Manage Customer Transformers Label is displayed');
              flag = true;
              resolve(flag);
            });
          });
        });
      }).catch(function () {
        console.log('Radio Buttons are not displayed');
        library.logStep('Radio Buttons are not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyGoButton() {
    let flag = false;
    return new Promise((resolve) => {
      const goBtn = element(by.id(goButton));
      goBtn.isDisplayed().then(function () {
        console.log('Go Button is displayed');
        library.logStep('Go Button is displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Go Button is not displayed');
        library.logStep('Go Button is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickMSTRB() {
    let flag = false;
    return new Promise((resolve) => {
      const radiobtn1 = element(by.id(manageSystemTransformersRadioButton));
      radiobtn1.isDisplayed().then(function () {
        radiobtn1.click();
        console.log('Manage System Transformers Radio Button clicked');
        library.logStep('Manage System Transformers Radio Button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickMCTRB() {
    let flag = false;
    return new Promise((resolve) => {
      const radiobtn2 = element(by.id(manageCustomerTransformerRadioButton));
      radiobtn2.isDisplayed().then(function () {
        radiobtn2.click();
        console.log('Manage Customer Transformers Radio Button clicked');
        library.logStep('Manage Customer Transformers Radio Button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickGoButton() {
    let flag = false;
    return new Promise((resolve) => {
      const goBtn = element(by.id(goButton));
      goBtn.isDisplayed().then(function () {
        goBtn.click();
        console.log('Go Button is clicked');
        library.logStep('Go Button is clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyMSTHeader() {
    let flag = false;
    return new Promise((resolve) => {
      const MSTHdr = element(by.xpath(MSTHeader));
      MSTHdr.isDisplayed().then(function () {
        console.log('Header \'WebConnect Transformer Administration - Manage System Transformers\' is displayed');
        library.logStepWithScreenshot('Header \'WebConnect Transformer Administration - Manage System Transformers\' is displayed', 'MSTHeaderVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Header \'WebConnect Transformer Administration - Manage System Transformers\' is not displayed');
        library.logStep('Header \'WebConnect Transformer Administration - Manage System Transformers\' is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTIActive() {
    let flag = false;
    return new Promise((resolve) => {
      const TIActive = element(by.xpath(TransformersInstalledTabActive));
      TIActive.isDisplayed().then(function () {
        console.log('Transformer Installed Tab is Selected');
        library.logStepWithScreenshot('Transformer Installed Tab is Selected', 'TIActive');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Transformer Installed Tab is not Selected');
        library.logStep('Transformer Installed Tab is not Selected');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTRTI() {
    let flag = false;
    return new Promise((resolve) => {
      const TIActive = element(by.xpath(TransformersReadyToInstallTab));
      TIActive.isDisplayed().then(function () {
        console.log('Transformers Ready to Install Tab is displayed');
        library.logStepWithScreenshot('Transformers Ready to Install Tab is displayed', 'TRTIVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Transformers Ready to Install Tab is not displayed');
        library.logStep('Transformers Ready to Install Tab is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTITableHeaders() {
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['ID', 'System Name', 'Transformer Name', 'Display Name', 'Version', 'Installed', 'Count'];
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblInstalled"]//tr/th')).each(function (options) {
        options.getText().then(function (headerText) {
          actualList.push(headerText);
        });
      }).then(function () {
        // tslint:disable-next-line: forin
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

  verifyTITableBody() {
    const flag = true;
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblInstalled"]//tbody/tr')).each(function (rows) {
        rows.all(by.tagName('td')).each(function (columns) {
          columns.getText().then(function (columnText) {
            console.log('Transformer Installed Column Value: ' + columnText);
            library.logStep('Transformer Installed Column Value: ' + columnText);
          });
        });
      });
    });
  }

  clickTICount() {
    const flag = true;
    return new Promise((resolve) => {
      const countLink = element(by.xpath('.//table//tbody/tr/td[7]//a/u'));
      const transformerName = element(by.xpath('.//table//tbody/tr/td[7]//a/u//ancestor::tr/td[3]'));
      countLink.isDisplayed().then(function () {
        countLink.getText().then(function (countText) {
          transformerName.getText().then(function (transformerText) {
            TransformerAdministrator.labCount = countText;
            TransformerAdministrator.transformerName = transformerText;
            console.log('Count link for Transformer: ' + transformerText + ' with count: ' + countText + ' is clicked');
            library.logStep('Count link for Transformer: ' + transformerText + ' with count: ' + countText + ' is clicked');
            library.clickJS(countLink);
            resolve(flag);
          });
        });
      });
    });
  }

  verifyTLLActive() {
    let flag = false;
    return new Promise((resolve) => {
      const TLLActive = element(by.xpath(TransformersLabListTabActive));
      TLLActive.isDisplayed().then(function () {
        console.log('Transformer Lab List Tab is Selected');
        library.logStepWithScreenshot('Transformer Lab List Tab is Selected', 'TLLActive');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Transformer Lab List Tab is not Selected');
        library.logStep('Transformer Lab List Tab is not Selected');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTransformerNameLabel() {
    let flag = false;
    return new Promise((resolve) => {
      const transformerLabelTLL = element(by.xpath(transformerLabelTLLTab));
      transformerLabelTLL.isDisplayed().then(function () {
        transformerLabelTLL.getText().then(function (transformer) {
          if (transformer.includes(TransformerAdministrator.transformerName)) {
            console.log('Transformer Name Label is correctly displayed');
            library.logStep('Transformer Name Label is correctly displayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        console.log('Transformer Name Label is not correctly displayed');
        library.logStep('Transformer Name Label is not correctly displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTLLTableHeaders() {
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['Unity Account Number', 'Name', 'Creation Time', 'Last Modified'];
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblLablist"]//tr/th')).each(function (options) {
        options.getText().then(function (headerText) {
          actualList.push(headerText);
        });
      }).then(function () {
        // tslint:disable-next-line: forin
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

  verifyTLLRowsCountCorrect() {
    let flag = false;
    return new Promise((resolve) => {
      const bodyTLL = element.all(by.xpath('.//table[@id="tblLablist"]//tbody/tr'));
      bodyTLL.count().then(function (LC) {
        if (LC.toString() === TransformerAdministrator.labCount) {
          console.log('Number of Lab Rows are correctly displayed');
          library.logStep('Number of Lab Rows are correctly displayed');
          flag = true;
          resolve(flag);
        }
      }).catch(function () {
        console.log('Number of Lab Rows are not correctly displayed');
        library.logStep('Number of Lab Rows are not correctly displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickTRI() {
    let flag = false;
    return new Promise((resolve) => {
      const TRITab = element(by.xpath(TransformersReadyToInstallTab));
      TRITab.isDisplayed().then(function () {
        TRITab.click();
        console.log('Transformers Ready to Install Tab clicked');
        library.logStep('Transformers Ready to Install Tab clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyTRITableHeaders() {
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['ID', 'System Name', 'Transformer Name', 'Display Name', 'Version', 'Install'];
    return new Promise((resolve) => {
      dashboard.waitForPage();
      element.all(by.xpath('.//table[@id="tblUninstalled"]//tr/th')).each(function (options) {
        options.getText().then(function (headerText) {
          actualList.push(headerText);
        });
      }).then(function () {
        // tslint:disable-next-line: forin
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

  clickInstallTRI() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const TRIInstall = element(by.xpath('.//table[@id="tblUninstalled"]//tbody/tr/td[6]//a/u[text()="Install"]'));
      TRIInstall.isDisplayed().then(function () {
        TRIInstall.click();
        console.log('Install Button on Transformers Ready to Install Tab clicked');
        library.logStep('Install Button on Transformers Ready to Install Tab clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  getTRITableCount() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const TRICount = element.all(by.xpath('.//table[@id="tblUninstalled"]//tbody/tr'));
      TRICount.count().then(function (tableCount) {
        console.log('Transformers Ready To Install Table Count: ' + tableCount);
        library.logStep('Transformers Ready To Install Table Count: ' + tableCount);
        flag = true;
        resolve(flag);
      });
    });
  }

  enterAccountNumber(accountNumber) {
    const flag = false;
    return new Promise((resolve) => {
      const acctNumberTxtBx = element(by.xpath(accountNumberTextBox));
      acctNumberTxtBx.isDisplayed().then(function () {
        acctNumberTxtBx.sendKeys(accountNumber);
        console.log('Account Number Entered');
        library.logStep('Account Number Entered');
      });
    });
  }

  verifyMCTHeader() {
    let flag = false;
    return new Promise((resolve) => {
      const MSTHdr = element(by.xpath(MCTHeader));
      MSTHdr.isDisplayed().then(function () {
        console.log('Header \'WebConnect Transformer Administration - Manage Customer Transformers\' is displayed');
        library.logStepWithScreenshot('Header \'WebConnect Transformer Administration - Manage Customer Transformers\' is displayed', 'MSTHeaderVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Header \'WebConnect Transformer Administration - Manage Customer Transformers\' is not displayed');
        library.logStep('Header \'WebConnect Transformer Administration - Manage Customer Transformers\' is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyMCTTableHeaders() {
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['ID', 'Transformer', 'Display Name', 'Creation Time', 'Last Modified', 'Download TXML', 'Upload TXML'];
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblInstalled"]//tr/th')).each(function (options) {
        options.getText().then(function (headerText) {
          actualList.push(headerText);
        });
      }).then(function () {
        // tslint:disable-next-line: forin
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
        resolve(flag);
      });
    });
  }

  verifyRowsCountMCTTable() {
    let flag = false;
    return new Promise((resolve) => {
      const TRICount = element.all(by.xpath('.//table[@id="tblInstalled"]//tbody/tr'));
      TRICount.count().then(function (tableCount) {
        console.log('Manage Customer Transformers Table Count: ' + tableCount);
        library.logStep('Manage Customer Transformers Table Count: ' + tableCount);
        flag = true;
        resolve(flag);
      });
    });
  }

  clickDownloadTXML() {
    let flag = false;
    return new Promise((resolve) => {
      const download = element(by.xpath('.//td//a/u[text()="Download"]'));
      download.isDisplayed().then(function () {
        download.click();
        console.log('Download TXML clicked');
        library.logStep('Download TXML clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickUploadTXML() {
    let flag = false;
    return new Promise((resolve) => {
      const download = element(by.xpath('.//td//a/u[text()="Upload"]'));
      download.isDisplayed().then(function () {
        download.click();
        console.log('Upload TXML clicked');
        library.logStep('Upload TXML clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifySubMenusDisabled(subMenuName) {
    let flag = false;
    return new Promise((resolve) => {
      const selectSubMenu = element
      (by.xpath('.//ul[contains(@class, "dropdown-menu")]//li[@class="disabled"]/a[contains(text(), "' + subMenuName + '")]'));
      selectSubMenu.isDisplayed().then(function () {
        library.logStepWithScreenshot('Menu: ' + subMenuName + ' is disabled', 'subMenuDisabled');
        console.log('Menu: ' + subMenuName + ' is disabled');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Menu: ' + subMenuName + ' is not disabled');
        console.log('Menu: ' + subMenuName + ' is not disabled');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickRetrieveTransformersTRI() {
    let flag = false;
    return new Promise((resolve) => {
      const retrieveTransformersBtn = element(by.xpath(retrieveTransformersButton));
      retrieveTransformersBtn.isDisplayed().then(function () {
        retrieveTransformersBtn.click();
        console.log('Retrieve Transformers Button on Transformers Ready to Install Tab clicked');
        library.logStep('Retrieve Transformers Button on Transformers Ready to Install Tab clicked');
        flag = true;
        resolve(flag);
      });
    });
  }
}
