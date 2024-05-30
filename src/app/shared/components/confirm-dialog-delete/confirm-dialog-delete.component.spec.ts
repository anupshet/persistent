// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ConfirmDialogDeleteComponent } from './confirm-dialog-delete.component';

describe('ConfirmDialogDeleteComponent', () => {
  let component: ConfirmDialogDeleteComponent;
  let fixture: ComponentFixture<ConfirmDialogDeleteComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogDeleteComponent],
      providers: [{ provide: ErrorLoggerService, useValue: mockErrorLoggerService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
