// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavigationService } from '../../navigation/navigation.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { RemapAnalyteDialogComponent } from './remap-analyte-dialog.component';
import { HttpLoaderFactory } from '../../../app.module';
import * as fromRoot from '../../../state/app.state';


describe('RemapAnalyteDialogComponent', () => {
  let component: RemapAnalyteDialogComponent;
  let fixture: ComponentFixture<RemapAnalyteDialogComponent>;
  const appState = [];

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockNavigationService = {
    sortNavItems: () => {
    },
    routeTo: (url: string) => {
      of(url);
    },
    navigateToUrl: jasmine.createSpy('navigate'),
    setStateForSelectedNode: jasmine.createSpy('setStateForSelectedNode')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RemapAnalyteDialogComponent
      ],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MatDialogRef, useValue: { close: () => { } } }
      ],
      imports: [
        MatDialogModule,
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemapAnalyteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
