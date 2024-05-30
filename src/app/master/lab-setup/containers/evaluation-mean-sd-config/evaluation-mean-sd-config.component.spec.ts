// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { orderBy } from 'lodash';

import { BrCore, BrInfoTooltip, MaterialModule } from 'br-component-library';
import { UnityRestrictDecimalPlacesDirective } from '../../../../shared/directives/unity-restrict-decimal-places.directive';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { NavSideBarService } from '../../../../shared/navigation/services/nav-side-bar.service';
import { EvaluationMeanSdComponent } from '../../components/evaluation-mean-sd/evaluation-mean-sd.component';
import { LevelEvaluationMeanSdComponent } from '../../components/level-evaluation-mean-sd/level-evaluation-mean-sd.component';
import {
  entity, currentSelectedProductNode as currentSelectedNode, mockTranslationService, navigationState,
  evaluationMeanSdData, mockInstrumentState, requestedFloatingStatsData, floatingStatsData,
  mockAnalyteEntity, submitAnalyteEvaluationMeanSdData, mockInputDataForAllAnalytes, mockSettingsData
} from '../../mock-data/evaluation-mean-sd-mock-data';
import * as actions from '../../state/actions';
import { EvaluationMeanSdConfigComponent } from './evaluation-mean-sd-config.component';
import { asc, minimumNumberPoints, sortOrder } from '../../../../core/config/constants/general.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from 'src/app/shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('EvaluationMeanSdConfigComponent', () => {
  let component: EvaluationMeanSdConfigComponent;
  let fixture: ComponentFixture<EvaluationMeanSdConfigComponent>;
  let dispatchSpy;
  let store: MockStore<any>;
  let de: DebugElement;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockPortalApiService = {
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { }
  };

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EvaluationMeanSdConfigComponent,
        EvaluationMeanSdComponent,
        LevelEvaluationMeanSdComponent,
        UnityRestrictDecimalPlacesDirective
      ],
      imports: [
        StoreModule.forRoot([]),
        MaterialModule,
        BrInfoTooltip,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        PerfectScrollbarModule,
        BrCore,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        NavSideBarService,
        ChangeTrackerService,
        { provide: MAT_DIALOG_DATA, useValue: { entity: entity } },
        { provide: MatDialogRef, useValue: {} },
        { provide: Store, useValue: navigationState },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },

        provideMockStore({}),
        TranslateService,
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(EvaluationMeanSdConfigComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.getArchiveToggle$ = of(false);
    component.labConfigSettings$ = of(mockSettingsData);
    component.currentSelectedBranch$ = of([mockInstrumentState]);
    component.currentSelectedNode$ = of(currentSelectedNode);
    component.analyteFloatingStatisticsData$ = of(evaluationMeanSdData.analyteFloatingStatisticsGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch analyteIds for storing state.', () => {
    component.evaluationMeanSdData$ = of(evaluationMeanSdData.entityEvaluationMeanSdGroup);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    spyOn(component, 'loadAnalyteEvaluationMeanSdData').and.callThrough();
    const analyteIds = ['b93f9cb4-a155-4e2a-9c91-bc0c668fa82f', 'edf81b9b-ce27-4372-b1ed-a5bc2a881c37', '392764a3-e81c-46dc-92a2-093e21825e9e', 'f9cc87ed-0565-4868-bcde-3fed17547e18'];
    component.loadAnalyteEvaluationMeanSdData(analyteIds);
    store.dispatch(actions.EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdList({ analyteIds }));
    expect(component.loadAnalyteEvaluationMeanSdData).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should get input for lower level components when there is no data in state.', () => {
    component.evaluationMeanSdData$ = of([]);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    spyOn(component, 'loadAnalyteEvaluationMeanSdData').and.callThrough();
    const analyteIds = ['b93f9cb4-a155-4e2a-9c91-bc0c668fa82f', 'edf81b9b-ce27-4372-b1ed-a5bc2a881c37', '392764a3-e81c-46dc-92a2-093e21825e9e', 'f9cc87ed-0565-4868-bcde-3fed17547e18'];
    component.loadAnalyteEvaluationMeanSdData(analyteIds);
    store.dispatch(actions.EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdList({ analyteIds }));
    expect(component.loadAnalyteEvaluationMeanSdData).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(component.analyteEvaluationMeanSdGroup).toBeTruthy();
  });

  it('should dispatch requestedFloatingStats Data.', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    component.loadAnalyteFloatingStatisticsData(requestedFloatingStatsData);
    store.dispatch(actions.EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsList(floatingStatsData));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should submit data for post and put calls', () => {
    const evalMeanSdComp = de.query(By.directive(EvaluationMeanSdComponent));
    const cmp = evalMeanSdComp.componentInstance;
    component.inputDataForAllAnalytes = mockInputDataForAllAnalytes;
    spyOn(component, 'submitEvaluationMeanSdGroupData').and.callThrough();
    cmp.entityEvaluationMeanSdGroup.emit(submitAnalyteEvaluationMeanSdData);
    expect(component.submitEvaluationMeanSdGroupData).toHaveBeenCalledWith(submitAnalyteEvaluationMeanSdData);
  });

  it('should submit rundata on submit', () => {
    const evalMeanSdComp = de.query(By.directive(EvaluationMeanSdComponent));
    const cmp = evalMeanSdComp.componentInstance;
    spyOn(component, 'submitFloatingPointAndSettingsData').and.callThrough();
    cmp.entityFloatingPoint.emit(minimumNumberPoints.toString());
    expect(component.submitFloatingPointAndSettingsData).toHaveBeenCalled();
  });

  it('should save settings data on submit', () => {
    component.settingsDataFromParentNode = mockSettingsData;
    const minimumNumberPointsToString = minimumNumberPoints.toString();
    const evalMeanSdComp = de.query(By.directive(EvaluationMeanSdComponent));
    const cmp = evalMeanSdComp.componentInstance;
    spyOn(component, 'submitFloatingPointAndSettingsData').and.callThrough();
    cmp.entityFloatingPoint.emit(minimumNumberPointsToString);
    expect(component.submitFloatingPointAndSettingsData).toHaveBeenCalledWith(minimumNumberPointsToString);
  });

  it('should verify if analyte is an entity and analyte list populates only one analyte', () => {
    component.entity = mockAnalyteEntity;
    component.ngOnInit();
    expect(component.analyteList.length).toEqual(1);
    expect(component.analyteList[0].id).toEqual(mockAnalyteEntity.id);
  });

  it('should show sorted items on evaluation mean sd popup', () => {
    const sortedEntities = orderBy(entity.children, [sortOrder, (child) => child.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
    fixture.detectChanges();
    const evaluationMeanSdChildElement = fixture.debugElement.query(By.directive(EvaluationMeanSdComponent));
    const componentEvaluationMeanSdChildElement = evaluationMeanSdChildElement.componentInstance;
    fixture.whenStable().then(() => {
      expect(componentEvaluationMeanSdChildElement.displayAnalyteTitleList[0].entityId).not.toEqual(entity.children[0].id);
      // Expect sequence of array items equal, checking ids are same on sequencial index location.
      expect(componentEvaluationMeanSdChildElement.displayAnalyteTitleList[0].entityId).toEqual(sortedEntities[0].id);
      expect(componentEvaluationMeanSdChildElement.displayAnalyteTitleList[1].entityId).toEqual(sortedEntities[1].id);
      expect(componentEvaluationMeanSdChildElement.displayAnalyteTitleList[2].entityId).toEqual(sortedEntities[2].id);
      expect(componentEvaluationMeanSdChildElement.displayAnalyteTitleList[3].entityId).toEqual(sortedEntities[3].id);
    });
  });

});
