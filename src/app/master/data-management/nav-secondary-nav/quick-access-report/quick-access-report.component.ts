// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as ngrxStore from '@ngrx/store';

import * as _moment from 'moment';
import * as fromDataRoot from '../../../../state/app.state';
import * as fromDataManagement from '../../../data-management/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import * as selectors from '../../../../shared/navigation/state/selectors';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LabInstrument, LabProduct } from '../../../../contracts/models/lab-setup';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { forwardSlash } from '../../../../core/config/constants/general.const';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'unext-quick-access-report',
  templateUrl: './quick-access-report.component.html',
  styleUrls: ['./quick-access-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class QuickAccessReportComponent implements OnInit,OnDestroy {

  @Input() label: string;
  @Input() isBrControlNotPresent: boolean;
  protected destroy$ = new Subject<boolean>();
  maxDate = new Date();
  date = new FormControl(moment());
  selectedNode: TreePill;
  createReportSelectedYear = moment().year();
  createReportSelectedMonth = moment().month() + 1;
  isVisible: boolean;
  isDisabled = false;
  isArchiveItemsToggleOn: boolean;
  isArchived: LabProduct[] = [];
  isunArchived: LabProduct[] = [];
  isunArchivedControl: LabProduct[] = [];
  archivedData: boolean[] = [];
  archivedDataControl: boolean[] = [];
  isBrControlPresent: boolean = false;
  data = {
    chosenReports: new Array,
    yearMonth: `${this.createReportSelectedYear}${this.createReportSelectedMonth}`
  };
  selectedLang: any = { lcid: 'en-US' };

  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public navigationSelectedLeaf$ = this.store.pipe(select(selectors.getCurrentlySelectedLeaf));
  public dataManagementState$ = this.dataManagementStore.pipe(ngrxStore.select(fromDataManagement.getDataManagementState));
  public getArchiveToggle$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));

  constructor(
    public router: Router,
    protected dateTimeHelper: DateTimeHelper,
    private navigationService: NavigationService,
    private dataManagementStore: ngrxStore.Store<fromDataRoot.State>,
    private store: Store<fromRoot.State>,
    private adapter: DateAdapter<any>) {
  }

  ngOnInit(): void {
    this.getDateFormatString();
    this.selectionDate();
    this.navigationCurrentlySelectedNode$
      .pipe(filter(selectedNode => !!selectedNode), takeUntil(this.destroy$))
      .subscribe((selectedNode) => {
        if (selectedNode) {
          this.selectedNode = JSON.parse(JSON.stringify(selectedNode));
          if (selectedNode && selectedNode.children && selectedNode.children.length > 0) {
            if (selectedNode.nodeType === EntityType.LabInstrument) {
              const archivedLots: TreePill[] = [];
              selectedNode = selectedNode as LabInstrument;
              selectedNode?.children.forEach(lot => {
                if (lot as LabProduct && lot.children && lot.children.length > 0) {
                  if (!(lot?.children.every(node => node.isArchived) || this.isExpired(lot as LabProduct))) {
                    archivedLots.push(lot);
                  }
                  lot.children.forEach(analyte => {
                    if (!analyte.isArchived) {
                      this.isunArchived.push(lot as LabProduct);
                      if (this.isunArchived && this.isunArchived.length > 0) {
                        this.isunArchived.forEach(item => {
                          const hasAlreadyExpired = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'], new Date());
                          this.archivedData.push(hasAlreadyExpired);
                        });
                        this.isDisabled = this.archivedData?.every(key => key === true);
                      }
                    } else if (analyte.isArchived) {
                      this.isArchived.push(lot as LabProduct);
                      if (this.isArchived && this.isArchived.length > 0) {
                        this.isArchived.forEach(item => {
                          const hasAlreadyExpired = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'], new Date());
                          this.archivedData.push(hasAlreadyExpired);
                        });
                        this.isDisabled = this.archivedData?.every(key => key === true);
                      }
                    }
                  });
                }
              });
              this.isDisabled = archivedLots.length < 1;
            } else if (selectedNode.nodeType === EntityType.LabProduct) {
              if (selectedNode && selectedNode.children && selectedNode.children.length > 0) {
                const isAllArchived = selectedNode.children.every(node => node.isArchived);
                selectedNode.children.forEach(analyte => {
                  if (!analyte.isArchived) {
                    this.isunArchivedControl.push(selectedNode as LabProduct);
                    if (this.isunArchivedControl && this.isunArchivedControl.length > 0) {
                      this.isunArchivedControl.forEach(item => {
                        const hasAlreadyExpired = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'], new Date());
                        this.archivedDataControl.push(hasAlreadyExpired);
                      });
                      this.isDisabled = this.archivedDataControl?.every(key => key === true) ? true : false;
                    }
                  } else if (analyte.isArchived) {
                    this.isArchived.push(selectedNode as LabProduct);
                    if (this.isArchived && this.isArchived.length > 0) {
                      this.isArchived.forEach(item => {
                        const hasAlreadyExpired = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'], new Date());
                        this.archivedDataControl.push(hasAlreadyExpired);
                      });
                      this.isDisabled = this.archivedDataControl?.every(key => key === true) || isAllArchived;
                    }
                  }
                });
              }
            }
          }
        }
      });

    this.dataManagementState$
      .pipe(filter(dataManagementState => !!dataManagementState), takeUntil(this.destroy$))
      .subscribe(dataManagementState => {
        if (
          dataManagementState.cumulativeAnalyteInfo &&
          dataManagementState.cumulativeAnalyteInfo.length > 0
        ) {
          this.isVisible = true;
        }
      });
  }

  getDateFormatString() {
    this.store.pipe(select(navigationStateSelector.getLocale)).pipe(takeUntil(this.destroy$))
    .subscribe(
      (lang: any) => {
        this.adapter.setLocale(lang?.locale || lang?.lcid || this.selectedLang.lcid);
      }
    );
  }

  isExpired(lot: LabProduct): boolean {
    return this.hasProductMasterLotExpired(lot?.lotInfo['expirationDate'], new Date());
  }

  protected hasProductMasterLotExpired(productMasterLotExpiration: Date, selectedDateTime: Date): boolean {
    return this.dateTimeHelper.isExpiredOnSpecificDate(productMasterLotExpiration, selectedDateTime);
  }

  formatDate(expirationDate) {
    const hasAlreadyExpired = this.hasProductMasterLotExpired(expirationDate, new Date(this.data.yearMonth));
    const date = new Date(expirationDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDate = year.toString() + month;
    const years = this.data.yearMonth.substring(0, 4);
    let months = this.data.yearMonth.substring(4);
    if (parseInt(months, 10) < 10) {
      months = '0' + this.data.yearMonth.substring(4);
    }
    const convertedDate = years + months;
    return { hasAlreadyExpired, formattedDate, convertedDate };
  }

  selectionDate() {

    this.navigationCurrentlySelectedNode$
      .pipe(filter(selectedNode => !!selectedNode), takeUntil(this.destroy$))
      .subscribe((selectedNode) => {
        if (selectedNode) {
          this.selectedNode = JSON.parse(JSON.stringify(selectedNode));
          if (selectedNode && selectedNode.children && selectedNode.children.length > 0) {
            if (selectedNode.nodeType === EntityType.LabInstrument) {
              selectedNode = selectedNode as LabInstrument;
              const archivedLots: TreePill[] = [];
              selectedNode?.children.forEach(lot => {
                if (lot as LabProduct && lot.children && lot.children.length > 0) {
                  if (!(lot?.children.every(node => node.isArchived) || !this.checkForCurrentDate(lot as LabProduct))) {
                    archivedLots.push(lot);
                  }
                  lot.children.forEach(analyte => {
                    if (!analyte.isArchived) {
                      this.isunArchived.push(lot as LabProduct);
                      if (this.isunArchived && this.isunArchived.length > 0) {
                        this.isunArchived.forEach(item => {
                          let hasAlreadyExpired = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'],
                            new Date(this.data.yearMonth));
                          const expirationDate = item?.lotInfo['expirationDate'];
                          const result = this.formatDate(expirationDate);
                          if (new Date(result.convertedDate) <= new Date(result.formattedDate)) {
                            hasAlreadyExpired = false;
                          } else {
                            hasAlreadyExpired = true;
                          }
                          this.archivedData.push(hasAlreadyExpired);
                        });
                        this.isDisabled = this.archivedData?.every(key => key === true);
                      }
                    } else if (analyte.isArchived) {
                      this.isArchived.push(lot as LabProduct);
                      if (this.isArchived && this.isArchived.length > 0) {
                        this.isArchived.forEach(item => {
                          let hasAlreadyExpireds = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'],
                            new Date(this.data.yearMonth));
                          const expirationDate = item?.lotInfo['expirationDate'];
                          const result = this.formatDate(expirationDate);
                          if (new Date(result.convertedDate) <= new Date(result.formattedDate)) {
                            hasAlreadyExpireds = false;
                          } else {
                            hasAlreadyExpireds = true;
                          }
                          this.archivedData.push(hasAlreadyExpireds);
                        });
                        this.isDisabled = this.archivedData?.every(key => key === true);
                      }
                    }
                  });
                }
              });
              this.isDisabled = archivedLots.length < 1;
            } else if (selectedNode.nodeType === EntityType.LabProduct) {
              if (selectedNode && selectedNode.children && selectedNode.children.length > 0) {
                const isAllArchived = selectedNode.children.every(node => node.isArchived);
                selectedNode.children.forEach(analyte => {
                  if (!analyte.isArchived) {
                    this.isunArchivedControl.push(selectedNode as LabProduct);
                    if (this.isunArchivedControl && this.isunArchivedControl.length > 0) {
                      this.isunArchivedControl.forEach(item => {
                        let hasAlreadyExpireds = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'],
                          new Date(this.data.yearMonth));
                        const expirationDate = item?.lotInfo['expirationDate'];
                        const result = this.formatDate(expirationDate);
                        if (new Date(result.convertedDate) <= new Date(result.formattedDate)) {
                          hasAlreadyExpireds = false;
                        } else {
                          hasAlreadyExpireds = true;
                        }
                        this.archivedDataControl.push(hasAlreadyExpireds);
                      });
                      this.isDisabled = this.archivedDataControl?.every(key => key === true) ? true : false;
                    }
                  } else if (analyte.isArchived) {
                    this.isArchived.push(selectedNode as LabProduct);
                    if (this.isArchived && this.isArchived.length > 0) {
                      this.isArchived.forEach(item => {
                        let hasAlreadyExpireds = this.hasProductMasterLotExpired(item?.lotInfo['expirationDate'],
                          new Date(this.data.yearMonth));
                        const expirationDate = item?.lotInfo['expirationDate'];
                        const result = this.formatDate(expirationDate);
                        if (new Date(result.convertedDate) <= new Date(result.formattedDate)) {
                          hasAlreadyExpireds = false;
                        } else {
                          hasAlreadyExpireds = true;
                        }
                        this.archivedDataControl.push(hasAlreadyExpireds);
                      });
                      this.isDisabled = this.archivedDataControl?.every(key => key === true) || isAllArchived;
                    }
                  }
                });
              }
            }
          }
        }
      });
  }

  chosenMonthHandler(normalizedSelection: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>): void {

    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedSelection.year());
    ctrlValue.month(normalizedSelection.month());
    this.date.setValue(ctrlValue);
    this.createReportSelectedYear = normalizedSelection.year();
    this.createReportSelectedMonth = normalizedSelection.month() + 1;
    this.data.yearMonth = `${this.createReportSelectedYear}${this.createReportSelectedMonth}`;
    datepicker.close();
    this.archivedData = [];
    this.archivedDataControl = [];
    this.selectionDate();
  }

  routeToReports(): void {
    this.selectedNode.reportCreate = this.data.yearMonth;
    this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode: this.selectedNode }));
    this.store.dispatch(NavBarActions.setItemToCurrentBranch({ currentBranchItem: this.selectedNode }));
    this.navigationService.setSelectedReportNotificationId('');
    this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.newReports]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  checkForCurrentDate(lot: LabProduct): boolean {
    const expirationDate = lot?.lotInfo['expirationDate'];
    const result = this.formatDate(expirationDate);
    return new Date(result.convertedDate) <= new Date(result.formattedDate);
  }
}
