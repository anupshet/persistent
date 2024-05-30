// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { isEqual, uniq } from 'lodash';

import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import * as fromRoot from '../../../lab-setup/state';
import * as fromSecurity from '../../../../security/state/selectors';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromDataManagement from '../../../data-management/state/selectors';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { InProgressMessageTranslationService } from '../../../../shared/services/inprogress-message-translation.service';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { DataManagementState } from '../../../data-management/state/reducers/data-management.reducer';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { AnalyteInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { AnalyteSection, InstrumentSection, PanelSection, ProductSection } from '../../../../contracts/models/data-management/page-section/instrument-section.model';
import { LabProduct, LabTest } from '../../../../contracts/models/lab-setup';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';

@Component({
  selector: 'unext-panel-view',
  templateUrl: './panel-view.component.html',
  styleUrls: ['./panel-view.component.scss']
})
export class PanelViewComponent implements OnInit, OnDestroy {
  public icons = icons;
  public iconsUsed: Array<Icon> = [
    icons.edit[24]
  ];
  public selectedNode: TreePill;
  public inProgress = true;
  public progressHeader: string;
  private destroy$ = new Subject<boolean>();
  public entityType: EntityType;
  private currentNode: TreePill;
  public isArchived: boolean;
  public levelName: string;
  public instrumentSection: InstrumentSection;
  public isSummary: boolean;

  public getCurrentUser$ = this.store.pipe(select(fromSecurity.getCurrentUser));
  public getCurrentSelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentSelectedNode));
  private cumulativeAnalyteInfo: Array<AnalyteInfo>;

  constructor(
    private portalApiService: PortalApiService,
    private iconService: IconService,
    private dataManagementService: DataManagementService,
    private store: Store<fromRoot.LabSetupStates>,
    private inProgressMsgService: InProgressMessageTranslationService,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  async ngOnInit(): Promise<void> {
    this.getCurrentSelectedNode$.pipe(filter((_selectedNode) => !!_selectedNode), takeUntil(this.destroy$))
      .subscribe(async (selectedNode: TreePill) => {
        this.selectedNode = selectedNode;
        if (this.selectedNode.isUnavailable) {
          this.progressHeader = this.inProgressMsgService.setProgressMessage(this.selectedNode.unavailableReasonCode).progressHeader;
        } else {
          this.inProgress = false;
          this.currentNode = selectedNode;
          this.isArchived = selectedNode.isArchived;
        }
        await this.dataManagementService.updateEntityInfoAsync(selectedNode.id, selectedNode.nodeType, selectedNode);
        this.store.pipe(select(fromDataManagement.getDataManagementState))
          .pipe(
            distinctUntilChanged(
              (newObj: DataManagementState, prevObj: DataManagementState) =>
                newObj.entityId === prevObj.entityId &&
                newObj.entityName === prevObj.entityName &&
                isEqual(
                  newObj.cumulativeAnalyteInfo,
                  prevObj.cumulativeAnalyteInfo
                )
            ),
            filter((dataManagementState) => !!dataManagementState),
            map((dataManagementState) => {
              this.inProgress = true;
              this.cumulativeAnalyteInfo = dataManagementState.cumulativeAnalyteInfo;
              return this.currentNode;
            }))
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (node: TreePill) => {
            if (node && node.nodeType === EntityType.Panel) {
              const panel = node;
              this.entityType = EntityType.Panel;
              this.instrumentSection = await this.createInstrumentSectionFromPanelId(panel);
            }
            setTimeout(() => {
              // This is for letting change detection recognize *ngIf change for destroying component
              // TODO: Remove setTimeout once component destroy method is defined
              this.inProgress = false;
            }, 500);
          });
      });
  }

  private createInstrumentSectionFromPanelId(panel: TreePill): Promise<InstrumentSection> {
    return new Promise(resolve => {
      try {
        // pluck uniq analyte ids
        let analyteIds = panel.children.map(child => child.id);
        analyteIds = uniq(analyteIds);
        this.portalApiService.getLabSetupAncestorsMultiple(EntityType.LabTest, analyteIds)
          .pipe(takeUntil(this.destroy$)).subscribe((ancestors: TreePill[][]) => {
            // get controls seperated our from ancestors
            const controls = [];
            for (const innerAncestors of ancestors) {
              if (!controls.some(control => control.id === innerAncestors[1].id)) {
                controls.push(innerAncestors[1]);
              }
            }
            const panelSection: PanelSection = { panel: panel };
            const productSections = this.extractProductSection(controls, <LabTest[]>panel.children);
            const instrumentSection: InstrumentSection = {
              instrument: null,
              productSections: productSections,
              panelSections: [panelSection]
            };

            resolve(instrumentSection);
          });
      } catch (err) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.PanelViewComponent + blankSpace + Operations.CreateInstrumentSectionFromPanelId)));
        resolve(null);
      }
    });
  }

  private extractProductSection(products: LabProduct[], analytes: LabTest[]): ProductSection[] {
    try {
      const productSections: ProductSection[] = [];
      for (const test of analytes) {
        const indexOfControl = products.findIndex((product) => product.id === test.parentNodeId);
        const productSection: ProductSection = {
          product: products[indexOfControl],
          analyteSections: new Array<AnalyteSection>(),
        };
        const analyteSection = this.extractAnalyteSection(test);
        productSection.analyteSections.push(analyteSection);
        productSections.push(productSection);
      }
      return productSections;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.PanelViewComponent + blankSpace + Operations.ExtractProductSection)));
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
          (componentInfo.PanelViewComponent + blankSpace + Operations.ExtractAnalyteSection)));
    }
  }

  navigateToEdit(id: string) {
    try {
      const url = '/' + unRouting.panels.panel + '/' + unRouting.panels.actions.edit.replace(':id', id);
      this.navigationService.routeTo(url);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.PanelViewComponent + blankSpace + Operations.GoToEditPanel)));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
