// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { InformativeMessageComponent } from './informative-message.component';

describe('InformativeMessageComponent', () => {
  let component: InformativeMessageComponent;
  let fixture: ComponentFixture<InformativeMessageComponent>;

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformativeMessageComponent],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
      ],
      imports: [
        MatDialogModule
      ]
    })
      .compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(InformativeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
