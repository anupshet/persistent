// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrInfoTooltip, BrSelect } from 'br-component-library';
import { LabSetupDefaultContainerComponent } from './lab-setup-default-container.component';
import { LabSetupDefaultComponent } from '../../components/lab-setup-default/lab-setup-default.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import * as fromRoot from '../../state';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

describe('LabSetupDefaultContainerComponent', () => {
  let component: LabSetupDefaultContainerComponent;
  let fixture: ComponentFixture<LabSetupDefaultContainerComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockNavigationService = {};
  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LabSetupDefaultContainerComponent,
        LabSetupDefaultComponent,
        LabSetupHeaderComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrInfoTooltip,
        BrSelect,
        MatRadioModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
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
      providers: [AppLoggerService,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock }]
    })
      .compileComponents();
  }));

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupDefaultContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
