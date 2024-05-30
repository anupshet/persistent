/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';

const library = new BrowserLibrary();
const letgobutton = "//span[text()=' Let's go! ']//parent::button";
const no_option = "//span[text()='No']//ancestor::label//parent::mat-radio-button";
const pointopt = '//span[text()="Point"]//parent::span//parent::div//preceding-sibling::div//ancestor::mat-radio-button';
const gearIcon = '//unext-nav-bar-setting//mat-icon';
const labSettings = '//div[@role="menu"]//div/button/span[contains(text(),"Lab Settings")]';
const noDepartments = '(.//mat-radio-group)[2]/mat-radio-button[2]//span[2]';
const yesByDepartmentRadioButton = './/mat-radio-group[@formcontrolname="instrumentsGroupedByDept"]/mat-radio-button[1]';
const EC = browser.ExpectedConditions;
export class defaultlabsetting {
  goToLabSettings() {
    let status = false;
    return new Promise((resolve) => {
      const gearElement = element(by.xpath(gearIcon));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(gearElement), 30000);
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const labSettingsEle = element(by.xpath(labSettings));
      library.clickJS(labSettingsEle);
      status = true;
      resolve(status);
    });
  }
  selectPointOptions() {
    let flag = false
    return new Promise((resolve) => {
      const pointoptionEle = element(by.xpath(pointopt));
      browser.wait(browser.ExpectedConditions.visibilityOf(pointoptionEle), 20000, 'Failed:Point radio button  is not visible');
      if (pointoptionEle.isDisplayed()) {
        library.clickAction(pointoptionEle);
        flag = true;
        library.logStepWithScreenshot('Point option is selected', "Point option is selected");
      }
      if (flag) {
        resolve(true);
      }
      else {
        library.logFailStep("Point option is not displayed");
        resolve(false);
      }
    });
  }
  selectNoOptions() {
    let flag2 = false;
    return new Promise((resolve) => {
      const no_optionEle = element(by.xpath(no_option));
      if (no_optionEle.isDisplayed()) {
        library.clickAction(no_optionEle);
        flag2 = true;
        library.logStepWithScreenshot('NO option is selected', "NO option is selected");
      }
      if (flag2) {
        resolve(true);
      }
      else {
        library.logFailStep("NO option is not displayed")
        resolve(false);
      }
    });
  }
  selectWeHaveNoDepartment() {
    let flag2 = false;
    return new Promise((resolve) => {
      const no_dept = element(by.xpath(noDepartments));
      if (no_dept.isDisplayed()) {
        library.clickJS(no_dept);
        flag2 = true;
        library.logStepWithScreenshot('We have no Dept option is selected', "We have no Dept option is selected");
      }
      if (flag2) {
        resolve(true);
      }
      else {
        library.logFailStep("We have no Dept option is not displayed")
        resolve(false);
      }
    });
  }
  clickLetsGoButton() {
    let flag = false;
    return new Promise((resolve) => {
      const letgo_button = element(by.xpath(letgobutton));
      if (letgo_button.isDisplayed()) {
        library.clickJS(letgo_button);
        flag = true;
        library.logStepWithScreenshot('Lets go button is clicked', "Lets go button is clicked");
      }
      if (flag) {
        resolve(true);
      }
      else {
        library.logFailStep("lets go button is not displayed")
        resolve(flag);
      }
    });
  }
  selectYesDepartmentRadio() {
    let flag = false;
    return new Promise((resolve) => {
      const noDepartmentRadioBtn = element(by.xpath(yesByDepartmentRadioButton));
      library.clickAction(noDepartmentRadioBtn);
      flag = true;
      library.logStep('We have department radio button is selected');
      resolve(flag);
    });
  }






























}