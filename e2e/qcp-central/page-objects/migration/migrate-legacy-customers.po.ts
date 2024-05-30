import { browser, by, element } from 'protractor';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const hdrpageHeader = './/h2';
const txtbxPrimaryLabNumber = 'primaryLabNumber';
const btnCheck = 'btnCheckMigrationStatus';
const btnContinue = 'btnContinue';
const msgAccountCreationPendingStatus = './/h4';
const msgAccountCreatedStatus = './/h4/b[4]';
const msgMigrationComplete = './/h4[text()="Migration has completed for this primary lab number. Please contact the software development team with any issues."]';
const msgMigrationInProgress = './/h4/b[4]';
const msgMigrationFailure = './/h4[text()="Migration has completed for this primary lab number and the TXML mappings migration to UnityNext is failed. Please contact the software development team."]';

export class MigrateLegacyCustomers {
  static labCount: string;
  static transformerName: string;

  verifyPageHeader() {
    let flag = false;
    return new Promise((resolve) => {
      const pageHeader = element(by.xpath(hdrpageHeader));
      pageHeader.isDisplayed().then(function () {
        console.log('Welcome to Migration Process header is displayed');
        library.logStepWithScreenshot('Welcome to Migration Process header header is displayed', 'headerVerified');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Welcome to Migration Process header is not displayed');
        library.logStep('Welcome to Migration Process header is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  enterPrimaryLabNumber(pln) {
    let flag = false;
    return new Promise((resolve) => {
      const PrimaryLabNumber = element(by.id(txtbxPrimaryLabNumber));
      PrimaryLabNumber.isDisplayed().then(function () {
        PrimaryLabNumber.sendKeys(pln);
        console.log('Primary Lab Number entered');
        library.logStepWithScreenshot('Primary Lab Number entered', 'plnEntered');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to enter Primary Lab Number');
        library.logStep('Unable to enter Primary Lab Number');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickCheckButton() {
    let flag = false;
    return new Promise((resolve) => {
      const Check = element(by.id(btnCheck));
      Check.isDisplayed().then(function () {
        Check.click();
        console.log('Check Button is clicked');
        library.logStepWithScreenshot('Check Button is clicked', 'CheckClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to click Check button');
        library.logStep('Unable to click Check button');
        flag = false;
        resolve(flag);
      });
    });
  }

  checkAccountCreationPendingStatus(msg) {
    let status;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const AccountCreationPendingStatus = element(by.xpath(msgAccountCreationPendingStatus));
      AccountCreationPendingStatus.isDisplayed().then(function () {
        AccountCreationPendingStatus.getText().then(function (text) {
          if (msg === text) {
            console.log('Correct Status is displayed as ' + msg);
            library.logStepWithScreenshot('Correct Status is displayed as ' + msg, 'StatusDisplayed');
            status = true;
            resolve(status);
          }
          else {
            console.log('Correct Status is not displayed');
            library.logFailStep('Correct Status is not displayed');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        console.log('Status message is not displayed');
        library.logFailStep('Status message is not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  clickContinueButton() {
    let flag = false;
    return new Promise((resolve) => {
      const Continue = element(by.id(btnContinue));
      Continue.isDisplayed().then(function () {
        Continue.click();
        console.log('Continue Button is clicked');
        library.logStepWithScreenshot('Continue Button is clicked', 'ContinueClicked');
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

  checkAccountCreatedStatus(msg) {
    let status;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const AccountCreatedStatus = element(by.xpath(msgAccountCreatedStatus));
      AccountCreatedStatus.isDisplayed().then(function () {
        AccountCreatedStatus.getText().then(function (text) {
          if (msg === text) {
            console.log('Correct Status is displayed as ' + msg);
            library.logStepWithScreenshot('Correct Status is displayed as ' + msg, 'StatusDisplayed');
            status = true;
            resolve(status);
          } else {
            console.log('Correct Status is not displayed');
            library.logFailStep('Correct Status is not displayed');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        console.log('Status message is not displayed');
        library.logFailStep('Status message is not displayed');
        status = false;
        resolve(status);
      });
    });
  }

  clickContinueAgainButton() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const Continue = element(by.id(btnContinue));
      Continue.isDisplayed().then(function () {
        Continue.click();
        console.log('Continue Button is clicked');
        library.logStepWithScreenshot('Continue Button is clicked', 'ContinueClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        flag = false;
        resolve(flag);
      });
    });
  }
  /*
    clickCheckMigrationStatusButtonThrice() {
      browser.waitForAngularEnabled(false);
      let flag = false;
      return new Promise((resolve) => {
        const Check = element(by.id(btnCheck));
        Check.isDisplayed().then(function () {
          dashboard.waitForMigration();
          Check.click();
          console.log('Check Button is clicked for the first time');
          library.logStepWithScreenshot('Check Button is clicked for the first time', 'CheckClicked1');
          dashboard.waitForMigration();
          const migrationInProgress = element(by.xpath(msgMigrationInProgress));
          migrationInProgress.isDisplayed().then(function () {
            Check.click();
            console.log('Check Button is clicked for the second time');
            library.logStepWithScreenshot('Check Button is clicked for the second time', 'CheckClicked2');
            dashboard.waitForMigration();
            migrationInProgress.isDisplayed().then(function () {
              Check.click();
              dashboard.waitForMigration();
              console.log('Check Button is clicked for the third time');
              library.logStepWithScreenshot('Check Button is clicked for the third time', 'CheckClicked3');
              migrationInProgress.isDisplayed().then(function () {
                console.log('Migration is still in progress');
                library.logStepWithScreenshot('Migration is still in progress', 'MigrationInProgress');
                flag = true;
                resolve(flag);
              });
            });
          }).catch(function () {
            const MigrationComplete = element(by.xpath(msgMigrationComplete));
            MigrationComplete.isDisplayed().then(function () {
              console.log('MIGRATION COMPLETED');
              library.logStepWithScreenshot('MIGRATION COMPLETED', 'MIGRATIONCOMPLETED');
              flag = true;
              resolve(flag);
            });
          })
        }).catch(function () {
          console.log('Unable to click Check button');
          library.logStep('Unable to click Check button');
          flag = true;
          resolve(flag);
        });
      });
    }*/
  /*
    clickCheckMigrationStatusButtonThrice() {
      browser.waitForAngularEnabled(false);
      let flag = false;
      return new Promise((resolve) => {
        const Check = element(by.id(btnCheck));
        Check.isDisplayed().then(function () {
          dashboard.waitForMigration();
          Check.click();
          console.log('Check Button is clicked for the first time');
          library.logStepWithScreenshot('Check Button is clicked for the first time', 'CheckClicked1');
          dashboard.waitForMigration();
          Check.click();
          console.log('Check Button is clicked for the second time');
          library.logStepWithScreenshot('Check Button is clicked for the second time', 'CheckClicked2');
          dashboard.waitForMigration();
          Check.click();
          dashboard.waitForMigration();
          console.log('Check Button is clicked for the third time');
          library.logStepWithScreenshot('Check Button is clicked for the third time', 'CheckClicked3');
          const MigrationComplete = element(by.xpath(msgMigrationComplete));
          MigrationComplete.isDisplayed().then(function () {
            console.log('MIGRATION COMPLETED');
            library.logStepWithScreenshot('MIGRATION COMPLETED', 'MIGRATIONCOMPLETED');
            flag = true;
            resolve(flag);
          }).catch(function () {
            console.log('Migration is still in progress');
            library.logStepWithScreenshot('Migration is still in progress', 'MigrationInProgress');
            flag = true;
            resolve(flag);
          });
        }).catch(function () {
          console.log('Unable to click Check button');
          library.logStep('Unable to click Check button');
          flag = true;
          resolve(flag);
        });
      });
    }*/

  clickCheckMigrationStatusButtonThrice(txml) {
    browser.waitForAngularEnabled(false);
    let flag = false;
    return new Promise((resolve) => {
      const Check = element(by.id(btnCheck));
      Check.isDisplayed().then(function () {
        dashboard.waitForMigration();
        Check.click();
        console.log('Check Button is clicked for the first time');
        library.logStepWithScreenshot('Check Button is clicked for the first time', 'CheckClicked1');
        dashboard.waitForMigration();
        Check.click();
        console.log('Check Button is clicked for the second time');
        library.logStepWithScreenshot('Check Button is clicked for the second time', 'CheckClicked2');
        dashboard.waitForMigration();
        Check.click();
        dashboard.waitForMigration();
        console.log('Check Button is clicked for the third time');
        library.logStepWithScreenshot('Check Button is clicked for the third time', 'CheckClicked3');
        const completionMsg = "Migration has completed for this primary lab number with " + txml + " TXML(s). Please contact the software development team with any issues.";
        const completionMsgXpath = './/h4[text()="' + completionMsg + '"]';
        const MigrationComplete = element(by.xpath(completionMsgXpath));
        MigrationComplete.isDisplayed().then(function () {
          console.log('MIGRATION COMPLETED WITH ' + txml + ' TXML');
          library.logStepWithScreenshot('MIGRATION COMPLETED WITH ' + txml + ' TXML', 'MIGRATIONCOMPLETED');
          flag = true;
          resolve(flag);
        }).catch(function () {
          const TXMLMigrationFailed = element(by.xpath(msgMigrationFailure));
          TXMLMigrationFailed.isDisplayed().then(function () {
            console.log('Migration has completed for this primary lab number and the TXML mappings migration to UnityNext is failed');
            library.logStepWithScreenshot('Migration has completed for this primary lab number and the TXML mappings migration to UnityNext is failed', 'txmlMigrationFailed');
            flag = true;
            resolve(flag);
          }).catch(function () {
            console.log('Migration is still in progress');
            library.logStepWithScreenshot('Migration is still in progress', 'MigrationInProgress');
            flag = true;
            resolve(flag);
          });
        });
      }).catch(function () {
        console.log('Unable to click Check button');
        library.logStep('Unable to click Check button');
        flag = true;
        resolve(flag);
      });
    });
  }
}
