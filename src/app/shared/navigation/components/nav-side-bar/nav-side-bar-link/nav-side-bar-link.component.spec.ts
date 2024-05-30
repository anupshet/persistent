// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { NavSideBarLinkComponent } from './nav-side-bar-link.component';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NavigationService } from '../../../navigation.service';

describe('NavSideBarLinkComponent', () => {
  let component: NavSideBarLinkComponent;
  let fixture: ComponentFixture<NavSideBarLinkComponent>;
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: () => {}
  };

  const mockNavigationServiceNavBarLink = {
    setSelectedNotificationId: jasmine.createSpy('')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        NavSideBarLinkComponent,
        TruncatePipe
      ],
      providers: [
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationServiceNavBarLink },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(NavSideBarLinkComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSideBarLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check node item selected', () => {
    const spy = spyOn(component.selectedNode, 'emit');
    const sidenavLink = fixture.debugElement.nativeElement.querySelector('.spec_sidenav_link');
    sidenavLink.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(mockNavigationServiceNavBarLink.setSelectedNotificationId);
  });
});
