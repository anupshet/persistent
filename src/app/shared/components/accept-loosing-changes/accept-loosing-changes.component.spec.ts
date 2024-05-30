// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { AcceptLoosingChangesComponent } from './accept-loosing-changes.component';
import { HttpLoaderFactory } from '../../../app.module';

describe('AcceptLoosingChangesComponent', () => {
  let component: AcceptLoosingChangesComponent;
  let fixture: ComponentFixture<AcceptLoosingChangesComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptLoosingChangesComponent],
      providers: [{ provide: ErrorLoggerService, useValue: mockErrorLoggerService },
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
    fixture = TestBed.createComponent(AcceptLoosingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
