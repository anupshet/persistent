/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

let jsonData, flag;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/TrackUserActivityOnUNSettings-UN-11082.json').then(function (data) {
    jsonData = data;
});

describe('Test suite: Track Users activity on Unity Next Settings for Department, Instrument, Control and Analyte', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const library = new BrowserLibrary();
    const settings = new Settings();
    const labSetup = new NewLabSetup();

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
            expect(result).toBe(true);
        });
    });

    beforeAll(async () => {
        library.closeErrorMessageIfAppears();
    })

    afterEach(async function () {
        await out.signOut();
        await browser.manage().deleteAllCookies();
    });

    it('Verify Audit Trail API Call when Department settings is accessed', async () => {
        await labSetup.clickLabName();
        await library.clearPerformanceLogs();
        await labSetup.clickAddAnInstrument();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadDepartmentSettings, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadDepartmentSettings);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Instrument settings is accessed', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisInstrument();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadInstrumentSettings, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadInstrumentSettings);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Control settings is accessed', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisControl();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadControlSettings, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadControlSettings);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Analyte settings is accessed', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisAnalyte();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettings, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettings);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Analyte settings is accessed from Panels', async () => {
        await dashBoard.selectSidebarOption(jsonData.panel);
        await dashBoard.selectSidebarOption(jsonData.panelAnalyte);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisAnalyte();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettingsPanels, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettingsPanels);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Instrument settings is accessed for Archived Instrument', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmenntArchivedInstrument);
        await dashBoard.enableAchrivedItems();
        await dashBoard.selectSidebarOption(jsonData.archivedInstrument);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisInstrument();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadInstrumentSettingsArchived, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadInstrumentSettingsArchived);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Control settings is accessed for Archived Control', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmenntArchivedControl);
        await dashBoard.selectSidebarOption(jsonData.instrumentArchivedControl);
        await dashBoard.enableAchrivedItems();
        await dashBoard.selectSidebarOption(jsonData.archivedControl);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisControl();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadControlSettingsArchived, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadControlSettingsArchived);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Analyte settings is accessed for Archived Analyte', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmenntArchivedAnalyte);
        await dashBoard.selectSidebarOption(jsonData.instrumentArchivedAnalyte);
        await dashBoard.selectSidebarOption(jsonData.controlArchivedAnalyte);
        await dashBoard.enableAchrivedItems();
        await dashBoard.selectSidebarOption(jsonData.archivedAnalyte);
        await library.clearPerformanceLogs();
        await dashBoard.clickEditThisAnalyte();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettingsArchived, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.payLoadAnalyteSettingsArchived);
        expect(flag).toBe(true);
    });

});
