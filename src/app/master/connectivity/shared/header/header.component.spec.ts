// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActivatedRouteStub } from '../../../../../testing/activated-route-stub';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { HeaderComponent } from './header.component';
import { HeaderService } from './header.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

const headerServiceMock = {
  navState: of(''),
  setDialogComponent: () => {}
};

const mockBrPermissionsService = {
  hasAccess: () =>  true,
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const initialState = {
    hasInstructions: false
  };
  const State = [];
  let store: MockStore<any>;

  const appNavigationTrackingServiceMock = jasmine.createSpyObj('AppNavigationTrackingService', ['logAuditTracking']);
  const navigationServiceMock = jasmine.createSpyObj('NavigationService', ['routeToConnectivityStatus']);

  const activatedRouteStub = new ActivatedRouteStub(null, { id: '1' });

  const connectivityState = {
    hasInstructions: true
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatDialogModule,
        StoreModule.forRoot(State),
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        },
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: NavigationService, useValue: of('') },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: MatDialogRef, useValue: { closeAll: () => { } } },
        { provide: Store, useValue: connectivityState },
        provideMockStore({ initialState }),
        TranslateService,
        ErrorLoggerService,
        { provide: AppNavigationTrackingService, useValue: appNavigationTrackingServiceMock },
        { provide: NavigationService, useValue: navigationServiceMock },
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(connectivityState);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active link as configurations', () => {
    const spy = spyOn(component, 'setActiveLink').and.callThrough();
    component.hasInstructions = false;
    component.setActiveLinks();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('configurations');
  });

  it('should set active link as upload', () => {
    const spy = spyOn(component, 'setActiveLink').and.callThrough();
    component.hasInstructions = true;
    component.setActiveLinks();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith('upload');
    });
  });

  it('should call sendAuditTrailPayload method', () => {
    const auditPayload = {
      auditTrail: {
        eventType: AuditTrackingEvent.FileStatus,
        action: AuditTrackingAction.View,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {},
        priorValue: {}
      }
    };
    component.routeToConnectivityStatus();

    expect(appNavigationTrackingServiceMock['logAuditTracking']).toHaveBeenCalledWith(auditPayload, true);


  });
});
