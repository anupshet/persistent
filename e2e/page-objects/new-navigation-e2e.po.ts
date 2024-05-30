/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { Dashboard } from './dashboard-e2e.po';
// import { dashboardStateIdentifier } from 'src/app/master/dashboard/state';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { truncateSync } from 'fs';

// var path = require('path');
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const department1 = '(//div[contains(@class,"primary-dispaly-text")])[4]';
const department2 = '(//div[contains(@class,"primary-dispaly-text")])[5]';
const backButton = '//button[contains(@class,"backArrow")]/span';
const closeButton = './/button[@class="mat-focus-indicator spec_toggle_navbar mat-icon-button mat-button-base"]';
const HamburgerIcon = '//mat-sidenav-content//button[contains(@class,"mat-focus-indicator")]//mat-icon/*[name()="svg"]';
const instruments = '//span/div[contains(@class,"primary-dispaly-text")]';
const controls = '//mat-nav-list//span//div[contains(@class,"primary-dispaly-text")]';
const analytes = '//mat-nav-list//unext-nav-side-bar-link/span/div[@class="primary-dispaly-text"]';
const editAnalyte = '//span[contains(text(),"Edit this analyte")]';
const analyteSetup = '//h5[contains(text(),"Add analytes")]';
const unityNextText = '//span[text()="Unity Next"]';
const runEntryInstr = '//span[text()="Run entry"]';
const levelEntryControl = '//span[text()="Level entry"]';
const dataEntryLink = '//a[text()="Manually enter summary"]';
const testResult = '//div[@class="mat-tab-label-content"][contains(text(),"TEST RESULTS")]';
const reports = '//div[@class="mat-tab-label-content"][contains(text(),"REPORTS")]';
const summaryEntry = '//mat-slide-toggle[contains(@class,"mat-checked")]';
const togglePoint = '//div[@class="mat-slide-toggle-thumb-container"]';
const SPCRules = '//label[contains(text(),"SPC rules")]';
const logo = '//a[@class="logo"]';
const manualentryLink = '//a[contains(text(),"MANUALLY ENTER DATA")]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';
const pointDataTable = './/div[contains(@class,"runs-table")]';
const dataTableComponentInstrumentControl = './/div[contains(@class,"formWrapper")]';

export class NewNavigation {
  verifyLeftNavigationAndCloseBtn(dept1, dept2) {
    let flag = false;
    return new Promise((resolve) => {
      const deptname = new Map<string, string>();
      deptname.set(dept1, department1);
      deptname.set(dept2, department2);
      browser.sleep(5000);
      deptname.forEach(function (key, value) {
        const deptname1 = element(by.xpath(key));
        deptname1.getText().then(function (text) {
          if (text === value) {
            console.log('Department name :' + text);
            library.logStep('Departments displayed');
            flag = true;
            resolve(flag);
          } else {
            console.log('Departments not displayed');
            library.logStep('Departments displayed');
            flag = true;
            resolve(flag);
          }
        });
      });
      const navCloseButton = findElement(locatorType.XPATH, closeButton);
      library.scrollToElement(navCloseButton);
      navCloseButton.isDisplayed().then(function () {
        console.log('Close Button displayed');
        library.logStep('Close button displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Close Button not displayed');
        library.logStep('Close Button not displayed');
        flag = false;
        resolve(flag);
      });
      library.scrollToElement(navCloseButton);
      library.clickJS(navCloseButton);
      dashBoard.waitForElement();
      const hamberger = findElement(locatorType.XPATH, HamburgerIcon);
      hamberger.isDisplayed().then(function () {
        console.log('hamberger icon displayed');
        library.logStep('hamberger icon displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('hamberger icon not displayed');
        library.logStep('hamberger icon not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyBackButtonNotPresent() {
    let flag = false;
    return new Promise((resolve) => {
      const navBackButton = element(by.xpath(backButton));
      dashBoard.waitForElement();
      navBackButton.isDisplayed().then(function () {
        console.log('Back Button displayed');
        library.logFailStep('Back Button displayed');
        flag = false;
        resolve(flag);
      }).catch(function () {
        console.log('Back Button is not displayed');
        library.logStepWithScreenshot('Back Button in not displayed', 'BackButtonNotDisplayed');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyCloseButton() {
    let flag = false;
    return new Promise((resolve) => {
      const navCloseButton = findElement(locatorType.XPATH, closeButton);
      library.scrollToElement(navCloseButton);
      navCloseButton.isDisplayed().then(function () {
        console.log('Close Button displayed');
        library.logStepWithScreenshot('Close button displayed', 'closeDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Close Button not displayed');
        library.logFailStep('Close Button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickCloseButton() {
    let flag = false;
    return new Promise((resolve) => {
      const navCloseButton = element(by.xpath(closeButton));
      navCloseButton.isDisplayed().then(function () {
        navCloseButton.click();
        console.log('Close Button clicked');
        library.logStep('Close button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyHumbergerIconDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const hamberger = findElement(locatorType.XPATH, HamburgerIcon);
      hamberger.isDisplayed().then(function () {
        console.log('hamberger icon displayed');
        library.logStepWithScreenshot('hamberger icon displayed', 'Hamburger');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('hamberger icon not displayed');
        library.logFailStep('hamberger icon not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickHamburger() {
    let flag = false;
    return new Promise((resolve) => {
      const hamberger = findElement(locatorType.XPATH, HamburgerIcon);
      hamberger.isDisplayed().then(function () {
        hamberger.click();
        console.log('hamberger icon clicked');
        library.logStep('hamberger icon clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyItemAndBackButton(dept1) {
    return new Promise((resolve) => {
      const deptName = findElement(locatorType.XPATH, '//h4[contains(text(),"' + dept1 + '")]');
      const backBtn = element(by.xpath(backButton));
      library.scrollToElement(deptName);
      deptName.isDisplayed().then(function () {
        library.scrollToElement(backBtn);
        backBtn.isDisplayed().then(function () {
          console.log(dept1 + ' and Back button displayed');
          library.logStepWithScreenshot(dept1 + ' and Back button displayed', dept1 + 'BackButtonDisplayed');
          resolve(true);
        });
      });
    });
  }

  clickBackArrow() {
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const backBtn = element(by.xpath(backButton));
      browser.wait(ExpectedConditions.elementToBeClickable(backBtn), 120000, 'Element is still not clickable')
      backBtn.isDisplayed().then(function () {
        backBtn.click();
        console.log('Back button is clicked');
        library.logStep('Back button is clicked');
        resolve(true);
      });
    });
  }

  verifyControlInstrumentDataTable() {
    return new Promise((resolve) => {
      const dataTableInstrumentControl = findElement(locatorType.XPATH, dataTableComponentInstrumentControl);
      dataTableInstrumentControl.isDisplayed().then(function () {
        console.log('Data Table displayed');
        library.logStepWithScreenshot('Data Table displayed', 'DataTable');
        resolve(true);
      }).catch(function () {
        console.log('Data Table is not displayed');
        library.logFailStep('Data Table is not displayed');
        resolve(false);
      })
    });
  }

  verifyListOfInstrumentControlsAndAnalytes(a, b, c, type) {
    return new Promise((resolve) => {
      browser.sleep(5000);
      let xpath;
      let flag1, flag2 = false;
      if (type === 'instruments') {
        xpath = instruments;
      }
      if (type === 'controls') {
        xpath = controls;
      }
      if (type === 'analytes') {
        xpath = analytes;
      }
      element.all(by.xpath(xpath))
        .each((ele, index) => {
          if (ele !== undefined) {
            ele.getText().then((text) => {
              if (text === a && flag1 === false) {
                flag1 = true;
              }
              if (flag1 === true) {
                if (text === b) {
                  flag2 = true;
                }
              }
              if (flag2 === true) {
                if (type === 'analytes') {
                  library.logStep('Department name, instrument name, control name, Analyte name & back button displayed');
                  console.log('Department name, instrument name, control name, Analyte name & back button displayed');
                  resolve(true);
                } else {
                  if (text === c) {
                    if (flag1 === true && flag2 === true) {
                      library.logStep('All fields & back button displayed');
                      console.log('All fields & back button displayed');
                      resolve(true);
                    }
                  }
                }
              }
            });
          }
        });
    });
  }

  verifyDeptAndBackButtonOnControlScreen(dept1, instr1) {
    let deptflag, backbuttonflag, instrflag, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const instrName = element(by.xpath('//div/h4[text()="' + instr1 + '"]'));
      const deptName = element(by.xpath('//ul[@class="breadcrumb"]//li/a[contains(text(),"' + dept1 + '")]'));
      const backBtn = element(by.xpath(backButton));
      library.scrollToElement(deptName);
      deptName.isDisplayed().then(function () {
        console.log('Department name displayed in the Breadcrumb');
        library.logStep('Department name displayed in the Breadcrumb');
        deptflag = true;
      });

      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        console.log('Instrument name displayed in the Breadcrumb');
        library.logStep('Instrument name displayed in the Breadcrumb');
        instrflag = true;
      });

      library.scrollToElement(backBtn);
      backBtn.isDisplayed().then(function () {
        console.log('Back button displayed');
        library.logStep('Back button displayed');
        backbuttonflag = true;
      });

      if (deptflag === true && backbuttonflag === true && instrflag === true) {
        displayed = true;
        library.logStep('Department name, instrument name & back button displayed');
        console.log('Department name ,instrument name& back button displayed');
        resolve(displayed);
      }
    });
  }


  verifyDeptAndBackButtonOnAnalyteScreen(dept1, instr1, contr1) {
    let deptflag, backbuttonflag, instrflag, contflag, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const deptName = element(by.xpath('//unext-nav-header/div/div/div[1]//li/a[contains(text(),"' + dept1 + '")]'));
      const instrName = element(by.xpath('//unext-nav-header/div/div/div[1]//li/a[contains(text(),"' + instr1 + '")]'));
      const controlName = element(by.xpath('//unext-nav-header/div/div/div[2]//div/div/h4[contains(text(),"' + contr1 + '")]'));
      const backBtn = element(by.xpath(backButton));

      library.scrollToElement(deptName);
      deptName.isDisplayed().then(function () {
        console.log('Department name displayed in the Breadcrumb');
        library.logStep('Department name displayed in the Breadcrumb');
        deptflag = true;
      });

      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        console.log('Instrument name displayed in the Breadcrumb');
        library.logStep('Instrument name displayed in the Breadcrumb');
        instrflag = true;
      });

      library.scrollToElement(controlName);
      controlName.isDisplayed().then(function () {
        console.log('Control name displayed in the Breadcrumb');
        library.logStep('Control name displayed in the Breadcrumb');
        contflag = true;
      });
      library.scrollToElement(backBtn);
      backBtn.isDisplayed().then(function () {
        console.log('Back button displayed');
        library.logStep('Back button displayed');
        backbuttonflag = true;
      });
      if (deptflag === true && backbuttonflag === true && instrflag === true && contflag === true) {
        displayed = true;
        library.logStep('Department name, instrument name & back button displayed');
        console.log('Department name ,instrument name& back button displayed');
        resolve(displayed);
      }
    });
  }

  verifyDataEntryPageAnalyte() {
    let diaplyed = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const pointDataTablepage = findElement(locatorType.XPATH, pointDataTable);
      pointDataTablepage.isDisplayed().then(function () {
        console.log('Point data table page is displayed');
        library.logStepWithScreenshot('Point data table page is displayed', 'PointDataTable');
        diaplyed = true;
        resolve(diaplyed);
      }).catch(function () {
        console.log('Point data table page is not displayed');
        library.logFailStep('Point data table page is not displayed');
        diaplyed = false;
        resolve(diaplyed);
      });
    });
  }

  verifyLinksInBreadcrum(lab, dept, inst) {
    let flag = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const labName = element(by.xpath('//li[contains(@class,"breadcrumb-item")]/a[contains(text(), "' + lab + '")]'));
      const deptName = element(by.xpath('//li[contains(@class,"breadcrumb-item")]/a[contains(text(), "' + dept + '")]'));
      const instName = element(by.xpath('//li[contains(@class,"breadcrumb-item")]/a[contains(text(), "' + inst + '")]'));
      labName.isDisplayed().then(function () {
        library.logStep('Lab Name displayed in Breadcrumb ' + lab);
        deptName.isDisplayed().then(function () {
          library.logStep('Department Name displayed in Breadcrumb ' + dept);
          instName.isDisplayed().then(function () {
            library.logStep('Instrument Name displayed in Breadcrumb ' + inst);
            library.logStepWithScreenshot('Breadcrumbs displayed correctly', 'breadcrumbsCorrect');
            flag = true;
            resolve(flag);
          });
        });
      }).catch(function () {
        library.logFailStep('Breadcrumbs not displayed correctly');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickBreadcrum(item) {
    let flag = false;
    return new Promise((resolve) => {
      const breadcrumb = element(by.xpath('//li[contains(@class,"breadcrumb-item")]/a[contains(text(), "' + item + '")]'));
      breadcrumb.isDisplayed().then(function () {
        library.logStep('Breadcrumb clicked ' + item);
        breadcrumb.click();
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Breadcrumbs not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyAnalyteSetUpScreen() {
    let flag = false;
    return new Promise((resolve) => {
      const addAnalyte = findElement(locatorType.XPATH, analyteSetup);
      addAnalyte.isDisplayed().then(function () {
        console.log('Analyte set up screen displayed');
        library.logStepWithScreenshot('Analyte set up screen displayed', 'AnalyteSetupPage');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Analyte set up screen is not displayed');
        library.logFailStep('Analyte set up screen is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyDashboardPage(dept1, instr1) {
    let flag1 = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const deptName = element(by.xpath('//mat-nav-list/unext-nav-side-bar-link/span/div[contains(text(),"' + dept1 + '")]'));
      library.scrollToElement(deptName);
      deptName.isDisplayed().then(function () {
        library.clickJS(deptName);
        console.log('Department name displayed ');
        library.logStep('Department name displayed ');
      });
      browser.sleep(8000);
      const instrName = element(by.xpath('.//div[contains(text(), "' + instr1 + '")]'));
      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        library.clickJS(instrName);
        console.log('Instrument name displayed ');
        library.logStep('Instrument name displayed');
      });
      browser.sleep(8000);
      const unityNext = element(by.xpath(unityNextText));
      library.scrollToElement(unityNext);
      unityNext.isDisplayed().then(function () {
        library.clickJS(unityNext);
        browser.sleep(8000);
        console.log('Dashboard displayed');
        library.logStep('Dashboard displayed ');
        flag1 = true;
        if (flag1 === true) {
          resolve(flag1);
        } else {
          flag1 = false;
          resolve(flag1);
        }
      });
    });
  }

  verifyDataTableDisplayed(dept1, instr1, cont1, analyte1) {
    let flag1, flag2, flag3, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const deptName = element(by.xpath('//mat-nav-list/unext-nav-side-bar-link/span/div[contains(text(),"' + dept1 + '")]'));
      library.scrollToElement(deptName);
      deptName.isDisplayed().then(function () {
        library.clickJS(deptName);
      });
      browser.sleep(8000);
      const instrName = element(by.xpath('.//div[contains(text(), "' + instr1 + '")]'));
      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        library.clickJS(instrName);
        browser.sleep(8000);
        const manualEntry = findElement(locatorType.XPATH, manualentryLink);
        library.scrollToElement(manualEntry);
        library.clickJS(manualEntry);
        const runEntryRadioBtn = element(by.xpath(runEntryInstr));
        runEntryRadioBtn.isDisplayed().then(function () {
          console.log(' Data Table page for the Instrument displayed ');
          library.logStep(' Data Table page for the Instrument displayed ');
          flag1 = true;
        });
      });
      browser.sleep(8000);
      const controlName = element(by.xpath('//mat-nav-list//span//div[contains(@class,"primary-dispaly-text")][contains(text(),"' + cont1 + '")]'));
      library.scrollToElement(controlName);
      controlName.isDisplayed().then(function () {
        library.clickJS(controlName);
        browser.sleep(8000);
        const manualEntry = findElement(locatorType.XPATH, manualentryLink);
        library.scrollToElement(manualEntry);
        library.clickJS(manualEntry);
        browser.sleep(8000);
        const levelEntryRadioBtn = element(by.xpath(levelEntryControl));
        library.scrollToElement(levelEntryRadioBtn);
        levelEntryRadioBtn.isDisplayed().then(function () {
          console.log(' Data Table page for the Control displayed ');
          library.logStep(' Data Table page for the Control displayed ');
          flag2 = true;

        });
      });

      const analyte = element(by.xpath('//mat-sidenav/div/div/div//unext-nav-side-bar-link/span/div[contains(text(),"' + analyte1 + '")]'));
      library.scrollToElement(analyte);
      analyte.isDisplayed().then(function () {
        library.clickJS(analyte);
        browser.sleep(8000);
        const link = element(by.xpath(dataEntryLink));
        link.isDisplayed().then(function () {
          console.log(' Data Table page for the Analyte displayed ');
          library.logStep(' Data Table page for the Analyte displayed ');
          flag3 = true;
        });
      }).then(function () {
        browser.sleep(8000);
        if (flag1 === true && flag2 === true && flag3 === true) {
          displayed = true;
          library.logStep('Data table page displayed');
          console.log('Data table page displayed');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Data table page not displayed');
          console.log('Data table page not sdisplayed');
          resolve(displayed);
        }
      });

    });
  }

  verifySPCRulesPage(dept1, instr1, cont1, analyte1) {
    let flag;
    return new Promise((resolve) => {
      const editanalayteLink = element(by.xpath(editAnalyte));
      dashBoard.waitForElement();
      library.scrollToElement(editanalayteLink);
      library.clickJS(editanalayteLink);
      dashBoard.waitForElement();
      browser.sleep(8000);
      const summaryDataEntry = element(by.xpath(summaryEntry));
      const toggle = element(by.xpath(togglePoint));
      library.scrollToElement(summaryDataEntry);
      // browser.sleep(2000);
      summaryDataEntry.getAttribute('class').then(function (focus) {
        if (focus.includes('checked')) {
          library.clickJS(toggle);
          // browser.sleep(8000);
          const SPC = element(by.xpath(SPCRules));
          SPC.isDisplayed().then(function (text) {
            console.log('SPC rules displayed');
            flag = true;
            resolve(flag);
          });
        } else {
          const SPC = element(by.xpath(SPCRules));
          SPC.isDisplayed().then(function (text) {
            console.log('SPC rules displayed');
            flag = true;
            resolve(flag);
          });
        }


      });

    });
  }

  verifyBioRadLogoNavigation() {
    let flag = false;
    return new Promise((resolve) => {
      console.log('inside promise');
      const bioRadLogo = element(by.xpath(logo));
      library.clickJS(bioRadLogo);
      console.log('Bio-Rad Logo Clicked');
      library.logStepWithScreenshot('Bio-Rad Logo Clicked', 'Bio-RadLogoClicked');
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[1]);
        dashBoard.waitForElement();
        browser.getTitle().then(function (title) {
          console.log('Title is: ' + title);
          if (title.includes('QCNet')) {
            console.log('qcnet.com opened');
            library.logStepWithScreenshot('qcnet.com opened', 'qcnetPageOpened');
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
            console.log('qcnet.com closed');
          } else {
            flag = false;
            resolve(flag);
            console.log('qcnet.com not opened');
            library.logFailStep('qcnet.com not opened');
          }
        });
      });
    });
  }

  verifyInstrwithNoDept(instr1) {
    return new Promise((resolve) => {
      console.log('inside promise');
      const instrName = element(by.xpath('.//div[contains(text(), "' + instr1 + '")]'));
      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        library.clickJS(instrName);
      });
    });
  }

  verifyHeader(keyword) {
    let flag = false;
    return new Promise((resolve) => {
      dashBoard.waitForScroll();
      const header = element(by.xpath(`//div[@class = "displayTitle"]/h4[contains(text(),"${keyword}")]`));
      header.isDisplayed().then(function () {
        library.logStepWithScreenshot(keyword + ' Header is displayed', 'HeaderDisplayed');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickHeader(keyword) {
    let flag = false;
    return new Promise((resolve) => {
      dashBoard.waitForScroll();
      const header = element(by.xpath(`//div[@class = "displayTitle"]/h4[contains(text(),"${keyword}")]`));
      library.clickJS(header);
      flag = true;
      resolve(flag);
    });
  }

  verifyItemDisplayed(item) {
    let flag = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const sideNav = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + item + '")]');
      sideNav.isDisplayed().then(function () {
        library.logStepWithScreenshot(item + ' is Displayed in left navigation', item + 'Displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep(item + ' is not Displayed in left navigation');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyTestResultsAndReportsTab() {
    let flag = false;
    return new Promise((resolve) => {
      const testResultEle = element(by.xpath(testResult));
      const reportsEle = element(by.xpath(reports));
      testResultEle.isDisplayed().then(function () {
        library.logStepWithScreenshot('Test Results Tab is displayed', 'TestResultsTab');
        reportsEle.isDisplayed().then(function () {
          library.logStepWithScreenshot('Reports Tab is displayed', 'ReportsTab');
          flag = true;
          resolve(flag);
        });
      }).catch(function () {
        library.logFailStep('Test Results & Reports Tabs are not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyInstrumentCustomName(customName, instrumentName) {
    let flag = false;
    return new Promise((resolve) => {
      const inst = findElement(locatorType.XPATH, './/mat-nav-list//div[@class="primary-dispaly-text"][contains(text(),"' + customName + '")]/following-sibling::div/span[contains(@class,"mat-small lot-number")][contains(text(),"' + instrumentName + '")]');
      inst.isDisplayed().then(function () {
        console.log('Instrument Custom name along with Instrument name is displayed in left navigation');
        library.logStepWithScreenshot('Instrument Custom name along with Instrument name is displayed in left navigation', 'CustomNameInstName');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Instrument Custom name along with Instrument name is not displayed in left navigation');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyControlCustomName(customName, controlName, lotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      const control = findElement(locatorType.XPATH, './/mat-nav-list//div[@class="primary-dispaly-text"][contains(text(),"' + customName + '")]/following-sibling::div/div[contains(text(),"' + controlName + '")]/following-sibling::span[@class="mat-small lot-number"][contains(text(),"' + lotNumber + '")]');
      control.isDisplayed().then(function () {
        console.log('Control Custom name along with Control name and Lot Number is displayed in left navigation');
        library.logStepWithScreenshot('Control Custom name along with Control name and Lot Number is displayed in left navigation', 'CustomNameControlName');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Control Custom name along with Control name and Lot Number is not displayed in left navigation');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyToolTip(toolTipMessage) {
    let status = false;
    return new Promise((resolve) => {
      const idString = 'cdk-describedby-message-';
      const toolTipElement = element(by.xpath('.//div[contains(@id,"' + idString + '")][contains(text(),"' + toolTipMessage + '")]'));
      toolTipElement.isDisplayed().then(function () {
        library.logStep('Tool Tip Displayed as: ' + toolTipMessage);
      });
      const backButton = element(by.xpath('//button[contains(@class,"backArrow")]/parent::div[contains(@aria-describedby,"' + idString + '")]'));
      backButton.isDisplayed().then(function () {
        library.hoverOverElement(backButton);
        library.logStepWithScreenshot('Back Button is displayed with Tooltip as ' + toolTipMessage, 'backButtonToolTip');
        status = true;
        resolve(status);
      });
    });
  }
}
