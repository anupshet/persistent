// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DEFAULT_LANGUAGE, TranslateLoader,
  TranslateModule,
  USE_DEFAULT_LANG, USE_EXTEND, USE_STORE
} from '@ngx-translate/core';

import * as fromRoot from '../../../state/app.state';
import { LocalizationService } from '../../navigation/services/localizaton.service';
import { NavigationState } from '../../navigation/state/reducers/navigation.reducer';
import { ApiService } from '../../api/api.service';
import { ConfigService } from '../../../core/config/config.service';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { LanguageDialogComponent } from './language-dialog.component';

describe('LanguageDialogComponent', () => {
  let component: LanguageDialogComponent;
  let fixture: ComponentFixture<LanguageDialogComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let store: MockStore<any>;

  const selectedNode = {
    displayName: 'Archi300',
    instrumentId: '1254',
    instrumentCustomName: 'Archi300',
    instrumentSerial: '123',
    instrumentInfo: {
      id: 1254,
      name: 'ARCHITECT c16000',
      manufacturerId: '1',
      manufacturerName: 'Abbott'
    },
    levelSettings: {
      levelEntityId: 'A914E73C1F124BEF909053B1BEB2ED19',
      levelEntityName: 'LabInstrument',
      parentLevelEntityId: '0',
      parentLevelEntityName: 'ROOT',
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [
        {
          id: '1',
          category: '1k',
          k: '3',
          disposition: 'N'
        },
        {
          id: '1',
          category: '1k',
          k: '2',
          disposition: 'N'
        }
      ],
      levels: [{
        levelInUse: true,
        decimalPlace: 3
      }]
    },
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    parentNode: null,
    nodeType: 4,
    children: []
  };
  const navigationState: NavigationState = {
    selectedNode: selectedNode,
    selectedLeaf: null,
    currentBranch: [],
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    hasNonBrLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true,
    settings: null,
    showArchivedItemsToggle: true,
    isArchiveItemsToggleOn: false,
    showAccountUserSelectorToggle: false,
    isAccountUserSelectorOn: false,
    locale: {
      'country': 'US',
      'lcid': 'en-US',
      'value': 'en',
      'name': 'English',
      'numeric': '98,765.23',
      'numericValue': 0,
      'time': '4:24 PM',
      'timeValue': 0,
      'date': 'Jan 30, 1963',
    }
  };

  const mockStoreData = {
    'country': 'US',
    'lcid': 'en-US',
    'value': 'en',
    'name': 'English',
    'numeric': '98,765.23',
    'numericValue': 0,
    'time': '4:24 PM',
    'timeValue': 0,
    'date': 'Jan 30, 1963',
  };

  const mockLocalizationService = {
    getLanguageMapping: () => { },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageDialogComponent],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot(),
      ],
      providers: [{
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
        deps: [HttpClient]
      },
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: { close: () => { } } },
      { provide: USE_DEFAULT_LANG, useValue: {} },
      { provide: USE_STORE, useValue: {} },
      { provide: USE_EXTEND, useValue: {} },
      { provide: DEFAULT_LANGUAGE, useValue: {} },
      { provide: FormBuilder, useValue: formBuilder },
      { provide: LocalizationService, mockLocalizationService },
        ApiService,
        ConfigService,
        AppLoggerService,
      provideMockStore({ initialState: { navigation: navigationState } }),

      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(LanguageDialogComponent);
    component = fixture.componentInstance;
    component.navigationGetLocale$ = of(mockStoreData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load updated values for numeric, date, and time', () => {
    component.updatedLangauge = [
      {
        numberFormat: 'newNumericFormat', dateFormat: 'newDateFormat',
        timeFormat: 'newTimeFormat'
      }
    ];
    component.loadUpdatedValues();
    expect(component.form.get('numeric').value).toEqual('newNumericFormat');
    expect(component.form.get('date').value).toEqual('newDateFormat');
    expect(component.form.get('time').value).toEqual('newTimeFormat');
  });

  it('should cancel with onCancel', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
