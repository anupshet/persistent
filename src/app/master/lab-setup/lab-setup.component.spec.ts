// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';

import { LabSetupComponent } from './lab-setup.component';
import { EntityTypeService } from '../../shared/services/entity-type.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { NavigationState } from '../../shared/navigation/state/reducers/navigation.reducer';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';

describe('LabSetupComponent', () => {
  let component: LabSetupComponent;
  let fixture: ComponentFixture<LabSetupComponent>;

  const navigationState: NavigationState = {
    selectedNode: null,
    selectedLeaf: null,
    currentBranch: [],
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true,
    settings: null,
    showArchivedItemsToggle: true,
    isArchiveItemsToggleOn: false,
    showAccountUserSelectorToggle: false,
    isAccountUserSelectorOn: false,
    hasNonBrLicense: false
  };

  const stub = {
    security: null,
    connectivity: null,
    router: null,
    navigation: navigationState,
    location: null,
    dataManagement: null,
    account: null
  };

  const mockEntityTypeService = {
    getNodeTypeSrcString: (val) => val
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  let entityTypeServiceInstance: EntityTypeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabSetupComponent],
      imports: [
        NgReduxModule,
        NgReduxTestingModule,
        StoreModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        TranslateService,
        HttpClient,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: EntityTypeService, useValue: mockEntityTypeService },
        { provide: Store, useValue: stub },
        provideMockStore({ initialState: stub })
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupComponent);
    component = fixture.componentInstance;
    entityTypeServiceInstance = fixture.debugElement.injector.get(EntityTypeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the LabDepartment value', () => {
    component.getLabDepartmentSource();
    spyOn(entityTypeServiceInstance, 'getNodeTypeSrcString').and.callThrough();
    entityTypeServiceInstance.getNodeTypeSrcString(EntityType.LabDepartment);
    expect(entityTypeServiceInstance.getNodeTypeSrcString).toHaveBeenCalled();
  });

});
