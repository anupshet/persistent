// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { HeaderType } from '../../../contracts/enums/lab-setup/header-type.enum';
import { icons } from '../../../core/config/constants/icon.const';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { IconService } from '../../../shared/icons/icons.service';
import { Operations, componentInfo } from '../../../core/config/constants/error-logging.const';
import { blankSpace, controlNamePlaceholder } from '../../../core/config/constants/general.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { CustomControl } from '../../../contracts/models/control-management/custom-control.model';
import { CustomControlRequest, CustomControlDeleteRequest } from '../../../contracts/models/control-management/custom-control-request.model';
import * as fromRoot from '../state';
import { ControlManagementViewMode } from '../shared/models/control-management.enum';
import * as fromAccountSelector from '../../../shared/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { CodelistApiService } from '../../../../app/shared/api/codelistApi.service';
import { PortalApiService } from '../../../../app/shared/api/portalApi.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { ConfirmNbrControlDeleteComponent } from '../../../shared/components/confirm-dialog-nbr-delete/confirm-dialog-nbr-delete.component';
import { Permissions } from '../../../security/model/permissions.model';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { Utility } from '../../../core/helpers/utility';
import { NavBarActions } from '../../../shared/navigation/state/actions';
import { LabProduct, TreePill } from '../../../contracts/models/lab-setup';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../shared/models/audit-tracking.model';
import { EntityType } from '../../../contracts/enums/entity-type.enum';

@Component({
  selector: 'unext-define-custom-controls',
  templateUrl: './define-custom-controls.component.html',
  styleUrls: ['./define-custom-controls.component.scss']
})

export class DefineCustomControls implements OnInit {
  public type = HeaderType;
  public showForm = false;
  public viewType: ControlManagementViewMode;
  public controlCards: CustomControl[];
  public controlToEdit: CustomControl;
  public currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));
  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public currentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  protected destroy$ = new Subject<boolean>();

  accountId: string;
  viewNum = ControlManagementViewMode;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircle[24],
  ];
  showDialog = false;
  permissions = Permissions;
  labsetuptitle: string;
  defineButtonText: string;
  nodeType: number;
  parentNodeId: string;
  instrumentsGroupedByDept: boolean;
  currentId: string;

  constructor(
    private iconService: IconService,
    private codeListService: CodelistApiService,
    private labSetupService: PortalApiService,
    private dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private store: Store<fromRoot.CustomControlManagementStates>,
    private portalApiService: PortalApiService,
    private translate: TranslateService,
    private navigationService: NavigationService,
    private appNavigationService: AppNavigationTrackingService   ) {
    {
      try {
        this.iconService.addIcons(this.iconsUsed);
      } catch (err) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
            (componentInfo.DefineCustomControlsComponent + blankSpace + Operations.AddIcons)));
      }
    }
  }

  ngOnInit() {
    this.loadNonBrControls();
    this.viewType = this.viewNum.Edit;
    this.populateLabels();
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.populateLabels();
    });
  }

  populateLabels() {
    this.labsetuptitle = this.getTranslation('DEFINECUSTOMCONTROL.LABSETUPTITLE');
    this.defineButtonText = this.getTranslation('DEFINECUSTOMCONTROL.DEFINEBUTTONTEXT');
  }

  loadNonBrControls() {
    this.currentAccount$.pipe(take(1)).subscribe((res: any) => {
      this.accountId = res?.currentAccountSummary?.id;
      if (!this.accountId) {
        this.navigationCurrentlySelectedNode$.pipe(take(1)).subscribe((res: any) => {
          this.accountId = res?.locationSettings?.parentNodeId;
        });
      }
      this.codeListService?.getNonBrControlDefinitions(this.accountId, true).pipe(take(1)).subscribe((data) => {
        this.controlCards = data;
      }, error => {
        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, this.getLoadErrorMessage(),
              componentInfo.DefineCustomControlsComponent + blankSpace + Operations.GetCustomControls));
        }
          this.messageSnackBar.showMessageSnackBar(this.getLoadErrorMessage());
      });
    });
  }

  getControlToEdit(control) {
    this.viewType = this.viewNum.Edit;
    this.controlToEdit = control;
  }

  deleteControl(control: CustomControl) {
    const dialogRef = this.dialog.open(ConfirmNbrControlDeleteComponent, {
      disableClose: true ,
      width: 'fit-content',
      data: { displayName: control.name, warningMessage: this.getDeleteWarningMessage() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: CustomControlDeleteRequest = { accountId: this.accountId, id: control.id, name: control.name };
        const data = { control: request };
        const nonBrControlPayload = this.appNavigationService.includeATDataToPayload(data, AuditTrackingAction.Delete,
          AuditTrackingActionStatus.Pending, AuditTrackingEvent.NBRControl);
        this.labSetupService?.deleteNonBrControlDefinition(nonBrControlPayload, true).pipe(take(1)).subscribe(isSuccess => {
          if (isSuccess) {
            this.navigationCurrentlySelectedNode$.pipe(take(1)).subscribe((currentlySelectedNode: LabProduct) => {
              if (currentlySelectedNode) {
                this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
                this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
                if (currentlySelectedNode && currentlySelectedNode.children === null) {
                  this.currentLabLocation$.pipe(take(1)).subscribe((location) => {
                    this.navigationService.setSelectedNodeById(Utility.getParentNodeType(currentlySelectedNode.nodeType,
                      location.locationSettings?.instrumentsGroupedByDept), currentlySelectedNode.parentNodeId, () => {
                        this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': currentlySelectedNode }));
                        this.store.dispatch(NavBarActions.setNodeItems({
                          nodeType: EntityType.LabInstrument, id: currentlySelectedNode.parentNodeId, isManageControl: true
                        }));
                        this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
                          nodeType: EntityType.LabInstrument,
                          id: currentlySelectedNode.parentNodeId,
                          isManageControl: true
                        }));
                      });
                    });
                } else {
                  this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
                    nodeType: EntityType.LabInstrument,
                    id: currentlySelectedNode.parentNodeId,
                    isManageControl:true
                  }));
                }
              }
            });
            this.controlCards = this.controlCards.filter(c => c.id !== control.id);
          } else {
            this.messageSnackBar.showMessageSnackBar(this.getDeleteErrorMessage(control));
          }
        }, error => {
          if (error.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, this.getDeleteErrorMessage(control),
                componentInfo.DefineCustomControlsComponent + blankSpace + Operations.DeleteCustomControl));
          }
          this.messageSnackBar.showMessageSnackBar(this.getDeleteErrorMessage(control));
        });
      }
    });
  }

  showDefineControlForm() {
    this.showForm = true;
    this.viewType = this.viewNum.Define;
  }

  closeDefineControlsTab() {
    this.showForm = false;
    this.viewType = this.viewNum.Edit;
  }

  addNonBRControlDefinition(product: CustomControlRequest[]) {
    try {
      const productPayload = this.appNavigationService.includeATDataToPayload(product, AuditTrackingAction.Add,
      AuditTrackingActionStatus.Pending, AuditTrackingEvent.NBRControl);

      this.portalApiService.postNonBrControlDefinitionsWithLabSetup(productPayload).pipe(take(1)).subscribe((isSuccess) => {
        if (isSuccess) {
          this.loadNonBrControls();
        }
        this.showForm = false;
      });
    } catch (err) {
      if (err.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, this.getAddErrorMessage(),
            (componentInfo.DefineCustomControlsComponent + blankSpace + Operations.AddCustomControl)));
        }
        this.messageSnackBar.showMessageSnackBar(this.getAddErrorMessage());
    }
  }

  editCustomControl(customControl) {
    this.codeListService?.putNonBrControlDefinition(customControl).pipe(take(1)).subscribe(response => {
      if (response) {
        this.currentLabLocation$.pipe(take(1)).subscribe((location) => {
          this.navigationService.setSelectedNodeById(Utility.getParentNodeType(this.nodeType,location?.locationSettings?.instrumentsGroupedByDept),
          this.parentNodeId, () => {
            this.store.dispatch(NavBarActions.setNodeItems({ nodeType: this.nodeType, id: this.currentId, isManageControl: true }));
            this.loadNonBrControls();
          });
        });
      } else {
        this.messageSnackBar.showMessageSnackBar(this.getUpdateErrorMessage(customControl));
      }
    }, error => {
      if (error.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, this.getUpdateErrorMessage(customControl),
            componentInfo.DefineCustomControlsComponent + blankSpace + Operations.UpdateCustomControl));
      }
      this.messageSnackBar.showMessageSnackBar(this.getUpdateErrorMessage(customControl));
    });
  }

  currentSelectedNode(selectedNode: TreePill) {
    this.nodeType = selectedNode.nodeType;
    this.parentNodeId = selectedNode.parentNodeId;
    this.currentId = selectedNode.id;
  }

  private getDeleteWarningMessage(): string {
    return this.getTranslation('DEFINECUSTOMCONTROL.DELETEWARNING');
  }

  private getDeleteErrorMessage(control: CustomControl): string {
    return this.getTranslation('DEFINECUSTOMCONTROL.DELETEERROR')?.replace(controlNamePlaceholder, control.name);
  }
  private getLoadErrorMessage(): string {
    return this.getTranslation('DEFINECUSTOMCONTROL.LOADERROR');
  }
  private getUpdateErrorMessage(control: CustomControl): string {
    return this.getTranslation('DEFINECUSTOMCONTROL.UPDATEERROR')?.replace(controlNamePlaceholder, control.name);
  }

  private getAddErrorMessage(): string {
    return this.getTranslation('DEFINECUSTOMCONTROL.ADDERROR');
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }
}
