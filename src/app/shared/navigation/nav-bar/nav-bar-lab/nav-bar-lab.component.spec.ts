 // © 2022 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, fakeAsync, inject, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { MaterialModule } from 'br-component-library';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { NavigationService } from '../../navigation.service';
import { NavHierarchyComponent } from './../../nav-header/nav-hierarchy/nav-hierarchy.component';
import { NavBarLabComponent } from './nav-bar-lab.component';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';

describe('NavBarLabComponent', () => {
  let component: NavBarLabComponent;
  // tslint:disable-next-line: prefer-const
  let hierarchyFixture: ComponentFixture<NavHierarchyComponent>;
  let fixture: ComponentFixture<NavBarLabComponent>;
  const initialState = {};
  const State = [];
  const mockLoggingApiService = {
    auditTracking: () => { }
  };
  let store: MockStore<any>;
  const fakeNavTopBarSinglelabLocations = [{
    displayName: 'Vishwajit\'s Lab',
    labLocationName: 'Vishwajit\'s Lab',
    locationTimeZone: 'America/New_York',
    locationOffset: '-05:00:00',
    locationDayLightSaving: '00:00:00',
    labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
    labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
      firstName: 'Vishwajit',
      middleName: '',
      lastName: 'Shinde',
      name: 'Vishwajit Shinde',
      email: 'vishwajit_shinde+dev20@bio-rad.com',
      phone: '',
      id: '05c1be86-ad8d-4937-a834-2369bec4604e',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: '21 Technology Drive',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: '21 Technology Drive',
      suite: '',
      city: '',
      state: '',
      country: 'US',
      zipCode: '',
      id: '1d196092-3052-41fa-9110-b95aae0a048e',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
    },
    accountSettings: null,
    hasOwnAccountSettings: false,
    id: '0d66767b-612c-4254-9eed-3a7ab393029f',
    parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
    parentNode: null,
    nodeType: 2,
    children: []
  }];
  const fakeNavTopBarlabLocations = [
    {
      displayName: 'Vishwajit\'s Lab',
      labLocationName: 'Vishwajit\'s Lab',
      locationTimeZone: 'America/New_York',
      locationOffset: '-05:00:00',
      locationDayLightSaving: '00:00:00',
      labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e',
      labLocationContact: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      labLocationAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        suite: '',
        city: '',
        state: '',
        country: 'US',
        zipCode: '',
        id: '1d196092-3052-41fa-9110-b95aae0a048e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '0d66767b-612c-4254-9eed-3a7ab393029f',
      parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
      parentNode: null,
      nodeType: 2,
      children: []
    },
    {
      displayName: 'BC Technology',
      labLocationName: 'BC Technology',
      locationTimeZone: 'America/New_York',
      locationOffset: '-05:00:00',
      locationDayLightSaving: '00:00:00',
      labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e',
      labLocationContact: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      labLocationAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        suite: '',
        city: '',
        state: '',
        country: 'US',
        zipCode: '',
        id: '1d196092-3052-41fa-9110-b95aae0a048e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '0d66767b-612c-4254-9eed-3a7ab393029f',
      parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
      parentNode: null,
      nodeType: 2,
      children: []
    }
  ];

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  const mockConfirmNavigateGuard = {
    canDeactivate:     () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
  };

  function clickByLocations(selector: string) {
    const debugElement = fixture.debugElement.query(By.css(selector));
    const el: HTMLElement = debugElement.nativeElement;
    el.click();
    fixture.detectChanges();
  }

  function getBreadcrumText() {
    const hierarchycompiled = hierarchyFixture.debugElement.nativeElement;
    return hierarchycompiled.querySelector('.breadcrumb-item').textContent;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MaterialModule,
        RouterTestingModule,
        StoreModule.forRoot(State)],
      declarations: [
        NavBarLabComponent,
        TruncatePipe],
      providers: [
        {
          provide: LoggingApiService, useValue: mockLoggingApiService
        },
        provideMockStore({ initialState }),
        { provide: NavigationService, useValue: of('') },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NavBarLabComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarLabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the location name in breadcrum value when top bar location is clicked', () => {
    fakeAsync(() => {
      clickByLocations('ul li.mat-menu-item');
      expect(getBreadcrumText()).toBe(fakeNavTopBarlabLocations[0].labLocationName);
    });
  });

  it('should change the location time zone in breadcrum value when top bar location is clicked', () => {
    fakeAsync(() => {
      clickByLocations('ul li.mat-menu-item');
      expect(getBreadcrumText()).toBe(fakeNavTopBarlabLocations[0].locationTimeZone);
    });
  });

  it('should change the location offset in breadcrum value when top bar location is clicked', () => {
    fakeAsync(() => {
      clickByLocations('ul li.mat-menu-item');
      expect(getBreadcrumText()).toBe(fakeNavTopBarlabLocations[0].locationOffset);
    });
  });

  it('should change the locationDayLightSaving in breadcrum value when top bar location is clicked', () => {
    fakeAsync(() => {
      clickByLocations('ul li.mat-menu-item');
      expect(getBreadcrumText()).toBe(fakeNavTopBarlabLocations[0].locationDayLightSaving);
    });
  });

  it('should display icon & labName for lab having single locations', () => {
    fakeAsync(() => {
      component.assignedGroups = fakeNavTopBarSinglelabLocations;
      fixture.detectChanges();

      const iconForSingleLocation = fixture.debugElement.nativeElement.querySelector('.spec-location');
      expect(iconForSingleLocation).toBeDefined();

      const LabName = fixture.debugElement.nativeElement.querySelector('.spec_labName');
      expect(LabName).toBeDefined();
    });
  });

  it('should display icon with dashed lines & labName  for lab having multi-locations', () => {
    fakeAsync(() => {
      component.assignedGroups = fakeNavTopBarlabLocations;
      fixture.detectChanges();

      const iconForMultipleLocation = fixture.debugElement.nativeElement.querySelector('.spec-locations');
      expect(iconForMultipleLocation).toBeDefined();

      const LabName = fixture.debugElement.nativeElement.querySelector('.spec_labName');
      expect(LabName).toBeDefined();
    });
  });

  it('should display list of locations that belong to the same group on clicking labname', () => {
    fakeAsync(() => {
      component.assignedGroups = fakeNavTopBarlabLocations;
      fixture.detectChanges();

      const iconForMultipleLocation = fixture.debugElement.nativeElement.querySelector('.spec-locations');
      expect(iconForMultipleLocation).toBeDefined();

      const LabName = fixture.debugElement.nativeElement.querySelector('.spec_labName');
      LabName.click();
      fixture.detectChanges();

      const LocationNames = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item');
      expect(LocationNames.length).toBeGreaterThan(1);
    });
  });

  it('should load location name on the header, onclicking location ', () => {
    fakeAsync(() => {
      component.assignedGroups = fakeNavTopBarlabLocations;
      fixture.detectChanges();

      const iconForSingleLocation = fixture.debugElement.nativeElement.querySelector('.spec-locations');
      expect(iconForSingleLocation).toBeDefined();

      let LabName = fixture.debugElement.nativeElement.querySelector('.spec_labName');
      LabName.click();
      fixture.detectChanges();

      const LocationNames = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item');
      LocationNames[1].click();
      const locationName = LocationNames[1].getText();
      fixture.detectChanges();

      LabName = fixture.debugElement.nativeElement.querySelector('.spec_labName');
      expect(LabName.getText()).toEqual(locationName);
    });
  });
});

