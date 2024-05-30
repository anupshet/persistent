/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();
const textlabelinstrument = "//unext-quick-access-report//span[@class='data'][text()=' Create a report for this  instrument']";
const textlabelcontrol = "//unext-quick-access-report//span[@class='data'][text()=' Create a report for this  control']";
const createbutton = '//span[contains(text(),"Create")]//parent::button';
const cancelbutton = "//span[contains(text(),'Cancel')]//parent::button";
const calendar = ".//button[@aria-label='Open calendar']";
const currentmonth = "//div[contains(@class,'mat-calendar-body-cell-content mat-calendar-body-selected')]";
const allreporttype = "//span[contains(@class,'mat-select-value')]//span";
const newreportsTab = '//div[@role="tab"]//div[text()="NEW REPORTS"]';
const typeofreportdropdown = '//mat-label[text()="Report Type"]//ancestor::span//preceding-sibling::mat-select';
const selectedmonth='.//div[@class="mat-calendar-body-cell-content mat-calendar-body-selected"]'
const reportsIcon = './/button[@class="mat-focus-indicator mr-40 grey mat-icon-button mat-button-base"]';


browser.waitForAngularEnabled(true);
let jsonData;

library.parseJson('./JSON_data/UN-12458_QuickReport.json').then(function (data) {
  jsonData = data;
});
export class DynamicReport {
  navigateTO(to) {
    return new Promise(async (resolve) => {
      const sideNav = element(by.xpath('//mat-nav-list//div[contains(text(),"' + to + '")]'));
      library.scrollToElement(sideNav);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        library.logStepWithScreenshot('Side navigation is displayed and User is navigated to ' + to, 'Side Navigation is displayed');
        console.log('Side navigation is displayed and User is navigated to ' + to);
        resolve(true);
      }).catch(function () {
        console.log('Side navigation is not displayed');
        library.logStep('Side Navigation is not displayed');
        resolve(false);
      });
    });
  }
  clickOnReportsIcon() {
    return new Promise((resolve) => {
      
      const ReportsIconButton = element(by.xpath(reportsIcon));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ReportsIconButton), 20000);
      ReportsIconButton.isDisplayed().then(function () {
        library.logStep("Reports Icon Displayed");
        library.clickJS(ReportsIconButton);
        library.logStep("Clicked on reports Icon");
        resolve(true);

      }).catch(function () {
        library.logFailStep("Reports icon is not displayed")
        resolve(false)
      })
    });
  }

  verifyQuickReportsComponentAtInstrument() {
    return new Promise(resolve => {
      let TextLabel = false, CreateButton = false, MonthPicker = false;
      const textLabelInstrument = element(by.xpath(textlabelinstrument));
      browser.wait(browser.ExpectedConditions.visibilityOf(textLabelInstrument), 30000, 'Failed:Report creation label is not visible');
      textLabelInstrument.isPresent().then(function () {
        library.logStep('Text label for instrument is Present');
        TextLabel = true;
      }).catch(function () {
        library.logFailStep("Text Label for instrument is not present.");
      }).then(function () {
        const createButton = element(by.xpath(createbutton));
        createButton.isPresent().then(function () {
          library.logStep('Create Button is present');
          CreateButton = true;
        }).catch(function () {
          library.logFailStep("Create Button is not present");
        })
      }).then(function () {
        const monthPicker = element(by.xpath(calendar));
        monthPicker.isPresent().then(function () {
          library.logStep('monthPicker is Present');
          MonthPicker = true;
        }).catch(function () {
          library.logFailStep("monthPicker is not present");
        })
      }).then(function () {
        if (TextLabel && CreateButton && MonthPicker === true) {
          library.logStepWithScreenshot('Verified UI', 'UI');
          resolve(true);
        }
        else {
          library.logFailStep("Missing Components in UI");
          resolve(false);
        }
      });
    });
  }
  verifyQuickReportComponentAtControl() {
    return new Promise(resolve => {
      let TextLabel = false, CreateButton = false, MonthPicker = false;
      const textLabelControl = element(by.xpath(textlabelcontrol));
      browser.wait(browser.ExpectedConditions.visibilityOf(textLabelControl), 20000, 'Failed:Report creation label is not visible');
      textLabelControl.isPresent().then(function () {
        console.log("Text label for control is Present");
        library.logStep('Text label for control is Present');
        TextLabel = true;
      }).catch(function () {
        console.log("Text Label for control is not present.")
        library.logFailStep("Text Label for control is not present.");
      }).then(function () {
        const createButton = element(by.xpath(createbutton));
        createButton.isPresent().then(function () {
          console.log("Create Button is present");
          library.logStep('Create Button is present');
          CreateButton = true;
        }).catch(function () {
          console.log("Create Button is not present.")
          library.logFailStep("Create Button is not present");
        })
      }).then(function () {
        const monthPicker = element(by.xpath(calendar));
        monthPicker.isPresent().then(function () {
          console.log("monthPicker is present");
          library.logStep('monthPicker is Present');
          MonthPicker = true;
        }).catch(function () {
          console.log("monthPicker is not present.")
          library.logFailStep("monthPicker is not present");
        })
      }).then(function () {
        if (TextLabel && CreateButton && MonthPicker === true) {
          library.logStepWithScreenshot('Verified UI', 'UI');
          console.log("Verified UI");
          resolve(true);
        }
        else {
          console.log("Missing Components in UI");
          library.logFailStep("Missing Components in UI");
          resolve(false);
        }
      });
    });
  }
  VerifyCurrentMonthIsDefaultInCalender() {
    return new Promise((resolve) => {
      const monthPicker = element(by.xpath(calendar));
      monthPicker.clickJS();
      const currentDefaultMonth = element(by.xpath(currentmonth));
      currentDefaultMonth.getAttribute('class').then(function (value) {
        if (value.includes('mat-calendar-body-today')) {
          library.logStepWithScreenshot("Current month is present bydefault in monthpicker", "Current month is present bydefault in monthpicker");
          console.log('Current month is present bydefault in monthpicker');
          resolve(true);
        } else {
          library.logFailStep("Current month is not present bydefault in monthpicker");
          console.log('Current month is not present bydefault in monthpicker');
          resolve(false);
        }
      });
    });
  }
  clickOnCreateButton() {
    return new Promise((resolve) => {
      const createButton = element(by.xpath(createbutton));
      createButton.isDisplayed().then(function () {
        library.clickJS(createButton);
        library.logStepWithScreenshot('Create button is Clicked', 'Create button is Clicked');
        console.log('Create button is clicked');
        resolve(true);
      })
    });
  }
  verifyNavigationToReportsTab() {
    return new Promise((resolve) => {
      this.clickOnCreateButton();
      const Newreportstab = element(by.xpath(newreportsTab));
      browser.wait(browser.ExpectedConditions.visibilityOf(Newreportstab), 20000, 'Failed:Report tab is not visible');
      Newreportstab.isDisplayed().then(function () {
        library.logStepWithScreenshot('Reports Tab is displayed', 'Reports Tab is displayed');
        console.log('Reports Tab is displayed');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Reports Tab is not displayed');
        console.log('Reports Tab is not displayed');
        resolve(false);
      });
    });
  }
  clickOnCancelButton() {
    return new Promise((resolve) => {
      const CancelButton = element(by.xpath(cancelbutton));
      CancelButton.isDisplayed().then(function () {
        library.clickJS(CancelButton);
        library.logStepWithScreenshot('Create button is Clicked', 'Create button is Clicked');
        console.log('Create button is clicked');
        resolve(true);
      })
    });
  }
  verifyUIComponentsAtReportsTab() {
    return new Promise(resolve => {
      let ReportTypeDropdown = false, MonthCalendar = false, CreateButton = false, CancelButton = false;
      const reporttypeDropdown = element(by.xpath(typeofreportdropdown));
      reporttypeDropdown.isPresent().then(function () {
        console.log("Report Type dropdown is Present");
        library.logStep('Report Type dropdown is Present');
        ReportTypeDropdown = true;
      }).catch(function () {
        console.log("Report Type dropdown is not present.")
        library.logFailStep("Report Type dropdown is not present.");
      }).then(function () {
        const monthcalendar = element(by.xpath(calendar));
        monthcalendar.isPresent().then(function () {
          console.log("Month calendar is present");
          library.logStep('Month calendar is present');
          MonthCalendar = true;
        }).catch(function () {
          console.log("Month calendar is not present.")
          library.logFailStep("Month calendar is not present");
        })
      }).then(function () {
        const createButton = element(by.xpath(createbutton));
        createButton.isPresent().then(function () {
          console.log("Create Button is present");
          library.logStep('Create Button is Present');
          CreateButton = true;
        }).catch(function () {
          console.log("Create Button is not present.")
          library.logFailStep("Create Button is not present");
        })
      }).then(function () {
        const cancelButton = element(by.xpath(cancelbutton));
        cancelButton.isPresent().then(function () {
          console.log("Cancel Button is present");
          library.logStep('Cancel Button is Present');
          CancelButton = true;
        }).catch(function () {
          console.log("Cancel Button is not present.")
          library.logFailStep("Cancel Button is not present");
        })
      }).then(function () {
        if (ReportTypeDropdown && MonthCalendar && CreateButton && CancelButton === true) {
          library.logStepWithScreenshot('Verified UI', 'UI');
          console.log("Verified UI");
          resolve(true);
        }
        else {
          console.log("Missing Components in UI");
          library.logFailStep("Missing Components in UI");
          resolve(false);
        }
      });
    });
  }
  verifyAllReportsTypeSelectedByDefault() {
    return new Promise((resolve) => {
      const allReportType = element(by.xpath(allreporttype));
      allReportType.getText().then(function (txt) {
        if (txt === "All, Monthly Evaluation, Lab Comparison, Lab Histogram") {
          library.logStepWithScreenshot('All report types are selected Bydefault', 'All report types are selected Bydefault');
          console.log("All report types are selected Bydefault");
          resolve(true);
        }
        else {
          library.logFailStep('All report types are not selected Bydefault');
          console.log("All report types are not selected Bydefault");
          resolve(false);
        }
      })
    })
  }
  SelectCalendar(month) {
    return new Promise((resolve) => {
      browser.sleep(3000);
      const monthPicker = element(by.xpath(calendar));
      console.log("month picker")
     library.clickJS(monthPicker);
      const selectmonth = element(by.xpath('.//tr[2]//div[contains(.,"'+month+'")]'));
      console.log("selectedmonth:" + './/tr[2]//div[contains(.,"'+month+'")]');
      selectmonth.isDisplayed().then(function () {
        library.clickJS(selectmonth);
        library.logStepWithScreenshot('Month is displayed and selected', 'Month is displayed and selected');
        console.log('Month is displayed and selected');
        resolve(true);
      }).catch(function () {
        library.logStep('Month is not displayed');
        console.log('Month is not displayed');
        resolve(false);
      });
    })
  }
  verifyIfSelectedMonthIsNavigatedToReportsTab(month) {
    return new Promise((resolve) => {
      const monthPicker = element(by.xpath(calendar));
      const selectmonth = element(by.xpath(selectedmonth));
      const Newreportstab = element(by.xpath(newreportsTab));
       this.SelectCalendar(month);
        this.clickOnCreateButton();
        browser.wait(browser.ExpectedConditions.visibilityOf(Newreportstab), 20000, 'Failed:Report tab is not visible');
        library.clickJS(monthPicker);
        selectmonth.getText().then((SelectedMonthinreporttab) => {
          console.log("selectedmonthinreportab:" + SelectedMonthinreporttab);
          if (month == SelectedMonthinreporttab) {
            library.logStepWithScreenshot('Month selected in Data entry form calendar is displayed in Reports tab calendar', 'Month selected in Data entry form is displayed in Reports tab calendar');
            console.log('Month selected in Data entry form calendar is displayed in Reports tab calendar');
            resolve(true);
          } else {
            library.logFailStep('Month selected in Data entry form calendar is not displayed in Reports tab calendar');
            console.log('Month selected in Data entry form calendar is not displayed in Reports tab calendar');
            resolve(false);
          }
       })
     
    })
  }
  verifyIfCreateButtonIsEnabled() {
    return new Promise((resolve) => {
      const CreateButton = element(by.xpath(createbutton));
      CreateButton.getAttribute('ng-reflect-disabled').then(function (value) {
        if (value.includes('false')) {
          library.logStepWithScreenshot("Create button is enabled", "Create button is enabled");
          console.log('Create button is enabled');
          resolve(true);
        } else {
          library.logFailStep("Create button is not enabled");
          console.log('Create button is not enabled');
          resolve(false);
        }
      });
    })
  }
}
