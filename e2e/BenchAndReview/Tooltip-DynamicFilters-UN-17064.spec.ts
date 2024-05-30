
/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { async } from '@angular/core/testing';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/Tooltip-DynamicFilters-UN-17064.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Tool tip for Dynamic filters', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    const westgard = new WestgardRule();
  
    beforeEach(async function () {
        await loginEvent.clickAcceptAndDecline1(jsonData.URL)
        .then((x) => {
         return loginEvent.loginToApplication1(jsonData.URL,jsonData.Username, jsonData.Password, jsonData.FirstName);
        })
      .then((x) => {
       expect(x).toBe(true);
      });
    });

    it('Test case 1:By hovering over the Departments dynamic filter, check whether the tooltip displays with all selected departments by default', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyDisplyedAllDepartmentsTooltipWindow();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })



     it('Test case 2:By hovering over the Instruments dynamic filter, check whether the tooltip displays with all selected instruments present under the all/specific selected departments by default', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyDisplyedAllInstrumentsTooltipWindow();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })
     
     
     it('Test case 3:By hovering over the Panels dynamic filter, check whether the tooltip displays with None by default', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyDisplyedPanelsTooltipWindow();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })

     it('Test case 4:By selecting specific departments(one,multiple/all) and by hovering over the Departments dynamic filter, check whether the tooltip displays with specific selected departments (one or multiple).', function () {
       benchAndSupervisorReview.openBenchReviewPage()
      .then((x) => {
            return benchAndSupervisorReview.verifyDisplyedSelectedDepartmentsOnTooltipWindow(jsonData.Department);
       })
        .then((x) => {
           expect(x).toBe(true);
        });
     })
     
     it('Test case 5:By hovering over the Instruments dynamic filter, check whether the tooltip displays with the specific selected instruments(one,multiple/all)  grouped by all/specific selected departments(only one instrument selected at time).', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyDisplyedSelectedInstrumentsOnTooltipWindow(jsonData.Instruments);
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })
 
     it('Test case 6:By selecting Panels dynamic filter and By hovering over the Panels dynamic filter, check whether the tooltip displays with specific selected panel.', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyDisplyedSelectedPanelsOnTooltipWindow(jsonData.Panels);
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })

     it('Test case 7: If there is no any department is avalaible in lab/location Check tooltip displays as Selected None',async  function () {
       await out.signOut()
       .then((x) => {  
         loginEvent.clickAcceptAndDecline1(jsonData.URL);
       })
       .then((x) => {  
         loginEvent.loginToApplication1(jsonData.URL,jsonData.Username1, jsonData.Password1, jsonData.FirstName)
      .then((x) => {  
         return benchAndSupervisorReview.openBenchReviewPage1()
      })
       .then((x) => {
        return benchAndSupervisorReview.verifyDepartmentTooltipSelectedAsNone();
      })
        .then((x) => {
         expect(x).toBe(true);
        });
     })
   
     it('Test case 8: If there is no any panel is avalaible in lab/location Check tooltip displays as Selected None', function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyPanelsTooltipSelectedAsNone();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })
    
   })

})
