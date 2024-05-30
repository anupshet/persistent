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

library.parseJson('./JSON_data/TrackUsersActivityOnUnityNextForLabSetup-UN-11081.json').then(function (data) {
    jsonData = data;
});

describe('Test suite: Track Users activity on Unity Next for Lab Setup', function () {
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

    it('Verify Audit Trail API Call when Add A Department is accessed from Left Navigation', async () => {
        await library.clearPerformanceLogs();
        await labSetup.clickAddADepartment();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.AddDeptLeftNavPayLoad, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.AddDeptLeftNavPayLoad);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Add A Department is accessed from Department Settings', async () => {
        await labSetup.clickLabName();
        await library.clearPerformanceLogs();
        await labSetup.clickAddADepartment();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.AddDeptDeptSettingsPayLoad, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.AddDeptDeptSettingsPayLoad);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Add An Instrument Is Accessed from Left Navigation', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await library.clearPerformanceLogs();
        await labSetup.clickAddAnInstrument();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.AddInstrLeftNavPayLoad, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.AddInstrLeftNavPayLoad);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Add A Control is accessed from Left Navigation', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await library.clearPerformanceLogs();
        await labSetup.clickAddAControl();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.AddCntrlLeftNavPayLoad, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.AddCntrlLeftNavPayLoad);
        expect(flag).toBe(true);
    });

    it('Verify Audit Trail API Call when Add An Analyte is accessed from Left Navigation', async () => {
        await dashBoard.selectSidebarOption(jsonData.departmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);  
        await library.clearPerformanceLogs();
        await labSetup.clickAddAnAnalyte();
        flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.AddAnalyteLeftNavPayLoad, jsonData.AuditTrailAPIStatusCode);
        expect(flag).toBe(true);
        flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.AddAnalyteLeftNavPayLoad);
        expect(flag).toBe(true);
    });

});
