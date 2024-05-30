// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigService } from '../../../../core/config/config.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { PastReportsTableComponent } from './past-reports-table.component';
import { IconService } from '../../../../shared/icons/icons.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('PastReportsTableComponent', () => {
  let component: PastReportsTableComponent;
  let fixture: ComponentFixture<PastReportsTableComponent>;
  const mockMatDialog = jasmine.createSpyObj(['open', 'close', 'closeAll']);
  const mockConfigService = {
    getConfig: () => {
      return { 'portalUrl': '' };
    }
  };
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastReportsTableComponent ],
      imports: [NgxPaginationModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
      providers: [
        TranslateService,
        { provide: IconService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
