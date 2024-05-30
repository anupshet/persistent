// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, inject, async   } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateSettingsDialogComponent } from './update-settings-dialog.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('UpdateSettingsDialogComponent', () => {
  let component: UpdateSettingsDialogComponent;
  let fixture: ComponentFixture<UpdateSettingsDialogComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSettingsDialogComponent],
      imports: [
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
      providers: [{ provide: MatDialogRef, useValue: { close: () => { } } },
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      TranslateService,]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close when click on delete confirm button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    component.onConfirmClick();
    expect(spy).toHaveBeenCalled();
  })
  );

});
