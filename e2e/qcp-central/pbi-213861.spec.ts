import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { MigrateLegacyCustomers } from './page-objects/migration/migrate-legacy-customers.po';
import { MigrationConfiguration } from './page-objects/migration/migration-configuration-all-lots.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';

const fs = require('fs');
let jsonData;

// For execution on DEV
/*
fs.readFile('./e2e/qcp-central/test-data/pbi-213861.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});*/

// For execution on QA
fs.readFile('./e2e/qcp-central/test-data/pbi-213861_QA.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3600000;

describe('PBI 213861: Migration Tool Regression: 1-1 Mapping (Without Transformer & Panel)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const qcp = new QcpCentral();
  const mlc = new MigrateLegacyCustomers();
  const dashBoard = new Dashboard();
  const manager = new AccoutManager();
  const migrationConfig = new MigrationConfiguration();
  const newLabSetup = new NewLabSetup();
  const analyteSettings = new AnalyteSettings();

  it('PBI 213861: To check Unity-Next Account Creation status for a migrating lab', function () {
    library.logStep('PBI 213861: To check Unity-Next Account Creation status for a migrating lab');
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (navigatedToSubMenu) {
      expect(navigatedToSubMenu).toBe(true);
    });
    mlc.verifyPageHeader().then(function (headerVerified) {
      expect(headerVerified).toBe(true);
    });
    mlc.enterPrimaryLabNumber(jsonData.PLN).then(function (plnEntered) {
      expect(plnEntered).toBe(true);
    });
    mlc.clickCheckButton().then(function (checkClicked) {
      expect(checkClicked).toBe(true);
    });
    mlc.checkAccountCreationPendingStatus(jsonData.AccountCreationPending).then(function (correctStatusDisplayed) {
      expect(correctStatusDisplayed).toBe(true);
    });
    out.signOutQCP().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
  });

  it('PBI 213861: To create an account in Unity Next for the migrating lab', function () {
    library.logStep('PBI 213861: To create an account in Unity Next for the migrating lab');
    loginEvent.loginToApplication(jsonData.UNURL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAddAccountButton().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });
    manager.enterDataOnCreateAccountPageMigration(jsonData, jsonData.Connectivity).then(function (added) {
      expect(added).toBe(true);
    });
    manager.clickCreateAccountAddAccountButtonMigration().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dashBoard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
  });

  it('PBI 213861: To retrieve the Configurations', function () {
    library.logStep('PBI 213861: To retrieve the Configurations');
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (navigatedToSubMenu) {
      expect(navigatedToSubMenu).toBe(true);
    });
    mlc.verifyPageHeader().then(function (headerVerified) {
      expect(headerVerified).toBe(true);
    });
    mlc.enterPrimaryLabNumber(jsonData.PLN).then(function (plnEntered) {
      expect(plnEntered).toBe(true);
    });
    mlc.clickCheckButton().then(function (checkClicked) {
      expect(checkClicked).toBe(true);
    });
    mlc.checkAccountCreatedStatus(jsonData.AccountCreated).then(function (correctStatusDisplayed) {
      expect(correctStatusDisplayed).toBe(true);
    });
    mlc.clickContinueButton().then(function (continueClicked) {
      expect(continueClicked).toBe(true);
    });
    migrationConfig.clickRetrieveLatestConfigsLink().then(function (retrieveClicked) {
      expect(retrieveClicked).toBe(true);
    });
    migrationConfig.verifyConfigTableDisplayed().then(function (tableDisplayed) {
      expect(tableDisplayed).toBe(true);
    });
    migrationConfig.verifyConfigTableHeaders().then(function (tableHeaders) {
      expect(tableHeaders).toBe(true);
    });
    migrationConfig.verifyConfigTableBody().then(function (tableBody) {
      expect(tableBody).toBe(true);
    });
  });

  it('PBI 213861: To initiate the QC Data migration', function () {
    library.logStep('PBI 213861: To initiate the QC Data migration');
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (navigatedToSubMenu) {
      expect(navigatedToSubMenu).toBe(true);
    });
    mlc.enterPrimaryLabNumber(jsonData.PLN).then(function (plnEntered) {
      expect(plnEntered).toBe(true);
    });
    mlc.clickCheckButton().then(function (checkClicked) {
      expect(checkClicked).toBe(true);
    });
    mlc.clickContinueAgainButton().then(function (continueClicked) {
      expect(continueClicked).toBe(true);
    });
    migrationConfig.clickContinueMigrationButton().then(function (continueMigrationCliecked) {
      expect(continueMigrationCliecked).toBe(true);
    });
    migrationConfig.clickInitiateMigrationButton().then(function (migrationInitiated) {
      expect(migrationInitiated).toBe(true);
    });
    migrationConfig.verifyMigrationStatusMessage().then(function (migrationStatus) {
      expect(migrationStatus).toBe(true);
    });
    mlc.clickCheckMigrationStatusButtonThrice(jsonData.TXML).then(function (checkMigrationCompleted) {
      expect(checkMigrationCompleted).toBe(true);
    });
  });

  it('PBI 213861: To validate the migrated data', function () {
    library.logStep('PBI 213861: To validate the migrated data');
    loginEvent.loginToApplication(jsonData.UNURL, jsonData.LabContactEmail, jsonData.LabContactPassword, jsonData.LabContactFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    analyteSettings.compareMigratedPointValues(jsonData.Level1Points, jsonData.Level2Points).then(function (comparison) {
      expect(comparison).toBe(true);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
  });
});
