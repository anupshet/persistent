//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const manager = new AccoutManager();
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/transformer-pbi223396.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
describe('Verify the Transformer Field on account creation and edit account page.', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });
  afterEach(function () {
    out.signOut();
  });
  xit('Test Case 1: Verify the presence of transformers field and account is created when connectivity is delimited.', async () => {
    library.logStep('Test Case 1:Verify that clicking on create Account page displays the transformers fields');
    library.logStep('Test Case 2:Verify transformer field is disabled when connectivity is not selected. ')
    library.logStep('Test case 3:Verify if user is able to select the transformers when connectivity is selected as Delimited');
    library.logStep('Test Case 4:Verify that Account is created when connectivity is Delimited and transformers field is selected.');
    library.logStep('Test Case 5:Verify that presence of transformers field on Edit account page.');
    library.logStep('Test Case 6:Verify the presence of selected transformer on edit account page');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAddAccountButton().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });
    manager.verifyPresenceOfTransformersField().then(function (status) {
      expect(status).toBe(true);
    })
    manager.verifyTranformerDropdownIsDisabled().then(function (verified) {
      expect(verified).toBe(true);
    })
    manager.enterDataOnCreateAccountPage(jsonData, jsonData.Delimitedconnectivity).then(function (entered) {
      expect(entered).toBe(true);
    });
    manager.clickCreateAccountAddAccountButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.searchAccount().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.verifyAccountSaved().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickOnAddedAccount().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifyPresenceOfTransformersField().then(function (verified) {
      expect(verified).toBe(true);
    })
    manager.verifySelectedTransformerOnEditAccount(jsonData.TransformerFields).then(function (verified) {
      expect(verified).toBe(true);
    })
  });
  xit('Test Case 2: Verify that account is created with connectivity selected as Delimited and transformer field is not selected.', async () => {
    library.logStep('Test Case 1: account is created with connectivity selected as Delimited and transformer field is not selected');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAddAccountButton().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });
    manager.CreateAccountWithoutSelectingTransformer(jsonData, jsonData.Delimitedconnectivity).then(function (entered) {
      expect(entered).toBe(true);
    });
    manager.clickCreateAccountAddAccountButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.searchAccount().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.verifyAccountSaved().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickOnAddedAccount().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifyNoTransformerIsSelected().then(function (verified) {
      expect(verified).toBe(true);
    })
  });
  it('Test Case 3: Verify that account is created with connectivity selected as None and transformer field is not selected.', async () => {
    library.logStep('Test Case 1: Verify that account is created with connectivity selected as None and transformer field is not selected');
    library.logStep('Test Case 2:Verify transformer field is disabled on create and edit account page when connectivity is selected as NONE. ');
    library.logStep('Test case 3:Verify multi-select dropdown for tranformers fields');
    library.logStep('Test Case 4:Verify transformer field is enabled when connectivity is selected as Delimited. ')
    library.logStep('Test Case 5: Verify transformer field is updated on edit account page');

    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAddAccountButton().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });
    manager.enterDataOnCreateAccountPage(jsonData, jsonData.NoneConnectivity).then(function (entered) {
      expect(entered).toBe(true);
    });
    manager.verifyTranformerDropdownIsDisabled().then(function (verified) {
      expect(verified).toBe(true);
    })
    manager.clickCreateAccountAddAccountButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.searchAccount().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.verifyAccountSaved().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickOnAddedAccount().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifyTranformerDropdownIsDisabled().then(function (verified) {
      expect(verified).toBe(true);
    })
    manager.selectConnectivity(jsonData.Delimitedconnectivity).then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifyTranformerDropdownIsEnabled().then(function (verified) {
      expect(verified).toBe(true);
    })
    manager.selectTransformer(jsonData.TransformerFields).then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.verifyMultiSelectDropdownForTranfomers().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickUpdateAccountButton().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.searchAccount().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickOnAddedAccount().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifySelectedTransformerOnEditAccount(jsonData.TransformerFields).then(function (verified) {
      expect(verified).toBe(true);
    })
  });
});

