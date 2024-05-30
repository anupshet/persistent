// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, Input } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, flatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';

import { first, cloneDeep } from 'lodash';

import { Department, LabDepartmentValues } from '../../../../contracts/models/lab-setup/department.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import * as fromRoot from '../../../../state/app.state';
import { LabConfigDepartmentActions } from '../actions';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailValueData } from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { TreePill } from '../../../../contracts/models/lab-setup';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
@Injectable()
export class LabconfigDepartmentEffects {
  @Input() departments: Array<Department>;
  department: Department;
  selectedNode: TreePill;
  archiveState: ArchiveState;
  constructor(
    private actions$: Actions<LabConfigDepartmentActions.LabConfigDepartmentActionsUnion>,
    private store: Store<fromRoot.State>,
    private portalApiService: PortalApiService,
    private navigationService: NavigationService,
    private appLogger: AppLoggerService,
    private spcRulesService: SpcRulesService,
    private appNavigationService: AppNavigationTrackingService
  ) { }
  currentBranch$ = this.store.pipe(select(state => {
    if (state && state.navigation) {
      return state.navigation.currentBranch;
    }
  }));

  // TODO : Change it to accept an array after the backend is ready to accept an array of departments
  saveDepartments$ = createEffect(() =>

    this.actions$.pipe(
      ofType(LabConfigDepartmentActions.saveDepartments.type),
      map(action => action.labDepartments),
      flatMap((departments: LabDepartmentValues) => {
        const response = [];
        departments.labConfigFormValues.forEach(labDepartment => {
          response.push(this.portalApiService.upsertLabSetupNode(labDepartment, labDepartment.nodeType));
        });
        let _settings: Settings;
        let labDepartments: Department[];
        return forkJoin([...response]).pipe(
          flatMap((_labDepartments: Department[]) => {
            labDepartments = _labDepartments;
            return this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal), take(1));
          }),
          flatMap((showSettings) => {
            if (showSettings) {
              this.archiveState = departments.archivedSettings.archiveState;
              _settings = cloneDeep(departments.archivedSettings);
              // using 0th index as settings is going to be called only when updating one department.
              _settings.entityId = labDepartments[0].id;
              _settings.parentEntityId = labDepartments[0].parentNodeId;
            }
            if (showSettings) {
              return forkJoin([of(labDepartments), this.spcRulesService.updateSettings(EntityType.LabDepartment, _settings)]);
            } else {
              return forkJoin([of(labDepartments)]);
            }
          }),
          map((_response: Array<Array<Department> | Settings>) => {
            const _labDepartments: Department[] = _response.length > 0 ? _response[0] as Department[] : [];
            if (_labDepartments) {
              _labDepartments.map((value, j) => {
                _labDepartments[j].typeOfOperation = departments.typeOfOperation;
              });
            }
            return LabConfigDepartmentActions.saveDepartmentsSuccess({ labDepartments: _labDepartments });
          }),
          catchError((error) => {
            let departmentManagerName: string;
            const currentData = this.appNavigationService.fetchData();
            this.store.pipe(select(fromSecuritySelector.getSecurityState)).subscribe(data => {
              data.directory.children.forEach(accountChild => {
                if (accountChild.contactId === departments.labConfigFormValues[0].departmentManagerId) {
                  departmentManagerName = accountChild.displayName;
                }
              });
            });

            currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
            currentData.auditTrail.action = AuditTrackingAction.Add,
            currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Failure,
            currentData.auditTrail.currentValue.departmentName = [departments.labConfigFormValues[0].departmentName];
            currentData.auditTrail.currentValue.departmentManagerName = [departmentManagerName];
            this.appNavigationService.logAuditTracking(currentData, true);
            return of(LabConfigDepartmentActions.saveDepartmentsFailure({ error }));
          })
        );
      })
    )
  );
  audiTrailCurrentPriorDpartment(labDepartments): AuditTrailValueData {

    const departmentData: Department = this.appNavigationService.departmentData[0];
    const current = {
      departmentName: [labDepartments[0].departmentName],
      departmentManagerName: [labDepartments[0].departmentManager.name]
    }
    const prior = {
      departmentName: [departmentData.departmentName],
      departmentManagerName: [departmentData.departmentManager.name]
    }
    return { current, prior };
  }

  UpdateDeparmentAuditTrail(labDepartments) {
    const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorDpartment(labDepartments);
    if (labDepartments) {
      const currentData = this.appNavigationService.fetchData();
      const auditTrailPayload = this.appNavigationService.compareData(AnalyteSettingsValue);
      auditTrailPayload.auditTrail.eventType = AuditTrackingEvent.LabSetup,
        this.archiveState === ArchiveState.Archived ? auditTrailPayload.auditTrail.action = AuditTrackingAction.Archive :
        (this.archiveState === ArchiveState.NotArchived ? auditTrailPayload.auditTrail.action = AuditTrackingAction.Unarchive :
           auditTrailPayload.auditTrail.action = AuditTrackingAction.Update),
        auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Success,
        auditTrailPayload.auditTrail.nodeType = currentData.auditTrail.nodeType,
        this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
  }

  AudiTrailAddDepartment(labDepartments) {
    const departmentName = [];
    const departmentManagerName = [];
    const currentData = this.appNavigationService.fetchData();
    labDepartments.map((value, j) => {
      departmentName.push(labDepartments[j].departmentName);
      departmentManagerName.push(labDepartments[j].departmentManager.name);
    })

    currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
      currentData.auditTrail.action = AuditTrackingAction.Add,
      currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success,
      currentData.auditTrail.currentValue.departmentName = departmentName;
    currentData.auditTrail.currentValue.departmentManagerName = departmentManagerName;
    this.appNavigationService.logAuditTracking(currentData, true);
  }

  saveDepartmentsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LabConfigDepartmentActions.saveDepartmentsSuccess.type),
    map(action => action.labDepartments),
    withLatestFrom(
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf)),
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode))
    ),
    map(([labDepartments, currentlySelectedLeaf, currentlySelectedNode]) => {
      if (labDepartments) {
        const selectedNode = currentlySelectedLeaf ?
          currentlySelectedLeaf : currentlySelectedNode;
        this.store.dispatch(NavBarActions.setNodeItems({ nodeType: selectedNode.nodeType, id: selectedNode.id }));
        this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: first(labDepartments) }));
      }
      if (labDepartments[0].typeOfOperation) {
        this.AudiTrailAddDepartment(labDepartments);
      } else {
        this.UpdateDeparmentAuditTrail(labDepartments);
      }
    })
  ),
    { dispatch: false }
  );

  saveDepartmentsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDepartmentActions.saveDepartmentsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      }),
    ),
    { dispatch: false }
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDepartmentActions.deleteDepartment.type),
      map(action => action.department),
      flatMap((labDepartment: Department) => {
        return this.portalApiService.deleteLabSetupNode(labDepartment.nodeType, labDepartment.id).pipe(
          map((_labDepartment: boolean) => {
            return LabConfigDepartmentActions.deleteDepartmentSuccess({ department: labDepartment });
          }),
          catchError((error) => {
            return of(LabConfigDepartmentActions.deleteDepartmentFailure({ error }));
          })
        );
      })
    )
  );

  //-----delete functionality------
  deleteDepartment(department) {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingEvent.LabSetup,
        action: AuditTrackingAction.Delete,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          departmentName: department.departmentName,
          departmentManagerName: department.departmentManager.name,
        }
      },
    };
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  deleteDepartmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigDepartmentActions.deleteDepartmentSuccess.type),
      map(action => action.department),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode))),
      tap(([department, currentlySelectedNode]) => {
        this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
        this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
        // Ignore panels and only consider departments
        const departments = currentlySelectedNode.children.filter(child => child.nodeType === EntityType.LabDepartment);
        if (departments.length === 1) {
          this.navigationService.setSelectedNodeById(currentlySelectedNode.nodeType, currentlySelectedNode.id, () => {
            const url = `${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${department.parentNodeId}/${unRouting.labSetup.settings}`;
            this.navigationService.navigateToUrl(url, false, currentlySelectedNode, department.parentNodeId);
          });
        } else if (departments.length > 1) {
          // PBI:216128: Stay on the department page with settings true.
          this.navigationService.setSelectedNodeById(currentlySelectedNode.nodeType, currentlySelectedNode.id, () => {
            const url = `${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${department.parentNodeId}/${unRouting.labSetup.settings}`;
            this.navigationService.navigateToUrl(url, true, null, department.parentNodeId);
          });
        } else {
          this.navigationService.gotoDashboard();
        }
        this.deleteDepartment(department)
      })
    ),
    { dispatch: false }
  );

  deleteDepartmentFailure$ = createEffect(() => this.actions$.pipe(
    ofType(LabConfigDepartmentActions.deleteDepartmentFailure.type),
    tap((x) => {
      this.appLogger.error(x);
    })
  ),
    { dispatch: false }
  );
}
