// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as fromRoot from '../../../state/app.state';
import { NavSecondaryNavComponent } from './nav-secondary-nav.component';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../app.module';

describe('NavSecondaryNavComponent', () => {
  let component: NavSecondaryNavComponent;
  let fixture: ComponentFixture<NavSecondaryNavComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        StoreModule.forRoot(fromRoot.reducers),
        RouterTestingModule,
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
      declarations: [ NavSecondaryNavComponent],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService,
        HttpClient
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSecondaryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
