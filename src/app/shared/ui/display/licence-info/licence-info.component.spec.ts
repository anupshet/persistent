// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import { UnityNextDatePipe } from '../../../date-time/pipes/unity-next-date.pipe';
import { LicenceInfoComponent } from './licence-info.component';
import { CoreTestHelper } from '../../../testing-helpers/core-test.helper';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { LabSetupService } from '../../../../shared/services/lab-setup.service';
import { NotificationManagerService } from '../../../../core/notification/services/notification-manager.service';
import { HttpLoaderFactory } from '../../../../app.module';
import * as fromRoot from '../../../../state/app.state';

describe('LicenceInfoComponent', () => {
  let component: LicenceInfoComponent;
  let fixture: ComponentFixture<LicenceInfoComponent>;
  let helper: CoreTestHelper<LicenceInfoComponent>;
  const initialState = {};

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };
  // Set-up
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LicenceInfoComponent, UnityNextDatePipe],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        provideMockStore({
          initialState
        }),
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: NotificationManagerService, useValue: of('') },
        { provide: LabSetupService, useValue: of('') },
        { provide: NavigationService, useValue: of('') }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    helper = new CoreTestHelper(fixture);
  });

  // Tear-down
  afterEach(() => {
    helper.tearDown(component);
  });

  // Unit tests
  describe('Unit', () => {
    it('should be created', () => {
      expect(component).toBeDefined();
    });

    it('correctly indicates whether lab is expired', () => {
      // Expired if not initialized
      expect(component.isLabExpired).toBeTruthy();

      // A future date
      component.expirationDate = new Date(Date.now() + 99999);
      expect(component.isLabExpired).toBeFalsy();

      // A past date
      component.expirationDate = new Date(2017, 1, 1, 0, 0, 0);
      expect(component.isLabExpired).toBeTruthy();
    });
  });
});
