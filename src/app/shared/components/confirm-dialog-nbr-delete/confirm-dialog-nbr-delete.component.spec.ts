// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ConfirmNbrControlDeleteComponent } from './confirm-dialog-nbr-delete.component';

describe('ConfirmDialogDeleteComponent', () => {
  let component: ConfirmNbrControlDeleteComponent;
  let fixture: ComponentFixture<ConfirmNbrControlDeleteComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmNbrControlDeleteComponent],
      providers: [{ provide: ErrorLoggerService, useValue: mockErrorLoggerService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmNbrControlDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
