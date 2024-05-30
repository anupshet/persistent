// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil, take } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { select } from '@ngrx/store';
import { PaginationInstance } from 'ngx-pagination';
import { TranslateService } from '@ngx-translate/core';

import * as ngrxStore from '@ngrx/store';

import { Action, AnalyteEntryType, PointLevelDataColumns } from 'br-component-library';
import { UIConfigService } from '../services/ui-config.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { InstrumentSection, ProductSection } from '../../contracts/models/data-management/page-section/instrument-section.model';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { unsubscribe } from '../../core/helpers/rxjs-helper';
import { NotificationService } from '../../core/notification/services/notification.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { LabDataApiService } from '../api/labDataApi.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { ChangeTrackerService } from '../guards/change-tracker/change-tracker.service';
import { AppLoggerService } from '../services/applogger/applogger.service';
import { RunsService } from '../services/runs.service';
import { DataManagementSpinnerService } from '../services/data-management-spinner.service';
import { PageSectionBase } from './page-section-base';
import { PageSectionService } from './page-section.service';
import { LicensedProduct, LicensedProductType } from '../../contracts/models/portal-api/labsetup-data.model';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { defaultLabId } from '../../core/config/constants/general.const';
import { NavigationService } from '../navigation/navigation.service';
import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../icons/icons.service';
import * as fromRoot from '../../state/app.state';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../state/selectors';
import * as navigationStateSelector from '../../shared/navigation/state/selectors';
import * as Actions from '../../master/data-management/state/actions/data-management.actions';
import { ErrorLoggerService } from '../services/errorLogger/error-logger.service';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { InProgressMessageTranslationService } from '../services/inprogress-message-translation.service';
import { NewRequestConfigType } from '../../contracts/enums/lab-setup/new-request-config-type.enum';
import { RequestNewConfigComponent } from '../components/request-new-config/request-new-config.component';
import { TemplateType } from '../../contracts/enums/lab-setup/template-type.enum';
import { DuplicateNodeEntry } from '../../contracts/models/shared/duplicate-node-entry.model';
import { LabProduct, TreePill } from '../../contracts/models/lab-setup';
import { DuplicateNodeComponent } from '../../shared/containers/duplicate-node/duplicate-node.component';
import { ConnectivityTier } from '../../contracts/enums/lab-location.enum';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { Permissions } from '../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../shared/services/appNavigationTracking/app-navigation-tracking.service';

@Component({
  selector: 'unext-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss']
})
export class PageSectionComponent extends PageSectionBase
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('formReference') formElement: ElementRef;

  @Input() instrumentSection: InstrumentSection;
  @Input() entityType: EntityType;
  @Input() isArchived: boolean;
  @Input() levelName: string;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();
  @Output() onDialogclosed = new EventEmitter();

  isTabOrderRunEntry$: Observable<boolean>;
  public getLocationState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation));
  public getAccountState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentAccount));
  navigationCurrentlySelectedNode$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentlySelectedNode));
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.edit[24]
  ];
  selectedLang: any = { lcid: 'en-US' };
  public unextBusyStatus = new Observable<boolean>();
  public isSummaryOnly: boolean;

  public instrumentEntityType = EntityType.LabInstrument;
  public analyteEntryType: AnalyteEntryType;
  private labIdSubscription: Subscription;
  public readonly displayedLevelDataColumns = new Set<PointLevelDataColumns>([
    PointLevelDataColumns.Value
  ]);

  private screenLoadedDateTime: Date;
  public licensedProducts: LicensedProduct[] = [];
  public licensedProductTypeConnectivity = LicensedProductType.Connectivity;

  public filter = '';
  public maxSize = 5; // Controls maximum number of pagination buttons displayed
  public directionLinks = true;
  public autoHide = true;
  public responsive = true;
  public labels: any = {
    previousLabel: this.getTranslation('PAGESECTION.PREVIOUS'),
    nextLabel: this.getTranslation('PAGESECTION.NEXT'),
    screenReaderPaginationLabel: this.getTranslation('PAGESECTION.PAGINATION'),
    screenReaderPageLabel: this.getTranslation('PAGESECTION.PAGE'),
    screenReaderCurrentLabel: this.getTranslation('PAGESECTION.ONPAGE')
  };
  // TODO remove when br library is removed
  public translationLabels: any = this.getTranslationLabels();
  public eventLog: string[] = [];
  public config: PaginationInstance;
  private canDeactivateSubject: Subscription;
  public inProgress = true;
  public progressHeader: string;
  public progressMessage: string;
  lastEntryToggleClicked: Subject<boolean> = new Subject<boolean>();
  public hasConnectivity = false;
  public newRequestConfigType = NewRequestConfigType;
  public unAvailableProducts: Array<ProductSection>;
  public unavailableProductMsg: Array<string> = [];
  public unavailableProductLotNumber: Array<string> = [];
  public correctiveActions: Array<Action>;
  public futureTimeStamp = new Date();
  selectedNode: TreePill;
  permissions = Permissions;
  currentLanguage: string;

  constructor(
    public dialog: MatDialog,
    @Inject(PageSectionService) pageSectionService: PageSectionService,
    @Inject(CodelistApiService) codeListService: CodelistApiService,
    @Inject(DataManagementSpinnerService) dataManagementSpinnerService: DataManagementSpinnerService,
    @Inject(LabDataApiService) labDataService: LabDataApiService,
    @Inject(MessageSnackBarService) messageSnackBar: MessageSnackBarService,
    @Inject(RunsService) runsService: RunsService,
    @Inject(NotificationService) notification: NotificationService,
    @Inject(DateTimeHelper) dateTimeHelper: DateTimeHelper,
    @Inject(ChangeTrackerService) changeTrackerService: ChangeTrackerService,
    @Inject(AppLoggerService) appLoggerService: AppLoggerService,
    @Inject(ngrxStore.Store) store: ngrxStore.Store<fromRoot.State>,
    @Inject(AppNavigationTrackingService) appNavigationService: AppNavigationTrackingService,
    renderer: Renderer2,
    elem: ElementRef,
    private uiConfigAction: UIConfigService,
    private navigationService: NavigationService,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private inProgressMsgService: InProgressMessageTranslationService,
    public newConfigDialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService,
  ) {
    super(
      pageSectionService,
      codeListService,
      dataManagementSpinnerService,
      labDataService,
      messageSnackBar,
      runsService,
      notification,
      dateTimeHelper,
      changeTrackerService,
      appLoggerService,
      translate,
      elem,
      renderer,
      store,
      dialog,
      appNavigationService
    );
    this.iconService.addIcons(this.iconsUsed);
  }

  async ngOnInit() {
    super.ngOnInit();
    this.getCurrentSelectLanguage();
    this.startSpinner();
    this.checkCustomSortModeEnabled();
    this.config = this.changeTrackerService.config;
    // SR 031202020: TASK 163054 LabId is set to default hardcode value in GUID format to align with the backend requirement
    this.labId = defaultLabId;

    this.navigationCurrentlySelectedNode$
      .pipe(filter(currentNode => !!currentNode), takeUntil(this.destroy$))
      .subscribe(
        currentNode => {
          this.selectedNode = currentNode;
        });

    this.isLastDataEntryVisible = true;

    this.getAccountState$
      .pipe(filter(account => !!account), take(1))
      .subscribe(account => {
        try {
          this.accountId = account.id;
          this.accountNumber = account.accountNumber;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.PageSectionComponent + blankSpace + Operations.FetchAccount)));
        }
      });

    this.isTabOrderRunEntry$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getTabOrderState));
    this.isTabOrderRunEntry$
      .pipe(filter(isTabOrderRunEntry => !!isTabOrderRunEntry), takeUntil(this.destroy$)).subscribe(isTabOrderRunEntry => {
        try {
          this.isTabOrderRunEntry = isTabOrderRunEntry;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.PageSectionComponent + blankSpace + Operations.GetTabOrderRunEntry)));
        }
      });
    this.screenLoadedDateTime = new Date();
    this.selectedDateTime = new Date();

    // 45 days in the future
    this.futureTimeStamp.setDate(this.futureTimeStamp.getDate() + 45);

    this.dateTimeOffset = this.dateTimeHelper.getTimeZoneOffset(this.selectedDateTime, this.timeZone);
    // Collects entity information such as entity name and entity lot,
    this.extractEntityData(this.instrumentSection, this.entityType);
    this.analyteEntrySets = await this.pageSectionService.createAnalyteEntrySets(
      this.sortedAnalyteSections,
      this.cumulativeLevelsInUse,
      this.isTabOrderRunEntry,
      this.selectedDateTime,
      this.timeZone
    );

    this.analyteForm = this.createForm(
      this.sortedAnalyteSections,
      this.analyteEntrySets
    );

    // Update the Change Tracker
    this.updateChangeTracker();

    const summaryLabTestIds = this.sortedAnalyteSections
      .filter(as => as.analyteInfo.isSummary)
      .map(as => as.analyteInfo.labTestId);
    const runDataLabTestIds = this.sortedAnalyteSections
      .filter(as => !as.analyteInfo.isSummary)
      .map(as => as.analyteInfo.labTestId);

    const summaryIdsExist = summaryLabTestIds.length > 0;
    const runDataIdsExist = runDataLabTestIds.length > 0;

    // SR 09222020: DateTime picker follows the same logic as AnalyteLevel
    this.availableDateFrom = new Date();
    this.availableDateFrom.setMonth(this.availableDateFrom.getMonth() - 120);

    if (summaryIdsExist) {
      this.labDataService
        .getSummaryDataByLabTestIdsAsync(summaryLabTestIds)
        .then(baseRawDataSet => {
          // TODO - Instrument level with summary data -- verify if latest is always at index 0
          if (this.isSummaryOnly) {
            if (baseRawDataSet && baseRawDataSet.length > 0) {
              // pbi217077 new Date() replaced new Date(baseRawDataSet[0].localSummaryDateTime
              this.setSelectedDateTime(new Date());
            } else {
              this.setSelectedDateTime(null);
            }
          }

          this.analyteViewSets = this.analyteViewSets.concat(
            this.analyteViewSets,
            this.pageSectionService.createSingleAnalyteViewSets(
              this.sortedAnalyteSections,
              baseRawDataSet,
              this.cumulativeLevelsInUse,
              this.timeZone,
              false
            )
          );

          this.stopSpinner();
        }, err => {
        });
    }

    if (runDataIdsExist) {
      this.labDataService
        .getRunDataByLabTestIdsAsync(runDataLabTestIds)
        .then(runData => {
          this.selectedDateTime = this.getDateWithLaterTime(this.selectedDateTime, this.availableDateFrom);

          this.analyteViewSets = this.analyteViewSets.concat(
            this.analyteViewSets,
            this.pageSectionService.createSingleAnalyteViewSets(
              this.sortedAnalyteSections,
              runData,
              this.cumulativeLevelsInUse,
              this.timeZone,
              false
            )
          );

          this.stopSpinner();
        });
    }

    if (!summaryIdsExist && !runDataIdsExist) {
      // Spinner starts at DataManagement component
      this.stopSpinner();
    }

    this.columnsToDisplay = this.columnsToDisplay.concat(
      this.cumulativeLevelsInUse.map(lv => lv.toString())
    );

    this.isSummaryOnly = this.pageSectionService.getIsSummaryOnly(
      this.sortedAnalyteSections
    );

    this.analyteEntryType =
      this.entityType === EntityType.LabTest
        ? AnalyteEntryType.Single
        : AnalyteEntryType.Multi;

    this.subscribeToNotification(this.sortedAnalyteSections);

    this.canDeactivateSubject = this.changeTrackerService.canDeactivateSubject.subscribe(canDeactivateContent => {
      if (canDeactivateContent) {
        this.changeTrackerService.config.currentPage = this.changeTrackerService.pendingPage;
        this.resetForm();
      }
    });
    this.retrieveUserActions();

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async lang => {
      this.translationLabels = this.getTranslationLabels();
      const labels = this.pageSectionService.getChangeLotDataLabels();
      this.analyteEntrySets?.forEach(analyteEntrySet => {
        analyteEntrySet?.changeLotData && Object.entries(labels).forEach(([label, translation]) => analyteEntrySet.changeLotData[label] = translation);
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formElement?.nativeElement?.getElementsByTagName('input')[0]?.focus();
    }, 0);
  }
  getCurrentSelectLanguage() {
    this.navigationGetLocale$.pipe(take(1))
    .subscribe(
      (lang) => {
        this.selectedLang = lang;
        this.currentLanguage = this.selectedLang.language;
      }
    );
  }
  public toggleLastEntryVisibility(): void {
    this.isLastDataEntryVisible = !this.isLastDataEntryVisible;
    this.lastEntryToggleClicked.next(this.isLastDataEntryVisible);
  }

  gotoInstrumentSettings(id: string): void {
    const navigateToInstrumentSettings = (() => {
      const url = `/${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${id}/${unRouting.labSetup.settings}`;
      return () => { this.navigationService.navigateToInstrumentSettings(url, true, this.selectedNode, id); };
    })();
    navigateToInstrumentSettings();
  }

  gotoControlSettings(id: string): void {
    const navigateToControlSettings = (() => {
      const url = `/${unRouting.labSetup.lab}/${unRouting.labSetup.controls}/${id}/${unRouting.labSetup.settings}`;
      return () => { this.navigationService.navigateToUrl(url, true, this.selectedNode, id); };
    })();
    navigateToControlSettings();
  }

  gotoEditPanel(id: string): void {
    const url = '/' + unRouting.panels.panel + '/' + unRouting.panels.actions.edit.replace(':id', id);
    this.navigationService.routeTo(url);
  }

  public onTabOrderChange(isTabOrderRunEntry: boolean): void {
    this.uiConfigAction.updateTabOrderState(isTabOrderRunEntry);
    this.isTabOrderRunEntry = isTabOrderRunEntry;
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.slice().reverse().map(v => [v[key], v])).values()].reverse();
  }

  private extractEntityData(
    instrumentSection: InstrumentSection,
    entityType: EntityType
  ): void {
    this.sortedProductSections = this.pageSectionService.extractSortedProductSections(instrumentSection, !!instrumentSection.panelSections);
    this.sortedAnalyteSections = this.pageSectionService.extractSortedAnalyteSectionsByProduct(this.sortedProductSections);

    const arr = this.getUniqueListBy(this.sortedAnalyteSections, 'productName');
    // add true if unique lot
    const unique = [];
    this.sortedAnalyteSections.forEach(item => {
      item['uniqueLot'] = true;

      if (unique.length) {
        unique.forEach(i => {
          if (i === item.lotNumber.toString()) {
            item['uniqueLot'] = false;
          }
        });
      }
      unique.push(item.lotNumber);
    });

    // total lots per product
    const productNameCounter = [];
    arr.forEach(i => {
      const productName = i['productName'];
      let c = 0;
      this.sortedAnalyteSections.forEach(item => {
        if (item.productName === productName) {
          c++;
        }
      });
      productNameCounter.push({
        productName: productName,
        totalLots: c
      });
    });

    // total expired lots per product
    arr.forEach(i => {
      const productName = i['productName'];
      let noExpiredLots = 0;
      this.sortedAnalyteSections.forEach(item => {
        if (item.productName === productName) {
          if (this.hasProductMasterLotExpired(item.analyteInfo['productMasterLotExpiration'], this.futureTimeStamp)) {
            noExpiredLots++;
          }
        }
      });
      productNameCounter.forEach(o => {
        if (o.productName === productName) {
          o['noExpiredLots'] = noExpiredLots;
        }
      });
    });

    this.sortedAnalyteSections.forEach(item => {
      productNameCounter.forEach(i => {
        if (item.productName === i.productName) {
          item['showExpBtn'] = false;
          if (i.totalLots === i.noExpiredLots) {
            item['showExpBtn'] = true;
          }
        }
      });
    });

    // set aboutToExpireLot
    this.sortedAnalyteSections.forEach(item => {
      const hasAlreadyExpired = this.hasProductMasterLotExpired(item.analyteInfo['productMasterLotExpiration'], this.selectedDateTime);
      const aboutToExpire = this.hasProductMasterLotExpired(item.analyteInfo['productMasterLotExpiration'], this.futureTimeStamp);
      if (hasAlreadyExpired) {
        item['hasAlreadyExpired'] = true;
      } else if (!hasAlreadyExpired && aboutToExpire) {
        item['hasAlreadyExpired'] = false;
      } else {
        item['hasAlreadyExpired'] = false;
      }
    });

    this.filteredSortedAnalyteSections = this.sortedAnalyteSections;

    switch (+entityType) {
      case EntityType.LabInstrument:
        this.pageTitleEntityName = instrumentSection.instrument.displayName;
        this.instrumentId = instrumentSection.instrument.id;
        this.unAvailableProducts = instrumentSection.productSections.filter(unAvailable => !unAvailable.product.isUnavailable);
        if (this.unAvailableProducts && this.unAvailableProducts.length > 0) {
          const lotPrefix = this.getTranslation('TRANSLATION.LOTS');
          this.unAvailableProducts.forEach(ele => {
            this.unavailableProductLotNumber.push(lotPrefix + blankSpace + ele.product.lotInfo.lotNumber);
            this.unavailableProductMsg.push(this.inProgressMsgService.setProgressMessage(ele.product.unavailableReasonCode).progressHeader
            + blankSpace + this.inProgressMsgService.setProgressMessage(ele.product.unavailableReasonCode).progressMessage);
          });
        }
        if (instrumentSection.instrument.isUnavailable) {
          this.progressHeader = this.inProgressMsgService.
          setProgressMessage(instrumentSection.instrument.unavailableReasonCode).progressHeader;
          this.progressMessage = this.inProgressMsgService.
          setProgressMessage(instrumentSection.instrument.unavailableReasonCode).progressMessage;
        } else {
          this.inProgress = false;
        }
        break;
      case EntityType.LabProduct:
        this.pageTitleEntityName =
          instrumentSection.productSections[0].product.displayName;
        this.pageTitleProductLot =
          instrumentSection.productSections[0].product.lotInfo.lotNumber.toString();
        this.controlId = instrumentSection.productSections[0].product.id;
        if (instrumentSection.productSections[0].product.isUnavailable) {
          this.progressHeader = this.inProgressMsgService.
          setProgressMessage(instrumentSection.productSections[0].product.unavailableReasonCode).progressHeader;
          this.progressMessage = this.inProgressMsgService.
          setProgressMessage(instrumentSection.productSections[0].product.unavailableReasonCode).progressMessage;
        } else {
          this.inProgress = false;
        }
        break;
      case EntityType.Panel:
        this.pageTitleEntityName =
          instrumentSection.panelSections[0].panel.displayName;
        this.panelId = instrumentSection.panelSections[0].panel.id;
        if (instrumentSection.panelSections[0].panel.isUnavailable) {
          this.progressHeader = this.inProgressMsgService.
          setProgressMessage(instrumentSection.panelSections[0].panel.unavailableReasonCode).progressHeader;
          this.progressMessage = this.inProgressMsgService.
          setProgressMessage(instrumentSection.panelSections[0].panel.unavailableReasonCode).progressMessage;
        } else {
          this.inProgress = false;
        }
        break;
      default:
        this.pageTitleEntityName = '';
        this.instrumentId = '';
        this.controlId = '';
        this.panelId = '';
        break;
    }

    // Collects all the levels used in page
    this.cumulativeLevelsInUse = this.pageSectionService.extractCumulativeLevelsInUse(
      this.sortedAnalyteSections
    );
  }

  private setSelectedDateTime(dateOfMostRecentSummaryEntry: Date = null) {
    this.selectedDateTime = this.pageSectionService.getSelectedDateTime(dateOfMostRecentSummaryEntry,
      this.screenLoadedDateTime, this.timeZone);
  }

  ngOnDestroy() {
    unsubscribe(this.labIdSubscription);
    unsubscribe(this.formChangesSubscription);
    unsubscribe(this.canDeactivateSubject);
    this.unsubscribeToNotificationSubscription();

    // For unsubscribing multiple lab tests from Notification service
    if (this.sortedAnalyteSections) {
      this.sortedAnalyteSections.forEach(analyteSection => {
        if (analyteSection && analyteSection.analyteInfo) {
          this.notification.unSubscribeLabTestFromHub(
            analyteSection.analyteInfo.labTestId
          );
        }
      });
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(Actions.SetDataEntryMode({ dataEntryMode: false }));
  }

  // NGX-Paginate Functions
  onPageChanging(number: number) {
    try {
      // Triggers dialog logic when navigating between pages
      this.changeTrackerService.pendingPage = number;
      this.changeTrackerService.canDeactivate(PageSectionComponent);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.PageSectionComponent + blankSpace + Operations.FetchPageNumber)));
    }
  }

  onPageBoundsCorrection(number: number) {
    this.logEvent(`pageBoundsCorrection(${number})`);
    this.config.currentPage = number;
  }

  private logEvent(message: string) {
    this.eventLog.unshift(`${new Date().toISOString()}: ${message}`);
  }

  requestNewConfiguration(type: NewRequestConfigType) {
    let templateId, name;
    switch (type) {
      case this.newRequestConfigType.CalibratorLot:
        templateId = TemplateType.CalibratorLot;
        name = this.getTranslation('TRANSLATION.CALIBRATORNUMBER');
        break;
      case this.newRequestConfigType.ReagentLot:
        templateId = TemplateType.ReagentLot;
        name = this.getTranslation('TRANSLATION.REAGENTNUMBER');
        break;
      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCaseRequestNewConfig,
            (componentInfo.PageSectionComponent + blankSpace + Operations.defaultCaseRequestNewConfig)));
        break;
    }
    this.newConfigDialog.open(RequestNewConfigComponent, {
      width: '450px',
      data: {
        templateId: templateId,
        name: name
      }
    });
  }

  public showProductName(searchName: string, labTestId: string) {
    if (this.controlId) {
      // returns false, not needed in control view
      return false;
    }

    const elementExists = document.getElementsByClassName(searchName); // searches DOM for array of analytes
    if (elementExists.length > 0 && elementExists[0].id !== labTestId) {
      // returns false if labTestID is not the first to be displayed in DOM
      return false;
    }
    return true;
  }

  public openDialogBoxForProduct(analyteSection) {

    let data;
    for (let i = 0; i <= this.instrumentSection.productSections.length; i++) {
      if (analyteSection.productName === this.instrumentSection.productSections[i].product.displayName) {
        data = this.instrumentSection.productSections[i].product;
        break;
      }
    }
    const controlNode: LabProduct = {
      displayName: data.displayName,
      productId: data.productId,
      productMasterLotId: data.productMasterLotId,
      productCustomName: data.productCustomName,
      productInfo: null,
      lotInfo: data?.lotInfo,
      productLotLevels: null,
      levelSettings: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: data.id,
      parentNodeId: data.parentNodeId,
      parentNode: null,
      nodeType: EntityType.LabProduct,
      children: null,
      isUnavailable: false,
      manufacturerId: data?.productInfo?.manufacturerId
    };
    const duplicateNodeInfo: DuplicateNodeEntry = {
      sourceNode: controlNode,
      userId: '',
      parentDisplayName: '',
      availableLots: []
    };

    const dialogRef = this.dialog.open(DuplicateNodeComponent, {
      width: '485px',
      data: { duplicateNodeInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDialogclosed.emit(result);
    });
  }

  private retrieveUserActions(): void {
    this.codeListService.getUserActionsAsync().then(actions => {
      this.correctiveActions = new Array<Action>();
      actions.forEach(action => {
        this.correctiveActions.push({
          actionId: action.id,
          actionName: action.description
        } as Action);
      });
    });
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  private getTranslationLabels() {
    return {
      peergroup: this.getTranslation('ENTRYSAVE.PEERGROUP'),
      cancel: this.getTranslation('ENTRYSAVE.CANCEL'),
      change: this.getTranslation('DATETIMEPICKER.CHANGE'),
      date: this.getTranslation('DATETIMEPICKER.DATE'),
      mean: this.getTranslation('TRANSLATION.MEAN'),
      sd: this.getTranslation('TRANSLATION.SD'),
      points: this.getTranslation('TRANSLATION.POINTS'),
      expired: this.getTranslation('ANALYTESUMMARYENTRY.LOTEXPIRED'),
      na: this.getTranslation('ANALYTESUMMARYENTRY.NA'),
      submit: this.getTranslation('ANALYTESUMMARYENTRY.SUBMIT'),
    };
  };
}
