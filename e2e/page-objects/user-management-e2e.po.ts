/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, protractor } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { resolve } from 'dns';

const library = new BrowserLibrary();
const fs = require('fs');
const searchText = '//input[@placeholder="Search Users"]';
const optionsList = '(//mat-select//div[@class="mat-select-arrow-wrapper"])[1]';
const userCard = '//mat-card-header[@class=\'mat-card-header\']';
const userManagement = 'LoginComponent.UserManagement';
const userInfoComponent = 'user-info-component';
const card = 'mat-card';
const cardHeader = 'mat-card-header';
const cardtitle = 'mat-card-title';
const getRole = '//div[@class=\'mat-select-value\']/span';
const userRole = './/mat-select[@id="userRole"]';
const updateMsg = '//simple-snack-bar/span[contains(text(),\'has been Updated successfully\')]';
const adminRole = '//div/span/label[contains(text(),"Role")]/ancestor::div[1]';
const save = 'saveId';
const adminRoleOption = '//mat-option[1]/span[text()="Admin"]';
const userRoleTitle = '//mat-card-title[contains(text(),\'User Role\')]';
const firstName = '//div/span/label/span[contains(text(),"First")]/ancestor::div[1]/input';
const lastName = '//div/span/label/span[contains(text(),"Last")]/ancestor::div[1]/input';
const emailEnter = '//div/span/label/span[contains(text(),"Email")]/ancestor::div[1]/input';
const optionText = 'mat-option-text';
const adduser = '//span[contains(text(),"Add User")]';
const editUserPopup = './/mat-expansion-panel';
const allcard = '//mat-card/mat-card-header/div[2]/mat-card-title';
const delBtn = 'mat-button mat-primary';
const confirmDelBtn = 'CONFIRM DELETE';
const enterFirstname = '//mat-error[contains(text(),"Enter first name")]';
const enterlastname = '//mat-error[contains(text(),"Enter last name")]';
const enterEmail = '//mat-error[contains(text(),"Enter email")]';
const emailTextBx = '//div/span/label[contains(text(),"Email")]/ancestor::div[1]/input';
const deleteUserButton = "//button[contains(@class, 'icn-delete')]";
const delConfirmBtn = 'confirmId';
const addUserCancel = '//span[contains(text(),"Cancel")]/parent::button';
const selectArrow = 'mat-select-arrow';
const delMsg = '//snack-bar-container/simple-snack-bar/span[contains(text(),\'has been Deleted\')]';
const idlab = '//unext-nav-bar-lab';
const confirmDelCancel = './/unext-confirm-delete-dialog//button[1]';
const roleDrpdwn = '//mat-dialog-content//mat-form-field//mat-select/div/div[2]';
const btnRight = '//button[@class=\'btn right\']';
const invalidEmail = '//mat-form-field/div/div[3]/div/mat-error[contains(text(),\'Not a valid email\')]';
const uniqUserMsg = '//div[contains(text(),"Enter a unique user name (first and last name). A user with that user name already exists.")]';
const userAlreadyExists = '//mat-error[contains(text(),"User Already Exists.")]';
const userAddedMsg = '//snack-bar-container/simple-snack-bar/span[contains(text(),"has been added successfully")]';
const userSTitle = '//mat-card-title[contains(text(),\'Sampada Gulhane\')]';
const scrolly = 'ps__thumb-y';
const title = './/div[@class="mat-card-header-text"]/mat-card-title';
const subtitle = './/div[@class="mat-card-header-text"]/mat-card-subtitle';
const confirmId = 'confirmId';
const toggleGrp = 'mat-button-toggle-group';
const fname1 = '//label[contains(text(),\'First\')]/ancestor::div[1]/input';
const lname1 = '//label[contains(text(),\'Last\')]/ancestor::div[1]/input';
const iconSetting = 'icon-settings';
const overlay = 'cdk-overlay-container';
const input1 = 'mat-input-1';
const input2 = 'mat-input-2';
const input3 = 'mat-input-3';
const BtnCancel = '//span[text()= \'CANCEL\']';
const addUserRoleArrow = '//unext-user-add-dialog//*[@class="mat-select-arrow-wrapper"]';
const editUserRoleArrow = '//unext-user-edit-dialog//*[@class="mat-select-arrow-wrapper"]';
const adminRoleAddNewUser = '//mat-option/span[text()="Admin"]';
const userRoleAddNewUser = '//mat-option/span[text()="User"]';
const firstCard = '(//mat-card-header)[1]';
const gearIcon = '//unext-nav-bar-setting//mat-icon';
const userManagemntMenu = '//div[@role="menu"]//div/button/span[contains(text(),"User Management")]';
const closeButton = './/button[contains(@class,"close")]';
const addDialogUserRoleToggle = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-add-dialog//mat-slide-toggle';
const addDialoglabelAdministrator = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-add-dialog//label[.="Administrator"]';
const userRoleToggle = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//mat-slide-toggle';
const userDeletedMsg = '//snack-bar-container/simple-snack-bar/span[contains(text(),"has been Deleted")]';
const labelAdministrator = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//label[.="Administrator"]';
const saveChangesButton = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//button[@id="saveId"]';
const mandatoryFirstName = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//mat-form-field//label//span[contains(text(),"First")]/following-sibling::span[contains(text(),"*")]';
const mandatoryLastName = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//label//span[contains(text(),"Last")]/following-sibling::span[contains(text(),"*")]';
const mandatoryEmail = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//label//span[contains(text(),"Email")]/following-sibling::span[contains(text(),"*")]';
const editDialogCancelButton = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//span[contains(text(),"Cancel")]/parent::button';
const editDialogFname = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//input[@placeholder="First Name"]';
const editDialogLname = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//input[@placeholder="Last Name"]';
const editDialogEmail = './/mat-expansion-panel-header[@aria-expanded="true"]/following-sibling::div//unext-user-edit-dialog//input[@placeholder="Login Email"]';
const userUpdatedMsg = '//snack-bar-container/simple-snack-bar/span[contains(text(),"has been Updated successfully")]';
const emailDisabled = './/input[@placeholder="Login Email"][@disabled]';
const emailDisabledLotViewerUser = '(.//input[@placeholder="Login Email"][@disabled])[2]';
const confirmDeleteDialogBox = '(.//mat-dialog-container[@role="dialog"])[2]';
const QCPUserAllowedRolesDropdown = '(.//mat-select[@aria-label="Allowed Roles"])[1]';
const loaderPleaseWait = './/div[@class="unity-busy-component"]';


const addUserButton = '//button[contains(@class,"add-user-btn")]';
const categoryDropDown = '//*[text()="Category"]/parent::label';
const keywordInputBox = '//input[@placeholder="Keyword"]';
const searchBtn = '//*[contains(text(),"Search")]';
const nameColHeader = '//span[contains(text(),"Name")]';
const nameDefaultSort = '//span[contains(text(),"Name")]/following::mat-icon';
const email = '//span[contains(text(),"Email")]';
const emailDefaultSort = '//span[contains(text(),"Email")]/following::mat-icon';
const role = '//span[contains(text(),"Role")]';
const roleDefaultSort = '//span[contains(text(),"Role")]/following::mat-icon';
const location = '//span[contains(text(),"Location")]';
const locationDefaultSort = '//span[contains(text(),"Location")]/following::mat-icon';
const userList = '//*[contains(@class,"mat-row cdk-row")]';
const searchButton = '//*[contains(text(),"Search")]/parent::button';

const paginationControls = './/div[@class="custom-pagination"]';
const exitPopup = "//*[@id='spec_warningBox']";
const exitWithoutSavingButton = "//*[contains(text(),'EXIT WITHOUT SAVING')]";
const saveAndExitBtn = "//*[contains(text(),'SAVE AND EXIT')]";
const firtUserFromList = "(//*[contains(@class,'user-edit')])[1]";

const fname = './/input[@id="firstName"]';
const lname = './/input[@id="lastName"]';
const userEmail = './/input[@id="userEmail"]';

const updateBtn = '//span[contains(text(),"Update")]/parent::button';
const userListingLoadingMessage = "//div[contains(text(), 'Loading users..')]";
const delConfirmBtnXpath = '//unext-confirm-dialog-delete';
const loadingPopUp = '//*[@src="assets/images/bds/icn_loader.gif"]';
const toast = "//snack-bar-container";

let jsonData;

fs.readFile('./JSON_data/UserManagement.json', (err, data) => {
  if (err) {
    throw err;
  }
  const userManagementData = JSON.parse(data);
  jsonData = userManagementData;
});

const dashBoard = new Dashboard();
const EC = protractor.ExpectedConditions;

export class UserManagement {
  async isDeleteUserButtonPresent() {
    let flag = false;
    await element(by.xpath(deleteUserButton)).isPresent().then((x)=>{
      flag = x;
    });
    return flag;
  }

  currentRole = '';

  async clickConfirmDelete() {
    try {
      let btn = element(by.buttonText(confirmDelBtn));
      await browser.wait(browser.ExpectedConditions.elementToBeClickable(btn), 20000);
      await btn.click();
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(loadingPopUp))), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);
      library.logStep("Clicked on Confirm Delete Button");
      return true;
    } catch (error) {
      library.logFailStep("Click on Confirm Delete Button Failed");
      return false;
    }
  }

  userManagement() {
    let flag = false;
    return new Promise(resolve => {
      dashBoard.waitForPage();
      browser.actions().mouseMove(element(by.id(userManagement))).perform();
      const userManagementcard = element(by.id(userManagement));
      library.scrollToElement(userManagementcard);
      library.clickJS(userManagementcard);
      flag = true;
      resolve(flag);
    });
  }

  userManagementPage() {
    return new Promise(resolve => {
      let found = false;
      browser.driver
        .findElement(by.className(userInfoComponent))
        .then(function () {
          element
            .all(by.tagName(card))
            .count()
            .then(function (count) {
              browser.sleep(5000);
              if (count >= 1) {
                found = true;
              }
            });
        })
        .then(function () {
          resolve(found);
        });
    });
  }

  searchUser(usersearched) {
    let foundUser = false;
    return new Promise(resolve => {
      dashBoard.waitForElement();
      const searchedUser = usersearched;
      const searchText1 = element(by.xpath(searchText));
      browser
        .actions()
        .mouseMove(element(by.xpath(searchText)))
        .click()
        .perform()
        .then(function () {
          searchText1.clear().then(function () {
            searchText1.sendKeys(searchedUser);
          });
        });
      element
        .all(by.className(cardHeader))
        .count()
        .then(function (cards) {
          dashBoard.waitForElement();
          if (cards >= 1) {
            const usrs = element.all(by.className(cardHeader));
            usrs.each(function (user) {
              user
                .element(by.className(cardtitle))
                .getText()
                .then(function (name) {
                  if (name.includes(searchedUser)) {
                    foundUser = true;
                    library.logStep('User Found');
                    searchText1.clear();
                    dashBoard.waitForElement();
                  }
                });
            });
          }
        })
        .then(function () {
          resolve(foundUser);
        });
    });
  }

  getRole() {
    return new Promise(resolve => {
      let getRole1;
      dashBoard.waitForElement();
      browser.driver
        .findElement(by.xpath(getRole1))
        .getText()
        .then(function (activeRole) {
          getRole1 = activeRole;
        })
        .then(function () {
          resolve(getRole);
        });
    });
  }

  editRole() {
    return new Promise(resolve => {
      const optionsList1 = element(by.xpath(optionsList));
      browser
        .actions()
        .mouseMove(element(by.xpath(optionsList)))
        .click()
        .perform();
      dashBoard.waitForScroll();
      const userRole1 = browser.driver.findElement(by.xpath(userRole));
      library.clickJS(userRole1);
    });
  }

  verifySuccessMsg() {
    let displayed = false;
    return new Promise(resolve => {
      browser.wait(function () {
        return element(by.xpath(updateMsg)).isDisplayed();
      }, 2 * 60 * 1000);
      const successmessage = element(
        by.xpath(updateMsg));
      browser.wait(element(by.xpath(updateMsg)).isPresent());
      successmessage.isDisplayed().then(function () {
        library.logStep('User role  changed success message is displayed.');
        displayed = true;
        resolve(displayed);
      }).catch(function () {
        displayed = false;
        resolve(displayed);
      });
    });
  }

  editUserRole(email) {
    let displayed = false;
    return new Promise(resolve => {
      dashBoard.waitForPage();
      const userCard1 = element(by.xpath('//mat-card-subtitle[contains(text(),"' + email + '")]'));
      browser.executeScript('arguments[0].click()', userCard1);
      dashBoard.waitForElement();
      const role = element(by.xpath(adminRole));
      role.click().then(function () {
        const userRole1 = element(by.xpath(userRole));
        browser.wait(EC.presenceOf(userRole1), 15000);
        userRole1.click().then(function () {
          library.logStep('User role is selected');
          const save1 = browser.driver.findElement(by.id(save));
          library.clickJS(save1);
          browser.sleep(3000);
          library.logStep('Cliked on save button.');
          displayed = true;
          resolve(displayed);
        });
      });
    });
  }

  editAdminRole(email) {
    return new Promise(resolve => {
      dashBoard.waitForPage();
      let displayed = false;
      const userRoleUser1 = element(by.xpath('//mat-card-subtitle[contains(text(),"' + email + '")]'));
      browser.executeScript('arguments[0].click()', userRoleUser1);
      const role1 = element(by.xpath(adminRole));
      dashBoard.waitForElement();
      role1.click().then(function () {
        const userRole1 = element(by.xpath(adminRoleOption));
        dashBoard.waitForElement();
        userRole1.click().then(function () {
          library.logStep('Role selected from add user popup.');
          const save1 = element(by.id(save));
          dashBoard.waitForElement();
          library.clickAction(save1);
          library.logStep('Save button clicked.');
          displayed = true;
          resolve(displayed);
        });
      });
    });
  }

  verifyRequiredFieldsEditUser() {
    return new Promise(resolve => {
      let flag = false;
      const firstReq = element(by.xpath(mandatoryFirstName));
      const lastReq = element(by.xpath(mandatoryLastName));
      const emailReq = element(by.xpath(mandatoryEmail));
      firstReq.getText().then(function (text) { });
      if (firstReq.isDisplayed && lastReq.isDisplayed && emailReq.isDisplayed) {
        flag = true;
        library.logStep('Required fields on Edit User page verified');
        resolve(flag);
      }
    });
  }

  uniqueUserEditFunctionality() {
    return new Promise(resolve => {
      let uniqueUser = false;
      const user = browser.driver.findElement(by.xpath(userRoleTitle));
      browser
        .actions()
        .mouseMove(element(by.xpath(userRoleTitle)))
        .click()
        .perform();
      user.getText().then(function (text) {
      });
      const fname = element(by.xpath(userRoleTitle));
      browser.wait(EC.presenceOf(fname), 4000);
      fname.clear();
      fname.sendKeys(jsonData.FirstName).then(function () { });
      const lname = element(by.xpath(lname1));
      browser.wait(EC.presenceOf(lname), 4000);
      lname.clear();
      lname.sendKeys(jsonData.LastName).then(function () {
      });
      const save1 = element(by.id(save));
      browser.wait(EC.presenceOf(save1), 4000);
      save1.click();
      uniqueUser = true;
      resolve(uniqueUser);
    });
  }

  editUser(user) {
    const searchText1 = browser.driver.findElement(
      by.xpath(searchText)
    );
    browser
      .actions()
      .mouseMove(element(by.xpath(searchText)))
      .click()
      .perform()
      .then(function () {
        searchText1.clear().then(function () {
          searchText1.sendKeys(user);
        });
      });
    return new Promise(resolve => {
      let oldRole,
        statusRole = true;
      this.getRole()
        .then(function (activeRole) {
          oldRole = activeRole;
        })
        .then(this.editRole);
      browser.sleep(2000);
      this.searchUser(user).then(function (searchedUser) {
        expect(searchedUser).toBe(true);
      });
      this.getRole()
        .then(function (activeRole) {
          dashBoard.waitForScroll();
          if (oldRole === activeRole) {
            statusRole = false;
          }
        })
        .then(function () {
          resolve(statusRole);
        });
    });
  }

  addUser(firstName11, lastName11, emailId11, role) {
    return new Promise(resolve => {
      let statusSave = false;
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const adduser1 = findElement(locatorType.XPATH, adduser);
      library.clickAction(adduser1);
      const first = findElement(locatorType.XPATH, firstName);
      first.isDisplayed().then(function () {
        first.sendKeys(firstName11);
        library.logStep(firstName11 + 'Firstname entered.');
      });
      const last = element(by.xpath(lastName));
      last.isDisplayed().then(function () {
        last.sendKeys(lastName11);
        library.logStep(lastName11 + 'Lastname entered.');
      });
      const email = element(by.xpath(emailEnter));
      email.isDisplayed().then(function () {
        email.sendKeys(emailId11);
        library.logStep(emailId11 + 'Email entered.');
      });
      if (role === 'Admin') {
        const roleToggle = element(by.xpath(addDialogUserRoleToggle));
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(roleToggle), 15000);
        roleToggle.isDisplayed().then(function () {
          roleToggle.click();
        });
      }
      browser
        .actions()
        .mouseMove(element(by.id(save)))
        .click()
        .perform()
        .then(function () {
        });
      dashBoard.waitForPage();
      library.logStep('Add User clicked.');
      library.logStepWithScreenshot('User Added', 'UserAdded');
      statusSave = true;
      library.logStep('User added Successfully.');
      resolve(statusSave);
    });
  }

  userAdd(firstName11, lastName11, emailId11) {
    return new Promise(resolve => {
      dashBoard.waitForPage();
      const adduser1 = element(by.xpath(adduser));
      browser
        .actions()
        .mouseMove(element(by.xpath(adduser)))
        .click()
        .perform()
        .then(function () {
          browser
            .actions()
            .mouseMove(element(by.xpath(firstName)))
            .sendKeys(firstName11)
            .perform()
            .then(function () {
              const first1 = element(by.xpath(firstName));
              first1.sendkeys(firstName11);
              browser
                .actions()
                .mouseMove(element(by.xpath(lastName)))
                .sendKeys(lastName11)
                .perform()
                .then(function () {
                  const last = element(by.xpath(lastName));
                  last.sendkeys(lastName11);
                  browser
                    .actions()
                    .mouseMove(element(by.xpath(emailEnter)))
                    .sendKeys(emailId11)
                    .perform()
                    .then(function () {
                      const email = element(by.xpath(emailEnter));
                      email.sendkeys(emailId11);
                    });
                });
            });
        });
    });
  }

  deleteUser(user) {
    return new Promise(resolve => {
      const searchedUser = user;
      let displayed = false;
      this.searchUser(searchedUser).then(function () {
        browser.driver
          .findElement(by.className(cardtitle))
          .click()
          .then(function () {
            browser.driver
              .findElement(by.className(editUserPopup))
              .then(function (scroll) {
                scroll
                  .findElement(by.className(toggleGrp))
                  .findElement(by.tagName('button'))
                  .getText()
                  .then(function () { });
                scroll
                  .findElement(by.className(toggleGrp))
                  .findElement(by.tagName('button'))
                  .click()
                  .then(function () {
                    dashBoard.waitForElement();
                    browser.driver
                      .findElement(by.id(confirmId))
                      .isDisplayed()
                      .then(function (confirm) {
                        displayed = confirm;
                      });
                  });
              });
          })
          .then(function () {
            resolve(displayed);
          });
      });
    });
  }

  verifyDeleteUserButton(user) {
    return new Promise(resolve => {
      const searchedUser = user;
      let displayed = false;
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const search = element(by.xpath('//mat-panel-title/span[contains(text(),"' + searchedUser + '")]'));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(search), 15000);
      library.scrollToElement(search);
      library.clickJS(search);
      library.logStepWithScreenshot('User' + user + ' clicked', 'UserClicked');
      library.logStep('Edit User Card is displayed');
      const deleteButton = element(by.xpath(deleteUserButton));
      library.scrollToElement(deleteButton);
      deleteButton.isDisplayed().then(function () {
        deleteButton.isEnabled().then(function (canclick) {
          if (canclick === true) {
            displayed = true;
            library.logStep('Delete User Button is present.');
            library.attachScreenshot('deleteuser');
          } else {
            library.logFailStep('Delete User Button is not present.');
          }
        }).then(function () {
          resolve(displayed);
        });
      });
    });
  }

  verifyDeleteUserCrossButton(user) {
    return new Promise(resolve => {
      browser.sleep(10000);
      const searchedUser = user;
      let displayed = false;
      this.searchUser(searchedUser).then(function () {
        browser.actions().mouseMove(element(by.className(cardtitle)));
        library.hoverOverElement(element(by.className(cardtitle)));
        browser.wait(function () {
          return element(by.css('mat-icon.mat-icon')).isDisplayed();
        }, 2 * 60 * 1000);
        const crossButton = element(by.xpath('//mat-card/mat-card-header//mat-icon'));
        crossButton.isDisplayed().then(function () {
          crossButton.isEnabled().then(function (canclick) {
            if (canclick === true) {
              displayed = true;
              library.logStep('Cross Button for deleting user is present');
              library.attachScreenshot('crossdelete');
            } else {
              library.logFailStep('Cross Button for deleting user is not present');
            }
          }).then(function () {
            resolve(displayed);
          });
        });
      });
    });
  }

  verifyDeleteUserWarningMessageWindow(username, useremail) {
    let verified, dialogBoxPresent, warningMessageDisplayed, userNameDisplayed,
      userEmailDisplayed, cancelButtonDisplayed, confirmButtonDisplayed = false;
    return new Promise(resolve => {
      dashBoard.waitForElement();
      const deleteButton = element(by.xpath(deleteUserButton));
      library.scrollToElement(deleteButton);
      library.clickJS(deleteButton);
      const confirmDeleteDialog = element(by.xpath(confirmDeleteDialogBox));
      confirmDeleteDialog.isDisplayed().then(function () {
        dialogBoxPresent = true;
        const warningMessgae = element(by.css('p.mat-body-2'));
        warningMessgae.getText().then(function (message) {
          if (message === jsonData.WarningMessage) {
            warningMessageDisplayed = true;
            library.logStep('Warning message displayed.');
          }
          const userName = element(by.xpath(title));
          userName.getText().then(function (user) {
            if (user.includes(username)) {
              userNameDisplayed = true;
              library.logStep('Username displayed.');
            }
            const userEmail = element(by.xpath(subtitle));
            library.scrollToElement(userEmail);
            userEmail.getText().then(function (email) {
              if (email.includes(useremail)) {
                userEmailDisplayed = true;
                library.logStep('Email displayed.');
              }
              const cancelButton = element(by.xpath(confirmDelCancel));
              cancelButton.isDisplayed().then(function () {
                cancelButtonDisplayed = true;
                library.logStep('Cancel button displayed.');
                const confirmButton = element(by.css('button#confirmId'));
                confirmButton.isDisplayed().then(function () {
                  confirmButtonDisplayed = true;
                  library.logStep('Confirm button displayed.');
                  if (dialogBoxPresent && warningMessageDisplayed &&
                    userNameDisplayed && userEmailDisplayed && cancelButtonDisplayed && confirmButtonDisplayed === true) {
                    verified = true;
                    library.logStep('Delete User Wanring UI is verified');
                    resolve(verified);
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  verifyScroll() {
    return new Promise(resolve => {
      let scroll = false;
      const scrollBar = element(by.className(scrolly));
      browser.wait(EC.presenceOf(scrollBar), 15000);
      scrollBar.isDisplayed().then(function () {
        scroll = true;
        library.logStep('Scrolled');
      })
        .then(function () {
          resolve(scroll);
        });
    });
  }

  editRolenew() {
    let displayed = false;
    return new Promise(resolve => {
      const usrCard = browser.driver.findElement(
        by.xpath(userSTitle));
      const optnsList = usrCard.findElement(by.className(selectArrow));
      optnsList.click();
      const options = element.all(by.className(optionText));
      options.each(function (option) {
        option.getText().then(function (role) {
          if (role === 'Admin') {
            option.click();
            const successmessage = element(
              by.xpath(updateMsg));
            browser.wait(EC.presenceOf(successmessage), 3000);
            if (successmessage.isDisplayed) {
              displayed = true;
            }
            resolve(displayed);
          }
        });
      });
    });
  }

  clickAddUserButton() {
    return new Promise(resolve => {
      let statusSave = false;
      dashBoard.waitForPage();
      const adduser1 = findElement(locatorType.XPATH, adduser);
      browser
        .actions()
        .mouseMove(element(by.xpath(adduser)))
        .perform()
        .then(function () {
        });
      library.scrollToElement(adduser1);
      library.clickJS(adduser1);
      library.logStep('Add user button clicked.');
      const addUserPopup1 = findElement(locatorType.XPATH, editUserPopup);
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(addUserPopup1), 15000);
      addUserPopup1.isDisplayed().then(function () {
        library.logStep('Add user popup displayed.');
        library.attachScreenshot('addUserPopup');
        statusSave = true;
        resolve(statusSave);
      });
    });
  }

  clickExistingUser() {
    return new Promise(resolve => {
      let statusSave = false;
      const ele = element(by.xpath('//mat-card[1]/mat-card-header/div[2]'));
      library.clickJS(ele);
      dashBoard.waitForScroll();
      const editUserPopup1 = element(by.className(editUserPopup));
      editUserPopup1.isDisplayed().then(function () {
        statusSave = true;
        library.logStep('Existing user Clicked');
        resolve(statusSave);
      });
    });
  }

  verifyUserDelete() {
    return new Promise(resolve => {
      let status = false;
      const editUserPopup1 = element(by.className(editUserPopup));
      browser.driver
        .findElement(by.xpath('//mat-card[20]/mat-card-header/div[2]'))
        .click()
        .then(function () {
          dashBoard.waitForScroll();
          const editUsrPopup1 = element(by.className(editUserPopup));
          editUsrPopup1.isDisplayed().then(function () {
            const deleteButton = element(by.className('mat-button-wrapper'));
            deleteButton.click().then(function () {
              const confirmDelete = element(by.id(confirmId));
              browser.wait(EC.presenceOf(confirmDelete), 3000);
              confirmDelete.click().then(function () {
                const deleteConfirmationMsg = element(by.xpath(delMsg));
                browser.wait(EC.presenceOf(deleteConfirmationMsg), 15000);
                deleteConfirmationMsg.isDisplayed().then(function () {
                  library.logStep('User Deleted Successfully');
                  status = true;
                  resolve(status);
                });
              });
            });
          });
        });
    });
  }

  verifyRoleDropDown() {
    return new Promise((resolve) => {
      let displayed = false;
      const role = browser.driver.findElement(by.xpath(roleDrpdwn));
      role.click().then(function () { });
      const admnRole = browser.driver.findElement(by.xpath(adminRoleOption));
      const userRole1 = browser.driver.findElement(by.xpath(userRole));
      if (admnRole.isDisplayed() && userRole1.isDisplayed()) {
        admnRole.click();
        library.logStep('Role Drop Down Verified');
        displayed = true;
        resolve(displayed);
      }
    });
  }

  verifyRoleChangedMessage() {
    return new Promise((resolve) => {
      let displayed = false;
      const role = element(by.xpath(roleDrpdwn));
      library.clickJS(role);
      const adminRl = element(by.xpath(adminRoleOption));
      library.clickJS(adminRl);
      const saveChanges = element(by.id(save));
      library.clickJS(saveChanges);
      browser.wait(function () {
        return element(by.xpath(updateMsg)).isDisplayed();
      }, 2 * 60 * 1000);
      const successmessage = element(by.xpath(updateMsg));
      successmessage.isDisplayed().then(function () {
        library.logStep('Role Changed Message Displayed');
        displayed = true;
        resolve(true);
      });
    });
  }

  gearIconUserManagement() {
    return new Promise((resolve) => {
      let foundNode = false;
      browser.driver.findElement(by.className(iconSetting)).click().then(function () {
        dashBoard.waitForScroll();
        browser.driver.findElement(by.className(overlay)).findElements(by.tagName('button'))
          .then(async function (options) {
            let index = 0;
            let statusOption = true;
            do {
              if (options[index]) {
                await options[index].getText().then(function (optnText) {
                  if (optnText === 'User Management') {
                    statusOption = false;
                    options[index].click().then(function () {
                      browser.actions().sendKeys(protractor.Key.ESCAPE).perform().then(function () {
                        dashBoard.waitForPage();
                      });
                      element.all(by.className(cardHeader)).count().then(function (cardCount) {
                        if (cardCount >= 1) {
                          foundNode = true;
                        }
                      });
                    });
                  }
                });
              } index = index + 1;
            } while (statusOption);
          });
      }).then(function () {
        resolve(foundNode);
      });
    });
  }

  updatedRoleToAdmin() {
    let messageDisplayed = false;
    return new Promise(resolve => {
      const usrCrd = browser.driver.findElement(
        by.xpath(userSTitle));
      const optnsList = usrCrd.findElement(by.className(selectArrow));
      optnsList.click();
      const options = element.all(by.className(optionText));
      options.each(function (option) {
        option.getText().then(function (role) {
          if (role === 'Admin') {
            option.click();
            const successmessage = element(
              by.xpath(updateMsg));
            browser.wait(EC.presenceOf(successmessage), 3000);
            if (successmessage.isDisplayed) {
              messageDisplayed = true;
              resolve(messageDisplayed);
            }
          }
        });
      });
    });
  }

  verifyConfirmationMessage() {
    let displayed = false;
    return new Promise(resolve => {
      browser.wait(element(by.xpath(userAddedMsg)).isPresent());
      const msg = element(by.xpath(userAddedMsg));
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStep('User added successfully message displayed');
        library.attachScreenshot('MsgDisplayed');
        resolve(displayed);
      }).catch(function () {
        library.logStep('User added successfully message is not displayed');
        library.attachScreenshot('MsgNotDisplayed');
        resolve(displayed);
      });
    });
  }

  verifyErrorMessageForUniqueEmail() {
    let displayed = false;
    return new Promise(resolve => {
      const msg = element(by.xpath(userAlreadyExists));
      browser.wait(protractor.ExpectedConditions.presenceOf(msg));
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStepWithScreenshot('Error message is displayed for email currently in use', 'ErrorMsg');
        resolve(displayed);
      }).catch(function () {
        displayed = false;
        library.logFailStep('Error Message Not displayed for Unique Email id');
        resolve(displayed);
      });
    });
  }

  verifyErrorMessageForUniqueUserName() {
    let displayed = false;
    return new Promise(resolve => {
      const msg = element(by.xpath(uniqUserMsg));
      browser.wait(protractor.ExpectedConditions.presenceOf(msg));
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStepWithScreenshot('Error message for identical firstname and lastname is displayed.', 'ErrorMsg');
        resolve(displayed);
      });
    });
  }

  verifyErrorMessageForInvalidEmail() {
    let displayed = false;
    return new Promise(resolve => {
      const msg = element(by.xpath(invalidEmail));
      browser.wait(protractor.ExpectedConditions.presenceOf(msg));
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStepWithScreenshot('Error message for Invalid email is displayed.', 'ErrorMsg');
        resolve(displayed);
      }).catch(function () {
        displayed = false;
        library.logStepWithScreenshot('Error message for Invalid email is not displayed.', 'ErrorMsg');
        resolve(displayed);
      });
    });
  }

  verifyCancelUserDeletion() {
    return new Promise(resolve => {
      let verifyCancelButtonFunctionality;
      browser.sleep(10000);
      const deleteButton = element(by.xpath(deleteUserButton));
      deleteButton.click().then(function () {
        const confirmDeleteDialog = element(by.id(delConfirmBtn));
        confirmDeleteDialog.isDisplayed().then(function () {
          const cancelButton = element(by.xpath(confirmDelCancel));
          cancelButton.isDisplayed().then(function () {
            cancelButton.click().then(function () {
              const dialogTitle = element(by.id('mat-dialog-title-0'));
              dialogTitle.getText().then(function (dialogTitleText) {
                if (dialogTitleText === 'Edit User') {
                  verifyCancelButtonFunctionality = true;
                  library.logStep('User Deletion Cancelled');
                }
              }).then(function () {
                resolve(verifyCancelButtonFunctionality);
              });
            });
          });
        });
      });
    });
  }

  cancelbutton(frstName, lstName, emailId) {
    return new Promise(resolve => {
      let statusCancel = false;
      browser.driver
        .findElement(by.xpath(btnRight))
        .click()
        .then(function () {
          dashBoard.waitForScroll();
          browser.driver
            .findElement(by.className(editUserPopup))
            .then(function (userDiologue) {
              userDiologue
                .findElement(by.id(input1))
                .sendKeys(frstName);
              userDiologue.findElement(by.id(input2)).sendKeys(lstName);
              userDiologue.findElement(by.id(input3)).sendKeys(emailId);
              userDiologue
                .findElement(by.className(selectArrow))
                .click()
                .then(function () {
                  const options = element.all(by.className(optionText));
                  options.each(function (option) {
                    option.getText().then(function (role) {
                      if (role === 'User') {
                        option.click();
                        dashBoard.waitForElement();
                      }
                    });
                  });
                });
              dashBoard.waitForElement();
              browser.driver
                .findElement(by.xpath(BtnCancel))
                .click()
                .then(function () {
                  statusCancel = true;
                  dashBoard.waitForElement();
                });
            });
        })
        .then(function () {
          resolve(statusCancel);
        });
    });
  }

  editRoleuser() {
    return new Promise(resolve => {
      const userCard1 = browser.driver.findElement(
        by.xpath(userCard)
      );
      const optnsList = userCard1.findElement(by.className(selectArrow));
      optnsList.click();
      const options = element.all(by.className(optionText));
      options.each(function (option) {
        option.getText().then(function (role) {
          if (role === 'Admin') {
          } else {
          }
        });
      });
    });
  }

  addfirstname(frstName) {
    return new Promise(resolve => {
      const statusSave = false;
      browser.driver.findElement(by.xpath(btnRight)).click()
        .then(function () {
          dashBoard.waitForScroll();
          browser.driver.findElement(by.className(editUserPopup))
            .then(function (userDiologue) {
              userDiologue
                .findElement(by.id(input1))
                .sendKeys(frstName);
            });
        });
    });
  }

  verifyEmailId() {
    let verified = false;
    return new Promise(resolve => {
      const emailTextbox = browser.driver.findElement(by.xpath(emailTextBx));
      emailTextbox.sendKeys(jsonData.Email).then(function () {
        verified = true;
        resolve(verified);
      });
    });
  }

  verifyRole() {
    let verified = false;
    return new Promise(resolve => {
      const role = browser.driver.findElement(by.xpath(roleDrpdwn));
      role.click().then(function () {
      });
      const adminRole1 = browser.driver.findElement(by.xpath(adminRoleOption));
      const userRole1 = browser.driver.findElement(by.xpath(userRole));
      if (adminRole1.isDisplayed() && userRole1.isDisplayed()) {
        adminRole1.click();
        verified = true;
        resolve(verified);
      } else {
        verified = false;
        resolve(verified);
      }
    });
  }

  verifyLabIdDisplayed() {
    let displayed = false;
    return new Promise(resolve => {
      const labId = findElement(locatorType.XPATH, idlab);
      labId.isDisplayed().then(function () {
        library.logStep('Single user is assigned to a single lab.');
        displayed = true;
        resolve(displayed);
      });
    });
  }

  clickAddUser() {
    let clicked = false;
    return new Promise(resolve => {
      dashBoard.waitForPage();
      const add = browser.driver.findElement(by.xpath(adduser));
      library.clickJS(add);
      const editUserPopup1 = element(by.className(editUserPopup));
      editUserPopup1.isDisplayed().then(function () {
        clicked = true;
        resolve(clicked);
      });
    });
  }

  deleteExistingUser(user) {
    return new Promise(resolve => {
      let displayed = false;
      const deleteButton = findElement(locatorType.XPATH, deleteUserButton);
      library.scrollToElement(deleteButton);
      // library.clickJS(deleteButton);
      deleteButton.click();
      library.waitForPage();
      library.logStepWithScreenshot('Delete user button clicked', 'deleteBtn');
      const confirmDeleteDialog = findElement(locatorType.ID, delConfirmBtn);
      confirmDeleteDialog.isDisplayed().then(function () {
        library.logStepWithScreenshot('Confirm delete dialog displayed', 'deleteDialog');
      });
      const confirmButton = findElement(locatorType.ID, 'confirmId');
      confirmButton.isDisplayed().then(function () {
        library.clickJS(confirmButton);
        library.logStepWithScreenshot('Confirm button clicked.', 'confirmclicked');
      });
      const msg = findElement(locatorType.XPATH, userDeletedMsg);
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStep('User deleted successfully message displayed');
        library.attachScreenshot('MsgDisplayed');
        resolve(displayed);
      });
    });
  }

  deleteExistingUserCrossButton(user) {
    return new Promise(resolve => {
      let userDeleted = false;
      browser.sleep(10000);
      const crossButton = element(by.xpath('//mat-card/mat-card-header//mat-icon'));
      library.clickJS(crossButton);
      browser.sleep(2000);
      const confirmButton = element(by.id('confirmId'));
      confirmButton.isDisplayed().then(function () {
        library.clickJS(confirmButton);
        library.logStepWithScreenshot('Confirm button clicked.', 'confirmButton');
      });
      browser.wait(element(by.xpath(delMsg)).isPresent());
      const confirmationMessage = element(by.xpath(delMsg));
      confirmationMessage.isDisplayed().then(function () {
        library.logStepWithScreenshot('Confirm message displayed.', 'confirmMessage');
      });
      confirmationMessage.getText().then(function (confirmationMessageText) {
        userDeleted = true;
        library.logStepWithScreenshot('User deleted.', 'userDeleted');
      }).then(function () {
        resolve(userDeleted);
      });
    });
  }

  availableRoles() {
    return new Promise(resolve => {
      let availableRole = false;
      const userCard1 = browser.driver.findElement(by.xpath(userCard));
      const usrcard = element(by.xpath(userCard));
      browser.wait(EC.presenceOf(usrcard), 20000);
      const optnsList = userCard1.findElement(by.className(selectArrow));
      library.clickJS(optnsList);
      browser.sleep(2000);
      const options = element.all(by.className(optionText));
      options.each(function (option) {
        option.getText().then(function (role) {
          if (role === 'Admin' || role === 'User') {
            availableRole = true;
          } else {
            availableRole = false;
          }
        });
      }).then(function () {
        resolve(availableRole);
      });
    });
  }

  clickEditUserCancelButton() {
    return new Promise(resolve => {
      let clickCancel = false;
      const cancelButton1 = findElement(locatorType.XPATH, editDialogCancelButton);
      library.clickAction(cancelButton1);
      clickCancel = true;
      library.logStepWithScreenshot('Cancel button clicked on Edit User Modal', 'cancelBtn');
      resolve(clickCancel);
    });
  }

  clickConfirmMessageCancelButton() {
    return new Promise(resolve => {
      dashBoard.waitForPage();
      let clickCancel = false;
      const cancelButton1 = element(by.xpath(confirmDelCancel));
      library.clickJS(cancelButton1);
      library.logStep('Delete User Confirm Message Cancel button is Clicked.');
      library.attachScreenshot('cancelClicked');
      clickCancel = true;
      resolve(clickCancel);
    });
  }

  clickDeleteUserButton() {
    return new Promise(async resolve => {
      let deleteButtonClicked = false;
      const deleteButton1 = element(by.xpath(deleteUserButton));
      await deleteButton1.click();
      const confirmDeleteDialog = element(by.xpath(delConfirmBtnXpath));
      await browser.wait(browser.ExpectedConditions.visibilityOf(confirmDeleteDialog), 20000);
      await confirmDeleteDialog.isDisplayed().then(function (flag) {
        deleteButtonClicked = flag;
        library.logStep('Delete User Button is Clicked '+deleteButtonClicked);
      }).then(function () {
        resolve(deleteButtonClicked);
      });
    });
  }

  clickAddUserCancelButton() {
    return new Promise(resolve => {
      library.attachScreenshot('img');
      let clickCancel = false;
      const cancelButton = findElement(locatorType.XPATH, addUserCancel);
      browser.actions()
        .mouseMove(cancelButton)
        .perform();
      browser
        .actions()
        .mouseMove(element(by.xpath(addUserCancel)))
        .click()
        .perform();
      library.logStep('Cancel button clicked.');
      const adduser1 = findElement(locatorType.XPATH, adduser);
      if (adduser1.isDisplayed()) {
        library.logStep('On clicking Cancel button User management page displayed.');
        clickCancel = true;
        resolve(clickCancel);
      }
    });
  }

  verifyfirstname(fName) {
    return new Promise(resolve => {
      let firstNameVerified = false;
      const firstNameTextBox = element(by.xpath(firstName));
      firstNameTextBox.isDisplayed().then(function () {
        firstNameTextBox.sendKeys(fName);
        firstNameVerified = true;
        library.logStep('First name field is editable.');
        library.attachScreenshot('FnameEditable');
      }).catch(function () {
        firstNameVerified = false;
      }).then(function () {
        resolve(firstNameVerified);
      });
    });
  }

  verifyLastname(lName) {
    return new Promise(resolve => {
      let lastNameVerified = false;
      const LastNameTextBox = element(by.xpath(lastName));
      LastNameTextBox.isDisplayed().then(function () {
        LastNameTextBox.sendKeys(lName);
        lastNameVerified = true;
        library.logStep('Last name field is editable.');
        library.attachScreenshot('LnameEditable');
      }).catch(function () {
        lastNameVerified = false;
      }).then(function () {
        resolve(lastNameVerified);
      });
    });
  }

  verifyEmailIdTextBox(email) {
    return new Promise(resolve => {
      let emailVerified = false;
      const emailTxtBx = element(by.xpath(emailEnter));
      emailTxtBx.isDisplayed().then(function () {
        emailTxtBx.sendKeys(email);
        emailVerified = true;
        library.logStep('Email field is editable.');
        library.attachScreenshot('EmailEditable');
      }).catch(function () {
        emailVerified = false;
      }).then(function () {
        resolve(emailVerified);
      });
    });
  }

  verifyMandatoryFieldsOnAddUserPopUp() {
    return new Promise(resolve => {
      let fnameError, lnameError, emailError = false;
      const firstNameTxtbx = element(by.xpath(firstName));
      const lastNameTxtbx = element(by.xpath(lastName));
      const emailTxtbx = element(by.xpath(emailEnter));
      const firstNameError = element(by.xpath(enterFirstname));
      const lastNameError = element(by.xpath(enterlastname));
      const emailIdError = element(by.xpath(enterEmail));
      firstNameTxtbx.isDisplayed().then(function () {
        firstNameTxtbx.click();
      });
      lastNameTxtbx.isDisplayed().then(function () {
        lastNameTxtbx.click();
      });
      emailTxtbx.isDisplayed().then(function () {
        emailTxtbx.click();
      });
      firstNameTxtbx.isDisplayed().then(function () {
        firstNameTxtbx.click();
      });
      firstNameError.isDisplayed().then(function () {
        fnameError = true;
        library.logStep('First name error message is displyed.');
      });
      lastNameError.isDisplayed().then(function () {
        lnameError = true;
        library.logStep('Last name error message is displyed.');
      });
      emailIdError.isDisplayed().then(function () {
        emailError = true;
        library.logStep('Email Id error message is displyed.');
      });
    });
  }

  verifyMandatoryFieldsOnUpdateUserPopUp() {
    return new Promise(resolve => {
      let fnameError, lnameError, emailError = false;
      const firstNameTxtbx = element(by.xpath(firstName));
      const lastNameTxtbx = element(by.xpath(lastName));
      const emailTxtbx = element(by.xpath(emailEnter));
      const firstNameError = element(by.xpath(enterFirstname));
      const lastNameError = element(by.xpath(enterlastname));
      const emailIdError = element(by.xpath(enterEmail));
      firstNameTxtbx.isDisplayed().then(function () {
        firstNameTxtbx.clear();
        firstNameTxtbx.click();
      });
      lastNameTxtbx.isDisplayed().then(function () {
        lastNameTxtbx.clear();
        lastNameTxtbx.click();
      });
      emailTxtbx.isDisplayed().then(function () {
        emailTxtbx.clear();
        emailTxtbx.click();
      });
      firstNameError.isDisplayed().then(function () {
        fnameError = true;
        library.logStep('First name error message is displyed.');
        console.log('First name error message is displyed.');
      });
      lastNameError.isDisplayed().then(function () {
        lnameError = true;
        library.logStep('Last name error message is displyed.');
        console.log('Last name error message is displyed.');
      });
      emailIdError.isDisplayed().then(function () {
        emailError = true;
        library.logStep('Email Id error message is displyed.');
        console.log('Email Id error message is displyed.');
      });
    });
  }

  deleteAllCreatedUser() {
    return new Promise((resolve) => {
      let deleted = false;
      deleted = true;
      const regexp: RegExp = /\d{10,20}/;
      const gearIconEle = element(by.xpath(gearIcon));
      browser.wait(EC.presenceOf(gearIconEle), 15000);
      library.clickAction(gearIconEle);
      const userManagementMenu1 = element(by.xpath(userManagemntMenu));
      library.clickJS(userManagementMenu1);
      dashBoard.waitForPage();
      element.all(by.xpath(allcard)).isDisplayed().then(function () {
        const allUser = element.all(by.xpath(allcard));
        allUser.each(function (user) {
          library.scrollToElement(user);
          user.getText().then(function (actualText) {
            const flag = regexp.test(actualText);
            if (regexp.test(actualText)) {
              library.clickJS(user);
              dashBoard.waitForElement();
              const deleteButton = element(by.buttonText(delBtn));
              library.clickJS(deleteButton);
              dashBoard.waitForElement();
              const confirmDeleteButton = element(by.className(confirmDelBtn));
              library.clickJS(confirmDeleteButton);
              dashBoard.waitForPage();
            }
          });
        });
      }).catch(function () {
      });
      resolve(deleted);
    });
  }

  verifyAvailableRolesForNewUser() {
    return new Promise((resolve) => {
      let displayed = false;
      const addUserEle = element(by.xpath(adduser));
      browser.wait(protractor.ExpectedConditions.presenceOf(addUserEle), 5000);
      library.clickJS(addUserEle);
      library.logStepWithScreenshot('Add user clicked', 'adduser');
      const roleDrpDwn = element(by.xpath(addUserRoleArrow));
      browser.wait(protractor.ExpectedConditions.presenceOf(roleDrpDwn), 5000);
      library.clickAction(roleDrpDwn);
      library.logStep('Add user popup Role Dropdown clicked.');
      const admin = element(by.xpath(adminRoleAddNewUser));
      const user = element(by.xpath(userRoleAddNewUser));
      if (admin.isDisplayed() && user.isDisplayed()) {
        displayed = true;
        library.logStep('Admin and User roles are displayed on add new user popup.');
        library.attachScreenshot('roles');
        resolve(displayed);
      } else {
        displayed = false;
        library.logFailStep('Admin and User roles is not displayed on add new user popup.');
        resolve(displayed);
      }
    });
  }

  verifyAvailableRolesForExistingUser() {
    return new Promise((resolve) => {
      let displayed = false;
      const UserEle = element(by.xpath(firstCard));
      browser.wait(protractor.ExpectedConditions.presenceOf(UserEle), 10000);
      library.clickJS(UserEle);
      library.logStep('User card clicked.');
      const roleDrpDwn = element(by.xpath(editUserRoleArrow));
      browser.wait(protractor.ExpectedConditions.presenceOf(roleDrpDwn), 5000);
      library.clickAction(roleDrpDwn);
      library.logStep('Add user popup Role Dropdown clicked.');
      const admin = element(by.xpath(adminRoleAddNewUser));
      const user = element(by.xpath(userRoleAddNewUser));
      if (admin.isDisplayed() && user.isDisplayed()) {
        displayed = true;
        library.logStep('Admin and User roles are displayed on add new user popup.');
        library.attachScreenshot('Roles');
        resolve(displayed);
      } else {
        displayed = false;
        library.logFailStep('Admin and User roles is not displayed on add new user popup.');
        resolve(displayed);
      }
    });
  }

  closeUserManagementWindow() {
    let result = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const close = element(by.xpath(closeButton));
      close.isDisplayed().then(function () {
        library.clickJS(close);
        library.logStep('User Management Window Close button clicked');
        result = true;
        resolve(result);
      });
    });
  }

  clickUserRoleToggleButton() {
    let adminEnabled = false;
    return new Promise((resolve) => {
      const roleToggle = element(by.xpath(addDialogUserRoleToggle));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(roleToggle), 15000);
      const adminLabel = element(by.xpath(addDialoglabelAdministrator));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(adminLabel), 15000);
      roleToggle.isDisplayed().then(function () {
        library.scrollToElement(roleToggle);
        roleToggle.click();
        library.logStep('User Role Toggle Button clicked');
        adminLabel.getAttribute('class').then(function (attr) {
          if (attr.includes('grey')) {
            library.logStep('User Role Selected');
          } else {
            library.logStep('Admin Role Selected');
          }
        });
        adminEnabled = true;
        resolve(adminEnabled);
      });
    });
  }

  clickEditUserRoleToggleButton() {
    let adminEnabled = false;
    return new Promise((resolve) => {
      const roleToggle = element(by.xpath(userRoleToggle));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(roleToggle), 15000);
      const adminLabel = element(by.xpath(labelAdministrator));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(adminLabel), 15000);
      roleToggle.isDisplayed().then(function () {
        library.scrollToElement(roleToggle);
        roleToggle.click();
        library.logStep('User Role Toggle Button clicked');
        adminLabel.getAttribute('class').then(function (attr) {
          if (attr.includes('grey')) {
            library.logStep('User Role Selected');
          } else {
            library.logStep('Admin Role Selected');
          }
        });
        adminEnabled = true;
        resolve(adminEnabled);
      });
    });
  }

  clickSaveChangesButton() {
    let saved = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const saveChanges = element(by.xpath(saveChangesButton));
      saveChanges.isDisplayed().then(function () {
        saveChanges.click();
        library.logStep('Save Changes Button clicked');
        saved = true;
        resolve(saved);
      });
    });
  }

  uniqueUserEditFNameLName(newFName, newLName) {
    return new Promise(resolve => {
      let uniqueUser = false;
      const fname = findElement(locatorType.XPATH, editDialogFname);
      library.scrollToElement(fname);
      fname.clear();
      fname.sendKeys(newFName).then(function () { });
      const lname = findElement(locatorType.XPATH, editDialogLname);
      library.scrollToElement(lname);
      lname.clear();
      lname.sendKeys(newLName).then(function () {
      });
      const save1 = findElement(locatorType.XPATH, saveChangesButton);
      library.scrollToElement(save1);
      save1.click();
      uniqueUser = true;
      resolve(uniqueUser);
    });
  }

  uniqueUserEditEmail(newEmail) {
    return new Promise(resolve => {
      let uniqueUser = false;
      const email = element(by.xpath(editDialogEmail));
      library.scrollToElement(email);
      email.clear();
      email.sendKeys(newEmail).then(function () { });
      const save1 = element(by.xpath(saveChangesButton));
      library.scrollToElement(save1);
      save1.click();
      uniqueUser = true;
      resolve(uniqueUser);
    });
  }

  verifyEditConfirmationMessage() {
    let displayed = false;
    return new Promise(resolve => {
      const msg = element(by.xpath(userUpdatedMsg));
      browser.wait(protractor.ExpectedConditions.presenceOf(msg), 10000);
      msg.isDisplayed().then(function () {
        displayed = true;
        library.logStep('User updated successfully message displayed');
        library.attachScreenshot('MsgDisplayed');
        resolve(displayed);
      }).catch(function () {
        library.logStep('User updated successfully message is not displayed');
        library.attachScreenshot('MsgNotDisplayed');
        resolve(displayed);
      });
    });
  }

  verifyPageHeader(labName) {
    let flag = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const headerString = 'Start a new lot of ' + labName;
      const pageHeader = element(by.xpath('.//h1[contains(text(),"' + headerString + '")]'));
      pageHeader.isDisplayed().then(function () {
        library.logStepWithScreenshot('Page Header ""User for ""' + labName + '"" is displayed', 'PageHeaderCorrect');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Page Header ""User for ""' + labName + '"" is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  expandUserCard(user) {
    return new Promise(resolve => {
      const searchedUser = user;
      let displayed = false;
      const loader = element(by.xpath(loaderPleaseWait));
      browser.wait(browser.ExpectedConditions.invisibilityOf(loader), 120000, 'Loader is still visible');
      const search = element(by.xpath('//mat-panel-title/span[contains(text(),"' + searchedUser + '")]'));
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(search), 15000);
      library.scrollToElement(search);
      library.clickJS(search);
      library.logStepWithScreenshot('User' + user + ' clicked', 'UserClicked');
      displayed = true;
      resolve(displayed);
    });
  }

  verifyEmailDisabled() {
    let flag = false;
    return new Promise((resolve) => {
      const emailFieldDisabled = element(by.xpath(emailDisabled));
      emailFieldDisabled.isDisplayed().then(function () {
        library.logStepWithScreenshot('Email Field is disabled', 'emailDisabled');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Email field is not disabled');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyEmailDisabledLotViewerUser() {
    let flag = false;
    return new Promise((resolve) => {
      const emailFieldDisabled = element(by.xpath(emailDisabledLotViewerUser));
      emailFieldDisabled.isDisplayed().then(function () {
        library.logStepWithScreenshot('Email Field is disabled', 'emailDisabled');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Email field is not disabled');
        flag = false;
        resolve(flag);
      });
    });
  }

  addQCPUser(firstName11, lastName11, emailId11, role) {
    return new Promise(resolve => {
      let statusSave = false;
      dashBoard.waitForPage();
      const adduser1 = findElement(locatorType.XPATH, adduser);
      library.clickAction(adduser1);
      const first = findElement(locatorType.XPATH, firstName);
      first.isDisplayed().then(function () {
        first.sendKeys(firstName11);
        library.logStep(firstName11 + 'Firstname entered.');
      });
      const last = element(by.xpath(lastName));
      last.isDisplayed().then(function () {
        last.sendKeys(lastName11);
        library.logStep(lastName11 + 'Lastname entered.');
      });
      const email = element(by.xpath(emailEnter));
      email.isDisplayed().then(function () {
        email.sendKeys(emailId11);
        library.logStep(emailId11 + 'Email entered.');
      });
      const userRolesDD = element(by.xpath(QCPUserAllowedRolesDropdown));
      userRolesDD.isDisplayed().then(function () {
        userRolesDD.click();
        library.logStep('Allowed Roles drop down clicked');
        const roleValue = element(by.xpath('.//span[contains(text(),"' + role + '")]/parent::mat-option'));
        roleValue.isDisplayed().then(function () {
          roleValue.click();
          library.logStepWithScreenshot('Role ' + role + ' is selected.', 'roleSelected');
        });
      });
      browser
        .actions()
        .mouseMove(element(by.id(save)))
        .click()
        .perform()
        .then(function () {
        });
      dashBoard.waitForPage();
      library.logStep('Add User clicked.');
      library.logStepWithScreenshot('User Added', 'UserAdded');
      statusSave = true;
      library.logStep('User added Successfully.');
      resolve(statusSave);
    });
  }

  enterUserDetails(firstName11, lastName11, emailId11, role) {
    return new Promise(resolve => {
      let statusSave = false;
      dashBoard.waitForPage();
      const adduser1 = findElement(locatorType.XPATH, adduser);
      library.clickAction(adduser1);
      const first = findElement(locatorType.XPATH, firstName);
      first.isDisplayed().then(function () {
        first.sendKeys(firstName11);
        library.logStep(firstName11 + 'Firstname entered.');
      });
      const last = element(by.xpath(lastName));
      last.isDisplayed().then(function () {
        last.sendKeys(lastName11);
        library.logStep(lastName11 + 'Lastname entered.');
      });
      const email = element(by.xpath(emailEnter));
      email.isDisplayed().then(function () {
        email.sendKeys(emailId11);
        library.logStep(emailId11 + 'Email entered.');
      });
      if (role === 'Admin') {
        const roleToggle = element(by.xpath(addDialogUserRoleToggle));
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(roleToggle), 15000);
        roleToggle.isDisplayed().then(function () {
          roleToggle.click();
        });
      }
      resolve(true);
    });
  }

  verifyUserIsPresent(fName, lName) {
    return new Promise(resolve => {
      let username = fName + "  " + lName;
      let userEle = "//span[text()='" + username + "']";
      element(by.xpath(userEle)).isDisplayed().then(function () {
        element(by.xpath(userEle)).click();
        library.logStep(username + ' Is present in user managment');
        console.log(username + ' Is present in user managment');
        resolve(true);
      }).catch(function () {
        console.log(username + ' Is not present in user managment');
        library.logFailStep(username + ' Is not present in user managment');
        library.logStepWithScreenshot(username + ' Is not present in user managment', 'Element not displayed');
        resolve(false);
      })
    });
  }

  verifyUsersAreSorted() {
    return new Promise(resolve => {
      const originalList: Array<string> = [];
      const tempList: Array<string> = [];
      let sortedTempList = [];
      let count = 0;
      let i = 0;
      const userNameEle = element.all(by.xpath('//h2[text()="Users"]//following::mat-expansion-panel//*[contains(@class,"mat-expansion-panel-header-title")]//span'));
      userNameEle.each(function (eachElement) {
        browser.executeScript('arguments[0].scrollIntoView(true);', eachElement);
        eachElement.getText().then(function (text) {
          text.trim();
          originalList[i] = text.toUpperCase();
          tempList[i] = text.toUpperCase();
          i++;
        }).then(function () {
          sortedTempList = tempList.sort();
          for (const j in sortedTempList) {
            if (originalList[j] === sortedTempList[j]) {
              count++;
              library.logStep(originalList[i] + ' displayed.');
            } else {
              library.logStep(originalList[i] + ' not displayed.');
            }
          }
          if (count === originalList.length) {
            console.log('Users list is alphabetically sorted');
            resolve(true);
          } else {
            library.logFailStep('Users Left navigation list is not sorted');
            library.logStepWithScreenshot('Users Left navigation list is not sorted', 'Not sorted');
            console.log('Users list is not alphabetically sorted');
            resolve(false);
          }
        });
      })
    });
  }




  verfyUIComponents() {
    let count = 0;
    return new Promise((resolve) => {
      const pageUI = new Map<string, string>();
      pageUI.set(addUserButton, 'Add User Button');
      pageUI.set(categoryDropDown, 'Category Dropdown');
      pageUI.set(keywordInputBox, 'KeywordInput Field');
      pageUI.set(searchBtn, 'Search Button');
      pageUI.set(nameColHeader, 'Name Column Header');
      pageUI.set(nameDefaultSort, 'Name Default Sort button');
      pageUI.set(email, 'Email Column Header');
      pageUI.set(emailDefaultSort, 'Email Default Sort button');
      pageUI.set(role, 'Role Column Header');
      pageUI.set(roleDefaultSort, 'Role Default Sort button');
      pageUI.set(location, 'Location Column Header');
      pageUI.set(locationDefaultSort, 'Location Default Sort button');
      pageUI.set(userList, 'Available User List');

      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(userList))), 20000,
        'User list is not present');
      element(by.xpath(userList)).isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' - is displayed');
            library.logStep(key + ' - is displayed');
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
            library.logStepWithScreenshot(key + ' is not displayed.', 'Element not displayed')
          });
        })
      }).then(function () {
        if (count === pageUI.size) {
          console.log('User Managment UI is displayed properly');
          library.logStep('User Managment UI is displayed properly');
          resolve(true);
        } else {
          library.logFailStep('Failed : User ManagmentUI is not displayed properly');
          library.logStepWithScreenshot('Failed : User ManagmentUI is not displayed properly', 'UI is not displayed');
          resolve(false);
        }
      });
    })

  }

  verifySearchBtnIsDisabled() {
    return new Promise((resolve) => {
      element(by.xpath(searchButton)).isDisplayed().then(function () {
        element(by.xpath(searchButton)).getAttribute('disabled').then(function (status) {
          if (status.includes('true')) {
            console.log('Search Button is disbaled by default');
            library.logStep('Search Button is disbaled by default');
            resolve(true);
          } else {
            console.log('Failed : Search Button is not disbaled by default');
            library.logFailStep('Failed : Search Button is not disbaled by default');
            library.logStepWithScreenshot('Failed : Search Button is not disbaled by default', 'Button is not disabled');
            resolve(false);
          }
        })
      });
    });
  }

  paginationButtonsDisplayed() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(userList))), 20000,
        'User list is not present');
      const pagination = element(by.xpath(paginationControls));
      pagination.isDisplayed().then(function () {
        console.log('Pagination buttons are displayed');
        library.logStep('Pagination buttons are displayed');
        resolve(true);
      }).catch(function () {
        console.log('Pagination buttons are not displayed');
        library.logStep('Pagination buttons are not displayed');
        resolve(false);
      });
    });
  }

  goToPage(pageNO) {
    let flag = false;
    return new Promise((resolve) => {
      const pageNumber = findElement(locatorType.XPATH, '//*[@class="custom-pagination"]//span[contains(text(),"' + pageNO + '")]');
      library.clickJS(pageNumber);
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(userList))), 20000,
        'User list is not present');
      element(by.xpath(userList)).isDisplayed().then(function () {
        console.log('Navigated to Page No : ' + pageNO);
        library.logStep('Navigated to Page No : ' + pageNO);
        resolve(true);
      }).catch(function () {
        console.log('Failed : Unabled to navigate to page : ', pageNO);
        library.logStepWithScreenshot('Failed : Unabled to navigate to page : ' + pageNO, 'Element is not displayed');
        resolve(false);
      });

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
            library.logStep('Save and Exit Btn displayed');
            console.log('Save and Exit Btn displayed');
            resolve(true);
          }).catch(function () {
            library.logStepWithScreenshot('Save and Exit Btn displayed', 'Pop up displayed');
            resolve(false);
          });
        });
      });
    });
  }

  clickOnFirstUser() {
    return new Promise(async resolve => {
      await element(by.xpath(firtUserFromList)).isDisplayed().then(async function () {
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(element(by.xpath(firtUserFromList))), 20000);
        await element(by.xpath(firtUserFromList)).click();
        await browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(fname))), 20000);
        library.logStep('Clicked on first User from User list');
        console.log('Clicked on first User from User list');
        resolve(true);
      }).catch(function () {
        library.logStep('Failed : User is not displayed');
        console.log('Failed : User is not displayed');
        library.logStepWithScreenshot('Failed : User is not displayed', 'Element not displayed');
        resolve(false);
      })
    });
  }

  clickOnExistingUser(username) {
    return new Promise(resolve => {
      const existingUser = "//*[contains(@class,'user-edit') and contains(text(),'" + username + "')]";
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(existingUser))), 20000,
        'Failed : User is not present');
      element(by.xpath(existingUser)).isDisplayed().then(function () {
        element(by.xpath(existingUser)).click();
        library.logStep('Clicked on - ' + username + ' from User list');
        console.log('Clicked on - ' + username + ' from User list');
        resolve(true);
      }).catch(function () {
        library.logStep('Failed : User is not displayed');
        console.log('Failed : User is not displayed');
        library.logStepWithScreenshot('Failed : User is not displayed', 'Element not displayed');
        resolve(false);
      })
    });
  }
  updateUserDetails(firstName, lastName, email, role) {
    return new Promise(async (resolve) => {
      try {
        const fnameEle = await element(by.xpath(fname));
        const lnameEle = await element(by.xpath(lname));
        const userRoleEle = await element(by.xpath(userRole));
        const userEmailEle = await element(by.xpath(userEmail));
        await browser.wait(browser.ExpectedConditions.visibilityOf(fnameEle), 5000);
        await browser.wait(browser.ExpectedConditions.visibilityOf(lnameEle), 5000);
        await browser.wait(browser.ExpectedConditions.visibilityOf(userRoleEle), 5000);
        await browser.wait(browser.ExpectedConditions.visibilityOf(userEmailEle), 5000);

        if (firstName.length) {
          console.log("Step 1")
          await fnameEle.clear();
          await fnameEle.sendKeys(firstName);
        }
        if (lastName.length) {
          console.log("Step 2")
          await lnameEle.clear();
          await lnameEle.sendKeys(lastName);
        }
        if (lastName.length) {
          console.log("Step 3")
          await userEmailEle.clear();
          await lnameEle.sendKeys(email);
        }
        if (role.length) {
          console.log("Step 4")
          library.click(userRoleEle);
          this.updateRole(role);
        }
        resolve(true);
      } catch (error) {
        console.log(error);
        resolve(false);
      }
    });
  }

  updateRole(role) {
    return new Promise((resolve) => {
      let roles: String[];
      let rolesAll: String = role;
      if (role.includes("_")) {
        roles = rolesAll.split("_");
        for (let s of roles) {
          const roleEle = element(by.xpath('.//div/mat-option/span[text()=" ' + s + ' "]'));
          roleEle.click();
        }
        resolve(true);
      }
      else {
        const roleEle = element(by.xpath('.//div/mat-option/span[text()="' + role + '"]'));
        roleEle.click();
        library.logStep('roleEle Clicked.');
        resolve(true);
      }
    });
  }

  verifyUpdateBtnIsDisabled() {
    return new Promise((resolve) => {
      element(by.xpath(updateBtn)).isDisplayed().then(function () {
        element(by.xpath(updateBtn)).getAttribute('disabled').then(function (value) {
          if (value.includes('true')) {
            library.logStep('Update button is disabled');
            console.log('Update button is disabled');
            resolve(true);
          } else {
            library.logStep('Update button is not disabled');
            library.logStepWithScreenshot('Update button is not disabled', 'Button is disabled');
            console.log('Update button is not disabled');
            resolve(false);
          }
        }).catch(function () {
          library.logStepWithScreenshot('Failed : Update button is not displayed', 'Button is disabled');
          console.log('Failed : Update button is not displayed');
          resolve(false);
        });
      });
    });
  }

  clickOnUpdateBtn() {
    return new Promise(async (resolve) => {
      await element(by.xpath(updateBtn)).isDisplayed().then(async function () {
        library.clickJS(element(by.xpath(updateBtn)));
        let loadingPopUpEle = element(by.xpath(loadingPopUp));
        await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUpEle), 25000);
        await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(userListingLoadingMessage))), 20000);
        library.logStep('Clicked on Update button');
        console.log('Clicked on Update button');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Update button is not displayed', 'Button is disabled');
        console.log('Failed : Update button is not displayed');
        resolve(false);
      });
    });
  }

  selectItems(elementName, expand, selectElement) {
    return new Promise((resolve) => {
      if (expand === 'true') {
        const isLocationExpanded = '//*[contains(text(),"' + elementName + '")]//following::button[1]//parent::div//parent::mat-tree-node';
        browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath(isLocationExpanded)))), 10000, 'Expand button is not clickable');
        const isAlreadyExpanded = element(by.xpath(isLocationExpanded));
        isAlreadyExpanded.getAttribute('aria-expanded').then(function (value) {
          if (value === 'false') {
            const clickOnExpand = element(by.xpath('//*[contains(text(),"' + elementName + '")]//following::button[1]//parent::div//parent::mat-tree-node'));
            library.clickJS(clickOnExpand);
            console.log('Clicked on Expand for : ', elementName);
            library.logStep('Clicked on Expand for : ' + elementName);
            resolve(true);
          }
        });
      }
      if (selectElement === 'true') {
        browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath('//*[contains(text(),"' + elementName + '")]//preceding::input[1]')))), 10000, 'Select checkbox is not clickable');
        const selectLocation = element(by.xpath('//*[contains(text(),"' + elementName + '")]//preceding::input[1]'));
        selectLocation.isDisplayed().then(function (status) {
          library.clickJS(selectLocation);
          browser.wait
            // tslint:disable-next-line: max-line-length
            (browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');
          console.log('Element is selected 1 : ', elementName);
          library.logStep('Element is selected : ' + elementName);
          resolve(true);
        }).catch(function () {
          console.log('Failed : Element is not displayed : ', elementName);
          library.logStep('Failed : Element is not displayed : ' + elementName);
          resolve(false);
        });
      }

    });
  }

  deSelectItems(elementName, expand, deSelectElement) {
    return new Promise((resolve) => {
      const isLocationExpanded = '//*[contains(text(),"' + elementName + '")]//following::button[1]//parent::div//parent::mat-tree-node';
      if (expand === 'true') {
        browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath(isLocationExpanded)))), 10000, 'Expand button is not clickable');
        const isAlreadyExpanded = element(by.xpath(isLocationExpanded));
        isAlreadyExpanded.getAttribute('aria-expanded').then(function (value) {
          if (value === 'false') {
            const clickOnExpand = element(by.xpath('//*[contains(text(),"' + elementName + '")]//following::button[1]//parent::div//parent::mat-tree-node'));
            library.clickJS(clickOnExpand);
            console.log('Clicked on Expand for : ', elementName);
            library.logStep('Clicked on Expand for : ' + elementName);
            resolve(true);
          }
        });
      }
      if (deSelectElement === 'true') {
        browser.wait(browser.ExpectedConditions.elementToBeClickable((element(by.xpath('//*[contains(text(),"' + elementName + '")]//preceding::input[1]')))), 10000, 'Select checkbox is not clickable');
        const deSelectLocation = element(by.xpath('//*[contains(text(),"' + elementName + '")]//preceding::input[1]'));
        deSelectLocation.isDisplayed().then(function (status) {
          library.clickJS(deSelectLocation);
          browser.wait
            (browser.ExpectedConditions.invisibilityOf
              ((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');

          console.log('Element is de selected 2: ', elementName);
          library.logStep('Element is selected : ' + elementName);
          resolve(true);
        }).catch(function () {
          console.log('Failed : Element is not displayed : ', elementName);
          library.logStep('Failed : Element is not displayed : ' + elementName);
          resolve(true);
        });
      }

    });
  }

  VerifyItemSelected(elementName) {
    return new Promise((resolve) => {
      const verifyItemIsSelected = element(by.xpath('(//span[contains(text(),"' + elementName + '")]//preceding::input[1])[1]'));
      verifyItemIsSelected.getAttribute('aria-checked').then(function (value) {
        const verifyItemInPanelItems =
          '//*[@class="cdk-drag panel-item-box ng-star-inserted"]//span[contains(text(),"' + elementName + '")]';
        if (value === 'false') {
          element(by.xpath(verifyItemInPanelItems)).isDisplayed().then(function () {
            console.log('for not Element : ', elementName, ' Is selected');
            library.logStep('Element : ' + elementName + ' Is selected');
            resolve(false);
          }).catch(function () {
            console.log('Failed : Element - ', elementName, ' Is not selected');
            library.logStep('Failed : Element 1 - ' + elementName + ' Is not selected');
            resolve(true);
          });
        } else {
          browser.wait
            (browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 10000, 'Element is visible');
          element(by.xpath(verifyItemInPanelItems)).getTagName().then(function () {
            console.log('Element : ', elementName, ' Is selected');
            library.logStep('Element : ' + elementName + ' Is selected');
            resolve(true);
          }).catch(function () {
            console.log('Failed : Element 2 - ', elementName, ' Is not selected');
            library.logStep('Failed : Element - ' + elementName + ' Is not selected');
            resolve(false);
          });
        }
      });
    });
  }

  clickOnCancelBtn() {
    return new Promise((resolve) => {
      element(by.xpath(BtnCancel)).isDisplayed().then(function () {
        library.clickJS(element(by.xpath(updateBtn)));
        library.logStep('Clicked on Cancel button');
        console.log('Clicked on Cancel button');
        resolve(true);
      }).catch(function () {
        library.logStepWithScreenshot('Failed : Cancel button is not displayed', 'Cancel is disabled');
        console.log('Failed : Cancel button is not displayed');
        resolve(false);
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

}
