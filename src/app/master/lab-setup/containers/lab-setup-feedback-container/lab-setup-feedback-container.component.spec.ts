// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

import * as fromRoot from '../../state';
import { LabSetupFeedbackContainerComponent } from './lab-setup-feedback-container.component';
import { LabSetupFeedbackComponent } from '../../components/lab-setup-feedback/lab-setup-feedback.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('LabSetupFeedbackContainerComponent', () => {
  let component: LabSetupFeedbackContainerComponent;
  let fixture: ComponentFixture<LabSetupFeedbackContainerComponent>;

  const mockNavigationService = {
    routeToMapping: () => { }
  };

  const mockPortalApiService = {
    saveLabsetupDefaults: () => null
  };


  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockMatDialog = {
    open: () => {},
    close: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LabSetupFeedbackContainerComponent,
        LabSetupFeedbackComponent,
        LabSetupHeaderComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        RouterTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
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
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MatDialog, useValue: mockMatDialog },
        AppLoggerService,
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupFeedbackContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
