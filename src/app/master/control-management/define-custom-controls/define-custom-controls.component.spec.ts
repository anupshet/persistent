// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { By } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DefineCustomControls } from './define-custom-controls.component';
import { ControlManagementViewMode } from '../shared/models/control-management.enum';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../app.module';
import { PortalApiService } from '../../../../app/shared/api/portalApi.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe("DefineCustomControls", () => {
  let component: DefineCustomControls;
  let fixture: ComponentFixture<DefineCustomControls>;
  const appState = [];
  const testValidationData = [
    {
      id: 1,
      name: 'test control 1',
      manufacturerId: 'm1',
      manufacturerName: 'test manufacturer 1',
      matrixId: 1,
      lots: [
        {
          id: 1,
          productId: 1,
          productName: 'test product 1',
          lotNumber: '12345',
          expirationDate: new Date(),
          levelInfo: [1, 2],
          accountId: '0edb0653-f262-48ac-a886-cab545a5db1c'
        }],
      accountId: '0edb0653-f262-48ac-a886-cab545a5db1c',
      anyLabLotTests : false
    }
  ];

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.NonBRLotManagement];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockCodeListService = {
    putNonBrControlDefinition: () => observableOf(),
    getNonBrControlDefinitions: () => observableOf()
  };

  const mockLabSetupService = {
    deleteNonBrControlDefinition: () => true,
  };

  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy()
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(appState),
        MatDialogModule,
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
      declarations: [DefineCustomControls],
      providers: [
        { provide: CodelistApiService, useValue: mockCodeListService },
        { provide: PortalApiService, useValue: mockLabSetupService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { } },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: MessageSnackBarService, useValue: {} },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService

      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DefineCustomControls);
    component = fixture.componentInstance;
    component.showForm = false;
    component.viewType = ControlManagementViewMode.Define;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show define-own-control form on click of Define custom control', () => {
    component.showDefineControlForm();
    expect(component.showForm).toBe(true);
  });

  it('should delete button be hidden', () => {
    component.controlCards = [{
      id: 1,
      name: 'test control 1',
      manufacturerId: 'm1',
      manufacturerName: 'test manufacturer 1',
      matrixId: 1,
      lots: [
        {
          id: 1,
          productId: 1,
          productName: 'test product 1',
          lotNumber: '12345',
          expirationDate: new Date(),
          levelInfo: [1, 2],
          accountId: '0edb0653-f262-48ac-a886-cab545a5db1c'
        }],
      accountId: '0edb0653-f262-48ac-a886-cab545a5db1c',
      anyLabLotTests: false
    }];
    fixture.detectChanges();
    const additionalInstrumentsDropdown = fixture.debugElement.query(By.css('.ic-delete'));
    expect(additionalInstrumentsDropdown).toBeDefined();
  });
  it('should delete button be visible', () => {
    component.controlCards = [{
      id: 1,
      name: 'test control 1',
      manufacturerId: 'm1',
      manufacturerName: 'test manufacturer 1',
      matrixId: 1,
      lots: [
        {
          id: 1,
          productId: 1,
          productName: 'test product 1',
          lotNumber: '12345',
          expirationDate: new Date(),
          levelInfo: [1, 2],
          accountId: '0edb0653-f262-48ac-a886-cab545a5db1c'
        }],
      accountId: '0edb0653-f262-48ac-a886-cab545a5db1c',
      anyLabLotTests: true
    }];
    fixture.detectChanges();
    const additionalInstrumentsDropdown = fixture.debugElement.query(By.css('.ic-delete'));
    expect(additionalInstrumentsDropdown).toBeNull();
  });
});


