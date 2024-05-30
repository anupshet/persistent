//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
let jsonData;
const library=new BrowserLibrary();

library.parseJson('./JSON_data/advancelj-210163.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite 210163:Render special point styling: warning, rejected, and not accepted points.', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const advancedLj = new AdvancedLJ();
  const dashBoard = new Dashboard();
  let imageName, details;
  const time = 'August 10, 2021';

  beforeEach(async function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    browser.executeScript('enableUnityLog()');

    browser.executeScript(`
        (function(name, definition) {
          if (typeof define === 'function') { // AMD
            define(definition);
          } else if (typeof module !== 'undefined' && module.exports) { // Node.js
            module.exports = definition();
          } else { // Browser
            var timemachine = definition(),
              global = this,
              old = global[name];
            timemachine.noConflict = function() {
              global[name] = old;
              return timemachine;
            };
            global[name] = timemachine;
          }
        })('timemachine', function() {
          var OriginalDate = Date,
            Timemachine = {
              timestamp: 0,
              tick: false,
              tickStartDate: null,
              keepTime: false,
              difference: 0,
              config: function(options) {
                this.timestamp = OriginalDate.parse(options.dateString) || options.timestamp || this.timestamp;
                this.difference = options.difference || this.difference;
                this.keepTime = options.keepTime || this.keepTime;
                this.tick = options.tick || this.tick;
                if (this.tick) {
                  this.tickStartDate = new OriginalDate();
                }
                this._apply();
              },
              reset: function() {
                this.timestamp = 0;
                this.tick = false;
                this.tickStartDate = null;
                this.keepTime = false;
                this.difference = 0;
                Date = OriginalDate;
                Date.prototype = OriginalDate.prototype;
              },
              _apply: function() {
                var self = this;
                Date = function() {
                  var date;
                  if (self.keepTime) {
                    date = new OriginalDate();
                  } else if (arguments.length === 1) {  //Cannot use OriginalDate.apply(this, arguments).  See http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
                    date = new OriginalDate(arguments[0]);
                  } else if (arguments.length === 2) {
                    date = new OriginalDate(arguments[0], arguments[1]);
                  } else if (arguments.length === 3) {
                    date = new OriginalDate(arguments[0], arguments[1], arguments[2]);
                  } else if (arguments.length === 4) {
                    date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3]);
                  } else if (arguments.length === 5) {
                    date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                  } else if (arguments.length === 6) {
                    date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                  } else if (arguments.length === 7) {
                    date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                  } else {
                    date = new OriginalDate(self.timestamp);
                  }
                  if (arguments.length === 0) {
                      var difference = self._getDifference();
                      if (difference !== 0) {
                          date = new OriginalDate(date.getTime() + difference);
                      }
                  }
                  return date;
                };
                Date.prototype = OriginalDate.prototype;
                Date.now = function() {
                  var timestamp = self.keepTime ? OriginalDate.now() : self.timestamp;
                  return timestamp + self._getDifference();
                };
                Date.OriginalDate = OriginalDate;
                Date.UTC = OriginalDate.UTC;
              },
              _getDifference: function() {
                var difference = this.difference;
                if (this.tick) {
                  difference += OriginalDate.now() - this.tickStartDate.getTime();
                }
                return difference;
              },
            };
          Timemachine._apply();
          return Timemachine;
        });
        timemachine.config({ dateString: '`+ time + ` 00:00:00' });`);
  });

  afterEach(function () {
    advancedLj.verifyImageComparison(imageName, details).then(async function (clicked) {
      await expect(clicked).toBe(true);
    });
    out.signOut();
  });

  it('Test Case 210163:To Verify rendering of Special Points on Advanced LJ Chart.', function () {
    imageName = "stylingPoints";
    details = 'styling points';
    library.logStep('Test Case 1: To Verify rendering of Warned data on Advanced LJ Chart.');
    library.logStep('Test Case 2: To Verify rendering of Warned and Not Accepted data on Advanced LJ Chart.');
    library.logStep('Test Case 3: To Verify rendering of Rejected data on Advanced LJ Chart.');
    library.logStep('Test Case 4: To Verify rendering of Not Accepted data on Advanced LJ Chart.');
    labsetup.navigateTO(jsonData.Department).then(async function (navigated) {
      await expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(async function (navigated) {
      await expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(async function (navigated) {
      await expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(async function (navigated) {
      await expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(async function (clicked) {
      await expect(clicked).toBe(true);
    }).then(function () {
      dashBoard.waitForElement();
    });
  });
});
