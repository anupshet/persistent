/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { $, By, ElementArrayFinder, ElementFinder, browser, by, element, protractor } from "protractor";
import { BrowserLibrary, findElement, locatorType } from "../utils/browserUtil";
import { Dashboard } from "./dashboard-e2e.po";
import { rejects } from "assert";
import { resolve } from "dns";
import { async } from "@angular/core/testing";
import { select } from "@ngrx/store";
import { truncate } from "fs";

const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const catagoryDD = ".//div/mat-select";
const keywordInputBox =
  "//input[@id='accounts-field' or contains(@class,'input-element')]";
const searchBtn = "//span[.='Search' or contains(text(),'Search')]";
const resetBtnXpath = './/button/span/span[contains(text(),"Reset")]';
const locationBtn = '//span[text()=" Locations "]';
const addLocationBtn = '//span[text()="Add A Location"]';
const UnityNextTierDrp = '//mat-select[@id="unityNextTier"]';
const UnityNextTierOption = '//span[text()=" Advanced QC"]';
const closeIconBtn = '//mat-icon[text()="close"]';
const exitWithoutSavingBtn = '//span[text()=" EXIT WITHOUT SAVING "]';
const RestIconBtn = '//span[text()="Reset"]';
const locationTab = '//div[@role="tab"]/div[text()="LOCATIONS"]';
const benchTills = '//h4[text()="QC results ready for review"]';
const Analytes = '//mat-header-cell[text()=" ANALYTE "]';
const date = '//span[text()="DATE"]';
const time = '//span[text()="TIME"]';
const level = '//span[text()="LEVEL"]';
const results = '//span[text()="RESULTS"]';
const zScore = '//span[text()="Z-SCORE"]';
const rules = '//span[text()="RULES"]';
const evalMean = '//span[text()="EVAL MEAN"]';
const evalSd = '//span[text()="EVAL SD"]';
const evalCv = '//span[text()="EVAL CV"]';
const bys = '//span[text()="BY"]';
const status = '//mat-header-cell[text()=" STATUS "]';
const analyteDetailsBox = '//*[@role="row"]//div[@class="analyte_box"]';
const reagentDetails =
  '(//*[@class="analyte_reagent_calibrator_lots reagent_lot"])[1]';
const calibratorDetails =
  '(//*[@class="analyte_reagent_calibrator_lots calibrator_lot"])[1]';
const advanceLJChart = '(//span[text()="LJ"])[1]/following-sibling::span';
const chooseActionDrpdwn ='(//*[contains(@class,"select analyte_actions1")])[1]';
const addCommentTextBox = '(//*[@placeholder="Add a comment"])[1]';
const historyIcon = '(//*[contains(@class,"ic-pez ic-history")])[1]';
const commentsIcon = '(//*[contains(@class,"spc_pezcell_comments")])[1]';
const actionsIcon = '(//*[contains(@class,"ic-pez ic-change-history")])[1]';
const actionDetailsPOpup = '//*[contains(@class,"mat-dialog-container")]';

const gearIcon = "//unext-data-columns-settings//mat-icon";
const loadingMessage = "//div[contains(text(), 'Loading runs...')]";
const columnHeaderWithText = "//mat-header-cell[contains(., '<text>')]";
const dataColumnsWindow = "column-container";
const dataColumnsWindowHeading = "//span[contains(text(), 'Data Columns')]";
const dataColumnsWindowClose =
  "//span[contains(text(), 'Data Columns')]/..//mat-icon";
const dataColumnsWindowCloseButton = "closeBtn";
const dataColumnsWindowUpdateButton = "updateBtn";
const checkBoxLabelWithText = "//label[contains(.,'<text>')]";
const checkBoxWithText = "//label[contains(.,'<text>')]//input";
const dataColumnsLabels = "//div[contains(., 'Data Columns')]//label//label";
const DepartmentLink =
  "//span[text()=' Add a Department ']/../../../..//div[text()=' <text> ']";
const InstrumentLink = "//div[text()=' <text> ']";
const InstrumentInputText = "//label[text()=' 1 ']/following-sibling::input";
const SubmitBtn = "//button[@id='submitBtn']";
const SubmitBtnText = "//button[@id='submitBtn']/span";
const ControlNameLink = "//div[text()=' <text> ']";
const AnalyteNameLink = "//div[text()=' <text> ']";
const DoNotSavePopUpBtn = "//span[text()=' Dont save data ']";
const EditThisAnalyteLink = "//span[text()='Edit this analyte']";
const panelName = "//div[text()=' <text> ']";
const EditThisControlLink = "//span[text()='Edit this Control']";
const EditThisInstrumentLink = "//span[text()=' Edit this Instrument']";
const EditThisPanelLink = "//span[text()='Edit this Panel']";
const warningPopupX = "//unext-confirm-dialog[contains(., 'You will lose your changes.')]";
const navBarLabName = "//unext-nav-bar-lab//mat-icon";
const secondLocation = "(//div[@class='cdk-overlay-container']//label)[2]";
const BenchAndReviewCardValueTxt = "//h4[text()='QC results ready for review']/../following-sibling::mat-card-subtitle/span";
const firstAnalyteCheckbox = "(//*[@formcontrolname='selectedRun']//div)[1]";
const ReviewedBtn = "//span[text()='Reviewed']";
const DashboardLink = "//span[text()='Unity Next']";
const PaginationLink = "(//pagination-template[@id='paginationDataReview']//button/span)[3]";
const MarkAndExitLinkBtn = "//span[text()=' Mark and exit ']";
const ClearSelectionsAndExitLinkBtn = "//span[text()=' Clear selections and exit ']";
const popupTxt = "//h2[text()=' You have tests selected. ']";
const AnalyteCreationTime = "(//div[text()=' Ferritin ']/../../../../mat-cell[4]//span)[4]";
const LoadingRunTxt = "//div[text()=' Loading runs... ']";
const Xicon = "//span/i[text()='close']";
const selectAllAnalyteOnCurrentPageTxt = "//span[text()='SELECT ALL ANALYTE RUNS ON CURRENT PAGE ']";
const selectAllAnalyteOnAllPageTxt = "//span[text()='SELECT ALL ANALYTE RUNS ON ALL PAGES']";
const analyteDrpDwn = "//mat-header-cell[text()=' ANALYTE ']/..//mat-select/div/div[2]";
const pageTwoBtn = "//span[text()=' 2 ']/..";
const selectedAnalyteChkBox = "//mat-checkbox[contains(@class,'mat-checkbox-checked')]";
const analyteChkBox = "//mat-header-cell[text()=' ANALYTE ']/..//mat-checkbox//div//input";
const locationIconDropDown = "(.//mat-icon[@role='img'])[2]/../span";
const locationDrpDwn = "//span[text()=' <text>']/../../div[1]/div[1]";
const allItemsHaveBeenReviewedTxt = "//h2[text()='All items have been reviewed']";
const goToDashboard = "//span[text()='GO TO DASHBOARD']";
const refreshResult = "//span[text()='REFRESH RESULTS']";

const pegination = "//*[@class='custom-pagination']";
const previousPage = "//button[contains(@class,'spec-prev-button')]";
const nextPage = "//button[contains(@class,'spec-next-button')]";
const analyteDetails = "//*[@class='analyte-details']";
const dataRow = "//mat-row";
const InstrumentDataTable = "(//td[@class='cell-date mat-small'])[1]";
const InputDataPointEntry = "//input[@name='level']";
const ChooseActionDropDown = "(//span[text()='Choose an action'])[1]";
const ChooseActionDropDownOptions = "//span[text()=' Calibrator changed ']";
const CommentsInputTxt = "//textarea[@id='mat-input-99']";
const submitUpdateBtn = "//span[text()=' SUBMIT UPDATES ']";

const acceptedFilterCounts = "(//span[@class='filter-count'])[1]";
const warningfilterCounts = "(//span[@class='filter-count'])[2]";
const rejectedFilterCounts = "(//span[@class='filter-count'])[3]";
const actionCommentsFilterCounts = "(//span[@class='filter-count'])[4]";

const additionfilterIcon = "//div[@class='mat-menu-trigger']";
const last30daysfiltercount = "//span[@class='filter-result-icon-last30Days']";
const violations = "//span[@class='filter-result-icon-violation']";
const reviewfirstannalyte = "(//div[@class='mat-checkbox-inner-container mat-checkbox-inner-container-no-side-margin'])[2]";
const reviewed = "//button[@id='spec_reviewed_button']";
const closeadditionalfilterwindow = "//span[@class='close-icon']";
const allreviewedruns = "//h2[text()='All items have been reviewed']";

const editbutton = "(//span[@class='ic_edit edit-icon ng-star-inserted'])[1]";
const accepttogglebutton = "//div[@class='mat-slide-toggle-thumb-container']";
const resultvalue = "//input[@id='spec_datareview_result_entry_0']";
const actioncommenthistory = "(//span[@class='grey pez ng-star-inserted'])[1]";
const cancelbutton = "//button[@class='mat-focus-indicator cancel-button mat-button mat-button-base mat-primary']";
const paginationarrow = "//button[@class='mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary']";
const analytecheckboxdisable = "//mat-checkbox[@class='mat-checkbox check-box-style mat-accent mat-checkbox-disabled']";
const actionfielddisable = "//span[@class='mat-select-placeholder ng-tns-c195-300 ng-star-inserted']";
const commentfielddisable = "//div[@class='mat-form-field-infix ng-tns-c111-22']";
const reviewedbuttondisable = "//button[@id='spec_reviewed_button']"

const manageexpectedtestslink = "//span[text()='Manage expected tests']";
const expectedtestssetup = "//div[@class='cdk-overlay-pane']";

const supervisorCard = "//span[text()='Supervisor Review']";
const switchToBenchReviewLink = "(//*[contains(text(),'Switch to bench review')])[2]";
const switchToConfirmationPopup = "//*[contains(@class,'mat-dialog-container')]";
const runCounter = "//*[@class='runCount']";
const selectetCountText = "//*[@class='selectedCountText']";
const benchCard = "//span[text()='Bench Review']";
const switchToSupervisorReviewLink = "(//*[contains(text(),'Switch to supervisor review')])";

const acceptedFliterBtn = "(//div[@class='filter-toolbar---action-item filter-div'])[1]";
const acceptedFilterSelction = "//div[@class='filter-toolbar---action-item accepted-bg-color']";
const warningFilterBtn = "(//div[@class='filter-toolbar---action-item filter-div'])[2]";
const warningFilterSelction = "//div[@class='filter-toolbar---action-item warning-bg-color']";
const rejectedFilterBtn = "(//div[@class='filter-toolbar---action-item filter-div'])[3]";
const rejectedFilterSelction = "//div[@class='filter-toolbar---action-item reject-bg-color']";
const actioncommentFilterBtn = "(//div[@class='filter-toolbar---action-item filter-div'])[4]";
const actioncommentSelection = "//div[@class='filter-toolbar---action-item actionAndComments-bg-color']";
const Results = "//mat-cell[@class='mat-cell cdk-cell cdk-column-Results mat-column-Results ng-star-inserted']";
const acceptedruns = "//mat-row[@class='mat-row cdk-row ng-star-inserted']";
const analytename = "//div[@class='analyte-name']";

const departmentsTooltip = "//span[text()='Departments']";
const depttoolitipdeptTxt = "(//div[contains(@class,'item-list-container')])[1]";
const instrumentsTooltip = "//span[text()='Instruments']";
const instrumenttoolitipdeptTxt = "(//div[@class='itemTextContainer ng-star-inserted'])[15]";
const panelsTooltip = "//span[text()='Panels']";
const allTooltipNoneTxt = "//div[@class='itemTextContainer']";
const NoneTxtOnTooltip = "//span[text()='None']";
const DepartmentNonTxt = "//span[text()=' None ']";
const departmentname = "//span[contains(.,'<text>')]";
const allDepartmentsSelected = "//span[text()=' Select all departments ']";

const deptFilter = '//*[@id="department" and contains(@class,"dynamic-filter")]';
const instrumentFilter = '//*[@id="labInstrument" and contains(@class,"dynamic-filter")]';
const panelFilter = '//*[@id="panelItem" and contains(@class,"dynamic-filter")]';
const viewItemsBtn = '//*[text()="VIEW ITEMS"]';
const resetBtn = '//*[text()="RESET"]';
const filterComponent = '//*[@class="filter-selecter"]';
const PeerMeanChkBx = '//input[@name="Peer Mean"]';
const PeerCVChkBx = '//input[@name="Peer CV"]';
const PeerSdChkBx = '//input[@name="Peer SD"]';
const UpdateBtn = '//span[text()="UPDATE"]';

const forwardArrowEnabled = "//button[@class='mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary']";
const forwardArrowDisabled = "mat-focus-indicator pagination-button spec-next-button mat-stroked-button mat-button-base mat-primary selected disable-button";
const lastpagecurrentdataentry = "//span[@class='grey pez ng-star-inserted']";
const latestanalyte = "//div[@class='analyte-name']"
const RunsTime = "//td[@class='mat-cell cdk-cell time-column cdk-column-Time mat-column-Time first-row-border ng-star-inserted']";
const currentrundate="//td[@class='mat-cell cdk-cell date-column not-padded cdk-column-Date mat-column-Date first-row-border ng-star-inserted']";
const RunsLevel1Results = "//td[@class='mat-cell cdk-cell results-column column-padding cdk-column-Results mat-column-Results first-row-border ng-star-inserted']";
const dataentrydateTime = "//span[@class='small gray inline-block ml-2']";
const switchToBenchReviewLink1 = "//*[contains(text(),'Switch to bench review')]";
const yesBtn = "//span[text()='yes']";
const latestenterdAnalyte = "//mat-checkbox[contains(@id,'mat-checkbox')]";
const firstanalyte = "//input[@id='mat-checkbox-44-input']";
const actionlog = "//span[@class='grey pez ng-star-inserted']";
const superviosrReviewdone = "//p[contains(text(),' Supervisor review ')]";
const lastPageBtn = "(//button[@class='mat-focus-indicator pagination-button spec-page-button mat-stroked-button mat-button-base mat-primary'])[4]";
const AccAndLocManage = "//span[text()='Account & Location Management']";
const locationsTab = './/div[@role="tab"]/div[text()="Locations"]';
const Category ='.//mat-select[@role="listbox"]/following-sibling::span/label/mat-label[text()="Category"]';
const Lab = "//span[text()='Lab ']";
const Keyword = './/input[@name="searchInput"]/following-sibling::span/label/span[text()="Keyword"]';
const Search ='//span[text()="Search"]';
const LaunchLab ='//span[text()=" Launch Lab"]';
const CloseIcon ='//mat-icon[@ng-reflect-svg-icon="close"]';
const actionLogs= "//p[@id='PezComponent.ActionLogs']";
const History ="//p[@id='ReviewSummaryComponent.Actions']";
const YesBtn="//button[@id='dialog_button2']";
const NoBtn='//button[@id="dialog_button1"]';
const analyteChkBoxDisabled ='//input[@id="mat-checkbox-18-input" and @aria-checked="false"]';
const analyteDataHeader = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]';
const controlName = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]//span[@class="section-header-control"]';
const lotNumber = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]//span[@class="section-header-product-master-lot-number"]';
const expiryNumber = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]//span[@class="section-header-lot-expiration"]';
const departmentName = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]//span[@class="section-header-department"]';
const instrumentName = '(//*[contains(@class,"section-header-row cdk-column-sectionHeaderColum")])[1]//span[@class="section-header-instrument"]';
const updateBtn="//span[text()=' Update ']";
const ZScore="(//td[@class='mat-cell cdk-cell zscore-column column-padding cdk-column-Z-score mat-column-Z-score first-row-border ng-star-inserted'])[1]";
const LJChart="(//div[@class='advanced-lj-button'])[1]";
const AcceptedStatusON="(//mat-slide-toggle[@class='mat-slide-toggle mat-primary mat-checked'])[1]";
const RejectedstatusOFF="(//mat-slide-toggle[@class='mat-slide-toggle mat-primary'])[1]";
const cancelBtn="//span[text()='cancel']";
const resultvalueTxt="//td[@class='mat-cell cdk-cell results-column column-padding cdk-column-Results mat-column-Results first-row-border is-warning ng-star-inserted']";
const Status="//td[@class='mat-cell cdk-cell status-column column-padding cdk-column-Status mat-column-Status first-row-border is-warning ng-star-inserted']";
const additionalfiltericon="//div[@id='menuselector']";
const AFHeading="//span[text()='Additional Filters']";
const AFClose="//span[@class='close-icon']";
const AFLast30Days="(//div[@class='mat-checkbox-inner-container'])[1]";
const AFViolations="(//div[@class='mat-checkbox-inner-container'])[2]";
const AFUpdate="//button[text()='UPDATE']";
const Last30DayCount="//span[@class='filter-result-icon-last30Days']";
const ViolationsCount="//span[@class='filter-result-icon-violation']";
const totalRunsCount="//span[@class='runCount']";
const closeBtn="//span[@class='close-icon']";
const acceptedTopFilterSelected="//div[@class='filter-toolbar---action-item accepted-bg-color']";
const warningTopFilterSelected="//div[@class='filter-toolbar---action-item warning-bg-color']";
const RejectedTopFilterSelected="//div[@class='filter-toolbar---action-item reject-bg-color']";

export class BenchAndReview {

  verifyAdditionalFilterIcon() {
    return new Promise((resolve, reject) => {
      library.logStep("Verify Additional Filter Icon");
      let ele = element(additionalfiltericon);
      ele.isDisplayed().then((result) => {
        if (result) {
          library.logStep(
            "Additional Filter icon is displayed in Becnh/Supervisor review page"
          );
          resolve("Additional Filter icon is displayed in Becnh/Supervisor review page");
        }
        resolve(true);
      });
    });
  }

  openAdditionalFilterWindow() {
    return new Promise((resolve, reject) => {
      library.logStep("Open Additional Filter Window");
      let ele = element(by.xpath(additionalfiltericon));
      library
        .waitTillClickable(ele, 8888)
        .then(() => {
          return ele.click();
        })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          reject(e);
          expect(false).toBe(
            true,
            "Exception Occured while opening Additional Filter Window " + e
          );
        });
    });
  }

  verifyAdditionalFiltersSelectd_UpdatedBTnEnabled()
  {
    return new Promise((resolve, reject) => {  
      let AFLast30Days1= element(by.xpath(AFLast30Days));
      let AFViolations1 = element(by.xpath(AFViolations));
      let AFUpdate1 = element(by.xpath(AFUpdate));
      let ele = element(by.xpath(additionalfiltericon));
      browser.wait(
       browser.ExpectedConditions.visibilityOf(
         element(by.xpath(additionalfiltericon))
       ),
       5000
      ).then(() => {
           return ele.click();
         })
      .then(() => {
         if(!AFLast30Days1.isSelected())
         {
          return AFLast30Days1.click();
         }
        }).then(() => {
          if(!AFViolations1.isSelected())
          {
            return AFViolations1.click();
          }
      })
        .then(() => {
          if ((AFLast30Days1.isSelected() || AFViolations1.isSelected()) && AFUpdate1.isEnabled) {
            library.logStep("Additioonal Filters are selected and Update is enabled");
            resolve(true);
          } else {
            library.logStep("Additioonal Filters are not selected and Update is disabled");
            resolve(false);
          }
        })
    });
  }

  VerifyIsSelectedLast30DaysFilterDisplayedRun(){
    return new Promise((resolve, reject) => {  
      let AFLast30Days1= element(by.xpath(AFLast30Days));
      let Last30DayCount1= element(by.xpath(Last30DayCount)).getText().toString();
      let AFcountNum = parseInt(Last30DayCount1);
      let AFUpdate1 = element(by.xpath(AFUpdate));
      let totalRunsCount1= element(by.xpath(totalRunsCount)).getText().toString();
      let totalRunsCountNum = parseInt(totalRunsCount1);
      let ele = element(by.xpath(additionalfiltericon));
      browser.wait(
       browser.ExpectedConditions.visibilityOf(
         element(by.xpath(additionalfiltericon))
       ),
       5000
      ).then(() => {
           return ele.click();
         })
      .then(() => {
         if(!AFLast30Days1.isSelected())
         {
          return AFLast30Days1.click();
         }
        }).then(() => {
            browser.wait(
            browser.ExpectedConditions.visibilityOf(
              element(by.xpath(AFUpdate))
            ),
            5000
          )
           return AFUpdate1.click();
         })
         .then(() => {
          browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(analytename))
          ),
          5000
        )
        .then(() => {
          if (AFcountNum==totalRunsCountNum) {
            library.logStep("Last 30 Days Additioonal Filters are selected and also respective runs are displayed on main page");
            resolve(true);
          } else {
            library.logStep("Last 30 Days Additioonal Filters are selected and also respective runs are not displayed on main page")
            resolve(false);
          }
        })
    })
  })
  }

  VerifyIsLast30DaysFilterSelectedWithTopFilters(){
    return new Promise((resolve, reject) => {  
      let AFLast30Days1= element(by.xpath(AFLast30Days));
      let Last30DayCount1= element(by.xpath(Last30DayCount)).getText().toString();
      let AFUpdate1 = element(by.xpath(AFUpdate));
      let acceptedTopFilterSelected1 = element(by.xpath(acceptedTopFilterSelected));
      let ele = element(by.xpath(additionalfiltericon));
      browser.wait(
       browser.ExpectedConditions.visibilityOf(
         element(by.xpath(additionalfiltericon))
       ),
       5000
      ).then(() => {
           return ele.click();
         })
      .then(() => {
         if(!AFLast30Days1.isSelected())
         {
          return AFLast30Days1.click();
         }
        }).then(() => {
            browser.wait(
            browser.ExpectedConditions.visibilityOf(
              element(by.xpath(AFUpdate))
            ),
            5000
          )
           return AFUpdate1.click();
         })
         .then(() => {
          browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(analytename))
          ),
          5000
        ).then(() => {
           if (AFLast30Days1.isSelected() && acceptedTopFilterSelected1.isPresent())
           {
            library.logStep("Last 30 Days Additioonal Filters are selected along with top filters and  also respective runs are displayed on main page");
            resolve(true);
          } else {
            library.logStep("Last 30 Days Additioonal Filters are selected along with top filters and respective runs are not displayed on main page")
            resolve(false);
          }
        })
    })
  })
  }

  verifyIsSelectedViolationsFilter()
  {
    return new Promise((resolve, reject) => {  
      let AFViolations1 = element(by.xpath(AFViolations));
      let ViolationsCount1= element(by.xpath(ViolationsCount)).getText().toString();
      let AFcountNum = parseInt(ViolationsCount1);
      let AFUpdate1 = element(by.xpath(AFUpdate)); 
      let warningTopFilterSelected1 = element(by.xpath(warningTopFilterSelected));
      let RejectedTopFilterSelected1 = element(by.xpath(RejectedTopFilterSelected));
      let ele = element(by.xpath(additionalfiltericon));
    
      browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(additionalfiltericon))
      ),
      5000
     ).then(() => {
          return ele.click();
        }).then(() => {
          if(!AFViolations1.isSelected())
          {
            return AFViolations1.click();
          }
      })
      .then(() => {
        browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(AFUpdate))
        ),
        5000
      )
       return AFUpdate1.click();
     })
     .then(() => {
      browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(analytename))
      ),
      5000
    ).then(() => {
      return this.ReadFiltersCounts();
    })
      .then((expectedtopfiltercount) => {
        let warningFiltercount = (expectedtopfiltercount.warningFilterCount).toString();
        let warningFiltercountnum = parseInt(warningFiltercount);
        let RejectedFilterCount=(expectedtopfiltercount.rejectedFilterCount).toString();
        let RejectedFilterCountnum = parseInt(RejectedFilterCount);
        let WarningRejectedTotalCount=warningFiltercountnum+RejectedFilterCountnum;
          if ((AFViolations1.isSelected()) && warningTopFilterSelected1.isPresent() && RejectedTopFilterSelected1.isPresent() &&(AFcountNum==WarningRejectedTotalCount)) {
            library.logStep("Additioonal Filters are selected and Update is enabled");
            resolve(true);
          } else {
            library.logStep("Additioonal Filters are not selected and Update is disabled");
            resolve(false);
          }
        })
      })
    })
  }

  verifyIsViolationsAutoSelected()
  {
    return new Promise((resolve, reject) => {
      let WarningFilterBtn = element(by.xpath(warningFilterBtn));
      let RejectedFilterBtn = element(by.xpath(rejectedFilterBtn));
      let AFViolations1 = element(by.xpath(AFViolations));
       browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(warningFilterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(rejectedFilterBtn))
          ),
          5000
        )
      }).then(() => {
        WarningFilterBtn.click();
        RejectedFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(RejectedTopFilterSelected))
          ),
          5000
        ).then(() => {
          return this.openAdditionalFilterWindow();
        })
        .then(() => {
          browser.wait(
            browser.ExpectedConditions.visibilityOf(
              element(by.xpath(AFViolations))
            ),
            5000
          )
        .then(() => {
            if (AFViolations1.isSelected()) {
              library.logStep("Selecting Warning and Rejected top filters, Violations addiotnal filter is auto selected");
              resolve(true);
            } else {
              library.logStep("Selecting Warning and Rejected top filters, Violations addiotnal filter is not auto selected");
              resolve(false);
            }
          })
      })
    })
  })
  }
  
  verifyAdditionalFiltersSelectedTogether(){
    return new Promise((resolve, reject) => {  
      let AFLast30Days1= element(by.xpath(AFLast30Days));
      let Last30DayCount1= element(by.xpath(Last30DayCount)).getText().toString();
      let AFViolations1 = element(by.xpath(AFViolations));
      let ViolationsCount1= element(by.xpath(ViolationsCount)).getText().toString();
      let AFUpdate1 = element(by.xpath(AFUpdate));
      let totalRunsCount1= element(by.xpath(totalRunsCount)).getText().toString();
      let totalRunsCountNum = parseInt(totalRunsCount1);
      let ele = element(by.xpath(additionalfiltericon));
      browser.wait(
       browser.ExpectedConditions.visibilityOf(
         element(by.xpath(additionalfiltericon))
       ),
       5000
      ).then(() => {
           return ele.click();
         })
      .then(() => {
         if(!AFLast30Days1.isSelected())
         {
          return AFLast30Days1.click();
         }
        }).then(() => {
          if(!AFViolations1.isSelected())
          {
            return AFViolations1.click();
          }
      }).then(() => {
        browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(AFUpdate))
        ),
        5000
      )
       return AFUpdate1.click();
     }).then(() => {
      browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(analytename))
      ),
      5000
     )
      }).then(() => {
        let AFcount=Last30DayCount1+ViolationsCount1;
        let AFcountNum = parseInt(AFcount);
          if (AFcountNum==totalRunsCountNum) {
            library.logStep("Additioonal Filters are selected and Update is enabled and the runs available under additional filtrs are displayed on main page");
            resolve(true);
          } else {
            library.logStep("Additioonal Filters are not selected and Update is disabled the runs available under additional filtrs are not displayed on main page");
            resolve(false);
          }
        })
    });
  }

  verifyAdditionalFilterCloseButtonFunctionality(){
    return new Promise((resolve, reject) => {
      library.logStep("Open Additional Filter Window");
     let ele = element(by.xpath(additionalfiltericon));
     let AFHeadingTxt=element(by.xpath(AFHeading));
     let Closeele = element(by.xpath(closeBtn));
     browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(additionalfiltericon))
      ),
      5000
     ).then(() => {
          return ele.click();
        })
        .then(() => {
             return Closeele.click();
        })
        .then(() => {
          return AFHeadingTxt.isPresent();
        })
        .then((x) => {
          if (x) {
            library.logFailStep(
              "Additional Filter Window is Present even after clicking the Close Button"
            );
          }
          resolve(x);
        });
     });
 }


  verifyAdditionalFilterWindowUIComponents(){
      return new Promise((resolve, reject) => {
        let AdditionalFilterWindowHeadingEle = element(by.xpath(AFHeading));
        let AdditionalFilterWindowCloseEle = element(by.xpath(AFClose));
        let AdditionalFilterWindowLast30Days = element(by.xpath(AFLast30Days));
        let AdditionalFilterWindowViolations = element(by.xpath(AFViolations));
        let AdditionalFilterWindowUpdateBtnEle = element( by.xpath(AFUpdate));
        let flag1, flag2, flag3, flag4,flag5;
        let ele = element(by.xpath(additionalfiltericon));
       browser.wait(
       browser.ExpectedConditions.visibilityOf(
        element(by.xpath(additionalfiltericon))
      ),
      5000
     ).then(() => {
          return ele.click();
        })
        AdditionalFilterWindowHeadingEle
          .isPresent()
          .then((x) => {
            flag1 = x;
            if (!flag1) {
              library.logFailStep(
                "Heading is not Present in Additional Filter Window"
              );
            }
          })
          .then(() => {
            return AdditionalFilterWindowCloseEle.isPresent();
          })
          .then((x) => {
            flag2 = x;
            if (!flag2) {
              library.logFailStep(
                "Close 'X' is not Present in Additional Filter Window"
              );
            }
          })
          .then(() => {
            return AdditionalFilterWindowLast30Days.isPresent();
          })
          .then((x) => {
            flag3 = x;
            if (!flag3) {
              library.logFailStep(
                "Last 30 Days Filter is not Present in Additional Filter Window"
              );
            }
          })
          .then(() => {
            return AdditionalFilterWindowViolations.isPresent();
          })
          .then((x) => {
            flag5 = x;
            if (!flag5) {
              library.logFailStep(
                "Violations Filter is not Present in Additional Filter Window"
              );
            }
          })
          .then(() => {
            return AdditionalFilterWindowUpdateBtnEle.isPresent();
          })
          .then((x) => {
            flag4 = x;
            if (!flag4) {
              library.logFailStep(
                "Update Button is not Present in Additional Filter Window"
              );
            }
          })
          .then(() => {
            if (!flag1 || !flag2 || !flag3 || !flag4 || flag5) {
              reject(false);
            } else {
              resolve(true);
            }
          })
          .catch((e) => {
            throw e;
          });
      });
  }

  VerifyIsResultValuesUpdated(result){
    return new Promise(async(resolve) =>{
      let editbutton1 = element(by.xpath(editbutton));
      let resultvalue1 = element(by.xpath(resultvalue));
      let resultvalueTxt1 =(await (element(by.xpath(resultvalueTxt))).getText()).toString();
      let update = element(by.xpath(updateBtn));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        editbutton1.click();
      }).then(() => {
        return resultvalue1.click();
      })
      .then(() => {
        resultvalue1.clear();
      }).then(() => {
        resultvalue1.sendKeys(result);
      })
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(updateBtn))
        ),
        5000
      )
    .then(() => {
      update.click();
     })
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(updateBtn))
        ),
        5000
      ).then(() => {
        if(result==resultvalueTxt1)
        {
          resolve(true)
          library.logStep("Clicking on 'UPDATE' Btn changes are saved successfully");
        }
        else
        {
          resolve(false)
          library.logStep("Clicking on 'UPDATE' Btn changes are not saved");

        }
       })
    
    })
  
 }
VerifyIsStautsUpdated(){
  return new Promise(async(resolve) =>{
    let editbutton1 = element(by.xpath(editbutton));
    let statusvalueON = element(by.xpath(AcceptedStatusON));
    let statusvalueOFF = element(by.xpath(RejectedstatusOFF));
    let update = element(by.xpath(updateBtn));
    let statusTxt=(await element(by.xpath(Status)).getText()).toString();
    browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(editbutton))
      ),
      5000
    ).then(() => {
      editbutton1.click();

    }).then(() => {
    browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(editbutton))
      ),
      5000
    ).then(() => {
      if(statusTxt=='Accepted')
      {
        return statusvalueON.click();

      }
      else
      {
        return statusvalueOFF.click();
      }
      
    }) .then(() => {
      update.click();
     })
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(updateBtn))
        ),
        5000
      ).then(() => {
        let statusTxt1=(element(by.xpath(Status)).getText()).toString();
        if(statusTxt=='Accepted')
        {
          if(statusTxt1=='Rejected')
          {
          resolve(true)
          library.logStep("Status of run updated successfully");
          }
          else
          {
            resolve(false)
            library.logStep("Status of run not updated");
  
          }
       }
       if(statusTxt=='Rejected')
       {
         if(statusTxt1=='Accepted')
         {
         resolve(true)
         library.logStep("Status of run updated successfully");
         }
         else
         {
           resolve(false)
           library.logStep("Status of run not updated");
 
         }
      }
       })
   })
  })
}

VerifyCancelBtnFunctionality(result){
  return new Promise(async(resolve) =>{
    let editbutton1 = element(by.xpath(editbutton));
    let resultvalue1 = element(by.xpath(resultvalue));
    let resultvalueTxt1 =(await (element(by.xpath(resultvalueTxt))).getText()).toString();
    let cancel = element(by.xpath(cancelBtn));
    browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(editbutton))
      ),
      5000
    ).then(() => {
      editbutton1.click();

    }).then(() => {
      return resultvalue1.click();
    })
    .then(() => {
      resultvalue1.clear();
    }).then(() => {
      resultvalue1.sendKeys(results);
    })
    browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(editbutton))
      ),
      5000
    )
  .then(() => {
    cancel.click();
  })
    browser.wait(
      browser.ExpectedConditions.visibilityOf(
        element(by.xpath(updateBtn))
      ),
      5000
    ).then(() => {
      if(result!=resultvalueTxt1)
      {
        resolve(true)
        library.logStep("Clicking on 'CANCEL' Btn changes are aborted");
      }
      else
      {
        resolve(false)
        library.logStep("Clicking on 'UPDATE' Btn changes are not aborted");

      }
     })
  })
}

SwitchToBenToSupReviewAndViceVersa(){
  return new Promise(async(resolve) =>{
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(switchToSupervisorReviewLink))), 10000).then(async() => {
      let switchToSupervisorReviewLinkEle = element.all(by.xpath(switchToSupervisorReviewLink));
      switchToSupervisorReviewLinkEle.click();
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(switchToConfirmationPopup))), 10000)
    let XiconEle = element.all(by.xpath(Xicon));
    let YesBtnEle = element.all(by.xpath(YesBtn));
    let NoBtnEle = element.all(by.xpath(NoBtn));
      if(XiconEle.isDisplayed() && YesBtnEle.isDisplayed() && NoBtnEle.isDisplayed()){
        YesBtnEle.click();
        resolve(true)
      }
      });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(switchToBenchReviewLink))), 10000).then(async() => {
      let XiconEle = element.all(by.xpath(Xicon));
    let YesBtnEle = element.all(by.xpath(YesBtn));
    let NoBtnEle = element.all(by.xpath(NoBtn));
      if(XiconEle.isDisplayed() && YesBtnEle.isDisplayed() && NoBtnEle.isDisplayed()){
        YesBtnEle.click();
        resolve(true)
      }
    });
  });
}
ClickONFilterPaginationLjHistory(){
  return new Promise(async(resolve) =>{
    
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(advanceLJChart))), 10000)
        .then(async() => { 
          let advanceLJChartEle = element.all(by.xpath(advanceLJChart));
          advanceLJChartEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(CloseIcon))), 10000)
          let CloseIconEle = element.all(by.xpath(CloseIcon));
          CloseIconEle.click();
          resolve(true)
        });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(actionlog))), 10000)
    .then(async() => {
      let ActionLogEle = element.all(by.xpath(actionlog));
      library.hoverOverElement(ActionLogEle);
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(actionLogs))), 10000)
      let actionLogsEle = element.all(by.xpath(actionLogs));
      if(actionLogsEle.isDisplayed()){
        ActionLogEle.click();
        resolve(true)
      }      
    });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(History))), 10000)
    .then(async() =>{
      let closeIconBtnEle = element.all(by.xpath(closeIconBtn));
      if(closeIconBtnEle.isDisplayed()){
        closeIconBtnEle.click();
        resolve(true)
      }
    });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(additionfilterIcon))), 10000)
    .then(async() =>{
      let additionFilterIconEle = element.all(by.xpath(additionfilterIcon));
      additionFilterIconEle.click();
      let closeAdditionalFilterWindowEle = element.all(by.xpath(closeadditionalfilterwindow));
      let violationsEle = element.all(by.xpath(violations));
      let last30DaysFilterCountEle = element.all(by.xpath(last30daysfiltercount));
      if(closeAdditionalFilterWindowEle.isDisplayed() && violationsEle.isDisplayed() && last30DaysFilterCountEle.isDisplayed()){
        closeAdditionalFilterWindowEle.click();
        resolve(true)
      }
    });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(acceptedFilterCounts))), 10000)
    .then(async() =>{
      let closeAdditionalFilterWindowEle = element.all(by.xpath(closeadditionalfilterwindow));
      let violationsEle = element.all(by.xpath(violations));
      let last30DaysFilterCountEle = element.all(by.xpath(last30daysfiltercount));
      if(closeAdditionalFilterWindowEle.isDisplayed() && violationsEle.isDisplayed() && last30DaysFilterCountEle.isDisplayed()){
        resolve(true)
      }
    });
    browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(gearIcon))), 10000)
        .then(async() => {
          let gearIconEle = element.all(by.xpath(gearIcon));
          gearIconEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(PeerMeanChkBx))), 10000)
          const PeerMeanChkBxEle = element(by.xpath(PeerMeanChkBx));          
          library.clickJS(PeerMeanChkBxEle);
          const UpdateBtnEle = element(by.xpath(UpdateBtn));
          let closeadditionalfilterwindowEle = element.all(by.xpath(closeadditionalfilterwindow));
          browser.wait(browser.ExpectedConditions.invisibilityOf(UpdateBtnEle), 5000);
          if(UpdateBtnEle.isDisplayed()){
            library.clickJS(PeerMeanChkBxEle);
            closeadditionalfilterwindowEle.click();
            resolve(true)
          }
        });
        browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analyteChkBoxDisabled))), 10000)
        .then(async() =>{          
          let analyteChkBoxDisabledEle = element.all(by.xpath(analyteChkBoxDisabled));
          if(analyteChkBoxDisabledEle.isDisplayed()){
            resolve(true)
          }
        });
  });
}
  ClickOnLaunchLabForCtsUser(LabName){
    return new Promise(async(resolve) => {
      let gearIconEle = element.all(by.xpath(gearIcon));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(gearIcon))), 10000)
        .then(async() => {          
          gearIconEle.click();          
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(AccAndLocManage))), 10000)
          let AccAndLocManageEle = element.all(by.xpath(AccAndLocManage));
          AccAndLocManageEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(locationsTab))), 10000)
          let locationsTabEle = element.all(by.xpath(locationsTab));
          locationsTabEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(Category))), 10000)
          let CategoryEle = element.all(by.xpath(Category));
          CategoryEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(Lab))), 10000)
          let LabEle = element.all(by.xpath(Lab));
          LabEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(Keyword))), 10000)
          let KeywordEle = element.all(by.xpath(Keyword));
          KeywordEle.sendKeys(LabName);
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(Search))), 10000)
          let SearchEle = element.all(by.xpath(Search));
          SearchEle.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(LaunchLab))), 10000)
          let LaunchLabEle = element.all(by.xpath(LaunchLab));
          LaunchLabEle.click();
          resolve(true)
    });
  });
}

  VerifyPointDataIsDisplayedOnBenchSupervisorReviewPage(analyte: string, value1: string,date:string,time:string){
    return new Promise((resolve) => {
      let enterdAnalytefirst = element.all(by.xpath(analytename));
      let enterdAnalyte: ElementFinder = enterdAnalytefirst.get(1);
      let analyteName = enterdAnalyte.getText().toString();
      let currentRunDate= element.all(by.xpath(currentrundate)).get(1);
      let RunDate=currentRunDate.getText().toString();
      let RunTime= element.all(by.xpath(RunsTime)).get(1);
      let runTime=RunTime.getText().toString();
      let RunLevel1Results: ElementFinder = element.all(by.xpath(RunsLevel1Results)).get(1);
      let level1Result = RunLevel1Results.getText.toString();
      let switchToBenchReviewLink = element(by.xpath(switchToBenchReviewLink1));
      let yesButton=element(by.xpath(yesBtn));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
        .then(() => {
          if  (enterdAnalyte.isDisplayed() && analyteName == analyte && level1Result == value1 && RunDate == date,runTime==time) {
            switchToBenchReviewLink.click();
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 5000)
            yesButton.click();
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
            if(enterdAnalyte.isDisplayed() && analyteName == analyte && level1Result == value1 && RunDate == date,runTime==time) {
              library.logStep("Entered runs not displayed on Supervisor Review and Bench Review Page");
              resolve(true)
            }
            else {
              resolve(false)
              library.logStep("Entered runs not displayed on Bench Review Page");
            }
          }
          else {
            resolve(false)
            library.logStep("Entered runs not displayed on Supervisor Review Page");
          }
        })
    })
  }

  verifyRunsReviewedIndependentlyOnBSReviewPAge() {
    return new Promise(async (resolve, reject) => {
      let enterdAnalytefirst = element.all(by.xpath(latestenterdAnalyte));
      let enterdAnalyte: ElementFinder = enterdAnalytefirst.get(1);
      let ReviewBtn = element(by.xpath(ReviewedBtn));
      let totalruns = element.all(by.xpath(analytename));
      let countofruns = await totalruns.count();
      console.log("previous count in number=" + countofruns);
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
        .then((countinNumber) => {
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
          enterdAnalyte.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(ReviewedBtn))), 25000)
          if (ReviewBtn.isEnabled) {
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(ReviewedBtn))), 20000)
            library.clickJS(ReviewBtn);
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 20000)
          }
        })
        .then(async () => {
          let totalrunsafterReview = element.all(by.xpath(analytename));
          let TotalrunsafterReview = await totalrunsafterReview.count();
          console.log("count after review=" + TotalrunsafterReview);
          if (TotalrunsafterReview == countofruns - 1) {
            library.logStep("runs get review independently in the superviosr page and get removed from that page");
            resolve(true)

          }
          else {
            library.logFailStep("runs not get review independently in the superviosr page and not get removed from that page");
            reject(true)
          }

        })
    })
  }

  verifyReviewedRunsPresentAnotherPage(analyte: string, value1: string,date:string,time:string) {
    return new Promise((resolve) => {
      let enterdAnalytefirst = element.all(by.xpath(analytename));
      let enterdAnalyte: ElementFinder = enterdAnalytefirst.get(1);
      let currentRunDate= element.all(by.xpath(currentrundate)).get(1);
      let RunDate=currentRunDate.getText().toString();
      let RunTime= element.all(by.xpath(RunsTime)).get(1);
      let runTime=RunTime.getText().toString();
      let RunLevel1Results: ElementFinder = element.all(by.xpath(RunsLevel1Results)).get(1);
      let level1Result = RunLevel1Results.getText.toString();
      let switchToBenchReviewLink = element(by.xpath(switchToBenchReviewLink1));
      let yesButton=element(by.xpath(yesBtn));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
        .then(() => {
          switchToBenchReviewLink.click();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
          return yesButton.click();
        })
        .then(async() => {
          browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(loadingMessage))), 20000);
          let analyteName = await enterdAnalyte.getText().toString();
          if (enterdAnalyte.isDisplayed() && analyteName == analyte && level1Result == value1 && RunDate == date,runTime==time) {
            resolve(true)
            library.logStep("Entered run present on Bench Review Page");
          }
          else {
            resolve(false)
            library.logStep("Entered run not present on Bench Review Page");
          }
       })
      })
   }

  verifyDisplyedAllDepartmentsTooltipWindow() {
    return new Promise((resolve) => {
      let DepartmentDropdown = element(by.xpath(deptFilter));
      let DepartmentsTooltip = element(by.xpath(departmentsTooltip));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 10000)
        .then(() => {
          return DepartmentDropdown.isDisplayed();
        })
        .then(() => {
          return this.verifyPanelFilterIsDisbled();
        })
        .then(() => {
          return library.hoverOverElement(DepartmentDropdown);
        })
        .then(() => {
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(departmentsTooltip))), 5000)
        })
        .then(() => {
          if (DepartmentsTooltip.isDisplayed()) {
            resolve(true)
            library.logStep("By hovering over on all departments dropdown 'Department' tooltip window dispalyed");
          }
          else {
            resolve(false)
            library.logStep("By hovering over on all departments dropdown 'Department' tooltip window not dispalyed");
          }
        })
    })
  }

  verifyDisplyedAllInstrumentsTooltipWindow() {
    return new Promise((resolve) => {
      let InstrumentsDropdown = element(by.xpath(instrumentFilter));
      let InstrumnetsTooltip = element(by.xpath(instrumentsTooltip));
      InstrumentsDropdown.isDisplayed()
        .then(() => {
          return this.verifyPanelFilterIsDisbled();
        })
        .then(function () {
          return library.hoverOverElement(InstrumentsDropdown);
        }).then(() => {
          if (InstrumnetsTooltip.isDisplayed()) {
            resolve(true)
            library.logStep("By hovering over on all departments dropdown department tooltip displayed with all selected instruments present under the all/specific selected departments by default.");
          }
          else {
            resolve(false)
            library.logStep("By hovering over on all departments dropdown department tooltip does not displayed with all selected instruments present under the all/specific selected departments by default.");
          }
        })
        .catch(() => {
          resolve(false);
          library.logStep("By hovering over on all departments dropdown department tooltip does not displayed with all selected instruments present under the all/specific selected departments by default.");

        })
    })
  }

  verifyDisplyedPanelsTooltipWindow() {
    return new Promise((resolve) => {
      let PanelsDropdown = element(by.xpath(panelFilter));
      let PanelsTooltip = element(by.xpath(panelsTooltip));
      PanelsDropdown.isDisplayed()
        .then(() => {
          return this.verifyDeptFilterIsDisbled();
        })
        .then(function () {
          return library.hoverOverElement(PanelsDropdown);
        }).then(() => {
          if (PanelsTooltip.isDisplayed()) {
            resolve(true)
            library.logStep("By hovering over the Panels dynamic filter,panel tooltip displayed with None by default.");
          }
          else {
            resolve(false)
            library.logStep("By hovering over the Panels dynamic filter,panel tooltip does not displayed with None by default.");
          }
        })
        .catch(() => {
          resolve(false);
          library.logStep("By hovering over the Panels dynamic filter,panel tooltip does not displayed with None by default.");

        })
    })
  }
  verifyDisplyedSelectedDepartmentsOnTooltipWindow(departmnets: string[]) {
    return new Promise((resolve) => {
      let DepartmentDropdown = element(by.xpath(deptFilter));
      let DepartmentsTooltip = element.all(by.xpath(departmentsTooltip));
      let DepartmentsTooltipDptText = element(by.xpath(depttoolitipdeptTxt)).getText();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(deptFilter))), 25000)
      DepartmentDropdown.isDisplayed()
        .then(() => {
          return this.verifyPanelFilterIsDisbled();
        })
        .then(() => {
          return DepartmentDropdown.click();
        })
        .then(() => {
          let selectedDepartmewntsText: string[] = [];

          for (const department of departmnets) {
            const selecteddepartment: ElementFinder = element(by.xpath(departmentname.replace("<text>", department)));
            selecteddepartment.click();
            let selecteddept: string = (selecteddepartment.getText()).toString();
            selectedDepartmewntsText.push(selecteddept);
          }
          return selectedDepartmewntsText;

        })
        .then((x) => {
          browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
          return browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(deptFilter))), 5000)
        })
        .then(() => {
          return library.hoverOverElement(DepartmentDropdown);
        })
        .then(() => {
          if (DepartmentsTooltip.isDisplayed()) {
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(depttoolitipdeptTxt))), 5000)
            let DepartmentsTooltipDeptTxt = element(by.xpath(depttoolitipdeptTxt)).getText();
            let TooltipDeptTxt = DepartmentsTooltipDeptTxt.toString();
            let TooltipdeptArrayTxt: string[] = TooltipDeptTxt.split(',\n');
            return TooltipdeptArrayTxt;
          }
        })
        .then((TooltipdeptArrayTxt) => {
          let sortedSelectedDept = departmnets.sort();
          let count = 0;
          for (let i = 0; i < sortedSelectedDept.length; i++) {
            if (TooltipdeptArrayTxt[i] == sortedSelectedDept[i]) {
              count++;
            }
          }
          if (count == sortedSelectedDept.length) {
            library.logStep("by hovering over department dropdown tooltip displayed with selected departments");
            resolve(true);
          }
          else {
            library.logFailStep("by hovering over department dropdown tooltip not displayed with selected departments");
            resolve(false);
          }

        });

    });
  }

  verifyDisplyedSelectedInstrumentsOnTooltipWindow(instruments: string) {
    return new Promise((resolve) => {
      let InstrumentDropdown = element(by.xpath(instrumentFilter));
      let InstrumentsTooltip = element.all(by.xpath(instrumentsTooltip));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(instrumentFilter))), 25000)
      InstrumentDropdown.isDisplayed()
        .then(() => {
          return this.verifyPanelFilterIsDisbled();
        })
        .then(() => {
          return InstrumentDropdown.click();
        })
        .then(async () => {
          const selectedinstrument: ElementFinder = await element(by.xpath(("(//*[contains(text(),'" + instruments + "')])[1]")));
          library.clickJS(selectedinstrument);
          browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(instrumentFilter))), 5000)
          let selectedInstruments = (await (InstrumentDropdown.getText())).toString();
          return selectedInstruments;
        })
        .then(() => {
          return library.hoverOverElement(InstrumentDropdown);
        })
        .then(async () => {
          if (InstrumentsTooltip.isDisplayed()) {
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(instrumenttoolitipdeptTxt))), 5000)
            let instrumentsTooltipTxt = (await (element(by.xpath(instrumenttoolitipdeptTxt)).getText())).toString();
            return instrumentsTooltipTxt;
          }
        })
        .then((instrumentsTooltipTxt) => {
          if (instrumentsTooltipTxt == instruments.trim()) {
            library.logStep("by hovering over instrument dropdown tooltip displayed with selected instruments only");
            resolve(true);
          }
          else {
            library.logFailStep("by hovering over instrument dropdown tooltip not displayed with selected instrument only");
            resolve(false);
          }

        });

    });

  }


  DepartmentDropdownDisplayed() {
    return new Promise((resolve) => {
      let DepartmentDropdown = element(by.xpath(deptFilter));
      let allDepatrtmentsuntick = element(by.xpath(allDepartmentsSelected));
      if (DepartmentDropdown.isDisplayed()) {
        DepartmentDropdown.click();
        allDepatrtmentsuntick.click();
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
      }
    })
  }

  verifyDisplyedSelectedPanelsOnTooltipWindow(panels: string) {
    return new Promise((resolve) => {
      let PanelsDropdown = element(by.xpath(panelFilter));
      let PanelsTooltip = element.all(by.xpath(panelsTooltip));
      this.DepartmentDropdownDisplayed();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(panelFilter))), 10000);
      PanelsDropdown.isDisplayed()
        .then(() => {
          browser.wait(browser.ExpectedConditions.elementToBeClickable(element(by.xpath(panelFilter))), 5000);
          return PanelsDropdown.click()
        })
        .then(async () => {
          const selectedPanel: ElementFinder = await element(by.xpath(("//*[contains(text(),'" + panels + "')]")));
          library.clickJS(selectedPanel);
          browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
          browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(instrumentFilter))), 5000)
          let selectedPanels = (await (PanelsDropdown.getText())).toString();
          return selectedPanels;
        })
        .then(() => {
          return library.hoverOverElement(PanelsDropdown);
        })
        .then(async () => {
          if (PanelsTooltip.isDisplayed()) {
            browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(allTooltipNoneTxt))), 5000)
            let panelsTooltipTxt = (await (element(by.xpath(allTooltipNoneTxt)).getText())).toString();
            return panelsTooltipTxt;
          }
        })
        .then((panelsTooltipTxt) => {
          if (panelsTooltipTxt == panels.trim()) {
            library.logStep("by hovering over panels dropdown tooltip displayed with selected panels only");
            resolve(true);
          }
          else {
            library.logFailStep("by hovering over panels dropdown tooltip not displayed with selected panels only");
            resolve(false);
          }

        });
    });
  }
  verifyDepartmentTooltipSelectedAsNone() {
    return new Promise((resolve) => {
      let DepartmentDropdown = element(by.xpath(deptFilter));
      let DepartmentsTooltip = element(by.xpath(departmentsTooltip));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(deptFilter))), 10000)
      let expectedtxt = "None";
      DepartmentDropdown.isDisplayed()
        .then(function () {
          library.hoverOverElement(DepartmentDropdown);
          library.logStep("Hover over departments dropdown");
        })
        .then(async () => {
          let panelTooltipNoneTxt = await element(by.xpath(DepartmentNonTxt)).getText();
          let noneTxt = await panelTooltipNoneTxt.toString();
          if (DepartmentsTooltip.isDisplayed()) {
            if (noneTxt.trim() == expectedtxt) {
              resolve(true)
              library.logStep("By hovering over on department filter if there is no any department in lab, department tooltip displayed with 'None' ");
            }
            else {
              resolve(false)
              library.logStep("By hovering over on department filter if there is any department in lab, department tooltip displayed with department name list");
            }
          }

        })
    })

  }

  verifyPanelsTooltipSelectedAsNone() {
    return new Promise((resolve) => {
      let PanelsDropdown = element(by.xpath(panelFilter));
      let PanelsTooltip = element.all(by.xpath(panelsTooltip));
      let expectedtxt = "None";
      PanelsDropdown.isDisplayed()
        .then(() => {
          return this.verifyDeptFilterIsDisbled();
        })
        .then(function () {
          library.hoverOverElement(PanelsDropdown);
          library.logStep("Hover over Panels dropdown");
        }).then(async () => {
          let panelTooltipNoneTxt = await element(by.xpath(NoneTxtOnTooltip)).getText();
          let noneTxt = await panelTooltipNoneTxt.toString();
          if (PanelsTooltip.isDisplayed()) {
            if (noneTxt == expectedtxt) {
              resolve(true)
              library.logStep("By hovering over on if there is no any panels selected, panels tooltip displayed with 'None' ");
            }
            else {
              resolve(false)
              library.logStep("By hovering over on if there is any panels selected, panels tooltip displayed with panels name list");
            }
          }

        })
    })
  }

  unclickAlltopFilter() {
    let AcceptedFilterSelction = element(by.xpath(acceptedFilterSelction));
    let WarningFilterSelction = element(by.xpath(warningFilterSelction));
    let RejectedFilterSelction = element(by.xpath(rejectedFilterSelction));
    let ActioncommentSelection = element(by.xpath(actioncommentSelection));
    if (AcceptedFilterSelction.isDisplayed()) {
      AcceptedFilterSelction.click();
    }
    if (WarningFilterSelction.isDisplayed) {
      WarningFilterSelction.click();
    }
    if (RejectedFilterSelction.isDisplayed) {
      RejectedFilterSelction.click();
    }
    if (ActioncommentSelection.isDisplayed) {
      ActioncommentSelection.click();

    }
  }

  verifyAcceptedFilterRuns() {
    return new Promise((resolve, reject) => {
      console.log("in Accepted Filetr Runs ")
      let AcceptedFliterBtn = element(by.xpath(acceptedFliterBtn));
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(analytename))), 25000)
        .then(() => {
          return this.unclickAlltopFilter();
        }).then(() => {
          browser.wait(
            browser.ExpectedConditions.visibilityOf(
              element(by.xpath(analytename))
            ),
            26000
          )
        }).then(() => {
          return AcceptedFliterBtn.click();
        }).then(() => {
          browser.wait(
            browser.ExpectedConditions.visibilityOf(
              element(by.xpath(analytename))
            ),
            26000
          );
        })
        .then(() => {
          return this.ReadFiltersCounts();
        })
        .then((topfiltercount) => {
          let acceptedFiltercount = (topfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let acceptedrecordsanalytename = element.all(by.xpath(analytename));
          let AcceptedFilterSelction = element(by.xpath(acceptedFilterSelction)).getCssValue("color");
          let AcceptedfilterbgColor = AcceptedFilterSelction.toString();
          let c = Math.ceil(acceptedcountnum / 25);
          let acceptedrecordsize;
          for (let i = c; i >= 1; i--) {
            acceptedrecordsize = acceptedrecordsize + parseInt((acceptedrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (acceptedcountnum == acceptedrecordsize && AcceptedfilterbgColor == "#d2e5d3") {
            library.logStep("all runs to be reviewed under Accepted Filter are displayed and bg color of Accpted filter button change to light green");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under Accepted Filter are not displayed and color of accepted filter button not change to light green ");
            resolve(false);
          }

        })
        .catch(() => {
          library.logStep("all runs to be reviewed under Accepted Filter are not displayed and color of accepted filter button not change to light green  ");
          reject(true);
        });
    });
  }


  verifyWarningFilterRuns() {
    return new Promise((resolve, reject) => {
      let WarningFilterBtn = element(by.xpath(warningFilterBtn));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFliterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(warningFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return WarningFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(analytename))
          ),
          5000
        );
      })
        .then(() => {
          return this.ReadFiltersCounts();
        })
        .then((topfiltercount) => {
          let warningFiltercount = (topfiltercount.warningFilterCount).toString();
          let warningcountnum = parseInt(warningFiltercount);
          let warningrecordsanalytename = element.all(by.xpath(analytename));
          let WarningFilterSelction = element(by.xpath(warningFilterSelction)).getCssValue("color");
          let WarningfilterbgColor = WarningFilterSelction.toString();
          let c = Math.ceil(warningcountnum / 25);
          let warningrecordsize;
          for (let i = c; i >= 1; i--) {
            warningrecordsize = warningrecordsize + parseInt((warningrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (warningcountnum == warningrecordsize && WarningfilterbgColor == "#f3e1d0") {
            library.logStep("all runs to be reviewed under warning Filter are displayed and bg color of warning filter button change to light orange");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under warning Filter are not displayed and color of warning filter button not change to light orange ");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under warning Filter are not displayed and color of warning filter button not change to light orange  ");
          reject(true);
        });
    });
  }

  verifyRejectedFilterRuns() {
    return new Promise((resolve, reject) => {
      let RejectedFilterBtn = element(by.xpath(rejectedFilterBtn));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(rejectedFilterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(rejectedFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return RejectedFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(analytename))
          ),
          5000
        );
      })
        .then(() => {
          return this.ReadFiltersCounts();
        })
        .then((topfiltercount) => {
          let rejectedFiltercount = (topfiltercount.rejectedFilterCount).toString();
          let rejectedcountnum = parseInt(rejectedFiltercount);
          let rejectedrecordsanalytename = element.all(by.xpath(analytename));
          let RejectedFilterSelction = element(by.xpath(rejectedFilterSelction)).getCssValue("color");
          let RejectedfilterbgColor = RejectedFilterSelction.toString();
          let c = Math.ceil(rejectedcountnum / 25);
          let rejectedrecordsize;
          for (let i = c; i >= 1; i--) {
            rejectedrecordsize = rejectedrecordsize + parseInt((rejectedrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (rejectedcountnum == rejectedrecordsize && RejectedfilterbgColor == "#eccccd") {
            library.logStep("all runs to be reviewed under rejected Filter are displayed and bg color of rejected filter button change to light red");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under rejected Filter are not displayed and color of rejected filter button not change to light red ");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under rejected Filter are not displayed and color of rejected filter button not change to light red  ");
          reject(true);
        });
    });
  }

  verifyActionCommentsFilterRuns() {
    return new Promise((resolve, reject) => {
      let ActionCommentFilterBtn = element(by.xpath(actioncommentFilterBtn));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(actioncommentFilterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(actioncommentFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return ActionCommentFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(analytename))
          ),
          5000
        );
      })
        .then(() => {
          return this.ReadFiltersCounts();
        })
        .then((topfiltercount) => {
          let actionCommentsFiltercount = (topfiltercount.actionCommentsFilterCount).toString();
          let actionCommentscountnum = parseInt(actionCommentsFiltercount);
          let actionCommentsrecordsanalytename = element.all(by.xpath(analytename));
          let ActionCommentsFilterSelction = element(by.xpath(actioncommentSelection)).getCssValue("color");
          let actionCommentsfilterbgColor = ActionCommentsFilterSelction.toString();
          let c = Math.ceil(actionCommentscountnum / 25);
          let actionCommentsrecordsize;
          for (let i = c; i >= 1; i--) {
            actionCommentsrecordsize = actionCommentsrecordsize + parseInt((actionCommentsrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (actionCommentscountnum == actionCommentsrecordsize && actionCommentsfilterbgColor == "#51596C33") {
            library.logStep("all runs to be reviewed under action/Comments Filter are displayed and bg color of action/Comments filter button change to gray");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under action/Comments Filter are not displayed and color of action/Comments filter button not change to gray");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under action/Comments Filter are not displayed and color of action/Comments filter button not change to gray  ");
          reject(true);
        });
    });
  }


  verifyselectionOfAcceptedWarningTopFilters() {
    return new Promise((resolve, reject) => {
      let AcceptedFliterBtn = element(by.xpath(acceptedFliterBtn));
      let WarningFilterBtn = element(by.xpath(warningFilterBtn));
      let RejectedFilterBtn = element(by.xpath(rejectedFilterBtn));
      let ActioncommentFilterBtn = element(by.xpath(actioncommentFilterBtn));
      let allrecordsanalytename = element.all(by.xpath(analytename));

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFliterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(warningFilterBtn))
          ),
          5000
        )
      }).then(() => {
        AcceptedFliterBtn.click();
        WarningFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(warningFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((topfiltercount) => {
          let acceptedFiltercount = (topfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let warningFiltercount = (topfiltercount.warningFilterCount).toString();
          let warningcountnum = parseInt(warningFiltercount);
          let addacceptedWarningcount = acceptedcountnum + warningcountnum;
          let allrecordsanalytename = element.all(by.xpath(analytename));
          let c = Math.ceil(addacceptedWarningcount / 25);
          let acceptedwarningrecordsize;
          for (let i = c; i >= 1; i--) {
            acceptedwarningrecordsize = acceptedwarningrecordsize + parseInt((allrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (addacceptedWarningcount == acceptedwarningrecordsize) {
            library.logStep("all runs to be reviewed under Accepted and warning Filter are displayed  ");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under Accepted and warning are not displayed  ");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under Accepted and warning are not displayed  ");
          reject(true);
        });
    })

  }

  verifyselectionOfAcceptedRejectedTopFilters() {
    return new Promise((resolve, reject) => {
      let AcceptedFliterBtn = element(by.xpath(acceptedFliterBtn));
      let WarningFilterBtn = element(by.xpath(warningFilterBtn));
      let RejectedFilterBtn = element(by.xpath(rejectedFilterBtn));
      let ActioncommentFilterBtn = element(by.xpath(actioncommentFilterBtn));
      let allrecordsanalytename = element.all(by.xpath(analytename));

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFliterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(rejectedFilterBtn))
          ),
          5000
        )
      }).then(() => {
        AcceptedFliterBtn.click();
        RejectedFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(rejectedFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((topfiltercount) => {
          let acceptedFiltercount = (topfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let rejectedFiltercount = (topfiltercount.rejectedFilterCount).toString();
          let rejectedcountnum = parseInt(rejectedFiltercount);
          let addacceptedRejectedcount = acceptedcountnum + rejectedcountnum;
          let allrecordsanalytename = element.all(by.xpath(analytename));
          let c = Math.ceil(addacceptedRejectedcount / 25);
          let acceptedrejectedrecordsize;
          for (let i = c; i >= 1; i--) {
            acceptedrejectedrecordsize = acceptedrejectedrecordsize + parseInt((allrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (addacceptedRejectedcount == acceptedrejectedrecordsize) {
            library.logStep("all runs to be reviewed under Accepted and Rejected Filter are displayed  ");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under Accepted and Rejected Filter are not displayed");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under Accepted and Rejected Filter are not displayed  ");
          reject(true);
        });
    })

  }

  verifyselectionOfAcceptedActioncommentsTopFilters() {
    return new Promise((resolve, reject) => {
      let AcceptedFliterBtn = element(by.xpath(acceptedFliterBtn));
      let WarningFilterBtn = element(by.xpath(warningFilterBtn));
      let RejectedFilterBtn = element(by.xpath(rejectedFilterBtn));
      let ActioncommentFilterBtn = element(by.xpath(actioncommentFilterBtn));
      let allrecordsanalytename = element.all(by.xpath(analytename));

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFliterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(actioncommentFilterBtn))
          ),
          5000
        )
      }).then(() => {
        AcceptedFliterBtn.click();
        ActioncommentFilterBtn.click();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(actioncommentFilterBtn))
          ),
          5000
        )
      }).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((topfiltercount) => {
          let acceptedFiltercount = (topfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let actionCommentsFiltercount = (topfiltercount.actionCommentsFilterCount).toString();
          let actionCommentscountnum = parseInt(actionCommentsFiltercount);
          let addacceptedActionCommentsdcount = acceptedcountnum + actionCommentscountnum;
          let allrecordsanalytename = element.all(by.xpath(analytename));
          let c = Math.ceil(addacceptedActionCommentsdcount / 25);
          let acceptedActionCommentsrecordsize;
          for (let i = c; i >= 1; i--) {
            acceptedActionCommentsrecordsize = acceptedActionCommentsrecordsize + parseInt((allrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (addacceptedActionCommentsdcount == acceptedActionCommentsrecordsize) {
            library.logStep("all runs to be reviewed under Accepted and Action/Comments Filter are displayed  ");
            resolve(true);
          }
          else {
            library.logStep("all runs to be reviewed under Accepted and Action/CommentsFilter are not displayed");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all runs to be reviewed under Accepted and Action/Comments Filter are not displayed  ");
          reject(true);
        });
    })

  }

  verifyDeselectionOfAllTopFilters() {
    return new Promise((resolve, reject) => {
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFliterBtn))
        ),
        5000
      ).then(() => {
        return this.unclickAlltopFilter();
      }).then(() => {
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(acceptedFliterBtn))
          ),
          5000
        )
      }).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((topfiltercount) => {
          let acceptedFiltercount = (topfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let warningFiltercount = (topfiltercount.warningFilterCount).toString();
          let warningcountnum = parseInt(warningFiltercount);
          let rejectedFiltercount = (topfiltercount.rejectedFilterCount).toString();
          let rejectedcountnum = parseInt(rejectedFiltercount);
          let actioncommentsFiltercount = (topfiltercount.actionCommentsFilterCount).toString();
          let actioncommentscountnum = parseInt(actioncommentsFiltercount);
          let totalrunscount = acceptedcountnum + warningcountnum + rejectedcountnum + actioncommentscountnum;
          let allrecordsanalytename = element.all(by.xpath(analytename));
          let c = Math.ceil(totalrunscount / 25);
          let totalrunssize;
          for (let i = c; i >= 1; i--) {
            totalrunssize = totalrunssize + parseInt((allrecordsanalytename.count()).toString());
            if (i > 1) {
              this.VerifyPaginationArrow();
            }
          }
          if (totalrunscount == totalrunssize) {
            library.logStep("all total runs to be reviewed are displayed by deselecting all top filters ");
            resolve(true);
          }
          else {
            library.logStep("all total runs to be reviewed are not displayed by deselecting all top filters  ");
            resolve(false);
          }

        }).catch(() => {
          library.logStep("all total runs to be reviewed are not displayed by deselecting all top filters");
          reject(true);
        });
    })
  }

  VerifyManageExpectedTestsIsPresent() {
    return new Promise((resolve) => {
      let manageexpectedtestslink1 = element(by.xpath(manageexpectedtestslink));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(manageexpectedtestslink))
        ),
        5000
      ).then(() => {
        if (manageexpectedtestslink1.isDisplayed) {
          resolve(true);
          library.logStep("Manage Expected tests link is visible");
        } else {
          resolve(false);
          library.logStep("Manage Expected tests link is not visible");
        }
      }).catch(() => {
        resolve(false);
        library.logStep("Manage Expected tests link is not visible");
      })
    });
  }

  VerifyColorChangeOfManageExpectedTests() {
    return new Promise((resolve) => {
      let manageexpectedtestslink1 = element(by.xpath(manageexpectedtestslink));
      let color = manageexpectedtestslink1.getCssValue("color");
      let color1 = color.toString();
      element(by.xpath(manageexpectedtestslink))
        .isDisplayed()
        .then(function () {
          library.hoverOverElement(by.xpath(manageexpectedtestslink));
          library.logStep("Hover over manage expected tests link");
        }).then(() => {
          if (color1 = "#278FBA") {
            resolve(true)
            library.logStep("On mouse hovering color changes to blue");
          }
          else {
            resolve(false)
            library.logStep("On mouse hovering color not changes to blue");
          }
        })
        .catch(() => {
          resolve(false);
          library.logStep("Hover over manage expected tests link will not perform");
        })
    })
  }

  VerifyManageExpectedTestsIsClickable() {
    return new Promise((resolve) => {
      let manageexpectedtestslink1 = element(by.xpath(manageexpectedtestslink));
      let expectedtestssetup1 = element(by.xpath(expectedtestssetup));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(manageexpectedtestslink))
        ),
        5000
      ).then(() => {
        manageexpectedtestslink1.click();
        resolve(true);
        library.logStep("Manage Expected Tests link is clickable");
      }).then(() => {
        if (expectedtestssetup1.isDisplayed) {
          resolve(true)
          library.logStep('Expected test setup screen will launch');
        }
        else {
          resolve(false)
          library.logStep('Expected test setup screen will not launch');
        }
      })
        .catch(() => {
          resolve(false);
          library.logStep("Manage Expected Tests link is not clickable");
        })
    });
  }

  VerifyEditButton() {
    return new Promise((resolve) => {
      let editbutton1 = element(by.xpath(editbutton));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        editbutton1.click();
        resolve(true);
        library.logStep("Edit button is editable");

      })
        .catch(() => {
          resolve(false);
          library.logStep("Edit button is not editable");

        })
    });
  }

  VerifyIsStautsEditable() {
    return new Promise((resolve) => {
      let accepttogglebutton1 = element(by.xpath(accepttogglebutton));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          accepttogglebutton1.click();
          resolve(true);
          library.logStep("Accept Status toggle button is editable");
        })
        .catch(() => {
          resolve(false);
          library.logStep("Accept Status toggle button is not editable");
        })
    });
  }

  VerifyIsResultEditable() {
    return new Promise((resolve) => {
      let resultvalue1 = element(by.xpath(resultvalue));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          return resultvalue1.click();
        })
        .then(() => {
          resultvalue1.clear();
          resolve(true);
          library.logStep("Result column value is editable");
        })
        .catch(() => {
          resolve(false);
          library.logStep("Result column value is not editable");
        })
    });
  }

  VerifyActionCommentHistory() {
    return new Promise((resolve) => {
      let actioncommenthistory1 = element(by.xpath(actioncommenthistory));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          actioncommenthistory1.click();
          resolve(true);
          library.logStep("ActionCommentHistory is editable");
        })
        .catch(() => {
          resolve(false);
          library.logStep("ActionCommentHistory is not editable");
        })
    });
  }

  VerifyCancelButton() {
    return new Promise((resolve) => {
      let cancelbutton1 = element(by.xpath(cancelbutton));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          cancelbutton1.click();
          resolve(true);
          library.logStep("CANCEL button is cancelling the edit mode");
        })
        .catch(() => {
          resolve(false);
          library.logStep("Cancel button is not cancelling the edit mode");
        })
    });
  }

  VerifyPaginationArrow() {
    return new Promise((resolve) => {
      let paginationarrow1 = element(by.xpath(paginationarrow));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          paginationarrow1.click();
          resolve(true);
          library.logStep("Pagination arrow is clicked");
        })
        .catch(() => {
          resolve(false);
          library.logStep("Pagination arrow is not clicked");
        })
    });
  }

  VerifyIsAnalyteCheckboxDisabled() {
    return new Promise((resolve, reject) => {
      let analytecheckboxdisable1 = element(by.xpath(analytecheckboxdisable));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          if (!analytecheckboxdisable1.isEnabled) {
            library.logStep("Analyte is Disabled");
            resolve(true);
          } else {
            library.logStep("Analyte is Enabled");
            resolve(false);
          }

        }).catch(() => {
          library.logFailStep("Analyte is Disabled");
          reject(true);
        })
    });
  }

  VerifyIsActionboxDisabled() {
    return new Promise((resolve, reject) => {
      let aactionfielddisable1 = element(by.xpath(actionfielddisable));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          if (!aactionfielddisable1.isEnabled) {
            library.logStep("Action is Disabled");
            resolve(true);
          } else {
            library.logStep("Action is Enabled");
            resolve(false);
          }

        }).catch(() => {
          library.logFailStep("Action is Disabled");
          reject(true);
        })
    });
  }

  VerifyIsCommentboxDisabled() {
    return new Promise((resolve, reject) => {
      let commentfielddisable1 = element(by.xpath(commentfielddisable));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          if (!commentfielddisable1.isEnabled) {
            library.logStep("Comment is Disabled");
            resolve(true);
          } else {
            library.logStep("Comment is Enabled");
            resolve(false);
          }

        }).catch(() => {
          library.logFailStep("Comment is Disabled");
          reject(true);
        })
    });
  }

  VerifyReviewedbuttonDisabled() {
    return new Promise((resolve, reject) => {
      let reviewedbuttondisable1 = element(by.xpath(reviewedbuttondisable));
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(editbutton))
        ),
        5000
      ).then(() => {
        return this.VerifyEditButton();
      })
        .then(() => {
          if (!reviewedbuttondisable1.isEnabled) {
            library.logStep("Reviewed is Disabled");
            resolve(true);
          } else {
            library.logStep("Reviewed is Enabled");
            resolve(false);
          }
        }).catch(() => {
          library.logFailStep("Reviewed is Disabled");
          reject(true);
        })
    });
  }

  ReadFiltersCounts() {
    let accptedFilterCount = element(by.xpath(acceptedFilterCounts)).getText();
    let warningFilterCount = element(by.xpath(warningfilterCounts)).getText();
    let rejectedFilterCount = element(by.xpath(rejectedFilterCounts)).getText();
    let actionCommentsFilterCount = element(by.xpath(actionCommentsFilterCounts)).getText();
    library.logStep("Previous AccptedFiltercount=" + accptedFilterCount + " " + "Previous WarningfilterCount=" + warningFilterCount + " " + "Previous RejectedFilterCount=" + rejectedFilterCount + " " + "Previous ActionCommentsFilterCount=" + actionCommentsFilterCount);
    console.log("AccptedFiltercount=" + accptedFilterCount + " " + "WarningfilterCount=" + warningFilterCount + " " + "RejectedFilterCount=" + rejectedFilterCount + " " + "ActionCommentsFilterCount=" + actionCommentsFilterCount);
    let filterCount = { accptedFilterCount, warningFilterCount, rejectedFilterCount, actionCommentsFilterCount }
    return filterCount;
  }

  VerifyAcceptedFiltersCount() {
    return new Promise((resolve, reject) => {
      let actualacceptedFilterCount = element(by.xpath(acceptedFilterCounts)).getText();
      library.logStep("After adding data  rejectedFilterCount=" + actualacceptedFilterCount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFilterCounts))
        ),
        5000
      ).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((expectedtopfiltercount) => {
          let acceptedFiltercount = (expectedtopfiltercount.accptedFilterCount).toString();
          let acceptedcountnum = parseInt(acceptedFiltercount);
          let actualacceptedFilterCount = element(by.xpath(acceptedFilterCounts)).getText();
          let actualacceptedFilterCount1 = actualacceptedFilterCount.toString();
          let rejectedFilterCountnum = parseInt(actualacceptedFilterCount1);
          if (rejectedFilterCountnum > acceptedcountnum) {
            library.logStep("accepted Filter Count get changed with count value=" + rejectedFilterCountnum);
            resolve(true);
          }
          else {
            library.logStep("accepted Filter Count get changed with count value=" + rejectedFilterCountnum);
            resolve(false);
          }
        }).catch((e) => {
          reject(e);
        });
    })
  }

  VerifyAcceptedFiltersAsZeroCount() {
    return new Promise((resolve, reject) => {
      const acceptedzeroFilterCounts = element(by.xpath(acceptedFilterCounts));
      const allreviewedruns1 = element(by.xpath(allreviewedruns));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFilterCounts))
        ),
        5000
      ).then(() => {
        return acceptedzeroFilterCounts.getText();
      }).then((x) => {
        let x1 = parseInt(x);
        if (x1 == 0) {
          if (allreviewedruns1.isDisplayed()) {
            library.logStep("Accepted filter count is zero");
            resolve(true);
          }
          else {
            library.logStep("Accepted filter count is greater than zero");
            resolve(false);
          }
        }
        else {
          library.logStep("Accepted filter count is greater than zero");
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  VerifyRejectedFiltersCount() {
    return new Promise((resolve, reject) => {
      let actualrejectedFilterCount = element(by.xpath(rejectedFilterCounts)).getText();
      library.logStep("After adding data  rejectedFilterCount=" + actualrejectedFilterCount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFilterCounts))
        ),
        5000
      ).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((expectedtopfiltercount) => {
          let rejectedFiltercount = (expectedtopfiltercount.rejectedFilterCount).toString();
          let rejectedcountnum = parseInt(rejectedFiltercount);
          let actualrejectedFilterCount = element(by.xpath(rejectedFilterCounts)).getText();
          let actualrejectedFilterCount1 = actualrejectedFilterCount.toString();
          let rejectedFilterCountnum = parseInt(actualrejectedFilterCount1);
          if (rejectedFilterCountnum > rejectedcountnum) {
            library.logStep("rejectedFilterCount get changed with count value=" + rejectedFilterCountnum);
            resolve(true);
          }
          else {
            library.logStep("rejectedFilterCount get changed with count value=" + rejectedFilterCountnum);
            resolve(false);
          }
        }).catch((e) => {
          reject(e);
        });
    })
  }

  VerifyRejectedFiltersAsZeroCount() {
    return new Promise((resolve, reject) => {
      const rejectedzeroFilterCounts = element(by.xpath(rejectedFilterCounts));
      const allreviewedruns1 = element(by.xpath(allreviewedruns));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(rejectedFilterCounts))
        ),
        5000
      ).then(() => {
        return rejectedzeroFilterCounts.getText();
      }).then((x) => {
        let x1 = parseInt(x);
        if (x1 == 0) {
          if (allreviewedruns1.isDisplayed()) {
            library.logStep("Rejected filter count is zero");
            resolve(true);
          }
          else {
            library.logStep("Rejected filter count is greater than zero");
            resolve(false);
          }
        }
        else {
          library.logStep("Rejected filter count is greater than zero");
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }

  VerifyWarningFiltersCount() {
    return new Promise((resolve, reject) => {
      let actualwarningFilterCountAfter = element(by.xpath(warningfilterCounts)).getText();
      library.logStep("After adding data  AccptedFiltercount=" + actualwarningFilterCountAfter);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(acceptedFilterCounts))
        ),
        5000
      ).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((expectedtopfiltercount) => {
          let warningFiltercount = (expectedtopfiltercount.warningFilterCount).toString();
          let warningFiltercountnum = parseInt(warningFiltercount);
          let actualwarningFilterCountAfter = element(by.xpath(warningfilterCounts)).getText();
          let actualwarningFilterCountAfter1 = actualwarningFilterCountAfter.toString();
          let actualwarningFilterCountnum = parseInt(actualwarningFilterCountAfter1);
          if (actualwarningFilterCountnum > warningFiltercountnum) {
            library.logStep("WarningFiltercount get changed with count value=" + actualwarningFilterCountnum);
            resolve(true);
          }
          else {
            library.logStep("WarningFiltercount get changed with count value=" + actualwarningFilterCountnum);
            resolve(false);
          }
        }).catch((e) => {
          reject(e);
        });
    })
  }

  VerifyWarningFiltersAsZeroCount() {
    return new Promise((resolve, reject) => {
      const warningzeroFilterCounts = element(by.xpath(warningfilterCounts));
      const allreviewedruns1 = element(by.xpath(allreviewedruns));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(warningfilterCounts))
        ),
        5000
      ).then(() => {
        return warningzeroFilterCounts.getText();
      }).then((x) => {
        let x1 = parseInt(x);
        if (x1 == 0) {
          if (allreviewedruns1.isDisplayed()) {
            library.logStep("Warning filter count is zero");
            resolve(true);
          }
          else {
            library.logStep("Warning filter count is greater than zero");
            resolve(false);
          }
        }
        else {
          library.logStep("Warning filter count is greater than zero");
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }


  VerifyActionsCpommentsFiltersCount() {
    return new Promise((resolve, reject) => {
      let actualactioncommentsFilterCount = element(by.xpath(actionCommentsFilterCounts)).getText();
      library.logStep("After adding data  ActionCommentsFiltercount=" + actualactioncommentsFilterCount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(actionCommentsFilterCounts))
        ),
        5000
      ).then(() => {
        return this.ReadFiltersCounts();
      })
        .then((expectedtopfiltercount) => {
          let actioncommentsFiltercount = (expectedtopfiltercount.actionCommentsFilterCount).toString();
          let actioncommentsFiltercountnum = parseInt(actioncommentsFiltercount);
          let actualactioncommentsFilterCount = element(by.xpath(actionCommentsFilterCounts)).getText();
          let actualactioncommentsFilterCount1 = actualactioncommentsFilterCount.toString();
          let actioncommentsFilterCountnum = parseInt(actualactioncommentsFilterCount1);
          if (actioncommentsFilterCountnum > actioncommentsFiltercountnum) {
            library.logStep("Action/Comments Filter count get changed with count value=" + actioncommentsFilterCountnum);
            resolve(true);
          }
          else {
            library.logStep("Action/Comments Filter count get changed with count value=" + actioncommentsFilterCountnum);
            resolve(false);
          }
        }).catch((e) => {
          reject(e);
        });
    })
  }

  VerifyActionCommentsZeroFiltersCount() {
    return new Promise((resolve, reject) => {
      const actioncommentszeroFilterCounts = element(by.xpath(actionCommentsFilterCounts));
      const allreviewedruns1 = element(by.xpath(allreviewedruns));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(actionCommentsFilterCounts))
        ),
        5000
      ).then(() => {
        return actioncommentszeroFilterCounts.getText();
      }).then((x) => {
        let x1 = parseInt(x);
        if (x1 == 0) {
          if (allreviewedruns1.isDisplayed()) {
            library.logStep("action/comments filter count is zero");
            resolve(true);
          }
          else {
            library.logStep("action/comments filter count is greater than zero");
            resolve(false);
          }
        }
        else {
          library.logStep("action/comments filter count is greater than zero");
        }
      }).catch((e) => {
        reject(e);
      });
    });

  }

  ReadAdditionalFiltersCounts1() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon))
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      ).then(() => {
        return additionfilterIcon1.click()
      })
        .then(() => {
          let last30Daysfiltercounts = element(by.xpath(last30daysfiltercount)).getText();
          let violation = element(by.xpath(violations)).getText();
          let filterCount = { last30Daysfiltercounts, violation }
          return filterCount;
        });
      resolve("true");
    });
  }

  ReadAdditionalFiltersCounts() {
    let last30Daysfiltercounts = element(by.xpath(last30daysfiltercount)).getText();
    let violation = element(by.xpath(violations)).getText();
    let filterCount = { last30Daysfiltercounts, violation }
    return filterCount;
  }

  verifylast30dayfilterCount() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon))
      let actuallast30daysfiltercountafter = element(by.xpath(last30daysfiltercount)).getText();
      library.logStep("After adding data  last30daysfiltercount=" + actuallast30daysfiltercountafter);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      ).then(() => {
        return additionfilterIcon1.click();
      }).then(() => {
        return this.ReadAdditionalFiltersCounts();
      }).then((expectedadditionalfiltercount) => {
        if (expectedadditionalfiltercount.last30Daysfiltercounts < actuallast30daysfiltercountafter) {
          library.logStep("After adding data  last30daysfiltercount get changed with count value=" + actuallast30daysfiltercountafter);
        }
        resolve(true);
      }).catch((e) => {
        library.logStep("After adding data  last30daysfiltercount not changed with count value");
        resolve(false);
      });
    })
  }

  verifyViolationsfilterCount() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon))
      let actualviolationfiltercount = element(by.xpath(violations)).getText();
      library.logStep("After adding data  violationfiltercounts=" + actualviolationfiltercount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      ).then(() => {
        return additionfilterIcon1.click();
      }).then(() => {
        return this.ReadAdditionalFiltersCounts();
      }).then((expectedadditionalfiltercount) => {
        if (expectedadditionalfiltercount.violation < actualviolationfiltercount) {
          library.logStep("After adding data  violationfiltercounts get changed with count value=" + actualviolationfiltercount);
        }
        resolve("true");
      }).catch((e) => {
        library.logStep("After adding data  last30daysfiltercount not changed with count value");
        resolve(false);
      });
    });
  }

  reviewedRuns() {
    return new Promise((resolve) => {
      let reviewfirstannalyte1 = element(by.xpath(reviewfirstannalyte));
      let reviewedruns = element(by.xpath(reviewed));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(reviewfirstannalyte))
        ),
        5000
      ).then(() => {
        return reviewfirstannalyte1.click();
      }).then(() => {
        return reviewedruns.click();
      });
      resolve(true);
    });
  }

  ReadWarningRejectionFilterCount() {
    let warningFilterCount = element(by.xpath(warningfilterCounts)).getText();
    let rejectedFilterCount = element(by.xpath(rejectedFilterCounts)).getText();
    let actionCommentsFilterCount = element(by.xpath(actionCommentsFilterCounts)).getText();
    library.logStep("Previous WarningfilterCount=" + warningFilterCount + " " + "Previous RejectedFilterCount=" + rejectedFilterCount);
    let filterCount = { warningFilterCount, rejectedFilterCount }
    return filterCount;
  }

  verifyViolationsIsCombinationOFWarningRejection() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon))
      let actualviolationfiltercount = element(by.xpath(violations)).getText();
      library.logStep("After adding data  violationfiltercounts=" + actualviolationfiltercount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      ).then(() => {
        return additionfilterIcon1.click();
      }).then(() => {
        return this.ReadWarningRejectionFilterCount();
      }).then((expectedadditionalfiltercount) => {
        let rejectedcount = (expectedadditionalfiltercount.rejectedFilterCount).toString();
        let rejectedcountnum = parseInt(rejectedcount);
        let warningcount = (expectedadditionalfiltercount.warningFilterCount).toString();
        let warningcountnum = parseInt(warningcount);
        let actualviolationfiltercount1 = actualviolationfiltercount.toString();
        let actualviolationfiltercountnum = parseInt(actualviolationfiltercount1)
        if ((rejectedcountnum + warningcountnum) == actualviolationfiltercountnum) {
          library.logStep("Violations is addition of warning and rejections filters counts=" + actualviolationfiltercountnum);
        }
        resolve(true);
      }).catch((e) => {
        library.logStep("After adding data  last30daysfiltercount not changed with count value");
        resolve(false);
      });
    });
  }

  verifyAdditionalfilterCountAfterReview() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon))
      let actuallast30daysfiltercountafter = element(by.xpath(last30daysfiltercount)).getText();
      library.logStep("After getting reviewed  last30daysfiltercount=" + actuallast30daysfiltercountafter);
      let actualviolationfiltercount = element(by.xpath(violations)).getText();
      library.logStep("After getting reviewed violationfiltercounts=" + actualviolationfiltercount);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      ).then(() => {
        return additionfilterIcon1.click();
      }).then(() => {
        return this.ReadAdditionalFiltersCounts();
      }).then((expectedadditionalfiltercount) => {
        if (expectedadditionalfiltercount.violation > actuallast30daysfiltercountafter && expectedadditionalfiltercount.violation > actualviolationfiltercount) {
          library.logStep("After getting review last30daysfiltercount count get changed with count value=" + actuallast30daysfiltercountafter);
          library.logStep("After getting review violationfiltercounts count get changed with count value=" + actualviolationfiltercount);
        }
        resolve(true);
      });
    })
  }

  verifyAdditionalFilterwindowOnXIconClick() {
    return new Promise((resolve) => {
      let additionfilterIcon1 = element(by.xpath(additionfilterIcon));
      let closeadditionalfilterwindow1 = element(by.xpath(closeadditionalfilterwindow));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(additionfilterIcon))
        ),
        5000
      )
        .then(() => {
          return additionfilterIcon1.click();
        })
        .then(() => {
          return closeadditionalfilterwindow1.click();
        });
      resolve(true);
    });
  }


  isDataPresent() {
    return new Promise((resolve) => {
      let ele = element(by.xpath(dataRow));
      ele.isPresent().then((x) => {
        resolve(x);
      });
    });
  }

  verifyOnXIconClick() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      let BenchAndReviewCardValueEle = element(
        by.xpath(BenchAndReviewCardValueTxt)
      );
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        13000
      );
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DashboardLink))
        ),
        13000
      );
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();

      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))),
        13000
      );
      let popupTxtEle = element(by.xpath(popupTxt));
      let MarkAndExitLinkBtnEle = element(by.xpath(MarkAndExitLinkBtn));
      let ClearSelectionsAndExitLinkBtnEle = element(
        by.xpath(ClearSelectionsAndExitLinkBtn)
      );
      let XiconEle = element(by.xpath(Xicon));
      if (
        popupTxtEle.isDisplayed &&
        MarkAndExitLinkBtnEle.isDisplayed &&
        ClearSelectionsAndExitLinkBtnEle.isDisplayed
      ) {
        RemovedAnalyte = true;
        library.clickJS(XiconEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(firstAnalyteCheckbox))
          ),
          13000
        );
      }
      return RemovedAnalyte;
    });
  }
  verifyOnClickMarkAndExitDashboard() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      let BenchAndReviewCardValueEle = element(
        by.xpath(BenchAndReviewCardValueTxt)
      );
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        13000
      );
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DashboardLink))
        ),
        13000
      );
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();

      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))),
        13000
      );
      let popupTxtEle = element(by.xpath(popupTxt));
      let MarkAndExitLinkBtnEle = element(by.xpath(MarkAndExitLinkBtn));
      let ClearSelectionsAndExitLinkBtnEle = element(
        by.xpath(ClearSelectionsAndExitLinkBtn)
      );
      if (
        popupTxtEle.isDisplayed &&
        MarkAndExitLinkBtnEle.isDisplayed &&
        ClearSelectionsAndExitLinkBtnEle.isDisplayed
      ) {
        RemovedAnalyte = true;
        library.clickJS(MarkAndExitLinkBtnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(
            element(by.xpath(BenchAndReviewCardValueTxt))
          ),
          13000
        );
      }
      return RemovedAnalyte;
    });
  }
  verifyOnClickDashboardMsgPopUp() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      let BenchAndReviewCardValueEle = element(
        by.xpath(BenchAndReviewCardValueTxt)
      );
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        13000
      );
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DashboardLink))
        ),
        13000
      );
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();

      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))),
        13000
      );
      let popupTxtEle = element(by.xpath(popupTxt));
      let MarkAndExitLinkBtnEle = element(by.xpath(MarkAndExitLinkBtn));
      let ClearSelectionsAndExitLinkBtnEle = element(by.xpath(ClearSelectionsAndExitLinkBtn));
      if (popupTxtEle.isDisplayed && MarkAndExitLinkBtnEle.isDisplayed && ClearSelectionsAndExitLinkBtnEle.isDisplayed) {
        RemovedAnalyte = true;
        library.clickJS(ClearSelectionsAndExitLinkBtnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(DashboardLink))), 13000);
      }
      return RemovedAnalyte;
    });
  }
  verifyAnalyteRemovedFromList() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      let BenchAndReviewCardValueEle = element(
        by.xpath(BenchAndReviewCardValueTxt)
      );
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        13000
      );

      let AnalyteCreationTimeEleTxt = element(
        by.xpath(AnalyteCreationTime)
      ).getText();
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);

      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(ReviewedBtn))),
        13000
      );
      let ReviewedBtnEle = element(by.xpath(ReviewedBtn));
      library.clickJS(ReviewedBtnEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        13000
      );
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(AnalyteCreationTime))
        ),
        13000
      );
      let CurrentAnalyteCreationTimeEleTxt = element(
        by.xpath(AnalyteCreationTime)
      ).getText();
      if (CurrentAnalyteCreationTimeEleTxt != AnalyteCreationTimeEleTxt) {
        RemovedAnalyte = true;
      }
      return RemovedAnalyte;
    });
  }
  verifyAnalyteFromNextPageCheckbox() {
    return new Promise((resolve) => {
      let Card = true;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      let BenchAndReviewCardValueEle = element(
        by.xpath(BenchAndReviewCardValueTxt)
      );
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(PaginationLink))
        ),
        9000
      );
      let PaginationLinkEle = element(by.xpath(PaginationLink));
      library.clickJS(PaginationLinkEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(firstAnalyteCheckbox))
        ),
        5000
      );
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DashboardLink))
        ),
        5000
      );
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))),
        5000
      );
      let ClearSelectionsAndExitLinkBtnEle = element(
        by.xpath(ClearSelectionsAndExitLinkBtn)
      );
      library.clickJS(ClearSelectionsAndExitLinkBtnEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(BenchAndReviewCardValueTxt))
        ),
        5000
      );
      return Card;
    });
  }
  verifyAnalyteCheckbox() {
    return new Promise((resolve) => {
      let Card = true;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 5000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 9000);
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      library.clickJS(firstAnalyteCheckboxEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(DashboardLink))), 5000);
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))), 5000);
      let ClearSelectionsAndExitLinkBtnEle = element(by.xpath(ClearSelectionsAndExitLinkBtn));
      library.clickJS(ClearSelectionsAndExitLinkBtnEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 5000);
      return Card;
    });
  }

  navigateToPanelAndVerifySummitBtn(instrumentValue, panel) {
    return new Promise((resolve) => {
      let submit = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(panelName))),
        5000
      );
      let panelLink = element(by.xpath(panelName.replace("<text>", panel)));
      library.clickJS(panelName.replace("<text>", panel));
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(EditThisPanelLink))
        ),
        5000
      );

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentInputText))
        ),
        5000
      );
      let instrumentInp = element(by.xpath(InstrumentInputText));
      library.clickJS(instrumentInp);
      library.waitLoadingImageIconToBeInvisible();
      instrumentInp.sendKeys(instrumentValue);
      const submitInpTxt = element(by.xpath(SubmitBtnText));
      if (submitInpTxt.isDisplayed) {
        submit = true;
        library.waitLoadingImageIconToBeInvisible();
        let submitB = element(by.xpath(SubmitBtn));
        library.clickJS(submitB);
        library.waitLoadingImageIconToBeInvisible();
      }
      return submit;
    });
  }
  navigateToInstrumentAndVerifySummitBtn(instrumentValue, dept, Inst) {
    return new Promise((resolve) => {
      let submit = false;
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DepartmentLink.replace("<text>", dept)))
        ),
        5000
      );
      let department = element(by.xpath(DepartmentLink.replace("<text>", dept)));
      library.clickJS(department);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentLink.replace("<text>", Inst)))
        ),
        5000
      );
      let instrument = element(by.xpath(InstrumentLink.replace("<text>", Inst)));
      library.clickJS(instrument);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(EditThisInstrumentLink))
        ),
        5000
      );
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentInputText))
        ),
        5000
      );
      let instrumentInp = element(by.xpath(InstrumentInputText));
      library.clickJS(instrumentInp);
      library.waitLoadingImageIconToBeInvisible();
      instrumentInp.sendKeys(instrumentValue);
      const submitInpTxt = element(by.xpath(SubmitBtnText));

      if (submitInpTxt.isDisplayed) {
        submit = true;
        library.waitLoadingImageIconToBeInvisible();
        let submitB = element(by.xpath(SubmitBtn));
        library.clickJS(submitB);
        library.waitLoadingImageIconToBeInvisible();
      }
      return submit;
    });
  }
  navigateToControlAndVerifySummitBtn(instrumentValue, dept, Inst, cont) {
    return new Promise((resolve) => {
      let submit = false;
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DepartmentLink.replace("<text>", dept)))
        ),
        5000
      );
      let department = element(by.xpath(DepartmentLink.replace("<text>", dept)));
      library.clickJS(department);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentLink.replace("<text>", Inst)))
        ),
        5000
      );
      let instrument = element(by.xpath(InstrumentLink.replace("<text>", Inst)));
      library.clickJS(instrument);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(ControlNameLink.replace("<text>", cont)))
        ),
        5000
      );
      let Control = element(by.xpath(ControlNameLink.replace("<text>", cont)));
      library.clickJS(Control);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(EditThisControlLink))
        ),
        5000
      );
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentInputText))
        ),
        5000
      );
      let instrumentInp = element(by.xpath(InstrumentInputText));
      library.clickJS(instrumentInp);
      library.waitLoadingImageIconToBeInvisible();
      instrumentInp.sendKeys(instrumentValue);
      const submitInpTxt = element(by.xpath(SubmitBtnText));
      if (submitInpTxt.isDisplayed) {
        submit = true;
        library.waitLoadingImageIconToBeInvisible();
        let submitB = element(by.xpath(SubmitBtn));
        library.clickJS(submitB);
        library.waitLoadingImageIconToBeInvisible();
      }
      return submit;
    });
  }
  navigateToAnalyteAndVerifySummitBtn(instrumentValue, dept, Inst, cont, Anlyt) {
    return new Promise((resolve) => {
      let submit = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DepartmentLink.replace("<text>", dept)))
        ),
        5000
      );
      let department = element(by.xpath(DepartmentLink.replace("<text>", dept)));
      library.clickJS(department);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentLink.replace("<text>", Inst)))
        ),
        5000
      );
      let instrument = element(by.xpath(InstrumentLink.replace("<text>", Inst)));
      library.clickJS(instrument);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(ControlNameLink.replace("<text>", cont)))
        ),
        5000
      );
      let Control = element(by.xpath(ControlNameLink.replace("<text>", cont)));
      library.clickJS(Control);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(AnalyteNameLink.replace("<text>", Anlyt)))
        ),
        5000
      );
      let Analyte = element(by.xpath(AnalyteNameLink.replace("<text>", Anlyt)));
      library.clickJS(Analyte);

      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(EditThisAnalyteLink))
        ),
        5000
      );
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentInputText))
        ),
        5000
      );
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(InstrumentInputText))
        ),
        5000
      );
      let instrumentInp = element(by.xpath(InstrumentInputText));
      library.clickJS(instrumentInp);
      library.waitLoadingImageIconToBeInvisible();
      instrumentInp.sendKeys(instrumentValue);
      const submitInpTxt = element(by.xpath(SubmitBtnText));
      if (submitInpTxt.isDisplayed()) {
        submit = true;
        library.waitLoadingImageIconToBeInvisible();
        let submitB = element(by.xpath(SubmitBtn));
        library.clickJS(submitB);
        library.waitLoadingImageIconToBeInvisible();
      }
      return submit;
    });
  }

  switchToLocation2() {
    return new Promise((resolve) => {
      library.logStep("Switch to Location 2");
      let navBarLabNameEle = element(by.xpath(navBarLabName));
      let secondLocationEle = element(by.xpath(secondLocation));
      library
        .waitTillClickable(navBarLabNameEle, 8888)
        .then(() => {
          return navBarLabNameEle.click();
        })
        .then(() => {
          return library.waitTillClickable(secondLocationEle, 8888);
        })
        .then(() => {
          return secondLocationEle.click();
        })
        .then(() => {
          return library.waitLoadingImageIconToBeInvisible();
        })
        .then(() => {
          resolve(true);
        });
    });
  }

  verifyColumnPresentAbsent(selection: any) {
    return new Promise((resolve) => {
      let ele: ElementFinder;
      for (let i = 0; i < selection.checked.length; i++) {
        ele = element(
          by.xpath(
            columnHeaderWithText
              .replace("<text>", selection.checked[i].toUpperCase())
          )
        );
        ele.isPresent().then((x) => {
          expect(x).toBe(
            true,
            selection.checked[i] +
            " is not visible when checkbox is checked and saved"
          );
        });
      }
      for (let i = 0; i < selection.unchecked.length; i++) {
        ele = element(
          by.xpath(
            columnHeaderWithText
              .replace("<text>", selection.unchecked[i].toUpperCase())
          )
        );
        ele.isPresent().then((x) => {
          expect(x).toBe(
            false,
            selection.unchecked[i] +
            " is visible when checkbox is unchecked and saved"
          );
        });
      }
      resolve(true);
    });
  }

  verifyCheckboxSelection(selection: any) {
    return new Promise((resolve) => {
      let ele = element.all(by.xpath(dataColumnsLabels));
      let labelName, flag;
      ele.count().then((x) => {
        for (let i = 0; i < x; i++) {
          let e = ele.get(i);
          e.getText().then((x) => {
            labelName = x.trim();
          }).then(() => {
            return e.getAttribute("for");
          })
            .then((x) => {
              let inputEle = element(by.xpath("//input[@id='" + x + "']"));
              return inputEle.getAttribute("aria-checked");
            })
            .then((x) => {
              if (x == "true") {
                flag = selection.checked.includes(labelName);
                expect(flag).toBe(true,
                  labelName + "is not selected and Preferences are not saved"
                );
              }
              if (x == "false") {
                flag = selection.unchecked.includes(labelName);
                expect(flag).toBe(true,
                  labelName + "is selected and Preferences are not saved"
                );
              }
            });
        }
        resolve(true);
      });
    });
  }

  invertCheckBoxSelectionAndSave() {
    return new Promise((resolve) => {
      let ele = element.all(by.xpath(dataColumnsLabels));
      let loadingMessageEle = element(by.xpath(loadingMessage));
      let updateBtnEle = element(by.id(dataColumnsWindowUpdateButton));
      let labelName,
        selection = { checked: [], unchecked: [] };
      library.logStep("Invert Selection");
      ele
        .count()
        .then((x) => {
          for (let i = 0; i < x; i++) {
            let e = ele.get(i);
            e.getText().then((x) => {
              labelName = x;
              console.log("labelname=" + labelName);
            }).then(() => {
              return e.getAttribute("for");
            })
              .then((x) => {
                let inputEle = element(by.xpath("//input[@id='" + x + "']"));
                return inputEle.getAttribute("aria-checked");
              })
              .then((x) => {
                if (x == "true") {
                  selection.unchecked.push(labelName.trim());
                }
                if (x == "false") {
                  selection.checked.push(labelName.trim());
                }
                return e.click();
              });
          }
        })
        .then(function () {
          return library.waitTillClickable(updateBtnEle, 8888);
        })
        .then(() => {
          library.logStep("Click Update");
          return updateBtnEle.click();
        })
        .then(() => {
          return library.waitLoadingImageIconToBeInvisible();
        })
        .then(() => {
          return library.waitTillInVisible(loadingMessageEle, 20000);
        })
        .then(() => {
          resolve(selection);
        });
    });
  }

  verifyUpdateButtonDisableEnable() {
    return new Promise((resolve) => {
      let updateBtnELe = element(by.id(dataColumnsWindowUpdateButton));
      let dataColumnsLabelsEle = element(by.xpath(dataColumnsLabels));
      updateBtnELe
        .isEnabled()
        .then((x) => {
          expect(x).toBe(
            false,
            "Update Button Enabled when checkbox seletion is not modified"
          );
        })
        .then(() => {
          return library.waitTillClickable(dataColumnsLabelsEle, 8888);
        })
        .then(() => {
          return dataColumnsLabelsEle.click();
        })
        .then(() => {
          return updateBtnELe.isEnabled();
        })
        .then((x) => {
          expect(x).toBe(
            true,
            "Update Button is not Enabled when checkbox seletion is modified"
          );
          resolve(x);
        });
    });
  }

  verifyXButtonFunctionality() {
    return new Promise((resolve) => {
      let closeEle = element(by.xpath(dataColumnsWindowClose));
      let warningPopupEle = element(by.xpath(warningPopupX));
      let dataColumnsLabelsEle = element(by.xpath(dataColumnsLabels));
      library
        .waitTillClickable(dataColumnsLabelsEle, 8888)
        .then(() => {
          return dataColumnsLabelsEle.click();
        })
        .then(() => {
          return library.waitTillClickable(closeEle, 8888);
        })
        .then(() => {
          return closeEle.click();
        })
        .then(() => {
          return warningPopupEle.isPresent();
        })
        .then((x) => {
          if (!x) {
            library.logFailStep(
              "Warning Popup is non Present after clicking the Close Button"
            );
          }
          resolve(x);
        });
    });
  }

  verifyCloseButtonFunctionality() {
    return new Promise((resolve) => {
      let closeBtnEle = element(by.id(dataColumnsWindowCloseButton));
      let dataColumnsWindowEle = element(by.id(dataColumnsWindow));
      library
        .waitTillClickable(closeBtnEle, 8888)
        .then(() => {
          return closeBtnEle.click();
        })
        .then(() => {
          return dataColumnsWindowEle.isPresent();
        })
        .then((x) => {
          if (x) {
            library.logFailStep(
              "Data Column Window is Present even after clicking the Close Button"
            );
          }
          resolve(x);
        });
    });
  }

  verifyColumnCheckBoxAddedRemoved() {
    return new Promise((resolve, reject) => {
      let ele = element.all(by.xpath(dataColumnsLabels));
      let e, flag1, flag2, br;
      ele.count().then((x) => {
        for (let i = 0; i < x; i++) {
          let e = ele.get(i);
          br = false;
          e.getAttribute("for")
            .then((x) => {
              let inputEle = element(by.xpath("//input[@id='" + x + "']"));
              return inputEle.getAttribute("aria-checked");
            })
            .then((x) => {
              if (x == "true") {
                this.verifyColumnRemoved(e)
                  .then((x) => {
                    flag1 = x;
                  })
                  .then(() => {
                    return this.openDataColumnWindow();
                  })
                  .then(() => {
                    return this.verifyColumnAdded(e);
                  })
                  .then((x) => {
                    flag2 = x;
                  })
                  .then(() => {
                    return this.openDataColumnWindow();
                  })
                  .then(() => {
                    resolve(flag1 && flag2);
                  })
                  .catch((e) => {
                    reject(e);
                    throw e;
                  });
              } else {
                this.verifyColumnAdded(e)
                  .then((x) => {
                    flag1 = x;
                  })
                  .then(() => {
                    return this.openDataColumnWindow();
                  })
                  .then(() => {
                    return this.verifyColumnRemoved(e);
                  })
                  .then(() => {
                    return this.openDataColumnWindow();
                  })
                  .then((x) => {
                    flag2 = x;
                  })
                  .then(() => {
                    return this.openDataColumnWindow();
                  })
                  .then(() => {
                    resolve(flag1 && flag2);
                  })
                  .catch((e) => {
                    reject(e);
                    expect(false).toBe(true, "Some Exception Occurred\n" + e);
                    throw e;
                  });
              }
            });
        }
      });
      resolve(true);
    });
  }

  verifyColumnAdded(e: ElementFinder) {
    return new Promise((resolve, reject) => {
      let updateBtnELe = element(by.id(dataColumnsWindowUpdateButton));
      let columnHeaderEle: ElementFinder;
      let columnName;
      e.getText()
        .then((x) => {
          columnName = x;
          columnHeaderEle = element(
            by.xpath(
              columnHeaderWithText.replace("<text>", x.trim().toUpperCase())
            )
          );
        })
        .then(() => {
          return library.waitTillClickable(e, 8888);
        })
        .then(() => {
          return e.click();
        })
        .then(() => {
          return library.waitTillClickable(updateBtnELe, 8888);
        })
        .then(() => {
          return updateBtnELe.click();
        })
        .then(() => {
          return columnHeaderEle.isPresent();
        })
        .then((x) => {
          if (x) {
            library.logFailStep(columnName + " has been added");
            resolve(x);
          } else {
            library.logFailStep(columnName + " has not been added");
            reject(x);
          }
        })
        .catch((e) => {
          reject(e);
          throw e;
        });
    });
  }

  verifyColumnRemoved(e: ElementFinder) {
    return new Promise((resolve, reject) => {
      let updateBtnELe = element(by.id(dataColumnsWindowUpdateButton));
      let columnHeaderEle: ElementFinder;
      let columnName;
      e.getText()
        .then((x) => {
          columnName = x;
          columnHeaderEle = element(
            by.xpath(
              columnHeaderWithText.replace("<text>", x.trim().toUpperCase())
            )
          );
        })
        .then(() => {
          return library.waitTillClickable(e, 8888);
        })
        .then(() => {
          return e.click();
        })
        .then(() => {
          return library.waitTillClickable(updateBtnELe, 8888);
        })
        .then(() => {
          return updateBtnELe.click();
        })
        .then(() => {
          return columnHeaderEle.isPresent();
        })
        .then((x) => {
          if (!x) {
            library.logFailStep(columnName + " has been removed");
            resolve(x);
          } else {
            library.logFailStep(columnName + " has not been removed");
            reject(x);
          }
        })
        .catch((e) => {
          reject(e);
          throw e;
        });
    });
  }

  verifyCheckBoxesAreEnabled(checkBoxes: []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < checkBoxes.length; i++) {
        let ele = element(
          by.xpath(checkBoxLabelWithText.replace("<text>", checkBoxes[i]))
        );
        let ele1 = element(
          by.xpath(checkBoxWithText.replace("<text>", checkBoxes[i]))
        );
        let flag;
        ele1
          .getAttribute("aria-checked")
          .then((x) => {
            flag = x;
            return ele.click();
          })
          .then(() => {
            return ele1.getAttribute("aria-checked");
          })
          .then((x) => {
            if (
              (flag == "true" && x == "true") ||
              (flag == "false" && x == "false")
            ) {
              library.logFailStep(checkBoxes[i] + " is not clickable");
              reject(false);
            }
          });
      }
      resolve(true);
    });
  }

  verifyDefaultNonSelectedCheckBoxes(checkBoxes: []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < checkBoxes.length; i++) {
        let ele = element(
          by.xpath(checkBoxWithText.replace("<text>", checkBoxes[i]))
        );
        ele.getAttribute("aria-checked").then((x) => {
          if (x == "true") {
            library.logFailStep(checkBoxes[i] + " is checked by default");
            reject(false);
          }
          expect(x).toBe("false");
        });
      }
      resolve(true);
    });
  }

  verifyDefaultSelectedCheckBoxes(checkBoxes: []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < checkBoxes.length; i++) {
        let ele = element(
          by.xpath(checkBoxWithText.replace("<text>", checkBoxes[i]))
        );
        ele.getAttribute("aria-checked").then((x) => {
          if (x != "true") {
            library.logFailStep(checkBoxes[i] + " is not checked by default");
            reject(false);
          }
          expect(x).toBe("true");
        });
      }
      resolve(true);
    });
  }

  verifyCheckBoxes(checkBoxes: []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < checkBoxes.length; i++) {
        let ele = element(
          by.xpath(checkBoxLabelWithText.replace("<text>", checkBoxes[i]))
        );
        ele.isPresent().then((x) => {
          if (!x) {
            library.logFailStep(checkBoxes[i] + " is not displayed");
            reject(false);
          }
          expect(x).toBe(true);
        });
      }
      resolve(true);
    });
  }

  openDataColumnWindow() {
    return new Promise((resolve, reject) => {
      library.logStep("Open Data Column Window");
      let ele = element(by.xpath(gearIcon));
      library
        .waitTillClickable(ele, 8888)
        .then(() => {
          return ele.click();
        })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          reject(e);
          expect(false).toBe(
            true,
            "Exception Occured while opening Data Column Window " + e
          );
        });
    });
  }

  verifyNonDefaultColumnNames(columnNames) {
    return new Promise(() => {
      library.logStep("Verify Non Default Column Names");
      for (let i = 0; i < columnNames.length; i++) {
        let flag;
        let ele = element(
          by.xpath(columnHeaderWithText.replace("<text>", columnNames[i]))
        );
        ele.isPresent().then((result) => {
          flag = result;
          console.log("Result is " + flag);
          if (flag) {
            library.logFailStep(columnNames[i] + " column is dispalyed");
            return false;
          }
          expect(flag).toBe(false);
        });
      }
      return true;
    });
  }

  verifyDataColumnWindowUIComponents() {
    return new Promise((resolve, reject) => {
      let dataColumnsWindowHeadingEle = element(
        by.xpath(dataColumnsWindowHeading)
      );
      let dataColumnsWindowCloseEle = element(by.xpath(dataColumnsWindowClose));
      let dataColumnsWindowCloseBtnEle = element(
        by.id(dataColumnsWindowCloseButton)
      );
      let dataColumnsWindowUpdateBtnEle = element(
        by.id(dataColumnsWindowUpdateButton)
      );
      let flag1, flag2, flag3, flag4;
      dataColumnsWindowHeadingEle
        .isPresent()
        .then((x) => {
          flag1 = x;
          if (!flag1) {
            library.logFailStep(
              "Heading is not Present in Data Columns Window"
            );
          }
        })
        .then(() => {
          return dataColumnsWindowCloseEle.isPresent();
        })
        .then((x) => {
          flag2 = x;
          if (!flag2) {
            library.logFailStep(
              "Close 'X' is not Present in Data Columns Window"
            );
          }
        })
        .then(() => {
          return dataColumnsWindowCloseBtnEle.isPresent();
        })
        .then((x) => {
          flag3 = x;
          if (!flag3) {
            library.logFailStep(
              "Close Button is not Present in Data Columns Window"
            );
          }
        })
        .then(() => {
          return dataColumnsWindowUpdateBtnEle.isPresent();
        })
        .then((x) => {
          flag4 = x;
          if (!flag4) {
            library.logFailStep(
              "Update Button is not Present in Data Columns Window"
            );
          }
        })
        .then(() => {
          if (!flag1 || !flag2 || !flag3 || !flag4) {
            reject(false);
          } else {
            resolve(true);
          }
        })
        .catch((e) => {
          throw e;
        });
    });
  }

  verifyDataColumnWindow() {
    return new Promise((resolve, reject) => {
      let ele = element(by.className(dataColumnsWindow));
      let flag;
      ele.isPresent().then((x) => {
        flag = x;
        console.log("Flag " + flag);
        if (flag) {
          library.logStep("Data Column Window is displayed");
          resolve(flag);
        } else {
          library.logFailStep("Data column window is not displayed");
          reject(flag);
        }
      });
    });
  }

  verifyDefaultColumnNames(columnNames: []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < columnNames.length; i++) {
        let ele = element(
          by.xpath(columnHeaderWithText.replace("<text>", columnNames[i]))
        );
        ele.isDisplayed().then((result) => {
          if (!result) {
            library.logFailStep(columnNames[i] + " column is not dispalyed");
            reject(columnNames[i] + " column is not dispalyed");
            return;
          }
          resolve(true);
        });
      }
    });
  }

  verifyGearIcon() {
    return new Promise((resolve, reject) => {
      library.logStep("Verify Gear Icon");
      let ele = element(gearIcon);
      ele.isDisplayed().then((result) => {
        if (!result) {
          library.logFailStep(
            "Gear icon is not displayed in Data Column Window"
          );
          reject("Gear icon is not displayed in Data Column Window");
        }
        resolve(true);
      });
    });
  }

  openBenchReviewPage() {
    return new Promise((resolve, reject) => {
      let ele = element(by.xpath(benchTills));
      let loadingMessageEle = element(by.xpath(loadingMessage));
      library
        .waitTillClickable(ele, 5000)
        .then(function () {
          return library.clickJS(ele);
        })
        .then(function () {
          return library.waitLoadingImageIconToBeInvisible();
        })
        .then(() => {
          return library.waitTillInVisible(loadingMessageEle, 20000);
        })
        .then(() => {
          library.logStep("Opened Bench Review Page");
          resolve(true);
        })
        .catch((e) => {
          library.logFailStep(
            "Open Bench Review Page Failed due to Some Error"
          );
          reject(e);
          expect(false).toBe(
            true,
            "Open Bench Review Page Failed due to Some Error\n" + e
          );
          throw e;
        });
    });
  }

  openBenchReviewPage1() {
    return new Promise((resolve, reject) => {
      let ele = element(by.xpath(benchTills));
      let loadingMessageEle = element(by.xpath(loadingMessage));
      library
        .waitTillClickable(ele, 5000)
        .then(function () {
          return library.clickJS(ele);
        })
        .then(function () {
          return library.waitLoadingImageIconToBeInvisible();
        })
        .then(() => {
          library.logStep("Opened Bench Review Page");
          resolve(true);
        })
        .catch((e) => {
          library.logFailStep(
            "Open Bench Review Page Failed due to Some Error"
          );
          reject(e);
          expect(false).toBe(
            true,
            "Open Bench Review Page Failed due to Some Error\n" + e
          );
          throw e;
        });
    });
  }

  enterKeyword(keyword) {
    return new Promise((resolve) => {
      const inputBox = element(by.xpath(keywordInputBox));
      const search = element(by.xpath(searchBtn));
      library.clickJS(inputBox);
      inputBox.sendKeys(keyword);
      library.logStep("Keyword entered");
      library.clickJS(search);
      const locationsBtn = element(by.xpath(locationBtn));
      library.clickJS(locationsBtn);
      resolve(true);
    });
  }

  addUnityNextLicense() {
    return new Promise((resolve) => {
      const addLocationsBtn = element(by.xpath(addLocationBtn));
      library.clickJS(addLocationsBtn);
      library.logStep("Add location click");
      const UnityNextTier = element(by.xpath(UnityNextTierDrp));
      library.clickJS(UnityNextTier);
      library.logStep("click on Unity ext tier");
      const UnityNextTierValue = element(by.xpath(UnityNextTierOption));
      library.clickJS(UnityNextTierValue);
      library.logStep("click on Advance Qc");
      const closeIcon = element(by.xpath(closeIconBtn));
      library.clickJS(closeIcon);
      library.logStep("click on Close");
      const exitWithoutSaving = element(by.xpath(exitWithoutSavingBtn));
      library.clickJS(exitWithoutSaving);
      library.logStep("click on exitWithoutSaving");

      resolve(true);
    });
  }
  SelectCheckBox(){
    return new Promise((resolve) => {
      library.waitLoadingImageIconToBeInvisible();
      const PeerMeanChkBxEle = element(by.xpath(PeerMeanChkBx));
      const PeerCVChkBxEle = element(by.xpath(PeerCVChkBx));
      const PeerSdChkBxEle = element(by.xpath(PeerSdChkBx));
      browser.wait(browser.ExpectedConditions.invisibilityOf(PeerMeanChkBxEle), 5000);
      library.clickJS(PeerMeanChkBxEle);
      library.clickJS(PeerCVChkBxEle);
      library.clickJS(PeerSdChkBxEle);

      const UpdateBtnEle = element(by.xpath(UpdateBtn));
      browser.wait(browser.ExpectedConditions.invisibilityOf(UpdateBtnEle), 5000);
      library.clickJS(UpdateBtn);
      library.waitLoadingImageIconToBeInvisible();
    });
  }
  ClickOnGearIcon() {
    return new Promise((resolve) => {
      const GearIconEle = element(by.xpath(gearIcon));
      library.clickJS(GearIconEle);
      library.logStep("Gear Icon Ele click");
    });
  }
  ClickOnResetBtn() {
    return new Promise((resolve) => {
      const RestIcon = element(by.xpath(RestIconBtn));
      library.clickJS(RestIcon);
      library.logStep("Add location click");
    });
  }
  ClickOnLocationTab() {
    return new Promise((resolve) => {
      const locationsTab = element(by.xpath(locationTab));
      library.clickJS(locationsTab);
      library.logStep("Add location click");
    });
  }
  enterKeywordSelectSearch(keyword) {
    return new Promise((resolve) => {
      const inputBox = element(by.xpath(keywordInputBox));

      library.clickJS(inputBox);
      inputBox.sendKeys(keyword);
      library.logStep("Keyword entered");
      const search = element(by.xpath(searchBtn));
      library.clickJS(search);

      resolve(true);
    });
  }

  async verifyBenchTiles(CardName) {
    let cardFound = false;
    await library.waitLoadingImageIconToBeInvisible();
    await browser.wait(
      browser.ExpectedConditions.visibilityOf(element(by.xpath(benchTills))),
      5000
    );
    const reviewCardTxt = element(by.xpath(benchTills));

    let text = await reviewCardTxt.getText();
    if (text.includes(CardName)) {
      cardFound = true;
      library.clickJS(reviewCardTxt);
    }
    return cardFound;
  }

  verifyColumnHeaderOfBenchReviewPage() {
    return new Promise((resolve) => {
      let flag = false;
      browser.sleep(5000);
      library.waitLoadingImageIconToBeInvisible();
      const reviewCardTxt = element(by.xpath(benchTills));
      library.clickJS(reviewCardTxt);
      const analytesEle = element(by.xpath(Analytes));
      const dateEle = element(by.xpath(date));
      const timeEle = element(by.xpath(time));
      const levelEle = element(by.xpath(level));
      const resultsEle = element(by.xpath(results));
      const rulesEle = element(by.xpath(rules));
      const evalMeanEle = element(by.xpath(evalMean));
      const evalSdEle = element(by.xpath(evalSd));
      const evalCvEle = element(by.xpath(evalCv));
      const bysEle = element(by.xpath(bys));
      const statusEle = element(by.xpath(status));
      analytesEle.getText().then(function (text) { });
      analytesEle.getText().then(function (text) { });
      if (
        analytesEle.isDisplayed &&
        dateEle.isDisplayed &&
        timeEle.isDisplayed &&
        levelEle.isDisplayed &&
        resultsEle.isDisplayed &&
        rulesEle.isDisplayed &&
        evalMeanEle.isDisplayed &&
        evalSdEle.isDisplayed &&
        evalCvEle.isDisplayed &&
        bysEle.isDisplayed &&
        statusEle.isDisplayed
      ) {
        flag = true;
        library.logStep(
          "Required fields on Bench Review page column header verified"
        );
        resolve(flag);
      }
    });
  }

  /**
   * Common method to navigate to QC results page
   */
  navigateToQCResults() {
    return new Promise((resolve) => {
      const reviewCardTxt = element(by.xpath(benchTills));
      library.clickJS(reviewCardTxt);
      library.logStepWithScreenshot(
        "Navigated to QC Results page",
        "Navigated to QC Results page"
      );
      console.log("Navigated to QC Results page");
      resolve(true);
    });
  }

  verifyAnalyteDetailsBoxDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(analyteDetailsBox))
        .isDisplayed()
        .then(function () {
          console.log("Analyte details box is displayed");
          library.logStepWithScreenshot(
            "Analyte details box is displayed",
            "Element is displayed"
          );
          library.logStep("Analyte details box is displayed");
          resolve(true);
        })
        .catch(function () {
          console.log("Failed : Analyte details box is not displayed");
          library.logStepWithScreenshot(
            "Failed : Analyte details box is not displayed",
            "Element is not displayed"
          );
          library.logStep("Failed : Analyte details box is not displayed");
          resolve(false);
        });
    });
  }

  verifyRegantDetailsAreDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(reagentDetails))
        .isDisplayed()
        .then(function () {
          element(by.xpath(reagentDetails))
            .getText()
            .then(function (text) {
              if (!text.includes("")) {
                console.log("Reagent details are displayed on analyte details");
                library.logStepWithScreenshot(
                  "Reagent details are displayed on analyte details",
                  "Element is displayed"
                );
                library.logStep(
                  "Reagent details are displayed on analyte details"
                );
                resolve(true);
              } else {
                console.log(
                  "Failed : Reagent details are not displayed on analyte details"
                );
                library.logStepWithScreenshot(
                  "Failed : Reagent details are not displayed on analyte details",
                  "Element is not displayed"
                );
                library.logStep(
                  "Failed : Reagent details are not displayed on analyte details"
                );
                resolve(false);
              }
            });
        })
        .catch(function () {
          console.log(
            "Failed : Reagent option is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Reagent option is not displayed on analyte details",
            "Element is not displayed"
          );
          library.logStep(
            "Failed : Reagent option is not displayed on analyte details"
          );
          resolve(false);
        });
    });
  }

  verifyCalibratorDetailsAreDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(calibratorDetails))
        .isDisplayed()
        .then(function () {
          element(by.xpath(calibratorDetails))
            .getText()
            .then(function (text) {
              if (!text.includes("")) {
                console.log(
                  "Calibrator details are displayed on analyte details"
                );
                library.logStepWithScreenshot(
                  "Calibrator details are displayed on analyte details",
                  "Element is displayed"
                );
                resolve(true);
              } else {
                console.log(
                  "Failed : Calibrator details are not displayed on analyte details"
                );
                library.logStepWithScreenshot(
                  "Failed : Calibrator details are not displayed on analyte details",
                  "Element is not displayed"
                );
                resolve(false);
              }
            });
        })
        .catch(function () {
          console.log(
            "Failed : Calibrator option is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Calibrator option is not displayed on analyte details",
            "Element is not displayed"
          );
          resolve(false);
        });
    });
  }

  verifyLJChartOptionAreDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(advanceLJChart))
        .isDisplayed()
        .then(function () {
          console.log(
            "Advanced LJ chart option is displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Advanced LJ chart option is displayed on analyte details",
            "Element is displayed"
          );
          resolve(true);
        })
        .catch(function () {
          console.log(
            "Failed : Advanced LJ chart option is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Advanced LJ chart option is not displayed on analyte details",
            "Element is not displayed"
          );
          resolve(false);
        });
    });
  }

  verifyLJChartIsDisplayed() {
    return new Promise((resolve) => {
      /**
       * Functionality is not ready yet
       */
    });
  }

  verifyChooseActionDrpdwnDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(chooseActionDrpdwn))
        .isDisplayed()
        .then(function () {
          console.log("Choose Action option is displayed on analyte details");
          library.logStepWithScreenshot(
            "Choose Action option is displayed on analyte details",
            "Element is displayed"
          );
          resolve(true);
        })
        .catch(function () {
          console.log(
            "Failed : Choose Action option is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Choose Action option is not displayed on analyte details",
            "Element is not displayed"
          );
          resolve(false);
        });
    });
  }

  verifySelectedActionDisplayed() {
    return new Promise((resolve) => {
      /**
       * Functionality is not ready yet
       */
    });
  }

  verifyCommentTextBoxDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(addCommentTextBox))
        .isDisplayed()
        .then(function () {
          console.log("Add Comment textbox is displayed on analyte details");
          library.logStepWithScreenshot(
            "Add Comment textbox is displayed on analyte details",
            "Element is displayed"
          );
          resolve(true);
        })
        .catch(function () {
          console.log(
            "Failed : Add Comment textbox is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Add Comment textbox is not displayed on analyte details",
            "Element is not displayed"
          );
          resolve(false);
        });
    });
  }

  verifyAddedCommentDisplayed() {
    return new Promise((resolve) => {
      /**
       * Functionality is not ready yet
       */
    });
  }

  verifyHistoryOptionDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(addCommentTextBox))
        .isDisplayed()
        .then(function () {
          console.log("Add Comment textbox is displayed on analyte details");
          library.logStepWithScreenshot(
            "Add Comment textbox is displayed on analyte details",
            "Element is displayed"
          );
          resolve(true);
        })
        .catch(function () {
          console.log(
            "Failed : Add Comment textbox is not displayed on analyte details"
          );
          library.logStepWithScreenshot(
            "Failed : Add Comment textbox is not displayed on analyte details",
            "Element is not displayed"
          );
          resolve(false);
        });
    });
  }

  verifyActionsDisplayedOnHoverOver() {
    return new Promise((resolve) => {
      element(by.xpath(actionsIcon))
        .isDisplayed()
        .then(function () {
          library.hoverOverElement(by.xpath(actionsIcon));
          console.log("Hover over actions icon");
          library.logStepWithScreenshot(
            "Hover over actions icon",
            "Element is displayed"
          );

          const actionPopup =
            "(//*[text()='Actions'])[1]//following::*[contains(@class,'reset')]";
          element(by.xpath(actionPopup))
            .isDisplayed()
            .then(function () {
              console.log("Action popup details are displayed on hover over");
              library.logStepWithScreenshot(
                "Action popup details are displayed on hover over",
                "Element is displayed"
              );
              resolve(true);
            })
            .catch(function () {
              console.log(
                "Failed : Action popup details are not displayed on hover over"
              );
              library.logStepWithScreenshot(
                "Failed : Action popup details are not displayed on hover over",
                "Element is not displayed"
              );
              resolve(false);
            });
        });
    });
  }

  verifyCommentsDisplayedOnHoverOver() {
    return new Promise((resolve) => {
      element(by.xpath(commentsIcon))
        .isDisplayed()
        .then(function () {
          library.hoverOverElement(by.xpath(commentsIcon));
          console.log("Hover over Comments icon");
          library.logStepWithScreenshot(
            "Hover over actions icon",
            "Element is displayed"
          );

          const actionPopup =
            "(//*[text()='Comments'])[1]//following::*[contains(@class,'reset')]";
          element(by.xpath(actionPopup))
            .isDisplayed()
            .then(function () {
              console.log("Comments popup details are displayed on hover over");
              library.logStepWithScreenshot(
                "Comments popup details are displayed on hover over",
                "Element is displayed"
              );
              resolve(true);
            })
            .catch(function () {
              console.log(
                "Failed : Comments popup details are not displayed on hover over"
              );
              library.logStepWithScreenshot(
                "Failed : Comments popup details are not displayed on hover over",
                "Element is not displayed"
              );
              resolve(false);
            });
        });
    });
  }

  verifyHistoryDisplayedOnHoverOver() {
    return new Promise((resolve) => {
      element(by.xpath(historyIcon))
        .isDisplayed()
        .then(function () {
          library.hoverOverElement(by.xpath(historyIcon));
          console.log("Hover over History/Action Logs icon");
          library.logStepWithScreenshot(
            "Hover over History/Action Logs icon",
            "Element is displayed"
          );

          const actionPopup =
            "(//*[text()='Action Logs'])[1]//following::*[contains(@class,'reset')]";
          element(by.xpath(actionPopup))
            .isDisplayed()
            .then(function () {
              console.log(
                "History/Action Logs popup details are displayed on hover over"
              );
              library.logStepWithScreenshot(
                "History/Action Logs popup details are displayed on hover over",
                "Element is displayed"
              );
              resolve(true);
            })
            .catch(function () {
              console.log(
                "Failed : History/Action Logs popup details are not displayed on hover over"
              );
              library.logStepWithScreenshot(
                "Failed : History/Action Logs popup details are not displayed on hover over",
                "Element is not displayed"
              );
              resolve(false);
            });
        });
    });
  }

  clickActionsIcon() {
    return new Promise((resolve) => {
      const historyIconEle = element(by.xpath(actionsIcon));
      library.clickJS(historyIconEle);
      console.log("Clicked on History Icon");
      library.logStepWithScreenshot(
        "Clicked on History Icon",
        "Clicked on History"
      );
      resolve(true);
    });
  }

  clickCommentsIcon() {
    return new Promise((resolve) => {
      const historyIconEle = element(by.xpath(commentsIcon));
      library.clickJS(historyIconEle);
      console.log("Clicked on History Icon");
      library.logStepWithScreenshot(
        "Clicked on History Icon",
        "Clicked on History"
      );
      resolve(true);
    });
  }

  clickHistoryIcon() {
    return new Promise((resolve) => {
      const historyIconEle = element(by.xpath(historyIcon));
      library.clickJS(historyIconEle);
      console.log("Clicked on History Icon");
      library.logStepWithScreenshot(
        "Clicked on History Icon",
        "Clicked on History"
      );
      resolve(true);
    });
  }

  verifyActionDetailsPopupDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(actionDetailsPOpup))
        .isDisplayed()
        .then(function () {
          console.log("Action details popup displayed");
          library.logStepWithScreenshot(
            "Action details popup displayed",
            "Element is displayed"
          );
          resolve(true);
        })
        .catch(function () {
          console.log("Failed : Action details popup is not displayed");
          library.logStepWithScreenshot(
            "Failed : Action details popup is not displayed",
            "Element is not displayed"
          );
          resolve(false);
        });
    });

  }

  verifyPeginationElements() {
    let count = 0;
    return new Promise((resolve) => {
      const pageUI = new Map<string, string>();
      pageUI.set(pegination, 'Pegination Elements');
      pageUI.set(previousPage, 'Previous page button');
      pageUI.set(nextPage, 'Next page button');
      element(by.xpath(benchTills)).isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            resolve(true)
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          library.logStepWithScreenshot('Pegination Elements on bench review page is displayed', 'UIVerification');
          resolve(true);
        } else {
          library.logFailStep('Failed : Pegination elements are not displayed');
          resolve(false);
        }
      });
    });
  }

  verifyPeginationDisplayed() {
    return new Promise((resolve) => {
      element.all(by.xpath(analyteDetails)).count().then(function (count) {
        if (count < 25) {
          element(by.xpath(pegination)).isDisplayed().then(function () {
            console.log('Failed : Pegination is displayed for less than 25 records');
            library.logStepWithScreenshot('Failed : Pegination is displayed for less than 25 records', 'Element is displayed');
            resolve(false);
          })
        } else {
          resolve(true);
        }
      }).catch(function () {
        console.log('Failed : Action details option is not displayed');
        library.logStepWithScreenshot('Failed : Action details option is not displayed', 'Element is not displayed');
        resolve(false);
      });
    });
  }

  verifyPrevButtonDisabled() {
    let enabled = true;
    return new Promise((resolve) => {
      const paginationEle = element(by.xpath(pegination));
      browser.executeScript('arguments[0].scrollIntoView();', paginationEle);
      const prev = findElement(locatorType.XPATH, previousPage);
      prev.getAttribute('ng-reflect-disabled').then(function (status) {
        if (status.includes('true')) {
          console.log('Previous Button is disabled');
          library.logStep('Previous Button is disabled');
          resolve(true);
        } else {
          console.log('Previous Button is Enabled');
          library.logStep('Previous Button is Enabled');
          resolve(false);
        }
      });
    });
  }

  verifyPrevButtonEnabled() {
    let enabled = true;
    return new Promise((resolve) => {
      const paginationEle = element(by.xpath(pegination));
      browser.executeScript('arguments[0].scrollIntoView();', paginationEle);
      const prev = findElement(locatorType.XPATH, previousPage);
      prev.getAttribute('ng-reflect-disabled').then(function (status) {
        if (status.includes('true')) {
          console.log('Previous Button is disabled');
          library.logStep('Previous Button is disabled');
          resolve(false);
        } else {
          console.log('Previous Button is Enabled');
          library.logStep('Previous Button is Enabled');
          resolve(true);
        }
      });
    });
  }

  clickOnNextPageBtn() {
    return new Promise((resolve) => {
      const paginationEle = element(by.xpath(pegination));
      browser.executeScript('arguments[0].scrollIntoView();', paginationEle);
      const next = findElement(locatorType.XPATH, nextPage);
      next.isDisplayed().then(function () {
        next.click();
        console.log('Clicked on next page button');
        library.logStepWithScreenshot('Clicked on next page button', 'Clicked on element');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Next button is not displayed');
        library.logStep('Failed : Next button is not displayed');
        resolve(false);
      });
    });
  }

  clickOnPreviousPageBtn() {
    return new Promise((resolve) => {
      const paginationEle = element(by.xpath(pegination));
      browser.executeScript('arguments[0].scrollIntoView();', paginationEle);
      const previous = findElement(locatorType.XPATH, previousPage);
      previous.isDisplayed().then(function () {
        previous.click();
        console.log('Clicked on previous page button');
        library.logStepWithScreenshot('Clicked on previous page button', 'Clicked on element');
        resolve(true);
      }).catch(function () {
        console.log('Failed : previous button is not displayed');
        library.logStep('Failed : previous button is not displayed');
        resolve(false);
      });
    });
  }

  verifyOnClickMarkAndExitNavigateDashboard() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      let string1 = BenchAndReviewCardValueEle.getText();
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnCurrentPageTxtEle = element(by.xpath(selectAllAnalyteOnCurrentPageTxt));
      library.clickJS(selectAllAnalyteOnCurrentPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))), 13000);
      library.waitLoadingImageIconToBeInvisible();
      let XiconEle = element(by.xpath(Xicon));
      let ClearSelectionsAndExitLinkBtnEle = element(by.xpath(ClearSelectionsAndExitLinkBtn));
      if (XiconEle.isDisplayed) {
        RemovedAnalyte = true;
        library.clickJS(ClearSelectionsAndExitLinkBtnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(DashboardLink))), 13000);
        let BenchAndReviewCardValueEle1 = element(by.xpath(BenchAndReviewCardValueTxt));
        let string1 = BenchAndReviewCardValueEle1.getText();

      }
      resolve(RemovedAnalyte);
    });
  }
  verifyOnClickDashboardPopUpMsg() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      let string1 = BenchAndReviewCardValueEle.getText();
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnCurrentPageTxtEle = element(by.xpath(selectAllAnalyteOnCurrentPageTxt));
      library.clickJS(selectAllAnalyteOnCurrentPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let DashboardLinkEle = element(by.xpath(DashboardLink));
      library.clickJS(DashboardLinkEle);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(popupTxt))), 13000);
      library.waitLoadingImageIconToBeInvisible();
      let popupTxtEle = element(by.xpath(popupTxt));
      let MarkAndExitLinkBtnEle = element(by.xpath(MarkAndExitLinkBtn));
      let ClearSelectionsAndExitLinkBtnEle = element(by.xpath(ClearSelectionsAndExitLinkBtn));
      if (popupTxtEle.isDisplayed && MarkAndExitLinkBtnEle.isDisplayed && ClearSelectionsAndExitLinkBtnEle.isDisplayed) {
        RemovedAnalyte = true;
        library.clickJS(ClearSelectionsAndExitLinkBtnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(DashboardLink))), 13000);
      }
      resolve(RemovedAnalyte);
    });
  }
  verifyRefreshResultBtnFun(locationName) {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      let locationIconDropDownEle = element(by.xpath(locationIconDropDown));
      library.clickJS(locationIconDropDownEle);
      let locationDrpDwnEle = element(by.xpath(locationDrpDwn.replace("<text>", locationName)));
      library.clickJS(locationDrpDwnEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 13000);
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(refreshResult))), 13000);
      let refreshResultEle = element(by.xpath(refreshResult));
      let goToDashboardEle = element(by.xpath(goToDashboard));
      library.clickJS(refreshResultEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      if (goToDashboardEle.isDisplayed) {
        RemovedAnalyte = true;
      }
      resolve(RemovedAnalyte);
    });
  }
  verifyGoToDashboardBtnFun(locationName) {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      let locationIconDropDownEle = element(by.xpath(locationIconDropDown));
      library.clickJS(locationIconDropDownEle);
      let locationDrpDwnEle = element(by.xpath(locationDrpDwn.replace("<text>", locationName)));
      library.clickJS(locationDrpDwnEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 13000);
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(goToDashboard))), 13000);
      let goToDashboardEle = element(by.xpath(goToDashboard));
      library.clickJS(goToDashboardEle);
      library.waitLoadingImageIconToBeInvisible();
      if (BenchAndReviewCardValueEle.isDisplayed) {
        RemovedAnalyte = true;
      }
      resolve(RemovedAnalyte);
    });
  }
  verifyReviewedAnalyteRemovedFromAllPage(locationName) {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnAllPageTxtEle = element(by.xpath(selectAllAnalyteOnAllPageTxt));
      library.clickJS(selectAllAnalyteOnAllPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let selectedAnalyteChkBoxEle = element(by.xpath(selectedAnalyteChkBox));
      let analyteChkBoxEle = element(by.xpath(analyteChkBox));
      let pageTwoBtnEle = element(by.xpath(pageTwoBtn));
      if (selectedAnalyteChkBoxEle.isDisplayed) {
        library.clickJS(pageTwoBtnEle);
        library.waitLoadingRunImageIconToBeInvisible();
        library.waitLoadingImageIconToBeInvisible();
        library.clickJS(analyteChkBoxEle);
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(ReviewedBtn))), 13000);
        let ReviewedBtnEle = element(by.xpath(ReviewedBtn));
        library.clickJS(ReviewedBtnEle);
        library.waitLoadingRunImageIconToBeInvisible();
        let locationIconDropDownEle = element(by.xpath(locationIconDropDown));
        library.clickJS(locationIconDropDownEle);
        let locationDrpDwnEle = element(by.xpath(locationDrpDwn.replace("<text>", locationName)));
        library.clickJS(locationDrpDwnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
        library.clickJS(BenchAndReviewCardValueEle);
        library.waitLoadingImageIconToBeInvisible();
        library.waitLoadingRunImageIconToBeInvisible();
        library.clickJS(BenchAndReviewCardValueEle);
        library.waitLoadingImageIconToBeInvisible();
        library.waitLoadingRunImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(allItemsHaveBeenReviewedTxt))), 13000);
        let allItemsHaveBeenReviewedTxtEle = element(by.xpath(allItemsHaveBeenReviewedTxt));
        let goToDashboardEle = element(by.xpath(goToDashboard));
        let refreshResultEle = element(by.xpath(refreshResult));
        if (allItemsHaveBeenReviewedTxtEle.isDisplayed && goToDashboardEle.isDisplayed && refreshResultEle.isDisplayed) {
          RemovedAnalyte = true;
        }
      }
      resolve(RemovedAnalyte);
    });
  }
  verifyReviewedAnalyteRemovedFromCurrentPage(locationName) {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingRunImageIconToBeInvisible();
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnCurrentPageTxtEle = element(by.xpath(selectAllAnalyteOnCurrentPageTxt));
      library.clickJS(selectAllAnalyteOnCurrentPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let selectedAnalyteChkBoxEle = element(by.xpath(selectedAnalyteChkBox));
      let analyteChkBoxEle = element(by.xpath(analyteChkBox));
      if (selectedAnalyteChkBoxEle.isDisplayed) {
        library.clickJS(analyteChkBoxEle);
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(ReviewedBtn))), 13000);
        let ReviewedBtnEle = element(by.xpath(ReviewedBtn));
        library.clickJS(ReviewedBtnEle);
        library.waitLoadingRunImageIconToBeInvisible();
        let locationIconDropDownEle = element(by.xpath(locationIconDropDown));
        library.clickJS(locationIconDropDownEle);
        let locationDrpDwnEle = element(by.xpath(locationDrpDwn.replace("<text>", locationName)));
        library.clickJS(locationDrpDwnEle);
        library.waitLoadingImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 9000);
        library.clickJS(BenchAndReviewCardValueEle);
        library.waitLoadingImageIconToBeInvisible();
        library.waitLoadingRunImageIconToBeInvisible();
        library.clickJS(BenchAndReviewCardValueEle);
        library.waitLoadingImageIconToBeInvisible();
        library.waitLoadingRunImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(allItemsHaveBeenReviewedTxt))), 13000);
        let allItemsHaveBeenReviewedTxtEle = element(by.xpath(allItemsHaveBeenReviewedTxt));
        let goToDashboardEle = element(by.xpath(goToDashboard));
        let refreshResultEle = element(by.xpath(refreshResult));
        if (allItemsHaveBeenReviewedTxtEle.isDisplayed && goToDashboardEle.isDisplayed && refreshResultEle.isDisplayed) {
          RemovedAnalyte = true;
        }
      }
      resolve(RemovedAnalyte);
    });
  }
  verifyAllPageAnalyteChkBoxSelected() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 5000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnAllPageTxtEle = element(by.xpath(selectAllAnalyteOnAllPageTxt));
      library.clickJS(selectAllAnalyteOnAllPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let selectedAnalyteChkBoxEle = element(by.xpath(selectedAnalyteChkBox));
      let pageTwoBtnEle = element(by.xpath(pageTwoBtn));

      if (selectedAnalyteChkBoxEle.isDisplayed && pageTwoBtnEle.isDisplayed) {
        RemovedAnalyte = true;
        library.clickJS(pageTwoBtnEle);
        library.waitLoadingRunImageIconToBeInvisible();
        browser.wait(
          browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
        let analyteChkBoxEle = element(by.xpath(analyteChkBox));
        library.clickJS(analyteChkBoxEle);

      }
      resolve(RemovedAnalyte);;
    });
  }
  verifyCurrentPageAnalyteChkBoxSelected() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 5000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnCurrentPageTxtEle = element(by.xpath(selectAllAnalyteOnCurrentPageTxt));
      library.clickJS(selectAllAnalyteOnCurrentPageTxtEle);
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(selectedAnalyteChkBox))), 13000);
      let selectedAnalyteChkBoxEle = element(by.xpath(selectedAnalyteChkBox));
      let analyteChkBoxEle = element(by.xpath(analyteChkBox));
      if (selectedAnalyteChkBoxEle.isDisplayed) {
        RemovedAnalyte = true;
        library.clickJS(analyteChkBoxEle);
      }
      resolve(RemovedAnalyte);
    });
  }

  verifyAnalyteDropDownOption() {
    return new Promise((resolve) => {
      let RemovedAnalyte = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(BenchAndReviewCardValueTxt))), 5000);
      let BenchAndReviewCardValueEle = element(by.xpath(BenchAndReviewCardValueTxt));
      library.clickJS(BenchAndReviewCardValueEle);
      library.waitLoadingRunImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 13000);
      let analyteDrpDwnEle = element(by.xpath(analyteDrpDwn));
      library.clickJS(analyteDrpDwnEle);
      let selectAllAnalyteOnCurrentPageTxtEle = element(by.xpath(selectAllAnalyteOnCurrentPageTxt));
      let selectAllAnalyteOnAllPageTxtEle = element(by.xpath(selectAllAnalyteOnAllPageTxt));
      if (selectAllAnalyteOnCurrentPageTxtEle.isDisplayed && selectAllAnalyteOnAllPageTxtEle.isDisplayed) {
        RemovedAnalyte = true;
      }
      resolve(RemovedAnalyte);
    });
  }
  navigateToAnalyteAndUpdatePointDataEntry(DataPointValue, CommetInpTxt, dept, Inst, cont, Anlyt) {
    return new Promise((resolve) => {
      let submit = false;
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(
        browser.ExpectedConditions.visibilityOf(
          element(by.xpath(DepartmentLink.replace("<text>", dept)))
        ),
        5000
      );
      let department = element(by.xpath(DepartmentLink.replace("<text>", dept)));
      library.clickJS(department);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(InstrumentLink.replace("<text>", Inst)))
      ),
        5000
      );
      let instrument = element(by.xpath(InstrumentLink.replace("<text>", Inst)));
      library.clickJS(instrument);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(ControlNameLink.replace("<text>", cont)))
        ), 5000);
      let Control = element(by.xpath(ControlNameLink.replace("<text>", cont)));
      library.clickJS(Control);
      library.waitLoadingImageIconToBeInvisible();

      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(AnalyteNameLink.replace("<text>", Anlyt)))), 5000);
      let Analyte = element(by.xpath(AnalyteNameLink.replace("<text>", Anlyt)));
      library.clickJS(Analyte);

      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(EditThisAnalyteLink))), 5000);
      library.waitLoadingImageIconToBeInvisible();
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(InstrumentInputText))), 5000);
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(InstrumentInputText))), 5000);

      let instrumentInp = element(by.xpath(InstrumentDataTable));
      library.clickJS(instrumentInp);
      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();

      let InputDataPointEntryInp = element(by.xpath(InputDataPointEntry));
      InputDataPointEntryInp.clear();
      InputDataPointEntryInp.sendKeys(DataPointValue);

      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();

      let ChooseActionDropDownEle = element(by.xpath(ChooseActionDropDown));
      library.clickJS(ChooseActionDropDownEle);

      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();

      let ChooseActionDropDownOptionsEle = element(by.xpath(ChooseActionDropDownOptions));
      library.clickJS(ChooseActionDropDownOptionsEle);

      library.waitLoadingImageIconToBeInvisible();
      library.waitLoadingRunImageIconToBeInvisible();

      let CommentsInputTxtEle = element(by.xpath(CommentsInputTxt));
      CommentsInputTxtEle.clear();
      CommentsInputTxtEle.sendKeys(CommetInpTxt);

      const submitInpTxt = element(by.xpath(submitUpdateBtn));
      if (submitInpTxt.isDisplayed()) {
        submit = true;
        library.waitLoadingImageIconToBeInvisible();
        let submitB = element(by.xpath(submitUpdateBtn));
        library.clickJS(submitB);
        library.waitLoadingImageIconToBeInvisible();
      }
      return submit;
    });
  }
  verifySupervisorPageDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(supervisorCard)).isDisplayed().then(function () {

        console.log("Supervisor Card is displayed")
        library.logStepWithScreenshot("Supervisor Card is displayed", "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Supervisor Card is not displayed")
        library.logStepWithScreenshot("Failed : Supervisor Card is displayed", "Element is not displayed");
        resolve(false);
      });
    });
  }
  verifySwitchToBenchLinkDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(switchToBenchReviewLink)).isDisplayed().then(function () {
        console.log("Switch to bench review link is displayed")
        library.logStepWithScreenshot("Switch to bench review link is displayed", "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Switch to bench review link is not displayed")
        library.logStepWithScreenshot("Failed : Switch to bench review link is not displayed", "Element is not displayed");
        resolve(false);
      });
    });
  }
  clickOnSwitchToBenchLink() {
    return new Promise((resolve) => {
      element(by.xpath(switchToBenchReviewLink)).isDisplayed().then(function () {
        library.clickJS(switchToBenchReviewLink);
        console.log("Clicked on switch to bench review link")
        library.logStepWithScreenshot("Clicked on switch to bench review link", "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Unable to Click on switch to bench review link")
        library.logStepWithScreenshot("Failed : Unable to Click on switch to bench review link", "Element is not displayed");
        resolve(false);
      });
    });
  }
  clickOnSwitchToSupervisorLink() {
    return new Promise((resolve) => {
      element(by.xpath(switchToSupervisorReviewLink)).isDisplayed().then(function () {
        library.clickJS(switchToSupervisorReviewLink);
        console.log("Clicked on switch to supervisor review link")
        library.logStepWithScreenshot("Clicked on switch to supervisor review link", "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Unable to Click on switch to supervisor review link")
        library.logStepWithScreenshot("Failed : Unable to Click on switch to supervisor review link", "Element is not displayed");
        resolve(false);
      });
    });
  }
  verifyConfirmationMessageAndPerformAction(action) {
    return new Promise((resolve) => {
      element(by.xpath(switchToConfirmationPopup)).isDisplayed().then(function () {
        console.log("Switch to bench or Supervisor review confirmation popup is displayed")
        library.logStepWithScreenshot("Switch to bench or Supervisor review confirmation popup is displayed", "Element is displayed");
        library.clickJS(element(by.xpath("//span[contains(text(),'" + action + "')]")));
        console.log("Clicked on confirmation popup - " + action)
        library.logStepWithScreenshot("Clicked on confirmation popup - " + action, "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Switch to bench or Supervisor review confirmation popup is not displayed")
        library.logStepWithScreenshot("Failed : Switch to bench or Supervisor review confirmation popup is not displayed", "Element is not displayed");
        resolve(false);
      });
    });
  }
  verifyRunCounterElements() {
    return new Promise((resolve) => {
      let count;
      const pageUI = new Map<string, string>();
      pageUI.set(runCounter, 'Run Counter Elements');
      pageUI.set(selectetCountText, 'Run Counter text');
      element(by.xpath(analyteDetailsBox)).isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            resolve(true)
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          library.logStepWithScreenshot('Run Counter Element is displayed', 'UIVerification');
          resolve(true);
        } else {
          library.logFailStep('Failed : Run Counter Element is not displayed');
          library.logStepWithScreenshot('Failed : Run Counter Element is not displayed', 'Not Displayed');
          resolve(false);
        }
      });
    });
  }

  verifyBenchPageDisplayed() {
    return new Promise((resolve) => {
      element(by.xpath(benchCard)).isDisplayed().then(function () {
        console.log("Bench Card is displayed")
        library.logStepWithScreenshot("Bench Card is displayed", "Element is displayed");
        resolve(true);
      }).catch(() => {
        console.log("Failed : Bench Card is not displayed")
        library.logStepWithScreenshot("Failed : Bench Card is displayed", "Element is not displayed");
        resolve(false);
      });
    });
  }


  verifyDynamicFilterElementsDisplayed() {
    return new Promise((resolve) => {
      let count;
      const pageUI = new Map<string, string>();
      pageUI.set(deptFilter, 'Department filter Elements');
      pageUI.set(instrumentFilter, 'Instrument filter element');
      pageUI.set(panelFilter, 'Panel filter element');
      pageUI.set(viewItemsBtn, 'View button element');
      pageUI.set(resetBtn, 'Reset button element');

      element(by.xpath(filterComponent)).isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            resolve(true)
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          library.logStepWithScreenshot('Dynamic filter Element is displayed', 'UIVerification');
          resolve(true);
        } else {
          library.logFailStep('Failed : Dynamic filter Element is not displayed');
          library.logStepWithScreenshot('Failed :Dynamic filter Element is not displayed', 'Not Displayed');
          resolve(false);
        }
      });
    });
  }

  selectDepartmentValues(departmentValues) {
    return new Promise((resolve) => {
      element(by.xpath(deptFilter)).click();
      if (departmentValues.includes(',')) {
        const departments: string[] = departmentValues.split(",");
        departments.forEach(function (value) {
          console.log("Selecting following department value : ", value);
          element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + value + '")]')).click();
        });
      } else {
        console.log("Selecting following department value : ", departmentValues);
        element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + departmentValues + '")]')).click();
      }
      resolve(true);
    });
  }

  selectInstrumentValues(instrumentValues) {
    return new Promise((resolve) => {
      element(by.xpath(deptFilter)).click();
      if (instrumentValues.includes(',')) {
        const instruments: string[] = instrumentValues.split(",");
        instruments.forEach(function (value) {
          console.log("Selecting following instrument value : ", value);
          element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + value + '")]')).click();
        });
      } else {
        console.log("Selecting following instrument value : ", instrumentValues);
        element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + instrumentValues + '")]')).click();
      }
      resolve(true);
    });
  }

  /**
   * Panel Method is pending - DEV Pending
   */

  /* selectInstrumentValues(instrumentValues) {
    return new Promise((resolve) => {
      element(by.xpath(deptFilter)).click();
      if (instrumentValues.includes(',')) {
        const instruments: string[] = instrumentValues.split(",");
        instruments.forEach(function (value) {
          console.log("Selecting following instrument value : ", value);
          element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + value + '")]')).click();
        });
      } else {
        console.log("Selecting following instrument value : ", instrumentValues);
        element(by.xpath('//div[contains(@class,"dynamic-filter-select-panel")]//span[contains(text(),"' + instrumentValues + '")]')).click();
      }
    });
  } */

  /**
   * Verify department filter is disabled for lab without department
   */

  verifyDeptFilterIsDisbled() {
    return new Promise((resolve) => {
      element(by.xpath(deptFilter)).getAttribute("aria-disabled").then(function (value) {
        if (value.includes("true")) {
          console.log("Department filter is disabled")
          library.logStepWithScreenshot("Department filter is disabled", "Element is displayed");
          resolve(true);
        } else {
          console.log("Failed : Department filter is not disabled")
          library.logStepWithScreenshot("Failed : Department filter is not disabled", "Element is not displayed");
          resolve(false);
        }
      });
    });
  }

  verifyPanelFilterIsDisbled() {
    return new Promise((resolve) => {
      element(by.xpath(panelFilter)).getAttribute("aria-disabled").then(function (value) {
        if (value.includes("true")) {
          console.log("Panel filter is disabled")
          library.logStepWithScreenshot("Panel filter is disabled", "Element is displayed");
          resolve(true);
        } else {
          console.log("Failed : Panel filter is not disabled")
          library.logStepWithScreenshot("Failed : Panel filter is not disabled", "Element is not displayed");
          resolve(false);
        }
      });
    });
  }


  verifyViewItemsButtonIsDisabled() {

  }

  verifyViewItemsButtonIsEnabled() {

  }

  clickOnResetBtn() {

  }

  verifyAnalyteDataHeaderElementsAreDisplayed() {
    return new Promise((resolve) => {
      let count;
      const pageUI = new Map<string, string>();
      pageUI.set(analyteDataHeader , 'Analyte DataHeader Element');
      pageUI.set(controlName , 'Control Name Element');
      pageUI.set(lotNumber, 'Lot Number Element');
      pageUI.set(expiryNumber, 'Expiry Number Element');
      pageUI.set(departmentName, 'Department Name Element');
      pageUI.set(instrumentName, 'Instrument Name Element');
      
      element(by.xpath(filterComponent)).isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {  
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            resolve(true)
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          library.logStepWithScreenshot('Analyte Data Header Element is displayed', 'UIVerification');
          resolve(true);
        } else {
          library.logFailStep('Failed : Analyte Data Header Element is not displayed');
          library.logStepWithScreenshot('Failed : Analyte Data Header Element is not displayed', 'Not Displayed');
          resolve(false);
        }
      });
    });
  }


  verifyLatestAnalyteDataHeaderValues(ControlNameValue,departmentValue,instrumentValue){
    return new Promise((resolve) => {
      if(ControlNameValue){
        element(controlName).getText().then(function (value) {
          if(ControlNameValue == value){
            console.log(ControlNameValue + " : Control Name is displayed in analyte data header")
            library.logStepWithScreenshot(ControlNameValue + " : Control Name is displayed in analyte data header", "Element is displayed");
            resolve(true);
          }
        }).catch(() => {
          console.log("Failed - " + ControlNameValue + " : Control Name is not displayed in analyte data header")
          library.logStepWithScreenshot("Failed - " + ControlNameValue + " : Control Name is not displayed in analyte data header", "Element is displayed");
          resolve(false);
        });
      }
      if(departmentValue){
        element(departmentName).getText().then(function (value) {
          if(departmentValue == value){
            console.log(departmentValue + " : Department Name is displayed in analyte data header")
            library.logStepWithScreenshot(departmentValue + " : Department Name is displayed in analyte data header", "Element is displayed");
            resolve(true);
          }
        }).catch(() => {
          console.log("Failed - " + departmentValue + " : Department Name is not displayed in analyte data header")
          library.logStepWithScreenshot("Failed - " + departmentValue + " : Department Name is not displayed in analyte data header", "Element is displayed");
          resolve(false);
        });
      }
        if(instrumentValue){
          element(instrumentName).getText().then(function (value) {
            if(instrumentValue == value){
              console.log(instrumentValue + " : Instrument Name is displayed in analyte data header")
              library.logStepWithScreenshot(instrumentValue + " : Instrument Name is displayed in analyte data header", "Element is displayed");
              resolve(true);
            }
          }).catch(() => {
            console.log("Failed - " + instrumentValue + " : Instrument Name is not displayed in analyte data header")
            library.logStepWithScreenshot("Failed - " + instrumentValue + " : Instrument Name is not displayed in analyte data header", "Element is displayed");
            resolve(false);
          });
      }
    });
  }

  selectAnalyteForReview() {
    return new Promise((resolve) => {
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 10000);
      let firstAnalyteCheckboxEle = element(by.xpath(firstAnalyteCheckbox));
      if (firstAnalyteCheckboxEle.isDisplayed) {
        library.clickJS(firstAnalyteCheckboxEle);
        console.log("Selected first analyte on review page")
        library.logStepWithScreenshot("Selected first analyte on review page", "Element is displayed");
        resolve(true);
      } else {
        console.log("Failed - Analyte is not displayed on review page")
        library.logStepWithScreenshot("Failed - Analyte is not displayed on review page", "Element is not displayed");
        resolve(false);
      }
    });
  }

  getInitialRunCounterCount() {
    return new Promise((resolve) => {
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 5000);
        
      element((by.xpath("//*[@class='runCount']"))).getText().then(function (value) {
        console.log("Current Value is : ", value);
        value = value.replace(/\s/g, "");
        var totalCounter = value.split("/"); 
        return totalCounter[1];
      })
      resolve(true);
    })
  }

  clickOnReviewedBtn() {
    return new Promise((resolve) => {
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 5000);
        console.log("Clicked on Reviewed button")
        library.logStepWithScreenshot("Clicked on Reviewed button", "Element is displayed");
        resolve(true);
    })
  }

  verifyRunCounterValues(initialCounterValue) {
    return new Promise((resolve) => {
      browser.wait(
        browser.ExpectedConditions.visibilityOf(element(by.xpath(firstAnalyteCheckbox))), 5000);
        
      element((by.xpath("//*[@class='runCount']"))).getText().then(function (value) {
        console.log("Final Value is : ", value);
        value = value.replace(/\s/g, "");
        var finalTotalCounter = value.split("/");

        /**
         * +stringvalue convert string to number
         */
        var finalTotalCounterValue = +finalTotalCounter[1];
        var expectedValue = +initialCounterValue - 1;


        if(finalTotalCounterValue == expectedValue) {
          console.log("Run Counter is updated correctly")
          library.logStepWithScreenshot("Run Counter is updated correctly", "Element is displayed");
          resolve(true);
        } else {
          console.log("Failed : Run Counter is not updated correctly")
          library.logStepWithScreenshot("Failed : Run Counter is not updated correctly", "Element is not displayed");
          resolve(false);
        }
      })
    })
  }
  

}
