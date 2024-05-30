// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DecimalPipe } from '@angular/common';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgRedux } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { MaterialModule } from 'br-component-library';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { SpcRulesComponent } from './spc-rules.component';
import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { defaultSpcRulesArray } from '../../../../core/config/constants/spc-rules.const';
import { SpcRulesDialogComponent } from '../spc-rules-dialog/spc-rules-dialog.component';
import { RuleDisposition } from '../../../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-disposition.enum';
import * as constants from '../../../../core/config/constants/general.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import * as fromRoot from '../../../../state/app.state';

// TO DO: Aaratrika: Need to commit the fixed test case later
describe('SpcRulesComponent', () => {
  let component: SpcRulesComponent;
  let fixture: ComponentFixture<SpcRulesComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockSpcRules = [
    { id: '2', category: '1k', k: 3, disposition: 'D' },
    { id: '1', category: '1k', k: 2, disposition: 'D' }
  ];
  const mockSpcRulesService = {
    formValue: null,
    setFormData: (args) => {
      mockSpcRulesService.formValue = args;
    },
    getRules: () => {
      return Promise.resolve(mockSpcRules);
    },
    getResetRules: (): Observable<any> => {
      return of(false);
    }
  };

  const mockTranslationService = {
    // Mock implementation of the onLangChange observable
    onLangChange: of({}),
    get: tag => of(tag),
    getTranslatedMessage: () => {
      return '{"within":"This rule detects systematic error and is applied within and across runs","across":"The rule is violated across runs when the previous value for a particular control level exceeds the"}';
    }
  };

  const settingsMock: Settings = {

    'entityIds': ['121'],
    'entityType': 5,
    'levelSettings': {
      'id': '7ff66f57-17c3-46ab-a31b-e33f2911ae56',
      'isSummary': false,
      'decimalPlaces': 1,
      'level1Used': true,
      'level2Used': true,
      'level3Used': false,
      'level4Used': false,
      'level5Used': false,
      'level6Used': false,
      'level7Used': false,
      'level8Used': false,
      'level9Used': false
    },
    'runSettings': {
      'minimumNumberOfPoints': 1212,
      'floatStatsStartDate': new Date()
    },
    'ruleSettings': [
      {
        'ruleId': 1,
        'value': 3,
        'disposition': 'W'
      },
      {
        'ruleId': 2,
        'value': 5,
        'disposition': 'R'
      }

    ],
    'hasEvaluationMeanSd': false,
    'parentEntityId': ''

  };

  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const dialogStub = { open: () => dialogRefStub };

  const dispositions = RuleDisposition;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(fromRoot.reducers)
      ],
      declarations: [SpcRulesComponent, SpcRulesDialogComponent, UnityNextNumericPipe],
      providers: [
        { provide: SpcRulesService, useValue: mockSpcRulesService },
        ConfigService,
        AppLoggerService,
        NgRedux,
        { provide: FormBuilder, useValue: formBuilder },
        { provide: TranslateService, useValue: mockTranslationService },
        { provide: MatDialog, useValue: dialogStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: PortalApiService, useValue: {} },
        DecimalPipe,
        UnityNextNumericPipe,
        { provide: Store, useValue: { navigation: { locale: {} } } },
        provideMockStore({ initialState: { navigation: { locale: {} } } } )
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SpcRulesDialogComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpcRulesComponent);
    component = fixture.componentInstance;
    component.settings = settingsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setInitForm should populate form', () => {
    component.settings = settingsMock;
    spyOn(component, 'addControl').and.callThrough();
    component.setInitForm();
    fixture.detectChanges();
    expect(component.addControl).toHaveBeenCalled();
    expect(component.rulesSettingsGetter.length).toEqual(defaultSpcRulesArray.length);
  });

  it('check reset new rules', () => {
    const index = 0;
    const changedRule = { ruleId: 1, value: 5, disposition: dispositions.disable };
    component.settings = settingsMock;
    component.setInitForm();
    fixture.detectChanges();
    component.rulesSettingsGetter.value[index] = changedRule;
    component.resetNewRules();
    expect(component.rulesSettingsGetter.value).toEqual(component.ruleSettings);
  });

  it('check radio button change method for new spc rules', () => {
    const index = 0;
    const status = dispositions.disable;
    component.settings = settingsMock;
    component.setInitForm();
    spyOn<any>(component, 'updateNewDisableStatus').and.callThrough();
    fixture.detectChanges();
    component.onRadioNewChange(index, status);
    expect(component.rulesSettingsGetter.value[index].disposition).toEqual(status);
    expect(component['updateNewDisableStatus']).toHaveBeenCalled();
  });

  it('check validation for input fields', () => {
    component.settings = settingsMock;
    component.setInitForm();
    const value = { currentTarget: { value: '6' } };
    const index = 0;
    component.onSpcRuleValueChange(value, index);
    expect(component.rules[index][constants.errorMessage]).toEqual('SPCRULESCOMPONENT.WARNINGMESSAGE');
  });

  it('Check default 2 of 2s and ks icon click return within and cross images and charts', () => {
    defaultSpcRulesArray[2].description = '{"within":"This rule detects systematic error and is applied within and across runs","across":"The rule is violated across runs when the previous value for a particular control level exceeds the"}';
    spyOn(component, 'transformMainContent').and.callThrough();
    component.onNameChange(2);
    expect(component.transformMainContent).toHaveBeenCalledWith(2);
  });

  it('Check default k-1s rule icon click return within and cross images and charts', () => {
    defaultSpcRulesArray[4].description = '{"within":"This rule detects systematic error and is applied within and across runs","across":"The rule is violated across runs when the previous value for a particular control level exceeds the"}';
    defaultSpcRulesArray[4].valueOptions = [{ 'displayText': '3-1', 'value': 0, 'isDefault': true }];
    spyOn(component, 'transformMainContent').and.callThrough();
    component.onNameChange(4);
    expect(component.transformMainContent).toHaveBeenCalledWith(4);
  });

  it('Check for the rules which returns one image and description', () => {
    defaultSpcRulesArray[0].description = 'This is a configurable warning rule that allows the user to specify the number of standard deviations to generate a warning. Range from .01 - 9.99';
    spyOn(component, 'transformMainContent').and.callThrough();
    component.onNameChange(0);
    expect(component.transformMainContent).toHaveBeenCalledWith(0);
  });

  it('Check for the Multioption rules which return both within and across image and charts', () => {
    component.selectedOption = 4;
    spyOn(component, 'transformMainContent').and.callThrough();
    component.onNameChange(4);
    expect(component.transformMainContent).toHaveBeenCalledWith(4);
  });
});
