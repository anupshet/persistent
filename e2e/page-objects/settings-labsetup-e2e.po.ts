/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const dashBoard = new Dashboard();

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Settings.json', (err, data1) => {
  if (err) { throw err; }
  const settings = JSON.parse(data1);
  jsonData = settings;
});

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const greetingsFirstName = './/span[@id = "greetingTextFirstName"]';
const sideNavigation = './/mat-sidenav[@id = "sideNav"]';
const labName = './/div[contains(@class , "displayTitle")]/h4';
const gotoDeptSettingsToolTiip = '//div[@id = "ToolTip.GoToSettings"]';
const departmentCards = './/br-card[contains(@class, "cardDetails")]';
const sideNavElementsAll = './/unext-nav-side-bar-link//div[1]';
const deptCardName = '(.//mat-panel-title//span[contains(@class ,"mat-headline")])[1]';
const deptCardInstCount = '(.//mat-panel-title//span[contains(@class ,"panel-count-badge")])[1]';
const deptCardAddInstLink = '(.//button/span[contains(text(), "Add an Instrument")])[1]';
const depCardExpArrow = '(.//mat-expansion-panel-header[@role = "button"])[1]';
const deptCradNameTbx = './/input[@formcontrolname = "departmentName"]';
const deptCardManagerName = './/mat-select[@aria-label = " Manager name "]';
const deptCardCancel = './/button/span[contains(text(), "Cancel")]';
const deptCardUpdate = './/button/span[contains(text(), "update ")]';
const homePageLink = '//span[contains(text(), "Unity Next")]';
const headerLabNameBreadcrumb = './/div[contains(@class, "displayTitle")]/h4';
const headerSelectedNode = './/div[@class = "displayTitle"]';
const addInstPageView = './/unext-instrument-entry//mat-card[contains(@class, "instrument-entry-component")]';
const componentNameDataTablePage = '//*[@id="spec_analyteTitle"]';
const editThisInstrumentLink = './/button//span[contains(text(), "Edit this Instrument")]';
const reportsTab = './/div[@role = "tab"]/div[contains(text(), "REPORTS")]';
const editPageHeader = './/h2';
const returnToDataLink = './/span[contains(text(), "Return To data")]';
const addAButton = './/button/span[contains(text(),"Add a")]';
const instManufacturer = './/br-select[contains(@formcontrolname ,"instrumentManufacturer")]';
const updateInstBtn = './/button//span[contains(text(), "Update")]';
const instManufacturerDisabled = './/mat-select[contains(@aria-label,"Instrument manufacturer")][@aria-disabled = "true"]';
const instModelDisabled = './/mat-select[contains(@aria-label,"Instrument model")][@aria-disabled = "true"]';
const editThisControlLink = './/button//span[contains(text(), "Edit this Control")]';
const addAControl = './/button/span[contains(text(), "Add a Control")]';
const controlCustomName = '//input[@formcontrolname="customName"]';
const controlList1 = '(.//mat-select[@role = "listbox"])[1]';
const multipleLotNumbers = './/br-select[@formcontrolname = "lotNumber"]//*[@id = "multipleData"]';
const addControlButton = './/button[@type="submit"]';
const summStatTableAnalyte = './/br-summary-statistics-table/div';
const manuallyEnterTestRunAnalyte = './/a[contains(text(), "Manually enter")]';
const editThisAnalyteLink = './/button//span[contains(text(), "Edit this analyte")]';
const returnToDataLinkAnalyte = './/span[contains(text(), "Return to data")]';
const addDeptLink = './/button//span[contains(text(), "Add a Department")]';
const addAnalyte = './/button/span[contains(text(), "Add an Analyte")]';
const instManufacturerDrpdwn = '(//mat-select)[1]';
const instrumentModelDropdown = '//mat-select[contains(@aria-label,"Instrument model")]';
const addInstrumentButton = '//button[contains(@type,"submit")]';
const instCustomName = './/input[contains(@formcontrolname, "customName")]';
const instSerialNum = './/input[contains(@formcontrolname, "serialNumber" )]';
const confirmDeletePopup = './/unext-confirm-dialog-delete/div';
const confirmPopupMsg = './/mat-dialog-content/p';
const deleteButton = './/button[contains(@class, "icn-delete")]';
const confirmDelete = './/button/span[contains(text(), "CONFIRM DELETE")]';
const confirmCancelBtn = './/button/span[contains(text(), "CANCEL")]';
const confirmCloseBtn = './/mat-icon[contains(@class, "close")]';
const savedDataCell = './/unext-value-cell/div';
const savedDataEle = './/br-analyte-point-view/div';
const AddAnalyteLink = '//span[contains(text(),"Add an Analyte")]';
const controlNameDropDown = '//mat-select[contains(@aria-label,"Control Name")]';
const lotNoDropDown = '//mat-select[contains(@aria-label," Lot Number ")]';
const customName = '//input[@formcontrolname="customName"]';
const deleteBtnControl = '//button[@id="spc_delete_button"]//mat-icon';
const cancelBtnControl = '//button/span[contains(text(),"Cancel")]';
const updateBtnControl = '//button/span[contains(text(),"Update")]';
const deleteMsg = '//unext-confirm-dialog-delete//mat-dialog-content/p[text()="Are you sure you want to delete this ?"]';
const confirmDeleteBtn = '//unext-confirm-dialog-delete//span[contains(text(),"CONFIRM DELETE")]';
const cntrlCancelBtn = '//unext-confirm-dialog-delete//span[contains(text(),"CANCEL")]';
const reagentChkBox = '//div/input[@id="mat-checkbox-7-input"]';
const addAnalyteBtn = '//button//span[text()="Add Analytes"]';
const deleteBtnTestView = './/span/mat-icon[contains(text(),"delete")]';
const reagentDDArrow = './/mat-select[contains(@aria-label, "Reagent")]//div[contains(@class,"mat-select-value")]';
const firstOpt = '(.//mat-option/span)[1]';
const manuallyEnterTestRun = './/a[@class="manually-enter-test-run"]';
const decimalPlacesDDArrow = '(.//mat-select[@tabindex="0"]//div[contains(@class,"mat-select-value")])[1]';
const disableAllRulesToggle = './/input[contains(@id, "spec_disableNewRules-input")]';
const pointDataRadioButton = './/label[text()="Point"]/following-sibling::mat-radio-button';
const summaryDataRadioButton = './/label[text()="Summary"]/following-sibling::mat-radio-button';
const infoIcon = '(.//div[contains(@class, "info-tooltip-component")])[2]';
const copyInstrumentSectionHeader = './/h2/span[contains(text(),"Copy this instrument")]';
const toDepartmentDropdown = './/mat-select[@aria-label=" To department "]';
const customNameCopyInstrumentTextbx = '(.//mat-placeholder[contains(text(),"Custom name (optional)")]/parent::label/parent::span/parent::div/input)[2]';
const copyInstrumentDisabledButton = './/button[@disabled="true"]/span[contains(text(),"COPY")]';
const copyInstrumentButton = './/button/span[contains(text(),"COPY")]';
const instrumentManufacturer = './/mat-select[@aria-label=" Instrument manufacturer "]//span[contains(@class, "mat-select-value")]/span';
const instrumentModel = './/mat-select[@aria-label=" Instrument model "]//span[contains(@class,"mat-select-value")]/span';
const leftNavigationItems = './/mat-nav-list//div[contains(@class, "primary-dispaly-text")]';
const addInstrumentLink = './/button//mat-icon/following-sibling::span[contains(text(),"Add an Instrument")]';
const errorSameInstName = './/mat-error[contains(text(), "This instrument model already exists, please add another model or unique custom name.")]';
const controlToolTip = '//div[@class="perfect-scrollbar-wrapper"]//span[@class="mat-small lot-number" and contains(text(),"Lot")]';
const username = 'okta-signin-username';
const reagent = '//mat-select[@aria-label=" Reagent "]';
const deleteAnalyteButton = './/button[@id="spec_delete"]';
const confirmDeleteAnalyteButton = './/span[text()="CONFIRM DELETE"]/parent::button';
const summaryDataEntryLabel = './/label[contains(text(), "Summary")]';
const summaryDataEntryToggle = '(.//mat-radio-button[contains(@id, "mat-radio")])[1]';
const summaryRadioButton = './/mat-radio-group//label[contains(text(), "Summary")]/parent::div//mat-radio-button';
const levelsInUseLabel = './/label[contains(text(),"Levels in use")]';
const levelsInUseCheckboxes = './/div[@formarrayname="levels"]';
const decimalPlacesLabel = './/label[contains(text(),"Decimal")]';
const decimalPlacesDropdown = './/mat-select[@role="listbox"]';
const cancelButton = './/span[contains(text(), "Cancel")]';
const updateButton = '//span[contains(text(),"Update")]';
const archiveToggle = '//*[contains(@for,"spec_archive-input")]//input';


export class Settings {
  isDashboardDisplayed(firstname, labname) {
    let result, uname, sidenav, labnameEle, toolTip = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const greetingsFirtsname = element(by.xpath(greetingsFirstName));
      const sideNav = element(by.xpath(sideNavigation));
      const labNameEle = element(by.xpath(labName));
      const tooltip = element(by.xpath(gotoDeptSettingsToolTiip));
      library.waitForElement(greetingsFirtsname);
      greetingsFirtsname.isDisplayed().then(function () {
        greetingsFirtsname.getText().then(function (dispName) {
          if (dispName.includes(firstname)) {
            uname = true;
            library.logStep('User Name displayed');
            console.log('uname ' + dispName);
          }
        });
      }).then(function () {
        sideNav.isPresent().then(function () {
          sidenav = true;
          library.logStep('Side Navigation displayed');
          console.log('sidenav ' + sidenav);
        });
      }).then(function () {
        labNameEle.isDisplayed().then(function () {
          labNameEle.getText().then(function (name) {
            if (name.includes(labname)) {
              labnameEle = true;
              library.logStep('Lab Name displayed');
              console.log('labnameEle ' + labnameEle);
            }
          });
        });
      }).then(function () {
        library.hoverOverElement(labNameEle);
        tooltip.isDisplayed().then(function () {
          toolTip = true;
          library.logStep('Tooltip displayed');
          console.log('toolTip ' + toolTip);
        });
      }).then(function () {
        if (uname && sidenav && labnameEle && toolTip === true) {
          result = true;
          console.log('Dashboard Displayed to admin');
          library.logStepWithScreenshot('Dashboard Displayed to admin', 'Dashboard_displayed_Admin');
          resolve(result);
        }
      });
    });
  }

  goToDeptSettings() {
    let result = false;
    return new Promise((resolve) => {
      const labNameEle = findElement(locatorType.XPATH, labName);
      dashboard.waitForElement();
      // library.waitForElement(labNameEle);
      labNameEle.isDisplayed().then(function () {
        library.clickJS(labNameEle);
        dashboard.waitForPage();
        const deptCard = element(by.xpath('.//unext-department-management-component'));
        dashboard.waitForPage();
        // browser.wait(browser.ExpectedConditions.visibilityOf((deptCard)), 12000, 'Department card not displayed');
        deptCard.isDisplayed().then(function () {
          console.log('Lab name clicked');
          library.logStep('Lab name clicked');
          result = true;
          resolve(result);
        }).catch(function () {
          console.log('Department Settings not displayed');
          library.logStep('Department Settings not displayed');
          result = false;
          resolve(result);
        });
      });
    });
  }

  verifyLeftNavElementList(deptlist) {
    let result = false;
    let count = 0, number = 0;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const sideNav = element(by.xpath(sideNavigation));
      library.waitForElement(sideNav);
      sideNav.isPresent().then(function () {
        const list = element.all(by.xpath(sideNavElementsAll));
        list.count().then(function (num) {
          number = num;
          for (let i = 1; i <= num; i++) {
            const ele = element(by.xpath('(.//unext-nav-side-bar-link//div[1])[' + i + ']'));
            ele.getText().then(function (txt) {
              if (txt.includes(deptlist[i - 1])) {
                count++;
                console.log('Left navigation menu displayed with: ' + i + ' ' + txt);
                library.logStep('Left navigation menu displayed with: ' + i + ' ' + txt);
              }
            });
          }
        }).then(function () {
          if (count === number) {
            console.log('Side navigation displayed with list');
            library.logStep('Side navigation displayed with list');
            result = true;
            resolve(result);
          } else {
            library.logFailStep('Fail: Side navigation not displayed with list');
            result = false;
            resolve(result);
          }
        });
      });
    });
  }

  verifyDeptCardsDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const deptCard = element(by.xpath(departmentCards));
      deptCard.isDisplayed().then(function () {
        console.log('Department cards displayed');
        library.logStep('Department cards displayed');
        result = true;
        resolve(result);
      });
    });
  }

  verifyDeptCardUI() {
    let result, dname, instcount, addinslink, exparrow, deptnametxt, managernm, cancel, update = false;
    return new Promise((resolve) => {
      const expandArrow = findElement(locatorType.XPATH, depCardExpArrow);
      library.clickJS(expandArrow);
      const deptName1 = findElement(locatorType.XPATH, deptCardName);
      const instCount = findElement(locatorType.XPATH, deptCardInstCount);
      const addInstLink = findElement(locatorType.XPATH, deptCardAddInstLink);
      const depNameTbx = findElement(locatorType.XPATH, deptCradNameTbx);
      const manName = findElement(locatorType.XPATH, deptCardManagerName);
      // const decPlace = element(by.xpath(deptCradDecPlace));
      // const summTogg = element(by.xpath(deptCardSummTogg));
      const cancelBtn = findElement(locatorType.XPATH, deptCardCancel);
      const updateBtn = findElement(locatorType.XPATH, deptCardUpdate);
      library.waitForElement(deptName1);
      deptName1.isDisplayed().then(function () {
        deptName1.getText().then(function (dispName) {
          if (dispName.includes(jsonData.Dept1Name)) {
            dname = true;
            library.logStep('Department Name displayed');
            console.log('dname ' + dname);
          }
        });
      })
        .then(function () {
          instCount.isDisplayed().then(function () {
            instcount = true;
            library.logStep('Instrumement Count is displayed');
            console.log('instcount ' + instcount);
          });
        })
        .then(function () {
          addInstLink.isDisplayed().then(function () {
            addinslink = true;
            library.logStep('Add an instrumement link is displayed');
            console.log('addinslink ' + addinslink);
          });
        })
        .then(function () {
          expandArrow.isDisplayed().then(function () {
            exparrow = true;
            library.logStep('Department Card Expanded');
            console.log('exparrow ' + exparrow);
          });
        })
        .then(function () {
          depNameTbx.isDisplayed().then(function () {
            deptnametxt = true;
            library.logStep('Department Name Textbox is displayed');
            console.log('deptnametxt ' + deptnametxt);
          });
        })
        .then(function () {
          manName.isDisplayed().then(function () {
            managernm = true;
            library.logStep('Manager Name Textbox is displayed');
            console.log('managernm ' + managernm);
          });
        })
        // .then(function(){
        //   decPlace.isDisplayed().then(function () {
        //     decplace = true;
        //     library.logStep('Decimal Places is displayed');
        //     console.log('decplace ' + decplace);
        //   })
        // })
        // .then(function(){
        //   summTogg.isDisplayed().then(function () {
        //     summtogg = true;
        //     library.logStep('Summary Toggle is displayed');
        //     console.log('summtogg ' + summtogg);
        //   })
        // })
        .then(function () {
          cancelBtn.isDisplayed().then(function () {
            cancel = true;
            library.logStep('Cancel button is displayed');
            console.log('cancel ' + cancel);
          });
        })
        .then(function () {
          updateBtn.isDisplayed().then(function () {
            update = true;
            library.logStep('Update button is displayed');
            console.log('update ' + update);
          });
        }).then(function () {
          if (dname && instcount && addinslink && exparrow && deptnametxt && managernm && cancel && update === true) {
            console.log('Department card UI Elements verified');
            library.logStepWithScreenshot('Department_card_UI', 'Department card UI');
            result = true;
            resolve(result);
          }
        });
    });
  }

  clickAddAnInstrumentLink() {
    let result = false;
    return new Promise((resolve) => {
      const deptCard = element(by.xpath(departmentCards));
      deptCard.isDisplayed().then(function () {
        const instLink = element(by.xpath(deptCardAddInstLink));
        library.clickJS(instLink);
        console.log('Add an isntrument link clicked');
        library.logStep('Add an isntrument link clicked');
        result = true;
        resolve(result);
      });
    });
  }

  verifyAddInstrumentPageUI() {
    let result, headlabname, selectednode, instpage = false;
    return new Promise((resolve) => {
      const headerLabName = element(by.xpath(headerLabNameBreadcrumb));
      const headerSelectedDept = findElement(locatorType.XPATH, headerSelectedNode);
      const addInstrumentPage = findElement(locatorType.XPATH, addInstPageView);

      // dashboard.waitForPage();
      library.waitForElement(headerLabName);
      headerLabName.isDisplayed().then(function () {
        headerLabName.getText().then(function (text) {
          if (text.includes(jsonData.labName)) {
            headlabname = true;
            console.log('Lab name ' + text + ' is displayed in header');
            library.logStep('Lab name ' + text + ' is displayed in header');
          }
        });
      }).then(function () {
        headerSelectedDept.getText().then(function (text) {
          if (text.includes(jsonData.Dept1Name)) {
            selectednode = true;
            console.log('Selected node is ' + text);
            library.logStep('Selected node is ' + text);
          }
        });
      }).then(function () {
        addInstrumentPage.isPresent().then(function () {
          instpage = true;
          console.log('Add instrument page is displayed');
          library.logStep('Add instrument page is displayed');
        });
      }).then(function () {
        if (headlabname && selectednode && instpage === true) {
          result = true;
          console.log('Add Instrument page, Selected Department node is dispalyed');
          resolve(result);
        }
      });
    });
  }

  navigateTO(to) {
    let flag = false;
    return new Promise(async (resolve) => {
      dashboard.waitForElement();
      const sideNav = element(by.xpath('//mat-nav-list//div[contains(text(),"' + to + '")]'));
      browser.executeScript('arguments[0].scrollIntoView(true);', sideNav);
      browser.wait(browser.ExpectedConditions.visibilityOf((sideNav)), 30000, 'Side navigation not visible: ' + to);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        dashboard.waitForScroll();
        flag = true;
        library.logStep('User is navigated to ' + to);
        console.log('User is navigated to ' + to);
        resolve(flag);
      }).catch(function () {
        flag = true;
        library.logStep('Not displayed' + to);
        console.log('Not displayed' + to);
        resolve(flag);
      });
    });
  }

  navigateTODept(to) {
    let flag = false;
    return new Promise(async (resolve) => {
      dashboard.waitForElement();
      const sideNav = element(by.xpath('//mat-nav-list//div[text()=" ' + to + ' "]'));
      browser.executeScript('arguments[0].scrollIntoView(true);', sideNav);
      browser.wait(browser.ExpectedConditions.visibilityOf((sideNav)), 30000, 'Side navigation not visible: ' + to);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        dashboard.waitForScroll();
        flag = true;
        library.logStep('User is navigated to ' + to);
        console.log('User is navigated to ' + to);
        resolve(flag);
      }).catch(function () {
        flag = true;
        library.logStep('Not displayed' + to);
        console.log('Not displayed' + to);
        resolve(flag);
      });
    });
  }


  isInstrumentPageDisplayed(instrument) {
    let result, name, link, tab = false;
    return new Promise((resolve) => {
      const instrumentName = element(by.xpath(componentNameDataTablePage));
      const editThisInstlink = element(by.xpath(editThisInstrumentLink));
      const reportsTabEle = element(by.xpath(reportsTab));
      // dashboard.waitForPage();
      library.waitForElement(instrumentName);
      instrumentName.isDisplayed().then(function () {
        instrumentName.getText().then(function (text) {
          if (text.includes(instrument)) {
            name = true;
            console.log('Instrument name ' + text + ' is displayed in header');
            library.logStep('Instrument name ' + text + ' is displayed in header');
          }
        });
      }).then(function () {
        editThisInstlink.isDisplayed().then(function () {
          link = true;
          console.log('Edit this instrument link is displayed');
          library.logStep('Edit this instrument link is displayed');
        });
      }).then(function () {
        reportsTabEle.isDisplayed().then(function () {
          tab = true;
          console.log('Reports Tab is displayed');
          library.logStep('Reports Tab is displayed');
        });
      }).then(function () {
        if (name && link && tab === true) {
          result = true;
          console.log('Instrument Data table page is dispalyed along with Edit this isntrument link');
          library.logStep('Instrument Data table page is dispalyed along with Edit this isntrument link');
          resolve(result);
        }
      });
    });
  }

  isInstrumentPageDisplayedToUser(instrument) {
    let result, name, tab = false;
    return new Promise((resolve) => {
      const instrumentName = element(by.xpath('.//h1[contains(text(),"' + instrument + '")]'));
      const reportsTabEle = element(by.xpath(reportsTab));
      library.waitForElement(instrumentName);
      instrumentName.isDisplayed().then(function () {
        instrumentName.getText().then(function (text) {
          if (text.includes(instrument)) {
            name = true;
            console.log('Instrument name ' + text + ' is displayed in header');
            library.logStep('Instrument name ' + text + ' is displayed in header');
          }
        });
      }).then(function () {
        reportsTabEle.isDisplayed().then(function () {
          tab = true;
          console.log('Reports Tab is displayed');
          library.logStep('Reports Tab is displayed');
        });
      }).then(function () {
        if (name && tab === true) {
          result = true;
          console.log('Instrument Data table page is dispalyed to user');
          library.logStepWithScreenshot('Instrument Data table page is dispalyed to user', 'InstrumentPageDisplayed');
          resolve(result);
        }
      });
    });
  }


  clickOnEditThisInstrumentLink() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const editThisInstlink = element(by.xpath(editThisInstrumentLink));
      dashboard.waitForScroll();
      editThisInstlink.isDisplayed().then(function () {
        console.log('Edit this inst displayed');
        library.clickJS(editThisInstlink);
        dashboard.waitForElement();
        console.log('Edit this Instrument link clicked');
        library.logStep('Edit this Instrument link clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Edit this Instrument link not displayed');
        library.logStep('Edit this Instrument link not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  isEditInstrumentPageDisplayed(name) {
    let result, head, returnto, addbtn = false;
    return new Promise((resolve) => {
      const editInstPageHeader = findElement(locatorType.XPATH, editPageHeader);
      const returnToData = findElement(locatorType.XPATH, returnToDataLink);
      const addAControl1 = element(by.xpath(addAButton));
      library.waitForElement(editInstPageHeader);
      editInstPageHeader.isDisplayed().then(function () {
        editInstPageHeader.getText().then(function (text) {
          if (text.includes(name)) {
            console.log(text + ' instrument edit page is displayed');
            library.logStep(text + ' instrument edit page is displayed');
            head = true;
          }
        });
      }).then(function () {
        returnToData.isDisplayed().then(function () {
          returnto = true;
          console.log('Return to data link is displayed');
          library.logStep('Return to data link is displayed');
        });
      }).then(function () {
        addAControl1.isDisplayed().then(function () {
          addbtn = true;
          console.log('Add a control is displayed');
          library.logStep('Add a control is displayed');
        });
      }).then(function () {
        if (head && returnto && addbtn === true) {
          result = true;
          console.log('Edit instrument page is displayed');
          library.logStep('Edit instrument page is displayed');
          resolve(result);
        }
      });
    });
  }


  isControlPageDisplayed(control) {
    let result, name, link = false;
    return new Promise((resolve) => {
      const controlName = element(by.xpath(componentNameDataTablePage));
      const editThislink = element(by.xpath(editThisControlLink));
      browser.wait(browser.ExpectedConditions.visibilityOf((controlName)), 5000, 'controlName not visible');
      controlName.isDisplayed().then(function () {
        controlName.getText().then(function (text) {
          if (text.includes(control)) {
            name = true;
            console.log('Control name ' + text + ' is displayed in header');
            library.logStep('Control name ' + text + ' is displayed in header');
          }
        });
      }).then(function () {
        editThislink.isDisplayed().then(function () {
          link = true;
          console.log('Edit this control link is displayed');
          library.logStep('Edit this control link is displayed');
        });
      }).then(function () {
        if (name && link === true) {
          result = true;
          console.log('Control Data table page is dispalyed along with Edit this control link');
          library.logStepWithScreenshot('Control Data table page is dispalyed along with Edit this control link', 'ControlPageDisplayed');
          resolve(result);
        }
      });
    });
  }


  clickOnEditThisControlLink() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const editThislink = element(by.xpath(editThisControlLink));
      editThislink.isDisplayed().then(function () {
        library.clickJS(editThislink);
        dashboard.waitForElement();
        console.log('Edit this control link clicked');
        library.logStep('Edit this control link clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Edit this control link not displayed');
        library.logStep('Edit this control link not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  isEditControlPageDisplayed(name) {
    let result, head, returnto, addbtn = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const editContPageHeader = findElement(locatorType.XPATH, editPageHeader);
      const returnToData = findElement(locatorType.XPATH, returnToDataLink);
      const addAnalyte1 = findElement(locatorType.XPATH, addAButton);
      library.waitForElement(editContPageHeader);
      editContPageHeader.isDisplayed().then(function () {
        editContPageHeader.getText().then(function (text) {
          if (text.includes(name)) {
            console.log(text + ' control edit page is displayed');
            library.logStep(text + ' control edit page is displayed');
            head = true;
          }
        });
      }).then(function () {
        returnToData.isDisplayed().then(function () {
          returnto = true;
          console.log('Return to data link is displayed');
          library.logStep('Return to data link is displayed');
        });
      }).then(function () {
        addAnalyte1.isDisplayed().then(function () {
          addbtn = true;
          console.log('Add an Analyte is displayed');
          library.logStep('Add an Analyte is displayed');
        });
      }).then(function () {
        if (head && returnto && addbtn === true) {
          result = true;
          console.log('Edit control page is displayed');
          library.logStep('Edit control page is displayed');
          resolve(result);
        }
      });
    });
  }

  isAnalytePageDisplayed(Analyte) {
    let result, name, link, summ, add = false;
    return new Promise((resolve) => {
      const analyteName = element(by.xpath(componentNameDataTablePage));
      const editThislink = element(by.xpath(editThisAnalyteLink));
      const summary = element(by.xpath(summStatTableAnalyte));
      // const levelJenning = element(by.xpath(levelJenningAnalyte))
      const manuallyEnterTestRun1 = element(by.xpath(manuallyEnterTestRunAnalyte));

      dashboard.waitForPage();
      library.waitForElement(analyteName);
      analyteName.isDisplayed().then(function () {
        analyteName.getText().then(function (text) {
          if (text.includes(Analyte)) {
            name = true;
            console.log('Analyte name ' + text + ' is displayed in header');
            library.logStep('Analyte name ' + text + ' is displayed in header');
          } else {
            name = false;
            console.log('Analyte name not displayed in header');
            library.logFailStep('Analyte name not displayed in header');
          }
        });
      }).then(function () {
        editThislink.isDisplayed().then(function () {
          link = true;
          console.log('Edit this Analyte link is displayed');
          library.logStep('Edit this Analyte link is displayed');
        }).catch(function () {
          link = false;
          console.log('Edit this Analyte link not displayed');
          library.logFailStep('Edit this Analyte link not displayed');
        });
      }).then(function () {
        summary.isDisplayed().then(function () {
          summ = true;
          console.log('Summary Statistics chart is displayed ');
          library.logStep('Summary Statistics chart is displayed ');
        }).catch(function () {
          summ = false;
          console.log('Summary Statistics chart not displayed');
          library.logFailStep('Summary Statistics chart not displayed');
        });
      }).then(function () {
        manuallyEnterTestRun1.isDisplayed().then(function () {
          add = true;
          console.log('Manually Enter Test Run link is displayed');
          library.logStep('Manually Enter Test Run link is displayed');
        }).catch(function () {
          add = false;
          console.log('Manually Enter Test Run link not displayed');
          library.logStep('Manually Enter Test Run link not displayed');
        });
      })
        .then(function () {
          if (name && link && summ && add === true) {
            result = true;
            console.log('Analyte Data table page is dispalyed along with Edit this Analyte link');
            library.logStep('Analyte Data table page is dispalyed along with Edit this Analyte link');
            resolve(result);
          } else {
            result = false;
            console.log('Analyte Data table page not dispalyed along with Edit this Analyte link');
            library.logStep('Analyte Data table page not dispalyed along with Edit this Analyte link');
            resolve(result);
          }
        });
    });
  }

  clickOnEditThisAnalyteLink() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const editThislink = findElement(locatorType.XPATH, editThisAnalyteLink);
      editThislink.isDisplayed().then(function () {
        library.clickJS(editThislink);
        dashboard.waitForElement();
        console.log('Edit this Analyte link clicked');
        library.logStep('Edit this Analyte link clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Edit this analyte link not displayed');
        library.logStep('Edit this analyte link not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  isEditAnalytePageDisplayed(name) {
    let result, head, returnto = false;
    return new Promise((resolve) => {
      const editAnalytePageHeader = element(by.xpath(editPageHeader));
      const returnToData = element(by.xpath(returnToDataLinkAnalyte));
      library.waitForElement(editAnalytePageHeader);
      editAnalytePageHeader.isDisplayed().then(function () {
        editAnalytePageHeader.getText().then(function (text) {
          if (text.includes(name)) {
            console.log(text + ' analyte edit page is displayed');
            library.logStep(text + ' analyte edit page is displayed');
            head = true;
          }
        });
      }).then(function () {
        returnToData.isDisplayed().then(function () {
          returnto = true;
          console.log('Return to data link is displayed');
          library.logStep('Return to data link is displayed');
        });
      }).then(function () {
        if (head && returnto === true) {
          result = true;
          console.log('Edit analyte page is displayed');
          library.logStep('Edit analyte page is displayed');
          resolve(result);
        }
      }).catch(function () {
        result = false;
        console.log('Edit analyte page element not displayed');
        library.logStep('Edit analyte page element not displayed');
        resolve(result);
      });
    });
  }

  clickOnAddADepartmentLink() {
    let result = false;
    return new Promise((resolve) => {
      const addDeptLinkEle = element(by.xpath(addDeptLink));
      browser.executeScript('arguments[0].scrollIntoView(true);', addDeptLinkEle);
      library.waitForElement(addDeptLinkEle);
      addDeptLinkEle.isDisplayed().then(function () {
        library.clickJS(addDeptLinkEle);
        console.log('Add a Department Link Clicked');
        library.logStep('Add a Department Link Clicked');
        dashboard.waitForPage();
        result = true;
        resolve(result);
      });
    });
  }


  verifySavedComponent(componentName) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const depName = element(by.xpath('//mat-nav-list//div[contains(text(),"' + componentName + '")]'));
      // browser.wait(browser.ExpectedConditions.visibilityOf((depName)), 12000, 'Department name not displayed');
      // library.waitForElement(depName);
      depName.isDisplayed().then(function () {
        console.log('Component is displayed: ' + componentName);
        library.logStep('Component is displayed: ' + componentName);
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Component not displayed: ' + componentName);
        library.logStep('Component not displayed: ' + componentName);
        result = false;
        resolve(result);
      });
    });
  }

  verifyComponentNotDisplayed(componentName) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const depName = element(by.xpath('//mat-nav-list//div[contains(text(),"' + componentName + '")]'));
      // library.waitForElement(depName);
      depName.isDisplayed().then(function () {
        console.log('Component displayed: ' + componentName);
        library.logStep('Component displayed: ' + componentName);
        result = false;
        resolve(result);
      }).catch(function () {
        dashboard.waitForPage();
        console.log('Component not displayed: ' + componentName);
        library.logStep('Component not displayed: ' + componentName);
        result = true;
        resolve(result);
      });
    });
  }

  clickOnAddInstLinkForSpecificDept(deptname) {
    let result = false;
    return new Promise((resolve) => {
      const link = element(by.xpath('.//mat-panel-title//span[contains(@class, "mat-headline")][contains(text(), "' + deptname + '")]/parent::div/parent::div/following-sibling::div//button'));
      browser.executeScript('arguments[0].scrollIntoView();', link);
      library.waitForElement(link);
      link.isDisplayed().then(function () {
        library.clickJS(link);
        console.log('Add Instrument link is clicked for dept ' + deptname);
        library.logStep('Add Instrument link is clicked for dept ' + deptname);
        dashboard.waitForPage();
        result = true;
        resolve(result);
      });
    });
  }

  addInstrument(instrumentDetails1,instrumentDetails2) {
    let result = false;
    const manufacturerName = instrumentDetails1;
    const instrumentmodel = instrumentDetails2;
    return new Promise((resolve) => {
      // library.waitForPage();
      const manufatureNameArrow = element(by.xpath(instManufacturerDrpdwn));
      library.waitForElement(manufatureNameArrow);
      library.clickJS(manufatureNameArrow);
      library.logStep('Intrument manufacturer dropdown clicked.');
      // browser.sleep(2000);
      const selectName = element(by.xpath('//mat-option/span[contains(text(),"' + manufacturerName + '")]'));
      library.waitForElement(selectName);
      library.clickJS(selectName);
      library.logStep(manufacturerName + ' is selected');
      // browser.sleep(2000);
      const instrumentModelEle = element(by.xpath(instrumentModelDropdown));
      library.waitForElement(instrumentModelEle);
      library.clickJS(instrumentModelEle);
      library.logStep('Intrument model dropdown clicked.');
      // browser.sleep(2000);
      const selectModel = element(by.xpath('//mat-option/span[contains(text(),"' + instrumentmodel + '")]'));
      library.waitForElement(selectModel);
      library.clickJS(selectModel);
      library.logStep(instrumentmodel + ' is selected');
      // browser.sleep(5000);
      const enabledAddInstrument = element(by.xpath(addInstrumentButton));
      library.scrollToElement(enabledAddInstrument);
      enabledAddInstrument.isDisplayed().then(function (status) {
        library.clickJS(enabledAddInstrument);
        dashboard.waitForElement();
        result = true;
        library.logStep('Add Instrument clicked.');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logFailStep('Unable to click Add Instrument');
        resolve(result);
      });
    });
  }

  clickOnAddControlLink() {
    let result = false;
    return new Promise((resolve) => {
      const link = element(by.xpath(addAControl));
      library.waitForElement(link);
      browser.wait(browser.ExpectedConditions.visibilityOf((link)), 10000, 'Add Control link not visible');
      link.isDisplayed().then(function () {
        library.clickJS(link);
        console.log('Add a control link clicked');
        library.logStep('Add a control link clicked');
        result = true;
        resolve(result);
      });
    });
  }

  clickOnAddAnalyteLink() {
    let result = false;
    return new Promise((resolve) => {
      const link = element(by.xpath(addAnalyte));
      library.waitForElement(link);
      link.isDisplayed().then(function () {
        library.clickJS(link);
        console.log('Add an Analyte link clicked');
        library.logStep('Add an Analyte link clicked');
        result = true;
        resolve(result);
      });
    });
  }

  clickOnDeleteBtn() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      // library.waitForPage();
      const btn = element(by.xpath(deleteButton));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      library.waitForElement(btn);
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        const confirm = element(by.xpath(confirmDelete));
        library.clickJS(confirm);
        console.log('Delete Button clicked');
        library.logStep('Delete Button clicked');
        // library.waitForPage();
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Delete button is not displayed');
        library.logStep('Delete button is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyDeleteIconNotDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deleteButton));
      btn.isDisplayed().then(function () {
        console.log('Delete button is displayed');
        library.logStep('Delete button is displayed');
        result = false;
        resolve(result);
      }).catch(function () {
        console.log('Delete Button is not displayed');
        library.logStep('Delete Button is not displayed');
        result = true;
        resolve(result);
      });
    });
  }
  verifyDeleteIconDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deleteButton));
      btn.isDisplayed().then(function () {
        console.log('Delete button is displayed');
        library.logStep('Delete button is displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Delete Button is not displayed');
        library.logStep('Delete Button is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  isDataSaved() {
    let result, flag1, flag2 = false;
    return new Promise((resolve) => {
      const data = element(by.xpath(savedDataCell));
      const multiPointData = element(by.xpath(savedDataEle));
      data.isPresent().then(function () {
        flag1 = true;
        console.log('Data is available at point level');
        library.logStep('Data is available at point level');
      }).catch(function () {
        multiPointData.isPresent().then(function () {
          flag2 = true;
          console.log('Multi point data is available');
          library.logStep('Multi point data is available');
        });
      }).then(function () {
        if (flag1 || flag2 === true) {
          result = true;
          console.log('Data is available');
          library.logStep('Data is available');
          resolve(result);
        }
      });
    });
  }
  verifyControlSettings_UpdateMethod() {
    let dataEntry, chkboxes, decimal, buttons, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsLabel = element(by.xpath(levelsInUseLabel));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));

      const cancelBtn = element(by.xpath(cancelButton));
      const updateBtn = element(by.xpath(updateButton));

      dataEntryLabel.isDisplayed().then(function () {
        console.log('Summary Data Entry label button is displayed.');
        library.logStep('Summary Data Entry label button is displayed.');
      }).then(function () {
        dataEntryToggle.isDisplayed().then(function () {
          console.log('Summary Data Entry Toggle button is displayed.');
          library.logStep('Summary Data Entry Toggle button is displayed.');
          dataEntry = true;

        });
      }).then(function () {
        levelsLabel.isDisplayed().then(function () {
          levelsCheckboxes.count().then(function (count) {
            if (count >= 1) {
              console.log('Levels in Use,  checkboxes are displayed.');
              library.logStep('Levels in Use,  checkboxes are displayed.');
              chkboxes = true;
            }
          });
        }).then(function () {
          decimalLabel.isDisplayed().then(function () {
            console.log('decimalLabel  displayed');
            library.logStep('decimalLabel displayed');

          });
        }).then(function () {
          decimalDD.isDisplayed().then(function () {
            console.log('Decimal Places dropdown is displayed.');
            library.logStep('Decimal Places dropdown is displayed.');
            decimal = true;
          });
        }).then(function () {
          cancelBtn.isDisplayed().then(function () {
            console.log('Cancel button displayed');
            library.logStep('Cancel button displayed');
          });
        }).then(function () {
          updateBtn.isDisplayed().then(function () {
            console.log('Update button displayed');
            library.logStep('Update button displayed');
            buttons = true;
          });
        }).then(function () {

          if (dataEntry && decimal && buttons && chkboxes === true) {
            console.log('dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons + ' chkboxes ' + chkboxes);
            library.logStep('Edit Page is displayed properly.');
            displayed = true;
            resolve(displayed);
          }
          else {
            console.log(' dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons + ' chkboxes ' + chkboxes);
            displayed = false;
            resolve(displayed);
          }
        })


      });
    });
  }
  verifyAnalyteSettings_UpdatedMethod() {
    let dataEntry, chkboxes, decimal, buttons, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsLabel = element(by.xpath(levelsInUseLabel));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));

      const cancelBtn = element(by.xpath(cancelButton));
      const updateBtn = element(by.xpath(updateButton));

      dataEntryLabel.isDisplayed().then(function () {
        console.log('Summary Data Entry label button is displayed.');
        library.logStep('Summary Data Entry label button is displayed.');
      }).then(function () {
        dataEntryToggle.isDisplayed().then(function () {
          console.log('Summary Data Entry Toggle button is displayed.');
          library.logStep('Summary Data Entry Toggle button is displayed.');
          dataEntry = true;

        });
      }).then(function () {
        levelsLabel.isDisplayed().then(function () {
          levelsCheckboxes.count().then(function (count) {
            if (count >= 1) {
              console.log('Levels in Use,  checkboxes are displayed.');
              library.logStep('Levels in Use,  checkboxes are displayed.');
              chkboxes = true;
            }
          });
        }).then(function () {
          decimalLabel.isDisplayed().then(function () {
            console.log('decimalLabel  displayed');
            library.logStep('decimalLabel displayed');

          });
        }).then(function () {
          decimalDD.isDisplayed().then(function () {
            console.log('Decimal Places dropdown is displayed.');
            library.logStep('Decimal Places dropdown is displayed.');
            decimal = true;
          });
        }).then(function () {
          cancelBtn.isDisplayed().then(function () {
            console.log('Cancel button displayed');
            library.logStep('Cancel button displayed');
          });
        }).then(function () {
          updateBtn.isDisplayed().then(function () {
            console.log('Update button displayed');
            library.logStep('Update button displayed');
            buttons = true;
          });
        }).then(function () {

          if (dataEntry && decimal && buttons && chkboxes === true) {
            console.log('dataEntry ' + dataEntry + 'decimal ' + decimal + ' buttons ' + buttons);
            library.logStep('Edit Analyte Page is displayed properly.');
            displayed = true;
            resolve(displayed);
          }
          else {
            console.log(' dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons);
            displayed = false;
            resolve(displayed);
          }
        })


      });
    });
  }


  goToHomePage() {
    let result = false;
    return new Promise((resolve) => {
      // browser.sleep(10000);
      const link = element(by.xpath(homePageLink));
      library.waitForElement(link);
      link.isDisplayed().then(function () {
        library.clickJS(link);
        // dashboard.waitForElement();
        // const good = element(by.xpath(goodGreeting));
        // library.waitForElement(good);
        // browser.sleep(10000);
        console.log('Navigated to Home Page');
        library.logStep('Navigated to Home Page');
        result = true;
        resolve(result);
      });
    });
  }

  expandDeptCard(department) {
    let result = false;
    return new Promise((resolve) => {
      // const depCard = element
      // (by.xpath('.//mat-panel-title//span[contains(@class,"mat - headline")][contains(text(),"' + department + '")]'));
      const depCard =
        findElement(locatorType.XPATH, './/mat-panel-title//span[contains(@class,"mat-headline")][contains(text(),"' + department + '")]');
      browser.executeScript('arguments[0].scrollIntoView(true);', depCard);
      depCard.isDisplayed().then(function () {
        library.clickJS(depCard);
        console.log(department + ' card is expanded');
        library.logStep(department + ' card is expanded');
        result = true;
        resolve(result);
      }).catch(function () {
        result = false;
        console.log(department + ' Department card not displayed');
        library.logStep(department + ' Department card not displayed');
        resolve(result);
      });
    });
  }

  verifyInstAvailableInDept(department) {
    let result = false;
    return new Promise((resolve) => {
      const instNum = element(by.xpath('.//mat-panel-title//span[contains(text(), "' + department + '")]/parent::div//span[contains(@class, "panel-count-badge")]/em'));
      instNum.getText().then(function (txt) {
        const count = +txt;
        if (count > 0) {
          console.log(count + ' instruments are in ' + department);
          library.logStep(count + ' instruments are in ' + department);
          result = true;
          resolve(result);
        }
      });
    });
  }

  changeDeptName(newName) {
    let result = false;
    return new Promise((resolve) => {
      const depName = element(by.xpath(deptCradNameTbx));
      browser.executeScript('arguments[0].scrollIntoView(true);', depName);
      depName.isDisplayed().then(function () {
        depName.clear().then(function () {
          depName.sendKeys(newName);
          result = true;
          resolve(result);
          console.log('Department name is changed to ' + newName);
          library.logStep('Department name is changed to ' + newName);
        });
      });
    });
  }

  changeDeptManager() {
    let result = false;
    return new Promise((resolve) => {
      const manName = findElement(locatorType.XPATH, deptCardManagerName);
      const manOpt = element(by.xpath('.//mat-option[2]'));
      browser.executeScript('arguments[0].scrollIntoView(true);', manName);
      manName.isDisplayed().then(function () {
        library.clickJS(manName);
        library.clickJS(manOpt);
        dashboard.waitForElement();
        console.log('Department manager name changed');
        library.logStep('Department manager name changed');
        result = true;
        resolve(result);
      });
    });
  }

  clickCancelDeptCard() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deptCardCancel));
      btn.isEnabled().then(function () {
        library.clickJS(btn);
        console.log('Cancel clicked');
        library.logStep('Cancel clicked');
        result = true;
        resolve(result);
      });
    });
  }

  verifyDeptCardDisplayedSavedVal(deptName1) {
    let result = false;
    return new Promise((resolve) => {
      const dep = element(by.xpath(deptCradNameTbx));
      dep.getAttribute('value').then(function (txt) {
        if (txt.includes(deptName1)) {
          console.log('Department card is displying old data: ' + txt);
          library.logStep('Department card is displying old data: ' + txt);
          result = true;
          resolve(result);
        }
      });
    });
  }

  clickUpdateDeptBtn() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deptCardUpdate));
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashboard.waitForPage();
        dashboard.waitForPage();
        console.log('Update department button clicked');
        library.logStep('Update department button clicked');
        result = true;
        resolve(result);
      });
    });
  }

  isDeptUpdated(newName) {
    let result, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      // const cardHeader = element
      // (by.xpath('.//mat-panel-title//span[contains(@class,"mat - headline")][contains(text(),"' + newName + '")]'));
      const cardHeader = element
        (by.xpath('.//mat-panel-title//span[contains(@class,"mat-headline")][contains(text(),"' + newName + '")]'));
      const name = element(by.xpath(deptCradNameTbx));
      const leftNavName = element(by.xpath('//mat-nav-list//div[contains(text(),"' + newName + '")]'));
      cardHeader.isDisplayed().then(function () {
        flag1 = true;
        console.log('Department name displayed on card header: ' + newName);
        library.logStep('Department name displayed on card header: ' + newName);
      }).then(function () {
        name.isDisplayed().then(function () {
          name.getAttribute('value').then(function (txt) {
            if (newName.includes(txt)) {
              flag2 = true;
              console.log('Department name displayed on card name textbox: ' + txt);
              library.logStep('Department name displayed on card name textbox: ' + txt);
            }
          });
        });
      }).then(function () {
        leftNavName.isDisplayed().then(function () {
          flag3 = true;
          console.log('Department name displayed left navigation: ' + newName);
          library.logStep('Department name displayed left navigation: ' + newName);
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 === true) {
          console.log('Department card updated');
          library.logStep('Department card updated');
          result = true;
          resolve(result);
        }
      });
    });
  }

  getInstCount(deptname) {
    const result = false;
    let count = 0;
    return new Promise((resolve) => {
      // const link = element
      // (by.xpath
      // ('.//mat-panel-title//span[contains(@class, "mat - headline")][contains(text(), "' + deptname + '")]/following-sibling::span/em'));
      const link = element(by.xpath('.//mat-panel-title//span[contains(@class, "mat-headline")][contains(text(), "' + deptname + '")]/following-sibling::span/em'));
      browser.executeScript('arguments[0].scrollIntoView(true);', link);
      link.getText().then(function (txt) {
        count = +txt;
        console.log('Instrument count is :' + count);
        library.logStep('Instrument count is :' + count);
        dashboard.waitForPage();
        // result = true;
        resolve(count);
      });
    });
  }

  clickDeleteButton() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deleteButton));
      dashboard.waitForElement();
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashboard.waitForPage();
        console.log('Delete button clicked');
        library.logStep('Delete button clicked');
        result = true;
        resolve(result);
      });
    });
  }

  verifyDeletePopupUI() {
    let result, flag1, flag2, flag3, flag4, flag5 = false;
    return new Promise((resolve) => {
      const delPopup = element(by.xpath(confirmDeletePopup));
      const confMsg = element(by.xpath(confirmPopupMsg));
      const confBtn = element(by.xpath(confirmDelete));
      const cancelBtn = element(by.xpath(confirmCancelBtn));
      const closeBtn = element(by.xpath(confirmCloseBtn));
      delPopup.isDisplayed().then(function () {
        flag1 = true;
        console.log('Confirm Delete Popup Displayed');
        library.logStep('Confirm Delete Popup Displayed');
        confMsg.isDisplayed().then(function () {
          flag2 = true;
          console.log('Confirm Delete message Displayed');
          library.logStep('Confirm Delete message Displayed');
        }).then(function () {
          confBtn.isDisplayed().then(function () {
            flag3 = true;
            console.log('Confirm Delete button Displayed');
            library.logStep('Confirm Delete button Displayed');
          });
        }).then(function () {
          cancelBtn.isDisplayed().then(function () {
            flag4 = true;
            console.log('Cancel button Displayed');
            library.logStep('Cancel button Displayed');
          });
        }).then(function () {
          closeBtn.isDisplayed().then(function () {
            flag5 = true;
            console.log('Close button Displayed');
            library.logStep('Close button Displayed');
          });
        }).then(function () {
          if (flag1 && flag2 && flag3 && flag4 && flag5 === true) {
            result = true;
            console.log('Confirm delete popup UI verified');
            library.logStep('Confirm delete popup UI verified');
            resolve(result);
          }
        });
      }).catch(function () {
        result = false;
        console.log('Confirm delete popup not displayed');
        library.logStep('Confirm delete popup not displayed');
        resolve(result);
      });
    });
  }

  clickCancelOnDeleteConfirmation() {
    let result = false;
    return new Promise((resolve) => {
      const delPopup = element(by.xpath(confirmDeletePopup));
      const cancelBtn = element(by.xpath(confirmCancelBtn));
      delPopup.isDisplayed().then(function () {
        library.clickJS(cancelBtn);
        console.log('Cancel Button Clicked on Delete confirmation Popup');
        library.logStep('Cancel Button Clicked on Delete confirmation Popup');
      }).catch(function () {
        result = false;
        console.log('Cancel button not clicked on delete confrimation popup');
        library.logFailStep('Cancel button not clicked on delete confrimation popup');
        resolve(result);
      });
    });
  }

  clickConfirmOnDeleteConfirmation() {
    let result = false;
    return new Promise((resolve) => {
      const delPopup = element(by.xpath(confirmDeletePopup));
      const confirm = element(by.xpath(confirmDelete));
      delPopup.isDisplayed().then(function () {
        library.clickJS(confirm);
        console.log('Confirm Button Clicked on Delete confirmation Popup');
        library.logStep('Confirm Button Clicked on Delete confirmation Popup');
      }).catch(function () {
        result = false;
        console.log('Confirm button not clicked on delete confrimation popup');
        library.logFailStep('Confirm button not clicked on delete confrimation popup');
        resolve(result);
      });
    });
  }


  verifyEditControlPage(control) {
    let addlink, controlnm, lot, customname, update, cancel, result = false;
    return new Promise((resolve) => {
      const addAnalyteLink = findElement(locatorType.XPATH, addAnalyte);
      const controlName = findElement(locatorType.XPATH, controlNameDropDown);
      const lotNumDdl = findElement(locatorType.XPATH, lotNoDropDown);
      const customNameEle = findElement(locatorType.XPATH, customName);
      const cancelBtn = findElement(locatorType.XPATH, cancelBtnControl);
      const updateBtn = findElement(locatorType.XPATH, updateBtnControl);
      dashboard.waitForPage();
      addAnalyteLink.isDisplayed().then(function () {
        console.log('Add Analyte link displayed');
        library.logStep('Add Analyte link displayed');
        addlink = true;
      }).then(function () {
        controlName.isDisplayed().then(function () {
          controlName.getText().then(function (txt) {
            if (txt.includes(control)) {
              console.log('Control name drop down displayed');
              library.logStep('Control name drop down displayed');
              controlnm = true;
            }
          });
        });
      }).then(function () {
        lotNumDdl.isDisplayed().then(function () {
          console.log('Lot number drop down displayed');
          library.logStep('Lot number drop down displayed');
          lot = true;
        });
      }).then(function () {
        customNameEle.isDisplayed().then(function () {
          console.log('Custom name displayed');
          library.logStep('Custom name displayed');
          customname = true;
        });
      }).then(function () {
        cancelBtn.isDisplayed().then(function () {
          console.log('Cancel button displayed');
          library.logStep('Cancel button displayed');
          cancel = true;
        });
      }).then(function () {
        updateBtn.isDisplayed().then(function () {
          console.log('Update button displayed');
          library.logStep('Update button displayed');
          update = true;
        });
      }).then(function () {
        if (addlink && controlnm && lot && customname && update && cancel === true) {
          result = true;
          console.log('Edit control page is displayed');
          library.logStep('Edit control page is displayed');
          resolve(result);
        }
      });
    });
  }

  verifyCancelonEditControl() {
    let result = false;
    return new Promise((resolve) => {
      const custContronNmOrg = element(by.xpath(controlCustomName));
      dashboard.waitForElement();
      custContronNmOrg.getAttribute('value').then(function (value) {
        console.log('selected value', value);
        if (value === '') {
          console.log('Cancel Button is working fine');
          library.logStep('Cancel Button is working fine');
          result = true;
          resolve(result);
        }
      });
    });
  }

  verifyUpdatedChanges(cn1, clt1, ccn1) {
    dashboard.waitForElement();
    let result, cntrlname, lotno, custmname = false;
    return new Promise((resolve) => {
      const controlnameDDOrg = element(by.xpath('(//mat-select//span/span)[1]'));
      library.scrollToElement(controlnameDDOrg);
      dashboard.waitForElement();
      library.waitForElement(controlnameDDOrg);
      controlnameDDOrg.getText().then(function (value) {
        console.log('selected value', value);
        if (value.includes(cn1)) {
          console.log('Control name value updated successfully');
          library.logStep('Control name value updated successfully');
          cntrlname = true;
        }
      });

      const lotnoDDOrg = element(by.xpath('(//mat-select//span/span)[2]'));
      library.scrollToElement(lotnoDDOrg);
      dashboard.waitForElement();
      lotnoDDOrg.getText().then(function (value) {
        console.log('selected value', value);
        if (value.includes(clt1)) {
          console.log('Lot no  value updated successfully');
          library.logStep('Lot no  value updated successfully');
          lotno = true;
        }
      });

      const custContronNmOrg = element(by.xpath('//input[@formcontrolname="customName"]'));
      library.scrollToElement(custContronNmOrg);
      dashboard.waitForElement();
      custContronNmOrg.getText().then(function (value) {
        console.log('selected value', value);
        if (value.includes(ccn1)) {
          console.log('Custom control updated successfully');
          library.logStep('Custome control updated successfully');
          custmname = true;
        }
      }).then(function () {
        if (cntrlname && lotno && custmname === true) {
          result = true;
          console.log('Update button functionality is working');
          library.logStep('Update button functionality is working');
          resolve(result);
        }
      });
    });
  }


  verifyUpdateOnEditAnalyte(cn1, clt1, ccn1) {
    let result, cntrlname, lotno, custmname = false;
    return new Promise((resolve) => {
      const controlnameDD = element(by.xpath('//mat-select[contains(@aria-label,"Control Name")]//span[contains(text(),"' + cn1 + '")]'));
      library.clickJS(controlnameDD);
      dashboard.waitForElement();

      const lotnoDD = element(by.xpath('//mat-select[contains(@aria-label," Lot Number")]//span[contains(text(),"' + cn1 + '")]'));
      library.clickJS(lotnoDD);
      dashboard.waitForElement();

      const custContronNm = element(by.xpath('//input[@formcontrolname="customName"]'));
      custContronNm.sendKeys(ccn1);

      const updateBtn = element(by.xpath(updateBtnControl));
      library.clickJS(updateBtnControl);

      const controlnameDDOrg = element(by.xpath('//mat-select[contains(@aria-label," Control Name")]'));
      dashboard.waitForElement();
      controlnameDDOrg.getAttribute('value').then(function (value) {
        console.log('selected value', value);
        if (value === cn1) {
          console.log('Control name value updated successfully');
          library.logStep('Control name value updated successfully');
          cntrlname = true;
        }
      });

      const lotnoDDOrg = element(by.xpath('//mat-select[contains(@aria-label," Lot Number")]'));
      dashboard.waitForElement();
      lotnoDDOrg.getAttribute('value').then(function (value) {
        console.log('selected value', value);
        if (value === clt1) {
          console.log('Lot no  value updated successfully');
          library.logStep('Lot no  value updated successfully');
          lotno = true;
        }
      });

      const custContronNmOrg = element(by.xpath('//sinput[@formcontrolname="customName"]'));
      dashboard.waitForElement();
      custContronNmOrg.getAttribute('value').then(function (value) {
        console.log('selected value', value);
        if (value === ccn1) {
          console.log('Custom control updated successfully');
          library.logStep('Custome control updated successfully');
          custmname = true;
        }
      }).then(function () {
        if (cntrlname && lotno && custmname === true) {
          result = true;
          console.log('Cancel button functionality os working');
          library.logStep('Cancel button functionality os working');
          resolve(result);
        }
      });
    });
  }

  verifyDeletePopUp(msg) {
    let result = false;
    return new Promise((resolve) => {
      const deleteBtn = element(by.xpath(deleteBtnControl));
      library.scrollToElement(deleteBtn);
      console.log('Delet btn displayed');
      library.clickJS(deleteBtn);
      dashboard.waitForElement();
      const deletepopupmsg = element(by.xpath(deleteMsg));
      deletepopupmsg.getText().then(function (text) {
        if (text.includes(msg)) {
          console.log('Message on Delete confirmation pop up displayed');
          library.logStep('Message on Delete confirmation pop up displayed');

          const cancelBtnCtrl = element(by.xpath(cntrlCancelBtn));
          library.scrollToElement(cancelBtnCtrl);
          cancelBtnCtrl.isDisplayed().then(function () {
            library.clickJS(cancelBtnCtrl);
            browser.sleep(8000);
          });
          result = true;
          resolve(result);
        }

      });
    });
  }

  verifyDeleteFunctionality() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const deleteBtn = element(by.xpath(deleteBtnControl));
      library.scrollToElement(deleteBtn);
      console.log('Delet btn displayed');
      library.clickJS(deleteBtn);
      dashboard.waitForElement();

      const confirmDeleteBtnCtrl = element(by.xpath(confirmDeleteBtn));
      library.scrollToElement(confirmDeleteBtnCtrl);
      library.clickJS(confirmDeleteBtnCtrl);
      dashboard.waitForElement();


      browser.sleep(8000);
      const editThislink = element(by.xpath(editThisControlLink));
      library.scrollToElement(editThislink);
      browser.sleep(5000);
      editThislink.isDisplayed().then(function () {
        console.log('Control deleted successfully');
        library.logStep('Control deleted successfully');
        result = true;
        resolve(result);
      });
    });
  }

  verifyCancelBtnFunctionality() {
    let result = false;
    return new Promise((resolve) => {
      const deleteControl = element(by.xpath(deleteBtnControl));
      library.scrollToElement(deleteControl);
      deleteControl.isDisplayed().then(function () {
        library.clickJS(deleteControl);
      });
      dashboard.waitForElement();
      dashboard.waitForElement();

      const cancelBtnCtrl = element(by.xpath(cntrlCancelBtn));
      library.scrollToElement(cancelBtnCtrl);
      cancelBtnCtrl.isDisplayed().then(function () {
        library.clickJS(cancelBtnCtrl);
      });

      dashboard.waitForElement();
      const analytelink1 = element((by.xpath(AddAnalyteLink)));
      analytelink1.isDisplayed().then(function () {
        console.log('Delete control is cancelled');
        library.logStep('Delete control is cancelled');
        result = true;
        resolve(result);
      });
    });
  }

  selectLevelInUse(totalLevels) {
    return new Promise((resolve) => {
      let result = false;
      browser.sleep(7000);
      let i = 1;
      for (i = 1; i <= totalLevels; i++) {
        const levels = element(by.xpath('(//mat-checkbox[contains(@class,"levels")])[' + i + ']'));
        library.clickJS(levels);
        library.logStep(i + ' level selected.');
      }
      result = true;
      resolve(result);
    });
  }

  addAnalyteToControl(unit, analytechkbox, dept1, instr1, cont1, analyte1) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const reagentLotNo = element(by.xpath(reagentChkBox));
      reagentLotNo.isDisplayed().then(function () {
        library.clickJS(reagentLotNo);
        browser.sleep(8000);
      });
      browser.sleep(8000);
      const selectAnalyte = element(by.xpath('//span[@class="mat - checkbox - label"][contains(text(),"' + analytechkbox + '")]/parent::label//input[@type="checkbox"]'));
      library.scrollToElement(selectAnalyte);
      selectAnalyte.isDisplayed().then(function () {
        library.clickJS(selectAnalyte);
        dashboard.waitForElement();
      });

      // browser.sleep(8000);
      // const reagentDD = element(by.xpath('//mat-select[contains(@aria-label,'Reagent')]//span/span[contains(text(),''+reagent+'')]'));
      // library.scrollToElement(reagentDD);
      // reagentDD.isDisplayed().then(function(){
      // library.clickJS(reagentDD);
      // dashboard.waitForElement();
      // dashboard.waitForElement();
      // })

      // browser.sleep(8000);
      // const lotnoDD = element(by.xpath('//mat-select[contains(@aria-label,' Lot number')]//span/span[contains(text(),''+lotno+'')]'));
      // library.scrollToElement(lotnoDD);
      // lotnoDD.isDisplayed().then(function(){
      // library.clickJS(lotnoDD);
      // dashboard.waitForElement();
      // dashboard.waitForElement();
      // })


      const unitDD = element(by.xpath('//mat-select[contains(@aria-label,"Unit")]'));
      library.clickJS(unitDD);
      dashboard.waitForElement();
      const option3 = element(by.xpath('//mat-option/span[contains(text(),"' + unit + '")]'));
      library.clickJS(option3);
      browser.sleep(5000);

      const addAnalyteBtn1 = element(by.xpath(addAnalyteBtn));
      library.scrollToElement(addAnalyteBtn1);
      addAnalyteBtn1.isDisplayed().then(function () {
        library.clickJS(addAnalyteBtn1);
        dashboard.waitForElement();
        dashboard.waitForElement();
        dashboard.waitForElement();
      });

      browser.sleep(5000);
      const deptName1 = element(by.xpath('//mat-nav-list/unext-nav-side-bar-link/span/div[contains(text(),"' + dept1 + '")]'));
      library.scrollToElement(deptName1);
      deptName1.isDisplayed().then(function () {
        library.clickJS(deptName1);
      });

      browser.sleep(5000);
      const instrName = element(by.xpath('.//div[contains(text(), "' + instr1 + '")]'));
      library.scrollToElement(instrName);
      instrName.isDisplayed().then(function () {
        library.clickJS(instrName);
      });

      browser.sleep(5000);
      const controlName = element
        (by.xpath('//mat-nav-list//span//div[contains(@class,"primary - dispaly - text")][contains(text(),"' + cont1 + '")]'));
      library.scrollToElement(controlName);
      controlName.isDisplayed().then(function () {
        library.clickJS(controlName);
      });

      browser.sleep(5000);
      const analyte2 = element
        (by.xpath('//mat-sidenav/div/div/div//unext-nav-side-bar-link/span/div[contains(text(),"' + analyte1 + '")]'));
      library.scrollToElement(analyte2);
      analyte2.isDisplayed().then(function () {
        console.log('Analye added successfully');
        library.logStep('Analye added successfully');
        result = true;
        resolve(result);
      });
    });

  }

  verifyEditInstrumentUI() {
    let result, name, returnTo, addcont, manuf, model, custname, serialnum, cancel, update = false;
    return new Promise((resolve) => {
      const instName = element(by.xpath(editPageHeader));
      const returnToData = element(by.xpath(returnToDataLink));
      const addContLink = element(by.xpath(addAButton));
      const manufacturer = element(by.xpath(instManufacturer));
      const modelEle = element(by.xpath(instrumentModelDropdown));
      const custName = element(by.xpath(instCustomName));
      const serialNum = element(by.xpath(instSerialNum));
      const cancelBtn = element(by.xpath(deptCardCancel));
      const updateBtn = element(by.xpath(updateInstBtn));


      instName.isDisplayed().then(function () {
        instName.getText().then(function (dispName) {
          if (dispName.includes(jsonData.Dept1Inst1)) {
            name = true;
            library.logStep('Instrument Name displayed');
            console.log('name ' + name);
          }
        });
      })
        .then(function () {
          returnToData.isDisplayed().then(function () {
            returnTo = true;
            library.logStep('Return to data link is displayed');
            console.log('returnTo ' + returnTo);
          });
        })
        .then(function () {
          addContLink.isDisplayed().then(function () {
            addcont = true;
            library.logStep('Add an control link is displayed');
            console.log('addcont ' + addcont);
          });
        })
        .then(function () {
          manufacturer.isDisplayed().then(function () {
            manuf = true;
            library.logStep('Manufacturer is displayed');
            console.log('manuf ' + manuf);
          });
        })
        .then(function () {
          modelEle.isDisplayed().then(function () {
            model = true;
            library.logStep('Model is displayed');
            console.log('model ' + model);
          });
        })
        .then(function () {
          custName.isDisplayed().then(function () {
            custname = true;
            library.logStep('Custom Name is displayed');
            console.log('custname ' + custname);
          });
        })
        .then(function () {
          serialNum.isDisplayed().then(function () {
            serialnum = true;
            library.logStep('Sertial Number is displayed');
            console.log('serialnum ' + serialnum);
          });
        })
        .then(function () {
          cancelBtn.isDisplayed().then(function () {
            cancel = true;
            library.logStep('Cancel button is displayed');
            console.log('cancel ' + cancel);
          });
        })
        .then(function () {
          updateBtn.isDisplayed().then(function () {
            update = true;
            library.logStep('Update button is displayed');
            console.log('update ' + update);
          });
        }).then(function () {
          if (name && returnTo && addcont && manuf && model && custname && serialnum && cancel && update === true) {
            console.log('Edit Instrument Page UI Elements verified');
            library.logStepWithScreenshot('Edit_Instrument_UI', 'Edit Instrument Page UI Elements verified');
            result = true;
            resolve(result);
          }
        });
    });
  }

  changeCustomNameInstrument(customName1) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const custName = element(by.xpath(instCustomName));
      browser.executeScript('arguments[0].scrollIntoView(true);', custName);
      custName.isDisplayed().then(function () {
        custName.clear().then(function () {
          custName.sendKeys(customName1).then(function () {
            console.log('Custom Name added');
            library.logStep('Custom Name added');
            result = true;
            resolve(result);
          });
        });
      });
    });
  }

  changeSerialNumInstrument(serial) {
    let result = false;
    return new Promise((resolve) => {
      const serialNum = element(by.xpath(instSerialNum));
      serialNum.isDisplayed().then(function () {
        serialNum.clear().then(function () {
          serialNum.sendKeys(serial).then(function () {
            console.log('Serial Number added');
            library.logStep('Serial Number added');
            result = true;
            resolve(result);
          });
        });
      });
    });
  }

  clickUpdateInstrumentBtn() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(updateInstBtn));
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashboard.waitForPage();
        console.log('Update Button clicked');
        library.logStep('Update Button clicked');
        result = true;
        resolve(result);
      });
    });
  }
  verifyEditControlPage_ForViewOnly(control) {
    let header,returntoData,controlnm, lot, customname,dataentryLabel,dataentryToggle,levelCheckboxes,decimallabel,decimalDropD, result = false;
    return new Promise((resolve) => {
      const editContPageHeader = findElement(locatorType.XPATH, editPageHeader);
      const returnToData = findElement(locatorType.XPATH, returnToDataLink);
      const controlName = findElement(locatorType.XPATH, controlNameDropDown);
      const lotNumDdl = findElement(locatorType.XPATH, lotNoDropDown);
      const customNameEle = findElement(locatorType.XPATH, customName);
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));
      dashboard.waitForPage();
      controlName.isDisplayed().then(function () {
        controlName.getText().then(function (txt) {
          if (txt.includes(control)) {
            console.log('Control name drop down displayed');
            library.logStep('Control name drop down displayed');
            controlnm = true;
          }
        });

      }).then(function () {
      lotNumDdl.isDisplayed().then(function () {
        console.log('Lot number drop down displayed');
        library.logStep('Lot number drop down displayed');
        lot = true;
      });
    }).then(function () {
      customNameEle.isDisplayed().then(function () {
        console.log('Custom name displayed');
        library.logStep('Custom name displayed');
        customname = true;
      });
    }).then(function () {
      editContPageHeader.isDisplayed().then(function () {
        console.log('header is displayed');
        library.logStep('header is displayed');
        header = true;
      });
    }).then(function () {
      returnToData.isDisplayed().then(function () {
        console.log('returnToData link displayed');
        library.logStep('returnToData link displayed');
        returntoData = true;
      });
    }).then(function () {
      dataEntryLabel.isDisplayed().then(function () {
        console.log('dataEntryLabel  displayed');
        library.logStep('dataEntryLabel  displayed');
        dataentryLabel = true;
      });
    }).then(function () {
      dataEntryToggle.isDisplayed().then(function () {
        console.log('dataEntryToggle  displayed');
        library.logStep('dataEntryToggle  displayed');
        dataentryToggle = true;
      });
    }).then(function () {
      levelsCheckboxes.isDisplayed().then(function () {
        console.log('levelsCheckboxes  displayed');
        library.logStep('levelsCheckboxes  displayed');
        levelCheckboxes = true;
      });
    }).then(function () {
      decimalLabel.isDisplayed().then(function () {
        console.log('decimalLabel  displayed');
        library.logStep('decimalLabel  displayed');
        decimallabel = true;
      });
    }).then(function () {
      decimalDD.isDisplayed().then(function () {
        console.log('decimalDropDown  displayed');
        library.logStep('decimalDropDown displayed');
        decimalDropD = true;
      });
    })
    .then(function () {
      if (controlnm && lot && customname && returntoData && header && dataentryLabel && dataentryToggle && levelCheckboxes && decimallabel && decimalDropD === true) {
        result = true;
        console.log('Edit control page is displayed');
        library.logStep('Edit control page is displayed');
        library.logStepWithScreenshot('Edit control page is displayed', 'Editcontrolpage');

        resolve(result);
      }
      else {
        console.log('Edit control page not displayed');
        library.logStep('Edit control page not displayed');

      }
    });
  });
}

verifyEditAnalytePage_ForViewOnly() {
  let returntoData,analytenm, dataentryLabel,dataentryToggle,levelCheckboxes,decimallabel,decimalDropD, result = false;
  return new Promise((resolve) => {
    const editAnalytePageHeader = findElement(locatorType.XPATH, editPageHeader);
    const returnToData = findElement(locatorType.XPATH, returnToDataLink);
    const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
    const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
    const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
    const decimalLabel = element(by.xpath(decimalPlacesLabel));
    const decimalDD = element(by.xpath(decimalPlacesDropdown));
    dashboard.waitForPage();
    editAnalytePageHeader.isDisplayed().then(function () {

      console.log('editAnalytePageHeader is displayed');
      library.logStep('editAnalytePageHeader is displayed');
      analytenm = true;

    }).then(function () {
    returnToData.isDisplayed().then(function () {
      console.log('returnToData link displayed');
      library.logStep('returnToData link displayed');
      returntoData = true;
    });
  }).then(function () {
    dataEntryLabel.isDisplayed().then(function () {
      console.log('dataEntryLabel  displayed');
      library.logStep('dataEntryLabel  displayed');
      dataentryLabel = true;
    });
  }).then(function () {
    dataEntryToggle.isDisplayed().then(function () {
      console.log('dataEntryToggle  displayed');
      library.logStep('dataEntryToggle  displayed');
      dataentryToggle = true;
    });
  }).then(function () {
    levelsCheckboxes.isDisplayed().then(function () {
      console.log('levelsCheckboxes  displayed');
      library.logStep('levelsCheckboxes  displayed');
      levelCheckboxes = true;
    });
  }).then(function () {
    decimalLabel.isDisplayed().then(function () {
      console.log('decimalLabel  displayed');
      library.logStep('decimalLabel  displayed');
      decimallabel = true;
    });
  }).then(function () {
    decimalDD.isDisplayed().then(function () {
      console.log('decimalDropDown  displayed');
      library.logStep('decimalDropDown displayed');
      decimalDropD = true;
    });
  })
  .then(function () {
    if (analytenm && returntoData  && dataentryLabel && dataentryToggle && levelCheckboxes && decimallabel && decimalDropD === true) {
      result = true;
      console.log('Edit Analyte page is displayed');
      library.logStep('Edit Analyte page is displayed');
      library.logStepWithScreenshot('Edit Analyte page is displayed', 'EditAnalytepage');

      resolve(result);
    }
    else {
      console.log('Edit Analyte page not displayed');
      library.logStep('Edit Analyte page not displayed');

    }
  });
});
}
verifyArchiveToggleDisplayed_inViewOnlyState() {
  browser.ignoreSynchronization = true;
  let flag = false;
  return new Promise((resolve) => {
    browser.sleep(8000);

    const archiveToggleBtn = element((by.xpath(archiveToggle)));
    archiveToggleBtn.isDisplayed().then(function () {
      archiveToggleBtn.getAttribute('aria-checked').then(function (status) {
        if (status === 'false') {
          library.logStepWithScreenshot('Archive Toggle Button Displayed and is in off state.', 'archiveDisplayed');
          console.log("Archive Toggle Button Displayed and is in view only state")

          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Archive Toggle Button Displayed and is in on state.', 'archiveDisplayed');
          console.log("Archive Toggle Button Displayed and is in Active state")

          flag = false;
          resolve(flag);
        }
      });
    }).catch(function () {
      console.log("Archive Toggle Button is not Displayed.")
      library.logFailStep('Archive Toggle Button is not Displayed.');
      flag = false;
      resolve(flag);
    });
  });
}


  clickReturnToDataLink() {
    let result = false;
    return new Promise((resolve) => {
      const link = element(by.xpath(returnToDataLink));
      const analyteLink = element(by.xpath(returnToDataLinkAnalyte));
      link.isDisplayed().then(function () {
        library.clickJS(link);
        dashboard.waitForPage();
        console.log('Return to data link clicked');
        library.logStep('Return to data link clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        analyteLink.isDisplayed().then(function () {
          library.clickJS(analyteLink);
          dashboard.waitForPage();
          console.log('Return to data link clicked');
          library.logStep('Return to data link clicked');
          result = true;
          resolve(result);
        });
      });
    });
  }

  verifyManufacturerFieldDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const manufacturer = element(by.xpath(instManufacturerDisabled));
      manufacturer.isDisplayed().then(function () {
        console.log('Manufacturer Disabled');
        library.logStep('Manufacturer Disabled');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Manufacturer Enabled');
        library.logStep('Manufacturer Enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyModelFieldDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const model = element(by.xpath(instModelDisabled));
      model.isDisplayed().then(function () {
        console.log('Model Disabled');
        library.logStep('Model Disabled');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Model Enabled');
        library.logStep('Model Enabled');
        result = false;
        resolve(result);
      });
    });
  }

  isControlPageDisplayedToUser(control) {
    let result = false;
    return new Promise((resolve) => {
      const controlName = element(by.xpath('.//h1[contains(text(),"' + control + '")]'));
      dashboard.waitForPage();
      controlName.isDisplayed().then(function () {
        controlName.getText().then(function (text) {
          if (text.includes(control)) {
            result = true;
            console.log('Control Data table page is dispalyed to user');
            library.logStep('Control Data table page is dispalyed to user');
            resolve(result);
          } else {
            result = false;
            console.log('Control Data table page is not dispalyed to user');
            library.logStep('Control Data table page is not dispalyed to user');
            resolve(result);
          }
        });
      });
    });
  }

  isAnalytePageDisplayedToUser(Analyte) {
    let result, name, add = false;
    return new Promise((resolve) => {
      const analyteName = element(by.xpath('.//h1[contains(text(),"' + Analyte + '")]'));
      const manuallyEnterTestRun1 = element(by.xpath(manuallyEnterTestRunAnalyte));
      dashboard.waitForPage();
      analyteName.isDisplayed().then(function () {
        analyteName.getText().then(function (text) {
          if (text.includes(Analyte)) {
            name = true;
            console.log('Analyte name ' + text + ' is displayed in header');
            library.logStep('Analyte name ' + text + ' is displayed in header');
          } else {
            name = false;
            console.log('Analyte name not displayed in header');
            library.logFailStep('Analyte name not displayed in header');
          }
        });
      }).then(function () {
        manuallyEnterTestRun1.isDisplayed().then(function () {
          add = true;
          console.log('Manually Enter Test Run link is displayed');
          library.logStep('Manually Enter Test Run link is displayed');
        }).catch(function () {
          add = false;
          console.log('Manually Enter Test Run link not displayed');
          library.logStep('Manually Enter Test Run link not displayed');
        });
      })
        .then(function () {
          if (name && add === true) {
            result = true;
            console.log('Analyte Data table page is dispalyed to user');
            library.logStep('Analyte Data table page is dispalyed to user');
            resolve(result);
          } else {
            result = false;
            console.log('Analyte Data table page not dispalyed to user');
            library.logStep('Analyte Data table page not dispalyed to user');
            resolve(result);
          }
        });
    });
  }

  changeCustomNameControl(customName1) {
    let result = false;
    return new Promise((resolve) => {
      const custName = element(by.xpath(instCustomName));
      custName.isDisplayed().then(function () {
        custName.clear().then(function () {
          custName.sendKeys(customName1).then(function () {
            console.log('Custom Name added');
            library.logStep('Custom Name added');
            result = true;
            resolve(result);
          });
        });
      });
    });
  }

  clickUpdateControlBtn() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(updateInstBtn));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashboard.waitForPage();
        console.log('Update Button clicked');
        library.logStep('Update Button clicked');
        result = true;
        resolve(result);
      });
    });
  }

  isDeletePopupDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const deletePop = element(by.xpath(confirmDeletePopup));
      dashboard.waitForScroll();
      deletePop.isDisplayed().then(function () {
        console.log('Delete popup displayed');
        library.logStep('Delete popup displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Delete popup not displayed');
        library.logStep('Delete popup not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  selectFirstReagent() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const ddArrow = element(by.xpath(reagentDDArrow));
      // library.scrollToElement(ddArrow);
      ddArrow.isDisplayed().then(function () {
        library.clickJS(ddArrow);
        console.log('Reagent dropdown arrow clicked');
        library.logStep('Reagent dropdown arrow clicked');
        browser.sleep(5000);
        const firstOptEle = element(by.xpath(firstOpt));
        library.clickJS(firstOptEle);
        console.log('First Reagent selected');
        library.logStep('First Reagent selected');
        result = true;
        resolve(result);
      });
    });
  }
  clickManuallyEnterData() {
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const enterPoint = element(by.xpath(manuallyEnterTestRun));
      enterPoint.isDisplayed().then(function () {
        library.clickJS(enterPoint);
        status = true;
        library.logStep('Manually Enter Data Clicked.');
        resolve(status);
      }).catch(function () {
        library.logStep('Manually Enter Data link not displayed.');
        status = false;
        resolve(status);
      });
    });
  }

  clickOnFirstControlList() {
    let result = false;
    return new Promise((resolve) => {
      console.log('In Click on first control list');
      browser.sleep(10000);
      const openListIcn = element(by.xpath(controlList1));
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        library.logStep('Control list clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        result = false;
        library.logFailStep('Unable to click Control list');
        resolve(result);
      });
    });
  }

  selectControl(controlName) {
    let selected = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const controlOpt = element(by.xpath('.//mat-option/span[contains(text(), "' + controlName + '")]'));
      browser.executeScript('arguments[0].scrollIntoView();', controlOpt);
      controlOpt.isDisplayed().then(function () {
        library.clickJS(controlOpt);
        selected = true;
        library.logStep('Control Selected: ' + controlName);
        console.log('Control Selected: ' + controlName);
        resolve(selected);
      }).catch(function () {
        selected = false;
        library.logFailStep('Unable to select the Control');
        console.log('Unable to select the Control');
        resolve(selected);
      });
    });
  }

  clickOnFirstLotNumberList() {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(4000);
      const openListIcn = element(by.xpath(multipleLotNumbers));
      openListIcn.isDisplayed().then(function () {
        library.clickJS(openListIcn);
        result = true;
        library.logStep('Lot Number clicked');
        console.log('Lot Number clicked');
        resolve(result);
      }).catch(function () {
        result = false;
        library.logStep('Unable to click Lot Number list');
        console.log('Unable to click Lot Number list');
        resolve(result);
      });
    });
  }

  selectControlLotNumber(lotNumber) {
    let selected = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const lot = element(by.xpath('//span[contains(text(), "Lot Number")]'));
      const lotOpt = element(by.xpath('.//mat-option/span[contains(text(), "' + lotNumber + '")]'));
      library.clickJS(lot);
      library.scrollToElement(lotOpt);
      lotOpt.isDisplayed().then(function () {
        library.clickJS(lotOpt);
        selected = true;
        library.logStep('Lot Number Selected: ' + lotNumber);
        console.log('Lot Number Selected: ' + lotNumber);
        resolve(selected);
      }).catch(function () {
        selected = false;
        library.logFailStep('Unable to select lot number');
        console.log('Unable to select lot number');
        resolve(selected);
      });
    });
  }

  clickAddControlButton() {
    let result = false;
    return new Promise((resolve) => {
      const addControlbtn = element(by.xpath(addControlButton));
      addControlbtn.isEnabled().then(function () {
        library.clickJS(addControlbtn);
        library.logStep('Add Control button Clicked');
        console.log('Add Control button Clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Unable to click Add Control button');
        console.log('Unable to click Add Control button');
        result = true;
        resolve(result);
      });
    });
  }

  refreshPage() {
    let result = false;
    return new Promise((resolve) => {
      library.refreshBrowser();
      console.log('Page refreshed');
      result = true;
      resolve(result);
    });
  }


  selectDecimalPlaces(newDec) {
    let result = false;
    return new Promise((resolve) => {
      const ddArrow = element(by.xpath(decimalPlacesDDArrow));
      ddArrow.isDisplayed().then(function () {
        library.scrollToElement(ddArrow);
        library.clickJS(ddArrow);
        const decimal = element(by.xpath('.//mat-option/span[contains(text(), "' + newDec + '")]'));
        library.clickJS(decimal);
        console.log('Decimal Value selected: ' + newDec);
        library.logStep('Decimal Value selected: ' + newDec);
        result = true;
        resolve(true);
      }).catch(function () {
        console.log('Decimal not displayed');
        library.logStep('Decimal not displayed');
        result = false;
        resolve(true);
      });
    });
  }

  disableAllRules() {
    let result = false;
    return new Promise((resolve) => {
      const disableTogg = findElement(locatorType.XPATH, disableAllRulesToggle);
      disableTogg.getAttribute('aria-checked').then(function (val) {
        if (val.includes('true')) {
          library.clickJS(disableTogg);
          console.log('All Rule disable toggle clicked');
          library.logStep('All Rule disable toggle clicked');
          result = true;
          resolve(result);
        } else {
          console.log('All Rules are already disabled');
          library.logStep('All Rules are already disabled');
          result = true;
          resolve(result);
        }
      }).catch(function () {
        console.log('Toggle not displayed');
        library.logStep('Toggle not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clearAllTestsData(test) {
    let cleared = false;
    return new Promise((resolve) => {
      library.logStep('In Clear Test Data');
      const testName = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + test + '")]');
      library.clickJS(testName);
      library.logStep('Test Opened: ' + test);
      dashboard.waitForElement();
      const firstDataEle = element(by.xpath('//tr[3]/td[3]//unext-value-cell'));
      firstDataEle.isDisplayed().then(function () {
        library.logStep('First data line found');
        element.all(by.xpath('//tr/td[3]//unext-value-cell')).then(function (txt) {
          console.log('Num of data found: ' + txt.length);
          for (let i = 0; i < txt.length; i++) {
            library.logStep('Data found: ' + txt.length);
            dashboard.waitForElement();
            const scrollEle = element(by.xpath('//tr[3]/td[3]//unext-value-cell'));
            browser.executeScript('arguments[0].scrollIntoView();', scrollEle);
            library.clickJS(scrollEle);
            dashboard.waitForElement();
            const deleteDataSet = findElement(locatorType.XPATH, deleteBtnTestView);
            deleteDataSet.click().then(function () {
              const confirm = findElement(locatorType.XPATH, confirmDelete);
              confirm.click().then(function () {
                dashboard.waitForElement();
                cleared = true;
                resolve(cleared);
              });
            });
          }
        });
      }).catch(function () {
        console.log('Catch: Data not available in the test');
        library.logStep('Catch: Data not available in the test');
        cleared = true;
        resolve(cleared);
      });
    });
  }
  /*
    enablePointDataEntry() {
      let flag = false;
      return new Promise((resolve) => {
        const dataEntryToggle = findElement(locatorType.XPATH, summaryEntryToggle);
        dataEntryToggle.getAttribute('aria-checked').then(function (value) {
          if (value === 'true') {
            library.clickJS(dataEntryToggle);
            library.logStepWithScreenshot('Point entry enabled', 'PointEntryEnabled');
            library.logStep('Point entry enabled');
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Point Entry already enabled');
            library.logStepWithScreenshot('Point Entry already enabled', 'PointEntryAlreadyEnabled');
            flag = true;
            resolve(flag);
          }
        }).catch(function () {
          library.logStep('Toggle not displayed');
          library.logStepWithScreenshot('Toggle not displayed', 'Togglenotdisplayed');
          flag = false;
          resolve(flag);
        });
      });
    }*/

  enablePointDataEntry() {
    let flag = false;
    return new Promise((resolve) => {
      const pointRadioButton = findElement(locatorType.XPATH, pointDataRadioButton);
      pointRadioButton.isDisplayed().then(function () {
        pointRadioButton.click();
        library.logStepWithScreenshot('Point Data Entry Radio Button clicked', 'PointRadioClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Point Data Entry Radio Button is not visible');
        flag = false;
        resolve(flag);
      });
    });
  }

  disablePointDataEntry() {
    let flag = false;
    return new Promise((resolve) => {
      const summaryRadioButton = findElement(locatorType.XPATH, summaryDataRadioButton);
      summaryRadioButton.isDisplayed().then(function () {
        summaryRadioButton.click();
        library.logStepWithScreenshot('Summary Data Entry Radio Button clicked', 'SummaryRadioClicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Summary Data Entry Radio Button is not visible');
        flag = false;
        resolve(flag);
      });
    });
  }
  /*
    disablePointDataEntry() {
      let flag = false;
      return new Promise((resolve) => {
        const dataEntryToggle = findElement(locatorType.XPATH, summaryEntryToggle);
        dataEntryToggle.getAttribute('aria-checked').then(function (value) {
          console.log(value);
          if (value === 'false') {
            library.clickJS(dataEntryToggle);
            library.logStepWithScreenshot('Point entry disabled', 'PointEntryDisabled');
            library.logStep('Point entry disabled');
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Point entry already disabled');
            library.logStepWithScreenshot('Point entry already disabled', 'PointEntryAlreadyDisabled');
            flag = true;
            resolve(flag);
          }
        }).catch(function () {
          library.logStep('Toggle not displayed');
          library.logStepWithScreenshot('Toggle not displayed', 'Togglenotdisplayed');
          flag = false;
          resolve(flag);
        });
      });
    }*/

  clickOnInfoIcon() {
    let flag = false;
    return new Promise((resolve) => {
      const infoIconEle = element(by.xpath(infoIcon));
      dashboard.waitForPage();
      infoIconEle.isDisplayed().then(function () {
        library.click(infoIconEle);
        console.log('Info Icon Clicked');
        library.logStep('Info Icon Clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  verifyUnitDisplayedOnInfoTooltip(expected) {
    let flag = false;
    return new Promise((resolve) => {
      const toolTip = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]'));
      const unitEle = element(by.xpath('.//div[contains(@class, "analyte-detail-tooltip")]/dl/dt[contains(text(), "Unit")]/following-sibling::dd[1]'));
      toolTip.isDisplayed().then(function () {
        console.log('tooltipdisplyaed');
        unitEle.getText().then(function (actual) {
          console.log('actual ' + actual);
          console.log('Expected: ' + expected + ' Actual: ' + actual);
          const actualUnit = actual.trim();
          const expectedUnit = expected.trim();
          console.log('After trim Expected: ' + expectedUnit + ' Actual: ' + actualUnit);
          if (expectedUnit === actualUnit) {
            console.log('Expected: ' + expectedUnit + ' Actual: ' + actualUnit);
            library.logStep('Unit is displayed on info icon');
            console.log('Unit is displayed on info icon');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Unit is not same on info tooltip');
        console.log('Unit is not same on info tooltip');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifySummaryRadioDisabled() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const summaryRdb = element(by.xpath(summaryDataRadioButton));
      summaryRdb.isDisplayed().then(function () {
        summaryRdb.getAttribute('class').then(function (text) {
          if (text.includes('disabled')) {
            library.logStepWithScreenshot('Summary RDB is Disabled', 'Disabled');
            status = true;
            resolve(status);
          } else {
            library.logFailStep('Summary RDB is not Disabled');
            status = false;
            resolve(status);
          }
        });
      }).catch(function () {
        library.logFailStep('Unable to verify if the Summary RDB is Disabled');
        status = false;
        resolve(status);
      });
    });
  }

  VerifyCopyInstrumentSectionUI() {
    let status = false;
    let count = 0;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const pageUI = new Map<string, string>();
      pageUI.set(copyInstrumentSectionHeader, 'Copy Instrument Header');
      pageUI.set(toDepartmentDropdown, 'Department Dropdown');
      pageUI.set(customNameCopyInstrumentTextbx, 'Custom name textbox');
      pageUI.set(copyInstrumentDisabledButton, 'Disabled Copy Button');
      const addControlButtonEle = element(by.xpath(addAButton));
      addControlButtonEle.isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          status = true;
          library.logStepWithScreenshot('Copy Instrument section UI is displayed properly', 'UIVerification');
          resolve(status);
        } else {
          status = false;
          library.logFailStep('Copy Instrument section UI is not displayed properly');
          resolve(status);
        }
      });
    });
  }

  clickToDepartmentDropdown() {
    let flag = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const toDeptdd = element(by.xpath(toDepartmentDropdown));
      toDeptdd.isDisplayed().then(function () {
        library.scrollToElement(toDeptdd);
        library.clickJS(toDeptdd);
        console.log('Department dropdown clicked');
        library.logStep('Department dropdown clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to click Department dropdown.');
        library.logStep('Unable to click Department dropdown.');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyToDepartmentDisplayed(dept) {
    let flag = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const selectDept = element(by.xpath('.//mat-option/span[contains(text(),"' + dept + '")]'));
      selectDept.isDisplayed().then(function () {
        console.log('The Department ' + dept + ' is visible');
        library.logStepWithScreenshot('The Department ' + dept + ' is visible', 'deptVisible');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to find Department ' + dept);
        library.logFailStep('Unable to find Department ' + dept);
        flag = false;
        resolve(flag);
      });
    });
  }

  selectToDepartment(dept) {
    let flag = false;
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      const selectDept = element(by.xpath('.//mat-option/span[contains(text(),"' + dept + '")]'));
      selectDept.isDisplayed().then(function () {
        selectDept.click();
        console.log('Department ' + dept + ' clicked');
        library.logStepWithScreenshot('Department ' + dept + ' clicked', 'deptSelected');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Unable to select Department ' + dept);
        library.logFailStep('Unable to select Department ' + dept);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyCopyButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const copyDisabled = element(by.xpath(copyInstrumentDisabledButton));
      copyDisabled.isDisplayed().then(function () {
        console.log('Copy Button is disabled');
        library.logStepWithScreenshot('Copy Button is disabled', 'CopyDisabled');
        status = true;
        resolve(status);
      }).then(function () {
        console.log('Copy Button is not disabled');
        library.logFailStep('Copy Button is not disabled');
        status = false;
        resolve(status);
      });
    });
  }

  verifyCopyButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const copyEnabled = element(by.xpath(copyInstrumentButton));
      copyEnabled.isDisplayed().then(function () {
        console.log('Copy Button is Enabled');
        library.logStepWithScreenshot('Copy Button is Enabled', 'CopyEnabled');
        status = true;
        resolve(status);
      }).then(function () {
        console.log('Copy Button is not enabled');
        library.logFailStep('Copy Button is not enabled');
        status = false;
        resolve(status);
      });
    });
  }

  enterCopyInstrumentCustomName(customNameText) {
    let status = false;
    return new Promise((resolve) => {
      const customNameCopyInstrumentTxtbx = element(by.xpath(customNameCopyInstrumentTextbx));
      customNameCopyInstrumentTxtbx.isDisplayed().then(function () {
        library.scrollToElement(customNameCopyInstrumentTxtbx);
        customNameCopyInstrumentTxtbx.sendKeys(customNameText);
        console.log('Custom Name entered');
        library.logStepWithScreenshot('Custom Name entered', 'CustomNameEntered');
        status = true;
        resolve(status);
      }).catch(function () {
        console.log('Unable to enter Custom name');
        library.logFailStep('Unable to enter Custom name');
        status = false;
        resolve(status);
      });
    });
  }

  clickCopyButton() {
    let status = false;
    return new Promise((resolve) => {
      const copyEnabled = element(by.xpath(copyInstrumentButton));
      copyEnabled.isDisplayed().then(function () {
        copyEnabled.click();
        dashBoard.waitForPage();
        console.log('Copy Button clicked');
        library.logStepWithScreenshot('Copy Button clicked', 'CopyClicked');
        status = true;
        resolve(status);
      }).then(function () {
        console.log('Copy Button is not enabled');
        library.logFailStep('Copy Button is not enabled');
        status = false;
        resolve(status);
      });
    });
  }

  verifyInstrumentManufacturer(manufacturer) {
    let status = false;
    return new Promise((resolve) => {
      const instManufacturerEle = element(by.xpath(instrumentManufacturer));
      instManufacturerEle.isDisplayed().then(function () {
        instManufacturerEle.getText().then(function (text) {
          if (text === manufacturer) {
            console.log('Correct Instrument Manufacturer name is displayed');
            library.logStepWithScreenshot('Correct Instrument Manufacturer name is displayed', 'InstManufacturer');
            status = true;
            resolve(status);
          } else {
            console.log('Incorrect Instrument Manufacturer name is displayed');
            library.logFailStep('Incorrect Instrument Manufacturer name is displayed');
            status = false;
            resolve(status);
          }
        });
      });
    });
  }

  verifyInstrumentModel(model) {
    let status = false;
    return new Promise((resolve) => {
      const instModel = element(by.xpath(instrumentModel));
      instModel.isDisplayed().then(function () {
        instModel.getText().then(function (text) {
          if (text === model) {
            console.log('Correct Instrument Model name is displayed');
            library.logStepWithScreenshot('Correct Instrument Model name is displayed', 'InstModel');
            status = true;
            resolve(status);
          } else {
            console.log('Incorrect Instrument Model name is displayed');
            library.logFailStep('Incorrect Instrument Model name is displayed');
            status = false;
            resolve(status);
          }
        });
      });
    });
  }

  verifyEntityCreated(entityName) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const list = element.all(by.xpath(leftNavigationItems));
      list.count().then(function (num) {
        for (let i = 1; i <= num; i++) {
          const ele = element(by.xpath('(.//mat-nav-list//div[contains(@class, "primary-dispaly-text")])[' + i + ']'));
          ele.getText().then(function (txt) {
            if (txt.includes(entityName)) {
              console.log(entityName + ' is Created');
              library.logStepWithScreenshot(entityName + ' is Created', 'entityCreated');
              status = true;
              resolve(status);
            } else if (i === num && status === false) {
              library.logFailStep(entityName + ' is not Created');
              status = false;
              resolve(status);
            }
          });
        }
      });
    });
  }

  isDepartmentPageDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const addInst = element(by.xpath(addInstrumentLink));
      addInst.isDisplayed().then(function () {
        library.logStepWithScreenshot('Department Page displayed', 'DeptDisplayed');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logFailStep('Department Page is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyDeptDisplayed(dept) {
    let flag = false;
    return new Promise((resolve) => {
      const lotEle = element(by.xpath('.//mat-option/span[contains(text(),"' + dept + '")]'));
      lotEle.isDisplayed().then(function () {
        console.log('Department is displayed');
        library.logStepWithScreenshot('Department is displayed', 'DeptDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Department is not displayed');
        library.logFailStep('Department is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyErrorMessageSameInstName() {
    let flag = false;
    return new Promise((resolve) => {
      const lotEle = element(by.xpath(errorSameInstName));
      lotEle.isDisplayed().then(function () {
        console.log('Error message is displayed');
        library.logStepWithScreenshot('Error message is displayed', 'ErrorDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Error message is not displayed');
        library.logFailStep('Error message is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyAdditionalTooltips(control) {
    let result = false;
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath("//*[contains(text(),'" + control + "')]"))), 10000, 'Failed : Element not displayed');
      const hoverOnControl = element(by.xpath("//*[contains(text(),'" + control + "')]"));
      hoverOnControl.isDisplayed().then(function () {
        browser.actions().mouseMove(hoverOnControl);
        library.logStep('Mouse hovered over Control Item');
        resolve(true);
        element.all(by.xpath(controlToolTip)).each(function (tool, index) {
          if (tool.isDisplayed()) {
            library.logStepWithScreenshot('ToolTips is not displayed', 'ToolsTips Not Displayed');
            result = true;
          }
          else {
            library.logStepWithScreenshot('Failed : ToolTips is displayed', 'ToolsTips Displayed');
            result = false;
          }
          resolve(result);
        })
      })
    })
  }

  verifyLogoffPopupDisplayed(control) {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath("//*[contains(text(),'" + control + "')]"))), 11000).then(function () {
        library.logStepWithScreenshot('Pop up is displayed', 'Pop up is Displayed');
        console.log('Inactivity popup is displayed after 10 min')
        resolve(true);
      }).catch(function () {
        library.logFailStep('Failed : Pop up is not displayed');
        library.logStepWithScreenshot('Failed : Pop up is not displayed', 'Pop up is not displayed');
        console.log('Failed : Inactivity popup is not displayed after 10 min')
        resolve(false);
      })
    })
  }


  verifyLogInScreenDisplayedAfterInactivity() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.id(username))), 16000).then(function () {
        library.logStepWithScreenshot('Log in page is displayed', 'Log in page Displayed');
        console.log('Log in page is displayed after 15 min')
        resolve(true);
      }).catch(function () {
        library.logFailStep('Failed : Log in page is not displayed');
        library.logStepWithScreenshot('Failed : Log in page is not displayed', 'Log in page is not displayed');
        console.log('Failed : Log in page is not displayed after 15 min')
        resolve(false);
      })
    })
  }

  selectReagent(value) {
    let result = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const ddArrow = element(by.xpath(reagentDDArrow));
      // library.scrollToElement(ddArrow);
      ddArrow.isDisplayed().then(function () {
        library.clickJS(ddArrow);
        console.log('Reagent dropdown arrow clicked');
        library.logStep('Reagent dropdown arrow clicked');
        browser.sleep(5000);
        const OptEle = element(by.xpath('.//mat-option/span[contains(text(),"' + value + '")]'));
        library.clickJS(OptEle);
        console.log('Reagent selected : ' + value);
        library.logStepWithScreenshot('Reagent selected' + value, 'ReagentSelected');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Not able to select Reagent.');
        result = false;
        resolve(result);
      });
    });
  }

  clickDeleteAnalyteButton() {
    return new Promise((resolve) => {
      let result = false;
      const deleteAnalyteBtn = element(by.xpath(deleteAnalyteButton));
      deleteAnalyteBtn.isDisplayed().then(function(){
        library.scrollToElement(deleteAnalyteBtn);
        deleteAnalyteBtn.click();
        library.logStep('Delete Button clicked');
        result = true;
        resolve(result);
      }).catch(function(){
        library.logFailStep('Unable to click Delete Button');
        result = false;
        resolve(result);
      });
    })
  }

  clickConfirmDeleteAnalyteButton() {
    return new Promise((resolve) => {
      let result = false;
      const confirmDeleteAnalyteBtn = element(by.xpath(confirmDeleteAnalyteButton));
      confirmDeleteAnalyteBtn.isDisplayed().then(function(){
        confirmDeleteAnalyteBtn.click();
        library.logStep('Confirm Delete Button clicked');
        result = true;
        resolve(result);
      }).catch(function(){
        library.logFailStep('Unable to click Confirm Delete Button');
        result = false;
        resolve(result);
      });
    })
  }
  verifyDeleteIconDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(deleteButton));
      btn.isDisplayed().then(function () {
        console.log('Delete button is displayed');
        library.logStep('Delete button is displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Delete Button is not displayed');
        library.logStep('Delete Button is not displayed');
        result = false;
        resolve(result);
      });
    });
  }
  verifyControlSettings_UpdateMethod() {
    let dataEntry, chkboxes, decimal, buttons, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsLabel = element(by.xpath(levelsInUseLabel));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));

      const cancelBtn = element(by.xpath(cancelButton));
      const updateBtn = element(by.xpath(updateButton));

      dataEntryLabel.isDisplayed().then(function () {
        console.log('Summary Data Entry label button is displayed.');
        library.logStep('Summary Data Entry label button is displayed.');
      }).then(function () {
        dataEntryToggle.isDisplayed().then(function () {
          console.log('Summary Data Entry Toggle button is displayed.');
          library.logStep('Summary Data Entry Toggle button is displayed.');
          dataEntry = true;

        });
      }).then(function () {
        levelsLabel.isDisplayed().then(function () {
          levelsCheckboxes.count().then(function (count) {
            if (count >= 1) {
              console.log('Levels in Use,  checkboxes are displayed.');
              library.logStep('Levels in Use,  checkboxes are displayed.');
              chkboxes = true;
            }
          });
        }).then(function () {
          decimalLabel.isDisplayed().then(function () {
            console.log('decimalLabel  displayed');
            library.logStep('decimalLabel displayed');

          });
        }).then(function () {
          decimalDD.isDisplayed().then(function () {
            console.log('Decimal Places dropdown is displayed.');
            library.logStep('Decimal Places dropdown is displayed.');
            decimal = true;
          });
        }).then(function () {
          cancelBtn.isDisplayed().then(function () {
            console.log('Cancel button displayed');
            library.logStep('Cancel button displayed');
          });
        }).then(function () {
          updateBtn.isDisplayed().then(function () {
            console.log('Update button displayed');
            library.logStep('Update button displayed');
            buttons = true;
          });
        }).then(function () {

          if (dataEntry && decimal && buttons && chkboxes === true) {
            console.log('dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons + ' chkboxes ' + chkboxes);
            library.logStep('Edit Page is displayed properly.');
            displayed = true;
            resolve(displayed);
          }
          else {
            console.log(' dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons + ' chkboxes ' + chkboxes);
            displayed = false;
            resolve(displayed);
          }
        })

        
      });
    });
  }
  verifyAnalyteSettings_UpdatedMethod() {
    let dataEntry, chkboxes, decimal, buttons, displayed = false;
    return new Promise((resolve) => {
      browser.sleep(15000);
      const dataEntryLabel = element(by.xpath(summaryDataEntryLabel));
      const dataEntryToggle = element(by.xpath(summaryDataEntryToggle));
      const levelsLabel = element(by.xpath(levelsInUseLabel));
      const levelsCheckboxes = element.all(by.xpath(levelsInUseCheckboxes));
      const decimalLabel = element(by.xpath(decimalPlacesLabel));
      const decimalDD = element(by.xpath(decimalPlacesDropdown));

      const cancelBtn = element(by.xpath(cancelButton));
      const updateBtn = element(by.xpath(updateButton));

      dataEntryLabel.isDisplayed().then(function () {
        console.log('Summary Data Entry label button is displayed.');
        library.logStep('Summary Data Entry label button is displayed.');
      }).then(function () {
        dataEntryToggle.isDisplayed().then(function () {
          console.log('Summary Data Entry Toggle button is displayed.');
          library.logStep('Summary Data Entry Toggle button is displayed.');
          dataEntry = true;

        });
      }).then(function () {
        levelsLabel.isDisplayed().then(function () {
          levelsCheckboxes.count().then(function (count) {
            if (count >= 1) {
              console.log('Levels in Use,  checkboxes are displayed.');
              library.logStep('Levels in Use,  checkboxes are displayed.');
              chkboxes = true;
            }
          });
        }).then(function () {
          decimalLabel.isDisplayed().then(function () {
            console.log('decimalLabel  displayed');
            library.logStep('decimalLabel displayed');

          });
        }).then(function () {
          decimalDD.isDisplayed().then(function () {
            console.log('Decimal Places dropdown is displayed.');
            library.logStep('Decimal Places dropdown is displayed.');
            decimal = true;
          });
        }).then(function () {
          cancelBtn.isDisplayed().then(function () {
            console.log('Cancel button displayed');
            library.logStep('Cancel button displayed');
          });
        }).then(function () {
          updateBtn.isDisplayed().then(function () {
            console.log('Update button displayed');
            library.logStep('Update button displayed');
            buttons = true;
          });
        }).then(function () {

          if (dataEntry && decimal && buttons && chkboxes === true) {
            console.log('dataEntry ' + dataEntry + 'decimal ' + decimal + ' buttons ' + buttons);
            library.logStep('Edit Analyte Page is displayed properly.');
            displayed = true;
            resolve(displayed);
          }
          else {
            console.log(' dataEntry ' + dataEntry + ' decimal ' + decimal + ' buttons ' + buttons);
            displayed = false;
            resolve(displayed);
          }
        })

        
      });
    });
  }
  verifyArchiveToggleDisplayed_inViewOnlyState() {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
  
      const archiveToggleBtn = element((by.xpath(archiveToggle)));
      archiveToggleBtn.isDisplayed().then(function () {
        archiveToggleBtn.getAttribute('aria-checked').then(function (status) {
          if (status === 'false') {
            library.logStepWithScreenshot('Archive Toggle Button Displayed and is in off state.', 'archiveDisplayed');
            console.log("Archive Toggle Button Displayed and is in view only state")
  
            flag = true;
            resolve(flag);
          } else {
            library.logStepWithScreenshot('Archive Toggle Button Displayed and is in on state.', 'archiveDisplayed');
            console.log("Archive Toggle Button Displayed and is in Active state")
  
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        console.log("Archive Toggle Button is not Displayed.")
        library.logFailStep('Archive Toggle Button is not Displayed.');
        flag = false;
        resolve(flag);
      });
    });
  }

}

