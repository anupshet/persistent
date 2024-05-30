/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { by, browser, element, protractor } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const accountManagementTitle = 'LoginComponent.AccountManagementTitle';
const accountManagementCls = 'account-management';
const pageTitle = 'page-title';
const tblBody = 'table-body';
const btnWrappper = 'mat-button-wrapper';
const labname = 'labName';
const country = 'country';
const overlayPane = 'cdk-overlay-pane';
const option = 'mat-option';
const fname = 'firstName';
const lname = 'lastName';
const emailText = 'email';
const noUser = 'licenseNumberUsers';
const conectivityOption = 'licenseConnectivityOption';
const lincenceLength = 'licenseLength';
const accountManagementCardEle = './/mat-card-title[@id = "LoginComponent.AccountManagementTitle"]';
const searchInputEle = './/input[@placeholder = "Search Accounts"]';
const searchBtnAccountManagement = './/button[@type = "submit"]';
const accountManagerLabEmailId = '(.//mat-cell[2]/div/span[2])[1]';
const accountMgrLabNameLinkEle = '(.//mat-cell[1]/div/a)[1]';
const editLabUpdateAccountBtnEle = './/button/span[contains(text(), "Update Account")]';
const labEditCloseBtn = './/span[@class = "icon-cancel"]';
const editLabWeekendError = './/mat-error[contains(text(), "Please choose a date that is a weekday.")]';
const editLabExpiryDateCalendarIcn = '(.//button[@aria-label = "Open calendar"])[2]';
const editLabSelectedExpiryDateEle = './/div[contains(@class, "mat-calendar-body")][contains(@class, "selected")]';
const editLabCalendarNextMonthBtn = './/button[contains(@class, "mat-calendar-next")]';
const expiryDateEle = './/input[@id = "licenseExpireDate"]';
const accountManagementHeader = './/h1[contains(text(), "Account Management")]';
const addAccountButton = './/span[contains(text(), "Add Account")]';
const createAccountHeader = './/h2[contains(text(), "Create Account")]';
const customerLabel = './/strong[contains(text(),"Customer")]';
const orderNumberTextbox = './/input[@placeholder="Order Number"]';
const primaryLabNumberTextbox = './/input[@placeholder="Primary Unity Lab Number(s)"]';
const labInformationLabel = './/strong[contains(text(), "Lab Information")]';
const labNameTextbox = './/input[@placeholder="Lab Name"]';
const countryDropdown = './/span[contains(text(), "Country")]';
const addressTextbox = './/input[@placeholder="Address"]';
const addressSecondLineTextbox = './/input[@placeholder="Address Second Line"]';
const addressThirdLineTextbox = './/input[@placeholder="Address Third Line"]';
const cityTextbox = './/input[@placeholder="City"]';
const postalCodeTextbox = './/input[@placeholder="Zip/Postal Code"]';
const stateTextbox = './/input[@placeholder="State/Province/Region"]';
const labContactLabel = './/strong[contains(text(),"Lab Contact")]';
const firstNameTextbox = './/input[@placeholder="First Name"]';
const lastNameTextbox = './/input[@placeholder="Last Name"]';
const emailTextbox = './/input[@placeholder="Email"]';
const licenseInformationLabel = './/strong[contains(text(),"License Information")]';
const numberOfUsersTextbox = './/input[@placeholder="Number of Users"]';
const baseDropdown = './/span[contains(text(),"Base")]';
const connectivityDropdown = './/span[contains(text(),"Connectivity")]';
const assignDateInput = './/input[@placeholder="Assign Date"]';
const expiryDateInput = './/input[@placeholder="Expiry Date"]';
const lengthOfLicenseDropdown = './/span[contains(text(),"Length of License")]';
const commentTextbox = './/input[@placeholder="Comment"]';
const cancelButton = './/button/span[contains(text(), "Cancel")]';
const createAccountAddAccountButton = './/footer//button/span[contains(text(), "Add Account")]';
const gearIcon = '//unext-nav-bar-setting//mat-icon';
const accountManagementMenu = '//div[@role="menu"]//div/button/span[contains(text(),"Account Management")]';
const searchAccount = 'locations-field';
const shipTo = 'shipTo';
const soldTo = 'soldTo';
const labName = 'labName';
const countryCreateAccount = 'country';
const addressCreateAccount = 'streetAddress1';
const address2CreateAccount = 'streetAddress2';
const address3CreateAccount = 'streetAddress3';
const cityCreateAccount = 'city';
const zipCreateAccount = 'zipCode';
const stateCreateAccount = 'state';
const labContactFirstName = 'labContactFirst';
const labContactLastName = 'labContactLast';
const labContactEmail = 'labContactEmail';
const numberOfUsers = 'licenseNumberUsers';
const connectivity = 'licenseConnectivityOption';
const expiryDate = 'licenseExpireDate';
const comment = 'comment';
const closeButton = './/button[contains(@class, "mat-focus-indicator icon-button")]';
const labIdentificationColumnHeader = '(.//mat-header-row/mat-header-cell//span)[1]';
const labContactColumnHeader = '(.//mat-header-row/mat-header-cell//span)[2]';
const addressColumnHeader = '(.//mat-header-row/mat-header-cell//span)[3]';
const licenseStatusColumnHeader = '(.//mat-header-row/mat-header-cell//span)[4]';
const requiredText = './/footer//span[@class = "required"]';
const licenseDropDown = '//div[contains(@class,"mat-select")]//span[contains(text(),"Length of License")]';
const dropdownoptions = '//mat-option';
const onemonth = '//span[contains(text(),"72 Months")]';
const twomonth = '//span[contains(text(),"1 Month")]';
const scrollbar = '//div[@class="ps__thumb-y"]';
const unityNext = './/button/span[text() = "Unity Next"]';
const shipToTbx = './/input[@id = "shipTo"]';
const soldToTbx = './/input[@id = "soldTo"]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';
const TransformerFields = 'transformers';
const tranformersdropdown = '//div[contains(@class,"transformers")]//mat-option';
const pageHeaderALM = './/h4[text()="Account & Location Management"]';
const AccountsTabSelected = './/div[text()="ACCOUNTS"]/parent::div[@role="tab"][@aria-selected="true"]';
const LocationsTabNotSelected = './/div[text()="LOCATIONS"]/parent::div[@role="tab"][@aria-selected="false"]';
const newAddAnAccountButton = './/button/span/mat-icon[@role="img"]/following-sibling::span[text()=" Add An Account"]';
const dropdownCategory = './/mat-select[@role="listbox"]/following-sibling::span/label/mat-label[text()="Category"]';
const textboxKeyword = './/input[@name="searchInput"]/following-sibling::span/label/span[text()="Keyword"]';
const buttonSearch = './/button[@type="submit"]/span[text()="Search"]';
const columnAccountName = './/mat-header-cell//span[text()="Account Name"]';
const columnAccountNumber = './/mat-header-cell//span[text()="Account Number"]';
const columnAddress = './/mat-header-cell//span[text()="Address"]';
const columnLocations = './/mat-header-cell//span[text()="Location(S)"]';
const systemGeneratedAccountNo = "//*[contains(text(),'Account number')]/following::div[1]";
const exitPopup = "//*[@id='spec_warningBox']";
const exitWithoutSavingButton = "//*[contains(text(),'EXIT WITHOUT SAVING')]";
const saveAndExitBtn = "//*[contains(text(),'SAVE AND EXIT')]";
const accountName = '//*[@id="accountName"]';
const address = '//input[@id="address"]';
const address2 = '//input[@id="address2"]';
const address3 = '//input[@id="address3"]';
const countryEle = './/mat-select[@id="country"]';
const city = './/input[@id="city"]';
const zip = './/input[@id="zipCode"]';
const firstName = './/input[@id="firstName"]';
const lastName = './/input[@id="lastName"]';
const email = './/*[@id="email"]';
const state = './/input[@id="state"]';
const LabCountryTextbox = '//span[contains(text(),"Country")]';
const LabStateTextbox = '//input[@name="labLocationState"]';
const LabCityTextbox = '//input[@name="labLocationCity"]';
const LabZipCodeTextbox = '//input[@name="locationZipCode"]';
const LabContactEmailTextbox = '//input[@name="labContactEmail"]';
const LabContactFirstTextbox = '//input[@name="labContactFirst"]';
const LabContactLastTextbox = '//input[@name="labContactLast"]';
const cancelButton2 = '(//*[contains(text(), "Cancel")]//parent::button)[2]';
const addAccountSubmitButton = './/button/span[contains(text(), " Add Account ")]';
const searchIcon = '//mat-icon[contains(@class,"search")]';
const updateformClose = './/mat-icon[contains(text(), "close")]'
const editLabUpdateAccountBtnEleNew = './/*[contains(text(), "Update Account")]/parent::button';
const ACCOUNT_Tab = './/div[contains(text(),"ACCOUNTS")]';
const ACCOUNT_Tab_LOCATIONS_Btn = './/div[@class="table-container-shadow"]//mat-row[1]//mat-cell[5]//span[contains(text(), "Locations")]';
const AddLocationButton = '//button//span[contains(text(), " Add A Location")]';
const LicenseInformationLabel = '//div[contains(text()," License Information ")]';
const LocationInformationLabel = '//div[contains(text()," Location information ")]';
const OrderNumberTextbox = '//*[@name="orderNumber"]';
const UnityNextTierDropdown = '//span[contains(text(),"Unity Next tier")]';
const UnityNextTierDropdown_Select = './/mat-select[@id="unityNextTier"]';
const ConnectivityTierDropdown = '//span[contains(text(),"Connectivity tier")]';
const ConnectivityTierDropdown_Select = './/mat-select[@id="connectivityTier"]';
const TranformersDropDown = '//mat-label[contains(text(),"Transformers list")]';
const QCLotViewerDropdown = '//span[contains(text(),"QC Lot Viewer")]';
const QCLotViewerDropdown_Select = './/mat-select[@id="qcLotViewer"]';
const Add_OnsDropdown = '//mat-select[@id="AddOns"]';
const CrossOverStudyDropDown = '//span[contains(text(),"Crossover study")]';
const CrossOverStudyDropDown_Select = './/mat-select[@id="crossoverStudy"]';
const AssignDate_picker = '//input[@name="licenseAssignDate"]';
const ExpiryDate_picker = '//span[contains(text(),"Expiry Date")]';
const LicenseLengthDropDown = '//span[contains(text(),"License length(optional)")]';
const LicenseLengthDropDown_Select = './/mat-select[@id="licenseLength"]';
const NumberOfUsersTextbox = '//input[@name="licenseNumberUsers"]';
const shipToAccountTbx = '//input[@name="shipTo"]';
const soldToAccountTbx = '//input[@name="soldTo"]';
const LabNameTextbox = '//input[@name="labLocationName"]';
const LegacyprimaryLabNumberTextbox = '//input[@name="primaryUnityLabNumbers"]';
const AddressLine1Textbox = '//input[@name="labLocationAddress"]';
const AddressLine2Textbox = '//input[@name="labLocationAddressSecondary"]';
const AddLocationForm_CloseButton = './/mat-icon[contains(@class, "mat-icon notranslate material-icons mat-icon-no-color")]';
const UN_InstalledProductField = '//input[@name="utInstalledProduct"]';
const C_InstalledProductField = '//input[@name="ctInstalledProduct"]';
const QC_InstalledProductField = '//input[@name="qcInstalledProduct"]';
const ADDLocationFormButton = './/span[contains(text(), "Add Location")]';
const firstLocationLink = './/div[@class="location-list-parent"]/div[1]/span';
const updateLocationButton = './/span[contains(text(),"Update Location")]/parent::button';
const labCountryDropdown = './/mat-select[@id="labLocationCountryId"]';
const updateLocationCancelButton = './/button/span[text()=" Cancel "]/following-sibling::div[1]';
const closeUpdateLocationPopup = './/mat-icon[text()="close"]';
const locationsTabFirstLabName = './/mat-row[1]//span[contains(@class,"lab-name")]';
const locationsTab = './/div[@role="tab"]/div[text()="LOCATIONS"]';
const addGroupLink = '//*[text()="Add A Group"]';
const groupNameInput = '//*[@formcontrolname="groupName"]';
const cancelBtn = '//*[text()="CANCEL"]';
const addGroupBtn = '//*[text()="ADD GROUP"]//parent::button[1]';
const closeAddGroupForm = '//*[text()="close"]';
const errorMsg1 = '//*[contains(@class,"add-group-items")]//following::mat-error[1]';
const errorMsg2 = '//*[contains(@class,"add-group-items")]//following::mat-error[1]';
const groupNames = './/div[contains(text(), "Group name")]/following::div[1]';
const groupDropdown = '(.//mat-select[contains(@id,"mat-select-")])[2]';
const locationsCount = '(.//mat-row[@id = "spec-row"]/mat-cell[4])';
const deleteLocIcont = '(.//mat-row[@id = "spec-row"]/mat-cell[5])';
const confirmDeletebtn = '//*[contains(text(),"CONFIRM DELETE")]';
const deleteLocCancelbtn = '//*[contains(text(), "CANCEL")]//parent::button';
const deleteLocCloseBtn = './/mat-icon[contains(@class, "mat-icon notranslate close mat-icon-no-color")]';
const accountName2 = '(.//mat-row[@id = "spec-row"]/mat-cell[1])';
const LocationsBtn = '(.//span[contains(text(), "Locations")])[1]'
const LocationsNotPresentBtn = '(.//span[contains(text(), "Locations")])[4]'
const groupDropdownOptions = '(.//mat-option[contains(@id,"mat-option-")]/span)'
const groupLocations = './/div[@class="location-parent"]/div/span';
const noLocMsg = './/div[contains(text(), "No locations found")]';
const noGrpMsg = './/div[contains(text(), "No groups found")]/parent::div/parent::div';
const paginationbtns = './/*[@id="paginationGroups"]/div/div/button';
const accountManagementOpt = ".//button//span[text()='Account Management']";
const accountsTableRows = ".//mat-table/mat-row";
const locationsBtn = '/mat-cell/button/span[contains(text(),"Locations")]';
const locationButtonXpath = './/mat-table/mat-row[1]/mat-cell/button/span[contains(text(),"Locations")]';
const accountInfoPageHead = "//div[@class='account-info inner-item']/div[@class='form-heading-1']";
const accountNumber = "//div[.='Account number']";
const groupName = "//div[@class='group-info inner-item']//div[1]/div[@class='item-label']";
const noGroupMessage = "//div[@class='single-item spec_groups_none_found ng-star-inserted']";
const zeroGroupLocation = './/mat-table/mat-row[4]/mat-cell/button/span[contains(text(),"Locations")]';
const paginationControls = './/div[@class="custom-pagination"]';
const previousButton = './/div[@class="custom-pagination"]//button[contains(@class, "spec-prev")]';
const nextButton = './/div[@class="custom-pagination"]//button[contains(@class, "spec-next")]';
const secondNumberButton = './/div[@class="custom-pagination"]//button//span[contains(text(), "2")]';
const account_row='//mat-row[1]//mat-cell[1]//div';
const accountNumber1='.//div[@class="table-container-shadow"]//mat-row[1]//mat-cell[1]//div';
const locationNameAccInfo1='//div[@class="ps-content"]//div[1]/span[@class="location-single-item"]';
const ErrorDialogBox='.//div/mat-dialog-container[@role="dialog"]';
const ErrorDialog_OKBtn='.//button/span[text()="OK"]';
const locationNameAccInfo='//div[@class="ps-content"]//div[5]/span[@class="location-single-item"]';
const ErrorDialog_CP_Msg='.//mat-dialog-content/div/p';
const editGroupLink = '//*[@class="edit-group"]';
const changeGroupNameBtn = '//*[text()="CHANGE GROUP NAME "]//parent::button[1]';


var random_number, random_state, accountDeleted;
const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/AccountManager.json', (err, data) => {
  if (err) { throw err; }
  const accountManagerData = JSON.parse(data);
  jsonData = accountManagerData;
});

let jsonData1;
fs.readFile('./JSON_data/ActionableDashboard.json', (err, data) => {
  if (err) { throw err; }
  const actionableDashboard = JSON.parse(data);
  jsonData1 = actionableDashboard;
});

export class AccoutManager {
  static labName: String;
  static firstName: string;
  static address1: String;
  static ts: String;
  static accountNameDeleted: String;

  accountManagPage() {
    return new Promise((resolve) => {
      let found = false;
      browser.driver.findElement(by.id(accountManagementTitle)).click().then(function () {
        browser.sleep(5000);
        browser.driver.findElement(by.className(accountManagementCls)).then(function (account) {
          account.findElement(by.className(pageTitle)).getText().then(function (title) {
            if (title === jsonData.CheckTitle) {
              found = true;
            }
          });
        }).then(function () {
          resolve(found);
        });
      });
    });
  }

  findAccount() {
    return new Promise((resolve) => {
      let found = false;
      browser.driver.findElement(by.className(tblBody)).then(function () {
        element.all(by.tagName('tr')).count().then(function (count) {
          browser.sleep(5000);
          if (count >= 1) {
            found = true;
          }
        });
      }).then(function () {
        resolve(found);
      });
    });
  }

  addAccount(firstname, lastName, email) {
    return new Promise((resolve) => {
      browser.driver.findElement(by.className(btnWrappper)).click().then(function () {
        browser.sleep(5000);
        browser.driver.findElement(by.id(labname)).sendKeys(jsonData.LabLocation);
        browser.driver.findElement(by.id(country)).click().then(function () {
          browser.sleep(2000);
          let optionCount;
          browser.driver.findElement(by.className(overlayPane)).then(function () {
            element.all(by.tagName(option)).count().then(function (opt) {
              optionCount = opt;
            });
            element.all(by.tagName(option)).then(function (opt) {
              let countryFound = true;
              for (let i = 0; i <= optionCount; i++) {
                if (opt[i]) {
                  opt[i].getText().then(function (optionText) {
                    if (optionText === 'Zimbabwe') {
                      opt[i].click().then(function () {
                        countryFound = false;
                      });
                    }
                  });
                }
                if (countryFound !== true) {
                  break;
                }
              }
            });
          });
        });
        browser.driver.findElement(by.id(fname)).sendKeys(firstname);
        browser.driver.findElement(by.id(lname)).sendKeys(lastName);
        browser.driver.findElement(by.id(emailText)).sendKeys(email);
        browser.driver.findElement(by.id(noUser)).sendKeys(jsonData.LicenseNumberUsers);
        browser.driver.findElement(by.id(conectivityOption)).click().then(function () {
          browser.sleep(2000);
          let connectivityCount;
          element.all(by.tagName(option)).count().then(function (opt) {
            connectivityCount = opt;
          });
          element.all(by.tagName(option)).then(function (opt) {
            let i = 0;
            const countryFound = true;
            do {
              if (opt[i]) {
                opt[i].getText().then(function (optionText) {

                });
              }
              i++;
            } while (countryFound);
          });
        });
        browser.driver.findElement(by.id(lincenceLength)).click().then(function () {
          browser.sleep(2000);
          let connectivityCount;
          element.all(by.tagName(option)).count().then(function (opt) {
            connectivityCount = opt;
          });

          element.all(by.tagName(option)).then(function (opt) {
            let i = 0;
            const countryFound = true;
            do {
              if (opt[i]) {
                opt[i].getText().then(function () {
                });
              }
              i++;
            } while (countryFound);
          });
        });
      });
    });
  }

  goToAccountManagement() {
    let status = false;
    return new Promise((resolve) => {
      console.log('IngoToAccountManagement ');
      const accountManagementCard = element(by.xpath(accountManagementCardEle));
      library.scrollToElement(accountManagementCard);
      library.click(accountManagementCard);
      status = true;
      resolve(status);
    });

  }

  clickOnSearchedAccountName(Group1) {

    return new Promise((resolve) => {
      findElement(locatorType.XPATH,account_row).click();
      const labId = findElement(locatorType.XPATH,accountNumber1);

      if (labId.isDisplayed()) {
        library.clickJS(labId);


        resolve(true);
      } else {
        library.logFailStep('Created account not displayed');
        resolve(false);
      }
    })
  }

  clickOnLocationName(){

    return new Promise((resolve) => {

      const labId = findElement(locatorType.XPATH,locationNameAccInfo1);

      if (labId.isDisplayed()) {
        library.clickJS(labId);


        resolve(true);
      } else {
        library.logFailStep('location name not displayed');
        resolve(false);
      }
    })
  }


  searchLabAccount() {
    let found = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const searchInputBox = element(by.xpath(searchInputEle));
      searchInputBox.sendKeys(jsonData1.AmrutaFirstName).then(function () {
        console.log('Account Searched: ' + jsonData1.AmrutaFirstName);
        const searchBtn = element(by.xpath(searchBtnAccountManagement));
        library.click(searchBtn);
        const labEmailele = element(by.xpath(accountManagerLabEmailId));
        labEmailele.getText().then(function (emailId) {
          if (emailId.includes(jsonData1.AmrutaUsername)) {
            console.log('User found');
            found = true;
            resolve(found);
          } else {
            found = false;
            resolve(found);
          }
        });
      });
    });
  }

  goToEditLabAccount() {
    let status = false;
    return new Promise((resolve) => {
      const labAccountNameEle = element(by.xpath(accountMgrLabNameLinkEle));
      library.click(labAccountNameEle);

      status = true;
      resolve(status);
    });
  }

  changeLicenseDate() {
    let changed = false;
    return new Promise((resolve) => {
      const date = new Date();
      const mm = date.getMonth() + 1;
      let mm1 = 0;
      if (mm > 11) {
        mm1 = 0;
      } else {
        mm1 = mm + 1;
      }
      const yyyy = date.getFullYear();
      const dd = date.getDate();
      const newDate = mm1 + '/' + dd + '/' + yyyy;

      const expDateField = element(by.xpath(expiryDateEle));
      expDateField.sendKeys(protractor.Key.CONTROL, 'a');
      expDateField.sendKeys(protractor.Key.DELETE).then(function () {
        expDateField.sendKeys(newDate);
      });
      const updateBtn = element(by.xpath(editLabUpdateAccountBtnEle));
      updateBtn.click().then(function () {
        const errorWeekend = element(by.xpath(editLabWeekendError));
        errorWeekend.isDisplayed().then(function () {
          const expiryDateCalendar = element(by.xpath(editLabExpiryDateCalendarIcn));
          expiryDateCalendar.click().then(function () {
            const dateSelectedEle = element(by.xpath(editLabSelectedExpiryDateEle));
            dateSelectedEle.getText().then(function (selectedDate) {
              const newDate1 = (parseInt(selectedDate, 10) + 2);
              console.log('New Date is: ' + newDate);
              if (newDate1 >= 30) {
                console.log('In If');
                expiryDateCalendar.click().then(function () {
                  console.log('Next month');
                  const nextMonthBtn = element(by.xpath(editLabCalendarNextMonthBtn));
                  nextMonthBtn.click().then(function () {
                    const dateTobeSelected = element(by.xpath('(.// div[contains(@class, "mat-calendar-body")])[1]'));
                    dateTobeSelected.click().then(function () {
                      dashBoard.waitForElement();
                      updateBtn.click().then(function () {

                        const closeBtn = element(by.xpath(labEditCloseBtn));
                        library.click(closeBtn);
                        changed = true;
                        resolve(changed);
                      });
                    });
                  });
                });
              } else {
                console.log('In else');
                library.clickJS(expiryDateCalendar);
                const dateTobeSelected = element(by.xpath('(.// div[contains(@class, "mat-calendar-body")])[" + newDate + "]'));
                dateTobeSelected.click().then(function () {
                  console.log('date clicked');
                  dashBoard.waitForElement();
                  updateBtn.click().then(function () {
                    dashBoard.waitForPage();
                    const closeBtn = element(by.xpath(labEditCloseBtn));
                    dashBoard.waitForElement();
                    console.log('Btn Closed');
                    library.click(closeBtn);
                    changed = true;
                    resolve(changed);
                  });
                });
              }
            });
          });
        })
          .catch(function () {
            console.log('In catch');
            dashBoard.waitForPage();
            const closeBtn = element(by.xpath(labEditCloseBtn));
            library.click(closeBtn);
            changed = true;
            resolve(changed);
          });
      });
    });
  }

  verifyAccountManagementDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const pageHeader = findElement(locatorType.XPATH, accountManagementHeader);
      pageHeader.isDisplayed().then(function () {
        library.logStepWithScreenshot('Account Management Page Displayed', 'AMDisplayed');
        status = true;
        resolve(status);
      });
    });
  }

  clickAddAccountButton() {
    let status = false;
    return new Promise((resolve) => {
      const addAccountBtn = findElement(locatorType.XPATH, addAccountButton);
      addAccountBtn.isDisplayed().then(function () {
        library.clickJS(addAccountBtn);
        library.logStepWithScreenshot('Add Account Button Clicked', 'AddAccountClicked');
        status = true;
        resolve(status);
      });
    });
  }

  verifyCreateAccountPageHeader() {
    let status = false;
    return new Promise((resolve) => {
      const pageHeader = findElement(locatorType.XPATH, createAccountHeader);
      pageHeader.isDisplayed().then(function () {
        library.logStepWithScreenshot('Create Account Page Header displayed.', 'CreateAccountPageHeader');
        status = true;
        resolve(status);
      });
    });
  }

  verifyCustomerSectionUI() {
    let status, label, shipto, soldto, order, primary = false;
    return new Promise((resolve) => {
      const customerLbl = element(by.xpath(customerLabel));
      customerLbl.isDisplayed().then(function () {
        label = true;
        library.logStepWithScreenshot('Customer Label is displayed', 'CustomerLabel');
        console.log('Customer Label ' + label);
      });
      const shipToNumBox = element(by.xpath(shipToTbx));
      shipToNumBox.isDisplayed().then(function () {
        shipto = true;
        library.logStepWithScreenshot('Ship to Number Textbox displayed', 'ShipToTextBox');
        console.log('Ship to Number Textbox ' + shipto);
      });
      const soldToNumBox = element(by.xpath(soldToTbx));
      soldToNumBox.isDisplayed().then(function () {
        soldto = true;
        library.logStepWithScreenshot('Sold to Number Textbox displayed', 'SoldToTextBox');
        console.log('Sold to Number Textbox ' + soldto);
      });
      const orderNumberTxtbx = element(by.xpath(orderNumberTextbox));
      orderNumberTxtbx.isDisplayed().then(function () {
        order = true;
        library.logStepWithScreenshot('Order Number Textbox displayed', 'OrderNumberTextBox');
        console.log('Order Number Textbox ' + order);
      });
      const primaryLabNumberTxtbx = element(by.xpath(primaryLabNumberTextbox));
      primaryLabNumberTxtbx.isDisplayed().then(function () {
        primary = true;
        library.logStepWithScreenshot('Primary Lab Number Textbox displayed', 'PLNTextbox');
        console.log('Primary Lab Number Textbox ' + primary);
      });
      if (label === true && shipto === true && soldto === true && order === true && primary === true) {
        status = true;
        resolve(status);
      }
    });
  }

  addAccount_existingAccountNameEmailMigrationNumber(jsonData) {
    return new Promise((resolve) => {

        element(by.xpath(accountName)).sendKeys(jsonData.AccountName + "-" + Math.floor(Math.random() * (100 + 1)));
        element(by.xpath(address)).sendKeys(jsonData.AddressCreateAccount);
        const count = element(by.xpath(countryEle));
        count.isDisplayed().then(function () {
        library.scrollToElement(count);
        library.clickJS(count);
        const op1 = element(by.xpath("//span[contains(text(),'"+jsonData.county+"')]"));
        library.clickJS(op1);
        console.log("Country selected");
        library.logStep("Country selected");
      });

        element(by.xpath(state)).sendKeys(jsonData.StateCreateAccount);
        element(by.xpath(city)).sendKeys(jsonData.CityCreateAccount);
        element(by.xpath(zip)).sendKeys(jsonData.ZipCreateAccount);
        element(by.xpath(firstName)).sendKeys(jsonData.firstName);
        element(by.xpath(lastName)).sendKeys(jsonData.lastName);
        element(by.xpath(email)).sendKeys(jsonData.Existing_email);

      this.clickAddAccountSubmitButton();
      this.verifyErrorDialog_ContactPerson();

      resolve(true);
    });
  }


  verifyErrorDialog_ContactPerson(){
    return new Promise((resolve) => {
      const ErrorDialog = findElement(locatorType.XPATH, ErrorDialogBox);
      ErrorDialog.isDisplayed().then(function () {
        library.logStep('Error Dialog Pop up displayed');
        console.log('Error Dialog Pop up displayed');
        const msg=findElement(locatorType.XPATH,ErrorDialog_CP_Msg);
        msg.isDisplayed().then(function(){

          library.logStep("Error Dialog displayed as account email already exists");
          console.log("Error Dialog displayed as account email already exists");
        })
        const ErrorDialog_OkBtn = element(by.xpath(ErrorDialog_OKBtn));
        ErrorDialog_OkBtn.isDisplayed().then(function () {
          library.logStep('Ok Btn displayed');
          console.log('Ok Btn displayed');
          library.clickJS(ErrorDialog_OkBtn);
          console.log("OK Btn clicked");
          resolve(true);
        });
      });
    });
  }


  verifyLabInformationSectionUI() {
    let status, label, labName1, country1, address, addressSecond, addressThird, city, postalCode, state = false;
    return new Promise((resolve) => {
      const labInformationLbl = element(by.xpath(labInformationLabel));
      labInformationLbl.isDisplayed().then(function () {
        label = true;
        library.logStepWithScreenshot('Lab Information Label is displayed', 'LabInformationLabel');
        console.log('Lab Information Label ' + label);
      });
      const labNameTxtbx = element(by.xpath(labNameTextbox));
      labNameTxtbx.isDisplayed().then(function () {
        labName1 = true;
        library.logStepWithScreenshot('Lab Name Textbox displayed', 'LabNameTextbox');
        console.log('Lab Name Textbox ' + labName1);
      });
      const countryDrpdwn = element(by.xpath(countryDropdown));
      countryDrpdwn.isDisplayed().then(function () {
        country1 = true;
        library.logStepWithScreenshot('Country Dropdown is displayed', 'CountryDropDown');
        console.log('Country Dropdown ' + country1);
      });
      const addressTxtbx = element(by.xpath(addressTextbox));
      addressTxtbx.isDisplayed().then(function () {
        address = true;
        library.logStepWithScreenshot('Address Textbox is displayed', 'AddressTextbox');
        console.log('Address Textbox ' + address);
      });
      const addressSecondLineTxtbx = element(by.xpath(addressSecondLineTextbox));
      addressSecondLineTxtbx.isDisplayed().then(function () {
        addressSecond = true;
        library.logStepWithScreenshot('Address Second line Textbox is displayed', 'SecondLineTextbox');
        console.log('Address Second line Textbox ' + addressSecond);
      });
      const addressThirdLineTxtbx = element(by.xpath(addressThirdLineTextbox));
      addressThirdLineTxtbx.isDisplayed().then(function () {
        addressThird = true;
        library.logStepWithScreenshot('Address Third line Textbox is displayed', 'ThirdLineTextbox');
        console.log('Address Third line Textbox ' + addressThird);
      });
      const cityTxtbx = element(by.xpath(cityTextbox));
      cityTxtbx.isDisplayed().then(function () {
        city = true;
        library.logStepWithScreenshot('City Textbox is displayed', 'CityTextbox');
        console.log('City Textbox ' + city);
      });
      const postalCodeTxtbx = element(by.xpath(postalCodeTextbox));
      postalCodeTxtbx.isDisplayed().then(function () {
        postalCode = true;
        library.logStepWithScreenshot('Postal Code Textbox is displayed', 'PostalCodeTextbox');
        console.log('Postal Code Textbox ' + postalCode);
      });
      const stateTxtbx = element(by.xpath(stateTextbox));
      stateTxtbx.isDisplayed().then(function () {
        state = true;
        library.logStepWithScreenshot('State Textbox is displayed', 'StateTextbox');
        console.log('State Textbox ' + state);
      });
      if (label === true && labName1 === true && country1 === true &&
        address === true && addressSecond === true && addressThird === true &&
        city === true && postalCode === true && state === true) {
        status = true;
        resolve(status);
      }
    });
  }

  verifyLabContactSectionUI() {
    let status, label, fname1, lname1, email = false;
    return new Promise((resolve) => {
      const labContactLbl = element(by.xpath(labContactLabel));
      labContactLbl.isDisplayed().then(function () {
        label = true;
        library.logStepWithScreenshot('Lab Contact Label is displayed', 'LabContactLabel');
        console.log('Lab Contact Label ' + label);
      });
      const firstNameTxtbx = element(by.xpath(firstNameTextbox));
      firstNameTxtbx.isDisplayed().then(function () {
        fname1 = true;
        library.logStepWithScreenshot('First Name Textbox is displayed', 'FirstNameTextbox');
        console.log('First Name Textbox ' + fname1);
      });
      const lastNameTxtbx = element(by.xpath(lastNameTextbox));
      lastNameTxtbx.isDisplayed().then(function () {
        lname1 = true;
        library.logStepWithScreenshot('Last Name Textbox is displayed', 'LastNameTextbox');
        console.log('Last Name Textbox ' + lname1);
      });
      const emailTxtbx = element(by.xpath(emailTextbox));
      emailTxtbx.isDisplayed().then(function () {
        email = true;
        library.logStepWithScreenshot('Email Textbox is displayed', 'emailTextbox');
        console.log('Email Textbox ' + email);
      });
      if (label === true && fname1 === true && lname1 === true && email === true) {
        status = true;
        resolve(status);
      }
    });
  }

  verifyLicenseInformationSectionUI() {
    let status, label, numberofusers, base, connectivity1, startDate, expiry, length, comment1 = false;
    return new Promise((resolve) => {
      const licenseInformationLbl = element(by.xpath(licenseInformationLabel));
      licenseInformationLbl.isDisplayed().then(function () {
        label = true;
        library.logStepWithScreenshot('License Information Label is displayed', 'LicenseInfoLabel');
        console.log('License Information Label ' + label);
      });
      const numberOfUsersTxtbx = element(by.xpath(numberOfUsersTextbox));
      numberOfUsersTxtbx.isDisplayed().then(function () {
        numberofusers = true;
        library.logStepWithScreenshot('Number of Users Textbox is displayed', 'NumberOfUsersTextbox');
        console.log('Number of Users Textbox ' + numberofusers);
      });
      const baseDrpdwn = element(by.xpath(baseDropdown));
      baseDrpdwn.isDisplayed().then(function () {
        base = true;
        library.logStepWithScreenshot('Base Dropdown is displayed', 'BaseDD');
        console.log('Base Dropdown ' + base);
      });
      const connectivityDrpdwn = element(by.xpath(connectivityDropdown));
      connectivityDrpdwn.isDisplayed().then(function () {
        connectivity1 = true;
        library.logStepWithScreenshot('Connectivity Dropdown is displayed', 'ConnectivityDD');
        console.log('Connectivity Dropdown ' + connectivity1);
      });
      const assignDate = element(by.xpath(assignDateInput));
      assignDate.isDisplayed().then(function () {
        startDate = true;
        library.logStepWithScreenshot('Assign Date Input is displayed', 'AssignDateInput');
        console.log('Assign Date ' + startDate);
      });
      const expiryDate1 = element(by.xpath(expiryDateInput));
      expiryDate1.isDisplayed().then(function () {
        expiry = true;
        library.logStepWithScreenshot('Expiry Date Input is displayed', 'expiryDateInput');
        console.log('Expiry Date ' + expiry);
      });
      const lengthOfLicenseDrpdwn = element(by.xpath(lengthOfLicenseDropdown));
      lengthOfLicenseDrpdwn.isDisplayed().then(function () {
        length = true;
        library.logStepWithScreenshot('Length of license dropdown is displayed', 'LengthOfLicenseDD');
        console.log('Length of license dropdown ' + length);
      });
      const commentTxtbx = element(by.xpath(commentTextbox));
      commentTxtbx.isDisplayed().then(function () {
        comment1 = true;
        library.logStepWithScreenshot('Comment Textbox is displayed', 'CommentTextbox');
        console.log('Comment Textbox ' + comment1);
      });
      if (label === true && numberofusers === true && base === true &&
        connectivity1 === true && startDate === true && expiry === true &&
        length === true && comment1 === true) {
        status = true;
        resolve(status);
      }
    });
  }

  verifyCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancelButton));
      cancelBtn.isDisplayed().then(function () {
        status = true;
        library.logStep('Cancel Button is displayed');
        resolve(status);
      });
    });
  }

  verifyCreateAccountAddAccountButton() {
    let status = false;
    return new Promise((resolve) => {
      const createAccountAddAccountBtn = element(by.xpath(createAccountAddAccountButton));
      createAccountAddAccountBtn.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Add Account Button is displayed', 'AddAccountButton');
        resolve(status);
      });
    });
  }

  clickCreateAccountAddAccountButton() {
    let status = false;
    return new Promise((resolve) => {
      const createAccountAddAccountBtn = findElement(locatorType.XPATH, createAccountAddAccountButton);
      createAccountAddAccountBtn.isDisplayed().then(function () {
        library.clickJS(createAccountAddAccountBtn);
        const loader = element(by.xpath(loaderPleaseWait));
        browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
        library.logStepWithScreenshot('Add Account Button clicked', 'CreateAccountAddAccountButtonClicked');
        status = true;
        resolve(status);
      });
    });
  }

  verifyCreateAccountErrorMsg() {
    let status = false;
    let count = 0;
    return new Promise((resolve) => {
      const errorMsg = new Map<string, string>();
      errorMsg.set(shipTo, 'Please enter a ship-to account number.');
      errorMsg.set(soldTo, 'Please enter a sold-to account number.');
      errorMsg.set(labName, 'Please enter a lab name.');
      errorMsg.set(countryCreateAccount, 'Please choose a country.');
      errorMsg.set(addressCreateAccount, 'Please enter an address.');
      errorMsg.set(labContactFirstName, 'Please enter a first name.');
      errorMsg.set(labContactLastName, 'Please enter a last name.');
      errorMsg.set(labContactEmail, 'Please enter an email address.');
      errorMsg.set(numberOfUsers, 'Please enter the number of users.');
      errorMsg.set(connectivity, 'Please choose a connectivity option.');
      errorMsg.set(expiryDate, 'Please choose a date that is a weekday.');
      const pageHeader = element(by.xpath(accountManagementHeader));
      pageHeader.isDisplayed().then(function () {
        errorMsg.forEach(function (key, value) {
          const ele = element(by.id(value));
          browser.executeScript('arguments[0].scrollIntoView();', ele);
          ele.isDisplayed().then(function () {
            if (value === 'country') {
              ele.sendKeys(protractor.Key.TAB);
            } else if (value === 'licenseConnectivityOption') {
              ele.sendKeys(protractor.Key.TAB);
            } else if (value === 'licenseLength') {
              ele.sendKeys(protractor.Key.TAB);
            } else {
              ele.click();
              ele.sendKeys(protractor.Key.TAB);
            }
          }).then(function () {
            dashBoard.waitForScroll();
            const err = element(by.xpath('// mat-error[contains(text(),"' + key + '")]'));
            browser.executeScript('arguments[0].scrollIntoView();', err);
            err.isDisplayed().then(function () {
              count++;
              library.logStep(key + ' is displayed.');
            }).catch(function () {
              library.logFailStep(key + ' is not displayed.');
            });
          });
        });
      }).then(function () {
        if (count === errorMsg.size) {
          status = true;
          library.attachScreenshot('ErrorMsgVerified');
          resolve(status);
        } else {
          status = false;
          library.logFailStep('Could not verify all errors');
          resolve(status);
        }
      });
    });
  }

  verifyErrorMsgs() {
    let status = false;
    return new Promise((resolve) => {
      const errorMsg = new Map<string, string>();
      errorMsg.set(shipTo, 'Please enter a ship-to account number.');
      errorMsg.set(soldTo, 'Please enter a sold-to account number.');
      errorMsg.set(labName, 'Please enter a lab name.');
      errorMsg.set(countryCreateAccount, 'Please choose a country.');
      errorMsg.set(addressCreateAccount, 'Please enter an address.');
      errorMsg.set(labContactFirstName, ' Please enter a first name.');
      errorMsg.set(labContactLastName, 'Please enter a last name.');
      errorMsg.set(labContactEmail, 'Please enter an email address.');
      errorMsg.set(numberOfUsers, 'Please enter the number of users.');
      errorMsg.set(connectivity, 'Please choose a connectivity option.');
      errorMsg.set(expiryDate, 'Please choose a date that is a weekday.');
      errorMsg.forEach(function (key, value) {
        const err = element(by.xpath('// mat-error[contains(text(),"' + key + '")]'));
        if (err.isDisplayed()) {
          status = true;
          library.logStep(key + ' is displayed.');
        } else {
          status = false;
          library.logFailStep(key + ' is not displayed.');
        }
      });
      library.attachScreenshot('ErrorMsgVerified');
      resolve(status);
    });
  }

  verifyAssignDateValue() {
    let status = false;
    let dateValue = null;
    return new Promise((resolve) => {
      const assignDate = element(by.xpath(assignDateInput));
      assignDate.isDisplayed().then(function () {
        assignDate.getAttribute('value').then(function (text) {
          dateValue = text;
          console.log(dateValue);
        });
      }).then(function () {
        const today = new Date();
        let date;
        const dd = String(today.getDate());
        const mm = String(today.getMonth() + 1);
        const yyyy = today.getFullYear();
        date = mm + '/' + dd + '/' + yyyy;
        if (dateValue === date) {
          library.logStepWithScreenshot('Assign Date value verified', 'AssignDateVerified');
          status = true;
          resolve(status);
        }
      });
    });
  }

  clickCloseButton() {
    let status = false;
    const dateValue = null;
    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(closeButton));
      closeBtn.isDisplayed().then(function () {
        library.clickJS(closeBtn);
        library.logStep('Close Clicked');
        status = true;
        resolve(status);
      });
    });
  }

  verifyAccountManagementPageColumnHeader() {
    let status, labid, labcont, labAdd, labLicen = false;
    return new Promise((resolve) => {
      const labId = element(by.xpath(labIdentificationColumnHeader));
      const labcontact = element(by.xpath(labContactColumnHeader));
      const addressCol = element(by.xpath(addressColumnHeader));
      const licenseStat = element(by.xpath(licenseStatusColumnHeader));
      labId.getText().then(function (colName) {
        if (colName === 'Lab Identification') {
          labid = true;
        }
      });
      labcontact.getText().then(function (colName) {
        if (colName === 'Lab Contact') {
          labcont = true;
        }
      });
      addressCol.getText().then(function (colName) {
        if (colName === 'Address') {
          labAdd = true;
        }
      });
      licenseStat.getText().then(function (colName) {
        if (colName === 'License Status') {
          labLicen = true;
        }
      });
      if (labid === true && labcont === true && labAdd === true && labLicen === true) {
        status = true;
        resolve(status);
      }
    });
  }

  verifyAccountSaved() {
    let status, labid, labcont, labAdd, licStat = false;
    return new Promise((resolve) => {
      const labId = element(by.xpath('.// mat-cell//div/a[contains(text(), "' + AccoutManager.ts + '")]'));
      const labContact = element(by.xpath('.//mat-cell[contains(@class, "firstName")]/div'
        + '/span[contains(@class, "main-text")][contains(text(),"' + AccoutManager.ts + '")]'));
      const labAddressLine1 = element(by.xpath('.//unext-address-info/div/div[contains(text(),"' + AccoutManager.address1 + '")]'));
      const licenseStat = element(by.xpath('.// mat-cell/unext-licence-info/div/div[1]'));
      labId.isDisplayed().then(function () {
        labid = true;
      });
      labContact.isDisplayed().then(function () {
        labcont = true;
      });
      labAddressLine1.isDisplayed().then(function () {
        labAdd = true;
      });
      licenseStat.getText().then(function (text) {
        if (text === 'Active') {
          console.log('Account is Active');
          licStat = true;
        } else {
          console.log('Account is Expired');
          licStat = true;
        }
      });
      if (labid === true && labcont === true && labAdd === true && licStat === true) {
        library.logStepWithScreenshot('Account Values are correct', 'AccountCorrect');
        status = true;
        resolve(status);
      }
    });
  }

  verifyRequiredText() {
    let status = false;
    return new Promise((resolve) => {
      const reqText = element(by.xpath(requiredText));
      reqText.isDisplayed().then(function () {
        console.log('Required * text is displayed');
        library.logStepWithScreenshot('Required Text icon is displayed', 'RequiredText');
        status = true;
        resolve(status);
      });
    });
  }

  clickCancelButton() {
    let status = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancelButton));
      library.clickJS(cancelBtn);
      library.logStep('Cancel button clicked.');
      const gear = element(by.xpath(gearIcon));
      if (gear.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Add account Page is not displayed', 'navigated');
      } else {
        status = false;
        library.logFailStep('Add account Page is displayed');
      }
      resolve(status);
    });
  }

  enterDataOnCreateAccountPage(data, connectivityVal) {
    let status;
    return new Promise((resolve) => {
      const timestamp = library.createTimeStamp();
      AccoutManager.ts = timestamp;
      const soldToData = data.SoldTo + '_' + timestamp;
      const shipToData = data.ShipTo + '_' + timestamp;
      const labNameData = data.LabName + '_' + timestamp;
      AccoutManager.labName = labNameData;
      console.log('Assigned Value ' + status);
      const countryCreateAccountData = data.CountryCreateAccount;
      const addressCreateAccountData = data.AddressCreateAccount;
      AccoutManager.address1 = addressCreateAccountData;
      const address2CreateAccountData = data.Address2CreateAccount;
      const address3CreateAccountData = data.Address3CreateAccount;
      const cityCreateAccountData = data.CityCreateAccount;
      const zipCreateAccountData = data.ZipCreateAccount;
      const stateCreateAccountData = data.StateCreateAccount;
      const labContactFirstNameData = data.LabContactFirstName + '_' + timestamp;
      AccoutManager.firstName = labContactFirstNameData;
      const labContactLastNameData = data.LabContactLastName + '_' + timestamp;
      const labContactEmailData = data.LabContactEmail + '+' + data.env + timestamp + '@bio-rad.com';
      const numberOfUsersData = data.NumberOfUsers;
      const connectivityData = connectivityVal;
      const expiryDateData = data.ExpiryDate;
      const commentData = data.Comment;
      const transformerfieldData = data.TransformerFields;
      const account = new Map<string, string>();
      account.set(soldTo, soldToData);
      account.set(shipTo, shipToData);
      account.set(labName, labNameData);
      account.set(countryCreateAccount, countryCreateAccountData);
      account.set(addressCreateAccount, addressCreateAccountData);
      account.set(address2CreateAccount, address2CreateAccountData);
      account.set(address3CreateAccount, address3CreateAccountData);
      account.set(cityCreateAccount, cityCreateAccountData);
      account.set(zipCreateAccount, zipCreateAccountData);
      account.set(stateCreateAccount, stateCreateAccountData);
      account.set(labContactFirstName, labContactFirstNameData);
      account.set(labContactLastName, labContactLastNameData);
      account.set(labContactEmail, labContactEmailData);
      account.set(numberOfUsers, numberOfUsersData);
      account.set(connectivity, connectivityData);
      account.set(expiryDate, expiryDateData);
      account.set(comment, commentData);
      account.set(TransformerFields, transformerfieldData)
      account.forEach(function (key, value) {
        const ele = element(by.id(value));
        library.scrollToElement(ele);
        if (value === 'country') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        } else if (value === 'licenseConnectivityOption') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        }
        else if (value === 'labName') {
          const labNameEle = element(by.xpath('.// input[@id="labName"]'));
          labNameEle.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
        else if (value === 'transformers') {
          if (connectivityVal === 'Delimited') {
            library.clickJS(ele);
            const s = key.split(",");
            s.forEach(function (option) {
              const optionELement = element(by.xpath('//div[contains(@class,"transformers")]//mat-option//span[text()= " ' + option + ' "]'));
              library.clickJS(optionELement);
              library.logStepWithScreenshot('value selected ', ' value selected');
            })
          }
          else {
            library.logStepWithScreenshot('value not selected ', ' value not selected');
          }
        }
        else {
          ele.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
      });
      status = true;
      resolve(status);
    })
  }
/*
  verifyUserAccountAdded(data, connectivityVal) {
    const status = false;
    return new Promise((resolve) => {
      const now = moment();
      const timestamp = now.format('YYYYMMDDHHmmss');
      const sapNumberData = data.SapNumber + '_' + timestamp
      const orderNumberData = data.OrderNumber + '_' + timestamp
      const primaryLabNumberData = data.PrimaryLabNumber + '_' + timestamp
      const labNameData = data.LabName + '_' + timestamp
      const countryCreateAccountData = data.CountryCreateAccount
      const addressCreateAccountData = data.AddressCreateAccount
      const address2CreateAccountData = data.Address2CreateAccount
      const address3CreateAccountData = data.Address3CreateAccount
      const cityCreateAccountData = data.CityCreateAccount
      const zipCreateAccountData = data.ZipCreateAccount
      const stateCreateAccountData = data.StateCreateAccount
      const labContactFirstNameData = data.LabContactFirstName + '_' + timestamp
      const labContactLastNameData = data.LabContactLastName + '_' + timestamp
      const labContactEmailData = data.LabContactEmail + '_' + timestamp + '@gmail.com'
      const numberOfUsersData = data.NumberOfUsers
      const connectivityData = connectivityVal
      const expiryDateData = data.ExpiryDate
      const licenceLengthData = data.LicenceLength
      const commentData = data.Comment
      const account = new Map<string, string>();
      account.set(sapNumber, sapNumberData);
      account.set(orderNumber, orderNumberData);
      account.set(primaryLabNumber, primaryLabNumberData);
      account.set(labName, labNameData);
      account.set(countryCreateAccount, countryCreateAccountData);
      account.set(addressCreateAccount, addressCreateAccountData);
      account.set(address2CreateAccount, address2CreateAccountData);
      account.set(address3CreateAccount, address3CreateAccountData);
      account.set(cityCreateAccount, cityCreateAccountData);
      account.set(zipCreateAccount, zipCreateAccountData);
      account.set(stateCreateAccount, stateCreateAccountData);
      account.set(labContactFirstName, labContactFirstNameData);
      account.set(labContactLastName, labContactLastNameData);
      account.set(labContactEmail, labContactEmailData);
      account.set(numberOfUsers, numberOfUsersData);
      account.set(connectivity, connectivityData);
      account.set(expiryDate, expiryDateData);
      account.set(licenceLength, licenceLengthData);
      account.set(comment, commentData);
      account.forEach(function (key, value) {
        let ele = element(by.id(value));
        library.scrollToElement(ele);
        if (value === 'country') {
          library.clickJS(ele);
          let optionEle = element(by.xpath('// *[@class='mat-option-text'][contains(text(),'' + key + '')]'))
          library.clickJS(optionEle);
          library.logStep(key + ' value selected')
        } else if (value === 'licenseConnectivityOption') {
          library.clickJS(ele);
          let optionEle = element(by.xpath('// *[@class='mat-option-text'][contains(text(),'' + key + '')]'))
          library.clickJS(optionEle);
          library.logStep(key + ' value selected')
        }
        else {
          ele.sendKeys(key)
          library.logStep(key + ' value entered.')
        }
      });
      let addAccountBtn = element(by.xpath(addAccCreateAcc));
      browser.wait(protractor.ExpectedConditions.presenceOf(addAccountBtn), 5000);
      library.clickJS(addAccountBtn);
      library.clickAction(addAccountBtn);
      library.logStep('Add account button clicked');
      let gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 5000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.')
      let accountManagementEle = element(by.xpath(accountManagementMenu))
      library.clickJS(accountManagementEle);
      library.logStep('Account Management clicked.');
      dashBoard.waitForPage();
      let searchAcc = element(by.id(searchAccount));
      searchAcc.sendKeys(primaryLabNumberData);
      let searchIconEle = element(by.xpath(searchIcon));
      library.clickJS(searchIconEle);
      library.logStep('Search Icon clicked');
      let addedAccount = element(by.xpath('// span[contains(text(),'' + primaryLabNumberData + '')]'))
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Account created successfully.', 'AccountCreated')
        resolve(status);
      }
      else {
        status = false;
        library.logFailStep('Account creation failed.')
        resolve(status);
      }
    });
  }*/

  searchAccount() {
    let status = false;
    return new Promise((resolve) => {
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      library.clickJS(unityBtn);
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 5000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const accountManagementEle = element(by.xpath(accountManagementMenu));
      library.clickJS(accountManagementEle);
      library.logStep('Account Management clicked.');
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const searchAcc = findElement(locatorType.ID, searchAccount);
      const addedAccount = element(by.xpath('//span[contains(text(),"' + AccoutManager.firstName + '")]'));
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Account created successfully.', 'AccountCreated');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('Account creation failed.');
        resolve(status);
      }
    });
  }

  verifyLicenseDropdownValues() {
    let values = false;
    return new Promise((resolve) => {
      const licenseDD = element(by.xpath(licenseDropDown));
      library.clickJS(licenseDD);
      browser.sleep(2000);
      element.all(by.xpath(dropdownoptions)).count().then(function (count) {
        if (count === 72) {
          library.logStep('Total drop down values are 72');
          const licenseitems = new Map<string, string>();
          const lastmonth = '72 Months';
          const firstmonth = '1 Month';
          licenseitems.set(onemonth, lastmonth);
          licenseitems.set(twomonth, firstmonth);
          licenseitems.forEach(function (key, value) {
            const itemkey = element(by.xpath(value));
            const itemvalue = key;
            itemkey.getText().then(function (text) {
              if (text.includes(itemvalue)) {
                library.logStep('Drop down values-:' + text);
                values = true;
                resolve(values);
              } else {
                values = false;
                resolve(values);
              }
            });
          });
        }
      });
    });
  }

  verifyScrollBar() {
    let status = false;
    return new Promise((resolve) => {
      const scrollbarpresent = element(by.xpath(scrollbar));
      scrollbarpresent.isDisplayed().then(function () {
        status = true;
        const commentele = element(by.id(comment));
        library.scrollToElement(commentele);
        library.logStep('Scolled till comment');
        resolve(status);
      });
    });
  }

  verifyCreateAccountFields(data) {
    let flag = false;
    const actual = new Array();
    const expected = new Array(200, 100, 100, 100, 60, 20, 3, 50, 50, 50, 1024);
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const uiElements = new Map<string, string>();
      uiElements.set(data, labNameTextbox);
      uiElements.set(data, addressTextbox);
      uiElements.set(data, addressSecondLineTextbox);
      uiElements.set(data, addressThirdLineTextbox);
      uiElements.set(data, cityTextbox);
      uiElements.set(data, postalCodeTextbox);
      uiElements.set(data, stateTextbox);
      uiElements.set(data, firstNameTextbox);
      uiElements.set(data, lastNameTextbox);
      uiElements.set(data, emailTextbox);
      uiElements.set(data, commentTextbox);
      uiElements.forEach(function (key, value) {
        const eleUI = element(by.xpath(key));
        if (eleUI.isDisplayed()) {
          library.scrollToElement(eleUI);
          eleUI.sendKeys(value);
          browser.sleep(2000);
          eleUI.getAttribute('value').then(function (val) {
            actual.push(val.length);
          });
        }
      });
      if (JSON.stringify(expected) === JSON.stringify(actual)) {
        flag = true;
      }
      resolve(flag);
    });
  }

  verifyFieldLengthForComment() {
    let flag = false;
    return new Promise((resolve) => {
      const commentTxtBx = element(by.id(comment));
      commentTxtBx.isDisplayed().then(function () {
        library.scrollToElement(commentTxtBx);
        commentTxtBx.sendKeys(jsonData.EnterFieldData);
        browser.sleep(2000);
        commentTxtBx.getAttribute('value').then(function (val) {
          if (val.length === 1024) {
            flag = true;
            library.logStepWithScreenshot('Comment Field length verified', 'CommentFieldLengthVerified');
          }
          resolve(flag);
        });
      });
    });
  }

  searchShipToSoldTo(shipTosoldTo, labNameSearched) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const searchAcc = element(by.id(searchAccount));
      searchAcc.sendKeys(shipTosoldTo);
      const addedAccount = element(by.xpath('.//mat-row/mat-cell//a[contains(text(),"' + labNameSearched + '")]'));
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Able to search the Account', 'AccountSearched');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('Unable to search the Account');
        resolve(status);
      }
    });
  }

  searchInvalidShipToSoldTo(shipTosoldTo) {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const searchAcc = element(by.id(searchAccount));
      searchAcc.sendKeys(shipTosoldTo);
      const addedAccount = element(by.xpath('.//mat-row'));
      addedAccount.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Able to search the Account using Invalid ShipTo/SoldTo number', 'AccountSearched');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logFailStep('Unable to search the Account using Invalid ShipTo/SoldTo number');
        resolve(status);
      });
    });
  }

  verifyPresenceOfTransformersField() {
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const transformer = findElement(locatorType.ID, TransformerFields);
      transformer.isDisplayed().then(function () {
        library.scrollToElement(transformer);
        dashBoard.waitForElement();
        library.logStepWithScreenshot('Presence of Transformers field', 'Presence of Transformers field');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Transfomers field is not present');
        resolve(false);
      });
    })
  }
  verifyTranformerDropdownIsDisabled() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const ele = element(by.id(TransformerFields));
      ele.getAttribute('aria-disabled').then(function (value) {
        if (value.includes('true')) {
          library.logStepWithScreenshot("Transformer Dropdown is Disabled.", "Transformer Dropdown is Disabled.");
          resolve(true);
        } else {
          library.logFailStep("Transformer Dropdown is Enabled");
          resolve(false);
        }
      });
    })
  }

  verifyContactFieldsDisabled_EditAccount() {

    return new Promise((resolve) => {
      const ele = element(by.xpath(email));
      ele.getAttribute('disabled').then(function (value) {
        if (value === "true")
        {
          library.logStep("Email field is Disabled on Edit Account for lotviewer user.");
          console.log("Email field is Disabled on Edit Account for lotviewer user.");

        } else {
          library.logFailStep("Email field is Enabled on Edit Account for lotviewer user");
          console.log("Email field is Enabled on Edit Account for lotviewer user");

       }
      }).then(function(){
        const ele1 = element(by.xpath(firstName));
        ele1.getAttribute('disabled').then(function (value){
          if (value === "true")
        {
          library.logStep("firstname field is Disabled on Edit Account for lotviewer user.");
          console.log("firstname field is Disabled on Edit Account for lotviewer user.");

        } else {
          library.logFailStep("firstname field is Enabled on Edit Account for lotviewer user");
          console.log("firstname field is Enabled on Edit Account for lotviewer user");

       }
        })

      }).then(function(){
        const ele2 = element(by.xpath(lastName));
        ele2.getAttribute('disabled').then(function (value){
          if (value === "true")
        {
          library.logStep("lastname field is Disabled on Edit Account for lotviewer user.");
          console.log("lastname field is Disabled on Edit Account for lotviewer user.");

        } else {
          library.logFailStep("lastname field is Enabled on Edit Account for lotviewer user");
          console.log("lastname field is Enabled on Edit Account for lotviewer user");

       }
        })

      })



     resolve(true);
    })
  }

  verifyContactFieldsDisabled_EditLocation() {

    return new Promise((resolve) => {

      const ele = element(by.id(labContactEmail));
      ele.getAttribute('disabled').then(function (value) {
        if (value === "true")
        {
          library.logStep("Email field is Disabled on Edit location for lotviewer user.");
          console.log("Email field is Disabled on Edit location for lotviewer user.");

        } else {
          library.logFailStep("Email field is Enabled on Edit location for lotviewer user");
          console.log("Email field is Enabled on Edit location for lotviewer user");

       }
      }).then(function(){
        const ele1 = element(by.id(labContactFirstName));
        ele1.getAttribute('disabled').then(function (value){
          if (value === "true")
        {
          library.logStep("firstname field is Disabled on Edit location for lotviewer user.");
          console.log("firstname field is Disabled on Edit location for lotviewer user.");

        } else {
          library.logFailStep("firstname field is Enabled on Edit location for lotviewer user");
          console.log("firstname field is Enabled on Edit location for lotviewer user");

       }
        })

      }).then(function(){
        const ele2 = element(by.id(labContactLastName));
        ele2.getAttribute('disabled').then(function (value){
          if (value === "true")
        {
          library.logStep("lastname field is Disabled on Edit location for lotviewer user.");
          console.log("lastname field is Disabled on Edit location for lotviewer user.");

        } else {
          library.logFailStep("lastname field is Enabled on Edit location for lotviewer user");
          console.log("lastname field is Enabled on Edit location for lotviewer user");

       }
        })

      })



     resolve(true);

    })
  }


  clickUpdateAccountButton() {
    return new Promise((resolve) => {
      const Updatebtn = element(by.xpath(editLabUpdateAccountBtnEle));
      Updatebtn.isDisplayed().then(function () {
        library.clickJS(Updatebtn);
        library.logStepWithScreenshot("Update Button is Displayed and clicked", "Update Button is Displayed and clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep('Update Button is not Displayed');
        resolve(false);
      });
    })
  }
  verifyTranformerDropdownIsEnabled() {
    return new Promise((resolve) => {
      const ele = element(by.id(TransformerFields));
      ele.getAttribute('aria-disabled').then(function (value) {
        if (value.includes('false')) {
          library.logStepWithScreenshot("Transformer Dropdown is enabled.", "Transformer Dropdown is enabled.");
          resolve(true);
        } else {
          library.logFailStep("Transformer Dropdown is disabled");
          resolve(false);
        }
      });
    })
  }

  clickOnAddedAccount() {
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const labId = element(by.xpath('.// mat-cell// div/a[contains(text(), "' + AccoutManager.labName + '")]'));
      if (labId.isDisplayed()) {
        library.clickJS(labId);
        dashBoard.waitForElement();
        library.logStepWithScreenshot('Clicked on created Account', 'Clicked on created Account');
        resolve(true);
      } else {
        library.logFailStep('Created account not displayed');
        resolve(false);
      }
    })
  }
  verifyNoTransformerIsSelected() {
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const Transformerfields = browser.driver.findElement(by.id(TransformerFields));
      const selectedtransformer = element.all(by.xpath('//mat-select[@id="transformers"]//span//span'));
      library.scrollToElement(Transformerfields);
      selectedtransformer.then(function (value) {
        expect(value.length).toBe(0);
        library.logStepWithScreenshot('Transfomer is not present', 'Tranformer is not present');
        resolve(true);
      }).catch(function () {
        library.logFailStep('Tansfomer is present');
        resolve(false);
      });
    })
  }
  CreateAccountWithoutSelectingTransformer(data, connectivityVal) {
    let status;
    return new Promise((resolve) => {
      const timestamp = library.createTimeStamp();
      AccoutManager.ts = timestamp;
      const soldToData = data.SoldTo + '_' + timestamp;
      const shipToData = data.ShipTo + '_' + timestamp;
      const labNameData = data.LabName + '_' + timestamp;
      AccoutManager.labName = labNameData;
      console.log('Assigned Value ' + status);
      const countryCreateAccountData = data.CountryCreateAccount;
      const addressCreateAccountData = data.AddressCreateAccount;
      AccoutManager.address1 = addressCreateAccountData;
      const address2CreateAccountData = data.Address2CreateAccount;
      const address3CreateAccountData = data.Address3CreateAccount;
      const cityCreateAccountData = data.CityCreateAccount;
      const zipCreateAccountData = data.ZipCreateAccount;
      const stateCreateAccountData = data.StateCreateAccount;
      const labContactFirstNameData = data.LabContactFirstName + '_' + timestamp;
      AccoutManager.firstName = labContactFirstNameData;
      const labContactLastNameData = data.LabContactLastName + '_' + timestamp;
      const labContactEmailData = data.LabContactEmail + data.env + timestamp + '@bio-rad.com';
      const numberOfUsersData = data.NumberOfUsers;
      const connectivityData = connectivityVal;
      const expiryDateData = data.ExpiryDate;
      const licenceLengthData = data.LicenceLength;
      const commentData = data.Comment;
      const account = new Map<string, string>();
      account.set(soldTo, soldToData);
      account.set(shipTo, shipToData);
      account.set(labName, labNameData);
      account.set(countryCreateAccount, countryCreateAccountData);
      account.set(addressCreateAccount, addressCreateAccountData);
      account.set(address2CreateAccount, address2CreateAccountData);
      account.set(address3CreateAccount, address3CreateAccountData);
      account.set(cityCreateAccount, cityCreateAccountData);
      account.set(zipCreateAccount, zipCreateAccountData);
      account.set(stateCreateAccount, stateCreateAccountData);
      account.set(labContactFirstName, labContactFirstNameData);
      account.set(labContactLastName, labContactLastNameData);
      account.set(labContactEmail, labContactEmailData);
      account.set(numberOfUsers, numberOfUsersData);
      account.set(connectivity, connectivityData);
      account.set(expiryDate, expiryDateData);
      account.set(comment, commentData);
      account.forEach(function (key, value) {
        const ele = element(by.id(value));
        library.scrollToElement(ele);
        if (value === 'country') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        } else if (value === 'licenseConnectivityOption') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        }
        else if (value === 'labName') {
          const labNameEle = element(by.xpath('.// input[@id="labName"]'));
          labNameEle.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
        else {
          ele.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
      });
      status = true;
      resolve(status);
    });
  }

  verifySelectedTransformerOnEditAccount(transformer) {
    dashBoard.waitForElement();
    return new Promise((resolve) => {
      const selectedtransformer = element(by.xpath('//mat-select[@id="transformers"]//span//span'));
      library.scrollToElement(selectedtransformer);
      selectedtransformer.getText().then(function (actualvalue) {
        const expectedtransformerList = transformer.split(",")
        expectedtransformerList.forEach(function (expectedvalue) {
          if (actualvalue.includes(expectedvalue)) {
            dashBoard.waitForElement();
            library.logStepWithScreenshot('Selected Transfomer is present', 'selected tranformer is present');
            resolve(true);
          } else {
            library.logFailStep('Selected Transfomer is not present');
            resolve(false);
          }
        })
      })
    })
  }

  selectConnectivity(connectivityval) {
    return new Promise((resolve) => {
      const ele = element(by.id(conectivityOption));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + connectivityval + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("Connectivity option is displayed and clicked", "Connectivity option is  displayed and clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep('Connectivity option is not displayed');
        resolve(false);
      });;
    })
  }
  selectTransformer(tranformer) {
    return new Promise((resolve) => {
      const ele = element(by.id(TransformerFields));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + tranformer + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("Transformer option is displayed and selected", "Transformer option is displayed and selected");
        resolve(true);
      }).catch(function () {
        library.logFailStep('Transformer option is not displayed.');
        resolve(false);
      });;
    })
  }
  verifyMultiSelectDropdownForTranfomers() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const selectedtransformer = element(by.xpath(tranformersdropdown));
      const ele = element(by.id(TransformerFields));
      library.clickJS(ele);
      selectedtransformer.getAttribute('class').then(function (value) {
        if (value.includes('mat-option-multiple')) {
          library.logStepWithScreenshot("Multi Select Dropdown is present for transformers", "Multi Select Dropdown is present for transformers");
          resolve(true);
        } else {
          library.logFailStep("Multi Select Dropdown is not present for transformers");
          resolve(false);
        }
      });
    })
  }

  enterDataOnCreateAccountPageMigration(data, connectivityVal) {
    let status;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const soldToData = data.SoldTo;
      const shipToData = data.ShipTo;
      const primaryLabNumberData = data.PrimaryLabNumber;
      const labNameData = data.LabName;
      AccoutManager.labName = labNameData;
      const countryCreateAccountData = data.CountryCreateAccount;
      const addressCreateAccountData = data.AddressCreateAccount;
      AccoutManager.address1 = addressCreateAccountData;
      const address2CreateAccountData = data.Address2CreateAccount;
      const address3CreateAccountData = data.Address3CreateAccount;
      const cityCreateAccountData = data.CityCreateAccount;
      const zipCreateAccountData = data.ZipCreateAccount;
      const stateCreateAccountData = data.StateCreateAccount;
      const labContactFirstNameData = data.LabContactFirstName;
      AccoutManager.firstName = labContactFirstNameData;
      const labContactLastNameData = data.LabContactLastName;
      const labContactEmailData = data.LabContactEmail;
      const numberOfUsersData = data.NumberOfUsers;
      const connectivityData = connectivityVal;
      const expiryDateData = data.ExpiryDate;
      const account = new Map<string, string>();
      account.set(soldTo, soldToData);
      account.set(shipTo, shipToData);
      account.set(primaryLabNumberTextbox, primaryLabNumberData);
      account.set(labName, labNameData);
      account.set(countryCreateAccount, countryCreateAccountData);
      account.set(addressCreateAccount, addressCreateAccountData);
      account.set(address2CreateAccount, address2CreateAccountData);
      account.set(address3CreateAccount, address3CreateAccountData);
      account.set(cityCreateAccount, cityCreateAccountData);
      account.set(zipCreateAccount, zipCreateAccountData);
      account.set(stateCreateAccount, stateCreateAccountData);
      account.set(labContactFirstName, labContactFirstNameData);
      account.set(labContactLastName, labContactLastNameData);
      account.set(labContactEmail, labContactEmailData);
      account.set(numberOfUsers, numberOfUsersData);
      account.set(connectivity, connectivityData);
      account.set(expiryDate, expiryDateData);
      account.forEach(function (key, value) {
        const ele = element(by.id(value));
        browser.executeScript('arguments[0].scrollIntoView();', ele);
        if (value === 'country') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        } else if (value === 'licenseConnectivityOption') {
          library.clickJS(ele);
          const optionEle = element(by.xpath('// *[@class="mat-option-text"][contains(text(),"' + key + '")]'));
          library.clickJS(optionEle);
          library.logStep(value + ' value selected');
        } else if (value === 'labName') {
          const labNameEle = element(by.xpath('.// input[@id="labName"]'));
          labNameEle.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
        else {
          ele.sendKeys(key);
          library.logStep(key + ' value entered.');
        }
      });
      status = true;
      resolve(status);
    });
  }

  clickCreateAccountAddAccountButtonMigration() {
    let status = false;
    return new Promise((resolve) => {
      library.logStepWithScreenshot('Create Account details entered', 'CreateAccountDetailsEntered');
      const createAccountAddAccountBtn = findElement(locatorType.XPATH, createAccountAddAccountButton);
      createAccountAddAccountBtn.isDisplayed().then(function () {
        library.clickJS(createAccountAddAccountBtn);
        const loader = element(by.xpath(loaderPleaseWait));
        browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
        dashBoard.waitForElement();
        dashBoard.waitForElement();
        status = true;
        library.logStepWithScreenshot('Add Account Button clicked', 'AddAccountButtonClicked');
        resolve(status);
      });
    });
  }

  verifyAccountLocationManagementPageUI() {
    let status = false;
    return new Promise((resolve) => {
      const elementsUI = new Map<string, string>();
      elementsUI.set(pageHeaderALM, 'Header Account & Location Management');
      elementsUI.set(AccountsTabSelected, 'Accounts Tab Selected');
      elementsUI.set(LocationsTabNotSelected, 'Locations Tab Not Selected');
      elementsUI.set(newAddAnAccountButton, 'Add An Account Button');
      elementsUI.set(dropdownCategory, 'dropdown Category');
      elementsUI.set(textboxKeyword, 'textbox Keyword');
      elementsUI.set(buttonSearch, 'button Search');
      elementsUI.set(columnAccountName, 'column Account Name');
      elementsUI.set(columnAccountNumber, 'column Account Number');
      elementsUI.set(columnAddress, 'column Address');
      elementsUI.set(columnLocations, 'column Locations');
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
      library.attachScreenshot('Account & Location Management UI is Verified');
      resolve(status);
    });
  }

  verifyDeleteButton(accountName) {
    let status;
    return new Promise((resolve) => {
      const deleteIcon = element(by.xpath('.//a[text()="' + accountName + '"]/ancestor::mat-cell/following-sibling::mat-cell[3][text()=0]/following-sibling::mat-cell/mat-icon[@ng-reflect-svg-icon="delete"]'));
      deleteIcon.isDisplayed().then(function () {
        library.scrollToElement(deleteIcon);
        library.logStepWithScreenshot('Delete Icon is displayed for Account with 0 Locations', 'deleteIcon');
        console.log('Delete Icon is displayed for Account with 0 Locations');
        status = true;
        resolve(status);
      }).catch(function () {
        library.logFailStep("Delete Icon is not displayed for Account with 0 Locations");
        console.log("Delete Icon is not displayed for Account with 0 Locations");
        resolve(false);
      });
    });
  }

  verifyNoDeleteButton(accountName) {
    let status;
    return new Promise((resolve) => {
      const deleteIcon = element(by.xpath('.//a[text()="' + accountName + '"]/ancestor::mat-cell//following-sibling::mat-cell/mat-icon[@ng-reflect-svg-icon="delete"]'));
      deleteIcon.isDisplayed().then(function () {
        library.logFailStep('Delete Icon is displayed for Account with 1 or more Locations');
        console.log('Delete Icon is displayed for Account with 1 or more Locations');
        status = false;
        resolve(status);
      }).catch(function () {
        library.logStepWithScreenshot("Delete Icon is not displayed for Account with 1 or more Locations", "NoDeleteIcon");
        console.log("Delete Icon is not displayed for Account with 1 or more Locations");
        resolve(true);
      });
    });
  }

  verifyLocationsDisplayedForAllAccounts() {
    let status;
    return new Promise((resolve) => {
      element.all(by.xpath('.//mat-row[@role="row"]')).then(function (num1) {
        const numberOfAccounts = num1.length;
        console.log('numberOfAccounts ' + numberOfAccounts);
        element.all(by.xpath('.//button/span[contains(text(),"Locations")]')).then(function (num2) {
          const numberOfLocationButtons = num2.length;
          console.log('numberOfLocationButtons ' + numberOfLocationButtons);
          if (numberOfAccounts == numberOfLocationButtons) {
            library.logStepWithScreenshot('The Location button is displayed for all the Accounts', 'LocationButtonForAllAccounts');
            console.log('The Location button is displayed for all the Accounts');
            status = true;
            resolve(status);
          }
          else {
            library.logStepWithScreenshot('The Location button is not displayed for all the Accounts', 'LocationButtonForAllAccounts');
            console.log('The Location button is not displayed for all the Accounts');
            status = false;
            resolve(status);
          }
        });
      });
    });
  }

  verifySystemGeneratedAccountNoDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).getText().then(function (number) {
        if (number == "") {
          library.logFailStep("Failed : System generated account no is empty");
          console.log("Failed : System generated account no is empty");
          resolve(false);
        } else {
          library.logStepWithScreenshot("System generated account no is displayed", "Account number displayed");
          console.log("System generated account no is displayed");
          resolve(true);
        }
      });
    })
  }

  verifyFieldLengthForAccountName(accountNameTxt) {
    const errorMsg = '//*[@id="accountName"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(accountName)).isDisplayed().then(function () {
        element(by.xpath(accountName)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account name field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account name field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account name field");
          console.log("Error message is not displayed for the mandatory account name field");
          resolve(false);
        }
        element(by.xpath(accountName)).sendKeys(accountNameTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the account name more than 200 length", "Msg displayed");
          console.log("Error message is displayed for the account name more than 200 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account name more than 200 length");
          console.log("Error message is not displayed for the account name more than 200 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForAccoutnAddress(addressTxt) {
    const errorMsg = '//*[@id="address"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(address)).isDisplayed().then(function () {
        element(by.xpath(address)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory address field", "Msg displayed");
          console.log("Error message is displayed for the mandatory address field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory address field");
          console.log("Error message is not displayed for the mandatory address field");
          resolve(false);
        }
        element(by.xpath(address)).sendKeys(addressTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the address more than 100 length", "Msg displayed");
          console.log("Error message is displayed for the address more than 100 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the address more than 100 length");
          console.log("Error message is not displayed for the address more than 100 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForAccountAddress2(addressTxt) {
    return new Promise((resolve) => {
      const address = '//*[@id="address2"]';
      const errorMsg = '//*[@id="address2"]//following::mat-error[1]';
      this.verifyOptionalAddressField(address, addressTxt, errorMsg);
      resolve(true);
    });
  }

  verifyFieldLengthForAccountAddress3(addressTxt) {
    return new Promise((resolve) => {
      const address = '//*[@id="address3"]';
      const errorMsg = '//*[@id="address3"]//following::mat-error[1]';
      this.verifyOptionalAddressField(address, addressTxt, errorMsg);
      resolve(true);
    });
  }

  verifyOptionalAddressField(address, addressTxt, errorMsg) {
    return new Promise((resolve) => {
      element(by.xpath(address)).click();
      element(by.xpath(address)).sendKeys(addressTxt);
      element(by.xpath(address)).sendKeys(protractor.Key.TAB);
      browser.wait(protractor.ExpectedConditions.presenceOf(element(by.xpath(errorMsg))), 5000);
      const err2 = element(by.xpath(errorMsg));
      if (err2.isDisplayed()) {
        library.logStepWithScreenshot("Error message is displayed for the address more than 100 length", "Msg displayed");
        console.log("Error message is displayed for the address more than 100 length");
        resolve(true);
      } else {
        library.logFailStep("Failed : Error message is not displayed for the address more than 100 length");
        console.log("Error message is not displayed for the address more than 100 length");
        resolve(false);
      }
    });
  }

  verifyExitWithoutSavingPopupDisplayed() {
    return new Promise((resolve) => {
      const exitWithoutSavingPopup = findElement(locatorType.XPATH, exitPopup);
      exitWithoutSavingPopup.isDisplayed().then(function () {
        library.logStep('Exit Without Saving Pop up displayed');
        console.log('Exit Without Saving Pop up displayed');
        const exitWithoutSavingBtnEle = element(by.xpath(exitWithoutSavingButton));
        exitWithoutSavingBtnEle.isDisplayed().then(function () {
          library.logStep('Exit Without Saving Btn displayed');
          console.log('Exit Without Saving Btn displayed');
          const saveAndExitBtnEle = element(by.xpath(saveAndExitBtn));
          saveAndExitBtnEle.isDisplayed().then(function () {
            library.logStepWithScreenshot('Save and Exit Btn displayed', 'Pop up displayed');
            console.log('Save and Exit Btn displayed');
            resolve(true)
          });
        });
      });
    });
  }
  clickOnExitWithoutSavingBtn() {
    return new Promise((resolve) => {
      const exitWithoutSavingBtnEle = element(by.xpath(exitWithoutSavingButton));
      exitWithoutSavingBtnEle.isDisplayed().then(function () {
        exitWithoutSavingBtnEle.click();
        library.logStepWithScreenshot('Exit Without Saving Btn is clicked', 'Clicked on Btn');
        console.log('Exit Without Saving Btn is clicked');
        resolve(true);
      });
    });
  }

  verifyFieldLengthForCity(cityTxt) {
    const errorMsg = './/input[@id="city"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(city)).isDisplayed().then(function () {
        element(by.xpath(city)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account city field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account city field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account city field");
          console.log("Error message is not displayed for the mandatory account city field");
          resolve(false);
        }
        element(by.xpath(city)).sendKeys(cityTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the account city more than 60 length", "Msg displayed");
          console.log("Error message is displayed for the account name more than 60 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account city more than 60 length");
          console.log("Error message is not displayed for the account city more than 60 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForZip(zipTxt) {
    const errorMsg = './/input[@id="locationZipCode"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabZipCodeTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabZipCodeTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account zip field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account zip field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account zip field");
          console.log("Error message is not displayed for the mandatory account zip field");
          resolve(false);
        }
        element(by.xpath(LabZipCodeTextbox)).sendKeys(zipTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the account zip more than 20 length", "Msg displayed");
          console.log("Error message is displayed for the account name more than 20 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account zip more than 20 length");
          console.log("Error message is not displayed for the account zip more than 20 length");
          resolve(false);
        }
      });
    });
  }
  verifyFieldLengthForState(stateTxt) {
    const errorMsg = './/input[@id="labLocationState"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabStateTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabStateTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account state field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account state field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account state field");
          console.log("Error message is not displayed for the mandatory account state field");
          resolve(false);
        }
        element(by.xpath(LabStateTextbox)).sendKeys(stateTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the account state more than 50 length");
          console.log("Error message is displayed for the account state more than 50 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account state more than 50 length");
          console.log("Error message is not displayed for the account state more than 50 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldCountry() {
    const errorMsg = './/mat-select[@id="labLocationCountryId"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabCountryTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabCountryTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory account country field");
          console.log("Error message is displayed for the mandatory account country field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account country field");
          console.log("Error message is not displayed for the mandatory account country field");
          resolve(false);
        }
      });
    });
  }
  verifyFieldEmail(InvalidMail) {
    const errorMsg = './/*[@id="labContactEmail"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabContactEmailTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabContactEmailTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory account email field");
          console.log("Error message is displayed for the mandatory account email field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account email field");
          console.log("Error message is not displayed for the mandatory account email field");
          resolve(false);
        }
        element(by.xpath(LabContactEmailTextbox)).sendKeys(InvalidMail);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the invalid email");
          console.log("Error message is displayed for the invalid email");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the invalid email");
          console.log("Error message is not displayed for the invalid email");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForPhone(phoneTxt) {
    return new Promise((resolve) => {
      const phone = '//input[@id="phone"]';
      const errorMsg = '//input[@id="phone"]//following::mat-error[1]';
      this.verifyOptionalPhoneField(phone, phoneTxt, errorMsg);
      resolve(true);
    });
  }

  verifyFieldLengthForFirstName(firstNameTxt) {
    const errorMsg = './/input[@id="labContactFirst"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabContactFirstTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabContactFirstTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account firstName field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account firstName field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account firstName field");
          console.log("Error message is not displayed for the mandatory account firstName field");
          resolve(false);
        }
        element(by.xpath(LabContactFirstTextbox)).sendKeys(firstNameTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the account firstName more than 50 length", "Msg displayed");
          console.log("Error message is displayed for the account firstName more than 50 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account firstName more than 50 length");
          console.log("Error message is not displayed for the account firstName more than 50 length");
          resolve(false);
        }
      });
    });
  }
  verifyFieldLengthForLastName(lastNameTxt) {

    const errorMsg = './/input[@id="labContactLast"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabContactLastTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabContactLastTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the mandatory account lastName field", "Msg displayed");
          console.log("Error message is displayed for the mandatory account lastName field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account lastName field");
          console.log("Error message is not displayed for the mandatory account lastName field");
          resolve(false);
        }
        element(by.xpath(LabContactLastTextbox)).sendKeys(lastNameTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the account lastName more than 50 length", "Msg displayed");
          console.log("Error message is displayed for the account lastName more than 50 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account lastName more than 50 length");
          console.log("Error message is not displayed for the account lastName more than 50 length");
          resolve(false);
        }
      });
    });
  }
  verifyOptionalPhoneField(phone, phoneTxt, errorMsg) {
    return new Promise((resolve) => {
      element(by.xpath(phone)).isDisplayed().then(function () {
        element(by.xpath(phone)).sendKeys(protractor.Key.TAB);
        element(by.xpath(phone)).sendKeys(phoneTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStepWithScreenshot("Error message is displayed for the address more than 25 length", "Msg displayed");
          console.log("Error message is displayed for the address than 25 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the address more than 25 length");
          console.log("Error message is not displayed for the address more than 25 length");
          resolve(false);
        }
      });
    });
  }

  addAccountValidDetails(jsonDataNew) {
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).isDisplayed().then(function () {
        element(by.xpath(accountName)).sendKeys(jsonDataNew.LabName + "-" + Math.floor(Math.random() * (100 + 1)));
        element(by.xpath(address)).sendKeys(jsonDataNew.AddressCreateAccount);
        element(by.xpath(countryEle)).isDisplayed().then(function () {
          element(by.xpath(countryEle)).click();
          library.scrollToElement(element(by.xpath("//span[contains(text(),'" + jsonDataNew.CountryCreateAccount + "')]")));
          element(by.xpath("//span[contains(text(),'" + jsonDataNew.CountryCreateAccount + "')]")).click();
        });
        element(by.xpath(state)).sendKeys(jsonDataNew.StateCreateAccount);
        element(by.xpath(city)).sendKeys(jsonDataNew.CityCreateAccount);
        element(by.xpath(zip)).sendKeys(jsonDataNew.ZipCreateAccount);
        element(by.xpath(firstName)).sendKeys(jsonDataNew.LabContactFirstName);
        element(by.xpath(lastName)).sendKeys(jsonDataNew.LabContactLastName);
        element(by.xpath(email)).sendKeys(jsonDataNew.LabContactEmail + Math.floor(Math.random() * (100 + 1)));
        library.logStepWithScreenshot('Lab Details to create lab are added', 'Details are added');
        resolve(true);
      });
    });
  }

  clickCancelButton2() {
    let status = false;
    return new Promise((resolve) => {
      const cancelBtn = element(by.xpath(cancelButton2));
      library.clickJS(cancelBtn);
      library.logStep('Cancel button clicked.');
      const gear = element(by.xpath(gearIcon));
      if (gear.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Add account Page is not displayed', 'navigated');
      } else {
        status = false;
        library.logFailStep('Add account Page is displayed');
      }
      resolve(status);
    });
  }

  clickAddAccountSubmitButton() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const addAccountBtn = element(by.xpath(addAccountSubmitButton));
      addAccountBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Account btn is clicked', 'Account btn is clicked');
        library.clickJS(addAccountBtn);
        resolve(true);
      }).catch(function () {
        library.logFailStep('Account btn is not clicked');
        resolve(false);
      });;
    });
  }

  searchAccountbyEmail(email) {
    dashBoard.waitForElement();
    let status = false;
    return new Promise((resolve) => {
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      library.clickJS(unityBtn);
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 25000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.xpath(accountManagementMenu))), 25000);
      const accountManagementEle = element(by.xpath(accountManagementMenu));
      library.clickJS(accountManagementEle);
      library.logStep('Account Management clicked.');
      dashBoard.waitForElement();
      const searchAcc = findElement(locatorType.ID, searchAccount);
      var newemail;
      if (random_number == undefined || random_number == null) {
        newemail = email;
      }
      else {
        newemail = email + random_number;
      }
      searchAcc.sendKeys(newemail);
      const searchIconEle = findElement(locatorType.XPATH, searchIcon);
      library.clickJS(searchIconEle);
      library.logStep('Search Icon clicked');
      dashBoard.waitForElement();
      const addedAccount = element(by.xpath('//span[contains(text(),"' + newemail + '")]'));
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Account created successfully.', 'AccountCreated');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('Account creation failed.');
        resolve(status);
      }
    });
  }

  updateLabAccountDetails(jsonDataNew) {
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).isDisplayed().then(function () {
        const var1 = Math.floor(Math.random() * (99 + 10));
        random_number = var1;
        random_state = Math.floor(Math.random() * (9 + 1));
        element(by.xpath(accountName)).clear();
        element(by.xpath(accountName)).sendKeys(jsonDataNew.LabName + "-" + random_number);
        element(by.xpath(address)).clear();
        element(by.xpath(address2)).clear();
        element(by.xpath(address3)).clear();
        element(by.xpath(address)).sendKeys(jsonDataNew.AddressCreateAccount + random_number);
        element(by.xpath(address2)).sendKeys(jsonDataNew.Address2CreateAccount + random_number);
        element(by.xpath(address3)).sendKeys(jsonDataNew.Address3CreateAccount + random_number);
        element(by.xpath(state)).clear();
        element(by.xpath(city)).clear();
        element(by.xpath(zip)).clear();
        element(by.xpath(zip)).sendKeys((jsonDataNew.ZipCreateAccount + random_number));
        element(by.xpath(state)).sendKeys(jsonDataNew.StateCreateAccount + random_state);
        element(by.xpath(city)).sendKeys(jsonDataNew.CityCreateAccount + random_number);
        element(by.xpath(firstName)).clear();
        element(by.xpath(lastName)).clear();
        element(by.xpath(firstName)).sendKeys(jsonDataNew.LabContactFirstName + random_number);
        element(by.xpath(lastName)).sendKeys(jsonDataNew.LabContactLastName + random_number);
        library.logStepWithScreenshot('Lab Details are updated', 'Details are updated');
        resolve(true);
      });
    });
  }

  searchAccountbyEmailNew(email) {
    dashBoard.waitForElement();
    let status = false;
    return new Promise((resolve) => {
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      library.clickJS(unityBtn);
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 5000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const accountManagementEle = element(by.xpath(accountManagementMenu));
      library.clickJS(accountManagementEle);
      library.logStep('Account Management clicked.');
      dashBoard.waitForElement();
      const searchAcc = findElement(locatorType.ID, searchAccount);
      var newemail = email + random_number;
      searchAcc.sendKeys(newemail);
      const searchIconEle = findElement(locatorType.XPATH, searchIcon);
      library.clickJS(searchIconEle);
      library.logStep('Search Icon clicked');
      dashBoard.waitForElement();
      const addedAccount = element(by.xpath('//span[contains(text(),"' + newemail + '")]'));
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Account created successfully.', 'AccountCreated');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('Account creation failed.');
        resolve(status);
      }
    });
  }

  verifyUpdatedDetails(jsonDataNew) {
    let flag1, flag2, flag3, flag4, flag5, flag6, flag7, flag8, flag9, flag10 = false;
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).isDisplayed().then(function () {
        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.xpath(accountName))), 50000);
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(element(by.xpath(accountName))), 50000);
        if (random_number == undefined || random_number == null) {
          resolve(false);
        }
        element(by.xpath(accountName)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.LabName + "-" + random_number)) {
            flag1 = true;
            library.logStepWithScreenshot('The account name is updated', 'account name updated');
            resolve(flag1);
          } else {
            flag1 = false;
            library.logFailStep('The account name is NOT updated');
            resolve(flag1);
          }
        });
        element(by.xpath(address)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.AddressCreateAccount + random_number)) {
            flag2 = true;
            library.logStepWithScreenshot('The account address is updated', 'account address updated');
            resolve(flag2);
          } else {
            flag2 = false;
            library.logFailStep('The account address is NOT updated');
            resolve(flag2);
          }
        });
        element(by.xpath(address2)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.Address2CreateAccount + random_number)) {
            flag3 = true;
            library.logStepWithScreenshot('The account address is updated', 'account address updated');
            resolve(flag3);
          } else {
            flag3 = false;
            library.logFailStep('The account address is NOT updated');
            resolve(flag3);
          }
        });
        element(by.xpath(address3)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.Address3CreateAccount + random_number)) {
            flag4 = true;
            library.logStepWithScreenshot('The account address is updated', 'account address updated');
            resolve(flag4);
          } else {
            flag4 = false;
            library.logFailStep('The account address is NOT updated');
            resolve(flag4);
          }
        });
        element(by.xpath(state)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.StateCreateAccount + random_state)) {
            flag5 = true;
            library.logStepWithScreenshot('The account state is updated', 'account state updated');
            resolve(flag5);
          } else {
            flag5 = false;
            library.logFailStep('The account state is NOT updated');
            resolve(flag5);
          }
        });
        element(by.xpath(city)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.CityCreateAccount + random_number)) {
            flag6 = true;
            library.logStepWithScreenshot('The account city is updated', 'account city updated');
            resolve(flag6);
          } else {
            flag6 = false;
            library.logFailStep('The account city is NOT updated');
            resolve(flag6);
          }
        });
        element(by.xpath(zip)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.ZipCreateAccount + random_number)) {
            flag7 = true;
            library.logStepWithScreenshot('The account zip is updated', 'account zip updated');
            resolve(flag7);
          } else {
            flag7 = false;
            library.logFailStep('The account zip is NOT updated');
            resolve(flag7);
          }
        });
        element(by.xpath(firstName)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.LabContactFirstName + random_number)) {
            flag8 = true;
            library.logStepWithScreenshot('The account firstName is updated', 'account firstName updated');
            resolve(flag8);
          } else {
            flag8 = false;
            library.logFailStep('The account firstName is NOT updated');
            resolve(flag8);
          }
        });
        element(by.xpath(lastName)).getAttribute('value').then(function (value) {
          if (value.includes(jsonDataNew.LabContactLastName + random_number)) {
            flag9 = true;
            library.logStepWithScreenshot('The account lastName is updated', 'account lastName updated');
            resolve(flag9);
          } else {
            flag9 = false;
            library.logFailStep('The account lastName is NOT updated');
            resolve(flag9);
          }
        });
        library.logStepWithScreenshot('Lab Details are updated', 'Details are updated');
        if (flag1 == true || flag2 == true || flag3 == true || flag4 == true || flag5 == true || flag6 == true || flag7 == true || flag8 == true || flag9 == true) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  }

  searchAccountNew(email) {
    dashBoard.waitForElement();
    let status = false;
    return new Promise((resolve) => {
      const unityBtn = findElement(locatorType.XPATH, unityNext);
      library.clickJS(unityBtn);
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(protractor.ExpectedConditions.presenceOf(gearElement), 5000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const accountManagementEle = element(by.xpath(accountManagementMenu));
      library.clickJS(accountManagementEle);
      library.logStep('Account Management clicked.');
      dashBoard.waitForElement();
      const searchAcc = findElement(locatorType.ID, searchAccount);
      searchAcc.sendKeys(AccoutManager.firstName);
      const searchIconEle = findElement(locatorType.XPATH, searchIcon);
      library.clickJS(searchIconEle);
      library.logStep('Search Icon clicked');
      dashBoard.waitForElement();
      const addedAccount = element(by.xpath('// span[contains(text(),"' + AccoutManager.firstName + '")]'));
      if (addedAccount.isDisplayed()) {
        status = true;
        library.logStepWithScreenshot('Account created successfully.', 'AccountCreated');
        resolve(status);
      } else {
        status = false;
        library.logFailStep('Account creation failed.');
        resolve(status);
      }
    });
  }

  updateEmailtoExisting(emailNew) {
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).isDisplayed().then(function () {
        random_number = Math.floor(Math.random() * (100 + 1));
        element(by.xpath(email)).clear();
        element(by.xpath(email)).sendKeys(emailNew);
        library.logStepWithScreenshot('Email added', 'Email added');
        resolve(true);
      });
    });
  }
  verifyUpdatedEmail(EmailNew) {
    let flag = false;
    return new Promise((resolve) => {
      element(by.xpath(systemGeneratedAccountNo)).isDisplayed().then(function () {
        element(by.xpath(email)).getAttribute('value').then(function (value) {
          if (value.includes(EmailNew + random_number)) {
            flag = true;
            library.logStepWithScreenshot('The account email is updated', 'account email updated');
            resolve(flag);
          } else {
            flag = false;
            library.logFailStep('The account email is NOT updated');
            resolve(flag);
          }
        });
        resolve(flag);
      });
    });
  }

  clickUpdateFormCloseButton() {
    let status = false;
    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(updateformClose));
      closeBtn.isDisplayed().then(function () {
        library.clickJS(closeBtn);
        status = true;
        resolve(status);
      });
    });
  }

  verifyUpdateButton() {
    dashBoard.waitForElement();
    let status = false;
    return new Promise((resolve) => {
      browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.xpath(editLabUpdateAccountBtnEleNew))), 50000);
      const updatebutton = element(by.xpath(editLabUpdateAccountBtnEleNew));
      updatebutton.getAttribute('disabled').then(function (val) {
        if (val === "true") {
          status = false;
          library.logStep('Update button disabled');
          resolve(status);
        } else {
          status = true;
          library.logStep('Update button enabled');
          resolve(status);
        }
        resolve(status);
      });
    });
  }

  clickAccountTab() {
    let status = false;
    return new Promise((resolve) => {
      const TabHeader = findElement(locatorType.XPATH, ACCOUNT_Tab);
      TabHeader.isDisplayed().then(function () {

        library.clickJS(TabHeader);
        console.log('ACCOUNTS Tab is clicked');
        library.logStep('ACCOUNTS Tab is clicked');

        status = true;
        resolve(status);
      });
    });
  }



  clickLOCATIONSBtn_AccountsPage() {
    let status = false;
    return new Promise((resolve) => {
      const LocationBtn = findElement(locatorType.XPATH, ACCOUNT_Tab_LOCATIONS_Btn);
      LocationBtn.isDisplayed().then(function () {

        library.clickJS(LocationBtn);
        console.log('Location btn first row is clicked');
        library.logStep('Location  btn first row is clicked');

        status = true;
        resolve(status);
      });
    });
  }

  SelectGroup_AccountInformationTab(Group1) {
    let displayed = true;
    const GroupDropDown = './/mat-label[text()="Choose a group"]/ancestor::span/preceding-sibling::mat-select[@role="listbox"]';
    return new Promise((resolve) => {
      const ele = element(by.xpath(GroupDropDown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//*[@class="mat-option-text"][contains(text(),"' + Group1 + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("Group option is displayed and clicked", "Group option is  displayed and clicked");
        resolve(displayed);
      }).catch(function () {
        library.logFailStep('Group options are not displayed');
        resolve(false);
      });
    });

  }

  verifyAddLocationButton() {
    let displayed = true;
    return new Promise((resolve) => {
      const AddLocationbtn = element(by.xpath(AddLocationButton));
      AddLocationbtn.isDisplayed().then(function () {
        console.log('AddLocation button displayed');
        library.logStep('AddLocation button displayed');
        displayed = true;
        resolve(displayed);
      }).catch(function () {
        console.log('AddLocation button not displayed');
        library.logStep('AddLocation button not displayed');
        displayed = false;
        resolve(displayed);
      });
    });
  }

  ClickAddLocationBtn() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const addLocationBtn = findElement(locatorType.XPATH, AddLocationButton);
      addLocationBtn.isDisplayed().then(function () {
        library.logStep('Add Location btn is displayed');
        library.clickJS(addLocationBtn);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(addLocationBtn), 10000);
        library.logStep("Add Location button clicked");
        console.log("Add Location button clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep('Add Location btn is not displayed');
        resolve(false);
      });;
    });
  }

  verifyLicenseInformationSecUI_AddLocation() {
    let fields, licenseInfoLabel, Order_Number, UnityNextTier, ConnectivityTier1, Tranformers, QCLotViewer, Add_Ons, CrossOverStudy, AssignDate, ExpiryDate, LicenseLength, NumberOfUsers = false;
    return new Promise((resolve) => {
      const LicenseInformationLbl = element(by.xpath(LicenseInformationLabel));
      LicenseInformationLbl.isDisplayed().then(function () {
        licenseInfoLabel = true;
        library.logStep('License Information Label is displayed');
        console.log('License Information Label ' + licenseInfoLabel);
      });
      const Order_NumberTxtbx = element(by.xpath(OrderNumberTextbox));
      Order_NumberTxtbx.isDisplayed().then(function () {
        Order_Number = true;
        library.logStep('Order Number Textbox displayed');
        console.log('Order Number Textbox ' + Order_Number);
      });
      const UnityNextTierDrpdwn = element(by.xpath(UnityNextTierDropdown));
      UnityNextTierDrpdwn.isDisplayed().then(function () {
        UnityNextTier = true;
        library.logStep('Unity Next Tier Dropdown is displayed');
        console.log('Unity Next Tier Dropdown ' + UnityNextTier);
      });
      const ConnectivityTierDrpdwn = element(by.xpath(ConnectivityTierDropdown));
      ConnectivityTierDrpdwn.isDisplayed().then(function () {
        ConnectivityTier1 = true;
        library.logStep('Connectivity Tier Dropdown is displayed');
        console.log('Connectivity Tier Dropdown ' + ConnectivityTier1);
      });
      const Tranformersdrpdwn = element(by.xpath(TranformersDropDown));
      Tranformersdrpdwn.isDisplayed().then(function () {
        Tranformers = true;
        library.logStep('Tranformers drop down is displayed');
        console.log('Tranformers drop down ' + Tranformers);
      });
      const QCLotViewerDrpdwn = element(by.xpath(QCLotViewerDropdown));
      QCLotViewerDrpdwn.isDisplayed().then(function () {
        QCLotViewer = true;
        library.logStep('QCLotViewer Dropdown is displayed');
        console.log('QCLotViewer Dropdown ' + QCLotViewer);
      });
      const Add_OnsDrpdwn = element(by.xpath(Add_OnsDropdown));
      Add_OnsDrpdwn.isDisplayed().then(function () {
        Add_Ons = true;
        library.logStep('Add_Ons Dropdown is displayed');
        console.log('Add_Ons Dropdown ' + Add_Ons);
      });
      const CrossOverStudydrpdwn = element(by.xpath(CrossOverStudyDropDown));
      CrossOverStudydrpdwn.isDisplayed().then(function () {
        CrossOverStudy = true;
        library.logStep('CrossOverStudy drop down is displayed');
        console.log('CrossOverStudy drop down ' + CrossOverStudy);
      });
      const AssignDatePicker = element(by.xpath(AssignDate_picker));
      AssignDatePicker.isDisplayed().then(function () {
        AssignDate = true;
        library.logStep('Assign Date picker calender is displayed');
        console.log('Assign Date picker calender' + AssignDate);
      });
      const ExpiryDatePicker = element(by.xpath(ExpiryDate_picker));
      ExpiryDatePicker.isDisplayed().then(function () {
        ExpiryDate = true;
        library.logStep('Expiry Date picker calender is displayed');
        console.log('Expiry Date picker calender' + ExpiryDate);
      });
      const LicenseLengthdrpdwn = element(by.xpath(LicenseLengthDropDown));
      LicenseLengthdrpdwn.isDisplayed().then(function () {
        LicenseLength = true;
        library.logStep('License Length drop down is displayed');
        console.log('License Length drop down ' + LicenseLength);
      });
      const NumberOfUsersTxtbx = element(by.xpath(NumberOfUsersTextbox));
      NumberOfUsersTxtbx.isDisplayed().then(function () {
        NumberOfUsers = true;
        library.logStep('Number Of Users Textbox is displayed');
        console.log('Number Of Users Textbox ' + NumberOfUsers);
      });
      if (licenseInfoLabel === true && Order_Number === true && UnityNextTier === true && ConnectivityTier1 === true && Tranformers === true && QCLotViewer === true &&
        Add_Ons === true && CrossOverStudy === true && AssignDate === true &&
        ExpiryDate === true && LicenseLength === true && NumberOfUsers === true) {
        fields = true;
        resolve(fields);
      }
    });
  }

  verifyLocationInformationSecUI_AddLocation() {
    let status, LocationInformationlabel, shiptoaccount, soldtoaccount, LabName, legacyprimary, addressline1, addressline2, labcountry, labState, labCity, LabZipCode, LabContactEmail, LabContactFirstName, LabContactLastName = false;
    return new Promise((resolve) => {
      const LocationInformationLbl = element(by.xpath(LocationInformationLabel));
      LocationInformationLbl.isDisplayed().then(function () {
        LocationInformationlabel = true;
        library.logStep('Location Information Label is displayed');
        console.log('Location Information Label ' + LocationInformationlabel);
      });
      const shipToAccountNumBox = element(by.xpath(shipToAccountTbx));
      shipToAccountNumBox.isDisplayed().then(function () {
        shiptoaccount = true;
        library.logStep('Ship to Account Number Textbox displayed');
        console.log('Ship to Account Number Textbox ' + shiptoaccount);
      });
      const soldToAccountNumBox = element(by.xpath(soldToAccountTbx));
      soldToAccountNumBox.isDisplayed().then(function () {
        soldtoaccount = true;
        library.logStep('Sold to Account Number Textbox displayed');
        console.log('Sold to Account Number Textbox ' + soldtoaccount);
      });
      const LabNameTxtbx = element(by.xpath(LabNameTextbox));
      LabNameTxtbx.isDisplayed().then(function () {
        LabName = true;
        library.logStep('Lab Name Textbox displayed');
        console.log('Lab Name Textbox ' + LabNameTxtbx);
      });
      const lagacyprimaryLabNumberTxtbx = element(by.xpath(LegacyprimaryLabNumberTextbox));
      lagacyprimaryLabNumberTxtbx.isDisplayed().then(function () {
        legacyprimary = true;
        library.logStep('Legacy Primary Lab Number Textbox displayed');
        console.log('Legacy Primary Lab Number Textbox ' + legacyprimary);
      });
      const AddressLine1Txtbx = element(by.xpath(AddressLine1Textbox));
      AddressLine1Txtbx.isDisplayed().then(function () {
        addressline1 = true;
        library.logStep('Address line1 Textbox displayed');
        console.log('Address line1 Textbox ' + addressline1);
      });
      const AddressLine2Txtbx = element(by.xpath(AddressLine2Textbox));
      AddressLine2Txtbx.isDisplayed().then(function () {
        addressline2 = true;
        library.logStep('Address line2 Textbox displayed');
        console.log('Address line2 Textbox ' + addressline2);
      });
      const LabCountryTxtbx = element(by.xpath(LabCountryTextbox));
      LabCountryTxtbx.isDisplayed().then(function () {
        labcountry = true;
        library.logStep('Country Textbox displayed');
        console.log('Country Textbox ' + labcountry);
      });
      const LabStateTxtbx = element(by.xpath(LabStateTextbox));
      LabStateTxtbx.isDisplayed().then(function () {
        labState = true;
        library.logStep('State Textbox displayed');
        console.log('State Textbox ' + labState);
      });
      const LabCityTxtbx = element(by.xpath(LabCityTextbox));
      LabCityTxtbx.isDisplayed().then(function () {
        labCity = true;
        library.logStep('City Textbox displayed');
        console.log('City Textbox ' + labCity);
      });
      const LabZipCodeTxtbx = element(by.xpath(LabZipCodeTextbox));
      LabZipCodeTxtbx.isDisplayed().then(function () {
        LabZipCode = true;
        library.logStep('Zip Code Textbox displayed');
        console.log('Zip code Textbox ' + LabZipCode);
      });
      const LabContactEmailTxtbx = element(by.xpath(LabContactEmailTextbox));
      LabContactEmailTxtbx.isDisplayed().then(function () {
        LabContactEmail = true;
        library.logStep('Lab Contact Email Textbox displayed');
        console.log('Lab Contact Email Textbox ' + LabContactEmail);
      });
      const LabContactFirstTxtbx = element(by.xpath(LabContactFirstTextbox));
      LabContactFirstTxtbx.isDisplayed().then(function () {
        LabContactFirstName = true;
        library.logStep('Lab Contact First Textbox displayed');
        console.log('Lab Contact First Textbox ' + LabContactFirstName);
      });
      const LabContactLastTxtbx = element(by.xpath(LabContactLastTextbox));
      LabContactLastTxtbx.isDisplayed().then(function () {
        LabContactLastName = true;
        library.logStep('Lab Contact last Textbox displayed');
        console.log('Lab Contact last Textbox ' + LabContactLastName);
      });
      if (LocationInformationlabel === true && shiptoaccount === true && soldtoaccount === true && LabName === true && legacyprimary === true && addressline1 === true && addressline2 === true && labcountry === true && labState === true && labCity === true && LabZipCode === true &&
        LabContactEmail === true && LabContactFirstName === true && LabContactLastName === true) {
        status = true;
        resolve(status);
      }
    });
  }

  clickCloseButton_FromAddLocationForm() {
    let status = false;
    const dateValue = null;

    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(AddLocationForm_CloseButton));
      closeBtn.isDisplayed().then(function () {
        library.clickJS(closeBtn);
        status = true;
        resolve(status);
      });
    });
  }

  verifyFieldLengthForShipTo1(ShipTo) {
    const errorMsg = './/*[@id="shipTo"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(shipToAccountTbx)).isDisplayed().then(function () {
        element(by.xpath(shipToAccountTbx)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory shipTo# field");
          console.log("Error message is displayed for the mandatory shipTo# field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory shipTo# field");
          console.log("Error message is not displayed for the mandatory shipTo# field");
          resolve(false);
        }
        element(by.xpath(shipToAccountTbx)).sendKeys(ShipTo);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the shipTo# more than 20 length");
          console.log("Error message is displayed for the ShipToAccount# more than 20 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the shipTo# more than 20 length");
          console.log("Error message is not displayed for the shipTo# more than 20 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForSoldTo(SoldToTxt) {
    const errorMsg = './/*[@id="soldTo"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(soldToAccountTbx)).isDisplayed().then(function () {
        element(by.xpath(soldToAccountTbx)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory soldTo# field");
          console.log("Error message is displayed for the mandatory soldTo# field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory soldTo# field");
          console.log("Error message is not displayed for the mandatory soldTo# field");
          resolve(false);
        }
        element(by.xpath(soldToAccountTbx)).sendKeys(SoldToTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the soldTo# more than 20 length");
          console.log("Error message is displayed for the ShipToAccount# more than 20 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the soldTo# more than 20 length");
          console.log("Error message is not displayed for the soldTo# more than 20 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForLabName(labNameTxt) {
    const errorMsg = '//*[@id="labLocationName"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabNameTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabNameTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory lab name field");
          console.log("Error message is displayed for the mandatory lab name field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory lab name field");
          console.log("Error message is not displayed for the mandatory lab name field");
          resolve(false);
        }
        element(by.xpath(LabNameTextbox)).sendKeys(labNameTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the lab name more than 200 length");
          console.log("Error message is displayed for the lab name more than 200 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the lab name more than 200 length");
          console.log("Error message is not displayed for the lab name more than 200 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForLabAddress2(addressTxt) {
    return new Promise((resolve) => {
      const errorMsg = '//*[@id="labLocationAddressSecondary"]//following::mat-error[1]';
      this.verifyOptionalAddressField(AddressLine2Textbox, addressTxt, errorMsg);
      resolve(true);
    });
  }

  verifyFieldLengthForLabAddress(addressTxt) {
    const errorMsg = '//*[@id="labLocationAddress"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(AddressLine1Textbox)).isDisplayed().then(function () {
        element(by.xpath(AddressLine1Textbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory address field");
          console.log("Error message is displayed for the mandatory address field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory address field");
          console.log("Error message is not displayed for the mandatory address field");
          resolve(false);
        }
        element(by.xpath(AddressLine1Textbox)).sendKeys(addressTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the address more than 100 length");
          console.log("Error message is displayed for the address more than 100 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the address more than 100 length");
          console.log("Error message is not displayed for the address more than 100 length");
          resolve(false);
        }
      });
    });
  }

  verifyFieldLengthForLabCity(cityTxt) {
    const errorMsg = './/input[@id="labLocationCity"]//following::mat-error[1]';
    return new Promise((resolve) => {
      element(by.xpath(LabCityTextbox)).isDisplayed().then(function () {
        element(by.xpath(LabCityTextbox)).sendKeys(protractor.Key.TAB);
        const err1 = element(by.xpath(errorMsg));
        if (err1.isDisplayed()) {
          library.logStep("Error message is displayed for the mandatory account city field");
          console.log("Error message is displayed for the mandatory account city field");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the mandatory account city field");
          console.log("Error message is not displayed for the mandatory account city field");
          resolve(false);
        }
        element(by.xpath(LabCityTextbox)).sendKeys(cityTxt);
        const err2 = element(by.xpath(errorMsg));
        if (err2.isDisplayed()) {
          library.logStep("Error message is displayed for the account city more than 60 length");
          console.log("Error message is displayed for the account name more than 60 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the account city more than 60 length");
          console.log("Error message is not displayed for the account city more than 60 length");
          resolve(false);
        }
      });
    });
  }

  addOrderNumber() {
    let status = false;
    return new Promise((resolve) => {
      element(by.xpath(OrderNumberTextbox)).sendKeys("12345");
      console.log("Order Number Entered");
      library.logStep("Order Number Entered");
      status = true;
      resolve(status);
    });
  }

  verifyInstalledProductField_ForEssentialsOption_InUnityNextTierDrpDwn(Option1) {
    let displayed = true;
    return new Promise((resolve) => {
      const ele = element(by.xpath(UnityNextTierDropdown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//span[contains(text(),"' + Option1 + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("In Unity Next Tier Drop down field 'Essentials' option  is displayed and clicked", "In Unity Next Tier Drop down field 'Essentials' option  is displayed and clicked");
        const InstalledProduct = element(by.xpath(UN_InstalledProductField));
        InstalledProduct.isDisplayed().then(function () {
          console.log("After selecting Essentials option from Unity Next Tier drp down , Install Product# field displayed");
          library.logStepWithScreenshot("After selecting Essentials option from Unity Next Tier drp down , Install Product# field displayed", "After selecting Essentials option from Unity Next Tier drp down , Install Product# field displayed");
        })

        resolve(displayed);
      }).catch(function () {
        library.logFailStep("In Unity Next Tier Drop down field 'Essentials' option is not displayed");
        resolve(false);
      });
    })
  }


  verifyInstalledProductField_ForUNConnectOption_InConnectivityTierDrpDwn(Option1) {
    let displayed = true;
    return new Promise((resolve) => {
      const ele = element(by.xpath(ConnectivityTierDropdown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//span[contains(text(),"' + Option1 + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("In Connectivity Tier Drop down field 'UN Connect' option  is displayed and clicked", "In Connectivity  Tier Drop down field 'UN Connect' option  is displayed and clicked");
        const InstalledProduct = element(by.xpath(C_InstalledProductField));
        InstalledProduct.isDisplayed().then(function () {
          console.log("After selecting UN Connect option from Connectivity Tier drp down , Install Product# field displayed");
          library.logStepWithScreenshot("After selecting UN Connect option from Connectivity Tier drp down , Install Product# field displayed", "After selecting UN Connect option from Connectivity Tier drp down , Install Product# field displayed");
        })

        resolve(displayed);
      })
    })
  }

  verifyInstalledProductField_ForYesOption_InQCLotViewerDrpDwn(Option1) {
    let displayed = true;
    return new Promise((resolve) => {
      const ele = element(by.xpath(QCLotViewerDropdown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//span[contains(text(),"' + Option1 + '")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("In QC Lot Viewer Drop down field 'Yes' option  is displayed and clicked", "In QC Lot Viewer Drop down field 'Yes' option  is displayed and clicked");
        const InstalledProduct = element(by.xpath(QC_InstalledProductField));
        InstalledProduct.isDisplayed().then(function () {
          console.log("After selecting Yes option from QC Lot Viewer drp down , Install Product# field displayed");
          library.logStepWithScreenshot("After selecting Yes option from QC Lot Viewer drp down , Install Product# field displayed", "After selecting Yes option from QC Lot Viewer drp down , Install Product# field displayed");
        });
        resolve(displayed);
      });
    });
  }

  verifyTranformerDropdownIsDisabled_ForUNConnect() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const ele = element(by.xpath(ConnectivityTierDropdown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//span[contains(text(),"UN Connect")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("In Connectivity Tier Drop down field 'UN Connect' option  is displayed and clicked", "In Connectivity  Tier Drop down field 'UN Connect' option  is displayed and clicked");
        const ele1 = element(by.xpath("//mat-select[@id='TransformersList']"));
        ele1.getAttribute('aria-disabled').then(function (value) {
          console.log("the attribute value is " + value);
          if (value.includes('true')) {
            library.logStepWithScreenshot("Transformer Dropdown is Disabled.", "Transformer Dropdown is Disabled.");
            resolve(true);
          } else {
            library.logFailStep("Transformer Dropdown is Enabled");
            resolve(false);
          }
        });
      });
    });
  }

  verifyTranformerDropdownIsEnabled_ForUNUpload() {
    return new Promise((resolve) => {
      const ele = element(by.xpath(ConnectivityTierDropdown));
      library.scrollToElement(ele);
      library.clickJS(ele);
      const optionEle = element(by.xpath('//span[contains(text(),"UN Upload")]'));
      optionEle.isDisplayed().then(function () {
        library.clickJS(optionEle);
        library.logStepWithScreenshot("In Connectivity Tier Drop down field 'UN Upload' option  is displayed and clicked", "In Connectivity  Tier Drop down field 'UN Upload' option  is displayed and clicked");
        const ele1 = element(by.xpath("//mat-select[@id='TransformersList']"));
        ele1.getAttribute('aria-disabled').then(function (value) {
          if (value.includes('false')) {
            library.logStepWithScreenshot("Transformer Dropdown is Enabled.", "Transformer Dropdown is Enabled.");
            resolve(true);
          } else {
            library.logFailStep("Transformer Dropdown is disabled");
            resolve(false);
          }
        });
      });
    });
  }

  verifyAssignDateValue_AddLocation() {
    let status = false;
    let dateValue = null;
    return new Promise((resolve) => {
      const assignDate = element(by.xpath(AssignDate_picker));
      assignDate.isDisplayed().then(function () {
        assignDate.getAttribute('value').then(function (text) {
          dateValue = text;
          console.log("Assign Date Value is " + dateValue);
        });
      }).then(function () {
        const today = new Date();
        let date;
        const dd = String(today.getDate());
        const mm = String(today.getMonth() + 1);
        const yyyy = today.getFullYear();
        date = mm + '/' + dd + '/' + yyyy;
        if (dateValue === date) {
          status = true;
          console.log("Todays date displayed in Assign Date " + dateValue);
          library.logStepWithScreenshot("Todays date displayed in Assign Date", "Todays date displayed in Assign Date");
          resolve(status);
        }
      });
    });
  }

  verifyLicenseDropdownValues_AddLocation() {
    let values = false;
    return new Promise((resolve) => {
      const licenseDD = element(by.xpath(LicenseLengthDropDown));
      library.clickJS(licenseDD);
      element.all(by.xpath(dropdownoptions)).count().then(function (count) {
        if (count === 72) {
          library.logStep('Total drop down values are 72');
          const licenseitems = new Map<string, string>();
          const lastmonth = '72 Months';
          const firstmonth = '1 Month';
          licenseitems.set(onemonth, lastmonth);
          licenseitems.set(twomonth, firstmonth);
          licenseitems.forEach(function (key, value) {
            const itemkey = element(by.xpath(value));
            const itemvalue = key;
            itemkey.getText().then(function (text) {
              if (text.includes(itemvalue)) {
                library.logStep('Drop down values-:' + text);
                values = true;
                resolve(values);
              } else {
                values = false;
                resolve(values);
              }
            });
          });
        }
      });
    });
  }

  addLocationValidDetails(jsonDataNew) {
    return new Promise((resolve) => {
      element(by.xpath(OrderNumberTextbox)).sendKeys("12345");
      console.log("Order Number Entered");
      library.logStep("Order Number Entered");
      const ele1 = element(by.xpath(UnityNextTierDropdown_Select));
      ele1.isDisplayed().then(function () {
        library.scrollToElement(ele1);
        library.clickJS(ele1);
        const cs = element(by.xpath('//span[contains(text(),"' + jsonDataNew.UnityNextTier_Option + '")]'));
        library.clickJS(cs);
        console.log("Unity Next Tier selected");
        library.logStep("Unity Next Tier selected");
        element(by.xpath(UN_InstalledProductField)).sendKeys(jsonDataNew.UN_InstalledProductField);
        console.log("UN Installed Product# entered");
        library.logStep("UN Installed Product# entered");
      });
      const ele = element(by.xpath(ConnectivityTierDropdown_Select));
      ele.isDisplayed().then(function () {
        library.scrollToElement(ele);
        library.clickJS(ele);
        const cs1 = element(by.xpath('//span[contains(text(),"' + jsonDataNew.ConnectivityTier_Option2 + '")]'));
        library.clickJS(cs1);
        console.log("Connectivity Tier selected");
        library.logStep("Connectivity Tier selected");
        element(by.xpath(C_InstalledProductField)).sendKeys(jsonDataNew.CN_InstalledProductField);
        console.log("CN Installed Product# entered");
        library.logStep("CN Installed Product# entered");
      });
      const ele2 = element(by.xpath(QCLotViewerDropdown_Select));
      ele2.isDisplayed().then(function () {
        library.scrollToElement(ele2);
        library.clickJS(ele2);
        const cs2 = element(by.xpath('//span[contains(text(),"' + jsonDataNew.QCLotViewer_Option + '")]'));
        library.clickJS(cs2);
        console.log("QCLotViewer Tier selected");
        library.logStep("QCLotViewer Tier selected");
        element(by.xpath(QC_InstalledProductField)).sendKeys(jsonDataNew.QC_InstalledProductField);
        console.log("QC Installed Product# entered");
        library.logStep("QC Installed Product# entered");
      });
      const ele3 = element(by.xpath(Add_OnsDropdown));
      ele3.isDisplayed().then(function () {
        library.scrollToElement(ele3);
        library.clickJS(ele3);
        const cs3 = element(by.xpath('.//mat-select[@id="AddOns"]//following::span[contains(text(),"' + jsonDataNew.Add_ons + '")]'));
        library.clickJS(cs3);
        console.log("Add-onsr selected");
        library.logStep("Add-ons selected");
      });
      const ele4 = element(by.xpath(CrossOverStudyDropDown_Select));
      ele4.isDisplayed().then(function () {
        library.scrollToElement(ele4);
        library.clickJS(ele4);
        const cs4 = element(by.xpath('.//mat-select[@id="crossoverStudy"]//following::span[contains(text(),"' + jsonDataNew.Crossoverstudy + '")]'));
        library.clickJS(cs4);
        console.log("Crossoverstudy selected");
        library.logStep("Crossoverstudy selected");
      });
      const ele5 = element(by.xpath(LicenseLengthDropDown_Select));
      ele5.isDisplayed().then(function () {
        library.scrollToElement(ele5);
        library.clickJS(ele5);
        const cs5 = element(by.xpath('//span[contains(text(),"' + jsonDataNew.LicenseLength + '")]'));
        library.clickJS(cs5);
        console.log("LicenseLength selected");
        library.logStep("LicenseLength selected");
      });
      element(by.xpath(NumberOfUsersTextbox)).sendKeys(jsonDataNew.NumberOfUsers);
      console.log("NoOfUsers entered");
      library.logStep("NoOfUsers entered");
      element(by.xpath(shipToAccountTbx)).sendKeys(jsonDataNew.ShipTo);
      console.log("ShipTo entered");
      library.logStep("ShipTo entered");
      element(by.xpath(soldToAccountTbx)).sendKeys(jsonDataNew.SoldToSearch);
      console.log("SoldToSearch entered");
      library.logStep("SoldToSearch entered");
      element(by.xpath(LabNameTextbox)).sendKeys(jsonDataNew.LabName + "-" + Math.floor(Math.random() * (100 + 1)));
      console.log("LabName entered");
      library.logStep("LabName entered");
      element(by.xpath(AddressLine1Textbox)).sendKeys(jsonDataNew.AddressCreateAccount);
      console.log("AddressCreateAccount entered");
      library.logStep("AddressCreateAccount entered");
      const count = element(by.xpath(LabCountryTextbox));
      count.isDisplayed().then(function () {
        library.scrollToElement(count);
        library.clickJS(count);
        const op1 = element(by.xpath('//span[contains(text(),"Albania")]'));
        library.clickJS(op1);
        console.log("Country selected");
        library.logStep("Country selected");
      });
      element(by.xpath(LabStateTextbox)).sendKeys(jsonDataNew.StateCreateAccount);
      console.log("StateCreateAccount entered");
      library.logStep("StateCreateAccount entered");
      element(by.xpath(LabCityTextbox)).sendKeys(jsonDataNew.CityCreateAccount);
      console.log("CityCreateAccount entered");
      library.logStep("CityCreateAccount entered");
      element(by.xpath(LabZipCodeTextbox)).sendKeys(jsonDataNew.ZipCreateAccount);
      console.log("ZipCreateAccount entered");
      library.logStep("ZipCreateAccount entered");
      element(by.xpath(LabContactFirstTextbox)).sendKeys(jsonDataNew.LabContactFirstName);
      console.log("LabContactFirstName entered");
      library.logStep("LabContactFirstName entered");
      element(by.xpath(LabContactLastTextbox)).sendKeys(jsonDataNew.LabContactLastName);
      console.log("LabContactLastName entered");
      library.logStep("LabContactLastName entered");
      element(by.xpath(LabContactEmailTextbox)).sendKeys(jsonDataNew.LabContactEmail + Math.floor(Math.random() * (100 + 1)));
      console.log("LabContactEmail entered");
      library.logStep("LabContactEmail entered");
      library.logStepWithScreenshot('Lab Details to create lab are added', 'Details are added');
      resolve(true);
    });
  }

  clickAddLocationButton_OnAddLocationForm() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const ADDLOcationBtn = findElement(locatorType.XPATH, ADDLocationFormButton);
      ADDLOcationBtn.isDisplayed().then(function () {
        library.clickJS(ADDLOcationBtn);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(ADDLOcationBtn), 10000);

        library.logStep("Account created successfully");
        resolve(true);
      }).catch(function () {
        library.logFailStep('Add Location btn is not displayed');
        resolve(false);
      });
    });
  }

  clickFirstLocation() {
    let flag = true;
    return new Promise((resolve) => {
      const firstLocationLnk = element(by.xpath(firstLocationLink));
      firstLocationLnk.isDisplayed().then(function () {
        firstLocationLnk.click();
        library.logStep("First Location Link is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("Unable to see First Location Link");
        flag = false;
        resolve(flag);
      });
    });
  }

  selectUNTierAndInstalledProduct(jsonDataNew) {
    let status = false;
    return new Promise((resolve) => {
      const ele1 = element(by.xpath(UnityNextTierDropdown_Select));
      ele1.isDisplayed().then(function () {
        library.scrollToElement(ele1);
        library.clickJS(ele1);
        const cs = element(by.xpath('//span[text()="' + jsonDataNew.UnityNextTier_Option + '"]'));
        library.clickJS(cs);
        console.log("Unity Next Tier updated");
        library.logStep("Unity Next Tier updated");
        if (jsonDataNew.UnityNextTier_Option == " Essentials") {
          findElement(locatorType.XPATH, UN_InstalledProductField).clear();
          element(by.xpath(UN_InstalledProductField)).sendKeys(jsonDataNew.UN_InstalledProductField);
          console.log("UN Installed Product# updated");
          library.logStep("UN Installed Product# updated");
          status = true;
          resolve(status);
        } else {
          library.logStep('Cannot enter Installed Product value when Unity Tier ' + jsonDataNew.UnityNextTier_Option);
          status = true;
          resolve(status);
        }
      });
    });
  }

  selectConnTierAndInstalledProduct(jsonDataNew) {
    let status = false;
    return new Promise((resolve) => {
      const ele1 = element(by.xpath(ConnectivityTierDropdown_Select));
      ele1.isDisplayed().then(function () {
        library.scrollToElement(ele1);
        library.clickJS(ele1);
        const cs = element(by.xpath('//span[text()="' + jsonDataNew.ConnectivityTier_Option2 + '"]'));
        library.clickJS(cs);
        console.log("Connectivity Tier updated");
        library.logStep("Connectivity Tier updated");
        if (jsonDataNew.ConnectivityTier_Option2 == " UN Connect") {
          findElement(locatorType.XPATH, C_InstalledProductField).clear();
          element(by.xpath(C_InstalledProductField)).sendKeys(jsonDataNew.CN_InstalledProductField);
          console.log("Connectivity Installed Product# updated");
          library.logStep("Connectivity Installed Product# updated");
          status = true;
          resolve(status);
        } else {
          library.logStep('Cannot enter Installed Product value when Connectivity Tier ' + jsonDataNew.ConnectivityTier_Option2);
          status = true;
          resolve(status);
        }
      });
    });
  }

  selectQCTierAndInstalledProduct(jsonDataNew) {
    let status = false;
    return new Promise((resolve) => {
      const ele1 = element(by.xpath(QCLotViewerDropdown_Select));
      ele1.isDisplayed().then(function () {
        library.scrollToElement(ele1);
        library.clickJS(ele1);
        const cs = element(by.xpath('//mat-option/span[text()="' + jsonDataNew.QCLotViewer_Option + '"]'));
        library.clickJS(cs);
        console.log("QC Lot Viewer updated");
        library.logStep("QC Lot Viewer updated");
        if (jsonDataNew.QCLotViewer_Option == "Yes") {
          findElement(locatorType.XPATH, QC_InstalledProductField).clear();
          element(by.xpath(QC_InstalledProductField)).sendKeys(jsonDataNew.QC_InstalledProductField);
          console.log("CN Installed Product# updated");
          library.logStep("CN Installed Product# updated");
          status = true;
          resolve(status);
        } else {
          library.logStep('Cannot enter Installed Product value when QC Lot Viewer ' + jsonDataNew.QCLotViewer_Option);
          status = true;
          resolve(status);
        }
      });
    });
  }

  updateLocationDetails(jsonDataNew) {
    return new Promise((resolve) => {
      // Order
      const orderTxtBx = findElement(locatorType.XPATH, OrderNumberTextbox);
      library.scrollToElement(orderTxtBx);
      orderTxtBx.clear();
      orderTxtBx.sendKeys(jsonDataNew.Order);
      console.log("Order Number Updated");
      library.logStep("Order Number Updated");
      // AddOns
      const ele3 = element(by.xpath(Add_OnsDropdown));
      ele3.isDisplayed().then(function () {
        library.scrollToElement(ele3);
        library.clickJS(ele3);
        const cs3 = element(by.xpath('.//mat-option/span[contains(text(),"' + jsonDataNew.Add_ons + '")]'));
        library.clickJS(cs3);
        console.log("Add-ons updated");
        library.logStep("Add-ons updated");
        library.waitForPage();
      });
      // CrossOver
      const ele4 = element(by.xpath(CrossOverStudyDropDown_Select));
      ele4.isDisplayed().then(function () {
        library.clickJS(ele4);
        const cs4 = element(by.xpath('.//mat-option/span[contains(text(),"' + jsonDataNew.Crossoverstudy + '")]'));
        library.clickJS(cs4);
        console.log("Crossoverstudy updated");
        library.logStep("Crossoverstudy updated");
        library.waitForPage();
      });
      // License
      const ele5 = element(by.xpath(LicenseLengthDropDown_Select));
      ele5.isDisplayed().then(function () {
        library.scrollToElement(ele5);
        library.clickJS(ele5);
        const cs5 = element(by.xpath('.//mat-option/span[contains(text(),"' + jsonDataNew.LicenseLength + '")]'));
        library.clickJS(cs5);
        console.log("LicenseLength updated");
        library.logStep("LicenseLength updated");
        library.waitForPage();
      });
      // Number of Users
      const NumberOfUsersTxtbx = element(by.xpath(NumberOfUsersTextbox));
      NumberOfUsersTxtbx.clear();
      NumberOfUsersTxtbx.sendKeys(jsonDataNew.NumberOfUsers);
      console.log("NoOfUsers updated");
      library.logStep("NoOfUsers updated");
      // Ship to
      const shipToTxtBx = element(by.xpath(shipToAccountTbx));
      shipToTxtBx.clear();
      shipToTxtBx.sendKeys(jsonDataNew.ShipTo);
      console.log("ShipTo updated");
      library.logStep("ShipTo updated");
      // Sold to
      const soldToTxtBx = element(by.xpath(soldToAccountTbx));
      soldToTxtBx.clear();
      soldToTxtBx.sendKeys(jsonDataNew.SoldTo);
      console.log("SoldToSearch updated");
      library.logStep("SoldToSearch updated");
      // lab name
      const labNameTxtBx = element(by.xpath(LabNameTextbox));
      labNameTxtBx.clear();
      labNameTxtBx.sendKeys(jsonDataNew.LabName);
      console.log("LabName updated");
      library.logStep("LabName updated");
      // Address line 1
      const AddressLine1Txtbx = element(by.xpath(AddressLine1Textbox));
      library.scrollToElement(AddressLine1Txtbx);
      AddressLine1Txtbx.clear();
      AddressLine1Txtbx.sendKeys(jsonDataNew.AddressCreateAccount);
      console.log("Address Line 1 updated");
      library.logStep("Address Line 1 updated");
      // Address line 2
      const AddressLine2Txtbx = element(by.xpath(AddressLine2Textbox));
      AddressLine2Txtbx.clear();
      AddressLine2Txtbx.sendKeys(jsonDataNew.AddressCreateAccount2);
      console.log("Address Line 2 updated");
      library.logStep("Address Line 2 updated");
      // Country
      const country = element(by.xpath(LabCountryTextbox));
      country.isDisplayed().then(function () {
        library.scrollToElement(country);
        library.clickJS(country);
        const op1 = element(by.xpath('//span[contains(text(),"' + jsonDataNew.Country + '")]'));
        library.scrollToElement(op1);
        library.clickJS(op1);
        console.log("Country updated");
        library.logStep("Country updated");
      });
      // State
      const stateTxtBx = element(by.xpath(LabStateTextbox));
      stateTxtBx.clear();
      stateTxtBx.sendKeys(jsonDataNew.StateCreateAccount);
      console.log("StateCreateAccount updated");
      library.logStep("StateCreateAccount updated");
      // City
      const cityTxtBx = element(by.xpath(LabCityTextbox));
      cityTxtBx.clear();
      cityTxtBx.sendKeys(jsonDataNew.CityCreateAccount);
      console.log("CityCreateAccount updated");
      library.logStep("CityCreateAccount updated");
      // Zip
      const zipTxtBx = element(by.xpath(LabZipCodeTextbox));
      zipTxtBx.clear();
      zipTxtBx.sendKeys(jsonDataNew.ZipCreateAccount);
      console.log("ZipCreateAccount updated");
      library.logStep("ZipCreateAccount updated");
      // email
      const emailTxtBx = element(by.xpath(LabContactEmailTextbox));
      library.scrollToElement(emailTxtBx);
      emailTxtBx.clear();
      emailTxtBx.sendKeys(jsonDataNew.LabContactEmail);
      console.log("LabContactEmail updated");
      library.logStep("LabContactEmail updated");
      // First Name
      const firstNameTxtBx = element(by.xpath(LabContactFirstTextbox));
      firstNameTxtBx.clear();
      firstNameTxtBx.sendKeys(jsonDataNew.LabContactFirstName);
      console.log("LabContactFirstName updated");
      library.logStep("LabContactFirstName updated");
      // Last Name
      const lastNameTxtBx = element(by.xpath(LabContactLastTextbox));
      lastNameTxtBx.clear();
      lastNameTxtBx.sendKeys(jsonDataNew.LabContactLastName);
      console.log("LabContactLastName updated");
      library.logStep("LabContactLastName updated");
      library.logStepWithScreenshot('Lab Details to create lab are updated', 'Details are updated');
      resolve(true);
    });
  }

  clickUpdateLocationButton() {
    let flag = true;
    return new Promise((resolve) => {
      const updateLocationBtn = element(by.xpath(updateLocationButton));
      updateLocationBtn.isDisplayed().then(function () {
        library.clickJS(updateLocationBtn);
        library.logStep("Update Location Button is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("Unable to see Update Location Button");
        flag = false;
        resolve(flag);
      });
    });
  }

  clickCancelUpdateButton() {
    let flag = true;
    return new Promise((resolve) => {
      const updateLocationCancelBtn = element(by.xpath(updateLocationCancelButton));
      updateLocationCancelBtn.isDisplayed().then(function () {
        library.clickJS(updateLocationCancelBtn);
        library.logStep("Update Location Cancel Button is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("Unable to see Update Location Cancel Button");
        flag = false;
        resolve(flag);
      });
    });
  }

  clickCloseUpdateLocation() {
    let flag = true;
    return new Promise((resolve) => {
      const closeUpdateLocation = element(by.xpath(closeUpdateLocationPopup));
      closeUpdateLocation.isDisplayed().then(function () {
        library.clickJS(closeUpdateLocation);
        library.logStep("Update Location popup Close Button is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("Unable to see Update Location popup Close Button");
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyUNIPFValue(unityNextTierValue, unityNextInstalledProductValue) {
    let flag = true;
    return new Promise((resolve) => {
      if (unityNextTierValue == "None ") {
        library.logStepWithScreenshot("Installed Product Field will not be displayed", "UNIPFNotDisplayedPass");
        flag = true;
        resolve(flag);
      } else {
        const UNIPF = element(by.xpath(UN_InstalledProductField));
        UNIPF.isDisplayed().then(function () {
          library.scrollToElement(UNIPF);
          UNIPF.getAttribute("value").then(function (text) {
            if (text == unityNextInstalledProductValue) {
              library.logStepWithScreenshot(unityNextInstalledProductValue + ' is displayed.', 'UNIPFValuesDisplayed');
              flag = true;
              resolve(flag);
            }
            else {
              library.logFailStep(unityNextInstalledProductValue + ' is not displayed');
              flag = false;
              resolve(flag);
            }
          });
        })
      }
    });
  }

  verifyConnIPFValue(connTierValue, connInstalledProductValue) {
    let flag = true;
    return new Promise((resolve) => {
      if (connTierValue == " None " || connTierValue == " UN Upload") {
        library.logStepWithScreenshot("Installed Product Field will not be displayed", "CNIPFNotDisplayedPass");
        flag = true;
        resolve(flag);
      } else {
        const CNIPF = element(by.xpath(C_InstalledProductField));
        CNIPF.isDisplayed().then(function () {
          library.scrollToElement(CNIPF);
          CNIPF.getAttribute("value").then(function (text) {
            if (text == connInstalledProductValue) {
              library.logStepWithScreenshot(connInstalledProductValue + ' is displayed.', 'CNIPFValuesDisplayed');
              flag = true;
              resolve(flag);
            }
            else {
              library.logFailStep(connInstalledProductValue + ' is not displayed');
              flag = false;
              resolve(flag);
            }
          });
        })
      }
    });
  }

  verifyQCIPFValue(QCTierValue, qcInstalledProductValue) {
    let flag = true;
    return new Promise((resolve) => {
      if (QCTierValue == "No") {
        library.logStepWithScreenshot("Installed Product Field will not be displayed", "QCIPFNotDisplayedPass");
        flag = true;
        resolve(flag);
      } else {
        const QCIPF = element(by.xpath(QC_InstalledProductField));
        QCIPF.isDisplayed().then(function () {
          library.scrollToElement(QCIPF);
          QCIPF.getAttribute("value").then(function (text) {
            if (text == qcInstalledProductValue) {
              library.logStepWithScreenshot(qcInstalledProductValue + ' is displayed.', 'QCIPFValuesDisplayed');
              flag = true;
              resolve(flag);
            }
            else {
              library.logFailStep(qcInstalledProductValue + ' is not displayed');
              flag = false;
              resolve(flag);
            }
          });
        })
      }
    });
  }

  verifyUpdatedTextFieldValuesLocation(jsonDataNew) {
    let status = false;
    return new Promise((resolve) => {
      const expectedTextValues = new Map<string, string>();
      expectedTextValues.set(OrderNumberTextbox, jsonDataNew.Order);
      expectedTextValues.set(shipToAccountTbx, jsonDataNew.ShipTo);
      expectedTextValues.set(soldToAccountTbx, jsonDataNew.SoldTo);
      expectedTextValues.set(AddressLine1Textbox, jsonDataNew.AddressCreateAccount);
      expectedTextValues.set(AddressLine2Textbox, jsonDataNew.AddressCreateAccount2);
      expectedTextValues.set(LabStateTextbox, jsonDataNew.StateCreateAccount);
      expectedTextValues.set(LabCityTextbox, jsonDataNew.CityCreateAccount);
      expectedTextValues.set(LabZipCodeTextbox, jsonDataNew.ZipCreateAccount);
      expectedTextValues.set(LabContactFirstTextbox, jsonDataNew.LabContactFirstName);
      expectedTextValues.set(LabContactLastTextbox, jsonDataNew.LabContactLastName);
      expectedTextValues.forEach(function (key, value) {
        const field = element(by.xpath(value));
        library.scrollToElement(field);
        field.getAttribute('value').then(function (text) {
          console.log("text :" + text);
          if (text == key) {
            status = true;
            library.logStep(key + ' is displayed.');
            resolve(status);
          } else {
            status = false;
            library.logFailStep(key + ' is not displayed.');
            resolve(status);
          }
        });
      });
    });
  }

  verifyUpdatedDropdownValuesLocation(jsonDataNew) {
    let status = false;
    return new Promise((resolve) => {
      const expectedTextValues = new Map<string, string>();
      expectedTextValues.set('//span[text()="' + jsonDataNew.UNTO + '"]', "Unity-Next Tier Option value is correctly displayed");
      expectedTextValues.set('//span[text()="' + jsonDataNew.CTO + '"]', "Connectivity Tier Option value is correctly displayed");
      expectedTextValues.set('//span[text()="' + jsonDataNew.QCLotViewer_Option + '"]', "QC Lot Viewer Option value is correctly displayed");
      expectedTextValues.set('.//mat-select[@id="AddOns"]//following::span[contains(text(),"' + jsonDataNew.Add_ons + '")]', "Add-Ons Option value is correctly displayed");
      expectedTextValues.set('.//mat-select[@id="crossoverStudy"]//following::span[contains(text(),"' + jsonDataNew.Crossoverstudy + '")]', "CrossOver Study Option value is correctly displayed");
      expectedTextValues.set('.//mat-select[@id="labLocationCountryId"]//span[contains(text(),"' + jsonDataNew.Country + '")]', 'Country value is correctly displayed');
      expectedTextValues.forEach(function (key, value) {
        const ele = element(by.xpath(value));
        library.scrollToElement(ele);
        if (ele.isDisplayed()) {
          status = true;
          library.logStep(key);
          resolve(status);
        }
        else {
          status = false;
          library.logFailStep('');
          resolve(status);
        }
      });
    });
  }

  clickLocationTab() {
    let flag = true;
    return new Promise((resolve) => {
      const locationsTb = element(by.xpath(locationsTab));
      locationsTb.isDisplayed().then(function () {
        locationsTb.click();
        library.logStep("Location Tab is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("Unable to see Location Tab");
        flag = false;
        resolve(flag);
      });
    });
  }

  clickFirstLabLocationTab() {
    let flag = true;
    return new Promise((resolve) => {
      const locationsTabFrstLabName = element(by.xpath(locationsTabFirstLabName));
      locationsTabFrstLabName.isDisplayed().then(function () {
        library.clickJS(locationsTabFrstLabName);
        library.logStep("First Lab Location on Location Tab is clicked");
        resolve(flag);
      }).catch(function () {
        library.logFailStep("First Lab Location on Location Tab is clicked");
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnSaveAndExitBtn() {
    return new Promise((resolve) => {
      const saveAndExitBtnEle = element(by.xpath(saveAndExitBtn));
      saveAndExitBtnEle.isDisplayed().then(function () {
        library.clickJS(saveAndExitBtnEle)
        library.logStep('Save and Exit Btn is clicked');
        console.log('Save and Exit Btn is clicked');
        resolve(true);
      });
    });
  }

  verifyAddGroupOptionsAreDisplayed() {
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      uiElements.set('Add group link', addGroupLink);
      uiElements.set('Add group name field', groupNameInput);
      uiElements.set('Cancel button', cancelBtn);
      uiElements.set('Add group button', addGroupBtn);
      uiElements.set('Added group names', groupNames);
      uiElements.set('Added group dropdown', groupDropdown);
      uiElements.forEach(function (key, value) {
        const eleUI = element(by.xpath(key));
        if (eleUI.isDisplayed()) {
          library.logStep(value + ' is displayed.');
          if (value.includes("Add group link")) {
            library.click(element(by.xpath(key)));
          }
          resolve(true);
        } else {
          library.logStepWithScreenshot('Failed : ' + value + ' is not displayed.', 'Element not displayed');
          library.logFailStep('Failed : ' + value + ' is not displayed.');
          resolve(false);
        }
      });
    });
  }

  clickOnAddGroup() {
    return new Promise((resolve) => {
      element(by.xpath(addGroupLink)).isDisplayed().then(function () {
        library.click(element(by.xpath(addGroupLink)));
        console.log('Clicked on add group link');
        library.logStep('Clicked on add group link');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Add group link is not displayed', 'Element not displayed');
        library.logFailStep('Failed : Add group link is not displayed');
        resolve(false);
      });
    });
  }

  addGroupName(groupName) {
    return new Promise((resolve) => {
      element(by.xpath(groupNameInput)).isDisplayed().then(function () {
        element(by.xpath(groupNameInput)).sendKeys(groupName);
        console.log('Group Name is added : ' + groupName);
        library.logStep('Group Name is added : ' + groupName);
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Add group name field is not displayed', 'Element not displayed');
        library.logFailStep('Failed : Add group name field is not displayed');
        resolve(false);
      });
    });
  }

  clickOnAddGroupBtn() {
    return new Promise((resolve) => {
      element(by.xpath(addGroupBtn)).isDisplayed().then(function () {
        library.click(element(by.xpath(addGroupBtn)));
        console.log('Clicked on add group button');
        library.logStep('Clicked on add group button');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Add group Name field is not displayed', 'Element not displayed');
        library.logFailStep('Failed : Add group Name field is not displayed');
        resolve(false);
      });
    });
  }
  clickOnCloseGroupForm() {
    return new Promise((resolve) => {
      element(by.xpath(closeAddGroupForm)).isDisplayed().then(function () {
        library.click(element(by.xpath(closeAddGroupForm)));
        console.log('Clicked on close add group form button');
        library.logStep('Clicked on close add group form button');
        resolve(true);
      });
    });
  }

  verifyNewlyAddedGroupIsDisplayed(groupName) {
    return new Promise((resolve) => {
      const grps = element.all(by.xpath(groupNames));
      grps.getText().then(function (availableGroups) {
        if (availableGroups.includes(groupName)) {
          console.log(groupName + ' : is displayed in the list');
          library.logStep(groupName + ' : is displayed in the list');
          resolve(true);
        }
      }).catch(function () {
        library.logFailStep(groupName + ' : is not displayed in the list');
        library.logStepWithScreenshot(groupName + ' : is not displayed in the list', 'Group not displayed');
        resolve(false);
      });
    });
  }

  verifyFieldLengthForGroupName(groupName) {
    return new Promise((resolve) => {
      element(by.xpath(groupNameInput)).isDisplayed().then(function () {
        element(by.xpath(groupNameInput)).sendKeys(groupName);
        element(by.xpath(groupNameInput)).sendKeys(protractor.Key.TAB);
        const err = element(by.xpath(errorMsg1));
        if (err.isDisplayed()) {
          library.logStep("Error message is displayed for the group name more than 50 length");
          console.log("Error message is displayed for the group name more than 50 length");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the group name more than 50 length");
          library.logStepWithScreenshot("Failed : Error message is not displayed for the group name more than 50 length", "Msg displayed");
          console.log("Failed : Error message is not displayed for the group name more than 50 length");
          resolve(false);
        }
      });
    });
  }

  verifyErrorMsgForDuplicateGroup() {
    return new Promise((resolve) => {
      element(by.xpath(groupNameInput)).isDisplayed().then(function () {
        const err = element(by.xpath(errorMsg2));
        if (err.isDisplayed()) {
          library.logStep("Error message is displayed for the duplicate group name");
          console.log("Error message is displayed for the duplicate group name");
          resolve(true);
        } else {
          library.logFailStep("Failed : Error message is not displayed for the duplicate group name");
          library.logStepWithScreenshot("Failed : Error message is not displayed for the duplicate group name", "Msg displayed");
          console.log("Failed : Error message is not displayed for the duplicate group name");
          resolve(false);
        }
      });
    });
  }

  clickDeleteIconWithZeroLoc() {
    dashBoard.waitForScroll();
    let optionCount, zeroLocation = 0;
    return new Promise((resolve) => {
      element.all(by.xpath(locationsCount)).count().then(function (opt) {
        optionCount = opt;
      });
      element.all(by.xpath(locationsCount)).then(function (opt) {
        let zeroLocFound = true;
        for (let i = 0; i <= optionCount; i++) {
          if (opt[i]) {
            opt[i].getAttribute("innerText").then(function (LocCount) {
              if (LocCount === '0') {
                i++;
                if (zeroLocation === 0) {
                  zeroLocation = i;
                  element(by.xpath(accountName2 + '[' + i + ']')).getAttribute("innerText").then(function (actNameDeleted) {
                    AccoutManager.accountNameDeleted = actNameDeleted;
                    accountDeleted = actNameDeleted;
                    const delIcon = element(by.xpath(deleteLocIcont + '[' + i + ']/mat-icon'));
                    zeroLocFound = false;
                    library.clickJS(delIcon);
                    i = i + 1000;
                    resolve(true);
                  });
                }
              }
            });
          }
          if (zeroLocFound !== true) {
            break;
          }
        }
      });
      resolve(true);
    });
  }

  verifyAccountsDeleted() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const popup = element(by.xpath('.//*[@id="mat-dialog-1"]'));
      popup.isDisplayed().then(function () {
        library.logFailStep('Confirm popup is still visible');
        resolve(false);
      }).catch(function () {
        element.all(by.xpath('.//mat-row[@role="row"]')).then(function (num1) {
          let ele = './/a[text()="' + accountDeleted + '"]';
          element(by.xpath('.//a[text()="' + accountDeleted + '"]')).isDisplayed().then(function (flag) {
            // console.log("ele - ---- -- - - -"+ele);
            // console.log("flag - ---- -- - - -"+flag);
            library.logFailStep("Account is not deleted= " + accountDeleted);
            resolve(flag);
          }).catch(function () {
            library.logStepWithScreenshot("Account =" + accountDeleted + " deleted successfully", "deletedaccount")
            resolve(true);
          });
        });
      });
    });
  }

  clickOnCancelFromPopup() {
    return new Promise((resolve) => {
      const deleteLocCancelbtnEle = element(by.xpath(deleteLocCancelbtn));
      browser.wait(protractor.ExpectedConditions.visibilityOf(deleteLocCancelbtnEle), 30000);
      deleteLocCancelbtnEle.isDisplayed().then(function () {
        deleteLocCancelbtnEle.click();
        library.logStepWithScreenshot('delete Loc Cancel btn Ele is clicked', 'Clicked on Cancel Btn');
        resolve(true)
      });
      resolve(true);
    });
  }
  clickOnCloseFromPopup() {
    return new Promise((resolve) => {
      const deleteLocClosebtnEle = element(by.xpath(deleteLocCloseBtn));
      browser.wait(protractor.ExpectedConditions.visibilityOf(deleteLocClosebtnEle), 30000);
      deleteLocClosebtnEle.isDisplayed().then(function () {
        deleteLocClosebtnEle.click();
        library.logStepWithScreenshot('delete Loc Close btn Ele is clicked', 'Clicked on Close Btn');
        resolve(true)
      });
      resolve(true);
    });
  }

  verifyAccountsReloaded() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const popup = element(by.xpath('.//*[@id="mat-dialog-1"]'));
      popup.isDisplayed().then(function () {
        library.logFailStep('Confirm popup is still visible');
        resolve(false);
      }).catch(function () {
        element.all(by.xpath('.//mat-row[@role="row"]')).then(function (num1) {
          const numberOfAccounts = num1.length;
          if (numberOfAccounts === 20) {
            element(by.xpath('.//a[text()="' + accountDeleted + '"]')).isDisplayed().then(function () {
              resolve(true);
            }).catch(function () {
              resolve(false);
            });
          }
          else {
            resolve(false);
          }
        });
      });
    });
  }

  clickOnConfirmDeleteLocation() {
    return new Promise((resolve) => {
      const confirmDeletebtnEle = element(by.xpath(confirmDeletebtn));
      browser.wait(protractor.ExpectedConditions.visibilityOf(confirmDeletebtnEle), 30000);
      confirmDeletebtnEle.isDisplayed().then(function () {
        confirmDeletebtnEle.click();
        library.logStepWithScreenshot('confirm Delete btn Ele is clicked', 'Clicked on Confirm Btn');
        resolve(true)
      });
      resolve(true);
    });
  }

  clickLocationsButton() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const locAccountBtn = findElement(locatorType.XPATH, LocationsBtn);
      locAccountBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Account btn is displayed', 'Account btn is displayed');
        library.clickJS(locAccountBtn);
        resolve(true);
      }).catch(function () {
        library.logFailStep('Account btn is not displayed');
        resolve(false);
      });;
    });
  }

  verifyGroups(ExpectedGroups) {
    dashBoard.waitForPage();
    let flag = true;
    return new Promise((resolve) => {
      const grps = element.all(by.xpath(groupNames));
      grps.count().then(function (count) {
        for (var i = 1; i <= count; i++) {
          const grp = element(by.xpath("(" + groupNames + ")[" + i + "]"));
          grp.getAttribute("innerText").then(function (val) {
            if (ExpectedGroups.includes(val)) {
              console.log("matched");
            }
            else {
              flag = false;
            }
          })
        }
      }).catch(function () {
        library.logFailStep('group verification failed');
        resolve(false);
      });
      resolve(flag);
    });
  }

  clickGroupDropdown() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const grpdropdownBtn = findElement(locatorType.XPATH, groupDropdown);
      grpdropdownBtn.isDisplayed().then(function () {
        library.clickJS(grpdropdownBtn);
        library.logStepWithScreenshot('Group dropdown button is clicked', 'Group dropdown button is clicked');
        resolve(true);
      }).catch(function () {
        library.logFailStep('group dropdown button is not clicked');
        resolve(false);
      });
    });
  }

  verifyGroupsInDropdown(ExpectedGroups) {
    dashBoard.waitForPage();
    let flag = true;
    return new Promise((resolve) => {
      const grps = element.all(by.xpath(groupDropdownOptions));
      grps.count().then(function (count) {
        for (var i = 1; i <= count; i++) {
          const grp = element(by.xpath("(" + groupDropdownOptions + ")[" + i + "]"));
          grp.getAttribute("innerText").then(function (val) {
            if (ExpectedGroups.includes(val)) {
              console.log("matched");
            }
            else {
              flag = false;
            }
          })
        }
      }).catch(function () {
        library.logFailStep('group dropdown verification failed');
        resolve(false);
      });
      resolve(flag);
    });
  }

  selectGroup(grpname) {
    dashBoard.waitForScroll();
    return new Promise((resolve) => {
      const grpdropdown = element(by.xpath('.//span[contains(text(), "' + grpname + '")]'))
      grpdropdown.isDisplayed().then(function () {
        library.clickJS(grpdropdown);
        library.logStepWithScreenshot('Group selected = ' + grpname, 'Group selected');
        resolve(true);
      }).catch(function () {
        library.logFailStep('group selection failed');
        resolve(false);
      });
    });
  }

  verifyGroupLocations(ExpectedLocations) {
    dashBoard.waitForPage();
    let flag = true;
    return new Promise((resolve) => {
      const locations = element.all(by.xpath(groupLocations));
      locations.count().then(function (loc_count) {
        for (var i = 1; i <= loc_count; i++) {
          const location = element(by.xpath("(" + groupLocations + ")[" + i + "]"));
          location.getAttribute("innerText").then(function (val) {
            if (ExpectedLocations.includes(val)) {
              console.log("matched");
            }
            else {
              flag = false;
            }
          })
        }
      }).catch(function () {
        library.logFailStep('group comparison failed');
        resolve(false);
      });
      resolve(flag);
    });
  }

  verifyNoLocationsMsg() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const message = element(by.xpath(noLocMsg));
      message.isDisplayed().then(function (flag) {
        library.logStepWithScreenshot('No Locations found message is displayed', 'no loc msg');
        resolve(true);
      }).catch(function () {
        library.logFailStep('No Locations found message is not displayed');
        resolve(false);
      });
    });
  }
  verifyNoGroupsMsg() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const message = element(by.xpath(noGrpMsg));
      message.isDisplayed().then(function (flag) {
        library.logStepWithScreenshot('No groups found message is displayed', 'no grp msg');
        resolve(flag);
      }).catch(function () {
        library.logFailStep('No groups found message is not displayed');
        resolve(false);
      });
    });
  }

  clickLocationsNotPresentButton() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const locAccountBtn = findElement(locatorType.XPATH, LocationsNotPresentBtn);
      locAccountBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Account btn is displayed', 'Account btn is displayed');
        library.clickJS(locAccountBtn);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(locAccountBtn), 10000);
        resolve(true);
      }).catch(function () {
        library.logFailStep('Account btn is not displayed');
        resolve(false);
      });;
    });
  }

  verifyGroupDropdownPresent() {
    dashBoard.waitForScroll();
    return new Promise((resolve) => {
      const grpdropdownBtn = element(by.xpath(groupDropdown));
      grpdropdownBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Group dropdown is displayed', 'Group dropdown is displayed');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('group dropdown is not displayed', 'grp dropdown not displayed');
        resolve(false);
      });
    });
  }

  verifyPaginationForLocations() {
    dashBoard.waitForScroll();
    let flag = false;
    return new Promise((resolve) => {
      element.all(by.xpath(paginationbtns)).count().then(function (ct) {
        if (ct >= 2) {
          flag = true;
          resolve(true);
        } else {
          flag = false;
          resolve(false);
        }
      }).catch(function () {
        library.logFailStep('Paginations on locations verification failed');
        resolve(false);
      });
    });
  }

  clickNth_LocationsButton(num) {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const locAccountBtn = element(by.xpath('(.//span[contains(text(), "Locations")])[' + num + ']'));
      locAccountBtn.isDisplayed().then(function () {
        library.logStepWithScreenshot('Account location btn is displayed', 'Account location btn is displayed');
        library.clickJS(locAccountBtn);
        browser.wait(protractor.ExpectedConditions.invisibilityOf(locAccountBtn), 10000);
        resolve(true);
      }).catch(function () {
        library.logFailStep('Account btn is not displayed');
        resolve(false);
      });
    });
  }

  navigateToAccountManagement() {
    let status = false;
    return new Promise((resolve) => {
      const gear = element(by.xpath(gearIcon));
      const accountManagement = element(by.xpath(accountManagementOpt));
      library.waitForElement(gear);
      library.clickJS(gear);
      library.logStep("Clicked on gear icon");
      browser.sleep(3000);
      library.waitForElement(accountManagement);
      library.clickJS(accountManagement);
      library.logStep("Clicked on Account management option");
      browser.sleep(2000)
      // console.log('Clicked on account management');
      status = true;
      resolve(status);
    });
  }

  verifyAccountManagementPageDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const pageHeader = findElement(locatorType.XPATH, accountManagementHeader);
      pageHeader.isDisplayed().then(function () {
        status = true;
        library.logStep("Account Management Page displayed");
        resolve(status);
      });
    });
  }

  verfyLocationButton() {
    return new Promise((resolve) => {
      let status = false;
      const accounts = element.all(by.xpath(accountsTableRows))
      accounts.count().then(function (count) {
        console.log(count);
        let i;
        for (i = 1; i <= count; i++) {
          const location = element(by.xpath(accountsTableRows + "[" + i + "]" + locationsBtn));
          location.isDisplayed().then(function () {
          }).catch(function () {
            library.logFailStep("Location button not present for an account")
            status = false;
            resolve(status);
          });
        }
      }).then(function () {
        library.logStepWithScreenshot("Location button present for all the accounts", "Account management page with locations button");
        status = true;
        resolve(status);
      });
    });
  }

  verifyLocationBtnFunctionality(heading) {
    return new Promise((resolve) => {
      let status = false;
      const locationButton = element(by.xpath(locationButtonXpath));
      const pageHead = element(by.xpath(accountInfoPageHead));
      locationButton.click();
      library.logStep("Clicked on 'Locations' button");
      pageHead.getText().then(function (pageHeader) {
        if (pageHeader == heading) {
          library.logStepWithScreenshot("Account information page displayed", "Account information page");
          status = true;
          resolve(status);
        }
        else {
          library.logFailStep("Account information page not displayed");
          resolve(status);
        }
      });
    });
  }

  verifyUIofAccountInfo() {
    return new Promise((resolve) => {
      let accountNameStatus = false, accountNumberStatus = false, groupNameStatus = false, verificationStatus = false;
      const accountNameTag = findElement(locatorType.XPATH, accountName);
      const accountNumberTag = findElement(locatorType.XPATH, accountNumber);
      const groupNameTag = findElement(locatorType.XPATH, groupName);
      const pageHead = element(by.xpath(accountInfoPageHead));
      pageHead.isDisplayed().then(function () {
        accountNameTag.isPresent().then(function () {
          library.logStep("Account name present");
          accountNameStatus = true;
        }).catch(function () {
          library.logFailStep("Account number not displayed");
        });
      }).then(function () {
        accountNumberTag.isPresent().then(function () {
          library.logStep("Account number present");
          accountNumberStatus = true;
        }).catch(function () {
          library.logFailStep("account number not displayed");
        });
      }).then(function () {
        groupNameTag.isPresent().then(function () {
          library.logStep("Group name present");
          groupNameStatus = true;
        }).catch(function () {
          library.logFailStep("account number not displayed");
          console.log("group number not present");
        });
      }).then(function () {
        if ((accountNameStatus && accountNumberStatus && groupNameStatus) == true) {
          verificationStatus = true;
          library.logStep("UI components of 'Account information' dialog verified");
          resolve(verificationStatus);
        }
        else {
          console.log("false")
          resolve(true);
        }
      });
    });
  }

  verifyNoGroupMessageDisplayed(message) {
    return new Promise((resolve) => {
      let status = false;
      const locationbtn = element(by.xpath(zeroGroupLocation));
      const noGroup = element(by.xpath(noGroupMessage));
      library.scrollToElement(locationbtn);
      locationbtn.click();
      library.waitForElement(noGroup);
      noGroup.getText().then(function (text) {
        console.log(text);
        console.log(message);
        if (text == message) {
          console.log("message displayed");
          status = true;
          library.logStepWithScreenshot("'No groups' message displayed for account with zero groups", "No Groups Message displayed");
          resolve(status);
        }
        else {
          console.log("message displayed");
          resolve(status);
        }
      });
    });
  }

  paginationButtonsDisplayed() {
    let displayed = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      pagination.isDisplayed().then(function () {
        console.log('Pagination buttons displayed');
        library.logStep('Pagination buttons displayed');
        displayed = true;
        resolve(displayed);
      }).catch(function () {
        console.log('Pagination buttons are not displayed');
        library.logStep('Pagination buttons are not displayed');
        displayed = false;
        resolve(displayed);
      });
    });
  }

  clickOnNextPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      const next = findElement(locatorType.XPATH, nextButton);
      next.isDisplayed().then(function () {
        library.clickJS(next);
        console.log('Next page button clicked');
        library.logStep('Next page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Next page button not displayed');
        library.logStep('Next page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }

  clickOnPreviousPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      const prev = findElement(locatorType.XPATH, previousButton);
      prev.isDisplayed().then(function () {
        library.clickJS(prev);
        console.log('Previous page button clicked');
        library.logStep('Previous page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Previous page button not displayed');
        library.logStep('Previous page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }
  clickOnSecondPage() {
    let clicked = true;
    return new Promise((resolve) => {
      const pagination = element(by.xpath(paginationControls));
      const second = findElement(locatorType.XPATH, secondNumberButton);
      second.isDisplayed().then(function () {
        library.clickJS(second);
        dashBoard.waitForElement();
        console.log('Second page button clicked');
        library.logStep('Second page button clicked');
        clicked = true;
        resolve(clicked);
      }).catch(function () {
        console.log('Second page button not displayed');
        library.logStep('Second page button not displayed');
        clicked = false;
        resolve(clicked);
      });
    });
  }
  verifyEditGroupOptionsAreDisplayed() {
    return new Promise((resolve) => {
      const uiElements = new Map<string, string>();
      uiElements.set('Edit group link', editGroupLink);
      uiElements.set('Edit group name field', groupNameInput);
      uiElements.set('Cancel button', cancelBtn);
      uiElements.set('Change group Name button', changeGroupNameBtn);
      uiElements.forEach(function (key, value) {
        const eleUI = element(by.xpath(key));
        if (eleUI.isDisplayed()) {
          library.logStep(value + ' is displayed.');
          if (value.includes("Edit group link")) {
            library.click(element(by.xpath(key)));
          }
          resolve(true);
        } else {
          library.logStepWithScreenshot('Failed : ' + value + ' is not displayed.', 'Element not displayed');
          library.logFailStep('Failed : ' + value + ' is not displayed.');
          resolve(false);
        }
      });
    });
  }

  verifyNewlyAddedOrUpdatedGroupIsDisplayed(groupName) {
    return new Promise((resolve) => {
      const grps = element.all(by.xpath(groupNames));
      grps.getText().then(function (availableGroups) {
        if (availableGroups.includes(groupName)) {
          console.log(groupName + ' : is displayed in the list');
          library.logStep(groupName + ' : is displayed in the list');
          resolve(true);
        }
      }).catch(function () {
        library.logFailStep(groupName + ' : is not displayed in the list');
        library.logStepWithScreenshot(groupName + ' : is not displayed in the list', 'Group not displayed');
        resolve(false);
      });
    });
  }

  clickOnEditGroup(groupName) {
    return new Promise((resolve) => {
      let editGroupEle = '//div[contains(text(),"'+groupName+'")]//following::span[1]';
      element(by.xpath(editGroupEle)).isDisplayed().then(function () {
        library.click(element(by.xpath(editGroupEle)));
        console.log('Clicked on : "' + groupName + '" edit group link');
        library.logStep('Clicked on : "' + groupName + '" edit group link');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Edit group link is not displayed', 'Element not displayed');
        library.logFailStep('Failed : Edit group link is not displayed');
        resolve(false);
      });
    });
  }

  clickOnChangeGroupNameBtn() {
    return new Promise((resolve) => {
      element(by.xpath(changeGroupNameBtn)).isDisplayed().then(function () {
        library.click(element(by.xpath(changeGroupNameBtn)));
        console.log('Clicked on change group name button');
        library.logStep('Clicked on change group name button');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : change group name button is not displayed', 'Element not displayed');
        library.logFailStep('Failed : change group name button is not displayed');
        resolve(false);
      });
    });
  }
}
