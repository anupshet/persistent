/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, Browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Connectivity.json', (err, data) => {
  if (err) { throw err; }
  const connectivity = JSON.parse(data);
  jsonData = connectivity;
});

const path = require('path');
const library = new BrowserLibrary();
const dashboard = new Dashboard();

const connectivityPageTitle = '//h2[text()="Connectivity"]';
const closeConnectivity = '//mat-icon[text()="close"]';
const toolTip = '//button[contains(@id,"spc_route_to_connectivity_button") and contains(@aria-describedby,"cdk-describedby-message")]';
const statusTab = '//a[text()="STATUS"]';
const mappingTab = '//a[text()="MAPPING"]';
const instrMapping = '//button/span[text()="INSTRUMENTS"]';
const timeUpload = '//mat-header-cell/span[text()="Time Uploaded"]';
const fileStatus = '(//mat-cell//span[text()="Processing"])[1]';
const instructionsHeader = './/strong[contains(text(), "Instructions Name")]';
const orgFileName = '//button/span[text()="Original Filename"]';
const userName = '//mat-header-cell/span[text()="Username"]';
const fileNameStatus = '(//mat-table//mat-row//mat-cell/span)[1]';
const dateDisplayed = '(//mat-table//mat-row//mat-cell//span)[3]';
const timeDisplayed = '(//mat-table//mat-row//mat-cell//span/following::span)[3]';
const fileStatusHeader = '//button/span[text()="Status"]';
const infoIcon = './/br-info-tooltip';
const productCard = '//mat-panel-title/button/span[text()="PRODUCTS"]';
const infoMessage = './/div[contains(@class, "mat-menu-content")]//span';
const addInstructionsBtn = './/button/span[contains(text(), "Add New Instructions")]';
const unlink = '//mat-card-content/span/div/following::span';
const testCard = '//mat-panel-title/button/span[text()="TESTS"]';
const reagecalib = '//mat-dialog-container//div/h2[contains(text(),"Select Reagent and Calibrator Lot")]';
const reagentcalibDialogue = '//unext-reagent-calibrator-dialog/div';
const LinkBtnonPopUp = '//mat-dialog-content/following::div//button/span[text()="Link"]';
const addInstructionPopup = './/unext-new-instructions-dialog/div';
const addInstructionHead = './/unext-new-instructions-dialog//h2[contains(text(),"New Instructions")]';
const instructionNameTbx = './/unext-new-instructions-dialog//input[contains(@placeholder , "Instructions Name *")]';
const addInstructonCancel = './/unext-new-instructions-dialog//button/span[contains(text(), "Cancel")]';
const addInstructionAddBtn = './/unext-new-instructions-dialog//button/span[contains(text(), "Add")]/parent::button';
const addInstructionClose = './/unext-new-instructions-dialog//button/span/i[contains(text(), "close")]';
const pageName = './/header//h1';
const pageInfo = './/header//p';
const dragdropArea = './/input[@type= "file"]';
const browseFileLink = './/span[contains(text(),"browse")]';
const backPageButton = './/button/span[contains(text(),"Back")]';
const nextPageButton = './/button/span[contains(text(),"Next Step")]/parent::button';
const selectedFilesEle = './/div[contains(@class,"filename title")]';
const invalidFileError = './/small[contains(@class,"red")]';
const connectivityIcon = './/button[contains(@id,"spc_route_to_connectivity_button")]';
const headerRadioBtns = './/strong[contains(text(), "header")]/parent::div//mat-radio-group';
const footerRadioBtns = './/strong[contains(text(), "footer")]/parent::div//mat-radio-group';
const headerRowsTxtbx = './/input[@name = "headerRows"]';
const footerRowsTxtbx = './/input[@name = "footerRows"]';
const fileTextArea = './/pre';
const headerYesBtn = './/strong[contains(text(), "header")]/parent::div//mat-radio-button[@value = "Yes"]';
const headerNoBtn = './/strong[contains(text(), "header")]/parent::div//mat-radio-button[@value = "No"]';
const footerYesBtn = './/strong[contains(text(), "footer")]/parent::div//mat-radio-button[@value = "Yes"]';
const footerNoBtn = './/strong[contains(text(), "footer")]/parent::div//mat-radio-button[@value = "No"]';
const errorHeader = './/input[@name = "headerRows"]/following-sibling::mat-error';
const errorFooter = './/input[@name = "footerRows"]/following-sibling::mat-error';
const backButton = './/button/span[contains(text(), "Back")]';
const fileUploadPageName = './/unext-upload-dialog//h4';
const instructionNameDropdown = './/mat-select[@placeholder = "Instructions Name *"]';
const resetButton = './/button/span[contains(text(),"Reset")]/parent::button';
const uploadButton = './/button/span[contains(text(),"Upload")]/parent::button';
const instructionsTab = './/a[contains(text(),"INSTRUCTIONS")]';
const selectedInstructionsName = './/mat-select//span';
const fileUploadTab = './/li/a[contains(text(),"FILE UPLOAD")]';
const mapFileButton = './/button/span[contains(text(),"Map File")]';
const statusButton = './/a[contains(text(),"STATUS")]';
const step2NextButton = './/footer//button[2]';
const step3header = './/h1[contains(text(),"Step 3")]';
const step3SpecifyDelimiterLabel = './/p[contains(text(), "Specify the field delimiter")]';
const step3DelimiterDD = './/mat-select[@aria-label="Field Delimiter"]';
const step3DataText = './/section//pre';
const step3BackButton = './/footer//button[1]';
const step3NextButton = './/footer//button[2][@disabled="true"]';
const step3NextButtonEnabled = './/footer/button[2]';
const step4header = './/h1[contains(text(),"Step 4")]';
const step4Label = './/p[contains(text(), "This final step is used to designate which fields contain the important values that are extracted from the delimited file used to process QC results.")]';
const step4DataText = './/div[@class="text-box"]//div[@class="ps-content"]/div';
const step4Toggle = './/mat-slide-toggle';
const step4ToggleLabel = './/span[contains(text(),"Summary data entry")]';
const ddInsstrumentCode = './/mat-select[@aria-required="true"][@placeholder="Instrument Code"]';
const textBoxCustomeInstrumentCode = './/input[@placeholder="Custom Instrument Code"]';
const ddProductLot = './/mat-select[@aria-required="true"][@placeholder="Product Lot and Level"]';
const ddProductLevel = './/mat-select[@placeholder="Product Level"]';
const ddTestCode = './/mat-select[@aria-required="true"][@placeholder="Test Code"]';
const ddDateTime = './/mat-select[@aria-required="true"][@placeholder="Date/Time Resulted"]';
const ddFindFormats = './/mat-select[@aria-required="true"][@placeholder="Find Formats"]';
const ddTime = './/mat-select[@placeholder="Time Resulted"]';
const ddMean = './/mat-select[@aria-required="true"][@placeholder="Mean"]';
const ddSD = './/mat-select[@aria-required="true"][contains(@placeholder, "SD")]';
const ddPoints = './/mat-select[@aria-required="true"][@placeholder= "Points"]';
const ddReagent = './/mat-select[@placeholder= "Reagent Lot"]';
const ddCalibrator = './/mat-select[@placeholder= "Calibrator Lot"]';
const step4BackButton = './/footer//button[1]';
const step4CompleteButton = './/span[contains(text(),"Complete")]/parent::button[@disabled="true"]';
const step4ResetButton = './/span[contains(text(),"Reset")]/parent::button';
const ddValue = './/mat-select[@aria-required="true"][@placeholder="Value"]';
const firstOptionFromDD = './/mat-option[1]';
const step4ResetButtonEnabled = './/span[contains(text(),"Reset")]/parent::button';
const step4CompleteButtonEnabled = './/span[contains(text(),"Complete")]/parent::button';
const refreshBtn = '//*[contains(@class,"spec_refresh")]';
const errorMsg = 'error-name';
const busyOverlay = '//unext-unity-busy';
const errorDetailsbtn = 'ERROR DETAIL';
const transformerDropDown = "//span[.='Configurations Name *']";
const matOption = "//mat-option[contains(., '<text>')]";
const errorMessage = "//div[contains(@class, 'error-name') and contains(text(), '<text>')]";
const transformerErrorTitle = "//div[contains(text(), 'Transformer Error')]";
const importErrorTitle = "//div[contains(text(), 'Import Error')]";
const hierarchy = "//div[contains(text(), '<text>')]";

export class ConnectivityNew {
  async verifyHierarchy(hierarchyText: any) {
    let flag = await element(by.xpath(hierarchy.replace('<text>', hierarchyText))).isDisplayed();
    expect(flag).toBe(true);
  }
  async verifyImportErrorTitleDisplayed() {
    let flag = await element(by.xpath(importErrorTitle)).isDisplayed();
    expect(flag).toBe(true);
  }
  async verifyTransformerErrorTitleDisplayed() {
    let flag = await element(by.xpath(transformerErrorTitle)).isDisplayed();
    expect(flag).toBe(true);
  }
  async verifyErrorMessage(error) {
    let ele = await element(by.xpath(errorMessage.replace('<text>', error)));
    return await ele.isDisplayed();
  }
  async selectTransformer(transformerName) {
    let ele = await element(by.xpath(transformerDropDown));
    await library.scrollToElement_async(ele);
    await library.waitTillVisible(ele, 8888);
    await ele.click();
    let option = await element(by.xpath(matOption.replace('<text>', transformerName)));
    await library.waitTillVisible(option, 8888);
    await option.click();
  }
  async clickErrorDetails() {
    library.logStep("Click Error Details");
    let ele = await element(by.buttonText(errorDetailsbtn));
    await library.waitTillVisible(ele, 8888);
    await ele.click();
    await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(busyOverlay))), 20000);
  }

  async getErrorMessage() {
    let ele = await element(by.css(errorMsg));
    await library.waitTillVisible(ele, 8888);
    return ele.getText();
  }

  async clickRefresh() {
    library.logStep("Click Refresh Button");
    let ele = await element(by.css(refreshBtn));
    await library.waitTillVisible(ele, 8888);
    await ele.click();
    await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(busyOverlay))), 20000);
  }

  clickConnectivityLogo() {
    let status = false;
    return new Promise((resolve) => {
      const connectivity = element(by.xpath(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        library.logStep('Connectivity Icon is displayed');
        console.log('Connectivity Icon is displayed');
        library.click(connectivity);
        dashboard.waitForElement();
      }).then(function () {
        const title = findElement(locatorType.XPATH, connectivityPageTitle);
        title.isDisplayed().then(function () {
          library.logStep('Connectivity page is displayed');
          console.log('Connectivity page is displayed');
        });
      }).then(function () {
        dashboard.waitForElement();
        const closeBtn = element(by.xpath(closeConnectivity));
        library.scrollToElement(closeBtn);
        closeBtn.isDisplayed().then(function () {
          library.clickJS(closeBtn);
          library.logStep('Connectivity page is closed');
          console.log('Connectivity page is closed');
          status = true;
          resolve(status);
        });
      });
    });
  }

  verifyConnectivityToolTip() {
    let flag = false;
    return new Promise((resolve) => {
      const connectivity = element(by.xpath(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        library.logStep('Connectivity Icon is displayed');
        console.log('Connectivity Icon is displayed');
        dashboard.waitForElement();
        browser.actions().mouseMove(element(by.xpath(connectivityIcon))).perform();
        const connectivityToolTip = element(by.xpath(toolTip));
        connectivityToolTip.isDisplayed().then(function () {
          library.logStep('Connectivity tool tip is displayed');
          console.log('Connectivity tool tip is displayed');
          flag = true;
          resolve(flag);
        });
      }).catch(function () {
        library.logStep('Connectivity Icon is not displayed');
        library.logStep('Connectivity tool tip is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConnectivityUI() {
    let displayed, instruction, file, status1, map = false;
    return new Promise((resolve) => {
      const instrtab = element(by.xpath(instructionsTab));
      instrtab.isDisplayed().then(function () {
        library.logStep('Instructions tab is displayed');
        console.log('Instructions tab is displayed');
        instruction = true;
      }).then(function () {
        const fileupload = element(by.xpath(fileUploadTab));
        fileupload.isDisplayed().then(function () {
          library.logStep('File upload tab is displayed');
          console.log('File upload tab is displayed');
          file = true;
        });
      }).then(function () {
        const status = element(by.xpath(statusTab));
        status.isPresent().then(function () {
          library.logStep('Status tab is displayed');
          console.log('Status tab is displayed');
          status1 = true;
        });
      }).then(function () {
        const mapping = element(by.xpath(mappingTab));
        mapping.isPresent().then(function () {
          library.logStep('Mapping tab is displayed');
          console.log('Mapping tab is displayed');
          map = true;
        });
      }).then(function () {
        if (instruction === true && file === true && status1 === true && map === true) {
          displayed = true;
          library.logStep('All tabs are displayed');
          console.log('All tabs are displayed');
          resolve(displayed);
        }
      });
    });
  }

  clickProducts() {
    let clicked = false;
    return new Promise((resolve) => {
      const productLink = element(by.xpath(productCard));
      library.scrollToElement(productLink);
      library.clickJS(productLink);
      library.logStep('Clicked on Products');
      console.log('Clicked on Products');
      clicked = true;
      resolve(clicked);
    });
  }

  verifyStatusPage() {
    let displayed, status, timeupload = false;
    return new Promise((resolve) => {
      const connectivity = element(by.xpath(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        library.logStep('Connectivity Icon is displayed');
        console.log('Connectivity Icon is displayed');
        library.clickJS(connectivity);
        dashboard.waitForElement();
      });
      const statusBtn = element(by.xpath(statusButton));
      const timeUploadHeader = element(by.xpath(timeUpload));
      statusBtn.isDisplayed().then(function () {
        library.logStep('Status button is displayed');
        console.log('Status button is displayed');
        status = true;
      });
      library.clickJS(statusBtn);
      dashboard.waitForElement();
      timeUploadHeader.isDisplayed().then(function () {
        library.logStep('Status page is displayed');
        console.log('Status page is displayed');
        timeupload = true;
      }).then(function () {
        if (status === true && timeupload === true) {
          displayed = true;
          library.logStep('Clicking status button Status screen displayed');
          console.log('Clicking status button Status screen displayed');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Status screen not displayed');
          console.log('Status screen not displayed');
          resolve(displayed);
        }
      });
    });
  }

  verifyFileNameUploaded(name, fileuploaded) {
    let fn, un, du, tu, st, status1, displayed = false;
    return new Promise((resolve) => {
      const connectivity = element(by.xpath(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        library.logStep('Connectivity Icon is displayed');
        console.log('Connectivity Icon is displayed');
        library.clickJS(connectivity);
        dashboard.waitForElement();
      });
      const status = element(by.xpath(statusTab));
      status.isDisplayed().then(function () {
        library.clickJS(status);
        dashboard.waitForElement();
        library.logStep('Status tab is displayed');
        console.log('Status tab is displayed');
        status1 = true;
      });
      const filename = element(by.xpath(fileNameStatus));
      library.scrollToElement(filename);
      filename.isDisplayed().then(function () {
        console.log('Filename displayed ');
        library.logStep('Filename displayed');
        fn = true;
      });
      const username = element(by.xpath('(//mat-table//mat-row//mat-cell/span[contains(text(),"' + name + '")])[1]'));
      library.scrollToElement(username);
      username.isDisplayed().then(function () {
        console.log('username displayed ');
        library.logStep('username displayed');
      });
      username.getText().then(function (text) {
        library.logStep('Username' + text);
        console.log('username displayed ');
        library.logStep('username displayed');
        un = true;
      });
      const today = new Date();
      const dtxt = today.getDate();
      const mtxt = today.getMonth() + 1;
      const ytxt = today.getFullYear();
      const dd = dtxt.toString();
      const mm = mtxt.toString();
      const yyyy = ytxt.toString();
      const date = mm + '/' + dd + '/' + yyyy;
      library.logStep('Date in mm dd yyyy :-' + date);
      const time = new Date();
      const timedisplayed = time.getHours() + ':' + time.getMinutes();
      library.logStep('Time displayed' + timedisplayed);
      const dateNew = element(by.xpath(dateDisplayed));
      dateNew.getText().then(function (datetext) {
        library.logStep('Date :-' + datetext);
        if (datetext.includes(date) || datetext.includes(dd) || datetext.includes(mm) || datetext.includes(yyyy)) {
          console.log('date displayed ');
          library.logStep('date displayed');
          du = true;
        }
      });
      const timeNew = element(by.xpath(timeDisplayed));
      timeNew.isDisplayed().then(function () {
        console.log('time displayed ');
        library.logStep('time displayed');
        tu = true;
      });
      const statusNew = element(by.xpath(fileStatus));
      library.scrollToElement(statusNew);
      statusNew.isDisplayed().then(function () {
        console.log('Processing status displayed ');
        library.logStep('Processing status displayed');
        st = true;
      });
      dashboard.waitForElement();
      const closeBtn = element(by.xpath(closeConnectivity));
      library.scrollToElement(closeBtn);
      closeBtn.isDisplayed().then(function () {
        library.clickJS(closeBtn);
        library.logStep('Connectivity page is closed');
        console.log('Connectivity page is closed');
      }).then(function () {
        if (fn === true && un === true && du === true && tu === true && st === true) {
          displayed = true;
          library.logStep('Status page displayed correctly');
          console.log('Status page displayed correctly');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Status page not displayed correctly');
          console.log('Status page not displayed correctly');
          resolve(displayed);
        }
        dashboard.waitForElement();
      });
    });
  }

  verifyInstructionsPageUI() {
    let result, head, info, infoMsg, addBtn = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const header = element(by.xpath(instructionsHeader));
      const infoIcn = element(by.xpath(infoIcon));
      const infoMs = element(by.xpath(infoMessage));
      const add = element(by.xpath(addInstructionsBtn));
      header.isDisplayed().then(function () {
        head = true;
        library.logStep('Header displayed');
        console.log('head ' + head);
      }).then(function () {
        infoIcn.isDisplayed().then(function () {
          info = true;
          library.logStep('Info Icon displayed');
          console.log('info ' + info);
        });
      }).then(function () {
        infoIcn.isDisplayed().then(function () {
          library.click(infoIcn);
          infoMs.getText().then(function (text) {
            if (text.includes('You must uniquely design instructions for each file format used to process QC results. To create instructions, please click "Add New Instructions"; give your instructions a unique name for each file format; and follow the four-step process provided. ')) {
              infoMsg = true;
              library.logStep('Information displayed');
              console.log('infoMsg ' + infoMsg);
              library.clickJS(infoIcn);
            }
          });
        });
      }).then(function () {
        add.isDisplayed().then(function () {
          addBtn = true;
          library.logStep('Add Instructions Button displayed');
          console.log('addBtn ' + addBtn);
        });
      }).then(function () {
        if (result && head && info && infoMsg && addBtn === true) {
          result = true;
          console.log('Intructions page UI Verified');
          library.logStepWithScreenshot('Intructions page UI Verified', 'Instructions_displayed');
          resolve(result);
        }
      });
    });
  }

  clickOnAddInstructionsButton() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const add = element(by.xpath(addInstructionsBtn));
      add.isDisplayed().then(function () {
        browser.sleep(3000);
        library.click(add);
        browser.sleep(3000);
        dashboard.waitForPage();
        console.log('Add Instructions Button clicked');
        library.logStep('Add Instructions Button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Add Instructions Button not displayed');
        library.logStep('Add Instructions Button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyFileUploadStatus() {
    let process
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(
        (element(by.xpath(statusButton)))), 20000, 'Element is not Displayed');
      const statusBtn = element(by.xpath(statusButton));
      statusBtn.isDisplayed().then(function () {
        library.clickJS(statusBtn);
        library.logStepWithScreenshot('Navigated to status tab', 'Navigated');
        console.log('Navigated to status tab');
      });
      browser.sleep(15000);

      /**
       * In Progress DEV on 25th April 2022 - Nitin G.
       */

      /* let processingNotCompleted = true;
      let count = 0; */
      //while(processingNotCompleted && count<=5){
      element(by.xpath("(//*[text()='PROCESSED'])[1]//following::span[1]")).getText().then(function (processedData) {
        console.log('processedData+++++++++> ', processedData)
        if (processedData.includes('0')) {
          browser.sleep(1000);
          /* processingNotCompleted = true;
          count++; */
          element(by.xpath("(//*[text()='REFRESH'])[1]")).isDisplayed().then(function () {
            element(by.xpath("(//*[text()='REFRESH'])[1]")).click();
            console.log('Clicked on Refresh Button ++> ');
          })
        } else {
          //processingNotCompleted = false;
        }
      })

      element(by.xpath("(//*[text()='PROCESSED'])[1]//following::span[1]")).getText().then(function (processedData) {
        if (processedData.includes('0')) {
          console.log('Failed : Processing is not completed');
          library.logStepWithScreenshot('Failed : Processing is not completed', 'Processing not Completed');
          resolve(false)
        } else {
          console.log('Processing is completed');
          library.logStepWithScreenshot('Processing is completed', 'Processing Completed');
          resolve(true)
        }

      });
    });
  }

  verifyAddInstructionsPopupUI() {
    let result, popup, head, tbx, cancelBtn, addBtn, close = false;
    return new Promise((resolve) => {
      const pop = element(by.xpath(addInstructionPopup));
      const header = element(by.xpath(addInstructionHead));
      const instrumentName = element(by.xpath(instructionNameTbx));
      const cancel = element(by.xpath(addInstructonCancel));
      const add = element(by.xpath(addInstructionAddBtn));
      const closeBtn = element(by.xpath(addInstructionClose));
      pop.isDisplayed().then(function () {
        popup = true;
        library.logStep('Popup displayed');
        console.log('popup ' + popup);
      }).then(function () {
        header.isDisplayed().then(function () {
          head = true;
          library.logStep('Header displayed');
          console.log('head ' + head);
        });
      }).then(function () {
        instrumentName.isDisplayed().then(function () {
          tbx = true;
          library.logStep('Instructions Name displayed');
          console.log('tbx ' + tbx);
        });
      }).then(function () {
        cancel.isDisplayed().then(function () {
          cancelBtn = true;
          library.logStep('Cancel Button displayed');
          console.log('cancelBtn ' + cancelBtn);
        });
      }).then(function () {
        add.isDisplayed().then(function () {
          addBtn = true;
          library.logStep('Add Button displayed');
          console.log('addBtn ' + addBtn);
        });
      }).then(function () {
        closeBtn.isDisplayed().then(function () {
          close = true;
          library.logStep('Close Button displayed');
          console.log('Close ' + close);
        });
      }).then(function () {
        if (popup && head && tbx && cancelBtn && addBtn && close === true) {
          result = true;
          console.log('Add Intructions popup UI Verified');
          library.logStepWithScreenshot('Add Intructions popup UI Verified', 'Add_Intructions_popup');
          resolve(result);
        }
      });
    });
  }

  verifyAddInstructionNamePopupDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const pop = element(by.xpath(addInstructionPopup));
      pop.isDisplayed().then(function () {
        console.log('Add Instructions name popup displayed');
        library.logStep('Add Instructions name popup displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Add Instructions name popup not displayed');
        library.logStep('Add Instructions name popup not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickCancelOnAddInstructionsName() {
    let result = false;
    return new Promise((resolve) => {
      const pop = element(by.xpath(addInstructionPopup));
      const cancel = element(by.xpath(addInstructonCancel));
      pop.isDisplayed().then(function () {
        cancel.isDisplayed().then(function () {
          library.click(cancel);
          console.log('Cancel clicked on Add Instructions popup');
          library.logStep('Cancel clicked on Add Instructions popup');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        console.log('Add Instructions popup not displayed');
        library.logStep('Add Instructions popup not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickAddOnAddInstructionsName() {
    let result = false;
    return new Promise((resolve) => {
      const pop = element(by.xpath(addInstructionPopup));
      const add = element(by.xpath(addInstructionAddBtn));
      pop.isDisplayed().then(function () {
        add.isDisplayed().then(function () {
          browser.sleep(3000);
          library.clickJS(add);
          browser.sleep(3000);
          dashboard.waitForElement();
          console.log('Add Instructions button clicked on Add Instructions popup');
          library.logStep('Add Instructions button clicked on Add Instructions popup');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        console.log('Add Instructions button not displayed');
        library.logStep('Add Instructions button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickCloseOnAddInstructionsName() {
    let result = false;
    return new Promise((resolve) => {
      const pop = element(by.xpath(addInstructionPopup));
      const closeBtn = element(by.xpath(addInstructionClose));
      pop.isDisplayed().then(function () {
        closeBtn.isDisplayed().then(function () {
          library.click(closeBtn);
          console.log('Close clicked on Add Instructions popup');
          library.logStep('Close clicked on Add Instructions popup');
          result = true;
          resolve(result);
        });
      }).catch(function () {
        console.log('Close not displayed');
        library.logStep('Close not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  addInstructionsName(name) {
    let result = false;
    return new Promise((resolve) => {
      const instrumentName = element(by.xpath(instructionNameTbx));
      console.log('Instrument name tbx');
      instrumentName.isDisplayed().then(function () {
        instrumentName.sendKeys(name);
        dashboard.waitForPage();
        console.log('Instructions name added: ' + name);
        library.logStep('Instructions name added: ' + name);
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Add Instructions name popup not displayed');
        library.logStep('Add Instructions name popup not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyAddNameButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const add = element(by.xpath(addInstructionAddBtn));
      add.isEnabled().then(function () {
        console.log('Add Instructions button is enabled on Add Instructions popup');
        library.logStep('Add Instructions button is enabled on Add Instructions popup');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Add Instructions button is not enabled on Add Instructions popup');
        library.logStep('Add Instructions button is not enabled on Add Instructions popup');
        result = false;
        resolve(result);
      });
    });
  }

  verifyAddNameButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const add = element(by.xpath(addInstructionAddBtn));
      add.isDisplayed().then(function () {
        add.getAttribute('disabled').then(function (txt) {
          console.log('Disabled txt: ' + txt);
          if (txt === 'true') {
            console.log('Add Instructions button is disabled on Add Instructions popup');
            library.logStep('Add Instructions button is disabled on Add Instructions popup');
            result = true;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Add Instructions button not disabled');
        library.logStep('Add Instructions button not disabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyPageDisplayed(name) {
    let result = false;
    return new Promise((resolve) => {
      const pageNameEle = element(by.xpath(pageName));
      dashboard.waitForPage();
      pageNameEle.isDisplayed().then(function () {
        pageNameEle.getText().then(function (text) {
          if (text.includes(name)) {
            console.log('Page displayed ' + text);
            library.logStepWithScreenshot('Page displayed ' + text, 'Page_Displayed_' + text);
            result = true;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Page not displayed ' + name);
        library.logStep('Page not displayed ' + name);
        result = true;
        resolve(result);
      });
    });
  }

  verifyStep1PageUI() {
    let result, head, info, dragdrop, browse, back, next = false;
    return new Promise((resolve) => {
      const header = element(by.xpath(pageName));
      const infoMsg = element(by.xpath(pageInfo));
      const dragDropAreaEle = element(by.xpath(dragdropArea));
      const browseLink = element(by.xpath(browseFileLink));
      const backBtn = element(by.xpath(backPageButton));
      const nextButton = element(by.xpath(nextPageButton));
      header.isDisplayed().then(function () {
        header.getText().then(function (txt) {
          if (txt.includes('Step1')) {
            head = true;
            library.logStep('Page displayed: ' + txt);
            library.logStep('Page displayed: ' + txt);
          }
        });
      }).then(function () {
        infoMsg.isDisplayed().then(function () {
          infoMsg.getText().then(function (txt) {
            if (txt.includes('Upload a file that you will regularly use for processing your QC results into the text area below.')) {
              info = true;
              library.logStep('Page Infromation displayed');
              console.log('info ' + info);
            }
          });
        });
      }).then(function () {
        dragDropAreaEle.isDisplayed().then(function () {
          dragdrop = true;
          library.logStep('Drag & Drop area displayed');
          console.log('dragdrop ' + dragdrop);
        });
      }).then(function () {
        browseLink.isDisplayed().then(function () {
          browse = true;
          library.logStep('Browse link displayed');
          console.log('browse ' + browse);
        });
      }).then(function () {
        backBtn.isDisplayed().then(function () {
          back = true;
          library.logStep('Back Button displayed');
          console.log('back ' + back);
        });
      }).then(function () {
        nextButton.isDisplayed().then(function () {
          next = true;
          library.logStep('Next Button displayed');
          console.log('next ' + next);
        });
      }).then(function () {
        if (head && info && dragdrop && browse && back && next === true) {
          result = true;
          console.log('Step 1 of Add Intructions page UI Verified');
          library.logStepWithScreenshot('Step 1 of Add Intructions page UI Verified', 'Step1_Page_Displayed');
          resolve(result);
        }
      });
    });
  }

  clickFileUpload() {
    let file = false;
    return new Promise((resolve) => {
      const connectivity = element(by.xpath(connectivityIcon));
      connectivity.isDisplayed().then(function () {
        library.logStep('Connectivity Icon is displayed');
        console.log('Connectivity Icon is displayed');
        library.clickJS(connectivity);
        dashboard.waitForElement();
      });
      const fileupload = element(by.xpath(fileUploadTab));
      fileupload.isDisplayed().then(function () {
        library.logStep('File upload tab is displayed');
        console.log('File upload tab is displayed');
        file = true;
        resolve(file);
        dashboard.waitForElement();
      });
    });
  }

  browseFileToUpload(fileToUpload) {
    let flag = false;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    return new Promise((resolve) => {
      const browse = element(by.xpath(browseFileLink));
      library.clickJS(browse);
      library.logStep('Browse link is clicked');
      const elm = element(by.css('input[type="file"]'));
      browser.executeScript('arguments[0].style = {};', elm.getWebElement());
      elm.sendKeys(absolutePath);
      flag = true;
      library.logStepWithScreenshot('Files added for new instrument', 'FilesForNewInstrument');
      resolve(flag);
    });
  }

  verifyFileisAddedToUpload() {
    let flag = false;
    return new Promise((resolve) => {
      const selectedFiles = element(by.xpath(selectedFilesEle));
      selectedFiles.isPresent().then(function (status) {
        if (status) {
          flag = true;
          library.logStepWithScreenshot('Files Added to upload for new instrument', 'FilesAddedToUploadForNewInstrument');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Files are not Added to upload for new instrument');
          resolve(flag);
        }
      });
    });
  }

  verifyMappingPage() {
    let displayed, Map, Instrument = false;
    return new Promise((resolve) => {
      const mapFileBtn = element(by.xpath(mapFileButton));
      const instruments = element(by.xpath(instrMapping));
      mapFileBtn.isDisplayed().then(function () {
        library.logStep('MapFile button is displayed');
        console.log('MapFile button is displayed');
        Map = true;
        console.log('Map value' + Map);
      });
      library.clickJS(mapFileBtn);
      dashboard.waitForElement();
      instruments.isDisplayed().then(function () {
        library.logStep('Mapping page is displayed');
        console.log('Mapping page is displayed');
        Instrument = true;
        console.log('Instrument value' + Instrument);
        dashboard.waitForElement();
      }).then(function () {
        if (Map === true && Instrument === true) {
          displayed = true;
          library.logStep('Clicking MapFile button Mapping screen displayed');
          console.log('Clicking MapFile button Mapping screen displayed');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Mapping screen not displayed');
          console.log('Mapping screen not displayed');
          resolve(displayed);
        }
        const closeBtn = element(by.xpath(closeConnectivity));
        library.scrollToElement(closeBtn);
        library.clickJS(closeBtn);
        library.logStep('Connectivity page is closed');
        console.log('Connectivity page is closed');
      });
    });
  }

  verifyStatusPageUI() {
    let fn, un, tu, st, status1, displayed = false;
    return new Promise((resolve) => {
      const statusBtn = element(by.xpath(statusButton));
      statusBtn.isDisplayed().then(function () {
        library.logStep('Status button is displayed');
        console.log('Status button is displayed');
        status1 = true;
      });
      library.clickJS(statusBtn);
      dashboard.waitForElement();
      dashboard.waitForElement();
      dashboard.waitForElement();
      const fileName = element(by.xpath(orgFileName));
      library.scrollToElement(fileName);
      fileName.isDisplayed().then(function () {
        library.logStep('File name is displayed');
        console.log('Status button is displayed');
        fn = true;
      });
      const userNm = element(by.xpath(userName));
      library.scrollToElement(userNm);
      fileName.isDisplayed().then(function () {
        library.logStep('User name is displayed');
        console.log('User button is displayed');
        un = true;
      });
      const time = element(by.xpath(timeUpload));
      library.scrollToElement(time);
      time.isDisplayed().then(function () {
        library.logStep('Time uploaded is displayed');
        console.log('Time uploaded is displayed');
        tu = true;
      });
      const status = element(by.xpath(fileStatusHeader));
      library.scrollToElement(status);
      status.isDisplayed().then(function () {
        library.logStep('Status is displayed');
        console.log('Status is displayed');
        st = true;
      }).then(function () {
        if (fn === true && un === true && tu === true && st === true) {
          displayed = true;
          library.logStep('Clicking status button Status screen UI displayed correctly');
          console.log('Clicking status button Status screen UI displayed correctly');
          resolve(displayed);
        } else {
          displayed = false;
          library.logStep('Status screen UI not displayed correctly');
          console.log('Status screen UI not displayed correctly');
          resolve(displayed);
        }
        const closeBtn = element(by.xpath(closeConnectivity));
        library.clickJS(closeBtn);
        library.logStep('Connectivity page is closed');
        console.log('Connectivity page is closed');
      });
    });
  }

  VerifyErrorInvalidFileExtention(errorMsg) {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const errorEle = element(by.xpath(invalidFileError));
      errorEle.getText().then(function (text) {
        if (text.includes(errorMsg)) {
          flag = true;
          library.logStepWithScreenshot('Files with invalid Extentions are not added', 'InvalidFileExtentionError');
          console.log('Files with invalid Extentions are not added');
          resolve(flag);
        } else {
          flag = false;
          this.logFailStep('Files with invalid Extentions are added');
          console.log('Files with invalid Extentions are added');
          resolve(flag);
        }
      });
    });
  }

  VerifyErrorMaxFileSize() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const errorEle = element(by.xpath(invalidFileError));
      errorEle.getText().then(function (text) {
        console.log(text);
        if (text.includes('File exceeds 8 MB.')) {
          flag = true;
          library.logStepWithScreenshot('Files More than 8 MB are not added', 'MaxFileSizeError');
          resolve(flag);
        } else {
          flag = false;
          library.logFailStep('Files More than 8 MB are added');
          resolve(flag);
        }
      });
    });
  }

  navigateToConnectivity() {
    let result = false;
    return new Promise(async (resolve) => {
      const btn = await element(by.xpath(connectivityIcon));
      await library.waitTillPresent(btn, 8888);
      if (await btn.isDisplayed()) {
        library.click(btn);
        await library.waitLoadingImageIconToBeInvisible();
        console.log('Connectivity clicked');
        library.logStep('Connectivity clicked');
        result = true;
        resolve(result);
      } else {
        console.log('Connectivity not displayed');
        library.logStep('Connectivity not displayed');
        result = false;
        resolve(result);
      }
      // });
    });
  }

  verifyNextStepButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(nextPageButton));
      button.isDisplayed().then(function () {
        button.getAttribute('disabled').then(function (txt) {
          if (txt === 'true') {
            console.log('Next Step button is disabled');
            library.logStep('Next Step button is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Next Step button is enabled');
            library.logStep('Next Step button is enabled');
            result = false;
            resolve(result);
          }
        }).catch(function () {
          console.log('Next Step button is enabled');
          library.logStep('Next Step button is enabled');
          result = false;
          resolve(result);
        });
      });
    });
  }

  verifyInstrumentCardUI(instrName, instrCode) {
    dashboard.waitForElement();
    let insrtnm, linkedcd, unlink1, displayed = false;
    return new Promise((resolve) => {
      const instrumentname = element(by.xpath('//mat-card-title[contains(text(),"' + instrName + '")]'));
      const instrumentcode = element(by.xpath('//mat-card-content//div/span[contains(text(),"' + instrCode + '")]'));
      library.scrollToElement(instrumentname);
      instrumentname.isDisplayed().then(function () {
        console.log('Instrument name displayed on instrument card');
        library.logStep('Instrument name displayed on instrument card');
        insrtnm = true;
      });
      library.scrollToElement(instrumentcode);
      instrumentcode.isDisplayed().then(function () {
        console.log('Instrument code displayed on instrument card');
        library.logStep('Instrument code displayed on instrument card');
        linkedcd = true;
      });
      const unlinkLink = element(by.xpath(unlink));
      browser.actions().mouseMove(element(by.xpath(unlink))).perform();
      dashboard.waitForElement();
      unlinkLink.isDisplayed().then(function () {
        console.log('Unlink code link displayed on instrument card');
        library.logStep('Unlink code link displayed on instrument card');
        unlink1 = true;
      });
      if (insrtnm === true && linkedcd === true && unlink1 === true) {
        displayed = true;
        library.logStep('Instrument card details displayed correctly');
        console.log('Instrument card details displayed correctly');
        resolve(displayed);
      }
    });
  }

  clickNextStepButton() {
    let result = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(nextPageButton));
      button.isDisplayed().then(function () {
        library.clickJS(button);
        console.log('Next Step button clicked');
        library.logStep('Next Step button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Next Step button not clicked');
        library.logStep('Next Step button not clicked');
        result = false;
        resolve(result);
      });
    });
  }

  verifyStep2PageUI() {
    let result, head, headerRdb, footerRdb, headerRow, footerRow, txtarea, back, next = false;
    return new Promise((resolve) => {
      const header = element(by.xpath(pageName));
      const headerRdbEle = element(by.xpath(headerRadioBtns));
      const footerRdbEle = element(by.xpath(footerRadioBtns));
      const headerRowTbx = element(by.xpath(headerRowsTxtbx));
      const footerRowTbx = element(by.xpath(footerRowsTxtbx));
      const txtAreaEle = element(by.xpath(fileTextArea));
      const backBtn = element(by.xpath(backPageButton));
      const nextButton = element(by.xpath(nextPageButton));
      header.isDisplayed().then(function () {
        header.getText().then(function (txt) {
          if (txt.includes('Step2')) {
            head = true;
            library.logStep('Page displayed: ' + txt);
            library.logStep('Page displayed: ' + txt);
          }
        });
      }).then(function () {
        headerRdbEle.isDisplayed().then(function () {
          headerRdb = true;
          library.logStep('Header Radio Buttons displayed');
          console.log('headerRdb ' + headerRdb);
        });
      }).then(function () {
        footerRdbEle.isDisplayed().then(function () {
          footerRdb = true;
          library.logStep('Footer Radio Buttons displayed');
          console.log('footerRdb ' + footerRdb);
        });
      }).then(function () {
        headerRowTbx.isDisplayed().then(function () {
          headerRow = true;
          library.logStep('Header Rows TBX displayed');
          console.log('headerRow ' + headerRow);
        });
      }).then(function () {
        footerRowTbx.isDisplayed().then(function () {
          footerRow = true;
          library.logStep('Footer Rows TBX displayed');
          console.log('footerRow ' + footerRow);
        });
      }).then(function () {
        txtAreaEle.isDisplayed().then(function () {
          txtarea = true;
          library.logStep('Text Area Displayed');
          console.log('txtarea ' + txtarea);
        });
      }).then(function () {
        backBtn.isDisplayed().then(function () {
          back = true;
          library.logStep('Back Button displayed');
          console.log('back ' + back);
        }).then(function () {
          nextButton.isDisplayed().then(function () {
            next = true;
            library.logStep('Next Button displayed');
            console.log('next ' + next);
          });
        }).then(function () {
          if (head && headerRdb && footerRdb && headerRow && footerRow && txtarea && back && next === true) {
            result = true;
            console.log('Step 2 of Add Intructions page UI Verified');
            library.logStepWithScreenshot('Step 2 of Add Intructions page UI Verified', 'Step2_Page_Displayed');
            resolve(result);
          }
        });
      });
    });
  }

  selectHeaderFooter(header, footer) {
    let result = false;
    return new Promise((resolve) => {
      const headerBtns = element(by.xpath(headerRadioBtns));
      const footerBtns = element(by.xpath(footerRadioBtns));
      const headerYes = element(by.xpath(headerYesBtn));
      const headerNo = element(by.xpath(headerNoBtn));
      const footerYes = element(by.xpath(footerYesBtn));
      const footerNo = element(by.xpath(footerNoBtn));
      headerBtns.isDisplayed().then(function () {
        if (header === 'Yes') {
          library.clickJS(headerYes);
          console.log('Header selected Yes');
          library.logStep('Header selected Yes');
        } else if (header === 'No') {
          library.clickJS(headerNo);
          console.log('Header selected No');
          library.logStep('Header selected No');
        }
      }).then(function () {
        footerBtns.isDisplayed().then(function () {
          if (footer === 'Yes') {
            library.clickJS(footerYes);
            console.log('Footer selected Yes');
            library.logStep('Footer selected Yes');
          } else if (footer === 'No') {
            library.clickJS(footerNo);
            console.log('Footer selected No');
            library.logStep('Footer selected No');
          }
        });
        result = true;
        console.log('Header & Footer Selected as: ' + header + ' ' + footer);
        library.logStepWithScreenshot('Header & Footer Selected as: ' + header + ' ' + footer, 'HeaderFooterSelected');
        resolve(result);
      });
    });
  }

  verifyHeaderNumberFieldDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const headerRowNum = element(by.xpath(headerRowsTxtbx));
      headerRowNum.isDisplayed().then(function () {
        headerRowNum.getAttribute('disabled').then(function (txt) {
          if (txt === 'true') {
            console.log('Header Row Number textbox is disabled');
            library.logStep('Header Row Number textbox is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Header Row Number textbox is enabled');
            library.logStep('Header Row Number textbox is enabled');
            result = false;
            resolve(result);
          }
        }).catch(function () {
          console.log('Header Row Number textbox is enabled');
          library.logStep('Header Row Number textbox is enabled');
          result = false;
          resolve(result);
        });
      });
    });
  }

  verifyFooterNumberFieldDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const footerRowNum = element(by.xpath(footerRowsTxtbx));
      footerRowNum.isDisplayed().then(function () {
        footerRowNum.getAttribute('disabled').then(function (txt) {
          if (txt === 'true') {
            console.log('Footer Row Number textbox is disabled');
            library.logStep('Footer Row Number textbox is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Footer Row Number textbox is enabled');
            library.logStep('Footer Row Number textbox is enabled');
            result = false;
            resolve(result);
          }
        }).catch(function () {
          console.log('Footer Row Number textbox is enabled');
          library.logStep('Footer Row Number textbox is enabled');
          result = false;
          resolve(result);
        });
      });
    });
  }

  addRowsNumberInHeader(num) {
    let result = false;
    return new Promise((resolve) => {
      const headerRowNum = element(by.xpath(headerRowsTxtbx));
      headerRowNum.isDisplayed().then(function () {
        headerRowNum.getAttribute('disabled').then(function (txt) {
          if (txt === 'true') {
            console.log('Header Row Number textbox is disabled');
            library.logStep('Header Row Number textbox is disabled');
            result = false;
            resolve(result);
          } else {
            headerRowNum.clear();
            headerRowNum.sendKeys(num);
            console.log('Header Row Number added: ' + num);
            library.logStep('Header Row Number added: ' + num);
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  addRowsNumberInFooter(num) {
    let result = false;
    return new Promise((resolve) => {
      const footerRowNum = element(by.xpath(footerRowsTxtbx));
      footerRowNum.isDisplayed().then(function () {
        footerRowNum.getAttribute('disabled').then(function (txt) {
          if (txt === 'true') {
            console.log('Footer Row Number textbox is disabled');
            library.logStep('Footer Row Number textbox is disabled');
            result = false;
            resolve(result);
          } else {
            footerRowNum.clear();
            footerRowNum.sendKeys(num);
            console.log('Footer Row Number added: ' + num);
            library.logStep('Footer Row Number added: ' + num);
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  verifyTestsCardUI(testsnm, testscd) {
    let testnm, linkedcd, displayed = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      // const testName = element(by.xpath('//mat-card-title[text()="' + testsnm + '"]'));
      const testName = element(by.xpath('.//mat-card-title[contains(text(), "' + testsnm + '")]'));
      const testCode = element(by.xpath('.//div/span[text()="' + testscd + '"]'));
      library.scrollToElement(testName);
      testName.isDisplayed().then(function () {
        library.logStep('Test name displayed correctly');
        console.log('Test name displayed correctly');
        testnm = true;
      });
      library.hoverOverElement(testName);
      library.scrollToElement(testCode);
      testCode.isDisplayed().then(function () {
        library.logStep('Test code displayed correctly');
        console.log('Test code displayed correctly');
        linkedcd = true;
      });
      if (testnm === true && linkedcd === true) {
        displayed = true;
        library.logStep('Tests card details displayed correctly');
        console.log('Tests card details displayed correctly');
        resolve(displayed);
      }
    });
  }

  verifyReagentCaliberatorPopUp() {
    dashboard.waitForElement();
    let displayed = false;
    return new Promise((resolve) => {
      const reagentCalibPopUp = element(by.xpath(reagecalib));
      library.scrollToElement(reagentCalibPopUp);
      reagentCalibPopUp.isDisplayed().then(function () {
        console.log(' Reagent Calibrator mapping popup displayed');
        library.logStep('Reagent Calibrator mapping popup displayed');
        displayed = true;
        resolve(displayed);
      });
    });
  }

  verifyHeaderError() {
    let result = false;
    return new Promise((resolve) => {
      const errorEle = element(by.xpath(errorHeader));
      errorEle.isDisplayed().then(function () {
        errorEle.getText().then(function (txt) {
          const text = txt.trim();
          if (text.includes('Please enter a value between 1 and 99')) {
            console.log('Error Displayed at header: ' + text);
            library.logStep('Error Displayed at header: ' + text);
            result = true;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Error not displayed at header');
        library.logStep('Error not displayed at header');
        result = false;
        resolve(result);
      });
    });
  }

  verifyFooterError() {
    let result = false;
    return new Promise((resolve) => {
      const errorEle = element(by.xpath(errorFooter));
      errorEle.isDisplayed().then(function () {
        errorEle.getText().then(function (txt) {
          const text = txt.trim();
          console.log('Error disp: ' + text);
          if (text.includes('Please enter a value between 1 and 99')) {
            console.log('Error Displayed at footer: ' + text);
            library.logStep('Error Displayed at footer: ' + text);
            result = true;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Error not displayed at footer');
        library.logStep('Error not displayed at footer');
        result = false;
        resolve(result);
      });
    });
  }

  verifyFileDataDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const fileDataEle = element(by.xpath(fileTextArea));
      fileDataEle.isDisplayed().then(function () {
        library.logStep('File Text Displayed');
        console.log('File Text Displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('File text not displayed');
        console.log('File text not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyBackButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const backBtn = element(by.xpath(backButton));
      backBtn.isEnabled().then(function () {
        library.logStep('Back Button Enabled');
        console.log('Back Button Enabled');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Back Button Disabled');
        console.log('Back Button Disabled');
        result = false;
        resolve(result);
      });
    });
  }

  clickBackButton() {
    let result = false;
    return new Promise((resolve) => {
      const backBtn = element(by.xpath(backButton));
      backBtn.isEnabled().then(function () {
        library.clickJS(backBtn);
        library.logStep('Back Button clicked');
        console.log('Back Button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        library.logStep('Back Button not clicked');
        console.log('Back Button not clicked');
        result = false;
        resolve(result);
      });
    });
  }

  verifyFileUploadPageUI() {
    let result, head, dragdrop, browse, ddl, reset, upload = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const header = element(by.xpath(fileUploadPageName));
      const dragDropAreaEle = element(by.xpath(dragdropArea));
      const browseLink = element(by.xpath(browseFileLink));
      const nameDdl = element(by.xpath(instructionNameDropdown));
      const resetBtn = element(by.xpath(resetButton));
      const uploadBtn = element(by.xpath(uploadButton));
      header.isDisplayed().then(function () {
        header.getText().then(function (txt) {
          if (txt.includes('File Upload')) {
            head = true;
            library.logStep('Page displayed: ' + txt);
            library.logStep('Page displayed: ' + txt);
          }
        });
      }).then(function () {
        dragDropAreaEle.isDisplayed().then(function () {
          dragdrop = true;
          library.logStep('Drag & Drop area displayed');
          console.log('dragdrop ' + dragdrop);
        });
      }).then(function () {
        browseLink.isDisplayed().then(function () {
          browse = true;
          library.logStep('Browse link displayed');
          console.log('browse ' + browse);
        });
      }).then(function () {
        nameDdl.isDisplayed().then(function () {
          ddl = true;
          library.logStep('Instructions Dropdown list displayed');
          console.log('Instructions Dropdown list displayed ');
        });
      }).then(function () {
        resetBtn.isDisplayed().then(function () {
          reset = true;
          library.logStep('Reset Button displayed');
          console.log('reset ' + reset);
        });
      }).then(function () {
        uploadBtn.isDisplayed().then(function () {
          upload = true;
          library.logStep('Upload Button displayed');
          console.log('upload ' + upload);
        });
      }).then(function () {
        if (head && dragdrop && browse && ddl && reset && upload === true) {
          result = true;
          console.log('File upload page UI Verified');
          library.logStepWithScreenshot('File upload page UI Verified', 'File_Upload_Page_Displayed');
          resolve(result);
        }
      });
    });
  }

  clickStep2NextButton() {
    let result = false;
    return new Promise((resolve) => {
      const nextButton = element(by.xpath(step2NextButton));
      nextButton.isDisplayed().then(function () {
        nextButton.click();
        library.logStep('Step 2 Next Button is clicked');
        result = true;
        resolve(result);
      });
    });
  }

  verifyStep3UI() {
    let status = false;
    return new Promise((resolve) => {
      const elementsUI = new Map<string, string>();
      elementsUI.set(step3header, 'Header Step 3');
      elementsUI.set(step3SpecifyDelimiterLabel, 'Step 3 Label Specify the field delimiter');
      elementsUI.set(step3DelimiterDD, 'Field Delimiter dropdown');
      elementsUI.set(step3DataText, 'File Data Text');
      elementsUI.set(step3BackButton, 'Back Button');
      elementsUI.set(step3NextButton, 'Next Button');
      elementsUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        if (ele.isDisplayed()) {
          status = true;
          library.logStep(key + ' is displayed');
        } else {
          status = false;
          library.logFailStep(key + ' is not displayed');
        }
      });
      library.attachScreenshot('Step 3 UI Verified');
      resolve(status);
    });
  }

  selectDelimiter(delimiter) {
    let result = false;
    return new Promise((resolve) => {
      const delimiterDD = element(by.xpath(step3DelimiterDD));
      delimiterDD.isDisplayed().then(function () {
        delimiterDD.click();
        library.logStep('Drop Down Field Delimiter is clicked');
        const delimiterOption = element(by.xpath('.//mat-option/span[contains(text(),"' + delimiter + '")]'));
        library.clickJS(delimiterOption);
        result = true;
        resolve(result);
      });
    });
  }

  verifyStep3NextButtonEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const nextEnable = element(by.xpath(step3NextButtonEnabled));
      nextEnable.isDisplayed().then(function () {
        library.logStep('Next Button is Enabled');
        result = true;
        resolve(result);
      });
    });
  }

  clickStepBackButton() {
    let result = false;
    return new Promise((resolve) => {
      const back = element(by.xpath(step3BackButton));
      back.isDisplayed().then(function () {
        back.click();
        library.logStep('Back Button is Clicked');
        result = true;
        resolve(result);
      });
    });
  }

  clickStep3NextButton() {
    let result = false;
    return new Promise((resolve) => {
      const next = element(by.xpath(step3NextButtonEnabled));
      next.isDisplayed().then(function () {
        next.click();
        result = true;
        resolve(result);
      });
    });
  }

  verifyStep4UI() {
    let status = false;
    return new Promise((resolve) => {
      const elementsUI = new Map<string, string>();
      elementsUI.set(step4header, 'Header Step 4');
      elementsUI.set
        (step4Label, 'Step 4 Label This final step is used to designate which fields contain the important values that are extracted from the delimited file used to process QC results.');
      elementsUI.set(step4DataText, 'First row of Data');
      elementsUI.set(step4Toggle, 'Summary Data Entry Toggle Button');
      elementsUI.set(step4ToggleLabel, 'Summary Data Entry label');
      elementsUI.set(ddInsstrumentCode, 'Instrument Code dropdown');
      elementsUI.set(textBoxCustomeInstrumentCode, 'Custome Instrument Code textbox');
      elementsUI.set(ddProductLot, 'Product Lot and Level dropdown');
      elementsUI.set(ddProductLevel, 'Product Level dropdown');
      elementsUI.set(ddTestCode, 'Test Code dropdown');
      elementsUI.set(ddDateTime, 'Date / Time Resulted dropdown');
      elementsUI.set(ddFindFormats, 'Find Formats dropdown');
      elementsUI.set(ddTime, 'Time Resulted dropdown');
      elementsUI.set(ddMean, 'Mean dropdown');
      elementsUI.set(ddSD, 'Standard Deviation(SD) dropdown');
      elementsUI.set(ddPoints, 'Points dropdown');
      elementsUI.set(ddReagent, 'Reagent Lot dropdown');
      elementsUI.set(ddCalibrator, 'Calibrator Lot dropdown');
      elementsUI.set(step4BackButton, 'Back Button');
      elementsUI.set(step4CompleteButton, 'Submit Button');
      elementsUI.set(step4ResetButton, 'Reset Button');
      elementsUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        if (ele.isDisplayed()) {
          status = true;
          library.logStep(key + ' is displayed');
        } else {
          status = false;
          library.logFailStep(key + ' is not displayed');
        }
      });
      library.attachScreenshot('Step 4 UI Verified');
      resolve(status);
    });
  }

  clickSummaryToggle() {
    let status = false;
    return new Promise((resolve) => {
      const summaryToggle = element(by.xpath(step4Toggle));
      summaryToggle.isDisplayed().then(function () {
        summaryToggle.click();
        summaryToggle.getAttribute('class').then(function (nameOfClass) {
          if (nameOfClass.includes('checked')) {
            library.logStep('Summary Data Entry Enabled');
          } else {
            library.logStep('Point Data Entry Enabled');
          }
        });
        status = true;
        resolve(status);
      });
    });
  }

  verifyStep4UIPointData() {
    let status = false;
    return new Promise((resolve) => {
      const elementsUI = new Map<string, string>();
      elementsUI.set(step4header, 'Header Step 4');
      elementsUI.set
        (step4Label, 'Step 4 Label This final step is used to designate which fields contain the important values that are extracted from the delimited file used to process QC results.');
      elementsUI.set(step4DataText, 'First row of Data');
      elementsUI.set(step4Toggle, 'Summary Data Entry Toggle Button');
      elementsUI.set(step4ToggleLabel, 'Summary Data Entry label');
      elementsUI.set(ddInsstrumentCode, 'Instrument Code dropdown');
      elementsUI.set(textBoxCustomeInstrumentCode, 'Custome Instrument Code textbox');
      elementsUI.set(ddProductLot, 'Product Lot and Level dropdown');
      elementsUI.set(ddProductLevel, 'Product Level dropdown');
      elementsUI.set(ddTestCode, 'Test Code dropdown');
      elementsUI.set(ddDateTime, 'Date / Time Resulted dropdown');
      elementsUI.set(ddFindFormats, 'Find Formats dropdown');
      elementsUI.set(ddTime, 'Time Resulted dropdown');
      elementsUI.set(ddValue, 'Value dropdown');
      elementsUI.set(ddReagent, 'Reagent Lot dropdown');
      elementsUI.set(ddCalibrator, 'Calibrator Lot dropdown');
      elementsUI.set(step4BackButton, 'Back Button');
      elementsUI.set(step4CompleteButton, 'Submit Button');
      elementsUI.set(step4ResetButton, 'Reset Button');
      elementsUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        if (ele.isDisplayed()) {
          status = true;
          library.logStep(key + ' is displayed');
        } else {
          status = false;
          library.logFailStep(key + ' is not displayed');
        }
      });
      library.attachScreenshot('Step 4 UI Verified');
      resolve(status);
    });
  }

  selectValueFromDropDown(FieldName) {
    let status = false;
    return new Promise((resolve) => {
      switch (FieldName) {
        case 'Instrument': {
          const ele = element(by.xpath(ddInsstrumentCode));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Product Lot': {
          const ele = element(by.xpath(ddProductLot));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Product Level': {
          const ele = element(by.xpath(ddProductLevel));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Test': {
          const ele = element(by.xpath(ddTestCode));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Date': {
          const ele = element(by.xpath(ddDateTime));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Find Formats': {
          const ele = element(by.xpath(ddFindFormats));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Time': {
          const ele = element(by.xpath(ddTime));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Mean': {
          const ele = element(by.xpath(ddMean));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'SD': {
          const ele = element(by.xpath(ddSD));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Points': {
          const ele = element(by.xpath(ddPoints));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Reagent': {
          const ele = element(by.xpath(ddReagent));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Calibrator': {
          const ele = element(by.xpath(ddCalibrator));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
        case 'Value': {
          const ele = element(by.xpath(ddValue));
          library.scrollToElement(ele);
          ele.click();
          break;
        }
      }
      library.logStep(FieldName + ' Dropdown clicked');
      const option = element(by.xpath(firstOptionFromDD));
      option.isDisplayed().then(function () {
        option.click();
        library.logStepWithScreenshot(FieldName + ' Dropdown value selected', FieldName + ' Selected');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep(FieldName + ' dropdown does not contain any options');
        status = false;
        resolve(status);
      });
    });
  }

  verifyResetButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const resetBtn = element(by.xpath(step4ResetButtonEnabled));
      resetBtn.isDisplayed().then(function () {
        library.logStep('Reset Button is Enabled');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Reset Button is not Enabled');
        status = false;
        resolve(status);
      });
    });
  }

  navigateToInstructions() {
    let result = false;
    return new Promise((resolve) => {
      const instructions = element(by.xpath(instructionsTab));
      instructions.isDisplayed().then(function () {
        library.clickJS(instructions);
        dashboard.waitForPage();
        console.log('Instructions tab clicked');
        library.logStep('Instructions tab clicked');
        result = true;
        resolve(result);
      });
    });
  }

  selectCaliberator(reage, cal) {
    let calibrator = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const rcdialogue = element(by.xpath(reagentcalibDialogue));
      library.scrollToElement(rcdialogue);
      const reagentDDL = element(by.xpath('//mat-select/div/following::div/span[contains(text(),"Reagent Lot Number")]/following::div'));
      library.scrollToElement(reagentDDL);
      library.clickJS(reagentDDL);
      const reagent = element(by.xpath('.//div[@class="cdk-overlay-pane"]//mat-option/span[contains(text(),"' + reage + '")]'));
      library.clickJS(reagent);
      library.logStep('Reagent drop down value selected');
      console.log('Reagent drop down value selected');
      dashboard.waitForElement();
      const calibDDL = element(by.xpath('//mat-select/div/following::div/span[contains(text(),"Calibrator Lot Number")]'));
      library.scrollToElement(calibDDL);
      library.clickJS(calibDDL);
      const calibDropDown = element(by.xpath('.//div[@class="cdk-overlay-pane"]//mat-option/span[contains(text(),"' + cal + '")]'));
      library.clickJS(calibDropDown);
      library.logStep('Caliberator drop down value selected');
      console.log('Caliberator drop down value selected');
      dashboard.waitForElement();
      calibrator = true;
      resolve(calibrator);
    });
  }

  selectInstruction(instName) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const instructionName = element(by.xpath(instructionNameDropdown));
      instructionName.isDisplayed().then(function () {
        instructionName.getAttribute('class').then(function (txt) {
          if (txt.includes('disabled')) {
            instructionName.getText().then(function (name) {
              if (name.includes(instName)) {
                console.log('Instruction name available: ' + name);
                library.logStep('Instruction name available: ' + name);
                result = true;
                resolve(result);
              }
            });
          } else {
            library.clickJS(instructionName);
            const name = element(by.xpath('.//mat-option//span[contains(text(),"' + instName + '")]'));
            library.clickJS(name);
            console.log('Instruction Selected: ' + name);
            library.logStep('Instruction Selected: ' + name);
            result = true;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Instructions not displayed');
        library.logStep('Instructions not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyUploadButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const button = element(by.xpath(uploadButton));
      button.isDisplayed().then(function () {
        button.getAttribute('disabled').then(function (txt) {
          console.log('upload button: ' + txt);
          if (txt === 'true') {
            console.log('Upload button is disabled');
            library.logStep('Upload button is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Upload button is enabled');
            library.logStep('Upload button is enabled');
            result = false;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Upload button is enabled');
        library.logStep('Upload button is enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyFileUploadTabDisabled() {
    let result = false;
    return new Promise((resolve) => {
      const tab = element(by.xpath(fileUploadTab));
      tab.isDisplayed().then(function () {
        tab.getAttribute('class').then(function (txt) {
          console.log('Class name: ' + txt);
          if (txt.includes('disabled')) {
            console.log('Upload button is disabled');
            library.logStep('Upload button is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Upload button is enabled');
            library.logStep('Upload button is enabled');
            result = false;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Upload button is enabled');
        library.logStep('Upload button is enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyResetButtonDisabled() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const button = element(by.xpath(step4ResetButton));
      button.isDisplayed().then(function () {
        button.getAttribute('disabled').then(function (txt) {
          console.log('Reset button: ' + txt);
          if (txt === 'true') {
            console.log('Reset button is disabled');
            library.logStep('Reset button is disabled');
            result = true;
            resolve(result);
          } else {
            console.log('Reset button is enabled');
            library.logStep('Reset button is enabled');
            result = false;
            resolve(result);
          }
        });
      }).catch(function () {
        console.log('Reset button is enabled');
        library.logStep('Reset button is enabled');
        result = false;
        resolve(result);
      });
    });
  }

  clickResetButton() {
    let result = false;
    return new Promise((resolve) => {
      const reset = element(by.xpath(resetButton));
      reset.isDisplayed().then(function () {
        library.clickJS(reset);
        dashboard.waitForPage();
        console.log('Reset Button clicked');
        library.logStep('Reset Button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Reset Button not displayed');
        library.logStep('Reset Button not displayed');
        result = false;
        resolve(result);
      });
    });
  }


  clickUploadButton() {
    let result = false;
    return new Promise(async (resolve) => {
      const upload = await element(by.xpath(uploadButton));
      await library.waitTillVisible(upload, 8888);
      if (await upload.isDisplayed()) {
        await library.waitTillClickable(upload, 8888);
        library.clickJS(upload);
        await library.waitLoadingImageIconToBeInvisible();
        console.log('Upload Button clicked');
        library.logStep('Upload Button clicked');
        result = true;
        resolve(result);
      } else {
        console.log('Upload Button not displayed');
        library.logStep('Upload Button not displayed');
        result = false;
        resolve(result);
      }
    });
  }

  verifyMapFileButtonDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const map = element(by.xpath(mapFileButton));
      library.waitForPage();
      map.isDisplayed().then(function () {
        console.log('Map file button displayed');
        library.logStep('Map file button displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Map file button not displayed');
        library.logStep('Map file button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyStatusButtonDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      const status = element(by.xpath(statusButton));
      library.waitForPage();
      status.isDisplayed().then(function () {
        console.log('Status button displayed');
        library.logStep('Status button displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Status button not displayed');
        library.logStep('Status button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyInstructionsNameDisplayed(instructionName) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const instruction = element(by.xpath('.//unext-instructions-table//table//tr/td[1][contains(text(),"' + instructionName + '")]'));
      instruction.isDisplayed().then(function () {
        console.log('Instruction displayed');
        library.logStep('Instruction displayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Instruction not displayed');
        library.logStep('Instruction not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifySequenceOfInstructions(instructionsName1, instructionsName2) {
    let result, flag1, flag2 = false;
    return new Promise((resolve) => {
      const firstInst = element(by.xpath('.//unext-instructions-table//table//tr[1]/td[1]'));
      const secondInst = element(by.xpath('.//unext-instructions-table//table//tr[2]/td[1]'));
      firstInst.getText().then(function (text) {
        if (text.includes(instructionsName2)) {
          flag1 = true;
          console.log('First Instruction name is: ' + text);
          library.logStep('First Instruction name is: ' + text);
        }
      }).then(function () {
        secondInst.getText().then(function (text) {
          if (text.includes(instructionsName1)) {
            flag2 = true;
            console.log('Second Instruction name is: ' + text);
            library.logStep('Second Instruction name is: ' + text);
          }
        });
      }).then(function () {
        if (flag1 && flag2 === true) {
          console.log('Instructions sequence verified');
          library.logStep('Instructions sequence verified');
          result = true;
          resolve(result);
        }
      });
    });
  }

  clickOnDeleteInstructionButton(instructionName) {
    let result = false;
    return new Promise((resolve) => {
      const instruction = element(by.xpath('.//unext-instructions-table//table//tr/td[1][contains(text(),"' + instructionName + '")]'));
      const deleteInst = element
        (by.xpath('.//unext-instructions-table//table//tr/td[1][contains(text(),"' + instructionName + '")]/parent::tr/td[2]/button'));
      instruction.isDisplayed().then(function () {
        library.hoverOverElement(instruction);
        library.clickJS(deleteInst);
        library.waitForPage();
        console.log('Instruction delete button clicked');
        library.logStep('Instruction delete button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Instruction not displayed');
        library.logStep('Instruction not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  verifyInstructionsMaxCharacters() {
    let result = false;
    return new Promise((resolve) => {
      const instrumentName = element(by.xpath(instructionNameTbx));
      instrumentName.isDisplayed().then(function () {
        instrumentName.getAttribute('value').then(function (text) {
          const name = text.trim();
          const num = name.length;
          console.log('Char: ' + num);
          if (num > 50) {
            console.log('Instruction name accepting more than 50 characters');
            library.logStep('Instruction name accepting more than 50 characters');
            result = false;
            resolve(result);
          } else {
            console.log('Instruction name accepting max 50 characters');
            library.logStep('Instruction name accepting max 50 characters');
            result = true;
            resolve(result);
          }
        });
      });
    });
  }

  verifySummaryValuesReset(dataEntryType) {
    let status = false;
    return new Promise((resolve) => {
      const elementsUI = new Map<string, string>();
      elementsUI.set(ddInsstrumentCode, 'Instrument Code dropdown');
      elementsUI.set(ddProductLot, 'Product Lot and Level dropdown');
      elementsUI.set(ddProductLevel, 'Product Level dropdown');
      elementsUI.set(ddTestCode, 'Test Code dropdown');
      elementsUI.set(ddDateTime, 'Date / Time Resulted dropdown');
      elementsUI.set(ddFindFormats, 'Find Formats dropdown');
      elementsUI.set(ddTime, 'Time Resulted dropdown');
      elementsUI.set(ddMean, 'Mean dropdown');
      elementsUI.set(ddSD, 'Standard Deviation(SD) dropdown');
      elementsUI.set(ddPoints, 'Points dropdown');
      elementsUI.set(ddReagent, 'Reagent Lot dropdown');
      elementsUI.set(ddCalibrator, 'Calibrator Lot dropdown');
      elementsUI.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        ele.isDisplayed().then(function () {
          ele.getAttribute('class').then(function (valueClassname) {
            if (dataEntryType === 'Point' && value === ddMean || dataEntryType === 'Point'
              && value === ddSD || dataEntryType === 'Point' && value === ddPoints) {
              if (valueClassname.includes('empty')) {
                library.logStep(key + ' is empty');
              } else {
                library.logFailStep(key + ' is not empty');
              }
            } else {
              if (valueClassname.includes('dirty') && valueClassname.includes('empty')) {
                library.logStep(key + ' is empty');
              } else {
                library.logFailStep(key + ' is not empty');
              }
            }
          });
        });
      });
      library.attachScreenshot('Step 4 dropdown values are reset');
      status = true;
      resolve(status);
    });
  }

  verifyCompleteButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const complete = element(by.xpath(step4CompleteButton));
      complete.isDisplayed().then(function () {
        library.logStep('Submit Button is disabled');
        status = true;
        resolve(status);
      });
    });
  }

  verifyCompleteButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const complete = element(by.xpath(step4CompleteButtonEnabled));
      complete.isDisplayed().then(function () {
        library.logStep('Submit Button is enabled');
        status = true;
        resolve(status);
      });
    });
  }

  clickCompleteButton() {
    let status = false;
    return new Promise((resolve) => {
      const complete = element(by.xpath(step4CompleteButtonEnabled));
      complete.isDisplayed().then(function () {
        complete.click();
        status = true;
        resolve(status);
      });
    });
  }

  verifyControlCardUI(cntrolnm, cntrlcode, lotn) {
    dashboard.waitForElement();
    let cntrlnm, linkedcd, lotno1, displayed = false;
    return new Promise((resolve) => {
      const productName = element(by.xpath('//mat-card//mat-card-title[contains(text(),"' + cntrolnm + '")]'));
      const controlCode = element(by.xpath('//mat-card-content//div/span[contains(text(),"' + cntrlcode + '")]'));
      const lotno = element(by.xpath('//mat-card-subtitle/span[contains(text(),"' + lotn + '")]'));
      library.scrollToElement(controlCode);
      controlCode.isDisplayed().then(function () {
        library.logStep('Control code displayed correctly');
        console.log('Control code displayed correctly');
        linkedcd = true;
      });
      library.scrollToElement(lotno);
      lotno.isDisplayed().then(function () {
        library.logStep('Control lot no displayed correctly');
        console.log('Control lot no displayed correctly');
        lotno1 = true;
      });
      library.scrollToElement(productName);
      productName.isDisplayed().then(function () {
        library.logStep('Product name displayed correctly');
        console.log('Product name displayed correctly');
        cntrlnm = true;
      });
      if (cntrlnm === true && linkedcd === true && lotno1 === true) {
        displayed = true;
        library.logStep('Control card details displayed correctly');
        console.log('Control card details displayed correctly');
        resolve(displayed);
      }
    });
  }

  clickTests() {
    let clicked = false;
    return new Promise((resolve) => {
      const testLink = element(by.xpath(testCard));
      library.scrollToElement(testLink);
      library.clickJS(testLink);
      library.logStep('Clicked on Tests');
      console.log('Clicked on Tests');
      clicked = true;
      resolve(clicked);
    });
  }

  clickLinkBtnonPopUp() {
    let displayed = false;
    return new Promise((resolve) => {
      const linkButton = element(by.xpath(LinkBtnonPopUp));
      linkButton.isDisplayed().then(function (btn) {
        library.clickJS(linkButton);
        library.logStep('Link button clicked');
        console.log('Link button clicked');
        dashboard.waitForElement();
        displayed = true;
        resolve(displayed);
      });
    });
  }

  navigateToFileUploadTab() {
    let result = false;
    return new Promise((resolve) => {
      const file = element(by.xpath(fileUploadTab));
      file.isDisplayed().then(function () {
        library.clickJS(file);
        console.log('File Upload Tab clicked');
        library.logStep('File Upload Tab clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('File Upload Tab not displayed');
        library.logStep('File Upload Tab not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  closeConnectivityPopup() {
    let status = false;
    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(closeConnectivity));
      closeBtn.isDisplayed().then(function () {
        library.clickJS(closeBtn);
        library.logStep('Connectivity page is closed');
        console.log('Connectivity page is closed');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logStep('Close Button not displayed');
        console.log('Close Button not displayed');
        status = true;
        resolve(status);
      });
    });
  }

  clickOnRefreshStatus() {
    return new Promise((resolve) => {
      element(by.xpath(refreshBtn)).isDisplayed().then(function (btn) {
        element(by.xpath(refreshBtn)).click().then(function (clicked) {
          library.logStep('Refresh button clicked');
          console.log('Refresh button clicked');
          resolve(true);
        }).catch(function () {
          resolve(false);
        });
      }).catch(function () {
        resolve(false);
      });
    });
  }
}
