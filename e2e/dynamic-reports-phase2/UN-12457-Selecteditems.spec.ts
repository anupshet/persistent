//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { DynamicReportsPhase2 } from '../page-objects/UN-12457-Selecteditems.po';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/UN-12457-Selecteditems.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: Dynamic reports UI', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const newLabSetup = new NewLabSetup();
  const dynamicReport = new DynamicReportsPhase2(); 
  
  afterEach(function () {
    out.signOut();
  });
// For Account User Manager role
  it("Test case 1: Lab setup is not visible for AUM role ", function () {
    library.logStep('Test Case: Verify Quick Reports Icon is not Visible');
    
    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_Username, jsonData.AUM_Password, jsonData.AUM_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });

  // For Lab Supervisor Role
  it("Test case 1: verify the Selected Items UI display all selected items for Lab Supervisor Role ", function () {
    library.logStep('Test case: Verify Items selected in Selection UI');
    library.logStep('Test case: Verify Selected Items is in minimised state');
    library.logStep('Test case: Verify Department/locations is default tab');
    library.logStep('Test case: Verify all selected items are visible in SELECTED ITEMS UI');

    loginEvent.loginToApplication(jsonData.URL, jsonData.LS_Username, jsonData.LS_Password, jsonData.LS_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
    });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.DeptCheckbox(jsonData.LS_DepartmentName).then(function (Verified) {
        expect(Verified).toBe(true);
    });
    dynamicReport.InstCheckbox(jsonData.LS_InstrumentName).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.CtrlCheckbox(jsonData.LS_ControlName).then(function (Verified) {
    expect(Verified).toBe(true);
    });
    dynamicReport.verifySelectedItems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnInsttab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnCtrltab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnAnalytetab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
  });

 // For Lab Technician Role
 it("Test case 2: verify the Selected Items UI display all selected items for Lab Technician Role", function () {
    library.logStep('Test case: Verify Items selected in Selection UI');
    library.logStep('Test case: Verify Selected Items is in minimised state');
    library.logStep('Test case: Verify Department/locations is default tab');
    library.logStep('Test case: Verify all selected items are visible in SELECTED ITEMS UI');

    loginEvent.loginToApplication(jsonData.URL, jsonData.LT_Username, jsonData.LT_Password, jsonData.LT_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
    });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.DeptCheckbox(jsonData.LT_DepartmentName).then(function (Verified) {
        expect(Verified).toBe(true);
    });
    dynamicReport.InstCheckbox(jsonData.LT_InstrumentName).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.CtrlCheckbox(jsonData.LT_ControlName).then(function (Verified) {
    expect(Verified).toBe(true);
    });
    dynamicReport.verifySelectedItems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnInsttab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnCtrltab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnAnalytetab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
  });

   // For Technician Role
   it("Test case 3: verify the Selected Items UI display all selected items for Technician Role", function () {
    library.logStep('Test case: Verify Items selected in Selection UI');
    library.logStep('Test case: Verify Selected Items is in minimised state');
    library.logStep('Test case: Verify Department/locations is default tab');
    library.logStep('Test case: Verify all selected items are visible in SELECTED ITEMS UI');

    loginEvent.loginToApplication(jsonData.URL, jsonData.Tech_Username, jsonData.Tech_Password, jsonData.Tech_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
    });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.DeptCheckbox(jsonData.Tech_DepartmentName).then(function (Verified) {
        expect(Verified).toBe(true);
    });
    dynamicReport.InstCheckbox(jsonData.Tech_InstrumentName).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.CtrlCheckbox(jsonData.Tech_ControlName).then(function (Verified) {
    expect(Verified).toBe(true);
    });
    dynamicReport.verifySelectedItems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnInsttab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnCtrltab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnAnalytetab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
  });
  

   // For Lab User manager and Lab Supervisor Role
   it("Test case 4: verify the Selected Items UI display all selected items for Lab User manager and Lab Supervisor Role", function () {
    library.logStep('Test case: Verify Items selected in Selection UI');
    library.logStep('Test case: Verify Selected Items is in minimised state');
    library.logStep('Test case: Verify Department/locations is default tab');
    library.logStep('Test case: Verify all selected items are visible in SELECTED ITEMS UI');

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS_Username, jsonData.LUM_LS_Password, jsonData.LUM_LS_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
    });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.DeptCheckbox(jsonData.LUM_LS_DepartmentName).then(function (Verified) {
        expect(Verified).toBe(true);
    });
    dynamicReport.InstCheckbox(jsonData.LUM_LS_InstrumentName).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.CtrlCheckbox(jsonData.LUM_LS_ControlName).then(function (Verified) {
    expect(Verified).toBe(true);
    });
    dynamicReport.verifySelectedItems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnInsttab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnCtrltab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnAnalytetab().then(function(Verified) {
    expect(Verified).toBe(true);
    })
    dynamicReport.clickOnSelecteditems().then(function(Verified) {
    expect(Verified).toBe(true);
    })
   });
});
});
