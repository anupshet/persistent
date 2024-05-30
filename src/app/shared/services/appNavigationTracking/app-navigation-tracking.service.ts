// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { filter, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { isEqual } from 'lodash';

import { AppUser } from './../../../security/model/app-user.model';
import {
  AnalyteLevelData,
  AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus,
  AuditTrackingEvent,
  AuditTrail,
  AuditTrailPriorCurrentValues, AuditTrailValueData, FAILED_LOGIN_AUDIT_TRAIL_PAYLOAD,
  getChangeLocationPayload, Hierarchy, ReviewSummaryHistory
} from './../../models/audit-tracking.model';
import * as fromSecurity from '../../../security/state/selectors';
import { LoggingApiService } from '../../api/logging-api.service';
import * as fromRoot from '../../../state/app.state';
import * as sharedStateSelector from '../../../shared/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { LabLocation } from './../../../contracts/models/lab-setup/lab-location.model';
import { Settings } from '../../../contracts/models/lab-setup/settings.model';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { Department, LabProduct, LabTest } from '../../../contracts/models/lab-setup';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { SpcRulesComponent } from '../../../master/lab-setup/components/spc-rules/spc-rules.component';
import { PayLoadWithAuditData } from '../../../contracts/models/shared/duplicate-control-request.model';

@Injectable({ providedIn: 'root' })
export class AppNavigationTrackingService {
  public subject = new BehaviorSubject<boolean>(false);
  public addLink = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<boolean>();

  public getLocationState$ = this.store.pipe(select(sharedStateSelector.getLocationState));
  public navigationState$ = this.store.pipe(select(fromNavigationSelector.getNavigationState));
  public currentBranch$ = this.store.pipe(select(state => state?.navigation?.currentBranch));
  public selectedLeaf$ = this.store.pipe(select(state => state?.navigation?.selectedLeaf));

  public getCurrentUserState$ = this.store.pipe(select(fromSecurity.getCurrentUser));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  public selectedNode: TreePill;
  public nodeList: TreePill[] = [];

  // TODO: SpcRulesComponent and FormGroup here are the best, good job!
  public spcRuleComponent: SpcRulesComponent;
  public data: string;

  public controlsForm: FormGroup;
  public analyteForm: FormGroup;
  public controlData: LabProduct;
  public controlId: string;
  public controlName: string;

  public archivedGetter: boolean;

  public departmentId: string;
  public departmentName: string;
  public departmentData: Array<Department>;

  public instrumentId: string;
  public instrumentName: string;
  public instrumentData = false;

  public analyteId: string;
  public analyteName: string;
  public currentSelected: LabTest;
  public analytesArray: Array<LabTest> = [];

  public settings: Settings;
  public decimalPlaces: string | number;

  public currentUserData: AppUser;
  public currentUserLocationData: LabLocation;
  public isUserDataFetched = true;

  public auditTrailvaluePayload: AuditTrailPriorCurrentValues;
  public auditTrailPayload: AppNavigationTracking;
  public evaluationFloatPointValues: AuditTrailValueData;
  selectedLeaf: TreePill;

  public minimumNumberOfPoints: number;

  constructor(
    public http: HttpClient,
    public loggingApiService: LoggingApiService,
    public store: Store<fromRoot.State>
  ) { }

  eventCapture(key) {
    this.data = key;
  }

  /**
   * This method is used to fetch user and location details from state for current user
   */
  private async fetchUserLocationData() {
    this.store.pipe(select(fromSecurity.getCurrentUser)).pipe(
      filter((currentUser) => !!currentUser),
      takeUntil(this.destroy$)
    ).subscribe((currentUser) => {
      this.currentUserData = currentUser;
    });
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)).pipe(
      filter((labLocation) => !!labLocation),
      takeUntil(this.destroy$)
    ).subscribe((labLocation) => {
      this.currentUserLocationData = labLocation;
    });
  }

  /**
   * This method is used to prepare and return the payload details for audit trail api
   * @param payload Contains audit trail details
   * @returns Payload details which contains user and audit trail details
   */
  public prepareAuditTrailPayload(payload: AppNavigationTracking): AppNavigationTracking {
    const auditDetailsPayload: AppNavigationTracking = {
      account_id: this.currentUserData?.accountId
        ? this.currentUserData?.accountId
        : '',
      accountNumber: this.currentUserData?.accountNumber
        ? this.currentUserData?.accountNumber
        : '',
      accountName: this.currentUserLocationData?.accountName
        ? this.currentUserLocationData?.accountName
        : '',
      group_id: this.currentUserLocationData?.parentNodeId
        ? this.currentUserLocationData?.parentNodeId
        : '',
      groupName: this.currentUserLocationData?.groupName
        ? this.currentUserLocationData.groupName
        : '',
      user_id: this.currentUserData?.id
        ? this.currentUserData?.id
        : '',
      oktaId: this.currentUserData?.userOktaId
        ? this.currentUserData?.userOktaId
        : '',
      location_id: this.currentUserLocationData?.id
        ? this.currentUserLocationData?.id
        : '',
      locationName: this.currentUserLocationData?.labLocationName
        ? this.currentUserLocationData?.labLocationName
        : '',
      userRoles: this.currentUserData?.roles
        ? ((this.currentUserLocationData?.contactRoles && this.currentUserLocationData?.contactRoles.length > 1) ?
          this.currentUserData.roles.concat(this.currentUserLocationData?.contactRoles) : this.currentUserData.roles)
        : [''],
      eventDateTime: new Date(),
      localDateTime: new Date(),
      awsCorrelationId: this.currentUserData?.awsCorrelationId
        ? this.currentUserData?.awsCorrelationId
        : '',
      hasDepartments: this.currentUserLocationData?.locationSettings?.instrumentsGroupedByDept ?
        this.currentUserLocationData.locationSettings?.instrumentsGroupedByDept : false,
      auditTrail: {
        device_id: payload['auditTrail']['device_id'] ? payload['auditTrail']['device_id'] : '',
        run_id: payload['auditTrail']['run_id'] ? payload['auditTrail']['run_id'] : '',
        runDateTime: payload['auditTrail']['runDateTime'] ? payload['auditTrail']['runDateTime'] : new Date(),
        eventType: payload.auditTrail.eventType ? payload.auditTrail.eventType : '',
        action: payload.auditTrail.action ? payload.auditTrail.action : '',
        actionStatus: payload.auditTrail.actionStatus ? payload.auditTrail.actionStatus : '',
        meta_id: payload['auditTrail']['meta_id'],
        priorValue: {
          ...payload.auditTrail.priorValue
        },
        currentValue: {
          ...payload.auditTrail.currentValue
        },
        hierarchy: this.getHierarchyTree()
      },
    };
    return auditDetailsPayload;
  }

  /**
   * This method is used to fetch and prepare audit trail payload which is used in audit trail entry in db & also
   * calls audit trail api which stores the payload in db
   * @param payload contains user and audit trail details
   * @param isValidUser logged in user is authenticated or not authenticated
   */
  public async logAuditTracking(payload: AppNavigationTracking, isValidUser: boolean) {
    if (this.isUserDataFetched) {
      await this.fetchUserLocationData();
      this.isUserDataFetched = false;
    }
    this.auditTrailPayload = this.prepareAuditTrailPayload(payload);
    this.loggingApiService.appNavigationTracking(this.auditTrailPayload, isValidUser)
      .pipe(take(1))
      .subscribe();
  }

  /**
   * This function compares current and prior values for audit trail and returns the payload
   * @param currentValues current lab setting values
   * @param priorValues prior lab setting values
   * @param typeOfAction Type of operation- Add/Update/Delete
   * @returns audit trail payload
   */
  comparePriorAndCurrentValues<T>(currentValues: T, priorValues: T, typeOfAction: string, eventType: string, actionStatus: string)
    : AppNavigationTracking {
    const payload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: typeOfAction,
        actionStatus: actionStatus,
        priorValue: {},
        currentValue: {}
      }
    };

    if (typeOfAction === AuditTrackingAction.Add || typeOfAction === AuditTrackingAction.Delete) {
      payload.auditTrail.currentValue = currentValues ? currentValues : priorValues;
    } else {
      Object.keys(currentValues).forEach(i => {
        if ((i === 'panelItemIds' && !isEqual(currentValues[i], priorValues[i])) ||
          !isEqual(currentValues[i], priorValues[i])) {
          payload.auditTrail.priorValue[i] = priorValues[i];
          payload.auditTrail.currentValue[i] = currentValues[i];
        }
      });
    }
    return payload;
  }
  public currentData: Array<AnalyteLevelData> = [];
  public priorData: Array<AnalyteLevelData> = [];

  public getLevelValues(currentObject, priorObject) {
    const levelDatas = Object.keys(currentObject);
    for (const levelData of levelDatas) {
      const level = levelData;
      if (currentObject[levelData] === priorObject[levelData]) {
        if (level !== 'level') {
          delete currentObject[levelData];
          delete priorObject[levelData];
        }
        this.currentData.push(currentObject);
        this.priorData.push(priorObject);
      }
    }
  }

  public currentPriorChangeValue(current, prior) {
    this.getLevelValues(current, prior);
    for (let i = 0; i < prior.length; i++) {
      for (let j = 0; j < current.length; j++) {
        if (current[j].level === prior[i].level) {
          this.getLevelValues(current[j], prior[i]);
        }
      }
    }

    const currentDataList = new Set(this.currentData);
    const currentValues = [...currentDataList].filter(value => Object.keys(value).length !== 1);
    const priorDataList = new Set(this.priorData);
    const priorValues = [...priorDataList].filter(value => Object.keys(value).length !== 1);

    const changedValues = { 'currentValues': currentValues, 'priorValues': priorValues };
    this.currentData = [];
    this.priorData = [];
    return changedValues;
  }

  public currentPriorValueCvMeanSdDataCollectionReshaped(current, priorTotal) {
    const currentCollection = cloneDeep(current);
    let priorCollectionTotal = cloneDeep(priorTotal);
    const changedAnalytes = [];
    currentCollection.levelEvlMeanSdDataCollection.forEach((analyte) => {
      const levels = [];
      delete analyte['parentEntityId'];
      delete analyte['parentMasterLotId'];
      analyte.levelEvaluationMeanSds.forEach((i) => {
        levels.push(i.level);
      });

      changedAnalytes.push({
        entityId: analyte.entityId,
        levels: levels
      });
    });
    if (priorCollectionTotal.levelEvlMeanSdDataCollection !== null) {

      const prior = [];
      changedAnalytes.forEach((a) => {
        priorCollectionTotal.levelEvlMeanSdDataCollection.forEach((i) => {
          let arr = [];
          a.levels.forEach((levels) => {
            i.levelEvaluationMeanSds.forEach((x) => {
              if (levels === x.level) {
                arr.push(x);
              }
            })
          });

          if (a.entityId === i.entityId) {
            prior.push({
              entityId: i.entityId,
              levelEvaluationMeanSds: arr
            })
          }
        });
      });
      priorCollectionTotal['levelEvlMeanSdDataCollection'] = prior;
    } else {
      priorCollectionTotal = {};
    }
    return { current: currentCollection, prior: priorCollectionTotal };
  }


  public fetchData(): AppNavigationTracking {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: '',
        action: '',
        actionStatus: '',
        currentValue: {
        },
        hierarchy: this.getHierarchyTree(),
        priorValue: {
        },
      },
    };
    return auditNavigationPayload;
  }

  /**
    * This methoed returns hierarchy for nodetype relations
    * @returns Hierarchy tree object
    */
  public getHierarchyTree(): Hierarchy {
    this.fetchUserLocationData();
    const hierarchyData = {};
    let account;
    this.currentBranch$.pipe(takeUntil(this.destroy$)).subscribe(element => {
      this.nodeList = element;
    });

    this.selectedLeaf$.pipe(takeUntil(this.destroy$)).subscribe(element => {
      if (!!element) {
        hierarchyData['analyteId'] = element.id;
        hierarchyData['analyteName'] = element.displayName;
      }
    });

    this.nodeList.map((value) => {
      if (value.nodeType === EntityType.LabDepartment) {
        hierarchyData['departmentId'] = value.id;
        hierarchyData['departmentName'] = value['departmentName'];
      } else if (value.nodeType === EntityType.LabInstrument) {
        hierarchyData['instrumentId'] = value.id;
        hierarchyData['instrumentName'] = value.displayName;
      } else if (value.nodeType === EntityType.LabProduct) {
        hierarchyData['controlId'] = value.id;
        hierarchyData['controlName'] = value.displayName;
      } else if (value.nodeType === EntityType.LabTest) {
        hierarchyData['analyteId'] = value.id;
        hierarchyData['analyteName'] = value.displayName;
      }
    });
    account = [{
      id: this.currentUserData?.accountId ? this.currentUserData.accountId : '',
      name: this.currentUserLocationData?.accountName ? this.currentUserLocationData.accountName : '',
      groups: [{
        id: this.currentUserLocationData?.parentNodeId ? this.currentUserLocationData.parentNodeId : '',
        name: this.currentUserLocationData?.groupName ? this.currentUserLocationData.groupName : '',
        locations: [{
          id: this.currentUserLocationData?.id ? this.currentUserLocationData.id : '',
          name: this.currentUserLocationData?.labLocationName ? this.currentUserLocationData.labLocationName : '',
          departments: [{
            id: hierarchyData['departmentId'] ? hierarchyData['departmentId'] : '',
            name: hierarchyData['departmentName'] ? hierarchyData['departmentName'] : '',
          }]
        }]
      }]
    }];
    if (hierarchyData['instrumentId']) {
      account[0].groups[0].locations[0].departments[0].instrument = [{
        id: hierarchyData['instrumentId'],
        name: hierarchyData['instrumentName']
      }];

      if (hierarchyData['controlId']) {
        account[0].groups[0].locations[0].departments[0].instrument[0].controls = [{
          id: hierarchyData['controlId'],
          name: hierarchyData['controlName']
        }];

        if (hierarchyData['analyteId']) {
          account[0].groups[0].locations[0].departments[0].instrument[0].controls[0].analytes = [{
            id: hierarchyData['analyteId'],
            name: hierarchyData['analyteName']
          }];
        }
      }
    }
    return { account };
  }

  auditTrailViewData(event: string) {
    this.store.pipe(select(fromSecurity.getCurrentUser))
      .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
      .subscribe(currentUser => {
        const currentData: AppNavigationTracking = this.fetchData();
        currentData.auditTrail.eventType = event;
        currentData.auditTrail.action = AuditTrackingAction.View;
        currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success;
        this.logAuditTracking(currentData, true);
      });
  }
  /**

   * This method is used to fetch and prepare audit trail payload which is used in audit trail entry in db
   * with predefined audittrail action parameters for download action & also
   * calls audit trail api which stores the payload in db
   * @param event contains eventType
   */


  auditTrailDownloadData(event: string): void {
    this.store.pipe(select(fromSecurity.getCurrentUser))
      .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
      .subscribe(currentUser => {
        const currentData: AppNavigationTracking = this.fetchData();
        currentData.auditTrail.eventType = event;
        currentData.auditTrail.action = AuditTrackingAction.Download;
        currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success;
        this.logAuditTracking(currentData, true);
      });
  }

  compareData(inputValues: AuditTrailValueData): AppNavigationTracking {
    const priorControlSettingsValue = inputValues.prior;
    const currenControlSettingsValue = inputValues.current;
    const payload: AppNavigationTracking = {
      auditTrail: {
        eventType: '',
        action: '',
        actionStatus: '',
        currentValue: {},
        priorValue: {},
        nodeType: {}
      }
    };
    Object.entries(currenControlSettingsValue).map(([i, value]) => {
      if (JSON.stringify(currenControlSettingsValue[i]) !== JSON.stringify(priorControlSettingsValue[i])) {
        if (this.data !== 'Levels') {
          delete currenControlSettingsValue.levels;
          delete priorControlSettingsValue.levels;
        }
        if (this.data !== 'ruleSettings') {
          delete currenControlSettingsValue.ruleSettings;
          delete priorControlSettingsValue.ruleSettings;
        }
        payload.auditTrail.priorValue[i] = priorControlSettingsValue[i];
        payload.auditTrail.currentValue[i] = currenControlSettingsValue[i];
      }
    });
    return payload;
  }

  resetData() {
    this.departmentId = '';
    this.departmentName = '';
    this.instrumentId = '';
    this.instrumentName = '';
    this.analyteId = '';
    this.analyteName = '';
    this.controlId = '';
    this.controlName = '';
  }

  // region: methods/helper functions for audit trail of inactive logouts, change location logins/logouts and failed logins
  /**
   * This method is used to call audit trail api to store the failed login events to audit trail table
   */
  public async logFailedLogin() {
    this.loggingApiService.appNavigationTracking(FAILED_LOGIN_AUDIT_TRAIL_PAYLOAD, false)
      .pipe(take(1))
      .subscribe();
  }

  /**
   * This method is used to call audit trail api to store the change location login/logout events to audit trail table
   */
  public async logChangeLocation(auditTrail: AuditTrail) {
    if (auditTrail.action === AuditTrackingAction.Logout) {
      if (this.currentUserLocationData === undefined) {
        this.currentUserLocationData = new LabLocation;
      }
      auditTrail.currentValue.user_id = this.currentUserData.id;
      const payload = getChangeLocationPayload(this.currentUserData, this.currentUserLocationData, auditTrail);
      this.loggingApiService.appNavigationTracking(payload, true)
        .pipe(take(1))
        .subscribe();
      return;
    }
    let hasEmiited = false;
    combineLatest([this.getCurrentUserState$, this.getCurrentLabLocation$]).pipe(
      filter(([user, labLocation]: [AppUser, LabLocation]) =>
        !!user &&
        this.isChangeLocationComplete(labLocation, auditTrail.currentValue)),
      takeUntil(this.destroy$))
      .subscribe(([user, location]: [AppUser, LabLocation]) => {
        const payload = getChangeLocationPayload(user, location, auditTrail);
        if (!hasEmiited) {
          hasEmiited = true;
          this.loggingApiService.appNavigationTracking(payload, true)
            .pipe(take(1))
            .subscribe();
        }
      });
  }

  /*
  * the method accepts current lablocation state selected from the store and the current value of change location's audit trail object.
  * It then destructures both arguments to extract lablocation state's labLocationName property  and audit trail's locationName property.
  * Finally, it returns results of comparing both location names, i.e. if the state's location name is different from location name in
  * current value of audit trail, it return false, which is used to ensure the audit trail will be persisted via api call only when
  * the store has been updated with new location.
  */
  private isChangeLocationComplete(storeLocation: LabLocation, auditTrailCurrentValue: AuditTrailPriorCurrentValues): boolean {
    if (storeLocation === undefined) {
      storeLocation = new LabLocation;
    }
    const { labLocationName: storeLocationName } = storeLocation;
    const { locationName: expectedLocationName } = auditTrailCurrentValue;
    return storeLocationName === expectedLocationName;
  }
  // endregion

  getDataTableATHistory(deviceId: string): Observable<ReviewSummaryHistory> {
    return this.loggingApiService.getAuditTrailHistory(deviceId);
  }

  public sendAuditTrailPayload(configurationPayload: any, eventType: string, action: string,
    actionStatus: string, typeOfAction: string): void {
    const auditTrailFinalPayload = this.createAuditTrailPayload(configurationPayload, eventType, action, actionStatus, typeOfAction);
    this.logAuditTracking(auditTrailFinalPayload, true);
  }

  public createAuditTrailPayload(configurationPayload: any, eventType: string,
    action: string, actionStatus: string, typeOfAction: string): AppNavigationTracking {
    if (typeOfAction === AuditTrackingAction.Update) {
      const changeValues = this.comparePriorAndCurrentValues(configurationPayload['current'], configurationPayload['prior'], typeOfAction,
        eventType, actionStatus);
      return changeValues;
    } else if (typeOfAction === AuditTrackingAction.Add || AuditTrackingAction.Delete) {
      const auditPayload: AppNavigationTracking = {
        auditTrail: {
          eventType: eventType,
          action: action,
          actionStatus: actionStatus,
          currentValue: { ...configurationPayload },
        }
      };
      return auditPayload;
    }
  }

  /**
    * This method is used to prepare and return the new payload which includes original payload (as data)
      and audit trail payload (as audit).
    * Check return type "StartNBrRequestWithAudit" for details.
    * This is currently specific to Non Bio-rad lots related APIs.
    * @param dataPayload Contains api payload data to be bound to 'data' key in object
      @param typeOfAction Action being perfomed, from AuditTrackingAction enum
      @param eventType Type of event being logged in AT, from AuditTrackingEvent enum
      @param actionStatus API/action status - success, failure, pending, from AuditTrackingActionStatus enum
    * @returns New Payload of type 'PayLoadWithAuditData', which has 1) data: api payload data
      and 2) audit: audit trail payload data

    * Note: Modify this method to make it generic based on future requirement to include
      AT data in the existing payload, and to make it non specific to NBr.
    */

  includeATDataToPayload<T>(dataPayload: T,
    typeOfAction: string, actionStatus: string, eventType: AuditTrackingEvent): PayLoadWithAuditData<T> {
    const auditTrailPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: typeOfAction,
        actionStatus: actionStatus,
        priorValue: {},
        currentValue: {},
      }
    };
    const nBrATPayload = {
      audit: this.prepareAuditTrailPayload(auditTrailPayload),
      data: dataPayload
    };
    return nBrATPayload;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.subject.next(false);
    this.subject.unsubscribe();

    this.addLink.next(false);
    this.addLink.unsubscribe();
  }
}
