// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MultipleButtonDialogComponent } from './multiple-button-dialog.component';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';

describe('MultipleButtonDialogComponent', () => {
  let component: MultipleButtonDialogComponent;
  let fixture: ComponentFixture<MultipleButtonDialogComponent>;

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleButtonDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm with onSubmit', () => {
    const mockdata = { data: '' }
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.onSubmit(mockdata);
    expect(component.dialogRef.close).toHaveBeenCalledWith(mockdata);
  });

  it('should cancel with onCancel', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });


});
