/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';
import { Dashboard } from './dashboard-e2e.po';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const feedbackIconEle = './/mat-icon[contains(@class, "setupComplete")]';
const titleEle = './/h4[@class="mat-h4"]';
const subTitleMessage = './/h6[@class="mat-h6"]';
const ratingQuestion = './/p[text()="How would you rate the ease of your setup process?"]';
const starsEle = './/div[contains(@class, "star-rating")]';
const addCommentLink = './/a/span[@class = "add-comment"]';
const infoText1Ele = './/h6[text() = "Manual entry option"]/following-sibling::p';
const goToDashboardBtnEle = './/button/span[text() = "GO TO DASHBOARD"]';
const infoText2Ele = './/h6[text() = "Import option"]/following-sibling::p';
const importButton = './/button/span[text() = "IMPORT MULTIPLE RESULTS"]';
const addCommentBoxEle = './/textarea[@id = "spc_labsetupfeedback_comment"]';
const commentSubmitBtn = './/button[@id = ":spc_labsetupfeedback_comment_submit"]';
const dashboadrdGreetingEle = './/div[@class = "greeting-component"]';
const connectivityIcon = './/div[contains(@class, "connectivity-link")]/button';


export class Feedback {
  verifyFeedbackPage() {
    let result, icon, title, subTitle, question1, stars, addComment, infoText1, gotoDashboardBtn = false;
    return new Promise((resolve) => {
      browser.sleep(4000);
      const feedbackIcon = findElement(locatorType.XPATH, feedbackIconEle);
      library.scrollToElement(feedbackIcon);
      const titleDisp = element(by.xpath(titleEle));
      const subTitleMsg = element(by.xpath(subTitleMessage));
      const ratingQuestionData = element(by.xpath(ratingQuestion));
      const starRating = element(by.xpath(starsEle));
      const addCommentLinkEle = element(by.xpath(addCommentLink));
      const infoTxt1 = element(by.xpath(infoText1Ele));
      const dashboardbtn = element(by.xpath(goToDashboardBtnEle));
      // const infoTxt2 = element(by.xpath(infoText2Ele));
      // const importBtnEle = element(by.xpath(importButton));
      library.scrollToElement(feedbackIcon);
      browser.sleep(2000);
      feedbackIcon.isDisplayed().then(function () {
        icon = true;
        library.logStep('Feeddback Page icon displayed');
        console.log('icon' + icon);
      });

      library.scrollToElement(titleDisp);
      titleDisp.isDisplayed().then(function () {
        title = true;
        library.logStep('Title displayed');
        console.log('title' + title);
        library.scrollToElement(subTitleMsg);
        subTitleMsg.isDisplayed().then(function () {
          subTitleMsg.getText().then(function (subTitle_Msg) {
            if (subTitle_Msg === 'Youre ready to start entering test data.') {
              subTitle = true;
              library.logStep('Subtitle message displayed');
              console.log('subTitle' + subTitle);
            }
          });
        });

        ratingQuestionData.isDisplayed().then(function () {
          question1 = true;
          library.logStep('Rating question displayed');
          console.log('question1' + question1);
        });

        browser.sleep(2000);
        starRating.isDisplayed().then(function () {
          stars = true;
          library.logStep('Stars displayed');
          console.log('stars' + stars);
        }).catch(function () {
          library.logStep('Stars not displayed');
        });

        addCommentLinkEle.isDisplayed().then(function () {
          addComment = true;
          library.logStep('Add Comment option displayed');
          console.log('addComment' + addComment);
        });
        infoTxt1.isDisplayed().then(function () {
          infoTxt1.getText().then(function (infoTxt) {
            if (infoTxt.includes('Get your results printout and start entering test by test.')) {
              infoText1 = true;
              library.logStep('Information Text displayed');
              console.log('infoText1' + infoText1);
            }
          });
        });
        dashboardbtn.isDisplayed().then(function () {
          gotoDashboardBtn = true;
          library.logStep('Go to dashboard button displayed');
          console.log('gotoDashboardBtn' + gotoDashboardBtn);
        });
        //   infoTxt2.isDisplayed().then(function () {
        //     infoTxt2.getText().then(function (infotxt) {
        //       if (infotxt.includes('Bring multiple test results into the system by uploading an export file from your instrument')) {
        //         infoText2 = true;
        //         library.logStep('Info text displayed');
        //         console.log('infoText2' + infoText2);
        //       }
        //     });
        //   });
        //   library.scrollToElement(importBtnEle);
        //   importBtnEle.isDisplayed().then(function () {
        //     importBtn = true;
        //     library.logStep('Import Button displayed');
        //     console.log('importBtn' + importBtn);
        //   });
      });
      if (icon === true && title === true && subTitle === true && question1 === true && stars === true
        && addComment === true && infoText1 === true && gotoDashboardBtn === true) {
        result = true;
        resolve(result);
      }
    });
  }

  clickOnAddComment() {
    let result = false;
    return new Promise((resolve) => {
      const addCommentLinkEle = element(by.xpath(addCommentLink));
      library.scrollToElement(addCommentLinkEle);
      library.clickJS(addCommentLinkEle);
      result = true;
      resolve(result);
    });
  }

  addCommentText(comment) {
    let status = false;
    return new Promise((resolve) => {
      const addCommentBox = element(by.xpath(addCommentBoxEle));
      addCommentBox.sendKeys(comment).then(function () {
        status = true;
        resolve(status);
      });
    });
  }

  submitCommentButtonDisabled() {
    let status = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(commentSubmitBtn));
      button.isEnabled().then(function (result) {
        if (result) {
          status = false;
          library.logFailStep('Fail: Submit Button is Enabled.');
          resolve(status);
        } else {
          status = true;
          library.logStep('Pass: Submit Button is Disabled.');
          resolve(status);
        }
      });
    });
  }

  submitCommentButtonEnabled() {
    let status = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(commentSubmitBtn));
      button.isEnabled().then(function (result) {
        if (result) {
          status = true;
          library.logStep('Pass: Submit Button is Enabled.');
          resolve(status);
        }
      });
    });
  }

  clickSubmitButton() {
    let status = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(commentSubmitBtn));
      library.clickJS(button);
      status = true;
      library.logStep('Pass: Submit Button Clicked.');
      resolve(status);
    });
  }

  clickGoToDashboardButton() {
    let status = false;
    return new Promise((resolve) => {
      browser.sleep(4000);
      const button = element(by.xpath(goToDashboardBtnEle));
      library.scrollToElement(button);
      library.clickJS(button);
      dashboard.waitForPage();
      const dashboardGreeting = element(by.xpath(dashboadrdGreetingEle));
      dashboardGreeting.isDisplayed().then(function () {
        status = true;
        library.logStep('Pass: Go To Dashboard button Clicked & User Navigated to Dashboard');
        resolve(status);
      });
    });
  }

  clickImportButton() {
    let status = false;
    return new Promise((resolve) => {
      const button = element(by.xpath(importButton));
      library.clickJS(button);
      status = true;
      library.logStep('Pass: Import Button Clicked.');
      resolve(status);
    });
  }

  verifyConnectivityIconDisplayed() {
    let status = false;
    return new Promise((resolve) => {
      const connectivityIconEle = element(by.xpath(connectivityIcon));
      connectivityIconEle.isDisplayed().then(function () {
        status = true;
        library.logStepWithScreenshot('Pass: Connectivity Icon Displayed', 'connectivity');
        resolve(status);
      }).catch(function () {
        status = false;
        library.logStepWithScreenshot('Pass: Connectivity Icon is not Displayed', 'connectivity');
        resolve(status);
      });
    });
  }

  clickStarRating(stars) {
    let status = false;
    return new Promise((resolve) => {
      const starEle = element(by.xpath('.//div[contains(@class, "star - rating")]/i[' + stars + ']'));
      // library.scrollToElement(starEle)
      starEle.isDisplayed().then(function (result) {
        if (result) {
          library.click(starEle);
          status = true;
          library.logStep('Pass: Stars Selected');
          resolve(status);
        }
      }).catch(function () {
        library.logStep('Stars not getting displayed');
        console.log('Stars not getting displayed');
      });
    });
  }
}
