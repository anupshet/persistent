/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { $, browser, by, element, protractor } from 'protractor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
const library = new BrowserLibrary();

const fs = require('fs');
const userInfo = '//unext-nav-bar-user//span';
const userBar = 'user-bar';
const signout = '//button/span[contains(text(),"Logout")]';
const btnTag = 'button';
const signInBtn = "okta-signin-submit";

let jsonData;
fs.readFile('./JSON_data/LogOut.json', (err, data) => {
  if (err) { throw err; }
  const logoutData = JSON.parse(data);
  jsonData = logoutData;
});

export class LogOut {
  logout() {
    return new Promise(resolve => {
      let foundUrl = false;
      const userBar1 = element(by.className(userBar));
      const Ec = protractor.ExpectedConditions;
      browser
        .wait(Ec.presenceOf(userBar1), 10000)
        .then(function () {
          browser
            .actions()
            .mouseMove(userBar1)
            .click()
            .perform()
            .then(function () {
              const buttons = element.all(by.tagName(btnTag));
              buttons.each(function (item) {
                item.getText().then(function (button) {
                  if (button === jsonData.LogoutButton) {
                    browser
                      .actions()
                      .mouseMove(item)
                      .click()
                      .perform()
                      .then(function () {
                        try {
                          browser
                            .actions()
                            .mouseMove(item)
                            .click()
                            .perform();
                        }
                        finally { }
                      })
                      .then(function () {
                        browser
                          .wait(Ec.visibilityOf($('#okta-signin-submit')), 5000)
                          .then(function () {
                            browser.wait(
                              browser.getCurrentUrl().then(function (url) {
                                if (
                                  url.includes(jsonData.URL)
                                ) {
                                  foundUrl = true;
                                }
                              })
                            );
                          });
                      });
                  }
                });
              });
            });
        })
        .then(function () {
          resolve(foundUrl);
        });
    });
  }

  signOut() {
    return new Promise(resolve => {
      const userInfo1 = element(by.xpath(userInfo));
      const signout1 = element(by.xpath(signout));
      const signInBtnEle = element(by.id(signInBtn));
      library.waitTillClickable(userInfo1, 8888).then(() => {
        return userInfo1.click()
      }).then(() => {
        return library.waitTillClickable(signout1, 8888);
      }).then(() => {
        return signout1.click();
      }).then(() => {
        return browser.waitForAngular();
      }).then(() => {
        return library.waitTillVisible(signInBtnEle, 8888);
      }).then(() => {
        return signInBtnEle.isDisplayed();
      }).then((x) => {
        resolve(x);
      });
    });
  }

  signOutQCP() {
    let success = false;
    return new Promise(resolve => {
      const clickLogout = element(by.xpath('.//a[contains(text(), "Log out")]'));
      library.clickJS(clickLogout);
      success = true;
      resolve(success);
    });
  }
}
