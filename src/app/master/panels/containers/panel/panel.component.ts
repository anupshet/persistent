// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, take, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual, orderBy } from 'lodash';

import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { LabProduct, LabTest, TreePill } from '../../../../contracts/models/lab-setup';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { asc, blankSpace, includeArchivedItems } from '../../../../core/config/constants/general.const';
import * as fromSubRoot from '../../index';
import * as actions from '../../state/actions';
import { Panel, DeletePanelConfig } from '../../../../contracts/models/panel/panel.model';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { BrDialogComponent, DialogResult } from 'br-component-library';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { PanelsApiService } from '../../services/panelsApi.service';
import { AuditTrackingSort } from '../../../../shared/models/audit-tracking.model';


const changeState = {
  hasChanges: false,
  okCustomAction: null,
  customPromptAction: null,
  cancelCustomAction: null,
  currentDialogRef: null
};

@Component({
  selector: 'unext-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})

export class PanelComponent implements OnInit, OnDestroy {
  protected id: string;
  public selectedItems: Array<LabTest> = [];
  public selectedPanel: TreePill;
  protected destroy$ = new Subject<boolean>();
  public showDeletePanel = false;
  private labLocation: TreePill;
  private isPanelName: string;
  public duplicateFound = false;
  private isFormSubmitting = false;
  public isDragging = false;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.delete[24]
  ];
  public itemsSortedAlphabetical = true;
  private dialogRef: MatDialogRef<BrDialogComponent, any> = null;
  private panelPriorValues: TreePill;
  permissions = Permissions;

  panelName = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator, Validators.minLength(2), Validators.maxLength(50)],
    updateOn: 'change'
  });

  navigationCurrentBranchState$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  isArchiveToggle$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  public queryParameter: QueryParameter;
  private occurredSort = AuditTrackingSort.None;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromSubRoot.PanelStates>,
    private portalAPIService: PortalApiService,
    public dialog: MatDialog,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private changeTrackerService: ChangeTrackerService,
    private navigationService: NavigationService,
    private dateTimeHelper: DateTimeHelper,
    private panelsApiService: PanelsApiService,
    private brPermissionsService: BrPermissionsService,
    public translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.isArchiveToggle$.pipe(distinctUntilChanged()).subscribe(isArchiveToggle => {
      this.queryParameter = new QueryParameter(includeArchivedItems, (isArchiveToggle).toString());
      this.route.paramMap.pipe(
        flatMap(paramMap => {
          this.id = paramMap.get('id');
          if (this.id) {
            return this.portalAPIService.getLabSetupNode<LabTest>(EntityType.Panel, this.id, LevelLoadRequest.LoadChildren,
              EntityType.None, [this.queryParameter]);
          } else {
            return of(null);
          }
        }),
        filter(hasData => !!hasData), take(1)).subscribe((node) => {
          this.showDeletePanel = true;
          this.selectedPanel = node;
          this.panelPriorValues = node;
          this.panelName.setValue(this.selectedPanel.displayName);
          this.selectedItems = <Array<LabTest>>this.selectedPanel.children;
          let ids = this.selectedPanel.children.map((selectedItem: LabTest) => selectedItem.id);
          if (ids.length) {
            this.portalAPIService.getLabSetupAncestorsMultiple(EntityType.LabTest, ids)
              .pipe(takeUntil(this.destroy$)).subscribe((arrayOfAncestors: Array<Array<TreePill>>) => {
                const tempArray = [];
                for (const ancestors of arrayOfAncestors) {
                  const analyte: LabTest = ancestors[0] as LabTest;
                  const product: LabProduct = ancestors[1] as LabProduct;
                  tempArray[analyte.id] = this.dateTimeHelper.isExpired(product?.lotInfo?.expirationDate);
                }
                this.selectedItems = this.selectedItems.map((selectedItem: LabTest) => {
                  selectedItem.isLotExpired = tempArray[selectedItem.id];
                  return selectedItem;
                });
              });
          }
          this.itemsSortedAlphabetical = this.isSortedAlphabetically(this.selectedItems);
          this.isPanelName = this.selectedPanel.displayName;
        });
    });

    this.navigationCurrentBranchState$.pipe(filter((currentBranch: TreePill[]) => !!currentBranch), takeUntil(this.destroy$))
      .subscribe((currentBranch) => {
        this.labLocation = currentBranch.filter(ele => ele.nodeType === EntityType.LabLocation)[0];
      });
    this.setupChangeTracker();

    if (!this.hasPermissionToAccess([this.permissions.PanelsAdd, this.permissions.PanelsEdit, this.permissions.PanelsDelete])) {
      this.panelName.disable();
    }
  }

  resetForm() {
    try {
      this.changeTrackerService.resetDirty();
      const initialName = this.id ? this.selectedPanel.displayName : '';
      this.panelName.setValue(initialName);
      this.selectedItems = this.id ? <Array<LabTest>>this.selectedPanel.children : [];
      this.panelName.markAsPristine();
      this.itemsSortedAlphabetical = this.isSortedAlphabetically(this.selectedItems);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.PanelComponent + blankSpace + Operations.ResetForm)));
    }
  }

  valuechange(newValueEvent) {
    try {
      this.duplicateFound = false;
      const newValue = newValueEvent.target.value;
      if (this.labLocation && this.labLocation.children) {
        this.duplicateFound =
          this.labLocation.children.filter(panelNode => panelNode.nodeType === EntityType.Panel)
            .find(item => item.displayName.toLowerCase().trim() === newValue.toLowerCase().trim())
            ? true : false;
        if (this.duplicateFound) {
          this.panelName.setErrors({ duplicateFound: true });
        } else {
          this.panelName.setErrors({ duplicateFound: null });
          this.panelName.updateValueAndValidity();
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.PanelComponent + blankSpace + Operations.ValueChange)));
    }
  }

  getErrorMessage() {
    return this.panelName.hasError('required')
      ? this.getTranslations('PANELCOMPONENT.PANELNAME')
      : this.panelName.hasError('minlength')
        ? this.getTranslations('PANELCOMPONENT.TWOCHARACTERS')
        : this.panelName.hasError('maxlength')
          ? this.getTranslations('PANELCOMPONENT.CANNOTEXCEED')
          : this.panelName.hasError('duplicateFound')
            ? this.getTranslations('PANELCOMPONENT.PANELNAMEXISTS')
            : '';
  }
  public enableSubmit(): boolean {
    if (this.isFormSubmitting) {
      return !this.isFormSubmitting;
    } else if (!this.duplicateFound) {
      let enableButton = false;
      enableButton = (this.panelName.valid && !this.panelName.pristine && this.selectedItems.length >= 1)
        || (this.selectedPanel && this.selectedItems.length > 0 && !isEqual(this.selectedPanel.children, this.selectedItems));
      enableButton ? this.changeTrackerService.setDirty() : this.changeTrackerService.resetDirty();
      return enableButton;
    } else {
      return false;
    }
  }

  // Bug fix 193103 AJT 8 18 2021
  // Added separate logic for Save button and cancel button
  // Save button checks for valid name minimum length, which Cancel button does not need to enforce
  // statement below && !this.showDeletePanel is just an easy way to test if the panel is in EDIT or ADD mode
  // since we already have the value and need it to display the panel delete image, I didnt see the need to pull another value from the router
  public enableCancel(): boolean {
    if (this.isFormSubmitting) {
      return !this.isFormSubmitting;
    } else if (!this.duplicateFound) {
      let enableButton = false;
      enableButton = (!this.panelName.pristine || (this.selectedItems.length >= 1 && !this.showDeletePanel))
        || (this.selectedPanel && this.selectedItems.length > 0 && !isEqual(this.selectedPanel.children, this.selectedItems));
      enableButton ? this.changeTrackerService.setDirty() : this.changeTrackerService.resetDirty();
      return enableButton;
    } else {
      return false;
    }
  }

  selectedItemsEvent(Items: Array<LabTest>) {
    this.selectedItems = Items;
    this.itemsSortedAlphabetical = this.isSortedAlphabetically(this.selectedItems);
  }

  sortedItemsEvent(Items: Array<LabTest>) {
    this.selectedItems = Items;
    this.itemsSortedAlphabetical = this.isSortedAlphabetically(this.selectedItems);
    this.occurredSort = AuditTrackingSort.Custom;
  }

  onSubmit() {
    try {
      this.isFormSubmitting = true;
      // Single panel Item creation for this release
      let panelItems = new Panel();
      panelItems.id = this.id;
      panelItems.name = this.panelName.value;
      panelItems.parentNodeId = this.id ? this.selectedPanel.parentNodeId : this.labLocation.id;
      panelItems.panelItemIds = this.selectedItems.map((item) => item.id);
      if (this.id) {
        const panelPriorValue = this.createPanelObject(this.panelPriorValues);
        panelItems = { ...panelItems, panelPriorItems: panelPriorValue };
        this.store.dispatch(actions.PanelActions.updatePanel({ panels: [panelItems], sort: this.occurredSort }));
      } else {
        this.store.dispatch(actions.PanelActions.addPanel({ panels: [panelItems], sort: this.occurredSort }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.PanelComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  deletePanel() {
    try {
      this.openConfirmLinkDialog(this.selectedPanel);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.PanelComponent + blankSpace + Operations.DeletePanel)));
    }
  }

  public sortAlphabetically(selectedItems: Array<LabTest>): void {
    this.selectedItems = orderBy(selectedItems, [(selectedItem: LabTest) => selectedItem.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc]);
    this.itemsSortedAlphabetical = true;
    this.occurredSort = AuditTrackingSort.Alphabetical;
  }

  public isSortedAlphabetically(selectedItems: Array<LabTest>): boolean {
    let isSorted = true;
    const sortedItems = orderBy(selectedItems, [(selectedItem: LabTest) => selectedItem.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc]);
    for (let index = 0; index < sortedItems.length; index++) {
      if (sortedItems[index].id !== selectedItems[index].id) {
        isSorted = false;
      }
    }
    return isSorted;
  }

  private openConfirmLinkDialog(selectedNode): void { 
    const displayName = selectedNode.displayName;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { displayName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetForm();
        let deletePanelConfig = {
          panelId: selectedNode.id,
          locationId: selectedNode.parentNodeId,
          nodeType: selectedNode.nodeType,
        } as DeletePanelConfig;
        const panelPriorValue = this.createPanelObject(selectedNode);
        deletePanelConfig = { ...deletePanelConfig, panelPriorValue: panelPriorValue };
        this.store.dispatch(actions.PanelActions.deletePanel({ deletePanelConfig }));
      }
    });
  }

  private setupChangeTracker(): void {
    const me = this;
    this.changeTrackerService.setOkAction(async function () {
      if (me.enableSubmit()) {
        me.onSubmit();
        me.changeTrackerService.dialog.closeAll();
        me.changeTrackerService.canDeactivateSubject.next(true);
        me.changeTrackerService.resetDirty();
      } else {
        me.changeTrackerService.setDirty();
        me.changeTrackerService.dialog.closeAll();
        me.changeTrackerService.canDeactivateSubject.next(false);
      }
    });
  }

  draggingEvent(boolean) {
    this.isDragging = boolean;
  }

  togglePanelClose(): void {
    // if no changes close and navigate back to previous screen (Panels MDE)
    // if changes show dialog box
    // if user exit without saving back to panels MDE or dashboard
    // if user save and exit save back to panels MDE or dashboard

    let panelChanges = false;
    panelChanges = (!this.panelName.pristine || (this.selectedItems.length >= 1 && !this.showDeletePanel))
      || (this.selectedPanel && this.selectedItems.length > 0 && !isEqual(this.selectedPanel.children, this.selectedItems));

    if (!panelChanges) {
      if (this.selectedPanel === null || this.selectedPanel === undefined) {
        this.navigationService.navigateToDashboard(this.labLocation.id, false);
      } else {
        this.navigationService.navigateToPanel(this.selectedPanel);
      }
    } else {
      this.openDialogConfirmationPanels();
    }
  }
  // Added custom navigation different than default behavior AJT Bug Fix 219482
  openDialogConfirmationPanels() {
    if (this.dialogRef != null) {
      return;
    }
    const translatedTitle = this.getTranslations('PANELCOMPONENT.UNSAVEDDATA')
      || 'You have unsaved data';
    const translatedSubTitle = this.getTranslations('PANELCOMPONENT.NAVIGATE')
      || 'If you navigate away from this page, your data will not be saved.';
    const translatedCancelButton = this.getTranslations('PANELCOMPONENT.DONTSAVEDATA')
      || 'Dont save data';
    const translatedConfirmButton = this.getTranslations('PANELCOMPONENT.LEAVEPAGE')
      || 'Save data and leave page';

    this.dialogRef = this.dialog.open(BrDialogComponent, {
      data: {
        title: translatedTitle,
        subTitle: translatedSubTitle,
        cancelButton: translatedCancelButton,
        confirmButton: translatedConfirmButton
      }
    });

    const buttonClick = this.dialogRef.componentInstance.buttonClicked.subscribe(
      async dialogResult => {
        // Action if Cancel or Do not Save Data is clicked
        if (dialogResult === DialogResult.Cancel) {
          this.dialogRef.close();
          this.changeTrackerService.resetDirty();
          if (this.selectedPanel === null || this.selectedPanel === undefined) {
            this.navigationService.navigateToDashboard(this.labLocation.id, false);
          } else {
            this.navigationService.navigateToPanel(this.selectedPanel);
          }
        } else if (dialogResult === DialogResult.OK) {
          // Action if Submit and Leave is clicked
          this.dialogRef.close();
          this.changeTrackerService.resetDirty();
          this.onSubmit();
        }
      },
      error => { }
    );

    this.dialogRef.afterClosed().subscribe(() => {
      buttonClick.unsubscribe();
      this.dialogRef = undefined;
    });
  }

  /**
   * Creates a new panel object from existing panel
   * @param selectedNode Selected panel values
   * @returns A panel object
   */
   private createPanelObject(selectedNode: TreePill): Panel {
    const panelItem = new Panel();
    panelItem.name = selectedNode['displayName'];
    panelItem.id = selectedNode.id;
    panelItem.parentNodeId = selectedNode.parentNodeId;
    panelItem.panelItemIds = selectedNode['children'].map(item => {
      return item['id'];
    });
    return panelItem;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
