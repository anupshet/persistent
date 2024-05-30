/*
 * Copyright © 2021 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { DynamicReportsPhase2 } from '../page-objects/dynamic-reports-phase2.po';
import { LocationListing } from '../page-objects/location-listing-e2e.po';



jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/UN-15676-SearchElements.json').then(function (data) {
  jsonData = data;
});

describe('PBI_231950: Verify the Functionality of Account listing screen', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const manager = new AccoutManager();
    const library = new BrowserLibrary();
    const dynamicReports = new DynamicReportsPhase2();
    const locationTab = new LocationListing();



    it('Verify Search Elements UI for AUM Role', function () {

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

  it('Verify Search Elements UI for LUM Role', function () {

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

   
    it('Verify Search Elements UI for LS Role', function () {

    library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

      loginEvent.loginToApplication(jsonData.URL, jsonData.LS_Username,
        jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
        
      dynamicReports.clickOnReportsIcon().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      
      dynamicReports.VerifySearchUIelements().then(function (verify) {
        expect(verify).toBe(true);
      });

    dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
      expect(verify).toBe(true);
    });

    dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
      expect(verify).toBe(true);
    });

    dynamicReports.VerifyFilterSelections().then(function (verify) {
      expect(verify).toBe(true);
    });

    dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
      expect(verify).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
      expect(verify).toBe(true);
    });

    dynamicReports.ClickSearchButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
      expect(entered).toBe(true);
    });

    dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
      expect(verify).toBe(true);
    });


    out.signOut();


 
  });

  it('Verify Search Elements UI for LT Role', function () {

    library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

    loginEvent.loginToApplication(jsonData.URL, jsonData.LT_Username,
      jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
          expect(loggedIn).toBe(true);
      });
      
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    
    dynamicReports.VerifySearchUIelements().then(function (verify) {
      expect(verify).toBe(true);
    });

  dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
    expect(verify).toBe(true);
  });

  dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
    expect(verify).toBe(true);
  });

  dynamicReports.VerifyFilterSelections().then(function (verify) {
    expect(verify).toBe(true);
  });

  dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
    expect(verify).toBe(true);
  });

  dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
    expect(entered).toBe(true);
  });

  dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
    expect(verify).toBe(true);
  });

  dynamicReports.ClickSearchButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });

  dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
    expect(clicked).toBe(true);
  });

  dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
    expect(clicked).toBe(true);
  });

  dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
    expect(entered).toBe(true);
  });

  dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
    expect(verify).toBe(true);
  });


  out.signOut();



});

it('Verify Search Elements UI for Tech Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.Tech_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});


it('Verify Search Elements UI for AUM+LUM Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify that the user does not have access to Reports Icon');

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(false);
  });

out.signOut();



});

it('Verify Search Elements UI for AUM+LS Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LS_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for AUM+LT Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LT_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});


it('Verify Search Elements UI for LUM+LS Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for LUM+LT Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LT_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for LUM+Tech Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_Tech_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for AUM+LUM+LS Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LS_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});


it('Verify Search Elements UI for AUM+LUM+LT Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LT_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for AUM+LUM+T Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_T_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});

it('Verify Search Elements UI for LVS Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify that the user does not have access to Reports Icon');

  loginEvent.loginToApplication(jsonData.URL, jsonData.LVS_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(false);
  });

out.signOut();



});

it('Verify Search Elements UI for BM Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify that the user does not have access to Reports Icon');

  loginEvent.loginToApplication(jsonData.URL, jsonData.BM_Username,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(false);
  });

out.signOut();



});

it('Verify Search Elements UI for CTS Role', function () {

  library.logStep('Test case 1: To verify The search UI elements on Dynamic reports Page');
    library.logStep('Test case 2: To Verify if the Filter Dropdown consists of 4 filter parameters : Location and Department,Instrument,Control and lot,Analyte');
    library.logStep('Test case 3: To Verify if the User is able to select the filter parameters from the "Filter" Dropdown');
    library.logStep('Test case 4: To Verify if the user is able to add input to the Search field');
    library.logStep('Test case 5: To Verify if "Search" button is disabled by default when none of the fileds are entered ');
    library.logStep('Test case 6:To Verify if "Search" button is disabled if any one of the "Filter" or "Keyword" filed is entered');
    library.logStep('Test case 7: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 
    library.logStep('Test case 8:To Verify if "Search" button is Chaged to "Clear search" After entering the Required fileds and the "Search" button is clicked.'); 
    library.logStep('Test case 9: To Verify if the the "Search" button is enabled when both the - "Filter" and "Keyword" field is entered by the User.'); 

  loginEvent.loginToApplication(jsonData.URL, jsonData.CTS,
    jsonData.Password, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
    });

    dashBoard.goToAccountManagementpage().then(function (result) {
      expect(result).toBe(true);
    });

    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    locationTab.selectSearchCatagory(jsonData.Lab).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordLab, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });

    locationTab.launchLabWithLabName(jsonData.launchLabName).then(function (result) {
      expect(result).toBe(true);
    });
    
  dynamicReports.clickOnReportsIcon().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  
  dynamicReports.VerifySearchUIelements().then(function (verify) {
    expect(verify).toBe(true);
  });

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFiltersinFilterDD().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifyFilterSelections().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonEnabled().then(function (verify) {
  expect(verify).toBe(true);
});

dynamicReports.ClickSearchButton().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifySearchButtonChangetoClearSearch().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.VerifyClearSearchFunction().then(function (clicked) {
  expect(clicked).toBe(true);
});

dynamicReports.EnterKeyword(jsonData.Keyword).then(function (entered) {
  expect(entered).toBe(true);
});

dynamicReports.VerifysearchButtonDisabled().then(function (verify) {
  expect(verify).toBe(true);
});


out.signOut();



});








});
