import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { MigrateLegacyCustomers } from './page-objects/migration/migrate-legacy-customers.po';
import { MigrationConfiguration } from './page-objects/migration/migration-configuration-all-lots.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { MigrateTransformers } from './page-objects/migration/migrate-transformers.po';

const fs = require('fs');
let jsonData;

// For Test Execution on DEV
fs.readFile('./e2e/qcp-central/test-data/migration_DEV.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});

// For Test Execution on QA
/*
fs.readFile('./e2e/qcp-central/test-data/migration.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});*/

// For Test Execution on Stage
/*
fs.readFile('./e2e/qcp-central/test-data/migration_Stage.json', (err, data) => {
  if (err) { throw err; }
  const pointData = JSON.parse(data);
  jsonData = pointData;
});*/

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Migration Test Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const qcp = new QcpCentral();
  const mlc = new MigrateLegacyCustomers();
  const dashBoard = new Dashboard();
  const manager = new AccoutManager();
  const migrationConfig = new MigrationConfiguration();
  const migrateTransformer = new MigrateTransformers();

  it('To check Unity-Next Account Creation status for a migrating lab', function () {
    library.logStep('Welcome to Migration Process Page');
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

  it('To create an account in Unity Next for the migrating lab', function () {
    library.logStep('To create an account in Unity Next for the migrating lab');
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

  it('To retrieve the Configurations', function () {
    library.logStep('To retrieve the Configurations');
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

  it('To Map the Configurations', function () {
    library.logStep('To Map the Configurations');
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
    migrationConfig.verifyContinueMigrationDisabled().then(function (continueMigrationDisabled) {
      expect(continueMigrationDisabled).toBe(true);
    });
    migrationConfig.selectUnMappedConfigsFromDropdown().then(function (unMappedConfigs) {
      expect(unMappedConfigs).toBe(true);
    });
    // Actual Mapping Process for Lab 180221 starts here
    // Multiqual 1,2,3 Unassayed
    migrationConfig.selectFirstUnMappedControlForMapping().then(function (firstControl) {
      expect(firstControl).toBe(true);
    });
    // GGT
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    // Sodium
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    migrationConfig.clickBackButtonMCPATFTSL().then(function (BackButtonMCPATFTSLClicked) {
      expect(BackButtonMCPATFTSLClicked).toBe(true);
    });
    // Cardiac Markers Plus LT
    migrationConfig.selectFirstUnMappedControlForMapping().then(function (firstControl) {
      expect(firstControl).toBe(true);
    });
    // CRP
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    // Troponin
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    migrationConfig.clickBackButtonMCPATFTSL().then(function (BackButtonMCPATFTSLClicked) {
      expect(BackButtonMCPATFTSLClicked).toBe(true);
    });
    // Ethanol/Ammonia
    migrationConfig.selectFirstUnMappedControlForMapping().then(function (firstControl) {
      expect(firstControl).toBe(true);
    });
    // Ethanol
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    migrationConfig.clickBackButtonMCPATFTSL().then(function (BackButtonMCPATFTSLClicked) {
      expect(BackButtonMCPATFTSLClicked).toBe(true);
    });
    // Multiqual 1,2,3 Unassayed
    migrationConfig.selectFirstUnMappedControlForMapping().then(function (firstControl) {
      expect(firstControl).toBe(true);
    });
    // Amylase
    migrationConfig.clickEditButtonForFirstAnalyte().then(function (firstAnalyte) {
      expect(firstAnalyte).toBe(true);
    });
    migrationConfig.selectFirstMappingOption().then(function (firstOption) {
      expect(firstOption).toBe(true);
    });
    migrationConfig.clickBackButtonMCPATFTSL().then(function (BackButtonMCPATFTSLClicked) {
      expect(BackButtonMCPATFTSLClicked).toBe(true);
    });
    migrationConfig.verifyContinueMigrationDisabled().then(function (continueMigrationDisabled) {
      expect(continueMigrationDisabled).toBe(false);
    });
  });

  // Migrate the Transformers and to
  it('To initiate the QC Data migration', function () {
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
    migrationConfig.verifyContinueToMigrateTransformersIsClickable().then(function (buttonClickable) {
      expect(buttonClickable).toBe(true);
    });
    migrationConfig.clickContinueToMigrateTransformersButton().then(function (buttonClicked) {
      expect(buttonClicked).toBe(true);
    });
    migrateTransformer.verifyPageHeader().then(function (hdrVerified) {
      expect(hdrVerified).toBe(true);
    });
    migrateTransformer.selectToBeMigratedOption('Yes').then(function (toBeMigrated) {
      expect(toBeMigrated).toBe(true);
    });
    migrateTransformer.verifyMigrateTransformerButtonIsClickable().then(function (clickable) {
      expect(clickable).toBe(true);
    });
    migrateTransformer.clickMigrateTransformersButton().then(function (transformerMigrationClicked) {
      expect(transformerMigrationClicked).toBe(true);
    });
    migrateTransformer.clickCheckTransformerMigrationStatusButtonTwice().then(function (clickedTwice) {
      expect(clickedTwice).toBe(true);
    });
    migrationConfig.selectAllConfigsFromDropdown().then(function (AllConfigs) {
      expect(AllConfigs).toBe(true);
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
});
