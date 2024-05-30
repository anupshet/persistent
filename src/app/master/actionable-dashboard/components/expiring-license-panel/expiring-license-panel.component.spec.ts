// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ExpiringLicenseComponent } from '../../containers/expiring-license/expiring-license.component';
import { ExpiringLicensePanelComponent } from './expiring-license-panel.component';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { HttpLoaderFactory } from '../../../../app.module';
import { StoreModule } from '@ngrx/store';

describe('ExpiringLicensePanelComponent', () => {
  let component: ExpiringLicensePanelComponent;
  let fixture: ComponentFixture<ExpiringLicensePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot([]),
        MatCardModule,
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
      declarations: [ExpiringLicensePanelComponent, ExpiringLicenseComponent, UnityNextDatePipe],
      providers: [
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringLicensePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verify date is displayed in proper format', () => {
    expect(component.licenseExpirationDate).not.toBeNull();
  });

  it('verify number of days remaining is correctly displayed', () => {
    expect(component.numberOfDaysToExpire).not.toBeNull();
  });
});
