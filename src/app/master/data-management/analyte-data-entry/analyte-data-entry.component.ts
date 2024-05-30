// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, iif, of } from 'rxjs';
import { map, filter, takeUntil, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';

import { DataManagementState } from '../state/reducers/data-management.reducer';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { AnalyteInfo } from '../../../contracts/models/data-management/entity-info.model';
import {
  AnalyteSection,
  InstrumentSection,
  ProductSection,
} from '../../../contracts/models/data-management/page-section/instrument-section.model';
import { LabInstrument } from '../../../contracts/models/lab-setup/instrument.model';
import { LabProduct } from '../../../contracts/models/lab-setup/product.model';
import { LabTest } from '../../../contracts/models/lab-setup/test.model';
import * as fromRoot from '../../../state/app.state';
import * as fromDataManagement from '../state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { EntityTypeService } from '../../../shared/services/entity-type.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';

@Component({
  selector: 'unext-analyte-data-entry',
  templateUrl: './analyte-data-entry.component.html',
  styleUrls: ['./analyte-data-entry.component.scss'],
})
export class AnalyteDataEntryComponent implements OnInit, OnDestroy {
  public instrumentSection: InstrumentSection;
  public entityType: EntityType;
  public isLoading = false;
  private cumulativeAnalyteInfo: Array<AnalyteInfo>;

  public isSummary: boolean;
  private destroy$ = new Subject<boolean>();

  private tempEntityType;

  // For using in HTML switch case
  entityTypeLabInstrument = EntityType.LabInstrument;
  entityTypeLabProduct = EntityType.LabProduct;
  entityTypeLabTest = EntityType.LabTest;

  private currentNode: TreePill;
  public isArchived: boolean;
  public isLeafArchived: boolean;
  public levelName: string;

  navigationCurrentBranch$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentBranchState));
  navigationCurrentlySelectedNode$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentlySelectedNode));
  navigationCurrentlySelectedLeaf$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentlySelectedLeaf));

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private entityTypeService: EntityTypeService,
    private router: Router,
    private portalAPIService: PortalApiService,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.navigationCurrentlySelectedNode$
      .pipe(filter(storedItem => !!storedItem), takeUntil(this.destroy$))
      .subscribe(
        storedItem => {
          try {
            // this check is added as its navigates to table as its default,
            // which overrides the deault logic and we can display tabs correctly
            this.store.pipe(select(fromNavigationSelector.getNotificationId))
              .pipe(filter(notificationId => !!notificationId), takeUntil(this.destroy$)).subscribe(notificationId => {
                const url = `/data/${storedItem.id}/${storedItem.nodeType}`;
                if (notificationId) {
                  //  this.router.navigate commented out so UN-12948 can be resolved.
                  // Dynamic report UI:Not able to see the control multi data form when tried to navigate,
                  // after opening any report for preview.
                  this.router.navigate([`${url}/reports`]);
                  this.navigationService.SecondaryNavSelectedTabIndex.emit(1);
                }
              });
            this.currentNode = storedItem;
            this.isArchived = storedItem.isArchived;
          } catch (err) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
                (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.FetchCurrentNode)));
          }
        });

    this.store.pipe(ngrxStore.select(fromDataManagement.getDataManagementState))
      .pipe(
        distinctUntilChanged(
          (newObj: DataManagementState, prevObj: DataManagementState) =>
            newObj.entityId === prevObj.entityId &&
            newObj.entityName === prevObj.entityName &&
            (newObj.dataEntryMode !== prevObj.dataEntryMode || newObj.entityType !== EntityType.LabInstrument) &&
            _.isEqual(
              newObj.cumulativeAnalyteInfo,
              prevObj.cumulativeAnalyteInfo
            )
        ),
        filter((dataManagementState) => !!dataManagementState),
        map((dataManagementState) => {
          this.isLoading = true;
          this.tempEntityType = dataManagementState.entityType;
          this.cumulativeAnalyteInfo = dataManagementState.cumulativeAnalyteInfo;
          return this.currentNode;
        }),
        takeUntil(this.destroy$))
      .subscribe((node) => {
        if (node) {
          if (+this.tempEntityType === EntityType.LabInstrument) {
            const instrument = <LabInstrument>node;
            this.entityType = EntityType.LabInstrument;
            this.instrumentSection = this.createInstrumentSectionFromInstrumentId(instrument);
          } else if (+this.tempEntityType === EntityType.LabProduct) {
            const product = <LabProduct>node;
            this.entityType = EntityType.LabProduct;
            this.instrumentSection = this.createInstrumentSectionFromProductId(product);
          } else if (+this.tempEntityType === EntityType.LabTest) {
            this.instrumentSection = this.getAnalyteSection(
              this.tempEntityType
            );

          }
        }
        setTimeout(() => {
          // This is for letting change detection recognize *ngIf change for destroying component
          // TODO: Remove setTimeout once component destroy method is defined
          this.isLoading = false;
        }, 500);
      });

    combineLatest([this.navigationCurrentlySelectedNode$.pipe(filter(selectedNode => !!selectedNode), take(1),
      switchMap((selectedNode: TreePill) => iif(() => selectedNode.nodeType === EntityType.Panel,
        this.navigationCurrentlySelectedLeaf$, this.navigationCurrentBranch$)
      ),
      switchMap((_selectedLeaf: TreePill) => {
        if (Array.isArray(_selectedLeaf)) {
          return this.navigationCurrentBranch$;
        } else if (_selectedLeaf && _selectedLeaf.id) {
          return this.portalAPIService.getLabSetupAncestors<TreePill>(_selectedLeaf.nodeType, _selectedLeaf.id);
        } else {
          return of(null);
        }
      })
    ),
    this.navigationCurrentlySelectedNode$,
    this.navigationCurrentlySelectedLeaf$])
      .pipe(filter((hasData) => !!hasData), takeUntil(this.destroy$))
      .subscribe(([currentBranch, selectedNode, selectedLeaf]) => {
        if (selectedLeaf) {
          this.levelName = this.entityTypeService.getLevelName(selectedLeaf.nodeType);
          this.isLeafArchived = selectedLeaf.isArchived;
        }
        if (currentBranch) {
          if (selectedNode && selectedNode.nodeType === EntityType.Panel) {
            currentBranch.reverse();
          }
          for (let i = 0; i < currentBranch.length; i++) {
            if (currentBranch[i].isArchived) {
              this.levelName = this.entityTypeService.getLevelName(currentBranch[i].nodeType);
              this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.levelName = this.entityTypeService.getLevelName(currentBranch[i].nodeType);
              });
              break;
            }
          }
        }
      });
    this.navigationService.SecondaryNavSelectedTabIndex.emit(0);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getAnalyteSection(
    entityType: EntityType
  ): InstrumentSection {
    try {
      switch (+entityType) {
        case EntityType.LabTest:
          this.entityType = EntityType.LabTest;
          this.isSummary = this.cumulativeAnalyteInfo[0].isSummary;
          this.isArchived = this.cumulativeAnalyteInfo[0].isArchived;
          if (this.cumulativeAnalyteInfo[0].isSummary) {
            return this.createInstrumentSectionFromLabTestId(
              this.cumulativeAnalyteInfo[0]
            );
          } else {
            return null;
          }
        default:
          break;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.GetAnalyteSection)));
    }
  }

  private createInstrumentSectionFromInstrumentId(
    instrument: LabInstrument
  ): InstrumentSection {
    if (instrument) {
      const instrumentSection: InstrumentSection = {
        instrument: instrument,
        productSections: new Array<ProductSection>(),
      };
      if (instrument?.children && instrument?.children.length > 0) {
        instrument.children.forEach((product) => {
          const productSection = this.extractProductSection(product);
          instrumentSection.productSections.push(productSection);
        });
        return instrumentSection;
      }
    }
  }

  private createInstrumentSectionFromProductId(
    product: LabProduct
  ): InstrumentSection {
    try {
      const productSection = this.extractProductSection(product);

      const instrumentSection: InstrumentSection = {
        instrument: null,
        productSections: [productSection],
      };

      return instrumentSection;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.CreateInstrumentSectionFromProductId)));
    }
  }

  private createInstrumentSectionFromLabTestId(
    analyteInfo: AnalyteInfo
  ): InstrumentSection {
    try {
      const analyteSection = new AnalyteSection();
      analyteSection.analyteInfo = analyteInfo;

      const productSection: ProductSection = {
        product: null,
        analyteSections: [analyteSection]
      };

      const instrumentSection: InstrumentSection = {
        instrument: null,
        productSections: [productSection]
      };
      return instrumentSection;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.CreateInstrumentSectionFromLabTestId)));
    }
  }

  private extractProductSection(product: LabProduct): ProductSection {
    const productSection: ProductSection = {
      product: product,
      analyteSections: new Array<AnalyteSection>(),
    };
    try {
      const list = product.children as LabTest[];

      if (list && list.length > 0) {
        list.forEach((test: LabTest) => {
          const analyteSection = this.extractAnalyteSection(test);
          productSection.analyteSections.push(analyteSection);
        });
      }

      return productSection;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.ExtractProductSection)));
    }
  }

  private extractAnalyteSection(test: LabTest): AnalyteSection {
    try {
      const analyteSection: AnalyteSection = {
        analyteInfo: this.cumulativeAnalyteInfo.find(
          (c) => c.labTestId === test.id
        )
      };
      return analyteSection;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteDataEntryComponent + blankSpace + Operations.ExtractAnalyteSection)));
    }
  }
}
