// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogDeleteComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [
        MatDialogModule,
      ],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
     expect(component).toBeTruthy();
  });

  it('should confirm with onSubmit', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.onSubmit();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should cancel with onCancel', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should cancel with closeDialog', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
