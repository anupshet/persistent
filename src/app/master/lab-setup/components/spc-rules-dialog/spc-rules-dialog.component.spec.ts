// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { SpcRulesDialogComponent } from './spc-rules-dialog.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('SpcRulesDialogComponent', () => {
  let component: SpcRulesDialogComponent;
  let fixture: ComponentFixture<SpcRulesDialogComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // AngularMaterialModule,
        MaterialModule,
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
      declarations: [SpcRulesDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpcRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
