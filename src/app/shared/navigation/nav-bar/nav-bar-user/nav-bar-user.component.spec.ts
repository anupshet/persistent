// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MaterialModule } from 'br-component-library';
import { Router } from '@angular/router';


import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { AuthenticationService } from '../../../../security/services/authentication.service';
import { NavBarUserComponent } from './nav-bar-user.component';
import { HttpLoaderFactory } from '../../../../app.module';
import { Lab } from '../../../../contracts/models/lab-setup/lab.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';


describe('NavBarUserComponent', () => {
  let component: NavBarUserComponent;
  let fixture: ComponentFixture<NavBarUserComponent>;
  const fakeDisplayname = 'Firstname Lastna...';

  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '00u6atq71s2yUBNJr2p7',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['AccountManager'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '123',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [{
        nodeType: 1
      }],
      primaryUnityLabNumbers: 'Test',
    }
  };
  const location = {
    currentLabLocation: {

      parentNode: Lab,

    },
  };
  const storeStub = {
    security: null,
    auth: authStub,
    userPreference: null,
    router: null,
    location: location,
    uiConfigState: null
  };

  const getCurrentUserStub = {
    getCurrentUser: () => {
      return {
        userOktaId: '00u6atq71s2yUBNJr2p7',
      };
    }
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { }
  };

  const mockConfirmNavigateGuard = {
    canDeactivate:     () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
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
      declarations: [NavBarUserComponent, TruncatePipe],
      providers: [
        TranslateService,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
            url = 'http://localhost:4200';
          }
        },
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarUserComponent);
    component = fixture.componentInstance;
    component.displayName = fakeDisplayname;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verify the displayed username length', () => {
    component.displayName = fakeDisplayname;
    fixture.detectChanges();
    expect(component.displayName.length).toBeGreaterThanOrEqual(1);
  });

  it('should be String value for input displayName', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    component.displayName = fakeDisplayname;
    fixture.detectChanges();
    expect(compiled.querySelector('#navBarUserNameText .mat-small').textContent).toContain(component.displayName);
  });
  it('should output the logout eventemiiter after clicking on logout', () => {
    // GIVEN - Create a test argument and spy on the emitting output variable.
    spyOn(component.logOut, 'emit');

    // WHEN - Call a method that will trigger the output variable to emit.
    component.logOutOfApp();

    // THEN - Assert that the output variable has emitted correctly with the test argument
    expect(component.logOut.emit).toHaveBeenCalled();
  });

});
