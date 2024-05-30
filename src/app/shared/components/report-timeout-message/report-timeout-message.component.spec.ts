// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, inject, TestBed, async   } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ReportTimeoutMessageComponent } from './report-timeout-message.component';
import { HttpLoaderFactory } from '../../../app.module';

describe('ReportTimeoutMessageComponent', () => {
  let component: ReportTimeoutMessageComponent;
  let fixture: ComponentFixture<ReportTimeoutMessageComponent>;

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTimeoutMessageComponent ],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        TranslateService,
      ],
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(ReportTimeoutMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should close the dialog with emitting true on click of OK button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const okButtonElement = fixture.debugElement.nativeElement.querySelector('.spec-ok');
    okButtonElement.click();
    expect(spy).toHaveBeenCalledWith(true);
  }));
});
