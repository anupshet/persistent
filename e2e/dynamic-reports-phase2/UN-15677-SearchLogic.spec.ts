/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { DynamicReportsPhase2 } from '../page-objects/dynamic-reports-phase2.po';


let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN-15677-SearchLogic.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite:Verify Error Dialog box for Selection parameter filters on Report page', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dynamicReports = new DynamicReportsPhase2();
 

    it('Test Case 1: Verify Search Elements UI for AUM Role', function () {

    library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify that the user does not have access to Reports Icon');
    

      loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_Username,
        jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
        
      dynamicReports.clickOnReportsIcon().then(function (clicked) {
        expect(clicked).toBe(false);
      });

    out.signOut();


 
  });

  it('Test case 2: Verify Search Elements UI for LUM Role', function () {

    library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify that the user does not have access to Reports Icon');

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_Username,
      jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
          expect(loggedIn).toBe(true);
      });
      
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(false);
    });

  out.signOut();



});

  it('Test case 3 :Verify Search logic for Location and Department', function () {
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Location And Department").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResultsDept(jsonData.DeptKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 4 :Verify Search logic for Instruent', function () {
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Instrument").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.InstKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.InstrumentColumn,jsonData.InstKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 5 :Verify Search logic for Control', function () {
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Control and Lot").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.ControlKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.ControlColumn,jsonData.ControlKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 6 :Verify Search logic for Control', function () {
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Analyte").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.ControlKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.AnalyteColumn,jsonData.ControlKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 7 :Verify Search logic for Location and Department', function () {
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Location And Department").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResultsDept(jsonData.DeptKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 8 :Verify Search logic for Instruent', function () {
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Instrument").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.InstKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.InstrumentColumn,jsonData.InstKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 9 :Verify Search logic for Control', function () {
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Control and Lot").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.ControlKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.ControlColumn,jsonData.ControlKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });

  it('Test case 10 :Verify Search logic for Control', function () {
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role])
  
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.FilterSelect("Analyte").then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.ControlKeyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchResults(jsonData.AnalyteColumn,jsonData.ControlKeyword).then(function (verfied) {
      expect(verfied).toBe(true);
    });

    
    out.signOut();
  });



});
