import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../../../utils/browserUtil';
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const hdrpageHeader = './/h2';
const lnkRetrieveLatestConfigs = './/u[contains(text(),"Retrieve latest configurations")]';
const tblConfigs = 'tblAllConfig';
const hdrMCPATFTSL = './/h2[text()="Migration Configuration Page: All tests for the selected lot"]';
const hdrMCPSML = './/h2[text()="Migration Configuration Page: Select Map List"]';
const btnContinueToMigrateTransformer = 'btnContinueMigration';
const btnContinueMigrationDisabled = './/button[@id="btnContinueMigration"][@disabled]';
const btnContinueMigrationEnabled = './/button[@id="btnContinueMigration"]';
const btnBackMCPATFTSL = './/button[text()="Back"]';
const ddSelectConfigs = 'cmbOption';
const optUnMapped = './/option[@value="unmapped"]';
const optAll = './/option[@value="all"]';
const btnInitiateMigration = './/button[@id="rr"][text()="Retrieve QC Data and Initiate Migration"]';
const msgMigrationStatus = './/h4/b[4]';
const icnLoader = './/div[@class="spinner"]';
const btnContinueToResultsRetrieval = 'btnContinue';

export class MigrationConfiguration {
  static unMappedControlCount: number = 0;
  static unMappedAnalytesCount: number;

  verifyPageHeader() {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      const pageHeader = element(by.xpath(hdrpageHeader));
      pageHeader.isDisplayed().then(function () {
        console.log('Migration Configuration Page: All lots header is displayed');
        library.logStepWithScreenshot('Migration Configuration Page: All lots header is displayed', 'headerVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Migration Configuration Page: All lots header is not displayed');
        library.logStep('Migration Configuration Page: All lots header is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickRetrieveLatestConfigsLink() {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      const RetrieveLatestConfigs = element(by.xpath(lnkRetrieveLatestConfigs));
      RetrieveLatestConfigs.isDisplayed().then(function () {
        RetrieveLatestConfigs.click();
        dashboard.waitForElement();
        console.log('Retrieve Latest Configuration Link clicked');
        library.logStepWithScreenshot('Retrieve Latest Configuration Link clicked', 'RetrieveLatestConfigsClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to click Retrieve Latest Configuration Link');
        library.logStep('Unable to click Retrieve Latest Configuration Link');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConfigTableDisplayed() {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      const Configs = element(by.id(tblConfigs));
      browser.wait(browser.ExpectedConditions.visibilityOf(Configs), 20000, 'Configs Table is not displayed');
      Configs.isDisplayed().then(function () {
        console.log('Configs Table is displayed');
        library.logStepWithScreenshot('Configs Table is displayed', 'ConfigDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Configs Table is not displayed');
        library.logFailStep('Configs Table is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConfigTableHeaders() {
    browser.ignoreSynchronization = true;
    let flag = true;
    const actualList: Array<string> = [];
    const expectedList: Array<string> = ['', 'Location', 'Department', 'Instrument', 'Lab Number', 'Product', 'Lot Number', 'Configuration Percent Completion', 'Edit'];
    return new Promise((resolve) => {
      const loader = element(by.xpath(icnLoader));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      element.all(by.xpath('.//table[@id="tblAllConfig"]//tr/th')).each(function (options) {
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
    browser.ignoreSynchronization = true;
    let flag = true;
    return new Promise((resolve) => {
      element.all(by.xpath('.//table[@id="tblAllConfig"]//tbody/tr')).each(function (rows) {
        rows.all(by.tagName('td')).each(function (columns) {
          columns.getText().then(function (columnText) {
            console.log('Column Value: ' + columnText);
            library.logStep('Column Value: ' + columnText);
          });
        });
      });
    });
  }

  verifyContinueMigrationDisabled() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const ContinueMigrationDisabled = element(by.xpath(btnContinueMigrationDisabled));
      ContinueMigrationDisabled.isDisplayed().then(function () {
        console.log('Continue Migration Button is disabled');
        library.logStepWithScreenshot('Continue Migration Button is disabled', 'ContinueMigrationDisabled');
        resolve(true);
      }).catch(function () {
        console.log('Continue Migration Button is enabled');
        library.logFailStep('Continue Migration Button is enabled');
        resolve(false);
      });
    });
  }

  selectUnMappedConfigsFromDropdown() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const SelectConfigs = element(by.id(ddSelectConfigs));
      SelectConfigs.isDisplayed().then(function () {
        console.log('Select Configurations Dropdown is displayed');
        browser.wait(browser.ExpectedConditions.elementToBeClickable(SelectConfigs), 50000, 'Dropdown not displayed');
        SelectConfigs.click();
        console.log('Dropdown clicked');
        library.logStepWithScreenshot('Dropdown clicked', 'DropdownClicked');
        const UnMapped = element(by.xpath(optUnMapped));
        UnMapped.isDisplayed().then(function () {
          UnMapped.click();
          console.log('Unmapped Configurations option clicked');
          library.logStepWithScreenshot('Unmapped Configurations option clicked', 'UnmappedConfigurationsOptionClicked');
        });
      });
    });
  }

  selectAllConfigsFromDropdown() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const SelectConfigs = element(by.id(ddSelectConfigs));
      SelectConfigs.isDisplayed().then(function () {
        console.log('Select Configurations Dropdown is displayed');
        browser.wait(browser.ExpectedConditions.elementToBeClickable(SelectConfigs), 50000, 'Dropdown not displayed');
        SelectConfigs.click();
        console.log('Dropdown clicked');
        library.logStepWithScreenshot('Dropdown clicked', 'DropdownClicked');
        const All = element(by.xpath(optAll));
        All.isDisplayed().then(function () {
          All.click();
          console.log('All Configurations option clicked');
          library.logStepWithScreenshot('All Configurations option clicked', 'AllConfigurationsOptionClicked');
        });
      });
    });
  }

  selectFirstUnMappedControlForMapping() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      let selectButton = element(by.xpath('.//table[@id="tblUnmappedConfig"]//tbody/tr[1]/td[8]/a'));
      selectButton.isDisplayed().then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(selectButton), 100000, 'Select Button is not clickable');
        selectButton.click();
        console.log('Select Button for the unmapped control is clicked.');
        library.logStepWithScreenshot('Select Button for the unmapped control is clicked.', 'unMappedControlClicked');
        dashboard.waitForPage();
        resolve(true);
      }).catch(function () {
        console.log('Select Button is not visible.');
        library.logFailStep('Select Button is not visible.');
        resolve(true);
      });
    });
  }

  clickEditButtonForFirstAnalyte() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const MCPATFTSL = element(by.xpath(hdrMCPATFTSL));
      browser.wait(browser.ExpectedConditions.visibilityOf(MCPATFTSL), 100000, 'MCPATFTSL Page not visible');
      MCPATFTSL.isDisplayed().then(function () {
        console.log('Migration Configuration Page: All tests for the selected lot is displayed.');
        library.logStepWithScreenshot('Migration Configuration Page: All tests for the selected lot is displayed.', 'MCPATFTSLDisplayed');
        let editButton = element(by.xpath('.//table[@id="tblUnmappedConfigMap"]//tbody/tr[1]/td[10]/a'));
        editButton.isDisplayed().then(function () {
          console.log('Edit Button is displayed.');
          library.logStepWithScreenshot('Edit Button is displayed.', 'EditButtonDisplayed');
          browser.wait(browser.ExpectedConditions.elementToBeClickable(editButton), 100000, 'Edit Button is not clickable');
          editButton.click();
          library.logStep('Edit Button for the first analyte clicked');
          dashboard.waitForPage();
          resolve(true);
        }).catch(function () {
          library.logStepWithScreenshot("The Reagent Lot column is displayed","ReagentLotColumnDisplayedMCPATFTSL");
          let editMicroslideAnalyteButton = element(by.xpath('.//table[@id="tblUnmappedConfigMap"]//tbody/tr[1]/td[11]/a'));
          editMicroslideAnalyteButton.isDisplayed().then(function () {
            console.log('Edit Button for Microslide Analyte is displayed.');
            library.logStepWithScreenshot('Edit Button for Microslide Analyte is displayed.', 'EditMSAButtonDisplayed');
            browser.wait(browser.ExpectedConditions.elementToBeClickable(editMicroslideAnalyteButton), 100000, 'Edit Button for Microslide Analyte is not clickable');
            editMicroslideAnalyteButton.click();
            library.logStep('Edit Button for the first Microslide Analyte clicked');
            dashboard.waitForPage();
            resolve(true);
          });
        })
      }).catch(function () {
        console.log('Edit Button is not displayed.');
        library.logFailStep('Edit Button is not displayed.');
      });
    });
  }

  selectFirstMappingOption() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const MCPSML = element(by.xpath(hdrMCPSML));
      browser.wait(browser.ExpectedConditions.visibilityOf(MCPSML), 100000, 'MCPSML Page not visible');
      MCPSML.isDisplayed().then(function () {
        console.log('Migration Configuration Page: Select Map List Page is displayed');
        library.logStepWithScreenshot('Migration Configuration Page: Select Map List Page is displayed', 'MCPSMLDisplayed');
        let selectButtonNew = element(by.xpath('.//table[@id="tblAllConfigMapDefine"]//tbody/tr[1]/td[6]/a'));
        selectButtonNew.isDisplayed().then(function () {
          browser.wait(browser.ExpectedConditions.elementToBeClickable(selectButtonNew), 100000, 'Select Button is not clickable');
          selectButtonNew.click();
          console.log('Select Button is clicked');
          library.logStepWithScreenshot('Select Button is clicked', 'SelectButtonClicked');
          dashboard.waitForPage();
          resolve(true);
        }).catch(function () {
          library.logStepWithScreenshot("The Reagent Lot column is displayed","ReagentLotColumnDisplayedMCPSML");
          let selectButtonMicroSlideAnalyte = element(by.xpath('.//table[@id="tblAllConfigMapDefine"]//tbody/tr[1]/td[7]/a'));
          selectButtonMicroSlideAnalyte.isDisplayed().then(function () {
            browser.wait(browser.ExpectedConditions.elementToBeClickable(selectButtonMicroSlideAnalyte), 100000, 'Select Button for Microslide Analyte is not clickable');
            selectButtonMicroSlideAnalyte.click();
            console.log('Select Button for Microslide Analyte is clicked');
            library.logStepWithScreenshot('Select Button for Microslide Analyte is clicked', 'SelectButtonClicked');
            dashboard.waitForPage();
            resolve(true);
          });
        });
      }).catch(function () {
        console.log('There is no Config available for Mapping. Please create the required mapping in QCP Central & Resume the Migration Process.');
        library.logFailStep('There is no Config available for Mapping. Please create the required mapping in QCP Central & Resume the Migration Process.');
        resolve(false);
      });
    });
  }

  clickBackButtonMCPATFTSL() {
    browser.waitForAngularEnabled(false);
    return new Promise(function (resolve) {
      const MCPATFTSL = element(by.xpath(hdrMCPATFTSL));
      browser.wait(browser.ExpectedConditions.visibilityOf(MCPATFTSL), 100000, 'MCPATFTSL Page not visible');
      let BackMCPATFTSL = element(by.xpath(btnBackMCPATFTSL));
      BackMCPATFTSL.isDisplayed().then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(BackMCPATFTSL), 100000, 'Back Button is not clickable');
        BackMCPATFTSL.click();
        console.log('Back Buttin on MCPATFTSL page clicked to Navigate back to the MCPAL page');
        library.logStepWithScreenshot('Back Buttin on MCPATFTSL page clicked to Navigate back to the MCPAL page', 'backClicked');
        dashboard.waitForPage();
        resolve(true);
      }).catch(function () {
        console.log('Back Button is not displayed.');
        library.logFailStep('Back Button is not displayed.');
        resolve(false);
      });
    });
  }

  verifyContinueToMigrateTransformersIsClickable() {
    let flag = true;
    return new Promise((resolve) => {
      const ContinueToMigrateTransformer = element(by.id(btnContinueToMigrateTransformer));
      ContinueToMigrateTransformer.isEnabled().then(function () {
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

  clickContinueToMigrateTransformersButton() {
    let flag = true;
    return new Promise((resolve) => {
      const ContinueToMigrateTransformer = element(by.id(btnContinueToMigrateTransformer));
      ContinueToMigrateTransformer.isEnabled().then(function () {
        console.log('Continue To Migrate Transformer Button is clickable');
        ContinueToMigrateTransformer.click();
        library.logStepWithScreenshot('Continue To Migrate Transformer Button is clicked', 'CTMTClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Continue To Migrate Transformer Button is not clickable');
        library.logFailStep('Continue To Migrate Transformer Button is not clickable');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickbtnContinueToResultsRetrievalButton() {
    browser.waitForAngularEnabled(false);
    let flag = true;
    return new Promise((resolve) => {
      const ContinueMigrationEnabled = element(by.id(btnContinueToResultsRetrieval));
      ContinueMigrationEnabled.isEnabled().then(function () {
        ContinueMigrationEnabled.click();
        dashboard.waitForPage();
        console.log('Continue to Results Retrieval Button is clicked');
        library.logStepWithScreenshot('Continue to Results Retrieval Button is clicked', 'ContinueContinueToResultsRetrievalButtonclicked');
        resolve(flag);
      });
    });
  }

  clickContinueMigrationButton() {
    browser.waitForAngularEnabled(false);
    let flag = true;
    return new Promise((resolve) => {
      const ContinueMigrationEnabled = element(by.xpath(btnContinueMigrationEnabled));
      ContinueMigrationEnabled.isEnabled().then(function () {
        ContinueMigrationEnabled.click();
        dashboard.waitForPage();
        console.log('Continue Migration Button is clicked');
        library.logStepWithScreenshot('Continue Migration Button is clicked', 'ContinueMigrationButtonclicked');
        resolve(flag);
      });
    });
  }

  // Migration QC Data Transfer Page
  clickInitiateMigrationButton() {
    browser.waitForAngularEnabled(false);
    let flag = true;
    return new Promise((resolve) => {
      const InitiateMigration = element(by.xpath(btnInitiateMigration));
      InitiateMigration.isDisplayed().then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(InitiateMigration), 50000, 'InitiateMigration Button is not clickable');
        InitiateMigration.click();
        console.log('Continue Migration Button is clicked');
        library.logStepWithScreenshot('Continue Migration Button is clicked', 'ContinueMigrationButtonclicked');
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

  verifyMigrationStatusMessage() {
    browser.waitForAngularEnabled(false);
    let flag = true;
    return new Promise((resolve) => {
      const MigrationStatus = element(by.xpath(msgMigrationStatus));
      browser.wait(browser.ExpectedConditions.visibilityOf(MigrationStatus), 100000, 'Message is not displayed');
      MigrationStatus.isDisplayed().then(function () {
        MigrationStatus.getText().then(function (txt) {
          if (txt.includes('resultsRequested')) {
            console.log('Migration is initiated');
            library.logStepWithScreenshot('Migration is initiated', 'MigrationInitiated');
            resolve(flag);
          }
          else {
            console.log('Migration is not initiated');
            library.logFailStep('Migration is not initiated');
            resolve(flag);
          }
        });
      });
    });
  }
}
