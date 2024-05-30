// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { NavBar } from '../pages-ts/dsahboard/nav-bar.po';
import { NavHeader } from '../pages-ts/dsahboard/nav-header.po';
import { DashBoard } from '../pages-ts/dsahboard/dashboard.po';
import { SignIn } from '../pages-ts/signInPage.po';
import * as testData from '../test-data/userInfo.json';
import { SideNav } from '../pages-ts/dsahboard/side-nav.po';

import { ConnHeader } from '../pages-ts/Connectivity/header.po';
import { ConnDetail } from '../pages-ts/Connectivity/detail.po';
import { Point } from '../pages-ts/datatable/point.po';

const signin = new SignIn();
const navbar = new NavBar();
const dashboard = new DashBoard();
const navheader = new NavHeader();
const sidenav = new SideNav();
const point = new Point();

// Connectivity
const connheader = new ConnHeader();
const conndetail = new ConnDetail();

declare const allure: any;

describe('Unity Next - Regular/Slide Gen, Connectivity', () => {

  beforeAll(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.manage().window().maximize()
    await browser.manage().timeouts().implicitlyWait(60000)
  })

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.get(browser.params.env)
    await signin.enterEmail(testData.login.email);

    await signin.enterPassword(testData.login.password);
    await signin.clickSignIn();

  }, 60000)

  afterEach(async () => {
    await browser.waitForAngularEnabled(false);
    await navbar.clickSigninUser();
    await navbar.clickLogout();
  }, 60000)

  // It is known to  long running and not for the multi files feature
  xit('TC_000	To verify that user can add department/instrument/product/analyte successfully', async () => {
    await browser.waitForAngularEnabled(false);

    await allure.createStep('click location to add location', async () => {
      await navheader.clickLocation();
      await dashboard.verifyDepartManagement()
    })();

    await allure.createStep('click add a department', async () => {
      await dashboard.clickAddDepartment();
      await dashboard.verifyAtAddingLocDept();
      await dashboard.enterDeptName(testData.labsetup.department);

      await dashboard.selectManagerDropdown(testData.login.welcome_message);
      await dashboard.clickAddDepartments();
    })();

    await allure.createStep('click add an instrument', async () => {
      await dashboard.selectManufacturerDropdown(testData.labsetup.manufacturer);
      await dashboard.selectModelDropdown(testData.labsetup.instrument);
      await dashboard.clickAddInstruments();
    })();

    await allure.createStep('click add an product', async () => {
      await dashboard.selectControlNameDropdown(testData.labsetup.product);
      await dashboard.selectLotNumberDropdown(testData.labsetup.lotno);
      await dashboard.clickAddControls();
    })();

    await allure.createStep('click edit this control', async () => {
      await dashboard.clickEditControls();
    })();

    await allure.createStep('Edit this control', async () => {
      await dashboard.clickUpdateControls();
    })();
  })

  // It is known to  long running and not for the multi files feature
  xdescribe('Unity Next - Slide Gen test', () => {
    it('TC_001	To verify that user can add analyte successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Click the tree node to add an analyte', async () => {

        await sidenav.verifyDeptInstProd(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product);
      })();

      await allure.createStep('Pick the analyte (e.g. Glucose', async () => {

        await dashboard.selectAnalyte();
      })();

      // for slide gen
      await allure.createStep('Pick the lot number (e.g. BA9143', async () => {
        await browser.sleep(5000);
        await dashboard.selectSlideGenDropdown(testData.labsetup.lotnumber);
      })();

      // for slide gen
      await allure.createStep('Pick the Unit (e.g. mg/dL', async () => {
        await browser.sleep(5000);
        await dashboard.selectUnitDropdown(testData.labsetup.unit);

      })();

      await allure.createStep('Add the test', async () => {

        await dashboard.addAnalyteTest();

        await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

      })();
    })

    it('TC_002	To verify that user can edit analyte successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Edit the test', async () => {

        await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

        await sidenav.clickAnalyteTN();

        await dashboard.clickEditAnalyte();

      })();
    })
  })

  // It is known to  long running and not for the multi files feature
  xdescribe('Unity Next - Regular test', () => {

    it('TC_001	To verify that user can add analyte successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Click the tree node to add an analyte', async () => {

        await sidenav.verifyDeptInstProd(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product);

      })();

      await allure.createStep('Pick the analyte (e.g. Glucose', async () => {

        await dashboard.selectAnalyte();

      })();

      await allure.createStep('Pick the Unit (e.g. mg/dL', async () => {
        await browser.sleep(5000);
        await dashboard.selectUnitDropdown(testData.labsetup.unit);

      })();

      await allure.createStep('Add the test', async () => {

        await dashboard.addAnalyteTest();

        await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

      })();
    })

    it('TC_002	To verify that user can edit analyte successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Add the test', async () => {

        await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

        await sidenav.clickAnalyteTN();

        await dashboard.clickEditAnalyte();

      })();
    })
  })

  // It is known to  long running and not for the multi files feature
  xit('TC_007	To verify that user can add vitro analyte test data successfully', async () => {
    await browser.waitForAngularEnabled(false);

    await allure.createStep('Add the Vitro test point data', async () => {

      await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

      await sidenav.clickAnalyteTN();

      await dashboard.clickManuallyEnterTestRun();

      for (let index = 0; index < 3; index++) {

        await dashboard.verifyReagentlot(testData.labsetup.lotnumber);

        await dashboard.enterLevelValues();
        await browser.sleep(15000)
      }
    })();
  })

  // It is known to  long running and not for the multi files feature
  xdescribe('Unity Next - Upload a file', () => {
    it('TC_003	To verify that user can upload a point file successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Able to click file upload', async () => {

        await navheader.clickOpenFileUpload(testData.labsetup.location);

        await navheader.verifyConnectivityPage(testData.fileupload.connectivity);

        await connheader.clickMapping();
        await connheader.clickStatus();

        await connheader.clickFileUpload();
        await conndetail.clickBrowse();

        await conndetail.clickInstruction(testData.fileupload.pointInstruction);

        await conndetail.clickUpload();

        // click status
        await conndetail.clickStatusInFileUpload();

        //await conndetail.clickMapFile();
        await connheader.clickMapping();

        // select the department to map the instrument code to
        await conndetail.selectDepartment();

        // instrument code mapping
        await conndetail.clickInstrumentCodeToMap();
        await conndetail.clickInstrumentTileToMap();
        await conndetail.clickInstrumentLink();

        await conndetail.doubleClickInstrumentCardToMapProduct();

        // product mapping for levels
        await conndetail.clickProductL1();
        await conndetail.clickCardL1();
        await conndetail.clickProductLink();

        await conndetail.clickProductL2();
        await conndetail.clickCardL2();
        await conndetail.clickProductLink();

        await conndetail.clickProductL3();
        await conndetail.clickCardL3();
        await conndetail.clickProductLink();

        await conndetail.doubleClickProductardToMapAnalyte();

        // analyte code mapping
        await conndetail.clickAnalyte();
        await conndetail.clickCardAnalyte();
        await conndetail.clickAnalyteLink();

        await browser.sleep(60000 /*testData.misc.sleep*/);
        await connheader.clickStatus();
        await browser.sleep(60000 /*testData.misc.sleep*/);
        await conndetail.checkTotalEQProcessedAndDisabled();

        await navheader.clickCloseFileUpload();
      })();
    });
  })

  describe('Unity Next - Upload multiple files', () => {

    it('TC_003	To verify that user can upload multiple point files successfully', async () => {
      await browser.waitForAngularEnabled(false);

      await allure.createStep('Able to click file upload', async () => {
        await browser.sleep(6000)
        await navheader.clickOpenFileUpload(testData.labsetup.location);
        await browser.sleep(6000)
        await connheader.clickInstructions();
        await browser.sleep(6000)
        await connheader.clickFileUpload();
        await browser.sleep(6000)
        await conndetail.clickBrowseMultiFiles();
        await browser.sleep(6000)
        await conndetail.clickInstruction(testData.fileupload.pointInstruction);
        await browser.sleep(6000)
        await conndetail.clickUpload();

        await browser.sleep(20000);

        await connheader.clickMapping();
        await browser.sleep(15000);

        await conndetail.selectDepartment();
        await browser.sleep(10000);

        // instrument code mapping
        await conndetail.clickInstrumentCodeToMap();
        await conndetail.clickInstrumentTileToMap();
        await conndetail.clickInstrumentLink();

        await conndetail.doubleClickInstrumentCardToMapProduct();

        // product mapping for levels
        await browser.sleep(3000)
        await conndetail.clickProductL1();
        await browser.sleep(3000)
        await conndetail.clickCardL1();
        await browser.sleep(3000)
        await conndetail.clickProductLink();
        await browser.sleep(3000)
        await conndetail.clickProductL2();
        await browser.sleep(3000)
        await conndetail.clickCardL2();
        await browser.sleep(3000)
        await conndetail.clickProductLink();
        await browser.sleep(3000)

        await conndetail.clickProductL3();
        await browser.sleep(3000)
        await conndetail.clickCardL3();
        await browser.sleep(3000)
        await conndetail.clickProductLink();
        await browser.sleep(3000)

        await conndetail.doubleClickProductardToMapAnalyte();

        // analyte code mapping
        await conndetail.clickAnalyte();
        await conndetail.clickCardAnalyte();
        await conndetail.clickAnalyteLink();

        await browser.sleep(60000);
        await connheader.clickStatus();
        await browser.sleep(60000);
        await conndetail.checkTotalEQProcessedAndDisabled();

        await navheader.clickCloseFileUpload();
      })();
    });
  })

  it('TC_004	To verify that user can delete point from datatable successfully', async () => {
    await browser.waitForAngularEnabled(false);

    await allure.createStep('Able to delete data from datatable of analyte test', async () => {

      await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

      await sidenav.clickAnalyteTN();

      //assume data table have at least one row of data
      let count = 0;
      await point.getPoints().then((v) => {
        count = v;
      });

      while ((count - 2) > 0) {   /* exclude the 2 tr of headers of table */
        await point.clickFirstRow();

        await point.clickDelete();

        await point.clickConfirm();

        await point.getPoints().then((v) => {
          count = v;
        });
      }
    })();
  });

  it('TC_005	To verify that user can unmap, disable, and delete the instrument code successfully', async () => {
    await browser.waitForAngularEnabled(false);

    await allure.createStep('Able to unmap, disable, and delete the instrument code', async () => {
      await browser.sleep(6000)
      await navheader.clickOpenFileUpload(testData.labsetup.location);

      await navheader.verifyConnectivityPage(testData.fileupload.connectivity);

      await connheader.clickMapping();

      await conndetail.clickInstrumentCardToUnmap();

      await conndetail.clickDisableInstrumentCode();

      await conndetail.clickRestoreInstrumentCode(false);

      await point.clickConfirm();

      await navheader.clickCloseFileUpload();
    })();
  });

  // It is known to be very unstable or long running and not for the multi files feature
  xit('TC_006	To verify that user can delete department, instrument, product, and analyte successfully', async () => {
    await browser.waitForAngularEnabled(false);

    await allure.createStep('Able to delete department, instrument, product, and analyte', async () => {

      await sidenav.verifyAnalyteTestAtTreeView(testData.labsetup.department, testData.labsetup.instrument, testData.labsetup.product, testData.labsetup.analyte);

      await sidenav.clickAnalyteTN();

      await dashboard.clickEditAnalyte();

      await dashboard.clickDeleteAnalyte();

      await dashboard.clickConfirm();

      // delete control
      await dashboard.clickEditThisControl();
      await dashboard.clickDeleteControl();
      await dashboard.clickConfirm();

      // instrument
      await navbar.clickUnityNext();
      await sidenav.naviInstrument();

      await dashboard.clickEditThisInstrument();
      await dashboard.clickDeleteInstrument();
      await dashboard.clickConfirm();

      // department
      await navheader.clickLocation();
      await dashboard.clickDeptToDelete();
      await dashboard.clickDeleteDept();
      await dashboard.clickConfirm();

    })();
  });
})


async function attachScreenshot(filename: string) {
  let png = await browser.takeScreenshot();
  await allure.createAttachment(filename, new Buffer(png, 'base64'));
}
function s(arg0: string, s: any, point: Point, data: any, arg4: string, arg5: void) {
  throw new Error('Function not implemented.');
}

