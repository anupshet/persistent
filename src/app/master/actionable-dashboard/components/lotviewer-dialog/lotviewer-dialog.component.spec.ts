// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import * as fromRoot from '../../../../state/app.state';
import { LotviewerDialogComponent } from './lotviewer-dialog.component';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../../../app.module';


describe('LotviewerDialogComponent', () => {
  let component: LotviewerDialogComponent;
  let fixture: ComponentFixture<LotviewerDialogComponent>;
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LotviewerDialogComponent],
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
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotviewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
